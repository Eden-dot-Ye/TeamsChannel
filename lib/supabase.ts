import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Channel = {
  id: string
  name: string
  description: string | null
  icon?: string | null
  color?: string | null
  position?: number
  created_at: string
}

export type Message = {
  id: string
  channel_id: string
  author_name: string
  author_avatar?: string | null
  content: string
  category?: string | null
  created_at: string
}

export type Category = {
  id: string
  name: string
  description?: string | null
  color: string
}
