import type { SummaryStep } from '../../types/content'
import { RichText } from '../ui/RichText'

export function SummaryStepView({
  step,
  skippedLabels,
}: {
  step: SummaryStep
  skippedLabels: string[]
}) {
  return (
    <div>
      <h2 className="step-title">把这一节压缩成可迁移的规则</h2>
      <ul className="summary-points">
        {step.content.points.map((point, index) => (
          <li className={`summary-point summary-point--${point.kind}`} key={index}>
            <span className="summary-point__tag">
              {point.kind === 'general' ? '一般规则' : '示例场景'}
            </span>
            <p className="summary-point__text">
              <RichText text={point.text} />
            </p>
          </li>
        ))}
      </ul>
      {skippedLabels.length > 0 ? (
        <div className="summary-skip-note">
          本节有 {skippedLabels.length} 步未完成：{skippedLabels.join('、')}。可以返回补齐，或先继续下一节。
        </div>
      ) : null}
    </div>
  )
}
