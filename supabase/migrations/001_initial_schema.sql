-- =============================================================================
-- Brass Note Studios — Initial Schema
-- Run this in the Supabase SQL editor (dashboard.supabase.com → SQL Editor)
-- =============================================================================

-- ── 1. Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS clients (
  permanent_id   TEXT        PRIMARY KEY,              -- BNS{MMDDYY}C{NNNN}
  client_name    TEXT        NOT NULL,
  email          TEXT        NOT NULL UNIQUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Atomic sequential counters — used by the increment_counter() RPC function.
-- Two rows are seeded: 'client_seq' and 'song_seq'.
CREATE TABLE IF NOT EXISTS client_counters (
  id    TEXT    PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT INTO client_counters (id, value)
VALUES ('client_seq', 0), ('song_seq', 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS commissions (
  full_commission_id TEXT        PRIMARY KEY,  -- BNS011526C0001-101-0001
  permanent_id       TEXT        NOT NULL REFERENCES clients(permanent_id),
  client_name        TEXT        NOT NULL,
  email              TEXT        NOT NULL,
  client_type        TEXT        NOT NULL CHECK (client_type IN ('individual', 'organization', 'content-creator')),
  package_type       TEXT        NOT NULL CHECK (package_type IN ('single', 'ep', 'lp', 'album', 'organization')),
  total_songs        INTEGER     NOT NULL CHECK (total_songs > 0),
  current_stage      TEXT        NOT NULL DEFAULT 'intake'
                                CHECK (current_stage IN ('intake', 'writing', 'production', 'review', 'revision', 'delivered')),
  notes              TEXT        NOT NULL DEFAULT '',
  projected_delivery DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_permanent_id ON commissions(permanent_id);
CREATE INDEX IF NOT EXISTS idx_commissions_updated_at   ON commissions(updated_at DESC);

CREATE TABLE IF NOT EXISTS songs (
  song_id             TEXT        NOT NULL,  -- 4-digit padded global seq, e.g. '0001'
  commission_id       TEXT        NOT NULL REFERENCES commissions(full_commission_id) ON DELETE CASCADE,
  title               TEXT        NOT NULL DEFAULT '',
  track_number        INTEGER     NOT NULL,
  production_stage    TEXT        NOT NULL DEFAULT 'intake'
                                  CHECK (production_stage IN ('intake', 'writing', 'production', 'review', 'revision', 'delivered')),
  revisions_total     INTEGER     NOT NULL DEFAULT 3,
  revisions_used      INTEGER     NOT NULL DEFAULT 0,
  revisions_remaining INTEGER     NOT NULL DEFAULT 3,
  lyrics_ready        BOOLEAN     NOT NULL DEFAULT false,
  lyrics              TEXT,
  notes               TEXT        NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (commission_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_songs_commission_id ON songs(commission_id);

CREATE TABLE IF NOT EXISTS messages (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  permanent_id TEXT        NOT NULL REFERENCES clients(permanent_id),
  sender       TEXT        NOT NULL CHECK (sender IN ('client', 'admin')),
  body         TEXT        NOT NULL,
  is_read      BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_permanent_id ON messages(permanent_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read      ON messages(is_read) WHERE is_read = false;

-- ── 2. Atomic counter RPC ─────────────────────────────────────────────────────
-- Called as: supabase.rpc('increment_counter', { counter_name: 'song_seq', amount: 3 })
-- Returns the NEW value after incrementing.

CREATE OR REPLACE FUNCTION increment_counter(counter_name TEXT, amount INTEGER DEFAULT 1)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_value INTEGER;
BEGIN
  UPDATE client_counters
  SET value = value + amount
  WHERE id = counter_name
  RETURNING value INTO new_value;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Counter "%" not found', counter_name;
  END IF;

  RETURN new_value;
END;
$$;

-- ── 3. Row Level Security ─────────────────────────────────────────────────────
-- The service role key (used server-side only) bypasses RLS automatically.
-- The anon key (used in the browser) is restricted to the policies below.

ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_counters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages         ENABLE ROW LEVEL SECURITY;

-- clients, client_counters, commissions, songs: no anon access
-- (service role bypasses RLS — all server-side ops use the service role key)

-- messages: anon can subscribe to new messages (real-time) and send as 'client'
CREATE POLICY "anon_select_messages"
  ON messages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "anon_insert_client_messages"
  ON messages FOR INSERT
  TO anon
  WITH CHECK (sender = 'client');

-- ── 4. Realtime ───────────────────────────────────────────────────────────────
-- Enable Postgres logical replication for the messages table so the
-- Supabase real-time server broadcasts new rows to subscribed browser clients.
-- Run this after the table is created:
--
--   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
--
-- (This must be run separately — Supabase's default publication is managed
--  through the dashboard: Table Editor → messages → Enable Realtime, OR
--  via the CLI: supabase db push after adding the table to realtime.toml)
