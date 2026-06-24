"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { TStatRow } from "@/lib/stats";

const numberFmt = new Intl.NumberFormat("en-US");

type SortKey = "name" | "today" | "last7" | "total" | "trend" | "share";
type Dir = "asc" | "desc";

// Low-contrast per-category bar tint, with a slightly stronger/weaker pair so
// the fill alternates row to row (zebra striping, see below).
const ACCENTS: Record<string, { a: string; b: string }> = {
  dlc: { a: "bg-primary-400/15", b: "bg-primary-400/8" },
  weapon: { a: "bg-amber-400/16", b: "bg-amber-400/9" },
  passive: { a: "bg-lotm-400/18", b: "bg-lotm-400/10" },
  evo: { a: "bg-todf-400/18", b: "bg-todf-400/10" },
};
const ACCENT_FALLBACK = { a: "bg-white/8", b: "bg-white/4" };

function TrendBadge({ row, show }: { row: TStatRow; show: boolean }) {
  if (!show) return <span className="text-white/20">–</span>;
  if (row.isNew) return <span className="text-sky-400 text-xs font-medium">new</span>;
  if (row.trendPct === null) return <span className="text-white/20">–</span>;
  const up = row.trendPct >= 0;
  return (
    <span
      className={cn(
        "text-xs font-medium tabular-nums",
        up ? "text-emerald-400" : "text-rose-400"
      )}
    >
      {up ? "↑" : "↓"}
      {Math.abs(Math.round(row.trendPct))}%
    </span>
  );
}

/** Value used to draw the background bar for the active sort. */
function barMetric(row: TStatRow, sort: SortKey): number {
  if (sort === "today") return row.today;
  if (sort === "last7") return row.last7;
  return row.total; // total / share / trend / name fall back to overall popularity
}

/** Sortable value for a row. Trend sorts by %, with new/no-baseline last. */
function sortValue(row: TStatRow, sort: SortKey): number {
  switch (sort) {
    case "today":
      return row.today;
    case "last7":
      return row.last7;
    case "share":
      return row.share;
    case "trend":
      return row.trendPct ?? (row.isNew ? -1 : -Infinity);
    default:
      return row.total;
  }
}

function SortHeader({
  label,
  col,
  sort,
  dir,
  onSort,
  align = "right",
  className,
}: {
  label: string;
  col: SortKey;
  sort: SortKey;
  dir: Dir;
  onSort: (col: SortKey) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sort === col;
  return (
    <button
      type="button"
      onClick={() => onSort(col)}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
      className={cn(
        "flex items-center gap-0.5 uppercase tracking-wider cursor-pointer transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:text-white/80",
        align === "right" ? "justify-end" : "justify-start",
        active ? "text-primary-300/80" : "text-white/30",
        className
      )}
    >
      <span className="truncate">{label}</span>
      {active && <span aria-hidden>{dir === "asc" ? "▲" : "▼"}</span>}
    </button>
  );
}

export function CategoryTable({
  title,
  rows,
  category,
  showTrend = true,
}: {
  title: string;
  rows: TStatRow[];
  category: string;
  showTrend?: boolean;
}) {
  const [sort, setSort] = useState<SortKey>("total");
  const [dir, setDir] = useState<Dir>("desc");

  const onSort = (col: SortKey) => {
    if (col === sort) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(col);
      // Names read best A→Z; everything else most-first.
      setDir(col === "name" ? "asc" : "desc");
    }
  };

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const cmp =
        sort === "name"
          ? a.name.localeCompare(b.name)
          : sortValue(a, sort) - sortValue(b, sort) || b.total - a.total;
      return dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sort, dir]);

  const showIcon = rows.some((r) => r.image);
  const maxBar = useMemo(
    () => Math.max(1, ...sorted.map((r) => barMetric(r, sort))),
    [sorted, sort]
  );
  const accents = ACCENTS[category] ?? ACCENT_FALLBACK;

  return (
    <section className="min-w-0 rounded-lg border border-primary-500/15 bg-primary-900/30 p-3">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-primary-300/70 mb-2">
        {title}
      </h2>

      <div className="max-h-[26rem] overflow-y-auto">
        {/* Column header — sticky, click to sort */}
        <div className="sticky top-0 z-10 bg-primary-900 flex items-center gap-2 sm:gap-3 py-1.5 px-2 text-[0.65rem] border-b border-primary-500/20">
          <span className="w-6 shrink-0 text-right text-white/30">#</span>
          {showIcon && <span className="size-7 shrink-0" aria-hidden />}
          <SortHeader
            label={title}
            col="name"
            sort={sort}
            dir={dir}
            onSort={onSort}
            align="left"
            className="flex-1 min-w-0"
          />
          <SortHeader label="Today" col="today" sort={sort} dir={dir} onSort={onSort} className="w-12 shrink-0" />
          <SortHeader label="7d" col="last7" sort={sort} dir={dir} onSort={onSort} className="w-12 shrink-0" />
          <SortHeader label="All" col="total" sort={sort} dir={dir} onSort={onSort} className="w-14 shrink-0" />
          <SortHeader label="Trend" col="trend" sort={sort} dir={dir} onSort={onSort} className="w-14 shrink-0" />
          <SortHeader label="Share" col="share" sort={sort} dir={dir} onSort={onSort} className="w-14 shrink-0" />
        </div>

        {sorted.length === 0 ? (
          <p className="px-2 py-4 text-sm text-white/40">No data yet.</p>
        ) : (
          <ol className="text-sm">
            {sorted.map((row, i) => {
              const pct = (barMetric(row, sort) / maxBar) * 100;
              const alt = i % 2 === 1;
              return (
                <li
                  key={row.key}
                  className={cn(
                    "relative flex items-center gap-2 sm:gap-3 py-1.5 px-2 transition-colors hover:bg-primary-500/10",
                    alt && "bg-white/[0.025]"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-sm",
                      alt ? accents.b : accents.a
                    )}
                    style={{ width: `${Math.max(pct, 1.5)}%` }}
                  />
                  <span className="relative w-6 shrink-0 text-right text-xs tabular-nums text-white/30">
                    {i + 1}
                  </span>
                  {showIcon &&
                    (row.image ? (
                      <span
                        className={cn(
                          "relative size-7 shrink-0 bg-contain bg-no-repeat bg-center pixelated",
                          row.image
                        )}
                        role="img"
                        aria-label={row.name}
                      />
                    ) : (
                      <span className="relative size-7 shrink-0" aria-hidden />
                    ))}
                  <span className="relative flex-1 min-w-0 truncate">{row.name}</span>
                  <span className="relative w-12 shrink-0 text-right tabular-nums text-white/60">
                    {numberFmt.format(row.today)}
                  </span>
                  <span className="relative w-12 shrink-0 text-right tabular-nums text-white/60">
                    {numberFmt.format(row.last7)}
                  </span>
                  <span className="relative w-14 shrink-0 text-right tabular-nums font-medium">
                    {numberFmt.format(row.total)}
                  </span>
                  <span className="relative w-14 shrink-0 text-right">
                    <TrendBadge row={row} show={showTrend} />
                  </span>
                  <span className="relative w-14 shrink-0 text-right tabular-nums text-white/50">
                    {row.share.toFixed(1)}%
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
