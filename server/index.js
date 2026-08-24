import { createApp } from './app.js'

const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SESSION_SECRET',
  'PUBLIC_URL'
]

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key])
if (missing.length > 0) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`)
  console.error('Check your .env file.')
  process.exit(1)
}

const PORT = process.env.PORT || 3000

createApp().listen(PORT, () => {
  console.log(`Rabbit Hole server listening on http://localhost:${PORT}`)
})
