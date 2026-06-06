import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarPicker from '../components/AvatarPicker'
import { getCurrentUser, updateCurrentUser } from '../utils/auth'
import { getJoinedClasses } from '../utils/classUtils'

function StudentProfileSettings() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [fullName, setFullName] = useState(user.fullName)
  const [avatar, setAvatar] = useState(user.avatar)
  const joinedClasses = getJoinedClasses(user.id)

  async function handleSubmit(event) {
    event.preventDefault()
    await updateCurrentUser({ fullName: fullName.trim(), avatar })
    navigate('/student/profile')
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">Profile Settings</h1>
      <form className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <label className="block text-sm font-bold text-slate-700">Display name
          <input className="mt-2 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </label>
        <h2 className="mt-6 text-sm font-bold text-slate-700">Choose Profile Image</h2>
        <div className="mt-4">
          <AvatarPicker selectedAvatar={avatar} onChange={setAvatar} />
        </div>
        <h2 className="mt-6 text-xl font-black text-slate-950">Joined classes</h2>
        <p className="mt-2 text-slate-600">Class removal is disabled in this demo to avoid accidental progress loss.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {joinedClasses.map((classroom) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700" key={classroom.id}>{classroom.className}</span>)}
        </div>
        <button className="mt-6 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white">Save changes</button>
      </form>
    </section>
  )
}

export default StudentProfileSettings
