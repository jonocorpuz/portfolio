export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectSection {
  heading: string
  body: string[]
}

export interface Project {
  slug: string
  title: string
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
  blurb: string
  links: ProjectLink[]
}

export interface AboutInfo {
  tagline: string
  bio: string[]
  focus: string[]
  contact: ProjectLink[]
}
