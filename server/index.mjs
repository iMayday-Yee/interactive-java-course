import express from 'express'
import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, rm, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = process.env.HOST || '127.0.0.1'
const PORT = Number(process.env.PORT || 3001)
const COMPILE_TIMEOUT_MS = 5000
const RUN_TIMEOUT_MS = 5000
const MAX_OUTPUT_BYTES = 64 * 1024
const MAX_CODE_BYTES = 100 * 1024
const MAX_CONCURRENCY = 4
const MAX_CASES = 20

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

let activeJobs = 0
const waiters = []
async function withSlot(fn) {
  if (activeJobs >= MAX_CONCURRENCY) {
    await new Promise((resolve) => waiters.push(resolve))
  }
  activeJobs += 1
  try {
    return await fn()
  } finally {
    activeJobs -= 1
    const next = waiters.shift()
    if (next) next()
  }
}

function killTree(child) {
  try {
    if (child.pid) process.kill(-child.pid, 'SIGKILL')
  } catch {
    try {
      child.kill('SIGKILL')
    } catch {
      /* already gone */
    }
  }
}

function runProcess(command, args, cwd, stdin, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        PATH: process.env.PATH,
        LANG: 'C.UTF-8',
        LC_ALL: 'C.UTF-8',
        HOME: cwd,
        TMPDIR: cwd,
      },
    })

    const stdoutChunks = []
    const stderrChunks = []
    let stdoutBytes = 0
    let stderrBytes = 0
    let truncated = false
    let timedOut = false
    let settled = false

    const timer = setTimeout(() => {
      timedOut = true
      killTree(child)
    }, timeoutMs)

    const collect = (chunks, chunk, stream) => {
      const used = stream === 'stdout' ? stdoutBytes : stderrBytes
      const remaining = MAX_OUTPUT_BYTES - used
      if (remaining <= 0) {
        truncated = true
        killTree(child)
        return
      }
      if (chunk.length > remaining) {
        chunks.push(chunk.subarray(0, remaining))
        if (stream === 'stdout') stdoutBytes += remaining
        else stderrBytes += remaining
        truncated = true
        killTree(child)
        return
      }
      chunks.push(chunk)
      if (stream === 'stdout') stdoutBytes += chunk.length
      else stderrBytes += chunk.length
    }

    child.stdout.on('data', (chunk) => collect(stdoutChunks, chunk, 'stdout'))
    child.stderr.on('data', (chunk) => collect(stderrChunks, chunk, 'stderr'))
    // 程序可能在读取输入前就退出；忽略 EPIPE，避免影响执行服务。
    child.stdin.on('error', () => undefined)

    child.on('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: `${Buffer.concat(stderrChunks).toString('utf8')}${error.message}`,
        exitCode: -1,
        signal: null,
        timedOut: false,
        truncated,
      })
    })

    child.on('close', (exitCode, signal) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
        exitCode: exitCode ?? -1,
        signal,
        timedOut,
        truncated,
      })
    })

    if (typeof stdin === 'string' && stdin.length > 0) child.stdin.end(stdin)
    else child.stdin.end()
  })
}

function extractClassName(code) {
  const publicType = code.match(
    /\bpublic\s+(?:final\s+|abstract\s+|sealed\s+|non-sealed\s+)*(?:class|record|enum)\s+([A-Za-z_$][\w$]*)/,
  )
  if (publicType) return publicType[1]
  const anyType = code.match(/\b(?:class|record|enum)\s+([A-Za-z_$][\w$]*)/)
  return anyType ? anyType[1] : 'Main'
}

function validateCode(code) {
  if (typeof code !== 'string' || code.trim() === '') return '代码不能为空。'
  if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) return '代码过长（上限 100KB）。'
  if (/^\s*package\s+[\w.]+\s*;/m.test(code)) {
    return '练习代码中请不要写 package 声明；所有练习都按默认包编译。'
  }
  return null
}

async function prepare(code) {
  const className = extractClassName(code)
  const workDir = await mkdtemp(path.join(tmpdir(), 'java-lesson-'))
  const outDir = path.join(workDir, 'out')
  const sourcePath = path.join(workDir, `${className}.java`)
  await writeFile(sourcePath, code, 'utf8')
  const compile = await runProcess(
    'javac',
    ['-encoding', 'UTF-8', '-d', outDir, sourcePath],
    workDir,
    null,
    COMPILE_TIMEOUT_MS,
  )
  return { workDir, outDir, className, compile }
}

