# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
pnpm dev        # Build (--dev), serve dist/ on :4173, rebuild on change (reload to see it)
pnpm build      # Production build into dist/
pnpm preview    # Serve dist/ like Vercel does (clean URLs, compression)
pnpm check      # Typecheck
pnpm test       # Vitest (filter logic)

# Asset Generation
./scripts/engineering/rename_sprite_files.sh <dir>          # Remove 'Sprite' from filenames
./scripts/engineering/convert-to-webp.sh <dir>              # PNG -> lossless WebP at native pixel size (webp, imagemagick, python3+Pillow)
./scripts/engineering/gen-icons-webp.sh <src_dir> <out.css> # Generate CSS icon classes from WebP files
./scripts/engineering/native-pixel-size.py --css <file.css> # Shrink upscaled sprites already in a CSS file
./scripts/engineering/get-classes.sh <file.css>             # Extract CSS classes

# Warhammer Survivors: data/warhammer.json, styles/warhammer/items.css, site/static/logos/ from a Steam install (needs cwebp)
uv run --no-project --with UnityPy==1.25.4 --with Pillow scripts/engineering/extract-warhammer.py "<game dir>"
# Full walkthrough for a new game build (full release, DLC): context/engineering/guides/warhammer-survivors-update.md
```

`pnpm <script>` can fail locally on pnpm's build-approval pre-check; run the binary directly instead, e.g. `./node_modules/.bin/tsx scripts/build.ts`.

## Architecture Overview

A static site of weapon evolution charts: Vampire Survivors at `/`, and the two Warhammer Survivors universes at `/warhammer40k` and `/ageofsigmar`. Zola renders every page to HTML at build time, and two small TypeScript modules add the interactivity. No framework runs in the browser and there is no server.

Build pipeline (`scripts/build.ts`):

1. For each chart in `lib/charts.ts`: `data/*.ts` → `site/data/chart-<key>.json` (template view model) and `chart-client-<key>.json` (compact filter index), via `lib/chart-view.ts`
2. Tracker Worker `/stats` → `site/data/stats.json` via `lib/stats.ts` + `lib/stats-view.ts`; also published as `/stats-snapshot.json`, the fallback when the tracker fails
3. `client/*.ts` → hashed ES modules (esbuild); fuse.js is a lazy chunk loaded on first search
4. `styles/site.css` → Tailwind CSS inlined into every page; `styles/sprites.css` (VS) and `styles/sprites-warhammer.css` → icon stylesheets loaded without blocking first paint, one per page (`extra.sprites`)
5. `zola build` (pinned binary via `scripts/ensure-zola.sh`) → `dist/`

Generated files (`site/data/`, `site/static/assets/`, `dist/`, `.tools/`) are gitignored.

### Core Data Structure

- **Evolution System**: Each evolution (`TWeaponEvolution`) contains `elements` array with items and operators (`+`, `=`, `→`, `⇒`)
- **Items**: Three types - `weapon`, `passive`, `misc` with DLC categorization
- **DLCs**: base, lotm, lotbm, todf, em, og, otc, ed, ante; Warhammer universes w40k, aos (labels and per-DLC classes in `lib/dlc.ts`)

### Key Files

- `lib/filter.ts`: filtering. `buildFilterIndex` (build time) resolves derived recipes into flat per-evolution lists; `filterEvolutions` (browser) applies the selection. Tested in `lib/filter.test.ts`
- `lib/charts.ts`: the charts (VS, w40k, aos): their data, DLC toggles, storage key, and whether clicks are tracked
- `lib/chart-view.ts`: chart view model; resolves all class strings with `cn()` so templates and runtime class swaps stay identical
- `site/templates/`: `base.html`, `chart.html` (every chart page; `site/content/*.md` picks the chart and page copy via front matter `extra`), `stats.html`, `components.html` (Tera v2 components: icons, item sprite, stats widgets)
- `data/warhammer.ts`: shapes the extracted `data/warhammer.json` into one chart per universe. The universes play as separate games: items both have (Nuln Oil, passives) appear on each page as that universe's own
- `site/templates/partials/header.html`: per-page logo and title, site links (list on `lg`, a full-viewport `popover` menu below it, no JS)
- Page themes: front matter `extra.theme` sets `data-theme` on `<html>`, and `styles/site.css` repaints the `primary` palette for it (w40k: navy/gold/silver, aos: oxblood/gold/teal). Card colors come from the `w40k`/`aos` palettes in `lib/dlc.ts`
- `client/chart.ts`: restores saved filters and keeps the DOM in sync (class swaps, `hidden`, card order)
- `client/restore-gate.ts`: inlined in `<head>`; hides the chart until saved filters are applied, so returning visitors don't see the default chart flash
- `client/tooltip.ts`: one shared tooltip for every trigger
- `client/stats.ts`: table sorting, scroll analytics
- `lib/stats-view.ts`: stats dashboard layout array (edit it to reorder/resize/hide tiles)

Zola 0.23 uses Tera v2: components instead of macros, no `json_encode` (inline JSON with `load_data(..., format="plain") | safe`).

### CSS Icon System

Icons are CSS background-image classes with base64-encoded lossless WebP data URIs, stored at native pixel size and rendered with `image-rendering: pixelated`:

- Source PNGs (from the wiki) are converted with `convert-to-webp.sh`, then `gen-icons-webp.sh` emits `.icon-{filename}` classes
- Manual grouping into themed CSS files in `styles/`, each imported by `styles/sprites.css`
- Only add classes actually referenced by `image:` fields in `data/*.ts`

### State Management

`client/store.ts` persists preferences in localStorage, in the same `{state, version}` shape the previous zustand store used: VS under `app-store`, the other charts under `chart-<key>`. When a new VS DLC ships, bump `STORE_VERSION` and add a migration that switches it on for returning visitors (migrations only run on `app-store`).

### Analytics and deployment

- Hosted on Vercel as static files (`vercel.json`: build command, `dist/`, headers). Env: `NEXT_PUBLIC_TRACK_URL` (tracker Worker origin, baked into the client), `STATS_TOKEN` (build-time stats fetch)
- Ads and Umami are only emitted when `VERCEL_ENV=production` (or `ANALYTICS=1`)
- `/stats` refreshes by redeploying: `.github/workflows/refresh-stats.yml` calls a Vercel deploy hook daily (secret `VERCEL_DEPLOY_HOOK_URL`)
- Only the VS chart sends clicks to the tracker (`tracked` in `lib/charts.ts`): wire ids in `data/ids.ts` are VS-only, and Warhammer evolution ids would collide with VS ones
- `tracker/` is a separate Cloudflare Worker + D1 click counter on the free plan: 10 ms CPU per request and 5M D1 rows read per day for the whole account. `/stats` only reads the small `clicks` table; never aggregate the `events` table per request, and don't run heavy queries against production D1 (one exploratory query blew the daily read quota)

## Code Conventions

- **Imports**: Absolute paths with `@/` prefix
- **Types**: PascalCase with `T` prefix (e.g., `TItem`, `TWeaponEvolution`)
- **Styling**: Tailwind classes in templates; class strings that vary by state are resolved at build time in the view models
