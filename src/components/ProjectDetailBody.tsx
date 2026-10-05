import { projects } from '../data/projects'
import type { Project } from '../types'

const chip = 'rounded-full border border-white/20 px-3 py-1 text-[13px] leading-none text-white/85'
const ring = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70'

export function ProjectDetailBody({ project }: { project: Project }) {
  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = idx >= 0 && projects.length > 1 ? projects[(idx + 1) % projects.length] : null

  return (
    <div className="grid grid-cols-1 gap-10 px-[18px] pb-40 pt-6 sm:px-10 lg:grid-cols-[220px_minmax(0,60ch)_220px] lg:justify-center lg:gap-x-12 lg:pt-12">
      <div className="lg:text-right">
        <p className="text-[13px] italic text-white/50">overview</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-white">{project.tagline}</p>
      </div>

      <div className="order-3 text-[15px] leading-[1.55] text-white/85 sm:text-[16px] lg:order-none">
        <p>{project.summary}</p>
        {project.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="mb-4 text-[15px] font-bold text-white sm:text-[16px]">{s.heading}</h2>
            <div className="space-y-4">
              {s.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        ))}
        {next && (
          <a
            href={`#/project/${next.slug}`}
            className={`mt-20 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10 ${ring}`}
          >
            Next project: {next.title} <span aria-hidden>→</span>
          </a>
        )}
      </div>

      <dl className="order-2 space-y-6 text-[14px] leading-snug lg:order-none">
        <div>
          <dt className="text-[13px] italic text-white/50">Role</dt>
          <dd className="mt-1 font-semibold text-white">{project.role}</dd>
        </div>
        <div>
          <dt className="text-[13px] italic text-white/50">Timeline</dt>
          <dd className="mt-1 font-semibold text-white">{project.timeline}</dd>
        </div>
        <div>
          <dt className="text-[13px] italic text-white/50">Stack</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className={chip}>
                {s}
              </span>
            ))}
          </dd>
        </div>
        {project.links.length > 0 && (
          <div>
            <dt className="text-[13px] italic text-white/50">Links</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.links.map((l) => {
                const external = /^https?:/.test(l.href)
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className={`${chip} transition-colors hover:bg-white/10 ${ring}`}
                  >
                    {l.label}
                    {external && <span aria-hidden> ↗</span>}
                  </a>
                )
              })}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
