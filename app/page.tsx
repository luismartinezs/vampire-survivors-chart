"use client";

import EvolutionCard from "@/components/EvolutionCard";
import { Controls } from "@/components/Controls";
import { Legend } from "@/components/Legend";
import { useEvolutionControls } from "@/hooks/useEvolutionControls";

export default function Home() {
  const {
    sortByPassive,
    selectedDlcs,
    selectedPassives,
    toggleDlc,
    togglePassive,
    resetPassives,
    toggleSortByPassive,
    filteredAndSortedEvolutions,
  } = useEvolutionControls();

  return (
    <>
      <main className="max-w-screen-2xl mx-auto py-4 2xl:px-0 px-1 sm:px-2 md:px-4">
        <div className="w-full flex items-center gap-8 justify-center mb-4">
          <Controls
            sortByPassive={sortByPassive}
            onToggleSortByPassive={toggleSortByPassive}
            selectedDlcs={selectedDlcs}
            onToggleDlc={toggleDlc}
            selectedPassives={selectedPassives}
            onTogglePassive={togglePassive}
            onResetPassives={resetPassives}
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
