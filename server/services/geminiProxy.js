const GOOGLE_BASE = 'https://generativelanguage.googleapis.com'

export async function forwardToGemini({ path, method, body }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const response = await fetch(`${GOOGLE_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: method === 'GET' || method === 'HEAD' ? undefined : body
  })

  return {
    status: response.status,
    contentType: response.headers.get('content-type'),
    body: Buffer.from(await response.arrayBuffer())
  }
}