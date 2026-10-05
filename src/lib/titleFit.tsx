import { Fragment, type CSSProperties } from 'react'

/**
 * Length-aware type for project titles (card title and detail headline).
 *
 * A pure function of the title, applied as CSS variables, so there is no measuring: no first-paint
 * flash, no re-fit when the web font swaps in, correct at every viewport width, and nothing to do
 * while the stack animates.
 *  - `--title-k` (card title) and `--headline-k` (detail headline) multiply each element's own fluid
 *    font size. Short titles (the common case, e.g. "Gauge") keep k = 1, i.e. exactly the original
 *    sizes; longer ones step down a little, so the headline never gets absurdly tall.
 *  - `--title-measure` is the card title's max line length in % of the card width (cqw). 64 keeps any
 *    line inside the pill's flat middle, clear of the round ends. The longest titles get a narrower
 *    measure so they always set as two balanced lines (at every viewport) rather than one long
 *    line on desktop and two on phones.
 */
export function titleFit(title: string): { k: number; measure: number; headlineK: number } {
  const n = title.length
  if (n <= 12) return { k: 1, measure: 64, headlineK: 1 }
  if (n <= 18) return { k: 0.88, measure: 64, headlineK: 0.88 }
  // Two short lines on the card can stay near full size.
  return { k: 0.9, measure: 46, headlineK: 0.84 }
}

export function titleFitStyle(title: string): CSSProperties {
  const { k, measure, headlineK } = titleFit(title)
  return { '--title-k': k, '--title-measure': `${measure}cqw`, '--headline-k': headlineK } as CSSProperties
}

/**
 * Renders a title as one inline-block span per word (`data-title-word`), separated by normal
 * spaces so the text still wraps / balances like plain text. useTitleMorph FLIPs each word on its
 * own, so a title can morph between different line structures (2-line card -> 3-line headline)
 * without the whole block being squashed or a line jumping.
 */
export function TitleWords({ title }: { title: string }) {
  const words = title.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 ? ' ' : null}
          <span data-title-word="" className="inline-block">
            {w}
          </span>
        </Fragment>
      ))}
    </>
  )
}
