/**
 * vsevochart-tracker
 *
 * A tiny, standalone, identity-free event counter + snapshot log. No framework.
 *
 *   POST /track   { a, i?, c? }
 *       a = action: 'on' | 'off' | 'reset' | 'evo'
 *       i = subject wire id (w8, p3, d1, e8); omitted for 'reset'
 *       c = wire ids active at event time ("what else was on")
 *       -> clicks.count += 1   (atomic daily aggregate; key = i, or 'reset')
 *       -> events insert        (raw snapshot: action, item, ctx)
 *
 *   GET  /stats   (bearer token)
 *       -> per-event windowed totals (today / last 7d / prior 7d / all-time)
 *
 * No session, no cookie, no fingerprint, no names: each event is independent
 * and anonymous. Beacons send a text/plain body (CORS-"simple", no preflight).
 * /stats is read server-side from the Next app, gated behind a secret token.
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  STATS_TOKEN?: string;
}

// Wire ids: category prefix (w/p/d/e) + a small integer. Anything else is
// rejected so a hostile client can't explode the keyspace.
const ID_RE = /^[wpde][0-9]{1,6}$/;
const ACTIONS = new Set(["on", "off", "reset", "evo"]);
// Actions that carry a subject item.
const ITEM_ACTIONS = new Set(["on", "off", "evo"]);
// Bound the per-event context fan-out (and payload size).
const MAX_ACTIVE = 60;

const dayStr = (d: Date): string => d.toISOString().slice(0, 10);
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return dayStr(d);
}

const json = (data: unknown, status = 200, headers: HeadersInit = {}): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

function corsFor(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const ok = allowed.includes("*") || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : "null",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, authorization",
    "Access-Control-Max-Age": "86400",
  };
}

type TrackBody = {
  a?: unknown;
  i?: unknown;
  c?: unknown;
};

async function handleTrack(
  req: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  let body: TrackBody;
  try {
    body = JSON.parse(await req.text());
  } catch {
    return json({ ok: false, error: "bad json" }, 400, cors);
  }

  const action = typeof body.a === "string" && ACTIONS.has(body.a) ? body.a : null;
  if (!action) return json({ ok: false, error: "bad action" }, 400, cors);

  const item = typeof body.i === "string" && ID_RE.test(body.i) ? body.i : null;
  if (ITEM_ACTIONS.has(action) && !item) {
    return json({ ok: false, error: "bad item" }, 400, cors);
  }

  // Sanitize the active-set snapshot: valid wire ids only, drop the subject,
  // dedupe, cap the count.
  const rawCtx = Array.isArray(body.c) ? body.c : [];
  const ctx = [
    ...new Set(
      rawCtx.filter((k): k is string => typeof k === "string" && ID_RE.test(k) && k !== item)
    ),
  ].slice(0, MAX_ACTIVE);

  const day = daysAgo(0);
  const now = Date.now();
  const clickKey = action === "reset" ? "reset" : item!;
  const ctxJson = ctx.length ? JSON.stringify(ctx) : null;

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO clicks (event, day, count) VALUES (?, ?, 1)
       ON CONFLICT(event, day) DO UPDATE SET count = count + 1`
    ).bind(clickKey, day),
    env.DB.prepare(`INSERT INTO events (ts, action, item, ctx) VALUES (?, ?, ?, ?)`).bind(
      now,
      action,
      item,
      ctxJson
    ),
  ]);

  return json({ ok: true }, 200, cors);
}

async function handleStats(
  req: Request,
  env: Env,
  cors: Record<string, string>
): Promise<Response> {
  const auth = req.headers.get("Authorization") ?? "";
  if (!env.STATS_TOKEN || auth !== `Bearer ${env.STATS_TOKEN}`) {
    return json({ ok: false, error: "unauthorized" }, 401, cors);
  }

  const today = daysAgo(0);
  const d7 = daysAgo(6); // last 7 days: day >= d7 (incl. today)
  const d14 = daysAgo(13); // prior 7 days: d14 <= day < d7

  const [totals, builds] = await Promise.all([
    env.DB.prepare(
      `SELECT event,
         SUM(count)                                              AS total,
         SUM(CASE WHEN day  = ?1 THEN count ELSE 0 END)          AS d_today,
         SUM(CASE WHEN day >= ?2 THEN count ELSE 0 END)          AS d_last7,
         SUM(CASE WHEN day >= ?3 AND day < ?2 THEN count ELSE 0 END) AS d_prev7
       FROM clicks
       GROUP BY event
       ORDER BY total DESC`
    )
      .bind(today, d7, d14)
      .all<{
        event: string;
        total: number;
        d_today: number;
        d_last7: number;
        d_prev7: number;
      }>(),
    aggregateBuilds(env),
  ]);

  return json(
    {
      ok: true,
      basis: { today, last7From: d7, prev7From: d14 },
      totals: totals.results,
      builds,
    },
    200,
    cors
  );
}

// Build pieces are weapons + passives only. DLCs are broad context (base is
// almost always on) and evolutions aren't part of an active loadout, so both
// are excluded from co-occurrence so the signal stays meaningful.
const BUILD_ID_RE = /^[wp][0-9]+$/;
// Scan window and fan-out caps. /stats is cached hourly, so this runs rarely.
const BUILD_WINDOW_DAYS = 30;
const PAIR_SNAPSHOT_CAP = 30; // bound the O(k^2) pair fan-out per snapshot
const MAX_EVENTS = 200_000;
const TOP_PAIRS = 400;
const TOP_LOADOUTS = 60;

type BuildAggregates = {
  support: Record<string, number>;
  pairs: { a: string; b: string; n: number }[];
  loadouts: { items: string[]; n: number }[];
};

/**
 * Derive session-free co-occurrence from raw event snapshots. Each event's
 * active set (ctx, plus the toggled weapon/passive) is one snapshot; we tally
 * per-item support, unordered pairs, and exact loadouts across all of them.
 */
