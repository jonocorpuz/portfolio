import type { ProjectImage } from '../types'

const frame = 'aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900'

/**
 * A project screenshot at a fixed 16:10, full width of the text column. Without a `src` it renders a
 * placeholder frame of the same size that shows the alt text, so the layout is real before the
 * screenshot exists.
 */
export function Figure({ image }: { image: ProjectImage }) {
  return (
    <figure className="mt-8">
      {image.src ? (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`${frame} object-cover`}
        />
      ) : (
        <div
          role="img"
          aria-label={`Screenshot coming soon: ${image.alt}`}
          className={`${frame} flex items-center justify-center bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent p-6`}
        >
          <p className="max-w-[36ch] text-balance text-center text-[12px] leading-snug text-white/35 sm:text-[13px]">
            {image.alt}
          </p>
        </div>
      )}
      {image.caption && (
        <figcaption className="mt-3 text-[13px] leading-snug text-white/50">{image.caption}</figcaption>
      )}
    </figure>
  )
}
