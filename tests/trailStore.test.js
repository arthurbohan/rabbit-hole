import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { getTrail, saveTrail } from '../server/services/trailStore.js'

before(() => {
  db.prepare(
    "INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (2, 'sub2', 'b@c.com', 'Test2')"
  ).run()
})

beforeEach(() => {
  db.prepare('DELETE FROM trail_state WHERE user_id = 2').run()
})

test('getTrail returns null when nothing is saved', () => {
  assert.equal(getTrail(2), null)
})

test('saveTrail then getTrail round-trips the same state', () => {
  const state = { current: { name: 'Test' }, branches: [], trail: [] }
  saveTrail(2, state)
  assert.deepEqual(getTrail(2), state)
})

test('saveTrail overwrites the previous state for that user', () => {
  saveTrail(2, { current: { name: 'First' }, branches: [], trail: [] })
  saveTrail(2, { current: { name: 'Second' }, branches: [], trail: [] })
  assert.equal(getTrail(2).current.name, 'Second')
})
