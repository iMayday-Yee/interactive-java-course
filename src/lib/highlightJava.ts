export type TokenKind = 'plain' | 'kw' | 'str' | 'num' | 'com' | 'type' | 'fn' | 'ann'

export type Token = {
  text: string
  kind: TokenKind
}

const KEYWORDS = new Set([
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
  'true',
  'false',
  'null',
  'var',
  'record',
  'sealed',
  'permits',
  'yield',
])

/**
 * 一个轻量的 Java 行内分词器，用于示例代码的语法高亮。
 * 不追求完整词法分析，只处理教学场景里常见的结构。
 */
export function tokenizeJava(source: string): Token[][] {
  const result: Token[][] = []
  let inBlockComment = false

  for (const line of source.split('\n')) {
    const tokens: Token[] = []
    let plain = ''
    let index = 0

    const flushPlain = () => {
      if (plain) {
        tokens.push({ text: plain, kind: 'plain' })
        plain = ''
      }
    }

    while (index < line.length) {
      if (inBlockComment) {
        const end = line.indexOf('*/', index)
        if (end === -1) {
          tokens.push({ text: line.slice(index), kind: 'com' })
          index = line.length
          break
        }
        tokens.push({ text: line.slice(index, end + 2), kind: 'com' })
        index = end + 2
        inBlockComment = false
        continue
      }

      const char = line[index]

      if (char === '/' && line[index + 1] === '/') {
        flushPlain()
        tokens.push({ text: line.slice(index), kind: 'com' })
        index = line.length
        break
      }

      if (char === '/' && line[index + 1] === '*') {
        flushPlain()
        const end = line.indexOf('*/', index + 2)
        if (end === -1) {
          tokens.push({ text: line.slice(index), kind: 'com' })
          index = line.length
          inBlockComment = true
        } else {
          tokens.push({ text: line.slice(index, end + 2), kind: 'com' })
          index = end + 2
        }
        continue
      }

      if (char === '"' || char === "'") {
        flushPlain()
        let cursor = index + 1
        while (cursor < line.length) {
          if (line[cursor] === '\\') {
            cursor += 2
            continue
          }
          if (line[cursor] === char) {
            cursor += 1
            break
          }
          cursor += 1
        }
        tokens.push({ text: line.slice(index, cursor), kind: 'str' })
        index = cursor
        continue
      }

      if (/[0-9]/.test(char)) {
        flushPlain()
        const match = line
          .slice(index)
          .match(/^(?:0[xX][0-9a-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?)/)
        const text = match?.[0] ?? char
        tokens.push({ text, kind: 'num' })
        index += text.length
        continue
      }

      if (/[A-Za-z_$]/.test(char)) {
        flushPlain()
        const match = line.slice(index).match(/^[A-Za-z_$][\w$]*/)
        const word = match?.[0] ?? char
        let kind: TokenKind = 'plain'
        if (KEYWORDS.has(word)) kind = 'kw'
        else if (/^[A-Z]/.test(word) && word.length > 1) kind = 'type'
        else if (line[index + word.length] === '(') kind = 'fn'
        tokens.push({ text: word, kind })
        index += word.length
        continue
      }

      if (char === '@') {
        flushPlain()
        const match = line.slice(index).match(/^@[A-Za-z_$][\w$]*/)
        const text = match?.[0] ?? char
        tokens.push({ text, kind: 'ann' })
        index += text.length
        continue
      }

      plain += char
      index += 1
    }

    flushPlain()
    result.push(tokens)
  }

  return result
}
