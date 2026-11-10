import type { ReactNode } from 'react'

const TOKEN_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`)/g

/**
 * 支持两种最小标记：**加粗** 与 `行内代码`。
 * 不做完整 Markdown 解析，避免内容作者引入难以控制的格式。
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN_PATTERN)
  const nodes: ReactNode[] = []

  parts.forEach((part, index) => {
    if (!part) return
    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={index}>{part.slice(2, -2)}</strong>)
      return
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(
        <code className="inline-code" key={index}>
          {part.slice(1, -1)}
        </code>,
      )
      return
    }
    nodes.push(<span key={index}>{part}</span>)
  })

  return <>{nodes}</>
}
