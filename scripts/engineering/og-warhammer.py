#!/usr/bin/env python3
"""
Regenerate the Warhammer Survivors social preview images (site/static/og/*.png,
1200x630) by screenshotting the built chart pages in headless Chrome.

Run after a build, whenever the Warhammer recipes change:

    ./node_modules/.bin/tsx scripts/build.ts --dev
    python3 scripts/engineering/og-warhammer.py

Each page is copied to a temp dir with its controls hidden (search, filters,
nav, footer, floating buttons) and the game logo added under the cards, then
captured at 640x336 CSS px scaled 1.875x. Needs google-chrome on PATH;\ncompressed with pngquant when installed.
"""

import functools
import http.server
import shutil
import subprocess
import tempfile
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
OUT = ROOT / "site" / "static" / "og"
PAGES = {"w40k": "warhammersurvivors/40k", "aos": "warhammersurvivors/ageofsigmar"}

CSS = (
    "<style>.fixed,footer,#chart .sticky,[data-collapsible],header nav,header button,"
    "header a[href*=ko-fi],#chart>div:first-child,body>nav{display:none!important}"
    "#chart{padding-top:1.25rem}"
    "#og-logo{display:block;margin:1.25rem auto 0;height:64px;"
    "filter:drop-shadow(0 2px 3px rgba(0,0,0,.7))}</style>"
)
LOGO = '<img id=og-logo src=/promo/ws-logo.webp alt="">'


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args) -> None:
        pass


def prepare(site: Path, page: str) -> None:
    file = site / page / "index.html"
    html = file.read_text()
    # Minified pages have no </head>: inject the style right before <body.
    body = html.index("<body")
    html = html[:body] + CSS + html[body:]
    sep = html.index("id=excluded-sep")
    tag = html.rindex("<", 0, sep)
    file.write_text(html[:tag] + LOGO + html[tag:])


def main() -> None:
    if not (DIST / "index.html").exists():
        raise SystemExit("dist/ is missing: run scripts/build.ts first")
    with tempfile.TemporaryDirectory() as tmp:
        site = Path(tmp) / "site"
        shutil.copytree(DIST, site)
        for page in PAGES.values():
            prepare(site, page)

        handler = functools.partial(QuietHandler, directory=str(site))
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        port = server.server_address[1]

        OUT.mkdir(parents=True, exist_ok=True)
        try:
            for key, page in PAGES.items():
                out = OUT / f"{key}.png"
                subprocess.run(
                    [
                        "google-chrome",
                        "--headless=new",
                        "--disable-gpu",
                        "--hide-scrollbars",
                        "--window-size=640,336",
                        "--force-device-scale-factor=1.875",
                        "--virtual-time-budget=4000",
                        f"--screenshot={out}",
                        f"http://127.0.0.1:{port}/{page}/",
                    ],
                    check=True,
                    capture_output=True,
                )
                # Pixel art quantizes to 256 colors with no visible loss (~3x smaller).
                if shutil.which("pngquant"):
                    subprocess.run(
                        ["pngquant", "--quality=65-100", "--speed=1", "--force", "--ext=.png", str(out)],
                        check=True,
                    )
                print(f"wrote {out.relative_to(ROOT)}")
        finally:
            server.shutdown()


if __name__ == "__main__":
    main()
