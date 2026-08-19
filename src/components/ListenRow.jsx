import { useEffect, useRef, useState } from 'react'
import { SERVICES, searchTerm } from '../music.js'
import { playPreview, stopIfCurrent } from '../audioPlayer.js'

export default function ListenRow({ name, track }) {
  const term = searchTerm(name, track)
  const [preview, setPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) stopIfCurrent(audioRef.current)
    }
  }, [])

  const play = (url) => {
    audioRef.current = playPreview(url, () => setIsPlaying(false))
    setIsPlaying(true)
  }

  const handleClick = async () => {
    if (isPlaying) {
      stopIfCurrent(audioRef.current)
      return
    }
    if (preview) {
      play(preview)
      return
    }
    setPreviewLoading(true)
    try {
      const res = await fetch(`/api/preview?q=${encodeURIComponent(term)}`)
      const data = await res.json()
      if (data.previewUrl) {
        setPreview(data.previewUrl)
        play(data.previewUrl)
      } else {
        setPreview('')
      }
    } catch (e) {
      console.error(e)
      setPreview('')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <p className='rh-listen'>
      <span className='rh-listen-label'>Listen</span>
      {preview !== '' ? (
        <button
          className='rh-listen-play'
          onClick={handleClick}
          disabled={previewLoading}
          aria-label={isPlaying ? 'Stop preview' : 'Play preview'}
        >
          {previewLoading ? '…' : isPlaying ? '■' : '▶'}
        </button>
      ) : (
        <span className='rh-listen-play rh-listen-play-none' aria-hidden='true'>
          –
        </span>
      )}
      {SERVICES.map((service) => (
        <a
          key={service.label}
          className='rh-listen-link'
          href={service.url(term)}
          target='_blank'
          rel='noopener noreferrer'
        >
          {service.label}
        </a>
      ))}
    </p>
  )
}
