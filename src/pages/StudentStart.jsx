import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { createStudentSession, findClassByCode, getCurrentStudent } from '../utils/storage'

function StudentStart() {
  const navigate = useNavigate()
  const currentStudent = getCurrentStudent()
  const [name, setName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [error, setError] = useState('')

  const matchedClass = useMemo(() => {
    if (!classCode.trim()) return null
    return findClassByCode(classCode)
  }, [classCode])

  function handleSubmit(event) {
    event.preventDefault()

    if (!name.trim()) {
      setError('Please enter the student name before continuing.')
      return
    }

    const result = createStudentSession({ name, classCode })

    if (result.error) {
      setError(result.error)
      return
    }

    navigate('/student/chapters')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-fuchsia-50">
      <Navbar
        brand="Story Bridge"
        subtitle="Students join with a class code to continue the shared story journey"
        links={[
          { to: '/', label: 'Home', end: true },
          { to: '/student/start', label: 'Student Entry' },
          { to: '/teacher/login', label: 'Teacher Login' },
        ]}
      />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-6">
        <section className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">
            Before you begin
          </p>
          <h1 className="mt-4 text-4xl font-black">Join your class story.</h1>
          <p className="mt-4 text-base leading-7 text-slate-200">
            Enter the class code from your teacher and your name to open the rainbow
            timeline. You will unlock each chapter only after passing the previous one.
          </p>

          <div className="mt-8 rounded-3xl bg-white/10 p-5">
            <p className="font-semibold text-white">Demo class codes</p>
            <p className="mt-2 text-sm text-slate-200">Try `CLASS123` or `QUEST456`</p>
          </div>

          {currentStudent ? (
            <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 p-5">
              <p className="font-semibold text-white">Existing session found</p>
              <p className="mt-2 text-sm text-slate-200">
                Continue as {currentStudent.name} from {currentStudent.section}.
              </p>
              <button
                type="button"
                onClick={() => navigate('/student/chapters')}
                className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900"
              >
                Resume student session
              </button>
            </div>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-black text-slate-900">Student sign-in</h2>
            <p className="mt-2 text-slate-600">
              We only need your name and class code to get you into the correct section.
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <label className="mt-6 block">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Class code
              </span>
              <input
                value={classCode}
                onChange={(event) => setClassCode(event.target.value.toUpperCase())}
                placeholder="Enter class code"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            {matchedClass ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                Class found: {matchedClass.name} - {matchedClass.section}
              </div>
            ) : classCode ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
                We could not match that class code yet.
              </div>
            ) : null}

            <label className="mt-6 block">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Student name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter student name"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-indigo-600 px-6 py-4 text-base font-bold text-white transition hover:bg-indigo-700"
            >
              Enter story timeline
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-500">
            Need teacher access instead?{' '}
            <Link to="/teacher/login" className="font-semibold text-slate-700 underline">
              Continue as Teacher
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default StudentStart
