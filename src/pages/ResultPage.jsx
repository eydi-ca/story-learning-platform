import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { siteContent } from '../data/siteContent'
import { getCurrentUser } from '../utils/auth'
import { getOrSetActiveClass } from '../utils/classUtils'
import { formatClockTime, formatElapsedTime, formatStopwatchTime, getLatestResult } from '../utils/progress'

function formatAnswerLabel(value, labelMap = {}) {
  const text = String(value ?? '').trim()
  const slotMatch = text.match(/^r(\d+)-slot-(\d+)$/i)

  if (labelMap[text]) return labelMap[text]
  if (slotMatch) return `Round ${slotMatch[1]}, Slot ${slotMatch[2]}`
  if (text === 'accept') return 'Accept'
  if (text === 'reject') return 'Reject'
  if (text === 'true') return 'Yes'
  if (text === 'false') return 'No'

  return text || 'No answer'
}

function parseAnswerRows(answer, fallback = 'No answer', labelMap = {}) {
  if (Array.isArray(answer)) {
    return answer.length
      ? answer.map((item, index) => ({ label: `Item ${index + 1}`, value: formatAnswerLabel(item, labelMap) }))
      : [{ label: '', value: fallback }]
  }

  if (answer && typeof answer === 'object') {
    const entries = Object.entries(answer)
    return entries.length
      ? entries.map(([left, right]) => ({
          label: formatAnswerLabel(left, labelMap),
          value: Array.isArray(right)
            ? right.map((item) => formatAnswerLabel(item, labelMap)).join(', ')
            : formatAnswerLabel(right, labelMap),
        }))
      : [{ label: '', value: fallback }]
  }

  const text = String(answer || fallback)
  const parts = text
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length > 1) {
    return parts.map((part) => {
      const [left, ...rest] = part.split('->')
      if (rest.length) {
        return { label: formatAnswerLabel(left, labelMap), value: formatAnswerLabel(rest.join('->'), labelMap) }
      }

      const [label, ...valueParts] = part.split(':')
      return valueParts.length
        ? { label: formatAnswerLabel(label, labelMap), value: formatAnswerLabel(valueParts.join(':'), labelMap) }
        : { label: '', value: formatAnswerLabel(part, labelMap) }
    })
  }

  return [{ label: '', value: formatAnswerLabel(text, labelMap) }]
}

function AnswerList({ answer, fallback, labelMap = {} }) {
  const rows = parseAnswerRows(answer, fallback, labelMap)

  return (
    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-800">
      {rows.map((row, index) => (
        <li key={`${row.label}-${row.value}-${index}`}>
          {row.label ? <span className="font-bold text-slate-950">{row.label}: </span> : null}
          <span>{row.value}</span>
        </li>
      ))}
    </ul>
  )
}

function getAnswerLabelMap(question) {
  const items = question?.cards ?? question?.pairs ?? question?.items ?? question?.leftItems ?? question?.rightItems ?? []

  return Object.fromEntries(
    items
      .filter((item) => item?.id && item?.label)
      .map((item) => [item.id, item.label])
  )
}

function getGatekeeperGroups(answer, labelMap = {}) {
  const groups = { accept: [], reject: [] }
  const responses = answer?.responses ?? answer

  Object.entries(responses ?? {}).forEach(([id, action]) => {
    const key = String(action).toLowerCase()
    if (!groups[key]) return
    groups[key].push(formatAnswerLabel(id, labelMap))
  })

  return groups
}

function GatekeeperAnswerList({ answer, labelMap = {} }) {
  const groups = getGatekeeperGroups(answer, labelMap)

  return (
    <div className="mt-2 space-y-3 text-sm leading-6 text-slate-800">
      <div>
        <p className="font-bold text-slate-950">Accept:</p>
        <p>- {groups.accept.join(', ') || 'None'}</p>
      </div>
      <div>
        <p className="font-bold text-slate-950">Reject:</p>
        <p>- {groups.reject.join(', ') || 'None'}</p>
      </div>
    </div>
  )
}

