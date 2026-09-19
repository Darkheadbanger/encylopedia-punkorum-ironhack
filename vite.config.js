/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom = a fake browser in Node, so components can render without Firefox
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
