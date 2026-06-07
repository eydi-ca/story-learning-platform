import { useState } from 'react'
import { changeCurrentUserPassword, getCurrentUser } from '../utils/auth'
import { getClasses } from '../utils/storage'

const ADMIN_BRAND_KEY = 'story_admin_brand'

function SettingItem({ label, value, helper }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-200 py-4 last:border-b-0">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <p className="text-sm text-slate-600">{value}</p>
      {helper ? <p className="text-sm text-slate-500">{helper}</p> : null}
    </div>
  )
}

function PasswordFieldRow({ id, label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        type="password"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input w-full rounded-lg px-3 py-2.5 text-sm"
      />
    </label>
  )
}

function AdminSettings() {
  const admin = getCurrentUser()
  const classes = getClasses()
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [brand, setBrand] = useState(() => {
    if (typeof window === 'undefined') {
      return { shortMark: 'NQ', name: 'Numberland Quest' }
    }
    return JSON.parse(localStorage.getItem(ADMIN_BRAND_KEY) || '{"shortMark":"NQ","name":"Numberland Quest"}')
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [brandMessage, setBrandMessage] = useState('')

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    const result = await changeCurrentUserPassword(form)
    if (result.error) {
      setError(result.error)
      setIsSaving(false)
      return
    }

    setSuccess('Password updated successfully.')
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setIsSaving(false)
  }

  function handleBrandSubmit(event) {
    event.preventDefault()
    const nextBrand = {
      shortMark: (brand.shortMark || 'NQ').trim().slice(0, 4).toUpperCase(),
      name: (brand.name || 'Numberland Quest').trim(),
    }

    localStorage.setItem(ADMIN_BRAND_KEY, JSON.stringify(nextBrand))
    setBrand(nextBrand)
    setBrandMessage('Sidebar branding updated.')
    window.dispatchEvent(new CustomEvent('admin-brand-updated', { detail: nextBrand }))
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Review administrator details and the current platform configuration snapshot.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="admin-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Admin management</h2>
          <div className="mt-4">
            <SettingItem label="Current admin" value={admin?.fullName ?? 'Administrator'} />
            <SettingItem label="Email" value={admin?.email ?? 'No email available'} />
            <SettingItem label="Role" value={admin?.role ?? 'admin'} />
            <SettingItem
              label="Workspace access"
              value="Full administrative access"
              helper="This account can view reports, manage teachers, and review platform-wide activity."
            />
          </div>
        </div>

        <div className="admin-panel p-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Workspace notes</h2>
          <div className="mt-4 space-y-4">
            <div className="admin-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Classes tracked</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{classes.length}</p>
              <p className="mt-2 text-sm text-slate-500">Use the dashboard overview for full user and activity totals.</p>
            </div>
            <div className="admin-card p-4">
              <p className="text-sm font-medium text-slate-900">Navigation flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Teachers now act as the entry point. Open a teacher, review their classes, then inspect the students inside each class.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="admin-panel p-6" onSubmit={handleBrandSubmit}>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Sidebar branding</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Edit the short mark and workspace name shown in the sidebar placeholder.</p>
          <div className="mt-5 space-y-4">
            {brandMessage ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{brandMessage}</p> : null}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Short mark</span>
              <input
                type="text"
                maxLength={4}
                value={brand.shortMark}
                onChange={(event) => setBrand({ ...brand, shortMark: event.target.value })}
                className="admin-input w-full rounded-lg px-3 py-2.5 text-sm"
                placeholder="NQ"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Workspace name</span>
              <input
                type="text"
                value={brand.name}
                onChange={(event) => setBrand({ ...brand, name: event.target.value })}
                className="admin-input w-full rounded-lg px-3 py-2.5 text-sm"
                placeholder="Numberland Quest"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" className="admin-primary-button rounded-lg px-4 py-2.5 text-sm font-medium">
              Save branding
            </button>
          </div>
        </form>

        <form className="admin-panel p-6" onSubmit={handlePasswordSubmit}>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Change password</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Update the admin password securely for this account.</p>
          <div className="mt-5 space-y-4">
            {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            {success ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}
            <PasswordFieldRow
              id="admin-current-password"
              label="Current password"
              value={form.currentPassword}
              placeholder="Enter current password"
              onChange={(currentPassword) => setForm({ ...form, currentPassword })}
            />
            <PasswordFieldRow
              id="admin-new-password"
              label="New password"
              value={form.newPassword}
              placeholder="Enter new password"
              onChange={(newPassword) => setForm({ ...form, newPassword })}
            />
            <PasswordFieldRow
              id="admin-confirm-password"
              label="Confirm new password"
              value={form.confirmPassword}
              placeholder="Re-enter new password"
              onChange={(confirmPassword) => setForm({ ...form, confirmPassword })}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={isSaving} className="admin-primary-button rounded-lg px-4 py-2.5 text-sm font-medium">
              {isSaving ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default AdminSettings
