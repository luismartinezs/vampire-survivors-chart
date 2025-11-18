import { Button } from "@/components/ui/Button";
import { passives } from "@/data/passives";
import { ResponsiveItem } from "../ResponsiveItem";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { dlcClasses, ignoredPassives } from "./constants";
import { ButtonList } from "./ButtonList";
import { Collapsible } from "../ui/Collapsible";
import { base } from "@/data/constants";
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

interface PassiveControlsProps {
  selectedPassives: Set<string>;
  onTogglePassive: (passive: string) => void;
  onResetPassives: () => void;
}

export function PassiveControls({
  selectedPassives,
  onTogglePassive,
  onResetPassives,
}: PassiveControlsProps) {
  const openRecipeDrawer = useAppStore((state) => state.openRecipeDrawer);
  const filteredPassives = Object.values(passives);
  // .filter(
  //   (passive) => !ignoredPassives.includes(passive.name)
  // );

  return (
    <Collapsible title="Passives" defaultOpen>
      <TooltipProvider
        delayDuration={DEFAULT_TOOLTIP_DELAY}
        skipDelayDuration={DEFAULT_TOOLTIP_DELAY}
      >
        <ButtonList>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline-solid"
                onClick={onResetPassives}
                size="sm"
                aria-label="Reset Passives"
                className={cn(
                  "p-1 aspect-square h-full",
                  selectedPassives.size === 0
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
                Reset selected passives
              </p>
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
          {filteredPassives.map((passive) => {
            const wikiHref = getWikiHref(passive.wikiPath);

            return (
              <Tooltip key={passive.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline-solid"
                    onClick={() => {
                      openRecipeDrawer([{ item: passive }]);
                      onTogglePassive(passive.name);
                    }}
                    size="sm"
                    className={cn(
                      "p-1 aspect-square",
                      selectedPassives.has(passive.name)
                        ? dlcClasses[passive.dlc ?? base].selected
                        : dlcClasses[passive.dlc ?? base].unselected
                    )}
                  >
                    <ResponsiveItem item={passive} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {wikiHref ? (
                    <a
                      href={wikiHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-xs font-semibold text-white underline-offset-2 hover:text-white/80 hover:underline"
                    >
                      {passive.name}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold leading-tight text-white">
                      {passive.name}
                    </p>
                  )}
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
