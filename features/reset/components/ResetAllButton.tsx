"use client";

import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { track } from "@/lib/track";
import { activeWire } from "@/lib/wire";

export const ResetAllButton = () => {
  const resetWeapons = useAppStore((state) => state.resetEvolutionWeapons);
  const resetPassives = useAppStore((state) => state.resetEvolutionPassives);

  const handleReset = () => {
    // Snapshot what was active right before wiping: a candidate "completed
    // build" the visitor assembled, then cleared to start another.
    track({ a: "reset", c: activeWire(useAppStore.getState().evolutionControls) });
    resetWeapons();
    resetPassives();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="flex items-center justify-center rounded-full border border-primary-400/80 bg-primary-800/20 p-3 text-primary-400/80 backdrop-blur-xs transition-colors duration-200 hover:border-primary-400 hover:text-primary-400 cursor-pointer"
      aria-label="Reset all selected weapons and passives"
      title="Reset all selections"
    >
      <RotateCcw size={16} aria-hidden="true" />
    </button>
  );
};
