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
export type TStatsResponse = {
  ok: boolean;
  basis?: { today: string; last7From: string; prev7From: string };
  totals: TRawTotal[];
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

/**
 * Fetch the raw aggregates from the tracker Worker. Returns null when the
 * request fails or the response is malformed.
 */
export async function fetchRawStats(
  baseUrl: string,
  token: string
): Promise<TStatsResponse | null> {
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/stats`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return parseRawStats(await res.json());
  } catch {
    return null;
  }
}

/** Validate a raw stats payload (from the Worker or a published snapshot). */
export function parseRawStats(data: unknown): TStatsResponse | null {
  const d = data as TStatsResponse | null;
  return d?.ok && Array.isArray(d.totals) ? d : null;
}

/** Pure transform from the Worker's raw response into the page's view model. */
export function shapeStats(totals: TRawTotal[]): TStats {
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
  const byTrend = [...buildPool].sort((a, b) => (b.trendPct ?? 0) - (a.trendPct ?? 0));
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
  };
}
