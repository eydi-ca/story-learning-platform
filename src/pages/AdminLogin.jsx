import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../utils/storage'

function AdminLogin() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()

    if (username === 'admin' && password === 'admin123') {
      loginAdmin()
      navigate('/admin/dashboard')
      return
    }

    setError('Invalid login. Use admin / admin123 for demo.')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-2 text-slate-600">
          Monitor students, progress, scores, and completion.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <label className="block mt-6">
          <span className="font-semibold text-slate-700">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block mt-4">
          <span className="font-semibold text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <button className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700">
          Login
        </button>
      </form>
    </main>
  )
}

export default AdminLogin