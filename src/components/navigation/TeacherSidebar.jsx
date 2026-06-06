import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import LogoutConfirmModal from './LogoutConfirmModal'
import { logoutUser } from '../../utils/auth'

function TeacherSidebar() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const linkClass = ({ isActive }) =>
    `sidebar-link block rounded-lg px-4 py-3 font-semibold ${isActive ? 'sidebar-link-active' : ''}`

  return (
    <>
      <aside className="sidebar-theme min-h-screen w-64 border-r p-4">
        <div className="magic-heading mb-8 text-xl font-black">Teacher Portal</div>
        <nav className="space-y-2">
          <NavLink to="/teacher/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/teacher/classes" className={linkClass}>Classes</NavLink>
          <NavLink to="/teacher/profile" className={linkClass}>Profile</NavLink>
          <button className="sidebar-link block w-full rounded-lg px-4 py-3 text-left font-semibold" onClick={() => setConfirmOpen(true)}>
            Logout
          </button>
        </nav>
      </aside>
      <LogoutConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          logoutUser()
          navigate('/login')
        }}
      />
    </>
  )
}

export default TeacherSidebar
