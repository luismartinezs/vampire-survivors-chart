import { WeaponEvolution } from "@/data/weapons";

export default function EvolutionCard({
  evolution,
}: {
  evolution: WeaponEvolution;
}) {
  return (
    <div className="bg-primary-700 rounded border border-primary-500 p-2">
      <div className="flex items-center justify-between gap-1">
        <div className="relative">
          <div className="absolute -top-2 -left-1 text-[10px] bg-black px-1 rounded">
            MAX
          </div>
          <div
            className={`w-8 h-8 bg-contain bg-no-repeat bg-center pixelated ${evolution.baseWeapon.image}`}
            role="img"
            aria-label={evolution.baseWeapon.name}
          />
        </div>
        <span className="text-xl">+</span>
        <div
          className={`w-8 h-8 bg-contain bg-no-repeat bg-center pixelated ${evolution.requiredItem.image}`}
          role="img"
          aria-label={evolution.requiredItem.name}
        />
        <span className="text-xl">=</span>
        <div
          className={`w-8 h-8 bg-contain bg-no-repeat bg-center pixelated ${evolution.evolution.image}`}
          role="img"
          aria-label={evolution.evolution.name}
        />
      </div>
    </div>
  );
}
