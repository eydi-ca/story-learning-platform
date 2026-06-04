import { Link, useNavigate } from 'react-router-dom'
import { getAllProgress, isAdminLoggedIn, logoutAdmin } from '../utils/storage'

function AdminDashboard() {
  const navigate = useNavigate()

  if (!isAdminLoggedIn()) {
    navigate('/admin/login')
    return null
  }

  const progress = getAllProgress()
  const uniqueStudents = [...new Set(progress.map((item) => item.studentId))]
  const completedActivities = progress.length

  const passedCount = progress.filter((item) => item.passed).length
  const failedCount = progress.filter((item) => !item.passed).length

  function handleLogout() {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Classroom Code: CLASS123</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 text-white px-4 py-2"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Students</p>
            <h2 className="text-3xl font-bold">{uniqueStudents.length}</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Completed Activities</p>
            <h2 className="text-3xl font-bold">{completedActivities}</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Passed</p>
            <h2 className="text-3xl font-bold text-green-700">
              {passedCount}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <p className="text-slate-500">Needs Improvement</p>
            <h2 className="text-3xl font-bold text-red-700">{failedCount}</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

          <Link
            to="/admin/students"
            className="inline-block rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
          >
            View Student Progress
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard