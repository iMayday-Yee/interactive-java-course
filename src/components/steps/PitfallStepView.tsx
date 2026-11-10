import type { PitfallStep } from '../../types/content'
import { RichText } from '../ui/RichText'

export function PitfallStepView({ step }: { step: PitfallStep }) {
  return (
    <div>
      <h2 className="step-title">很多人会这么写，但错在哪</h2>
      <div className="pitfall-list">
        {step.content.items.map((item, index) => (
          <section className="pitfall-item" key={index}>
            <span className="pitfall-label">常见写法</span>
            <div className="pitfall-item__wrong">{item.wrong}</div>
            <p className="pitfall-item__why">
              <RichText text={item.why} />
            </p>
            <span className="pitfall-label">正确写法</span>
            <div className="pitfall-item__right">{item.right}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
