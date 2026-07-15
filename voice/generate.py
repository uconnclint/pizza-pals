#!/usr/bin/env python3
# ============================================================
# Pizza Pals! — generate all character voices with ElevenLabs
# ------------------------------------------------------------
# Reads the API key from voice/.env (git-ignored) or the
# ELEVENLABS_API_KEY environment variable, then synthesizes every
# spoken line into art/audio/. Idempotent: existing clips are skipped,
# so it's safe to re-run (only missing clips are generated).
#
#   python3 voice/generate.py
# ============================================================
import os, sys, json, time, urllib.request, urllib.error, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIO = ROOT / "art" / "audio"
MODEL = "eleven_multilingual_v2"

# --- API key --- (prefer voice/.env; the shell may export a placeholder)
key = None
envf = ROOT / "voice" / ".env"
if envf.exists():
    for line in envf.read_text().splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            key = line.split("=", 1)[1].strip()
if not key:
    key = os.environ.get("ELEVENLABS_API_KEY")
if not key or "HERE" in key.upper() or not key.startswith("sk_"):
    sys.exit("No valid ELEVENLABS_API_KEY in voice/.env")

# --- voice assignments (character -> ElevenLabs voice, chosen to fit personality) ---
VOICE = {
    "pip":      "cgSgspJ2msm6clMCkdW9",  # Jessica  - playful, bright, young
    "barks":    "SOYHLrjzK2X1ezoPC6cr",  # Harry    - fierce warrior (knight pup)
    "beep":     "U0W3edavfdI8ibPeeteQ",  # Freddie  - neutral animated (robot)
    "mo":       "N2lVS1w4EtoT3dr4eOWO",  # Callum   - husky trickster (monster)
    "zizzy":    "dfZGXKiIzjizWtJ0NgPy",  # M. Mouse - high-energy comic (alien)
    "whiskers": "pNInz6obpgDQGcFmaJgB",  # Adam     - dominant, firm (pirate)
    "luna":     "FGY2WhTYpPnrIDTdsKH5",  # Laura    - quirky (witch)
    "rex":      "TX3LPaxmHKxFdv7VOQHJ",  # Liam     - energetic (dino kid)
    "penny":    "pFZP5JQG7iQjIQuC4Bku",  # Lily     - velvety, warm (grandma)
    "gus":      "mZ8K1MPRiT5wDQaasg3i",  # Alexander- posh British (critic)
    "narrator": "EXAVITQu4vr4xnSDxMaL",  # Sarah    - warm, reassuring
}

# --- exact greeting / happy text (matches the on-screen bubbles) ---
GREET = {
 "pip": ["Hi hi hi! Pizza time!", "Ooh ooh, I am SO hungry!", "Yay, my favorite shop!"],
 "barks": ["Greetings, noble chef!", "A quest for pizza, I seek!", "Woof! I mean... good day!"],
 "beep": ["BEEP! Hello, human friend!", "BOOP. I am ready to eat!", "System: hungry equals true!"],
 "mo": ["Hewwo, tiny friend!", "Mo hungry... Mo happy!", "Ooooh, smells yummy!"],
 "zizzy": ["Zizzy comes in peace!", "Earth food?! Wow!", "Take me to your pizza!"],
 "whiskers": ["Ahoy there, matey!", "Arr, welcome aboard!", "Land ho, a pizza port!"],
 "luna": ["Bippity boo, hello to you!", "A magic pizza spell for two!", "Wiggle my spoon, a treat by noon!"],
 "rex": ["RAWR! That means hi!", "Stomp stomp, hello friend!", "I am a hungry little dino!"],
 "penny": ["Hello there, dearie!", "Come in, come in, sweet pea!", "Grandma missed you, dearie!"],
 "gus": ["Bonjour! I am here to taste.", "Ah, a fine pizza place!", "Show me your best dish!"],
}
HAPPY = {
 "pip": ["Best pizza EVER!", "Yum yum yum!", "My tummy is so happy!"],
 "barks": ["A feast for the realm!", "Victory tastes like cheese!", "Huzzah! So tasty!"],
 "beep": ["Pizza dot E X E equals happy!", "Yum detected! Beep!", "Battery full of joy!"],
 "mo": ["Mo LOVE it! Nom nom!", "So good! Mo do happy dance!", "Yummy yummy tummy!"],
 "zizzy": ["Earth food is AMAZING!", "Zizzy has three happy eyes!", "Beaming this home! So good!"],
 "whiskers": ["Shiver me tummy, yum!", "Best treasure ever, arr!", "Me belly says thank ye!"],
 "luna": ["Ta-da! That was magic yum!", "Sparkle sparkle, so so good!", "My spell worked, delicious!"],
 "rex": ["RAWR means yummy tummy!", "Best dino snack ever!", "Stomp stomp, so good!"],
 "penny": ["Oh my, delicious dearie!", "Just like I used to make!", "Warms my heart, thank you!"],
 "gus": ["Magnifique! Five big stars!", "Ooh la la, superb!", "Bravo! A masterpiece!"],
}
# short in-character order announcements (played, then the narrator reads the specifics)
ORDERCALL = {
 "pip": "Yay, it's my turn!",
 "barks": "A quest for pizza!",
 "beep": "Processing order. Beep boop!",
 "mo": "Ooh ooh, Mo want pizza!",
 "zizzy": "Greetings, Earth chef!",
 "whiskers": "Arr! Here be me order!",
 "luna": "Bippity-boo, my order for you!",
 "rex": "RAWR! Here's my order!",
 "penny": "Here's my order, dearie.",
 "gus": "Ahem. My order, if you please.",
}

