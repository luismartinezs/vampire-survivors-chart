"use client";

import { useEffect } from "react";
import { trackUmami } from "@/lib/umami";

const THRESHOLDS = [25, 50, 75, 100];

/**
 * Invisible: fires one Umami event per scroll-depth threshold reached
 * (25/50/75/100%), then unbinds. Depth is measured against the scrollable
 * height, so a viewport-sized page counts as 100% immediately on scroll.
 */
export function ScrollTracker({ event }: { event: string }) {
  useEffect(() => {
    const fired = new Set<number>();

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackUmami(event, { depth: `${threshold}%` });
        }
      }

      if (fired.size === THRESHOLDS.length) {
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [event]);

  return null;
}
