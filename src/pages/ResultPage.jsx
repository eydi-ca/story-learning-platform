import { Link, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getStudent, getStudentProgress } from '../utils/storage'

function ResultPage() {
  const { id } = useParams()
  const student = getStudent()
  const chapter = chapters.find((item) => item.id === id)

  if (!student || !chapter) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Link to="/student/start" className="text-indigo-700 font-semibold">
          Go back to start
        </Link>
      </main>
    )
  }

  const progress = getStudentProgress(student.id)
  const result = progress.find((item) => item.chapterId === id)

  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Link to={`/student/chapter/${id}`} className="text-indigo-700">
          Take the activity first
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="max-w-3xl mx-auto rounded-3xl bg-white p-8 shadow">
        <p
          className={`font-bold ${
            result.passed ? 'text-green-700' : 'text-red-700'
          }`}
        >
          {result.passed ? 'Passed' : 'Needs Improvement'}
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900 mt-2">
          Your Score: {result.score}/{result.total}
        </h1>

        <p className="mt-2 text-slate-600">
          Percentage Result: {result.percentage}%
        </p>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Answer Feedback</h2>

          <div className="grid gap-4">
            {chapter.activities.map((question) => {
              const studentAnswer = result.answers[question.id]
              const isCorrect = studentAnswer === question.answer

              return (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-900">
                    {question.question}
                  </p>

                  <p className="mt-2 text-sm">
                    Your answer:{' '}
                    <span
                      className={
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }
                    >
                      {studentAnswer}
                    </span>
                  </p>

                  {!isCorrect && (
                    <p className="text-sm text-slate-600">
                      Correct answer: {question.answer}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-600">
                    {question.feedback}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/student/chapters"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
          >
            Back to Chapters
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ResultPage