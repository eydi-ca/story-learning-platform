import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { createClass, deleteClass, getClassStudents, getTeacherClasses } from '../utils/classUtils'

function TeacherClasses() {
  const teacher = getCurrentUser()
  const [classes, setClasses] = useState(getTeacherClasses(teacher.id))
  const [modalOpen, setModalOpen] = useState(false)
  const [classToDelete, setClassToDelete] = useState(null)
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
    await deleteClass(classId)
    setClassToDelete(null)
    refresh()
  }

  return (
    <>
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="magic-heading text-3xl font-black">{siteContent.dashboards.teacherClassesTitle}</h1>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{siteContent.dashboards.teacherClassesSubtitle}</p>
        </div>
        <button className="gold-button interactive-button rounded-2xl px-5 py-3 font-bold" onClick={() => setModalOpen(true)}>Create Class</button>
      </div>
      <div className="parchment-surface overflow-hidden rounded-[24px]">
        <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[color:var(--brown)]"><tr><th className="p-4 font-bold">Class Name</th><th className="p-4 font-bold">Class Code</th><th className="p-4 font-bold">Students</th><th className="p-4 font-bold">Created Date</th><th className="p-4 font-bold">Status</th><th className="p-4 font-bold">Actions</th></tr></thead>
          <tbody>
            {classes.map((classroom) => (
              <tr className="border-t border-[color:var(--border)]/40" key={classroom.id}>
                <td className="p-4 font-semibold text-[color:var(--brown)]">{classroom.className}<p className="text-xs font-normal text-[color:var(--muted)]">{classroom.description}</p></td>
                <td className="p-4 font-mono font-bold text-violet-700">{classroom.classCode}</td>
                <td className="p-4 text-[color:var(--muted)]">{getClassStudents(classroom.id).length}</td>
                <td className="p-4 text-[color:var(--muted)]">{new Date(classroom.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-[color:var(--muted)]">{classroom.status}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Link className="font-bold text-violet-700" to={`/teacher/classes/${classroom.id}/students`}>View Students</Link>
                    <button className="font-bold text-[color:var(--muted)]" onClick={() => navigator.clipboard?.writeText(classroom.classCode)}>Copy Code</button>
                    <button className="font-bold text-red-700" onClick={() => setClassToDelete(classroom)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!classes.length ? <tr><td className="p-6 text-[color:var(--muted)]" colSpan="6">No classes yet.</td></tr> : null}
          </tbody>
        </table>
        </div>
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
    <ConfirmDialog
      open={Boolean(classToDelete)}
      title="Delete this class?"
      message="This may remove class memberships and progress connected to this class."
      confirmLabel="Delete class"
      onClose={() => setClassToDelete(null)}
      onConfirm={() => void handleDelete(classToDelete.id)}
    />
    </>
  )
}

export default TeacherClasses
