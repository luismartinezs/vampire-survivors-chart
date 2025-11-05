'use client';

import { useCallback, useMemo } from "react";
import { TDlc, TEvolutionItem, TWeaponEvolution } from "@/data/types";
import { evolutions } from "@/data/evolutions";
import { useAppStore } from "@/hooks/useAppStore";

type Evolution = TWeaponEvolution;

const IGNORED_PASSIVES = ["Weapon Power-Up"];
type UseEvolutionControlsReturn = {
  sortByPassive: boolean;
  selectedDlcs: Set<TDlc>;
  selectedPassives: Set<string>;
  toggleDlc: (dlc: TDlc) => void;
  togglePassive: (passiveName: string) => void;
  resetPassives: () => void;
  toggleSortByPassive: () => void;
  filteredEvolutions: Evolution[];
  excludedEvolutions: Evolution[];
  selectedWeapons: Set<string>;
  toggleWeapon: (weaponName: string) => void;
  resetWeapons: () => void;
};

const useEvolutionSorting = (
  evolutions: Evolution[],
  sortByPassive: boolean,
  getPassiveName: (evolution: Evolution) => string
) => {
  return useMemo(() => {
    if (!sortByPassive) return evolutions;

    return [...evolutions].sort((a, b) => {
      const aPassive = getPassiveName(a);
      const bPassive = getPassiveName(b);

      const aHasPassive = hasNonIgnoredPassive(a);
      const bHasPassive = hasNonIgnoredPassive(b);
      const aIsEm = a.dlc === "em";
      const bIsEm = b.dlc === "em";

      // Sorting priority:
      // 1. Non-EM passives
      // 2. EM passives
      // 3. No passives
      if (aHasPassive !== bHasPassive) return bHasPassive ? 1 : -1;
      if (aHasPassive && bHasPassive && aIsEm !== bIsEm) {
        return aIsEm ? 1 : -1;
      }

      return aPassive.localeCompare(bPassive);
    });
  }, [evolutions, sortByPassive, getPassiveName]);
};

function isItem(item: TEvolutionItem | string): item is TEvolutionItem {
  return typeof item !== "string";
}

const useEvolutionFiltering = (
  sortedEvolutions: Evolution[],
  selectedDlcs: Set<TDlc>,
  selectedPassives: Set<string>,
  selectedWeapons: Set<string>
) => {
  return useMemo(() => {
    const filtered = [];
    const unfiltered = [];

    for (const evolution of sortedEvolutions) {
      if (!evolution.dlc || !selectedDlcs.has(evolution.dlc)) {
        continue;
      }

      const arePassivesSelected = selectedPassives.size > 0;
      const areWeaponsSelected = selectedWeapons.size > 0;

      if (!arePassivesSelected && !areWeaponsSelected) {
        filtered.push(evolution);
        continue;
      }

      const evolutionItems = evolution.elements.filter(isItem);
      const evolutionPassives = arePassivesSelected
        ? evolutionItems
          .filter((el) => el.item.type === "passive")
          .map((el) => el.item.name)
        : [];
      const evolutionWeapons = areWeaponsSelected
        ? evolutionItems
          .filter((el) => el.item.type === "weapon" && !el.item.evolved)
          .map((el) => el.item.name)
        : [];

      if (
        evolutionPassives.some((passive) => selectedPassives.has(passive)) ||
        evolutionWeapons.some((weapon) => selectedWeapons.has(weapon))
      ) {
        filtered.push(evolution);
      } else {
        unfiltered.push(evolution);
      }
    }

    return {
      filtered,
      unfiltered,
    };
  }, [sortedEvolutions, selectedDlcs, selectedPassives, selectedWeapons]);
};

const hasNonIgnoredPassive = (evolution: Evolution): boolean => {
  return evolution.elements.some(
    (el) =>
      typeof el !== "string" &&
      el.item.type === "passive" &&
      !IGNORED_PASSIVES.includes(el.item.name)
  );
};

export function useEvolutionControls(): UseEvolutionControlsReturn {
  const sortByPassive = useAppStore(
    (state) => state.evolutionControls.sortByPassive
  );
  const selectedDlcsArray = useAppStore(
    (state) => state.evolutionControls.selectedDlcs
  );
  const selectedPassivesArray = useAppStore(
    (state) => state.evolutionControls.selectedPassives
  );
  const selectedWeaponsArray = useAppStore(
    (state) => state.evolutionControls.selectedWeapons
  );
  const toggleDlc = useAppStore((state) => state.toggleEvolutionDlc);
  const togglePassive = useAppStore(
    (state) => state.toggleEvolutionPassive
  );
  const resetPassives = useAppStore((state) => state.resetEvolutionPassives);
  const toggleSortByPassive = useAppStore(
    (state) => state.toggleEvolutionSortByPassive
  );
  const toggleWeapon = useAppStore((state) => state.toggleEvolutionWeapon);
  const resetWeapons = useAppStore((state) => state.resetEvolutionWeapons);

  const selectedDlcs = useMemo(
    () => new Set(selectedDlcsArray),
    [selectedDlcsArray]
  );
  const selectedPassives = useMemo(
    () => new Set(selectedPassivesArray),
    [selectedPassivesArray]
  );
  const selectedWeapons = useMemo(
    () => new Set(selectedWeaponsArray),
    [selectedWeaponsArray]
  );

  const getPassiveName = useCallback((evolution: Evolution): string => {
    let firstItemName: string | undefined;

    const firstNonIgnoredPassive = evolution.elements.find((element) => {
      if (typeof element === "string") return false;

      if (!firstItemName) {
        firstItemName = element.item.name;
      }

      return (
        element.item.type === "passive" &&
        !IGNORED_PASSIVES.includes(element.item.name)
      );
    }) as TEvolutionItem | undefined;

    return firstNonIgnoredPassive?.item.name ?? firstItemName ?? "";
  }, []);

  const sortedEvolutions = useEvolutionSorting(
    evolutions,
    sortByPassive,
    getPassiveName
  );

  const { filtered, unfiltered } = useEvolutionFiltering(
    sortedEvolutions,
    selectedDlcs,
    selectedPassives,
    selectedWeapons
  );

  return {
    sortByPassive,
    selectedDlcs,
    selectedPassives,
    toggleDlc,
    togglePassive,
    resetPassives,
    toggleSortByPassive,
    filteredEvolutions: filtered,
    excludedEvolutions: unfiltered,
    selectedWeapons,
    toggleWeapon,
    resetWeapons,
  };
}
