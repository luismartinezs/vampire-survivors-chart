/**
 * Build-time view model for /stats. Everything the template prints is resolved
 * here (formatted numbers, class strings, which empty state applies), so
 * site/templates/stats.html stays a plain loop over this structure.
 */

import type { TStatRow, TStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

const numberFmt = new Intl.NumberFormat("en-US");

// Golden Egg sprite recolors, see styles/misc.css
const MEDALS = ["icon-egg-gold", "icon-egg-silver", "icon-egg-bronze"];

/** Grid span per tile size: one column on phones, widening to 2 then 4 tracks. */
const SPAN = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-2",
  lg: "col-span-1 sm:col-span-2 lg:col-span-3",
  xl: "col-span-1 sm:col-span-2 lg:col-span-4",
} as const;
type TSize = keyof typeof SPAN;

// Low-contrast per-category bar tint, with a stronger/weaker pair so the fill
// alternates row to row (zebra striping).
const ACCENTS: Record<string, { a: string; b: string }> = {
  dlc: { a: "bg-primary-400/15", b: "bg-primary-400/8" },
  weapon: { a: "bg-amber-400/16", b: "bg-amber-400/9" },
  passive: { a: "bg-lotm-400/18", b: "bg-lotm-400/10" },
  evo: { a: "bg-todf-400/18", b: "bg-todf-400/10" },
};

type TTile =
  | { kind: "leader"; title: string; rows: TStatRow[] }
  | { kind: "trend"; title: string; rows: TStatRow[]; direction: "up" | "down" }
  | { kind: "table"; title: string; category: string; rows: TStatRow[] };

type TLayoutSection = { label: string; meta?: string; tiles: { size: TSize; tile: TTile }[] };

/**
 * DASHBOARD LAYOUT: this array is the page.
 *   - Delete a tile line to hide that widget.
 *   - Reorder tile lines (or whole sections) to reorder them.
 *   - Change `size` (sm | md | lg | xl) to make a tile wider.
 */
function layout(stats: TStats): TLayoutSection[] {
  return [
    {
      label: "Rankings",
      tiles: [
        { size: "sm", tile: { kind: "leader", title: "Top DLCs", rows: stats.leaders.dlcs } },
        { size: "sm", tile: { kind: "leader", title: "Top weapons", rows: stats.leaders.weapons } },
        {
          size: "sm",
          tile: { kind: "leader", title: "Top passives", rows: stats.leaders.passives },
        },
        {
          size: "sm",
          tile: { kind: "trend", title: "Trending up", rows: stats.trending, direction: "up" },
        },
        {
          size: "sm",
          tile: { kind: "trend", title: "Falling off", rows: stats.declining, direction: "down" },
        },
      ],
    },
    {
      label: "Browse all",
      tiles: [
        {
          size: "xl",
          tile: { kind: "table", title: "DLCs", category: "dlc", rows: stats.categories.dlcs },
        },
        {
          size: "xl",
          tile: {
            kind: "table",
            title: "Weapons",
            category: "weapon",
            rows: stats.categories.weapons,
          },
        },
        {
          size: "xl",
          tile: {
            kind: "table",
            title: "Passives",
            category: "passive",
            rows: stats.categories.passives,
          },
        },
        {
          size: "xl",
          tile: {
            kind: "table",
            title: "Evolutions",
            category: "evo",
            rows: stats.categories.evolutions,
          },
        },
      ],
    },
  ];
}

const trendCaption = (row: TStatRow | undefined, direction: "up" | "down") =>
  row && row.trendPct != null
    ? `${direction === "up" ? "↑" : "↓"}${Math.abs(Math.round(row.trendPct))}% week over week`
    : "needs ~2 weeks";

