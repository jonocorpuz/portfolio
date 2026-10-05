import { useLayoutEffect, useRef } from 'react'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { Project } from '../types'
import { BODY_DELAY, easeOutExpo, morphSpring } from '../lib/motion'
import { ProjectDetailBody } from './ProjectDetailBody'
import { useTitleMorph } from '../lib/useTitleMorph'

interface Props {
  project: Project
  reduced: boolean
  onClose: () => void
}

/**
 * Detail page. The banner shares layoutIds with the front Rolodex card (`card-<slug>`,
 * `cover-<slug>`) so opening morphs pill -> banner; the headline morphs from the card title via
 * useTitleMorph. Closing reverses both into the stack.
 */
export function ProjectView({ project, reduced, onClose }: Props) {
  const isPresent = useIsPresent()
  // The slug this view was opened with gets the shared-element morph. A later "next project"
  // hop swaps content with a plain crossfade (no matching card exists to morph from).
  const openedWith = useRef(project.slug)

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
          isHop={project.slug !== openedWith.current}
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
  const morph = reduced ? { duration: 0.12 } : morphSpring
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
        transition={morph}
        className="relative z-40 h-[110px] w-full overflow-hidden bg-neutral-900"
        style={{ borderRadius: 0 }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <motion.img
            layoutId={`cover-${project.slug}`}
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
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : 0.2 }}
        />
      </motion.div>

      {/* Same grid as ProjectDetailBody so the headline aligns with the body's left column. */}
      <div className="relative z-[45] grid grid-cols-1 px-[18px] pt-6 sm:px-10 sm:pt-8 lg:grid-cols-[220px_minmax(0,60ch)_220px] lg:justify-center lg:gap-x-12">
        <motion.button
          type="button"
          onClick={onClose}
          className="col-span-full w-fit cursor-pointer rounded-sm text-[13px] font-medium tracking-[-0.02em] text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: reduced ? 0 : BODY_DELAY, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <span aria-hidden>←</span> all projects
        </motion.button>

        {/* Headline: inline-block so its box hugs the text. It morphs to/from the card title as a single
            element (useTitleMorph); while the detail view exits it hides so the card title takes over. */}
        <div className="col-span-full mt-8 lg:mt-12">
          <h1
            ref={titleRef}
            data-title-morph={project.slug}
            tabIndex={-1}
            className="inline-block text-balance outline-none text-[clamp(44px,15.5vw,56px)] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[clamp(56px,11vw,168px)]"
            style={{ visibility: exiting ? 'hidden' : undefined }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { delay: reduced ? 0 : BODY_DELAY, duration: reduced ? 0.2 : 0.7, ease: easeOutExpo },
        }}
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
