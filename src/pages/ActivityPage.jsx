import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { isChapterUnlocked, saveActivityResult } from '../utils/progress'
import { gradeQuestions, prepareQuestions } from '../utils/quizUtils'

function ActivityPage() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const activeClass = getOrSetActiveClass(user.id)
  const chapter = chapters.find((item) => item.id === chapterId)
  const questions = useMemo(() => prepareQuestions(chapter?.activities ?? []), [chapter])
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')

  if (!chapter || !activeClass) return <Navigate to="/student/chapters" replace />
  if (!isChapterUnlocked(user.id, activeClass.classCode, chapter.id)) return <Navigate to="/student/chapters" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    if (questions.some((question) => !answers[question.id])) {
      setError('Please answer every question before submitting.')
      return
    }

    const graded = gradeQuestions(questions, answers)
    await saveActivityResult({
      studentId: user.id,
      classId: activeClass.id,
      classCode: activeClass.classCode,
      chapterId: chapter.id,
      ...graded,
    })
    navigate(`/student/result/${chapter.id}`)
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{chapter.title} Activity</h1>
      <p className="mt-2 text-slate-600">Answer all questions. You need at least 75% to pass and unlock the next chapter.</p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        {error ? <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-700">{error}</p> : null}
        {questions.map((question, index) => (
          <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={question.id}>
            <legend className="font-black text-slate-950">{index + 1}. {question.question}</legend>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {question.choices.map((choice) => (
                <label className={`rounded-lg border p-3 font-semibold ${answers[question.id] === choice ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-700'}`} key={choice}>
                  <input className="mr-2" type="radio" name={question.id} value={choice} checked={answers[question.id] === choice} onChange={() => setAnswers({ ...answers, [question.id]: choice })} />
                  {choice}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="rounded-lg bg-slate-950 px-6 py-3 font-bold text-white">Submit Activity</button>
      </form>
    </section>
  )
}

export default ActivityPage
