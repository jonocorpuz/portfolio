import { useEffect, useRef } from 'react'
import { motion, useIsPresent, type Transition } from 'motion/react'
import type { Project } from '../types'
import { DIM, PEEK, PILL_RADIUS, SCALE_STEP, flipSpring, morphTransition, stackSpring, easeIn } from '../lib/motion'
import { useTitleMorph } from '../lib/useTitleMorph'
import { TitleWords, titleFitStyle } from '../lib/titleFit'

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
  cardWidth: number
  /** Card height in px (see useCardSize). Stack offsets are expressed in px, not %, see stackPose. */
  cardHeight: number
  reduced: boolean
  onOpen: () => void
  onBring: () => void
}

/*
 * The card's transform is bottom-centre origin (needed for the flip) and its `y` is in px.
 * Both are given to motion as values (originX/originY, numeric y) rather than CSS
 * (`transform-origin: 50% 100%`, `y: '-25%'`), so motion's own model of the card transform matches
 * what the browser renders. The shared-element nodes inside the card (button/img `layoutId`) are
 * measured by stripping their ancestors' transforms *with that model*; a mismatch there reads as a
 * layout change and starts a phantom layout animation (the old "twitch" of the cards behind).
 */
function stackPose(depth: number, h: number) {
  const s = Math.pow(SCALE_STEP, depth)
  const peek = PEEK[Math.min(depth, PEEK.length - 1)]
  // Scaling about the bottom edge pulls the top edge down by (1 - s) * h. Compensate so the top
  // edge sits exactly `peek * h` above the front card.
  return { scale: s, y: -((1 - s) + peek) * h }
}

type Pose = { scale: number; y: number; rotateX: number; opacity: number }

function poseFor(zone: CardZone, depth: number, maxVisible: number, h: number, reduced: boolean): Pose {
  if (zone === 'stack') return { ...stackPose(depth, h), rotateX: 0, opacity: 1 }
  if (zone === 'back') return { ...stackPose(maxVisible + 1, h), rotateX: 0, opacity: 0 }
  // fallen: rotate ~180deg about the bottom edge toward the viewer. Past 90deg the (visible)
  // back face reads as a mirrored reflection beneath the new front card, as in the reference.
  return reduced
    ? { scale: 1, y: 0, rotateX: 0, opacity: 0 }
    : { scale: 1, y: 0.04 * h, rotateX: -172, opacity: 0 }
}

function transitionFor(zone: CardZone, reduced: boolean, delay: number, resized: boolean): Transition {
  // On a viewport resize only the px `y` changes; jump it so the stack rescales with the card's
  // CSS size in the same frame (as a % offset would) instead of springing after it.
  const resize: Transition = resized ? { y: { duration: 0 } } : {}
  if (reduced) return { duration: 0.3, ease: 'easeOut', delay, ...resize }
  if (zone === 'fallen') return { default: flipSpring, opacity: { duration: 0.65, ease: easeIn }, ...resize }
  if (zone === 'back') return { default: stackSpring, opacity: { duration: 0.22, ease: 'easeOut' }, ...resize }
  // Stack (incl. a card swinging back up from 'fallen' on prev): rotation uses the heavier flip
  // spring, opacity comes in quickly so the rising "reflection" is visible as it swings up.
  return {
    default: { ...stackSpring, delay },
    rotateX: flipSpring,
    opacity: { duration: 0.32, ease: 'easeOut', delay },
    ...resize,
  }
}

/**
 * Hover / keyboard-focus lift. A CSS transition on a plain (non-motion) wrapper, so motion's
 * projection never sees it: the open morph measures the card where it visually is, scaled or not.
 * Tailwind's hover: is (hover: hover)-gated, so touch never sticks; motion-safe: drops it for reduced motion.
 */
const cardLift =
  'transition-[scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:scale-[1.03] motion-safe:has-[:focus-visible]:scale-[1.02]'

