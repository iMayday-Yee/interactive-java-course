import type { ConceptStep } from '../../types/content'
import { CompareTable } from '../ui/CompareTable'
import { RichText } from '../ui/RichText'

export function ConceptStepView({ step }: { step: ConceptStep }) {
  const { title, paragraphs, table, note } = step.content
  return (
    <div>
      {title ? <h2 className="step-title">{title}</h2> : null}
      {paragraphs.map((paragraph, index) => (
        <p className="step-copy" key={index}>
          <RichText text={paragraph} />
        </p>
      ))}
      {table ? <CompareTable table={table} caption={title} /> : null}
      {note ? (
        <div className="step-note">
          <RichText text={note} />
        </div>
      ) : null}
    </div>
  )
}
