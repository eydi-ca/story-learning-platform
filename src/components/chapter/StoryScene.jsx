import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import landingPhoto from '../../assets/landingpage-photo.png'
import alvinAvatar from '../../assets/profiles/alvin.png'
import guardianAvatar from '../../assets/profiles/guardian_avatar.png'
import knightAvatar from '../../assets/profiles/knight_avatar.png'
import AudioPlayer from '../AudioPlayer'
import DialogueBox from '../DialogueBox'
import { buildDialoguePages } from '../../utils/storyPages'
import { preloadAudioSources } from '../../utils/audioPreload'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5m6-6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function getSpeakerConfig(chapter, speaker) {
  const normalizedSpeaker = (speaker || '').trim().toLowerCase()

  if (normalizedSpeaker === 'system') {
    return {
      label: 'System',
      avatar: null,
      isSystem: true,
    }
  }

  if (normalizedSpeaker === 'alvin') {
    return {
      label: 'Alvin',
      avatar: alvinAvatar,
      isSystem: false,
    }
  }

  return {
    label: speaker || chapter.scene.mascotName || 'Guide',
    avatar: knightAvatar || guardianAvatar,
    isSystem: false,
  }
}

function getDialogueAudioSources(dialogue) {
  if (Array.isArray(dialogue?.audioSrcs)) return dialogue.audioSrcs.filter(Boolean)
  if (Array.isArray(dialogue?.audioSrc)) return dialogue.audioSrc.filter(Boolean)
  return dialogue?.audioSrc ? [dialogue.audioSrc] : []
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
  isReviewingPage = false,
  skipSignal,
  repeatSignal,
  revealedPageIndex = 0,
  awaitingPageScroll = false,
  canSkipPage = false,
  completedPageIndexes = [],
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
  showTitleCover = false,
  showRetakeActivity = false,
  onRetakeActivity = null,
  afterPagesContent = null,
}) {
  const dialogueLeadRatio = 0.72
  const [typingDurationMs, setTypingDurationMs] = useState(null)
  const scrollRef = useRef(null)
  const pageRefs = useRef([])
  const summaryRef = useRef(null)
  const afterPagesRef = useRef(null)
  const pages = useMemo(() => buildDialoguePages(chapter), [chapter])
  const currentPageIndex = Math.max(
    0,
    pages.findIndex((page) => dialogueIndex >= page.startIndex && dialogueIndex <= page.endIndex)
  )
  const currentPage = pages[currentPageIndex] ?? null
  const speaker = getSpeakerConfig(chapter, dialogue?.speaker)
  const isSystemTurn = Boolean(speaker.isSystem)
  const storyPlaybackIsActive = mode === 'dialogue' || isReviewingPage
  const showReplayPageAction = canSkipPage && awaitingPageScroll
  const dialogueAudioSources = useMemo(() => getDialogueAudioSources(dialogue), [dialogue])
  const highestCompletedPageIndex = completedPageIndexes.length
    ? Math.max(...completedPageIndexes)
    : -1
  const visiblePageCount = Math.min(
    pages.length,
    Math.max(revealedPageIndex, currentPageIndex, highestCompletedPageIndex) + 1
  )
  const visiblePages =
    mode === 'summary' || (mode === 'activity' && afterPagesContent)
      ? pages
      : pages.slice(0, visiblePageCount)

  useEffect(() => {
    const upcomingSources = chapter.dialogues
      .slice(dialogueIndex, dialogueIndex + 4)
      .flatMap((item) => getDialogueAudioSources(item))

    preloadAudioSources(upcomingSources)
  }, [chapter.dialogues, dialogueIndex])

  useEffect(() => {
    if (!currentPage) return

    const pageSources = chapter.dialogues
      .slice(currentPage.startIndex, currentPage.endIndex + 1)
      .flatMap((item) => getDialogueAudioSources(item))

    preloadAudioSources(pageSources)
  }, [chapter.dialogues, currentPage])

  useEffect(() => {
    if (!dialogueAudioSources.length) {
      setTypingDurationMs(null)
      return undefined
    }

    let cancelled = false
    let pending = dialogueAudioSources.length
    let totalDurationMs = 0
    const audios = dialogueAudioSources.map((audioSrc) => new Audio(audioSrc))

    const finishMetadataLoad = () => {
      if (cancelled) return
      pending -= 1
      if (pending > 0) return

      setTypingDurationMs(
        totalDurationMs > 0 ? Math.max(totalDurationMs * dialogueLeadRatio, 900) : null
      )
    }

    const handleLoadedMetadata = (audio) => {
      if (Number.isFinite(audio.duration)) {
        totalDurationMs += audio.duration * 1000
      }
      finishMetadataLoad()
    }

    audios.forEach((audio) => {
      audio.preload = 'metadata'
      audio.addEventListener('loadedmetadata', () => handleLoadedMetadata(audio))
      audio.addEventListener('error', finishMetadataLoad)
      audio.load()
    })

    return () => {
      cancelled = true
    }
  }, [dialogueAudioSources])

  useEffect(() => {
    if (mode !== 'summary') return undefined
    summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return undefined
  }, [mode])

  useEffect(() => {
    if (showTitleCover || !storyPlaybackIsActive || isReviewingPage) return undefined

    const root = scrollRef.current
    const target = pageRefs.current[currentPageIndex]

    if (!root || !target) return undefined

    const syncScroll = () => {
      const targetTop = target.offsetTop
      if (Math.abs(root.scrollTop - targetTop) > 2) {
        root.scrollTo({ top: targetTop, behavior: 'auto' })
      }
    }

    syncScroll()
    const frame = window.requestAnimationFrame(syncScroll)

    return () => window.cancelAnimationFrame(frame)
  }, [currentPageIndex, dialogueIndex, isReviewingPage, revealedPageIndex, showTitleCover, storyPlaybackIsActive])

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
            <BackIcon />
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
            {continueLabel}
          </button>
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
            onClick={onReplay}
          >
            Replay dialogue
          </button>
          {showRetakeActivity ? (
            <button
              type="button"
              className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold text-white"
              onClick={onRetakeActivity}
            >
              Retake activity
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )

  function handleReplayPage(pageStart, pageIndex) {
    const page = pages[pageIndex]
    if (page) {
      const pageSources = chapter.dialogues
        .slice(page.startIndex, page.endIndex + 1)
        .flatMap((item) => getDialogueAudioSources(item))

      preloadAudioSources(pageSources)
    }

    onReplayPage?.(pageStart, pageIndex)
  }

  return (
    <div className="story-scene-shell overflow-hidden rounded-[1.4rem] border border-[rgb(216_185_120_/_0.7)] shadow-[0_24px_60px_rgb(74_42_22_/_0.18)]">
      {showTitleCover ? (
        <section className="story-portrait-entrance flex h-[calc(100vh-4.25rem)] min-h-[36rem] flex-col bg-slate-950">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={chapter.scene.coverImage || landingPhoto}
              alt={`${chapter.title} cover`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </section>
      ) : (
        <>
          <AudioPlayer
            text={storyPlaybackIsActive && typewriterStart ? dialogue?.text ?? '' : ''}
            src={storyPlaybackIsActive && typewriterStart ? dialogueAudioSources[0] ?? '' : ''}
            srcs={storyPlaybackIsActive && typewriterStart ? dialogueAudioSources : []}
            title={`${speaker.label} narration`}
            autoPlay={storyPlaybackIsActive && typewriterStart}
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
              const isCurrentPage = storyPlaybackIsActive && index === currentPageIndex
              const pageWasCompleted = completedPageIndexes.includes(index)
              const isCompletedPage =
                mode === 'summary' || (mode === 'activity' && afterPagesContent)
                  ? (index <= currentPageIndex || pageWasCompleted) && !isCurrentPage
                  : pageWasCompleted && !isCurrentPage
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
                      className="h-full w-full flex-1 object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgb(15_23_42_/_0.14)] via-transparent to-[rgb(15_23_42_/_0.24)]" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-3 sm:p-4 lg:p-5">
                      <Link
                        className="story-scene-skip-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white"
                        to={backToPath}
                      >
                        <BackIcon />
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
                          variant={isSystemTurn ? 'system' : 'default'}
                          className={`story-dialogue-panel mx-auto w-full max-w-5xl ${typewriterStart ? 'story-dialogue-entrance' : ''}`}
                          avatar={
                            isSystemTurn ? (
                              <div className="relative flex h-11 w-11 items-center justify-center rounded-[0.7rem] border border-cyan-200/85 bg-[linear-gradient(180deg,rgba(15,118,184,0.36),rgba(8,47,73,0.62))] shadow-[0_0_0_1px_rgba(125,211,252,0.2),0_0_18px_rgba(34,211,238,0.34),inset_0_0_16px_rgba(125,211,252,0.18)]">
                                <div className="pointer-events-none absolute inset-x-1 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent shadow-[0_0_12px_rgba(103,232,249,0.95)]" />
                                <span className="text-[1.65rem] font-black leading-none text-cyan-50 drop-shadow-[0_0_12px_rgba(125,211,252,0.95)]">!</span>
                              </div>
                            ) : (
                              <div className="story-inline-avatar">
                                <img
                                  src={pageSpeaker?.avatar || guardianAvatar}
                                  alt="Dialogue avatar"
                                  className="h-11 w-11 rounded-md object-cover ring-2 ring-white/35"
                                />
                              </div>
                            )
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

                              {showReplayPageAction ? (
                                <button
                                  type="button"
                                  className="ml-auto outline-magic-button interactive-button rounded-full px-3 py-1 text-[0.7rem] font-bold"
                                  onClick={() => handleReplayPage(currentPage?.startIndex ?? page.startIndex, index)}
                                >
                                  Replay page
                                </button>
                              ) : null}
                            </div>
                          }
                        />
                      </div>
                    ) : isCompletedPage ? (
                      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-end gap-3">
                        {mode === 'activity' && afterPagesContent && index === pages.length - 1 ? (
                          <p className="mr-auto text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/55">
                            Scroll down to continue to the activity
                          </p>
                        ) : null}
                        <button
                          type="button"
                          className="outline-magic-button interactive-button rounded-full px-3 py-1.5 text-xs font-bold"
                          onClick={() => handleReplayPage(page.startIndex, index)}
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

            {mode === 'activity' && afterPagesContent ? (
              <section
                ref={afterPagesRef}
                className="min-h-[calc(100vh-4.75rem)] snap-start bg-slate-950"
              >
                {afterPagesContent}
              </section>
            ) : null}

            {mode === 'summary' ? (
              <section
                ref={summaryRef}
                className="flex h-[calc(100vh-4.75rem)] snap-start items-center justify-center bg-slate-950 px-4 py-5 sm:px-6 lg:px-8"
              >
                {summaryView}
              </section>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

export default StoryScene
