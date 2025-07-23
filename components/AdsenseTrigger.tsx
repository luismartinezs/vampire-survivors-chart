"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export const AdsenseTrigger = () => {
  useEffect(() => {
    try {
      // This tells the script (loaded in layout.tsx) to find and fill ads on this page.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []); // Runs once when the template remounts on navigation

  return null;
};