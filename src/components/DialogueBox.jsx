function DialogueBox({ speaker, text }) {
  return (
    <div className="rounded-2xl border-4 border-slate-800 bg-white p-5 shadow-lg">
      <p className="text-sm font-bold text-indigo-700 mb-2">{speaker}</p>
      <p className="text-lg text-slate-800 leading-relaxed">{text}</p>
    </div>
  )
}

export default DialogueBox