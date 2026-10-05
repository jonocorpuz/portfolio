import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { projects } from './data/projects'
import { Footer, Header } from './components/Chrome'
import { Rolodex } from './components/Rolodex'
import { ProjectView } from './components/ProjectView'
import { useHashRoute } from './hooks/useHashRoute'
import { useStackNavigation } from './hooks/useStackNavigation'

const indexOfSlug = (slug: string | null) => (slug ? projects.findIndex((p) => p.slug === slug) : -1)
const n = projects.length

export default function App() {
  const reduced = useReducedMotion() ?? false
  const { openSlug, open, close } = useHashRoute()

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

  // Unknown slug -> home (clean the URL).
  useEffect(() => {
    if (openSlug && !openProject) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/')
    }
  }, [openSlug, openProject])

  const next = useCallback(() => setActive((a) => (a + 1) % n), [])
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [])
  const openActive = useCallback(() => open(projects[active].slug), [open, active])

  useStackNavigation({ count: n, enabled: !openProject, onNext: next, onPrev: prev, onOpen: openActive })

  return (
    <>
      <Header onHome={openProject ? close : undefined} overlay={!!openProject} />
      <LayoutGroup>
        <AnimatePresence>
          {openProject ? (
            <ProjectView key="detail" project={openProject} reduced={reduced} onClose={close} />
          ) : (
            <Home key="home" active={active} reduced={reduced} onOpen={openActive} onBring={setActive} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </>
  )
}

function Home({
  active,
  reduced,
  onOpen,
  onBring,
}: {
  active: number
  reduced: boolean
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
      <Rolodex projects={projects} active={active} reduced={reduced} onOpen={onOpen} onBring={onBring} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: reduced ? 0 : 0.25 } }}
      >
        <Footer project={projects[active]} index={active} total={n} />
      </motion.div>
    </motion.div>
  )
}
