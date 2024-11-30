import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded font-medium transition-colors",
        size === "default" && "px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5",
        size === "sm" && "px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm md:px-2.5 md:py-1.5 md:text-base lg:px-3 lg:py-2",
        variant === "default" && "bg-primary-500 text-black hover:bg-primary-600",
        variant === "outline" && "border border-primary-400 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300",
        className
      )}
      {...props}
    />
  );
}