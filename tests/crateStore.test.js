import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { getCrate, upsertCrateItems, removeCrateItem } from '../server/services/crateStore.js'

before(() => {
  db.prepare(
    "INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (1, 'sub1', 'a@b.com', 'Test')"
  ).run()
})

beforeEach(() => {
  db.prepare('DELETE FROM crate_items WHERE user_id = 1').run()
})

test('upsertCrateItems inserts a new item', () => {
  const result = upsertCrateItems(1, [
    { id: 'a::b', name: 'Artist', track: 'Artist — Track (2020)', from: '', relation: '' }
  ])
  assert.equal(result.length, 1)
  assert.equal(result[0].name, 'Artist')
})

test('upsertCrateItems ignores a duplicate id and keeps the original', () => {
  upsertCrateItems(1, [{ id: 'dup', name: 'First', track: '', from: '', relation: '' }])
  const result = upsertCrateItems(1, [{ id: 'dup', name: 'Second', track: '', from: '', relation: '' }])
  assert.equal(result.length, 1)
  assert.equal(result[0].name, 'First')
})

test('getCrate returns every item saved for that user', () => {
  upsertCrateItems(1, [{ id: 'x1', name: 'One', track: '', from: '', relation: '' }])
  upsertCrateItems(1, [{ id: 'x2', name: 'Two', track: '', from: '', relation: '' }])
  const result = getCrate(1)
  assert.equal(result.length, 2)
  assert.ok(result.some((item) => item.id === 'x1'))
  assert.ok(result.some((item) => item.id === 'x2'))
})

test('removeCrateItem removes only the given item', () => {
  upsertCrateItems(1, [{ id: 'keep', name: 'Keep', track: '', from: '', relation: '' }])
  upsertCrateItems(1, [{ id: 'remove', name: 'Remove', track: '', from: '', relation: '' }])
  removeCrateItem(1, 'remove')
  const result = getCrate(1)
  assert.equal(result.length, 1)
  assert.equal(result[0].id, 'keep')
})
