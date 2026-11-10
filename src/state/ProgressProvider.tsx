import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Chapter, Lesson } from '../types/content'
import { emptyProgress, type Progress } from '../types/progress'

const STORAGE_KEY = 'java-lesson-progress-v1'

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      completedSteps: parsed.completedSteps ?? {},
      skippedSteps: parsed.skippedSteps ?? {},
      quizResults: parsed.quizResults ?? {},
      lastLessonId: parsed.lastLessonId,
      lastStepIndex: typeof parsed.lastStepIndex === 'number' ? parsed.lastStepIndex : 0,
      codingDrafts: parsed.codingDrafts ?? {},
      updatedAt: parsed.updatedAt ?? 0,
    }
  } catch {
    return emptyProgress
  }
}

type ProgressContextValue = {
  progress: Progress
  markStepComplete: (lessonId: string, stepId: string) => void
  markStepSkipped: (lessonId: string, stepId: string) => void
  clearStepSkipped: (lessonId: string, stepId: string) => void
  setQuizResult: (stepId: string, correct: boolean) => void
  setDraft: (exerciseId: string, code: string) => void
  saveLocation: (lessonId: string, stepIndex: number) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function addUnique(list: string[] | undefined, value: string): string[] {
  if (!list) return [value]
  return list.includes(value) ? list : [...list, value]
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const saveTimer = useRef<number | null>(null)
  const progressRef = useRef(progress)

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      } catch {
        /* localStorage 可能被禁用，忽略。 */
      }
    }, 350)
    return () => {
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current)
    }
  }, [progress])

  // 页面隐藏或卸载时立即落盘，避免防抖窗口内跳转/刷新丢失最后一次操作。
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressRef.current))
      } catch {
        /* ignore */
      }
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      flush()
    }
  }, [])

  const markStepComplete = useCallback((lessonId: string, stepId: string) => {
    setProgress((current) => ({
      ...current,
      completedSteps: {
        ...current.completedSteps,
        [lessonId]: addUnique(current.completedSteps[lessonId], stepId),
      },
      updatedAt: Date.now(),
    }))
  }, [])

  const markStepSkipped = useCallback((lessonId: string, stepId: string) => {
    setProgress((current) => ({
      ...current,
      skippedSteps: {
        ...current.skippedSteps,
        [lessonId]: addUnique(current.skippedSteps[lessonId], stepId),
      },
      updatedAt: Date.now(),
    }))
  }, [])

  const clearStepSkipped = useCallback((lessonId: string, stepId: string) => {
    setProgress((current) => ({
      ...current,
      skippedSteps: {
        ...current.skippedSteps,
        [lessonId]: (current.skippedSteps[lessonId] ?? []).filter((id) => id !== stepId),
      },
      updatedAt: Date.now(),
    }))
  }, [])

  const setQuizResult = useCallback((stepId: string, correct: boolean) => {
    setProgress((current) => ({
      ...current,
      quizResults: { ...current.quizResults, [stepId]: correct },
      updatedAt: Date.now(),
    }))
  }, [])

  const setDraft = useCallback((exerciseId: string, code: string) => {
    setProgress((current) => ({
      ...current,
      codingDrafts: { ...current.codingDrafts, [exerciseId]: code },
      updatedAt: Date.now(),
    }))
  }, [])

  const saveLocation = useCallback((lessonId: string, stepIndex: number) => {
    setProgress((current) => {
      if (current.lastLessonId === lessonId && current.lastStepIndex === stepIndex) return current
      return { ...current, lastLessonId: lessonId, lastStepIndex: stepIndex, updatedAt: Date.now() }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ ...emptyProgress, updatedAt: Date.now() })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({
      progress,
      markStepComplete,
      markStepSkipped,
      clearStepSkipped,
      setQuizResult,
      setDraft,
      saveLocation,
      resetProgress,
    }),
    [
      progress,
      markStepComplete,
      markStepSkipped,
      clearStepSkipped,
      setQuizResult,
      setDraft,
      saveLocation,
      resetProgress,
    ],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress 必须在 ProgressProvider 内使用')
  return context
}

export function completedCountForLesson(progress: Progress, lesson: Lesson): number {
  const ids = new Set(progress.completedSteps[lesson.id] ?? [])
  return lesson.steps.filter((step) => ids.has(step.id)).length
}

export function isLessonComplete(progress: Progress, lesson: Lesson): boolean {
  return completedCountForLesson(progress, lesson) === lesson.steps.length
}

export function courseStats(progress: Progress, chapters: Chapter[]) {
  let totalSteps = 0
  let completedSteps = 0
  let completedLessons = 0
  let lessonCount = 0
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) {
      lessonCount += 1
      totalSteps += lesson.steps.length
      const completed = completedCountForLesson(progress, lesson)
      completedSteps += completed
      if (completed === lesson.steps.length) completedLessons += 1
    }
  }
  return {
    totalSteps,
    completedSteps,
    completedLessons,
    lessonCount,
    percent: totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
  }
}
