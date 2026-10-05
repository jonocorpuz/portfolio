import { useLayoutEffect, useRef } from 'react'
import { motion, useIsPresent } from 'motion/react'
import { about } from '../data/projects'
import { BODY_DELAY, easeOutExpo } from '../lib/motion'

const grid =
  'grid grid-cols-1 px-[18px] sm:px-10 lg:grid-cols-[220px_minmax(0,60ch)_220px] lg:justify-center lg:gap-x-12'
const chip = 'rounded-full border border-white/20 px-3 py-1 text-[13px] leading-none text-white/85'
const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

/** About page: same visual language as a project page (huge headline, 3-column body), minus the banner. */
export function AboutView({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  const isPresent = useIsPresent()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const rise = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 0.2 } } }
      : {
          initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
          animate: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { delay, duration: 0.7, ease: easeOutExpo },
          },
        }

  return (
    <motion.main
      className="relative min-h-screen bg-black pt-[88px] sm:pt-[110px]"
      style={{ zIndex: isPresent ? 30 : 20 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.25, ease: 'easeOut' } }}
    >
      <div className={`${grid} pt-6 sm:pt-8`}>
        <motion.button
          type="button"
          onClick={onClose}
          className="col-span-full w-fit cursor-pointer rounded-sm text-[13px] font-medium tracking-[-0.02em] text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: reduced ? 0 : BODY_DELAY, duration: 0.4 } }}
        >
          <span aria-hidden>←</span> all projects
        </motion.button>

        <motion.div className="col-span-full mt-8 lg:mt-12" {...rise(0.05)}>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="inline-block text-[clamp(44px,15.5vw,56px)] font-semibold leading-none tracking-[-0.05em] text-white outline-none sm:text-[clamp(56px,11vw,168px)]"
          >
            About
          </h1>
        </motion.div>
      </div>

      <motion.div
        className={`${grid} gap-10 pb-40 pt-6 lg:pt-12`}
        {...rise(reduced ? 0 : BODY_DELAY)}
      >
        <div className="lg:text-right">
          <p className="text-[13px] italic text-white/50">hello</p>
          <p className="mt-1 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white">{about.tagline}</p>
        </div>

        <div className="order-3 space-y-4 text-[15px] leading-[1.55] text-white/85 sm:text-[16px] lg:order-none">
          {about.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <dl className="order-2 space-y-6 text-[14px] leading-snug lg:order-none">
          <div>
            <dt className="text-[13px] italic text-white/50">Focus</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {about.focus.map((s) => (
                <span key={s} className={chip}>
                  {s}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] italic text-white/50">Contact</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {about.contact.map((l) => {
                const newTab = /^https?:/.test(l.href) || l.href.endsWith('.pdf')
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className={`${chip} transition-colors hover:bg-white/10 ${ring}`}
                  >
                    {l.label}
                    {newTab && <span aria-hidden> ↗</span>}
                  </a>
                )
              })}
            </dd>
          </div>
        </dl>
      </motion.div>
    </motion.main>
  )
}
