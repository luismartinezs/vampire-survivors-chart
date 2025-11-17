import { Operand } from "./Operand";
import {
  TWeaponEvolution,
  TEvolutionElement,
  TItem,
  TOperand,
} from "@/data/types";
import { base } from "@/data/constants";
import { ResponsiveItem } from "./ResponsiveItem";
import { dlcClasses } from "./controls/constants";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  DEFAULT_TOOLTIP_DELAY,
} from "./ui/Tooltip";
import { getWikiHref } from "@/lib/wiki";

export default function EvolutionCard({
  evolution,
}: {
  evolution: TWeaponEvolution;
}) {
  const openRecipeDrawer = useAppStore((state) => state.openRecipeDrawer);
  const dlcClass = dlcClasses[evolution.dlc || base].card;
  const handleClick = () => {
    openRecipeDrawer(evolution.elements);
  };

  return (
    <TooltipProvider
      delayDuration={DEFAULT_TOOLTIP_DELAY}
      skipDelayDuration={DEFAULT_TOOLTIP_DELAY}
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "cursor-pointer rounded border p-1 text-left transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70 sm:p-2",
          dlcClass.bg,
          dlcClass.border,
          "hover:bg-white/10"
        )}
      >
        <div className="flex items-center justify-between gap-[0.2rem] md:gap-1">
          {evolution.elements.map((element: TEvolutionElement, index) => {
            const isEven = index % 2 === 0;
            if (isEven) {
              const itemElement = element as { item: TItem; tags?: string[] };
              const wikiHref = getWikiHref(itemElement.item.wikiPath);

              return (
                <Tooltip key={`${itemElement.item.name}-${index}`}>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <ResponsiveItem
                        item={itemElement.item}
                        tags={itemElement.tags}
                      />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    {wikiHref ? (
                      <a
                        href={wikiHref}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-xs font-semibold text-white underline-offset-2 hover:text-white/80 hover:underline"
                      >
                        {itemElement.item.name}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold leading-tight text-white">
                        {itemElement.item.name}
                      </p>
                    )}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              );
            } else {
              return <Operand key={index} type={element as TOperand} />;
            }
          })}
        </div>
      </button>
    </TooltipProvider>
  );
}
