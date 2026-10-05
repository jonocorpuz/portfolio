import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = '#/project/'

function parse(): string | null {
  const h = window.location.hash
  if (!h.startsWith(PREFIX)) return null
  const slug = decodeURIComponent(h.slice(PREFIX.length)).replace(/\/+$/, '')
  return slug || null
}

export function useHashRoute(): {
  openSlug: string | null
  open: (slug: string) => void
  close: () => void
} {
  const [openSlug, setOpenSlug] = useState<string | null>(parse)
  // true when the current detail entry was pushed from home within this app
  const fromHome = useRef(false)

  useEffect(() => {
    const sync = () => setOpenSlug(parse())
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const open = useCallback((slug: string) => {
    const wasHome = parse() === null
    const target = PREFIX + encodeURIComponent(slug)
    if (window.location.hash === target) return
    if (wasHome) fromHome.current = true
    window.location.hash = target
    setOpenSlug(slug)
    window.scrollTo(0, 0)
  }, [])

  const close = useCallback(() => {
    if (fromHome.current) {
      fromHome.current = false
      window.history.back() // hashchange/popstate will sync state
    } else {
      const url = window.location.pathname + window.location.search + '#/'
      window.history.replaceState(null, '', url)
      setOpenSlug(null)
    }
  }, [])

  useEffect(() => {
    if (openSlug === null) return
    window.scrollTo(0, 0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSlug, close])

  return { openSlug, open, close }
}
