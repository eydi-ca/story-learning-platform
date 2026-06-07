import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import { siteContent } from '../data/siteContent'
import { deleteTeacher } from '../utils/classUtils'
import { getUsers } from '../utils/storage'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function AdminTeachers() {
  const [query, setQuery] = useState('')
  const [teacherToDelete, setTeacherToDelete] = useState(null)
  const [, setRefresh] = useState(0)
  const teachers = useMemo(
    () =>
      getUsers().filter(
        (user) =>
          user.role === 'teacher' &&
          `${user.fullName} ${user.email}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  async function handleDelete(teacherId) {
    await deleteTeacher(teacherId)
    setRefresh((value) => value + 1)
    setTeacherToDelete(null)
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{siteContent.dashboards.adminTeachersTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{siteContent.dashboards.adminTeachersSubtitle}</p>
          </div>
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <SearchIcon />
            </span>
            <input
              className="admin-input w-full rounded-lg py-2.5 pl-10 pr-3 text-sm"
              placeholder="Search teachers by name or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="admin-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table min-w-full text-left text-sm">
              <thead className="text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Teacher</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => {
                  return (
                    <tr key={teacher.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{teacher.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">{teacher.email}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(teacher.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          <Link className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline" to={`/admin/teachers/${teacher.id}/classes`}>
                            Open Teacher
                          </Link>
                          <button
                            className="text-sm font-medium text-red-700 underline-offset-4 hover:underline"
                            onClick={() => setTeacherToDelete(teacher)}
                            type="button"
                          >
                            Disable
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {!teachers.length ? (
                  <tr>
                    <td className="px-4 py-8 text-slate-500" colSpan="4">No teachers found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(teacherToDelete)}
        title="Disable teacher account?"
        message="This will disable the teacher profile and remove access to the admin and teacher workspace for that account."
        confirmLabel="Disable teacher"
        onClose={() => setTeacherToDelete(null)}
        onConfirm={() => void handleDelete(teacherToDelete.id)}
      />
    </>
  )
}

export default AdminTeachers
