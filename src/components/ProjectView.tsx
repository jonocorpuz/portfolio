import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { Project } from '../types'
import { BODY_DELAY, morphTransition } from '../lib/motion'
import { ProjectDetailBody } from './ProjectDetailBody'
import { BackButton, headline, pageGrid, rise } from './ui'
import { useTitleMorph } from '../lib/useTitleMorph'
import { TitleWords, titleFitStyle } from '../lib/titleFit'

interface Props {
  project: Project
  reduced: boolean
  onClose: () => void
}

/**
 * Detail page. The banner shares layoutIds with the front Rolodex card (`card-<slug>`,
 * `cover-<slug>`) so opening morphs pill -> banner; the headline morphs from the card title via
 * element: the outgoing copy hides at once instead of crossfading, which over black read as a dim flicker.
 */
export function ProjectView({ project, reduced, onClose }: Props) {
  const isPresent = useIsPresent()
  // Only the project this view was opened with gets the shared-element morph. Any later content (a
  // "next project" hop, or back to the first project) crossfades: no matching card exists to morph from.
  const [openedWith] = useState(project.slug)
  const [hopped, setHopped] = useState(false)
  if (!hopped && project.slug !== openedWith) setHopped(true)

  return (
    <motion.main
      className="relative min-h-screen bg-black"
      // Entering view sits above the exiting one so the morphing element is always on top.
      style={{ zIndex: isPresent ? 30 : 20 }}
      // Exiting detail fades quickly; the banner/headline hand off to the card.
      exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.25, ease: 'easeOut' } }}
    >
      <AnimatePresence mode="wait">
        <ProjectContent
          key={project.slug}
          project={project}
          reduced={reduced}
          isHop={hopped}
          exiting={!isPresent}
          onClose={onClose}
        />
      </AnimatePresence>
    </motion.main>
  )
}

function ProjectContent({
  project,
  reduced,
  isHop,
  exiting,
  onClose,
}: {
  project: Project
  reduced: boolean
  isHop: boolean
  exiting: boolean
  onClose: () => void
}) {
  const morph = morphTransition(reduced)
  const titleRef = useRef<HTMLHeadingElement>(null)
  // Opening from the stack: the headline flies in from the front card's title.
  useTitleMorph(titleRef, project.slug, !isHop, reduced)

  // Detail always starts at the top (also after a project-to-project hop), and focus moves to the
  // headline so keyboard / screen-reader users land on the new page rather than <body>.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <motion.div
      initial={isHop ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Banner: the pill morphs into this. borderRadius via style -> motion animates/corrects it. */}
      <motion.div
        layoutId={`card-${project.slug}`}
        layoutCrossfade={false}
        transition={morph}
        className="relative z-40 h-[110px] w-full overflow-hidden bg-neutral-900"
        style={{ borderRadius: 0 }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.img
            layoutId={`cover-${project.slug}`}
            layoutCrossfade={false}
            transition={morph}
            src={project.cover}
            alt=""
            draggable={false}
            decoding="async"
            fetchPriority="high"
            className="aspect-[2/1] w-full max-w-none shrink-0 object-cover"
          />
        </span>
        {/* soft top shade so the overlaid header stays legible */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.2 }}
        />
      </motion.div>

      {/* Same grid as ProjectDetailBody so the headline aligns with the body's left column. */}
      <div className={`${pageGrid} relative z-[45] pt-6 sm:pt-8`}>
        <BackButton onClick={onClose} reduced={reduced} fadeOnExit />

        {/* Headline: inline-block so its box hugs the text. It morphs to/from the card title as a single
            element (useTitleMorph); while the detail view exits it hides so the card title takes over. */}
        <div className="col-span-full mt-8 lg:mt-12">
          <h1
            ref={titleRef}
            data-title-morph={project.slug}
            tabIndex={-1}
            className={`${headline} text-balance`}
            style={{ ...titleFitStyle(project.title), visibility: exiting ? 'hidden' : undefined }}
          >
            <TitleWords title={project.title} />
          </h1>
        </div>
      </div>

      <motion.div
        {...rise(reduced, BODY_DELAY)}
        exit={
          reduced
            ? { opacity: 0, transition: { duration: 0.12 } }
            : { opacity: 0, y: 12, filter: 'blur(8px)', transition: { duration: 0.25, ease: 'easeIn' } }
        }
      >
        <ProjectDetailBody project={project} />
      </motion.div>
    </motion.div>
  )
}
