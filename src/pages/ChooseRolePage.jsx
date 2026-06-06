import { useNavigate } from 'react-router-dom'
import { siteContent } from '../data/siteContent'
import { chooseRole } from '../utils/auth'
import { getJoinedClasses } from '../utils/classUtils'

function ChooseRolePage() {
  const navigate = useNavigate()

  async function handleRole(role) {
    const result = await chooseRole(role)
    if (result.error) return
    if (role === 'teacher') navigate('/teacher/dashboard')
    if (role === 'student') {
      navigate(getJoinedClasses(result.user.id).length ? '/student/chapters' : '/student/join-class')
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-center text-4xl font-black text-slate-950">{siteContent.auth.chooseRoleTitle}</h1>
      <p className="mt-3 text-center text-slate-600">{siteContent.auth.chooseRoleSubtitle}</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <button className="rounded-xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:border-sky-300 hover:shadow-md" onClick={() => handleRole('student')}>
          <h2 className="text-2xl font-black text-slate-950">Continue as Student</h2>
          <p className="mt-3 text-slate-600">Join a class using a class code, explore the story timeline, complete activities, and track your progress.</p>
          <span className="mt-5 inline-block rounded-lg bg-slate-950 px-4 py-2 font-bold text-white">I am a Student</span>
        </button>
        <button className="rounded-xl border border-slate-200 bg-white p-8 text-left shadow-sm hover:border-emerald-300 hover:shadow-md" onClick={() => handleRole('teacher')}>
          <h2 className="text-2xl font-black text-slate-950">Continue as Teacher</h2>
          <p className="mt-3 text-slate-600">Create classes, generate class codes, and monitor student progress, scores, and completion.</p>
          <span className="mt-5 inline-block rounded-lg bg-slate-950 px-4 py-2 font-bold text-white">I am a Teacher</span>
        </button>
      </div>
    </section>
  )
}

export default ChooseRolePage