async function cleanup(workDir) {
  try {
    await rm(workDir, { recursive: true, force: true })
  } catch {
    /* best effort */
  }
}

function publicProcessResult(result) {
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
    timedOut: result.timedOut,
    truncated: result.truncated,
  }
}

async function executeCode(code, stdin, args) {
  const prepared = await prepare(code)
  try {
    if (prepared.compile.exitCode !== 0 || prepared.compile.timedOut) {
      return { compile: publicProcessResult(prepared.compile), run: null }
    }
    const run = await runProcess(
      'java',
      ['-Xmx256m', '-Xss1m', '-Dfile.encoding=UTF-8', '-cp', prepared.outDir, prepared.className, ...args],
      prepared.workDir,
      stdin,
      RUN_TIMEOUT_MS,
    )
    return { compile: publicProcessResult(prepared.compile), run: publicProcessResult(run) }
  } finally {
    await cleanup(prepared.workDir)
  }
}

async function executeBatch(code, cases) {
  const prepared = await prepare(code)
  try {
    const compile = publicProcessResult(prepared.compile)
    if (prepared.compile.exitCode !== 0 || prepared.compile.timedOut) {
      return { compile, results: [] }
    }
    const results = []
    for (const testCase of cases) {
      const run = await runProcess(
        'java',
        [
          '-Xmx256m',
          '-Xss1m',
          '-Dfile.encoding=UTF-8',
          '-cp',
          prepared.outDir,
          prepared.className,
          ...(Array.isArray(testCase.args) ? testCase.args.map(String) : []),
        ],
        prepared.workDir,
        typeof testCase.stdin === 'string' ? testCase.stdin : '',
        RUN_TIMEOUT_MS,
      )
      results.push(publicProcessResult(run))
    }
    return { compile, results }
  } finally {
    await cleanup(prepared.workDir)
  }
}

const app = express()
app.use(express.json({ limit: '256kb' }))

let toolchain = { ok: false, javaVersion: null, javacVersion: null }
async function probeToolchain() {
  const java = await runProcess('java', ['-version'], tmpdir(), null, 3000)
  const javac = await runProcess('javac', ['-version'], tmpdir(), null, 3000)
  const versionOf = (result) => {
    const text = `${result.stderr}\n${result.stdout}`
    const version = text.match(/version\s+"?([\w.]+)"?/) ?? text.match(/\bjava(?:c)?\s+([\w.]+)/)
    return version ? version[1] : null
  }
  toolchain = {
    ok: java.exitCode === 0 && javac.exitCode === 0,
    javaVersion: versionOf(java),
    javacVersion: versionOf(javac),
  }
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: toolchain.ok,
    mode: 'local',
    javaVersion: toolchain.javaVersion,
    javacVersion: toolchain.javacVersion,
  })
})

app.post('/api/execute', async (req, res) => {
  const { code, stdin, args } = req.body ?? {}
  const error = validateCode(code)
  if (error) {
    res.status(400).json({ error })
    return
  }
  try {
    const result = await withSlot(() =>
      executeCode(code, typeof stdin === 'string' ? stdin : '', Array.isArray(args) ? args.map(String) : []),
    )
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: `执行失败：${err?.message || '未知错误'}` })
  }
})

app.post('/api/execute-batch', async (req, res) => {
  const { code, cases } = req.body ?? {}
  const error = validateCode(code)
  if (error) {
    res.status(400).json({ error })
    return
  }
  if (!Array.isArray(cases) || cases.length === 0 || cases.length > MAX_CASES) {
    res.status(400).json({ error: `cases 必须是 1~${MAX_CASES} 个测试用例。` })
    return
  }
  try {
    const result = await withSlot(() => executeBatch(code, cases))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: `执行失败：${err?.message || '未知错误'}` })
  }
})

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ error: '请求体过大。' })
    return
  }
  res.status(500).json({ error: '服务器内部错误。' })
})

const serveStatic = process.argv.includes('--static')
if (serveStatic) {
  try {
    await access(distDir)
    app.use(express.static(distDir))
    app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
  } catch {
    console.error('未找到 dist/，请先运行 npm run build。')
    process.exit(1)
  }
}

await probeToolchain()
app.listen(PORT, HOST, () => {
  const status = toolchain.ok ? `JDK ${toolchain.javaVersion}` : 'JDK 不可用'
  console.log(`[api] http://${HOST}:${PORT}  (${status})`)
  if (serveStatic) console.log(`[web] 静态站点由 ${distDir} 提供`)
})
