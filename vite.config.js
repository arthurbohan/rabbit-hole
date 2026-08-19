import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// All /api routes (Gemini proxy, auth, crate) are implemented once in
// server/ (see npm run server:dev) and proxied through here in dev, so
// there's a single implementation shared by dev and production.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
