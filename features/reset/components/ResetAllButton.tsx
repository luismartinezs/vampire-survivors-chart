"use client";

import { RotateCcw } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";

export const ResetAllButton = () => {
  const resetWeapons = useAppStore((state) => state.resetEvolutionWeapons);
  const resetPassives = useAppStore((state) => state.resetEvolutionPassives);

  const handleReset = () => {
    resetWeapons();
    resetPassives();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      className="flex items-center justify-center rounded-full border border-primary-400/80 p-3 text-primary-400/80 backdrop-blur-xs transition-colors duration-200 hover:border-primary-400 hover:text-primary-400 cursor-pointer"
      aria-label="Reset all selected weapons and passives"
      title="Reset all selections"
    >
      <RotateCcw size={16} aria-hidden="true" />
    </button>
  );
};
