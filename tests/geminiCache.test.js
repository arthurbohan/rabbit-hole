import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { getCached, setCached } from '../server/services/geminiCache.js'

beforeEach(() => {
  db.prepare('DELETE FROM gemini_cache').run()
})

test('getCached returns null on a cache miss', () => {
  assert.equal(getCached('/v1beta/interactions', Buffer.from('{"a":1}')), null)
})

test('setCached then getCached returns what was stored', () => {
  const body = Buffer.from('{"a":1}')
  const response = Buffer.from('{"status":"completed"}')
  setCached('/v1beta/interactions', body, 'application/json', response)

  const cached = getCached('/v1beta/interactions', body)
  assert.ok(cached)
  assert.equal(cached.contentType, 'application/json')
  assert.deepEqual(cached.body, response)
})

test('a different request body misses the cache', () => {
  setCached('/v1beta/interactions', Buffer.from('{"a":1}'), 'application/json', Buffer.from('one'))
  assert.equal(getCached('/v1beta/interactions', Buffer.from('{"a":2}')), null)
})

test('a different path misses the cache even with the same body', () => {
  const body = Buffer.from('{"a":1}')
  setCached('/v1beta/interactions', body, 'application/json', Buffer.from('one'))
  assert.equal(getCached('/other/path', body), null)
})

test('setCached sweeps entries older than 30 days', () => {
  db.prepare(
    "INSERT INTO gemini_cache (cache_key, content_type, body, created_at) VALUES ('old-key', 'text', 'x', datetime('now', '-35 days'))"
  ).run()

  setCached('/v1beta/interactions', Buffer.from('{"a":1}'), 'application/json', Buffer.from('fresh'))

  const stale = db.prepare('SELECT * FROM gemini_cache WHERE cache_key = ?').get('old-key')
  assert.equal(stale, undefined)
})

test('setCached does not sweep entries within 30 days', () => {
  db.prepare(
    "INSERT INTO gemini_cache (cache_key, content_type, body, created_at) VALUES ('recent-key', 'text', 'x', datetime('now', '-1 days'))"
  ).run()

  setCached('/v1beta/interactions', Buffer.from('{"a":1}'), 'application/json', Buffer.from('fresh'))

  const recent = db.prepare('SELECT * FROM gemini_cache WHERE cache_key = ?').get('recent-key')
  assert.ok(recent)
})
