export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function prepareQuestions(questions) {
  return shuffle(questions).map((question) => ({
    ...question,
    type: question.type ?? 'multiple-choice',
    choices: question.choices ? shuffle(question.choices) : question.choices,
    rightItems: question.rightItems ? shuffle(question.rightItems) : question.rightItems,
  }))
}

function arraysMatchInOrder(left = [], right = []) {
  if (left.length !== right.length) return false
  return left.every((item, index) => item === right[index])
}

function arraysMatchAsSet(left = [], right = []) {
  if (left.length !== right.length) return false

  const sortedLeft = [...left].sort()
  const sortedRight = [...right].sort()
  return sortedLeft.every((item, index) => item === sortedRight[index])
}

function formatAnswer(answer) {
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }

  if (answer && typeof answer === 'object') {
    return Object.entries(answer)
      .map(([leftId, rightId]) => `${leftId} → ${rightId}`)
      .join('; ')
  }

  return answer
}

function objectMatches(left = {}, right = {}) {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) return false
  return leftKeys.every((key) => left[key] === right[key])
}

function formatMatchPairsAnswer(question, answer) {
  if (!answer || typeof answer !== 'object') return 'No answer'

  const leftLabelMap = Object.fromEntries(
    (question.leftItems ?? []).map((item) => [item.id, item.label])
  )
  const rightLabelMap = Object.fromEntries(
    (question.rightItems ?? []).map((item) => [item.id, item.label])
  )

  return Object.entries(answer)
    .map(([leftId, rightId]) => `${leftLabelMap[leftId] ?? leftId} → ${rightLabelMap[rightId] ?? rightId}`)
    .join('; ')
}

export function isQuestionAnswered(question, answer) {
  if (question.type === 'drag-order') {
    return Array.isArray(answer) && answer.length === question.answer.length
  }

  if (question.type === 'drag-group') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (question.type === 'match-pairs') {
    return Boolean(answer) && Object.keys(answer).length === (question.leftItems?.length ?? 0)
  }

  return typeof answer === 'string' && answer.length > 0
}

export function gradeQuestions(questions, selectedAnswers) {
  const answers = questions.map((question) => {
    const studentAnswer = selectedAnswers[question.id]
    const questionLabel = question.question || question.instruction
    const type = question.type ?? 'multiple-choice'
    const correct =
      type === 'drag-order'
        ? arraysMatchInOrder(studentAnswer, question.answer)
        : type === 'drag-group'
          ? arraysMatchAsSet(studentAnswer, question.answer)
          : type === 'match-pairs'
            ? objectMatches(studentAnswer, question.answer)
          : studentAnswer === question.answer

    const correctText =
      type === 'match-pairs'
        ? formatMatchPairsAnswer(question, question.answer)
        : formatAnswer(question.answer)
    const studentText =
      type === 'match-pairs'
        ? formatMatchPairsAnswer(question, studentAnswer)
        : formatAnswer(studentAnswer)

    return {
      questionId: question.id,
      question: questionLabel,
      choices: question.choices ?? question.items ?? question.rightItems ?? [],
      type,
      correctAnswer: question.answer,
      studentAnswer,
      correct,
      feedback: correct ? question.feedback : `Correct answer: ${correctText}. ${question.feedback}`,
      displayCorrectAnswer: correctText,
      displayStudentAnswer: studentText,
    }
  })

  return {
    score: answers.filter((answer) => answer.correct).length,
    total: answers.length,
    answers,
  }
}
