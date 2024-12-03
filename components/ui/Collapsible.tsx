import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { useStorage } from "@/hooks/useStorage";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useStorage(
    `collapsible-${title}-open`,
    defaultOpen
  );

  return (
    <div className={cn("w-full transition-all duration-200", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between py-1 sm:py-3 px-2 sm:px-4",
          "text-xs sm:text-sm font-medium tracking-wide text-primary-100",
          "hover:bg-primary/10 active:bg-primary/20",
          "border border-primary-500 shadow-sm",
          "transition-all duration-200 ease-in-out",
          isOpen
            ? "rounded-t-[8px] sm:rounded-t-[12px] rounded-b-none border-b-0"
            : "rounded-[8px] sm:rounded-[12px]"
        )}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform duration-200" />
        ) : (
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-primary transition-transform duration-200" />
        )}
      </Button>
      {isOpen && (
        <div className={cn(
          "mt-0 p-1 sm:p-4 bg-transparent",
          "border border-primary-500 rounded-b-[8px] sm:rounded-b-[12px]",
          "animate-in fade-in-0 slide-in-from-top-1 duration-200"
        )}>
          {children}
        </div>
      )}
    </div>
  );
}