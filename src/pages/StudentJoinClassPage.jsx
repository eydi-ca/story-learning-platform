import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getJoinedClasses, joinClass, selectActiveClass } from '../utils/classUtils'

function StudentJoinClassPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const joinedClasses = user ? getJoinedClasses(user.id) : []

  async function handleJoin(event) {
    event.preventDefault()
    const result = await joinClass(user.id, code)
    if (result.error) {
      setError(result.error)
      setMessage('')
      return
    }
    setError('')
    setMessage(result.message ?? `Joined ${result.classroom.className}.`)
    navigate('/student/chapters')
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">{siteContent.student.joinTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.student.joinSubtitle}</p>
      <form className="mt-6 flex max-w-xl gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleJoin}>
        <label className="min-w-0 flex-1 text-sm font-bold text-slate-700">Class Code
          <input className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 uppercase" placeholder="Example: CLASS123" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} />
        </label>
        <button className="self-end rounded-lg bg-slate-950 px-5 py-2 font-bold text-white">Join Class</button>
      </form>
      {error ? <p className="mt-4 rounded-lg bg-red-50 p-3 font-semibold text-red-700">{error}</p> : null}
      {message ? <p className="mt-4 rounded-lg bg-emerald-50 p-3 font-semibold text-emerald-700">{message}</p> : null}

      <h2 className="mt-10 text-2xl font-black text-slate-950">{siteContent.student.joinedTitle}</h2>
      <p className="mt-2 text-slate-600">{siteContent.student.joinedDescription}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {joinedClasses.length ? joinedClasses.map((classroom) => (
          <button
            key={classroom.id}
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-sky-300"
            onClick={() => {
              selectActiveClass(user.id, classroom.id)
              navigate('/student/chapters')
            }}
          >
            <p className="text-lg font-black text-slate-950">{classroom.className}</p>
            <p className="mt-1 font-mono text-sm font-bold text-sky-700">{classroom.classCode}</p>
          </button>
        )) : <p className="text-slate-500">{siteContent.student.joinedEmpty}</p>}
      </div>
    </section>
  )
}

export default StudentJoinClassPage
