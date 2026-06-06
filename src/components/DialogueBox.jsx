import TypewriterText from './TypewriterText'

function DialogueBox({ speaker, text }) {
  return (
    <div className="rounded-[2rem] border border-white/30 bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-200">
        {speaker}
      </p>
      <div className="mt-3 text-lg leading-8 text-slate-100">
        <TypewriterText text={text} />
      </div>
    </div>
  )
}

export default DialogueBox
