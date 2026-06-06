export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function prepareQuestions(questions) {
  return shuffle(questions).map((question) => ({
    ...question,
    choices: shuffle(question.choices),
  }))
}

export function gradeQuestions(questions, selectedAnswers) {
  const answers = questions.map((question) => {
    const studentAnswer = selectedAnswers[question.id]
    const correct = studentAnswer === question.answer
    return {
      questionId: question.id,
      question: question.question,
      choices: question.choices,
      correctAnswer: question.answer,
      studentAnswer,
      correct,
      feedback: correct ? question.feedback : `Correct answer: ${question.answer}. ${question.feedback}`,
    }
  })

  return {
    score: answers.filter((answer) => answer.correct).length,
    total: answers.length,
    answers,
  }
}
