import { cn } from "@/lib/utils";

/** Pixel-art item icon rendered from its CSS background-image class. */
export function Icon({
  image,
  name,
  className,
}: {
  image?: string;
  name: string;
  className?: string;
}) {
  if (!image) {
    return <span className={cn("size-5 shrink-0", className)} aria-hidden />;
  }
  return (
    <span
      className={cn(
        "size-5 shrink-0 bg-contain bg-no-repeat bg-center pixelated",
        image,
        className
      )}
      role="img"
      aria-label={name}
    />
  );
}
