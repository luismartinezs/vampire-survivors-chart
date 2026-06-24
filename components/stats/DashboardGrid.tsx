import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Responsive-first dashboard grid. A single column on phones, widening to 2
 * then 4 tracks. Tiles declare a size that maps to a column span, so the layout
 * is just a list of <GridItem size>...</GridItem> — reorder or resize by editing
 * one line. Rows size to content (auto-rows-min), so tall and short tiles mix.
 */
export type TWidgetSize = "sm" | "md" | "lg" | "xl";

const SPAN: Record<TWidgetSize, string> = {
  sm: "col-span-1",
  md: "col-span-1 sm:col-span-2",
  lg: "col-span-1 sm:col-span-2 lg:col-span-3",
  xl: "col-span-1 sm:col-span-2 lg:col-span-4",
};

export function DashboardGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-min",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GridItem({
  size = "sm",
  className,
  children,
}: {
  size?: TWidgetSize;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(SPAN[size], "min-w-0", className)}>{children}</div>;
}

/**
 * A labelled band of the dashboard: a tracked eyebrow with a hairline rule that
 * fades out, then a grid of tiles. The rule encodes the section boundary; it is
 * not decoration. `meta` is an optional right-aligned note (e.g. a count).
 */
export function Section({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-primary-300/70 whitespace-nowrap">
          {label}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-primary-500/30 to-transparent" />
        {meta && <span className="text-xs text-white/30 whitespace-nowrap">{meta}</span>}
      </div>
      <DashboardGrid>{children}</DashboardGrid>
    </section>
  );
}
