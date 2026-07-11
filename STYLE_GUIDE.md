# Pizza Pals! — Art Style Guide (SHARED — all asset authors must follow this)

Pizza Pals! is a cute, cozy, candy-colored pizza shop game for K-2 kids (ages 5–8),
played primarily on iPads. Think "ABCya / Toca Boca / Dr. Panda" quality: chunky,
squishy, rounded, friendly. Everything looks huggable.

## Golden rules

1. **Chunky rounded outlines.** Every major shape gets a dark cocoa outline:
   `stroke="#4A2E24"`, `stroke-width="6"` (on a ~200-unit viewBox; scale stroke
   proportionally for other viewBox sizes), `stroke-linejoin="round"`,
   `stroke-linecap="round"`. Small interior details may use stroke-width 3–4.
2. **Flat candy colors + one soft shade.** Fill shapes with flat color from the
   palette below. Add depth with ONE darker overlay shape (same hue, ~15% darker,
   no stroke) on the lower/side third of big shapes, and ONE lighter highlight
   blob on top. No complex gradients. A single simple radial/linear gradient is
   allowed per asset for glow (oven fire, cheese sheen) only.
3. **Big glossy eyes.** Eyes are large ovals: white sclera with outline, big
   colored/dark iris circle, and TWO white highlight dots (one big upper-left,
   one tiny lower-right). Everything alive gets rosy blush: two `#FFB3A7`
   ellipses at ~55% opacity, no stroke, on the cheeks.
4. **Squishy silhouettes.** No sharp corners anywhere. Bodies are pear/bean/blob
   shaped. Hands are mittens or simple circles. Feet are little ovals.
5. **Self-contained SVG.** No external refs, no `<image>`, no `<script>`, no CSS
   classes that need an external stylesheet (inline `style=""` or presentation
   attributes only, EXCEPT the required animation hook classes listed in your
   task). No `width`/`height` attributes on the root `<svg>` — viewBox only.
6. **Unique IDs.** If you use `id` (for gradients/clips), prefix EVERY id with
   your asset's key, e.g. `id="pip-hairGrad"`. Assets are inlined into one page;
   colliding ids break rendering.

## Palette (use these; small deviations for character identity are OK)

| Purpose            | Hex       |
|--------------------|-----------|
| Outline (all)      | `#4A2E24` |
| Cream / paper      | `#FFF8EC` |
| Warm bg cream      | `#FFE9C7` |
| Crust golden       | `#F2B84B` |
| Crust shadow       | `#D89A32` |
| Dough raw          | `#F7E3B8` |
| Sauce red          | `#E8503A` |
| Sauce light        | `#F26D5B` |
| Cheese yellow      | `#FFD855` |
| Cheese deep        | `#F5B93E` |
| Basil / leaf green | `#5FBF63` |
| Deep green         | `#3E9D4C` |
| Sky teal           | `#7ED6DF` |
| Deep teal          | `#3FBAC6` |
| Bubblegum pink     | `#FF9EC4` |
| Hot coral          | `#FF6B6B` |
| Grape purple       | `#A78BFA` |
| Deep purple        | `#7C5CE0` |
| Sunny orange       | `#FFA94D` |
| Sky blue           | `#74B9FF` |
| Wood counter       | `#C98A4B` |
| Wood dark          | `#A96B33` |
| Blush              | `#FFB3A7` |
| Star gold          | `#FFC93C` |

## Quality bar

- Each character/prop should read instantly at 150px tall on a busy screen.
- Silhouette first: a kid should recognize "robot!" from the outline alone.
- 20–60 shapes per character is the sweet spot: detailed but not noisy.
- Test mentally against: "would this fit in a Toca Boca game?" If it looks like
  clip-art or a diagram, add charm: tilt the head, offset the eyes, add a prop,
  a pattern, a tiny companion (a bird, a bee, an antenna bobble).
