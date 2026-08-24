import crypto from 'node:crypto'
import db from '../db.js'

const selectCached = db.prepare('SELECT content_type, body FROM gemini_cache WHERE cache_key = ?')
const insertCached = db.prepare(
  'INSERT OR REPLACE INTO gemini_cache (cache_key, content_type, body) VALUES (?, ?, ?)'
)
// No freshness concern — an identical prompt gets an identical cache key
// regardless of age, so this is purely a bound on disk growth, not a TTL
// in the "might be stale" sense. Runs on every write rather than on a
// schedule, since writes only happen on genuine cache misses already.
const deleteStale = db.prepare("DELETE FROM gemini_cache WHERE created_at < datetime('now', '-30 days')")

function keyFor(path, requestBody) {
  return crypto.createHash('sha256').update(path).update(requestBody).digest('hex')
}

export function getCached(path, requestBody) {
  const row = selectCached.get(keyFor(path, requestBody))
  return row ? { contentType: row.content_type, body: Buffer.from(row.body) } : null
}

export function setCached(path, requestBody, contentType, responseBody) {
  insertCached.run(keyFor(path, requestBody), contentType, responseBody)
  deleteStale.run()
}
