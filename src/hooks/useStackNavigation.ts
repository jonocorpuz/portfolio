import { useEffect, useRef } from 'react'

interface Opts {
  count: number
  enabled: boolean
  onNext: () => void
  onPrev: () => void
  onOpen: () => void
}

const WHEEL_THRESHOLD = 40
const WHEEL_IDLE_MS = 180
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

export function useStackNavigation({ count, enabled, onNext, onPrev, onOpen }: Opts): void {
  const cb = useRef({ count, onNext, onPrev, onOpen })
  useEffect(() => {
    cb.current = { count, onNext, onPrev, onOpen }
  })

  useEffect(() => {
    if (!enabled) return

    let acc = 0
    let locked = false
    let lastTrigger = 0
    let lastWheel = 0
    let idleTimer: ReturnType<typeof setTimeout> | undefined

    const trigger = (dir: 1 | -1) => {
      if (cb.current.count < 1) return
      lastTrigger = performance.now()
      if (dir === 1) cb.current.onNext()
      else cb.current.onPrev()
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = performance.now()
      lastWheel = now
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        // gesture ended; unlock once min gap has also elapsed
        const wait = Math.max(0, MIN_GAP_MS - (performance.now() - lastTrigger))
        setTimeout(() => {
          if (performance.now() - lastWheel >= WHEEL_IDLE_MS) {
            locked = false
            acc = 0
          }
        }, wait)
      }, WHEEL_IDLE_MS)

      if (locked) return
      // Dominant axis only
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      acc += d
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        trigger(acc > 0 ? 1 : -1)
        locked = true
        acc = 0
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      if (isEditable(document.activeElement)) return
      const active = document.activeElement
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          trigger(1)
          break
        case ' ':
          // let focused buttons/links handle space themselves
          if (active && active !== document.body && !active.hasAttribute('data-rolodex-front')) return
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
          if (active && active !== document.body && !active.hasAttribute('data-rolodex-front')) return
          if (e.repeat) return
          e.preventDefault()
          cb.current.onOpen()
          break
      }
    }

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
    return () => {
      clearTimeout(idleTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [enabled])
}
