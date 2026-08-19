import { Router } from 'express'
import { findPreviewUrl } from '../services/itunesPreview.js'

const router = Router()

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
