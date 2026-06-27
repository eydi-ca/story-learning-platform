function DragGroupActivity({ question, value = [], onChange, dragging, setDragging }) {
  function addItem(item) {
    if (value.includes(item)) return
    onChange([...value, item])
  }

  function removeItem(item) {
    onChange(value.filter((entry) => entry !== item))
  }

  function toggleItem(item) {
    if (value.includes(item)) {
      removeItem(item)
      return
    }
    addItem(item)
  }

  return (
    <section className="story-activity-card story-activity-entrance space-y-5 rounded-[1rem] p-5 sm:p-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/65">
          Drag and group
        </p>
        <h2 className="mt-2 text-lg font-black text-white">
          {question.instruction || question.question}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {question.items.map((item) => {
          const active = value.includes(item)
          return (
            <button
              key={item}
              type="button"
              draggable
              onDragStart={() => setDragging(item)}
              onDragEnd={() => setDragging(null)}
              onClick={() => toggleItem(item)}
              className={`story-drag-tile interactive-button rounded-[1rem] px-4 py-3 text-base font-black ${
                active
                  ? 'border-[rgb(79_157_93_/_0.65)] bg-[rgb(79_157_93_/_0.16)] text-white'
                  : 'text-white'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>

      <div
        className={`story-drop-zone rounded-[1rem] border-2 border-dashed p-4 sm:p-5 ${
          dragging ? 'story-drop-zone-active' : ''
        }`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => {
          if (!dragging) return
          addItem(dragging)
          setDragging(null)
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/65">
              Drop zone
            </p>
            <h3 className="mt-1 text-lg font-black text-white">
              {question.dropLabel || 'Selected answers'}
            </h3>
          </div>
          <button
            type="button"
            className="outline-magic-button interactive-button rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]"
            onClick={() => onChange([])}
          >
            Reset
          </button>
        </div>

        <div className="mt-4 flex min-h-24 flex-wrap gap-3 rounded-[1rem] bg-white/6 p-3">
          {value.length ? (
            value.map((item) => (
              <button
                key={item}
                type="button"
                className="story-drop-item rounded-[1rem] border px-4 py-3 text-base font-black text-white"
                onClick={() => removeItem(item)}
              >
                {item}
              </button>
            ))
          ) : (
            <p className="self-center text-sm font-semibold text-white/68">
              Drag matching tiles here or tap them to select.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default DragGroupActivity
