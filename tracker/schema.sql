-- One row per (event, day). Atomic upsert increments count.
-- 'event' is a compact wire id (w8, p3, d1, e8) or the literal 'reset'.
-- Keeps a per-day breakdown so you get both lifetime totals (SUM over days)
-- and time windows / trends, all in a tiny table.
CREATE TABLE IF NOT EXISTS clicks (
  event TEXT    NOT NULL,
  day   TEXT    NOT NULL,            -- 'YYYY-MM-DD' (UTC)
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event, day)
);

-- Fast "totals by event" aggregation, and day-range window scans.
CREATE INDEX IF NOT EXISTS idx_clicks_event ON clicks (event);
CREATE INDEX IF NOT EXISTS idx_clicks_day   ON clicks (day);

-- Raw, append-only event log. Every event is an independent, identity-free
-- snapshot of "what happened": no session, no cookie, no fingerprint, no names.
-- 'ctx' holds the wire ids that were active at the moment (weapons + passives +
-- dlcs). This is the substrate for every "builds" / loadout / co-occurrence
-- view, computed by aggregating snapshots, never by tracking a user.
CREATE TABLE IF NOT EXISTS events (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  ts     INTEGER NOT NULL,          -- server receive time, epoch ms
  action TEXT    NOT NULL,          -- 'on' | 'off' | 'reset' | 'evo'
  item   TEXT,                      -- wire id (w8, p3, e8); null for 'reset'
  ctx    TEXT                       -- JSON array of active wire ids
);
CREATE INDEX IF NOT EXISTS idx_events_ts   ON events (ts);
CREATE INDEX IF NOT EXISTS idx_events_item ON events (item);
