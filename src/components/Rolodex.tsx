import { useEffect, useRef, useState } from 'react'
import type { Project } from '../types'
import { MAX_VISIBLE_DEPTH } from '../lib/motion'
import { RolodexCard, type CardZone } from './RolodexCard'

interface Props {
  projects: Project[]
  active: number
  reduced: boolean
  /** Focus the front card when the stack mounts (returning from a project / about). */
  focusOnMount?: boolean
  onOpen: () => void
  onBring: (index: number) => void
}

const mod = (a: number, n: number) => ((a % n) + n) % n

/** Card geometry, mirroring the card's CSS: width min(560px, 86vw | 80vw from sm), aspect 2.2:1. */
function cardSize() {
  const vw = typeof window === 'undefined' ? 1280 : window.innerWidth
  const w = Math.min(560, vw * (vw >= 640 ? 0.8 : 0.86))
  const height = w / 2.2
  return { height, radius: Math.round(height / 2) }
}

function useCardSize() {
  const [size, setSize] = useState(cardSize)
  useEffect(() => {
    const onResize = () =>
      setSize((prev) => {
        const next = cardSize()
        return next.height === prev.height ? prev : next
      })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/**
 * Depth zones for n cards: [0..maxVisible] stack, then a 'back' zone the next cards fade in from,
 * then a 'fallen' zone at the tail (depth n-1, n-2, ...) holding cards that recently flipped away.
 * Keeping several fallen slots means rapid "next" presses let each card finish its fall, and rapid
 * "prev" presses each swing a card back up from below — no direction state needed.
 */
function zones(n: number) {
  const maxVisible = Math.max(0, Math.min(MAX_VISIBLE_DEPTH, n - 3))
  const fallenCount = Math.max(1, Math.min(3, n - maxVisible - 2))
  return {
    maxVisible,
    zoneOf(depth: number): CardZone {
      if (depth <= maxVisible) return 'stack'
      if (depth >= n - fallenCount) return 'fallen'
      return 'back'
    },
  }
}

export function Rolodex({ projects, active, reduced, focusOnMount = false, onOpen, onBring }: Props) {
  const n = projects.length
  const { height: cardHeight, radius } = useCardSize()
  const { maxVisible, zoneOf } = zones(n)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusOnMount) return
    stageRef.current?.querySelector<HTMLButtonElement>('[data-rolodex-front]')?.focus({ preventScroll: true })
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If focus was on a card that just moved back, hand it to the new front card.
  useEffect(() => {
    const stage = stageRef.current
    const el = document.activeElement
    if (!stage || !el || !stage.contains(el)) return
    stage.querySelector<HTMLButtonElement>('[data-rolodex-front]')?.focus({ preventScroll: true })
  }, [active])

  const current = projects[active]

  return (
    <section aria-label="Projects" className="absolute inset-0 flex items-center justify-center">
      <p className="sr-only" aria-live="polite">
        {current ? `${current.title}, project ${active + 1} of ${n}` : ''}
      </p>
      <div
        ref={stageRef}
        // perspective on the parent gives each card its own 3D projection for the flip
        className="grid translate-y-[6vh] place-items-center [perspective:1200px]"
      >
        {projects.map((p, i) => {
          const depth = mod(i - active, n)
          return (
            <RolodexCard
              key={p.slug}
              project={p}
              depth={depth}
              zone={n === 1 ? 'stack' : zoneOf(depth)}
              maxVisible={maxVisible}
              radius={radius}
              cardHeight={cardHeight}
              reduced={reduced}
              onOpen={onOpen}
              onBring={() => onBring(i)}
            />
          )
        })}
      </div>
    </section>
  )
}
