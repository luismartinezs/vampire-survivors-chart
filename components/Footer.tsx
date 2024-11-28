export function Footer() {
  return (
    <footer className="mt-auto bg-black/40 border-t border-white/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-white/80">
            Vampire Survivors Evolution Chart
          </p>
          <div className="text-xs text-white/60">
            <span>© {new Date().getFullYear()} </span>
            <a
              href="https://appforgelabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors"
            >
              AppForgeLabs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}