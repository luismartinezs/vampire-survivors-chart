import { Button } from "@/components/ui/Button";
import { weapons } from "@/data/weapons";
import { ResponsiveItem } from "../ResponsiveItem";
import { ButtonList } from "./ButtonList";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { dlcClasses } from "./constants";
import { Collapsible } from "../ui/Collapsible";
import { base } from "@/data/constants";

interface WeaponControlsProps {
  selectedWeapons: Set<string>;
  onToggleWeapon: (weapon: string) => void;
  onResetWeapons: () => void;
}

export function WeaponControls({
  selectedWeapons,
  onToggleWeapon,
  onResetWeapons,
}: WeaponControlsProps) {
  const filteredUnevolvedWeapons = Object.values(weapons).filter(
    (weapon) => !weapon.evolved
  );

  return (
    <Collapsible title="Weapons" defaultOpen={false}>
      <ButtonList>
        <Button
          variant="outline"
          onClick={onResetWeapons}
          size="sm"
          aria-label="Reset Weapons"
          className={cn(
            "p-1 aspect-square",
            selectedWeapons.size === 0
              ? dlcClasses.base.selected
              : dlcClasses.base.unselected
          )}
        >
          <RotateCcw className="size-4 sm:size-6 md:size-8 lg:size-10 text-white" />
        </Button>
        {filteredUnevolvedWeapons.map((weapon) => (
          <Button
            key={weapon.name}
            variant="outline"
            onClick={() => onToggleWeapon(weapon.name)}
            size="sm"
            className={cn(
              "p-1",
              selectedWeapons.has(weapon.name)
                ? dlcClasses[weapon.dlc || base].selected
                : dlcClasses[weapon.dlc || base].unselected
            )}
            title={weapon.name}
          >
            <ResponsiveItem item={weapon} />
          </Button>
        ))}
      </ButtonList>
    </Collapsible>
  );
}
