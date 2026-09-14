import React, { createContext, useContext, useCallback, useMemo, useRef, useState } from 'react'


const SECTION_KEYS = [
  'hero',
  'about',
  'services',
  'skills',
  'portfolio',
  'education',
  'contact',
  'footer',
  'sidebar',
]

const LoadingContext = createContext(null)


export function LoadingProvider({ children }) {
  const [readyKeys, setReadyKeys] = useState(() => new Set())
  const total = useRef(SECTION_KEYS.length).current

  const markReady = useCallback((key) => {
    setReadyKeys((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])


  const value = useMemo(() => {
    const readyCount = readyKeys.size
    return {
      markReady,
      readyCount,
      total,
      progress: total ? Math.round((readyCount / total) * 100) : 100,
      allReady: readyCount >= total,
    }
  }, [readyKeys, total, markReady])


  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}


export function useLoading() {
  const ctx = useContext(LoadingContext)
  
  if (!ctx) {
    return { markReady: () => {}, readyCount: 0, total: 0, progress: 100, allReady: true }
  }
  return ctx
}