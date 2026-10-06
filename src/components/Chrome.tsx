import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimate, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { site } from '../data/projects'
import type { Project } from '../types'
import { LABEL_SWAP, easeInOut } from '../lib/motion'
import { isExternal, ring } from './ui'

export function Header({
  onHome,
  overlay = false,
  current,
}: {
  onHome?: () => void
  overlay?: boolean
  /** label of the site link for the current page (gets aria-current) */
  current?: string
}) {
  const shadow = overlay ? { textShadow: '0 1px 12px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.35)' } : undefined
  // Scrolling pages (project / about): a soft black fade behind the header comes in as the page scrolls,
  // so body text passing underneath stays legible. At the top it is invisible, so the banner stays clean.
  const { scrollY } = useScroll()
  const backdrop = useTransform(scrollY, [0, 64], [0, 1])
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-[18px] py-[18px] text-[13px] sm:text-[14px] font-medium tracking-[-0.02em] text-white sm:px-10 sm:py-7 max-[360px]:gap-3 max-[360px]:text-[12px]"
      style={shadow}
    >
      {onHome && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[96px] bg-gradient-to-b from-black from-45% to-transparent sm:h-[124px]"
          style={{ opacity: backdrop }}
        />
      )}
      <span className="whitespace-nowrap">{site.name}</span>
      <nav aria-label="Site links" className="flex gap-3 sm:gap-5 max-[360px]:gap-2.5">
        {site.links.map((l) => {
          const external = isExternal(l.href)
          const isCurrent = l.label === current
          return (
            <a
              key={l.label}
              href={l.href}
              aria-current={isCurrent ? 'page' : undefined}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              // Going home from a project/about page closes it (history-aware) rather than pushing a new entry.
              onClick={
                onHome && l.href === '#/'
                  ? (e) => {
                      e.preventDefault()
                      onHome()
                    }
                  : undefined
              }
              // One gentle curve both ways: CSS `ease` starts moving at once (no ease-in-out lag) but,
              // unlike a steep ease-out, doesn't read as an instant jump. Colour, not opacity, so it
              // repaints smoothly like any text change.
              className={`transition-colors duration-[350ms] ease-[ease] hover:text-white/60 rounded-sm ${ring}`}
            >
              {l.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}

/**
 * Scroll indicator for the scrolling pages (the app hides native scrollbars): a thin rail on the right
 * edge that fills from the top as the page scrolls. Hidden when the page fits the viewport.
 */
export function ScrollIndicator({ reduced }: { reduced: boolean }) {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 })
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight + 1)
    const raf = requestAnimationFrame(check) // after the page has laid out
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed right-2 top-1/2 z-50 h-[min(40vh,320px)] w-[2px] -translate-y-1/2 overflow-hidden rounded-full bg-white/15 sm:right-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollable ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="h-full w-full origin-top rounded-full bg-white/70"
        style={{ scaleY: reduced ? scrollYProgress : smooth }}
      />
    </motion.div>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Footer project label. The name swaps instantly; the "year · kind" line below fades out, swaps its
 * text, then fades back in. That line is one element, never remounted: a change mid-fade just retargets
 * (no queue, no stacked copies), so rapid scrolling lands straight on the latest project. Bottom-aligned
 * in the footer, so a two-line kind grows upward and nothing else moves.
 */
function FooterLabel({ project }: { project: Project }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(project)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const swapped = useRef(false)

  useEffect(() => {
    const t = { duration: LABEL_SWAP, ease: easeInOut }
    const d = reduce ? 0 : 4
    if (project.slug !== shown.slug) {
      let live = true
      // Retargeted mid-fade: only the remaining opacity is left to fade, so rapid changes don't stall.
      const left = parseFloat(getComputedStyle(scope.current).opacity)
      const out = { opacity: 0, y: -d, filter: `blur(${reduce ? 0 : 3}px)` }
      animate(scope.current, out, { ...t, duration: LABEL_SWAP * left }).then(() => {
        if (!live) return
        swapped.current = true
        setShown(project)
      })
      return () => {
        live = false
      }
    }
    // New text rises in from below (as the counter does); a change undone mid-fade just fades back.
    animate(scope.current, { opacity: 1, y: swapped.current ? [d, 0] : 0, filter: 'blur(0px)' }, t)
    swapped.current = false
  }, [project, shown, reduce, animate, scope])

  return (
    <div className="min-w-0 leading-tight">
      <div className="font-semibold">{project.label}</div>
      <div ref={scope} className="text-balance text-white/55">
        {shown.year} · {shown.kind}
      </div>
    </div>
  )
}

export function Footer({ project, index, total }: { project: Project; index: number; total: number }) {
  const reduce = useReducedMotion()
  const y = reduce ? 0 : 10
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] items-end gap-4 px-[18px] pb-[18px] text-[13px] tracking-[-0.02em] text-white sm:px-10 sm:pb-7">
      {/* Floor fade: the falling card's mirrored "reflection" dissolves before it reaches the footer text.
          Capped by vh so on short (landscape) screens it doesn't swallow the front card. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[min(170px,32vh)] bg-gradient-to-t from-black from-45% to-transparent sm:h-[min(190px,32vh)]"
      />
      <FooterLabel project={project} />
      <div className="justify-self-end font-medium tabular-nums" aria-hidden>
        <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={index}
              initial={{ y, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -y, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {pad(index + 1)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="inline-flex h-[1.2em] align-bottom text-white/55">/{pad(total)}</span>
      </div>
    </footer>
  )
}
