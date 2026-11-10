import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StepRenderer } from '../components/steps/StepRenderer'
import {
  STEP_TYPE_LABEL,
  findChapter,
  findLesson,
  firstIncompleteStepIndex,
  lessonNeighbors,
} from '../content'
import { useProgress } from '../state/ProgressProvider'
import { chapterStyle } from '../lib/chapterColors'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function LessonPage() {
  const { lessonId, stepIndex: stepParam } = useParams()
  const navigate = useNavigate()
  const { progress, markStepComplete, markStepSkipped, clearStepSkipped, saveLocation } = useProgress()

  const lesson = lessonId ? findLesson(lessonId) : undefined
  const parsed = stepParam === undefined ? undefined : Number(stepParam)
  const fallbackIndex = lesson
    ? progress.lastLessonId === lesson.id
      ? progress.lastStepIndex
      : firstIncompleteStepIndex(progress, lesson)
    : 0
  const stepIndex = lesson
    ? clamp(parsed !== undefined && Number.isInteger(parsed) ? parsed : fallbackIndex, 0, lesson.steps.length - 1)
    : 0
  const step = lesson?.steps[stepIndex]
  const chapter = lesson ? findChapter(lesson.chapter) : undefined

  useEffect(() => {
    if (!lesson) return
    saveLocation(lesson.id, stepIndex)
    document.title = `${lesson.title} · Java 交互课`
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [lesson, stepIndex, saveLocation])

  useEffect(() => {
    if (!lesson) return
    if (stepParam === undefined || !Number.isInteger(parsed) || stepParam !== String(stepIndex)) {
      navigate(`/lesson/${lesson.id}/${stepIndex}`, { replace: true })
    }
  }, [lesson, navigate, parsed, stepIndex, stepParam])

  if (!lesson || !step) {
    return (
      <div className="not-found">
        <h1>没有找到这一节</h1>
        <p className="step-copy">链接可能已经失效，或者 lessonId 拼写不正确。</p>
        <p style={{ marginTop: 20 }}>
          <Link to="/">返回课程目录</Link>
        </p>
      </div>
    )
  }

  const completedIds = new Set(progress.completedSteps[lesson.id] ?? [])
  const skippedIds = new Set(progress.skippedSteps[lesson.id] ?? [])
  const completedCount = lesson.steps.filter((item) => completedIds.has(item.id)).length
  const isCurrentComplete = completedIds.has(step.id)
  const isInteractive = step.type === 'quiz' || step.type === 'coding'
  const isLastStep = stepIndex === lesson.steps.length - 1
  const percent = Math.round((completedCount / lesson.steps.length) * 100)

  const skippedLabels = lesson.steps
    .map((item, index) =>
      skippedIds.has(item.id) && !completedIds.has(item.id)
        ? `第 ${index + 1} 步（${STEP_TYPE_LABEL[item.type]}）`
        : null,
    )
    .filter((label): label is string => label !== null)

  const completeCurrent = () => {
    markStepComplete(lesson.id, step.id)
    clearStepSkipped(lesson.id, step.id)
  }

  const advance = (skip: boolean) => {
    const completed = completedIds.has(step.id)
    if (skip) {
      if (!completed) markStepSkipped(lesson.id, step.id)
    } else if (isInteractive && !completed) {
      markStepSkipped(lesson.id, step.id)
    } else {
      markStepComplete(lesson.id, step.id)
      clearStepSkipped(lesson.id, step.id)
    }

    if (isLastStep) {
      const { next } = lessonNeighbors(lesson.id)
      navigate(next ? `/lesson/${next.id}/${firstIncompleteStepIndex(progress, next)}` : '/')
    } else {
      navigate(`/lesson/${lesson.id}/${stepIndex + 1}`, { replace: true })
    }
  }

  return (
    <article className="lesson-page">
      <header className="lesson-head" style={chapter ? chapterStyle(chapter.number) : undefined}>
        <div className="lesson-head__crumb">
          <Link to="/">课程目录</Link>
          <span aria-hidden="true">/</span>
          <span>
            <span className="lesson-head__chapter">第 {lesson.chapter} 章</span>
            {' · '}
            {chapter?.title ?? ''}
          </span>
        </div>
        <h1 className="lesson-head__title">{lesson.title}</h1>
        {stepIndex === 0 ? <p className="lesson-head__summary">{lesson.summary}</p> : null}
        <div className="lesson-head__meta">
          <span>
            第 {stepIndex + 1} / {lesson.steps.length} 步
          </span>
          <div className="step-ticks" aria-label={`本节进度 ${percent}%`}>
            {lesson.steps.map((item, index) => (
              <span
                className={`step-tick${completedIds.has(item.id) ? ' step-tick--done' : ''}${
                  index === stepIndex ? ' step-tick--current' : ''
                }`}
                key={item.id}
              />
            ))}
          </div>
          <span>已完成 {completedCount} 步</span>
        </div>
      </header>

      <div className="step-zone">
        <div className={`step-enter step-enter--${step.type}`} key={step.id}>
          <div className="step-mark" aria-hidden="true">
            <span className="step-mark__num">{String(stepIndex + 1).padStart(2, '0')}</span>
          </div>
          <StepRenderer step={step} skippedLabels={skippedLabels} onComplete={completeCurrent} />
        </div>
      </div>

      <nav className="step-nav" aria-label="步骤导航">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate(`/lesson/${lesson.id}/${stepIndex - 1}`, { replace: true })}
          disabled={stepIndex === 0}
        >
          上一步
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => advance(true)}>
          {isLastStep ? '跳过并结束' : '跳过'}
        </button>
        <span className="step-nav__spacer" />
        {isInteractive && !isCurrentComplete ? (
          <span className="step-nav__hint">尚未完成，点下一步会标记为跳过</span>
        ) : null}
        <button type="button" className="btn btn--primary" onClick={() => advance(false)}>
          {isLastStep ? '完成本节' : '下一步'}
        </button>
      </nav>
    </article>
  )
}
