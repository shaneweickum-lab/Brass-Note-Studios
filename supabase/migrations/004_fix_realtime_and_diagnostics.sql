-- Migration 004: Ensure messages realtime is properly configured + add diagnostics helper
-- Safe to run even if migration 002 was already applied.

-- ── 1. Ensure messages table is in the realtime publication ───────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    RAISE NOTICE 'Added messages to supabase_realtime publication';
  ELSE
    RAISE NOTICE 'messages already in supabase_realtime publication — no change needed';
  END IF;
END
$$;

-- ── 2. Ensure REPLICA IDENTITY FULL for row-level filters in realtime ─────────
-- This is idempotent — safe to run multiple times.
ALTER TABLE messages REPLICA IDENTITY FULL;

-- ── 3. Diagnostics helper function (called by /api/admin/diagnostics) ─────────
CREATE OR REPLACE FUNCTION check_realtime_setup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN jsonb_build_object(
    'messages_in_publication', EXISTS(
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
    ),
    'messages_replica_identity', (
      SELECT CASE c.relreplident
        WHEN 'd' THEN 'default'
        WHEN 'f' THEN 'full'
        WHEN 'i' THEN 'index'
        WHEN 'n' THEN 'nothing'
      END
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = 'messages' AND n.nspname = 'public'
    ),
    'push_subscriptions_exists', EXISTS(
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'push_subscriptions'
    )
  );
END;
$$;

-- Grant execute to service_role and anon (diagnostics endpoint uses service role)
GRANT EXECUTE ON FUNCTION check_realtime_setup() TO service_role;
