import { Link } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getJoinedClasses, getOrSetActiveClass } from '../utils/classUtils'
import { getChapterStatus, getClassCompletionSummary } from '../utils/progress'

function StudentProfile() {
  const user = getCurrentUser()
  const joinedClasses = getJoinedClasses(user.id)
  const activeClass = getOrSetActiveClass(user.id)
  const summary = activeClass ? getClassCompletionSummary(user.id, activeClass.id) : null
  const nextChapter =
    activeClass && summary?.completedCount < chapters.length
      ? chapters[summary.completedCount]
      : null
  const currentChapterStatus = !activeClass
    ? 'No active class selected'
    : nextChapter
      ? `Chapter ${nextChapter.number} - ${getChapterStatus(user.id, activeClass.classCode, nextChapter.id)}`
      : 'All chapters completed'

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AvatarBadge avatarId={user.avatar} size="lg" />
        <h1 className="mt-4 text-3xl font-black text-slate-950">{user.fullName}</h1>
        <p className="mt-1 text-slate-600">{user.email}</p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Current chapter status</p>
          <p className="mt-2 text-lg font-black text-slate-950">{currentChapterStatus}</p>
        </div>
        <Link className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/student/profile/settings">Profile settings</Link>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Joined Classes</h2>
        <p className="mt-2 text-slate-600">Current selected class: {activeClass?.className ?? 'None'}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {joinedClasses.map((classroom) => (
            <div className="rounded-xl bg-slate-50 p-4" key={classroom.id}>
              <p className="font-black text-slate-900">{classroom.className}</p>
              <p className="font-mono text-sm font-bold text-sky-700">{classroom.classCode}</p>
            </div>
          ))}
          {!joinedClasses.length ? <p className="text-slate-500">No classes joined yet.</p> : null}
        </div>
        <Link className="mt-5 inline-block rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/join-class">Join another class</Link>
      </div>
    </section>
  )
}

export default StudentProfile
