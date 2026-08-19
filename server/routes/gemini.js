import { Router } from 'express'
import { forwardToGemini } from '../services/geminiProxy.js'

const router = Router()

router.use(async (req, res) => {
  try {
    const { status, contentType, body } = await forwardToGemini({
      path: req.originalUrl.replace(/^\/api\/gemini/, ''),
      method: req.method,
      body: req.body
    })
    res.status(status).type(contentType || 'application/json').send(body)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: { message: e.message } })
  }
})

export default router