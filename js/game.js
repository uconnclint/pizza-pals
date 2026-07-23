/* ============================================================
   Pizza Pals! — core game
   Flow: title → customer order → make pizza → bake → serve → repeat

   Boot is a named global (window.__ppStart) called by js/engine-bridge.js
   — a <script type="module"> that runs AFTER every classic script here,
   once window.CE exists. This file used to self-invoke via an IIFE, but
   its save-loading (further down) needs window.CE to already exist, and
   module scripts always execute after every classic script in the
   document has run (regardless of source order), so the whole body has to
   wait for the bridge to call it rather than run itself immediately.
   ============================================================ */
window.__ppStart = function () {
  'use strict';

  // Boot guard: never let a second execution (extension re-injection, bfcache
  // quirks, double script evaluation) attach a duplicate set of listeners.
  if (window.__PIZZA_PALS_BOOTED__) return;
  window.__PIZZA_PALS_BOOTED__ = true;

  // ---------- shortcuts & safety ----------
  var $ = function (id) { return document.getElementById(id); };
  var A = window.GAME_ASSETS || {};
  A.characters = A.characters || {};
  A.food = A.food || {};
  A.scenes = A.scenes || {};
  var AU = window.GameAudio || {};
  ['init', 'setMuted', 'pop', 'splat', 'sprinkle', 'squish', 'whoosh', 'ding',
    'sizzleStart', 'sizzleStop', 'munch', 'tada', 'coin', 'sad', 'bgmStart', 'bgmStop'
  ].forEach(function (k) { if (typeof AU[k] !== 'function') AU[k] = function () {}; });

  var TOPPING_KEYS = ['pepperoni', 'mushroom', 'olive', 'pepper', 'pineapple', 'broccoli'];

  function svgInner(str) {
    if (!str) return '';
    return String(str).replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  }
  function topSvg(key) {
    var t = A.food.toppings && A.food.toppings[key];
    return (t && t.svg) || '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="22" fill="#E8503A" stroke="#4A2E24" stroke-width="4"/></svg>';
  }
  function topName(key) {
    var t = A.food.toppings && A.food.toppings[key];
    return (t && t.name) || key;
  }
  function topNameFor(key, count) {
    var name = topName(key);
    // Normalize asset labels for natural order sentences.
    if (count === 1 && /^(olives|mushrooms|peppers)$/.test(name)) return name.slice(0, -1);
    if (count !== 1 && name === 'pineapple') return 'pineapples';
    return name;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rnd(arr.length)]; }

  // ---------- raster art helpers ----------
  var RASTER = !!A.useRaster;
  // The pizza BASE stays inline-SVG even in raster mode: PNG pizza layers
  // triggered a GPU texture-aliasing bug on iPad/Chromebook where the pizza
  // area showed stale topping textures until first touch. SVG draws as vectors
  // (no image textures) and is immune. Oven/characters/scenes stay raster.
  var PIZZA_RASTER = false;
  var OVEN_RASTER = !!(A.useRaster && A.ovenImg);
  function charImgTag(key, kind, extra) {
    var c = A.charImg && A.charImg[key];
    if (!c) return '';
    return '<img class="char-img char-' + (kind === 'grin' ? 'happy' : 'smile') + '" src="' +
      A.rasterBase + c[kind] + '" alt="" draggable="false"' + (extra || '') + '>';
  }
  function characterHTML(ch, key) {
    if (RASTER && A.charImg && A.charImg[key]) {
      var c = A.charImg[key];
      return '<img class="char-img char-face" src="' + A.rasterBase + c.smile +
        '" data-smile="' + A.rasterBase + c.smile + '" data-grin="' + A.rasterBase + c.grin +
        '" alt="" draggable="false">';
    }
    return (ch && ch.svg) || '';
  }
  function stickerArtHTML(ch, key) {
    if (RASTER && A.charImg && A.charImg[key]) {
      return '<img class="sticker-img" src="' + A.rasterBase + A.charImg[key].smile +
        '" alt="" draggable="false">';
    }
    return (ch && ch.svg) || '';
  }

  // ---------- persistence ----------
  // Facade over window.CE.save (js/engine-bridge.js): SAVE_DEFAULTS/
  // migrateLegacySave there preserve this exact shape (coins, served,
  // sandboxMade, stickers, tutorialSeen, settings{}, stats{}, unlocks{},
  // theme) minus `muted`, which now lives in CE.settings exclusively (see
  // toggleSound() below). CE.save.get() returns the SAME live mutable
  // object every time, so every `save.foo = ...` / `save.foo.bar++` below
  // keeps working exactly as before — only how it's loaded/written changed.
  var CE = window.CE;
  var save = CE.save.get();
  function persist() { CE.save.save(); }

  // ---------- runtime state ----------
  var st = {
    screen: 'title',
    charKey: null,
    order: null,          // { toppings: {key: count}, }
    placed: {},           // key -> count on pizza
    step: 'dough',
    doughTaps: 0,
    sauceProgress: 0,
    cheeseTaps: 0,
    baking: false,
    sandbox: false,
    lastCustomer: null,
    placements: [],
    orderMistakes: 0,
    orderReplays: 0,
    orderStartedAt: 0,
    selectedBin: null,
    pendingAfterTutorial: null,
    timerId: null
  };

  // ---------- voice (ElevenLabs clips, one per character + a narrator) ----------
  var GV = window.GameVoice || { play: function () {}, seq: function () {}, stop: function () {}, setMuted: function () {}, preload: function () {}, unlock: function () {} };
  var SINGULAR = { mushroom: 1, olive: 1, pepper: 1 };
  // No `!muted` guard here anymore: GV.play/seq route through window.CE.speech
  // (see voice.js), which already gates on CE.settings.get('muted') itself —
  // single source of truth, same reasoning as toggleSound() below.
  // `fallbackText` is what SpeechSynthesis speaks if the clip is missing or
  // fails to load (see voice.js's header comment for how the two combine).
  function vplay(url, fallbackText) { GV.play(url, fallbackText); }
  function vseq(urls, fallbackText) { if (urls && urls.length) GV.seq(urls, fallbackText); }

  // TTS fallback text for the fixed narrator/*.mp3 clips below — copied
  // verbatim from voice/generate.py's NARR dict (the frozen source of
  // truth for what each clip actually says), not re-derived from the
  // on-screen hint strings (which carry trailing emoji unsuited to speech).
  var NARR_SPEECH = {
    dough: 'Tap the dough to pat it flat!',
    sauce: 'Rub the sauce all around!',
    cheese: 'Tap the pizza to shake on cheese!',
    toppings: 'Now drag on the toppings!',
    sandbox: 'Add anything you like, then bake it!',
    warnWrong: "Hmm, that's not on the order!",
    warnMany: "Ooh, that's too many! Tap one to take it off.",
    warnSide: "Oops! Try that topping on the other side.",
    cheerStar: 'Wow! You are a pizza star!',
    cheerYummy: 'Yummy! What a great pizza!'
  };
  // build the clip sequence that reads an order aloud (matches orderSentence)
  function orderClips(charKey, order) {
    var seq = [charKey + '/ordercall.mp3', 'narrator/pizza-base.mp3'];
    if (order.sauce === false) seq.push('narrator/no.mp3');
    seq.push('narrator/sauce.mp3');
    if (order.cheese === false) seq.push('narrator/no.mp3');
    seq.push('narrator/cheese.mp3');
    Object.keys(order.toppings).forEach(function (k) {
      var n = order.toppings[k];
      seq.push('narrator/num-' + Math.max(1, Math.min(6, n)) + '.mp3');
      seq.push('narrator/top-' + k + (n === 1 && SINGULAR[k] ? '-1' : '') + '.mp3');
      if (order.zones && order.zones[k]) seq.push('narrator/on-' + order.zones[k] + '.mp3');
    });
    if (order.forbidden) { seq.push('narrator/no.mp3'); seq.push('narrator/top-' + order.forbidden + '.mp3'); }
    return seq;
  }
  // legacy no-op — every spoken line now routes through GameVoice clips
  function speak() {}

  function announce(text) {
    var el = $('sr-status');
    if (!el) return;
    el.textContent = '';
    setTimeout(function () { el.textContent = text; }, 20);
  }
  function difficulty() { return Math.max(1, Math.min(4, Number(save.settings.difficulty) || 1)); }
  function memoryMode() { return !!save.settings.memory || difficulty() >= 3; }
  function showHints() { return !!save.settings.hints && difficulty() < 4; }
  function applyPreferences() {
    document.body.classList.toggle('reduce-motion', !!save.settings.reducedMotion);
    document.body.classList.remove('theme-sunshine', 'theme-space', 'theme-rainbow');
    if (save.theme && save.theme !== 'classic') document.body.classList.add('theme-' + save.theme);
    $('hud-level').textContent = 'Level ' + difficulty();
  }

  // ---------- screens ----------
  function showScreen(name) {
    ['title', 'counter', 'kitchen', 'stickers'].forEach(function (s) {
      $('screen-' + s).classList.toggle('active', s === name);
    });
    st.screen = name;
    $('hud').classList.toggle('hidden', name === 'title' || name === 'stickers');
    // The title's floating toppings animate on an infinite loop. Left running
    // while another screen is up, their GPU-composited textures bled into the
    // pizza-making area (dough showed stale topping images until first touch).
    // Fully remove them from the render tree whenever the title isn't showing.
    var fl = $('title-floaties');
    if (fl) fl.style.display = (name === 'title') ? '' : 'none';
  }

  // ---------- HUD ----------
  function totalPizzas() { return save.served + (save.sandboxMade || 0); }
  function refreshHud() {
    $('coin-count').textContent = save.coins;
    $('served-count').textContent = totalPizzas();
    var ic = CE.settings.get('muted') ? '🔇' : '🔊';
    $('btn-sound').textContent = ic;
    $('btn-sound-title').textContent = ic;
    $('hud-coins').setAttribute('aria-label', save.coins + ' coins. Open reward shop.');
    $('hud-served').setAttribute('aria-label', totalPizzas() + ' pizzas made.');
    $('hud-level').textContent = 'Level ' + difficulty();
    if ($('shop-coins')) $('shop-coins').textContent = save.coins;
  }
  // `muted` now lives ONLY in CE.settings (no more save.muted) — this just
  // flips it. AU.setMuted/GV.setMuted/GV.stop()/bgm start-on-unmute all
  // happen in the CE.settings.onChange('muted') listener wired in init()
  // below, so ANY future code path that changes `muted` (not just this
  // button) keeps AU/GV in sync too, not just this one call site.
  function toggleSound() {
    CE.settings.set('muted', !CE.settings.get('muted'));
    refreshHud();
  }

  // ---------- FX ----------
  var fx = $('fx-layer');
  function particleBurst(x, y, svgOrEmoji, n, spread, isSvg) {
    for (var i = 0; i < (n || 8); i++) {
      var p = document.createElement('div');
      p.className = 'particle p-burst';
      var ang = Math.random() * Math.PI * 2;
      var d = (spread || 80) * (0.4 + Math.random() * 0.6);
      p.style.setProperty('--dx', Math.cos(ang) * d + 'px');
      p.style.setProperty('--dy', (Math.sin(ang) * d - 30) + 'px');
      p.style.left = x + 'px'; p.style.top = y + 'px';
      var sz = 16 + rnd(18);
      p.style.width = sz + 'px'; p.style.height = sz + 'px';
      if (isSvg) { p.innerHTML = svgOrEmoji; }
      else { p.style.fontSize = sz + 'px'; p.textContent = svgOrEmoji; }
      fx.appendChild(p);
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 800);
    }
  }
  function sparkleAt(x, y, n) {
    particleBurst(x, y, A.food.sparkle || '✨', n || 10, 110, !!A.food.sparkle);
  }
  function heartsAt(x, y, n) {
    for (var i = 0; i < (n || 5); i++) {
      (function (i) {
        setTimeout(function () {
          var p = document.createElement('div');
          p.className = 'particle p-float';
          p.style.left = (x + (Math.random() - 0.5) * 120) + 'px';
          p.style.top = (y + (Math.random() - 0.5) * 40) + 'px';
          var sz = 26 + rnd(20);
          p.style.width = sz + 'px'; p.style.height = sz + 'px';
          p.innerHTML = A.food.heart || '';
          if (!A.food.heart) { p.textContent = '❤️'; p.style.fontSize = sz + 'px'; }
          fx.appendChild(p);
          setTimeout(function () { p.remove(); }, 1100);
        }, i * 140);
      })(i);
    }
  }
  var CONFETTI_COLORS = ['#FF6B6B', '#FFC93C', '#5FBF63', '#7ED6DF', '#A78BFA', '#FF9EC4', '#FFA94D'];
  function confetti(n) {
    for (var i = 0; i < (n || 60); i++) {
      var p = document.createElement('div');
      p.className = 'particle p-confetti';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '0px';
      p.style.width = 8 + rnd(10) + 'px';
      p.style.height = 12 + rnd(10) + 'px';
      p.style.background = pick(CONFETTI_COLORS);
      p.style.animationDelay = Math.random() * 0.6 + 's';
      p.style.animationDuration = 1.8 + Math.random() * 1.2 + 's';
      fx.appendChild(p);
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 3400);
    }
  }
  function showBanner(text) {
    var b = $('banner');
    b.textContent = text;
    b.classList.remove('hidden', 'show');
    void b.offsetWidth; // restart animation
    b.classList.add('show');
    setTimeout(function () { b.classList.add('hidden'); }, 2600);
  }
  function coinsFly(amount, fromX, fromY) {
    var target = $('hud-coins').getBoundingClientRect();
    var flights = Math.min(6, amount);
    for (var i = 0; i < flights; i++) {
      (function (i) {
        setTimeout(function () {
          var c = document.createElement('div');
          c.className = 'coin-fly';
          if (A.food.coin) { c.innerHTML = A.food.coin; c.style.width = '34px'; c.style.height = '34px'; }
          else c.textContent = '🪙';
          c.style.left = (fromX + (Math.random() - 0.5) * 80) + 'px';
          c.style.top = (fromY + (Math.random() - 0.5) * 40) + 'px';
          fx.appendChild(c);
          void c.offsetWidth;
          c.style.left = (target.left + target.width / 2) + 'px';
          c.style.top = (target.top + target.height / 2) + 'px';
          setTimeout(function () { c.remove(); AU.coin(); }, 720);
        }, i * 120);
      })(i);
    }
    setTimeout(function () {
      save.coins += amount;
      persist(); refreshHud();
      var pill = $('hud-coins');
      pill.style.transform = 'scale(1.2)';
      setTimeout(function () { pill.style.transform = ''; }, 200);
    }, 900);
  }

  // ---------- customers & orders ----------
  function charKeys() { return Object.keys(A.characters); }
  function pickCustomer() {
    var keys = charKeys();
    if (!keys.length) return null;
    var options = keys.filter(function (k) { return k !== st.lastCustomer; });
    if (!options.length) options = keys;
    // favor characters not yet stickered
    var fresh = options.filter(function (k) { return !save.stickers[k]; });
    return pick(fresh.length && Math.random() < 0.7 ? fresh : options);
  }
  function makeOrder() {
    var level = difficulty();
    var nTypes = level === 1 ? 1 : (level === 2 ? 1 + rnd(2) : (level === 3 ? 2 : 2 + rnd(2)));
    var maxCount = [0, 3, 4, 4, 5][level];
    var keys = TOPPING_KEYS.slice();
    var chosen = {};
    var zones = {};
    for (var i = 0; i < nTypes; i++) {
      var k = keys.splice(rnd(keys.length), 1)[0];
      chosen[k] = 1 + rnd(maxCount);
      if (level >= 4) zones[k] = pick(['left', 'right']);
    }
    var sauce = level === 1 ? true : Math.random() < 0.72;
    var cheese = level === 1 ? true : Math.random() < 0.72;
    var forbidden = level >= 4 && keys.length ? keys.splice(rnd(keys.length), 1)[0] : null;
    return { toppings: chosen, sauce: sauce, cheese: cheese, zones: zones, forbidden: forbidden, level: level };
  }
  function orderPhrases(order) {
    return Object.keys(order.toppings).map(function (k) {
      return order.toppings[k] + ' ' + topNameFor(k, order.toppings[k]);
    });
  }
  function orderSentence(order) {
    var base = [];
    base.push(order.sauce === false ? 'no sauce' : 'sauce');
    base.push(order.cheese === false ? 'no cheese' : 'cheese');
    var toppingText = Object.keys(order.toppings).map(function (k) {
      var text = order.toppings[k] + ' ' + topNameFor(k, order.toppings[k]);
      return order.zones && order.zones[k] ? text + ' on the ' + order.zones[k] : text;
    });
    var all = base.concat(toppingText);
    if (order.forbidden) all.push('no ' + topName(order.forbidden));
    var joined = all.length > 1 ? all.slice(0, -1).join(', ') + ' and ' + all[all.length - 1] : all[0];
    return 'a pizza with ' + joined;
  }
  function renderOrderCard(el, order) {
    var html = '<div class="order-rule">' + (order.sauce === false ? '🚫 No sauce' : '🥫 Sauce') +
      ' &nbsp; ' + (order.cheese === false ? '🚫 No cheese' : '🧀 Cheese') + '</div>';
    Object.keys(order.toppings).forEach(function (k) {
      var n = order.toppings[k];
      var minis = '';
      for (var i = 0; i < n; i++) minis += '<span class="ic">' + topSvg(k) + '</span>';
      html += '<div class="order-line"><span class="num">' + n + '</span>' +
        '<span class="ic">' + topSvg(k) + '</span>' +
        '<span style="font-size:20px">→</span><span class="minis">' + minis + '</span>' +
        (order.zones && order.zones[k] ? '<span class="order-rule">' + (order.zones[k] === 'left' ? '⬅️ left' : 'right ➡️') + '</span>' : '') + '</div>';
    });
    if (order.forbidden) html += '<div class="order-line forbidden"><span class="num">✕</span><span class="ic">' + topSvg(order.forbidden) + '</span><span>No ' + topName(order.forbidden) + '</span></div>';
    el.innerHTML = html;
  }
  function speakOrder(replay) {
    var ch = A.characters[st.charKey];
    if (!ch || !st.order) return;
    if (replay) {
      st.orderReplays++;
      save.stats.replays++;
      persist();
    }
    // orderSentence() builds the same content as human-readable prose
    // (it's what's shown on screen) — the natural TTS fallback if any clip
    // in the sequence is missing or fails to load.
    vseq(orderClips(st.charKey, st.order), orderSentence(st.order));
  }

  // ---------- counter scene ----------
  function enterCustomer() {
    showScreen('counter');
    st.charKey = pickCustomer();
    st.lastCustomer = st.charKey;
    st.order = makeOrder();
    st.orderMistakes = 0;
    st.orderReplays = 0;
    st.orderStartedAt = Date.now();
    GV.preload([st.charKey + '/greeting-0.mp3', st.charKey + '/greeting-1.mp3', st.charKey + '/greeting-2.mp3',
      st.charKey + '/ordercall.mp3', 'narrator/pizza-base.mp3']);
    var ch = A.characters[st.charKey] || { name: '???', svg: '', greetings: ['Hello!'], voice: {} };

    var art = $('customer-art');
    art.className = '';
    art.innerHTML = characterHTML(ch, st.charKey);
    setMouth(art, false);
    $('speech-bubble').classList.add('hidden');
    $('speech-feedback').classList.add('hidden');
    $('btn-make').classList.add('hidden');
    $('btn-next').classList.add('hidden');
    $('serve-tray').classList.add('hidden');
    $('serve-tray').className = 'serve-tray hidden';

    AU.whoosh();
    void art.offsetWidth;
    art.classList.add('enter');
    setTimeout(function () {
      art.classList.remove('enter');
      art.style.transform = 'translateX(0)';
      art.classList.add('idle');
      greet(ch);
    }, 1000);
  }
  function greet(ch) {
    var bubble = $('speech-bubble');
    var greets = ch.greetings || ['Hello!'];
    var gi = rnd(greets.length);
    $('speech-text').textContent = greets[gi];
    $('speech-order').classList.add('hidden');
    $('btn-hear').classList.add('hidden');
    bubble.classList.remove('hidden');
    vplay(st.charKey + '/greeting-' + gi + '.mp3', greets[gi]);
    setTimeout(function () { showOrder(ch); }, 1900);
  }
  function showOrder(ch) {
    if (st.screen !== 'counter' || !st.order) return;
    var line = pick(ch.orderLines || ['I would like {ORDER}, please!']);
    line = line.replace(/\b(?:your|some) \{ORDER\}/i, '{ORDER}');
    var mode = save.settings.instructionMode || 'both';
    $('speech-text').textContent = mode === 'listen' ? '👂 Listen carefully to my order!' : line.replace('{ORDER}', orderSentence(st.order) + ' 🍕');
    renderOrderCard($('speech-order'), st.order);
    $('speech-order').classList.toggle('memory-ready', memoryMode());
    $('speech-order').classList.toggle('hidden', mode === 'listen');
    $('btn-hear').classList.toggle('hidden', mode === 'read');
    $('btn-make').classList.remove('hidden');
    if (mode !== 'read') speakOrder(false);
  }
  function setMouth(rootEl, happy) {
    // Raster characters use one image element and swap its source. Keeping two
    // large transparent WebP layers stacked triggered black texture blocks on
    // some Chromebook/iPad GPUs during the happy-face transition.
    var face = rootEl.querySelector('.char-face');
    if (face) {
      var target = happy ? face.dataset.grin : face.dataset.smile;
      if (target && face.getAttribute('src') !== target) face.setAttribute('src', target);
      return;
    }
    // compatibility with older cached markup
    var smile = rootEl.querySelector('.char-smile');
    var grin = rootEl.querySelector('.char-happy');
    if (smile && grin) {
      smile.style.display = happy ? 'none' : '';
      grin.style.display = happy ? '' : 'none';
      return;
    }
    // svg characters: toggle the mouth groups
    rootEl.querySelectorAll('.mouth-normal').forEach(function (m) { m.style.display = happy ? 'none' : ''; });
    rootEl.querySelectorAll('.mouth-happy').forEach(function (m) { m.style.display = happy ? '' : 'none'; });
  }

  // ---------- kitchen: build & steps ----------
  var pizzaZone = $('pizza-zone');
  var pizzaBase = $('pizza-base');
  var pizzaTops = $('pizza-toppings');
  var toolCursor = $('tool-cursor');

  // free-play: no customer, no order — make whatever you like
  function startSandbox() {
    st.sandbox = true;
    st.charKey = null;
    st.order = null;
    startKitchen();
  }

  function stopOrderTimer() {
    if (st.timerId) clearInterval(st.timerId);
    st.timerId = null;
    $('order-timer').classList.add('hidden');
  }
  function startOrderTimer() {
    stopOrderTimer();
    if (st.sandbox || !save.settings.timer) return;
    var el = $('order-timer');
    el.classList.remove('hidden');
    function tickTimer() {
      var seconds = Math.max(0, Math.floor((Date.now() - st.orderStartedAt) / 1000));
      el.textContent = '⏱ ' + Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
    }
    tickTimer(); st.timerId = setInterval(tickTimer, 1000);
  }

  function startKitchen() {
    showScreen('kitchen');
    st.placed = {};
    st.placements = [];
    st.step = 'dough';
    st.doughTaps = 0;
    st.sauceProgress = 0;
    st.cheeseTaps = 0;
    st.baking = false;

    $('oven-overlay').classList.add('hidden');
    $('oven-overlay').classList.remove('door-open');
    $('btn-bake').classList.add('hidden');
    $('topping-bins').classList.add('hidden');
    $('base-choices').classList.add('hidden');
    toolCursor.classList.add('hidden');
    pizzaTops.innerHTML = '';
    $('pizza-wrap').style.visibility = '';

    buildPizzaBase();
    renderOrderStrip();
    if (!st.sandbox && save.settings.quickPrep && save.served >= 3) quickPrepareBase();
    else setStep('dough');
    forcePizzaPaint();
    startOrderTimer();
  }

  function quickPrepareBase() {
    var ball = $('dough-ball');
    if (ball) ball.style.display = 'none';
    var crust = document.getElementById('pz-crust');
    if (crust) crust.style.display = '';
    if (!st.order || st.order.sauce !== false) {
      var clip = document.getElementById('pz-clip-c');
      if (clip) clip.setAttribute('r', 106);
    }
    if (!st.order || st.order.cheese !== false) {
      var cheese = document.getElementById('pz-cheese');
      if (cheese) cheese.setAttribute('opacity', 1);
    }
    showBanner('⚡ Base prepared — focus on the order!');
    setStep('toppings');
  }

  // The pizza base renders as inline SVG (vectors), which paints reliably on
  // entry — no image warm-up or repaint nudging needed.
  function forcePizzaPaint() {}

  // Create a raster pizza layer on demand (once). Building the layers
  // progressively — instead of stacking all five images up front — avoids a
  // GPU compositing bug on iPad/Chromebook where the pile of same-position
  // images showed stale topping textures until the first touch.
  function pzEnsure(cls, src, style) {
    var el = pizzaBase.querySelector('.' + cls);
    if (el) return el;
    el = document.createElement('img');
    el.className = 'pz-layer ' + cls;
    el.src = src;
    el.alt = '';
    el.draggable = false;
    if (style) el.setAttribute('style', style);
    pizzaBase.appendChild(el);
    return el;
  }

  function buildPizzaBase() {
    if (PIZZA_RASTER) {
      // only the dough exists at first — one image, like every other screen
      pizzaBase.innerHTML =
        '<div id="dough-ball"><img class="pz-layer pz-dough" src="' + A.pizzaImg.dough + '" alt="" draggable="false"></div>';
      return;
    }
    pizzaBase.innerHTML =
      '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">' +
      '<g id="pz-crust" style="display:none">' + svgInner(A.food.crust) + '</g>' +
      '<clipPath id="pz-clip"><circle id="pz-clip-c" cx="150" cy="150" r="0"/></clipPath>' +
      '<g id="pz-sauce" clip-path="url(#pz-clip)">' + svgInner(A.food.sauceLayer) + '</g>' +
      '<g id="pz-cheese" opacity="0">' + svgInner(A.food.cheeseLayer) + '</g>' +
      '<g id="pz-baked" opacity="0">' + svgInner(A.food.bakedSpots) + '</g>' +
      '</svg>' +
      '<div id="dough-ball">' + (A.food.doughBall || '') + '</div>';
  }

  var stepHints = {
    dough: 'Tap the dough to pat it flat! 👇',
    sauce: 'Rub the sauce all around! 🥫',
    cheese: 'Tap the pizza to shake on cheese! 🧀',
    toppings: 'Drag the toppings from the shelf! 👆'
  };
  function setStep(step) {
    st.step = step;
    $('base-choices').classList.add('hidden');
    var hint = $('step-hint');
    hint.textContent = stepHints[step] || '';
    hint.style.opacity = stepHints[step] ? 1 : 0;
    if (step === 'sauce') {
      if (PIZZA_RASTER) pzEnsure('pz-sauce', A.pizzaImg.sauce, 'clip-path:circle(0% at 50% 50%);-webkit-clip-path:circle(0% at 50% 50%)');
      toolCursor.innerHTML = A.food.ladle || '';
      toolCursor.classList.toggle('hidden', !A.food.ladle);
    } else if (step === 'cheese') {
      if (PIZZA_RASTER) pzEnsure('pz-cheese', A.pizzaImg.cheese, 'opacity:0');
      toolCursor.innerHTML = A.food.shaker || '';
      toolCursor.classList.toggle('hidden', !A.food.shaker);
    } else {
      toolCursor.classList.add('hidden');
    }
    if (step === 'toppings') {
      // baked-browning overlay is created now (hidden) so it is part of the
      // pizza that gets cloned into the oven at bake time
      if (PIZZA_RASTER) pzEnsure('pz-baked', A.pizzaImg.baked, 'opacity:0');
      buildBins();
      $('topping-bins').classList.remove('hidden');
    }
    if (['dough', 'sauce', 'cheese', 'toppings'].indexOf(step) >= 0) {
      var sandboxToppings = step === 'toppings' && st.sandbox;
      vplay('narrator/' + (sandboxToppings ? 'hint-sandbox' : 'hint-' + step) + '.mp3',
        sandboxToppings ? NARR_SPEECH.sandbox : NARR_SPEECH[step]);
    }
    pizzaZone.setAttribute('aria-label', (stepHints[step] || 'Pizza work area') + ' Press Enter or Space for a keyboard-friendly action.');
    announce(stepHints[step] || 'Pizza step complete');
    updateOrderStrip();
  }

  function askBaseChoice(kind) {
    st.step = 'choose-' + kind;
    toolCursor.classList.add('hidden');
    var isSauce = kind === 'sauce';
    var expected = isSauce ? st.order.sauce !== false : st.order.cheese !== false;
    var label = isSauce ? 'sauce' : 'cheese';
    var hint = $('step-hint');
    hint.textContent = 'What did the customer say about ' + label + '? 🧠';
    hint.style.opacity = 1;
    var choices = [
      { yes: true, text: isSauce ? '🥫 Add sauce' : '🧀 Add cheese' },
      { yes: false, text: isSauce ? '🚫 No sauce' : '🚫 No cheese' }
    ];
    if (Math.random() < 0.5) choices.reverse();
    var box = $('base-choices');
    box.innerHTML = '';
    choices.forEach(function (choice) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'choice-btn'; b.textContent = choice.text;
      b.addEventListener('click', function () {
        if (choice.yes !== expected) {
          st.orderMistakes++; save.stats.mistakes++; persist(); AU.sad();
          hint.textContent = 'Check the order again. You can do it! 🔊';
          announce(hint.textContent);
          return;
        }
        AU.pop(); box.classList.add('hidden');
        if (isSauce) {
          if (choice.yes) setStep('sauce');
          else askBaseChoice('cheese');
        } else {
          if (choice.yes) setStep('cheese');
          else setStep('toppings');
        }
      });
      box.appendChild(b);
    });
    box.classList.remove('hidden');
    pizzaZone.setAttribute('aria-label', 'Choose the requested ' + label + ' using the buttons below.');
    announce(hint.textContent);
    updateOrderStrip();
  }

  // ----- order strip (live checklist) -----
  function renderOrderStrip() {
    var strip = $('kitchen-order');
    var noSauce = st.order && st.order.sauce === false;
    var noCheese = st.order && st.order.cheese === false;
    var html = '<div class="order-chip" id="chip-sauce"><span style="font-size:22px">' + (noSauce ? '🚫🥫' : '🥫') + '</span><span class="check">⬜</span></div>' +
      '<div class="order-chip" id="chip-cheese"><span style="font-size:22px">' + (noCheese ? '🚫🧀' : '🧀') + '</span><span class="check">⬜</span></div>';
    if (st.sandbox || !st.order) {
      html += '<div class="order-chip" style="font-size:22px">🎨 Your pizza!</div>';
      strip.innerHTML = html;
      return;
    }
    if (memoryMode()) {
      html = '<div class="order-chip" style="font-size:19px">🧠 Remember the order</div>' +
        (save.settings.instructionMode === 'read' ? '' : '<button class="hear-btn" id="btn-hear-kitchen" style="margin:0" aria-label="Hear the order again">🔊</button>');
      strip.innerHTML = html;
      if ($('btn-hear-kitchen')) $('btn-hear-kitchen').addEventListener('click', function () { AU.pop(); speakOrder(true); });
      return;
    }
    Object.keys(st.order.toppings).forEach(function (k) {
      html += '<div class="order-chip" id="chip-' + k + '">' +
        '<span class="ic">' + topSvg(k) + '</span>' +
        '<span class="count" id="count-' + k + '">0/' + st.order.toppings[k] + '</span></div>';
    });
    if (save.settings.instructionMode !== 'read') html += '<button class="hear-btn" id="btn-hear-kitchen" style="margin:0" aria-label="Hear the order">🔊</button>';
    strip.innerHTML = html;
    if ($('btn-hear-kitchen')) $('btn-hear-kitchen').addEventListener('click', function () { AU.pop(); speakOrder(true); });
  }
  function updateOrderStrip() {
    var sauceDone = ['choose-cheese', 'cheese', 'toppings', 'bake'].indexOf(st.step) >= 0;
    var cheeseDone = ['toppings', 'bake'].indexOf(st.step) >= 0;
    var cs = $('chip-sauce'), cc = $('chip-cheese');
    if (cs) { cs.classList.toggle('done', sauceDone); cs.querySelector('.check').textContent = sauceDone ? '✅' : '⬜'; }
    if (cc) { cc.classList.toggle('done', cheeseDone); cc.querySelector('.check').textContent = cheeseDone ? '✅' : '⬜'; }
    if (!st.order) {
      // free play: once the sauce & cheese are on, you can bake any time
      if (st.sandbox && st.step === 'toppings') {
        $('btn-bake').classList.remove('hidden');
        $('step-hint').textContent = 'Add anything you like — then bake! 🔥';
        $('step-hint').style.opacity = 1;
      }
      return;
    }
    var allGood = sauceDone && cheeseDone;
    var anyOver = false, anyWrong = false, anyPosition = false;
    Object.keys(st.order.toppings).forEach(function (k) {
      var need = st.order.toppings[k];
      var have = st.placed[k] || 0;
      var chip = $('chip-' + k);
      var cnt = $('count-' + k);
      if (cnt) cnt.textContent = have + '/' + need;
      if (chip) {
        chip.classList.toggle('done', have === need);
        chip.classList.toggle('over', have > need);
      }
      if (have > need) anyOver = true;
      if (have !== need) allGood = false;
      if (orderPositionWrong(k)) { allGood = false; anyPosition = true; }
    });
    // any topping placed that isn't in the order?
    Object.keys(st.placed).forEach(function (k) {
      if (st.placed[k] > 0 && !st.order.toppings[k]) { allGood = false; anyWrong = true; }
    });
    $('btn-bake').classList.toggle('hidden', !(allGood && st.step === 'toppings'));
    if (st.step === 'toppings') {
      var hint = $('step-hint');
      if (allGood) hint.textContent = 'Perfect! Time to bake! 🔥';
      else if (anyOver) hint.textContent = 'Too many! Tap one to take it off. 👆';
      else if (anyPosition) hint.textContent = 'Check the left and right placement. ⬅️➡️';
      else if (anyWrong) hint.textContent = 'Tap the extra one to take it off! 👆';
      else hint.textContent = stepHints.toppings;
      hint.style.opacity = 1;
      announce(hint.textContent);
    }
  }

  function orderPositionWrong(key) {
    if (!st.order || !st.order.zones || !st.order.zones[key]) return false;
    var expected = st.order.zones[key];
    return st.placements.some(function (p) { return p.key === key && p.side !== expected; });
  }

  // ----- geometry -----
  function zoneRect() { return pizzaZone.getBoundingClientRect(); }
  function onPizza(clientX, clientY, slack) {
    var r = zoneRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = clientX - cx, dy = clientY - cy;
    return Math.sqrt(dx * dx + dy * dy) <= r.width * (slack || 0.40);
  }
  function moveToolTo(clientX, clientY) {
    var r = zoneRect();
    toolCursor.style.left = (clientX - r.left) + 'px';
    toolCursor.style.top = (clientY - r.top) + 'px';
  }

  // ----- dough -----
  function tapDough(x, y) {
    var ball = $('dough-ball');
    if (!ball) return;
    st.doughTaps++;
    AU.squish();
    ball.classList.remove('squish');
    void ball.offsetWidth;
    ball.classList.add('squish');
    ball.style.transform = 'scale(' + (1 + st.doughTaps * 0.06) + ', ' + (1 - st.doughTaps * 0.08) + ')';
    if (st.doughTaps >= 3) {
      setTimeout(function () {
        ball.style.display = 'none';
        var crust;
        if (PIZZA_RASTER) {
          crust = pzEnsure('pz-crust', A.pizzaImg.crust, '');
        } else {
          crust = document.getElementById('pz-crust');
          if (crust) crust.style.display = '';
        }
        pizzaBase.classList.remove('pop');
        void pizzaBase.offsetWidth;
        pizzaBase.classList.add('pop');
        AU.pop();
        var r = zoneRect();
        sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 12);
        setTimeout(function () {
          if (!st.sandbox && st.order && difficulty() >= 2) askBaseChoice('sauce');
          else setStep('sauce');
        }, 500);
      }, 250);
    }
  }

  // ----- sauce -----
  var saucing = false, lastSauce = null, lastSplat = 0;
  function sauceMove(x, y) {
    moveToolTo(x, y);
    if (!saucing || !onPizza(x, y, 0.46)) { lastSauce = null; return; }
    if (lastSauce) {
      var d = Math.hypot(x - lastSauce.x, y - lastSauce.y);
      var r = zoneRect();
      st.sauceProgress += d / (r.width * 1.9);
      var frac = Math.min(1, st.sauceProgress);
      if (PIZZA_RASTER) {
        var sauceEl = pizzaBase.querySelector('.pz-sauce');
        if (sauceEl) {
          var pct = (frac * 58).toFixed(1) + '% at 50% 50%';
          sauceEl.style.clipPath = 'circle(' + pct + ')';
          sauceEl.style.webkitClipPath = 'circle(' + pct + ')';
        }
      } else {
        var clip = document.getElementById('pz-clip-c');
        if (clip) clip.setAttribute('r', frac * 106);
      }
      var now = Date.now();
      if (d > 4 && now - lastSplat > 160) { AU.splat(); lastSplat = now; }
      if (st.sauceProgress >= 1) {
        saucing = false;
        st.sauceProgress = 1;
        AU.pop();
        sparkleAt(x, y, 10);
        setTimeout(function () {
          if (!st.sandbox && st.order && difficulty() >= 2) askBaseChoice('cheese');
          else setStep('cheese');
        }, 450);
      }
    }
    lastSauce = { x: x, y: y };
  }

  // ----- cheese -----
  function tapCheese(x, y) {
    if (!onPizza(x, y, 0.46)) return;
    st.cheeseTaps++;
    AU.sprinkle();
    var cheeseAmt = Math.min(1, st.cheeseTaps / 3);
    if (PIZZA_RASTER) {
      var cheeseEl = pizzaBase.querySelector('.pz-cheese');
      if (cheeseEl) cheeseEl.style.opacity = cheeseAmt;
    } else {
      var cheese = document.getElementById('pz-cheese');
      if (cheese) cheese.setAttribute('opacity', cheeseAmt);
    }
    // cheese bit particles
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('div');
      p.className = 'particle p-burst';
      var ang = Math.random() * Math.PI * 2;
      p.style.setProperty('--dx', Math.cos(ang) * 50 + 'px');
      p.style.setProperty('--dy', (Math.sin(ang) * 50 + 20) + 'px');
      p.style.left = x + 'px'; p.style.top = (y - 30) + 'px';
      p.style.width = '10px'; p.style.height = '14px';
      p.style.background = '#FFD855';
      p.style.borderRadius = '4px';
      fx.appendChild(p);
      setTimeout(function (el) { return function () { el.remove(); }; }(p), 750);
    }
    pizzaBase.classList.remove('pop');
    void pizzaBase.offsetWidth;
    pizzaBase.classList.add('pop');
    if (st.cheeseTaps >= 3) {
      AU.pop();
      setTimeout(function () { setStep('toppings'); }, 450);
    }
  }

  // ----- pizza zone pointer handling -----
  pizzaZone.addEventListener('pointerdown', function (e) {
    if (st.baking) return;
    AU.init();
    if (st.step === 'dough') { tapDough(e.clientX, e.clientY); }
    else if (st.step === 'sauce') { saucing = true; lastSauce = null; sauceMove(e.clientX, e.clientY); try { pizzaZone.setPointerCapture(e.pointerId); } catch (err) {} }
    else if (st.step === 'cheese') { moveToolTo(e.clientX, e.clientY); tapCheese(e.clientX, e.clientY); }
  });
  pizzaZone.addEventListener('pointermove', function (e) {
    if (st.step === 'sauce') sauceMove(e.clientX, e.clientY);
    else if (st.step === 'cheese') moveToolTo(e.clientX, e.clientY);
  });
  pizzaZone.addEventListener('pointerup', function () { saucing = false; lastSauce = null; });
  pizzaZone.addEventListener('pointercancel', function () { saucing = false; lastSauce = null; });
  pizzaZone.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    var r = zoneRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (st.step === 'dough') tapDough(x, y);
    else if (st.step === 'cheese') tapCheese(x, y);
    else if (st.step === 'sauce') {
      st.sauceProgress = 1;
      var clip = document.getElementById('pz-clip-c');
      if (clip) clip.setAttribute('r', 106);
      AU.splat(); sparkleAt(x, y, 8);
      setTimeout(function () {
        if (!st.sandbox && st.order && difficulty() >= 2) askBaseChoice('cheese');
        else setStep('cheese');
      }, 250);
    }
  });

  // ----- topping bins & dragging -----
  function buildBins() {
    var bins = $('topping-bins');
    bins.innerHTML = '';
    TOPPING_KEYS.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bin' + (showHints() && st.order && st.order.toppings[k] ? ' needed' : '');
      b.dataset.key = k;
      b.setAttribute('aria-label', 'Add ' + topName(k) + '. Tap to add or drag onto the pizza.');
      b.innerHTML = '<div class="bin-art">' + topSvg(k) + '</div><div class="bin-label">' + topName(k) + '</div>';
      b.addEventListener('pointerdown', function (e) { startDrag(e, k, b); });
      b.addEventListener('click', function () {
        if (b.dataset.suppressClick === '1') return;
        var r = zoneRect();
        var count = st.placed[k] || 0;
        var expected = st.order && st.order.zones && st.order.zones[k];
        var sideNudge = expected === 'left' ? -0.18 : (expected === 'right' ? 0.18 : 0);
        var x = r.left + r.width * (0.5 + sideNudge + ((count % 2) ? 0.05 : -0.03));
        var y = r.top + r.height * (0.45 + ((count % 3) - 1) * 0.12);
        placeTopping(k, x, y);
      });
      bins.appendChild(b);
    });
  }

  var drag = null;
  function startDrag(e, key, binEl) {
    if (st.step !== 'toppings' || st.baking || drag) return;
    e.preventDefault();
    AU.init(); AU.pop();
    var d = document.createElement('div');
    d.className = 'drag-topping';
    d.innerHTML = topSvg(key);
    d.style.left = e.clientX + 'px';
    d.style.top = e.clientY + 'px';
    document.body.appendChild(d);
    drag = { key: key, el: d, bin: binEl, startX: e.clientX, startY: e.clientY, moved: false };
    window.addEventListener('pointermove', dragMove);
    window.addEventListener('pointerup', dragEnd);
    window.addEventListener('pointercancel', dragEnd);
  }
  function dragMove(e) {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 8) drag.moved = true;
    drag.el.style.left = e.clientX + 'px';
    drag.el.style.top = e.clientY + 'px';
  }
  function dragEnd(e) {
    window.removeEventListener('pointermove', dragMove);
    window.removeEventListener('pointerup', dragEnd);
    window.removeEventListener('pointercancel', dragEnd);
    if (!drag) return;
    var d = drag; drag = null;
    if (d.moved) {
      d.bin.dataset.suppressClick = '1';
      setTimeout(function () { delete d.bin.dataset.suppressClick; }, 80);
    }
    if (onPizza(e.clientX, e.clientY, 0.38)) {
      placeTopping(d.key, e.clientX, e.clientY);
      d.el.remove();
    } else {
      // fly back to bin
      var br = d.bin.getBoundingClientRect();
      d.el.classList.add('fly-back');
      d.el.style.left = (br.left + br.width / 2) + 'px';
      d.el.style.top = (br.top + br.height / 2) + 'px';
      AU.whoosh();
      setTimeout(function () { d.el.remove(); }, 320);
    }
  }
  function placeTopping(key, clientX, clientY) {
    var r = zoneRect();
    var px = ((clientX - r.left) / r.width) * 100;
    var py = ((clientY - r.top) / r.height) * 100;
    var t = document.createElement('div');
    t.className = 'placed-topping';
    t.style.left = px + '%';
    t.style.top = py + '%';
    t.innerHTML = topSvg(key);
    t.dataset.key = key;
    var side = px < 50 ? 'left' : 'right';
    t.setAttribute('role', 'button');
    t.setAttribute('tabindex', '0');
    t.setAttribute('aria-label', topName(key) + ' on the ' + side + '. Press Enter to remove.');
    t.addEventListener('pointerdown', function (e) {
      if (st.step !== 'toppings' || st.baking) return;
      e.stopPropagation();
      removeTopping(t, key, e.clientX, e.clientY);
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var rr = t.getBoundingClientRect();
        removeTopping(t, key, rr.left + rr.width / 2, rr.top + rr.height / 2);
      }
    });
    pizzaTops.appendChild(t);
    st.placed[key] = (st.placed[key] || 0) + 1;
    st.placements.push({ el: t, key: key, side: side });
    save.stats.toppingsPlaced++;
    AU.pop();
    if (!st.order) {
      // free play — anything goes, every topping is a happy one
      sparkleAt(clientX, clientY, 5);
    } else {
      var need = st.order.toppings[key];
      if (!need) {
        st.orderMistakes++; save.stats.mistakes++;
        vplay('narrator/warn-wrong.mp3', NARR_SPEECH.warnWrong);
        AU.sad();
      } else if (st.placed[key] > need) {
        st.orderMistakes++; save.stats.mistakes++;
        vplay('narrator/warn-many.mp3', NARR_SPEECH.warnMany);
        AU.sad();
      } else if (st.order.zones && st.order.zones[key] && st.order.zones[key] !== side) {
        st.orderMistakes++; save.stats.mistakes++;
        vplay('narrator/warn-side.mp3', NARR_SPEECH.warnSide);
        AU.sad();
      } else if (st.placed[key] === need) {
        sparkleAt(clientX, clientY, 6);
      }
    }
    updateOrderStrip();
    persist();
  }
  function removeTopping(el, key, x, y) {
    st.placed[key] = Math.max(0, (st.placed[key] || 0) - 1);
    st.placements = st.placements.filter(function (p) { return p.el !== el; });
    AU.whoosh();
    particleBurst(x, y, '💨', 3, 40);
    el.remove();
    updateOrderStrip();
  }

  // ---------- baking ----------
  function startBake() {
    if (st.baking) return;
    st.baking = true;
    AU.init(); AU.pop();
    $('btn-bake').classList.add('hidden');
    $('topping-bins').classList.add('hidden');
    $('step-hint').style.opacity = 0;
    toolCursor.classList.add('hidden');

    var overlay = $('oven-overlay');
    var ovenArt = $('oven-art');
    var ovenPizza = $('oven-pizza');
    var doorLayer = $('oven-door-layer');
    if (!doorLayer) {
      doorLayer = document.createElement('div');
      doorLayer.id = 'oven-door-layer';
      overlay.insertBefore(doorLayer, $('oven-timer'));
    }
    // ---- oven art (raster image, or SVG fallback) ----
    if (OVEN_RASTER) {
      ovenArt.innerHTML = '<img class="oven-body" src="' + A.ovenImg.body + '" alt="" draggable="false">';
      doorLayer.innerHTML = '<img class="oven-door" src="' + A.ovenImg.door + '" alt="" draggable="false">';
    } else {
      ovenArt.innerHTML = A.scenes.oven || '<svg viewBox="0 0 520 560"><rect x="40" y="80" width="440" height="420" rx="60" fill="#C0574F" stroke="#4A2E24" stroke-width="8"/><rect x="110" y="220" width="300" height="210" rx="40" fill="#3A241C"/><g class="oven-door"><rect x="90" y="210" width="340" height="230" rx="40" fill="#F2B84B" stroke="#4A2E24" stroke-width="8"/></g></svg>';
      var srcSvg = ovenArt.querySelector('svg');
      var doorG = ovenArt.querySelector('.oven-door');
      if (srcSvg && doorG) {
        doorLayer.innerHTML = '<svg viewBox="' + (srcSvg.getAttribute('viewBox') || '0 0 520 560') + '" xmlns="http://www.w3.org/2000/svg"></svg>';
        doorLayer.querySelector('svg').appendChild(doorG);
      }
    }
    // ---- snapshot the pizza into the oven ----
    var snap = '<div style="position:absolute;inset:0">' + pizzaBase.innerHTML + '</div>' +
      '<div style="position:absolute;inset:0;pointer-events:none">' + pizzaTops.innerHTML + '</div>';
    // the SVG pizza uses element ids (pz-crust, pz-clip, dough-ball, …) — rename
    // them in the clone so they don't collide with the kitchen pizza's ids
    if (!PIZZA_RASTER) {
      snap = snap.split('pz-').join('pz2-').split('dough-ball').join('dough-ball-2');
    }
    ovenPizza.innerHTML = snap;
    ovenPizza.className = '';
    ovenPizza.style.opacity = 1;
    ovenPizza.style.transition = 'none';
    ovenPizza.style.transform = 'translate(-50%, -50%) translateY(58vh) scale(1)';
    overlay.classList.remove('hidden');
    $('pizza-wrap').style.visibility = 'hidden';
    $('oven-timer').classList.add('hidden');
    $('oven-label').classList.add('hidden');
    $('btn-serve').classList.add('hidden');
    overlay.classList.add('door-open');

    // position the pizza over the oven opening
    setTimeout(function () {
      var or = ovenArt.getBoundingClientRect();
      var ovr = overlay.getBoundingClientRect();
      // opening center as a fraction of the oven art box (raster oven differs from svg)
      var openFx = RASTER ? 0.50 : (260 / 520);
      var openFy = RASTER ? 0.70 : (325 / 560);
      var openX = or.left - ovr.left + or.width * openFx;
      var openY = or.top - ovr.top + or.height * openFy;
      ovenPizza.style.left = openX + 'px';
      ovenPizza.style.top = openY + 'px';
      ovenPizza.style.transition = 'transform 0.9s cubic-bezier(0.45, 0, 0.4, 1)';
      AU.whoosh();
      requestAnimationFrame(function () {
        ovenPizza.style.transform = 'translate(-50%, -50%) scale(0.65)';
      });
      setTimeout(function () {
        overlay.classList.remove('door-open'); // door closes
        setTimeout(bakeTimer, 650);
      }, 950);
    }, 80);
  }
  function bakeTimer() {
    AU.sizzleStart();
    $('oven-pizza').classList.add('baking');
    var timer = $('oven-timer');
    var fill = $('oven-timer-fill');
    timer.classList.remove('hidden');
    var label = $('oven-label');
    label.textContent = 'Baking… 🔥';
    label.classList.remove('hidden', 'dingding');
    var t0 = performance.now(), DUR = 3500;
    function tick(now) {
      var p = Math.min(1, (now - t0) / DUR);
      fill.style.background = 'conic-gradient(#FF6B6B ' + (p * 360) + 'deg, transparent ' + (p * 360) + 'deg)';
      if (p < 1) requestAnimationFrame(tick);
      else bakeDone();
    }
    requestAnimationFrame(tick);
  }
  function bakeDone() {
    AU.sizzleStop();
    AU.ding();
    var label = $('oven-label');
    label.textContent = 'DING! It’s ready! 🔔';
    label.classList.add('dingding');
    $('oven-timer').classList.add('hidden');
    var ovenPizza = $('oven-pizza');
    ovenPizza.classList.remove('baking');
    // brown it
    var baked = ovenPizza.querySelector('.pz-baked') || ovenPizza.querySelector('#pz2-baked');
    if (baked) { baked.setAttribute('opacity', '1'); baked.style.opacity = '1'; }
    var cheese = ovenPizza.querySelector('.pz-cheese') || ovenPizza.querySelector('#pz2-cheese');
    if (cheese) cheese.style.filter = 'saturate(1.12) brightness(0.98)';
    setTimeout(function () {
      $('oven-overlay').classList.add('door-open');
      confettiSparkle();
      setTimeout(function () {
        ovenPizza.style.transition = 'transform 0.9s cubic-bezier(0.3, 1.2, 0.5, 1)';
        ovenPizza.style.transform = 'translate(-50%, -50%) translateY(8vh) scale(0.9)';
        AU.whoosh();
        $('btn-serve').textContent = st.sandbox ? 'Make Another! 🍕' : 'Serve it! 🛎️';
        $('btn-serve').classList.remove('hidden');
        label.classList.add('hidden');
      }, 550);
    }, 700);
  }
  function confettiSparkle() {
    var r = $('oven-art').getBoundingClientRect();
    sparkleAt(r.left + r.width / 2, r.top + r.height * 0.35, 14);
  }

  // ---------- serving ----------
  // free-play finish: celebrate the creation, then start a fresh one
  function sandboxServe() {
    AU.pop(); AU.tada();
    var pr = $('oven-pizza').getBoundingClientRect();
    confetti(50);
    heartsAt(pr.left + pr.width / 2, pr.top + pr.height * 0.4, 5);
    showBanner('🎉 Yummy pizza! 🎉');
    coinsFly(10, pr.left + pr.width / 2, pr.top + pr.height / 2);
    save.sandboxMade = (save.sandboxMade || 0) + 1;
    persist();
    refreshHud();
    vplay('narrator/cheer-yummy.mp3', NARR_SPEECH.cheerYummy);
    setTimeout(startSandbox, 1400);
  }
  function serve() {
    AU.pop();
    var ovenPizza = $('oven-pizza');
    var tray = $('serve-tray');
    tray.innerHTML =
      '<div style="position:absolute;inset:-6%">' + (A.food.tray || '') + '</div>' +
      '<div style="position:absolute;inset:6%">' + ovenPizza.innerHTML.split('pz2-').join('pz3-') + '</div>';
    showScreen('counter');
    $('oven-overlay').classList.add('hidden');
    $('speech-bubble').classList.add('hidden');
    $('btn-make').classList.add('hidden');
    tray.classList.remove('hidden');
    tray.className = 'serve-tray deliver';
    AU.whoosh();
    setTimeout(eatSequence, 1050);
  }
  function eatSequence() {
    var ch = A.characters[st.charKey] || {};
    var art = $('customer-art');
    setMouth(art, true);
    art.classList.remove('idle');
    art.classList.add('eating');
    var r = art.getBoundingClientRect();
    var tray = $('serve-tray');
    // three chomps
    [0, 500, 1000].forEach(function (t, i) {
      setTimeout(function () {
        AU.munch();
        tray.style.transform = 'translateX(-50%) scale(' + (1 - (i + 1) * 0.28) + ')';
        tray.style.opacity = 1 - i * 0.25;
      }, t);
    });
    setTimeout(function () {
      tray.className = 'serve-tray eaten';
      heartsAt(r.left + r.width / 2, r.top + r.height * 0.3, 6);
      AU.tada();
      art.classList.remove('eating');
      art.classList.add('idle');
      var happies = ch.happyLines || ['Yummy! Thank you!'];
      var hi = rnd(happies.length);
      $('speech-text').textContent = happies[hi];
      $('speech-order').classList.add('hidden');
      $('btn-hear').classList.add('hidden');
      $('speech-bubble').classList.remove('hidden');
      vplay(st.charKey + '/happy-' + hi + '.mp3', happies[hi]);
      rewardAndContinue();
    }, 1500);
  }
  function rewardAndContinue() {
    stopOrderTimer();
    var elapsedSeconds = Math.max(1, Math.round((Date.now() - st.orderStartedAt) / 1000));
    var toppingCount = 0;
    Object.keys(st.order.toppings).forEach(function (k) { toppingCount += st.order.toppings[k]; });
    var clean = st.orderMistakes === 0;
    var memoryStar = clean && st.orderReplays === 0 && memoryMode();
    var earned = 10 + toppingCount + (memoryStar ? 5 : 0);
    var art = $('customer-art').getBoundingClientRect();
    coinsFly(earned, art.left + art.width / 2, art.top + art.height / 2);

    save.served++;
    save.stats.orders++;
    if (clean) save.stats.firstTry++;
    save.stats.bestLevel = Math.max(save.stats.bestLevel, st.order.level || difficulty());
    save.stats.totalSeconds += elapsedSeconds;
    var isNewSticker = !save.stickers[st.charKey];
    if (isNewSticker) save.stickers[st.charKey] = true;
    persist();
    refreshHud();

    var feedbackBits = [];
    feedbackBits.push((st.order.sauce === false ? 'No sauce' : 'Sauce') + ' and ' + (st.order.cheese === false ? 'no cheese' : 'cheese') + ' remembered.');
    feedbackBits.push('Toppings: ' + orderPhrases(st.order).join(' and ') + '.');
    if (st.order.zones && Object.keys(st.order.zones).length) feedbackBits.push('Left/right placement checked.');
    feedbackBits.push(clean ? '⭐ No corrections needed!' : 'You fixed ' + st.orderMistakes + ' ' + (st.orderMistakes === 1 ? 'mistake' : 'mistakes') + '.');
    feedbackBits.push(st.orderReplays ? 'Order replayed ' + st.orderReplays + ' time' + (st.orderReplays === 1 ? '' : 's') + '.' : '🧠 Remembered without replaying.');
    if (save.settings.timer) feedbackBits.push('Finished in ' + elapsedSeconds + ' seconds.');
    if (memoryStar) feedbackBits.push('✨ Memory bonus: 5 coins!');
    $('speech-feedback').innerHTML = feedbackBits.join('<br>');
    $('speech-feedback').classList.remove('hidden');
    announce(feedbackBits.join(' '));

    setTimeout(function () {
      if (isNewSticker) {
        showBanner('⭐ New Pal sticker! ⭐');
        confetti(30);
      }
      if (save.served % 5 === 0) {
        setTimeout(function () {
          showBanner('🎉 ' + save.served + ' pizzas! You’re a Pizza Star! 🎉');
          confetti(80);
          AU.tada();
          vplay('narrator/cheer-star.mp3', NARR_SPEECH.cheerStar);
        }, isNewSticker ? 1400 : 0);
      }
      $('btn-next').classList.remove('hidden');
    }, 1200);
  }
  function nextCustomer() {
    AU.pop();
    $('btn-next').classList.add('hidden');
    $('speech-bubble').classList.add('hidden');
    var art = $('customer-art');
    art.classList.remove('idle');
    art.classList.add('leave');
    AU.whoosh();
    setTimeout(enterCustomer, 850);
  }

  // ---------- sticker book ----------
  function openStickers() {
    AU.pop();
    showScreen('stickers');
    var grid = $('sticker-grid');
    grid.innerHTML = '';
    charKeys().forEach(function (k) {
      var ch = A.characters[k];
      var owned = !!save.stickers[k];
      var d = document.createElement('div');
      d.className = 'sticker' + (owned ? '' : ' locked');
      d.innerHTML = '<div class="st-art">' + stickerArtHTML(ch, k) + '</div>' +
        '<div class="st-name">' + (owned ? ch.name : '???') + '</div>';
      grid.appendChild(d);
    });
  }

  // ---------- tutorial, teacher tools, and reward shop ----------
  var lastPanelFocus = null;
  function openPanel(id) {
    lastPanelFocus = document.activeElement;
    $('modal-backdrop').classList.remove('hidden');
    ['tutorial', 'settings', 'report', 'shop'].forEach(function (name) {
      $('panel-' + name).classList.toggle('hidden', name !== id);
    });
    var panel = $('panel-' + id);
    var focusable = panel.querySelector('button, select, input');
    if (focusable) setTimeout(function () { focusable.focus(); }, 20);
  }
  function closePanels() {
    $('modal-backdrop').classList.add('hidden');
    ['tutorial', 'settings', 'report', 'shop'].forEach(function (name) { $('panel-' + name).classList.add('hidden'); });
    if (lastPanelFocus && lastPanelFocus.focus) lastPanelFocus.focus();
  }

  var tutorialSteps = [
    { icon: '👂', text: 'Listen carefully to the customer. You can also read the words and pictures.' },
    { icon: '🧠', text: 'Remember the sauce, cheese, topping amounts, and any special directions.' },
    { icon: '🍕', text: 'Prepare the dough and base. Some customers may ask for no sauce or no cheese.' },
    { icon: '👆', text: 'Tap a topping to add it, or drag it exactly where it belongs. Tap a placed topping to remove it.' },
    { icon: '🔊', text: 'Use Hear Again if you forget. Higher levels challenge you to remember without replaying.' },
    { icon: '⭐', text: 'Correct your pizza, bake it, and read your learning feedback. Now you are ready!' }
  ];
  var tutorialIndex = 0;
  function renderTutorial() {
    var item = tutorialSteps[tutorialIndex];
    $('tutorial-visual').textContent = item.icon;
    $('tutorial-text').textContent = item.text;
    $('tutorial-progress').textContent = (tutorialIndex + 1) + ' of ' + tutorialSteps.length;
    $('btn-tutorial-prev').disabled = tutorialIndex === 0;
    $('btn-tutorial-next').textContent = tutorialIndex === tutorialSteps.length - 1 ? 'Start!' : 'Next';
  }
  function startTutorial(after) {
    st.pendingAfterTutorial = after || null;
    tutorialIndex = 0;
    renderTutorial();
    openPanel('tutorial');
  }
  function finishTutorial() {
    save.tutorialSeen = true; persist();
    var after = st.pendingAfterTutorial;
    st.pendingAfterTutorial = null;
    closePanels();
    if (after === 'play') enterCustomer();
  }

  function openSettings() {
    $('setting-difficulty').value = String(difficulty());
    $('setting-instructions').value = save.settings.instructionMode || 'both';
    $('setting-memory').checked = !!save.settings.memory;
    $('setting-hints').checked = !!save.settings.hints;
    $('setting-quick').checked = !!save.settings.quickPrep;
    $('setting-timer').checked = !!save.settings.timer;
    $('setting-motion').checked = !!save.settings.reducedMotion;
    openPanel('settings');
  }
  function saveSettings() {
    save.settings.difficulty = Number($('setting-difficulty').value);
    save.settings.instructionMode = $('setting-instructions').value;
    save.settings.memory = $('setting-memory').checked;
    save.settings.hints = $('setting-hints').checked;
    save.settings.quickPrep = $('setting-quick').checked;
    save.settings.timer = $('setting-timer').checked;
    save.settings.reducedMotion = $('setting-motion').checked;
    persist(); applyPreferences(); refreshHud(); closePanels();
    showBanner('⚙️ Settings saved');
  }
  function openReport() {
    var accuracy = save.stats.orders ? Math.round(save.stats.firstTry / save.stats.orders * 100) : 0;
    var averageTime = save.stats.orders ? Math.round(save.stats.totalSeconds / save.stats.orders) + ' sec' : '—';
    var items = [
      ['Orders completed', save.stats.orders], ['First-try accuracy', accuracy + '%'],
      ['Corrections made', save.stats.mistakes], ['Order replays', save.stats.replays],
      ['Toppings placed', save.stats.toppingsPlaced], ['Average time', averageTime],
      ['Highest level', save.stats.bestLevel || '—']
    ];
    $('report-content').innerHTML = items.map(function (item) {
      return '<div class="report-stat"><strong>' + item[1] + '</strong>' + item[0] + '</div>';
    }).join('');
    openPanel('report');
  }

  var SHOP_ITEMS = [
    { key: 'classic', icon: '🍕', name: 'Classic Shop', cost: 0 },
    { key: 'sunshine', icon: '☀️', name: 'Sunshine Set', cost: 25 },
    { key: 'space', icon: '🚀', name: 'Space Sparkles', cost: 45 },
    { key: 'rainbow', icon: '🌈', name: 'Rainbow Buttons', cost: 70 }
  ];
  function openShop() { renderShop(); openPanel('shop'); }
  function renderShop() {
    $('shop-coins').textContent = save.coins;
    $('shop-grid').innerHTML = '';
    SHOP_ITEMS.forEach(function (item) {
      var owned = !!save.unlocks[item.key];
      var equipped = save.theme === item.key || (!save.theme && item.key === 'classic');
      var d = document.createElement('div');
      d.className = 'shop-item' + (equipped ? ' equipped' : '');
      d.innerHTML = '<div class="preview">' + item.icon + '</div><h3>' + item.name + '</h3><p>' + (owned ? (equipped ? 'Equipped' : 'Unlocked') : '🪙 ' + item.cost) + '</p>';
      var b = document.createElement('button');
      b.className = 'small-btn' + (equipped ? '' : ' primary');
      b.textContent = equipped ? 'Using' : (owned ? 'Use' : 'Unlock');
      b.disabled = equipped;
      b.addEventListener('click', function () {
        if (!owned) {
          if (save.coins < item.cost) { announce('You need ' + (item.cost - save.coins) + ' more coins.'); showBanner('Keep making pizzas! 🍕'); return; }
          save.coins -= item.cost; save.unlocks[item.key] = true;
        }
        save.theme = item.key; persist(); applyPreferences(); refreshHud(); renderShop(); AU.tada();
      });
      d.appendChild(b); $('shop-grid').appendChild(d);
    });
  }

  // ---------- title ----------
  function buildTitle() {
    $('title-logo').innerHTML = A.scenes.logo ||
      '<svg viewBox="0 0 800 320"><text x="400" y="180" text-anchor="middle" font-size="110" font-weight="900" font-family="Arial Rounded MT Bold, sans-serif" fill="#FF6B6B" stroke="#4A2E24" stroke-width="10" paint-order="stroke">Pizza Pals!</text></svg>';
    var fl = $('title-floaties');
    fl.innerHTML = '';
    for (var i = 0; i < 10; i++) {
      var f = document.createElement('div');
      f.className = 'floaty';
      var key = pick(TOPPING_KEYS);
      f.innerHTML = Math.random() < 0.25 ? (A.food.sparkle || '') : topSvg(key);
      f.style.left = (3 + Math.random() * 92) + 'vw';
      f.style.animationDuration = 9 + Math.random() * 14 + 's';
      f.style.animationDelay = -Math.random() * 20 + 's';
      var sz = 34 + rnd(40);
      f.style.width = sz + 'px'; f.style.height = sz + 'px';
      fl.appendChild(f);
    }
    var made = totalPizzas();
    $('title-badge').textContent = made > 0 ? '🍕 Pizzas made: ' + made : '';
  }
  function goTitle() {
    AU.pop();
    st.sandbox = false;
    st.baking = false;
    stopOrderTimer();
    GV.stop();
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    buildTitle();
    showScreen('title');
  }

  // ---------- scene backgrounds ----------
  function buildScenes() {
    $('counter-bg').innerHTML = A.scenes.shopBg || '';
    $('counter-front').innerHTML = A.scenes.counter || '';
    $('kitchen-bg').innerHTML = A.scenes.kitchenBg || '';
    if (!A.scenes.shopBg) $('counter-bg').style.background = 'linear-gradient(#7ED6DF, #FFE9C7)';
    if (!A.scenes.kitchenBg) $('kitchen-bg').style.background = 'linear-gradient(#FFE9C7, #E5B877)';
  }

  // ---------- wire up ----------
  // AU (GameAudio) and GV (GameVoice) each cache their OWN internal `muted`
  // flag (not a live CE.settings getter), so something has to actively push
  // CE.settings.get('muted') into both whenever it changes. Centralizing
  // that here — instead of inline in toggleSound() — means ANY future path
  // that flips `muted` keeps AU/GV in sync too, not just the sound button.
  function applyMutedChange(muted) {
    AU.setMuted(muted);
    GV.setMuted(muted);
    if (muted) { GV.stop(); try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }
    else { AU.bgmStart(); AU.pop(); }
  }
  function init() {
    buildScenes();
    buildTitle();
    refreshHud();
    applyPreferences();
    // Initial sync only (onChange doesn't fire for the value CE.settings
    // already loaded) — deliberately NOT applyMutedChange(), which would
    // wrongly auto-start bgm/play a pop on every page load for an already-
    // unmuted returning player; bgm has only ever started from a deliberate
    // Play/Sandbox tap (below), matching the original behavior exactly.
    AU.setMuted(CE.settings.get('muted'));
    GV.setMuted(CE.settings.get('muted'));
    CE.settings.onChange(function (key, value) {
      if (key === 'muted') applyMutedChange(value);
    });

    $('btn-play').addEventListener('click', function () {
      AU.init(); GV.unlock();
      if (!CE.settings.get('muted')) AU.bgmStart();
      AU.pop();
      st.sandbox = false;
      if (!save.tutorialSeen) startTutorial('play');
      else enterCustomer();
    });
    $('btn-sandbox').addEventListener('click', function () {
      AU.init(); GV.unlock();
      if (!CE.settings.get('muted')) AU.bgmStart();
      AU.pop();
      startSandbox();
    });
    $('btn-stickers').addEventListener('click', function () { AU.init(); openStickers(); });
    $('btn-tutorial').addEventListener('click', function () { AU.init(); startTutorial(); });
    $('btn-settings').addEventListener('click', function () { AU.init(); openSettings(); });
    $('btn-shop').addEventListener('click', function () { AU.init(); openShop(); });
    $('hud-coins').addEventListener('click', openShop);
    $('btn-stickers-back').addEventListener('click', goTitle);
    $('btn-sound').addEventListener('click', toggleSound);
    $('btn-sound-title').addEventListener('click', function () { AU.init(); toggleSound(); });
    $('btn-home').addEventListener('click', goTitle);
    $('btn-make').addEventListener('click', function () { AU.pop(); startKitchen(); });
    $('btn-hear').addEventListener('click', function () { AU.pop(); speakOrder(true); });
    $('btn-bake').addEventListener('click', startBake);
    $('btn-serve').addEventListener('click', function () { if (st.sandbox) sandboxServe(); else serve(); });
    $('btn-next').addEventListener('click', nextCustomer);
    $('btn-tutorial-prev').addEventListener('click', function () { if (tutorialIndex > 0) { tutorialIndex--; renderTutorial(); } });
    $('btn-tutorial-next').addEventListener('click', function () {
      if (tutorialIndex < tutorialSteps.length - 1) { tutorialIndex++; renderTutorial(); }
      else finishTutorial();
    });
    $('btn-save-settings').addEventListener('click', saveSettings);
    $('btn-report').addEventListener('click', openReport);
    $('btn-reset-report').addEventListener('click', function () {
      save.stats = { orders: 0, firstTry: 0, mistakes: 0, replays: 0, toppingsPlaced: 0, bestLevel: 0, totalSeconds: 0 };
      persist(); openReport(); announce('Learning summary reset.');
    });
    document.querySelectorAll('[data-close-panel]').forEach(function (b) { b.addEventListener('click', closePanels); });
    $('modal-backdrop').addEventListener('click', function (e) { if (e.target === $('modal-backdrop')) closePanels(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('modal-backdrop').classList.contains('hidden')) closePanels(); });

    // iOS: block pinch zoom & double-tap zoom leftovers
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    document.addEventListener('dblclick', function (e) { e.preventDefault(); });

    showScreen('title');
  }

  // No readiness wait needed here: window.__ppStart (this whole function)
  // is only ever invoked by js/engine-bridge.js, a <script type="module">,
  // which always runs after the document has finished parsing — i.e.
  // strictly after DOMContentLoaded would have fired.
  init();
};
