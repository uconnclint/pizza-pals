#!/bin/zsh
set -euo pipefail

source_path="/Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-d77efb68-b5d4-4694-88a5-3db6c56130dd.png"
helper="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py"
cp "$source_path" img/sources/food-props-sheet-chroma.png

names=(dough-ball pizza-crust sauce-layer cheese-layer baked-browning-overlay pepperoni mushroom black-olive green-pepper pineapple broccoli serving-tray sauce-ladle cheese-shaker gold-sparkle coral-heart)

for index in {0..15}; do
  row=$(( index / 4 ))
  col=$(( index % 4 ))
  y=$(( row * 313 ))
  x=$(( col * 313 ))
  name="${names[$((index + 1))]}"
  outdir=img/food
  if (( index >= 11 )); then outdir=img/props; fi
  sips -c 313 313 --cropOffset "$y" "$x" img/sources/food-props-sheet-chroma.png --out "img/sources/${name}-chroma.png" >/dev/null
  python3 "$helper" --input "img/sources/${name}-chroma.png" --out "${outdir}/${name}.png" --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 120 --despill --force
  sips -z 512 512 "${outdir}/${name}.png" >/dev/null
done
