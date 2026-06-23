-- One row per (event, day). Atomic upsert increments count.
-- Keeps a per-day breakdown so you get both lifetime totals
-- (SUM over days) and time trends later, all in a tiny table.
CREATE TABLE IF NOT EXISTS clicks (
  event TEXT    NOT NULL,
  day   TEXT    NOT NULL,            -- 'YYYY-MM-DD' (UTC)
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event, day)
);

-- Fast "totals by event" aggregation.
CREATE INDEX IF NOT EXISTS idx_clicks_event ON clicks (event);
