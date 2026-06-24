"use client";

import { useMemo, useState } from "react";
import type { TBuilds } from "@/lib/stats";
import { Widget } from "@/components/stats/Widget";
import { Icon } from "@/components/stats/Icon";

const pctFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * "Plays well with": pick an anchor item, see what else tends to be active
 * alongside it. Rate is conditional — of the snapshots where the anchor was on,
 * the share that also had each partner.
 */
export function AnchorBuildsWidget({ builds }: { builds: TBuilds }) {
  const supportOf = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of builds.items) m.set(it.key, it.support);
    return m;
  }, [builds.items]);

  // Anchor options: the most-supported items that have partners. Capped so the
  // dropdown stays scannable even when nearly every item has build data.
  const candidates = useMemo(
    () =>
      builds.items.filter((it) => builds.affinity[it.key]?.length).slice(0, 40),
    [builds.items, builds.affinity],
  );
  const [anchor, setAnchor] = useState(() => candidates[0]?.key ?? "");

  const partners = useMemo(() => {
    const base = supportOf.get(anchor) ?? 0;
    const out: {
      key: string;
      name: string;
      image?: string;
      co: number;
      rate: number;
    }[] = [];
    for (const p of builds.pairs) {
      const other = p.a.key === anchor ? p.b : p.b.key === anchor ? p.a : null;
      if (!other) continue;
      out.push({
        key: other.key,
        name: other.name,
        image: other.image,
        co: p.n,
        rate: base > 0 ? (p.n / base) * 100 : 0,
      });
    }
    return out.sort((a, b) => b.co - a.co).slice(0, 8);
  }, [anchor, builds.pairs, supportOf]);

  const maxRate = Math.max(1, ...partners.map((p) => p.rate));
  const anchorItem = builds.items.find((it) => it.key === anchor);

  const selector = (
    <select
      value={anchor}
      onChange={(e) => setAnchor(e.target.value)}
      className="max-w-[10rem] bg-primary-950/50 border border-primary-500/20 rounded px-2 py-1 text-xs text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
    >
      {candidates.map((it) => (
        <option key={it.key} value={it.key} className="bg-primary-900">
          {it.name}
        </option>
      ))}
    </select>
  );

  return (
    <Widget title="Paired With" action={selector}>
      {partners.length === 0 ? (
        <p className="text-sm text-white/40 py-2">
          No co-occurrence recorded yet. This fills in as visitors stack
          filters.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Icon
              image={anchorItem?.image}
              name={anchorItem?.name ?? ""}
              className="size-6"
            />
            <span className="font-medium">{anchorItem?.name}</span>
            <span className="text-xs text-white/30">
              active in {pctFmt.format(supportOf.get(anchor) ?? 0)} snapshots
            </span>
          </div>
          <ol className="flex flex-col gap-1">
            {partners.map((p) => (
              <li
                key={p.key}
                className="relative flex items-center gap-2 py-1 px-1.5 text-sm"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-sm bg-primary-400/15"
                  style={{ width: `${Math.max((p.rate / maxRate) * 100, 2)}%` }}
                />
                <Icon image={p.image} name={p.name} className="relative" />
                <span className="relative flex-1 min-w-0 truncate">
                  {p.name}
                </span>
                <span className="relative shrink-0 tabular-nums text-white/50">
                  {pctFmt.format(p.rate)}%
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
    </Widget>
  );
}
