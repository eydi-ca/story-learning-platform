function StatCard({ label, value, hint, accent = 'text-slate-900' }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <h2 className={`mt-3 text-4xl font-black ${accent}`}>{value}</h2>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  )
}

export default StatCard
