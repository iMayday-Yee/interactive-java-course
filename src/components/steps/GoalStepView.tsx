import type { GoalStep } from '../../types/content'
import { RichText } from '../ui/RichText'

export function GoalStepView({ step }: { step: GoalStep }) {
  return (
    <div>
      <p className="step-lead">
        <RichText text={step.content.text} />
      </p>
      {step.content.checklist?.length ? (
        <ul className="step-checklist">
          {step.content.checklist.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
