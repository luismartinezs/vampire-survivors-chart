import { cn } from "@/lib/utils";
import { weapons } from "@/data/weapons";
import { GoldCircle } from "./GoldCircle";
import { Item } from "./Item";

interface LegendProps {
  className?: string;
}

export function Legend({ className }: LegendProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 lg:flex-row lg:gap-4 text-xs text-white/80 rounded p-2 flex-wrap",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <GoldCircle size="sm" />
        <span>=&nbsp;Max level passive</span>
      </div>
      <div className="flex items-center gap-1">
        <Item item={weapons.alucardShield} size="xs" />
        <span>=&nbsp;Requires 6+ weapon evolutions</span>
      </div>
      <div className="flex items-center gap-1">
        <Item item={weapons.ringsOfCalamity} size="xs" />
        <span>=&nbsp;Requires 5+ max level passives</span>
      </div>
      <div className="flex items-center gap-1">
        {/* No indicator needed per user request */}
        <span>Emerald Diorama evolutions =&nbsp;Require 1+ tech activations</span>
      </div>
      <div className="flex items-center gap-1">
        <Item item={weapons.miracleOfMultiplication} size="xs" />
        <span>=&nbsp;Evolve</span>
        <Item item={weapons.penshinFatcha} size="xs" />
        <span>6+ times.</span>
      </div>
    </div>
  );
}
