import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chapters } from '../data/chapters'
import { getStudent, saveProgress } from '../utils/storage'
import { calculateScore, getPercentage, shuffleArray } from '../utils/quizUtils'
import DialogueBox from '../components/DialogueBox'
import AudioPlayer from '../components/AudioPlayer'
import QuizCard from '../components/QuizCard'

function ChapterPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = getStudent()

  const chapter = chapters.find((item) => item.id === id)

  const [step, setStep] = useState('story')
  const [answers, setAnswers] = useState({})

  const randomizedQuestions = useMemo(() => {
    if (!chapter) return []
    return shuffleArray(chapter.activities)
  }, [chapter])

  if (!student) {
    navigate('/student/start')
    return null
  }

  if (!chapter) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Chapter not found.</p>
      </main>
    )
  }

  function handleAnswer(questionId, answer) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  function handleSubmitQuiz() {
    const score = calculateScore(randomizedQuestions, answers)
    const percentage = getPercentage(score, randomizedQuestions.length)
    const passed = score >= chapter.passingScore

    const result = {
      studentId: student.id,
      studentName: student.name,
      classCode: student.classCode,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      score,
      total: randomizedQuestions.length,
      percentage,
      passed,
      answers,
      completedAt: new Date().toISOString(),
      timeSpent: 'Demo only',
    }

    saveProgress(result)
    navigate(`/student/result/${chapter.id}`)
  }

  const allAnswered = randomizedQuestions.every((q) => answers[q.id])

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/student/chapters')}
          className="mb-6 text-indigo-700 font-semibold"
        >
          ← Back to chapters
        </button>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold text-slate-900">{chapter.title}</h1>
          <p className="mt-2 text-slate-600">{chapter.description}</p>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow">
          {step === 'story' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Story Narration</h2>
              <p className="text-lg leading-relaxed text-slate-700">
                {chapter.story.narration}
              </p>

              <div className="mt-5">
                <AudioPlayer src={chapter.story.audioSrc} />
              </div>

              <button
                onClick={() => setStep('dialogue')}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
              >
                Continue to Dialogue
              </button>
            </div>
          )}

          {step === 'dialogue' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">RPG Dialogue</h2>

              <div className="grid gap-4">
                {chapter.dialogues.map((dialogue, index) => (
                  <DialogueBox
                    key={index}
                    speaker={dialogue.speaker}
                    text={dialogue.text}
                  />
                ))}
              </div>

              <button
                onClick={() => setStep('tutorial')}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
              >
                Continue to Tutorial
              </button>
            </div>
          )}

          {step === 'tutorial' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {chapter.tutorial.title}
              </h2>

              <p className="text-lg leading-relaxed text-slate-700">
                {chapter.tutorial.content}
              </p>

              <button
                onClick={() => setStep('activity')}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-white font-semibold"
              >
                Start Activity
              </button>
            </div>
          )}

          {step === 'activity' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Activity</h2>

              <div className="grid gap-5">
                {randomizedQuestions.map((question) => (
                  <QuizCard
                    key={question.id}
                    question={question}
                    selectedAnswer={answers[question.id]}
                    onAnswer={handleAnswer}
                  />
                ))}
              </div>

              <button
                disabled={!allAnswered}
                onClick={handleSubmitQuiz}
                className={`mt-6 rounded-xl px-5 py-3 text-white font-semibold ${
                  allAnswered
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Activity
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default ChapterPage