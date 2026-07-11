# Pizza Pals! — Image Generator Art Brief

The game currently ships with hand-built SVG art that follows `STYLE_GUIDE.md`.
This brief is a ready-to-use hand-off if you want to upgrade any asset to
painted raster illustrations with an image generator. Generate PNGs with
transparent backgrounds, drop them in an `img/` folder, and swap the SVG
strings in `js/assets-*.js` for `<img>`-style SVG wrappers — or hand this
document plus screenshots of the current game to a developer/AI and ask them
to wire the new art in.

## Global style prompt (prepend to every prompt below)

> Cute children's game art in the style of Toca Boca and Dr. Panda apps,
> for kids age 5–8. Chunky rounded shapes, thick dark-cocoa (#4A2E24) outlines,
> flat candy-colored fills with soft simple shading, big glossy eyes with two
> white highlight dots, rosy blush cheeks, squishy huggable silhouettes,
> no sharp corners, no text, clean transparent background, centered,
> professional 2D vector-style game asset.

**Palette to stay inside**: cream #FFF8EC, warm cream #FFE9C7, crust gold
#F2B84B, dough #F7E3B8, sauce red #E8503A, cheese yellow #FFD855, leaf green
#5FBF63, teal #7ED6DF, bubblegum #FF9EC4, coral #FF6B6B, grape #A78BFA,
orange #FFA94D, sky blue #74B9FF, wood #C98A4B, gold #FFC93C.

## Characters (10) — 1024×1228 px, transparent, facing forward, waist-up visible

Each character needs **two versions**: (a) gentle closed smile, (b) huge open
happy grin. Keep pose identical between versions.

1. **Pip** — excited human kid, brown pigtails, teal-striped shirt, bubblegum-pink accents, bouncing-with-joy energy.
2. **Sir Barksalot** — golden puppy wearing a tiny silver knight helmet with the visor up, floppy ears sticking out the sides, noble and goofy.
3. **Beep-Bop** — round friendly teal robot, antenna with a bobble, riveted panels, screen face or LED cheeks, one wheel or stubby legs.
4. **Mo** — fuzzy round purple monster with ONE huge googly eye, two nubby horns, giant goofy smile with one snaggle tooth, gentle-giant vibes.
5. **Zizzy** — mint-green alien with THREE stacked eyes, two antennae with glowing yellow tips, little UFO-skirt base, wonder-struck expression.
6. **Captain Whiskers** — orange tabby pirate cat, tiny tricorn hat, eye patch pushed up on forehead (both eyes visible), striped shirt, tiny mouse friend on shoulder.
7. **Luna** — little witch kid, oversized floppy purple hat with a star, dark bob haircut, holds a wooden spoon like a wand with a sparkle trail.
8. **Rex** — tiny round mint-and-cream T-rex kid wearing a red backpack, teeny arms, big happy snout, alternating colored back spikes.
9. **Gran Penny** — sweet grandma, enormous round glasses with big eyes behind them, silver bun, orange polka-dot shawl, holds a pink yarn ball.
10. **Gus** — cheerful lavender-blue octopus food critic, chef's neckerchief, monocle, four visible curly tentacles (one holds a tiny fork, one a notepad).

## Food & props — 512×512 px, transparent, top-down where noted

- **Dough ball** — puffy squashed ball of raw dough, flour specks, soft highlight
- **Pizza crust** — top-down golden crust ring with pale dough center, slightly wobbly hand-made circle
- **Sauce layer** — top-down organic red sauce splat with lighter swirls (must fit inside the crust center)
- **Cheese layer** — top-down melty yellow cheese with cute finger-like drips (slightly smaller than sauce)
- **Baked browning overlay** — just scattered toasty brown spots + tiny bubbles, transparent elsewhere
- **Toppings, one piece each, readable at 40 px**: pepperoni slice · mushroom slice · black olive ring · green pepper ring · pineapple chunk · mini broccoli floret
- **Props**: round wooden serving tray · red-handled sauce ladle · glass cheese shaker with silver holed lid · gold sparkle · coral heart · gold star · gold coin stamped with a pizza slice

## Scenes — 2048×1366 px landscape

- **Pizza shop interior** (customer side): warm cream walls, big arched window with smiling sun and puffy clouds, candy pennant bunting, framed pizza picture, menu chalkboard, potted plant, string lights. Keep the center clear — a character stands there.
- **Counter front** (2048×380): warm wood counter front with rounded top and a small heart/pizza emblem.
- **Kitchen**: soft cream-peach checkered tile wall, shelf of colorful topping jars, hanging utensils, window with plant, and a clean light-wood worktop across the bottom two-thirds center (interactive pizza sits there — keep it empty).
- **Pizza oven** (1024×1100): adorable rounded terracotta dome oven, cream trim, big dark arched opening with warm glow, golden metal door with round glass window and handle (door as a SEPARATE image so it can slide), analog dial, chimney with a heart-shaped smoke puff.

## Logo — 2048×820, transparent

"Pizza Pals!" in chunky bouncy hand-lettered letters, each letter slightly
rotated, alternating candy colors with thick cocoa outlines and white shine
ticks, plus a winking pizza-slice mascot with blush cheeks tucked beside the
words and a few gold sparkles. (This one MAY contain the text "Pizza Pals!")
