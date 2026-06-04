import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getStudent, getStudentProgress } from '../utils/storage'
import ChapterCard from '../components/ChapterCard'
import ProgressBar from '../components/ProgressBar'

function ChapterSelection() {
  const navigate = useNavigate()
  const student = getStudent()

  useEffect(() => {
    if (!student) {
      navigate('/student/start')
    }
  }, [student, navigate])

  if (!student) return null

  const progress = getStudentProgress(student.id)
  const completedCount = progress.length
  const percentage = Math.round((completedCount / chapters.length) * 100)

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-slate-500">Welcome back,</p>
          <h1 className="text-3xl font-bold text-slate-900">{student.name}</h1>
          <p className="mt-1 text-slate-600">{student.section}</p>

          <div className="mt-6">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Overall Progress</span>
              <span>{percentage}%</span>
            </div>
            <ProgressBar value={percentage} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">
          Choose a Chapter
        </h2>

        <div className="grid gap-5">
          {chapters.map((chapter) => {
            const isCompleted = progress.some(
              (item) => item.chapterId === chapter.id
            )

            return (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isCompleted={isCompleted}
              />
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default ChapterSelection