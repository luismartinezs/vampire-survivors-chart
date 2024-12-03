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
}

const initialState: EvolutionControlsState = {
  sortByPassive: false,
  selectedDlcs: ["base", "lotm", "todf", "em", "og", "otc"],
  selectedPassives: [],
};

type UseEvolutionControlsReturn = {
  sortByPassive: boolean;
  selectedDlcs: Set<TDlc>;
  selectedPassives: Set<string>;
  toggleDlc: (dlc: TDlc) => void;
  togglePassive: (passiveName: string) => void;
  resetPassives: () => void;
  toggleSortByPassive: () => void;
  filteredAndSortedEvolutions: Evolution[];
};

const useEvolutionFiltering = (
  selectedDlcs: Set<TDlc>,
  selectedPassives: Set<string>
) => {
  return useMemo(() => {
    return evolutions.filter((evolution) => {
      // First filter by DLC
      if (!evolution.dlc || !selectedDlcs.has(evolution.dlc)) return false;

      // Then filter by passives if any are selected
      if (selectedPassives.size === 0) return true;

      const evolutionPassives = evolution.elements
        .filter((el): el is TEvolutionItem => typeof el !== "string")
        .filter((el) => el.item.type === "passive")
        .map((el) => el.item.name);

      return evolutionPassives.some((passive) => selectedPassives.has(passive));
    });
  }, [selectedDlcs, selectedPassives]);
};

const useEvolutionSorting = (
  filteredEvolutions: Evolution[],
  sortByPassive: boolean,
  getPassiveName: (evolution: Evolution) => string
) => {
  return useMemo(() => {
    if (!sortByPassive) return filteredEvolutions;

    return [...filteredEvolutions].sort((a, b) => {
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
  }, [filteredEvolutions, sortByPassive, getPassiveName]);
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

  const resetPassives = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        selectedPassives: [],
      })),
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

  const filteredEvolutions = useEvolutionFiltering(selectedDlcs, selectedPassives);
  const filteredAndSortedEvolutions = useEvolutionSorting(
    filteredEvolutions,
    state.sortByPassive,
    getPassiveName
  );

  return {
    sortByPassive: state.sortByPassive,
    selectedDlcs,
    selectedPassives,
    toggleDlc,
    togglePassive,
    resetPassives,
    toggleSortByPassive,
    filteredAndSortedEvolutions,
  };
}