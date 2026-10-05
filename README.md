# Jono Corpuz — Portfolio

A modern portfolio site showcasing software engineering projects. Built with Vite, React, TypeScript, Tailwind CSS, and Framer Motion.

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

## Editing Projects

Edit the project data in `src/data/projects.ts`. Each project includes:
- Title, year, and kind
- Tagline and summary
- Detailed sections
- Role, timeline, and tech stack
- Links to GitHub and live demos
- Cover image (SVG)

To replace the placeholder covers, add new SVG files to `src/assets/covers/` and import them in `src/data/projects.ts`.

## Linting

Run the linter:

```bash
npm run lint
```
