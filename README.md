# Jonathan Corpuz — Portfolio

A modern portfolio site showcasing software engineering projects. Built with Vite, React, TypeScript, Tailwind CSS, and Motion (Framer Motion).

Scroll, swipe or use the arrow keys to flip through the stack; Enter (or a click) opens a project, Esc closes it.

## Setup

Install dependencies:

```bash
npm install
```

## Development

Start the dev server:

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

Build for production:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Editing content

Project data lives in `src/data/projects.ts`. Each project includes:
- Title, year, and kind
- Tagline and summary
- Detailed sections
- Role, timeline, and tech stack
- Links to GitHub and live demos
- Cover image

The same file holds the site name/links (`site`) and the About page copy (`about`).

Covers live in `src/assets/covers/` as WebP (~1600×700, 2.2:1-ish; they are cropped to a pill on
the home page and to a 110px banner on project pages). Add a new file there and import it in
`src/data/projects.ts`.

## TODO before deploying

- [x] Real projects, About bio and contact links in `src/data/projects.ts`.
- [ ] Point each project's GitHub link at its repo (they currently link to the profile), and add
      Live / App Store links where they exist (marked `TODO(jono)`).
- [ ] Add `og:url` and an absolute `og:image` in `index.html` once the site has a URL.

## Routes

Hash-based, so it works on any static host without rewrites:

- `#/` — the project stack
- `#/project/<slug>` — a project page
- `#/about` — about

## Linting

Run the linter:

```bash
npm run lint
```
