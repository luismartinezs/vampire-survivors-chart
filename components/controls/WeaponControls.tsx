import { Button } from "@/components/ui/Button";
import { weapons } from "@/data/weapons";
import { ResponsiveItem } from "../ResponsiveItem";
import { ButtonList } from "./ButtonList";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { dlcClasses } from "./constants";
import { Collapsible } from "../ui/Collapsible";
import { base } from "@/data/constants";
import { TDlc } from "@/data/types";
import { useMemo } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  DEFAULT_TOOLTIP_DELAY,
} from "../ui/Tooltip";
import { getWikiHref } from "@/lib/wiki";

interface WeaponControlsProps {
  selectedWeapons: Set<string>;
  selectedDlcs: Set<TDlc>;
  onToggleWeapon: (weapon: string) => void;
  onResetWeapons: () => void;
}

export function WeaponControls({
  selectedWeapons,
  selectedDlcs,
  onToggleWeapon,
  onResetWeapons,
}: WeaponControlsProps) {
  const openRecipeDrawer = useAppStore((state) => state.openRecipeDrawer);
  const filteredUnevolvedWeapons = useMemo(() => {
    return Object.values(weapons).filter(
      (weapon) =>
        !weapon.evolved && (!weapon.dlc || selectedDlcs.has(weapon.dlc))
    );
  }, [selectedDlcs]);

  const selectedCountLabel = `(${selectedWeapons.size} selected)`;

  return (
    <Collapsible
      title="Weapons"
      meta={selectedCountLabel}
      defaultOpen={false}
    >
      <TooltipProvider
        delayDuration={DEFAULT_TOOLTIP_DELAY}
        skipDelayDuration={DEFAULT_TOOLTIP_DELAY}
      >
        <ButtonList>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline-solid"
                onClick={onResetWeapons}
                size="sm"
                aria-label="Reset Weapons"
                className={cn(
                  "p-1 aspect-square h-full",
                  selectedWeapons.size === 0
                    ? dlcClasses.base.selected
                    : dlcClasses.base.unselected
                )}
              >
                <div className="flex items-center justify-center size-[1.4rem] sm:size-7">
                  <RotateCcw className="size-full text-white" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p className="text-xs font-semibold text-white">
                Reset selected weapons
              </p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
          {filteredUnevolvedWeapons.map((weapon) => {
            const wikiHref = getWikiHref(weapon.wikiPath);

            return (
              <Tooltip key={weapon.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline-solid"
                    onClick={() => {
                      openRecipeDrawer([{ item: weapon }]);
                      onToggleWeapon(weapon.name);
                    }}
                    size="sm"
                    className={cn(
                      "p-1 aspect-square",
                      selectedWeapons.has(weapon.name)
                        ? dlcClasses[weapon.dlc || base].selected
                        : dlcClasses[weapon.dlc || base].unselected
                    )}
                  >
                    <ResponsiveItem item={weapon} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <div className="flex flex-col gap-1">
                    {wikiHref ? (
                      <a
                        href={wikiHref}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs font-semibold text-white underline-offset-2 hover:text-white/80 hover:underline"
                      >
                        {weapon.name}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold leading-tight text-white">
                        {weapon.name}
                      </p>
                    )}
                  </div>
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            );
          })}
        </ButtonList>
      </TooltipProvider>
    </Collapsible>
  );
}
