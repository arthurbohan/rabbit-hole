import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The API key must never reach the browser. The dev server acts as a thin
// proxy: the app calls /api/gemini, Vite forwards it to Google and attaches
// the key from .env along the way.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/gemini/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (!env.GEMINI_API_KEY) return
              proxyReq.setHeader('x-goog-api-key', env.GEMINI_API_KEY)
            })
          }
        }
      }
    }
  }
})