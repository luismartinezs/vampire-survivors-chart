/**
 * Warhammer Survivors items and evolutions. data/warhammer.json is extracted
 * from the game files by scripts/engineering/extract-warhammer.py; this module
 * shapes it into the same types the Vampire Survivors data uses, one chart per
 * universe. The universes play as separate games, so an item available in both
 * (Nuln Oil, every passive) appears in each chart as that universe's own.
 */

import data from "./warhammer.json";
import { aos, w40k } from "./constants";
import type { TEvolutionElement, TItem, TItemType, TLegendNote, TWeaponEvolution } from "./types";

type TUniverse = typeof w40k | typeof aos;
type TGameItem = (typeof data.items)[keyof typeof data.items];
/** A recipe as the extractor writes it (inferred JSON types can't express the empty lists). */
type TGameEvolution = {
  weapon: string;
  passives: string[];
  max: string[];
  result: string;
  /** Set on recipes with no passive: what makes them evolve (see TRIGGER_NOTES). */
  trigger: "chest" | "special" | null;
  gift: boolean;
};
const gameEvolutions = data.evolutions as TGameEvolution[];

/**
 * Legend lines for the recipes with no passive (drawn "weapon → result"), keyed
 * by result. The extractor marks them with a `trigger`; every one needs a note.
 */
const CHEST_NOTE = "Small chance to evolve when an evolution chest opens. Higher Chance raises it.";
const TRIGGER_NOTES: Record<string, { icon: string; text: string }> = {
  WS_40K_RELIQUARY: { icon: "WS_40K_ARCHEOTECH", text: CHEST_NOTE },
  WS_AOS_ARTEFACTS_OF_POWER: { icon: "WS_AOS_EXOTIC_WEAPONRY", text: CHEST_NOTE },
  // The game keeps this condition in code. The relic's description and the
  // level-60 morph (atma.gg) say how it works.
  WS_AOS_LONG_FUSIL: {
    icon: "WS_AOS_RELIC_AMBERBONE",
    text: "Relic found on Gnarlwood. With it, Juntar Bernskyn's Fusil-Cannon evolves when he reaches level 60.",
  },
};

/** Items another recipe starts from: an evolved one among them stays pickable in the Weapons filter. */
const bases = new Set(gameEvolutions.map((evo) => evo.weapon));

function universe(key: TUniverse) {
  const items = new Map<string, TItem>();
  for (const [id, item] of Object.entries(data.items) as [string, TGameItem][]) {
    if (!item.silos.includes(key)) continue;
    items.set(id, {
      name: item.name,
      image: item.image,
      type: item.type as TItemType,
      evolved: item.evolved || undefined,
      pickable: (item.evolved && bases.has(id)) || undefined,
      dlc: key,
    });
  }
  const item = (id: string) => {
    const found = items.get(id);
    if (!found) throw new Error(`warhammer.json: ${id} is not in ${key}`);
    return found;
  };

  const evolutions: TWeaponEvolution[] = gameEvolutions
    .filter((evo) => items.has(evo.weapon))
    .map((evo, i) => ({
      id: i + 1,
      dlc: key,
      elements: evo.trigger
        ? [{ item: item(evo.weapon) }, "→", { item: item(evo.result) }]
        : [
            { item: item(evo.weapon) },
            ...evo.passives.flatMap((p): TEvolutionElement[] => [
              "+",
              evo.max.includes(p) ? { item: item(p), tags: ["max"] } : { item: item(p) },
            ]),
            "=",
            { item: item(evo.result) },
          ],
    }));

  const notes: TLegendNote[] = gameEvolutions
    .filter((evo) => evo.trigger && items.has(evo.weapon))
    .map((evo) => {
      const note = TRIGGER_NOTES[evo.result];
      if (!note) throw new Error(`warhammer.ts: no legend note for ${evo.result} (${evo.trigger})`);
      const icon = item(note.icon);
      return { icon: icon.image, name: icon.name, text: note.text };
    });

  // Only items that appear in this universe's recipes, in recipe order.
  const used = new Map<string, TItem>();
  for (const evo of evolutions) {
    for (const el of evo.elements) if (typeof el !== "string") used.set(el.item.name, el.item);
  }
  const ofType = (type: TItemType) =>
    Object.fromEntries([...used].filter(([, it]) => it.type === type));

  return { evolutions, weapons: ofType("weapon"), passives: ofType("passive"), notes };
}

export const warhammer40k = universe(w40k);
export const ageOfSigmar = universe(aos);
