import { useState } from 'react'
import type { QuizStep } from '../../types/content'
import { useProgress } from '../../state/ProgressProvider'
import { RichText } from '../ui/RichText'

type QuizChildProps = {
  stepId: string
  onComplete: () => void
  previouslyCorrect: boolean
}

function Feedback({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <div
      className={`quiz__feedback ${correct ? 'quiz__feedback--correct' : 'quiz__feedback--wrong'}`}
      aria-live="polite"
    >
      <strong>{correct ? '答对了。' : '还不对。'}</strong>
      <RichText text={explanation} />
    </div>
  )
}

function ChoiceQuiz({
  content,
  stepId,
  onComplete,
  previouslyCorrect,
}: QuizChildProps & { content: Extract<QuizStep['content'], { kind: 'choice' }> }) {
  const { setQuizResult } = useProgress()
  const [selected, setSelected] = useState<number | null>(previouslyCorrect ? content.answerIndex : null)
  const [submitted, setSubmitted] = useState(previouslyCorrect)
  const correct = submitted && selected === content.answerIndex

  const submit = () => {
    if (selected === null) return
    const isCorrect = selected === content.answerIndex
    setSubmitted(true)
    setQuizResult(stepId, isCorrect)
    if (isCorrect) onComplete()
  }

  return (
    <div>
      <ul className="quiz__options">
        {content.options.map((option, index) => {
          let modifier = ''
          if (submitted) {
            if (index === content.answerIndex) modifier = ' quiz-option--correct'
            else if (index === selected) modifier = ' quiz-option--wrong'
          } else if (index === selected) {
            modifier = ' quiz-option--selected'
          }
          return (
            <li key={index}>
              <button
                type="button"
                className={`quiz-option${modifier}`}
                onClick={() => {
                  if (!submitted) setSelected(index)
                }}
                aria-pressed={selected === index}
                disabled={submitted}
              >
                <span className="quiz-option__key">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="quiz__actions">
        {!submitted ? (
          <button type="button" className="btn btn--primary" onClick={submit} disabled={selected === null}>
            提交答案
          </button>
        ) : null}
        {submitted && !correct ? (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setSubmitted(false)
              setSelected(null)
            }}
          >
            再试一次
          </button>
        ) : null}
        {submitted && correct ? <span className="quiz__status">本题已完成</span> : null}
      </div>
      {submitted ? <Feedback correct={correct} explanation={content.explanation} /> : null}
    </div>
  )
}

function JudgeQuiz({
  content,
  stepId,
  onComplete,
  previouslyCorrect,
}: QuizChildProps & { content: Extract<QuizStep['content'], { kind: 'judge' }> }) {
  const { setQuizResult } = useProgress()
  const [selected, setSelected] = useState<boolean | null>(previouslyCorrect ? content.answer : null)
  const [submitted, setSubmitted] = useState(previouslyCorrect)
  const correct = submitted && selected === content.answer

  const submit = (value: boolean) => {
    setSelected(value)
    const isCorrect = value === content.answer
    setSubmitted(true)
    setQuizResult(stepId, isCorrect)
    if (isCorrect) onComplete()
  }

  return (
    <div>
      <p className="step-copy">
        <RichText text={content.statement} />
      </p>
      <div className="quiz__actions">
        <button
          type="button"
          className={`quiz-option${submitted && content.answer === true ? ' quiz-option--correct' : ''}${
            submitted && selected === true && content.answer === false ? ' quiz-option--wrong' : ''
          }`}
          onClick={() => submit(true)}
          disabled={submitted}
        >
          正确
        </button>
        <button
          type="button"
          className={`quiz-option${submitted && content.answer === false ? ' quiz-option--correct' : ''}${
            submitted && selected === true && content.answer === false ? ' quiz-option--wrong' : ''
          }`}
          onClick={() => submit(false)}
          disabled={submitted}
        >
          错误
        </button>
      </div>
      {submitted && !correct ? (
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            setSubmitted(false)
            setSelected(null)
          }}
        >
          再试一次
        </button>
      ) : null}
      {submitted && correct ? <span className="quiz__status">本题已完成</span> : null}
      {submitted ? <Feedback correct={correct} explanation={content.explanation} /> : null}
    </div>
  )
}

