#!/usr/bin/env python3
"""
Extract Warhammer Survivors evolution data and item icons from a Steam install.

The game (Unity, IL2CPP) keeps its weapon table as a JSON TextAsset named
WEAPON_DATA inside resources.assets, in the same shape Vampire Survivors uses
(evoInto / evoSynergy / requires / silos), and its item sprites in the
40K_Items, AOS_Items and WS_Items atlases of the same file. This script reads
both, keeps only the items that take part in an evolution, and writes:

  data/warhammer.json            items + evolutions, read by data/warhammer.ts
  styles/warhammer/items.css     .icon-ws-* classes, lossless WebP data URIs at
                                 native pixel size (same format as gen-icons-webp.sh)
  site/static/logos/<key>.webp   each universe's emblem (white on transparent; the
                                 header tints it with the page theme through a mask)

Usage (UnityPy is not a project dependency, so let uv provide it):

  uv run --no-project --with UnityPy==1.25.4 --with Pillow \\
    scripts/engineering/extract-warhammer.py \\
    "$HOME/.local/share/Steam/steamapps/common/Warhammer Survivors"

Needs cwebp on PATH. Re-run it after a game update and rebuild; review the
printed recipe list against the game before shipping.
"""

import base64
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import UnityPy

ROOT = Path(__file__).resolve().parents[2]
DATA_OUT = ROOT / "data" / "warhammer.json"
CSS_OUT = ROOT / "styles" / "warhammer" / "items.css"
LOGO_DIR = ROOT / "site" / "static" / "logos"

# Universes ("silos") as the game names them -> chart keys.
SILOS = {"WH_40K": "w40k", "WH_AOS": "aos"}

# Header emblems: chart key -> (sprite, atlas). The UI decal each universe's
# menus use; both are white silhouettes of the same size.
LOGOS = {
    "w40k": ("Element_Decal_1_Trimmed", "40K_UI_New"),
    "aos": ("Element_Decal_1_Trimmed", "AOS_UI_New"),
}

# Entries the game leaves unnamed (the name comes from elsewhere at runtime).
NAME_OVERRIDES = {"WS_40K_ASTRA_MILITARUM_FRAG_GRENADE": "Frag Grenade"}

# ITEM_DATA entries (relics, pickups) whose icons the chart legend shows. They
# are in no recipe. Amberbone: the relic behind Long-Fusil's morph evolution.
LEGEND_ICONS = ["WS_AOS_RELIC_AMBERBONE"]


def load_lenient_json(text: str):
    """The game's JSON allows // comments (whole-line and after a value) and trailing commas."""
    # Drop strings' contents from the match so "//" inside a string survives.
    text = re.sub(r'("(?:\\.|[^"\\])*")|//[^\n]*', lambda m: m.group(1) or "", text)
    text = re.sub(r",(\s*[}\]])", r"\1", text)
    return json.loads(text)


def icon_class(game_id: str) -> str:
    return "icon-" + game_id.lower().replace("_", "-")


def to_webp(image, out: Path, tmp: str) -> None:
    png = Path(tmp) / f"{out.stem}.png"
    image.save(png)
    subprocess.run(["cwebp", "-quiet", "-lossless", "-z", "9", str(png), "-o", str(out)], check=True)


def pick_sprite(candidates: list, atlas: str):
    """The sprite packed into `atlas` (names repeat across atlases), else the first."""
    for obj in candidates:
        sprite = obj.read()
        tex = sprite.m_RD.texture
        if tex and tex.read().m_Name.lower() == atlas.lower():
            return sprite
    return candidates[0].read()


