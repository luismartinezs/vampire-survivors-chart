import { cn } from "@/lib/utils";
import { GoldCircle } from "./GoldCircle";
import { RedCircle } from "./RedCircle";

interface LegendProps {
  className?: string;
}

export function Legend({ className }: LegendProps) {
  return (
    <div className={cn("flex flex-row gap-4 text-xs text-white/80 rounded p-2", className)}>
      <div className="flex items-center gap-1">
        <GoldCircle size="sm" />
        <span>=&nbsp;Max level passive</span>
      </div>
      <div className="flex items-center gap-1">
        <RedCircle size="sm" />
        <span>=&nbsp;Requires 6+ weapon evolutions</span>
      </div>
    </div>
  );
}