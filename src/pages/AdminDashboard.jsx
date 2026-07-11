import { useMemo, useState } from 'react'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getClassStudents } from '../utils/classUtils'
import { getAllCompatibleProgressRecords } from '../utils/progress'
import { getClasses, getUsers } from '../utils/storage'

const chartColors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500']

function getRangeDate(range) {
  if (range === 'all') return null
  const days = Number(range)
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function MetricTile({ label, value, hint, accent = 'bg-sky-500' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`h-10 w-2 rounded-full ${accent}`} />
      </div>
      <p className="mt-3 text-sm leading-5 text-slate-600">{hint}</p>
    </div>
  )
}

function RingMetric({ label, value, caption, color = '#0284c7' }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const normalizedValue = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (normalizedValue / 100) * circumference

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <svg className="h-28 w-28 shrink-0 -rotate-90" viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value}%`}>
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">{value}%</p>
          <p className="mt-2 text-sm leading-5 text-slate-600">{caption}</p>
        </div>
      </div>
    </div>
  )
}

function BarChart({ items, valueKey, labelKey, colorClass = 'bg-slate-900', suffix = '' }) {
  const max = Math.max(...items.map((item) => item[valueKey]), 1)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item[labelKey]}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-slate-800">{item[labelKey]}</span>
            <span className="font-black text-slate-950">{item[valueKey]}{suffix}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${colorClass} transition-all duration-500`}
              style={{ width: `${Math.max((item[valueKey] / max) * 100, item[valueKey] ? 10 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function AttemptDistribution({ passed, failed }) {
  const total = Math.max(passed + failed, 1)
  const segments = [
    { label: 'Passed', value: passed, className: 'bg-emerald-500' },
    { label: 'Needs retry', value: failed, className: 'bg-rose-500' },
  ]

  return (
    <div>
      <div className="flex h-5 overflow-hidden rounded-full bg-slate-200">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={segment.className}
            style={{ width: `${(segment.value / total) * 100}%` }}
            title={`${segment.label}: ${segment.value}`}
          />
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2 text-sm">
            <span className={`h-3 w-3 rounded-full ${segment.className}`} />
            <span className="font-semibold text-slate-700">{segment.label}</span>
            <span className="ml-auto font-black text-slate-950">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminDashboard() {
  const [range, setRange] = useState('30')
  const users = getUsers()
  const classes = getClasses()
  const allProgress = getAllCompatibleProgressRecords()

  const {
    filteredProgress,
    teachers,
    students,
    activeClasses,
    averageScore,
    passingRate,
    completionRate,
    chaptersData,
    teacherPerformance,
    attentionItems,
    passedAttempts,
    failedAttempts,
    archivedClasses,
  } = useMemo(() => {
    const rangeDate = getRangeDate(range)
    const filteredProgress = rangeDate
      ? allProgress.filter((item) => new Date(item.completedAt) >= rangeDate)
      : allProgress

    const teachers = users.filter((user) => user.role === 'teacher').length
    const students = users.filter((user) => user.role === 'student').length
    const activeClasses = classes.filter((classroom) => classroom.status !== 'archived').length
    const archivedClasses = classes.length - activeClasses
    const averageScore = filteredProgress.length
      ? Math.round(filteredProgress.reduce((sum, item) => sum + item.percentage, 0) / filteredProgress.length)
      : 0
    const passingRate = filteredProgress.length
      ? Math.round((filteredProgress.filter((item) => item.passed).length / filteredProgress.length) * 100)
      : 0
    const completionRate = students && chapters.length
      ? Math.round((filteredProgress.length / (students * chapters.length)) * 100)
      : 0
    const passedAttempts = filteredProgress.filter((item) => item.passed).length
    const failedAttempts = filteredProgress.length - passedAttempts

    const chaptersData = chapters.map((chapter) => {
      const records = filteredProgress.filter((item) => item.chapterId === chapter.id)
      return {
        label: chapter.title.replace('Chapter ', 'Ch. '),
        score: records.length
          ? Math.round(records.reduce((sum, item) => sum + item.percentage, 0) / records.length)
          : 0,
      }
    })

    const teacherPerformance = users
      .filter((user) => user.role === 'teacher')
      .map((teacher) => {
        const teacherClasses = classes.filter((item) => item.teacherId === teacher.id)
        const classIds = teacherClasses.map((item) => item.id)
        const teacherRecords = filteredProgress.filter((item) => classIds.includes(item.classId))
        const roster = new Set(teacherClasses.flatMap((classroom) => getClassStudents(classroom.id).map((student) => student.id)))
        return {
          label: teacher.fullName,
          score: teacherRecords.length
            ? Math.round(teacherRecords.reduce((sum, item) => sum + item.percentage, 0) / teacherRecords.length)
            : 0,
          students: roster.size,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const attentionItems = classes
      .map((classroom) => {
        const classRecords = filteredProgress.filter((item) => item.classId === classroom.id)
        const passRate = classRecords.length
          ? Math.round((classRecords.filter((item) => item.passed).length / classRecords.length) * 100)
          : 0
        const studentsInClass = getClassStudents(classroom.id).length
        return {
          id: classroom.id,
          name: classroom.className,
          teacherName: users.find((user) => user.id === classroom.teacherId)?.fullName ?? 'Unknown teacher',
          passRate,
          students: studentsInClass,
          flag: studentsInClass === 0 ? 'No students joined yet' : passRate < 75 ? 'Pass rate below target' : null,
        }
      })
      .filter((item) => item.flag)
      .slice(0, 5)

    return {
      filteredProgress,
      teachers,
      students,
      activeClasses,
      averageScore,
      passingRate,
      completionRate,
      chaptersData,
      teacherPerformance,
      attentionItems,
      passedAttempts,
      failedAttempts,
      archivedClasses,
    }
  }, [allProgress, classes, range, users])

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{siteContent.dashboards.adminTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{siteContent.dashboards.adminSubtitle}</p>
        </div>
        <div className="admin-panel flex items-center gap-3 p-3">
          <label className="text-sm font-medium text-slate-700" htmlFor="admin-range">Filter window</label>
          <select
            id="admin-range"
            className="admin-select rounded-lg px-3 py-2 text-sm"
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricTile label="Teachers" value={teachers} hint="Active teaching accounts" accent="bg-violet-500" />
        <MetricTile label="Students" value={students} hint="Learners on the platform" accent="bg-sky-500" />
        <MetricTile label="Classes" value={activeClasses} hint={`${archivedClasses} archived sections`} accent="bg-emerald-500" />
        <MetricTile label="Attempts" value={filteredProgress.length} hint="Recorded submissions" accent="bg-amber-500" />
        <MetricTile label="Flags" value={attentionItems.length} hint="Classes needing follow-up" accent="bg-rose-500" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RingMetric label="Average Score" value={averageScore} caption={`${filteredProgress.length} recorded attempts`} color="#8b5cf6" />
        <RingMetric label="Passing Rate" value={passingRate} caption="Passed attempts in selected window" color="#10b981" />
        <RingMetric label="Coverage" value={completionRate} caption="Recorded attempts against chapter capacity" color="#0ea5e9" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-950">Chapter performance overview</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Average chapter scores help identify topics that may need intervention.</p>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">
              Chapter Scores
            </span>
          </div>
          <div className="mt-6">
            <BarChart items={chaptersData} labelKey="label" valueKey="score" suffix="%" colorClass="bg-sky-500" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black tracking-tight text-slate-950">Feedback queue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Classes that may need admin or teacher follow-up.</p>
          <div className="mt-5 space-y-3">
            {attentionItems.length ? attentionItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.teacherName}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-amber-700">{item.passRate}% pass</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-amber-800">{item.flag}</p>
              </div>
            )) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">No urgent follow-up items in the selected filter window.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black tracking-tight text-slate-950">Top teacher performance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Average student scores grouped by teacher-owned classes.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {teacherPerformance.map((item, index) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{item.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.students} students</p>
                  </div>
                  <span className="text-2xl font-black text-slate-950">{item.score}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${chartColors[index % chartColors.length]}`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
            {!teacherPerformance.length ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-600">No teacher performance records yet.</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black tracking-tight text-slate-950">Attempt outcomes</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">A quick pass and retry distribution for the selected window.</p>
          <div className="mt-6">
            <AttemptDistribution passed={passedAttempts} failed={failedAttempts} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
