import { Button } from "@/components/ui/Button";
import { TDlc } from "@/data/types";
import { dlcClasses, DLC_LABELS } from "./constants";

interface DlcControlsProps {
  selectedDlcs: Set<TDlc>;
  onToggleDlc: (dlc: TDlc) => void;
}

export function DlcControls({ selectedDlcs, onToggleDlc }: DlcControlsProps) {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-end items-center">
      {(Object.keys(DLC_LABELS) as TDlc[]).map((dlc) => (
        <Button
          key={dlc}
          variant="outline-solid"
          onClick={() => onToggleDlc(dlc)}
          size="sm"
          className={
            selectedDlcs.has(dlc)
              ? dlcClasses[dlc].selected
              : dlcClasses[dlc].unselected
          }
        >
          <span>{DLC_LABELS[dlc]}</span>
        </Button>
      ))}
    </div>
  );
}