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
 * The events table is write-only here: aggregating it per request (builds /
 * co-occurrence) exceeded the free plan's 10 ms CPU limit and its D1 read
 * allowance, so /stats only reads the small daily `clicks` aggregate.
 *
 * No session, no cookie, no fingerprint, no names: each event is independent
 * and anonymous. Beacons send a text/plain body (CORS-"simple", no preflight).
 * /stats is read once a day by the static site's build, gated behind a secret token.
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

  const totals = await env.DB.prepare(
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
    }>();

  return json(
    {
      ok: true,
      basis: { today, last7From: d7, prev7From: d14 },
      totals: totals.results,
    },
    200,
    cors
  );
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
