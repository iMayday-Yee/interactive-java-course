import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ExecutionProvider } from './execution/ExecutionProvider'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'
import { ProgressProvider } from './state/ProgressProvider'

export default function App() {
  return (
    <BrowserRouter>
      <ExecutionProvider>
        <ProgressProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/lesson/:lessonId/:stepIndex?" element={<LessonPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ProgressProvider>
      </ExecutionProvider>
    </BrowserRouter>
  )
}
