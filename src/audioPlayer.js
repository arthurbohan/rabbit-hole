// Module-level singleton: at most one preview plays at a time across the
// whole page. Starting a new one stops whatever was playing before.
let active = null

export function playPreview(url, onStop) {
  stopActive()
  const audio = new Audio(url)
  active = { audio, onStop }
  audio.addEventListener('ended', () => stopIfCurrent(audio))
  audio.play()
  return audio
}

export function stopIfCurrent(audio) {
  if (active?.audio !== audio) return
  active.audio.pause()
  const { onStop } = active
  active = null
  onStop()
}

export function stopActive() {
  if (active) stopIfCurrent(active.audio)
}
