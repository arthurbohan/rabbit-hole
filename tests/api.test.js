import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseJSON } from '../src/api.js'

test('parseJSON parses a clean JSON object', () => {
  assert.deepEqual(parseJSON('{"a": 1, "b": "two"}'), { a: 1, b: 'two' })
})

test('parseJSON strips markdown code fences', () => {
  assert.deepEqual(parseJSON('```json\n{"a": 1}\n```'), { a: 1 })
})

test('parseJSON ignores preamble and trailing text', () => {
  assert.deepEqual(parseJSON('Sure, here you go:\n{"a": 1}\nHope that helps!'), { a: 1 })
})

test('parseJSON handles a realistic nested branchPrompt-shaped response', () => {
  const raw =
    '```json\n{"node": {"name": "Test", "tagline": "..."}, "branches": [{"relation": "ANCESTOR", "name": "X"}]}\n```'
  const result = parseJSON(raw)
  assert.equal(result.node.name, 'Test')
  assert.equal(result.branches[0].relation, 'ANCESTOR')
})

test('parseJSON throws when there is no JSON object', () => {
  assert.throws(() => parseJSON('no json here'), /No JSON object in response/)
})

test('parseJSON throws rather than silently returning garbage when stray trailing text has its own brace', () => {
  // Known limitation, not a fix: the brace search is naive (first "{" to
  // last "}"), so trailing content with its own "}" — the model ignoring
  // branchPrompt's "no trailing text" instruction — breaks the slice.
  // Documenting that this fails loudly (JSON.parse throws) rather than
  // silently, since the failure mode matters more here than the message.
  assert.throws(() => parseJSON('{"a": 1} Hope that looks right! :}'))
})
