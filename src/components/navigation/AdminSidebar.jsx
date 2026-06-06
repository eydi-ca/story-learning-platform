import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import LogoutConfirmModal from './LogoutConfirmModal'
import { logoutAdmin } from '../../utils/auth'

function AdminSidebar() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const linkClass = ({ isActive }) =>
    `sidebar-link block rounded-lg px-4 py-3 font-semibold ${isActive ? 'sidebar-link-active' : ''}`

  return (
    <>
      <aside className="sidebar-theme min-h-screen w-64 border-r p-4">
        <div className="magic-heading mb-8 text-xl font-black">Admin Portal</div>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/reports" className={linkClass}>Reports</NavLink>
          <NavLink to="/admin/teachers" className={linkClass}>Teachers</NavLink>
          <NavLink to="/admin/students" className={linkClass}>Students</NavLink>
          <button className="sidebar-link block w-full rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setConfirmOpen(true)}>
            Logout
          </button>
        </nav>
      </aside>
      <LogoutConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          logoutAdmin()
          navigate('/admin/login')
        }}
      />
    </>
  )
}

export default AdminSidebar
