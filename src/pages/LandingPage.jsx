import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-indigo-700 font-semibold mb-3">
            Story-Based Interactive Learning
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            Learn through stories, dialogue, and activities.
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Scan the QR code from the book, enter your classroom code, and begin
            a self-paced learning adventure with narration, tutorials, quizzes,
            and progress tracking.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/student/start"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700"
            >
              Start Learning
            </Link>

            <Link
              to="/admin/login"
              className="rounded-xl bg-white px-6 py-3 text-indigo-700 font-semibold shadow hover:bg-slate-50"
            >
              Teacher/Admin Login
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100">
          <div className="rounded-2xl bg-slate-900 text-white p-6">
            <p className="text-sm text-indigo-300">Chapter Preview</p>
            <h2 className="text-2xl font-bold mt-2">The Learning Adventure</h2>
            <div className="mt-6 rounded-xl bg-white text-slate-900 p-4">
              <p className="font-bold text-indigo-700">Guide</p>
              <p className="mt-2">
                Welcome, learner. Your story begins here. Listen, read, and
                complete the challenge.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LandingPage