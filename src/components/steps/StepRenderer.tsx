import { lazy, Suspense } from 'react'
import type { Step } from '../../types/content'
import { ConceptStepView } from './ConceptStepView'
import { ExampleStepView } from './ExampleStepView'
import { GoalStepView } from './GoalStepView'
import { PitfallStepView } from './PitfallStepView'
import { QuizStepView } from './QuizStepView'
import { SummaryStepView } from './SummaryStepView'

const CodingStepView = lazy(() =>
  import('./CodingStepView').then((module) => ({ default: module.CodingStepView })),
)

export function StepRenderer({
  step,
  skippedLabels,
  onComplete,
}: {
  step: Step
  skippedLabels: string[]
  onComplete: () => void
}) {
  switch (step.type) {
    case 'goal':
      return <GoalStepView step={step} />
    case 'concept':
      return <ConceptStepView step={step} />
    case 'example':
      return <ExampleStepView step={step} />
    case 'quiz':
      return <QuizStepView step={step} onComplete={onComplete} />
    case 'coding':
      return (
        <Suspense fallback={<div className="editor-loading">正在加载编辑器…</div>}>
          <CodingStepView exercise={step.content} onComplete={onComplete} />
        </Suspense>
      )
    case 'summary':
      return <SummaryStepView step={step} skippedLabels={skippedLabels} />
    case 'pitfall':
      return <PitfallStepView step={step} />
  }
}
