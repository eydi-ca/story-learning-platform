import { Link, useNavigate } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getJoinedClasses, getOrSetActiveClass, selectActiveClass } from '../utils/classUtils'
import { getChapterProgress, getClassCompletionSummary } from '../utils/progress'

function StudentProgressPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const joinedClasses = getJoinedClasses(user.id)
  const activeClass = getOrSetActiveClass(user.id)

  if (!activeClass) {
    return <p className="text-slate-600">Join a class before viewing progress.</p>
  }

  const summary = getClassCompletionSummary(user.id, activeClass.id)

  return (
    <section>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950">My Progress</h1>
          <p className="mt-2 text-slate-600">{activeClass.className} - {summary.overallPercentage}% complete</p>
        </div>
        {joinedClasses.length > 1 ? (
          <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={activeClass.id} onChange={(event) => {
            selectActiveClass(user.id, event.target.value)
            navigate(0)
          }}>
            {joinedClasses.map((classroom) => <option key={classroom.id} value={classroom.id}>{classroom.className}</option>)}
          </select>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">Completed chapters</p><p className="mt-2 text-3xl font-black">{summary.completedCount}/{chapters.length}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">Current chapter</p><p className="mt-2 font-black">{summary.currentChapter}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">Average score</p><p className="mt-2 text-3xl font-black">{summary.averageScore}%</p></div>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Chapter</th><th className="p-3">Score</th><th className="p-3">Percentage</th><th className="p-3">Status</th><th className="p-3">Completed At</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {chapters.map((chapter) => {
              const record = getChapterProgress(user.id, activeClass.classCode, chapter.id)
              return (
                <tr className="border-t border-slate-100" key={chapter.id}>
                  <td className="p-3 font-semibold">{chapter.title}</td>
                  <td className="p-3">{record ? `${record.score}/${record.total}` : '-'}</td>
                  <td className="p-3">{record ? `${record.percentage}%` : '-'}</td>
                  <td className="p-3">{record ? (record.passed ? 'Passed' : 'Failed') : 'No attempt'}</td>
                  <td className="p-3">{record ? new Date(record.completedAt).toLocaleString() : '-'}</td>
                  <td className="p-3">{record ? <Link className="font-bold text-sky-700" to={`/student/result/${chapter.id}`}>View result</Link> : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default StudentProgressPage
