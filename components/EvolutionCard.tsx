import { Operand } from "./Operand";
import {
  TWeaponEvolution,
  TEvolutionElement,
  TItem,
  TOperand,
  TDlc,
} from "@/data/types";
import { base } from "@/data/constants";
import { ResponsiveItem } from "./ResponsiveItem";

const dlcClasses: Record<TDlc, {bg: string, border: string}> = {
  base: {
    bg: "bg-base-300/20",
    border: "border-base-500"
  },
  lotm: {
    bg: "bg-lotm-300/20",
    border: "border-lotm-500"
  },
  todf: {
    bg: "bg-todf-300/20",
    border: "border-todf-500"
  },
  em: {
    bg: "bg-em-300/20",
    border: "border-em-700"
  },
  og: {
    bg: "bg-og-300/20",
    border: "border-og-500"
  },
  otc: {
    bg: "bg-otc-300/20",
    border: "border-otc-500"
  }
};

export default function EvolutionCard({
  evolution,
}: {
  evolution: TWeaponEvolution;
}) {
  const dlcClass = dlcClasses[evolution.dlc || base];

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
