import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/editor/editor.all.js'
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution.js'
import { loader } from '@monaco-editor/react'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

/** 使用本地打包的 Monaco，避免运行时依赖 CDN；只注册 Java 语言。 */
;(self as typeof self & { MonacoEnvironment?: { getWorker: () => Worker } }).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

loader.config({ monaco })

export const JAVA_LESSON_THEME = 'java-lesson-daylight'

monaco.editor.defineTheme(JAVA_LESSON_THEME, {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '2563EB' },
    { token: 'string', foreground: '087552' },
    { token: 'number', foreground: 'B45309' },
    { token: 'comment', foreground: '5C6E82', fontStyle: 'italic' },
    { token: 'type', foreground: '0E7490' },
    { token: 'type.identifier', foreground: '0E7490' },
    { token: 'annotation', foreground: '9A4A05' },
    { token: 'identifier', foreground: '1F2A37' },
    { token: 'delimiter', foreground: '5C6B7D' },
    { token: 'delimiter.bracket', foreground: '5C6B7D' },
    { token: 'operator', foreground: '334155' },
  ],
  colors: {
    'editor.background': '#EFF4FD',
    'editor.foreground': '#1F2A37',
    'editor.lineHighlightBackground': '#E9F0FB',
    'editorLineNumber.foreground': '#5C6E82',
    'editorLineNumber.activeForeground': '#2563EB',
    'editor.selectionBackground': '#CFE0FF',
    'editor.inactiveSelectionBackground': '#E4EDFB',
    'editorCursor.foreground': '#2563EB',
    'editorIndentGuide.background1': '#DCE6F2',
    'editorIndentGuide.background2': '#DCE6F2',
    'editorIndentGuide.activeBackground1': '#C4CFDC',
    'editorWidget.background': '#FFFFFF',
    'editorWidget.border': '#DCE6F2',
    'editorHoverWidget.background': '#FFFFFF',
    'editorHoverWidget.border': '#DCE6F2',
    'editorSuggestWidget.background': '#FFFFFF',
    'editorSuggestWidget.border': '#DCE6F2',
    'editorBracketMatch.background': '#E3EDFF',
    'editorBracketMatch.border': '#2563EB',
    'editorBracketHighlight.foreground1': '#2563EB',
    'editorBracketHighlight.foreground2': '#0A7A57',
    'editorBracketHighlight.foreground3': '#D97706',
    'editorBracketHighlight.foreground4': '#0E7490',
    'editorBracketHighlight.foreground5': '#C2410C',
    'editorBracketHighlight.foreground6': '#5C6B7D',
    'editorBracketHighlight.unexpectedBracket.foreground': '#C0392B',
  },
})
