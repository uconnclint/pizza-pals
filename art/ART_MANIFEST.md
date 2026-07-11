# Pizza Pals generated art

This folder contains 45 final PNG assets generated from the supplied Pizza Pals art brief with the built-in image generator. Transparent assets were generated on a flat chroma-key background and converted locally to RGBA PNGs.

## Deliverables

- `img/characters/`: 20 character sprites (gentle smile and huge grin for all 10 characters), 1024×1228 RGBA.
- `img/food/`: 11 food/layer/topping sprites, 512×512 RGBA.
- `img/props/`: 8 prop sprites, 512×512 RGBA.
- `img/scenes/`: shop interior and kitchen at 2048×1366; counter at 2048×380 RGBA; oven and separate door at 1024×1100 RGBA.
- `img/logo/pizza-pals-logo.png`: 2048×820 RGBA.
- `img/sources/`: retained chroma-key source renders used for local background removal.

## Prompt set

All prompts used the supplied character, object, scene, and logo descriptions. Shared direction was normalized to: cute original children's mobile-game art for ages 5–8; chunky rounded shapes; thick dark-cocoa `#4A2E24` outlines; candy-color palette from the brief; flat fills with soft shading; glossy eyes and rosy cheeks where applicable; polished 2D vector-style rendering; no sharp corners, unrelated text, or watermarks.

Character grin images were produced as expression-only edits of their matching gentle-smile source, with pose, silhouette, crop, clothing, props, eyes, palette, and composition held invariant. Transparent items used a uniform green chroma-key source and local matte/despill processing. Full-bleed scene backgrounds did not use transparency.

## Integration note

The supplied brief mentions replacing SVG strings in `js/assets-*.js`, but no game source or `STYLE_GUIDE.md` exists in this workspace. Only the generated art and repeatable local post-processing scripts are included here.
