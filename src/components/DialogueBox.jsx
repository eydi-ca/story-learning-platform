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
  variant = 'default',
}) {
  const isSystemVariant = variant === 'system'
  const shellClassName = isSystemVariant
    ? 'relative overflow-hidden rounded-[0.72rem] border border-cyan-200/90 bg-[linear-gradient(180deg,rgba(10,40,78,0.42),rgba(4,18,39,0.22))] p-2.5 text-cyan-50 shadow-[0_0_0_1px_rgba(125,211,252,0.32),0_0_20px_rgba(34,211,238,0.34),0_0_46px_rgba(59,130,246,0.22),inset_0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-md'
    : 'rounded-[0.8rem] border border-white/18 bg-slate-950/82 p-2.5 text-white shadow-2xl backdrop-blur'
  const speakerClassName = isSystemVariant
    ? 'text-sm font-bold uppercase tracking-[0.22em] text-cyan-100 drop-shadow-[0_0_12px_rgba(125,211,252,0.45)]'
    : 'text-sm font-bold tracking-[0.06em] text-sky-100'
  const textClassName = isSystemVariant
    ? 'relative z-10 mt-1.5 text-sm leading-6 text-cyan-50 drop-shadow-[0_0_10px_rgba(103,232,249,0.18)] sm:text-[0.95rem] sm:leading-7'
    : 'mt-1.5 text-sm leading-6 text-slate-100 sm:text-[0.95rem] sm:leading-7'

  return (
    <div className={`${shellClassName} ${className}`}>
      {isSystemVariant ? (
        <>
          <div className="pointer-events-none absolute inset-0 rounded-[0.72rem] ring-1 ring-cyan-200/75 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.55),0_0_16px_rgba(34,211,238,0.24)]" />
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent shadow-[0_0_18px_rgba(125,211,252,0.98)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_42%),linear-gradient(135deg,rgba(34,211,238,0.06),transparent_35%,rgba(34,211,238,0.08)_55%,transparent_72%)]" />
        </>
      ) : null}
      <div className="flex items-center gap-2.5">
        {avatar}
        <div className="min-w-0">
          <p className={speakerClassName}>{speaker}</p>
        </div>
      </div>
      <div className={textClassName}>
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
