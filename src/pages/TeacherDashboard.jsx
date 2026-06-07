import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getClassStudents, getTeacherClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

function TeacherBarChart({ items, colorClass = 'bg-amber-500', suffix = '%' }) {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[color:var(--brown)]">{item.label}</span>
            <span className="text-[color:var(--muted)]">{item.value}{suffix}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/70">
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

    return {
      uniqueStudentCount,
      summaries,
      averageProgress,
      averageScore,
      passRate,
      chapterPerformance,
      classPerformance,
      attentionList,
    }
  }, [classes, teacher.id])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="magic-heading text-3xl font-black">{siteContent.dashboards.teacherTitle}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{siteContent.dashboards.teacherSubtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Classes" value={classes.length} hint="Active sections you manage" />
        <StatCard label="Students" value={uniqueStudentCount} hint="Unique learners across classes" />
        <StatCard label="Progress" value={`${averageProgress}%`} hint={`${summaries.length} monitored student summaries`} />
        <StatCard label="Average Score" value={`${averageScore}%`} hint="Across current recorded attempts" />
        <StatCard label="Pass Rate" value={`${passRate}%`} hint="Latest student outcomes" />
      </div>

      {!classes.length ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 font-semibold text-amber-800">
          {siteContent.dashboards.teacherEmpty}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link className="gold-button interactive-button rounded-2xl px-5 py-3 font-bold" to="/teacher/classes">Create Class</Link>
        <Link className="outline-magic-button interactive-button rounded-2xl border px-5 py-3 font-bold" to="/teacher/classes">View Classes</Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="parchment-surface rounded-[24px] p-6">
          <h2 className="text-2xl font-black text-[color:var(--brown)]">Chapter mastery</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">See which story chapters need more reinforcement across your students.</p>
          <div className="mt-6">
            <TeacherBarChart items={chapterPerformance} />
          </div>
        </div>

        <div className="parchment-surface rounded-[24px] p-6">
          <h2 className="text-2xl font-black text-[color:var(--brown)]">Students needing support</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Recent low performance or failed attempts that may need follow-up.</p>
          <div className="mt-5 space-y-3">
            {attentionList.length ? attentionList.map((item) => (
              <div key={`${item.classroom.id}_${item.student.id}`} className="rounded-2xl border border-[color:var(--border)]/60 bg-white/70 p-4">
                <p className="font-bold text-[color:var(--brown)]">{item.student.fullName}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{item.classroom.className}</p>
                <p className="mt-3 text-sm text-amber-700">
                  Latest score: {item.summary.latest?.percentage ?? 0}% · Avg score: {item.summary.averageScore}%
                </p>
              </div>
            )) : (
              <div className="rounded-2xl border border-[color:var(--border)]/60 bg-white/70 p-4">
                <p className="text-sm text-[color:var(--muted)]">No urgent support flags right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="parchment-surface rounded-[24px] p-6">
          <h2 className="text-2xl font-black text-[color:var(--brown)]">Class health</h2>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Average class performance helps you compare sections at a glance.</p>
          <div className="mt-6">
            <TeacherBarChart
              items={classPerformance.map((item) => ({
                label: `${item.label} (${item.students})`,
                value: item.value,
              }))}
              colorClass="bg-violet-500"
            />
          </div>
        </div>

        <div className="parchment-surface rounded-[24px] p-6">
          <h2 className="text-2xl font-black text-[color:var(--brown)]">Monitoring notes</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-[color:var(--border)]/60 bg-white/70 p-4">
              <p className="font-bold text-[color:var(--brown)]">What you can monitor</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Class counts, student participation, chapter mastery, average scores, and recent support signals.</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--border)]/60 bg-white/70 p-4">
              <p className="font-bold text-[color:var(--brown)]">Best next step</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">Open your classes to review each student list and identify who needs extra guidance per chapter.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeacherDashboard
