import { useLayoutEffect, type RefObject } from 'react'
import { animate, type animateMini } from 'motion/react'
import { morphSpring } from './motion'

type DomAnimationOptions = Parameters<typeof animateMini>[2]

/**
 * Single-element title morph (card title <-> detail headline).
 *
 * Motion's `layoutId` crossfades the outgoing and incoming elements, which for two pieces of text
 * of different size/weight reads as a blurry double image. Instead, the *incoming* title measures
 * the outgoing one (still mounted while AnimatePresence plays its exit), and FLIPs itself from that
 * rect to its own layout with a transform. The outgoing title hides itself as soon as it starts
 * exiting (see `data-title-morph` callers), so only one copy of the text is ever visible.
 */
export function useTitleMorph(
  ref: RefObject<HTMLElement | null>,
  slug: string,
  enabled: boolean,
  reduced: boolean,
) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const from = Array.from(document.querySelectorAll<HTMLElement>('[data-title-morph]')).find(
      (n) => n !== el && n.dataset.titleMorph === slug,
    )
    if (!from) return

    const a = from.getBoundingClientRect()
    el.style.transform = 'none'
    const b = el.getBoundingClientRect()
    const fontA = a.height
    const fontB = parseFloat(getComputedStyle(el).fontSize) || b.height
    if (!a.width || !b.width || !fontA || !fontB) return

    // Both titles use `leading-none`, so a single line's box height == its font size.
    const s = fontA / fontB
    const lineB = Math.min(b.height, fontB)
    // Align centres (origin top-left): the incoming box, scaled by s, sits centred on the outgoing one.
    const x = a.left + a.width / 2 - (b.left + (b.width * s) / 2)
    const y = a.top + a.height / 2 - (b.top + (lineB * s) / 2)

    el.style.transformOrigin = '0 0'
    const controls = animate(
      el,
      { x: [x, 0], y: [y, 0], scale: [s, 1] },
      (reduced ? { duration: 0.12 } : morphSpring) as DomAnimationOptions,
    )
    return () => controls.stop()
  }, [ref, slug, enabled, reduced])
}
