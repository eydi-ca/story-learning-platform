import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getClassById, getClassStudents } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function formatLastActive(value) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return {
    date: date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

function TeacherClassStudents() {
  const { classId } = useParams()
  const classroom = getClassById(classId)
  const [query, setQuery] = useState('')
  const students = useMemo(() => {
    if (!classroom) return []
    return getClassStudents(classroom.id).filter((student) =>
      student.fullName.toLowerCase().includes(query.toLowerCase())
    )
  }, [classroom, query])

  if (!classroom) return <Navigate to="/teacher/classes" replace />

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="magic-heading text-3xl font-black">{siteContent.dashboards.teacherStudentsTitle}</h1>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{siteContent.dashboards.teacherStudentsSubtitle}</p>
          <h2 className="mt-4 text-xl font-black text-[color:var(--brown)]">{classroom.className}</h2>
          <p className="mt-2 text-[color:var(--muted)]">Class code: <span className="font-mono font-bold text-violet-700">{classroom.classCode}</span></p>
        </div>
        <Link
          className="teacher-secondary-button rounded-2xl px-4 py-2.5 text-sm font-bold"
          to="/teacher/classes"
        >
          Back to classes
        </Link>
      </div>
      <div className="relative w-full max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[color:var(--muted)]/70">
          <SearchIcon />
        </span>
        <input className="w-full rounded-2xl border border-[color:var(--border)] bg-white/80 py-2.5 pl-10 pr-3 text-sm text-[color:var(--brown)]" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="overflow-hidden rounded-[18px] border border-[color:var(--border)]/70 bg-white/20">
        <div className="overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left text-[13px] sm:text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[7%]" />
              <col className="w-[24%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
              <col className="w-[10%]" />
              <col className="w-[17%]" />
              <col className="w-[9%]" />
            </colgroup>
            <thead className="bg-[rgb(255_249_232_/_0.72)] text-[color:var(--brown)]">
              <tr>
                <th className="px-3 py-4 font-black leading-5">Student</th>
                <th className="px-2 py-4 text-center font-black leading-5">Progress</th>
                <th className="px-3 py-4 font-black leading-5">Current Chapter</th>
                <th className="px-2 py-4 text-center font-black leading-5">Completed</th>
                <th className="px-2 py-4 text-center font-black leading-5">Latest Score</th>
                <th className="px-3 py-4 font-black leading-5">Status</th>
                <th className="px-3 py-4 font-black leading-5">Last Active</th>
                <th className="px-3 py-4 font-black leading-5">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const summary = getClassCompletionSummary(student.id, classroom.id)
                const complete = summary.overallPercentage === 100
                const lastActive = formatLastActive(summary.latest?.completedAt)
                return (
                  <tr className="border-t border-[color:var(--border)]/45 align-middle" key={student.id}>
                    <td className="px-3 py-4">
                      <p className="font-black leading-6 text-[color:var(--brown)]">{student.fullName}</p>
                    </td>
                    <td className="px-2 py-4 text-center font-semibold text-[color:var(--brown)]">
                      {summary.overallPercentage}%
                    </td>
                    <td className="px-3 py-4">
                      <p className="leading-6 text-[color:var(--muted)]">{summary.currentChapter}</p>
                    </td>
                    <td className="px-2 py-4 text-center font-semibold text-[color:var(--muted)]">{summary.completedCount} / {chapters.length}</td>
                    <td className="px-2 py-4 text-center font-semibold text-[color:var(--muted)]">{summary.latest ? `${summary.latest.percentage}%` : '-'}</td>
                    <td className="px-3 py-4">
                      <p className={complete ? 'font-semibold text-emerald-700' : 'font-semibold text-[color:var(--muted)]'}>
                        {complete ? 'Complete' : 'In progress'}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-[color:var(--muted)]">
                      {lastActive ? (
                        <span className="block leading-6">
                          <span className="block whitespace-nowrap">{lastActive.date}</span>
                          <span className="block whitespace-nowrap">{lastActive.time}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <Link
                        className="whitespace-nowrap font-bold text-violet-700 underline-offset-4 hover:underline"
                        to={`/teacher/classes/${classroom.id}/students/${student.id}`}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {!students.length ? <tr><td className="p-6 text-[color:var(--muted)]" colSpan="8">No students have joined this class yet. Share the class code with your students.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default TeacherClassStudents
