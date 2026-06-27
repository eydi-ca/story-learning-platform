import { useEffect, useMemo, useRef, useState } from 'react'

function MatchPairsActivity({ question, value = {}, onChange }) {
  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const [activeLeftId, setActiveLeftId] = useState(null)
  const [dragPoint, setDragPoint] = useState(null)
  const [layoutVersion, setLayoutVersion] = useState(0)

  useEffect(() => {
    function handleResize() {
      setLayoutVersion((value) => value + 1)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!activeLeftId) return undefined

    function handlePointerMove(event) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setDragPoint({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    }

    function handlePointerUp() {
      setActiveLeftId(null)
      setDragPoint(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [activeLeftId])

  function getAnchorPosition(node) {
    const containerRect = containerRef.current?.getBoundingClientRect()
    const rect = node?.getBoundingClientRect()
    if (!containerRect || !rect) return null

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height / 2,
    }
  }

  const mappedRightIds = Object.values(value)

  const lines = useMemo(() => {
    return Object.entries(value)
      .map(([leftId, rightId]) => {
        const from = getAnchorPosition(leftRefs.current[leftId])
        const to = getAnchorPosition(rightRefs.current[rightId])
        if (!from || !to) return null
        return { id: `${leftId}-${rightId}`, from, to }
      })
      .filter(Boolean)
  }, [layoutVersion, value])

  const previewLine = useMemo(() => {
    if (!activeLeftId || !dragPoint) return null
    const from = getAnchorPosition(leftRefs.current[activeLeftId])
    if (!from) return null
    return { from, to: dragPoint }
  }, [activeLeftId, dragPoint, layoutVersion])

  function assignMatch(leftId, rightId) {
    onChange({
      ...Object.fromEntries(
        Object.entries(value).filter(([, existingRightId]) => existingRightId !== rightId)
      ),
      [leftId]: rightId,
    })
    setActiveLeftId(null)
    setDragPoint(null)
  }

  function clearMatch(leftId) {
    const next = { ...value }
    delete next[leftId]
    onChange(next)
  }

  function getRightLabel(rightId) {
    return question.rightItems.find((item) => item.id === rightId)?.label ?? 'Not matched'
  }

  return (
    <section className="story-activity-card story-activity-entrance space-y-5 rounded-[1rem] p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/65">
          Match pairs
        </p>
        <h2 className="text-lg font-black text-white">
          {question.instruction || question.question}
        </h2>
        <p className="text-sm font-semibold text-white/72">
          Drag from Side A to Side B, or tap one item on each side to connect them.
        </p>
      </div>

      <div ref={containerRef} className="story-match-board relative rounded-[1rem] border border-white/10 bg-white/4 p-4 sm:p-5">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="rgba(255, 206, 84, 0.95)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          {previewLine ? (
            <line
              x1={previewLine.from.x}
              y1={previewLine.from.y}
              x2={previewLine.to.x}
              y2={previewLine.to.y}
              stroke="rgba(125, 211, 252, 0.9)"
              strokeWidth="3"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        <div className="relative z-10 grid gap-4 lg:grid-cols-[1fr_120px_1fr]">
          <div className="space-y-3">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">Side A</p>
            {question.leftItems.map((item) => (
              <button
                key={item.id}
                ref={(node) => {
                  leftRefs.current[item.id] = node
                }}
                type="button"
                className={`story-match-node w-full rounded-[1rem] border px-4 py-4 text-left ${
                  activeLeftId === item.id ? 'story-match-node-active' : ''
                }`}
                onClick={() => setActiveLeftId((current) => (current === item.id ? null : item.id))}
                onPointerDown={(event) => {
                  const rect = containerRef.current?.getBoundingClientRect()
                  setActiveLeftId(item.id)
                  if (rect) {
                    setDragPoint({
                      x: event.clientX - rect.left,
                      y: event.clientY - rect.top,
                    })
                  }
                }}
              >
                <p className="font-black text-white">{item.label}</p>
                <p className="mt-2 text-sm text-white/68">
                  {value[item.id] ? `Matched with: ${getRightLabel(value[item.id])}` : 'Tap or drag to connect'}
                </p>
              </button>
            ))}
          </div>

          <div className="hidden items-center justify-center lg:flex">
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/65">
              Match
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/72">Side B</p>
            {question.rightItems.map((item) => {
              const assigned = mappedRightIds.includes(item.id)
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    rightRefs.current[item.id] = node
                  }}
                  type="button"
                  className={`story-match-node w-full rounded-[1rem] border px-4 py-4 text-left ${
                    assigned ? 'story-match-node-filled' : ''
                  }`}
                  onClick={() => {
                    if (!activeLeftId) return
                    assignMatch(activeLeftId, item.id)
                  }}
                  onPointerUp={() => {
                    if (!activeLeftId) return
                    assignMatch(activeLeftId, item.id)
                  }}
                >
                  <p className="font-black text-white">{item.label}</p>
                  <p className="mt-2 text-sm text-white/68">
                    {assigned ? 'Already linked' : 'Available match'}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white"
          onClick={() => onChange({})}
        >
          Reset matches
        </button>
        {activeLeftId ? (
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-4 py-2 text-sm font-bold uppercase tracking-[0.14em] text-white"
            onClick={() => clearMatch(activeLeftId)}
          >
            Clear selected
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default MatchPairsActivity