function getMemoryMatchGroups(answer, labelMap = {}) {
  const groups = { rational: [], irrational: [] }
  const classifications = answer?.classifications ?? answer

  Object.entries(classifications ?? {}).forEach(([id, classification]) => {
    const normalized = String(classification).toLowerCase()
    const key = normalized.includes('irrational') ? 'irrational' : normalized.includes('rational') ? 'rational' : ''
    if (!key) return
    groups[key].push(formatAnswerLabel(id, labelMap))
  })

  return groups
}

function MemoryMatchAnswerList({ answer, labelMap = {} }) {
  const groups = getMemoryMatchGroups(answer, labelMap)

  return (
    <div className="mt-2 space-y-3 text-sm leading-6 text-slate-800">
      <div>
        <p className="font-bold text-slate-950">Rational:</p>
        <p>- {groups.rational.join(', ') || 'None'}</p>
      </div>
      <div>
        <p className="font-bold text-slate-950">Irrational:</p>
        <p>- {groups.irrational.join(', ') || 'None'}</p>
      </div>
    </div>
  )
}

function formatIntegerTrialResultAnswer(question, answer) {
  const stages = question?.stages ?? []
  const rows = stages.flatMap((stage) =>
    (stage.prompts ?? []).map((prompt) => {
      const studentAnswer = answer?.stageAnswers?.[stage.id]?.[prompt.id]
      return `${prompt.question}: ${studentAnswer || prompt.answer}`
    })
  )

  return [...rows, 'Treasure Map obtained'].join('; ')
}

function getIntegerTrialResultRows(question, answer) {
  const stages = question?.stages ?? []

  return stages.flatMap((stage) =>
    (stage.prompts ?? []).map((prompt) => ({
      question: prompt.question,
      answer: answer?.stageAnswers?.[stage.id]?.[prompt.id] || prompt.answer,
    }))
  )
}

function IntegerTrialAnswerList({ question, answer }) {
  const rows = getIntegerTrialResultRows(question, answer)

  return (
    <div className="mt-2 space-y-3 text-sm leading-6 text-slate-800">
      {rows.map((row) => (
        <div key={row.question}>
          <p className="font-bold text-slate-950">{row.question}</p>
          <p>- {row.answer}</p>
        </div>
      ))}
      <p>Treasure Map obtained</p>
    </div>
  )
}

function formatRealNumberLineGroups(question) {
  const zones = question?.zones ?? []
  const items = question?.items ?? []

  return zones
    .map((zone) => {
      const zoneItems = items
        .filter((item) => item.validZones?.includes(zone.id))
        .map((item) => item.label)

      return `${zone.label}: ${zoneItems.join(', ') || 'None'}`
    })
    .join('; ')
}

function getSubsetLabel(question, zoneId) {
  const zone = question?.zones?.find((item) => item.id === zoneId)
  return (zone?.label ?? zoneId).replace(/\s*\([^)]*\)/g, '')
}

function getRealNumberLineRows(question) {
  return (question?.items ?? []).map((item) => {
    const subsets = (item.validZones ?? []).map((zoneId) => getSubsetLabel(question, zoneId))
    const suffix = item.id === 'rn-repeat' ? ' (repeating decimal)' : ''

    return {
      number: item.label,
      subsets: `${subsets.join(', ')}${suffix}`,
    }
  })
}

