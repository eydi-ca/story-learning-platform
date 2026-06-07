import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
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
      <div>
        <h1 className="magic-heading text-3xl font-black">{siteContent.dashboards.teacherStudentsTitle}</h1>
        <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{siteContent.dashboards.teacherStudentsSubtitle}</p>
        <h2 className="mt-4 text-xl font-black text-[color:var(--brown)]">{classroom.className}</h2>
        <p className="mt-2 text-[color:var(--muted)]">Class code: <span className="font-mono font-bold text-violet-700">{classroom.classCode}</span></p>
      </div>
      <div className="relative w-full max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[color:var(--muted)]/70">
          <SearchIcon />
        </span>
        <input className="w-full rounded-2xl border border-[color:var(--border)] bg-white/80 py-2.5 pl-10 pr-3 text-sm text-[color:var(--brown)]" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="parchment-surface overflow-hidden rounded-[24px]">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[color:var(--brown)]"><tr><th className="p-4 font-bold">Student Name</th><th className="p-4 font-bold">Progress</th><th className="p-4 font-bold">Current Chapter</th><th className="p-4 font-bold">Completed Chapters</th><th className="p-4 font-bold">Latest Score</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold">Last Active</th><th className="p-4 font-bold">Action</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const summary = getClassCompletionSummary(student.id, classroom.id)
              return (
                <tr className="border-t border-[color:var(--border)]/40" key={student.id}>
                  <td className="p-4 font-semibold text-[color:var(--brown)]">{student.fullName}</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.overallPercentage}%</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.currentChapter}</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.completedCount}</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.latest ? `${summary.latest.percentage}%` : '-'}</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.overallPercentage === 100 ? 'Complete' : 'In progress'}</td>
                  <td className="p-4 text-[color:var(--muted)]">{summary.latest ? new Date(summary.latest.completedAt).toLocaleString() : '-'}</td>
                  <td className="p-4 font-semibold text-violet-700">View Details</td>
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
