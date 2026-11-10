import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { CodingExercise, TestCase } from '../../types/content'
import type { DiffLine, RunTestsResult, TestOutcome } from '../../execution/types'
import { runTests } from '../../execution/api'
import { useExecution } from '../../execution/ExecutionProvider'
import { useProgress } from '../../state/ProgressProvider'
import { JAVA_LESSON_THEME } from '../../lib/monacoSetup'
import { CodeBlock } from '../ui/CodeBlock'
import { RichText } from '../ui/RichText'

const KIND_LABEL: Record<TestCase['kind'], string> = {
  normal: '正常',
  edge: '边界',
  tricky: '易错',
}

const EXCEPTION_HINTS: [RegExp, string][] = [
  [/NumberFormatException/, '输入字符串不能转换成数字：检查输入格式，或先用 hasNextInt() 判断。'],
  [/ArithmeticException/, '算术错误，最常见的原因是整数除以 0。'],
  [/ArrayIndexOutOfBoundsException/, '数组下标越界：合法下标是 0 到 length - 1。'],
  [/NullPointerException/, '对 null 引用调用了方法或访问了字段：先确认对象已经被创建。'],
  [/StringIndexOutOfBoundsException/, '字符串下标越界：检查 substring / charAt 的边界。'],
  [/InputMismatchException/, 'Scanner 读到的内容与期望类型不匹配：先确认输入格式。'],
  [/NoSuchElementException/, '输入已经耗尽，却继续调用 next / nextInt：检查循环条件与输入组数。'],
  [/NegativeArraySizeException/, '数组长度不能为负数。'],
  [/ClassCastException/, '类型转换失败：运行时对象的真实类型与强转目标不兼容。'],
  [/StackOverflowError/, '栈溢出：通常是递归缺少终止条件。'],
  [/OutOfMemoryError/, '内存不足：检查是否创建了超大数组或无限增长的结构。'],
]

function explainException(stderr: string): string {
  for (const [pattern, hint] of EXCEPTION_HINTS) {
    if (pattern.test(stderr)) return hint
  }
  return '运行时抛出异常：先看异常类型，再看堆栈里第一条属于自己代码的位置。'
}

function firstStackLines(stderr: string, count = 3): string {
  return stderr
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line, index) => line.length > 0 || index === 0)
    .slice(0, count)
    .join('\n')
}

function DiffView({ diff }: { diff: DiffLine[] }) {
  return (
    <div className="diff">
      <div className="diff__head">
        <span>期望</span>
        <span>实际</span>
      </div>
      {diff.map((line, index) => (
        <div className={`diff__row diff__row--${line.kind}`} key={index}>
          <span>{line.expected ?? ''}</span>
          <span>{line.actual ?? ''}</span>
        </div>
      ))}
    </div>
  )
}

function TestResultItem({ outcome }: { outcome: TestOutcome }) {
  const statusLabel = {
    pass: '通过',
    fail: '输出不符',
    'runtime-error': '运行时异常',
    timeout: '超时',
  }[outcome.status]
  const badgeClass =
    outcome.status === 'pass' ? 'test-badge--pass' : outcome.status === 'fail' ? 'test-badge--fail' : ''

  return (
    <li className="test-item">
      <div className="test-item__head">
        <span className="test-item__label">{outcome.test.label}</span>
        <span className={`test-badge ${badgeClass}`}>{statusLabel}</span>
        <span className="test-kind">{KIND_LABEL[outcome.test.kind]}</span>
        {outcome.run.truncated ? <span className="test-kind">输出已截断</span> : null}
      </div>
      {outcome.status === 'fail' ? (
        <div className="test-detail">
          <DiffView diff={outcome.diff} />
        </div>
      ) : null}
      {outcome.status === 'runtime-error' ? (
        <div className="test-detail error-box">
          <div className="error-box__title">运行时异常</div>
          <pre>{firstStackLines(outcome.run.stderr) || '进程以非零状态退出，但没有输出堆栈。'}</pre>
          <div className="error-box__advice">{explainException(outcome.run.stderr)}</div>
        </div>
      ) : null}
      {outcome.status === 'timeout' ? (
        <p className="test-detail small muted">运行超过 5 秒已被终止：检查死循环、递归或阻塞式输入。</p>
      ) : null}
      {outcome.status === 'pass' && outcome.actual ? (
        <div className="code-output test-detail">
          <span className="muted">输出：</span>
          {outcome.actual}
        </div>
      ) : null}
    </li>
  )
}

