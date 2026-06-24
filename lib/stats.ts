import { decodeWire, wireCategory, type TWireCategory } from "@/lib/wire";

export type TCategory = TWireCategory; // "dlc" | "weapon" | "passive" | "evo"

/** Raw shape from the Worker's GET /stats response. */
export type TRawTotal = {
  event: string;
  total: number;
  d_today: number;
  d_last7: number;
  d_prev7: number;
};
/** Raw co-occurrence aggregates the Worker derives from event snapshots. */
export type TRawBuilds = {
  /** wire id -> number of snapshots it was active in. */
  support: Record<string, number>;
  /** undirected pairs (a < b) -> snapshots both active. */
  pairs: { a: string; b: string; n: number }[];
  /** exact active-sets -> times that set recurred. */
  loadouts: { items: string[]; n: number }[];
};

type TStatsResponse = {
  ok: boolean;
  basis?: { today: string; last7From: string; prev7From: string };
  totals: TRawTotal[];
  builds?: TRawBuilds;
};

/** A single ranked entry, enriched with display info, windows and trend. */
export type TStatRow = {
  key: string;
  name: string;
  category: TCategory;
  /** Icon CSS class (e.g. "icon-garlic"), undefined when no item matches. */
  image?: string;
  total: number;
  today: number;
  last7: number;
  prev7: number;
  /** Share of the category all-time total, 0–100. */
  share: number;
  /** Week-over-week change %, null when there's no prior-week baseline. */
  trendPct: number | null;
  /** Activity this week with nothing the week before. */
  isNew: boolean;
};

/** A build-eligible item (weapon or passive), decoded for display. */
export type TBuildItem = {
  key: string;
  name: string;
  image?: string;
  category: TCategory;
};
export type TBuildPair = { a: TBuildItem; b: TBuildItem; n: number };
export type TLoadout = { items: TBuildItem[]; n: number };

export type TBuilds = {
  /** Items ranked by support (snapshots they were active in). */
  items: (TBuildItem & { support: number })[];
  /** Undirected co-occurrence, decoded and ranked. */
  pairs: TBuildPair[];
  /** Most frequent full active-sets, decoded and ranked. */
  loadouts: TLoadout[];
  /** wire id -> its top co-occurring partners, for inline affinity. */
  affinity: Record<string, TBuildItem[]>;
  /** False until any co-occurrence has been recorded. */
  hasData: boolean;
};

export type TStats = {
  categories: {
    dlcs: TStatRow[];
    weapons: TStatRow[];
    passives: TStatRow[];
    evolutions: TStatRow[];
  };
  leaders: { dlcs: TStatRow[]; weapons: TStatRow[]; passives: TStatRow[] };
  totalToday: number;
  totalAll: number;
  /** "Reset all" clicks, a proxy for a finished build. */
  resets: { today: number; all: number };
  trending: TStatRow[];
  declining: TStatRow[];
  /** False until a prior week of data exists; gates trend UI. */
  hasTrendData: boolean;
  /** Co-occurrence views ("builds"). */
  builds: TBuilds;
};

// Minimum prior-week volume for a trend % to be considered signal, not noise.
const TREND_MIN_BASELINE = 5;

function trendOf(last7: number, prev7: number): { trendPct: number | null; isNew: boolean } {
  if (prev7 === 0) return { trendPct: null, isNew: last7 > 0 };
  return { trendPct: ((last7 - prev7) / prev7) * 100, isNew: false };
}

function rank(raw: TRawTotal[], category: TCategory): TStatRow[] {
  const rows = raw
    .filter((r) => wireCategory(r.event) === category)
    .map((r): TStatRow => {
      const meta = decodeWire(r.event);
      const { trendPct, isNew } = trendOf(r.d_last7, r.d_prev7);
      return {
        key: r.event,
        name: meta?.name ?? r.event,
        category,
        image: meta?.image,
        total: r.total,
        today: r.d_today,
        last7: r.d_last7,
        prev7: r.d_prev7,
        share: 0,
        trendPct,
        isNew,
      };
    });

  const sum = rows.reduce((acc, r) => acc + r.total, 0);
  for (const r of rows) r.share = sum > 0 ? (r.total / sum) * 100 : 0;

  return rows.sort((a, b) => b.total - a.total);
}

function toBuildItem(id: string): TBuildItem | null {
  const meta = decodeWire(id);
  if (!meta) return null;
  return { key: id, name: meta.name, image: meta.image, category: meta.category };
}

const EMPTY_BUILDS: TBuilds = {
  items: [],
  pairs: [],
  loadouts: [],
  affinity: {},
  hasData: false,
};

