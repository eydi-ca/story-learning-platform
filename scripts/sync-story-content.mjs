import { createClient } from '@supabase/supabase-js'
import { chapters } from '../src/data/chapters.js'
import { loadLocalEnv } from './read-env.mjs'

loadLocalEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const chapterRows = chapters.map((chapter) => ({
  id: chapter.id,
  number: chapter.number,
  title: chapter.title,
  description: chapter.description,
  story: chapter.story,
  tutorial: chapter.tutorial,
  passing_score: 75,
}))

const questionRows = chapters.flatMap((chapter) =>
  chapter.activities.map((activity, index) => ({
    id: activity.id,
    chapter_id: chapter.id,
    position: index + 1,
    question: activity.question,
    choices: activity.choices,
    answer: activity.answer,
    feedback: activity.feedback,
  }))
)

const { error: chapterError } = await supabase
  .from('story_chapters')
  .upsert(chapterRows, { onConflict: 'id' })

if (chapterError) throw chapterError

const { error: questionError } = await supabase
  .from('chapter_questions')
  .upsert(questionRows, { onConflict: 'id' })

if (questionError) throw questionError

console.log(`Synced ${chapterRows.length} chapters and ${questionRows.length} questions.`)
