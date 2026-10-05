import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { site } from '../data/projects'
import type { Project } from '../types'

const ring =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm'

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
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 px-[18px] py-[18px] text-[13px] sm:text-[14px] font-medium tracking-[-0.02em] text-white sm:px-10 sm:py-7"
      style={shadow}
    >
      {onHome ? (
        <button type="button" onClick={onHome} className={`cursor-pointer whitespace-nowrap hover:opacity-70 ${ring}`}>
          {site.name}
        </button>
      ) : (
        <a href="#/" className={`whitespace-nowrap hover:opacity-70 ${ring}`}>
          {site.name}
        </a>
      )}
      <nav aria-label="Site links" className="flex gap-3 sm:gap-5">
        {site.links.map((l) => {
          const external = /^https?:/.test(l.href) || l.href.endsWith('.pdf')
          const isCurrent = l.label === current
          return (
            <a
              key={l.label}
              href={l.href}
              aria-current={isCurrent ? 'page' : undefined}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className={`hover:opacity-60 ${ring}`}
            >
              {l.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

export function Footer({ project, index, total }: { project: Project; index: number; total: number }) {
  const reduce = useReducedMotion()
  const y = reduce ? 0 : 10
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] items-end min-[400px]:grid-cols-[1fr_auto_1fr] gap-4 px-[18px] pb-[18px] text-[13px] tracking-[-0.02em] text-white sm:px-10 sm:pb-7">
      {/* Floor fade: the falling card's mirrored "reflection" dissolves before it reaches the footer text. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[170px] bg-gradient-to-t from-black from-45% to-transparent sm:h-[190px]"
      />
      <div className="min-w-0 leading-tight">
        <div className="font-semibold">{project.label}</div>
        <div className="text-balance text-white/55">
          {project.year} · {project.kind}
        </div>
      </div>
      <div className="hidden flex-col items-center text-center leading-tight min-[400px]:flex">
        <span className="text-[12px] text-white/70">{site.name} 2026 all rights reserved</span>
        <span className="mt-1 hidden max-w-[44ch] text-[11px] text-white/50 sm:block">{site.blurb}</span>
      </div>
      <div className="col-start-2 justify-self-end min-[400px]:col-start-3 font-medium tabular-nums" aria-label={`Project ${index + 1} of ${total}`}>
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
        <span className="text-white/55">/{pad(total)}</span>
      </div>
    </footer>
  )
}
