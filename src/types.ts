export interface ProjectLink {
  label: string
  href: string
}

/** A screenshot shown after a section's text. Leave `src` unset to show a placeholder frame. */
export interface ProjectImage {
  src?: string
  /** Describes the screenshot; also shown inside the placeholder until `src` is set. */
  alt: string
  caption?: string
}

export interface ProjectSection {
  heading: string
  body: string[]
  image?: ProjectImage
}

export interface Project {
  slug: string
  title: string
  label: string
  year: string
  kind: string
  tagline: string
  summary: string
  sections: ProjectSection[]
  role: string
  timeline: string
  stack: string[]
  links: ProjectLink[]
  cover: string
}

export interface SiteInfo {
  name: string
  links: ProjectLink[]
}

export interface AboutInfo {
  tagline: string
  bio: string[]
  skills: { heading: string; items: string[] }[]
  education: { degree: string; school: string; years: string }
  contact: ProjectLink[]
}
