#!/usr/bin/env bash
# ============================================================
# Pizza Pals! — list the ElevenLabs voices on your account
# ------------------------------------------------------------
# Run this ONCE so we can see which voices are available and
# assign a distinct one to each of the 10 characters.
#
# Usage (key stays in your terminal, never in chat):
#   ELEVENLABS_API_KEY=sk_your_NEW_key bash voice/list-voices.sh
#
# Tip: rotate the key you pasted earlier first, then use the new one.
# ============================================================
set -euo pipefail

: "${ELEVENLABS_API_KEY:?Please set ELEVENLABS_API_KEY, e.g.  ELEVENLABS_API_KEY=sk_... bash voice/list-voices.sh}"

echo "Fetching your ElevenLabs voices..."
echo

curl -s -H "xi-api-key: $ELEVENLABS_API_KEY" \
  "https://api.elevenlabs.io/v1/voices" \
| python3 -c '
import sys, json
try:
    data = json.load(sys.stdin)
except Exception:
    print("Could not parse response — check that the API key is valid.")
    sys.exit(1)
voices = data.get("voices", [])
if not voices:
    print("No voices returned. Is the key correct?")
    sys.exit(1)
print(f"{len(voices)} voices:\n")
for v in voices:
    labels = v.get("labels", {}) or {}
    desc = ", ".join(f"{k}={val}" for k, val in labels.items())
    print(f"  {v[\"voice_id\"]}  |  {v[\"name\"]:<22}  |  {desc}")
'
echo
echo "Done. Paste that list back to me and I will map a voice to each character."
