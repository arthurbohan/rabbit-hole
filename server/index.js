import { createApp } from './app.js'

const PORT = process.env.PORT || 3000

createApp().listen(PORT, () => {
  console.log(`Rabbit Hole server listening on http://localhost:${PORT}`)
})