/**
 * Evolution filtering, split in two halves so the browser never needs the full
 * item graph:
 *
 *   - buildFilterIndex() runs at build time over data/*.ts and resolves every
 *     recursive lookup (derived passives/weapons, recipe dependencies) into flat
 *     per-evolution lists of item indices.
 *   - filterEvolutions() runs in the browser on that index: plain set checks plus
 *     the one walk that has to stay dynamic (ancestor propagation, which depends
 *     on the selected DLCs).
 *
 * Items are referenced by their position in `TFilterIndex.items`, the same
 * numbers the HTML carries in `data-t`.
 */

import type {
  TDlc,
  TEvolutionElement,
  TEvolutionItem,
  TItem,
  TWeaponEvolution,
} from "@/data/types";

const IGNORED_PASSIVES = ["Weapon Power-Up"];

export type TFilterEvo = {
  id: number;
  dlc: TDlc | null;
  /** Passive elements. */
  p: number[];
  /** Passive elements plus every passive reachable through its weapon elements. */
  dp: number[];
  /** Unevolved weapon elements. */
  w: number[];
  /** Unevolved weapon elements plus every unevolved weapon reachable through its weapon elements. */
  dw: number[];
  /** Every weapon element, evolved or not (seeds for ancestor propagation). */
  wi: number[];
  /** Every item element (search matching). */
  all: number[];
};

export type TFilterIndex = {
  /** Item names, indexed by item number. */
  names: string[];
  evos: TFilterEvo[];
  /** Evolution ids in display order, for each sort mode. */
  order: { natural: number[]; byPassive: number[] };
  /** Result item -> id of the evolution that produces it. */
  byResult: Record<number, number>;
  /** Result item -> its ingredient items. */
  deps: Record<number, number[]>;
};

export type TFilterState = {
  selectedDlcs: ReadonlySet<string>;
  selectedPassives: ReadonlySet<number>;
  selectedWeapons: ReadonlySet<number>;
  sortByPassive: boolean;
  passivesShowDerivedRecipes: boolean;
  weaponsShowDerivedRecipes: boolean;
};

export type TFilterResult = {
  /** Evolutions matching the selection (all eligible ones when nothing is selected). */
  filtered: number[];
  /** Eligible evolutions that did not match, shown below a separator. */
  excluded: number[];
};

const isItem = (el: TEvolutionElement): el is TEvolutionItem => typeof el !== "string";

/** Recipe graph: result item name -> ingredient names, and result -> evolution. */
function buildDependencyMap(evolutions: TWeaponEvolution[]) {
  const dependencies = new Map<string, string[]>();
  const evolutionByResult = new Map<string, TWeaponEvolution>();

  for (const evolution of evolutions) {
    const equalsIndex = evolution.elements.findIndex((element) => element === "=");
    let resultItemName: string | undefined;
    let ingredients: string[] = [];

    if (equalsIndex !== -1) {
      const resultElement = evolution.elements.slice(equalsIndex + 1).find(isItem);
      if (resultElement) {
        resultItemName = resultElement.item.name;
        ingredients = evolution.elements
          .slice(0, equalsIndex)
          .filter(isItem)
          .map((element) => element.item.name);
      }
    } else {
      const itemElements = evolution.elements.filter(isItem);
      if (itemElements.length >= 2) {
        resultItemName = itemElements[itemElements.length - 1].item.name;
        ingredients = itemElements.slice(0, -1).map((element) => element.item.name);
      }
    }

    if (resultItemName && ingredients.length > 0) {
      dependencies.set(resultItemName, ingredients);
      evolutionByResult.set(resultItemName, evolution);
    }
  }

  return { dependencies, evolutionByResult };
}

/**
 * Memoized walk down the recipe graph collecting the items `collect` accepts.
 * `descend` decides which item types are walked through. Cycles yield nothing.
 */
function createResolver(
  dependencies: Map<string, string[]>,
  itemLookup: Map<string, TItem>,
  collect: (item: TItem) => boolean,
  descend: (item: TItem) => boolean
) {
  const cache = new Map<string, Set<string>>();

  const resolve = (itemName: string, visited: Set<string>): Set<string> => {
    const cached = cache.get(itemName);
    if (cached) return cached;
    if (visited.has(itemName)) return new Set();

    const item = itemLookup.get(itemName);
    if (!item) {
      const empty = new Set<string>();
      cache.set(itemName, empty);
      return empty;
    }

    visited.add(itemName);
    const found = new Set<string>();
    if (collect(item)) found.add(item.name);
    if (descend(item)) {
      for (const ingredient of dependencies.get(itemName) ?? []) {
        for (const name of resolve(ingredient, visited)) found.add(name);
      }
    }
    visited.delete(itemName);
    cache.set(itemName, found);
    return found;
  };

  return (itemName: string) => resolve(itemName, new Set<string>());
}

/** Sort key for "Sort by Passive": the first real passive, else the first item. */
function passiveSortName(evolution: TWeaponEvolution): string {
  let firstItemName: string | undefined;
  for (const element of evolution.elements) {
    if (!isItem(element)) continue;
    firstItemName ??= element.item.name;
    if (element.item.type === "passive" && !IGNORED_PASSIVES.includes(element.item.name)) {
      return element.item.name;
    }
  }
  return firstItemName ?? "";
}

function hasNonIgnoredPassive(evolution: TWeaponEvolution): boolean {
  return evolution.elements.some(
    (el) => isItem(el) && el.item.type === "passive" && !IGNORED_PASSIVES.includes(el.item.name)
  );
}

