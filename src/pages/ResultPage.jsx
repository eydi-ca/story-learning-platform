import { Link, Navigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { getLatestResult } from '../utils/progress'

function ResultPage() {
  const { chapterId } = useParams()
  const user = getCurrentUser()
  const activeClass = getOrSetActiveClass(user.id)
  const chapter = chapters.find((item) => item.id === chapterId)

  if (!chapter || !activeClass) return <Navigate to="/student/chapters" replace />

  const result = getLatestResult(user.id, activeClass.classCode, chapter.id)
  const nextChapter = chapters[chapters.findIndex((item) => item.id === chapter.id) + 1]

  if (!result) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">No result found</h1>
        <Link className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/student/chapters">Back to timeline</Link>
      </section>
    )
  }

  return (
    <section>
      <div className={`rounded-xl border p-6 shadow-sm ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <h1 className="text-3xl font-black text-slate-950">{result.passed ? siteContent.result.passedTitle : siteContent.result.failedTitle}</h1>
        <p className="mt-2 text-slate-700">Score: <span className="font-black">{result.score}/{result.total}</span> - Percentage: <span className="font-black">{result.percentage}%</span></p>
        <p className="mt-2 text-slate-600">Completed at {new Date(result.completedAt).toLocaleString()}</p>
        <p className="mt-3 font-semibold text-slate-800">
          {result.passed ? siteContent.result.passedMessage : siteContent.result.failedMessage}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {result.answers.map((answer, index) => (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={answer.questionId}>
            <p className="font-black text-slate-950">{index + 1}. {answer.question}</p>
            <p className="mt-2 text-sm text-slate-600">Your answer: <span className="font-bold">{answer.studentAnswer}</span></p>
            <p className="text-sm text-slate-600">Correct answer: <span className="font-bold">{answer.correctAnswer}</span></p>
            <p className={`mt-2 font-semibold ${answer.correct ? 'text-emerald-700' : 'text-red-700'}`}>{answer.feedback}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/chapters">Back to timeline</Link>
        {result.passed && nextChapter ? <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${nextChapter.id}`}>Next chapter</Link> : null}
        {!result.passed ? <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity`}>Retry activity</Link> : null}
        {!result.passed ? <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to={`/student/chapter/${chapter.id}`}>Review chapter</Link> : null}
      </div>
    </section>
  )
}

export default ResultPage
