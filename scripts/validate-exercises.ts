import { course } from '../src/content/index'
import type { CodingExercise } from '../src/types/content'

const API_BASE = process.env.API_BASE ?? 'http://127.0.0.1:3001'

type ProcessResult = {
  stdout: string
  stderr: string
  exitCode: number
  timedOut: boolean
  truncated: boolean
}

type BatchResponse = {
  compile: ProcessResult
  results: ProcessResult[]
  error?: string
}

type ExerciseEntry = {
  lessonId: string
  exercise: CodingExercise
}

function normalize(value: string): string {
  return value
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
}

async function health(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`)
    const data = (await response.json()) as { ok?: boolean; javaVersion?: string }
    console.log(`[api] ${API_BASE} · JDK ${data.javaVersion ?? '未知'}`)
    return Boolean(data.ok)
  } catch {
    console.error(`[api] 无法连接 ${API_BASE}，请先运行 npm run dev:api`)
    return false
  }
}

async function main() {
  if (!(await health())) {
    process.exitCode = 1
    return
  }

  const entries: ExerciseEntry[] = []
  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      for (const step of lesson.steps) {
        if (step.type === 'coding') {
          entries.push({ lessonId: lesson.id, exercise: step.content })
        }
      }
    }
  }

  let failures = 0

  for (const { lessonId, exercise } of entries) {
    const response = await fetch(`${API_BASE}/api/execute-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: exercise.answer,
        cases: exercise.tests.map((test) => ({ stdin: test.stdin ?? '', args: test.args ?? [] })),
      }),
    })

    const data = (await response.json().catch(() => null)) as BatchResponse | null
    if (!response.ok || !data) {
      console.error(`✗ ${lessonId}/${exercise.exerciseId}：HTTP ${response.status}`)
      failures += 1
      continue
    }
    if (data.error) {
      console.error(`✗ ${lessonId}/${exercise.exerciseId}：${data.error}`)
      failures += 1
      continue
    }
    if (data.compile.exitCode !== 0 || data.compile.timedOut) {
      console.error(`✗ ${lessonId}/${exercise.exerciseId}：参考答案编译失败`)
      console.error(data.compile.stderr || data.compile.stdout)
      failures += 1
      continue
    }

    let exerciseFailed = false
    exercise.tests.forEach((test, index) => {
      const run = data.results[index]
      if (!run) {
        console.error(`  ✗ ${test.label}：没有运行结果`)
        exerciseFailed = true
        return
      }
      const expected = normalize(test.expectedStdout)
      const actual = normalize(run.stdout)
      if (run.timedOut) {
        console.error(`  ✗ ${test.label}：运行超时`)
        exerciseFailed = true
      } else if (run.exitCode !== 0) {
        console.error(`  ✗ ${test.label}：运行时异常`)
        console.error(run.stderr.split('\n').slice(0, 3).join('\n'))
        exerciseFailed = true
      } else if (expected !== actual) {
        console.error(`  ✗ ${test.label}：输出不符`)
        console.error(`    期望：${JSON.stringify(expected)}`)
        console.error(`    实际：${JSON.stringify(actual)}`)
        exerciseFailed = true
      }
    })

    if (exerciseFailed) {
      failures += 1
    } else {
      console.log(`✓ ${lessonId}/${exercise.exerciseId}：${exercise.tests.length} 组通过`)
    }
  }

  console.log(`\n[exercises] ${entries.length - failures} / ${entries.length} 个练习通过`)
  if (failures > 0) process.exitCode = 1
}

await main()
