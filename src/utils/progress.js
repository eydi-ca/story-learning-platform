import { chapters } from '../data/chapters'
import {
  STORAGE_KEYS,
  createId,
  getProgressRecords,
  getResults,
  readJson,
  saveProgressRecords,
  saveResults,
  stamp,
  writeJson,
} from './storage'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { syncCurrentSessionData } from './supabaseSync'

export function getProgressKey({ studentId, classCode, chapterId }) {
  return `${studentId}_${classCode}_${chapterId}`
}

export function formatElapsedTime(totalMs = 0) {
  const totalSeconds = Math.max(0, Math.round(totalMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

function readTimingMap() {
  return readJson(STORAGE_KEYS.chapterTiming, {})
}

function writeTimingMap(value) {
  writeJson(STORAGE_KEYS.chapterTiming, value)
}

function readAttemptSessions() {
  return readJson(STORAGE_KEYS.chapterAttemptSessions, {})
}

function writeAttemptSessions(value) {
  writeJson(STORAGE_KEYS.chapterAttemptSessions, value)
}

function withTimingMetadata(record) {
  if (!record) return null
  const timing = readTimingMap()[record.key] ?? {}
  return {
    ...record,
    totalElapsedMs: timing.totalElapsedMs ?? 0,
    latestAttemptElapsedMs: timing.latestAttemptElapsedMs ?? 0,
    passedSubmittedAt: timing.passedSubmittedAt ?? null,
  }
}

function updateTimingMetadata(progressKey, updates) {
  const timingMap = readTimingMap()
  writeTimingMap({
    ...timingMap,
    [progressKey]: {
      ...(timingMap[progressKey] ?? {}),
      ...updates,
    },
  })
}

export function startChapterAttempt({ studentId, classCode, chapterId }) {
  const key = getProgressKey({ studentId, classCode, chapterId })
  const sessions = readAttemptSessions()
  const activeSession = sessions[key]

  if (activeSession?.startedAt) {
    return activeSession
  }

  const nextSession = {
    startedAt: Date.now(),
  }

  writeAttemptSessions({
    ...sessions,
    [key]: nextSession,
  })

  return nextSession
}

export function clearChapterAttempt({ studentId, classCode, chapterId }) {
  const key = getProgressKey({ studentId, classCode, chapterId })
  const sessions = readAttemptSessions()
  if (!sessions[key]) return
  const { [key]: removed, ...rest } = sessions
  writeAttemptSessions(rest)
}

function finalizeChapterAttempt({ studentId, classCode, chapterId, completedAt, passed }) {
  const key = getProgressKey({ studentId, classCode, chapterId })
  const sessions = readAttemptSessions()
  const activeSession = sessions[key]
  const completedTime = new Date(completedAt).getTime()
  const elapsedMs = activeSession?.startedAt
    ? Math.max(0, completedTime - activeSession.startedAt)
    : 0

  const timingMap = readTimingMap()
  const currentTiming = timingMap[key] ?? {}
  const nextTiming = {
    totalElapsedMs: (currentTiming.totalElapsedMs ?? 0) + elapsedMs,
    latestAttemptElapsedMs: elapsedMs,
    passedSubmittedAt: passed
      ? currentTiming.passedSubmittedAt ?? completedAt
      : currentTiming.passedSubmittedAt ?? null,
  }

  writeTimingMap({
    ...timingMap,
    [key]: nextTiming,
  })

  const { [key]: removed, ...rest } = sessions
  writeAttemptSessions(rest)

  return nextTiming
}

export function getProgressForClass(studentId, classId) {
  return getProgressRecords()
    .filter((item) => item.studentId === studentId && item.classId === classId)
    .map(withTimingMetadata)
}

export function getChapterProgress(studentId, classCode, chapterId) {
  return withTimingMetadata(
    getProgressRecords().find(
      (item) =>
        item.studentId === studentId &&
        item.classCode === classCode &&
        item.chapterId === chapterId
    ) ?? null
  )
}

export function hasPassedChapter(studentId, classCode, chapterId) {
  return Boolean(getChapterProgress(studentId, classCode, chapterId)?.passed)
}

export function isChapterUnlocked(studentId, classCode, chapterId) {
  const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId)
  if (chapterIndex <= 0) return chapterIndex === 0
  return hasPassedChapter(studentId, classCode, chapters[chapterIndex - 1].id)
}

export function getChapterStatus(studentId, classCode, chapterId) {
  const progress = getChapterProgress(studentId, classCode, chapterId)
  if (progress?.passed) return 'Passed'
  if (progress && !progress.passed) return 'Retry'
  if (isChapterUnlocked(studentId, classCode, chapterId)) return 'Available'
  return 'Locked'
}

export async function saveActivityResult({
  studentId,
  classId,
  classCode,
  chapterId,
  score,
  total,
  answers,
}) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percentage >= 75
  const existing = getProgressRecords()
  const previous = getChapterProgress(studentId, classCode, chapterId)

  if (previous?.passed) {
    return {
      error: 'This chapter has already been passed and recorded. Retakes are only allowed after a failed attempt.',
      progress: previous,
    }
  }

  const completedAt = stamp()
  const progressItem = {
    id: previous?.id ?? createId('progress'),
    key: getProgressKey({ studentId, classCode, chapterId }),
    studentId,
    classId,
    classCode,
    chapterId,
    score,
    total,
    percentage,
    passed,
    answers,
    completedAt,
    attempts: (previous?.attempts ?? 0) + 1,
  }

  const timing = finalizeChapterAttempt({
    studentId,
    classCode,
    chapterId,
    completedAt,
    passed,
  })

  if (isSupabaseConfigured) {
    const { data: progressRow, error: progressError } = await supabase
      .from('chapter_progress')
      .upsert(
        {
          id: previous?.id,
          student_id: studentId,
          class_id: classId,
          class_code: classCode,
          chapter_id: chapterId,
          score,
          total,
          percentage,
          passed,
          answers,
          completed_at: progressItem.completedAt,
          attempts: progressItem.attempts,
        },
        { onConflict: 'student_id,class_id,chapter_id' }
      )
      .select()
      .single()

    if (progressError) throw progressError

    const { error: resultError } = await supabase.from('activity_results').insert({
      progress_id: progressRow.id,
      student_id: studentId,
      class_id: classId,
      class_code: classCode,
      chapter_id: chapterId,
      score,
      total,
      percentage,
      passed,
      answers,
      completed_at: progressItem.completedAt,
    })

    if (resultError) throw resultError

    await syncCurrentSessionData()

    return {
      progress: {
        ...progressItem,
        ...timing,
        id: progressRow.id,
      },
      result: {
        ...progressItem,
        ...timing,
        id: createId('result'),
      },
    }
  }

  saveProgressRecords([
    ...existing.filter((item) => item.id !== progressItem.id),
    progressItem,
  ])

  const result = {
    ...progressItem,
    ...timing,
    id: createId('result'),
  }
  saveResults([result, ...getResults()])

  return { progress: { ...progressItem, ...timing }, result }
}

export function getLatestResult(studentId, classCode, chapterId) {
  const result =
    getResults()
      .filter(
        (item) =>
          item.studentId === studentId &&
          item.classCode === classCode &&
          item.chapterId === chapterId
      )
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0] ?? null

  if (!result) return null

  const timing = readTimingMap()[getProgressKey({ studentId, classCode, chapterId })] ?? {}
  return {
    ...result,
    totalElapsedMs: timing.totalElapsedMs ?? result.totalElapsedMs ?? 0,
    latestAttemptElapsedMs: timing.latestAttemptElapsedMs ?? result.latestAttemptElapsedMs ?? 0,
    passedSubmittedAt: timing.passedSubmittedAt ?? result.passedSubmittedAt ?? null,
  }
}

export function getClassCompletionSummary(studentId, classId) {
  const progress = getProgressForClass(studentId, classId)
  const passed = progress.filter((item) => item.passed)
  const latest = [...progress].sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]

  return {
    progress,
    completedCount: passed.length,
    overallPercentage: Math.round((passed.length / chapters.length) * 100),
    averageScore: progress.length
      ? Math.round(progress.reduce((sum, item) => sum + item.percentage, 0) / progress.length)
      : 0,
    currentChapter: chapters[Math.min(passed.length, chapters.length - 1)]?.title ?? 'Complete',
    latest,
  }
}