# --- narrator clips (order pieces, hints, cheers, gentle nudges) ---
NARR = {
 "pizza-base": "A pizza with...",
 "sauce": "sauce", "cheese": "cheese", "no": "no",
 "on-left": "on the left", "on-right": "on the right",
 "num-1": "one", "num-2": "two", "num-3": "three",
 "num-4": "four", "num-5": "five", "num-6": "six",
 "top-pepperoni": "pepperoni", "top-mushroom": "mushrooms", "top-olive": "olives",
 "top-pepper": "peppers", "top-pineapple": "pineapple", "top-broccoli": "broccoli",
 "top-mushroom-1": "mushroom", "top-olive-1": "olive", "top-pepper-1": "pepper",
 "and": "and",
 "hint-dough": "Tap the dough to pat it flat!",
 "hint-sauce": "Rub the sauce all around!",
 "hint-cheese": "Tap the pizza to shake on cheese!",
 "hint-toppings": "Now drag on the toppings!",
 "hint-sandbox": "Add anything you like, then bake it!",
 "cheer-star": "Wow! You are a pizza star!",
 "cheer-yummy": "Yummy! What a great pizza!",
 "warn-wrong": "Hmm, that's not on the order!",
 "warn-many": "Ooh, that's too many! Tap one to take it off.",
 "warn-side": "Oops! Try that topping on the other side.",
}

# --- build the job list: (voice_id, out_path, text) ---
jobs = []
for ck, vid in VOICE.items():
    if ck == "narrator":
        continue
    d = AUDIO / ck
    for i, t in enumerate(GREET[ck]):
        jobs.append((vid, d / f"greeting-{i}.mp3", t))
    for i, t in enumerate(HAPPY[ck]):
        jobs.append((vid, d / f"happy-{i}.mp3", t))
    jobs.append((vid, d / "ordercall.mp3", ORDERCALL[ck]))
for name, t in NARR.items():
    jobs.append((VOICE["narrator"], AUDIO / "narrator" / f"{name}.mp3", t))

def synth(voice_id, text):
    body = json.dumps({
        "text": text,
        "model_id": MODEL,
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128",
        data=body, method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

total, made, skipped, failed = len(jobs), 0, 0, 0
print(f"{total} clips to consider...")
for i, (vid, path, text) in enumerate(jobs, 1):
    if path.exists() and path.stat().st_size > 500:
        skipped += 1
        continue
    path.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        try:
            audio = synth(vid, text)
            path.write_bytes(audio)
            made += 1
            print(f"[{i}/{total}] {path.relative_to(ROOT)}  ({len(audio)//1024} KB)  \"{text[:40]}\"")
            time.sleep(0.3)
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:200]
            if e.code == 429:
                print(f"  rate limited, waiting 10s...")
                time.sleep(10)
                continue
            print(f"  ! HTTP {e.code} for {path.name}: {msg}")
            failed += 1
            break
        except Exception as e:
            print(f"  ! {path.name}: {e}; retry {attempt+1}")
            time.sleep(2)
    else:
        failed += 1

print(f"\nDone. made={made} skipped={skipped} failed={failed}")
print(f"Audio in {AUDIO.relative_to(ROOT)}/")
sys.exit(1 if failed else 0)
