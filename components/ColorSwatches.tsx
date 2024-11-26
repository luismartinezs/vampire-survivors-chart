import { cn } from "@/lib/utils";

const ColorSwatch = ({ color }: { color: string }) => {
  return (
    <div className={cn('w-16 h-16 rounded border border-white/10', color)} title={color}>
      <span className="sr-only">{color}</span>
    </div>
  );
};

export const ColorSwatches = () => {
  const colors = [
    'bg-primary-50',
    'bg-primary-100',
    'bg-primary-200',
    'bg-primary-300',
    'bg-primary-400',
    'bg-primary-500',
    'bg-primary-600',
    'bg-primary-700',
    'bg-primary-800',
    'bg-primary-900',
    'bg-primary-950'
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {colors.map((color) => (
        <ColorSwatch key={color} color={color} />
      ))}
    </div>
  );
};
