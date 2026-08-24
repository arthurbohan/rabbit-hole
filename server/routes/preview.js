import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { findPreviewUrl } from '../services/itunesPreview.js'

const router = Router()

// No real quota risk (free, unkeyed API) — this is mainly to stop the route
// being used as a generic open proxy to iTunes Search.
router.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false
  })
)

router.get('/', async (req, res) => {
  const term = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!term) return res.status(400).json({ error: 'Missing q' })

  try {
    const previewUrl = await findPreviewUrl(term)
    res.json({ previewUrl })
  } catch (e) {
    console.error(e)
    res.status(502).json({ error: e.message })
  }
})

export default router
