import Link from "next/link";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-auto bg-black/40 border-t border-white/10">
      <div className="container mx-auto px-4 py-3 pb-16">
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://ko-fi.com/appforgelabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span className="icon icon-garlic inline-block w-4 h-4" />
            Did this site help? Keep it free for everyone
            <span className="icon icon-recovery inline-block w-4 h-4" />
          </a>
          <nav className="text-xs text-white/70 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              Evolution Chart
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/stats" className="hover:text-white transition-colors">
              Filter Stats
            </Link>
          </nav>
          <div className="text-xs text-white/70 flex items-center gap-1">
            <span>© {currentYear}</span>
            <a
              href="https://appforgelabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              AppForgeLabs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
