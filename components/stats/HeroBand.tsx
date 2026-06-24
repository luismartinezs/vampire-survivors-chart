import type { TStats, TStatRow } from "@/lib/stats";
import { Icon } from "@/components/stats/Icon";
import { cn } from "@/lib/utils";

const numberFmt = new Intl.NumberFormat("en-US");

function HeroStat({
  label,
  item,
  caption,
  accent,
}: {
  label: string;
  item?: TStatRow;
  caption: string;
  accent?: "up" | "down";
}) {
  return (
    <div className="rounded-md border border-primary-500/15 bg-primary-950/40 px-3 py-2 min-w-0">
      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-primary-300/50">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2 min-w-0">
        <Icon image={item?.image} name={item?.name ?? ""} className="size-6" />
        <span className="truncate text-sm font-medium">{item?.name ?? "—"}</span>
      </div>
      <p
        className={cn(
          "mt-0.5 text-xs tabular-nums",
          accent === "up"
            ? "text-emerald-400 font-medium"
            : accent === "down"
              ? "text-rose-400 font-medium"
              : "text-white/40"
        )}
      >
        {caption}
      </p>
    </div>
  );
}

/**
 * The page's thesis: today's activity at a glance, framed by the four items
 * that define the current state — the most and least clicked weapon, and the
 * fastest riser and faller — so the hero is specific to this data.
 */
export function HeroBand({ stats }: { stats: TStats }) {
  const weapons = stats.categories.weapons;
  const leading = weapons[0];
  const least = weapons[weapons.length - 1];
  const rising = stats.trending[0];
  const falling = stats.declining[0];
  const trend = stats.hasTrendData;

  return (
    <div className="relative overflow-hidden rounded-lg border border-primary-500/20 bg-primary-900/40 p-4 sm:p-5">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary-400/60 via-primary-400/20 to-transparent"
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-primary-300/60">
            Activity today
          </p>
          <div className="mt-1 flex items-end gap-2.5">
            <span className="font-pixel text-5xl sm:text-6xl leading-none text-primary-100 drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]">
              {numberFmt.format(stats.totalToday)}
            </span>
            <span className="mb-1 text-sm text-white/40">clicks</span>
          </div>
          <p className="mt-2 text-xs text-white/40">
            {numberFmt.format(stats.totalAll)} all time
            <span className="mx-1.5 text-primary-500/40">·</span>
            {numberFmt.format(stats.resets.today)} builds wiped today
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 lg:w-[34rem]">
          <HeroStat
            label="Leading"
            item={leading}
            caption={leading ? `${leading.share.toFixed(1)}% of weapon clicks` : "—"}
          />
          <HeroStat
            label="Least popular"
            item={least}
            caption={least ? `${numberFmt.format(least.total)} clicks all time` : "—"}
          />
          <HeroStat
            label="Rising fastest"
            item={rising}
            accent={rising && trend ? "up" : undefined}
            caption={
              rising && rising.trendPct != null
                ? `↑${Math.round(rising.trendPct)}% week over week`
                : "needs ~2 weeks"
            }
          />
          <HeroStat
            label="Falling fastest"
            item={falling}
            accent={falling && trend ? "down" : undefined}
            caption={
              falling && falling.trendPct != null
                ? `↓${Math.abs(Math.round(falling.trendPct))}% week over week`
                : "needs ~2 weeks"
            }
          />
        </div>
      </div>
    </div>
  );
}
