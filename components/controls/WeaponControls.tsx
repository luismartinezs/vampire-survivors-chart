import { Button } from "@/components/ui/Button";
import { weapons } from "@/data/weapons";
import { ResponsiveItem } from "../ResponsiveItem";
import { ButtonList } from "./ButtonList";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DLC_LABELS, dlcClasses } from "./constants";
import { Collapsible } from "../ui/Collapsible";
import { base } from "@/data/constants";
import { TDlc } from "@/data/types";

interface WeaponControlsProps {
  selectedWeapons: Set<string>;
  selectedDlcs: Set<TDlc>;
  onToggleWeapon: (weapon: string) => void;
  onResetWeapons: () => void;
}

const dlcOrder: TDlc[] = Object.keys(DLC_LABELS) as TDlc[];

export function WeaponControls({
  selectedWeapons,
  selectedDlcs,
  onToggleWeapon,
  onResetWeapons,
}: WeaponControlsProps) {
  const filteredUnevolvedWeapons = Object.values(weapons).filter(
    (weapon) =>
      !weapon.evolved &&
      (!weapon.dlc || selectedDlcs.has(weapon.dlc))
  )

  return (
    <Collapsible title="Weapons" defaultOpen={false}>
      <ButtonList>
        <Button
          variant="outline-solid"
          onClick={onResetWeapons}
          size="sm"
          aria-label="Reset Weapons"
          className={cn(
            "p-1 aspect-square h-full",
            selectedWeapons.size === 0
              ? dlcClasses.base.selected
              : dlcClasses.base.unselected
          )}
        >
          <RotateCcw className="h-full w-full text-white" />
        </Button>
        {filteredUnevolvedWeapons.map((weapon) => (
          <Button
            key={weapon.name}
            variant="outline-solid"
            onClick={() => onToggleWeapon(weapon.name)}
            size="sm"
            className={cn(
              "p-1 aspect-square",
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
