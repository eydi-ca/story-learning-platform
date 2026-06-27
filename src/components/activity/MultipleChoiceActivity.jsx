function MultipleChoiceActivity({ question, value, onChange }) {
  return (
    <fieldset className="story-activity-card space-y-4 rounded-[1rem] p-5 sm:p-6">
      <legend className="text-lg font-black text-white">{question.question}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {question.choices.map((choice) => {
          const active = value === choice
          return (
            <label
              key={choice}
              className={`story-answer-option rounded-[1rem] border px-4 py-3 font-semibold ${
                active
                  ? 'border-[rgb(255_216_107_/_0.7)] bg-[rgb(255_216_107_/_0.18)] text-white'
                  : 'border-white/14 bg-white/8 text-white/88'
              }`}
            >
              <input
                className="mr-2"
                type="radio"
                name={question.id}
                value={choice}
                checked={active}
                onChange={() => onChange(choice)}
              />
              {choice}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default MultipleChoiceActivity
