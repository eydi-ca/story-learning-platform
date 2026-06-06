import { getClasses, getProgressRecords, getUsers } from '../utils/storage'
import { siteContent } from '../data/siteContent'

function getMetrics() {
  const users = getUsers()
  const classes = getClasses()
  const progress = getProgressRecords()
  const averageScore = progress.length ? Math.round(progress.reduce((sum, item) => sum + item.percentage, 0) / progress.length) : 0
  const passingRate = progress.length ? Math.round((progress.filter((item) => item.passed).length / progress.length) * 100) : 0
  return {
    teachers: users.filter((user) => user.role === 'teacher').length,
    students: users.filter((user) => user.role === 'student').length,
    classes: classes.length,
    completions: progress.length,
    averageScore,
    passingRate,
  }
}

function AdminDashboard() {
  const metrics = getMetrics()
  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.adminTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.adminSubtitle}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card label="Total Teachers" value={metrics.teachers} />
        <Card label="Total Classes" value={metrics.classes} />
        <Card label="Total Students" value={metrics.students} />
        <Card label="Total Chapter Completions" value={metrics.completions} />
        <Card label="Average Score" value={`${metrics.averageScore}%`} />
        <Card label="Overall Passing Rate" value={`${metrics.passingRate}%`} />
      </div>
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Recent Learning Activity</h2>
        <p className="mt-2 text-slate-600">{metrics.completions ? 'Activity is stored locally in this browser for the demo.' : 'No activity recorded yet.'}</p>
      </div>
    </section>
  )
}

function Card({ label, value }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>
}

export default AdminDashboard
