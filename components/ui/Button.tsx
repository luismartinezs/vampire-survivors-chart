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
        size === "default" && "px-2 py-1 sm:px-4 sm:py-2",
        size === "sm" && "px-1.5 py-0.5 text-xs sm:px-2 sm:py-1 sm:text-sm",
        variant === "default" && "bg-primary-500 text-black hover:bg-primary-600",
        variant === "outline" && "border border-primary-400 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300",
        className
      )}
      {...props}
    />
  );
}