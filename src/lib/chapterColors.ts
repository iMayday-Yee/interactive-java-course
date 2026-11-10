import type { CSSProperties } from 'react'

/**
 * 15 个章节色，沿着色相环从珊瑚 → 橙 → 金 → 绿 → 青 → 蓝 → 紫 → 品红 → 红。
 * 主色在浅色底上满足大字号 3:1 对比度；soft 只用于低饱和背景。
 */
const ACCENTS = [
  '#AE4829', // 0 coral
  '#A57727', // 1 amber
  '#898C21', // 2 olive
  '#669924', // 3 lime
  '#399D25', // 4 green
  '#259D41', // 5 emerald
  '#259D71', // 6 jade
  '#25999D', // 7 teal
  '#276EA5', // 8 azure
  '#273CA5', // 9 blue
  '#4427A5', // 10 indigo
  '#7727A5', // 11 violet
  '#A527A1', // 12 magenta
  '#A5276E', // 13 rose
  '#A5273C', // 14 crimson
] as const

const SOFTS = [
  '#FBEAE4',
  '#FBF3E4',
  '#FAFBE4',
  '#F1FBE4',
  '#E8FBE4',
  '#E4FBEA',
  '#E4FBF3',
  '#E4FAFB',
  '#E4F1FB',
  '#E4E8FB',
  '#EAE4FB',
  '#F3E4FB',
  '#FBE4FA',
  '#FBE4F1',
  '#FBE4E8',
] as const

export type ChapterPalette = {
  accent: string
  accent2: string
  accent3: string
  soft: string
}

export function chapterPalette(number: number): ChapterPalette {
  const index = ((number % ACCENTS.length) + ACCENTS.length) % ACCENTS.length
  return {
    accent: ACCENTS[index],
    accent2: ACCENTS[(index + 1) % ACCENTS.length],
    accent3: ACCENTS[(index + 2) % ACCENTS.length],
    soft: SOFTS[index],
  }
}

/** 把章节色注入为 CSS 变量，供目录和课堂抬头共享。 */
export function chapterStyle(number: number): CSSProperties {
  const palette = chapterPalette(number)
  return {
    '--chapter-accent': palette.accent,
    '--chapter-accent-2': palette.accent2,
    '--chapter-accent-3': palette.accent3,
    '--chapter-accent-soft': palette.soft,
  } as CSSProperties
}

/** 整门课程的彩虹进度条。 */
export const RAINBOW_GRADIENT = `linear-gradient(90deg, ${ACCENTS.map(
  (color, index) => `${color} ${((index / (ACCENTS.length - 1)) * 100).toFixed(1)}%`,
).join(', ')})`
