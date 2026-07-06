-- Push notification subscriptions (admin devices only, server-side access)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint   TEXT        UNIQUE NOT NULL,
  p256dh     TEXT        NOT NULL,
  auth       TEXT        NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Block all client-side access; server uses service role which bypasses RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
