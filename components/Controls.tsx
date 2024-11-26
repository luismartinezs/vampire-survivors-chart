import { Button } from "@/components/ui/Button";
import { TDlc } from "@/data/types";

const DLC_LABELS: Record<TDlc, string> = {
  base: "Base Game",
  lotm: "Legacy of the Moonspell",
  todf: "Tides of the Foscari",
  em: "Emergency Meeting",
  og: "Operation Guns",
  otc: "Ode To Castlevania",
};

interface ControlsProps {
  sortByPassive: boolean;
  onToggleSortByPassive: () => void;
  selectedDlcs: Set<TDlc>;
  onToggleDlc: (dlc: TDlc) => void;
}

export function Controls({
  sortByPassive,
  onToggleSortByPassive,
  selectedDlcs,
  onToggleDlc,
}: ControlsProps) {
  return (
    <div className="w-full flex flex-col gap-1 sm:gap-2 mb-2 sm:mb-4">
      <div className="flex flex-wrap gap-1 sm:gap-2 justify-end">
        <Button
          variant={sortByPassive ? "default" : "outline"}
          onClick={onToggleSortByPassive}
          size="sm"
        >
          Sort by Passive
        </Button>
        {(Object.keys(DLC_LABELS) as TDlc[]).map((dlc) => (
          <Button
            key={dlc}
            variant={selectedDlcs.has(dlc) ? "default" : "outline"}
            onClick={() => onToggleDlc(dlc)}
            size="sm"
          >
            <span>{DLC_LABELS[dlc]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
