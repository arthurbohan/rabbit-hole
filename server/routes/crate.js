import { Router } from 'express'
import { getCrate, upsertCrateItems, removeCrateItem } from '../services/crateStore.js'

const router = Router()

router.use((req, res, next) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' })
  next()
})

router.get('/', (req, res) => {
  res.json({ items: getCrate(req.session.userId) })
})

router.post('/', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : []
  res.json({ items: upsertCrateItems(req.session.userId, items) })
})

router.delete('/:itemId', (req, res) => {
  removeCrateItem(req.session.userId, req.params.itemId)
  res.status(204).end()
})

export default router
