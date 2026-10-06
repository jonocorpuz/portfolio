import { projects } from '../data/projects'
import type { Project } from '../types'
import { Figure } from './Figure'
import { Chips, Lead, LinkChip, MetaRow, pageGrid, prose, ring } from './ui'

export function ProjectDetailBody({ project }: { project: Project }) {
  const idx = projects.findIndex((p) => p.slug === project.slug)
  const next = idx >= 0 && projects.length > 1 ? projects[(idx + 1) % projects.length] : null

  return (
    <div className={`${pageGrid} gap-10 pb-40 pt-6 lg:pt-12`}>
      <Lead label="overview">{project.tagline}</Lead>

      <div className={`order-3 lg:order-none ${prose}`}>
        <p>{project.summary}</p>
        {project.sections.map((s) => (
          <section key={s.heading} className="mt-12">
            <h2 className="mb-4 text-[15px] font-bold text-white sm:text-[16px]">{s.heading}</h2>
            <div className="space-y-4">
              {s.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {s.image && <Figure image={s.image} />}
          </section>
        ))}
        {next && (
          <a
            href={`#/project/${encodeURIComponent(next.slug)}`}
            className={`mt-20 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10 ${ring}`}
          >
            Next project: {next.title} <span aria-hidden>→</span>
          </a>
        )}
      </div>

      <dl className="order-2 space-y-6 text-[14px] leading-snug lg:order-none">
        <MetaRow label="Role">{project.role}</MetaRow>
        <MetaRow label="Timeline">{project.timeline}</MetaRow>
        <MetaRow label="Stack" chips>
          <Chips items={project.stack} />
        </MetaRow>
        {project.links.length > 0 && (
          <MetaRow label="Links" chips>
            {project.links.map((l) => (
              <LinkChip key={l.label} link={l} />
            ))}
          </MetaRow>
        )}
      </dl>
    </div>
  )
}