def main(game_dir: str) -> None:
    assets = next(Path(game_dir).glob("*_Data/resources.assets"), None)
    if assets is None:
        sys.exit(f"no */resources.assets under {game_dir}")
    env = UnityPy.load(str(assets))

    tables: dict[str, dict] = {}
    sprites: dict[str, list] = {}
    for obj in env.objects:
        if obj.type.name == "TextAsset" and obj.peek_name() in ("WEAPON_DATA", "ITEM_DATA"):
            script = obj.read().m_Script
            if isinstance(script, bytes):
                script = script.decode("utf-8-sig")
            tables[obj.peek_name()] = load_lenient_json(script.lstrip("﻿"))
        elif obj.type.name == "Sprite":
            sprites.setdefault(obj.peek_name(), []).append(obj)
    if "WEAPON_DATA" not in tables:
        sys.exit("WEAPON_DATA not found")

    # Level 1 carries the item's identity; later levels are stat deltas.
    entries = {gid: levels[0] for gid, levels in tables["WEAPON_DATA"].items()}
    # Relics and pickups (one entry each, not levelled), for legend icons only.
    for gid in LEGEND_ICONS:
        entry = tables.get("ITEM_DATA", {}).get(gid)
        if entry is None:
            sys.exit(f"{gid} not found in ITEM_DATA")
        entries[gid] = {**entry, "isPickup": True}

    evolutions = []
    used: list[str] = []

    def use(gid: str) -> None:
        if gid not in used:
            used.append(gid)

    for gid, e in entries.items():
        # `addEvolvedWeapon` (Archeotech, Exotic Weaponry) is left out: a weapon
        # picker that can turn into its evolved picker when an evolution chest
        # opens, not a base weapon and its evolution.
        result = e.get("evoInto")
        if not result:
            continue
        if result not in entries:
            print(f"skip {gid}: evolves into unknown {result}", file=sys.stderr)
            continue
        r = entries[result]
        # `requiresMax`: the passive must be at max level. Bladed Vortex spells it `Requires`.
        maxed = r.get("requiresMax") or []
        requires = (r.get("requires") or r.get("Requires") or []) + maxed
        if not requires:
            requires = e.get("evoSynergy") or []
        # Recipes with no passive have a trigger the chart explains in its legend:
        # "special" for a condition kept in game code (`hasUniqueRequirements`:
        # Long-Fusil, a character morph).
        trigger = "special" if r.get("hasUniqueRequirements") else None
        if not requires and trigger is None:
            sys.exit(f"{gid} -> {result}: no requirement in the data")
        evolutions.append(
            {
                "weapon": gid,
                "passives": list(dict.fromkeys(requires)),
                "max": [p for p in dict.fromkeys(requires) if p in maxed],
                "result": result,
                "trigger": trigger,
                # Gift: the base weapon is a character's starting weapon.
                "gift": bool(entries[result].get("isGiftEvo")),
            }
        )
        use(gid)
        for p in requires:
            use(p)
        use(result)
    for gid in LEGEND_ICONS:
        use(gid)

    items = {}
    for gid in used:
        e = entries[gid]
        silos = [SILOS[s] for s in e.get("silos") or [] if s in SILOS]
        items[gid] = {
            "name": NAME_OVERRIDES.get(gid) or e.get("name") or gid,
            "image": icon_class(gid),
            "type": "misc"
            if e.get("isPickup")
            else "passive"
            if e.get("frameName", "").startswith("Passive_")
            else "weapon",
            "evolved": bool(e.get("isEvolution")),
            "silos": silos,
        }

    DATA_OUT.write_text(json.dumps({"items": items, "evolutions": evolutions}, indent=2) + "\n")

    css = []
    with tempfile.TemporaryDirectory() as tmp:
        for gid in used:
            e = entries[gid]
            frame = e["frameName"].removesuffix(".png")
            # The game matches frame names case-insensitively (W_BraceOfPistols -> W_BraceofPistols).
            candidates = sprites.get(frame) or next(
                (objs for n, objs in sprites.items() if n.lower() == frame.lower()), None
            )
            if not candidates:
                sys.exit(f"{gid}: sprite {frame} not found")
            sprite = pick_sprite(candidates, e.get("texture", ""))
            webp = Path(tmp) / f"{gid}.webp"
            to_webp(sprite.image, webp, tmp)
            data = base64.b64encode(webp.read_bytes()).decode()
            css.append(f".{icon_class(gid)} {{ background-image: url('data:image/webp;base64,{data}'); }}")

        LOGO_DIR.mkdir(parents=True, exist_ok=True)
        for key, (frame, atlas) in LOGOS.items():
            if frame not in sprites:
                sys.exit(f"logo sprite {frame} not found")
            to_webp(pick_sprite(sprites[frame], atlas).image, LOGO_DIR / f"{key}.webp", tmp)

    CSS_OUT.parent.mkdir(parents=True, exist_ok=True)
    CSS_OUT.write_text("\n".join(css) + "\n")

    name = lambda gid: items[gid]["name"]
    for evo in evolutions:
        silos = "/".join(items[evo["weapon"]]["silos"])
        arrow = f"-> ({evo['trigger']})" if evo["trigger"] else "=> (gift)" if evo["gift"] else "="
        passives = " + ".join(name(p) + (" (max)" if p in evo["max"] else "") for p in evo["passives"])
        plus = f" + {passives}" if passives else ""
        print(f"[{silos}] {name(evo['weapon'])}{plus} {arrow} {name(evo['result'])}")
    print(
        f"wrote {DATA_OUT.relative_to(ROOT)}, {CSS_OUT.relative_to(ROOT)} ({len(css)} icons)"
        f" and {len(LOGOS)} logos in {LOGO_DIR.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
