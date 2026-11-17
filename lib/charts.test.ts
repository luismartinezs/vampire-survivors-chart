import { describe, expect, it } from "vitest";

import { buildChartView } from "@/lib/chart-view";
import { CHARTS } from "@/lib/charts";
import { filterEvolutions } from "@/lib/filter";

const chart = (key: string) => CHARTS.find((c) => c.key === key)!;

/** Result names of the evolutions a passive (or, with `kind: "weapon"`, weapon) selection matches. */
function resultsFor(key: string, name: string, kind: "passive" | "weapon" = "passive"): string[] {
  const { client } = buildChartView(chart(key));
  const t = client.names.indexOf(name);
  expect(t).toBeGreaterThanOrEqual(0);
  const { filtered } = filterEvolutions(client, {
    selectedDlcs: new Set(client.dlcs.map((d) => d.key)),
    selectedPassives: new Set(kind === "passive" ? [t] : []),
    selectedWeapons: new Set(kind === "weapon" ? [t] : []),
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

  it("marks passives that must be at max level", () => {
    const evo = chart("aos").evolutions.find((e) => {
      const last = e.elements.at(-1)!;
      return typeof last !== "string" && last.item.name === "Ghal Maraz";
    })!;
    const pendant = evo.elements.find((el) => typeof el !== "string" && el.item.name === "Null Pendant");
    expect(pendant).toMatchObject({ tags: ["max"] });
  });

  it("chains evolutions of evolved weapons", () => {
    expect(resultsFor("aos", "Tactical Rock")).toEqual(["Uskavar the Sunderer"]);
    expect(resultsFor("aos", "Null Pendant")).toEqual(["Ghal Maraz"]);
  });

  it("lists an evolved weapon another recipe starts from in the Weapons filter", () => {
    const { page, client } = buildChartView(chart("aos"));
    expect(page.weapons.map((w) => w.name)).toContain("Uskavar the Sunderer");
    expect(page.weapons.map((w) => w.name)).not.toContain("Ghal Maraz");
    const uskavar = client.items.find((item) => item[0] === "Uskavar the Sunderer")!;
    expect(uskavar[3]).toBe("w");
    expect(resultsFor("aos", "Uskavar the Sunderer", "weapon")).toEqual(["Ghal Maraz"]);
    expect(resultsFor("aos", "Stormcharged Hammer", "weapon")).toEqual(["Uskavar the Sunderer"]);
  });

  it("draws evolutions with no passive as weapon ⇒ result, explained in the legend", () => {
    const recipe = (key: string, result: string) =>
      chart(key)
        .evolutions.find((e) => {
          const last = e.elements.at(-1)!;
          return typeof last !== "string" && last.item.name === result;
        })!
        .elements.map((el) => (typeof el === "string" ? el : el.item.name));
    expect(recipe("aos", "Long-Fusil")).toEqual(["Fusil-Cannon", "⇒", "Long-Fusil"]);
    expect(recipe("aos", "Artefacts Of Power")).toEqual(["Exotic Weaponry", "⇒", "Artefacts Of Power"]);
    expect(recipe("w40k", "Reliquary")).toEqual(["Archeotech", "⇒", "Reliquary"]);

    expect(Object.keys(chart("aos").passives)).not.toContain("Amberbone");
    expect(chart("aos").notes!.map((n) => n.name)).toEqual(["Long-Fusil", "Exotic Weaponry"]);
    expect(chart("w40k").notes!.map((n) => n.name)).toEqual(["Archeotech"]);
    expect(chart("vs").notes).toBeUndefined();
  });

  it("treats each universe as its own game", () => {
    for (const key of ["w40k", "aos"]) {
      const c = chart(key);
      expect(c.dlcs).toEqual([key]);
      for (const item of c.items) expect(item.dlc).toBe(key);
    }
  });
});
