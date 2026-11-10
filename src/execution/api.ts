import type { TestCase } from '../types/content'
import type {
  BatchResponse,
  DiffLine,
  ExecuteResponse,
  ProcessResult,
  RunTests,
  TestOutcome,
} from './types'

const API_BASE = '/api'

export type Health = {
  ok: boolean
  mode: 'local'
  javaVersion: string | null
  javacVersion: string | null
}

export async function checkHealth(signal?: AbortSignal): Promise<Health> {
  const response = await fetch(`${API_BASE}/health`, { signal })
  if (!response.ok) throw new Error(`健康检查失败：HTTP ${response.status}`)
  return (await response.json()) as Health
}

export async function execute(
  code: string,
  stdin = '',
  args: string[] = [],
  signal?: AbortSignal,
): Promise<ExecuteResponse> {
  const response = await fetch(`${API_BASE}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, stdin, args }),
    signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    return {
      compile: emptyProcessResult(),
      run: null,
      error: data?.error ?? `执行服务返回 HTTP ${response.status}`,
    }
  }
  return data as ExecuteResponse
}

export async function executeBatch(
  code: string,
  tests: TestCase[],
  signal?: AbortSignal,
): Promise<BatchResponse> {
  const response = await fetch(`${API_BASE}/execute-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      cases: tests.map((test) => ({ stdin: test.stdin ?? '', args: test.args ?? [] })),
    }),
    signal,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    return {
      compile: emptyProcessResult(),
      results: [],
      error: data?.error ?? `执行服务返回 HTTP ${response.status}`,
    }
  }
  return data as BatchResponse
}

function emptyProcessResult(): ProcessResult {
  return { stdout: '', stderr: '', exitCode: -1, timedOut: false, truncated: false }
}

function normalizeOutput(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
}

export function normalizeExpected(value: string): string {
  return normalizeOutput(value)
}

export function outputsMatch(expected: string, actual: string): boolean {
  return normalizeOutput(expected) === normalizeOutput(actual)
}

const MAX_DIFF_LINES = 200

export function buildDiff(expected: string, actual: string): DiffLine[] {
  const expectedLines = normalizeOutput(expected).split('\n')
  const actualLines = normalizeOutput(actual).split('\n')
  const rows = Math.min(Math.max(expectedLines.length, actualLines.length), MAX_DIFF_LINES)
  const diff: DiffLine[] = []
  for (let index = 0; index < rows; index += 1) {
    const expectedLine = expectedLines[index]
    const actualLine = actualLines[index]
    if (expectedLine !== undefined && actualLine !== undefined) {
      diff.push({
        kind: expectedLine === actualLine ? 'same' : 'changed',
        expected: expectedLine,
        actual: actualLine,
      })
    } else if (expectedLine !== undefined) {
      diff.push({ kind: 'expected', expected: expectedLine })
    } else {
      diff.push({ kind: 'actual', actual: actualLine })
    }
  }
  return diff
}

function toOutcome(test: TestCase, run: ProcessResult): TestOutcome {
  const expected = normalizeOutput(test.expectedStdout)
  const actual = normalizeOutput(run.stdout)
  let status: TestOutcome['status']
  if (run.timedOut) status = 'timeout'
  else if (run.exitCode !== 0) status = 'runtime-error'
  else if (expected === actual) status = 'pass'
  else status = 'fail'
  return {
    test,
    run,
    status,
    expected,
    actual,
    diff: buildDiff(test.expectedStdout, run.stdout),
  }
}

export const runTests: RunTests = async (code, tests) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 40000)
  try {
    const response = await executeBatch(code, tests, controller.signal)
    if (response.error) {
      return { compile: response.compile, outcomes: [], error: response.error }
    }
    return {
      compile: response.compile,
      outcomes: tests.map((test, index) => toOutcome(test, response.results[index] ?? emptyProcessResult())),
    }
  } catch (error) {
    return {
      compile: emptyProcessResult(),
      outcomes: [],
      error: error instanceof Error ? `无法连接执行服务：${error.message}` : '无法连接执行服务',
    }
  } finally {
    clearTimeout(timer)
  }
}