/**
 * Sort by passive: evolutions with a (non-ignored) passive first, Emergency
 * Meeting ones after the rest, then by passive name.
 */
function sortByPassive(evolutions: TWeaponEvolution[]): TWeaponEvolution[] {
  return [...evolutions].sort((a, b) => {
    const aHasPassive = hasNonIgnoredPassive(a);
    const bHasPassive = hasNonIgnoredPassive(b);
    if (aHasPassive !== bHasPassive) return bHasPassive ? 1 : -1;
    const aIsEm = a.dlc === "em";
    const bIsEm = b.dlc === "em";
    if (aHasPassive && bHasPassive && aIsEm !== bIsEm) return aIsEm ? 1 : -1;
    return passiveSortName(a).localeCompare(passiveSortName(b));
  });
}

export function buildFilterIndex(evolutions: TWeaponEvolution[], items: TItem[]): TFilterIndex {
  const names = items.map((item) => item.name);
  const itemIndex = new Map(names.map((name, i) => [name, i]));
  const itemLookup = new Map(items.map((item) => [item.name, item]));
  const idx = (name: string): number => {
    const i = itemIndex.get(name);
    if (i === undefined) throw new Error(`buildFilterIndex: unknown item "${name}"`);
    return i;
  };
  const toIdx = (set: Iterable<string>) => [...new Set(set)].map(idx);

  const { dependencies, evolutionByResult } = buildDependencyMap(evolutions);
  const resolvePassives = createResolver(
    dependencies,
    itemLookup,
    (item) => item.type === "passive",
    (item) => item.type === "weapon"
  );
  const resolveWeapons = createResolver(
    dependencies,
    itemLookup,
    (item) => item.type === "weapon" && !item.evolved,
    (item) => item.type === "weapon"
  );

  const evos = evolutions.map((evolution): TFilterEvo => {
    const elements = evolution.elements.filter(isItem).map((el) => el.item);
    const passives = elements.filter((item) => item.type === "passive").map((item) => item.name);
    const weaponElements = elements
      .filter((item) => item.type === "weapon")
      .map((item) => item.name);
    const unevolved = elements
      .filter((item) => item.type === "weapon" && !item.evolved)
      .map((item) => item.name);

    const derivedPassives = new Set(passives);
    const derivedWeapons = new Set(unevolved);
    for (const name of weaponElements) {
      for (const p of resolvePassives(name)) derivedPassives.add(p);
      for (const w of resolveWeapons(name)) derivedWeapons.add(w);
    }

    return {
      id: evolution.id,
      dlc: evolution.dlc ?? null,
      p: toIdx(passives),
      dp: toIdx(derivedPassives),
      w: toIdx(unevolved),
      dw: toIdx(derivedWeapons),
      wi: toIdx(weaponElements),
      all: toIdx(elements.map((item) => item.name)),
    };
  });

  const byResult: Record<number, number> = {};
  for (const [name, evolution] of evolutionByResult) byResult[idx(name)] = evolution.id;
  const deps: Record<number, number[]> = {};
  for (const [name, ingredients] of dependencies) deps[idx(name)] = ingredients.map(idx);

  return {
    names,
    evos,
    order: {
      natural: evolutions.map((e) => e.id),
      byPassive: sortByPassive(evolutions).map((e) => e.id),
    },
    byResult,
    deps,
  };
}

const intersects = (list: number[], set: ReadonlySet<number>) => list.some((i) => set.has(i));

export function filterEvolutions(index: TFilterIndex, state: TFilterState): TFilterResult {
  const evoById = new Map(index.evos.map((e) => [e.id, e]));
  const order = state.sortByPassive ? index.order.byPassive : index.order.natural;
  const isEligible = (evo: TFilterEvo) => !evo.dlc || state.selectedDlcs.has(evo.dlc);

  const passivesOn = state.selectedPassives.size > 0;
  const weaponsOn = state.selectedWeapons.size > 0;

  const matched = new Set<number>();
  const matchedByWeapon: TFilterEvo[] = [];

  for (const id of order) {
    const evo = evoById.get(id)!;
    if (!isEligible(evo)) continue;
    if (!passivesOn && !weaponsOn) {
      matched.add(id);
      continue;
    }

    const passiveHit =
      passivesOn &&
      intersects(state.passivesShowDerivedRecipes ? evo.dp : evo.p, state.selectedPassives);
    const weaponHit =
      weaponsOn &&
      intersects(state.weaponsShowDerivedRecipes ? evo.dw : evo.w, state.selectedWeapons);

    if (passiveHit || weaponHit) matched.add(id);
    if (weaponHit) matchedByWeapon.push(evo);
  }

  // Derived weapon recipes also pull in the evolutions that produce each weapon
  // element of a weapon match, recursively through their ingredients.
  if (state.weaponsShowDerivedRecipes && matchedByWeapon.length > 0) {
    const visited = new Set<number>();
    const pullProducer = (item: number) => {
      const producerId = index.byResult[item];
      if (producerId === undefined) return;
      if (!isEligible(evoById.get(producerId)!)) return;
      matched.add(producerId);
      if (visited.has(item)) return;
      visited.add(item);
      for (const ingredient of index.deps[item] ?? []) pullProducer(ingredient);
    };
    for (const evo of matchedByWeapon) {
      for (const item of evo.wi) pullProducer(item);
    }
  }

  const filtered: number[] = [];
  const excluded: number[] = [];
  for (const id of order) {
    if (!isEligible(evoById.get(id)!)) continue;
    (matched.has(id) ? filtered : excluded).push(id);
  }
  return { filtered, excluded };
}
