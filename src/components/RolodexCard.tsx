import { useEffect, useRef } from 'react'
import { motion, useIsPresent, type Transition } from 'motion/react'
import type { Project } from '../types'
import { DIM, PEEK, SCALE_STEP, flipSpring, morphSpring, stackSpring, easeIn } from '../lib/motion'
import { useTitleMorph } from '../lib/useTitleMorph'

/**
 * Where a card sits, derived purely from its depth = (index - active) mod n.
 *  - 'stack'  : depth 0..maxVisible, front card + the ones peeking behind/above
 *  - 'back'   : hidden behind the stack (cards that will next fade in from the back)
 *  - 'fallen' : flipped toward the viewer and dropped below (cards that just left the front)
 * Because the pose is a pure function of depth, rapid / reversed input simply retargets the
 * springs from wherever each card currently is; nothing has to be "finished" first.
 */
export type CardZone = 'stack' | 'back' | 'fallen'

interface Props {
  project: Project
  depth: number
  zone: CardZone
  maxVisible: number
  radius: number
  reduced: boolean
  onOpen: () => void
  onBring: () => void
}

function stackPose(depth: number) {
  const s = Math.pow(SCALE_STEP, depth)
  const peek = PEEK[Math.min(depth, PEEK.length - 1)]
  // transform-origin is bottom-centre (needed for the flip), so scaling pulls the top edge
  // down by (1 - s) * h. Compensate so the top edge sits exactly `peek * h` above the front card.
  return { scale: s, y: `${-((1 - s) + peek) * 100}%` }
}

type Pose = { scale: number; y: string; rotateX: number; opacity: number }

function poseFor(zone: CardZone, depth: number, maxVisible: number, reduced: boolean): Pose {
  if (zone === 'stack') return { ...stackPose(depth), rotateX: 0, opacity: 1 }
  if (zone === 'back') return { ...stackPose(maxVisible + 1), rotateX: 0, opacity: 0 }
  // fallen: rotate ~180deg about the bottom edge toward the viewer. Past 90deg the (visible)
  // back face reads as a mirrored reflection beneath the new front card, as in the reference.
  return reduced
    ? { scale: 1, y: '0%', rotateX: 0, opacity: 0 }
    : { scale: 1, y: '4%', rotateX: -172, opacity: 0 }
}

function transitionFor(zone: CardZone, reduced: boolean, delay: number): Transition {
  if (reduced) return { duration: 0.3, ease: 'easeOut', delay }
  if (zone === 'fallen') return { default: flipSpring, opacity: { duration: 0.65, ease: easeIn } }
  if (zone === 'back') return { default: stackSpring, opacity: { duration: 0.22, ease: 'easeOut' } }
  // Stack (incl. a card swinging back up from 'fallen' on prev): rotation uses the heavier flip
  // spring, opacity comes in quickly so the rising "reflection" is visible as it swings up.
  return {
    default: { ...stackSpring, delay },
    rotateX: flipSpring,
    opacity: { duration: 0.32, ease: 'easeOut', delay },
  }
}

export function RolodexCard({ project, depth, zone, maxVisible, radius, reduced, onOpen, onBring }: Props) {
  const isFront = zone === 'stack' && depth === 0
  const isVisibleBack = zone === 'stack' && depth > 0
  const hidden = zone !== 'stack'
  // false while the home view plays its exit (a project is opening): the headline takes over the title.
  const isPresent = useIsPresent()
  const titleRef = useRef<HTMLSpanElement>(null)
  // Returning from a project: the front card's title flies back from the headline.
  useTitleMorph(titleRef, project.slug, isFront, reduced)

  // Stagger the deal-in only on mount (first load, or returning from a project).
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])
  const delay = !mounted.current && isVisibleBack ? 0.12 + depth * 0.07 : 0

  const z = zone === 'fallen' ? 200 : zone === 'back' ? 0 : 100 - depth
  // The fallen card stays fairly bright so its mirrored underside reads as a reflection.
  const dim = zone === 'stack' ? DIM[Math.min(depth, DIM.length - 1)] : zone === 'fallen' ? 0.25 : DIM[DIM.length - 1]

  return (
    <motion.div
      className="col-start-1 row-start-1 aspect-[2.2/1] w-[min(560px,86vw)] sm:w-[min(560px,80vw)]"
      style={{ zIndex: z, transformOrigin: '50% 100%', pointerEvents: hidden ? 'none' : 'auto' }}
      initial={isVisibleBack ? poseFor('back', depth, maxVisible, reduced) : false}
      animate={poseFor(zone, depth, maxVisible, reduced)}
      transition={transitionFor(zone, reduced, delay)}
      aria-hidden={hidden || undefined}
    >
      <div className="relative h-full w-full">
        <motion.button
          type="button"
          layoutId={`card-${project.slug}`}
          transition={reduced ? { duration: 0.12 } : morphSpring}
          onClick={isFront ? onOpen : onBring}
          tabIndex={isFront ? 0 : -1}
          data-rolodex-front={isFront ? '' : undefined}
          aria-label={isFront ? `Open project ${project.title}` : `Bring ${project.title} to front`}
          className="absolute inset-0 block cursor-pointer overflow-hidden bg-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          // borderRadius set via style so motion scale-corrects it during the layout morph
          style={{ borderRadius: radius }}
        >
          {/* The image keeps a fixed 2:1 aspect and is centred in a clipping box. Its own layoutId
              morph is therefore a uniform scale (no stretching) while the parent's clip morphs. */}
          <span className="absolute inset-0 flex items-center justify-center">
            <motion.img
              layoutId={`cover-${project.slug}`}
              transition={reduced ? { duration: 0.12 } : morphSpring}
              src={project.cover}
              alt=""
              draggable={false}
              className="aspect-[2/1] w-full max-w-none shrink-0 object-cover"
            />
          </span>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black"
            initial={false}
            animate={{ opacity: dim }}
            transition={reduced ? { duration: 0.2 } : stackSpring}
          />
        </motion.button>

        {/* Title lives outside the clipped button so it is never clipped mid-morph. */}
        {/* Only the front card shows its title (back cards are covered; the falling card's title fades
            ahead of its image). The title is not a layoutId element: see useTitleMorph. */}
        <motion.span
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ opacity: isFront ? 1 : 0 }}
          transition={{ duration: isFront ? 0.3 : zone === 'fallen' ? 0.4 : 0.2, ease: 'easeOut' }}
        >
          <span
            ref={titleRef}
            data-title-morph={project.slug}
            className="inline-block whitespace-nowrap text-[clamp(24px,7vw,40px)] font-medium leading-none tracking-[-0.045em] text-white"
            style={{ textShadow: '0 1px 18px rgba(0,0,0,0.28)', visibility: isPresent ? undefined : 'hidden' }}
          >
            {project.title}
          </span>
        </motion.span>
      </div>
    </motion.div>
  )
}
