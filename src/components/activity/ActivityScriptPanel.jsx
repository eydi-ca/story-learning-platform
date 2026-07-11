import { useEffect, useMemo, useRef } from 'react'
import { playPreparedAudio, preloadAudio, preloadAudioSources } from '../../utils/audioPreload'

function ActivityScriptPanel({
  eyebrow = 'System',
  title,
  lines = [],
  titleAudioSrc = '',
  lineAudioSrcs = [],
  ctaLabel = 'Continue',
  onContinue,
  tone = 'gold',
}) {
  const audioRef = useRef(null)
  const pauseTimerRef = useRef(null)
  const audioSequence = useMemo(
    () => [titleAudioSrc, ...lineAudioSrcs.slice(0, lines.length)].filter(Boolean),
    [lineAudioSrcs, lines.length, titleAudioSrc]
  )

  useEffect(() => {
    if (!audioSequence.length) return undefined

    let cancelled = false
    let index = 0

    function clearCurrentAudio() {
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current)
        pauseTimerRef.current = null
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
    }

    async function playNext() {
      if (cancelled || index >= audioSequence.length) return

      const currentSource = audioSequence[index]
      preloadAudioSources(audioSequence.slice(index + 1))
      await preloadAudio(currentSource)
      if (cancelled) return

      const audio = new Audio(currentSource)
      audio.preload = 'auto'
      index += 1
      audioRef.current = audio
      audio.onended = () => {
        pauseTimerRef.current = window.setTimeout(playNext, 1000)
      }
      audio.onerror = () => {
        pauseTimerRef.current = window.setTimeout(playNext, 1000)
      }
      playPreparedAudio(audio).catch(() => {
        pauseTimerRef.current = window.setTimeout(playNext, 1000)
      })
    }

    playNext()

    return () => {
      cancelled = true
      clearCurrentAudio()
    }
  }, [audioSequence])

  const panelClass =
    tone === 'blue'
      ? 'border-cyan-300/35 bg-[linear-gradient(180deg,rgba(14,116,144,0.18),rgba(2,6,23,0.92))] shadow-[0_0_0_1px_rgba(103,232,249,0.12),0_18px_60px_rgba(8,145,178,0.16)]'
      : 'border-amber-300/30 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(2,6,23,0.92))] shadow-[0_18px_60px_rgba(2,6,23,0.24)]'

  const badgeClass =
    tone === 'blue'
      ? 'border-cyan-200/30 bg-cyan-400/10 text-cyan-100'
      : 'border-amber-200/30 bg-amber-400/10 text-amber-50'

  const buttonClass =
    tone === 'blue'
      ? 'border-cyan-200/40 bg-cyan-400/14 text-cyan-50 hover:bg-cyan-400/20'
      : 'gold-button'

  return (
    <div className={`rounded-[1rem] border p-5 sm:p-6 ${panelClass}`}>
      <div className="space-y-4">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.22em] ${badgeClass}`}
        >
          {eyebrow}
        </span>

        <div className="space-y-3">
          <h3 className="text-2xl font-black text-white sm:text-3xl">{title}</h3>
          <div className="space-y-3">
            {lines.map((line) => (
              <p key={line} className="text-sm leading-7 text-white/84 sm:text-[0.98rem]">
                {line}
              </p>
            ))}
          </div>
        </div>

        {onContinue ? (
          <button
            type="button"
            className={`interactive-button rounded-full border px-5 py-3 text-sm font-bold transition ${buttonClass}`}
            onClick={onContinue}
          >
            {ctaLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default ActivityScriptPanel
