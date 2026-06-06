import {
  createId,
  getActiveClassId,
  getClasses,
  getMemberships,
  getProgressRecords,
  getResults,
  getUsers,
  saveClasses,
  saveMemberships,
  saveProgressRecords,
  saveResults,
  saveUsers,
  setActiveClassId,
  stamp,
} from './storage'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { syncCurrentSessionData } from './supabaseSync'

export function getClassById(classId) {
  return getClasses().find((classroom) => classroom.id === classId) ?? null
}

export function findClassByCode(classCode) {
  const cleanCode = classCode.trim().toUpperCase()
  return getClasses().find((classroom) => classroom.classCode === cleanCode) ?? null
}

export function getTeacherClasses(teacherId) {
  return getClasses().filter((classroom) => classroom.teacherId === teacherId)
}

export function getStudentMemberships(studentId) {
  return getMemberships().filter((membership) => membership.studentId === studentId)
}

export function getJoinedClasses(studentId) {
  return getStudentMemberships(studentId)
    .map((membership) => getClassById(membership.classId))
    .filter(Boolean)
}

export function getOrSetActiveClass(studentId) {
  const joined = getJoinedClasses(studentId)
  if (!joined.length) return null

  const activeId = getActiveClassId(studentId)
  const activeClass = joined.find((classroom) => classroom.id === activeId)
  if (activeClass) return activeClass

  setActiveClassId(studentId, joined[0].id)
  return joined[0]
}

export function selectActiveClass(studentId, classId) {
  const canSelect = getStudentMemberships(studentId).some(
    (membership) => membership.classId === classId
  )
  if (!canSelect) return { error: 'You have not joined that class.' }
  setActiveClassId(studentId, classId)
  return { classroom: getClassById(classId) }
}

export async function joinClass(studentId, classCode) {
  if (!classCode.trim()) return { error: 'Enter a class code.' }

  const classroom = findClassByCode(classCode)
  if (!classroom) return { error: 'That class code does not exist.' }

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('class_memberships').insert({
      student_id: studentId,
      class_id: classroom.id,
      class_code: classroom.classCode,
      active: true,
    })

    if (error && !error.message.toLowerCase().includes('duplicate')) {
      return { error: error.message }
    }

    setActiveClassId(studentId, classroom.id)
    await syncCurrentSessionData()
    return {
      classroom,
      message: error ? 'You already joined this class. It is now selected.' : undefined,
    }
  }

  const duplicate = getMemberships().find(
    (membership) => membership.studentId === studentId && membership.classId === classroom.id
  )

  if (duplicate) {
    setActiveClassId(studentId, classroom.id)
    return { classroom, message: 'You already joined this class. It is now selected.' }
  }

  const membership = {
    id: createId('membership'),
    studentId,
    classId: classroom.id,
    classCode: classroom.classCode,
    joinedAt: stamp(),
    active: true,
  }

  saveMemberships([...getMemberships(), membership])
  setActiveClassId(studentId, classroom.id)
  return { classroom, membership }
}

export function generateUniqueClassCode(customCode = '') {
  const existing = new Set(getClasses().map((classroom) => classroom.classCode))
  if (customCode.trim()) {
    const clean = customCode.trim().toUpperCase()
    if (existing.has(clean)) return null
    return clean
  }

  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code
  do {
    code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  } while (existing.has(code))

  return code
}

export async function createClass({ teacherId, className, description, customCode }) {
  if (!className.trim()) return { error: 'Class name is required.' }

  const classCode = generateUniqueClassCode(customCode)
  if (!classCode) return { error: 'That class code already exists.' }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: teacherId,
        class_name: className.trim(),
        description: description.trim(),
        class_code: classCode,
        status: 'active',
      })
      .select()
      .single()

    if (error) return { error: error.message }

    await syncCurrentSessionData()
    return {
      classroom: {
        id: data.id,
        teacherId: data.teacher_id,
        className: data.class_name,
        description: data.description,
        classCode: data.class_code,
        createdAt: data.created_at,
        status: data.status,
      },
    }
  }

  const classroom = {
    id: createId('class'),
    teacherId,
    className: className.trim(),
    description: description.trim(),
    classCode,
    createdAt: stamp(),
    status: 'active',
  }

  saveClasses([classroom, ...getClasses()])
  return { classroom }
}

export async function deleteClass(classId) {
  const classroom = getClassById(classId)
  if (!classroom) return

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('classes').delete().eq('id', classId)
    if (error) throw error
    await syncCurrentSessionData()
    return
  }

  saveClasses(getClasses().filter((item) => item.id !== classId))
  saveMemberships(getMemberships().filter((item) => item.classId !== classId))
  saveProgressRecords(getProgressRecords().filter((item) => item.classId !== classId))
  saveResults(getResults().filter((item) => item.classId !== classId))
}

export async function deleteTeacher(teacherId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'disabled' })
      .eq('id', teacherId)
    if (error) throw error
    await syncCurrentSessionData()
    return
  }

  const classIds = getTeacherClasses(teacherId).map((classroom) => classroom.id)
  classIds.forEach((classId) => deleteClass(classId))
  saveUsers(getUsers().filter((user) => user.id !== teacherId))
}

export async function deleteStudent(studentId) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('profiles')
      .update({ status: 'disabled' })
      .eq('id', studentId)
    if (error) throw error
    await syncCurrentSessionData()
    return
  }

  saveUsers(getUsers().filter((user) => user.id !== studentId))
  saveMemberships(getMemberships().filter((membership) => membership.studentId !== studentId))
  saveProgressRecords(getProgressRecords().filter((item) => item.studentId !== studentId))
  saveResults(getResults().filter((item) => item.studentId !== studentId))
}

export function getClassStudents(classId) {
  const users = getUsers()
  return getMemberships()
    .filter((membership) => membership.classId === classId)
    .map((membership) => users.find((user) => user.id === membership.studentId))
    .filter(Boolean)
}
