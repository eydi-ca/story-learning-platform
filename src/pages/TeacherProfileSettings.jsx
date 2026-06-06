import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AvatarPicker from '../components/AvatarPicker'
import { getCurrentUser, updateCurrentUser } from '../utils/auth'

function TeacherProfileSettings() {
  const navigate = useNavigate()
  const teacher = getCurrentUser()
  const [fullName, setFullName] = useState(teacher.fullName)
  const [avatar, setAvatar] = useState(teacher.avatar)

  async function handleSubmit(event) {
    event.preventDefault()
    await updateCurrentUser({ fullName: fullName.trim(), avatar })
    navigate('/teacher/profile')
  }

  return (
    <section>
      <h1 className="text-3xl font-black text-slate-950">Profile Settings</h1>
      <form className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <label className="block text-sm font-bold text-slate-700">Display name
          <input
            className="mt-2 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <h2 className="mt-6 text-sm font-bold text-slate-700">Choose Profile Image</h2>
        <div className="mt-4">
          <AvatarPicker selectedAvatar={avatar} onChange={setAvatar} />
        </div>
        <button className="mt-6 rounded-lg bg-slate-950 px-5 py-3 font-bold text-white">Save changes</button>
      </form>
    </section>
  )
}

export default TeacherProfileSettings
