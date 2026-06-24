/**
 * Fire-and-forget analytics. Posts a tiny anonymous event to the Cloudflare
 * tracker via sendBeacon (non-blocking, survives navigation).
 *
 * Each event is an independent, identity-free snapshot of "what happened":
 *   - a: the action ('on' | 'off' | 'reset' | 'evo')
 *   - i: the item it happened to, as a compact wire id (omitted for 'reset')
 *   - c: the wire ids of everything else active at that moment
 * No session, no cookie, no fingerprint, no names. The server stamps the time.
 *
 * No-ops when NEXT_PUBLIC_TRACK_URL is unset (local dev, or before the Worker
 * is deployed) and never throws, so it can never break the UI.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_TRACK_URL;

// Wire ids: one category prefix + a small integer. Mirrors the Worker's regex
// so the server rarely has to reject anything.
const ID_RE = /^[wpde][0-9]{1,6}$/;
// Bound the context fan-out (and payload size).
const MAX_ACTIVE = 60;

export type TTrackAction = "on" | "off" | "reset" | "evo";

export type TTrackEvent = {
  a: TTrackAction;
  /** Subject wire id. Required for on/off/evo, omitted for reset. */
  i?: string;
  /** Active wire ids at event time ("what else was on"). */
  c?: string[];
};

function sanitize(
  i: string | undefined,
  c: string[] | undefined
): { i?: string; c?: string[] } {
  const item = i && ID_RE.test(i) ? i : undefined;
  let ctx: string[] | undefined;
  if (c?.length) {
    const cleaned = [
      ...new Set(c.filter((x) => ID_RE.test(x) && x !== item)),
    ].slice(0, MAX_ACTIVE);
    if (cleaned.length) ctx = cleaned;
  }
  return { i: item, c: ctx };
}

export function track(ev: TTrackEvent): void {
  if (!ENDPOINT || typeof navigator === "undefined" || !navigator.sendBeacon) {
    return;
  }
  try {
    const { i, c } = sanitize(ev.i, ev.c);
    const payload: TTrackEvent = { a: ev.a };
    if (i) payload.i = i;
    if (c) payload.c = c;
    navigator.sendBeacon(`${ENDPOINT}/track`, JSON.stringify(payload));
  } catch {
    // analytics must never break the app
  }
}
