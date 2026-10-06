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

/*
 * Each history entry records in `history.state` whether it was pushed from home. That travels with
 * the entry through back/forward (and reloads), so close() always knows if "back" leads home: a
 * flag kept in memory would describe the last transition instead, and after e.g. a deep link,
 * a project-to-project hop, close and Back, history.back() would leave the site.
 */
const isMarked = () => typeof (window.history.state as { fromHome?: unknown } | null)?.fromHome === 'boolean'
const isFromHome = () => (window.history.state as { fromHome?: unknown } | null)?.fromHome === true
const mark = (fromHome: boolean, url?: string) => window.history.replaceState({ fromHome }, '', url)

/**
 * Hash router: `#/` (home), `#/about`, `#/project/<slug>`.
 * close() goes back in history when the current entry was pushed from home (so back/forward stay
 * symmetric), otherwise it replaces the current entry with `#/`. Esc calls close on any non-home route.
 */
export function useHashRoute(): {
  route: Route
  openSlug: string | null
  open: (slug: string) => void
  close: () => void
} {
  const [route, setRoute] = useState<Route>(parse)
  // The route as of the latest navigation, including one close() has started but the browser has not
  // finished yet (history.back() is async), so a second close in the meantime is a no-op.
  const current = useRef(route)

  useEffect(() => {
    // The entry the visitor landed on was not reached from home within the app.
    if (!isMarked()) mark(false)
    const sync = () => {
      // An unmarked entry is a new one (open() or a link pushed it); a revisited one keeps its mark.
      if (!isMarked()) mark(current.current.name === 'home')
      current.current = parse()
      setRoute(current.current)
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
    current.current = { name: 'home' }
    if (isFromHome()) {
      window.history.back() // hashchange syncs state
    } else {
      mark(false, window.location.pathname + window.location.search + '#/')
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
