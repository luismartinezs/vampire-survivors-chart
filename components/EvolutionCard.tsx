import { Fragment } from "react";
import { Item } from "./Item";
import { Operand } from "./Operand";
import { Tag } from "./Tag";
import {
  TWeaponEvolution,
  TEvolutionElement,
  TItem,
  TOperand,
} from "@/data/types";
export default function EvolutionCard({
  evolution,
}: {
  evolution: TWeaponEvolution;
}) {
  return (
    <div className="bg-primary-700/50 rounded border border-primary-500 p-1 sm:p-2">
      <div className="flex items-center justify-between">
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
                <Item
                  item={itemElement.item}
                  size="sm"
                  className="hidden sm:block"
                />
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
