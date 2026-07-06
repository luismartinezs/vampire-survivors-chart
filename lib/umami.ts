/**
 * Fire a custom Umami analytics event. The Umami script (loaded in
 * app/layout.tsx) exposes window.umami; this no-ops when it's absent
 * (local dev, ad-blockers) and never throws, so it can never break the UI.
 *
 * Keep event data values low-cardinality — Umami's property breakdown UI
 * degrades past a few dozen distinct values.
 */

type TUmami = {
  track: (name: string, data?: Record<string, string | number>) => void;
};

export function trackUmami(name: string, data?: Record<string, string | number>): void {
  if (typeof window === "undefined") return;
  try {
    (window as { umami?: TUmami }).umami?.track(name, data);
  } catch {
    // analytics must never break the app
  }
}
