/**
 * Fire-and-forget click tracking. Posts an event name to the Cloudflare
 * tracker Worker via sendBeacon (non-blocking, survives navigation).
 *
 * No-ops when NEXT_PUBLIC_TRACK_URL is unset (local dev, or before the
 * Worker is deployed) and never throws, so it can never break the UI.
 */

const ENDPOINT = process.env.NEXT_PUBLIC_TRACK_URL;

// Normalize anything callers pass into a valid event key:
// lowercase, keep a-z 0-9 : _ - , collapse the rest to '-', cap at 64 chars.
// Mirrors the Worker's EVENT_RE so the server rarely has to reject.
function toEventKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function track(event: string): void {
  if (!ENDPOINT || typeof navigator === "undefined" || !navigator.sendBeacon) {
    return;
  }
  try {
    const key = toEventKey(event);
    if (key) navigator.sendBeacon(`${ENDPOINT}/track`, JSON.stringify({ event: key }));
  } catch {
    // analytics must never break the app
  }
}
