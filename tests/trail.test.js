import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isValidState } from '../server/routes/trail.js'

test('isValidState accepts null current with empty arrays', () => {
  assert.ok(isValidState({ current: null, branches: [], trail: [] }))
})

test('isValidState accepts a current with a name', () => {
  assert.ok(isValidState({ current: { name: 'X' }, branches: [], trail: [] }))
})

test('isValidState accepts a missing (undefined) current', () => {
  assert.ok(isValidState({ branches: [], trail: [] }))
})

test('isValidState rejects a current missing a name', () => {
  assert.ok(!isValidState({ current: {}, branches: [], trail: [] }))
})

test('isValidState rejects a non-object current', () => {
  assert.ok(!isValidState({ current: 'x', branches: [], trail: [] }))
})

test('isValidState rejects non-array branches or trail', () => {
  assert.ok(!isValidState({ current: null, branches: 'x', trail: [] }))
  assert.ok(!isValidState({ current: null, branches: [], trail: 'x' }))
})

test('isValidState rejects a non-object state', () => {
  assert.ok(!isValidState(null))
  assert.ok(!isValidState('nope'))
})
