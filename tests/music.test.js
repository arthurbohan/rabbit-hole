import { test } from 'node:test'
import assert from 'node:assert/strict'
import { searchTerm, randomSeed, SEEDS } from '../src/music.js'

test('searchTerm strips the year and an em dash from a track string', () => {
  assert.equal(searchTerm('Sex Pistols', 'Sex Pistols — No Feelings (1977)'), 'Sex Pistols No Feelings')
})

test('searchTerm handles a plain hyphen the same as an em dash', () => {
  assert.equal(searchTerm('Artist', 'Artist - Track (2001)'), 'Artist Track')
})

test('searchTerm falls back to the name when there is no track', () => {
  assert.equal(searchTerm('Aphex Twin', undefined), 'Aphex Twin')
  assert.equal(searchTerm('Aphex Twin', ''), 'Aphex Twin')
})

test('searchTerm returns a raw string, not URI-encoded', () => {
  // Regression test: this used to return an already-encoded string, which
  // caused double-encoding wherever a caller (the preview fetch) encoded
  // it again, corrupting the search term sent to iTunes.
  const result = searchTerm('Sex Pistols', 'Sex Pistols — No Feelings (1977)')
  assert.equal(result.includes('%'), false)
})

test('randomSeed always returns a member of SEEDS', () => {
  for (let i = 0; i < 20; i++) {
    assert.ok(SEEDS.includes(randomSeed()))
  }
})
