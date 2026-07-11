# 🍕 Pizza Pals!

A cute, colorful pizza-shop game for K-2 students (ages 5–8). Kids take orders
from wacky customers — kids, dogs, robots, monsters, aliens, pirate cats,
witches, dinosaurs, grandmas, and octopus food critics — then make the pizza,
bake it, and serve it.

Built for **iPads first**, works great on **Chromebooks** too. No installs, no
accounts, no internet needed after loading — it's a single static web page.

## How to play

1. Tap **Play!** — a customer walks up and gives an order
   (e.g. *"a cheese pizza with 3 olives"*). Tap **🔊 Hear it** to have the
   order read aloud (great for pre-readers).
2. **Make the pizza**:
   - **Tap** the dough 3 times to pat it flat
   - **Rub** the sauce all around with a finger
   - **Tap** the pizza to shake on cheese
   - **Drag** the right toppings from the shelf — the order card counts along
     (`2/3`), and tapping a topping takes it back off
3. **Bake it!** — watch it through the oven window until *DING!*
4. **Serve it!** — the customer chomps it down, you earn coins, and every new
   customer becomes a **sticker** in your sticker book. Every 5 pizzas =
   a confetti celebration.

There is no failing and no timer — orders gently guide counting, matching, and
following multi-step directions.

## Learning goals (K-2)

- **Counting & subitizing** — orders show a numeral *and* that many icons
- **1-to-1 correspondence** — place exactly N toppings, fix "too many"
- **Following multi-step directions** — dough → sauce → cheese → toppings → bake
- **Listening/early reading** — spoken orders paired with icon text
- **Fine motor** — tap, scrub, and drag gestures sized for small fingers

## Running it

Any of these work:

- **Easiest**: double-click `index.html` — it runs straight from the file.
- **Classroom**: host the folder on any static web server / school LMS /
  GitHub Pages / Netlify — then bookmark it on the iPads.
- **Local server**: `python3 -m http.server 8642` in this folder, then visit
  `http://localhost:8642`.

**iPad tip**: open it in Safari, then Share → **Add to Home Screen** — it
launches fullscreen like an app. Landscape orientation only (the game asks
kids to turn the tablet if held upright).

Progress (coins, pizzas served, stickers, sound setting) is saved on the
device automatically.

## Project layout

| File | What it is |
|------|------------|
| `index.html` | The page — everything loads from here |
| `css/style.css` | All layout + animation |
| `js/game.js` | Game logic (screens, orders, drag & drop, oven, rewards) |
| `js/audio.js` | 100% synthesized sound: SFX + background music (no audio files) |
| `js/assets-characters-a.js` / `-b.js` | The 10 customers' names, dialogue, voices (+ fallback SVG art) |
| `js/assets-food.js` | Fallback SVG pizza layers, toppings, props |
| `js/assets-scenes.js` | Fallback SVG shop, kitchen, oven, logo |
| `js/assets-raster.js` | **Active art pack** — points the game at the high-res PNGs in `art/img/` |
| `art/img/` | The painted PNG art the game actually shows (characters, food, props, scenes, logo) |
| `STYLE_GUIDE.md` | The shared art direction all assets follow |
| `ART_BRIEF.md` | The image-generator hand-off used to produce the PNG art |

### Art

The game ships with **high-res painted PNG art** (in `art/img/`) as its primary
look. `js/assets-raster.js` wires those images in; the inline-SVG art in the
other `assets-*.js` files stays as an automatic fallback (if a PNG is missing,
that piece falls back to SVG). To go back to the pure-SVG look, remove the
`<script src="js/assets-raster.js">` line from `index.html`.

`art/img/sources/` holds the chroma-key intermediate renders used to cut out
the transparent art — the game does **not** use them, so that subfolder can be
deleted to save space.

No build step, no dependencies, no network calls. Everything (art, sound,
game) is self-contained, so it also works offline once loaded.
