export function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

export function calculateScore(questions, answers) {
  let score = 0

  questions.forEach((question) => {
    if (answers[question.id] === question.answer) {
      score++
    }
  })

  return score
}

export function getPercentage(score, total) {
  if (total === 0) return 0
  return Math.round((score / total) * 100)
}