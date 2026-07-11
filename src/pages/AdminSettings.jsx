import { useState } from 'react'
import { changeCurrentUserPassword, getCurrentUser } from '../utils/auth'
import { getClasses } from '../utils/storage'

const ADMIN_BRAND_KEY = 'story_admin_brand'

function AdminInfoRow({ label, value, helper }) {
  return (
    <div className="grid gap-2 border-b border-slate-200 py-4 last:border-b-0 sm:grid-cols-[12rem_1fr]">
      <div>
        <p className="text-sm font-black text-slate-950">{label}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
        {helper ? <p className="mt-1 text-sm leading-6 text-slate-500">{helper}</p> : null}
      </div>
    </div>
  )
}

function PasswordFieldRow({ id, label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
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

function SettingsPanel({ title, description, children, footer }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="p-6">{children}</div>
      {footer ? <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">{footer}</div> : null}
    </section>
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
          Manage administrator access, workspace branding, and account security.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-300">Administrative Console</p>
            <h2 className="mt-2 text-2xl font-black">{admin?.fullName ?? 'Administrator'}</h2>
            <p className="mt-1 text-sm text-slate-300">{admin?.email ?? 'Administrator account'}</p>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-slate-300">Role</p>
              <p className="mt-1 font-black">{admin?.role ?? 'admin'}</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3">
              <p className="text-slate-300">Tracked Classes</p>
              <p className="mt-1 font-black">{classes.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SettingsPanel
          title="Admin Account"
          description="Current administrator identity and workspace permissions."
        >
          <AdminInfoRow label="Current admin" value={admin?.fullName ?? 'Administrator'} />
          <AdminInfoRow label="Email" value={admin?.email ?? 'No email available'} />
          <AdminInfoRow label="Role" value={admin?.role ?? 'admin'} />
          <AdminInfoRow
            label="Workspace access"
            value="Full administrative access"
            helper="This account can view reports, manage teachers, inspect classes, and update platform settings."
          />
        </SettingsPanel>

        <SettingsPanel
          title="Workspace Operation"
          description="A short reference for how this admin workspace is organized."
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-950">Navigation flow</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Teachers are the entry point. Open a teacher, review their classes, then inspect students inside each class.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-950">Data review</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Use Dashboard for live tracking views and Reports for simple performance summaries.
              </p>
            </div>
          </div>
        </SettingsPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleBrandSubmit}>
          <SettingsPanel
            title="Sidebar Branding"
            description="Configure the short mark and workspace name shown in the admin sidebar."
            footer={
              <div className="flex justify-end">
                <button type="submit" className="admin-primary-button rounded-lg px-4 py-2.5 text-sm font-medium">
                  Save branding
                </button>
              </div>
            }
          >
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Sidebar Preview</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-900 text-sm font-black text-white">
                  {(brand.shortMark || 'NQ').slice(0, 4).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Admin Workspace</p>
                  <p className="mt-1 font-black text-slate-950">{brand.name || 'Numberland Quest'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
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
          </SettingsPanel>
        </form>

        <form onSubmit={handlePasswordSubmit}>
          <SettingsPanel
            title="Password Security"
            description="Update the admin password for this account."
            footer={
              <div className="flex justify-end">
                <button type="submit" disabled={isSaving} className="admin-primary-button rounded-lg px-4 py-2.5 text-sm font-medium">
                  {isSaving ? 'Updating...' : 'Update password'}
                </button>
              </div>
            }
          >
            <div className="space-y-4">
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
          </SettingsPanel>
        </form>
      </div>
    </section>
  )
}

export default AdminSettings
