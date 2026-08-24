import { createApp } from './app.js'

// Only SESSION_SECRET actually fails silently if missing (express-session
// just signs cookies with an undefined secret). GEMINI_API_KEY,
// GOOGLE_CLIENT_ID/SECRET, and PUBLIC_URL already error clearly at the
// point of use — requiring them here too would block booting the app in
// any environment that doesn't need real credentials, e.g. E2E runs that
// mock the network at the browser level.
const REQUIRED_ENV_VARS = ['SESSION_SECRET']

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
