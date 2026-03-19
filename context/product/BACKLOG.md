# Performance Backlog

## PERF-01: Replace base64 CSS sprites with static image files [Critical] [XL]
- [ ] Done

**Problem:** All ~520 icon classes use base64-encoded PNGs/WebPs embedded directly in CSS. This produces ~852 KB of CSS (648 KB in `styles/icons.css` alone). Base64 expands binary by ~33%, compresses poorly with gzip, and the entire stylesheet must be parsed before the browser can paint anything. All icon CSS is imported unconditionally in `styles/globals.css:3-17`, so every visitor downloads every icon regardless of which DLCs they're viewing.

Additionally, ~190 of the 520 icon classes (character icons like `icon-arcana*`, `icon-antonio`, etc.) are never referenced in any data file — pure dead weight.

**Files:**
- `styles/globals.css:3-17` — unconditional imports of all icon CSS
- `styles/icons.css` — 648 KB, the largest single file
- `styles/ode/`, `styles/otc/`, `styles/ed/`, `styles/ante/` — DLC icon CSS (~188 KB combined)
- `scripts/gen-icons.sh` — the script that generates base64 CSS from PNGs

**Fix:**
1. Store `.webp` icon files in `/public/icons/` (organized by category/DLC)
2. Reference them via `background-image: url('/icons/<name>.webp')` or `<img>` tags
3. Icons load lazily, are individually cacheable, and the CSS drops to <10 KB
4. Audit and remove the ~190 unused icon classes
5. Update `gen-icons.sh` to output image files instead of base64 CSS

---

## PERF-02: Memoize EvolutionCard with React.memo [High] [XS]
- [x] Done

**Problem:** `EvolutionCard` renders up to 138 instances on screen. It has no `React.memo` wrapper, so every state change in `page.tsx` (search input, DLC toggle, passive toggle, drawer open) re-renders all 138 cards even when their `evolution` prop hasn't changed. The Zustand selector inside (`state.openRecipeDrawer`) is already a stable action reference, so memoization is safe.

**Files:**
- `components/EvolutionCard.tsx:23` — the component definition, no memo wrapper

**Fix:** Wrap the export:
```tsx
export default React.memo(EvolutionCard);
```
One line. Eliminates 138 unnecessary re-renders per interaction.

---

## PERF-03: Memoize visibleEvolutions/visibleExcluded with useMemo [High] [S]
- [x] Done

**Problem:** `filterBySearch` in `page.tsx:38-47` is an inline function recreated on every render, called twice to produce `visibleEvolutions` and `visibleExcluded`. It scans all 138+ evolutions on every render, including renders triggered by unrelated state changes (e.g., opening the RecipeDrawer).

**Files:**
- `app/page.tsx:38-50` — `filterBySearch` definition and both call sites

**Fix:** Replace with `useMemo`:
```tsx
const visibleEvolutions = useMemo(() => {
  if (!matchedItems) return filteredEvolutions;
  return filteredEvolutions.filter((evo) =>
    evo.elements.some(
      (el) => typeof el !== "string" && matchedItems.has(el.item.name)
    )
  );
}, [filteredEvolutions, matchedItems]);

const visibleExcluded = useMemo(() => {
  if (!matchedItems) return excludedEvolutions;
  return excludedEvolutions.filter((evo) =>
    evo.elements.some(
      (el) => typeof el !== "string" && matchedItems.has(el.item.name)
    )
  );
}, [excludedEvolutions, matchedItems]);
```

---

## PERF-04: Fix Zustand object selector in RecipeDrawer [Medium] [XS]
- [x] Done

**Problem:** `RecipeDrawer` destructures from a Zustand selector that returns a new object literal on every store update. Zustand's default equality check is referential (`===`), so a new object always triggers a re-render — even if none of the 4 fields changed.

**Files:**
- `components/RecipeDrawer.tsx:15-20` — the object-returning selector

**Fix:** Either use `useShallow` or split into individual selectors:
```tsx
const recipeDrawerElements = useAppStore((s) => s.recipeDrawerElements);
const isRecipeDrawerOpen = useAppStore((s) => s.isRecipeDrawerOpen);
const closeRecipeDrawer = useAppStore((s) => s.closeRecipeDrawer);
const isRecipeDrawerEnabled = useAppStore((s) => s.isRecipeDrawerEnabled);
```

---

## PERF-05: Reduce ResponsiveItem DOM node triplication [Medium] [M]
- [ ] Done

