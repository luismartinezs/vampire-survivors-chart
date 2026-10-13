#!/usr/bin/env bash
# Installs the pinned Zola release into .tools/ (checksum-verified) and prints
# the binary path. Idempotent: an existing install is reused.
set -euo pipefail

VERSION="0.23.6"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/.tools/zola-$VERSION"
BIN="$DEST/zola"

if [[ -x "$BIN" ]]; then
  echo "$BIN"
  exit 0
fi

case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)
    # musl build is statically linked, so it runs on any glibc (Vercel's included).
    TARGET="x86_64-unknown-linux-musl"
    SHA256="7d77a4220a4f699cba2fc0e0c7859f780e887e269159ad4fab90e11ea16c906f"
    ;;
  Linux-aarch64)
    TARGET="aarch64-unknown-linux-gnu"
    SHA256="266448fffbf7c7004ca399d0e76dd699541771096d8a42aede98cebe2a029d02"
    ;;
  Darwin-arm64)
    TARGET="aarch64-apple-darwin"
    SHA256="cbffbd29b3f59c3f52633507c8cb945a7a02d8b1399b43b235f5932912297aa3"
    ;;
  Darwin-x86_64)
    TARGET="x86_64-apple-darwin"
    SHA256="79a4d0ab51a4d863c068e6e594c6fce36f0aa17429a414ea63066f5910d14460"
    ;;
  *)
    echo "ensure-zola: unsupported platform $(uname -s)-$(uname -m)" >&2
    exit 1
    ;;
esac

TARBALL="zola-v$VERSION-$TARGET.tar.gz"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -fsSL "https://github.com/getzola/zola/releases/download/v$VERSION/$TARBALL" -o "$TMP/$TARBALL"

if command -v sha256sum >/dev/null; then
  ACTUAL="$(sha256sum "$TMP/$TARBALL" | cut -d' ' -f1)"
else
  ACTUAL="$(shasum -a 256 "$TMP/$TARBALL" | cut -d' ' -f1)"
fi
if [[ "$ACTUAL" != "$SHA256" ]]; then
  echo "ensure-zola: checksum mismatch for $TARBALL (got $ACTUAL)" >&2
  exit 1
fi

mkdir -p "$DEST"
tar -xzf "$TMP/$TARBALL" -C "$DEST"
chmod +x "$BIN"
echo "$BIN"
