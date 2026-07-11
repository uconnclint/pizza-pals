/* ============================================================
   Pizza Pals! — raster art pack
   Overrides the built-in SVG art with the high-res PNG art in art/img/.
   Loaded AFTER the SVG asset files (so it overrides their visuals) and
   BEFORE game.js (so the game reads these values at init).
   Keeps all character names / greetings / voices / order lines from the
   SVG files — only the visuals are swapped.
   ============================================================ */
(function () {
  'use strict';
  var G = window.GAME_ASSETS = window.GAME_ASSETS || {};
  var BASE = 'art/img/';
  G.useRaster = true;

  function img(src, cls) {
    return '<img class="' + (cls || 'ras-contain') + '" src="' + BASE + src +
      '" alt="" draggable="false">';
  }

  // ---- scenes (injected as innerHTML strings) ----
  G.scenes = G.scenes || {};
  G.scenes.shopBg = img('scenes/pizza-shop-interior.webp', 'scene-fill');
  G.scenes.counter = img('scenes/counter-front.webp', 'counter-fill');
  G.scenes.kitchenBg = img('scenes/kitchen.webp', 'scene-fill');
  G.scenes.logo = img('logo/pizza-pals-logo.webp', 'logo-fill');

  // ---- food props (injected as innerHTML strings) ----
  G.food = G.food || {};
  G.food.tray = img('props/serving-tray.webp');
  G.food.ladle = img('props/sauce-ladle.webp');
  G.food.shaker = img('props/cheese-shaker.webp');
  G.food.sparkle = img('props/gold-sparkle.webp');
  G.food.heart = img('props/coral-heart.webp');
  G.food.star = img('props/gold-star.webp');
  G.food.coin = img('props/pizza-coin.webp');

  // ---- toppings: keep name/emoji, replace the svg with an <img> ----
  var TOP = {
    pepperoni: 'pepperoni.webp',
    mushroom: 'mushroom.webp',
    olive: 'black-olive.webp',
    pepper: 'green-pepper.webp',
    pineapple: 'pineapple.webp',
    broccoli: 'broccoli.webp'
  };
  G.food.toppings = G.food.toppings || {};
  Object.keys(TOP).forEach(function (k) {
    G.food.toppings[k] = G.food.toppings[k] || { name: k, emoji: '' };
    G.food.toppings[k].svg = img('food/' + TOP[k]);
  });

  // ---- smart subsystems: paths the game builds custom DOM from ----
  G.pizzaImg = {
    dough: BASE + 'food/dough-ball.webp',
    crust: BASE + 'food/pizza-crust.webp',
    sauce: BASE + 'food/sauce-layer.webp',
    cheese: BASE + 'food/cheese-layer.webp',
    baked: BASE + 'food/baked-browning-overlay.webp'
  };
  G.ovenImg = {
    body: BASE + 'scenes/pizza-oven.webp',
    door: BASE + 'scenes/oven-door.webp'
  };
  var C = 'characters/';
  G.charImg = {
    pip: { smile: C + 'pip-smile.webp', grin: C + 'pip-grin.webp' },
    barks: { smile: C + 'sir-barksalot-smile.webp', grin: C + 'sir-barksalot-grin.webp' },
    beep: { smile: C + 'beep-bop-smile.webp', grin: C + 'beep-bop-grin.webp' },
    mo: { smile: C + 'mo-smile.webp', grin: C + 'mo-grin.webp' },
    zizzy: { smile: C + 'zizzy-smile.webp', grin: C + 'zizzy-grin.webp' },
    whiskers: { smile: C + 'captain-whiskers-smile.webp', grin: C + 'captain-whiskers-grin.webp' },
    luna: { smile: C + 'luna-smile.webp', grin: C + 'luna-grin.webp' },
    rex: { smile: C + 'rex-smile.webp', grin: C + 'rex-grin.webp' },
    penny: { smile: C + 'gran-penny-smile.webp', grin: C + 'gran-penny-grin.webp' },
    gus: { smile: C + 'gus-smile.webp', grin: C + 'gus-grin.webp' }
  };
  G.rasterBase = BASE;

  // ---- warm the cache so art doesn't pop in mid-play ----
  // scenes + pizza layers + oven first (needed immediately), characters after.
  function preload(list) {
    list.forEach(function (src) { var im = new Image(); im.src = BASE + src; });
  }
  preload([
    'scenes/pizza-shop-interior.webp', 'scenes/kitchen.webp', 'scenes/counter-front.webp',
    'scenes/pizza-oven.webp', 'scenes/oven-door.webp', 'logo/pizza-pals-logo.webp',
    'food/dough-ball.webp', 'food/pizza-crust.webp', 'food/sauce-layer.webp',
    'food/cheese-layer.webp', 'food/baked-browning-overlay.webp',
    'food/pepperoni.webp', 'food/mushroom.webp', 'food/black-olive.webp',
    'food/green-pepper.webp', 'food/pineapple.webp', 'food/broccoli.webp',
    'props/serving-tray.webp', 'props/sauce-ladle.webp', 'props/cheese-shaker.webp',
    'props/gold-sparkle.webp', 'props/coral-heart.webp', 'props/gold-star.webp',
    'props/pizza-coin.webp'
  ]);
  // characters trickle in shortly after so the first paint isn't delayed
  setTimeout(function () {
    var chars = [];
    Object.keys(G.charImg).forEach(function (k) {
      chars.push(G.charImg[k].smile, G.charImg[k].grin);
    });
    preload(chars);
  }, 400);
})();
