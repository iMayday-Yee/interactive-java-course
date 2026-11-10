import type { TestCase } from '../types/content'

export type ProcessResult = {
  stdout: string
  stderr: string
  exitCode: number
  timedOut: boolean
  truncated: boolean
}

export type ExecuteResponse = {
  compile: ProcessResult
  run: ProcessResult | null
  error?: string
}

export type BatchResponse = {
  compile: ProcessResult
  results: ProcessResult[]
  error?: string
}

export type TestStatus = 'pass' | 'fail' | 'runtime-error' | 'timeout'

export type DiffLine = {
  kind: 'same' | 'expected' | 'actual' | 'changed'
  expected?: string
  actual?: string
}

export type TestOutcome = {
  test: TestCase
  run: ProcessResult
  status: TestStatus
  expected: string
  actual: string
  diff: DiffLine[]
}

export type RunTestsResult = {
  compile: ProcessResult
  outcomes: TestOutcome[]
  error?: string
}

export type RunTests = (code: string, tests: TestCase[]) => Promise<RunTestsResult>
