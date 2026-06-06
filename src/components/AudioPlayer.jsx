import { useEffect, useMemo, useState } from 'react'

function AudioPlayer({ text, title = 'Narration' }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const supported = useMemo(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
    []
  )

  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [supported])

  function handleToggle() {
    if (!supported) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <div className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
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
          disabled={!supported}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/40 disabled:text-slate-500"
        >
          {supported ? (isSpeaking ? 'Stop narration' : 'Play narration') : 'Speech not supported'}
        </button>
      </div>
    </div>
  )
}

export default AudioPlayer
