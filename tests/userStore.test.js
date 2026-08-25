import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { findOrCreateUser, getUserById } from '../server/services/userStore.js'

beforeEach(() => {
  db.prepare('DELETE FROM users').run()
})

test('findOrCreateUser creates a new user for an unseen sub', () => {
  const user = findOrCreateUser({ sub: 'google-1', email: 'a@b.com', name: 'Alice' })
  assert.equal(user.google_sub, 'google-1')
  assert.equal(user.email, 'a@b.com')
  assert.equal(user.name, 'Alice')
})

test('findOrCreateUser returns the same user on a second call with the same sub', () => {
  const first = findOrCreateUser({ sub: 'google-2', email: 'b@c.com', name: 'Bob' })
  const second = findOrCreateUser({ sub: 'google-2', email: 'b@c.com', name: 'Bob' })
  assert.equal(first.id, second.id)

  const count = db.prepare('SELECT COUNT(*) AS c FROM users WHERE google_sub = ?').get('google-2').c
  assert.equal(count, 1)
})

test('findOrCreateUser defaults name to an empty string when missing', () => {
  const user = findOrCreateUser({ sub: 'google-3', email: 'c@d.com' })
  assert.equal(user.name, '')
})

test('getUserById returns the matching user', () => {
  const created = findOrCreateUser({ sub: 'google-4', email: 'd@e.com', name: 'Dana' })
  const fetched = getUserById(created.id)
  assert.equal(fetched.email, 'd@e.com')
})

test('getUserById returns undefined for an unknown id', () => {
  assert.equal(getUserById(999999), undefined)
})
