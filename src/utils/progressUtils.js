export function getResultMap(results) {
  return Object.fromEntries(results.map((result) => [result.chapterId, result]))
}

export function getTimelineChapters(chapters, results) {
  const resultMap = getResultMap(results)

  return chapters.map((chapter, index) => {
    const previousChapters = chapters.slice(0, index)
    const unlocked =
      index === 0 ||
      previousChapters.every((previous) => resultMap[previous.id]?.passed)
    const result = resultMap[chapter.id] ?? null
    const passed = Boolean(result?.passed)

    return {
      ...chapter,
      unlocked,
      passed,
      result,
      status: passed ? 'Passed' : unlocked ? 'Available' : 'Locked',
      needsRetry: unlocked && result && !passed,
    }
  })
}

export function getStudentSummary(chapters, results) {
  const timeline = getTimelineChapters(chapters, results)
  const passedCount = timeline.filter((chapter) => chapter.passed).length
  const completedCount = results.length
  const percentage = Math.round((passedCount / chapters.length) * 100)
  const currentChapter =
    timeline.find((chapter) => chapter.unlocked && !chapter.passed) ??
    timeline[timeline.length - 1]

  return {
    timeline,
    passedCount,
    completedCount,
    percentage,
    currentChapter,
  }
}

export function getAverageScore(records) {
  if (records.length === 0) return 0

  const total = records.reduce((sum, record) => sum + record.percentage, 0)
  return Math.round(total / records.length)
}

export function getPassFailCounts(records) {
  return records.reduce(
    (counts, record) => ({
      passed: counts.passed + (record.passed ? 1 : 0),
      failed: counts.failed + (record.passed ? 0 : 1),
    }),
    { passed: 0, failed: 0 }
  )
}

export function getRecentActivity(records, limit = 5) {
  return [...records]
    .sort(
      (first, second) =>
        new Date(second.completedAt).getTime() -
        new Date(first.completedAt).getTime()
    )
    .slice(0, limit)
}

export function getStudentCurrentChapterLabel(chapters, results) {
  const summary = getStudentSummary(chapters, results)

  if (!summary.currentChapter) {
    return 'No chapter available'
  }

  if (summary.passedCount === chapters.length) {
    return 'Story completed'
  }

  return summary.currentChapter.title
}
