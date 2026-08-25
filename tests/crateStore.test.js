import { test, before, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import db from '../server/db.js'
import { getCrate, upsertCrateItems, removeCrateItem } from '../server/services/crateStore.js'

before(() => {
  db.prepare("INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (1, 'sub1', 'a@b.com', 'Test')").run()
  db.prepare("INSERT OR IGNORE INTO users (id, google_sub, email, name) VALUES (3, 'sub3', 'c@d.com', 'Test3')").run()
})

beforeEach(() => {
  db.prepare('DELETE FROM crate_items').run()
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

test('crate items are isolated between users, even with the same item id', () => {
  upsertCrateItems(1, [{ id: 'shared-id', name: 'User 1 item', track: '', from: '', relation: '' }])
  upsertCrateItems(3, [{ id: 'shared-id', name: 'User 3 item', track: '', from: '', relation: '' }])

  const user1Items = getCrate(1)
  const user3Items = getCrate(3)

  assert.equal(user1Items.length, 1)
  assert.equal(user1Items[0].name, 'User 1 item')
  assert.equal(user3Items.length, 1)
  assert.equal(user3Items[0].name, 'User 3 item')
})

test('removing an item for one user does not affect another user with the same item id', () => {
  upsertCrateItems(1, [{ id: 'same-id', name: 'Mine', track: '', from: '', relation: '' }])
  upsertCrateItems(3, [{ id: 'same-id', name: 'Theirs', track: '', from: '', relation: '' }])

  removeCrateItem(1, 'same-id')

  assert.equal(getCrate(1).length, 0)
  assert.equal(getCrate(3).length, 1)
})
