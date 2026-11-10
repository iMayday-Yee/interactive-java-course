import { Link, Outlet } from 'react-router-dom'
import { course } from '../../content'
import { useExecution } from '../../execution/ExecutionProvider'
import { courseStats, useProgress } from '../../state/ProgressProvider'

export function AppShell() {
  const { progress } = useProgress()
  const stats = courseStats(progress, course.chapters)
  const { mode, javaVersion, recheck } = useExecution()
  const badgeModifier = mode === 'local' ? 'local' : mode === 'offline' ? 'offline' : 'checking'

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand" aria-label="Java 交互课，返回课程目录">
            <span className="brand__mark" aria-hidden="true">
              J
            </span>
            <span className="brand__text">Java 交互课</span>
          </Link>
          <div className="topbar__spacer" />
          <div className="topbar__progress" aria-label={`课程进度：${stats.percent}%`}>
            <span>
              {stats.completedSteps} / {stats.totalSteps}
            </span>
            <div className="progress-track">
              <div className="progress-track__fill" style={{ width: `${stats.percent}%` }} />
            </div>
          </div>
          <span className={`exec-badge exec-badge--${badgeModifier}`}>
            <span className="exec-badge__dot" aria-hidden="true" />
            {mode === 'local'
              ? `JDK ${javaVersion ?? ''}`.trim()
              : mode === 'offline'
                ? '离线模式'
                : '检测中'}
          </span>
          <Link to="/" className="topbar__nav">
            课程目录
          </Link>
        </div>
      </header>

      {mode === 'offline' ? (
        <div className="offline-banner" role="status">
          <div className="offline-banner__inner">
            <span>离线模式：未连接到本地执行服务，编码练习不会真正执行。</span>
            <span>
              启动 <code>npm run dev</code> 后刷新，或
            </span>
            <button type="button" className="btn btn--secondary btn--small" onClick={recheck}>
              重新检测
            </button>
          </div>
        </div>
      ) : null}

      <main id="main" className="page">
        <Outlet />
      </main>
    </div>
  )
}
