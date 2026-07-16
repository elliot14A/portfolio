#!/usr/bin/env bash
#
# Regenerates public/fonts/. Run by hand, not part of `bun run build`.
#
#   ./scripts/buildFonts.sh
#
# The outputs are committed and served by the Worker from public/fonts/, so the site has
# no runtime font dependency: no CDN, and no reliance on the visitor having JetBrains Mono
# or a Nerd Font installed. This script only regenerates those assets, and only needs to
# run when the icon set changes.
#
# Needs: uv (pulls fonttools), and JetBrains Mono + a Nerd Font installed locally.

set -euo pipefail
cd "$(dirname "$0")/.."

OUT="public/fonts"
mkdir -p "$OUT"

# Keep in sync with src/core/content/icons.ts — these are exactly the glyphs it names.
# Subset by codepoint, never by pasted characters: PUA literals do not survive tooling.
ICON_CODEPOINTS="U+E0A0,U+E60B,U+E620,U+E628,U+E73E,U+F007,U+F013,U+F016,U+F059,U+F07B,U+F07C,U+F09B,U+F0E0,U+F105,U+F15C,U+F313,U+F489"

# Latin, punctuation, arrows, maths, box drawing and blocks (the ANSI Shadow banner),
# geometric shapes. Everything the site renders that is not an icon.
TEXT_RANGES="U+0000-024F,U+2010-205E,U+20A0-20BF,U+2100-214F,U+2190-21FF,U+2200-22FF,U+2500-259F,U+25A0-25FF,U+2600-26FF"

# `sed -n 1p` rather than `grep -m1`/`head -1`: an early-exiting reader SIGPIPEs fc-list,
# which `set -o pipefail` then turns into a silent exit.
FONTS="$(fc-list)"
JETBRAINS_DIR="$(dirname "$(printf '%s\n' "$FONTS" | grep 'JetBrainsMono-Regular.ttf' | cut -d: -f1 | sed -n 1p)")"
NERD_TTF="$(printf '%s\n' "$FONTS" | grep -oE '/[^:]*NerdFontMono-Regular\.ttf' | sed -n 1p)"

echo "jetbrains : $JETBRAINS_DIR"
echo "nerd      : $NERD_TTF"

subset() {
  uv run --quiet --with "fonttools[woff]" --with brotli pyftsubset "$@"
}

for style in Regular Bold Italic; do
  subset "$JETBRAINS_DIR/JetBrainsMono-$style.ttf" \
    --unicodes="$TEXT_RANGES" \
    --layout-features='*' \
    --flavor=woff2 \
    --output-file="$OUT/JetBrainsMono-$style.woff2"
  printf '  %-8s %s\n' "$style" "$(du -h "$OUT/JetBrainsMono-$style.woff2" | cut -f1)"
done

subset "$NERD_TTF" \
  --unicodes="$ICON_CODEPOINTS" \
  --flavor=woff2 \
  --output-file="$OUT/NerdIcons.woff2"
printf '  %-8s %s\n' "icons" "$(du -h "$OUT/NerdIcons.woff2" | cut -f1)"
