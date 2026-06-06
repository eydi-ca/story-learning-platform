import EmptyState from '../components/EmptyState'
import { getClasses, getStudents, getTeacherById, getAllProgress } from '../utils/storage'

function AdminClasses() {
  const classes = getClasses()
  const students = getStudents()
  const progress = getAllProgress()

  return (
    <section className="grid gap-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900">All classes</h1>
        <p className="mt-3 text-slate-600">
          Review every class, assigned teacher, and recent learning activity.
        </p>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          title="No classes yet"
          description="Teacher-created classes will appear here automatically."
        />
      ) : (
        <div className="grid gap-4">
          {classes.map((classroom) => {
            const teacher = getTeacherById(classroom.teacherId)
            const classStudents = students.filter((student) => student.classId === classroom.id)
            const studentIds = new Set(classStudents.map((student) => student.id))
            const classProgress = progress.filter((item) => studentIds.has(item.studentId))

            return (
              <div
                key={classroom.id}
                className="rounded-[2rem] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{classroom.name}</h2>
                    <p className="mt-2 text-slate-600">
                      {classroom.section} - {classroom.gradeLevel} - Code {classroom.code}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Teacher: {teacher?.name ?? 'Unassigned'}
                    </p>
                  </div>

                  <div className="text-sm font-semibold text-slate-700">
                    <p>{classStudents.length} students</p>
                    <p>{classProgress.length} saved chapter results</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AdminClasses
