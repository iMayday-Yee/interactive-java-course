import { useState } from 'react'
import { Link } from 'react-router-dom'
import { allLessons, course, findLesson, lessonHref } from '../content'
import { useExecution } from '../execution/ExecutionProvider'
import { chapterStyle } from '../lib/chapterColors'
import {
  completedCountForLesson,
  courseStats,
  isLessonComplete,
  useProgress,
} from '../state/ProgressProvider'

export function HomePage() {
  const { progress, resetProgress } = useProgress()
  const { mode, javaVersion } = useExecution()
  const stats = courseStats(progress, course.chapters)
  const lastLesson = progress.lastLessonId ? findLesson(progress.lastLessonId) : undefined
  const firstLesson = allLessons[0]

  const initialChapter = lastLesson
    ? course.chapters.find((chapter) => chapter.number === lastLesson.chapter)
    : course.chapters[0]
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(
    () => new Set(initialChapter ? [initialChapter.id] : []),
  )

  const continueHref = lastLesson
    ? `/lesson/${lastLesson.id}/${progress.lastStepIndex}`
    : firstLesson
      ? `/lesson/${firstLesson.id}/0`
      : '/'
  const continueLabel = lastLesson ? '继续这一节' : '从第 0 章开始'
  const continueTitle = lastLesson?.title ?? firstLesson?.title

  const toggleChapter = (chapterId: string) => {
    setOpenChapterIds((current) => {
      const next = new Set(current)
      if (next.has(chapterId)) {
        next.delete(chapterId)
      } else {
        next.add(chapterId)
      }
      return next
    })
  }

  const allOpen = course.chapters.every((chapter) => openChapterIds.has(chapter.id))
  const toggleAll = () => {
    setOpenChapterIds(allOpen ? new Set() : new Set(course.chapters.map((chapter) => chapter.id)))
  }

  const handleReset = () => {
    if (window.confirm('清除所有完成记录与代码草稿？此操作不可撤销。')) resetProgress()
  }

  return (
    <div>
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow">交互式 Java 课程 · 边读边跑</span>
          <div className="home-hero__headline">
            <h1 className="home-hero__title">从运行机制到面向对象</h1>
            <p className="home-hero__subtitle">
              一屏一步：先看目标，再读概念、运行代码、动手写。每个结论都抽象成可迁移的规则。
            </p>
          </div>
        </div>
        <div className="home-hero__aside">
          <span className="home-hero__aside-kicker">继续学习</span>
          <div className="home-hero__aside-meter">
            <span className="home-hero__aside-percent">{stats.percent}%</span>
            <span className="home-hero__aside-meter-label">课程进度</span>
          </div>
          <div className="home-hero__aside-track" aria-hidden="true">
            <span style={{ width: `${stats.percent}%` }} />
          </div>
          <div className="home-hero__stats">
            {`已完成 ${stats.completedSteps} / ${stats.totalSteps} 步
${stats.completedLessons} / ${stats.lessonCount} 节`}
          </div>
          {continueTitle ? <span className="home-hero__aside-lesson">{continueTitle}</span> : null}
          <Link to={continueHref} className="btn btn--primary">
            {continueLabel}
          </Link>
        </div>
      </section>

      <div className="catalog-controls">
        <span className="catalog-controls__count">
          {course.chapters.length} 章 · {stats.lessonCount} 节 · {stats.totalSteps} 步
        </span>
        <button type="button" className="btn btn--ghost btn--small" onClick={toggleAll}>
          {allOpen ? '折叠全部' : '展开全部'}
        </button>
      </div>

      <div className="home-sections">
        {course.chapters.map((chapter) => {
          const chapterSteps = chapter.lessons.reduce((total, lesson) => total + lesson.steps.length, 0)
          const chapterCompleted = chapter.lessons.reduce(
            (total, lesson) => total + completedCountForLesson(progress, lesson),
            0,
          )
          const chapterPercent = Math.round((chapterCompleted / chapterSteps) * 100)
          const chapterDone = chapterCompleted === chapterSteps
          const open = openChapterIds.has(chapter.id)
          const lessonsId = `chapter-lessons-${chapter.id}`

          return (
            <section className="chapter-block" key={chapter.id} style={chapterStyle(chapter.number)}>
              <button
                type="button"
                className="chapter-block__head"
                aria-expanded={open}
                aria-controls={lessonsId}
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className="chapter-block__number">{String(chapter.number).padStart(2, '0')}</span>
                <span className="chapter-block__heading">
                  <span className="chapter-block__title">{chapter.title}</span>
                  <span className="chapter-block__subtitle">{chapter.subtitle}</span>
                </span>
                <span className={`chapter-block__status${chapterDone ? ' chapter-block__status--done' : ''}`}>
                  <span className="chapter-block__meta">
                    {chapterDone ? '已完成' : `${chapterCompleted} / ${chapterSteps} 步`}
                  </span>
                  <span className="chapter-block__bar" aria-hidden="true">
                    <span style={{ width: `${chapterPercent}%` }} />
                  </span>
                </span>
                <span className="chapter-block__chevron" aria-hidden="true" />
              </button>

              {open ? (
                <ul className="lesson-list" id={lessonsId}>
                  {chapter.lessons.map((lesson, index) => {
                    const completed = completedCountForLesson(progress, lesson)
                    const done = isLessonComplete(progress, lesson)
                    const lessonPercent = Math.round((completed / lesson.steps.length) * 100)
                    return (
                      <li key={lesson.id}>
                        <Link to={lessonHref(progress, lesson)} className="lesson-row">
                          <span className="lesson-row__index">
                            {chapter.number}.{index + 1}
                          </span>
                          <div>
                            <span className="lesson-row__title">{lesson.title}</span>
                            <span className="lesson-row__summary">{lesson.summary}</span>
                          </div>
                          <span className={`lesson-row__status${done ? ' lesson-row__status--done' : ''}`}>
                            <span className="lesson-row__status-text">
                              {done ? '已完成' : `${completed} / ${lesson.steps.length} 步`}
                            </span>
                            <span className="lesson-row__bar" aria-hidden="true">
                              <span style={{ width: `${lessonPercent}%` }} />
                            </span>
                          </span>
                          <span className="lesson-row__arrow" aria-hidden="true">
                            →
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </section>
          )
        })}
      </div>

      <footer className="home-footer">
        <span>
          执行环境：{mode === 'local' ? `本地 JDK ${javaVersion ?? ''}`.trim() : mode === 'offline' ? '离线模式' : '检测中'} · 仅本机
        </span>
        <span>进度保存在浏览器 localStorage</span>
        <button type="button" className="btn btn--ghost btn--small" onClick={handleReset}>
          清除学习进度
        </button>
      </footer>
    </div>
  )
}
