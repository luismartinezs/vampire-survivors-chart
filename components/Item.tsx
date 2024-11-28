import { cn } from "@/lib/utils";
import type { TItem } from "@/data/types";
interface ItemProps {
  item: TItem;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export function Item({ item, className, size = "md" }: ItemProps) {
  const sizeClasses = {
    xs: "size-[1.4rem]",
    sm: "size-8",
    md: "size-10",
    lg: "size-12",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div
        className={cn(
          "w-full h-full bg-contain bg-no-repeat bg-center pixelated",
          item?.image || "" // Add null check and fallback
        )}
        role="img"
        aria-label={item?.name || ""}
      />
    </div>
  );
}
