import { describe, expect, it } from "vitest";

import { buildChartView } from "@/lib/chart-view";
import { CHARTS } from "@/lib/charts";
import { filterEvolutions } from "@/lib/filter";

const chart = (key: string) => CHARTS.find((c) => c.key === key)!;

/** Result names of the evolutions a passive selection matches. */
function resultsFor(key: string, passive: string): string[] {
  const { client } = buildChartView(chart(key));
  const t = client.names.indexOf(passive);
  const { filtered } = filterEvolutions(client, {
    selectedDlcs: new Set(client.dlcs.map((d) => d.key)),
    selectedPassives: new Set([t]),
    selectedWeapons: new Set(),
    sortByPassive: false,
    passivesShowDerivedRecipes: false,
    weaponsShowDerivedRecipes: false,
  });
  const evos = chart(key).evolutions;
  return filtered.map((id) => {
    const last = evos.find((e) => e.id === id)!.elements.at(-1)!;
    return typeof last === "string" ? last : last.item.name;
  });
}

describe("charts", () => {
  it("every chart builds a view model", () => {
    for (const c of CHARTS) expect(() => buildChartView(c)).not.toThrow();
  });

  it("keeps saved filters apart per chart", () => {
    const keys = CHARTS.map((c) => c.storageKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(chart("vs").storageKey).toBe("app-store");
  });

  it("only sends Vampire Survivors clicks to the tracker", () => {
    for (const c of CHARTS.filter((c) => c.key !== "vs")) {
      const { client } = buildChartView(c);
      expect(client.tracked).toBe(false);
      expect(client.items.every((item) => item[4] === "")).toBe(true);
      expect(client.dlcs.every((d) => d.wire === "")).toBe(true);
    }
  });
});

describe("warhammer charts", () => {
  it("filters each universe by its own recipes", () => {
    expect(resultsFor("w40k", "Dice Cube")).toEqual(["Heavy Bolter"]);
    expect(resultsFor("aos", "Dice Cube")).toEqual(["Typhoon Crossbow"]);
  });

  it("includes items both universes have on each page", () => {
    expect(resultsFor("w40k", "Hourglass")).toEqual(["Mordant Earth"]);
    expect(resultsFor("aos", "Hourglass")).toEqual(["Mordant Earth"]);
  });

  it("treats each universe as its own game", () => {
    for (const key of ["w40k", "aos"]) {
      const c = chart(key);
      expect(c.dlcs).toEqual([key]);
      for (const item of c.items) expect(item.dlc).toBe(key);
    }
  });
});