function FillQuiz({
  content,
  stepId,
  onComplete,
  previouslyCorrect,
}: QuizChildProps & { content: Extract<QuizStep['content'], { kind: 'fill' }> }) {
  const { setQuizResult } = useProgress()
  const [value, setValue] = useState(previouslyCorrect ? content.answers[0] : '')
  const [submitted, setSubmitted] = useState(previouslyCorrect)
  const correct = submitted && content.answers.some((answer) => answer.trim() === value.trim())

  const submit = () => {
    const isCorrect = content.answers.some((answer) => answer.trim() === value.trim())
    setSubmitted(true)
    setQuizResult(stepId, isCorrect)
    if (isCorrect) onComplete()
  }

  return (
    <div>
      <p className="step-copy">
        <RichText text={content.question} />
      </p>
      <div className="quiz-fill">
        {content.before ? <span>{content.before}</span> : null}
        <input
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            if (submitted) setSubmitted(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submit()
          }}
          placeholder={content.placeholder}
          aria-label="填空答案"
          disabled={submitted}
        />
        {content.after ? <span>{content.after}</span> : null}
      </div>
      <div className="quiz__actions">
        {!submitted ? (
          <button type="button" className="btn btn--primary" onClick={submit} disabled={!value.trim()}>
            提交答案
          </button>
        ) : null}
        {submitted && !correct ? (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setSubmitted(false)
              setValue('')
            }}
          >
            再试一次
          </button>
        ) : null}
        {submitted && correct ? <span className="quiz__status">本题已完成</span> : null}
      </div>
      {submitted ? <Feedback correct={correct} explanation={content.explanation} /> : null}
    </div>
  )
}

function shuffledIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  if (indices.length > 1 && indices.every((value, index) => value === index)) {
    ;[indices[0], indices[1]] = [indices[1], indices[0]]
  }
  return indices
}

function OrderQuiz({
  content,
  stepId,
  onComplete,
  previouslyCorrect,
}: QuizChildProps & { content: Extract<QuizStep['content'], { kind: 'order' }> }) {
  const { setQuizResult } = useProgress()
  const correctOrder = content.lines.map((_, index) => index)
  const [order, setOrder] = useState<number[]>(() =>
    previouslyCorrect ? [...correctOrder] : shuffledIndices(content.lines.length),
  )
  const [submitted, setSubmitted] = useState(previouslyCorrect)
  const [dragging, setDragging] = useState<number | null>(null)
  const correct = submitted && order.every((value, index) => value === index)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return
    setOrder((current) => {
      const next = [...current]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const submit = () => {
    const isCorrect = order.every((value, index) => value === index)
    setSubmitted(true)
    setQuizResult(stepId, isCorrect)
    if (isCorrect) onComplete()
  }

  return (
    <div>
      <p className="step-copy">
        <RichText text={content.question} />
      </p>
      <ol className="quiz-order">
        {order.map((lineIndex, position) => (
          <li
            className={`quiz-order__item${dragging === position ? ' quiz-order__item--dragging' : ''}`}
            key={lineIndex}
            draggable={!submitted}
            onDragStart={() => setDragging(position)}
            onDragEnd={() => setDragging(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragging !== null) move(dragging, position)
              setDragging(null)
            }}
          >
            <span className="quiz-order__handle" aria-hidden="true">
              ⠿
            </span>
            <span className="quiz-order__code">{content.lines[lineIndex]}</span>
            <span className="quiz-order__moves">
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(position, position - 1)}
                disabled={submitted || position === 0}
                aria-label={`将第 ${position + 1} 行上移`}
              >
                ↑
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => move(position, position + 1)}
                disabled={submitted || position === order.length - 1}
                aria-label={`将第 ${position + 1} 行下移`}
              >
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="quiz__actions">
        {!submitted ? (
          <>
            <button type="button" className="btn btn--primary" onClick={submit}>
              提交顺序
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setOrder(shuffledIndices(content.lines.length))}
            >
              重新打乱
            </button>
          </>
        ) : null}
        {submitted && !correct ? (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              setSubmitted(false)
              setOrder(shuffledIndices(content.lines.length))
            }}
          >
            再试一次
          </button>
        ) : null}
        {submitted && correct ? <span className="quiz__status">本题已完成</span> : null}
      </div>
      {submitted ? <Feedback correct={correct} explanation={content.explanation} /> : null}
    </div>
  )
}

export function QuizStepView({ step, onComplete }: { step: QuizStep; onComplete: () => void }) {
  const { progress } = useProgress()
  const previouslyCorrect = progress.quizResults[step.id] === true
  const content = step.content
  const shared = { stepId: step.id, onComplete, previouslyCorrect }

  return (
    <div className="quiz">
      {content.kind !== 'judge' ? (
        <p className="quiz__question">
          <RichText text={content.question} />
        </p>
      ) : null}
      {content.kind === 'choice' ? <ChoiceQuiz content={content} {...shared} /> : null}
      {content.kind === 'judge' ? <JudgeQuiz content={content} {...shared} /> : null}
      {content.kind === 'fill' ? <FillQuiz content={content} {...shared} /> : null}
      {content.kind === 'order' ? <OrderQuiz content={content} {...shared} /> : null}
    </div>
  )
}
