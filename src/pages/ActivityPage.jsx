import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import sampleBackground from '../assets/sample_background.png'
import ActivityRenderer from '../components/activity/ActivityRenderer'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import {
  getChapterProgress,
  formatStopwatchTime,
  isChapterUnlocked,
  saveActivityResult,
  startChapterAttempt,
} from '../utils/progress'
import { gradeQuestions, isQuestionAnswered, prepareQuestions } from '../utils/quizUtils'

const selfControlledActivityTypes = new Set([
  'counting-lock',
  'gatekeeper',
  'integer-trial',
  'memory-match',
  'real-number-line',
])

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5m6-6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ActivityPage() {
  const { chapterId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null
  const chapter = chapters.find((item) => item.id === chapterId)
  const previewMode = new URLSearchParams(location.search).get('preview') === '1'
  const isAssessment = Boolean(chapter?.assessmentMode)
  const questions = useMemo(
    () =>
      prepareQuestions(chapter?.activities ?? [], {
        shuffleQuestions: true,
        shuffleChoices: !isAssessment,
      }),
    [chapter, isAssessment]
  )
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [countingLockRoundIndex, setCountingLockRoundIndex] = useState(0)
  const [assessmentStarted, setAssessmentStarted] = useState(false)
  const [assessmentStartedAt, setAssessmentStartedAt] = useState(null)
  const [assessmentElapsedMs, setAssessmentElapsedMs] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const assessmentItemRefs = useRef([])
  const chapterProgress =
    user && activeClass && chapter
      ? getChapterProgress(user.id, activeClass.classCode, chapter.id)
      : null

  useEffect(() => {
    if (
      !user ||
      !activeClass ||
      !chapter ||
      (chapterProgress?.passed && !isAssessment) ||
      (isAssessment && !assessmentStarted)
    ) return
    startChapterAttempt({
      studentId: user.id,
      classCode: activeClass.classCode,
      chapterId: chapter.id,
    })
  }, [activeClass, assessmentStarted, chapter, chapterProgress?.passed, isAssessment, user])

  useEffect(() => {
    if (!isAssessment || !assessmentStarted || !assessmentStartedAt || isSubmitting) return undefined

    const updateElapsedTime = () => {
      setAssessmentElapsedMs(Date.now() - assessmentStartedAt)
    }

    updateElapsedTime()
    const timer = window.setInterval(updateElapsedTime, 1000)

    return () => window.clearInterval(timer)
  }, [assessmentStarted, assessmentStartedAt, isAssessment, isSubmitting])

  useEffect(() => {
    if (!isAssessment || !assessmentStarted) return
    assessmentItemRefs.current[currentIndex]?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    })
  }, [assessmentStarted, currentIndex, isAssessment])

  if (!user || !chapter || !activeClass) return <Navigate to="/student/chapters" replace />
  if (!isChapterUnlocked(user.id, activeClass.classCode, chapter.id)) {
    return <Navigate to="/student/chapters" replace />
  }
  if (chapterProgress?.passed && !previewMode && !isAssessment) {
    return <Navigate to={`/student/result/${chapter.id}`} replace />
  }

  const currentQuestion = questions[currentIndex]
  const onLastQuestion = currentIndex === questions.length - 1
  const currentValue = currentQuestion ? answers[currentQuestion.id] : undefined
  const isCountingLock = currentQuestion?.type === 'counting-lock'
  const isSelfControlledActivity = selfControlledActivityTypes.has(currentQuestion?.type)

  function getSubmittableAnswer(question, answer) {
    if (question?.type === 'integer-trial' && answer?.puzzle?.solved) {
      return {
        ...answer,
        completionAcknowledged: true,
      }
    }

    return answer
  }

  async function handleSubmit(nextAnswers = answers) {
    if (isSubmitting) return

    const submittedAnswers = Object.fromEntries(
      questions.map((question) => [
        question.id,
        getSubmittableAnswer(question, nextAnswers[question.id]),
      ])
    )

    if (questions.some((question) => !isQuestionAnswered(question, submittedAnswers[question.id]))) {
      setError('Please complete every activity challenge before submitting.')
      return
    }

    const graded = gradeQuestions(questions, submittedAnswers)

    setIsSubmitting(true)
    try {
      if (previewMode) {
        const percentage = graded.total > 0 ? Math.round((graded.score / graded.total) * 100) : 0
        navigate(`/student/result/${chapter.id}`, {
          state: {
            previewResult: {
              ...graded,
              percentage,
              passed: isAssessment || percentage >= 100,
              completedAt: new Date().toISOString(),
              totalElapsedMs: chapterProgress?.totalElapsedMs ?? 0,
              latestAttemptElapsedMs: 0,
              passedSubmittedAt: chapterProgress?.passedSubmittedAt ?? null,
              previewMode: true,
            },
          },
        })
        return
      }

      const saved = await saveActivityResult({
        studentId: user.id,
        classId: activeClass.id,
        classCode: activeClass.classCode,
        chapterId: chapter.id,
        ...graded,
        passedOverride: isAssessment ? true : undefined,
        allowRetakeAfterPass: isAssessment,
      })
      if (saved?.error) {
        setError(saved.error)
        return
      }
      navigate(`/student/result/${chapter.id}`)
    } catch {
      setError('We could not submit the assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleNext() {
    const submittedCurrentAnswer = getSubmittableAnswer(
      currentQuestion,
      currentQuestion ? answers[currentQuestion.id] : undefined
    )
    const submittedAnswers =
      currentQuestion && submittedCurrentAnswer !== answers[currentQuestion.id]
        ? {
            ...answers,
            [currentQuestion.id]: submittedCurrentAnswer,
          }
        : answers

    if (currentQuestion && !isQuestionAnswered(currentQuestion, submittedCurrentAnswer)) {
      setError('Please answer this item before continuing.')
      return
    }

    if (submittedAnswers !== answers) {
      setAnswers(submittedAnswers)
    }

    if (onLastQuestion) {
      void handleSubmit(submittedAnswers)
      return
    }

    setError('')
    setCurrentIndex((value) => value + 1)
  }

  function handleAssessmentSubmit() {
    void handleSubmit(answers)
  }

  function handleStartAssessment() {
    const startedAt = Date.now()
    setAssessmentStartedAt(startedAt)
    setAssessmentElapsedMs(0)
    setAssessmentStarted(true)

    if (user && activeClass && chapter) {
      startChapterAttempt({
        studentId: user.id,
        classCode: activeClass.classCode,
        chapterId: chapter.id,
      })
    }
  }

  const currentSubmittableValue = getSubmittableAnswer(currentQuestion, currentValue)
  const currentQuestionComplete = currentQuestion
    ? isQuestionAnswered(currentQuestion, currentSubmittableValue)
    : false
  const answeredCount = questions.filter((question) =>
    isQuestionAnswered(question, answers[question.id])
  ).length
  const firstIncompleteIndex = questions.findIndex(
    (question) => !isQuestionAnswered(question, answers[question.id])
  )
  const assessmentProgressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0
  const canUseAssessmentNext =
    currentQuestionComplete &&
    (firstIncompleteIndex === -1 || firstIncompleteIndex >= currentIndex)
  const showActivityFooterActions = !isSelfControlledActivity || currentQuestionComplete

  if (isAssessment) {
    return (
      <section className="relative min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Final Assessment
              </p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">{chapter.title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Complete all items carefully. Your answers will be recorded when you submit the assessment.
              </p>
            </div>
            <Link
              className="inline-flex self-start rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-slate-400"
              to="/student/chapters"
            >
              Back to chapters
            </Link>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <span className="text-sm font-bold text-slate-700">
                  {answeredCount}/{questions.length} answered
                </span>
              </div>
              <div className="mt-4" aria-label={`Assessment progress: ${assessmentProgressPercent}%`}>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-300"
                    style={{ width: `${assessmentProgressPercent}%` }}
                  />
                </div>
              </div>

              {currentQuestion ? (
                <fieldset className="mt-6">
                  <legend className="text-xl font-black leading-8 text-slate-950">
                    {currentQuestion.question}
                  </legend>
                  <div className="mt-5 grid gap-3">
                    {currentQuestion.choices.map((choice, choiceIndex) => {
                      const active = answers[currentQuestion.id] === choice
                      return (
                        <label
                          key={choice}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm font-semibold transition ${
                            active
                              ? 'border-sky-500 bg-sky-50 text-slate-950 shadow-[0_0_0_1px_rgba(14,165,233,0.15)]'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            className="mt-1"
                            type="radio"
                            name={currentQuestion.id}
                            value={choice}
                            checked={active}
                            onChange={() => {
                              setAnswers((current) => ({
                                ...current,
                                [currentQuestion.id]: choice,
                              }))
                              setError('')
                            }}
                          />
                          <span className="font-black text-slate-400">
                            {String.fromCharCode(65 + choiceIndex)}.
                          </span>
                          <span>{choice}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              ) : null}

              {error ? (
                <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setError('')
                    setCurrentIndex((value) => Math.max(0, value - 1))
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting || !canUseAssessmentNext}
                  onClick={onLastQuestion && isAssessment ? handleAssessmentSubmit : handleNext}
                >
                  {onLastQuestion ? (isSubmitting ? 'Submitting...' : 'Submit Assessment') : 'Next'}
                </button>
              </div>
            </article>

            <aside className="flex flex-col self-start rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                Items
              </p>
              <div className="mt-4 grid max-h-56 grid-cols-2 gap-x-6 gap-y-2 overflow-y-auto pr-2 text-sm [scrollbar-width:none] lg:grid-cols-1 [&::-webkit-scrollbar]:hidden">
                {questions.map((question, index) => {
                  const answered = isQuestionAnswered(question, answers[question.id])
                  return (
                    <span
                      key={question.id}
                      ref={(element) => {
                        assessmentItemRefs.current[index] = element
                      }}
                      className={`w-fit font-bold ${
                        index === currentIndex
                          ? 'text-sky-700 underline decoration-2 underline-offset-4'
                          : answered
                            ? 'text-emerald-700'
                            : 'text-slate-400'
                      }`}
                    >
                      Item {index + 1}
                    </span>
                  )
                })}
              </div>
              <div className="mt-4 shrink-0 border-t border-slate-200 pt-3">
                <p className="text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-500">
                  Time
                </p>
                <p className="mt-1 font-mono text-lg font-black text-slate-950">
                  {formatStopwatchTime(assessmentElapsedMs)}
                </p>
              </div>
            </aside>
          </div>
        </div>

        {!assessmentStarted ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Ready Check
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">
                Start Final Assessment
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This assessment covers the full Numberland journey. Read each item carefully before submitting.
              </p>
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <Link
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700"
                  to="/student/chapters"
                >
                  Not yet
                </Link>
                <button
                  type="button"
                  className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"
                  onClick={handleStartAssessment}
                >
                  Start test
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    )
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
                to={previewMode ? `/student/result/${chapter.id}` : `/student/chapter/${chapter.id}`}
              >
                <BackIcon />
                <span>{previewMode ? 'Back to results' : 'Back to chapter'}</span>
              </Link>

              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur sm:inline-flex">
                {previewMode ? 'Activity Test Mode' : 'Activity Mode'}
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center py-6">
              <div className="story-summary-panel story-dialogue-entrance w-full max-w-5xl rounded-[2rem] p-5 sm:p-7">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                        {previewMode ? 'Activity Test' : 'Activity Challenge'}
                      </span>
                      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">{chapter.title}</h1>
                      <p className="mt-2 text-sm leading-7 text-white/82">
                        {isCountingLock
                          ? `Round ${countingLockRoundIndex + 1}`
                          : `Question ${currentIndex + 1} of ${questions.length}`}
                      </p>
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
                      onRoundChange={setCountingLockRoundIndex}
                      dragging={dragging}
                      setDragging={setDragging}
                    />
                  ) : null}

                  <div className="flex flex-col gap-3 border-t border-white/12 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-white/75">
                      {currentQuestion?.type === 'drag-order'
                        ? 'Arrange the tiles in the correct order, then continue.'
                        : currentQuestion?.type === 'integer-trial'
                          ? 'Obtain the map, torch, and key in order, then solve the final town map.'
                        : currentQuestion?.type === 'tile-puzzle'
                          ? 'Restore the image by dragging the tiles into the correct places.'
                        : currentQuestion?.type === 'counting-lock'
                          ? 'Unlock each slot by selecting the only counting number in it.'
                          : currentQuestion?.type === 'drag-group'
                            ? 'Drag matching tiles into the zone or tap them to select.'
                            : currentQuestion?.type === 'match-pairs'
                              ? 'Connect Side A to Side B by dragging or tapping to create each match.'
                              : 'Choose the best answer, then continue.'}
                    </div>

                    {showActivityFooterActions ? (
                      <div className="flex flex-wrap gap-3">
                        {!isSelfControlledActivity ? (
                          <button
                            type="button"
                            className="outline-magic-button interactive-button rounded-full px-5 py-3 font-bold text-white disabled:opacity-50"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                          >
                            Previous
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className="gold-button interactive-button rounded-full px-5 py-3 font-bold"
                          onClick={handleNext}
                        >
                          {onLastQuestion ? (previewMode ? 'Proceed' : 'Submit Activity') : 'Next'}
                        </button>
                      </div>
                    ) : null}
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
