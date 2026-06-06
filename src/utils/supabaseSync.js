import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  clearAdminSession,
  clearCurrentSession,
  saveClasses,
  saveMemberships,
  saveProgressRecords,
  saveResults,
  saveUsers,
  setAdminSession,
  setCurrentSession,
} from './storage'

function toLocalUser(profile) {
  return {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    password: '',
    role: profile.role,
    status: profile.status ?? 'active',
    avatar: profile.avatar || 'rainbow_guardian',
    createdAt: profile.created_at,
  }
}

function toLocalClass(classroom) {
  return {
    id: classroom.id,
    teacherId: classroom.teacher_id,
    className: classroom.class_name,
    description: classroom.description ?? '',
    classCode: classroom.class_code,
    createdAt: classroom.created_at,
    status: classroom.status ?? 'active',
  }
}

function toLocalMembership(membership) {
  return {
    id: membership.id,
    studentId: membership.student_id,
    classId: membership.class_id,
    classCode: membership.class_code,
    joinedAt: membership.joined_at,
    active: membership.active,
  }
}

function toLocalProgress(progress) {
  return {
    id: progress.id,
    key: `${progress.student_id}_${progress.class_code}_${progress.chapter_id}`,
    studentId: progress.student_id,
    classId: progress.class_id,
    classCode: progress.class_code,
    chapterId: progress.chapter_id,
    score: progress.score,
    total: progress.total,
    percentage: progress.percentage,
    passed: progress.passed,
    answers: progress.answers ?? [],
    completedAt: progress.completed_at,
    attempts: progress.attempts ?? 1,
  }
}

function toLocalResult(result) {
  return {
    id: result.id,
    progressId: result.progress_id,
    studentId: result.student_id,
    classId: result.class_id,
    classCode: result.class_code,
    chapterId: result.chapter_id,
    score: result.score,
    total: result.total,
    percentage: result.percentage,
    passed: result.passed,
    answers: result.answers ?? [],
    completedAt: result.completed_at,
  }
}

async function fetchProfilesForIds(userIds) {
  if (!userIds.length) return []

  const { data, error } = await supabase.from('profiles').select('*').in('id', userIds)
  if (error) throw error
  return data ?? []
}

export async function syncCurrentSessionData() {
  if (!isSupabaseConfigured) {
    return { mode: 'local' }
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) throw sessionError

  if (!session?.user) {
    clearCurrentSession()
    clearAdminSession()
    return { mode: 'supabase', user: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (profileError) throw profileError

  const localUser = toLocalUser(profile)
  setCurrentSession({
    userId: localUser.id,
    role: localUser.role,
    createdAt: session.user.created_at ?? new Date().toISOString(),
  })

  if (localUser.role === 'admin') {
    setAdminSession({ name: localUser.fullName, createdAt: new Date().toISOString() })
  } else {
    clearAdminSession()
  }

  let users = [localUser]
  let classes = []
  let memberships = []
  let progress = []
  let results = []

  if (localUser.role === 'admin') {
    const [profilesRes, classesRes, membershipsRes, progressRes, resultsRes] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('status', 'active').order('created_at', { ascending: false }),
        supabase.from('classes').select('*').order('created_at', { ascending: false }),
        supabase.from('class_memberships').select('*').order('joined_at', { ascending: false }),
        supabase.from('chapter_progress').select('*').order('completed_at', { ascending: false }),
        supabase.from('activity_results').select('*').order('completed_at', { ascending: false }),
      ])

    if (profilesRes.error) throw profilesRes.error
    if (classesRes.error) throw classesRes.error
    if (membershipsRes.error) throw membershipsRes.error
    if (progressRes.error) throw progressRes.error
    if (resultsRes.error) throw resultsRes.error

    users = (profilesRes.data ?? []).map(toLocalUser)
    classes = (classesRes.data ?? []).map(toLocalClass)
    memberships = (membershipsRes.data ?? []).map(toLocalMembership)
    progress = (progressRes.data ?? []).map(toLocalProgress)
    results = (resultsRes.data ?? []).map(toLocalResult)
  } else if (localUser.role === 'teacher') {
    const { data: ownedClasses, error: classesError } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', localUser.id)
      .order('created_at', { ascending: false })

    if (classesError) throw classesError

    classes = (ownedClasses ?? []).map(toLocalClass)
    const classIds = classes.map((item) => item.id)

    if (classIds.length) {
      const [membershipsRes, progressRes, resultsRes] = await Promise.all([
        supabase.from('class_memberships').select('*').in('class_id', classIds),
        supabase.from('chapter_progress').select('*').in('class_id', classIds),
        supabase.from('activity_results').select('*').in('class_id', classIds),
      ])

      if (membershipsRes.error) throw membershipsRes.error
      if (progressRes.error) throw progressRes.error
      if (resultsRes.error) throw resultsRes.error

      memberships = (membershipsRes.data ?? []).map(toLocalMembership)
      progress = (progressRes.data ?? []).map(toLocalProgress)
      results = (resultsRes.data ?? []).map(toLocalResult)

      const studentIds = [...new Set(memberships.map((item) => item.studentId))]
      users = (await fetchProfilesForIds([localUser.id, ...studentIds]))
        .filter((profile) => profile.status !== 'disabled')
        .map(toLocalUser)
    }
  } else if (localUser.role === 'student') {
    const { data: ownMemberships, error: membershipsError } = await supabase
      .from('class_memberships')
      .select('*')
      .eq('student_id', localUser.id)
      .order('joined_at', { ascending: false })

    if (membershipsError) throw membershipsError

    memberships = (ownMemberships ?? []).map(toLocalMembership)
    const classIds = memberships.map((item) => item.classId)

    const [classesRes, progressRes, resultsRes] = await Promise.all([
      classIds.length
        ? supabase.from('classes').select('*').in('id', classIds)
        : Promise.resolve({ data: [], error: null }),
      supabase.from('chapter_progress').select('*').eq('student_id', localUser.id),
      supabase.from('activity_results').select('*').eq('student_id', localUser.id),
    ])

    if (classesRes.error) throw classesRes.error
    if (progressRes.error) throw progressRes.error
    if (resultsRes.error) throw resultsRes.error

    classes = (classesRes.data ?? []).map(toLocalClass)
    progress = (progressRes.data ?? []).map(toLocalProgress)
    results = (resultsRes.data ?? []).map(toLocalResult)
  }

  saveUsers(users)
  saveClasses(classes)
  saveMemberships(memberships)
  saveProgressRecords(progress)
  saveResults(results)

  return { mode: 'supabase', user: localUser }
}
