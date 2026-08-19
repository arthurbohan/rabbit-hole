const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search'

export async function findPreviewUrl(term) {
  const params = new URLSearchParams({ term, media: 'music', limit: '1' })
  const response = await fetch(`${ITUNES_SEARCH_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`iTunes search failed: ${response.status}`)
  }
  const data = await response.json()
  return data.results?.[0]?.previewUrl || null
}
