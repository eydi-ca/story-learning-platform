import { useState } from 'react'
import { FIELD_LIMITS } from '../../utils/validation'

function PasswordField({ id, label = 'Password', value, onChange, placeholder = 'Password' }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block text-sm font-bold text-slate-700" htmlFor={id}>
      {label}
      <div className="relative mt-2">
        <input
          autoComplete={label.toLowerCase().includes('confirm') ? 'new-password' : 'current-password'}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-11"
          id={id}
          maxLength={FIELD_LIMITS.passwordMax}
          minLength={FIELD_LIMITS.passwordMin}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={visible ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-2 my-auto flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--muted)] transition hover:bg-[color:var(--beige)]"
          onClick={() => setVisible((next) => !next)}
          type="button"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  )
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" />
      <path d="M9.9 5.3A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.1-.8" />
    </svg>
  )
}

export default PasswordField
