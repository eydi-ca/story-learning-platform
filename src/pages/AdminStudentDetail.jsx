import { Link, useNavigate } from 'react-router-dom'
import { getAllProgress, isAdminLoggedIn } from '../utils/storage'

function AdminStudents() {
  const navigate = useNavigate()

  if (!isAdminLoggedIn()) {
    navigate('/admin/login')
    return null
  }

  const progress = getAllProgress()

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Student Progress
            </h1>
            <p className="text-slate-600">
              View completed chapters, scores, and passing status.
            </p>
          </div>

          <Link to="/admin/dashboard" className="text-indigo-700 font-semibold">
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Class Code</th>
                <th className="p-4">Chapter</th>
                <th className="p-4">Score</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Status</th>
                <th className="p-4">Completed At</th>
              </tr>
            </thead>

            <tbody>
              {progress.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-slate-500">
                    No student progress yet.
                  </td>
                </tr>
              )}

              {progress.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4 font-semibold">{item.studentName}</td>
                  <td className="p-4">{item.classCode}</td>
                  <td className="p-4">{item.chapterTitle}</td>
                  <td className="p-4">
                    {item.score}/{item.total}
                  </td>
                  <td className="p-4">{item.percentage}%</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.passed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.passed ? 'Passed' : 'Needs Improvement'}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(item.completedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default AdminStudents