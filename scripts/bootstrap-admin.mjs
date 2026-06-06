import { createClient } from '@supabase/supabase-js'
import { loadLocalEnv } from './read-env.mjs'

loadLocalEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL || 'admin@numberlandquest.local'
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD || 'admin123'
const adminName = process.env.SUPABASE_ADMIN_NAME || 'Platform Admin'
const adminAvatar = process.env.SUPABASE_ADMIN_AVATAR || 'rainbow_guardian'

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
if (listError) throw listError

const existingUser = usersData.users.find((user) => user.email === adminEmail)

let userId = existingUser?.id

if (!existingUser) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      full_name: adminName,
      avatar: adminAvatar,
      role: 'admin',
    },
  })

  if (error) throw error
  userId = data.user.id
}

const { error: profileError } = await supabase.from('profiles').upsert({
  id: userId,
  full_name: adminName,
  email: adminEmail,
  role: 'admin',
  avatar: adminAvatar,
})

if (profileError) throw profileError

console.log(`Admin account ready: ${adminEmail}`)