**Problem:** `ResponsiveItem` renders 3 `<Item>` elements per icon (xs, sm, md) and hides 2 with CSS `display:none`. With 138 evolutions averaging ~3 items each, this creates ~1,200+ extra hidden DOM nodes. Each also renders duplicate `<Tag>` elements (2 per tag). This inflates initial render time, memory usage, and layout computation.

**Files:**
- `components/ResponsiveItem.tsx:11-24` — the triple-render pattern

**Fix:** Use a single `<Item>` element with responsive CSS sizing instead of 3 hidden siblings. Options:
1. CSS custom property + media query on a single element (change icon size via CSS `width`/`height`)
2. Container queries on a single `<Item>` that adapts its own size
3. A single `<Item>` with responsive Tailwind classes like `size-5 sm:size-7 md:size-8`

The `Item` component itself likely needs a small refactor to accept responsive size classes instead of a fixed `size` prop.

---

## PERF-06: Push "use client" down from page.tsx [Medium] [M]
- [ ] Done

**Problem:** `app/page.tsx:1` declares `"use client"` at the root page level, forcing the entire component tree into a single client bundle. None of the children can be React Server Components. Static elements like `Legend`, the `EvolutionList` shell, and page structure are shipped as client JS unnecessarily.

**Files:**
- `app/page.tsx:1` — the `"use client"` directive

**Fix:** Extract the interactive state (`useEvolutionControls`, `useItemSearch`, `useState`) into a client wrapper component (e.g., `EvolutionChartClient`). Keep `page.tsx` as a Server Component that renders the client wrapper. This allows `Legend`, `Header`, `Footer` to remain server-rendered.

```tsx
// app/page.tsx (Server Component - no "use client")
import { EvolutionChartClient } from "@/components/EvolutionChartClient";
export default function Home() {
  return <EvolutionChartClient />;
}
```

Realistic gain: moderate. Most of the page is interactive, so the main win is allowing Next.js to statically render the shell.

---

## PERF-07: Lazy-load RecipeDrawer and SettingsWidget [Medium] [S]
- [ ] Done

**Problem:** `RecipeDrawer` is invisible until a card is clicked, and `SettingsWidget` is a bottom-right overlay. Both are imported statically and included in the initial bundle despite not being needed at first paint.

**Files:**
- `app/page.tsx:13` — static import of `RecipeDrawer`
- `app/layout.tsx:10` — static import of `SettingsWidget`

**Fix:** Use `next/dynamic` for lazy loading:
```tsx
import dynamic from "next/dynamic";
const RecipeDrawer = dynamic(() =>
  import("@/components/RecipeDrawer").then((m) => ({ default: m.RecipeDrawer })),
  { ssr: false }
);
```
Same pattern for `SettingsWidget` and `FeaturebaseFeedbackLink`.

---

## PERF-08: Remove dead dependencies [Low-Medium] [XS]
- [x] Done

**Problem:** Several dependencies ship to the client bundle but are never used in the application:

1. **`dayjs` + `chalk`** — only used in `lib/logger.ts`, which is never imported by any component, hook, or page. Both get bundled as dead code.
2. **`class-variance-authority`** — listed in `package.json:17` but never imported anywhere. The project uses `cn()` (clsx + tailwind-merge) directly.

**Files:**
- `lib/logger.ts` — the only consumer of `dayjs` and `chalk`, never imported
- `package.json:15-16` — `chalk` and `class-variance-authority` deps

**Fix:**
1. Delete `lib/logger.ts`
2. `pnpm remove dayjs chalk class-variance-authority`

---

## PERF-09: Remove unused JacquardFont [Low] [XS]
- [x] Done

**Problem:** `fonts.ts:10-15` defines `JacquardFont` using `Jacquard_12` from Google Fonts. This font is never applied to any element — `layout.tsx` only uses `SansFont.className`. While Next.js downloads fonts at build time (no runtime penalty), it's dead code that adds confusion and a build-time download.

**Files:**
- `fonts.ts:10-15` — `JacquardFont` definition

**Fix:** Remove the `JacquardFont` export and the `Jacquard_12` import from `fonts.ts`.

---

## PERF-10: Use Next.js Script component for AdSense [Low] [XS]
- [x] Done

**Problem:** The AdSense script in `layout.tsx:78-83` uses a raw `<script async>` tag inside `<head>`, bypassing Next.js's `<Script>` component. This loses the `strategy` parameter and can compete with font/CSS loading on some execution paths. The Umami script on line 103 correctly uses `<Script strategy="afterInteractive">`.

**Files:**
- `app/layout.tsx:78-83` — raw `<script>` for AdSense

**Fix:**
```tsx
<Script
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6379293593579449"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```
Move it out of `<head>` into the `<body>` alongside the Umami script.
