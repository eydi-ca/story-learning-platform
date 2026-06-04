import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { classrooms } from '../data/classrooms'
import { saveStudent } from '../utils/storage'

function StudentStart() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    const foundClassroom = classrooms.find(
      (room) => room.code.toLowerCase() === classCode.trim().toLowerCase()
    )

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!foundClassroom) {
      setError('Invalid classroom code. Try CLASS123 for demo.')
      return
    }

    const student = {
      id: Date.now().toString(),
      name: name.trim(),
      classCode: foundClassroom.code,
      section: foundClassroom.section,
      createdAt: new Date().toISOString(),
    }

    saveStudent(student)
    navigate('/student/chapters')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-slate-900">Start Learning</h1>
        <p className="mt-2 text-slate-600">
          Enter your classroom code and name to begin.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <label className="block mt-6">
          <span className="font-semibold text-slate-700">Classroom Code</span>
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="Example: CLASS123"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mt-4">
          <span className="font-semibold text-slate-700">Student Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <button className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-white font-semibold hover:bg-indigo-700">
          Continue
        </button>
      </form>
    </main>
  )
}

export default StudentStart