import type { Transition } from 'motion/react'

/**
 * Shared motion constants for the Rolodex + shared-element morph.
 * Springs (not tweens) everywhere a gesture can interrupt, so a retarget
 * mid-flight inherits velocity instead of snapping.
 */

/** Cards advancing one depth in the stack: near-critically damped (ζ ≈ 0.95), crisp settle ~0.5s. */
export const stackSpring: Transition = { type: 'spring', stiffness: 240, damping: 29, mass: 1 }

/** The front card tipping toward the viewer and falling away (or swinging back up). Heavier = weightier. */
export const flipSpring: Transition = { type: 'spring', stiffness: 120, damping: 20, mass: 1.15 }

/** Pill -> banner / title -> headline shared-element morph. Critically damped (ζ ≈ 1), ~0.9s: unhurried, no overshoot on the big headline. */
export const morphSpring: Transition = { type: 'spring', stiffness: 95, damping: 19.5, mass: 1 }

/** Title morph, leading axis when the title re-wraps into different lines (see useTitleMorph): stiffer, still critically damped. */
export const morphLeadSpring: Transition = { type: 'spring', stiffness: 260, damping: 32, mass: 1 }

export const easeOutExpo = [0.16, 1, 0.3, 1] as const
export const easeIn = [0.55, 0, 0.8, 0.35] as const

/** Stack geometry. */
export const MAX_VISIBLE_DEPTH = 3
export const SCALE_STEP = 0.92
/** Cumulative fraction of a card's height that each depth peeks above the card in front. */
export const PEEK = [0, 0.17, 0.31, 0.43, 0.53]
/** Black overlay opacity per depth (dims cards further back). */
export const DIM = [0, 0.28, 0.48, 0.64, 0.8]

/** Delay before the detail body blur-ins, so the morph leads. */
export const BODY_DELAY = 0.32
