import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidItem } from '../server/routes/crate.js'

test('isValidItem accepts an item with id and name', () => {
  assert.ok(isValidItem({ id: 'a::b', name: 'Artist' }))
})

test('isValidItem rejects a missing id', () => {
  assert.ok(!isValidItem({ name: 'Artist' }))
})

test('isValidItem rejects an empty id', () => {
  assert.ok(!isValidItem({ id: '', name: 'Artist' }))
})

test('isValidItem rejects a non-string id', () => {
  assert.ok(!isValidItem({ id: 1, name: 'Artist' }))
})

test('isValidItem rejects null or non-object input', () => {
  assert.ok(!isValidItem(null))
  assert.ok(!isValidItem('nope'))
})
