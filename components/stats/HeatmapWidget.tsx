import type { TBuilds } from "@/lib/stats";
import { Widget } from "@/components/stats/Widget";
import { Icon } from "@/components/stats/Icon";

/**
 * Co-occurrence heatmap. Cell (row, col) shades by the conditional rate
 * P(col active | row active) = co(row, col) / support(row). The diagonal is the
 * item with itself.
 *
 * `size` caps how many items (by support) appear. Leave it falsy to render the
 * entire matrix: it can get very large, so the grid scrolls on both axes inside
 * a bounded box, and the row/column headers stay frozen so you never lose your
 * place. Best on wide screens, but it scrolls fine on mobile too.
 */
export function HeatmapWidget({ builds, size }: { builds: TBuilds; size?: number }) {
  const withPartners = builds.items.filter((it) => builds.affinity[it.key]?.length);
  const items = size ? withPartners.slice(0, size) : withPartners;

  const co = new Map<string, number>();
  for (const p of builds.pairs) {
    const key = p.a.key < p.b.key ? `${p.a.key}|${p.b.key}` : `${p.b.key}|${p.a.key}`;
    co.set(key, p.n);
  }
  const support = new Map(items.map((it) => [it.key, it.support]));

  const rate = (rowKey: string, colKey: string): number => {
    if (rowKey === colKey) return 1;
    const k = rowKey < colKey ? `${rowKey}|${colKey}` : `${colKey}|${rowKey}`;
    const c = co.get(k) ?? 0;
    const base = support.get(rowKey) ?? 0;
    return base > 0 ? c / base : 0;
  };

  const cols = `auto repeat(${items.length}, 1.85rem)`;
  // Opaque backdrop so frozen headers cover cells scrolling beneath them.
  const frozen = "bg-primary-950";

  return (
    <Widget
      title="Co-occurrence heatmap"
      subtitle={`When the row item is on, how often the column item is too · ${items.length} items`}
    >
      {items.length < 2 ? (
        <p className="text-sm text-white/40 py-2">
          Not enough co-occurrence yet. This fills in as visitors stack filters.
        </p>
      ) : (
        <>
          <div className="overflow-auto max-h-[75vh] w-full rounded-md border border-primary-500/10">
            <div className="grid gap-px w-max" style={{ gridTemplateColumns: cols }}>
              {/* top-left corner: frozen on both axes */}
              <div className={`sticky top-0 left-0 z-30 ${frozen}`} />
              {/* column headers: frozen to the top */}
              {items.map((it) => (
                <div
                  key={`h-${it.key}`}
                  className={`sticky top-0 z-20 flex items-end justify-center pb-1 ${frozen}`}
                >
                  <Icon image={it.image} name={it.name} className="size-5" />
                </div>
              ))}
              {/* data rows */}
              {items.map((row) => (
                <div key={`r-${row.key}`} className="contents">
                  {/* row label: icon only, frozen to the left */}
                  <div
                    className={`sticky left-0 z-20 flex items-center justify-center pr-1.5 ${frozen}`}
                    title={row.name}
                  >
                    <Icon image={row.image} name={row.name} className="size-5" />
                  </div>
                  {items.map((col) => {
                    const r = rate(row.key, col.key);
                    const self = row.key === col.key;
                    const alpha = self ? 0.12 : Math.min(0.85, 0.04 + r * 0.9);
                    return (
                      <div
                        key={`${row.key}-${col.key}`}
                        className="aspect-square rounded-[3px]"
                        style={{
                          backgroundColor: self
                            ? "rgba(255,255,255,0.05)"
                            : `rgba(255, 133, 133, ${alpha})`,
                        }}
                        title={
                          self
                            ? row.name
                            : `${col.name} on in ${Math.round(r * 100)}% of ${row.name} snapshots`
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[0.65rem] text-white/35">
            <span>rarely</span>
            <span
              aria-hidden
              className="h-2 w-24 rounded-full"
              style={{
                background:
                  "linear-gradient(to right, rgba(255,133,133,0.06), rgba(255,133,133,0.85))",
              }}
            />
            <span>almost always</span>
          </div>
        </>
      )}
    </Widget>
  );
}
