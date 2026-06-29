"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { TBuilds } from "@/lib/stats";
import { Widget } from "@/components/stats/Widget";
import { Icon } from "@/components/stats/Icon";
import { cn } from "@/lib/utils";

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

  // Anchor options: every item that has at least one recorded partner. Items
  // with no co-occurrence are dropped since they'd show an empty partner list.
  const candidates = useMemo(
    () => builds.items.filter((it) => builds.affinity[it.key]?.length),
    [builds.items, builds.affinity]
  );
  const [anchor, setAnchor] = useState(() => candidates[0]?.key ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);

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
    <button
      type="button"
      onClick={() => setPickerOpen(true)}
      className="flex items-center gap-1.5 max-w-[12rem] bg-primary-950/50 border border-primary-500/20 rounded px-2 py-1 text-xs text-white/80 hover:bg-primary-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50"
    >
      <Icon image={anchorItem?.image} name={anchorItem?.name ?? ""} className="size-4" />
      <span className="min-w-0 truncate">{anchorItem?.name ?? "Pick item"}</span>
      <ChevronDown className="size-3.5 shrink-0 text-white/40" aria-hidden />
    </button>
  );

  return (
    <Widget title="Paired With" action={selector}>
      {pickerOpen && (
        <ItemPicker
          items={candidates}
          selected={anchor}
          onSelect={(key) => {
            setAnchor(key);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
      {partners.length === 0 ? (
        <p className="text-sm text-white/40 py-2">
          No co-occurrence recorded yet. This fills in as visitors stack filters.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Icon image={anchorItem?.image} name={anchorItem?.name ?? ""} className="size-6" />
            <span className="font-medium">{anchorItem?.name}</span>
            <span className="text-xs text-white/30">
              active in {pctFmt.format(supportOf.get(anchor) ?? 0)} snapshots
            </span>
          </div>
          <ol className="flex flex-col gap-1">
            {partners.map((p) => (
              <li key={p.key} className="relative flex items-center gap-2 py-1 px-1.5 text-sm">
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 rounded-sm bg-primary-400/15"
                  style={{ width: `${Math.max((p.rate / maxRate) * 100, 2)}%` }}
                />
                <Icon image={p.image} name={p.name} className="relative" />
                <span className="relative flex-1 min-w-0 truncate">{p.name}</span>
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

type TPickerItem = { key: string; name: string; image?: string };

/**
 * Modal item grid. Icons only (names on hover/aria); clicking one selects it
 * and closes. Replaces the cramped native dropdown for picking the anchor.
 */
function ItemPicker({
  items,
  selected,
  onSelect,
  onClose,
}: {
  items: TPickerItem[];
  selected: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pick an item"
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-primary-500/20 bg-primary-900 p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80">Pick an item</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-7 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Close"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
        <div className="grid max-h-[60vh] grid-cols-8 gap-1 overflow-y-auto sm:grid-cols-8 sm:gap-1.5">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              onClick={() => onSelect(it.key)}
              title={it.name}
              className={cn(
                "flex aspect-square items-center justify-center rounded border p-0.5 transition hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-400/50 sm:p-1",
                it.key === selected ? "border-primary-400/60 bg-primary-400/15" : "border-white/5"
              )}
            >
              <Icon image={it.image} name={it.name} className="size-[1.4rem] sm:size-7" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
