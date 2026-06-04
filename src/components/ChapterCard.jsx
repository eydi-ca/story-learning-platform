import { Link } from 'react-router-dom'

function ChapterCard({ chapter, isCompleted }) {
  return (
    <Link
      to={`/student/chapter/${chapter.id}`}
      className="block rounded-2xl bg-white p-6 shadow hover:shadow-lg transition border border-slate-100"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{chapter.title}</h3>
          <p className="mt-2 text-slate-600">{chapter.description}</p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            isCompleted
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {isCompleted ? 'Completed' : 'Not yet'}
        </span>
      </div>
    </Link>
  )
}

export default ChapterCard