async function aggregateBuilds(env: Env): Promise<BuildAggregates> {
  const since = Date.now() - BUILD_WINDOW_DAYS * 86_400_000;
  const rows = await env.DB.prepare(
    `SELECT action, item, ctx FROM events
     WHERE ts >= ? ORDER BY ts DESC LIMIT ?`
  )
    .bind(since, MAX_EVENTS)
    .all<{ action: string; item: string | null; ctx: string | null }>();

  const support = new Map<string, number>();
  const pairs = new Map<string, number>();
  const loadouts = new Map<string, number>();

  for (const row of rows.results) {
    let ids: string[] = [];
    if (row.ctx) {
      try {
        const parsed = JSON.parse(row.ctx);
        if (Array.isArray(parsed)) ids = parsed;
      } catch {
        // skip malformed
      }
    }
    // The toggled item is co-active for on/off (an evolution id is excluded by
    // the prefix filter). Reset carries no item.
    if (row.item) ids.push(row.item);

    const set = [...new Set(ids.filter((x) => BUILD_ID_RE.test(x)))];
    if (set.length === 0) continue;

    for (const id of set) support.set(id, (support.get(id) ?? 0) + 1);

    if (set.length >= 2) {
      const key = [...set].sort().join(",");
      loadouts.set(key, (loadouts.get(key) ?? 0) + 1);
    }

    const ps = set.length > PAIR_SNAPSHOT_CAP ? set.slice(0, PAIR_SNAPSHOT_CAP) : set;
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i] < ps[j] ? ps[i] : ps[j];
        const b = ps[i] < ps[j] ? ps[j] : ps[i];
        const key = `${a}|${b}`;
        pairs.set(key, (pairs.get(key) ?? 0) + 1);
      }
    }
  }

  const topPairs = [...pairs.entries()]
    .map(([key, n]) => {
      const sep = key.indexOf("|");
      return { a: key.slice(0, sep), b: key.slice(sep + 1), n };
    })
    .sort((x, y) => y.n - x.n)
    .slice(0, TOP_PAIRS);

  const topLoadouts = [...loadouts.entries()]
    .map(([key, n]) => ({ items: key.split(","), n }))
    .sort((x, y) => y.n - x.n)
    .slice(0, TOP_LOADOUTS);

  return {
    support: Object.fromEntries(support),
    pairs: topPairs,
    loadouts: topLoadouts,
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const cors = corsFor(req, env);
    const { pathname } = new URL(req.url);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method === "POST" && pathname === "/track") return handleTrack(req, env, cors);
    if (req.method === "GET" && pathname === "/stats") return handleStats(req, env, cors);

    return json({ ok: false, error: "not found" }, 404, cors);
  },
};
