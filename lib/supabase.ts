import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uuklhwfdcmlmougavfdl.supabase.co"!
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1a2xod2ZkY21sbW91Z2F2ZmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODQ0MzcsImV4cCI6MjA4NTc2MDQzN30.MFLqcG4vKva_kUByRlVEWGPo6rxWwYV8CzNPzIFfa4w"!

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
