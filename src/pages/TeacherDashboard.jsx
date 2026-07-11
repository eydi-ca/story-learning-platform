import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getClassStudents, getTeacherClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

const chartColors = ['bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500']

function MetricTile({ label, value, hint, accent = 'bg-sky-500' }) {
  return (
    <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`h-10 w-2 rounded-full ${accent}`} />
      </div>
    </div>
  )
}

function RingMetric({ label, value, color = '#0284c7' }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const normalizedValue = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (normalizedValue / 100) * circumference

  return (
    <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-5 shadow-sm">
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
        </div>
      </div>
    </div>
  )
}

function TeacherBarChart({ items, colorClass = 'bg-amber-500', suffix = '%' }) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-slate-800">{item.label}</span>
            <span className="font-black text-slate-950">{item.value}{suffix}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${colorClass} transition-all duration-500`}
              style={{ width: `${Math.max((item.value / max) * 100, item.value ? 10 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function DistributionBar({ excellent, developing, needsSupport }) {
  const total = Math.max(excellent + developing + needsSupport, 1)
  const segments = [
    { label: 'Excellent', value: excellent, className: 'bg-emerald-500' },
    { label: 'Developing', value: developing, className: 'bg-amber-400' },
    { label: 'Needs support', value: needsSupport, className: 'bg-rose-500' },
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
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
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

function TeacherDashboard() {
  const teacher = getCurrentUser()
  const classes = getTeacherClasses(teacher.id)

  const {
    uniqueStudentCount,
    summaries,
    averageProgress,
    averageScore,
    passRate,
    chapterPerformance,
    classPerformance,
    attentionList,
    excellentCount,
    developingCount,
    supportCount,
    completedChapters,
  } = useMemo(() => {
    const classStudents = classes.map((classroom) => ({
      classroom,
      students: getClassStudents(classroom.id),
    }))

    const summaries = classStudents.flatMap(({ classroom, students }) =>
      students.map((student) => ({
        classroom,
        student,
        summary: getClassCompletionSummary(student.id, classroom.id),
      }))
    )

    const uniqueStudentCount = new Set(
      classStudents.flatMap(({ students }) => students.map((student) => student.id))
    ).size

    const averageProgress = summaries.length
      ? Math.round(
          summaries.reduce((sum, item) => sum + item.summary.overallPercentage, 0) / summaries.length
        )
      : 0

    const averageScore = summaries.length
      ? Math.round(
          summaries.reduce((sum, item) => sum + item.summary.averageScore, 0) / summaries.length
        )
      : 0

    const passedLatest = summaries.filter((item) => item.summary.latest?.passed).length
    const passRate = summaries.length ? Math.round((passedLatest / summaries.length) * 100) : 0

    const chapterPerformance = chapters.map((chapter) => {
      const records = summaries
        .map((item) => item.summary.progress.find((progress) => progress.chapterId === chapter.id))
        .filter(Boolean)
      return {
        label: chapter.title.replace('Chapter ', 'Ch. '),
        value: records.length
          ? Math.round(records.reduce((sum, item) => sum + item.percentage, 0) / records.length)
          : 0,
      }
    })

    const classPerformance = classStudents.map(({ classroom, students }) => {
      const relatedSummaries = summaries.filter((item) => item.classroom.id === classroom.id)
      return {
        label: classroom.className,
        value: relatedSummaries.length
          ? Math.round(
              relatedSummaries.reduce((sum, item) => sum + item.summary.averageScore, 0) /
                relatedSummaries.length
            )
          : 0,
        students: students.length,
      }
    })

    const attentionList = summaries
      .filter(
        (item) =>
          item.summary.latest &&
          (!item.summary.latest.passed || item.summary.averageScore < 75)
      )
      .slice(0, 5)

    const excellentCount = summaries.filter((item) => item.summary.averageScore >= 90).length
    const developingCount = summaries.filter(
      (item) => item.summary.averageScore >= 75 && item.summary.averageScore < 90
    ).length
    const supportCount = summaries.filter((item) => item.summary.averageScore < 75).length
    const completedChapters = summaries.reduce(
      (sum, item) => sum + item.summary.progress.filter((progress) => progress.passed).length,
      0
    )

    return {
      uniqueStudentCount,
      summaries,
      averageProgress,
      averageScore,
      passRate,
      chapterPerformance,
      classPerformance,
      attentionList,
      excellentCount,
      developingCount,
      supportCount,
      completedChapters,
    }
  }, [classes, teacher.id])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="magic-heading text-3xl font-black">{siteContent.dashboards.teacherTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{siteContent.dashboards.teacherSubtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Classes" value={classes.length} hint="Active sections you manage" accent="bg-violet-500" />
        <MetricTile label="Students" value={uniqueStudentCount} hint="Unique learners across classes" accent="bg-sky-500" />
        <MetricTile label="Completed" value={completedChapters} hint="Passed chapter attempts recorded" accent="bg-emerald-500" />
        <MetricTile label="Support Flags" value={attentionList.length} hint="Students needing follow-up" accent="bg-rose-500" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RingMetric label="Progress" value={averageProgress} color="#0ea5e9" />
        <RingMetric label="Average Score" value={averageScore} color="#8b5cf6" />
        <RingMetric label="Pass Rate" value={passRate} color="#10b981" />
      </div>

      {!classes.length ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800">
          {siteContent.dashboards.teacherEmpty}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link className="gold-button interactive-button rounded-xl px-5 py-3 font-bold" to="/teacher/classes">Create Class</Link>
        <Link className="outline-magic-button interactive-button rounded-xl border px-5 py-3 font-bold" to="/teacher/classes">View Classes</Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Chapter mastery</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">See which story chapters need more reinforcement across your students.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
              Story Progress
            </span>
          </div>
          <div className="mt-6">
            <TeacherBarChart items={chapterPerformance} />
          </div>
        </div>

        <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Students needing support</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Recent low performance or failed attempts that may need follow-up.</p>
          <div className="mt-5 space-y-3">
            {attentionList.length ? attentionList.map((item) => (
              <div key={`${item.classroom.id}_${item.student.id}`} className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{item.student.fullName}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.classroom.className}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-rose-700">
                    {item.summary.averageScore}%
                  </span>
                </div>
                <p className="mt-3 text-sm text-rose-700">
                  Latest score: {item.summary.latest?.percentage ?? 0}% / Avg score: {item.summary.averageScore}%
                </p>
              </div>
            )) : (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">No urgent support flags right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Class performance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Average class performance helps you compare sections at a glance.</p>
          <div className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {classPerformance.map((item, index) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-950">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.students} students</p>
                    </div>
                    <span className="text-2xl font-black text-slate-950">{item.value}%</span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${chartColors[index % chartColors.length]}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[color:var(--border)]/70 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Learner distribution</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">A quick view of overall student performance bands.</p>
          <div className="mt-6">
            <DistributionBar excellent={excellentCount} developing={developingCount} needsSupport={supportCount} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeacherDashboard
