"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

export const DEFAULT_TOOLTIP_DELAY = 250;

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 0, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 max-w-xs rounded border border-white bg-primary-800 px-1.5 py-1 text-xs text-white shadow-lg data-[state=delayed-open]:data-[side=bottom]:animate-in data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-0.5 data-[state=delayed-open]:data-[side=left]:slide-in-from-right-0.5 data-[state=delayed-open]:data-[side=right]:slide-in-from-left-0.5 data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-0.5",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipArrow = forwardRef<
  ElementRef<typeof TooltipPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn("fill-slate-900/90", className)}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
};
