import { Link, Navigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getClassById, getClassStudents } from '../utils/classUtils'
import { formatDateTime, getClassCompletionSummary, getProgressForClass } from '../utils/progress'

function TeacherStudentDetail() {
  const { classId, studentId } = useParams()
  const classroom = getClassById(classId)

  if (!classroom) return <Navigate to="/teacher/classes" replace />

  const student = getClassStudents(classroom.id).find((item) => item.id === studentId)

  if (!student) return <Navigate to={`/teacher/classes/${classroom.id}/students`} replace />

  const progress = getProgressForClass(student.id, classroom.id)
  const summary = getClassCompletionSummary(student.id, classroom.id)
  const progressByChapter = Object.fromEntries(
    progress.map((record) => [record.chapterId, record])
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="magic-heading text-3xl font-black">{student.fullName}</h1>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            {classroom.className} - {classroom.classCode}
          </p>
        </div>
        <Link
          className="teacher-secondary-button rounded-2xl px-4 py-2.5 text-sm font-bold"
          to={`/teacher/classes/${classroom.id}/students`}
        >
          Back to students
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="parchment-surface rounded-[20px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Progress</p>
          <p className="mt-2 text-2xl font-black text-[color:var(--brown)]">{summary.overallPercentage}%</p>
        </div>
        <div className="parchment-surface rounded-[20px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Completed</p>
          <p className="mt-2 text-2xl font-black text-[color:var(--brown)]">{summary.completedCount}/{chapters.length}</p>
        </div>
        <div className="parchment-surface rounded-[20px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Average Score</p>
          <p className="mt-2 text-2xl font-black text-[color:var(--brown)]">{summary.averageScore}%</p>
        </div>
        <div className="parchment-surface rounded-[20px] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted)]">Last Active</p>
          <p className="mt-2 text-lg font-black text-[color:var(--brown)]">
            {summary.latest ? formatDateTime(summary.latest.completedAt) : '-'}
          </p>
        </div>
      </div>

      <div className="parchment-surface overflow-hidden rounded-[24px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[color:var(--brown)]">
              <tr>
                <th className="p-4 font-bold">Chapter</th>
                <th className="p-4 font-bold">Score</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Completed At</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter) => {
                const record = progressByChapter[chapter.id]
                return (
                  <tr className="border-t border-[color:var(--border)]/40" key={chapter.id}>
                    <td className="p-4 font-semibold text-[color:var(--brown)]">{chapter.title}</td>
                    <td className="p-4 text-[color:var(--muted)]">{record ? `${record.percentage}%` : '-'}</td>
                    <td className="p-4 text-[color:var(--muted)]">
                      {record ? (record.passed ? 'Passed' : 'Needs retry') : 'Not started'}
                    </td>
                    <td className="p-4 text-[color:var(--muted)]">
                      {record ? formatDateTime(record.completedAt) : '-'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default TeacherStudentDetail
