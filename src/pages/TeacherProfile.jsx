import { Link } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import { getCurrentUser } from '../utils/auth'
import { getTeacherClasses } from '../utils/classUtils'

function TeacherProfile() {
  const teacher = getCurrentUser()
  const classes = getTeacherClasses(teacher.id)

  return (
    <section className="parchment-surface rounded-[24px] p-6">
      <AvatarBadge avatarId={teacher.avatar} size="lg" />
      <h1 className="mt-4 text-3xl font-black text-[color:var(--brown)]">{teacher.fullName}</h1>
      <p className="mt-1 text-[color:var(--muted)]">{teacher.email}</p>
      <p className="mt-3 font-bold text-violet-700">Role: Teacher</p>
      <p className="mt-3 text-[color:var(--muted)]">Total created classes: <span className="font-black text-[color:var(--brown)]">{classes.length}</span></p>
      <Link className="gold-button mt-5 inline-block rounded-2xl px-5 py-3 font-bold" to="/teacher/profile/settings">
        Profile Settings
      </Link>
    </section>
  )
}

export default TeacherProfile
