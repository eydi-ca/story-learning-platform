import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import TypewriterText from '../components/TypewriterText'
import { chapters } from '../data/chapters'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { isChapterUnlocked } from '../utils/progress'

function ChapterPage() {
  const { chapterId } = useParams()
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const user = getCurrentUser()
  const activeClass = getOrSetActiveClass(user.id)
  const chapter = chapters.find((item) => item.id === chapterId)

  if (!chapter || !activeClass) return <Navigate to="/student/chapters" replace />
  if (!isChapterUnlocked(user.id, activeClass.classCode, chapter.id)) {
    return <Navigate to="/student/chapters" replace />
  }

  const dialogue = chapter.dialogues[dialogueIndex]
  const finishedDialogue = dialogueIndex >= chapter.dialogues.length - 1

  return (
    <section>
      <Link className="font-bold text-sky-700" to="/student/chapters">Back to story timeline</Link>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="min-h-[420px] p-6 text-white" style={{ background: chapter.scene.gradient }}>
          <div className="flex min-h-[340px] flex-col justify-between">
            <div>
              <p className="font-bold uppercase tracking-widest text-white/80">{chapter.scene.location}</p>
              <h1 className="mt-2 text-4xl font-black">{chapter.title}</h1>
              <p className="mt-3 max-w-2xl text-white/90">{chapter.story.narration}</p>
              {chapter.audioSrc ? <audio className="mt-4" controls src={chapter.audioSrc} /> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-end">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-4 border-white/70 bg-white/25 text-center text-lg font-black shadow-xl">
                {chapter.scene.mascotName}
              </div>
              <div className="rounded-2xl border border-white/40 bg-slate-950/80 p-5 shadow-2xl">
                <p className="mb-2 font-black text-sky-200">{dialogue.speaker}</p>
                <p className="min-h-16 text-lg leading-8">
                  <TypewriterText key={dialogue.text} text={dialogue.text} />
                </p>
                <button
                  className="mt-4 rounded-lg bg-white px-4 py-2 font-bold text-slate-950"
                  onClick={() => finishedDialogue ? setDialogueIndex(0) : setDialogueIndex(dialogueIndex + 1)}
                >
                  {finishedDialogue ? 'Replay dialogue' : 'Next dialogue'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6 rounded-xl bg-slate-50 p-5">
            <h2 className="text-xl font-black text-slate-950">Story Background</h2>
            <p className="mt-3 leading-7 text-slate-600">{chapter.story.background}</p>
          </div>
          <h2 className="text-2xl font-black text-slate-950">{chapter.tutorial.title}</h2>
          <p className="mt-3 text-slate-600">{chapter.tutorial.summary}</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {chapter.tutorial.points.map((point) => (
              <li className="rounded-xl bg-slate-50 p-4 font-semibold text-slate-700" key={point}>{point}</li>
            ))}
          </ul>
          <Link className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity`}>
            Continue to Activity
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ChapterPage
