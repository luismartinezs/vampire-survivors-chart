import { useCallback, useMemo } from "react";
import { TDlc, TEvolutionItem } from "@/data/types";
import { evolutions } from "@/data/evolutions";
import { useStorage } from "@/hooks/useStorage";

const ignoredPassives = ["Weapon Power-Up"];

interface EvolutionControlsState {
  sortByPassive: boolean;
  selectedDlcs: TDlc[];
  selectedPassives: string[];
}

export function useEvolutionControls() {
  const [state, setState] = useStorage<EvolutionControlsState>("evolution-controls", {
    sortByPassive: false,
    selectedDlcs: ["base", "lotm", "todf", "em", "og", "otc"],
    selectedPassives: [],
  });

  // Convert arrays to Sets for easier operations
  const selectedDlcs = new Set(state.selectedDlcs);
  const selectedPassives = new Set(state.selectedPassives);

  const toggleDlc = useCallback((dlc: TDlc) => {
    setState(prev => {
      const nextDlcs = new Set(prev.selectedDlcs);
      if (nextDlcs.has(dlc)) {
        nextDlcs.delete(dlc);
        // Always keep at least one DLC selected
        if (nextDlcs.size === 0) nextDlcs.add("base");
      } else {
        nextDlcs.add(dlc);
      }
      return {
        ...prev,
        selectedDlcs: Array.from(nextDlcs)
      };
    });
  }, [setState]);

  const togglePassive = useCallback((passiveName: string) => {
    setState(prev => {
      const nextPassives = new Set(prev.selectedPassives);
      if (nextPassives.has(passiveName)) {
        nextPassives.delete(passiveName);
      } else {
        nextPassives.add(passiveName);
      }
      return {
        ...prev,
        selectedPassives: Array.from(nextPassives)
      };
    });
  }, [setState]);

  const resetPassives = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedPassives: []
    }));
  }, [setState]);

  const toggleSortByPassive = useCallback(() => {
    setState(prev => ({
      ...prev,
      sortByPassive: !prev.sortByPassive
    }));
  }, [setState]);

  const getPassiveName = useCallback((evolution: (typeof evolutions)[0]) => {
    let firstItemName: string | undefined;

    const firstNonIgnoredPassive = evolution.elements.find((element) => {
      if (typeof element === "string") {
        return false;
      }

      if (!firstItemName) {
        firstItemName = element.item.name;
      }

      const isPassive = element.item.type === "passive";
      const isNotIgnored = !ignoredPassives.includes(element.item.name);
      return isPassive && isNotIgnored;
    }) as TEvolutionItem | undefined;

    return firstNonIgnoredPassive?.item.name ?? firstItemName ?? "";
  }, []);

  const filteredAndSortedEvolutions = useMemo(() => {
    return evolutions
      .filter((evolution) => {
        // First filter by DLC
        if (!evolution.dlc || !selectedDlcs.has(evolution.dlc)) return false;

        // Then filter by passives if any are selected
        if (selectedPassives.size > 0) {
          const evolutionPassives = evolution.elements
            .filter((el): el is TEvolutionItem => typeof el !== "string")
            .filter(el => el.item.type === "passive")
            .map(el => el.item.name);

          return evolutionPassives.some(passive => selectedPassives.has(passive));
        }

        return true;
      })
      .sort((a, b) => {
        if (!state.sortByPassive) return 0;

        const aPassive = getPassiveName(a);
        const bPassive = getPassiveName(b);

        // Check if either evolution has no passive
        const aHasPassive = a.elements.some(
          (el) => typeof el !== "string" && el.item.type === "passive" && !ignoredPassives.includes(el.item.name)
        );
        const bHasPassive = b.elements.some(
          (el) => typeof el !== "string" && el.item.type === "passive" && !ignoredPassives.includes(el.item.name)
        );

        // Check if evolutions are from 'em' DLC
        const aIsEm = a.dlc === 'em';
        const bIsEm = b.dlc === 'em';

        // First tier: Non-EM passives
        // Second tier: EM passives
        // Third tier: No passives

        if (aHasPassive && !bHasPassive) return -1;
        if (!aHasPassive && bHasPassive) return 1;

        // If both have passives, check EM status
        if (aHasPassive && bHasPassive) {
          if (!aIsEm && bIsEm) return -1;
          if (aIsEm && !bIsEm) return 1;
        }

        // Within same tier, sort by name
        return aPassive.localeCompare(bPassive);
      });
  }, [selectedDlcs, state.sortByPassive, getPassiveName, selectedPassives]);

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