-- 006: Excel → Portal integration
-- studio_id on all tables (multi-tenancy prep)
-- Financial fields on commissions
-- Full production metadata on songs
-- New tables: labs_experiments, expenses, id_reference

-- ── 1. Multi-tenancy: studio_id on existing tables ───────────────────────────

ALTER TABLE clients     ADD COLUMN IF NOT EXISTS studio_id TEXT NOT NULL DEFAULT 'bns';
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS studio_id TEXT NOT NULL DEFAULT 'bns';
ALTER TABLE songs       ADD COLUMN IF NOT EXISTS studio_id TEXT NOT NULL DEFAULT 'bns';
ALTER TABLE messages    ADD COLUMN IF NOT EXISTS studio_id TEXT NOT NULL DEFAULT 'bns';

-- ── 2. Financial fields on commissions ───────────────────────────────────────

ALTER TABLE commissions
  ADD COLUMN IF NOT EXISTS total_payment     NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS date_purchased    DATE,
  ADD COLUMN IF NOT EXISTS date_completed    DATE,
  ADD COLUMN IF NOT EXISTS songwriter_buyout BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS royalty_split     TEXT    NOT NULL DEFAULT '80/20';

-- ── 3. Production metadata fields on songs ───────────────────────────────────

ALTER TABLE songs
  ADD COLUMN IF NOT EXISTS style            TEXT,
  ADD COLUMN IF NOT EXISTS genre_code       TEXT,
  ADD COLUMN IF NOT EXISTS lyric_code       TEXT,
  ADD COLUMN IF NOT EXISTS vocal_code       TEXT,
  ADD COLUMN IF NOT EXISTS song_display_id  TEXT,
  ADD COLUMN IF NOT EXISTS genre            TEXT,
  ADD COLUMN IF NOT EXISTS sub_genre        TEXT,
  ADD COLUMN IF NOT EXISTS vocal_type       TEXT,
  ADD COLUMN IF NOT EXISTS bpm              TEXT,
  ADD COLUMN IF NOT EXISTS time_sig         TEXT,
  ADD COLUMN IF NOT EXISTS mood             TEXT,
  ADD COLUMN IF NOT EXISTS tension_arc      TEXT,
  ADD COLUMN IF NOT EXISTS about_the_song   TEXT,
  ADD COLUMN IF NOT EXISTS instruments      TEXT,
  ADD COLUMN IF NOT EXISTS suno_version     TEXT,
  ADD COLUMN IF NOT EXISTS gen_number       INTEGER;

-- ── 4. labs_experiments table ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS labs_experiments (
  bnl_id               TEXT         PRIMARY KEY,
  studio_id            TEXT         NOT NULL DEFAULT 'bns',
  experiment_id        TEXT,
  experiment_name      TEXT,
  labs_global_number   INTEGER,
  display_number       TEXT,
  suno_version         TEXT,
  weirdness_pct        INTEGER      CHECK (weirdness_pct BETWEEN 0 AND 100),
  constraint_pct       INTEGER      CHECK (constraint_pct BETWEEN 0 AND 100),
  style_prompt         TEXT,
  lyric_prompt         TEXT,
  tier2_symbols_used   TEXT,
  tier3_applied        BOOLEAN      NOT NULL DEFAULT false,
  hypothesis           TEXT,
  expected_result      TEXT,
  actual_result        TEXT,
  result_code          TEXT         CHECK (result_code IN ('PASS','FAIL','PARTIAL','ANOMALY')),
  key_finding          TEXT,
  integration_status   TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_labs_studio   ON labs_experiments(studio_id);
CREATE INDEX IF NOT EXISTS idx_labs_exp_id   ON labs_experiments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_labs_result   ON labs_experiments(result_code);
CREATE INDEX IF NOT EXISTS idx_labs_created  ON labs_experiments(created_at DESC);

ALTER TABLE labs_experiments ENABLE ROW LEVEL SECURITY;

-- ── 5. expenses table ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS expenses (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id      TEXT         NOT NULL DEFAULT 'bns',
  expense_name   TEXT         NOT NULL,
  recurrence     TEXT         NOT NULL DEFAULT 'monthly'
                              CHECK (recurrence IN ('monthly','annual','one-time')),
  next_due_date  DATE,
  monthly_cost   NUMERIC(10,2),
  annual_cost    NUMERIC(10,2),
  category       TEXT,
  auto_renew     BOOLEAN      NOT NULL DEFAULT true,
  active         BOOLEAN      NOT NULL DEFAULT true,
  notes          TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_studio  ON expenses(studio_id);
CREATE INDEX IF NOT EXISTS idx_expenses_due     ON expenses(next_due_date);
CREATE INDEX IF NOT EXISTS idx_expenses_active  ON expenses(active);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- ── 6. id_reference (static config table, seeded once) ───────────────────────

CREATE TABLE IF NOT EXISTS id_reference (
  code        TEXT         PRIMARY KEY,
  studio_id   TEXT         NOT NULL DEFAULT 'bns',
  category    TEXT         NOT NULL,
  label       TEXT         NOT NULL,
  description TEXT,
  sort_order  INTEGER      NOT NULL DEFAULT 0
);

ALTER TABLE id_reference ENABLE ROW LEVEL SECURITY;

-- ── 7. Labs sequence counter ─────────────────────────────────────────────────

INSERT INTO client_counters (id, value)
VALUES ('labs_seq', 0)
ON CONFLICT (id) DO NOTHING;
