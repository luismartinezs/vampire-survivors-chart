import { Button } from "@/components/ui/Button";
import { passives } from "@/data/passives";
import { ResponsiveItem } from "../ResponsiveItem";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { dlcClasses, ignoredPassives } from "./constants";
import { ButtonList } from "./ButtonList";

interface PassiveControlsProps {
  selectedPassives: Set<string>;
  onTogglePassive: (passive: string) => void;
  onResetPassives: () => void;
}

export function PassiveControls({
  selectedPassives,
  onTogglePassive,
  onResetPassives,
}: PassiveControlsProps) {
  const filteredPassives = Object.values(passives).filter(
    (passive) => !ignoredPassives.includes(passive.name)
  );

  return (
    <ButtonList>
      <Button
        variant="outline"
        onClick={onResetPassives}
        size="sm"
        aria-label="Reset Passives"
        className={cn(
          "p-1 aspect-square",
          selectedPassives.size === 0
            ? dlcClasses.base.selected
            : dlcClasses.base.unselected
        )}
      >
        <RotateCcw className="size-4 sm:size-6 md:size-8 lg:size-10 text-white" />
      </Button>
      {filteredPassives.map((passive) => (
        <Button
          key={passive.name}
          variant="outline"
          onClick={() => onTogglePassive(passive.name)}
          size="sm"
          className={`p-1 ${
            selectedPassives.has(passive.name)
              ? dlcClasses.base.selected
              : dlcClasses.base.unselected
          }`}
          title={passive.name}
        >
          <ResponsiveItem item={passive} />
        </Button>
      ))}
    </ButtonList>
  );
}