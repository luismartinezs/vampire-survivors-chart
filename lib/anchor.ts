/**
 * Partner ranking for the stats page's "Paired With" widget. Shared by the build
 * (first anchor, rendered into HTML) and client/stats.ts (every later pick), so
 * it must stay free of build-only dependencies.
 */

const pctFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export type TAnchorData = {
  /** [key, name, icon, support] */
  items: [string, string, string, number][];
  /** [item index, item index, co-occurrences] */
  pairs: [number, number, number][];
};

/** Top 8 partners of `anchor` by co-occurrence, with bar widths relative to the top rate. */
export function anchorPartners(data: TAnchorData, anchor: number) {
  const support = data.items[anchor]?.[3] ?? 0;
  const out: { item: number; co: number; rate: number }[] = [];
  for (const [a, b, n] of data.pairs) {
    const other = a === anchor ? b : b === anchor ? a : -1;
    if (other < 0) continue;
    out.push({ item: other, co: n, rate: support > 0 ? (n / support) * 100 : 0 });
  }
  const top = out.sort((x, y) => y.co - x.co).slice(0, 8);
  const maxRate = Math.max(1, ...top.map((p) => p.rate));
  return top.map((p) => ({
    name: data.items[p.item][1],
    icon: data.items[p.item][2],
    rate: `${pctFmt.format(p.rate)}%`,
    width: Math.max((p.rate / maxRate) * 100, 2).toFixed(2),
  }));
}
