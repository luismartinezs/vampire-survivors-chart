/**
 * Warhammer Survivors items and evolutions. data/warhammer.json is extracted
 * from the game files by scripts/engineering/extract-warhammer.py; this module
 * shapes it into the same types the Vampire Survivors data uses, one chart per
 * universe. The universes play as separate games, so an item available in both
 * (Nuln Oil, every passive) appears in each chart as that universe's own.
 */

import data from "./warhammer.json";
import { aos, w40k } from "./constants";
import type { TEvolutionElement, TItem, TItemType, TWeaponEvolution } from "./types";

type TUniverse = typeof w40k | typeof aos;
type TGameItem = (typeof data.items)[keyof typeof data.items];

function universe(key: TUniverse) {
  const items = new Map<string, TItem>();
  for (const [id, item] of Object.entries(data.items) as [string, TGameItem][]) {
    if (!item.silos.includes(key)) continue;
    items.set(id, {
      name: item.name,
      image: item.image,
      type: item.type as TItemType,
      evolved: item.evolved || undefined,
      dlc: key,
    });
  }
  const item = (id: string) => {
    const found = items.get(id);
    if (!found) throw new Error(`warhammer.json: ${id} is not in ${key}`);
    return found;
  };

  const evolutions: TWeaponEvolution[] = data.evolutions
    .filter((evo) => items.has(evo.weapon))
    .map((evo, i) => ({
      id: i + 1,
      dlc: key,
      elements: [
        { item: item(evo.weapon) },
        ...evo.passives.flatMap((p): TEvolutionElement[] => ["+", { item: item(p) }]),
        "=",
        { item: item(evo.result) },
      ],
    }));

  // Only items that appear in this universe's recipes, in recipe order.
  const used = new Map<string, TItem>();
  for (const evo of evolutions) {
    for (const el of evo.elements) if (typeof el !== "string") used.set(el.item.name, el.item);
  }
  const ofType = (type: TItemType) =>
    Object.fromEntries([...used].filter(([, it]) => it.type === type));

  return { evolutions, weapons: ofType("weapon"), passives: ofType("passive") };
}

export const warhammer40k = universe(w40k);
export const ageOfSigmar = universe(aos);
