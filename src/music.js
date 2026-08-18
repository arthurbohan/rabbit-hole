export const SEEDS = [
  'Steve Reich — Music for 18 Musicians',
  'Basic Channel',
  'Alice Coltrane',
  'Fela Kuti',
  'Cocteau Twins',
  'Madlib',
  'Arvo Pärt',
  'Sun Ra',
  'Cluster',
  'Shellac',
  'Milton Nascimento',
  'The Durutti Column',
  'Mulatu Astatke',
  'J Dilla — Donuts',
  'Ligeti — Musica Ricercata',
  'Talk Talk — Laughing Stock',
  'Fennesz',
  'Nusrat Fateh Ali Khan',
  'Broadcast',
  'Terry Riley',
  'Augustus Pablo',
  'Bill Evans Trio',
  'Slint — Spiderland',
  'Yellow Magic Orchestra',
  'Grouper',
  'Ornette Coleman',
  'Tom Zé',
  'Autechre',
  'Nick Drake',
  'Klaus Schulze',
  'The Ex',
  'Alva Noto & Ryuichi Sakamoto',
  'Konono N°1',
  'Charles Mingus — The Black Saint and the Sinner Lady',
  'Stereolab',
  'Pharoah Sanders — Karma',
  'This Heat',
  'Susumu Yokota',
  'Gastr del Sol',
  'Moondog',
]

export const SERVICES = [
  {
    label: 'YouTube',
    url: (q) => `https://www.youtube.com/results?search_query=${q}`,
  },
  { label: 'Bandcamp', url: (q) => `https://bandcamp.com/search?q=${q}` },
  {
    label: 'Apple Music',
    url: (q) => `https://music.apple.com/search?term=${q}`,
  },
  { label: 'Spotify', url: (q) => `https://open.spotify.com/search/${q}` },
]

// "Artist — Track title (1974)" searches badly. Strip the year and the dashes.
export function searchTerm(name, track) {
  const cleaned = (track || '')
    .replace(/\((?:19|20)\d{2}\)/g, '')
    .replace(/[—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return encodeURIComponent(cleaned || name)
}

export function randomSeed() {
  return SEEDS[Math.floor(Math.random() * SEEDS.length)]
}
