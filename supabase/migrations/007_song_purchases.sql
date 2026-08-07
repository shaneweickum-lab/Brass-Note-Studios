-- Song purchases — one row per completed Stripe Checkout Session
CREATE TABLE IF NOT EXISTS song_purchases (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id text        UNIQUE NOT NULL,
  song_id           text        NOT NULL,
  customer_email    text,
  amount_total      integer,             -- cents
  currency          text        DEFAULT 'usd',
  download_file_key text        NOT NULL, -- Supabase Storage path
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS song_purchases_song_id_idx     ON song_purchases (song_id);
CREATE INDEX IF NOT EXISTS song_purchases_created_at_idx  ON song_purchases (created_at DESC);

-- Service-role-only; no public reads (download verification is server-side)
ALTER TABLE song_purchases ENABLE ROW LEVEL SECURITY;

-- No RLS policies: all access goes through service-role key in API routes
-- (anon/authenticated roles have no access by default when RLS is enabled)
