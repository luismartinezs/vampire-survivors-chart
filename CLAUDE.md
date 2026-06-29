# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm dev-https             # Start development server with HTTPS
pnpm build                 # Build for production
pnpm start                 # Start production server
pnpm lint                  # Run ESLint

# Asset Generation
./scripts/engineering/rename_sprite_files.sh <dir>          # Remove 'Sprite' from filenames
./scripts/engineering/convert-to-webp.sh <dir>              # Convert PNGs to lossless WebP (needs webp + imagemagick)
./scripts/engineering/gen-icons-webp.sh <src_dir> <out.css> # Generate CSS icon classes from WebP files
./scripts/engineering/get-classes.sh <file.css>             # Extract CSS classes
```

## Architecture Overview

This is a Next.js 15 application that displays an interactive evolution chart for the game Vampire Survivors. The app shows weapon evolution combinations with filtering capabilities.

### Core Data Structure

- **Evolution System**: Each evolution (`TWeaponEvolution`) contains `elements` array with items and operators (`+`, `=`, `→`, `⇒`)
- **Items**: Three types - `weapon`, `passive`, `misc` with DLC categorization
- **DLCs**: base, lotm (Legacy of the Moonspell), todf, em (Emerald Diorama), og, otc, ed

### Key Components

- **EvolutionCard**: Displays single evolution with responsive item layout
- **Controls**: Filter by DLC, passives, weapons with sort options
- **useEvolutionControls**: Core state management hook with filtering/sorting logic
- **ResponsiveItem**: Context-aware item display (mobile/desktop)

### Data Files Structure

```
data/
├── types.ts         # Core type definitions
├── evolutions.ts    # All weapon evolutions data
├── weapons.ts       # Weapon definitions
├── passives.ts      # Passive item definitions
├── items.ts         # Misc items
└── constants.ts     # DLC constants
```

### CSS Icon System

Icons are CSS background-image classes with base64-encoded lossless WebP data URIs:

- Source PNGs (from the wiki) are converted with `convert-to-webp.sh`, then `gen-icons-webp.sh` emits `.icon-{filename}` classes
- Manual grouping into themed CSS files in `styles/`
- All icon CSS is render-blocking (imported in `styles/globals.css`), so only add classes actually referenced by `image:` fields in `data/*.ts`

### State Management

Uses localStorage via `useStorage` hook for persistent user preferences:

- Selected DLCs, passives, weapons
- Sort preferences
- Filters maintained across sessions

## Code Conventions

- **Imports**: Absolute paths with `@/` prefix
- **Types**: PascalCase with `T` prefix (e.g., `TItem`, `TWeaponEvolution`)
- **Components**: Default exports for pages, named for utilities
- **Styling**: Tailwind with `cn()` utility for conditional classes
- **File Organization**: Components grouped by feature in subdirectories
