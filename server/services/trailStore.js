import db from '../db.js'

const select = db.prepare('SELECT state FROM trail_state WHERE user_id = ?')
const upsert = db.prepare(`
  INSERT INTO trail_state (user_id, state, updated_at)
  VALUES (?, ?, datetime('now'))
  ON CONFLICT(user_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
`)

export function getTrail(userId) {
  const row = select.get(userId)
  if (!row) return null
  try {
    return JSON.parse(row.state)
  } catch {
    return null
  }
}

export function saveTrail(userId, state) {
  upsert.run(userId, JSON.stringify(state))
}
