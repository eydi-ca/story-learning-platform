import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getAllCompatibleProgressRecords } from '../utils/progress'
import { getClasses } from '../utils/storage'

function SummaryFigure({ label, value, detail }) {
  return (
    <div className="border-l-4 border-slate-300 bg-white px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
    </div>
  )
}

function AdminReports() {
  const classes = getClasses()
  const progress = getAllCompatibleProgressRecords()
  const passed = progress.filter((item) => item.passed)
  const averageScore = progress.length
    ? Math.round(progress.reduce((sum, item) => sum + item.percentage, 0) / progress.length)
    : 0
  const passRate = progress.length ? Math.round((passed.length / progress.length) * 100) : 0
  const latestRecords = [...progress]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 6)

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{siteContent.dashboards.adminReportsTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{siteContent.dashboards.adminReportsSubtitle}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Report Snapshot</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Platform Performance Summary</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">Generated from current workspace records</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryFigure label="Attempts" value={progress.length} detail="Total saved results" />
          <SummaryFigure label="Passes" value={passed.length} detail={`${passRate}% pass rate`} />
          <SummaryFigure label="Average Score" value={`${averageScore}%`} detail="Mean score across attempts" />
          <SummaryFigure label="Classes" value={classes.length} detail="Tracked class records" />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Chapter Report</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Completion by Chapter</h2>
          </div>
          <p className="text-sm text-slate-500">{chapters.length} chapters monitored</p>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-black">Chapter</th>
                <th className="px-4 py-3 font-black">Attempts</th>
                <th className="px-4 py-3 font-black">Passes</th>
                <th className="px-4 py-3 font-black">Pass Rate</th>
                <th className="px-4 py-3 font-black">Average Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {chapters.map((chapter) => {
                const records = progress.filter((item) => item.chapterId === chapter.id)
                const chapterPasses = records.filter((item) => item.passed).length
                const chapterRate = records.length ? Math.round((chapterPasses / records.length) * 100) : 0
                const chapterAverage = records.length
                  ? Math.round(records.reduce((sum, item) => sum + item.percentage, 0) / records.length)
                  : 0
                return (
                  <tr key={chapter.id}>
                    <td className="px-4 py-4 font-bold text-slate-950">{chapter.title}</td>
                    <td className="px-4 py-4 text-slate-700">{records.length}</td>
                    <td className="px-4 py-4 text-slate-700">{chapterPasses}</td>
                    <td className="px-4 py-4 text-slate-700">{chapterRate}%</td>
                    <td className="px-4 py-4 text-slate-700">{chapterAverage}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">Activity Log</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Recent Results</h2>
          </div>
          <p className="text-sm text-slate-500">Latest {latestRecords.length || 0} saved submissions</p>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-black">Chapter</th>
                <th className="px-4 py-3 font-black">Score</th>
                <th className="px-4 py-3 font-black">Result</th>
                <th className="px-4 py-3 font-black">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {latestRecords.length ? latestRecords.map((record) => (
                <tr key={`${record.chapterId}-${record.completedAt}`}>
                  <td className="px-4 py-4 font-bold text-slate-950">
                    {chapters.find((chapter) => chapter.id === record.chapterId)?.title ?? 'Unknown chapter'}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{record.percentage}%</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${record.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {record.passed ? 'Passed' : 'Needs retry'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{new Date(record.completedAt).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan="4">No activity recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminReports
