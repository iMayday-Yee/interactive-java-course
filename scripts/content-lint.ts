import { course } from '../src/content/index'
import type { CodingStep, ExampleStep, Step, SummaryStep } from '../src/types/content'

const errors: string[] = []
const warnings: string[] = []
const lessonIds = new Set<string>()
const stepIds = new Set<string>()
const requiredTypes: Step['type'][] = ['goal', 'concept', 'example', 'quiz', 'coding', 'summary', 'pitfall']

let stepCount = 0
let exampleCount = 0
let codingCount = 0
let tableCount = 0

function fail(message: string) {
  errors.push(message)
}

function warn(message: string) {
  warnings.push(message)
}

function checkText(value: string | undefined, context: string) {
  if (!value || value.trim().length === 0) fail(`${context}：文本为空`)
}

for (const chapter of course.chapters) {
  if (!chapter.lessons.length) fail(`第 ${chapter.number} 章没有 lesson`)

  for (const lesson of chapter.lessons) {
    if (lessonIds.has(lesson.id)) fail(`lesson id 重复：${lesson.id}`)
    lessonIds.add(lesson.id)

    for (const type of requiredTypes) {
      if (!lesson.steps.some((step) => step.type === type)) {
        fail(`${lesson.id} 缺少步骤类型：${type}`)
      }
    }

    for (const step of lesson.steps) {
      stepCount += 1
      if (stepIds.has(step.id)) fail(`step id 重复：${step.id}`)
      stepIds.add(step.id)

      if (step.type !== 'pitfall' && JSON.stringify(step).includes('引用传递')) {
        fail(`${step.id}：错误表述“引用传递”只允许出现在 pitfall 反例中`)
      }

      if (step.type === 'example') {
        const exampleStep = step as ExampleStep
        exampleCount += 1
        if (exampleStep.content.scenarios.length < 2) {
          fail(`${step.id}：example 至少需要 2 个不同场景`)
        }
        for (const scenario of exampleStep.content.scenarios) {
          checkText(scenario.name, `${step.id} 场景名`)
          checkText(scenario.code, `${step.id} 场景代码`)
          checkText(scenario.takeaway, `${step.id} 场景 takeaway`)
          if (Object.keys(scenario.lineNotes).length === 0) {
            fail(`${step.id} 场景“${scenario.name}”：lineNotes 不能为空`)
          }
        }
      }

      if (step.type === 'concept') {
        const concept = step
        if (concept.content.table) tableCount += 1
        for (const paragraph of concept.content.paragraphs) {
          checkText(paragraph, `${step.id} 概念段落`)
        }
      }

      if (step.type === 'summary') {
        const summary = step as SummaryStep
        if (summary.content.points.length < 3) {
          fail(`${step.id}：小结至少需要 3 条结论`)
        }
        const generalPoints = summary.content.points.filter((point) => point.kind === 'general')
        if (generalPoints.length === 0) {
          fail(`${step.id}：小结至少需要 1 条一般规则`)
        }
        for (const point of generalPoints) {
          if (!point.text.startsWith('**一般规则**')) {
            fail(`${step.id}：一般规则必须以“**一般规则**”开头`)
          }
        }
      }

      if (step.type === 'coding') {
        const coding = step as CodingStep
        codingCount += 1
        checkText(coding.content.task, `${step.id} 任务描述`)
        checkText(coding.content.io, `${step.id} 输入输出说明`)
        checkText(coding.content.answer, `${step.id} 参考答案`)
        checkText(coding.content.answerWhy, `${step.id} 答案说明`)
        if (coding.content.hints.length !== 3) {
          fail(`${step.id}：分级提示必须恰好 3 条`)
        }
        if (coding.content.tests.length < 3) {
          fail(`${step.id}：测试用例至少需要 3 组`)
        }
        for (const kind of ['normal', 'edge', 'tricky'] as const) {
          if (!coding.content.tests.some((test) => test.kind === kind)) {
            fail(`${step.id}：测试用例缺少 ${kind} 类型`)
          }
        }
        for (const test of coding.content.tests) {
          checkText(test.label, `${step.id} 测试用例 label`)
          checkText(test.expectedStdout, `${step.id} 测试用例期望输出`)
        }
      }

      if (step.type === 'quiz') {
        const quiz = step.content
        if (quiz.kind === 'choice') {
          if (quiz.answerIndex < 0 || quiz.answerIndex >= quiz.options.length) {
            fail(`${step.id}：choice 答案下标越界`)
          }
        }
        if (quiz.kind === 'fill' && quiz.answers.length === 0) {
          fail(`${step.id}：fill 至少需要一个可接受答案`)
        }
        if (quiz.kind === 'order' && quiz.lines.length < 2) {
          fail(`${step.id}：order 至少需要 2 行`)
        }
      }
    }
  }
}

const firstEight = course.chapters.filter((chapter) => chapter.number < 8)
let earlyTables = 0
for (const chapter of firstEight) {
  for (const lesson of chapter.lessons) {
    for (const step of lesson.steps) {
      if (step.type === 'concept' && step.content.table) earlyTables += 1
    }
  }
}
if (earlyTables < 8) warn(`前 8 章对照表只有 ${earlyTables} 处，验收要求至少 8 处`)
if (exampleCount < lessonIds.size) warn(`示例步骤只有 ${exampleCount} 个，少于 lesson 数量 ${lessonIds.size}`)

console.log(
  `[content] ${course.chapters.length} 章 · ${lessonIds.size} 节 · ${stepCount} 步 · ${exampleCount} 个示例 · ${codingCount} 个编码练习 · ${tableCount} 张对照表（前 8 章 ${earlyTables} 张）`,
)

for (const message of warnings) console.warn(`警告：${message}`)

if (errors.length) {
  for (const message of errors) console.error(`错误：${message}`)
  console.error(`\n共 ${errors.length} 个内容错误。`)
  process.exit(1)
}

console.log('[content] 校验通过。')
