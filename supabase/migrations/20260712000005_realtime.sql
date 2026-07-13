-- 20260712000005_realtime.sql
-- Enable Realtime so notifications.subscribe() receives live INSERTs.
-- RLS still applies to realtime, so users only receive their own rows.
alter publication supabase_realtime add table notifications;
