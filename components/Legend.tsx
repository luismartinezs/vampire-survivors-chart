import { cn } from "@/lib/utils";
import { GoldCircle } from "./GoldCircle";
import { RedCircle } from "./RedCircle";

interface LegendProps {
  className?: string;
}

export function Legend({ className }: LegendProps) {
  return (
    <div className={cn("flex flex-col gap-2 lg:flex-row lg:gap-4 text-xs text-white/80 rounded p-2 flex-wrap", className)}>
      <div className="flex items-center gap-1">
        <GoldCircle size="sm" />
        <span>=&nbsp;Max level passive</span>
      </div>
      <div className="flex items-center gap-1">
        <RedCircle size="sm" />
        <span>=&nbsp;Requires 6+ weapon evolutions</span>
      </div>
      <div className="flex items-center gap-1">
        {/* No indicator needed per user request */}
        <span>Rings of Calamity =&nbsp;Requires 5+ max level passives</span>
      </div>
      <div className="flex items-center gap-1">
        {/* No indicator needed per user request */}
        <span>Emerald Diorama evolutions =&nbsp;Require 1+ tech activations</span>
      </div>
    </div>
  );
}