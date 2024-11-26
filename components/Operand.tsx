import { cn } from "@/lib/utils";
import type { TOperand } from "@/data/types";

interface OperandProps {
  type: TOperand;
  className?: string;
}

export function Operand({ type, className }: OperandProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold",
        className
      )}
    >
      {type}
    </div>
  );
}
