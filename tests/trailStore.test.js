import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { getTrail, saveTrail } from '../server/services/trailStore.js'

before(() => {
  db.prepare("INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (2, 'sub2', 'b@c.com', 'Test2')").run()
  db.prepare("INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (4, 'sub4', 'd@e.com', 'Test4')").run()
})

beforeEach(() => {
  db.prepare('DELETE FROM trail_state').run()
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

test('trail state is isolated between users', () => {
  saveTrail(2, { current: { name: 'User 2 position' }, branches: [], trail: [] })
  saveTrail(4, { current: { name: 'User 4 position' }, branches: [], trail: [] })

  assert.equal(getTrail(2).current.name, 'User 2 position')
  assert.equal(getTrail(4).current.name, 'User 4 position')
})
