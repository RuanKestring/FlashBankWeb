import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const legacyPages = readdirSync(resolve(projectRoot, 'pages'))
  .filter((file) => file.endsWith('.html'))
  .map((file) => resolve(projectRoot, 'pages', file))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Mantém as páginas ainda não migradas disponíveis no build durante a transição.
  build: {
    rollupOptions: {
      input: [resolve(projectRoot, 'index.html'), ...legacyPages],
    },
  },
})
