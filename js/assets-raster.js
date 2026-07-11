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
  G.scenes.shopBg = img('scenes/pizza-shop-interior.png', 'scene-fill');
  G.scenes.counter = img('scenes/counter-front.png', 'counter-fill');
  G.scenes.kitchenBg = img('scenes/kitchen.png', 'scene-fill');
  G.scenes.logo = img('logo/pizza-pals-logo.png', 'logo-fill');

  // ---- food props (injected as innerHTML strings) ----
  G.food = G.food || {};
  G.food.tray = img('props/serving-tray.png');
  G.food.ladle = img('props/sauce-ladle.png');
  G.food.shaker = img('props/cheese-shaker.png');
  G.food.sparkle = img('props/gold-sparkle.png');
  G.food.heart = img('props/coral-heart.png');
  G.food.star = img('props/gold-star.png');
  G.food.coin = img('props/pizza-coin.png');

  // ---- toppings: keep name/emoji, replace the svg with an <img> ----
  var TOP = {
    pepperoni: 'pepperoni.png',
    mushroom: 'mushroom.png',
    olive: 'black-olive.png',
    pepper: 'green-pepper.png',
    pineapple: 'pineapple.png',
    broccoli: 'broccoli.png'
  };
  G.food.toppings = G.food.toppings || {};
  Object.keys(TOP).forEach(function (k) {
    G.food.toppings[k] = G.food.toppings[k] || { name: k, emoji: '' };
    G.food.toppings[k].svg = img('food/' + TOP[k]);
  });

  // ---- smart subsystems: paths the game builds custom DOM from ----
  G.pizzaImg = {
    dough: BASE + 'food/dough-ball.png',
    crust: BASE + 'food/pizza-crust.png',
    sauce: BASE + 'food/sauce-layer.png',
    cheese: BASE + 'food/cheese-layer.png',
    baked: BASE + 'food/baked-browning-overlay.png'
  };
  G.ovenImg = {
    body: BASE + 'scenes/pizza-oven.png',
    door: BASE + 'scenes/oven-door.png'
  };
  var C = 'characters/';
  G.charImg = {
    pip: { smile: C + 'pip-smile.png', grin: C + 'pip-grin.png' },
    barks: { smile: C + 'sir-barksalot-smile.png', grin: C + 'sir-barksalot-grin.png' },
    beep: { smile: C + 'beep-bop-smile.png', grin: C + 'beep-bop-grin.png' },
    mo: { smile: C + 'mo-smile.png', grin: C + 'mo-grin.png' },
    zizzy: { smile: C + 'zizzy-smile.png', grin: C + 'zizzy-grin.png' },
    whiskers: { smile: C + 'captain-whiskers-smile.png', grin: C + 'captain-whiskers-grin.png' },
    luna: { smile: C + 'luna-smile.png', grin: C + 'luna-grin.png' },
    rex: { smile: C + 'rex-smile.png', grin: C + 'rex-grin.png' },
    penny: { smile: C + 'gran-penny-smile.png', grin: C + 'gran-penny-grin.png' },
    gus: { smile: C + 'gus-smile.png', grin: C + 'gus-grin.png' }
  };
  G.rasterBase = BASE;

  // ---- warm the cache so art doesn't pop in mid-play ----
  // scenes + pizza layers + oven first (needed immediately), characters after.
  function preload(list) {
    list.forEach(function (src) { var im = new Image(); im.src = BASE + src; });
  }
  preload([
    'scenes/pizza-shop-interior.png', 'scenes/kitchen.png', 'scenes/counter-front.png',
    'scenes/pizza-oven.png', 'scenes/oven-door.png', 'logo/pizza-pals-logo.png',
    'food/dough-ball.png', 'food/pizza-crust.png', 'food/sauce-layer.png',
    'food/cheese-layer.png', 'food/baked-browning-overlay.png',
    'food/pepperoni.png', 'food/mushroom.png', 'food/black-olive.png',
    'food/green-pepper.png', 'food/pineapple.png', 'food/broccoli.png',
    'props/serving-tray.png', 'props/sauce-ladle.png', 'props/cheese-shaker.png',
    'props/gold-sparkle.png', 'props/coral-heart.png', 'props/gold-star.png',
    'props/pizza-coin.png'
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
