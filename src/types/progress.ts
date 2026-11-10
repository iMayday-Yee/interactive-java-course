export type Progress = {
  /** lessonId → 已完成的 stepId 列表 */
  completedSteps: Record<string, string[]>
  /** lessonId → 被跳过的 stepId 列表 */
  skippedSteps: Record<string, string[]>
  /** quizStepId → 是否答对 */
  quizResults: Record<string, boolean>
  lastLessonId?: string
  lastStepIndex: number
  /** exerciseId → 用户代码草稿 */
  codingDrafts: Record<string, string>
  updatedAt: number
}

export const emptyProgress: Progress = {
  completedSteps: {},
  skippedSteps: {},
  quizResults: {},
  lastStepIndex: 0,
  codingDrafts: {},
  updatedAt: 0,
}
