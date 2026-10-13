#!/usr/bin/env python3
"""
Shrink pixel-art sprites that are exact integer upscales (wiki sprites often
come 4x/8x/16x enlarged) back to their native pixel grid. Lossless: every
block of k x k identical pixels becomes one pixel, and the site renders icons
with `image-rendering: pixelated`, which samples the same grid at any size.
A 128px sprite decodes to 64 KB of bitmap; its 16px original to 1 KB.

Usage:
  native-pixel-size.py <file.png> ...      rewrite PNGs in place
  native-pixel-size.py --css <file.css> ... rewrite base64 WebP data URIs in place

Needs Pillow; CSS mode also needs cwebp (same encoder as convert-to-webp.sh).
"""

import base64
import io
import re
import subprocess
import sys
import tempfile

from PIL import Image

FACTORS = (16, 8, 7, 6, 5, 4, 3, 2)


def upscale_factor(im: Image.Image) -> int:
    """Largest k such that the image is made of uniform k x k blocks."""
    w, h = im.size
    for k in FACTORS:
        if w % k or h % k:
            continue
        # Compare raw bytes: getbbox() on an RGBA difference only inspects alpha,
        # which would wave through any fully opaque image.
        if shrink(im, k).resize((w, h), Image.NEAREST).tobytes() == im.tobytes():
            return k
    return 1


def shrink(im: Image.Image, k: int) -> Image.Image:
    """Take the top-left pixel of every k x k block."""
    w, h = im.size
    out = Image.new("RGBA", (w // k, h // k))
    out.putdata([im.getpixel((x, y)) for y in range(0, h, k) for x in range(0, w, k)])
    return out


def native(im: Image.Image) -> Image.Image | None:
    im = im.convert("RGBA")
    k = upscale_factor(im)
    return shrink(im, k) if k > 1 else None


def encode_webp(im: Image.Image) -> bytes:
    with tempfile.NamedTemporaryFile(suffix=".png") as png, tempfile.NamedTemporaryFile(suffix=".webp") as webp:
        im.save(png.name)
        subprocess.run(["cwebp", "-quiet", "-lossless", "-z", "9", png.name, "-o", webp.name], check=True)
        return open(webp.name, "rb").read()


DATA_URI = re.compile(r"data:image/webp;base64,([A-Za-z0-9+/=]+)")


def rewrite_css(path: str) -> None:
    css = open(path).read()
    count = 0
    saved = 0

    def replace(m: re.Match) -> str:
        nonlocal count, saved
        data = base64.b64decode(m.group(1))
        small = native(Image.open(io.BytesIO(data)))
        if small is None:
            return m.group(0)
        encoded = encode_webp(small)
        if len(encoded) >= len(data):
            return m.group(0)
        count += 1
        saved += len(data) - len(encoded)
        return "data:image/webp;base64," + base64.b64encode(encoded).decode()

    out = DATA_URI.sub(replace, css)
    if count:
        open(path, "w").write(out)
    print(f"{path}: {count} sprites shrunk, {saved} bytes saved")


def rewrite_png(path: str) -> None:
    small = native(Image.open(path))
    if small is not None:
        small.save(path)
        print(f"{path}: shrunk to {small.size[0]}x{small.size[1]}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args[:1] == ["--css"]:
        for p in args[1:]:
            rewrite_css(p)
    elif args:
        for p in args:
            rewrite_png(p)
    else:
        print(__doc__)
        sys.exit(1)
