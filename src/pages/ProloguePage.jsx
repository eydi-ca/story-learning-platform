import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import StoryScene from '../components/chapter/StoryScene'
import { prologue } from '../data/prologue'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { buildDialoguePages, getCurrentPageIndex } from '../utils/storyPages'

function ProloguePage() {
  const navigate = useNavigate()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  const [audioComplete, setAudioComplete] = useState(false)
  const [skipSignal, setSkipSignal] = useState(0)
  const [repeatSignal, setRepeatSignal] = useState(0)
  const [mode, setMode] = useState('dialogue')
  const [revealedPageIndex, setRevealedPageIndex] = useState(0)
  const [awaitingPageScroll, setAwaitingPageScroll] = useState(false)
  const [completedPageIndexes, setCompletedPageIndexes] = useState([])
  const user = getCurrentUser()
  const activeClass = user ? getOrSetActiveClass(user.id) : null

  useEffect(() => {
    setDialogueIndex(0)
    setHasStarted(false)
    setTypingComplete(false)
    setAudioComplete(false)
    setSkipSignal(0)
    setRepeatSignal(0)
    setMode('dialogue')
    setRevealedPageIndex(0)
    setAwaitingPageScroll(false)
    setCompletedPageIndexes([])
  }, [])

  useEffect(() => {
    if (mode !== 'dialogue') return undefined
    const timer = window.setTimeout(() => {
      setHasStarted(true)
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [mode, repeatSignal])

  const dialogue = useMemo(
    () => prologue.dialogues[dialogueIndex] ?? null,
    [dialogueIndex]
  )
  const pages = useMemo(() => buildDialoguePages(prologue), [])
  const currentPageIndex = getCurrentPageIndex(pages, dialogueIndex)
  const currentPage = pages[currentPageIndex] ?? null
  const narrationComplete = dialogueIndex >= prologue.dialogues.length - 1 && typingComplete

  useEffect(() => {
    if (!hasStarted || !typingComplete || !audioComplete || mode !== 'dialogue' || awaitingPageScroll) return undefined

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

      if (currentPageIndex < pages.length - 1) {
        setRevealedPageIndex(currentPageIndex + 1)
        setAwaitingPageScroll(true)
        return
      }

      setMode('summary')
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [audioComplete, awaitingPageScroll, currentPage, currentPageIndex, dialogueIndex, hasStarted, mode, pages.length, typingComplete])

  if (!user || !activeClass) return <Navigate to="/student/chapters" replace />

  function handleReplay() {
    setDialogueIndex(0)
    setTypingComplete(false)
    setAudioComplete(false)
    setHasStarted(false)
    setSkipSignal((value) => value + 1)
    setRepeatSignal((value) => value + 1)
    setMode('dialogue')
    setRevealedPageIndex(0)
    setAwaitingPageScroll(false)
    setCompletedPageIndexes([])
  }

  return (
    <section className="chapter-player-shell">
      <StoryScene
        chapter={prologue}
        dialogue={dialogue}
        dialogueIndex={dialogueIndex}
        totalDialogues={prologue.dialogues.length}
        hasStarted={hasStarted}
        narrationComplete={narrationComplete}
        typingComplete={typingComplete}
        typewriterStart={hasStarted}
        skipSignal={skipSignal}
        repeatSignal={repeatSignal}
        revealedPageIndex={revealedPageIndex}
        awaitingPageScroll={awaitingPageScroll}
        mode={mode}
        backToPath="/student/chapters"
        backToLabel="Back to story timeline"
        summaryBadge="Prologue Summary"
        continueLabel="Begin Chapter 1"
        showSceneContinue={false}
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
        onSkipPage={() => {
          if (!completedPageIndexes.includes(currentPageIndex)) return

          setSkipSignal((value) => value + 1)
          setTypingComplete(true)
          setAudioComplete(true)
          setCompletedPageIndexes((current) =>
            current.includes(currentPageIndex) ? current : [...current, currentPageIndex]
          )

          if (currentPageIndex < pages.length - 1) {
            setRevealedPageIndex((value) => Math.max(value, currentPageIndex + 1))
            setAwaitingPageScroll(true)
            return
          }

          setMode('summary')
        }}
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
        onContinue={() => navigate('/student/chapter/chapter-1')}
      />
    </section>
  )
}

export default ProloguePage