function heroView(stats: TStats) {
  const weapons = stats.categories.weapons;
  const leading = weapons[0];
  const least = weapons[weapons.length - 1];
  const rising = stats.trending[0];
  const falling = stats.declining[0];
  const tile = (label: string, row: TStatRow | undefined, caption: string, accent = "") => ({
    label,
    name: row?.name ?? "—",
    icon: row?.image ?? "",
    caption,
    captionCls: cn(
      "mt-0.5 text-xs tabular-nums",
      accent === "up"
        ? "text-emerald-400 font-medium"
        : accent === "down"
          ? "text-rose-400 font-medium"
          : "text-white/70"
    ),
  });
  return {
    totalToday: numberFmt.format(stats.totalToday),
    totalAll: numberFmt.format(stats.totalAll),
    tiles: [
      tile(
        "Most popular",
        leading,
        leading ? `${leading.share.toFixed(1)}% of weapon clicks` : "—"
      ),
      tile(
        "Least popular",
        least,
        least ? `${numberFmt.format(least.total)} clicks all time` : "—"
      ),
      tile(
        "Rising fastest",
        rising,
        trendCaption(rising, "up"),
        rising && stats.hasTrendData ? "up" : ""
      ),
      tile(
        "Falling fastest",
        falling,
        trendCaption(falling, "down"),
        falling && stats.hasTrendData ? "down" : ""
      ),
    ],
  };
}

function trendBadge(row: TStatRow, show: boolean) {
  if (!show || (!row.isNew && row.trendPct === null)) return { text: "–", cls: "text-white/20" };
  if (row.isNew) return { text: "new", cls: "text-sky-400 text-xs font-medium" };
  const up = row.trendPct! >= 0;
  return {
    text: `${up ? "↑" : "↓"}${Math.abs(Math.round(row.trendPct!))}%`,
    cls: cn("text-xs font-medium tabular-nums", up ? "text-emerald-400" : "text-rose-400"),
  };
}

function tableView(title: string, category: string, rows: TStatRow[], showTrend: boolean) {
  const accents = ACCENTS[category] ?? { a: "bg-white/8", b: "bg-white/4" };
  const maxBar = Math.max(1, ...rows.map((r) => r.total));
  return {
    title,
    category,
    accentA: accents.a,
    accentB: accents.b,
    showIcon: rows.some((r) => r.image),
    rows: rows.map((row, i) => ({
      name: row.name,
      icon: row.image ?? "",
      rank: i + 1,
      alt: i % 2 === 1,
      barWidth: Math.max((row.total / maxBar) * 100, 1.5).toFixed(2),
      today: numberFmt.format(row.today),
      last7: numberFmt.format(row.last7),
      total: numberFmt.format(row.total),
      share: `${row.share.toFixed(1)}%`,
      trend: trendBadge(row, showTrend),
      // Raw sort keys for client/stats.ts. Trend sorts new/no-baseline last.
      sort: {
        today: row.today,
        last7: row.last7,
        total: row.total,
        share: row.share,
        trend: row.trendPct ?? (row.isNew ? -1 : -1e15),
      },
    })),
  };
}

export function buildStatsView(stats: TStats | null, generatedAt: Date) {
  if (!stats) return { available: false };

  const sections = layout(stats).map((section) => ({
    label: section.label,
    meta: section.meta ?? "",
    tiles: section.tiles.map(({ size, tile }) => {
      const span = cn(SPAN[size], "min-w-0");
      switch (tile.kind) {
        case "leader":
          return {
            span,
            kind: tile.kind,
            title: tile.title,
            rows: tile.rows.map((r, i) => ({
              medal: MEDALS[i] ?? "",
              icon: r.image ?? "",
              name: r.name,
              value: `${numberFmt.format(r.total)} · ${r.share.toFixed(1)}%`,
            })),
          };
        case "trend":
          return {
            span,
            kind: tile.kind,
            title: tile.title,
            hasTrendData: stats.hasTrendData,
            valueCls: cn(
              "shrink-0 text-xs font-medium tabular-nums",
              tile.direction === "up" ? "text-emerald-400" : "text-rose-400"
            ),
            rows: tile.rows.map((r) => ({
              icon: r.image ?? "",
              name: r.name,
              value: `${tile.direction === "up" ? "↑" : "↓"}${Math.abs(Math.round(r.trendPct ?? 0))}%`,
            })),
          };
        case "table":
          return {
            span,
            kind: tile.kind,
            table: tableView(tile.title, tile.category, tile.rows, stats.hasTrendData),
          };
      }
    }),
  }));

  return {
    available: true,
    generatedAt: generatedAt.toISOString(),
    hero: heroView(stats),
    sections,
  };
}
