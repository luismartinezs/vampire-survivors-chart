import { JacquardFont } from "@/fonts";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="bg-primary-900/50 text-white py-2 sm:py-4 border-b border-primary-500/50 shadow-lg shadow-primary-950/50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-3">
          <img
            src="/favicon-96x96.png"
            alt="Vampire Survivors Logo"
            width={40}
            height={40}
            loading="eager"
            decoding="async"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1
            className={cn(
              JacquardFont.className,
              "text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-200 to-primary-400 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide capitalize"
            )}
          >
            Vampire Survivors Evolution Chart
          </h1>
        </div>
      </div>
    </header>
  );
}
