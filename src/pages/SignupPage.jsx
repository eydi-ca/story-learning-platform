import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AvatarPicker from '../components/AvatarPicker'
import PasswordField from '../components/forms/PasswordField'
import { siteContent } from '../data/siteContent'
import { FIELD_LIMITS, signupUser } from '../utils/auth'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: 'rainbow_guardian',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await signupUser(form)
      if (result.error) {
        setError(result.error)
        return
      }
      if (result.pendingVerification) {
        navigate('/auth/check-email', {
          state: { message: result.message, email: form.email.trim().toLowerCase() },
        })
        return
      }
      navigate('/choose-role')
    } catch {
      setError('We could not create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-black text-slate-950">{siteContent.auth.signupTitle}</h1>
      <p className="mt-2 text-slate-600">{siteContent.auth.signupSubtitle}</p>
      <form className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
        <label className="block text-sm font-bold text-slate-700" htmlFor="signup-name">Full Name
          <input
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            id="signup-name"
            maxLength={FIELD_LIMITS.nameMax}
            placeholder="Full name"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
        </label>
        <label className="block text-sm font-bold text-slate-700" htmlFor="signup-email">Email
          <input
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            id="signup-email"
            inputMode="email"
            maxLength={FIELD_LIMITS.emailMax}
            placeholder="name@example.com"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <PasswordField
          id="signup-password"
          label="Password"
          placeholder={`${FIELD_LIMITS.passwordMin}-${FIELD_LIMITS.passwordMax} characters`}
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />
        <PasswordField
          id="signup-confirm-password"
          label="Confirm password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={(confirmPassword) => setForm({ ...form, confirmPassword })}
        />
        <div>
          <h2 className="text-sm font-bold text-slate-700">Choose Profile Image</h2>
          <div className="mt-3">
            <AvatarPicker
              compact
              selectedAvatar={form.avatar}
              onChange={(avatar) => setForm({ ...form, avatar })}
            />
          </div>
        </div>
        <button className="w-full rounded-lg bg-slate-950 px-4 py-3 font-bold text-white" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        <p className="text-sm text-slate-500">Already have an account? <Link className="font-bold text-sky-700" to="/login">Login here.</Link></p>
      </form>
    </section>
  )
}

export default SignupPage
