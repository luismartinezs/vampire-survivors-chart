import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline-solid";
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
        size === "sm" && "px-1.5 py-0.5 text-xs sm:px-1 sm:py-0.5 sm:text-sm md:px-2 md:py-1 md:text-base",
        variant === "default" && "bg-primary-500 text-black hover:bg-primary-600",
        variant === "outline-solid" && "border border-primary-400 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300",
        className
      )}
      {...props}
    />
  );
}