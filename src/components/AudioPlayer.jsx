import { useEffect, useMemo, useRef, useState } from 'react'

function AudioPlayer({
  text,
  src = '',
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
  const supported = useMemo(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
    []
  )

  function stopAllPlayback() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    if (supported) {
      window.speechSynthesis.cancel()
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
  }, [supported])

  useEffect(() => {
    if (!autoPlay || (!src && (!supported || !text))) {
      if (!src && (!supported || !text)) {
        onPlaybackComplete?.()
      }
      return
    }

    stopAllPlayback()
    onPlaybackStart?.()

    if (src) {
      const audio = new Audio(src)
      audioRef.current = audio
      audio.onended = handlePlaybackComplete
      audio.onerror = handlePlaybackComplete
      audio.play().then(() => setIsSpeaking(true)).catch(() => setIsSpeaking(false))
      return () => {
        if (audioRef.current === audio) {
          audio.pause()
          audio.currentTime = 0
          audioRef.current = null
        }
        setIsSpeaking(false)
      }
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onend = handlePlaybackComplete
    utterance.onerror = handlePlaybackComplete

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)

    return () => {
      stopAllPlayback()
    }
  }, [autoPlay, replayKey, src, supported, text])

  function handleToggle() {
    if (isSpeaking) {
      stopAllPlayback()
      return
    }

    if (src) {
      stopAllPlayback()
      onPlaybackStart?.()
      const audio = new Audio(src)
      audioRef.current = audio
      audio.onended = handlePlaybackComplete
      audio.onerror = handlePlaybackComplete
      audio.play().then(() => setIsSpeaking(true)).catch(() => setIsSpeaking(false))
      return
    }

    if (!supported || !text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onend = handlePlaybackComplete
    utterance.onerror = handlePlaybackComplete

    stopAllPlayback()
    onPlaybackStart?.()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
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
          disabled={!src && !supported}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-slate-500"
        >
          {src || supported ? (isSpeaking ? 'Stop narration' : 'Play narration') : 'Speech not supported'}
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer
