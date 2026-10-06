import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { ProjectLink } from '../types'
import { BODY_DELAY, easeOutExpo } from '../lib/motion'

/** Shared building blocks for the project and About pages. */

/** Keyboard focus ring used on every interactive element. */
export const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

/** Small outlined pill (stack / skill / link chips). */
const chip = 'rounded-full border border-white/20 px-3 py-1 text-[13px] leading-none text-white/85'

/** Page grid: one column on mobile, 220px | 60ch | 220px centred on lg. */
export const pageGrid =
  'grid grid-cols-1 px-[18px] sm:px-10 lg:grid-cols-[220px_minmax(0,60ch)_220px] lg:justify-center lg:gap-x-12'

/** Links that leave the site (or open a file) get a new tab and a ↗. */
export const isExternal = (href: string) => /^https?:/.test(href) || href.endsWith('.pdf')

/** Blur-rise entrance (initial/animate) for page bodies; a plain fade under reduced motion. */
export function rise(reduced: boolean, delay: number) {
  return reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay, duration: 0.7, ease: easeOutExpo } },
      }
}

/** Muted italic label: the `dt` of a meta row, or a small eyebrow above a heading. */
export const labelClass = 'text-[13px] italic text-white/50'

/** Page headline (project title / "About"). `--headline-k` steps long titles down (see titleFit). */
export const headline =
  'inline-block outline-none text-[calc(clamp(44px,15.5vw,56px)*var(--headline-k,1))] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[calc(clamp(56px,11vw,168px)*var(--headline-k,1))]'

/** Body copy in the page's middle column. */
export const prose = 'max-w-[65ch] text-pretty text-[15px] leading-[1.55] text-white/85 sm:text-[16px]'

/** Left column of a page body: an eyebrow label over a one-line lead. */
export function Lead({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="lg:text-right">
      <p className={labelClass}>{label}</p>
      <p className="mt-1 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white">{children}</p>
    </div>
  )
}

/** One `dt`/`dd` pair in a page's side column. `chips` lays the value out as a wrapping chip row. */
export function MetaRow({ label, chips = false, children }: { label: string; chips?: boolean; children: ReactNode }) {
  return (
    <div>
      <dt className={labelClass}>{label}</dt>
      <dd className={chips ? 'mt-2 flex flex-wrap gap-2' : 'mt-1 font-semibold text-white'}>{children}</dd>
    </div>
  )
}

export function Chips({ items }: { items: string[] }) {
  return items.map((s) => (
    <span key={s} className={chip}>
      {s}
    </span>
  ))
}

export function LinkChip({ link }: { link: ProjectLink }) {
  const external = isExternal(link.href)
  return (
    <a
      href={link.href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`${chip} transition-colors hover:bg-white/10 ${ring}`}
    >
      {link.label}
      {external && <span aria-hidden> ↗</span>}
    </a>
  )
}

/** "← all projects". Fades in after the morph; `fadeOnExit` also fades it out when the page leaves. */
export function BackButton({
  onClick,
  reduced,
  fadeOnExit = false,
}: {
  onClick: () => void
  reduced: boolean
  fadeOnExit?: boolean
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`col-span-full w-fit cursor-pointer rounded-sm text-[13px] font-medium tracking-[-0.02em] text-white/60 transition-colors hover:text-white ${ring}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: reduced ? 0 : BODY_DELAY, duration: 0.4 } }}
      exit={fadeOnExit ? { opacity: 0, transition: { duration: 0.15 } } : undefined}
    >
      <span aria-hidden>←</span> all projects
    </motion.button>
  )
}
