import { projects } from './data/projects'

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Jono Corpuz — Software Engineer</h1>
        <div className="grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.slug} className="p-4 border border-white/20 rounded">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-sm text-white/55 mt-2">{project.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
