import type { ReactNode } from "react";
import type { TStats, TStatRow } from "@/lib/stats";
import { PixelFont } from "@/fonts";
import { CategoryTable } from "@/components/stats/CategoryTable";
import {
  GridItem,
  Section,
  type TWidgetSize,
} from "@/components/stats/DashboardGrid";
import { Widget } from "@/components/stats/Widget";
import { Icon } from "@/components/stats/Icon";
import { HeroBand } from "@/components/stats/HeroBand";
import { AnchorBuildsWidget } from "@/components/stats/AnchorBuildsWidget";
import { LoadoutsWidget } from "@/components/stats/LoadoutsWidget";
import { HeatmapWidget } from "@/components/stats/HeatmapWidget";
import { cn } from "@/lib/utils";

const numberFmt = new Intl.NumberFormat("en-US");
const MEDALS = ["🥇", "🥈", "🥉"];

function LeaderWidget({ title, rows }: { title: string; rows: TStatRow[] }) {
  return (
    <Widget title={title}>
      <ol className="flex flex-col gap-1.5">
        {rows.map((r, i) => (
          <li key={r.key} className="flex items-center gap-2 text-sm">
            <span className="shrink-0">{MEDALS[i]}</span>
            <Icon image={r.image} name={r.name} />
            <span className="flex-1 min-w-0 truncate font-medium">{r.name}</span>
            <span className="shrink-0 text-right text-xs text-white/50 tabular-nums">
              {numberFmt.format(r.total)} · {r.share.toFixed(1)}%
            </span>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="text-sm text-white/40">No clicks recorded yet.</li>
        )}
      </ol>
    </Widget>
  );
}

function TrendWidget({
  title,
  rows,
  hasTrendData,
  direction,
}: {
  title: string;
  rows: TStatRow[];
  hasTrendData: boolean;
  direction: "up" | "down";
}) {
  return (
    <Widget title={title}>
      {!hasTrendData ? (
        <p className="text-xs text-white/40 leading-relaxed">
          Week-over-week momentum needs about two weeks of history. Check back
          once it builds up.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-white/40">Nothing notable yet.</p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {rows.map((r) => {
            const pct = Math.abs(Math.round(r.trendPct ?? 0));
            return (
              <li key={r.key} className="flex items-center gap-2 text-sm">
                <Icon image={r.image} name={r.name} />
                <span className="flex-1 min-w-0 truncate">{r.name}</span>
                <span
                  className={cn(
                    "shrink-0 text-xs font-medium tabular-nums",
                    direction === "up" ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {direction === "up" ? "↑" : "↓"}
                  {pct}%
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </Widget>
  );
}

type Tile = { size: TWidgetSize; node: ReactNode; className?: string };
type LayoutSection = { label: string; meta?: ReactNode; tiles: Tile[] };

export function StatsDashboard({
  stats,
  header,
}: {
  stats: TStats;
  header?: ReactNode;
}) {
  // ───────────────────────────────────────────────────────────────────────
  // DASHBOARD LAYOUT — this array is the page.
  //   • Comment out a tile line to hide that widget.
  //   • Reorder tile lines (or whole sections) to reorder them.
  //   • Change `size` (sm | md | lg | xl) to make a tile wider.
  //   • Comment out a whole { label, tiles } block to drop the section.
  // ───────────────────────────────────────────────────────────────────────
  const layout: LayoutSection[] = [
    {
      label: "Rankings",
      tiles: [
        { size: "sm", node: <LeaderWidget title="Top DLCs" rows={stats.leaders.dlcs} /> },
        { size: "sm", node: <LeaderWidget title="Top weapons" rows={stats.leaders.weapons} /> },
        { size: "sm", node: <LeaderWidget title="Top passives" rows={stats.leaders.passives} /> },
        {
          size: "sm",
          node: (
            <TrendWidget
              title="Trending up"
              rows={stats.trending}
              hasTrendData={stats.hasTrendData}
              direction="up"
            />
          ),
        },
        {
          size: "sm",
          node: (
            <TrendWidget
              title="Falling off"
              rows={stats.declining}
              hasTrendData={stats.hasTrendData}
              direction="down"
            />
          ),
        },
      ],
    },
    {
      label: "Builds",
      meta: "what gets used together",
      tiles: [
        { size: "md", node: <AnchorBuildsWidget builds={stats.builds} /> },
        { size: "md", node: <LoadoutsWidget loadouts={stats.builds.loadouts} /> },
        { size: "xl", className: "hidden lg:block", node: <HeatmapWidget builds={stats.builds} /> },
      ],
    },
    {
      label: "Browse all",
      tiles: [
        { size: "xl", node: <CategoryTable title="DLCs" rows={stats.categories.dlcs} category="dlc" showTrend={stats.hasTrendData} /> },
        { size: "xl", node: <CategoryTable title="Weapons" rows={stats.categories.weapons} category="weapon" showTrend={stats.hasTrendData} /> },
        { size: "xl", node: <CategoryTable title="Passives" rows={stats.categories.passives} category="passive" showTrend={stats.hasTrendData} /> },
        { size: "xl", node: <CategoryTable title="Evolutions" rows={stats.categories.evolutions} category="evo" showTrend={stats.hasTrendData} /> },
      ],
    },
  ];

  return (
    <div
      className={cn(
        PixelFont.variable,
        "max-w-(--breakpoint-2xl) mx-auto py-6 px-2 sm:px-4 flex flex-col gap-8"
      )}
    >
      {header}

      <HeroBand stats={stats} />

      {layout.map((section) => (
        <Section key={section.label} label={section.label} meta={section.meta}>
          {section.tiles.map((tile, i) => (
            <GridItem key={i} size={tile.size} className={tile.className}>
              {tile.node}
            </GridItem>
          ))}
        </Section>
      ))}
    </div>
  );
}
