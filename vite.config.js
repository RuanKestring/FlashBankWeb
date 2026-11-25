import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const pageEntries = readdirSync(resolve(projectRoot, 'pages'))
  .filter((file) => file.endsWith('.html'))
  .map((file) => resolve(projectRoot, 'pages', file))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Produz um HTML separado para cada rota React.
  build: {
    rollupOptions: {
      input: [resolve(projectRoot, 'index.html'), ...pageEntries],
    },
  },
})
