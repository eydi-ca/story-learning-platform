import { Link } from 'react-router-dom'

function AdminStudentDetail() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-3xl bg-white p-8 shadow text-center">
        <h1 className="text-2xl font-bold">Student Detail Page</h1>
        <p className="mt-2 text-slate-600">
          You can expand this later to show one student’s full activity history.
        </p>

        <Link
          to="/admin/students"
          className="inline-block mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
        >
          Back to Students
        </Link>
      </div>
    </main>
  )
}

export default AdminStudentDetail