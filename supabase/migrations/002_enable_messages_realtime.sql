-- Enable realtime for the messages table.
-- Without this, Supabase Realtime will not deliver INSERT events to subscribers.

ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Ensure full row data is included in change events so row-level filters work.
ALTER TABLE messages REPLICA IDENTITY FULL;
