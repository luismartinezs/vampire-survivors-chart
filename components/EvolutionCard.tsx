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
            return (
              <ResponsiveItem
                key={index}
                item={itemElement.item}
                tags={itemElement.tags}
              />
            );
          } else {
            return <Operand key={index} type={element as TOperand} />;
          }
        })}
      </div>
    </button>
  );
}
