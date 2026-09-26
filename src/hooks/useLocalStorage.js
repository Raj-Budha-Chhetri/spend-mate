import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * State that mirrors itself into localStorage.
 *
 * Reading happens lazily on mount (inside the useState initialiser) and every
 * later change is written back by an effect. Storage access is wrapped in
 * try/catch because it throws in private-browsing modes and when the quota is
 * full — a tracker that cannot persist should still run.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the write triggered by the initial render — it would only rewrite
    // exactly what we just read.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable — the app keeps working from memory.
    }
  }, [key, value])

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignored for the same reason as above.
    }
    setValue(initialValue)
    // `initialValue` is a constant at every call site in this app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, setValue, reset]
}
