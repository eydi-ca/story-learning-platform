function ProgressBar({ value = 0 }) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-400 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}

export default ProgressBar
