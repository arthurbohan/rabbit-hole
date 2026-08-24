import { Router } from 'express'
import { getCrate, upsertCrateItems, removeCrateItem } from '../services/crateStore.js'

const router = Router()

router.use((req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' })
  next()
})

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
  res.json({ items: getCrate(req.session.userId) })
})

router.post('/', (req, res) => {
  const items = req.body?.items
  if (!Array.isArray(items) || !items.every(isValidItem)) {
    return res.status(400).json({ error: 'items must be an array of { id, name, ... }' })
  }
  res.json({ items: upsertCrateItems(req.session.userId, items) })
})

router.delete('/:itemId', (req, res) => {
  removeCrateItem(req.session.userId, req.params.itemId)
  res.status(204).end()
})

export default router