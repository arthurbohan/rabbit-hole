import { Router } from 'express'
import { getTrail, saveTrail } from '../services/trailStore.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

export function isValidState(state) {
  if (!state || typeof state !== 'object') return false
  const { current, branches, trail } = state
  if (current != null && (typeof current !== 'object' || typeof current.name !== 'string')) {
    return false
  }
  return Array.isArray(branches) && Array.isArray(trail)
}

router.get('/', (req, res) => {
  try {
    res.json({ state: getTrail(req.session.userId) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not load trail' })
  }
})

router.put('/', (req, res) => {
  const state = req.body?.state
  if (!isValidState(state)) {
    return res.status(400).json({ error: 'state must be { current, branches, trail }' })
  }
  try {
    saveTrail(req.session.userId, state)
    res.json({ state })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not save trail' })
  }
})

export default router
