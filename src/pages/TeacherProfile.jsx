import { Link } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import { getCurrentUser } from '../utils/auth'
import { getTeacherClasses } from '../utils/classUtils'

function TeacherProfile() {
  const teacher = getCurrentUser()
  const classes = getTeacherClasses(teacher.id)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <AvatarBadge avatarId={teacher.avatar} size="lg" />
      <h1 className="mt-4 text-3xl font-black text-slate-950">{teacher.fullName}</h1>
      <p className="mt-1 text-slate-600">{teacher.email}</p>
      <p className="mt-3 font-bold text-sky-700">Role: Teacher</p>
      <p className="mt-3 text-slate-600">Total created classes: <span className="font-black">{classes.length}</span></p>
      <Link className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/teacher/profile/settings">
        Profile Settings
      </Link>
    </section>
  )
}

export default TeacherProfile
