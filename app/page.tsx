"use client";

import { useState } from "react";
import EvolutionCard from "@/components/EvolutionCard";
import { Items } from "@/components/Items";
import { evolutions } from "@/data/evolutions";
import { Controls } from "@/components/Controls";
import { TDlc } from "@/data/types";

export default function Home() {
  const [sortByPassive, setSortByPassive] = useState(false);
  const [selectedDlcs, setSelectedDlcs] = useState<Set<TDlc>>(
    new Set(["base", "lotm", "todf", "em", "og", "otc"])
  );

  const toggleDlc = (dlc: TDlc) => {
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
  };

  const filteredAndSortedEvolutions = evolutions
    .filter((evolution) => evolution.dlc && selectedDlcs.has(evolution.dlc))
    .sort((a, b) => {
      if (!sortByPassive) return 0;
      const aPassive =
        typeof a.elements[2] === "object" &&
        "item" in a.elements[2] &&
        a.elements[2].item?.name
          ? a.elements[2].item.name
          : "";
      const bPassive =
        typeof b.elements[2] === "object" &&
        "item" in b.elements[2] &&
        b.elements[2].item?.name
          ? b.elements[2].item.name
          : "";
      return aPassive.localeCompare(bPassive);
    });

  return (
    <main className="min-h-screen max-w-screen-2xl mx-auto py-4 2xl:px-0 px-4">
      <Controls
        sortByPassive={sortByPassive}
        onToggleSortByPassive={() => setSortByPassive(!sortByPassive)}
        selectedDlcs={selectedDlcs}
        onToggleDlc={toggleDlc}
      />
      <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1 lg:gap-2">
        {filteredAndSortedEvolutions.map((evolution) => (
          <EvolutionCard key={evolution.id} evolution={evolution} />
        ))}
      </div>
      <div className="mt-4">
        <Items />
      </div>
    </main>
  );
}
