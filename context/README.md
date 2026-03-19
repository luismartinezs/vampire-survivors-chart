# Folder Structure

This repository is organized around two concepts: **the product** (code that ships)
and **the business** (everything needed to build, operate, and grow the product).

## Root
```
project-root/
├── app/                  Next.js pages and layouts
├── components/           React components
├── context/              Business context (this section)
├── data/                 Runtime data (evolutions, weapons, passives)
├── features/             Feature-specific code
├── hooks/                React hooks
├── lib/                  Shared utilities
├── public/               Static assets
├── scripts/              Automation scripts
├── styles/               CSS and icon sprites
├── CLAUDE.md             AI agent instructions
└── README.md             Quick-start guide
```

## context/ — Business Context

Project-specific knowledge that is not portable across projects.

```
context/
├── product/              Specs, backlogs, feature tickets
│   ├── BACKLOG.md        Performance backlog with prioritized items
│   └── tickets/          Individual feature/bug specs
├── engineering/          Guides and how-tos for this codebase
│   └── guides/           Step-by-step procedures (add weapons, generate icons)
└── research/             Game domain reference data (DLC weapon lists, evolutions)
```

## scripts/ — Automation

```
scripts/
├── engineering/          Asset generation and code utilities
│   ├── gen-icons.sh      Generate CSS sprites from PNG files
│   ├── gen-icons-webp.sh Generate CSS sprites from WebP files
│   ├── convert-to-webp.sh Convert PNGs to WebP
│   ├── generate-balatro-css.sh Generate Balatro DLC icon CSS
│   ├── get-classes.sh    Extract CSS classes
│   └── rename_sprite_files.sh Remove 'Sprite' from filenames
└── ops/
    └── generate-vapid-keys.js Generate VAPID keys for push notifications
```

## Design Principles

1. **Playbooks are portable, context is not.** Everything under `context/` is specific to this product.
2. **Grouped by business function, not file type.** Tickets live with product, guides live with engineering.
3. **Runtime data stays separate.** `data/` is consumed by the app at runtime and is not meta/business content.
