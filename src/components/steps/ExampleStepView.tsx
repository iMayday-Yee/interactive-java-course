import { useState } from 'react'
import type { ExampleScenario, ExampleStep } from '../../types/content'
import { CodeBlock } from '../ui/CodeBlock'
import { RichText } from '../ui/RichText'

function ScenarioBlock({ scenario }: { scenario: ExampleScenario }) {
  const [activeLine, setActiveLine] = useState<number | null>(null)
  const note = activeLine === null ? undefined : scenario.lineNotes[activeLine]
  const separator = scenario.name.indexOf('：')
  const rawPrefix = separator >= 0 ? scenario.name.slice(0, separator) : null
  const rawDigits = rawPrefix ? rawPrefix.match(/\d+/) : null
  const indexLabel = rawPrefix ? (rawDigits ? rawDigits[0].padStart(2, '0') : rawPrefix) : null
  const title = separator >= 0 ? scenario.name.slice(separator + 1) : scenario.name

  return (
    <section className="scenario-panel">
      <div className="scenario-panel__head">
        {indexLabel ? <span className="scenario-panel__index">{indexLabel}</span> : null}
        <h3 className="scenario-panel__title">{title}</h3>
      </div>
      <div className="scenario-panel__body">
        <div className="example-grid">
          <div>
            <CodeBlock
              code={scenario.code}
              javaVersion={scenario.javaVersion}
              activeLine={activeLine}
              onLineClick={(line) => setActiveLine((current) => (current === line ? null : line))}
            />
            {scenario.output ? (
              <div className="code-output">
                <span className="muted">输出：</span>
                {scenario.output}
              </div>
            ) : null}
          </div>
          <aside className={`line-note${note ? '' : ' line-note--idle'}`} aria-live="polite">
            <span className="line-note__label">
              {activeLine === null ? '逐行解读' : `第 ${activeLine} 行`}
            </span>
            <RichText text={note ?? '点击左侧任意一行代码，查看这一行在做什么。'} />
          </aside>
        </div>
      </div>
      <div className="scenario-panel__takeaway">
        <RichText text={scenario.takeaway} />
      </div>
    </section>
  )
}

export function ExampleStepView({ step }: { step: ExampleStep }) {
  return (
    <div className="scenario-list">
      {step.content.scenarios.map((scenario) => (
        <ScenarioBlock scenario={scenario} key={scenario.name} />
      ))}
    </div>
  )
}
