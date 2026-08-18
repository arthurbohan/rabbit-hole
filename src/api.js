// All model calls go through the Vite dev proxy (see vite.config.js).
// The API key lives in .env on the machine and never reaches the browser.
const ENDPOINT = '/api/gemini/v1beta/interactions'
const MODEL = 'gemini-3.6-flash'

export async function askGemini(prompt, maxOutputTokens = 4000) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      input: prompt,
      // 'high'/'medium' thinking can burn the entire token budget on reasoning
      // before writing any output, leaving the response truncated.
      generation_config: { max_output_tokens: maxOutputTokens, thinking_level: 'low' }
    })
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`API responded ${response.status}: ${detail.slice(0, 200)}`)
  }

  const data = await response.json()
  if (data.status !== 'completed') {
    throw new Error(`Response ${data.status}: ran out of tokens before finishing`)
  }
  return data.steps
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content)
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .filter(Boolean)
    .join('\n')
}

export function parseJSON(raw) {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in response')
  return JSON.parse(cleaned.slice(start, end + 1))
}

export function branchPrompt(name, visited = []) {
  const avoid = visited.join(', ')
  return `You are a music guide with deep, specific knowledge across every era and region — the kind of person who works behind the counter at a very good record shop.

Starting point: "${name}"

Map five directions someone could travel from here.

Return ONLY a JSON object. No markdown fences, no preamble, no trailing text.

{
  "node": { "name": "canonical name of the starting point", "tagline": "max 18 words — what this is and where it sits" },
  "branches": [
    { "relation": "ANCESTOR", "name": "artist or album", "why": "one sentence, max 26 words, specific about the musical link", "track": "Artist — Track title (year)" },
    { "relation": "CONTEMPORARY", "name": "...", "why": "...", "track": "..." },
    { "relation": "MUTATION", "name": "...", "why": "...", "track": "..." },
    { "relation": "DISTANT RELATIVE", "name": "...", "why": "...", "track": "..." },
    { "relation": "INHERITOR", "name": "...", "why": "...", "track": "..." }
  ]
}

Rules:
- Exactly five branches, in that order.
- ANCESTOR came before and fed into it. CONTEMPORARY sat alongside it. MUTATION took it somewhere strange. DISTANT RELATIVE sounds unlike it but shares a structural or rhythmic spine — make this one a real reach across genre or geography. INHERITOR carries it forward.
- Name specific artists or albums, not genres.
- The track is the best door into that artist, not their most famous song.
- "why" must point at something concrete: a rhythm, a tuning, a production choice, a shared player, a lineage.
${avoid ? `- Do not name any of these, they have already been visited: ${avoid}` : ''}`
}

export function deepPrompt(branchName, currentName) {
  return `In 2–3 sentences, explain what is musically happening in "${branchName}" that links it to "${currentName}". Be concrete about mechanics — rhythm, harmony, tuning, arrangement, production technique, or shared personnel. Write for someone who plays an instrument. Plain text only, no markdown, no preamble.`
}

export function nodePrompt(name) {
  return `In 2–3 sentences, explain what is musically happening in "${name}". Be concrete about mechanics — rhythm, harmony, tuning, arrangement, production technique, or personnel. Write for someone who plays an instrument. Plain text only, no markdown, no preamble.`
}