import { Fragment } from "react";
import { Item } from "./Item";
import { Operand } from "./Operand";
import { Tag } from "./Tag";
import {
  TWeaponEvolution,
  TEvolutionElement,
  TItem,
  TOperand,
  TDlc,
} from "@/data/types";
import { base } from "@/data/constants";

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
              <div key={index} className="relative">
                {itemElement.tags?.map((tag: string, idx: number) => (
                  <Fragment key={idx}>
                    <Tag tag={tag} n={idx} size="xs" className="sm:hidden" />
                    <Tag
                      tag={tag}
                      n={idx}
                      size="sm"
                      className="hidden sm:block"
                    />
                  </Fragment>
                ))}
                <Item item={itemElement.item} size="xs" className="sm:hidden" />
                <Item item={itemElement.item} size="sm" className="hidden md:hidden sm:block" />
                <Item item={itemElement.item} size="md" className="hidden md:block" />
              </div>
            );
          } else {
            return <Operand key={index} type={element as TOperand} />;
          }
        })}
      </div>
    </div>
  );
}
