import { useEffect, useMemo, useRef, useState } from 'react'
import { playPreparedAudio, preloadAudio, preloadAudioSources } from '../utils/audioPreload'

function AudioPlayer({
  src = '',
  srcs = [],
  title = 'Narration',
  className = '',
  autoPlay = false,
  replayKey = 0,
  showControls = true,
  onPlaybackStart,
  onPlaybackComplete,
}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef(null)
  const audioSources = useMemo(
    () => (srcs.length ? srcs : [src]).filter(Boolean),
    [src, srcs]
  )

  function stopAllPlayback() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    setIsSpeaking(false)
  }

  function handlePlaybackComplete() {
    setIsSpeaking(false)
    onPlaybackComplete?.()
  }

  useEffect(() => {
    return () => {
      stopAllPlayback()
    }
  }, [])

  useEffect(() => {
    if (!autoPlay || !audioSources.length) {
      if (!audioSources.length) onPlaybackComplete?.()
      return
    }

    let cancelled = false
    let index = 0

    stopAllPlayback()
    onPlaybackStart?.()

    async function playNext() {
      if (cancelled) return

      if (index >= audioSources.length) {
        handlePlaybackComplete()
        return
      }

      const currentSource = audioSources[index]
      preloadAudioSources(audioSources.slice(index + 1))
      await preloadAudio(currentSource)
      if (cancelled) return

      const audio = new Audio(currentSource)
      audio.preload = 'auto'
      index += 1
      audioRef.current = audio
      audio.onended = playNext
      audio.onerror = playNext
      playPreparedAudio(audio).then(() => setIsSpeaking(true)).catch(playNext)
    }

    playNext()

    return () => {
      cancelled = true
      stopAllPlayback()
    }
  }, [audioSources, autoPlay, replayKey])

  function handleToggle() {
    if (isSpeaking) {
      stopAllPlayback()
      return
    }

    if (!audioSources.length) return

    let index = 0

    async function playNext() {
      if (index >= audioSources.length) {
        handlePlaybackComplete()
        return
      }

      const currentSource = audioSources[index]
      preloadAudioSources(audioSources.slice(index + 1))
      await preloadAudio(currentSource)

      const audio = new Audio(currentSource)
      audio.preload = 'auto'
      index += 1
      audioRef.current = audio
      audio.onended = playNext
      audio.onerror = playNext
      playPreparedAudio(audio).then(() => setIsSpeaking(true)).catch(playNext)
    }

    stopAllPlayback()
    onPlaybackStart?.()
    playNext()
  }

  if (!showControls) {
    return null
  }

  return (
    <div className={`rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm ${className}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Audio Narration
          </p>
          <p className="text-base font-semibold text-white">{title}</p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={!audioSources.length}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-slate-500"
        >
          {audioSources.length ? (isSpeaking ? 'Stop narration' : 'Play narration') : 'No audio available'}
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer
