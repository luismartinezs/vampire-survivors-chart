# Updating the Warhammer Survivors charts from a new game build

The `/warhammer40k` and `/ageofsigmar` charts were built on 2026-10-14 from the
**Steam demo** (Unity 6000.0.74f1, IL2CPP). The demo has 5 evolutions per
universe plus Nuln Oil → Mordant Earth, which appears on both pages. The full
game has many more. This guide gets a new build (full release, patch, or DLC)
into the charts in about 15 minutes.

## TL;DR

```bash
# 1. Extract (≈1 min). Rewrites data/warhammer.json, styles/warhammer/items.css, site/static/logos/*.webp
uv run --no-project --with UnityPy==1.25.4 --with Pillow \
  scripts/engineering/extract-warhammer.py \
  "$HOME/.local/share/Steam/steamapps/common/Warhammer Survivors"

# 2. Review what changed
git diff --stat data/warhammer.json styles/warhammer/items.css

# 3. Verify
./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vitest run
./node_modules/.bin/tsx scripts/build.ts --dev && ./node_modules/.bin/tsx scripts/preview.ts
```

Then open `/warhammer40k` and `/ageofsigmar` and compare them with the in-game
collection screens (see "Verify against the game" below).

Needs `uv` and `cwebp` (`sudo apt install webp`). UnityPy is pinned and pulled
by `uv` on the fly; it is not a project dependency. No AssetRipper or
VampireUnpacker needed: the data is not encrypted or bundled away.

## Where the game keeps things

All under `<game>/WarhammerSurvivors_Data/resources.assets`:

| What | Unity object | Notes |
|---|---|---|
| Weapons, passives, evolutions | TextAsset `WEAPON_DATA` | Same shape as Vampire Survivors. JSON with `//` comments and trailing commas |
| Characters (starting weapons) | TextAsset `CHARACTER_DATA` | Explains gift evolutions (e.g. Frag Grenade is Legend of Catachan's) |
| Universes | TextAsset `SILO_DATA` | `WH_40K`, `WH_AOS`. A DLC universe would add a key here |
| Item icons | Sprites in atlases `40K_Items`, `AOS_Items`, `WS_Items` | 16–22 px pixel art. Sprite name = `frameName` without `.png` |
| Header emblems | Sprite `Element_Decal_1_Trimmed` in `40K_UI_New` / `AOS_UI_New` | White silhouettes; the header tints them with a CSS mask |

`StreamingAssets/aa/*.bundle` (Addressables) only holds audio, fonts, tilemaps
and characters. The chart needs nothing from there.

In `WEAPON_DATA`, each item maps to a list of levels; level 1 carries the identity:

- `evoInto`: result weapon id. `evoSynergy` / the result's `requires`: passives needed
- `silos`: which universe(s) the item is in
- `isEvolution`: the item is an evolved weapon. `isGiftEvo`: gift evolution (base weapon is a character's starting weapon)
- `hidden` / `placeholder`: not in the level-up pool / unfinished. `alwaysHidden` + `isSpecialOnly`: internal sub-weapons (explosions, damage zones), never shown

## What the extractor does

`scripts/engineering/extract-warhammer.py`:

1. Reads `WEAPON_DATA`. Keeps every weapon with an `evoInto`, its passives and its result. Nothing else
2. Writes `data/warhammer.json` (`items` by game id, `evolutions` as weapon + passives → result). `data/warhammer.ts` turns it into one chart per universe. Items in both universes (Nuln Oil, passives) appear on each page as that universe's own; the universes are treated as separate games on purpose
3. Exports each used item's sprite (choosing the right atlas when a name repeats) → lossless WebP → `.icon-ws-<id>` classes in `styles/warhammer/items.css`
4. Exports the two emblems to `site/static/logos/`
5. Prints every recipe as `[universe] Weapon + Passive = Result` for review

Nothing else needs touching for new evolutions within the two existing
universes: pages, filters, search and icons all follow from the JSON.

## Things that may need a code change

Check each of these against the printed recipe list:

| Situation | Symptom | Fix |
|---|---|---|
| Item with no `name` in the data | Name shows as a game id, e.g. `WS_40K_...` | Add it to `NAME_OVERRIDES` in the extractor. The demo needed this for the Frag Grenade |
| Evolution needs a **max-level** passive | No gold max badge | The demo has no `requiresMax`. If the full game uses it (as Vampire Survivors does), emit `tags: ["max"]` for those passives in `data/warhammer.ts` |
| **Union** (two weapons merge) | Result's `requires` lists a weapon id | Works as is (rendered `A + B = C`). Check how the item renders: anything without a `Passive_` frame counts as a weapon |
| Evolution needs two passives | | Works as is |
| New **universe/DLC silo** (new key in `SILO_DATA`) | Its items are dropped | Add it to `SILOS` and `LOGOS` in the extractor; add `data/constants.ts` key, `TDlc`, `DLC_LABELS` + palette in `lib/dlc.ts`, a chart in `lib/charts.ts`, `site/content/<page>.md` (copy an existing one), a `[data-theme]` block in `styles/site.css`, and the link in `partials/header.html` + `footer.html` + `sitemap.xml` |
| A recipe's sprite is missing | Extractor exits with `sprite X not found` | The `frameName` doesn't match a sprite. Search the names (snippet below) and special-case it |
| UnityPy can't read the files | Parse error on load | Game moved to a newer Unity. Bump the UnityPy pin |

## Verify against the game

The collection screen (per universe) lists weapons and passives in
`WEAPON_DATA` order, with `?` for undiscovered ones. Count them:

- **Weapons in the collection** = items in the universe's silo, not `alwaysHidden`
- **Passives in the collection** = passives not `hidden`

Every weapon in the collection should be in the chart unless it has no
`evoInto` and is no other weapon's result. In the demo those were D6 Dice and
Power Fist (40K) and Grandblade (AoS), all marked `placeholder` or missing a
result. Expect them to get evolutions in the full game. Passives that feed no
evolution (demo: Glue, Lightning Bolt) are left out on purpose, like on the
Vampire Survivors page.

This prints what the collection should contain, per universe:

```bash
python3 - <<'EOF'
import json, re, sys
s = open(sys.argv[1] if len(sys.argv) > 1 else "/tmp/WEAPON_DATA", encoding="utf-8-sig").read()
s = re.sub(r"^\s*//.*$", "", s, flags=re.M); s = re.sub(r",(\s*[}\]])", r"\1", s)
for gid, levels in json.loads(s).items():
    e = levels[0]
    if e.get("alwaysHidden"): continue
    print(f"{'/'.join(e.get('silos') or []):14} {gid:42} {e.get('name')!s:26} evoInto={e.get('evoInto')} needs={e.get('evoSynergy')} hidden={e.get('hidden')}")
EOF
```

## Poking around a new build

When something doesn't line up, dump the raw data and list sprite names
(scratch directory, not the repo):

```bash
uv run --no-project --with UnityPy==1.25.4 python - "$GAME/WarhammerSurvivors_Data/resources.assets" <<'EOF'
import sys, UnityPy
env = UnityPy.load(sys.argv[1])
for obj in env.objects:
    if obj.type.name == "TextAsset":
        d = obj.read(); data = d.m_Script
        open(f"/tmp/{d.m_Name}", "wb").write(data.encode("utf-8", "surrogateescape") if isinstance(data, str) else data)
    elif obj.type.name == "Sprite" and obj.peek_name().startswith(("W_", "Passive_")):
        print(obj.peek_name())
EOF
```

This writes every TextAsset (`WEAPON_DATA`, `CHARACTER_DATA`, ...) to `/tmp`
and prints the weapon and passive sprite names. The demo's atlases already
contain ~40 full-game weapon icons (Heavy Flamer, Assault Cannon, Storm
Bolter, ...), so expect most new items' icons to be there already.

## After shipping

- Change the page note in `site/content/warhammer40k.md` and `ageofsigmar.md` from "the Warhammer Survivors demo's game files" to the full game
- Update `lib/charts.test.ts` if the sample recipes it checks change
- Update the memory note `warhammer-survivors-charts` (demo vs full game)
