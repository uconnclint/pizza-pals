#!/bin/zsh
set -euo pipefail

helper="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py"

# Full-bleed scene backgrounds.
cp /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-4cef9bd8-0a75-43a4-b8c8-c1cf3e5e1a4e.png img/scenes/pizza-shop-interior.png
cp /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-f328dcc3-fa69-4e14-b079-4db04c9e19cf.png img/scenes/kitchen.png
sips -z 1366 2048 img/scenes/pizza-shop-interior.png >/dev/null
sips -z 1366 2048 img/scenes/kitchen.png >/dev/null

process_keyed() {
  local source="$1"
  local out="$2"
  local width="$3"
  local height="$4"
  local base="${out:t:r}"
  cp "$source" "img/sources/${base}-chroma.png"
  python3 "$helper" --input "img/sources/${base}-chroma.png" --out "$out" --key-color '#03f808' --auto-key none --soft-matte --transparent-threshold 12 --opaque-threshold 100 --despill --force
  sips -z "$height" "$width" "$out" >/dev/null
}

process_keyed /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-3d795dd0-e8e7-4ab4-8eaa-e47f1874454f.png img/scenes/counter-front.png 2048 380
process_keyed /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-0084fdba-927e-48db-885e-8195274a15f7.png img/scenes/pizza-oven.png 1024 1100
process_keyed /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-f92b9bab-a6b7-4983-81d3-370a557c52e0.png img/scenes/oven-door.png 1024 1100
process_keyed /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-bfab2390-a093-4f13-a7a0-a1ce11f36c2b.png img/logo/pizza-pals-logo.png 2048 820

# Split the two-up star and pizza coin sheet.
cp /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-fd167bc1-c902-4377-8a65-7cc343b4c011.png img/sources/star-coin-sheet-chroma.png
sips -c 1254 627 --cropOffset 0 0 img/sources/star-coin-sheet-chroma.png --out img/sources/gold-star-chroma.png >/dev/null
sips -c 1254 627 --cropOffset 0 627 img/sources/star-coin-sheet-chroma.png --out img/sources/pizza-coin-chroma.png >/dev/null
python3 "$helper" --input img/sources/gold-star-chroma.png --out img/props/gold-star.png --key-color '#03f808' --auto-key none --soft-matte --transparent-threshold 12 --opaque-threshold 100 --despill --force
python3 "$helper" --input img/sources/pizza-coin-chroma.png --out img/props/pizza-coin.png --key-color '#03f808' --auto-key none --soft-matte --transparent-threshold 12 --opaque-threshold 100 --despill --force
sips -z 512 512 img/props/gold-star.png >/dev/null
sips -z 512 512 img/props/pizza-coin.png >/dev/null

# Re-key the few green or edge-touching food sprites with a fixed key and tighter matte.
for name in dough-ball green-pepper broccoli; do
  python3 "$helper" --input "img/sources/${name}-chroma.png" --out "img/food/${name}.png" --key-color '#03f808' --auto-key none --soft-matte --transparent-threshold 12 --opaque-threshold 70 --despill --force
  sips -z 512 512 "img/food/${name}.png" >/dev/null
done
