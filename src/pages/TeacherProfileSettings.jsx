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
      <h1 className="magic-heading text-3xl font-black">Profile Settings</h1>
      <form className="parchment-surface mt-6 rounded-[24px] p-6" onSubmit={handleSubmit}>
        <label className="block text-sm font-bold text-[color:var(--brown)]">Display name
          <input
            className="mt-2 w-full max-w-md rounded-2xl border border-[color:var(--border)] bg-white/80 px-3 py-2 text-[color:var(--brown)]"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </label>
        <h2 className="mt-6 text-sm font-bold text-[color:var(--brown)]">Choose Profile Image</h2>
        <div className="mt-4">
          <AvatarPicker selectedAvatar={avatar} onChange={setAvatar} />
        </div>
        <button className="gold-button mt-6 rounded-2xl px-5 py-3 font-bold">Save changes</button>
      </form>
    </section>
  )
}

export default TeacherProfileSettings
