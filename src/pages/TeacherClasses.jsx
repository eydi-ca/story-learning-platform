import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { createClass, deleteClass, getClassStudents, getTeacherClasses } from '../utils/classUtils'

function TeacherClasses() {
  const teacher = getCurrentUser()
  const [classes, setClasses] = useState(getTeacherClasses(teacher.id))
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ className: '', description: '', customCode: '' })
  const [error, setError] = useState('')

  function refresh() {
    setClasses(getTeacherClasses(teacher.id))
  }

  async function handleCreate(event) {
    event.preventDefault()
    const result = await createClass({ teacherId: teacher.id, ...form })
    if (result.error) {
      setError(result.error)
      return
    }
    setForm({ className: '', description: '', customCode: '' })
    setError('')
    setModalOpen(false)
    refresh()
  }

  async function handleDelete(classId) {
    if (window.confirm('Are you sure you want to delete this class? This may remove class progress connected to this class.')) {
      await deleteClass(classId)
      refresh()
    }
  }

  return (
    <section>
      <div className="flex justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950">{siteContent.dashboards.teacherClassesTitle}</h1>
          <p className="mt-2 text-slate-600">{siteContent.dashboards.teacherClassesSubtitle}</p>
        </div>
        <button className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" onClick={() => setModalOpen(true)}>Create Class</button>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600"><tr><th className="p-3">Class Name</th><th className="p-3">Class Code</th><th className="p-3">Students</th><th className="p-3">Created Date</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
          <tbody>
            {classes.map((classroom) => (
              <tr className="border-t border-slate-100" key={classroom.id}>
                <td className="p-3 font-semibold">{classroom.className}<p className="text-xs font-normal text-slate-500">{classroom.description}</p></td>
                <td className="p-3 font-mono font-bold text-sky-700">{classroom.classCode}</td>
                <td className="p-3">{getClassStudents(classroom.id).length}</td>
                <td className="p-3">{new Date(classroom.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{classroom.status}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Link className="font-bold text-sky-700" to={`/teacher/classes/${classroom.id}/students`}>View Students</Link>
                    <button className="font-bold text-slate-600" onClick={() => navigator.clipboard?.writeText(classroom.classCode)}>Copy Code</button>
                    <button className="font-bold text-red-700" onClick={() => handleDelete(classroom.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!classes.length ? <tr><td className="p-6 text-slate-500" colSpan="6">No classes yet.</td></tr> : null}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="Create New Class" onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleCreate}>
          {error ? <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-700">{error}</p> : null}
          <label className="block text-sm font-bold text-slate-700">Class Name / Section
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.className} onChange={(event) => setForm({ ...form, className: event.target.value })} />
          </label>
          <label className="block text-sm font-bold text-slate-700">Description optional
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="block text-sm font-bold text-slate-700">Custom code optional
            <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 uppercase" value={form.customCode} onChange={(event) => setForm({ ...form, customCode: event.target.value.toUpperCase() })} />
          </label>
          <button className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white">Generate Class Code</button>
        </form>
      </Modal>
    </section>
  )
}

export default TeacherClasses