/** Decode the raw co-occurrence aggregates into display view models. */
function shapeBuilds(raw?: TRawBuilds): TBuilds {
  if (!raw) return EMPTY_BUILDS;

  const items = Object.entries(raw.support ?? {})
    .map((e) => {
      const item = toBuildItem(e[0]);
      return item ? { ...item, support: e[1] } : null;
    })
    .filter((x): x is TBuildItem & { support: number } => x !== null)
    .sort((a, b) => b.support - a.support);

  const pairs = (raw.pairs ?? [])
    .map((p) => {
      const a = toBuildItem(p.a);
      const b = toBuildItem(p.b);
      return a && b ? { a, b, n: p.n } : null;
    })
    .filter((x): x is TBuildPair => x !== null)
    .sort((x, y) => y.n - x.n);

  const loadouts = (raw.loadouts ?? [])
    .map((l) => {
      const its = l.items
        .map(toBuildItem)
        .filter((x): x is TBuildItem => x !== null);
      return its.length >= 2 ? { items: its, n: l.n } : null;
    })
    .filter((x): x is TLoadout => x !== null)
    .sort((x, y) => y.n - x.n);

  // Per-item top partners, derived from the (symmetric) pair list.
  const acc: Record<string, { p: TBuildItem; n: number }[]> = {};
  for (const pr of pairs) {
    (acc[pr.a.key] ??= []).push({ p: pr.b, n: pr.n });
    (acc[pr.b.key] ??= []).push({ p: pr.a, n: pr.n });
  }
  const affinity: Record<string, TBuildItem[]> = {};
  for (const key of Object.keys(acc)) {
    affinity[key] = acc[key]
      .sort((x, y) => y.n - x.n)
      .slice(0, 3)
      .map((x) => x.p);
  }

  return {
    items,
    pairs,
    loadouts,
    affinity,
    hasData: pairs.length > 0 || loadouts.length > 0,
  };
}

/**
 * Fetch and shape the click stats. Returns null when the endpoint is not
 * configured (missing env) or the request fails — the page renders an empty
 * state rather than throwing.
 */
export async function getStats(): Promise<TStats | null> {
  const base = process.env.STATS_URL ?? process.env.NEXT_PUBLIC_TRACK_URL;
  const token = process.env.STATS_TOKEN;
  if (!base || !token) return null;

  let data: TStatsResponse;
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/stats`, {
      headers: { authorization: `Bearer ${token}` },
      // Pull at most hourly; the data only needs to be roughly daily-fresh.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    data = (await res.json()) as TStatsResponse;
  } catch {
    return null;
  }
  if (!data?.ok || !Array.isArray(data.totals)) return null;
  return shapeStats(data.totals, data.builds);
}

/**
 * Pure transform from the Worker's raw response into the page's view model.
 * Shared by getStats() and the preview mock, so the preview renders through
 * the exact same logic as production.
 */
export function shapeStats(totals: TRawTotal[], builds?: TRawBuilds): TStats {
  const dlcs = rank(totals, "dlc");
  const weapons = rank(totals, "weapon");
  const passives = rank(totals, "passive");
  const evolutions = rank(totals, "evo");

  // Item rows only (exclude the 'reset' pseudo-event) for headline totals.
  const itemRows = totals.filter((r) => wireCategory(r.event) !== undefined);
  const totalToday = itemRows.reduce((acc, r) => acc + (r.d_today ?? 0), 0);
  const totalAll = itemRows.reduce((acc, r) => acc + (r.total ?? 0), 0);

  const resetRow = totals.find((r) => r.event === "reset");
  const resets = {
    today: resetRow?.d_today ?? 0,
    all: resetRow?.total ?? 0,
  };

  // Trending / declining: build pieces (weapons + passives) with a real
  // prior-week baseline.
  const buildPool = [...weapons, ...passives].filter(
    (r) => r.prev7 >= TREND_MIN_BASELINE && r.trendPct !== null
  );
  const byTrend = [...buildPool].sort(
    (a, b) => (b.trendPct ?? 0) - (a.trendPct ?? 0)
  );
  const trending = byTrend.filter((r) => (r.trendPct ?? 0) > 0).slice(0, 3);
  const declining = byTrend
    .filter((r) => (r.trendPct ?? 0) < 0)
    .slice(-3)
    .reverse();

  const hasTrendData = totals.some((r) => (r.d_prev7 ?? 0) > 0);

  return {
    categories: { dlcs, weapons, passives, evolutions },
    leaders: {
      dlcs: dlcs.slice(0, 3),
      weapons: weapons.slice(0, 3),
      passives: passives.slice(0, 3),
    },
    totalToday,
    totalAll,
    resets,
    trending,
    declining,
    hasTrendData,
    builds: shapeBuilds(builds),
  };
}
