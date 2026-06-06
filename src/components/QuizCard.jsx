function QuizCard({ question, index, selectedAnswer, onAnswer }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
        Question {index + 1}
      </p>
      <h3 className="mt-3 text-xl font-bold text-slate-900">
        {question.question}
      </h3>

      <div className="mt-5 grid gap-3">
        {question.choices.map((choice) => {
          const selected = selectedAnswer === choice

          return (
            <button
              key={choice}
              type="button"
              onClick={() => onAnswer(question.id, choice)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                selected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuizCard
