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
    <section>
      <h1 className="text-3xl font-black text-slate-950">{teacher.fullName} Classes</h1>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Class Name / Section</th><th className="p-3">Class Code</th><th className="p-3">Teacher</th><th className="p-3">Students</th><th className="p-3">Average Progress</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {classes.map((classroom) => {
              const students = getClassStudents(classroom.id)
              const avg = students.length ? Math.round(students.reduce((sum, student) => sum + getClassCompletionSummary(student.id, classroom.id).overallPercentage, 0) / students.length) : 0
              return (
                <tr className="border-t border-slate-100" key={classroom.id}>
                  <td className="p-3 font-semibold">{classroom.className}</td>
                  <td className="p-3 font-mono font-bold text-sky-700">{classroom.classCode}</td>
                  <td className="p-3">{teacher.fullName}</td>
                  <td className="p-3">{students.length}</td>
                  <td className="p-3">{avg}%</td>
                  <td className="p-3">{classroom.status}</td>
                  <td className="p-3"><Link className="font-bold text-sky-700" to={`/admin/classes/${classroom.id}/students`}>View Students</Link></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminTeacherClasses
