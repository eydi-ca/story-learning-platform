import { Link, useNavigate } from 'react-router-dom'
import sampleBackground from '../assets/sample_background.png'
import { chapters } from '../data/chapters'
import { prologue } from '../data/prologue'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getJoinedClasses, getOrSetActiveClass, selectActiveClass } from '../utils/classUtils'
import { getChapterStatus, getClassCompletionSummary, isChapterUnlocked } from '../utils/progress'

function StudentChaptersPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const joinedClasses = getJoinedClasses(user.id)
  const activeClass = getOrSetActiveClass(user.id)

  if (!activeClass) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">{siteContent.student.timelineTitle}</h1>
        <p className="mt-3 text-slate-600">{siteContent.student.joinSubtitle}</p>
        <Link className="mt-6 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/student/join-class">Join Class</Link>
      </section>
    )
  }

  const summary = getClassCompletionSummary(user.id, activeClass.id)

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-950">{siteContent.student.timelineTitle}</h1>
          <p className="mt-2 text-slate-600">{siteContent.student.timelineSubtitle}</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">{siteContent.student.timelineInstruction}</p>
          <p className="mt-3 text-slate-600">Current Class: <span className="font-bold">{activeClass.className}</span> ({activeClass.classCode})</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {joinedClasses.length > 1 ? (
            <select className="rounded-lg border border-slate-300 bg-white px-3 py-2" value={activeClass.id} onChange={(event) => {
              selectActiveClass(user.id, event.target.value)
              navigate(0)
            }}>
              {joinedClasses.map((classroom) => <option key={classroom.id} value={classroom.id}>Switch Class: {classroom.className}</option>)}
            </select>
          ) : null}
          <Link className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700" to="/student/join-class">Join Another Class</Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex justify-between text-sm font-bold text-slate-600">
          <span>Overall progress</span>
          <span>{summary.overallPercentage}%</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-emerald-500" style={{ width: `${summary.overallPercentage}%` }} />
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-full bg-[rgb(255_216_107_/_0.32)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[color:var(--brown)]">
            Start Here
          </span>
          <p className="text-sm font-semibold text-slate-600">
            Read the Prologue before Chapter 1. You can replay it anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/student/prologue')}
          className="chapter-tile group w-full overflow-hidden rounded-[1.6rem] border border-slate-200 text-left shadow-sm hover:border-sky-300"
        >
          <div className="chapter-tile-media relative min-h-[220px]">
            <div
              className="chapter-tile-image absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(180deg, rgb(15 23 42 / 0.18), rgb(15 23 42 / 0.65)), url(${sampleBackground})`,
              }}
            />
            <div className="chapter-tile-overlay absolute inset-0" />
            <div className="relative z-10 flex min-h-[220px] flex-col justify-between p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-white">{prologue.title}</h2>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">
                  Replayable
                </span>
              </div>
              <div>
                <p className="text-sm leading-6 text-white/85">{prologue.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {prologue.duration}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    Introduction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      <div className="relative mt-10">
        <div className="rainbow-line absolute left-6 top-0 h-full w-3 rounded-full md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-8">
          {chapters.map((chapter, index) => {
            const unlocked = isChapterUnlocked(user.id, activeClass.classCode, chapter.id)
            const status = getChapterStatus(user.id, activeClass.classCode, chapter.id)
            const passed = status === 'Passed'
            return (
              <div className={`relative flex ${index % 2 ? 'md:justify-end' : 'md:justify-start'}`} key={chapter.id}>
                <div className="absolute left-2 top-7 z-10 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-slate-950 font-black text-white shadow md:left-1/2 md:-translate-x-1/2">
                  {chapter.number}
                </div>
                <button
                  disabled={!unlocked}
                  onClick={() => navigate(`/student/chapter/${chapter.id}`)}
                  className={`chapter-tile group ml-20 w-full overflow-hidden rounded-[1.6rem] border text-left shadow-sm md:ml-0 md:w-[44%] ${unlocked ? 'border-slate-200 bg-white hover:border-sky-300' : 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-70'} ${passed ? 'ring-2 ring-emerald-300' : ''}`}
                >
                  <div className="chapter-tile-media relative min-h-[220px]">
                    <div
                      className="chapter-tile-image absolute inset-0"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgb(15 23 42 / 0.18), rgb(15 23 42 / 0.65)), url(${sampleBackground})`,
                      }}
                    />
                    <div className="chapter-tile-overlay absolute inset-0" />
                    <div className="relative z-10 flex min-h-[220px] flex-col justify-between p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-black text-white">{chapter.title}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${passed ? 'bg-emerald-100 text-emerald-800' : status === 'Locked' ? 'bg-slate-200 text-slate-600' : 'bg-sky-100 text-sky-800'}`}>{status}</span>
                      </div>
                      <div>
                        <p className="text-sm leading-6 text-white/85">{chapter.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {chapter.duration}
                          </span>
                          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            Passing score: 75%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default StudentChaptersPage
