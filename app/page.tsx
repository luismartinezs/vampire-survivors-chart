"use client";

import EvolutionCard from "@/components/EvolutionCard";
import { Controls } from "@/components/Controls";
import { Legend } from "@/components/Legend";
import { useEvolutionControls } from "@/hooks/useEvolutionControls";
import { EvolutionList } from "@/components/EvolutionList";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const {
    sortByPassive,
    selectedDlcs,
    selectedPassives,
    toggleDlc,
    togglePassive,
    resetPassives,
    toggleSortByPassive,
    filteredEvolutions,
    excludedEvolutions,
    selectedWeapons,
    toggleWeapon,
    resetWeapons,
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
            selectedWeapons={selectedWeapons}
            onToggleWeapon={toggleWeapon}
            onResetWeapons={resetWeapons}
          />
        </div>
        <EvolutionList>
          {filteredEvolutions.map((evolution) => (
            <EvolutionCard key={evolution.id} evolution={evolution} />
          ))}
        </EvolutionList>
        {excludedEvolutions.length > 0 && (
          <>
            <Separator className="my-4" />
            <EvolutionList>
              {excludedEvolutions.map((evolution) => (
                <EvolutionCard key={evolution.id} evolution={evolution} />
              ))}
            </EvolutionList>
          </>
        )}
        <Legend className="mt-4" />
      </main>
    </>
  );
}
