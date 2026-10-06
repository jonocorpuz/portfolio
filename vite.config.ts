import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [tailwindcss(), react()],
  // GitHub Pages serves the site from /portfolio/ (builds and `vite preview`); dev stays at the root.
  base: command === 'build' || isPreview ? '/portfolio/' : '/',
}))
