import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import Modal from '../components/Modal'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { createClass, deleteClass, getClassStudents, getTeacherClasses } from '../utils/classUtils'

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m14.5 5.5 4 4M4 20h4l10.5-10.5a2.83 2.83 0 0 0-4-4L4 16v4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[33%]" />
          </colgroup>
          <thead className="text-[color:var(--brown)]"><tr><th className="px-5 py-4 font-bold">Class Name</th><th className="px-5 py-4 font-bold">Class Code</th><th className="px-4 py-4 text-center font-bold">Students</th><th className="px-5 py-4 font-bold">Created Date</th><th className="px-5 py-4 font-bold">Status</th><th className="px-5 py-4 font-bold">Actions</th></tr></thead>
          <tbody>
            {classes.map((classroom) => (
              <tr className="border-t border-[color:var(--border)]/40" key={classroom.id}>
                <td className="px-5 py-5 font-semibold text-[color:var(--brown)]">{classroom.className}<p className="mt-1 text-xs font-normal leading-5 text-[color:var(--muted)]">{classroom.description}</p></td>
                <td className="px-5 py-5 font-mono font-bold text-violet-700">{classroom.classCode}</td>
                <td className="px-4 py-5 text-center text-[color:var(--muted)]">{getClassStudents(classroom.id).length}</td>
                <td className="px-5 py-5 text-[color:var(--muted)]">{new Date(classroom.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-5 text-[color:var(--muted)]">{classroom.status}</td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-4">
                    <Link className="whitespace-nowrap font-bold text-violet-700 underline-offset-4 hover:underline" to={`/teacher/classes/${classroom.id}/students`}>View Students</Link>
                    <div className="flex items-center gap-2">
                      <span className="group relative inline-flex">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--muted)] transition hover:bg-white/60 hover:text-violet-700"
                          aria-label={`Copy code ${classroom.classCode}`}
                          onClick={() => navigator.clipboard?.writeText(classroom.classCode)}
                        >
                          <PencilIcon />
                        </button>
                        <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[color:var(--brown)] px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                          Copy code
                        </span>
                      </span>
                      <span className="group relative inline-flex">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-700 transition hover:bg-red-50"
                          aria-label={`Delete ${classroom.className}`}
                          onClick={() => setClassToDelete(classroom)}
                        >
                          <TrashIcon />
                        </button>
                        <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-red-700 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                          Delete
                        </span>
                      </span>
                    </div>
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
