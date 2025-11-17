import { Button } from "@/components/ui/Button";
import { passives } from "@/data/passives";
import { ResponsiveItem } from "../ResponsiveItem";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { dlcClasses, ignoredPassives } from "./constants";
import { ButtonList } from "./ButtonList";
import { Collapsible } from "../ui/Collapsible";
import { base } from "@/data/constants";
import { useAppStore } from "@/hooks/useAppStore";

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
  const openRecipeDrawer = useAppStore((state) => state.openRecipeDrawer);
  const filteredPassives = Object.values(passives).filter(
    (passive) => !ignoredPassives.includes(passive.name)
  );

  return (
    <Collapsible title="Passives" defaultOpen>
      <ButtonList>
        <Button
          variant="outline-solid"
          onClick={onResetPassives}
          size="sm"
          aria-label="Reset Passives"
          title="Reset Passives"
          className={cn(
            "p-1 aspect-square h-full",
            selectedPassives.size === 0
              ? dlcClasses.base.selected
              : dlcClasses.base.unselected
          )}
        >
          <div className="flex items-center justify-center size-[1.4rem] sm:size-7">
            <RotateCcw className="size-full text-white" />
          </div>
        </Button>
        {filteredPassives.map((passive) => (
          <Button
            key={passive.name}
            variant="outline-solid"
            onClick={() => {
              openRecipeDrawer([{ item: passive }]);
              onTogglePassive(passive.name);
            }}
            size="sm"
            className={cn(
              "p-1 aspect-square",
              selectedPassives.has(passive.name)
                ? dlcClasses[passive.dlc ?? base].selected
                : dlcClasses[passive.dlc ?? base].unselected
            )}
            title={passive.name}
          >
            <ResponsiveItem item={passive} />
          </Button>
        ))}
      </ButtonList>
    </Collapsible>
  );
}
