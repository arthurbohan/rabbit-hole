import db from '../db.js'

const selectAll = db.prepare(
  'SELECT item_id AS id, name, track, from_name AS "from", relation FROM crate_items WHERE user_id = ? ORDER BY created_at DESC'
)
const upsert = db.prepare(`
  INSERT INTO crate_items (user_id, item_id, name, track, from_name, relation)
  VALUES (?, ?, ?, ?, ?, ?)
  ON CONFLICT(user_id, item_id) DO NOTHING
`)
const remove = db.prepare('DELETE FROM crate_items WHERE user_id = ? AND item_id = ?')

export function getCrate(userId) {
  return selectAll.all(userId)
}

export function upsertCrateItems(userId, items) {
  for (const item of items) {
    upsert.run(userId, item.id, item.name, item.track || '', item.from || '', item.relation || '')
  }
  return getCrate(userId)
}

export function removeCrateItem(userId, itemId) {
  remove.run(userId, itemId)
}
