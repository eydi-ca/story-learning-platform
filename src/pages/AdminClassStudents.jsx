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
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{classroom.className} Students</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Teacher: {teacher?.fullName ?? 'Unknown'} · Code: {classroom.classCode}</p>
      </div>
      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-full text-left text-sm">
            <thead className="text-slate-600"><tr><th className="px-4 py-3 font-medium">Student Name</th><th className="px-4 py-3 font-medium">Class Code</th><th className="px-4 py-3 font-medium">Current Chapter</th><th className="px-4 py-3 font-medium">Completed</th><th className="px-4 py-3 font-medium">Progress %</th><th className="px-4 py-3 font-medium">Average Score</th><th className="px-4 py-3 font-medium">Pass/Fail</th><th className="px-4 py-3 font-medium">Last Active</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const summary = getClassCompletionSummary(student.id, classroom.id)
              return (
                <tr key={student.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{student.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{classroom.classCode}</td>
                  <td className="px-4 py-3 text-slate-600">{summary.currentChapter}</td>
                  <td className="px-4 py-3 text-slate-600">{summary.completedCount}</td>
                  <td className="px-4 py-3 text-slate-600">{summary.overallPercentage}%</td>
                  <td className="px-4 py-3 text-slate-600">{summary.averageScore}%</td>
                  <td className="px-4 py-3 text-slate-600">{summary.latest ? (summary.latest.passed ? 'Pass' : 'Fail') : '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{summary.latest ? new Date(summary.latest.completedAt).toLocaleString() : '-'}</td>
                </tr>
              )
            })}
          </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminClassStudents
