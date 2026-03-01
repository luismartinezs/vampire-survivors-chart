"use client";

import { useState } from "react";
import EvolutionCard from "@/components/EvolutionCard";
import { DlcControls } from "@/components/controls/DlcControls";
import { WeaponControls } from "@/components/controls/WeaponControls";
import { PassiveControls } from "@/components/controls/PassiveControls";
import { Legend } from "@/components/Legend";
import { useEvolutionControls } from "@/hooks/useEvolutionControls";
import { useItemSearch } from "@/hooks/useItemSearch";
import { EvolutionList } from "@/components/EvolutionList";
import { Separator } from "@/components/ui/separator";
import { RecipeDrawer } from "@/components/RecipeDrawer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { dlcClasses } from "@/components/controls/constants";
import { SearchInput } from "@/components/SearchInput";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const matchedItems = useItemSearch(searchQuery);

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

  const filterBySearch = (
    evolutions: typeof filteredEvolutions
  ) => {
    if (!matchedItems) return evolutions;
    return evolutions.filter((evo) =>
      evo.elements.some(
        (el) => typeof el !== "string" && matchedItems.has(el.item.name)
      )
    );
  };

  const visibleEvolutions = filterBySearch(filteredEvolutions);
  const visibleExcluded = filterBySearch(excludedEvolutions);

  return (
    <>
      <div className="max-w-(--breakpoint-2xl) mx-auto py-4 2xl:px-0 px-1 sm:px-2 md:px-4">
        {/* Sort + DLC row */}
        <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-end items-center">
            <Button
              variant="outline-solid"
              onClick={toggleSortByPassive}
              size="sm"
              className={cn(
                "min-h-[30px] px-2",
                sortByPassive
                  ? dlcClasses.base.selected
                  : dlcClasses.base.unselected
              )}
            >
              Sort by Passive
            </Button>
            <DlcControls
              selectedDlcs={selectedDlcs}
              onToggleDlc={toggleDlc}
            />
          </div>
        </div>

        {/* Search — sticky so it stays visible while scrolling cards */}
        <SearchInput value={searchQuery} onChange={setSearchQuery} />

        {/* Item filter buttons */}
        <div className="flex flex-col gap-1 w-full mb-4">
          <WeaponControls
            selectedWeapons={selectedWeapons}
            selectedDlcs={selectedDlcs}
            onToggleWeapon={toggleWeapon}
            onResetWeapons={resetWeapons}
            matchedItems={matchedItems}
          />
          <PassiveControls
            selectedPassives={selectedPassives}
            onTogglePassive={togglePassive}
            onResetPassives={resetPassives}
            matchedItems={matchedItems}
          />
        </div>

        {/* Evolution cards */}
        <EvolutionList>
          {visibleEvolutions.map((evolution) => (
            <EvolutionCard key={evolution.id} evolution={evolution} />
          ))}
        </EvolutionList>
        {visibleExcluded.length > 0 && (
          <>
            <Separator className="my-4" />
            <EvolutionList>
              {visibleExcluded.map((evolution) => (
                <EvolutionCard key={evolution.id} evolution={evolution} />
              ))}
            </EvolutionList>
          </>
        )}
        <Legend className="mt-4" />
        <RecipeDrawer />
      </div>
    </>
  );
}
