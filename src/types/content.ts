export type CompareTable = {
  headers: string[]
  rows: string[][]
}

export type QuizContent =
  | {
      kind: 'choice'
      question: string
      options: string[]
      answerIndex: number
      explanation: string
    }
  | {
      kind: 'judge'
      statement: string
      answer: boolean
      explanation: string
    }
  | {
      kind: 'fill'
      question: string
      before?: string
      after?: string
      answers: string[]
      placeholder?: string
      explanation: string
    }
  | {
      kind: 'order'
      question: string
      /** 按正确顺序给出；渲染时会打乱。 */
      lines: string[]
      explanation: string
    }

export type ExampleScenario = {
  name: string
  code: string
  output?: string
  javaVersion?: string
  /** 行号（从 1 开始）→ 解释。 */
  lineNotes: Record<number, string>
  takeaway: string
}

export type TestCase = {
  label: string
  kind: 'normal' | 'edge' | 'tricky'
  stdin?: string
  args?: string[]
  expectedStdout: string
}

export type CodingExercise = {
  exerciseId: string
  task: string
  io: string
  skeleton: string
  /** 固定三条，按提示 1→2→3 逐级展开。 */
  hints: [string, string, string]
  tests: TestCase[]
  answer: string
  answerWhy: string
}

export type SummaryPoint = {
  text: string
  kind: 'general' | 'scenario'
}

type StepBase = { id: string }

export type GoalStep = StepBase & {
  type: 'goal'
  content: { text: string; checklist?: string[] }
}

export type ConceptStep = StepBase & {
  type: 'concept'
  content: {
    title?: string
    paragraphs: string[]
    table?: CompareTable
    note?: string
  }
}

export type ExampleStep = StepBase & {
  type: 'example'
  content: {
    intro?: string
    scenarios: ExampleScenario[]
  }
}

export type QuizStep = StepBase & {
  type: 'quiz'
  content: QuizContent
}

export type CodingStep = StepBase & {
  type: 'coding'
  content: CodingExercise
}

export type SummaryStep = StepBase & {
  type: 'summary'
  content: { points: SummaryPoint[] }
}

export type PitfallStep = StepBase & {
  type: 'pitfall'
  content: {
    items: { wrong: string; why: string; right: string }[]
  }
}

export type Step =
  | GoalStep
  | ConceptStep
  | ExampleStep
  | QuizStep
  | CodingStep
  | SummaryStep
  | PitfallStep

export type StepType = Step['type']

export type Lesson = {
  id: string
  title: string
  chapter: number
  summary: string
  steps: Step[]
}

export type Chapter = {
  id: string
  number: number
  title: string
  subtitle: string
  lessons: Lesson[]
}

export type Course = {
  chapters: Chapter[]
}
