import type { TLoadout } from "@/lib/stats";
import { Widget } from "@/components/stats/Widget";
import { Icon } from "@/components/stats/Icon";

const numberFmt = new Intl.NumberFormat("en-US");

/**
 * "Common builds": the full active-sets that recur most often. Reset snapshots
 * (a deliberately wiped build) feed this alongside ordinary co-activity.
 */
export function LoadoutsWidget({
  loadouts,
  limit = 10,
}: {
  loadouts: TLoadout[];
  limit?: number;
}) {
  return (
    <Widget
      title="Common builds"
      subtitle="Full sets of weapons + passives seen active together"
    >
      {loadouts.length === 0 ? (
        <p className="text-sm text-white/40 py-2">
          No loadouts recorded yet. This fills in as visitors assemble builds.
        </p>
      ) : (
        <ol className="flex flex-col gap-1.5">
          {loadouts.slice(0, limit).map((l, i) => (
            <li
              key={l.items.map((it) => it.key).join("|") + i}
              className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.03]"
            >
              <span className="shrink-0 w-12 text-right tabular-nums text-sm font-medium text-white/70">
                {numberFmt.format(l.n)}×
              </span>
              <span className="flex items-center gap-0.5 shrink-0">
                {l.items.map((it) => (
                  <Icon key={it.key} image={it.image} name={it.name} />
                ))}
              </span>
              <span className="flex-1 min-w-0 truncate text-xs text-white/40">
                {l.items.map((it) => it.name).join(" · ")}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Widget>
  );
}
