import { useLayoutEffect, type RefObject } from 'react'
import { animate, type animateMini } from 'motion/react'
import { morphSpring, morphLeadSpring } from './motion'

type DomAnimationOptions = Parameters<typeof animateMini>[2]
type Controls = ReturnType<typeof animate>

const WORD = '[data-title-word]'

/**
 * Title morph (card title <-> detail headline), FLIPped word by word.
 *
 * Motion's `layoutId` crossfades the outgoing and incoming elements, which for two pieces of text
 * of different size/weight reads as a blurry double image. Instead, the *incoming* title measures
 * the outgoing one (still mounted while AnimatePresence plays its exit) and FLIPs itself from that
 * rect to its own layout with a transform. The outgoing title hides itself as soon as it starts
 * exiting (see `data-title-morph` callers), so only one copy of the text is ever visible.
 *
 * Titles can wrap differently in the two places (a 2-line centred card title vs a 2-3 line,
 * left-aligned headline), so a single transform on the whole block would start from the wrong
 * line structure. Each word (see TitleWords) is therefore FLIPped on its own: every word uses the
 * same uniform scale (the font-size ratio) and spring, starts centred on its counterpart in the
 * outgoing title, and settles into its own line. Words that share a line in both places move as
 * one; a word that changes line glides to it. No word is ever stretched.
 */
export function useTitleMorph(
  ref: RefObject<HTMLElement | null>,
  slug: string,
  enabled: boolean,
  reduced: boolean,
) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const from = Array.from(document.querySelectorAll<HTMLElement>('[data-title-morph]')).find(
      (n) => n !== el && n.dataset.titleMorph === slug,
    )
    if (!from) return

    const fromWords = Array.from(from.querySelectorAll<HTMLElement>(WORD))
    const toWords = Array.from(el.querySelectorAll<HTMLElement>(WORD))
    // Same title on both sides, so this only fails if the markup is changed; fall back to the block.
    const pairs: [HTMLElement, HTMLElement][] =
      fromWords.length && fromWords.length === toWords.length
        ? toWords.map((w, i) => [fromWords[i], w])
        : [[from, el]]

    const fontA = parseFloat(getComputedStyle(from).fontSize)
    const fontB = parseFloat(getComputedStyle(el).fontSize)
    if (!fontA || !fontB) return

    // Measure everything before writing: outgoing words as they appear now, incoming words untransformed.
    const outgoing = pairs.map(([a]) => ({ rect: a.getBoundingClientRect(), layoutWidth: a.offsetWidth }))
    if (outgoing.some((o) => !o.rect.width || !o.layoutWidth)) return
    pairs.forEach(([, b]) => (b.style.transform = 'none'))
    const targets = pairs.map(([, b], i) => {
      const { rect: a, layoutWidth } = outgoing[i]
      const r = b.getBoundingClientRect()
      // Uniform scale = on-screen font-size ratio. The outgoing word may sit under a scaled card or be
      // mid-morph itself, so its on-screen scale comes from its rect vs its layout width.
      const s = (fontA * (a.width / layoutWidth)) / fontB
      // Origin top-left: the word, scaled by s, sits centred on its outgoing counterpart.
      return { b, s, top: r.top, x: a.left + a.width / 2 - (r.left + (r.width * s) / 2), y: a.top + a.height / 2 - (r.top + (r.height * s) / 2) }
    })

    // Do the two titles break into lines the same way? (Line index of each word from its top edge.)
    const lineOf = (tops: number[]) => {
      let line = 0
      return tops.map((t, i) => (i > 0 && t > tops[i - 1] + 2 ? ++line : line))
    }
    const linesA = lineOf(outgoing.map((o) => o.rect.top))
    const linesB = lineOf(targets.map((t) => t.top))
    const relayout = linesA.some((l, i) => l !== linesB[i])

    // When a word changes line, the two lines involved must not slide through each other while the
    // title is still small. Splitting into more lines (a one-line card title -> a two-line headline):
    // lead with the vertical move so the lines separate before the words spread out sideways.
    // Merging into fewer lines (headline -> card): lead with the horizontal move (and the scale, which
    // has to stay in step with x so words on one line keep their spacing), so each word reaches its
    // place along the line before the lines close up.
    const splitting = linesB[linesB.length - 1] > linesA[linesA.length - 1]
    const options = (
      reduced
        ? { duration: 0.12 }
        : !relayout
          ? morphSpring
          : splitting
            ? { ...morphSpring, y: morphLeadSpring }
            : { ...morphSpring, x: morphLeadSpring, scale: morphLeadSpring }
    ) as DomAnimationOptions
    const controls: Controls[] = targets.map(({ b, s, x, y }) => {
      b.style.transformOrigin = '0 0'
      // Start pose written synchronously, so the frame before motion's first render can't show the
      // word at its final layout.
      b.style.transform = `translateX(${x}px) translateY(${y}px) scale(${s})`
      return animate(b, { x: [x, 0], y: [y, 0], scale: [s, 1] }, options)
    })
    // Interrupted (e.g. the stack flips while the title is still flying back): jump to the end pose.
    // Stopping would leave each word frozen mid-flight, still offset when the card returns to the front.
    return () => controls.forEach((c) => c.complete())
  }, [ref, slug, enabled, reduced])
}
