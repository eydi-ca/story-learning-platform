import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { deleteTeacher, getClassStudents, getTeacherClasses } from '../utils/classUtils'
import { getUsers } from '../utils/storage'

function AdminTeachers() {
  const [query, setQuery] = useState('')
  const [, setRefresh] = useState(0)
  const teachers = getUsers().filter(
    (user) => user.role === 'teacher' && user.fullName.toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete(teacherId) {
    if (window.confirm('Are you sure you want to delete this teacher? This will also remove classes created by this teacher.')) {
      await deleteTeacher(teacherId)
      setRefresh((value) => value + 1)
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.adminTeachersTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.dashboards.adminTeachersSubtitle}</p>
      <input className="mt-6 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2" placeholder="Search teachers" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Teacher Name</th><th className="p-3">Email / Username</th><th className="p-3">Total Classes</th><th className="p-3">Total Students</th><th className="p-3">Date Created</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {teachers.map((teacher) => {
              const classes = getTeacherClasses(teacher.id)
              const students = new Set(classes.flatMap((classroom) => getClassStudents(classroom.id).map((student) => student.id)))
              return (
                <tr className="border-t border-slate-100" key={teacher.id}>
                  <td className="p-3 font-semibold">{teacher.fullName}</td>
                  <td className="p-3">{teacher.email}</td>
                  <td className="p-3">{classes.length}</td>
                  <td className="p-3">{students.size}</td>
                  <td className="p-3">{new Date(teacher.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><Link className="mr-3 font-bold text-sky-700" to={`/admin/teachers/${teacher.id}/classes`}>View Classes</Link><button className="font-bold text-red-700" onClick={() => void handleDelete(teacher.id)} type="button">Delete</button></td>
                </tr>
              )
            })}
            {!teachers.length ? <tr><td className="p-6 text-slate-500" colSpan="6">No teachers found.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminTeachers
