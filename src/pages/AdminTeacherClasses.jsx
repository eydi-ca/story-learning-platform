import { Link, Navigate, useParams } from 'react-router-dom'
import { getUserById } from '../utils/auth'
import { getClassStudents, getTeacherClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'

function AdminTeacherClasses() {
  const { teacherId } = useParams()
  const teacher = getUserById(teacherId)
  const classes = getTeacherClasses(teacherId)

  if (!teacher) return <Navigate to="/admin/teachers" replace />

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{teacher.fullName} Classes</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Review the teacher’s sections before opening the student roster.</p>
      </div>
      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-full text-left text-sm">
            <thead className="text-slate-600"><tr><th className="px-4 py-3 font-medium">Class Name / Section</th><th className="px-4 py-3 font-medium">Class Code</th><th className="px-4 py-3 font-medium">Teacher</th><th className="px-4 py-3 font-medium">Students</th><th className="px-4 py-3 font-medium">Average Progress</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Action</th></tr></thead>
          <tbody>
            {classes.map((classroom) => {
              const students = getClassStudents(classroom.id)
              const avg = students.length ? Math.round(students.reduce((sum, student) => sum + getClassCompletionSummary(student.id, classroom.id).overallPercentage, 0) / students.length) : 0
              return (
                <tr key={classroom.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{classroom.className}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-slate-700">{classroom.classCode}</td>
                  <td className="px-4 py-3 text-slate-600">{teacher.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{students.length}</td>
                  <td className="px-4 py-3 text-slate-600">{avg}%</td>
                  <td className="px-4 py-3 text-slate-600">{classroom.status}</td>
                  <td className="px-4 py-3"><Link className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline" to={`/admin/classes/${classroom.id}/students`}>View Students</Link></td>
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

export default AdminTeacherClasses
