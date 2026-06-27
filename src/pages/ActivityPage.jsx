import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import sampleBackground from '../assets/sample_background.png'
import ActivityRenderer from '../components/activity/ActivityRenderer'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import {
  getChapterProgress,
  isChapterUnlocked,
  saveActivityResult,
  startChapterAttempt,
} from '../utils/progress'
import { gradeQuestions, isQuestionAnswered, prepareQuestions } from '../utils/quizUtils'

function ActivityPage() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null
  const chapter = chapters.find((item) => item.id === chapterId)
  const questions = useMemo(() => prepareQuestions(chapter?.activities ?? []), [chapter])
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const chapterProgress =
    user && activeClass && chapter
      ? getChapterProgress(user.id, activeClass.classCode, chapter.id)
      : null

  useEffect(() => {
    if (!user || !activeClass || !chapter || chapterProgress?.passed) return
    startChapterAttempt({
      studentId: user.id,
      classCode: activeClass.classCode,
      chapterId: chapter.id,
    })
  }, [activeClass, chapter, chapterProgress?.passed, user])

  if (!user || !chapter || !activeClass) return <Navigate to="/student/chapters" replace />
  if (!isChapterUnlocked(user.id, activeClass.classCode, chapter.id)) {
    return <Navigate to="/student/chapters" replace />
  }
  if (chapterProgress?.passed) {
    return <Navigate to={`/student/result/${chapter.id}`} replace />
  }

  const currentQuestion = questions[currentIndex]
  const onLastQuestion = currentIndex === questions.length - 1
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined

  async function handleSubmit() {
    if (questions.some((question) => !isQuestionAnswered(question, answers[question.id]))) {
      setError('Please complete every activity challenge before submitting.')
      return
    }

    const graded = gradeQuestions(questions, answers)
    const saved = await saveActivityResult({
      studentId: user.id,
      classId: activeClass.id,
      classCode: activeClass.classCode,
      chapterId: chapter.id,
      ...graded,
    })
    if (saved?.error) {
      setError(saved.error)
      return
    }
    navigate(`/student/result/${chapter.id}`)
  }

  function handleNext() {
    if (onLastQuestion) {
      void handleSubmit()
      return
    }

    setCurrentIndex((value) => value + 1)
  }

  return (
    <section className="chapter-player-shell">
      <div className="story-scene-shell overflow-hidden rounded-[2rem] border border-[rgb(216_185_120_/_0.7)] shadow-[0_24px_60px_rgb(74_42_22_/_0.18)]">
        <div
          className="story-scene relative min-h-[calc(100vh-8rem)] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(180deg, rgb(15 23 42 / 0.18), rgb(15 23 42 / 0.52)), url(${chapter.scene.image || sampleBackground})`,
          }}
        >
          <div className="story-scene-glow pointer-events-none absolute inset-0" />
          <div className="story-scene-bottom-shade pointer-events-none absolute inset-x-0 bottom-0 h-72" />

          <div className="relative z-10 flex min-h-[calc(100vh-8rem)] flex-col justify-between p-4 sm:p-6 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <Link
                className="story-scene-skip-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
                to={`/student/chapter/${chapter.id}`}
              >
                <span aria-hidden="true">←</span>
                <span>Back to chapter</span>
              </Link>

              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur sm:inline-flex">
                Activity Mode
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center py-6">
              <div className="story-summary-panel story-dialogue-entrance w-full max-w-5xl rounded-[2rem] p-5 sm:p-7">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                        Activity Challenge
                      </span>
                      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{chapter.title}</h1>
                      <p className="mt-2 text-sm leading-7 text-white/82">
                        Question {currentIndex + 1} of {questions.length}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {questions.map((question, index) => (
                        <button
                          key={question.id}
                          type="button"
                          className={`story-question-chip rounded-full px-3 py-2 text-xs font-black ${
                            index === currentIndex ? 'story-question-chip-active' : ''
                          }`}
                          onClick={() => setCurrentIndex(index)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error ? (
                    <p className="rounded-2xl border border-red-300/60 bg-red-500/10 p-4 font-semibold text-red-100">
                      {error}
                    </p>
                  ) : null}

                  {currentQuestion ? (
                    <ActivityRenderer
                      question={currentQuestion}
                      value={currentValue}
                      onChange={(nextAnswer) => {
                        setAnswers((current) => ({ ...current, [currentQuestion.id]: nextAnswer }))
                        setError('')
                      }}
                      dragging={dragging}
                      setDragging={setDragging}
                    />
                  ) : null}

                  <div className="flex flex-col gap-3 border-t border-white/12 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-white/75">
                      {currentQuestion?.type === 'drag-order'
                        ? 'Arrange the tiles in the correct order, then continue.'
                        : currentQuestion?.type === 'drag-group'
                          ? 'Drag matching tiles into the zone or tap them to select.'
                          : currentQuestion?.type === 'match-pairs'
                            ? 'Connect Side A to Side B by dragging or tapping to create each match.'
                          : 'Choose the best answer, then continue.'}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="outline-magic-button interactive-button rounded-full px-5 py-3 font-bold text-white disabled:opacity-50"
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        className="gold-button interactive-button rounded-full px-5 py-3 font-bold"
                        onClick={handleNext}
                      >
                        {onLastQuestion ? 'Submit Activity' : 'Next'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ActivityPage
