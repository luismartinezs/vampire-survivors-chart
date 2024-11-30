import { useState, useCallback, useMemo } from "react";
import { TDlc, TEvolutionItem } from "@/data/types";
import { evolutions } from "@/data/evolutions";

const ignoredPassives = ["Weapon Power-Up"];

export function useEvolutionControls() {
  const [sortByPassive, setSortByPassive] = useState(false);
  const [selectedDlcs, setSelectedDlcs] = useState<Set<TDlc>>(
    new Set(["base", "lotm", "todf", "em", "og", "otc"])
  );
  const [selectedPassives, setSelectedPassives] = useState<Set<string>>(new Set());

  const toggleDlc = useCallback((dlc: TDlc) => {
    setSelectedDlcs((prev) => {
      const next = new Set(prev);
      if (next.has(dlc)) {
        next.delete(dlc);
        // Always keep at least one DLC selected
        if (next.size === 0) next.add("base");
      } else {
        next.add(dlc);
      }
      return next;
    });
  }, []);

  const togglePassive = useCallback((passiveName: string) => {
    setSelectedPassives((prev) => {
      const next = new Set(prev);
      if (next.has(passiveName)) {
        next.delete(passiveName);
      } else {
        next.add(passiveName);
      }
      return next;
    });
  }, []);

  const resetPassives = useCallback(() => {
    setSelectedPassives(new Set());
  }, []);

  const toggleSortByPassive = useCallback(() => {
    setSortByPassive((prev) => !prev);
  }, []);

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
        if (!sortByPassive) return 0;

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
  }, [selectedDlcs, sortByPassive, getPassiveName, selectedPassives]);

  return {
    sortByPassive,
    selectedDlcs,
    selectedPassives,
    toggleDlc,
    togglePassive,
    resetPassives,
    toggleSortByPassive,
    filteredAndSortedEvolutions,
  };
}