import { useEffect, useRef } from 'react'

interface Opts {
  enabled: boolean
  onNext: () => void
  onPrev: () => void
  onOpen: () => void
}

/** Accumulated wheel distance (px) that flips one card. */
const WHEEL_THRESHOLD = 40
/** A pause this long between wheel events ends a gesture (incl. trackpad momentum). */
const WHEEL_IDLE_MS = 180
/** Minimum time between two flips from wheel / swipe. */
const MIN_GAP_MS = 450
const SWIPE_PX = 40

function isEditable(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (el as HTMLElement).isContentEditable
  )
}

/** Wheel delta in px, whatever unit the browser reports it in. */
function wheelPx(e: WheelEvent): number {
  const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX // dominant axis only
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return d * 16
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return d * window.innerHeight
  return d
}

/**
 * Wheel, keyboard and touch-swipe input for the card stack (window-level, while `enabled`).
 * Wheel: one flip per gesture; trackpad momentum after a flip is swallowed until the wheel goes quiet.
 */
export function useStackNavigation({ enabled, onNext, onPrev, onOpen }: Opts): void {
  const cb = useRef({ onNext, onPrev, onOpen })
  useEffect(() => {
    cb.current = { onNext, onPrev, onOpen }
  })

  useEffect(() => {
    if (!enabled) return

    let lastTrigger = -Infinity

    const trigger = (dir: 1 | -1) => {
      lastTrigger = performance.now()
      if (dir === 1) cb.current.onNext()
      else cb.current.onPrev()
    }

    let acc = 0
    let locked = false
    let gestureEnded = false
    let lastWheel = -Infinity
    const onWheel = (e: WheelEvent) => {
      // Ctrl+wheel is pinch-zoom on a trackpad (and Ctrl+scroll zoom with a mouse): leave it to the browser.
      if (e.ctrlKey) return
      e.preventDefault()
      const now = performance.now()
      if (now - lastWheel >= WHEEL_IDLE_MS) {
        // The previous gesture is over: this event starts a fresh one.
        acc = 0
        gestureEnded = true
      }
      lastWheel = now
      // Unlock once a gesture has ended and the min gap has passed, even mid-way through the new gesture.
      if (locked && gestureEnded && now - lastTrigger >= MIN_GAP_MS) {
        locked = false
        gestureEnded = false
      }
      if (locked) return
      acc += wheelPx(e)
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        trigger(acc > 0 ? 1 : -1)
        locked = true
        gestureEnded = false
        acc = 0
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const focused = document.activeElement
      if (isEditable(focused)) return
      // Space / Enter belong to whatever control has focus (a header link, say), unless that is the
      // front card or nothing at all.
      const stackHasFocus = !focused || focused === document.body || focused.hasAttribute('data-rolodex-front')
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          trigger(1)
          break
        case ' ':
          if (!stackHasFocus) return
          e.preventDefault()
          trigger(1)
          break
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          trigger(-1)
          break
        case 'Enter':
          if (!stackHasFocus || e.repeat) return
          e.preventDefault()
          cb.current.onOpen()
          break
      }
    }

    // Swipe. The listeners stay passive: the home view sets `touch-action: pinch-zoom`, so the
    // browser neither scrolls nor rubber-bands the page under a vertical swipe.
    let startY: number | null = null
    let startX = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        startY = null
        return
      }
      startY = e.touches[0].clientY
      startX = e.touches[0].clientX
    }
    const onTouchMove = (e: TouchEvent) => {
      if (startY === null) return
      const dy = startY - e.touches[0].clientY
      const dx = startX - e.touches[0].clientX
      if (Math.abs(dy) > SWIPE_PX && Math.abs(dy) > Math.abs(dx)) {
        if (performance.now() - lastTrigger > MIN_GAP_MS) trigger(dy > 0 ? 1 : -1)
        startY = null
      }
    }
    const onTouchEnd = () => {
      startY = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [enabled])
}
