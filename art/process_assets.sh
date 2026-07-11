#!/bin/zsh
set -euo pipefail

helper="${CODEX_HOME:-$HOME/.codex}/skills/.system/imagegen/scripts/remove_chroma_key.py"

process_character() {
  local name="$1"
  local source="$2"
  cp "$source" "img/sources/${name}-smile-chroma.png"
  python3 "$helper" --input "img/sources/${name}-smile-chroma.png" --out "img/characters/${name}-smile.png" --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 120 --despill --force
  sips -z 1228 1024 "img/characters/${name}-smile.png" >/dev/null
}

process_character sir-barksalot /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-3ec0f6bd-36e4-4a62-883b-1cd9ebdcb295.png
process_character beep-bop /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-1f58cb05-dc7e-4754-9ad6-37db73595bcd.png
process_character mo /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-b2d093fb-b50a-4a91-86a9-7a8b6f9549d1.png
process_character zizzy /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-3d0c4777-775e-4f46-b233-722c235258b9.png
process_character captain-whiskers /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-c419e7b1-5215-4f00-84ef-b782f6853df3.png
process_character luna /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-28cd39d1-970a-4be8-8eae-cbd8e5f97ba6.png
process_character rex /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-db173a60-2462-4654-8fef-ee46c577215b.png
process_character gran-penny /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-71f00dc6-ec21-4896-9276-bc0246e02231.png
process_character gus /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-a728badb-8561-4adb-9fec-fe252490bc90.png

process_grin() {
  local name="$1"
  local source="$2"
  cp "$source" "img/sources/${name}-grin-chroma.png"
  python3 "$helper" --input "img/sources/${name}-grin-chroma.png" --out "img/characters/${name}-grin.png" --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 120 --despill --force
  sips -z 1228 1024 "img/characters/${name}-grin.png" >/dev/null
}

process_grin pip /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-6b3243b8-3c74-47c8-b86b-ed6132ab6cb5.png
process_grin sir-barksalot /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-8da3d506-0286-4e80-8852-6f5c2a199292.png
process_grin beep-bop /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-5d5d0b28-4139-4248-827f-c3a5c5f0917c.png
process_grin mo /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-35f9ac77-1378-4b87-8b50-1ab765cd71ee.png
process_grin zizzy /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-e8932ff6-2a8e-4163-80cb-c741989b5387.png
process_grin captain-whiskers /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-983a98b1-822c-4f00-91af-9d11b7cd36ee.png
process_grin luna /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-c19a208e-5009-4adc-836a-2dd744d08407.png
process_grin rex /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-0efe54ed-7ab1-4fe6-b31b-54d9cae8ae72.png
process_grin gran-penny /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-68d3a8ea-8720-44e1-957c-927c00b1b48e.png
process_grin gus /Users/clintonmcleod/.codex/generated_images/019f5125-9fb8-7eb3-a8bc-40e38db397dd/exec-d8522ed9-a4c8-4546-8d7c-16a91d68cfb3.png
