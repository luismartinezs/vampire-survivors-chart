import { JacquardFont } from "@/fonts";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="bg-primary-900/50 text-white py-4 border-b border-primary-500/50 shadow-lg shadow-primary-950/50">
      <div className="container mx-auto px-4">
        <h1
          className={cn(
            JacquardFont.className,
            "text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-400 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide capitalize"
          )}
        >
          Vampire Survivors Weapon Evolutions
        </h1>
      </div>
    </header>
  );
}
