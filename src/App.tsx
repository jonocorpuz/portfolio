import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { projects } from './data/projects'
import { Footer, Header } from './components/Chrome'
import { Rolodex } from './components/Rolodex'
import { ProjectView } from './components/ProjectView'
import { AboutView } from './components/AboutView'
import { useHashRoute } from './hooks/useHashRoute'
import { useStackNavigation } from './hooks/useStackNavigation'

const indexOfSlug = (slug: string | null) => (slug ? projects.findIndex((p) => p.slug === slug) : -1)
const n = projects.length

export default function App() {
  const reduced = useReducedMotion() ?? false
  const { route, openSlug, open, close } = useHashRoute()

  const [active, setActive] = useState(() => Math.max(0, indexOfSlug(openSlug)))

  // Keep the stack index in sync with the route (deep links, "next project" hops, back/forward)
  // so closing always collapses into the card that was open. Adjusting state during render.
  const [syncedSlug, setSyncedSlug] = useState(openSlug)
  if (openSlug !== syncedSlug) {
    setSyncedSlug(openSlug)
    const i = indexOfSlug(openSlug)
    if (i >= 0 && i !== active) setActive(i)
  }

  const openIndex = indexOfSlug(openSlug)
  const openProject = openIndex >= 0 ? projects[openIndex] : null
  const isAbout = route.name === 'about'
  const isHome = !openProject && !isAbout

  // Once the visitor has left the stack, returning to it hands focus back to the front card.
  const [hasLeftHome, setHasLeftHome] = useState(!isHome)
  if (!isHome && !hasLeftHome) setHasLeftHome(true)

  useEffect(() => {
    const base = 'Jono Corpuz — Software Engineer'
    document.title = openProject ? `${openProject.title} — Jono Corpuz` : isAbout ? 'About — Jono Corpuz' : base
  }, [openProject, isAbout])

  // Unknown slug -> home (clean the URL).
  useEffect(() => {
    if (openSlug && !openProject) close()
  }, [openSlug, openProject, close])

  const next = useCallback(() => setActive((a) => (a + 1) % n), [])
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [])
  const openActive = useCallback(() => open(projects[active].slug), [open, active])

  useStackNavigation({ count: n, enabled: isHome, onNext: next, onPrev: prev, onOpen: openActive })

  return (
    <>
      <Header onHome={isHome ? undefined : close} overlay={!!openProject} current={isAbout ? 'about' : undefined} />
      <LayoutGroup>
        <AnimatePresence>
          {openProject ? (
            <ProjectView key="detail" project={openProject} reduced={reduced} onClose={close} />
          ) : isAbout ? (
            <AboutView key="about" reduced={reduced} onClose={close} />
          ) : (
            <Home
              key="home"
              active={active}
              reduced={reduced}
              restoreFocus={hasLeftHome}
              onOpen={openActive}
              onBring={setActive}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </>
  )
}

function Home({
  active,
  reduced,
  restoreFocus,
  onOpen,
  onBring,
}: {
  active: number
  reduced: boolean
  restoreFocus: boolean
  onOpen: () => void
  onBring: (i: number) => void
}) {
  const isPresent = useIsPresent()
  return (
    <motion.div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: isPresent ? 30 : 20 }}
      initial={false}
      exit={{ opacity: 0, transition: { duration: reduced ? 0.15 : 0.35, ease: 'easeOut' } }}
    >
      <Rolodex
        projects={projects}
        active={active}
        reduced={reduced}
        focusOnMount={restoreFocus}
        onOpen={onOpen}
        onBring={onBring}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: reduced ? 0 : 0.25 } }}
      >
        <Footer project={projects[active]} index={active} total={n} />
      </motion.div>
    </motion.div>
  )
}
