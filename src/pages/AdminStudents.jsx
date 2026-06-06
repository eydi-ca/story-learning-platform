import { useState } from 'react'
import { siteContent } from '../data/siteContent'
import { deleteStudent, getJoinedClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'
import { getUsers } from '../utils/storage'

function AdminStudents() {
  const [query, setQuery] = useState('')
  const [, setRefresh] = useState(0)
  const students = getUsers().filter(
    (user) => user.role === 'student' && user.fullName.toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete(studentId) {
    if (window.confirm('Are you sure you want to delete this student? This will remove the student account, class memberships, and progress records.')) {
      await deleteStudent(studentId)
      setRefresh((value) => value + 1)
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.adminStudentsTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.adminStudentsSubtitle}</p>
      <input className="mt-6 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Student Name</th><th className="p-3">Email / Username</th><th className="p-3">Joined Classes</th><th className="p-3">Average Progress</th><th className="p-3">Average Score</th><th className="p-3">Date Created</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const classes = getJoinedClasses(student.id)
              const summaries = classes.map((classroom) => getClassCompletionSummary(student.id, classroom.id))
              const avgProgress = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.overallPercentage, 0) / summaries.length) : 0
              const avgScore = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.averageScore, 0) / summaries.length) : 0
              return (
                <tr className="border-t border-slate-100" key={student.id}>
                  <td className="p-3 font-semibold">{student.fullName}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{classes.map((classroom) => classroom.classCode).join(', ') || '-'}</td>
                  <td className="p-3">{avgProgress}%</td>
                  <td className="p-3">{avgScore}%</td>
                  <td className="p-3">{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button className="mr-3 font-bold text-sky-700" type="button">View</button><button className="font-bold text-red-700" onClick={() => void handleDelete(student.id)} type="button">Delete</button></td>
                </tr>
              )
            })}
            {!students.length ? <tr><td className="p-6 text-slate-500" colSpan="7">No students found.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminStudents
