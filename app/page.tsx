"use client";

import { useState, useCallback, useMemo } from "react";
import EvolutionCard from "@/components/EvolutionCard";
// import { Items } from "@/components/Items";
import { evolutions } from "@/data/evolutions";
import { Controls } from "@/components/Controls";
import { TDlc, TEvolutionItem } from "@/data/types";
import { Legend } from "@/components/Legend";

const ignoredPassives = ["Weapon Power-Up"];

export default function Home() {
  const [sortByPassive, setSortByPassive] = useState(false);
  const [selectedDlcs, setSelectedDlcs] = useState<Set<TDlc>>(
    new Set(["base", "lotm", "todf", "em", "og", "otc"])
  );

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

  const toggleSortByPassive = useCallback(() => {
    setSortByPassive((prev) => !prev);
  }, []);

  const getPassiveName = useCallback((evolution: (typeof evolutions)[0]) => {
    // Track the first item name we encounter as a fallback
    let firstItemName: string | undefined;

    // Find first passive item that isn't in the ignore list
    const firstNonIgnoredPassive = evolution.elements.find((element) => {
      // Skip operator elements (like '+', '=', etc)
      if (typeof element === "string") {
        return false;
      }

      // Store first item name as fallback
      if (!firstItemName) {
        firstItemName = element.item.name;
      }

      // Look for non-ignored passive items
      const isPassive = element.item.type === "passive";
      const isNotIgnored = !ignoredPassives.includes(element.item.name);
      return isPassive && isNotIgnored;
    }) as TEvolutionItem | undefined;

    // Return passive name if found, otherwise fallback to first item name or empty string
    return firstNonIgnoredPassive?.item.name ?? firstItemName ?? "";
  }, []);

  const filteredAndSortedEvolutions = useMemo(() => {
    return (
      evolutions
        // Only show evolutions from selected DLCs
        .filter((evolution) => evolution.dlc && selectedDlcs.has(evolution.dlc))
        // Sort by passive item name if enabled
        .sort((a, b) => {
          if (!sortByPassive) return 0;
          const aPassive = getPassiveName(a);
          const bPassive = getPassiveName(b);
          return aPassive.localeCompare(bPassive);
        })
    );
  }, [selectedDlcs, sortByPassive, getPassiveName]);

  return (
   <>
     <main className="max-w-screen-2xl mx-auto py-4 2xl:px-0 px-1 sm:px-2 md:px-4">
       <div className="w-full flex items-center gap-8 justify-center mb-4">
         <Controls
           sortByPassive={sortByPassive}
           onToggleSortByPassive={toggleSortByPassive}
           selectedDlcs={selectedDlcs}
           onToggleDlc={toggleDlc}
         />
       </div>
       <div className="flex flex-wrap justify-center gap-[0.30rem] sm:gap-1 lg:gap-2">
         {filteredAndSortedEvolutions.map((evolution) => (
           <EvolutionCard key={evolution.id} evolution={evolution} />
         ))}
       </div>
       <Legend className="mt-4" />
     </main>
    </>
  );
}
