import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The base block of the stats dashboard: one consistent card shell with an
 * optional header (title + subtitle) and an action slot (e.g. a sort/select
 * control). Every dashboard tile is a Widget, so the look stays uniform and
 * tiles compose freely. Sizing is a layout concern handled by GridItem.
 */
export function Widget({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "h-full rounded-lg border border-primary-500/15 bg-primary-900/30 p-3 flex flex-col gap-2 min-w-0",
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[0.7rem] uppercase tracking-[0.12em] text-primary-300/50 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn("min-w-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}
