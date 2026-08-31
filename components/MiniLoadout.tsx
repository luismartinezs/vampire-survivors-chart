"use client";

import { useMemo } from "react";
import { passives } from "@/data/passives";
import { TWeaponEvolution } from "@/data/types";
import { useAppStore } from "@/hooks/useAppStore";
import { Item } from "./Item";
import { cn } from "@/lib/utils";

interface MiniLoadoutProps {
  /** Evolutions currently rendered on screen, not the ones merely selected. */
  evolutions: TWeaponEvolution[];
  className?: string;
}

/**
 * Right-aligned strip of every passive that appears in the visible evolutions.
 * A single translucent plate carries the whole strip; the icons sit bare on top
 * so nothing reads as a per-item control.
 *
 * Only shown once the user has narrowed the chart with a weapon or passive
 * filter. With nothing selected the strip would just list every passive.
 */
export function MiniLoadout({ evolutions, className }: MiniLoadoutProps) {
  const showPassivesLoadout = useAppStore((state) => state.showPassivesLoadout);
  const selectedPassives = useAppStore((state) => state.evolutionControls.selectedPassives);
  const selectedWeapons = useAppStore((state) => state.evolutionControls.selectedWeapons);
  const hasSelection = selectedPassives.length > 0 || selectedWeapons.length > 0;

  const activePassives = useMemo(() => {
    const present = new Set<string>();

    for (const evolution of evolutions) {
      for (const element of evolution.elements) {
        if (typeof element === "string") continue;
        if (element.item.type === "passive") {
          present.add(element.item.name);
        }
      }
    }

    // Iterate the data order so the strip stays stable as filters change.
    return Object.values(passives).filter((passive) => present.has(passive.name));
  }, [evolutions]);

  if (!showPassivesLoadout || !hasSelection || activePassives.length === 0) return null;

  return (
    <div className={cn("mb-2 flex justify-end", className)}>
      <div className="flex flex-wrap items-center justify-end gap-0.5 rounded bg-base-600 p-px sm:p-0.5">
        {activePassives.map((passive) => (
          <span key={passive.name} title={passive.name} className="inline-flex">
            <Item item={passive} size="2xs" className="size-4 sm:size-4.5" />
          </span>
        ))}
      </div>
    </div>
  );
}
