/* ============================================================
   Pizza Pals! — core game
   Flow: title → customer order → make pizza → bake → serve → repeat
   ============================================================ */
(function () {
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
    // "1 olive" / "3 olives" — only these names take a plural s
    if (count === 1 && /^(olives|mushrooms|peppers)$/.test(name)) return name.slice(0, -1);
    return name;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rnd(arr.length)]; }

  // ---------- raster art helpers ----------
  var RASTER = !!A.useRaster;
  function charImgTag(key, kind, extra) {
    var c = A.charImg && A.charImg[key];
    if (!c) return '';
    return '<img class="char-img char-' + (kind === 'grin' ? 'happy' : 'smile') + '" src="' +
      A.rasterBase + c[kind] + '" alt="" draggable="false"' + (extra || '') + '>';
  }
  function characterHTML(ch, key) {
    if (RASTER && A.charImg && A.charImg[key]) {
      return charImgTag(key, 'smile') + charImgTag(key, 'grin', ' style="display:none"');
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
  var SAVE_KEY = 'pizzaPals.save.v1';
  var save = { coins: 0, served: 0, stickers: {}, muted: false };
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) { var s = JSON.parse(raw); if (s && typeof s === 'object') Object.assign(save, s); }
  } catch (e) {}
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {}
  }

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
    lastCustomer: null
  };

  // ---------- speech ----------
  function speak(text, voice) {
    if (save.muted) return;
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = (voice && voice.rate) || 1;
      u.pitch = (voice && voice.pitch) || 1.1;
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- screens ----------
  function showScreen(name) {
    ['title', 'counter', 'kitchen', 'stickers'].forEach(function (s) {
      $('screen-' + s).classList.toggle('active', s === name);
    });
    st.screen = name;
    $('hud').classList.toggle('hidden', name === 'title' || name === 'stickers');
  }

  // ---------- HUD ----------
  function refreshHud() {
    $('coin-count').textContent = save.coins;
    $('served-count').textContent = save.served;
    var ic = save.muted ? '🔇' : '🔊';
    $('btn-sound').textContent = ic;
    $('btn-sound-title').textContent = ic;
  }
  function toggleSound() {
    save.muted = !save.muted;
    AU.setMuted(save.muted);
    if (save.muted) { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} }
    else { AU.bgmStart(); AU.pop(); }
    persist();
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
    var served = save.served;
    var nTypes, maxCount;
    if (served < 3) { nTypes = 1; maxCount = 3; }
    else if (served < 7) { nTypes = 1 + rnd(2); maxCount = 4; }
    else if (served < 15) { nTypes = 2; maxCount = 5; }
    else { nTypes = 2 + rnd(2); maxCount = 6; }
    var keys = TOPPING_KEYS.slice();
    var chosen = {};
    for (var i = 0; i < nTypes; i++) {
      var k = keys.splice(rnd(keys.length), 1)[0];
      chosen[k] = 1 + rnd(maxCount);
    }
    return { toppings: chosen };
  }
  function orderPhrases(order) {
    return Object.keys(order.toppings).map(function (k) {
      return order.toppings[k] + ' ' + topNameFor(k, order.toppings[k]);
    });
  }
  function orderSentence(order) {
    var parts = orderPhrases(order);
    var list = parts.length > 1
      ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
      : parts[0];
    return 'a cheese pizza with ' + list;
  }
  function renderOrderCard(el, order) {
    var html = '';
    Object.keys(order.toppings).forEach(function (k) {
      var n = order.toppings[k];
      var minis = '';
      for (var i = 0; i < n; i++) minis += '<span class="ic">' + topSvg(k) + '</span>';
      html += '<div class="order-line"><span class="num">' + n + '</span>' +
        '<span class="ic">' + topSvg(k) + '</span>' +
        '<span style="font-size:20px">→</span><span class="minis">' + minis + '</span></div>';
    });
    el.innerHTML = html;
  }
  function speakOrder() {
    var ch = A.characters[st.charKey];
    if (!ch || !st.order) return;
    var line = pick(ch.orderLines || ['I would like {ORDER}, please!']);
    speak(line.replace('{ORDER}', orderSentence(st.order)), ch.voice);
  }

  // ---------- counter scene ----------
  function enterCustomer() {
    showScreen('counter');
    st.charKey = pickCustomer();
    st.lastCustomer = st.charKey;
    st.order = makeOrder();
    var ch = A.characters[st.charKey] || { name: '???', svg: '', greetings: ['Hello!'], voice: {} };

    var art = $('customer-art');
    art.className = '';
    art.innerHTML = characterHTML(ch, st.charKey);
    setMouth(art, false);
    $('speech-bubble').classList.add('hidden');
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
    var greeting = pick(ch.greetings || ['Hello!']);
    $('speech-text').textContent = greeting;
    $('speech-order').classList.add('hidden');
    $('btn-hear').classList.add('hidden');
    bubble.classList.remove('hidden');
    speak(greeting, ch.voice);
    setTimeout(function () { showOrder(ch); }, 1900);
  }
  function showOrder(ch) {
    if (st.screen !== 'counter' || !st.order) return;
    var line = pick(ch.orderLines || ['I would like {ORDER}, please!']);
    $('speech-text').textContent = line.replace('{ORDER}', orderSentence(st.order) + ' 🍕');
    renderOrderCard($('speech-order'), st.order);
    $('speech-order').classList.remove('hidden');
    $('btn-hear').classList.remove('hidden');
    $('btn-make').classList.remove('hidden');
    speakOrder();
  }
  function setMouth(rootEl, happy) {
    // raster characters: swap the smile / grin images
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

  function startKitchen() {
    showScreen('kitchen');
    st.placed = {};
    st.step = 'dough';
    st.doughTaps = 0;
    st.sauceProgress = 0;
    st.cheeseTaps = 0;
    st.baking = false;

    $('oven-overlay').classList.add('hidden');
    $('oven-overlay').classList.remove('door-open');
    $('btn-bake').classList.add('hidden');
    $('topping-bins').classList.add('hidden');
    toolCursor.classList.add('hidden');
    pizzaTops.innerHTML = '';
    $('pizza-wrap').style.visibility = '';

    buildPizzaBase();
    renderOrderStrip();
    setStep('dough');
    forcePizzaPaint();
  }

  // Some mobile Chromium builds rasterize the kitchen's freshly-built,
  // opacity-animating pizza layer BEFORE its images finish decoding, then
  // leave it blank until the layer is invalidated. Decode the layer images
  // and nudge the layer a few times so it repaints with real content.
  function forcePizzaPaint() {
    var wrap = $('pizza-wrap');
    if (!wrap) return;
    var imgs = pizzaBase.querySelectorAll('img');
    imgs.forEach(function (im) {
      if (im.decode) { try { im.decode().then(nudge).catch(function () {}); } catch (e) {} }
    });
    function nudge() {
      // a filter change forces the compositor to re-rasterize the layer's
      // contents (a bare transform only re-composites, which isn't enough)
      pizzaBase.style.filter = 'opacity(0.999)';
      requestAnimationFrame(function () { pizzaBase.style.filter = ''; });
    }
    // nudge on a short cadence spanning the kitchen screen's fade-in
    [0, 60, 200, 420, 700].forEach(function (t) { setTimeout(nudge, t); });
  }

  function buildPizzaBase() {
    if (RASTER && A.pizzaImg) {
      var P = A.pizzaImg;
      pizzaBase.innerHTML =
        '<img class="pz-layer pz-crust" src="' + P.crust + '" style="display:none" alt="" draggable="false">' +
        '<img class="pz-layer pz-sauce" src="' + P.sauce + '" style="clip-path:circle(0% at 50% 50%);-webkit-clip-path:circle(0% at 50% 50%)" alt="" draggable="false">' +
        '<img class="pz-layer pz-cheese" src="' + P.cheese + '" style="opacity:0" alt="" draggable="false">' +
        '<img class="pz-layer pz-baked" src="' + P.baked + '" style="opacity:0" alt="" draggable="false">' +
        '<div id="dough-ball"><img class="pz-layer pz-dough" src="' + P.dough + '" alt="" draggable="false"></div>';
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
    var hint = $('step-hint');
    hint.textContent = stepHints[step] || '';
    hint.style.opacity = stepHints[step] ? 1 : 0;
    if (step === 'sauce') {
      toolCursor.innerHTML = A.food.ladle || '';
      toolCursor.classList.toggle('hidden', !A.food.ladle);
    } else if (step === 'cheese') {
      toolCursor.innerHTML = A.food.shaker || '';
      toolCursor.classList.toggle('hidden', !A.food.shaker);
    } else {
      toolCursor.classList.add('hidden');
    }
    if (step === 'toppings') {
      buildBins();
      $('topping-bins').classList.remove('hidden');
    }
    var voiceHints = {
      dough: 'Tap the dough to pat it flat!',
      sauce: 'Rub the sauce all around!',
      cheese: 'Tap the pizza to shake on cheese!',
      toppings: 'Now drag on the toppings!'
    };
    if (voiceHints[step]) speak(voiceHints[step], { rate: 1, pitch: 1.15 });
    updateOrderStrip();
  }

  // ----- order strip (live checklist) -----
  function renderOrderStrip() {
    var strip = $('kitchen-order');
    var html = '<div class="order-chip" id="chip-sauce"><span style="font-size:26px">🥫</span><span class="check">⬜</span></div>' +
      '<div class="order-chip" id="chip-cheese"><span style="font-size:26px">🧀</span><span class="check">⬜</span></div>';
    Object.keys(st.order.toppings).forEach(function (k) {
      html += '<div class="order-chip" id="chip-' + k + '">' +
        '<span class="ic">' + topSvg(k) + '</span>' +
        '<span class="count" id="count-' + k + '">0/' + st.order.toppings[k] + '</span></div>';
    });
    html += '<button class="hear-btn" id="btn-hear-kitchen" style="margin:0" aria-label="Hear the order">🔊</button>';
    strip.innerHTML = html;
    $('btn-hear-kitchen').addEventListener('click', function () { AU.pop(); speakOrder(); });
  }
  function updateOrderStrip() {
    var sauceDone = ['cheese', 'toppings', 'bake'].indexOf(st.step) >= 0;
    var cheeseDone = ['toppings', 'bake'].indexOf(st.step) >= 0;
    var cs = $('chip-sauce'), cc = $('chip-cheese');
    if (cs) { cs.classList.toggle('done', sauceDone); cs.querySelector('.check').textContent = sauceDone ? '✅' : '⬜'; }
    if (cc) { cc.classList.toggle('done', cheeseDone); cc.querySelector('.check').textContent = cheeseDone ? '✅' : '⬜'; }
    if (!st.order) return;
    var allGood = sauceDone && cheeseDone;
    var anyOver = false, anyWrong = false;
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
      else if (anyWrong) hint.textContent = 'Tap the extra one to take it off! 👆';
      else hint.textContent = stepHints.toppings;
      hint.style.opacity = 1;
    }
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
        var crust = pizzaBase.querySelector('.pz-crust') || document.getElementById('pz-crust');
        if (crust) crust.style.display = '';
        pizzaBase.classList.remove('pop');
        void pizzaBase.offsetWidth;
        pizzaBase.classList.add('pop');
        AU.pop();
        var r = zoneRect();
        sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 12);
        setTimeout(function () { setStep('sauce'); }, 500);
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
      if (RASTER) {
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
        setTimeout(function () { setStep('cheese'); }, 450);
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
    if (RASTER) {
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

  // ----- topping bins & dragging -----
  function buildBins() {
    var bins = $('topping-bins');
    bins.innerHTML = '';
    TOPPING_KEYS.forEach(function (k) {
      var b = document.createElement('div');
      b.className = 'bin' + (st.order.toppings[k] ? ' needed' : '');
      b.dataset.key = k;
      b.innerHTML = '<div class="bin-art">' + topSvg(k) + '</div><div class="bin-label">' + topName(k) + '</div>';
      b.addEventListener('pointerdown', function (e) { startDrag(e, k, b); });
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
    drag = { key: key, el: d, bin: binEl };
    window.addEventListener('pointermove', dragMove);
    window.addEventListener('pointerup', dragEnd);
    window.addEventListener('pointercancel', dragEnd);
  }
  function dragMove(e) {
    if (!drag) return;
    drag.el.style.left = e.clientX + 'px';
    drag.el.style.top = e.clientY + 'px';
  }
  function dragEnd(e) {
    window.removeEventListener('pointermove', dragMove);
    window.removeEventListener('pointerup', dragEnd);
    window.removeEventListener('pointercancel', dragEnd);
    if (!drag) return;
    var d = drag; drag = null;
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
    t.addEventListener('pointerdown', function (e) {
      if (st.step !== 'toppings' || st.baking) return;
      e.stopPropagation();
      removeTopping(t, key, e.clientX, e.clientY);
    });
    pizzaTops.appendChild(t);
    st.placed[key] = (st.placed[key] || 0) + 1;
    AU.pop();
    var need = st.order.toppings[key];
    if (!need) {
      speak('Hmm, that is not on the order!', { rate: 1, pitch: 1.1 });
      AU.sad();
    } else if (st.placed[key] > need) {
      speak('That is too many! Tap one to take it off.', { rate: 1, pitch: 1.1 });
      AU.sad();
    } else if (st.placed[key] === need) {
      sparkleAt(clientX, clientY, 6);
    }
    updateOrderStrip();
  }
  function removeTopping(el, key, x, y) {
    st.placed[key] = Math.max(0, (st.placed[key] || 0) - 1);
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
    var snap;
    if (RASTER && A.ovenImg) {
      ovenArt.innerHTML = '<img class="oven-body" src="' + A.ovenImg.body + '" alt="" draggable="false">';
      doorLayer.innerHTML = '<img class="oven-door" src="' + A.ovenImg.door + '" alt="" draggable="false">';
      // raster pizza layers use classes + inline styles, so no id renaming needed
      snap = '<div style="position:absolute;inset:0">' + pizzaBase.innerHTML + '</div>' +
        '<div style="position:absolute;inset:0;pointer-events:none">' + pizzaTops.innerHTML + '</div>';
    } else {
      ovenArt.innerHTML = A.scenes.oven || '<svg viewBox="0 0 520 560"><rect x="40" y="80" width="440" height="420" rx="60" fill="#C0574F" stroke="#4A2E24" stroke-width="8"/><rect x="110" y="220" width="300" height="210" rx="40" fill="#3A241C"/><g class="oven-door"><rect x="90" y="210" width="340" height="230" rx="40" fill="#F2B84B" stroke="#4A2E24" stroke-width="8"/></g></svg>';
      var srcSvg = ovenArt.querySelector('svg');
      var doorG = ovenArt.querySelector('.oven-door');
      if (srcSvg && doorG) {
        doorLayer.innerHTML = '<svg viewBox="' + (srcSvg.getAttribute('viewBox') || '0 0 520 560') + '" xmlns="http://www.w3.org/2000/svg"></svg>';
        doorLayer.querySelector('svg').appendChild(doorG);
      }
      // snapshot the pizza (rename ids to avoid collisions with the kitchen pizza)
      snap = ('<div style="position:absolute;inset:0">' + pizzaBase.innerHTML + '</div>' +
        '<div style="position:absolute;inset:0;pointer-events:none">' + pizzaTops.innerHTML + '</div>')
        .split('pz-').join('pz2-').split('dough-ball').join('dough-ball-2');
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
      var line = pick(ch.happyLines || ['Yummy! Thank you!']);
      $('speech-text').textContent = line;
      $('speech-order').classList.add('hidden');
      $('btn-hear').classList.add('hidden');
      $('speech-bubble').classList.remove('hidden');
      speak(line, ch.voice);
      rewardAndContinue();
    }, 1500);
  }
  function rewardAndContinue() {
    var toppingCount = 0;
    Object.keys(st.order.toppings).forEach(function (k) { toppingCount += st.order.toppings[k]; });
    var earned = 10 + toppingCount;
    var art = $('customer-art').getBoundingClientRect();
    coinsFly(earned, art.left + art.width / 2, art.top + art.height / 2);

    save.served++;
    var isNewSticker = !save.stickers[st.charKey];
    if (isNewSticker) save.stickers[st.charKey] = true;
    persist();
    refreshHud();

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
          speak('Wow! ' + save.served + ' pizzas! You are a pizza star!', { rate: 1, pitch: 1.2 });
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
    $('title-badge').textContent = save.served > 0 ? '🍕 Pizzas made: ' + save.served : '';
  }
  function goTitle() {
    AU.pop();
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
  function init() {
    buildScenes();
    buildTitle();
    refreshHud();
    AU.setMuted(save.muted);

    $('btn-play').addEventListener('click', function () {
      AU.init();
      if (!save.muted) AU.bgmStart();
      AU.pop();
      enterCustomer();
    });
    $('btn-stickers').addEventListener('click', function () { AU.init(); openStickers(); });
    $('btn-stickers-back').addEventListener('click', goTitle);
    $('btn-sound').addEventListener('click', toggleSound);
    $('btn-sound-title').addEventListener('click', function () { AU.init(); toggleSound(); });
    $('btn-home').addEventListener('click', goTitle);
    $('btn-make').addEventListener('click', function () { AU.pop(); startKitchen(); });
    $('btn-hear').addEventListener('click', function () { AU.pop(); speakOrder(); });
    $('btn-bake').addEventListener('click', startBake);
    $('btn-serve').addEventListener('click', serve);
    $('btn-next').addEventListener('click', nextCustomer);

    // iOS: block pinch zoom & double-tap zoom leftovers
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
    document.addEventListener('dblclick', function (e) { e.preventDefault(); });

    showScreen('title');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
