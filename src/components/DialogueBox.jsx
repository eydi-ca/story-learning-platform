import TypewriterText from './TypewriterText'

function DialogueBox({
  speaker,
  text,
  typingDurationMs = null,
  start = true,
  skip = 0,
  resetKey = 0,
  onComplete,
  className = '',
  footer = null,
  showCursor = true,
  avatar = null,
}) {
  return (
    <div className={`rounded-[0.8rem] border border-white/18 bg-slate-950/82 p-2.5 text-white shadow-2xl backdrop-blur ${className}`}>
      <div className="flex items-center gap-2.5">
        {avatar}
        <div className="min-w-0">
          <p className="text-sm font-bold tracking-[0.06em] text-sky-100">
            {speaker}
          </p>
        </div>
      </div>
      <div className="mt-1.5 text-sm leading-6 text-slate-100 sm:text-[0.95rem] sm:leading-7">
        <TypewriterText
          text={text}
          durationMs={typingDurationMs}
          start={start}
          skip={skip}
          resetKey={resetKey}
          onComplete={onComplete}
          showCursor={showCursor}
        />
      </div>
      {footer}
    </div>
  )
}

export default DialogueBox
