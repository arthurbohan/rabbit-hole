import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { forwardToGemini } from '../services/geminiProxy.js'

const router = Router()

// Matches Gemini's own free-tier ceiling (20 RPM), shared across every
// visitor of this app — capping per-IP here stops one client from eating
// the whole app's budget alone.
router.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false
  })
)

// Only this one endpoint is exposed — the proxy forwards whatever path it's
// given, so without this the whole Gemini API surface would be reachable
// through our key. Anything else here 404s.
router.post('/v1beta/interactions', async (req, res) => {
  try {
    const { status, contentType, body } = await forwardToGemini({
      path: '/v1beta/interactions',
      method: 'POST',
      body: req.body
    })
    res.status(status).type(contentType || 'application/json').send(body)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: { message: e.message } })
  }
})

export default router
