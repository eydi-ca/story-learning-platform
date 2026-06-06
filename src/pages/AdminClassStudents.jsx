import { Navigate, useParams } from 'react-router-dom'
import { getUserById } from '../utils/auth'
import { getClassById, getClassStudents } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

function AdminClassStudents() {
  const { classId } = useParams()
  const classroom = getClassById(classId)
  if (!classroom) return <Navigate to="/admin/teachers" replace />

  const teacher = getUserById(classroom.teacherId)
  const students = getClassStudents(classroom.id)

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{classroom.className} Students</h1>
      <p className="mt-2 text-slate-600">Teacher: {teacher?.fullName ?? 'Unknown'} - Code: {classroom.classCode}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Student Name</th><th className="p-3">Class Code</th><th className="p-3">Current Chapter</th><th className="p-3">Completed</th><th className="p-3">Progress %</th><th className="p-3">Average Score</th><th className="p-3">Pass/Fail</th><th className="p-3">Last Active</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const summary = getClassCompletionSummary(student.id, classroom.id)
              return (
                <tr className="border-t border-slate-100" key={student.id}>
                  <td className="p-3 font-semibold">{student.fullName}</td>
                  <td className="p-3">{classroom.classCode}</td>
                  <td className="p-3">{summary.currentChapter}</td>
                  <td className="p-3">{summary.completedCount}</td>
                  <td className="p-3">{summary.overallPercentage}%</td>
                  <td className="p-3">{summary.averageScore}%</td>
                  <td className="p-3">{summary.latest ? (summary.latest.passed ? 'Pass' : 'Fail') : '-'}</td>
                  <td className="p-3">{summary.latest ? new Date(summary.latest.completedAt).toLocaleString() : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminClassStudents
