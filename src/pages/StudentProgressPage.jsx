import { Link, useNavigate } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getJoinedClasses, getOrSetActiveClass, selectActiveClass } from '../utils/classUtils'
import { formatClockTime, formatElapsedTime, getChapterProgress, getClassCompletionSummary } from '../utils/progress'

function getMotivationalMessage(averageScore) {
  if (averageScore >= 90) {
    return 'Amazing work - you are mastering each chapter with confidence.'
  }

  if (averageScore >= 75) {
    return 'You are doing great - keep going, your progress is strong.'
  }

  if (averageScore >= 50) {
    return 'Nice progress so far - a little more practice will make you even stronger.'
  }

  return 'Keep going - every chapter you finish builds your confidence.'
}

function StudentProgressPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const joinedClasses = getJoinedClasses(user.id)
  const activeClass = getOrSetActiveClass(user.id)

  if (!activeClass) {
    return <p className="text-slate-600">Join a class before viewing progress.</p>
  }

  const summary = getClassCompletionSummary(user.id, activeClass.id)
  const motivation = getMotivationalMessage(summary.averageScore)

  return (
    <section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <AvatarBadge avatarId={user.avatar} size="lg" />
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Student progress</p>
            <h1 className="break-words text-3xl font-black text-slate-950">{user.fullName}</h1>
            <p className="mt-1 text-slate-600">
              {activeClass.className} - {summary.overallPercentage}% complete
            </p>
            <p className="mt-3 text-sm font-semibold text-amber-700">{motivation}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500 lg:text-right">Active class</p>
          <p className="mt-2 text-lg font-black text-slate-950 lg:text-right">{activeClass.className}</p>
          <p className="mt-1 text-sm text-slate-600 lg:text-right">Average score: {summary.averageScore}%</p>
        </div>
      </div>
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-slate-950">My Progress</h1>
          <p className="mt-2 text-slate-600">Track your chapter results, time spent, and passed activities.</p>
        </div>
        {joinedClasses.length > 1 ? (
          <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 sm:w-auto" value={activeClass.id} onChange={(event) => {
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
      <div className="mt-6 grid gap-3 lg:hidden">
        {chapters.map((chapter) => {
          const record = getChapterProgress(user.id, activeClass.classCode, chapter.id)
          return (
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={chapter.id}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="min-w-0 text-base font-black text-slate-950">{chapter.title}</h2>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${record?.passed ? 'bg-emerald-100 text-emerald-700' : record ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {record ? (record.passed ? 'Passed' : 'Failed') : 'No attempt'}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="font-bold text-slate-500">Score</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{record ? `${record.score}/${record.total}` : '-'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-500">Percentage</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{record ? `${record.percentage}%` : '-'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-500">Total time</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{record ? formatElapsedTime(record.totalElapsedMs) : '-'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-500">Passed at</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{record?.passedSubmittedAt ? formatClockTime(record.passedSubmittedAt) : '-'}</dd>
                </div>
              </dl>
              <div className="mt-4">
                {record ? <Link className="font-bold text-sky-700" to={`/student/result/${chapter.id}`}>View result</Link> : <span className="text-sm font-semibold text-slate-500">No result yet</span>}
              </div>
            </article>
          )
        })}
      </div>
      <div className="mt-6 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Chapter</th><th className="p-3">Score</th><th className="p-3">Percentage</th><th className="p-3">Status</th><th className="p-3">Total Time</th><th className="p-3">Passed At</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {chapters.map((chapter) => {
              const record = getChapterProgress(user.id, activeClass.classCode, chapter.id)
              return (
                <tr className="border-t border-slate-100" key={chapter.id}>
                  <td className="p-3 font-semibold">{chapter.title}</td>
                  <td className="p-3">{record ? `${record.score}/${record.total}` : '-'}</td>
                  <td className="p-3">{record ? `${record.percentage}%` : '-'}</td>
                  <td className="p-3">{record ? (record.passed ? 'Passed' : 'Failed') : 'No attempt'}</td>
                  <td className="p-3">{record ? formatElapsedTime(record.totalElapsedMs) : '-'}</td>
                  <td className="p-3">{record?.passedSubmittedAt ? formatClockTime(record.passedSubmittedAt) : '-'}</td>
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
