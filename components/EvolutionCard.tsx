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

export default function EvolutionCard({
  evolution,
}: {
  evolution: TWeaponEvolution;
}) {
  const dlcClass = dlcClasses[evolution.dlc || base].card;

  return (
    <div className={`${dlcClass.bg} rounded border ${dlcClass.border} p-1 sm:p-2`}>
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
    </div>
  );
}
