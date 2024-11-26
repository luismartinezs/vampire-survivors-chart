import { cn } from "@/lib/utils";

interface TagPosition {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

const getTagPosition = (
  n: number,
  position: TagPosition
): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  const offset = n * 8.5;

  if (position.top !== undefined) styles.top = `${offset}px`;
  if (position.right !== undefined) styles.right = `${position.right}px`;
  if (position.bottom !== undefined) styles.bottom = `${offset}px`;
  if (position.left !== undefined) styles.left = `${position.left}px`;

  return styles;
};

const tagSizes = {
  xs: "size-[0.5rem]",
  sm: "size-2.5",
  md: "size-3",
  lg: "size-4"
};

const tagComponents: Record<string, (n: number, size: "xs" | "sm" | "md" | "lg") => React.ReactNode> = {
  max: (_, size) => (
    <div className={`${tagSizes[size]} bg-black relative`} style={{
      clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
    }}>
      <div className="absolute inset-[1px] bg-yellow-200" style={{
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
      }}>
        <div className="absolute inset-[1px] bg-yellow-600" style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)'
        }} />
      </div>
    </div>
  ),
};

export const Tag = ({ tag, n, size = "xs", className }: { tag: string; n: number; size?: "xs" | "sm" | "md" | "lg"; className?: string }) => {
  const TagComponent = tagComponents[tag.toLowerCase()];

  if (!TagComponent) return null;

  return (
    <div className={cn("absolute z-10", className)} style={getTagPosition(n, { top: 0, right: 0 })}>
      {TagComponent(n, size)}
    </div>
  );
};
