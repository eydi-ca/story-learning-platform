import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import sampleBackground from '../assets/sample_background.png'
import landingPhoto from '../assets/landingpage-photo.png'
import ActivityRenderer from '../components/activity/ActivityRenderer'
import StoryScene from '../components/chapter/StoryScene'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import {
  getChapterProgress,
  isChapterUnlocked,
  saveActivityResult,
  saveChapterCompletion,
  startChapterAttempt,
} from '../utils/progress'
import { gradeQuestions, isQuestionAnswered } from '../utils/quizUtils'
import { buildDialoguePages, getCurrentPageIndex } from '../utils/storyPages'

const selfControlledActivityTypes = new Set([
  'counting-lock',
  'gatekeeper',
  'integer-trial',
  'memory-match',
  'real-number-line',
])

function ChapterPage() {
  const { chapterId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  const [audioComplete, setAudioComplete] = useState(false)
  const [skipSignal, setSkipSignal] = useState(0)
  const [repeatSignal, setRepeatSignal] = useState(0)
  const [showTitleCover, setShowTitleCover] = useState(true)
  const [mode, setMode] = useState('dialogue')
  const [revealedPageIndex, setRevealedPageIndex] = useState(0)
  const [awaitingPageScroll, setAwaitingPageScroll] = useState(false)
  const [completedPageIndexes, setCompletedPageIndexes] = useState([])
  const [activityAnswers, setActivityAnswers] = useState({})
  const [activityError, setActivityError] = useState('')
  const [activityDragging, setActivityDragging] = useState(null)
  const [countingLockRoundIndex, setCountingLockRoundIndex] = useState(0)
  const [replayChapterMode, setReplayChapterMode] = useState(
    new URLSearchParams(location.search).get('replay') === '1'
  )
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null
  const chapter = chapters.find((item) => item.id === chapterId)

  useEffect(() => {
    setDialogueIndex(0)
    setHasStarted(false)
    setTypingComplete(false)
    setAudioComplete(false)
    setSkipSignal(0)
    setRepeatSignal(0)
    setShowTitleCover(true)
    setMode('dialogue')
    setRevealedPageIndex(0)
    setAwaitingPageScroll(false)
    setCompletedPageIndexes([])
    setActivityAnswers({})
    setActivityError('')
    setActivityDragging(null)
    setCountingLockRoundIndex(0)
    setReplayChapterMode(new URLSearchParams(location.search).get('replay') === '1')
  }, [chapterId, location.search])

  useEffect(() => {
    if (mode !== 'dialogue') return undefined

    if (showTitleCover) {
      const timer = window.setTimeout(() => {
        setShowTitleCover(false)
        setHasStarted(true)
      }, 1500)

      return () => window.clearTimeout(timer)
    }

    return undefined
  }, [chapterId, mode, repeatSignal, showTitleCover])

  const dialogue = useMemo(
    () => chapter?.dialogues?.[dialogueIndex] ?? null,
    [chapter, dialogueIndex]
  )
  const pages = useMemo(() => buildDialoguePages(chapter), [chapter])
  const currentPageIndex = getCurrentPageIndex(pages, dialogueIndex)
  const currentPage = pages[currentPageIndex] ?? null
  const inlineActivity = chapter?.activities?.[0] ?? null
  const inlineActivityPageNumber = chapter?.activityInsertBeforePage ?? null
  const inlineActivityIsAtEnd =
    Boolean(inlineActivityPageNumber) && inlineActivityPageNumber > pages.length
  const inlineActivityStartIndex =
    inlineActivityPageNumber && pages[inlineActivityPageNumber - 1]
      ? pages[inlineActivityPageNumber - 1].startIndex
      : null
  const inlineActivityBackdrop =
    chapter?.dialogues?.[inlineActivityStartIndex]?.backgroundSrc ||
    chapter?.dialogues?.[chapter.dialogues.length - 1]?.backgroundSrc ||
    chapter?.scene?.image ||
    sampleBackground
  const isPlaceholderActivity = inlineActivity?.id?.includes('placeholder')
  const isTilePuzzle = inlineActivity?.type === 'tile-puzzle'
  const isIntegerTrial = inlineActivity?.type === 'integer-trial'
  const isSelfControlledActivity = selfControlledActivityTypes.has(inlineActivity?.type)
  const chapterProgress =
    user && activeClass && chapter
      ? getChapterProgress(user.id, activeClass.classCode, chapter.id)
      : null
  const narrationComplete = dialogueIndex >= (chapter?.dialogues?.length ?? 0) - 1 && typingComplete
  const inlineActivityComplete = Boolean(chapterProgress?.passed) && !replayChapterMode
  const currentInlineAnswer = inlineActivity ? activityAnswers[inlineActivity.id] : undefined
  const currentInlineSubmittableAnswer =
    isIntegerTrial && currentInlineAnswer?.puzzle?.solved
      ? {
          ...currentInlineAnswer,
          completionAcknowledged: true,
        }
      : currentInlineAnswer
  const showInlineActivityProceed =
    !isSelfControlledActivity ||
    Boolean(inlineActivity && isQuestionAnswered(inlineActivity, currentInlineSubmittableAnswer))

  useEffect(() => {
    if (!user || !activeClass || !chapter || chapterProgress?.passed) return
    startChapterAttempt({
      studentId: user.id,
      classCode: activeClass.classCode,
      chapterId: chapter.id,
    })
  }, [activeClass, chapter, chapterProgress?.passed, user])

  useEffect(() => {
    if (
      !hasStarted ||
      !typingComplete ||
      !audioComplete ||
      mode !== 'dialogue' ||
      awaitingPageScroll
    ) {
      return undefined
    }

    const sentencePauseMs = 1200
    const timer = window.setTimeout(() => {
      if (currentPage && dialogueIndex < currentPage.endIndex) {
        setDialogueIndex((value) => value + 1)
        setTypingComplete(false)
        setAudioComplete(false)
        return
      }

      setCompletedPageIndexes((current) =>
        current.includes(currentPageIndex) ? current : [...current, currentPageIndex]
      )

      if (
        inlineActivity &&
        !inlineActivityComplete &&
        inlineActivityPageNumber &&
        (currentPageIndex === inlineActivityPageNumber - 2 ||
          (inlineActivityIsAtEnd && currentPageIndex === pages.length - 1))
      ) {
        setMode('activity')
        setActivityError('')
        setCountingLockRoundIndex(0)
        return
      }

      if (currentPageIndex < pages.length - 1) {
        setRevealedPageIndex(currentPageIndex + 1)
        setAwaitingPageScroll(true)
        return
      }

      setMode('summary')
    }, sentencePauseMs)

    return () => window.clearTimeout(timer)
  }, [
    audioComplete,
    awaitingPageScroll,
    currentPage,
    currentPageIndex,
    dialogueIndex,
    hasStarted,
    inlineActivity,
    inlineActivityComplete,
    inlineActivityIsAtEnd,
    inlineActivityPageNumber,
    mode,
    pages.length,
    typingComplete,
  ])

  if (!user || !chapter || !activeClass) return <Navigate to="/student/chapters" replace />
  if (!isChapterUnlocked(user.id, activeClass.classCode, chapter.id)) {
    return <Navigate to="/student/chapters" replace />
  }
  if (chapter.assessmentMode) {
    return <Navigate to={`/student/chapter/${chapter.id}/activity`} replace />
  }

  function handleReplay() {
    setDialogueIndex(0)
    setTypingComplete(false)
    setAudioComplete(false)
    setHasStarted(false)
    setSkipSignal((value) => value + 1)
    setRepeatSignal((value) => value + 1)
    setShowTitleCover(true)
    setMode('dialogue')
    setRevealedPageIndex(0)
    setAwaitingPageScroll(false)
    setCompletedPageIndexes([])
    setReplayChapterMode(true)
  }

  async function handleChapterContinue() {
    if (!inlineActivity && !chapterProgress?.passed) {
      await saveChapterCompletion({
        studentId: user.id,
        classId: activeClass.id,
        classCode: activeClass.classCode,
        chapterId: chapter.id,
      })
    }

    navigate(`/student/result/${chapter.id}`)
  }

  async function handleInlineActivitySubmit() {
    if (!inlineActivity) return

    const currentAnswer = activityAnswers[inlineActivity.id]
    const submittedAnswer =
      isIntegerTrial && currentAnswer?.puzzle?.solved
        ? {
            ...currentAnswer,
            completionAcknowledged: true,
          }
        : currentAnswer
    const submittedAnswers = {
      ...activityAnswers,
      [inlineActivity.id]: submittedAnswer,
    }

    if (!isQuestionAnswered(inlineActivity, submittedAnswer)) {
      setActivityError('Complete this chapter checkpoint before continuing the story.')
      return
    }

    if (submittedAnswer !== currentAnswer) {
      setActivityAnswers(submittedAnswers)
    }

    if (!chapterProgress?.passed || !replayChapterMode) {
      const graded = gradeQuestions([inlineActivity], submittedAnswers)
      const saved = await saveActivityResult({
        studentId: user.id,
        classId: activeClass.id,
        classCode: activeClass.classCode,
        chapterId: chapter.id,
        ...graded,
      })

      if (saved?.error) {
    setActivityError(saved.error)
        return
      }
    }

    setActivityError('')
    if (inlineActivityIsAtEnd || inlineActivityStartIndex == null) {
      setMode('summary')
      setAwaitingPageScroll(false)
      return
    }

    setMode('dialogue')
    setDialogueIndex(inlineActivityStartIndex)
    setTypingComplete(false)
    setAudioComplete(false)
    setHasStarted(true)
    setRepeatSignal((value) => value + 1)
    setSkipSignal((value) => value + 1)
    setRevealedPageIndex(getCurrentPageIndex(pages, inlineActivityStartIndex))
    setAwaitingPageScroll(false)
  }

  if (mode === 'activity' && inlineActivity) {
    const isCountingLock = inlineActivity.type === 'counting-lock'

    return (
      <section className="chapter-player-shell">
        <div className="story-scene-shell overflow-hidden rounded-[1.4rem] border border-[rgb(216_185_120_/_0.7)] shadow-[0_24px_60px_rgb(74_42_22_/_0.18)]">
          <div
            className="story-scene relative min-h-[calc(100vh-4.75rem)] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(180deg, rgb(15 23 42 / 0.2), rgb(15 23 42 / 0.62)), url(${inlineActivityBackdrop})`,
            }}
          >
            <div className="story-scene-glow pointer-events-none absolute inset-0" />
            <div className="story-scene-bottom-shade pointer-events-none absolute inset-x-0 bottom-0 h-72" />

            <div className="relative z-10 flex min-h-[calc(100vh-4.75rem)] flex-col justify-between p-4 sm:p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  className="story-scene-skip-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
                  onClick={() => navigate('/student/chapters')}
                >
                  <span aria-hidden="true">←</span>
                  <span>Back to story timeline</span>
                </button>

                <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur sm:inline-flex">
                  {isCountingLock
                    ? `Round ${countingLockRoundIndex + 1}`
                    : isPlaceholderActivity
                      ? 'Chapter checkpoint'
                      : isIntegerTrial
                        ? 'Integer trial'
                      : isTilePuzzle
                        ? 'Town map puzzle'
                      : 'Gate trial'}
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center py-6">
                <div className="story-summary-panel story-dialogue-entrance w-full max-w-5xl rounded-[1.6rem] p-5 sm:p-7">
                  <div className="flex flex-col gap-5">
                    <div>
                      <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                        {isCountingLock
                          ? 'Alvin’s challenge'
                          : isPlaceholderActivity
                            ? 'Placeholder checkpoint'
                            : isIntegerTrial
                              ? 'Integer checkpoint'
                            : isTilePuzzle
                              ? 'Map reconstruction'
                            : 'Alvin’s challenge'}
                      </span>
                      <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                        {chapter.title}
                      </h1>
                      <p className="mt-2 text-sm leading-7 text-white/82">
                        {isCountingLock
                          ? `Round ${countingLockRoundIndex + 1}`
                          : isPlaceholderActivity
                            ? 'Placeholder checkpoint before the gem scene'
                            : isIntegerTrial
                              ? 'Answer 2 questions each to obtain the map, torch, and key, then solve the final map'
                              : isTilePuzzle
                                ? 'Restore the puzzle to help Alvin rebuild the Town of Integers'
                                : 'Decide which numbers the Whole Number Gate should accept'}
                      </p>
                    </div>

                    {activityError ? (
                      <p className="rounded-2xl border border-red-300/60 bg-red-500/10 p-4 font-semibold text-red-100">
                        {activityError}
                      </p>
                    ) : null}

                    <ActivityRenderer
                      question={inlineActivity}
                      value={activityAnswers[inlineActivity.id]}
                      onChange={(nextAnswer) => {
                        setActivityAnswers((current) => ({
                          ...current,
                          [inlineActivity.id]: nextAnswer,
                        }))
                        setActivityError('')
                      }}
                      onRoundChange={setCountingLockRoundIndex}
                      dragging={activityDragging}
                      setDragging={setActivityDragging}
                    />

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-4">
                      <p className="text-sm font-semibold text-white/75">
                        {isCountingLock
                          ? 'Help Alvin complete the counting lock before the gem appears.'
                          : isPlaceholderActivity
                            ? 'Complete this placeholder checkpoint here. We will replace it with the real chapter activity later.'
                            : isIntegerTrial
                              ? 'Obtain all three items in order, then solve the final 4x4 map before continuing.'
                            : isTilePuzzle
                              ? 'Restore the town map before Alvin continues deeper into the chapter.'
                              : 'Accept whole numbers and reject non-whole numbers. One mistake restarts the gate.'}
                      </p>

                      {showInlineActivityProceed ? (
                        <button
                          type="button"
                          className="gold-button interactive-button rounded-full px-5 py-3 font-bold"
                          onClick={() => void handleInlineActivitySubmit()}
                        >
                          {inlineActivityIsAtEnd ? 'Proceed to chapter summary' : `Proceed to page ${inlineActivityPageNumber}`}
                        </button>
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

  return (
    <section className="chapter-player-shell">
      <StoryScene
        chapter={{
          ...chapter,
          scene: {
            ...chapter.scene,
            coverImage: chapter.scene.coverImage || landingPhoto,
          },
        }}
        dialogue={dialogue}
        dialogueIndex={dialogueIndex}
        totalDialogues={chapter.dialogues.length}
        hasStarted={hasStarted}
        narrationComplete={narrationComplete}
        typingComplete={typingComplete}
        typewriterStart={hasStarted}
        skipSignal={skipSignal}
        repeatSignal={repeatSignal}
        revealedPageIndex={revealedPageIndex}
        awaitingPageScroll={awaitingPageScroll}
        showTitleCover={showTitleCover}
        continueLabel={inlineActivity ? 'View activity result' : 'Complete chapter'}
        showRetakeActivity={Boolean(inlineActivity) && chapterProgress?.passed}
        mode={mode}
        onRetakeActivity={() => navigate(`/student/chapter/${chapter.id}/activity?preview=1`)}
        onTypingComplete={() => setTypingComplete(true)}
        onNarrationStart={() => setAudioComplete(false)}
        onNarrationComplete={() => setAudioComplete(true)}
        onNext={() => {}}
        onSkipTyping={() => {
          setSkipSignal((value) => value + 1)
          setTypingComplete(true)
        }}
        onRepeatDialogue={() => {
          const pageStart = currentPage?.startIndex ?? dialogueIndex
          setDialogueIndex(pageStart)
          setTypingComplete(false)
          setAudioComplete(false)
          setHasStarted(true)
          setSkipSignal((value) => value + 1)
          setRepeatSignal((value) => value + 1)
          setAwaitingPageScroll(false)
        }}
        onReplayPage={(pageStart) => {
          setDialogueIndex(pageStart)
          setTypingComplete(false)
          setAudioComplete(false)
          setHasStarted(true)
          setSkipSignal((value) => value + 1)
          setRepeatSignal((value) => value + 1)
          setMode('dialogue')
          setAwaitingPageScroll(false)
        }}
        canSkipPage={completedPageIndexes.includes(currentPageIndex)}
        onSkipPage={() => {}}
        onEnterPage={(pageIndex, pageStart) => {
          if (pageIndex <= currentPageIndex) return
          setDialogueIndex(pageStart)
          setTypingComplete(false)
          setAudioComplete(false)
          setHasStarted(true)
          setRepeatSignal((value) => value + 1)
          setAwaitingPageScroll(false)
        }}
        onReplay={handleReplay}
        onContinue={() => void handleChapterContinue()}
      />
    </section>
  )
}

export default ChapterPage
