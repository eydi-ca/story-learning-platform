function getStatusStyles(status, isCurrent) {
  if (status === 'Passed') {
    return 'border-emerald-200 bg-emerald-50'
  }

  if (status === 'Locked') {
    return 'border-slate-200 bg-slate-100 opacity-75'
  }

  return isCurrent
    ? 'border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-100'
    : 'border-sky-200 bg-sky-50'
}

function getBadgeStyles(status) {
  if (status === 'Passed') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Locked') return 'bg-slate-200 text-slate-600'
  return 'bg-indigo-100 text-indigo-700'
}

function ChapterCard({
  chapter,
  status,
  result,
  isCurrent,
  onOpen,
  disabled,
  alignment = 'left',
  needsRetry = false,
}) {
  const containerPosition =
    alignment === 'right' ? 'md:col-start-3 md:text-left' : 'md:col-start-1'

  return (
    <div className={`relative ${containerPosition}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={onOpen}
        className={`w-full rounded-3xl border p-6 text-left transition ${
          disabled ? 'cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl'
        } ${getStatusStyles(status, isCurrent)}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Chapter {chapter.order}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {chapter.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {chapter.shortDescription}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${getBadgeStyles(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-white/70 px-3 py-1">
            {chapter.duration}
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1">
            Passing score: {chapter.passingScore}/{chapter.activities.length}
          </span>
          {result ? (
            <span className="rounded-full bg-white/70 px-3 py-1">
              Latest score: {result.score}/{result.total}
            </span>
          ) : null}
        </div>

        {needsRetry ? (
          <p className="mt-4 text-sm font-semibold text-amber-700">
            Retry this chapter to unlock the next one.
          </p>
        ) : null}

        <div className="mt-5">
          <span className="text-sm font-semibold text-slate-800">
            {status === 'Passed'
              ? 'Review chapter'
              : disabled
                ? 'Complete the previous chapter first'
                : 'Open chapter'}
          </span>
        </div>
      </button>
    </div>
  )
}

export default ChapterCard
