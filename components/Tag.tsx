import { cn } from "@/lib/utils";
import { GoldCircle } from "./GoldCircle";
import { RedCircle } from "./RedCircle";

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

const tagComponents: Record<string, (n: number, size: "xs" | "sm" | "md" | "lg") => React.ReactNode> = {
  max: (_, size) => <GoldCircle size={size} />,
  "six-evo": (_, size) => <RedCircle size={size} />,
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
