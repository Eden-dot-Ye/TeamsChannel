-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6264A7',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table for AI-powered categorization
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6264A7',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_channel_id ON messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_channels_position ON channels(position);

-- Insert sample channels
INSERT INTO channels (name, description, icon, color, position) VALUES
  ('常规', 'General team discussions and announcements', '💬', '#6264A7', 0),
  ('项目更新', 'Project updates and coordination', '📋', '#00B294', 1),
  ('已共享', 'Shared resources and documents', '📁', '#8764B8', 2),
  ('Polly', 'Polls and team feedback', '📊', '#E3008C', 3),
  ('Core Team Roadmap+', 'Long-term planning and strategy', '🗺️', '#F59B00', 4),
  ('Development+CORE Team', 'Development discussions', '💻', '#0078D4', 5);

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
  ('announcement', 'Important team announcements', '#E3008C'),
  ('question', 'Questions requiring responses', '#8764B8'),
  ('discussion', 'General discussions and conversations', '#6264A7'),
  ('update', 'Status updates and progress reports', '#00B294'),
  ('decision', 'Decisions made by the team', '#F59B00'),
  ('issue', 'Problems or issues to be resolved', '#C4314B');

-- Insert sample messages
INSERT INTO messages (channel_id, author_name, author_avatar, content, category) 
SELECT 
  c.id,
  'Timothy Stiles',
  'TS',
  'Should hitting escape immediately after opening a new window always close it? For example, if I open a gag doc on an incident dad hit esc. Windows warning chimes at me. I expected the eDoc viewer to close. If you agree this makes sense, should I make WIs for any time I encounter such a case?',
  'question'
FROM channels c WHERE c.name = '常规' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content, category) 
SELECT 
  c.id,
  'Mykola Kovalchuk',
  'MK',
  'From UX point of view, though I don''t know if we will have UX team... Esc probably will work if dialog button with result Cancel is bound/configured',
  'discussion'
FROM channels c WHERE c.name = '常规' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content, category) 
SELECT 
  c.id,
  'Mykola Kovalchuk',
  'MK',
  'anyway, we (mostly Craig) are currently working on team goals for remaining half of financial year 2026, new WI or not would depend if this any of current goals',
  'update'
FROM channels c WHERE c.name = '常规' LIMIT 1;

INSERT INTO messages (channel_id, author_name, author_avatar, content, category) 
SELECT 
  c.id,
  'Craig Sturtivant',
  'CS',
  'I can maybe share info on that next week. I am still trying to put that all together',
  'update'
FROM channels c WHERE c.name = '常规' LIMIT 1;
