export const demoTeachers = [
  {
    id: 'teacher-rivera',
    name: 'Ms. Rivera',
    username: 'teacher1',
    password: 'teach123',
    advisory: 'Grade 4 Reading',
  },
  {
    id: 'teacher-santos',
    name: 'Mr. Santos',
    username: 'teacher2',
    password: 'teach456',
    advisory: 'Grade 5 Language Arts',
  },
]

export const demoClasses = [
  {
    id: 'class-rivera-a',
    teacherId: 'teacher-rivera',
    name: 'Rainbow Readers',
    section: 'Grade 4 - Section A',
    gradeLevel: 'Grade 4',
    code: 'CLASS123',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'class-santos-b',
    teacherId: 'teacher-santos',
    name: 'Story Explorers',
    section: 'Grade 5 - Section B',
    gradeLevel: 'Grade 5',
    code: 'QUEST456',
    createdAt: '2026-06-01T08:15:00.000Z',
  },
]

export const adminCredentials = {
  username: 'admin',
  password: 'admin123',
  name: 'Platform Admin',
}
