import type { Metadata } from "next";
import { getStats } from "@/lib/stats";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const runtime = "edge";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Filter Stats | Vampire Survivors Evolution Chart",
  description:
    "See which Vampire Survivors DLCs, weapons, and passives players filter for the most. Live usage stats from the evolution chart, updated hourly.",
  alternates: {
    canonical: "/stats",
  },
  openGraph: {
    title: "Filter Stats | Vampire Survivors Evolution Chart",
    description:
      "See which Vampire Survivors DLCs, weapons, and passives players filter for the most.",
  },
};

function Header() {
  return (
    <header className="px-1">
      <h1 className="text-2xl font-bold">Filter Stats</h1>
      <p className="text-sm text-white/60">How often each filter gets clicked. Updated hourly.</p>
    </header>
  );
}

export default async function StatsPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className="max-w-(--breakpoint-2xl) mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-2">Filter Stats</h1>
        <p className="text-white/60">
          Stats are not available. Set <code>NEXT_PUBLIC_TRACK_URL</code> and{" "}
          <code>STATS_TOKEN</code> in the environment, then reload. To preview the populated layout
          with mock data, visit <code>/stats/preview</code>.
        </p>
      </div>
    );
  }

  return <StatsDashboard stats={stats} header={<Header />} />;
}
