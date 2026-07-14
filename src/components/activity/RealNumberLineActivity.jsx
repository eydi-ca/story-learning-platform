import { useEffect, useMemo, useState } from 'react'
import ActivityScriptPanel from './ActivityScriptPanel'

function buildInitialState(question) {
  const itemIds = (question.items ?? []).map((item) => item.id)
  return {
    selectedPart1Id: null,
    selectedPart2Id: null,
    feedback: '',
    part1: {
      completed: false,
      placedIds: [],
      placements: {},
    },
    part2: {
      completed: false,
      placedIds: [],
      placements: {},
    },
    itemIds,
  }
}

function getZoneLabel(zoneId) {
  const labels = {
    counting: 'Counting Numbers (N)',
    whole: 'Whole Numbers (W)',
    integers: 'Integers (Z)',
    rational: 'Rational Numbers (Q)',
    irrational: "Irrational Numbers (Q')",
  }

  return labels[zoneId] ?? zoneId
}

function formatClue(item) {
  return item?.approximation ? `≈ ${item.approximation}` : ''
}

function RealNumberLineActivity({ question, value, onChange }) {
  const [screen, setScreen] = useState('opening')
  const [draggingPart1Id, setDraggingPart1Id] = useState(null)
  const [draggingPart2Id, setDraggingPart2Id] = useState(null)
  const [hoveredPart2SlotId, setHoveredPart2SlotId] = useState(null)
  const safeValue = useMemo(
    () => (value?.part1 && value?.part2 ? value : buildInitialState(question)),
    [question, value]
  )

  useEffect(() => {
    if (!value?.part1 || !value?.part2) {
      onChange(safeValue)
    }
  }, [onChange, safeValue, value])

  useEffect(() => {
    setScreen('opening')
  }, [question.id])

  const items = question.items ?? []
  const zones = question.zones ?? []
  const slots = question.slots ?? []
  const itemMap = Object.fromEntries(items.map((item) => [item.id, item]))
  const script = question.script ?? {}

  function updateValue(updates) {
    onChange({
      ...safeValue,
      ...updates,
    })
  }

  function handleSelectPart1(itemId) {
    if (safeValue.part1.placedIds.includes(itemId)) return
    updateValue({
      selectedPart1Id: safeValue.selectedPart1Id === itemId ? null : itemId,
      feedback: '',
    })
  }

  function handleDropToZone(zoneId) {
    const itemId = draggingPart1Id ?? safeValue.selectedPart1Id
    if (!itemId) return

    const item = itemMap[itemId]
    const correct = item?.validZones?.includes(zoneId)

    if (!correct) {
      updateValue({
        selectedPart1Id: null,
        feedback: `${item.label} does not belong in ${getZoneLabel(zoneId)}. Try again.`,
      })
      setDraggingPart1Id(null)
      return
    }

    const nextPlacedIds = [...safeValue.part1.placedIds, itemId]
    updateValue({
      selectedPart1Id: null,
      feedback: `${item.label} correctly belongs in ${getZoneLabel(zoneId)}.`,
      part1: {
        completed: nextPlacedIds.length === items.length,
        placedIds: nextPlacedIds,
        placements: {
          ...safeValue.part1.placements,
          [itemId]: zoneId,
        },
      },
    })
    setDraggingPart1Id(null)
    if (nextPlacedIds.length === items.length) {
      setScreen('part1-complete')
    }
  }

  function handleSelectPart2(itemId) {
    if (!safeValue.part1.completed) return
    if (safeValue.part2.placedIds.includes(itemId)) return
    updateValue({
      selectedPart2Id: safeValue.selectedPart2Id === itemId ? null : itemId,
      feedback: '',
    })
  }

  function handleDropToSlot(slotId) {
    if (!safeValue.part1.completed) return
    const itemId = draggingPart2Id ?? safeValue.selectedPart2Id
    if (!itemId) return
    setHoveredPart2SlotId(null)

    const slot = slots.find((entry) => entry.id === slotId)
    if (!slot || slot.accepts !== itemId) {
      updateValue({
        selectedPart2Id: null,
        feedback: 'That number does not belong in this slot. Try again.',
      })
      setDraggingPart2Id(null)
      return
    }

    const nextPlacedIds = [...safeValue.part2.placedIds, itemId]
    updateValue({
      selectedPart2Id: null,
      feedback: `${itemMap[itemId]?.label} is plotted correctly on the number line.`,
      part2: {
        completed: nextPlacedIds.length === items.length,
        placedIds: nextPlacedIds,
        placements: {
          ...safeValue.part2.placements,
          [itemId]: slotId,
        },
      },
    })
    setDraggingPart2Id(null)
    if (nextPlacedIds.length === items.length) {
      setScreen('complete')
    }
  }

  const availablePart1Items = items.filter((item) => !safeValue.part1.placedIds.includes(item.id))
  const availablePart2Items = items.filter((item) => !safeValue.part2.placedIds.includes(item.id))

  if (screen === 'opening' && script.opening) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.opening.title}
        lines={script.opening.lines}
        ctaLabel={script.opening.ctaLabel || 'Start'}
        onContinue={() => setScreen('part1-intro')}
        tone="blue"
      />
    )
  }

  if (screen === 'part1-intro' && script.part1) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.part1.title}
        lines={script.part1.lines}
        ctaLabel={script.part1.ctaLabel || 'Begin Part 1'}
        onContinue={() => setScreen('part1')}
        tone="blue"
      />
    )
  }

  if (screen === 'part1-complete' && script.afterPart1) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.afterPart1.title}
        lines={script.afterPart1.lines}
        lineAudioSrcs={script.afterPart1.lineAudioSrcs}
        ctaLabel={script.afterPart1.ctaLabel || 'Continue'}
        onContinue={() => setScreen('part2-intro')}
        tone="blue"
      />
    )
  }

  if (screen === 'part2-intro' && script.part2) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.part2.title}
        lines={script.part2.lines}
        ctaLabel={script.part2.ctaLabel || 'Begin Part 2'}
        onContinue={() => setScreen('part2')}
        tone="blue"
      />
    )
  }

  if (screen === 'complete' && script.completion) {
    return (
      <ActivityScriptPanel
        eyebrow="System"
        title={script.completion.title}
        lines={script.completion.lines}
        lineAudioSrcs={script.completion.lineAudioSrcs}
        ctaLabel={script.completion.ctaLabel || 'Continue'}
        onContinue={null}
        tone="blue"
      />
    )
  }

  return (
    <section className="story-activity-card space-y-5 rounded-[1rem] p-3 sm:p-5 lg:p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-black text-white sm:text-xl">{question.question}</h2>
        <p className="max-w-3xl text-sm leading-6 text-white/80 sm:leading-7">
          {question.instruction}
        </p>
      </div>

      {screen !== 'part2' ? (
        <div className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] p-3 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/58">Part 1</p>
              <p className="mt-1 text-lg font-black text-white">Find Where the Number Belongs</p>
            </div>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/72">
              {safeValue.part1.placedIds.length} / {items.length} placed
            </span>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(18rem,0.78fr)_minmax(26rem,1.22fr)]">
            <div className="rounded-[1rem] border border-white/10 bg-slate-950/55 p-3 sm:p-4">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/68">
                Number cards
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
                {availablePart1Items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={() => {
                      setDraggingPart1Id(item.id)
                      updateValue({
                        selectedPart1Id: item.id,
                        feedback: '',
                      })
                    }}
                    onDragEnd={() => setDraggingPart1Id(null)}
                    className={`interactive-button min-h-12 rounded-[0.85rem] border px-2.5 py-2 text-center text-sm font-black transition sm:min-h-14 sm:px-3 sm:text-base ${
                      item.label.length > 7 ? 'col-span-2 sm:col-span-1 xl:col-span-2' : ''
                    } ${
                      safeValue.selectedPart1Id === item.id
                        ? 'border-amber-300/70 bg-amber-400/12 text-amber-50'
                        : 'border-white/10 bg-white/7 text-white/85 hover:border-sky-300/45'
                    }`}
                    onClick={() => handleSelectPart1(item.id)}
                  >
                    <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                ))}
                {!availablePart1Items.length ? (
                  <p className="col-span-full text-sm font-semibold text-emerald-100">
                    All numbers have been placed into a correct subset.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))]">
              {zones.map((zone) => {
                const zoneItems = safeValue.part1.placedIds
                  .filter((itemId) => safeValue.part1.placements[itemId] === zone.id)
                  .map((itemId) => itemMap[itemId])

                return (
                  <button
                    key={zone.id}
                    type="button"
                    className="min-h-28 rounded-[1rem] border border-white/10 bg-white/6 p-3 text-left transition hover:border-sky-300/45 sm:min-h-32 sm:p-4"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDropToZone(zone.id)}
                    onClick={() => handleDropToZone(zone.id)}
                  >
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-white/72">
                      {zone.label}
                    </p>
                    <div className="mt-3 flex min-h-12 flex-wrap content-start gap-2">
                      {zoneItems.length ? (
                        zoneItems.map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full border border-emerald-300/45 bg-emerald-500/12 px-3 py-1 text-sm font-bold text-emerald-100"
                          >
                            {item.label}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm font-semibold text-white/40">
                          Drag or tap a selected card here
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}

      {safeValue.part1.completed && screen === 'part2' ? (
      <div className="rounded-[1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.88))] p-3 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/58">Part 2</p>
            <p className="mt-1 text-lg font-black text-white">Plot on the Number Line</p>
          </div>
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-white/72">
            {safeValue.part2.placedIds.length} / {items.length} plotted
          </span>
        </div>

          <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(18rem,0.82fr)_minmax(16rem,0.55fr)]">
            <div className="h-[28rem] overflow-y-auto rounded-[1rem] border border-white/10 bg-slate-950/60 px-2 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent] sm:h-[38rem] sm:p-4 lg:h-[42rem]">
              <div className="relative mx-auto h-[46rem] w-full max-w-[18rem] sm:h-[52rem] sm:max-w-sm">
                <div className="absolute bottom-8 left-1/2 top-8 w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-200/70 via-white/75 to-sky-200/70" />
                {Array.from({ length: 27 }).map((_, index) => {
                  const valueNumber = 16 - index
                  const top = `${(index / 26) * 100}%`
                  const showMajorLabel = valueNumber % 2 === 0 || valueNumber === -10

                  return (
                    <div
                      key={valueNumber}
                      className="absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 sm:gap-3"
                      style={{ top }}
                    >
                      <p className="w-7 text-right text-xs font-bold text-white/72 sm:w-9">
                        {showMajorLabel ? valueNumber : ''}
                      </p>
                      <div className="h-[2px] w-5 rounded-full bg-white/45 sm:w-7" />
                      <div className="h-2 w-2 rounded-full bg-white/50" />
                      <div className="h-[2px] w-5 rounded-full bg-white/45 sm:w-7" />
                      <p className="w-7 text-xs font-bold text-white/40 sm:w-9" aria-hidden="true">
                        {showMajorLabel ? valueNumber : ''}
                      </p>
                    </div>
                  )
                })}

                {slots.map((slot, slotIndex) => {
                  const item = safeValue.part2.placedIds
                    .filter((itemId) => safeValue.part2.placements[itemId] === slot.id)
                    .map((itemId) => itemMap[itemId])[0]
                  const topPosition = `${100 - slot.positionPercent}%`
                  const isLeftSlot = slotIndex % 2 === 1

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      className={`absolute -translate-y-1/2 ${
                        isLeftSlot
                          ? 'right-[calc(50%+2.45rem)] sm:right-[calc(50%+3.7rem)]'
                          : 'left-[calc(50%+2.45rem)] sm:left-[calc(50%+3.7rem)]'
                      }`}
                      style={{ top: topPosition }}
                      onDragEnter={() => {
                        if (!item && draggingPart2Id) {
                          setHoveredPart2SlotId(slot.id)
                        }
                      }}
                      onDragOver={(event) => {
                        event.preventDefault()
                        if (!item && draggingPart2Id && hoveredPart2SlotId !== slot.id) {
                          setHoveredPart2SlotId(slot.id)
                        }
                      }}
                      onDragLeave={() => {
                        if (hoveredPart2SlotId === slot.id) {
                          setHoveredPart2SlotId(null)
                        }
                      }}
                      onDrop={() => handleDropToSlot(slot.id)}
                      onClick={() => handleDropToSlot(slot.id)}
                    >
                      <div
                        className={`flex min-h-10 min-w-14 items-center justify-center rounded-[0.75rem] border px-2 py-1.5 text-sm font-black text-white shadow-[0_0_18px_rgba(251,191,36,0.08)] sm:min-h-11 sm:min-w-24 sm:px-3 sm:py-2 sm:text-base ${
                          item
                            ? 'border-emerald-300/55 bg-emerald-500/14 text-emerald-100'
                            : hoveredPart2SlotId === slot.id
                              ? 'border-cyan-200/80 bg-cyan-400/22 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.34)]'
                            : 'border-dashed border-amber-200/45 bg-amber-400/10'
                        }`}
                      >
                        <span className="block max-w-16 overflow-hidden text-ellipsis whitespace-nowrap sm:max-w-none">
                          {item ? item.label : '?'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex max-h-[28rem] flex-col rounded-[1rem] border border-white/10 bg-slate-950/55 p-3 sm:h-[38rem] sm:max-h-none sm:p-4 lg:h-[42rem]">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/68">
                Number cards
              </p>
              <div className="mt-3 grid flex-1 content-start grid-cols-2 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.35)_transparent] sm:grid-cols-3 sm:gap-3 lg:grid-cols-2">
                {availablePart2Items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={() => {
                      setDraggingPart2Id(item.id)
                      updateValue({
                        selectedPart2Id: item.id,
                        feedback: '',
                      })
                    }}
                    onDragEnd={() => setDraggingPart2Id(null)}
                    className={`interactive-button min-h-16 rounded-[0.85rem] border px-3 py-2.5 text-left text-sm font-black transition sm:rounded-[0.9rem] sm:px-4 sm:py-3 sm:text-base ${
                      item.label.length > 7 ? 'col-span-2 sm:col-span-1 lg:col-span-2' : ''
                    } ${
                      safeValue.selectedPart2Id === item.id
                        ? 'border-amber-300/70 bg-amber-400/12 text-amber-50'
                        : 'border-white/10 bg-white/7 text-white/85 hover:border-sky-300/45'
                    }`}
                    onClick={() => handleSelectPart2(item.id)}
                  >
                    <span className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
                    {item.approximation ? (
                      <span className="mt-1 block text-xs font-semibold text-sky-100/80">
                        {formatClue(item)}
                      </span>
                    ) : null}
                  </button>
                ))}
                {!availablePart2Items.length ? (
                  <p className="text-sm font-semibold text-emerald-100">
                    Every number is plotted correctly on the real number line.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
      </div>
      ) : null}

      {safeValue.feedback ? (
        <p className="rounded-[0.9rem] border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white/82">
          {safeValue.feedback}
        </p>
      ) : null}
    </section>
  )
}

export default RealNumberLineActivity
