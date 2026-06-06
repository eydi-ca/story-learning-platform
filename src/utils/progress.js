import { chapters } from '../data/chapters'
import {
  createId,
  getProgressRecords,
  getResults,
  saveProgressRecords,
  saveResults,
  stamp,
} from './storage'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { syncCurrentSessionData } from './supabaseSync'

export function getProgressKey({ studentId, classCode, chapterId }) {
  return `${studentId}_${classCode}_${chapterId}`
}

export function getProgressForClass(studentId, classId) {
  return getProgressRecords().filter(
    (item) => item.studentId === studentId && item.classId === classId
  )
}

export function getChapterProgress(studentId, classCode, chapterId) {
  return (
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

export async function saveActivityResult({ studentId, classId, classCode, chapterId, score, total, answers }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const passed = percentage >= 75
  const existing = getProgressRecords()
  const previous = getChapterProgress(studentId, classCode, chapterId)
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
    completedAt: stamp(),
    attempts: (previous?.attempts ?? 0) + 1,
  }

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
      progress: { ...progressItem, id: progressRow.id },
      result: { ...progressItem, id: createId('result') },
    }
  }

  saveProgressRecords([
    ...existing.filter((item) => item.id !== progressItem.id),
    progressItem,
  ])

  const result = {
    ...progressItem,
    id: createId('result'),
  }
  saveResults([result, ...getResults()])

  return { progress: progressItem, result }
}

export function getLatestResult(studentId, classCode, chapterId) {
  return (
    getResults()
      .filter(
        (item) =>
          item.studentId === studentId &&
          item.classCode === classCode &&
          item.chapterId === chapterId
      )
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0] ?? null
  )
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
