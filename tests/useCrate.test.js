import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crateId } from '../src/hooks/useCrate.js'

test('crateId combines name and track with a :: separator', () => {
  assert.equal(crateId({ name: 'Artist', track: 'Artist — Track (2020)' }), 'Artist::Artist — Track (2020)')
})

test('crateId falls back to an empty track segment when there is no track', () => {
  assert.equal(crateId({ name: 'Artist', track: undefined }), 'Artist::')
})

test('crateId produces different ids for the same name with different tracks', () => {
  const a = crateId({ name: 'Artist', track: 'Track A' })
  const b = crateId({ name: 'Artist', track: 'Track B' })
  assert.notEqual(a, b)
})
