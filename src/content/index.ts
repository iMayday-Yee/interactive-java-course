import type { Chapter, Course, Lesson, StepType } from '../types/content'
import type { Progress } from '../types/progress'
import { chapter00 } from './chapters/ch00'
import { chapter01 } from './chapters/ch01'
import { chapter02 } from './chapters/ch02'
import { chapter03 } from './chapters/ch03'
import { chapter04 } from './chapters/ch04'
import { chapter05 } from './chapters/ch05'
import { chapter06 } from './chapters/ch06'
import { chapter07 } from './chapters/ch07'
import { chapter08 } from './chapters/ch08'
import { chapter09 } from './chapters/ch09'
import { chapter10 } from './chapters/ch10'
import { chapter11 } from './chapters/ch11'
import { chapter12 } from './chapters/ch12'
import { chapter13 } from './chapters/ch13'
import { chapter14 } from './chapters/ch14'

export const course: Course = {
  chapters: [
    chapter00,
    chapter01,
    chapter02,
    chapter03,
    chapter04,
    chapter05,
    chapter06,
    chapter07,
    chapter08,
    chapter09,
    chapter10,
    chapter11,
    chapter12,
    chapter13,
    chapter14,
  ],
}

export const allLessons: Lesson[] = course.chapters.flatMap((chapter) => chapter.lessons)

export const STEP_TYPE_LABEL: Record<StepType, string> = {
  goal: '目标',
  concept: '概念',
  example: '示例',
  quiz: '交互练习',
  coding: '编码练习',
  summary: '小结',
  pitfall: '常见错误',
}

export function findLesson(lessonId: string): Lesson | undefined {
  return allLessons.find((lesson) => lesson.id === lessonId)
}

export function findChapter(chapterNumber: number): Chapter | undefined {
  return course.chapters.find((chapter) => chapter.number === chapterNumber)
}

export function lessonNeighbors(lessonId: string): { previous?: Lesson; next?: Lesson } {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index === -1) return {}
  return {
    previous: index > 0 ? allLessons[index - 1] : undefined,
    next: index < allLessons.length - 1 ? allLessons[index + 1] : undefined,
  }
}

export function firstIncompleteStepIndex(progress: Progress, lesson: Lesson): number {
  const completed = new Set(progress.completedSteps[lesson.id] ?? [])
  const index = lesson.steps.findIndex((step) => !completed.has(step.id))
  return index === -1 ? 0 : index
}

export function lessonHref(progress: Progress, lesson: Lesson): string {
  return `/lesson/${lesson.id}/${firstIncompleteStepIndex(progress, lesson)}`
}