export function CodingStepView({
  exercise,
  onComplete,
}: {
  exercise: CodingExercise
  onComplete: () => void
}) {
  const { progress, setDraft } = useProgress()
  const { mode, recheck } = useExecution()
  const savedDraft = progress.codingDrafts[exercise.exerciseId]
  const [code, setCode] = useState(savedDraft ?? exercise.skeleton)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<RunTestsResult | null>(null)
  const [showOffline, setShowOffline] = useState(false)
  const [hintsShown, setHintsShown] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const staticIssues = useMemo(() => {
    const issues: string[] = []
    if (!/\bclass\s+[A-Za-z_$][\w$]*/.test(code)) issues.push('没有找到类声明。')
    const hasMain = /\bstatic\s+void\s+main\s*\(\s*(?:final\s+)?(?:String\s*\[\s*\]\s*[A-Za-z_$][\w$]*|String\s+[A-Za-z_$][\w$]*\s*\[\s*\]|String\s*\.\.\.\s*[A-Za-z_$][\w$]*)\s*\)/.test(
      code,
    )
    if (!hasMain) issues.push('没有找到 public static void main(String[] args) 签名。')
    return issues
  }, [code])

  const handleChange = (value: string | undefined) => {
    const next = value ?? ''
    setCode(next)
    setDraft(exercise.exerciseId, next)
  }

  const handleRun = async () => {
    if (mode !== 'local') {
      setShowOffline(true)
      setResult(null)
      return
    }
    setRunning(true)
    setShowOffline(false)
    setResult(null)
    const testsResult = await runTests(code, exercise.tests)
    setResult(testsResult)
    setRunning(false)
    if (!testsResult.error && testsResult.compile.exitCode === 0 && !testsResult.compile.timedOut) {
      const allPass = testsResult.outcomes.length > 0 && testsResult.outcomes.every((item) => item.status === 'pass')
      if (allPass) onComplete()
    }
  }

  const resetCode = () => {
    if (code !== exercise.skeleton && !window.confirm('恢复初始代码会覆盖当前草稿，继续吗？')) return
    setCode(exercise.skeleton)
    setDraft(exercise.exerciseId, exercise.skeleton)
    setResult(null)
  }

  const compileFailed = result && !result.error && (result.compile.exitCode !== 0 || result.compile.timedOut)
  const passCount = result?.outcomes.filter((item) => item.status === 'pass').length ?? 0
  const totalTests = result?.outcomes.length ?? 0
  const allPass = totalTests > 0 && passCount === totalTests && !result?.error && !compileFailed

  return (
    <div>
      <div className="coding-task">
        <div>
          <span className="coding-task__label">任务</span>
          <p className="step-copy">
            <RichText text={exercise.task} />
          </p>
        </div>
        <div>
          <span className="coding-task__label">输入 / 输出 / 约束</span>
          <div className="coding-io">{exercise.io}</div>
        </div>
      </div>

      <div className="editor-shell">
        <div className="editor-shell__bar">
          <span>Main.java</span>
          <span>Java 15 兼容 · 行号 · 括号匹配</span>
        </div>
        <Editor
          height="clamp(520px, 68vh, 760px)"
          language="java"
          value={code}
          onChange={handleChange}
          theme={JAVA_LESSON_THEME}
          loading={<div className="editor-loading">正在加载编辑器…</div>}
          options={{
            fontSize: 15,
            lineHeight: 24,
            fontFamily: "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            matchBrackets: 'always',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            bracketPairColorization: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 14, bottom: 14 },
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            guides: { indentation: false, bracketPairs: false },
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            ariaLabel: 'Java 代码编辑器',
          }}
        />
      </div>

      <div className="coding-actions">
        <button type="button" className="btn btn--primary" onClick={handleRun} disabled={running || mode === 'checking'}>
          {running ? '运行中…' : mode === 'checking' ? '检测执行环境…' : mode === 'local' ? '运行测试' : '查看离线检查'}
        </button>
        <button type="button" className="btn btn--secondary btn--small" onClick={resetCode}>
          恢复初始代码
        </button>
        <span className="coding-actions__spacer" />
        <span className="small muted">{exercise.tests.length} 组测试</span>
      </div>

      {showOffline || mode === 'offline' ? (
        <div className="offline-result">
          <div className="offline-result__title">当前离线模式：代码不会真正执行</div>
          未连接到本地执行服务。启动 <code>npm run dev</code> 后点击下面的按钮重新检测；也可以先对照测试用例自查。
          <div className="static-check">
            静态检查：
            {staticIssues.length === 0 ? ' 已找到类声明与 main 方法签名。' : ` ${staticIssues.join(' ')}`}
          </div>
          <button type="button" className="btn btn--secondary btn--small offline-result__btn" onClick={recheck}>
            重新检测执行服务
          </button>
          <ul className="test-cases-preview">
            {exercise.tests.map((test) => (
              <li className="test-case-preview" key={test.label}>
                <span className="test-case-preview__label">
                  {test.label} · {KIND_LABEL[test.kind]}
                </span>
                <pre>输入：{test.stdin ? test.stdin.replace(/\n$/, '') : '(无)'}</pre>
                <pre>期望输出：{test.expectedStdout}</pre>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result ? (
        <div className="result-panel" aria-live="polite">
          {result.error ? (
            <div className="error-box">
              <div className="error-box__title">无法执行</div>
              <pre>{result.error}</pre>
              <div className="error-box__advice">确认后端已启动（npm run dev），然后点击「查看离线检查 / 重新检测」。</div>
            </div>
          ) : null}

          {compileFailed ? (
            <div className="error-box">
              <div className="error-box__title">{result?.compile.timedOut ? '编译超时' : '编译错误'}</div>
              <pre>{result?.compile.stderr || result?.compile.stdout || 'javac 没有输出详细信息。'}</pre>
              <div className="error-box__advice">先修复第一条编译错误，再运行；javac 的第一条通常是根因。</div>
            </div>
          ) : null}

          {!result.error && !compileFailed && result.outcomes.length > 0 ? (
            <>
              <div className="result-summary">
                {allPass ? (
                  <span className="result-summary__ok">全部 {totalTests} 组通过，本题完成。</span>
                ) : (
                  <span className="result-summary__bad">
                    通过 {passCount} / {totalTests}
                  </span>
                )}
                <span className="small muted">逐组运行；输出已忽略行尾空白与末尾空行。</span>
              </div>
              <ul className="test-list">
                {result.outcomes.map((outcome, index) => (
                  <TestResultItem outcome={outcome} key={`${outcome.test.label}-${index}`} />
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="hint-panel">
        <div className="disclosure">
          {exercise.hints.map((_, index) => (
            <button
              type="button"
              className="btn btn--secondary btn--small"
              key={index}
              onClick={() => setHintsShown((current) => Math.max(current, index + 1))}
              disabled={index > hintsShown}
            >
              提示 {index + 1}
            </button>
          ))}
        </div>
        {exercise.hints.slice(0, hintsShown).map((hint, index) => (
          <div className="hint-item" key={index}>
            <span className="hint-item__label">提示 {index + 1}</span>
            <RichText text={hint} />
          </div>
        ))}
      </div>

      <div className="answer-panel">
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={() => setShowAnswer((current) => !current)}
          aria-expanded={showAnswer}
        >
          {showAnswer ? '隐藏参考答案' : '查看参考答案'}
        </button>
        {showAnswer ? (
          <>
            <CodeBlock code={exercise.answer} label="参考答案" />
            <p className="answer-note">
              <RichText text={exercise.answerWhy} />
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}
