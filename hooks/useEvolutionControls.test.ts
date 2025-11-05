import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  createInitialEvolutionControlsState,
  useAppStore,
} from "@/hooks/useAppStore";
import { useEvolutionControls } from "@/hooks/useEvolutionControls";
import type {
  TEvolutionElement,
  TEvolutionItem,
  TWeaponEvolution,
} from "@/data/types";

const PASSIVE_NAME = "Attractorb";
const BASE_WEAPON_NAME = "Santa Water";
const UNION_WEAPON_NAME = "Hydro Storm";
const BASE_RESULT = "La Borra";
const UNION_RESULT = "Hydro Pump Climax";

const toItem = (element: TEvolutionElement): element is TEvolutionItem =>
  typeof element !== "string";

const getResultName = (evolution: TWeaponEvolution): string => {
  const equalsIndex = evolution.elements.findIndex((element) => element === "=");

  if (equalsIndex === -1) {
    const lastElement = evolution.elements.at(-1);
    return toItem(lastElement as TEvolutionElement) ? lastElement.item.name : "";
  }

  const resultElement = evolution.elements
    .slice(equalsIndex + 1)
    .find((element): element is TEvolutionItem => toItem(element));

  return resultElement?.item.name ?? "";
};

const resetStore = async () => {
  const persist = (useAppStore as typeof useAppStore & {
    persist?: {
      clearStorage: () => Promise<void>;
    };
  }).persist;

  await persist?.clearStorage?.();

  useAppStore.setState({
    evolutionControls: createInitialEvolutionControlsState(),
    collapsibleState: {},
    passivesShowDerivedRecipes: false,
    weaponsShowDerivedRecipes: false,
  } as unknown as ReturnType<typeof useAppStore.getState>);
};

const selectPassives = (...passives: string[]) => {
  useAppStore.setState((state) => ({
    evolutionControls: {
      ...state.evolutionControls,
      selectedPassives: passives,
      selectedWeapons: [],
    },
  }));
};

const selectWeapons = (...weapons: string[]) => {
  useAppStore.setState((state) => ({
    evolutionControls: {
      ...state.evolutionControls,
      selectedPassives: [],
      selectedWeapons: weapons,
    },
  }));
};

describe("useEvolutionControls unions toggles", () => {
  beforeEach(async () => {
    await resetStore();
  });

  it("shows only direct matches when passive is selected and toggles are disabled", () => {
    selectPassives(PASSIVE_NAME);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(BASE_RESULT);
    expect(resultNames).not.toContain(UNION_RESULT);
  });

  it("includes related union when passive toggle is enabled", () => {
    selectPassives(PASSIVE_NAME);
    useAppStore.setState({
      passivesShowDerivedRecipes: true,
    } as unknown as Partial<ReturnType<typeof useAppStore.getState>>);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(BASE_RESULT);
    expect(resultNames).toContain(UNION_RESULT);
  });

  it("does not include union when base weapon is selected and toggle is disabled", () => {
    selectWeapons(BASE_WEAPON_NAME);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(BASE_RESULT);
    expect(resultNames).not.toContain(UNION_RESULT);
  });

  it("includes related union when weapon toggle is enabled", () => {
    selectWeapons(BASE_WEAPON_NAME);
    useAppStore.setState({
      weaponsShowDerivedRecipes: true,
    } as unknown as Partial<ReturnType<typeof useAppStore.getState>>);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(BASE_RESULT);
    expect(resultNames).toContain(UNION_RESULT);
  });

  it("does not include ancestor evolution when union component is selected and toggle is disabled", () => {
    selectWeapons(UNION_WEAPON_NAME);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(UNION_RESULT);
    expect(resultNames).not.toContain(BASE_RESULT);
  });

  it("includes ancestor evolution when weapon toggle is enabled and union weapon is selected", () => {
    selectWeapons(UNION_WEAPON_NAME);
    useAppStore.setState({
      weaponsShowDerivedRecipes: true,
    } as unknown as Partial<ReturnType<typeof useAppStore.getState>>);

    const { result } = renderHook(() => useEvolutionControls());
    const resultNames = result.current.filteredEvolutions.map(getResultName);

    expect(resultNames).toContain(UNION_RESULT);
    expect(resultNames).toContain(BASE_RESULT);
  });
});
