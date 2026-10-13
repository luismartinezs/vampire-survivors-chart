/**
 * Build-time view model for the chart page. Produces two documents:
 *
 *   - `page`: everything site/templates/index.html renders into static HTML.
 *   - `client`: the compact index client/chart.ts filters with at runtime,
 *     inlined into the page as JSON.
 *
 * Class strings are resolved here with cn() (tailwind-merge) so the HTML and the
 * runtime class swaps produce exactly the strings the React components did.
 */

import { evolutions } from "@/data/evolutions";
import { items } from "@/data/items";
import { passives } from "@/data/passives";
import { weapons } from "@/data/weapons";
import { PASSIVE_IDS, WEAPON_IDS, DLC_IDS } from "@/data/ids";
import { base } from "@/data/constants";
import type { TDlc, TItem } from "@/data/types";
import { DLC_LABELS, dlcClasses } from "@/lib/dlc";
import { buildFilterIndex, type TFilterIndex } from "@/lib/filter";
import { cn } from "@/lib/utils";
import { getWikiHref } from "@/lib/wiki";

/** Item kind as the client sees it: passive, unevolved weapon, evolved weapon, misc. */
export type TItemKind = "p" | "w" | "e" | "m";

/** [name, icon class, wiki href ("" when none), kind, analytics wire id ("" when none)] */
export type TClientItem = [string, string, string, TItemKind, string];

/** Class strings for a toggleable control: [unselected, selected]. */
export type TToggleClasses = [string, string];

export type TClientIndex = TFilterIndex & {
  items: TClientItem[];
  dlcs: { key: TDlc; wire: string; cls: TToggleClasses }[];
  /** Weapon/passive filter buttons, per DLC. */
  controlCls: Record<TDlc, TToggleClasses>;
  /** Reset-weapons / reset-passives buttons ("selected" when nothing is selected). */
  resetCls: TToggleClasses;
  sortCls: TToggleClasses;
  /** Collapsible header: [closed, open]. */
  collapsibleCls: TToggleClasses;
};

const BUTTON_BASE = "rounded font-medium transition-colors";
const BUTTON_SM = "px-1.5 py-0.5 text-xs sm:px-1 sm:py-0.5 sm:text-sm md:px-2 md:py-1 md:text-base";
const BUTTON_DEFAULT_SIZE = "px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5";
const BUTTON_OUTLINE =
  "border border-primary-400 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300";

const smOutlineButton = (className: string) =>
  cn(BUTTON_BASE, BUTTON_SM, BUTTON_OUTLINE, className);

const toggle = (className: string, dlc: TDlc): TToggleClasses => [
  smOutlineButton(cn(className, dlcClasses[dlc].unselected)),
  smOutlineButton(cn(className, dlcClasses[dlc].selected)),
];

const collapsibleHeader = (open: boolean) =>
  cn(
    BUTTON_BASE,
    BUTTON_DEFAULT_SIZE,
    BUTTON_OUTLINE,
    "w-full flex items-center justify-between py-1 sm:py-3 px-2 sm:px-4",
    "text-xs sm:text-sm font-medium tracking-wide text-primary-100",
    "hover:bg-primary/10 active:bg-primary/20",
    "border border-primary-500 shadow-xs",
    "transition-colors duration-200 ease-in-out",
    open
      ? "rounded-t-[8px] sm:rounded-t-[12px] rounded-b-none border-b-0"
      : "rounded-[8px] sm:rounded-[12px]"
  );

const cardClass = (dlc: TDlc) =>
  cn(
    "cursor-pointer rounded border p-1 text-left transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70 sm:p-2",
    dlcClasses[dlc].card.bg,
    dlcClasses[dlc].card.border,
    "hover:bg-white/10"
  );

export function buildChartView() {
  const itemList: TItem[] = Object.values(items);
  const filterIndex = buildFilterIndex(evolutions, itemList);
  const t = new Map(itemList.map((item, i) => [item.name, i]));
  const itemNo = (item: TItem) => t.get(item.name)!;

  const wireByName = new Map<string, string>();
  for (const [key, w] of Object.entries(weapons)) {
    if (WEAPON_IDS[key] != null) wireByName.set(w.name, `w${WEAPON_IDS[key]}`);
  }
  for (const [key, p] of Object.entries(passives)) {
    if (PASSIVE_IDS[key] != null) wireByName.set(p.name, `p${PASSIVE_IDS[key]}`);
  }

  const kindOf = (item: TItem): TItemKind =>
    item.type === "passive" ? "p" : item.type === "weapon" ? (item.evolved ? "e" : "w") : "m";

  const dlcKeys = Object.keys(DLC_LABELS) as TDlc[];
  const controlCls = Object.fromEntries(
    dlcKeys.map((dlc) => [dlc, toggle("p-1 aspect-square", dlc)])
  ) as Record<TDlc, TToggleClasses>;
  const resetCls = toggle("p-1 aspect-square h-full", base);

  const seenIds = new Set<number>();
  for (const evo of evolutions) {
    if (seenIds.has(evo.id)) throw new Error(`Duplicate evolution id ${evo.id}`);
    seenIds.add(evo.id);
  }

  const control = (item: TItem) => ({
    t: itemNo(item),
    name: item.name,
    icon: item.image,
    dlc: item.dlc ?? base,
    cls: controlCls[item.dlc ?? base][0],
  });

  const viewItem = (item: TItem) => ({ t: itemNo(item), name: item.name, icon: item.image });

  const client: TClientIndex = {
    ...filterIndex,
    items: itemList.map((item) => [
      item.name,
      item.image,
      getWikiHref(item.wikiPath) ?? "",
      kindOf(item),
      wireByName.get(item.name) ?? "",
    ]),
    dlcs: dlcKeys.map((key) => ({
      key,
      wire: DLC_IDS[key] != null ? `d${DLC_IDS[key]}` : "",
      cls: toggle("min-h-[30px] px-2", key),
    })),
    controlCls,
    resetCls,
    sortCls: toggle("min-h-[30px] px-2", base),
    collapsibleCls: [collapsibleHeader(false), collapsibleHeader(true)],
  };

  const page = {
    dlcs: dlcKeys.map((key) => ({
      key,
      full: DLC_LABELS[key].full,
      short: DLC_LABELS[key].short,
      cls: client.dlcs.find((d) => d.key === key)!.cls[1],
    })),
    sortCls: client.sortCls[0],
    resetCls: resetCls[1],
    collapsible: { closed: client.collapsibleCls[0], open: client.collapsibleCls[1] },
    weapons: Object.values(weapons)
      .filter((w) => !w.evolved)
      .map(control),
    passives: Object.values(passives).map(control),
    evolutions: evolutions.map((evo) => ({
      id: evo.id,
      cls: cardClass(evo.dlc ?? base),
      elements: evo.elements.map((el) =>
        typeof el === "string"
          ? { op: el }
          : {
              op: "",
              ...viewItem(el.item),
              // Only "max" has a badge; each badge stacks 8.5px below the previous tag slot.
              maxBadgeTops: (el.tags ?? []).flatMap((tag, n) =>
                tag.toLowerCase() === "max" ? [n * 8.5] : []
              ),
            }
      ),
    })),
    legend: {
      alucardShield: weapons.alucardShield.image,
      ringsOfCalamity: weapons.ringsOfCalamity.image,
      miracleOfMultiplication: weapons.miracleOfMultiplication.image,
      penshinFatcha: weapons.penshinFatcha.image,
    },
  };

  return { page, client };
}
