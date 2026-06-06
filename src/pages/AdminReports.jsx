import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getClasses, getProgressRecords } from '../utils/storage'

function AdminReports() {
  const classes = getClasses()
  const progress = getProgressRecords()
  const passed = progress.filter((item) => item.passed)

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.adminReportsTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.adminReportsSubtitle}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Report title="Completion Summary" body={`Shows the number of completed chapters and the overall completion rate. ${passed.length} passed chapter records out of ${progress.length} attempts.`} />
        <Report title="Performance Summary" body={`Shows average scores and pass/fail results. Average score: ${progress.length ? Math.round(progress.reduce((sum, item) => sum + item.percentage, 0) / progress.length) : 0}%.`} />
        <Report title="Class Performance" body={`${classes.length} active class records are being tracked locally.`} />
        <Report title="Recent Activity" body={progress[0] ? `Latest saved result: ${new Date(progress[0].completedAt).toLocaleString()}.` : 'No activity recorded yet.'} />
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Chapter Summary</h2>
        <p className="mt-2 text-slate-600">Shows which chapters students complete most often and which chapters may need review.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {chapters.map((chapter) => {
            const records = progress.filter((item) => item.chapterId === chapter.id)
            return <div className="rounded-xl bg-slate-50 p-4" key={chapter.id}><p className="font-black">{chapter.title}</p><p className="mt-1 text-sm text-slate-600">{records.length} attempts - {records.filter((item) => item.passed).length} passes</p></div>
          })}
        </div>
      </div>
    </section>
  )
}

function Report({ title, body }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black text-slate-950">{title}</h2><p className="mt-2 text-slate-600">{body}</p></div>
}

export default AdminReports
