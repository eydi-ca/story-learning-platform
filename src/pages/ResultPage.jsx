import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { formatElapsedTime, getLatestResult } from '../utils/progress'

function ResultPage() {
  const { chapterId } = useParams()
  const location = useLocation()
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />

  const activeClass = getOrSetActiveClass(user.id)
  const chapter = chapters.find((item) => item.id === chapterId)

  if (!chapter || !activeClass) return <Navigate to="/student/chapters" replace />

  const savedResult = getLatestResult(user.id, activeClass.classCode, chapter.id)
  const result = location.state?.previewResult ?? savedResult
  const nextChapter = chapters[chapters.findIndex((item) => item.id === chapter.id) + 1]
  const hasActivities = (chapter.activities ?? []).length > 0
  const isCompletionOnly = result?.total === 0 && !hasActivities
  const isAssessmentResult = Boolean(chapter.assessmentMode)

  if (!result) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">No result found</h1>
        <Link className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/student/chapters">
          Back to timeline
        </Link>
      </section>
    )
  }

  function displayAnswer(answer, fallback = 'No answer') {
    if (Array.isArray(answer)) {
      return answer.length ? answer.join(', ') : fallback
    }

    if (answer && typeof answer === 'object') {
      return Object.entries(answer).length
        ? Object.entries(answer)
            .map(([left, right]) => `${left} -> ${right}`)
            .join('; ')
        : fallback
    }

    return answer || fallback
  }

  function getAssessmentFeedback(percentage) {
    if (percentage >= 90) return 'Excellent work. You showed strong mastery of the Numberland journey.'
    if (percentage >= 75) return 'Good work. You understand the main ideas, with a few areas to review.'
    if (percentage >= 60) return 'You are making progress. Review the chapters again to strengthen your understanding.'
    return 'Keep practicing. Revisit the lessons and try again when you are ready.'
  }

  if (isAssessmentResult) {
    return (
      <section>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
            Final Assessment Result
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Your Score</h1>
          <p className="mt-4 text-4xl font-black text-slate-950">
            {result.score}/{result.total}
          </p>
          <p className="mt-2 text-xl font-black text-sky-800">{result.percentage}%</p>
          <p className="mt-4 max-w-2xl font-semibold text-slate-800">
            {getAssessmentFeedback(result.percentage)}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Submitted at {new Date(result.completedAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/chapters">
            Back to timeline
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className={`rounded-xl border p-6 shadow-sm ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <h1 className="text-3xl font-black text-slate-950">
          {result.passed ? siteContent.result.passedTitle : siteContent.result.failedTitle}
        </h1>
        {isCompletionOnly ? (
          <p className="mt-2 text-slate-700">
            Chapter complete. No activity score was required for this summary chapter.
          </p>
        ) : (
          <p className="mt-2 text-slate-700">
            Score: <span className="font-black">{result.score}/{result.total}</span> - Percentage:{' '}
            <span className="font-black">{result.percentage}%</span>
          </p>
        )}
        <p className="mt-2 text-slate-600">Completed at {new Date(result.completedAt).toLocaleString()}</p>
        <p className="mt-2 text-slate-600">
          Total chapter time: <span className="font-bold">{formatElapsedTime(result.totalElapsedMs)}</span>
        </p>
        {result.passedSubmittedAt ? (
          <p className="mt-2 text-slate-600">
            Passed submission: <span className="font-bold">{new Date(result.passedSubmittedAt).toLocaleString()}</span>
          </p>
        ) : null}
        <p className="mt-3 font-semibold text-slate-800">
          {result.passed ? siteContent.result.passedMessage : siteContent.result.failedMessage}
        </p>
        {result.previewMode ? (
          <p className="mt-3 text-sm font-semibold text-sky-700">
            Testing mode only. This retake does not overwrite the saved passed result.
          </p>
        ) : null}
      </div>

      {result.answers.length ? (
        <div className="mt-6 space-y-4">
          {result.answers.map((answer, index) => (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={answer.questionId}>
              <p className="font-black text-slate-950">{index + 1}. {answer.question}</p>
              <p className="mt-2 text-sm text-slate-600">
                Your answer: <span className="font-bold">{displayAnswer(answer.displayStudentAnswer ?? answer.studentAnswer)}</span>
              </p>
              {result.passed && !answer.correct ? (
                <p className="text-sm text-slate-600">
                  Correct answer: <span className="font-bold">{displayAnswer(answer.displayCorrectAnswer ?? answer.correctAnswer)}</span>
                </p>
              ) : null}
              <p className={`mt-2 font-semibold ${answer.correct ? 'text-emerald-700' : 'text-red-700'}`}>
                {answer.feedback}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/chapters">
          Back to timeline
        </Link>
        {result.passed && nextChapter ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${nextChapter.id}`}>
            Next chapter
          </Link>
        ) : null}
        {result.passed ? (
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to={`/student/chapter/${chapter.id}?replay=1`}>
            Replay chapter
          </Link>
        ) : null}
        {result.passed && hasActivities ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity?preview=1`}>
            Retake activity
          </Link>
        ) : null}
        {!result.passed ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity`}>
            Retry activity
          </Link>
        ) : null}
        {!result.passed ? (
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to={`/student/chapter/${chapter.id}`}>
            Review chapter
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export default ResultPage
