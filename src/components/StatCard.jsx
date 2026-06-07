function StatCard({ label, value, hint, accent = 'text-slate-900' }) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <h2 className={`mt-3 text-3xl font-semibold tracking-tight ${accent}`}>{value}</h2>
      {hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p> : null}
    </div>
  )
}

export default StatCard
