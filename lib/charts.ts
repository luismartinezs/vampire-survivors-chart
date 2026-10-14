/**
 * Every evolution chart the site renders. Each one becomes a page that
 * site/templates/chart.html renders from data/chart-<key>.json (the content
 * file picks it with `extra.chart`).
 */

import { evolutions } from "@/data/evolutions";
import { items } from "@/data/items";
import { passives } from "@/data/passives";
import { weapons } from "@/data/weapons";
import { ageOfSigmar, warhammer40k } from "@/data/warhammer";
import { aos, w40k } from "@/data/constants";
import type { TDlc, TItem, TWeaponEvolution } from "@/data/types";

export type TChart = {
  key: string;
  /** localStorage key for the page's saved filters. "app-store" predates the other charts. */
  storageKey: string;
  /** Send clicks to the tracker. Its wire ids (data/ids.ts) only cover Vampire Survivors. */
  tracked: boolean;
  /** DLC toggles, in display order. Items without a DLC belong to the first. */
  dlcs: TDlc[];
  evolutions: TWeaponEvolution[];
  weapons: Record<string, TItem>;
  passives: Record<string, TItem>;
  /** Every item the evolutions reference; its order numbers the items (`data-t`). */
  items: TItem[];
  /** Icon classes for the legend under the chart, keyed by what the template shows. */
  legend?: Record<string, string>;
};

const VS_DLCS: TDlc[] = ["base", "lotm", "lotbm", "todf", "em", "og", "otc", "ed", "ante"];

const warhammerChart = (key: string, universe: typeof warhammer40k, dlc: TDlc): TChart => ({
  key,
  storageKey: `chart-${key}`,
  tracked: false,
  dlcs: [dlc],
  ...universe,
  items: [...Object.values(universe.passives), ...Object.values(universe.weapons)],
});

export const CHARTS: TChart[] = [
  {
    key: "vs",
    storageKey: "app-store",
    tracked: true,
    dlcs: VS_DLCS,
    evolutions,
    weapons,
    passives,
    items: Object.values(items),
    legend: {
      alucardShield: weapons.alucardShield.image,
      ringsOfCalamity: weapons.ringsOfCalamity.image,
      miracleOfMultiplication: weapons.miracleOfMultiplication.image,
      penshinFatcha: weapons.penshinFatcha.image,
    },
  },
  warhammerChart("w40k", warhammer40k, w40k),
  warhammerChart("aos", ageOfSigmar, aos),
];