function RealNumberLineAnswerTable({ question }) {
  const rows = getRealNumberLineRows(question)

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="answer-key-table min-w-[34rem] text-left text-sm leading-6 text-slate-800">
        <thead>
          <tr className="text-slate-950">
            <th className="w-24 pb-3 pr-6 font-black">Number</th>
            <th className="pb-3 font-black">Correct Subsets</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.number}>
              <td className="py-1.5 pr-6 align-top">{row.number}</td>
              <td className="py-1.5 align-top">{row.subsets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getDisplayAnswer(answer, question) {
  if (answer.type === 'integer-trial') {
    return formatIntegerTrialResultAnswer(question, answer.studentAnswer)
  }

  if (answer.type === 'real-number-line') {
    return formatRealNumberLineGroups(question)
  }

  if (answer.type === 'memory-match') {
    return answer.studentAnswer?.classifications ?? answer.studentAnswer ?? {}
  }

  return answer.displayStudentAnswer ?? answer.studentAnswer
}

function getDisplayCorrectAnswer(answer, question) {
  if (answer.type === 'integer-trial') {
    return formatIntegerTrialResultAnswer(question, answer.studentAnswer)
  }

  if (answer.type === 'real-number-line') {
    return formatRealNumberLineGroups(question)
  }

  if (answer.type === 'memory-match') {
    return Object.fromEntries(
      (question?.pairs ?? []).map((pair) => [pair.id, pair.classification])
    )
  }

  return answer.displayCorrectAnswer ?? answer.correctAnswer
}

function ResultPage() {
  const { chapterId } = useParams()
  const location = useLocation()
  const user = getCurrentUser()
  if (!user) return <Navigate to="/login" replace />

  const activeClass = getOrSetActiveClass(user.id)
  const chapter = chapters.find((item) => item.id === chapterId)

  if (!chapter || !activeClass) return <Navigate to="/student/chapters" replace />

  const savedResult = getLatestResult(user.id, activeClass.classCode, chapter.id)
  const result = location.state?.previewResult ?? savedResult
  const nextChapter = chapters[chapters.findIndex((item) => item.id === chapter.id) + 1]
  const hasActivities = (chapter.activities ?? []).length > 0
  const isCompletionOnly = result?.total === 0 && !hasActivities
  const isAssessmentResult = Boolean(chapter.assessmentMode)

  if (!result) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">No result found</h1>
        <Link className="mt-5 inline-block rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to="/student/chapters">
          Back to timeline
        </Link>
      </section>
    )
  }

  function getAssessmentFeedback(percentage) {
    if (percentage >= 90) return 'Excellent work. You showed strong mastery of the Numberland journey.'
    if (percentage >= 75) return 'Good work. You understand the main ideas, with a few areas to review.'
    if (percentage >= 60) return 'You are making progress. Review the chapters again to strengthen your understanding.'
    return 'Keep practicing. Revisit the lessons and try again when you are ready.'
  }

  if (isAssessmentResult) {
    return (
      <section>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
            Final Assessment Result
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Your Score</h1>
          <p className="mt-4 text-4xl font-black text-slate-950">
            {result.score}/{result.total}
          </p>
          <p className="mt-2 text-xl font-black text-sky-800">{result.percentage}%</p>
          <p className="mt-4 max-w-2xl font-semibold text-slate-800">
            {getAssessmentFeedback(result.percentage)}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Submitted at {formatClockTime(result.completedAt)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Time taken: <span className="font-bold">{formatStopwatchTime(result.latestAttemptElapsedMs)}</span>
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/chapters">
            Back to timeline
          </Link>
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity`}>
            Retake assessment
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className={`rounded-xl border p-6 shadow-sm ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <h1 className="text-3xl font-black text-slate-950">
          {result.passed ? siteContent.result.passedTitle : siteContent.result.failedTitle}
        </h1>
        {isCompletionOnly ? (
          <p className="mt-2 text-slate-700">
            Chapter complete. No activity score was required for this summary chapter.
          </p>
        ) : (
          <p className="mt-2 text-slate-700">
            Percentage level: <span className="font-black">{result.percentage}%</span>
          </p>
        )}
        <p className="mt-2 text-slate-600">Completed at {formatClockTime(result.completedAt)}</p>
        <p className="mt-2 text-slate-600">
          Total chapter time: <span className="font-bold">{formatElapsedTime(result.totalElapsedMs)}</span>
        </p>
        <p className="mt-3 font-semibold text-slate-800">
          {result.passed ? siteContent.result.passedMessage : siteContent.result.failedMessage}
        </p>
        {result.previewMode ? (
          <p className="mt-3 text-sm font-semibold text-sky-700">
            Testing mode only. This retake does not overwrite the saved passed result.
          </p>
        ) : null}
      </div>

      {result.answers.length ? (
        <div className="mt-6">
          <h2 className="text-xl font-black text-slate-950">Answer Key</h2>
          <ol className="mt-4 space-y-5">
          {result.answers.map((answer, index) => {
            const answerQuestion = chapter.activities?.find((activity) => activity.id === answer.questionId)
            const labelMap = getAnswerLabelMap(answerQuestion)

            return (
              <li className="border-b border-slate-200 pb-4 last:border-b-0" key={answer.questionId}>
                <p className="font-black leading-7 text-slate-950">{index + 1}. {answer.question}</p>
                <div className="mt-2">
                  <p className="text-sm font-bold text-slate-600">Your answer:</p>
                  {answer.type === 'real-number-line' ? (
                    <RealNumberLineAnswerTable question={answerQuestion} />
                  ) : answer.type === 'integer-trial' ? (
                    <IntegerTrialAnswerList question={answerQuestion} answer={answer.studentAnswer} />
                  ) : answer.type === 'gatekeeper' ? (
                    <GatekeeperAnswerList answer={answer.studentAnswer} labelMap={labelMap} />
                  ) : answer.type === 'memory-match' ? (
                    <MemoryMatchAnswerList answer={answer.studentAnswer} labelMap={labelMap} />
                  ) : (
                    <AnswerList answer={getDisplayAnswer(answer, answerQuestion)} labelMap={labelMap} />
                  )}
                </div>
                {result.passed && !answer.correct ? (
                  <div className="mt-2">
                    <p className="text-sm font-bold text-slate-600">Correct answer:</p>
                    {answer.type === 'real-number-line' ? (
                      <RealNumberLineAnswerTable question={answerQuestion} />
                    ) : answer.type === 'integer-trial' ? (
                      <IntegerTrialAnswerList question={answerQuestion} answer={answer.studentAnswer} />
                    ) : answer.type === 'gatekeeper' ? (
                      <GatekeeperAnswerList answer={answer.correctAnswer} labelMap={labelMap} />
                    ) : answer.type === 'memory-match' ? (
                      <MemoryMatchAnswerList answer={getDisplayCorrectAnswer(answer, answerQuestion)} labelMap={labelMap} />
                    ) : (
                      <AnswerList answer={getDisplayCorrectAnswer(answer, answerQuestion)} labelMap={labelMap} />
                    )}
                  </div>
                ) : null}
                <p className={`mt-2 font-semibold ${answer.correct ? 'text-emerald-700' : 'text-red-700'}`}>
                  {answer.feedback}
                </p>
              </li>
            )
          })}
          </ol>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to="/student/chapters">
          Back to timeline
        </Link>
        {result.passed && nextChapter ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${nextChapter.id}`}>
            Next chapter
          </Link>
        ) : null}
        {result.passed ? (
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to={`/student/chapter/${chapter.id}?replay=1&restart=1`}>
            Replay chapter
          </Link>
        ) : null}
        {result.passed && hasActivities ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity?preview=1`}>
            Retake activity
          </Link>
        ) : null}
        {!result.passed ? (
          <Link className="rounded-lg bg-slate-950 px-5 py-3 font-bold text-white" to={`/student/chapter/${chapter.id}/activity`}>
            Retry activity
          </Link>
        ) : null}
        {!result.passed ? (
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700" to={`/student/chapter/${chapter.id}`}>
            Review chapter
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export default ResultPage
