import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { checkHealth } from './api'

export type ExecutionMode = 'checking' | 'local' | 'offline'

type ExecutionContextValue = {
  mode: ExecutionMode
  javaVersion: string | null
  recheck: () => void
}

const ExecutionContext = createContext<ExecutionContextValue>({
  mode: 'checking',
  javaVersion: null,
  recheck: () => undefined,
})

export function ExecutionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ExecutionMode>('checking')
  const [javaVersion, setJavaVersion] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const recheck = useCallback(() => setNonce((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    setMode('checking')
    checkHealth(controller.signal)
      .then((health) => {
        setJavaVersion(health.javaVersion)
        setMode(health.ok ? 'local' : 'offline')
      })
      .catch(() => {
        setJavaVersion(null)
        setMode('offline')
      })
      .finally(() => clearTimeout(timer))
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [nonce])

  const value = useMemo(() => ({ mode, javaVersion, recheck }), [mode, javaVersion, recheck])
  return <ExecutionContext.Provider value={value}>{children}</ExecutionContext.Provider>
}

export function useExecution() {
  return useContext(ExecutionContext)
}
