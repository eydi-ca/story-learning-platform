import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordField from '../components/forms/PasswordField'
import { siteContent } from '../data/siteContent'
import { getJoinedClasses } from '../utils/classUtils'
import { FIELD_LIMITS, getRedirectForUser, loginUser } from '../utils/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const result = await loginUser(form)
    if (result.error) {
      setError(result.error)
      return
    }

    if (result.user.role === 'student' && getJoinedClasses(result.user.id).length === 0) {
      navigate('/student/join-class')
      return
    }
    navigate(getRedirectForUser(result.user))
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black text-slate-950">{siteContent.auth.loginTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.auth.loginSubtitle}</p>
      <form className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <label className="block text-sm font-bold text-slate-700" htmlFor="login-identifier">Email or Username
          <input
            autoComplete="username"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            id="login-identifier"
            maxLength={FIELD_LIMITS.identifierMax}
            placeholder="student@demo.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <PasswordField
          id="login-password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <button className="w-full rounded-lg bg-slate-950 px-4 py-3 font-bold text-white">Login</button>
        <p className="text-sm text-slate-500">Do not have an account yet? <Link className="font-bold text-sky-700" to="/signup">Create one.</Link></p>
      </form>
    </section>
  )
}

export default LoginPage
