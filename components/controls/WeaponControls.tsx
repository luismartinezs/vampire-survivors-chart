import { Button } from "@/components/ui/Button";
import { weapons } from "@/data/weapons";
import { ResponsiveItem } from "../ResponsiveItem";
import { ButtonList } from "./ButtonList";

export function WeaponControls() {
  const filteredUnevolvedWeapons = Object.values(weapons).filter(
    (weapon) => !weapon.evolved
  );

  return (
    <ButtonList>
      {filteredUnevolvedWeapons.map((weapon) => (
        <Button key={weapon.name} variant="outline" size="sm" className="p-1">
          <ResponsiveItem item={weapon} />
        </Button>
      ))}
    </ButtonList>
  );
}