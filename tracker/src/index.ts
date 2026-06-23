/**
 * vsevochart-tracker
 *
 * A tiny, standalone click counter. No framework.
 *   POST /track  { event: string }  -> clicks.count += 1  (atomic D1 upsert)
 *   GET  /stats                      -> aggregated totals (requires bearer token)
 *
 * Beacons from the browser send a text/plain body, which is a CORS-"simple"
 * request, so the hot path needs no preflight. /stats is read server-side
 * from the Next app, so it's gated behind a secret token.
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  STATS_TOKEN?: string;
}

// event keys: lowercase, namespaced with ':', max 64 chars. Anything else is
// rejected so a hostile client can't explode the keyspace.
const EVENT_RE = /^[a-z0-9](?:[a-z0-9:_-]{0,63})$/;

const today = (): string => new Date().toISOString().slice(0, 10);

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

async function handleTrack(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  let event: unknown;
  try {
    ({ event } = JSON.parse(await req.text()));
  } catch {
    return json({ ok: false, error: "bad json" }, 400, cors);
  }

  if (typeof event !== "string" || !EVENT_RE.test(event)) {
    return json({ ok: false, error: "bad event" }, 400, cors);
  }

  await env.DB.prepare(
    `INSERT INTO clicks (event, day, count) VALUES (?, ?, 1)
     ON CONFLICT(event, day) DO UPDATE SET count = count + 1`
  )
    .bind(event, today())
    .run();

  return json({ ok: true }, 200, cors);
}

async function handleStats(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  const auth = req.headers.get("Authorization") ?? "";
  if (!env.STATS_TOKEN || auth !== `Bearer ${env.STATS_TOKEN}`) {
    return json({ ok: false, error: "unauthorized" }, 401, cors);
  }

  const { results } = await env.DB.prepare(
    `SELECT event, SUM(count) AS total
     FROM clicks GROUP BY event ORDER BY total DESC`
  ).all<{ event: string; total: number }>();

  return json({ ok: true, totals: results }, 200, cors);
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
