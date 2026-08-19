import db from '../db.js'

const findBySub = db.prepare('SELECT * FROM users WHERE google_sub = ?')
const insert = db.prepare('INSERT INTO users (google_sub, email, name) VALUES (?, ?, ?)')
const findById = db.prepare('SELECT * FROM users WHERE id = ?')

export function findOrCreateUser({ sub, email, name }) {
  const existing = findBySub.get(sub)
  if (existing) return existing

  const { lastInsertRowid } = insert.run(sub, email, name || '')
  return findById.get(lastInsertRowid)
}

export function getUserById(id) {
  return findById.get(id)
}
