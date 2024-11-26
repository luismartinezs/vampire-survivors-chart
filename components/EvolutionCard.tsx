import { Item } from "./Item";
import { Operand } from "./Operand";
import { Tag } from "./Tag";
import { TWeaponEvolution, TEvolutionElement, TItem, TOperand } from "@/data/types";
export default function EvolutionCard({
  evolution,
}: {
  evolution: TWeaponEvolution;
}) {
  return (
    <div className="bg-primary-700 rounded border border-primary-500 p-2">
      <div className="flex items-center justify-between gap-1">
        {evolution.elements.map((element: TEvolutionElement, index) => {
          const isEven = index % 2 === 0;
          if (isEven) {
            const itemElement = element as { item: TItem; tags?: string[] };
            return (
              <div key={index} className="relative">
                {itemElement.tags?.map((tag: string, idx: number) => (
                  <Tag key={idx} tag={tag} n={idx} />
                ))}
                <Item item={itemElement.item} size="sm" />
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
