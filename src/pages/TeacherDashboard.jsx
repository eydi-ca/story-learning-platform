import { Link } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getClassStudents, getTeacherClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

function TeacherDashboard() {
  const teacher = getCurrentUser()
  const classes = getTeacherClasses(teacher.id)
  const students = classes.flatMap((classroom) => getClassStudents(classroom.id))
  const summaries = classes.flatMap((classroom) =>
    getClassStudents(classroom.id).map((student) => getClassCompletionSummary(student.id, classroom.id))
  )
  const avgProgress = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.overallPercentage, 0) / summaries.length) : 0
  const avgScore = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.averageScore, 0) / summaries.length) : 0

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.teacherTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.teacherSubtitle}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        <Card label="Total Classes" value={classes.length} />
        <Card label="Total Students" value={new Set(students.map((student) => student.id)).size} />
        <Card label="Recent Completions" value={summaries.filter((summary) => summary.latest).length} />
        <Card label="Average Progress" value={`${avgProgress}%`} />
        <Card label="Average Score" value={`${avgScore}%`} />
      </div>
      {!classes.length ? (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800">
          {siteContent.dashboards.teacherEmpty}
        </p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/teacher/classes">Create Class</Link>
        <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/teacher/classes">View Classes</Link>
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Recent activity</h2>
        <p className="mt-2 text-slate-600">Monitoring {chapters.length} fixed story chapters across your class codes.</p>
      </div>
    </section>
  )
}

function Card({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>
}

export default TeacherDashboard
