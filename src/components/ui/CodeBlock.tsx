import { tokenizeJava } from '../../lib/highlightJava'

type CodeBlockProps = {
  code: string
  label?: string
  javaVersion?: string
  activeLine?: number | null
  onLineClick?: (line: number) => void
}

export function CodeBlock({ code, label, javaVersion, activeLine, onLineClick }: CodeBlockProps) {
  const lines = tokenizeJava(code)

  return (
    <div className="code-block">
      {label || javaVersion ? (
        <div className="code-block__bar">
          <span className="code-block__label">{label ?? 'Java'}</span>
          {javaVersion ? <span className="code-block__version">需 {javaVersion}+</span> : null}
        </div>
      ) : null}
      <div className="code-block__body">
        {lines.map((tokens, lineIndex) => {
          const lineNumber = lineIndex + 1
          const isActive = activeLine === lineNumber
          const content = tokens.map((token, tokenIndex) => (
            <span className={`tok-${token.kind}`} key={tokenIndex}>
              {token.text}
            </span>
          ))
          const lineContent = content.length > 0 ? content : ' '

          if (onLineClick) {
            return (
              <button
                type="button"
                className={`code-line code-line--clickable${isActive ? ' code-line--active' : ''}`}
                key={lineNumber}
                onClick={() => onLineClick(lineNumber)}
                aria-label={`第 ${lineNumber} 行，点击查看解释`}
                aria-pressed={isActive}
              >
                <span className="code-line__no">{lineNumber}</span>
                <span className="code-line__text">{lineContent}</span>
              </button>
            )
          }

          return (
            <div className="code-line" key={lineNumber}>
              <span className="code-line__no">{lineNumber}</span>
              <span className="code-line__text">{lineContent}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
