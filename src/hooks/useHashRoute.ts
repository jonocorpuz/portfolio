import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = '#/project/'
const ABOUT = '#/about'

export type Route = { name: 'home' } | { name: 'about' } | { name: 'project'; slug: string }

function parse(): Route {
  const h = window.location.hash.replace(/\/+$/, '')
  if (h === ABOUT) return { name: 'about' }
  if (h.startsWith(PREFIX)) {
    let slug = h.slice(PREFIX.length)
    try {
      slug = decodeURIComponent(slug)
    } catch {
      // malformed escape sequence: treat as an unknown slug
    }
    if (slug) return { name: 'project', slug }
  }
  return { name: 'home' }
}

/**
 * Hash router: `#/` (home), `#/about`, `#/project/<slug>`.
 * close() goes back in history when the previous entry was home (so back/forward stay symmetric),
 * otherwise it replaces the current entry with `#/`. Esc calls close on any non-home route.
 */
export function useHashRoute(): {
  route: Route
  openSlug: string | null
  open: (slug: string) => void
  close: () => void
} {
  const [route, setRoute] = useState<Route>(parse)
  // true when the current (non-home) entry was reached directly from home within this app
  const fromHome = useRef(false)
  const lastHash = useRef(window.location.hash)
  const current = useRef(route)

  useEffect(() => {
    const sync = () => {
      if (window.location.hash === lastHash.current) return
      lastHash.current = window.location.hash
      const next = parse()
      fromHome.current = next.name !== 'home' && current.current.name === 'home'
      current.current = next
      setRoute(next)
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const open = useCallback((slug: string) => {
    const target = PREFIX + encodeURIComponent(slug)
    if (window.location.hash === target) return
    window.location.hash = target // hashchange syncs state
  }, [])

  const close = useCallback(() => {
    if (current.current.name === 'home') return
    if (fromHome.current) {
      fromHome.current = false
      window.history.back() // hashchange syncs state
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/')
      lastHash.current = window.location.hash
      current.current = { name: 'home' }
      setRoute(current.current)
    }
  }, [])

  const isHome = route.name === 'home'
  useEffect(() => {
    if (isHome) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isHome, close])

  return { route, openSlug: route.name === 'project' ? route.slug : null, open, close }
}
