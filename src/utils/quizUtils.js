export function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

export function prepareQuestions(questions) {
  return shuffle(questions).map((question) => ({
    ...question,
    type: question.type ?? 'multiple-choice',
    choices:
      question.type === 'counting-lock' || question.type === 'gatekeeper' || !question.choices
        ? question.choices
        : shuffle(question.choices),
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
      .map(([leftId, rightId]) => `${leftId} -> ${rightId}`)
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

function buildCountingLockAnswerMap(question) {
  return Object.fromEntries(
    (question.rounds ?? []).flatMap((round) =>
      (round.slots ?? []).map((slot) => [slot.id, slot.answer])
    )
  )
}

function buildGatekeeperAnswerMap(question) {
  return Object.fromEntries(
    (question.cards ?? []).map((card) => [card.id, card.correctAction])
  )
}

function buildMemoryMatchAnswerMap(question) {
  return Object.fromEntries(
    (question.pairs ?? []).map((pair) => [pair.id, pair.classification])
  )
}

function buildRealNumberLineAnswerMap(question) {
  return {
    part1: Object.fromEntries((question.items ?? []).map((item) => [item.id, item.validZones ?? []])),
    part2: Object.fromEntries((question.slots ?? []).map((slot) => [slot.accepts, slot.id])),
  }
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
    .map(([leftId, rightId]) => `${leftLabelMap[leftId] ?? leftId} -> ${rightLabelMap[rightId] ?? rightId}`)
    .join('; ')
}

function buildIncorrectFeedback(question) {
  if (question.incorrectFeedback) {
    return question.incorrectFeedback
  }

  switch (question.type) {
    case 'drag-order':
      return 'That order is not correct yet. Review the sequence from the lesson and try again.'
    case 'drag-group':
      return 'Some selected items do not belong in this group, or some correct items are still missing.'
    case 'match-pairs':
      return 'Some of the matches are incorrect. Review the lesson pairings and try again.'
    case 'gatekeeper':
      return 'A wrong decision was made at the gate. Review whole numbers and try the full gate again.'
    case 'tile-puzzle':
      return 'The map is not complete yet. Rebuild the image correctly before continuing.'
    case 'integer-trial':
      return 'The integer trial is not complete yet. Finish the quiz and solve the map to continue.'
    case 'memory-match':
      return 'Not all pairs are matched and classified yet. Keep matching and classifying the numbers.'
    case 'real-number-line':
      return 'The real number challenge is not complete yet. Finish both the subset sorting and the number line plotting.'
    default:
      return 'That choice does not match the lesson details. Review the chapter and try again.'
  }
}

export function isQuestionAnswered(question, answer) {
  if (question.type === 'real-number-line') {
    return Boolean(answer?.part1?.completed && answer?.part2?.completed)
  }

  if (question.type === 'memory-match') {
    const expected = buildMemoryMatchAnswerMap(question)
    const solvedPairIds = answer?.solvedPairIds ?? []
    const classifications = answer?.classifications ?? {}

    return (
      solvedPairIds.length === Object.keys(expected).length &&
      objectMatches(classifications, expected)
    )
  }

  if (question.type === 'integer-trial') {
    const stageCount = Array.isArray(question.stages)
      ? question.stages.length
      : Math.ceil((question.prompts?.length ?? 0) / 2)
    return Boolean(
      (answer?.obtainedItems?.length ?? 0) >= stageCount &&
        answer?.puzzle?.solved &&
        answer?.completionAcknowledged
    )
  }

  if (question.type === 'tile-puzzle') {
    return Array.isArray(answer?.order) && arraysMatchInOrder(answer.order, question.answer)
  }

  if (question.type === 'drag-order') {
    return Array.isArray(answer) && answer.length === question.answer.length
  }

  if (question.type === 'drag-group') {
    return Array.isArray(answer) && answer.length > 0
  }

  if (question.type === 'match-pairs') {
    return Boolean(answer) && Object.keys(answer).length === (question.leftItems?.length ?? 0)
  }

  if (question.type === 'counting-lock') {
    const expected = buildCountingLockAnswerMap(question)
    return objectMatches(answer ?? {}, expected)
  }

  if (question.type === 'gatekeeper') {
    const expected = buildGatekeeperAnswerMap(question)
    return objectMatches(answer?.responses ?? {}, expected)
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
        : type === 'tile-puzzle'
          ? arraysMatchInOrder(studentAnswer?.order ?? [], question.answer)
        : type === 'real-number-line'
          ? Boolean(studentAnswer?.part1?.completed && studentAnswer?.part2?.completed)
        : type === 'memory-match'
          ? (() => {
              const expected = buildMemoryMatchAnswerMap(question)
              return (
                (studentAnswer?.solvedPairIds ?? []).length === Object.keys(expected).length &&
                objectMatches(studentAnswer?.classifications ?? {}, expected)
              )
            })()
        : type === 'integer-trial'
          ? (() => {
              const stageCount = Array.isArray(question.stages)
                ? question.stages.length
                : Math.ceil((question.prompts?.length ?? 0) / 2)
              return Boolean(
                (studentAnswer?.obtainedItems?.length ?? 0) >= stageCount &&
                  studentAnswer?.puzzle?.solved &&
                  studentAnswer?.completionAcknowledged
              )
            })()
        : type === 'counting-lock'
          ? objectMatches(studentAnswer ?? {}, buildCountingLockAnswerMap(question))
        : type === 'gatekeeper'
          ? objectMatches(studentAnswer?.responses ?? {}, buildGatekeeperAnswerMap(question))
        : type === 'drag-group'
          ? arraysMatchAsSet(studentAnswer, question.answer)
          : type === 'match-pairs'
            ? objectMatches(studentAnswer, question.answer)
          : studentAnswer === question.answer

    const correctText =
      type === 'counting-lock'
        ? formatAnswer(buildCountingLockAnswerMap(question))
        : type === 'tile-puzzle'
        ? 'Puzzle image restored'
        : type === 'real-number-line'
        ? 'All numbers sorted and plotted correctly'
        : type === 'memory-match'
        ? formatAnswer(buildMemoryMatchAnswerMap(question))
        : type === 'integer-trial'
        ? 'All sacred items obtained and final puzzle solved'
        : type === 'gatekeeper'
        ? formatAnswer(buildGatekeeperAnswerMap(question))
        : type === 'match-pairs'
        ? formatMatchPairsAnswer(question, question.answer)
        : formatAnswer(question.answer)
    const studentText =
      type === 'counting-lock'
        ? formatAnswer(studentAnswer)
        : type === 'tile-puzzle'
        ? `Tile order: ${(studentAnswer?.order ?? []).join(', ')}`
        : type === 'real-number-line'
        ? `Part 1 complete: ${studentAnswer?.part1?.completed ? 'Yes' : 'No'}; Part 2 complete: ${studentAnswer?.part2?.completed ? 'Yes' : 'No'}`
        : type === 'memory-match'
        ? formatAnswer(studentAnswer?.classifications ?? {})
        : type === 'integer-trial'
        ? `Items obtained: ${(studentAnswer?.obtainedItems ?? []).join(', ') || 'None'}; Puzzle: ${studentAnswer?.puzzle?.rows ?? '-'}x${studentAnswer?.puzzle?.columns ?? '-'}; Solved: ${studentAnswer?.puzzle?.solved ? 'Yes' : 'No'}; Proceeded: ${studentAnswer?.completionAcknowledged ? 'Yes' : 'No'}`
        : type === 'gatekeeper'
        ? formatAnswer(studentAnswer?.responses)
        : type === 'match-pairs'
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
      feedback: correct ? question.feedback : buildIncorrectFeedback(question),
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
