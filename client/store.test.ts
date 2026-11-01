import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, SETTINGS_STORAGE_KEY } from "./settings";
import { defaultState, loadState, saveState } from "./store";

let storage: Map<string, string>;

beforeEach(() => {
  storage = new Map();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });
});

afterEach(() => vi.unstubAllGlobals());

describe("shared chart settings", () => {
  it("uses the same settings on every chart, including the recipe drawer", () => {
    const settings = {
      passivesShowDerivedRecipes: false,
      weaponsShowDerivedRecipes: false,
      showPassivesLoadout: false,
      isRecipeDrawerEnabled: false,
    };
    saveSettings(settings);
    for (const [key, dlc] of [
      ["app-store", "base"],
      ["chart-w40k", "w40k"],
      ["chart-aos", "aos"],
    ]) {
      expect(loadState(key, [dlc])).toMatchObject(settings);
    }
  });

  it("migrates existing settings once and ignores conflicting page settings afterward", () => {
    const legacy = { ...defaultState(["base"]), showPassivesLoadout: false };
    storage.set("app-store", JSON.stringify({ state: legacy, version: 0 }));
    const restored = loadState("app-store", ["base", "lotbm"]);
    expect(restored.evolutionControls.selectedDlcs).toContain("lotbm");
    expect(loadSettings().showPassivesLoadout).toBe(false);
    storage.set("chart-aos", JSON.stringify({ state: defaultState(["aos"]), version: 1 }));
    expect(loadState("chart-aos", ["aos"]).showPassivesLoadout).toBe(false);
    expect(JSON.parse(storage.get("app-store")!).state).not.toHaveProperty("showPassivesLoadout");
  });

  it("keeps selected items separate and prevents stale chart saves from overwriting shared settings", () => {
    const state = loadState("chart-w40k", ["w40k"]);
    state.evolutionControls.selectedWeapons = ["Chainsword"];
    saveSettings({ ...DEFAULT_SETTINGS, showPassivesLoadout: false });
    saveState("chart-w40k", state);
    expect(loadState("chart-w40k", ["w40k"]).evolutionControls.selectedWeapons).toEqual([
      "Chainsword",
    ]);
    expect(loadState("chart-aos", ["aos"]).evolutionControls.selectedWeapons).toEqual([]);
    expect(loadSettings().showPassivesLoadout).toBe(false);
  });

  it("keeps valid saved settings while replacing invalid fields with defaults", () => {
    storage.set(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ showPassivesLoadout: false, isRecipeDrawerEnabled: "false" })
    );
    expect(loadSettings()).toEqual({ ...DEFAULT_SETTINGS, showPassivesLoadout: false });
  });

  it("restores chart filters when the shared settings contain malformed JSON", () => {
    const state = defaultState(["w40k"]);
    state.evolutionControls.selectedPassives = ["Hourglass"];
    saveState("chart-w40k", state);
    storage.set(SETTINGS_STORAGE_KEY, "{");
    expect(loadState("chart-w40k", ["w40k"])).toMatchObject({
      ...DEFAULT_SETTINGS,
      evolutionControls: { selectedPassives: ["Hourglass"] },
    });
  });

  it("keeps the chart usable when browser storage is blocked", () => {
    vi.stubGlobal("window", {
      get localStorage() {
        throw new Error("Storage blocked");
      },
    });
    expect(loadState("chart-w40k", ["w40k"])).toEqual(defaultState(["w40k"]));
    expect(() => saveSettings(DEFAULT_SETTINGS)).not.toThrow();
  });
});