export function RolodexCard({ project, depth, zone, maxVisible, radius, cardWidth, cardHeight, reduced, onOpen, onBring }: Props) {
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

  const lastHeight = useRef(cardHeight)
  const resized = lastHeight.current !== cardHeight
  useEffect(() => {
    lastHeight.current = cardHeight
  }, [cardHeight])

  const z = zone === 'fallen' ? 200 : zone === 'back' ? 0 : 100 - depth
  // The fallen card stays fairly bright so its mirrored underside reads as a reflection.
  const dim = zone === 'stack' ? DIM[Math.min(depth, DIM.length - 1)] : zone === 'fallen' ? 0.25 : DIM[DIM.length - 1]

  return (
    <motion.div
      className="col-start-1 row-start-1"
      // Size comes from cardSize (Rolodex). Bottom-centre origin as motion values (not CSS transform-origin): see stackPose.
      style={{ width: cardWidth, height: cardHeight, zIndex: z, originX: 0.5, originY: 1, pointerEvents: hidden ? 'none' : 'auto' }}
      initial={isVisibleBack ? poseFor('back', depth, maxVisible, cardHeight, reduced) : false}
      animate={poseFor(zone, depth, maxVisible, cardHeight, reduced)}
      transition={transitionFor(zone, reduced, delay, resized)}
      aria-hidden={hidden || undefined}
    >
      {/* Hover / focus lift lives on this plain wrapper, never on the posed motion.div: see cardLift. */}
      <div className={`relative h-full w-full ${cardLift}`}>
        <motion.button
          type="button"
          layoutId={`card-${project.slug}`}
          layoutCrossfade={false}
          // Only measure for the shared-element morph when the stack leaves (a project opens). Without
          // this every activeIndex change snapshots every card in the LayoutGroup.
          layoutDependency={isPresent}
          transition={morphTransition(reduced)}
          onClick={isFront ? onOpen : onBring}
          tabIndex={isFront ? 0 : -1}
          data-rolodex-front={isFront ? '' : undefined}
          aria-label={isFront ? `Open project ${project.title}` : `Bring ${project.title} to front`}
          className="absolute inset-0 block cursor-pointer overflow-hidden bg-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
          // borderRadius via style so motion mixes + scale-corrects it during the shared morph, which it
          // does linearly in px with the morph's progress. Closing (this card is the lead), PILL_RADIUS:
          // the mixed value passes half the box height within a frame and CSS clamps oversized radii
          // to half the shorter side, so the card is a pill of its current visual size throughout.
          // Opening (this card is the follow, the banner leads with 0), the exact pill radius, so the
          // corners square off progressively rather than snapping at the end. Both render identically at rest.
          style={{ borderRadius: isPresent ? PILL_RADIUS : radius }}
        >
          {/* The image keeps a fixed 2:1 aspect and is centred in a clipping box. Its own layoutId
              morph is therefore a uniform scale (no stretching) while the parent's clip morphs. */}
          <span className="absolute inset-0 flex items-center justify-center">
            <motion.img
              layoutId={`cover-${project.slug}`}
              layoutCrossfade={false}
              layoutDependency={isPresent}
              transition={morphTransition(reduced)}
              src={project.cover}
              alt=""
              draggable={false}
              decoding="async"
              // The front cover is the LCP element; everything else can wait its turn.
              fetchPriority={isFront ? 'high' : 'low'}
              loading={zone === 'stack' ? 'eager' : 'lazy'}
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
        {/* Fit: the wrapper is a size container (cqw = % of card width). The title wraps to at most two
            balanced lines within --title-measure (at most the middle 64% of the card, the part of the pill
            clear of its round ends), and long titles step down in size via --title-k (see titleFit). The 9cqw cap only
            bites on height-capped (landscape phone) cards, where 7vw would outgrow the pill. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center [container-type:inline-size]"
          initial={false}
          animate={{ opacity: isFront ? 1 : 0 }}
          transition={{ duration: isFront ? 0.3 : zone === 'fallen' ? 0.4 : 0.2, ease: 'easeOut' }}
        >
          <span
            ref={titleRef}
            data-title-morph={project.slug}
            className="block max-w-[var(--title-measure,64cqw)] text-balance text-center text-[calc(min(clamp(24px,7vw,40px),9cqw)*var(--title-k,1))] font-medium leading-[1.08] tracking-[-0.045em] text-white"
            style={{
              ...titleFitStyle(project.title),
              textShadow: '0 1px 18px rgba(0,0,0,0.28)',
              visibility: isPresent ? undefined : 'hidden',
            }}
          >
            <TitleWords title={project.title} />
          </span>
        </motion.span>
      </div>
    </motion.div>
  )
}
