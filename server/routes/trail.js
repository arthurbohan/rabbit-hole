import { Router } from 'express'
import { getTrail, saveTrail } from '../services/trailStore.js'

const router = Router()

router.use((req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' })
  next()
})

router.get('/', (req, res) => {
  res.json({ state: getTrail(req.session.userId) })
})

router.put('/', (req, res) => {
  const state = req.body?.state
  if (!state || typeof state !== 'object') {
    return res.status(400).json({ error: 'Missing state' })
  }
  saveTrail(req.session.userId, state)
  res.json({ state })
})

export default router
