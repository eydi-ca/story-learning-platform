import { Link, Navigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getStudentSummary } from '../utils/progressUtils'
import { getStudentById, getStudentProgress } from '../utils/storage'

function AdminStudentDetail() {
  const { id } = useParams()
  const student = getStudentById(id)

  if (!student) {
    return <Navigate to="/admin/students" replace />
  }

  const results = getStudentProgress(student.id)
  const summary = getStudentSummary(chapters, results)

  return (
    <section className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900">{student.name}</h1>
          <p className="mt-3 text-slate-600">
            {student.section} - {student.classCode} - Joined{' '}
            {new Date(student.createdAt).toLocaleString()}
          </p>
        </div>

        <Link
          to="/admin/students"
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
        >
          Back to students
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Progress
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900">
            {summary.passedCount}/{chapters.length}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Completion
          </p>
          <p className="mt-3 text-3xl font-black text-slate-900">{summary.percentage}%</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Current chapter
          </p>
          <p className="mt-3 text-xl font-black text-slate-900">
            {summary.currentChapter?.title ?? 'No chapter yet'}
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Saved results</h2>
        {results.length === 0 ? (
          <p className="mt-4 text-slate-500">No results saved for this student yet.</p>
        ) : (
          <div className="mt-4 grid gap-4">
            {results.map((result) => (
              <div
                key={result.chapterId}
                className="rounded-3xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {result.chapterTitle}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(result.completedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {result.score}/{result.total} - {result.percentage}% -{' '}
                    {result.passed ? 'Passed' : 'Needs retry'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminStudentDetail
