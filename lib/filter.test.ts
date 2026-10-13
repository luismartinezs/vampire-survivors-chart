import { describe, expect, it } from "vitest";

import { evolutions } from "@/data/evolutions";
import { items } from "@/data/items";
import type { TEvolutionElement, TEvolutionItem, TWeaponEvolution } from "@/data/types";
import { DLC_LABELS } from "@/lib/dlc";
import { buildFilterIndex, filterEvolutions, type TFilterState } from "@/lib/filter";

const PASSIVE_NAME = "Attractorb";
const BASE_WEAPON_NAME = "Santa Water";
const UNION_WEAPON_NAME = "Hydro Storm";
const BASE_RESULT = "La Borra";
const UNION_RESULT = "Hydro Pump Climax";

const index = buildFilterIndex(evolutions, Object.values(items));
const itemNo = (name: string) => {
  const t = index.names.indexOf(name);
  if (t < 0) throw new Error(`unknown item ${name}`);
  return t;
};

const isItem = (element: TEvolutionElement): element is TEvolutionItem =>
  typeof element !== "string";

const resultName = (evolution: TWeaponEvolution): string => {
  const equalsIndex = evolution.elements.findIndex((element) => element === "=");
  const tail =
    equalsIndex === -1 ? evolution.elements.slice(-1) : evolution.elements.slice(equalsIndex + 1);
  return tail.find(isItem)?.item.name ?? "";
};

const byId = new Map(evolutions.map((e) => [e.id, e]));

function filteredResults(overrides: Partial<TFilterState>): string[] {
  const state: TFilterState = {
    selectedDlcs: new Set(Object.keys(DLC_LABELS)),
    selectedPassives: new Set(),
    selectedWeapons: new Set(),
    sortByPassive: false,
    passivesShowDerivedRecipes: false,
    weaponsShowDerivedRecipes: false,
    ...overrides,
  };
  return filterEvolutions(index, state).filtered.map((id) => resultName(byId.get(id)!));
}

const passives = (...names: string[]) => ({ selectedPassives: new Set(names.map(itemNo)) });
const weapons = (...names: string[]) => ({ selectedWeapons: new Set(names.map(itemNo)) });

describe("filterEvolutions: union recipes", () => {
  it("shows only direct matches when a passive is selected and derived recipes are off", () => {
    const results = filteredResults(passives(PASSIVE_NAME));
    expect(results).toContain(BASE_RESULT);
    expect(results).not.toContain(UNION_RESULT);
  });

  it("includes the related union when derived passive recipes are on", () => {
    const results = filteredResults({
      ...passives(PASSIVE_NAME),
      passivesShowDerivedRecipes: true,
    });
    expect(results).toContain(BASE_RESULT);
    expect(results).toContain(UNION_RESULT);
  });

  it("excludes the union when a base weapon is selected and derived recipes are off", () => {
    const results = filteredResults(weapons(BASE_WEAPON_NAME));
    expect(results).toContain(BASE_RESULT);
    expect(results).not.toContain(UNION_RESULT);
  });

  it("includes the related union when derived weapon recipes are on", () => {
    const results = filteredResults({
      ...weapons(BASE_WEAPON_NAME),
      weaponsShowDerivedRecipes: true,
    });
    expect(results).toContain(BASE_RESULT);
    expect(results).toContain(UNION_RESULT);
  });

  it("excludes the ancestor evolution when a union component is selected and derived recipes are off", () => {
    const results = filteredResults(weapons(UNION_WEAPON_NAME));
    expect(results).toContain(UNION_RESULT);
    expect(results).not.toContain(BASE_RESULT);
  });

  it("includes the ancestor evolution when a union component is selected and derived recipes are on", () => {
    const results = filteredResults({
      ...weapons(UNION_WEAPON_NAME),
      weaponsShowDerivedRecipes: true,
    });
    expect(results).toContain(UNION_RESULT);
    expect(results).toContain(BASE_RESULT);
  });
});

describe("filterEvolutions: DLCs and ordering", () => {
  it("drops evolutions of deselected DLCs from both lists", () => {
    const { filtered, excluded } = filterEvolutions(index, {
      selectedDlcs: new Set(["base"]),
      selectedPassives: new Set(),
      selectedWeapons: new Set(),
      sortByPassive: false,
      passivesShowDerivedRecipes: true,
      weaponsShowDerivedRecipes: true,
    });
    expect(excluded).toEqual([]);
    expect(filtered.every((id) => byId.get(id)!.dlc === "base")).toBe(true);
  });

  it("sorts by passive without losing or duplicating evolutions", () => {
    expect([...index.order.byPassive].sort((a, b) => a - b)).toEqual(
      [...index.order.natural].sort((a, b) => a - b)
    );
  });
});
