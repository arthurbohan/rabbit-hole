import express from 'express'
import session from 'express-session'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import geminiRouter from './routes/gemini.js'
import authRouter from './routes/auth.js'
import crateRouter from './routes/crate.js'
import previewRouter from './routes/preview.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')

export function createApp() {
  const app = express()

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: Boolean(process.env.PUBLIC_URL?.startsWith('https://'))
    }
  }))

  app.use('/api/gemini', express.raw({ type: '*/*', limit: '1mb' }), geminiRouter)
  app.use('/api/auth', express.json(), authRouter)
  app.use('/api/crate', express.json(), crateRouter)
  app.use('/api/preview', previewRouter)
  app.use(express.static(distDir))

  return app
}
