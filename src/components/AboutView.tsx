import { useLayoutEffect, useRef } from 'react'
import { motion, useIsPresent } from 'motion/react'
import { about } from '../data/projects'
import { BODY_DELAY } from '../lib/motion'
import { BackButton, Chips, Lead, LinkChip, MetaRow, headline, pageGrid, prose, rise } from './ui'

/** About page: same visual language as a project page (huge headline, 3-column body), minus the banner. */
export function AboutView({ reduced, onClose }: { reduced: boolean; onClose: () => void }) {
  const isPresent = useIsPresent()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.main
      className="relative min-h-screen bg-black pt-[88px] sm:pt-[110px]"
      style={{ zIndex: isPresent ? 30 : 20 }}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.25, ease: 'easeOut' } }}
    >
      <div className={`${pageGrid} pt-6 sm:pt-8`}>
        <BackButton onClick={onClose} reduced={reduced} />

        <motion.div className="col-span-full mt-8 lg:mt-12" {...rise(reduced, 0.05)}>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className={headline}
          >
            About
          </h1>
        </motion.div>
      </div>

      <motion.div
        className={`${pageGrid} gap-10 pb-40 pt-6 lg:pt-12`}
        {...rise(reduced, BODY_DELAY)}
      >
        <Lead label="hello">{about.tagline}</Lead>

        {/* On mobile the bio comes before the (long) skills column; on lg they sit side by side. */}
        <div className={`order-2 space-y-4 lg:order-none ${prose}`}>
          {about.bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <dl className="order-3 space-y-6 text-[14px] leading-snug lg:order-none">
          {about.skills.map((group) => (
            <MetaRow key={group.heading} label={group.heading} chips>
              <Chips items={group.items} />
            </MetaRow>
          ))}
          <MetaRow label="Education">
            {about.education.degree}
            <span className="block font-normal text-white/70">{about.education.school}</span>
            <span className="block font-normal text-white/70">{about.education.years}</span>
          </MetaRow>
          <MetaRow label="Contact" chips>
            {about.contact.map((l) => (
              <LinkChip key={l.label} link={l} />
            ))}
          </MetaRow>
        </dl>
      </motion.div>
    </motion.main>
  )
}
