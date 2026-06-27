import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import archerAvatar from '../../assets/profiles/archer_avatar.png'
import guardianAvatar from '../../assets/profiles/guardian_avatar.png'
import knightAvatar from '../../assets/profiles/knight_avatar.png'
import mageAvatar from '../../assets/profiles/mage_avatar.png'
import AudioPlayer from '../AudioPlayer'
import DialogueBox from '../DialogueBox'
import { buildDialoguePages } from '../../utils/storyPages'

function getSpeakerConfig(chapter, speaker) {
  const normalizedSpeaker = (speaker || '').trim().toLowerCase()

  if (normalizedSpeaker === 'system') {
    return {
      label: 'System',
      avatar: mageAvatar,
    }
  }

  if (normalizedSpeaker === 'alvin') {
    return {
      label: 'Alvin',
      avatar: archerAvatar,
    }
  }

  return {
    label: speaker || chapter.scene.mascotName || 'Guide',
    avatar: knightAvatar || guardianAvatar,
  }
}

function StoryScene({
  chapter,
  dialogue,
  dialogueIndex,
  totalDialogues,
  hasStarted,
  narrationComplete,
  typingComplete,
  typewriterStart,
  skipSignal,
  repeatSignal,
  revealedPageIndex = 0,
  awaitingPageScroll = false,
  canSkipPage = false,
  mode = 'dialogue',
  onTypingComplete,
  onNarrationStart,
  onNarrationComplete,
  onNext,
  onSkipTyping,
  onRepeatDialogue,
  onReplayPage,
  onEnterPage,
  onReplay,
  onSkipPage,
  onContinue,
  backToPath = '/student/chapters',
  backToLabel = 'Back to story timeline',
  summaryBadge = 'Lesson Summary',
  continueLabel = 'Continue to Lesson',
  showSceneContinue = true,
}) {
  const dialogueLeadRatio = 0.72
  const [typingDurationMs, setTypingDurationMs] = useState(null)
  const scrollRef = useRef(null)
  const pageRefs = useRef([])
  const summaryRef = useRef(null)
  const pages = useMemo(() => buildDialoguePages(chapter), [chapter])
  const currentPageIndex = Math.max(
    0,
    pages.findIndex((page) => dialogueIndex >= page.startIndex && dialogueIndex <= page.endIndex)
  )
  const currentPage = pages[currentPageIndex] ?? null
  const speaker = getSpeakerConfig(chapter, dialogue?.speaker)
  const visiblePages =
    mode === 'summary'
      ? pages
      : pages.slice(0, Math.min(revealedPageIndex + 1, pages.length))

  useEffect(() => {
    if (!dialogue?.audioSrc) {
      setTypingDurationMs(null)
      return undefined
    }

    let cancelled = false
    const audio = new Audio(dialogue.audioSrc)

    const handleLoadedMetadata = () => {
      if (cancelled) return
      const duration = Number.isFinite(audio.duration) ? audio.duration * 1000 : null
      setTypingDurationMs(duration && duration > 0 ? Math.max(duration * dialogueLeadRatio, 900) : null)
    }

    const handleError = () => {
      if (!cancelled) {
        setTypingDurationMs(null)
      }
    }

    audio.preload = 'metadata'
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('error', handleError)
    audio.load()

    return () => {
      cancelled = true
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('error', handleError)
    }
  }, [dialogue?.audioSrc])

  useEffect(() => {
    if (mode !== 'summary') return undefined
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return undefined
  }, [mode])

  useEffect(() => {
    if (!awaitingPageScroll || mode !== 'dialogue') return undefined

    const nextPageIndex = currentPageIndex + 1
    const target = pageRefs.current[nextPageIndex]
    const root = scrollRef.current
    const nextPage = pages[nextPageIndex]

    if (!target || !root || !nextPage) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        onEnterPage?.(nextPageIndex, nextPage.startIndex)
      },
      {
        root,
        threshold: 0.65,
      }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [awaitingPageScroll, currentPageIndex, mode, onEnterPage, pages])

  const summaryView = (
    <div className="story-summary-panel story-dialogue-entrance mx-auto w-full max-w-4xl rounded-[1.4rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
              {summaryBadge}
            </span>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">{chapter.tutorial.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/85">{chapter.tutorial.summary}</p>
          </div>

          <Link
            className="story-scene-skip-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
            to={backToPath}
          >
            <span aria-hidden="true">←</span>
            <span>{backToLabel}</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {chapter.tutorial.points.map((point, index) => (
            <article
              key={point}
              className="story-summary-card rounded-[1rem] p-5"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/18 text-sm font-black text-white">
                {index + 1}
              </span>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/82">{point}</p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="gold-button interactive-button rounded-full px-4 py-2 text-sm font-bold"
            onClick={onContinue}
          >
            Continue to Activity
          </button>
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
            onClick={onReplay}
          >
            Replay dialogue
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="story-scene-shell overflow-hidden rounded-[1.4rem] border border-[rgb(216_185_120_/_0.7)] shadow-[0_24px_60px_rgb(74_42_22_/_0.18)]">
      <AudioPlayer
        text={mode === 'dialogue' && typewriterStart ? dialogue?.text ?? '' : ''}
        src={mode === 'dialogue' && typewriterStart ? dialogue?.audioSrc ?? '' : ''}
        title={`${speaker.label} narration`}
        autoPlay={mode === 'dialogue' && typewriterStart}
        replayKey={`${dialogueIndex}-${repeatSignal}-${mode}`}
        showControls={false}
        onPlaybackStart={onNarrationStart}
        onPlaybackComplete={onNarrationComplete}
      />

      <div
        ref={scrollRef}
        className="story-scene h-[calc(100vh-4.75rem)] min-h-[33rem] snap-y snap-mandatory overflow-y-auto bg-slate-950/98 scroll-smooth"
      >
        {visiblePages.map((page, index) => {
          const isCurrentPage = mode === 'dialogue' && index === currentPageIndex
          const isCompletedPage = mode === 'summary' ? index <= currentPageIndex : index < currentPageIndex
          const pageSpeaker = isCurrentPage ? speaker : null
          const showScrollPrompt = isCurrentPage && awaitingPageScroll && index < pages.length - 1

          return (
            <section
              key={page.id}
              ref={(node) => {
                pageRefs.current[index] = node
              }}
              className="relative flex h-[calc(100vh-4.75rem)] snap-start flex-col bg-slate-950"
            >
              <div className={`relative flex min-h-0 flex-[1_1_auto] flex-col overflow-hidden bg-slate-950 ${isCurrentPage ? 'story-portrait-entrance' : ''}`}>
                <img
                  src={page.backgroundSrc}
                  alt={`${chapter.title} page ${page.pageNumber}`}
                  className="h-full w-full flex-1 object-contain object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgb(15_23_42_/_0.14)] via-transparent to-[rgb(15_23_42_/_0.24)]" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-3 sm:p-4 lg:p-5">
                  <Link
                    className="story-scene-skip-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
                    to={backToPath}
                  >
                    <span aria-hidden="true">←</span>
                    <span>{backToLabel}</span>
                  </Link>

                  <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur sm:inline-flex">
                    {chapter.scene.location}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5">
                {isCurrentPage ? (
                  <div className="story-dialogue-stack relative">
                    <DialogueBox
                      speaker={pageSpeaker?.label ?? ''}
                      text={dialogue?.text ?? ''}
                      typingDurationMs={typingDurationMs}
                      start={typewriterStart}
                      skip={skipSignal}
                      resetKey={repeatSignal}
                      onComplete={onTypingComplete}
                      showCursor={!typingComplete}
                      className={`story-dialogue-panel mx-auto w-full max-w-5xl ${typewriterStart ? 'story-dialogue-entrance' : ''}`}
                      avatar={
                        <div className="story-inline-avatar">
                          <img
                            src={pageSpeaker?.avatar || guardianAvatar}
                            alt="Dialogue avatar"
                            className="h-11 w-11 rounded-md object-cover ring-2 ring-white/35"
                          />
                        </div>
                      }
                      footer={
                        <div className="flex flex-wrap items-center gap-2 pt-1.5">
                          {typingComplete && narrationComplete && showSceneContinue ? (
                            <button
                              type="button"
                              className="gold-button interactive-button rounded-full px-3.5 py-1.5 text-xs font-bold"
                              onClick={onContinue}
                            >
                              {continueLabel}
                            </button>
                          ) : null}

                          {showScrollPrompt ? (
                            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                              Scroll down to continue
                            </p>
                          ) : null}

                          {canSkipPage ? (
                            <button
                              type="button"
                              className="ml-auto rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/12"
                              onClick={onSkipPage}
                            >
                              Skip page
                            </button>
                          ) : null}
                        </div>
                      }
                    />
                  </div>
                ) : isCompletedPage ? (
                  <div className="mx-auto flex w-full max-w-5xl justify-end">
                    <button
                      type="button"
                      className="outline-magic-button interactive-button rounded-full px-3 py-1.5 text-xs font-bold"
                      onClick={() => onReplayPage?.(page.startIndex)}
                    >
                      Replay page {page.pageNumber}
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-5xl pb-1 text-right text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/45">
                    Scroll here to unlock this page
                  </div>
                )}
              </div>
            </section>
          )
        })}

        {mode === 'summary' ? (
          <section
            ref={summaryRef}
            className="flex h-[calc(100vh-4.75rem)] snap-start items-center justify-center bg-slate-950 px-4 py-5 sm:px-6 lg:px-8"
          >
            {summaryView}
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default StoryScene
