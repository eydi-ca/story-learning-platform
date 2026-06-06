import { useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { getClassById, getClassStudents } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

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
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.teacherStudentsTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.teacherStudentsSubtitle}</p>
      <h2 className="mt-4 text-xl font-black text-slate-950">{classroom.className}</h2>
      <p className="mt-2 text-slate-600">Class code: <span className="font-mono font-bold text-sky-700">{classroom.classCode}</span></p>
      <input className="mt-6 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Student Name</th><th className="p-3">Progress</th><th className="p-3">Current Chapter</th><th className="p-3">Completed Chapters</th><th className="p-3">Latest Score</th><th className="p-3">Status</th><th className="p-3">Last Active</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const summary = getClassCompletionSummary(student.id, classroom.id)
              return (
                <tr className="border-t border-slate-100" key={student.id}>
                  <td className="p-3 font-semibold">{student.fullName}</td>
                  <td className="p-3">{summary.overallPercentage}%</td>
                  <td className="p-3">{summary.currentChapter}</td>
                  <td className="p-3">{summary.completedCount}</td>
                  <td className="p-3">{summary.latest ? `${summary.latest.percentage}%` : '-'}</td>
                  <td className="p-3">{summary.overallPercentage === 100 ? 'Complete' : 'In progress'}</td>
                  <td className="p-3">{summary.latest ? new Date(summary.latest.completedAt).toLocaleString() : '-'}</td>
                  <td className="p-3">View Details</td>
                </tr>
              )
            })}
            {!students.length ? <tr><td className="p-6 text-slate-500" colSpan="8">No students have joined this class yet. Share the class code with your students.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TeacherClassStudents
