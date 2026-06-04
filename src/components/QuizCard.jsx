function QuizCard({ question, selectedAnswer, onAnswer }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow border border-slate-100">
      <h3 className="font-bold text-slate-900 mb-4">{question.question}</h3>

      <div className="grid gap-3">
        {question.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => onAnswer(question.id, choice)}
            className={`text-left rounded-xl border px-4 py-3 transition ${
              selectedAnswer === choice
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizCard