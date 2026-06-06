import { chapters } from './chapters'

export const demoUsers = [
  {
    id: 'user_student_demo',
    fullName: 'Student Demo',
    email: 'student@demo.com',
    password: 'student123',
    role: 'student',
    avatar: 'forest_archer',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'user_teacher_demo',
    fullName: 'Teacher Demo',
    email: 'teacher@demo.com',
    password: 'teacher123',
    role: 'teacher',
    avatar: 'scholar_mage',
    createdAt: '2026-06-01T08:05:00.000Z',
  },
]

export const demoClasses = [
  {
    id: 'class_demo_1',
    teacherId: 'user_teacher_demo',
    className: 'Grade 4 - Section A',
    description: 'Demo Numberland class',
    classCode: 'CLASS123',
    createdAt: '2026-06-01T08:10:00.000Z',
    status: 'active',
  },
]

export const demoMemberships = [
  {
    id: 'membership_demo_1',
    studentId: 'user_student_demo',
    classId: 'class_demo_1',
    classCode: 'CLASS123',
    joinedAt: '2026-06-01T08:20:00.000Z',
    active: true,
  },
]

export const demoProgress = [
  {
    id: 'progress_demo_1',
    studentId: 'user_student_demo',
    classId: 'class_demo_1',
    classCode: 'CLASS123',
    chapterId: chapters[0]?.id ?? 'chapter-1',
    score: 5,
    total: 5,
    percentage: 100,
    passed: true,
    answers: [],
    completedAt: '2026-06-01T08:35:00.000Z',
    attempts: 1,
  },
]
