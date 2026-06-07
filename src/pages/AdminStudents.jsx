import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { siteContent } from '../data/siteContent'
import { deleteStudent, getJoinedClasses } from '../utils/classUtils'
import { getClassCompletionSummary } from '../utils/progress'
import { getUsers } from '../utils/storage'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function AdminStudents() {
  const [query, setQuery] = useState('')
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [, setRefresh] = useState(0)
  const students = getUsers().filter(
    (user) =>
      user.role === 'student' &&
      `${user.fullName} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete(studentId) {
    await deleteStudent(studentId)
    setRefresh((value) => value + 1)
    setStudentToDelete(null)
  }

  return (
    <>
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{siteContent.dashboards.adminStudentsTitle}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{siteContent.dashboards.adminStudentsSubtitle}</p>
        </div>
        <div className="relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <SearchIcon />
          </span>
          <input className="admin-input w-full rounded-lg py-2.5 pl-10 pr-3 text-sm" placeholder="Search students by name or email" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="admin-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead className="text-slate-600"><tr><th className="px-4 py-3 font-medium">Student Name</th><th className="px-4 py-3 font-medium">Email</th><th className="px-4 py-3 font-medium">Joined Classes</th><th className="px-4 py-3 font-medium">Average Progress</th><th className="px-4 py-3 font-medium">Average Score</th><th className="px-4 py-3 font-medium">Date Created</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {students.map((student) => {
              const classes = getJoinedClasses(student.id)
              const summaries = classes.map((classroom) => getClassCompletionSummary(student.id, classroom.id))
              const avgProgress = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.overallPercentage, 0) / summaries.length) : 0
              const avgScore = summaries.length ? Math.round(summaries.reduce((sum, item) => sum + item.averageScore, 0) / summaries.length) : 0
              return (
                <tr key={student.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{student.fullName}</td>
                  <td className="px-4 py-3 text-slate-600">{student.email}</td>
                  <td className="px-4 py-3 text-slate-600">{classes.map((classroom) => classroom.classCode).join(', ') || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{avgProgress}%</td>
                  <td className="px-4 py-3 text-slate-600">{avgScore}%</td>
                  <td className="px-4 py-3 text-slate-600">{new Date(student.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><button className="text-sm font-medium text-red-700 underline-offset-4 hover:underline" onClick={() => setStudentToDelete(student)} type="button">Disable</button></td>
                </tr>
              )
            })}
            {!students.length ? <tr><td className="px-4 py-8 text-slate-500" colSpan="7">No students found.</td></tr> : null}
          </tbody>
            </table>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(studentToDelete)}
        title="Disable student account?"
        message="This will disable the student profile and remove access to their learning workspace."
        confirmLabel="Disable student"
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => void handleDelete(studentToDelete.id)}
      />
    </>
  )
}

export default AdminStudents
