import { getCached, setCached } from './geminiCache.js'

const GOOGLE_BASE = 'https://generativelanguage.googleapis.com'

function isCompleteResponse(buffer) {
  try {
    return JSON.parse(buffer.toString('utf8')).status === 'completed'
  } catch {
    return false
  }
}

export async function forwardToGemini({ path, method, body }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  // Identical prompts (same model, same input) always produce a request
  // with identical bytes, so the raw body doubles as a cache key. This
  // saves quota on repeat explorations of the same artist/album.
  if (method === 'POST') {
    const cached = getCached(path, body)
    if (cached) return { status: 200, ...cached }
  }

  const response = await fetch(`${GOOGLE_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: method === 'GET' || method === 'HEAD' ? undefined : body
  })

  const contentType = response.headers.get('content-type')
  const responseBody = Buffer.from(await response.arrayBuffer())

  if (method === 'POST' && response.status === 200 && isCompleteResponse(responseBody)) {
    setCached(path, body, contentType, responseBody)
  }

  return { status: response.status, contentType, body: responseBody }
}
