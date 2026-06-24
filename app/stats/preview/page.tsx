import type { Metadata } from "next";
import { mockStats } from "@/lib/stats.mock";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Filter Stats (Preview) | Vampire Survivors Evolution Chart",
  description: "Preview of the filter stats page with mock data.",
  robots: { index: false, follow: false },
};

function Header() {
  return (
    <header className="flex flex-col gap-3 px-1">
      <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
        <strong className="font-semibold">Preview — mock data.</strong> These
        numbers are generated, not real traffic. This page shows how the live
        stats will look once data (including week-over-week trends and builds)
        has accumulated.
      </div>
      <div>
        <h1 className="text-2xl font-bold">Filter Stats</h1>
        <p className="text-sm text-white/50">
          How often each filter gets clicked. Counts cover today, the last 7
          days, and all time. Updated hourly.
        </p>
      </div>
    </header>
  );
}

export default function StatsPreviewPage() {
  return <StatsDashboard stats={mockStats()} header={<Header />} />;
}
