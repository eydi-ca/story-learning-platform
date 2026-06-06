import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { demoTeachers } from '../data/classroom'
import { loginTeacher } from '../utils/storage'

function TeacherLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const teacher = loginTeacher({ username, password })

    if (!teacher) {
      setError('Invalid teacher credentials. Use one of the demo accounts listed here.')
      return
    }

    navigate('/teacher/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-sky-50">
      <Navbar
        brand="Story Bridge"
        subtitle="Teacher tools for class codes, student monitoring, and chapter progress"
        links={[
          { to: '/', label: 'Home', end: true },
          { to: '/student/start', label: 'Student Entry' },
          { to: '/teacher/login', label: 'Teacher Login' },
        ]}
      />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[0.95fr_1.05fr] md:px-6">
        <section className="rounded-[2rem] bg-slate-900 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            Teacher access
          </p>
          <h1 className="mt-4 text-4xl font-black">Manage classes and monitor progress.</h1>
          <p className="mt-4 leading-7 text-slate-200">
            Teachers can create or manage class codes, view section progress, and
            inspect chapter-level results for each student.
          </p>

          <div className="mt-6 grid gap-4">
            {demoTeachers.map((teacher) => (
              <div key={teacher.id} className="rounded-3xl bg-white/10 p-4">
                <p className="font-bold text-white">{teacher.name}</p>
                <p className="mt-1 text-sm text-slate-200">{teacher.advisory}</p>
                <p className="mt-2 text-sm text-slate-200">
                  {teacher.username} / {teacher.password}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-black text-slate-900">Teacher login</h2>
            <p className="mt-2 text-slate-600">
              Sign in to create classes and review student chapter results.
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <label className="mt-6 block">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Username
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="mt-6 block">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-indigo-600 px-6 py-4 text-base font-bold text-white"
            >
              Open teacher dashboard
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Need admin monitoring instead?{' '}
            <Link to="/admin/login" className="font-semibold text-slate-700 underline">
              Go to admin login
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default TeacherLogin
