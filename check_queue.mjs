import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function check() {
  console.log("--- voice_queue ---")
  const { data: q } = await supabase.from('voice_queue').select('*')
  console.log(q)
  console.log("--- leads ---")
  const { data: l } = await supabase.from('leads').select('id, user_phone, voice_status, voice_retry_count').order('created_at', { ascending: false }).limit(5)
  console.log(l)
  console.log("--- voice_calls ---")
  const { data: v } = await supabase.from('voice_calls').select('*').order('started_at', { ascending: false }).limit(5)
  console.log(v)
}
check()
