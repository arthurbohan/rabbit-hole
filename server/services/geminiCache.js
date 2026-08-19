import crypto from 'node:crypto'
import db from '../db.js'

const selectCached = db.prepare('SELECT content_type, body FROM gemini_cache WHERE cache_key = ?')
const insertCached = db.prepare(
  'INSERT OR REPLACE INTO gemini_cache (cache_key, content_type, body) VALUES (?, ?, ?)'
)

function keyFor(path, requestBody) {
  return crypto.createHash('sha256').update(path).update(requestBody).digest('hex')
}

export function getCached(path, requestBody) {
  const row = selectCached.get(keyFor(path, requestBody))
  return row ? { contentType: row.content_type, body: Buffer.from(row.body) } : null
}

export function setCached(path, requestBody, contentType, responseBody) {
  insertCached.run(keyFor(path, requestBody), contentType, responseBody)
}
