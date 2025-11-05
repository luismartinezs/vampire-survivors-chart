import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: ReactNode;
  helperText?: ReactNode;
  containerClassName?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      containerClassName,
      className,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <label
        htmlFor={id}
        className={cn(
          "group flex cursor-pointer items-start gap-3 text-sm text-primary-100",
          containerClassName
        )}
      >
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            className={cn(
              "peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950",
              className
            )}
            {...props}
          />
          <span className="pointer-events-none inline-flex h-5 w-5 items-center justify-center rounded-md border border-primary-600/70 bg-primary-950/50 shadow-[0_0_0_1px_rgba(16,11,35,0.55)] transition-all duration-200 peer-checked:border-primary-200 peer-checked:bg-primary-400 peer-checked:shadow-[0_8px_14px_-6px_rgba(51,164,255,0.55)] peer-disabled:border-primary-800/60 peer-disabled:bg-primary-900/60 peer-disabled:opacity-60" />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute h-3.5 w-3.5 text-primary-950 opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
          >
            <path
              d="M4.25 8.25 6.75 10.75 11.75 5.75"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="font-medium text-primary-100 transition-colors duration-150 group-hover:text-white">
            {label}
          </span>
          {helperText ? (
            <span className="mt-1 block text-xs text-primary-200/70">
              {helperText}
            </span>
          ) : null}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
