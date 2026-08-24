import { Router } from 'express'
import { getCrate, upsertCrateItems, removeCrateItem } from '../services/crateStore.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

function isValidItem(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.name === 'string' &&
    item.name.length > 0
  )
}

router.get('/', (req, res) => {
  try {
    res.json({ items: getCrate(req.session.userId) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not load crate' })
  }
})

router.post('/', (req, res) => {
  const items = req.body?.items
  if (!Array.isArray(items) || !items.every(isValidItem)) {
    return res.status(400).json({ error: 'items must be an array of { id, name, ... }' })
  }
  try {
    res.json({ items: upsertCrateItems(req.session.userId, items) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not save crate' })
  }
})

router.delete('/:itemId', (req, res) => {
  try {
    removeCrateItem(req.session.userId, req.params.itemId)
    res.status(204).end()
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not remove crate item' })
  }
})

export default router
