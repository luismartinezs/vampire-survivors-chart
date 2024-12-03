import { Button } from "@/components/ui/Button";
import { TDlc } from "@/data/types";
import { Separator } from "./ui/separator";
import { dlcClasses } from "./controls/constants";
import { DlcControls } from "./controls/DlcControls";
import { PassiveControls } from "./controls/PassiveControls";
import { WeaponControls } from "./controls/WeaponControls";

interface ControlsProps {
  sortByPassive: boolean;
  onToggleSortByPassive: () => void;
  selectedDlcs: Set<TDlc>;
  onToggleDlc: (dlc: TDlc) => void;
  selectedPassives: Set<string>;
  onTogglePassive: (passive: string) => void;
  onResetPassives: () => void;
  selectedWeapons: Set<string>;
  onToggleWeapon: (weapon: string) => void;
  onResetWeapons: () => void;
}

export function Controls({
  sortByPassive,
  onToggleSortByPassive,
  selectedDlcs,
  onToggleDlc,
  selectedPassives,
  onTogglePassive,
  onResetPassives,
  selectedWeapons,
  onToggleWeapon,
  onResetWeapons,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
        <div className="flex flex-wrap gap-1 sm:gap-2 justify-end items-center">
          <Button
            variant="outline"
            onClick={onToggleSortByPassive}
            size="sm"
            className={
              sortByPassive
                ? dlcClasses.base.selected
                : dlcClasses.base.unselected
            }
          >
            Sort by Passive
          </Button>
          <DlcControls selectedDlcs={selectedDlcs} onToggleDlc={onToggleDlc} />
        </div>
      </div>
      <PassiveControls
        selectedPassives={selectedPassives}
        onTogglePassive={onTogglePassive}
        onResetPassives={onResetPassives}
      />

      <WeaponControls
        selectedWeapons={selectedWeapons}
        onToggleWeapon={onToggleWeapon}
        onResetWeapons={onResetWeapons}
      />
    </div>
  );
}
