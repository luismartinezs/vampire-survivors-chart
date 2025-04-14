import { useCallback, useMemo } from "react";
import { TDlc, TEvolutionItem, TWeaponEvolution } from "@/data/types";
import { evolutions } from "@/data/evolutions";
import { useStorage } from "@/hooks/useStorage";

type Evolution = TWeaponEvolution;

const IGNORED_PASSIVES = ["Weapon Power-Up"];
const DEFAULT_DLC: TDlc = "base";

interface EvolutionControlsState {
  sortByPassive: boolean;
  selectedDlcs: TDlc[];
  selectedPassives: string[];
  selectedWeapons: string[];
}

const initialState: EvolutionControlsState = {
  sortByPassive: false,
  selectedDlcs: ["base", "lotm", "todf", "em", "og", "otc", "ed"],
  selectedPassives: [],
  selectedWeapons: [],
};

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
  const [state, setState] = useStorage<EvolutionControlsState>(
    "evolution-controls",
    initialState
  );

  const selectedDlcs = useMemo(() => new Set(state.selectedDlcs), [state.selectedDlcs]);
  const selectedPassives = useMemo(
    () => new Set(state.selectedPassives),
    [state.selectedPassives]
  );
  const selectedWeapons = useMemo(
    () => new Set(state.selectedWeapons),
    [state.selectedWeapons]
  );

  const toggleDlc = useCallback(
    (dlc: TDlc) => {
      setState((prev) => {
        const nextDlcs = new Set(prev.selectedDlcs);
        if (nextDlcs.has(dlc)) {
          nextDlcs.delete(dlc);
          // Always keep at least one DLC selected
          if (nextDlcs.size === 0) nextDlcs.add(DEFAULT_DLC);
        } else {
          nextDlcs.add(dlc);
        }
        return {
          ...prev,
          selectedDlcs: Array.from(nextDlcs),
        };
      });
    },
    [setState]
  );

  const togglePassive = useCallback(
    (passiveName: string) => {
      setState((prev) => ({
        ...prev,
        selectedPassives: Array.from(
          new Set(
            prev.selectedPassives.includes(passiveName)
              ? prev.selectedPassives.filter((p) => p !== passiveName)
              : [...prev.selectedPassives, passiveName]
          )
        ),
      }));
    },
    [setState]
  );

  const toggleWeapon = useCallback(
    (weaponName: string) => {
      setState((prev) => ({
        ...prev,
        selectedWeapons: Array.from(
          new Set(
            prev.selectedWeapons?.includes(weaponName)
              ? prev.selectedWeapons.filter((w) => w !== weaponName)
              : [...(prev.selectedWeapons || []), weaponName]
          )
        ),
      }));
    },
    [setState]
  );

  const resetPassives = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        selectedPassives: [],
      })),
    [setState]
  );

  const resetWeapons = useCallback(
    () => setState((prev) => ({ ...prev, selectedWeapons: [] })),
    [setState]
  );

  const toggleSortByPassive = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        sortByPassive: !prev.sortByPassive,
      })),
    [setState]
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
    state.sortByPassive,
    getPassiveName
  );

  const { filtered, unfiltered } = useEvolutionFiltering(
    sortedEvolutions,
    selectedDlcs,
    selectedPassives,
    selectedWeapons
  );

  return {
    sortByPassive: state.sortByPassive,
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