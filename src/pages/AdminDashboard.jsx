import { useMemo, useState } from 'react'
import StatCard from '../components/StatCard'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getClassStudents } from '../utils/classUtils'
import { getClasses, getProgressRecords, getUsers } from '../utils/storage'

function getRangeDate(range) {
  if (range === 'all') return null
  const days = Number(range)
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function BarChart({ items, valueKey, labelKey, colorClass = 'bg-slate-900', suffix = '' }) {
  const max = Math.max(...items.map((item) => item[valueKey]), 1)

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item[labelKey]}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-slate-700">{item[labelKey]}</span>
            <span className="text-slate-500">{item[valueKey]}{suffix}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-sm bg-slate-100">
            <div
              className={`h-full rounded-sm ${colorClass} transition-all duration-500`}
              style={{ width: `${Math.max((item[valueKey] / max) * 100, item[valueKey] ? 10 : 0)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function AdminDashboard() {
  const [range, setRange] = useState('30')
  const users = getUsers()
  const classes = getClasses()
  const allProgress = getProgressRecords()

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
  } = useMemo(() => {
    const rangeDate = getRangeDate(range)
    const filteredProgress = rangeDate
      ? allProgress.filter((item) => new Date(item.completedAt) >= rangeDate)
      : allProgress

    const teachers = users.filter((user) => user.role === 'teacher').length
    const students = users.filter((user) => user.role === 'student').length
    const activeClasses = classes.filter((classroom) => classroom.status !== 'archived').length
    const averageScore = filteredProgress.length
      ? Math.round(filteredProgress.reduce((sum, item) => sum + item.percentage, 0) / filteredProgress.length)
      : 0
    const passingRate = filteredProgress.length
      ? Math.round((filteredProgress.filter((item) => item.passed).length / filteredProgress.length) * 100)
      : 0
    const completionRate = students && chapters.length
      ? Math.round((filteredProgress.length / (students * chapters.length)) * 100)
      : 0

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
        <StatCard label="Teachers" value={teachers} hint="Active teaching accounts" />
        <StatCard label="Students" value={students} hint="Learners on the platform" />
        <StatCard label="Classes" value={activeClasses} hint="Active class sections" />
        <StatCard label="Average Score" value={`${averageScore}%`} hint={`${filteredProgress.length} recorded attempts`} />
        <StatCard label="Passing Rate" value={`${passingRate}%`} hint={`Completion coverage ${completionRate}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="admin-panel p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">Chapter performance overview</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Average chapter scores help identify topics that may need intervention.</p>
            </div>
          </div>
          <div className="mt-6">
            <BarChart items={chaptersData} labelKey="label" valueKey="score" suffix="%" />
          </div>
        </div>

        <div className="admin-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Feedback queue</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Classes that may need admin or teacher follow-up.</p>
          <div className="mt-5 space-y-3">
            {attentionItems.length ? attentionItems.map((item) => (
              <div key={item.id} className="admin-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.teacherName}</p>
                  </div>
                  <span className="rounded-sm bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{item.passRate}% pass</span>
                </div>
                <p className="mt-3 text-sm text-amber-700">{item.flag}</p>
              </div>
            )) : (
              <div className="admin-card p-4">
                <p className="text-sm text-slate-600">No urgent follow-up items in the selected filter window.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="admin-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Top teacher performance</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Average student scores grouped by teacher-owned classes.</p>
          <div className="mt-6">
            <BarChart items={teacherPerformance.map((item) => ({ ...item, label: `${item.label} (${item.students})` }))} labelKey="label" valueKey="score" suffix="%" colorClass="bg-slate-700" />
          </div>
        </div>

        <div className="admin-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Dashboard notes</h2>
          <div className="mt-4 space-y-4">
            <div className="admin-card p-4">
              <p className="text-sm font-medium text-slate-900">What we measure</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Teacher count, student coverage, class participation, score trends, and pass rates.</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm font-medium text-slate-900">What needs attention</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Classes with no students or low pass rates appear in the feedback queue for quick review.</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm font-medium text-slate-900">Data source</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">This dashboard reads current synced class, user, and progress records from the active workspace state.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
