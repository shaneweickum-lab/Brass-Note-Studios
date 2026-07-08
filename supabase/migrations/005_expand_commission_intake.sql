-- 005: Expand commission intake fields
-- Run in Supabase SQL Editor

ALTER TABLE commissions
  ADD COLUMN IF NOT EXISTS phone              VARCHAR(50),
  ADD COLUMN IF NOT EXISTS song_purpose       VARCHAR(300),
  ADD COLUMN IF NOT EXISTS song_recipients    VARCHAR(500),
  ADD COLUMN IF NOT EXISTS song_story         TEXT,
  ADD COLUMN IF NOT EXISTS style_preferences  VARCHAR(500),
  ADD COLUMN IF NOT EXISTS reference_songs    VARCHAR(500);
