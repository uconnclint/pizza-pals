/* ============================================================
   Pizza Pals! — character voice playback (ElevenLabs clips)
   Plays pre-generated MP3s from art/audio/. Each character has its
   own voice; a narrator voice reads step hints, order amounts, and
   cheers. Sequences (like an order) play clip-by-clip with a tiny gap.
   ============================================================ */
(function () {
  'use strict';
  var BASE = 'art/audio/';
  var muted = false;
  var unlocked = false;
  var cur = null;     // currently-playing Audio element
  var token = 0;      // bumped to cancel an in-flight sequence
  var cache = {};

  function el(url) {
    var a = cache[url];
    if (!a) { a = new Audio(BASE + url); a.preload = 'auto'; cache[url] = a; }
    return a;
  }
  function hardStop() {
    token++;
    if (cur) { try { cur.pause(); cur.currentTime = 0; } catch (e) {} cur = null; }
  }
  function playOne(url) {
    return new Promise(function (resolve) {
      if (muted) { resolve(); return; }
      var a;
      try { a = el(url); a.currentTime = 0; } catch (e) { resolve(); return; }
      cur = a;
      var done = false;
      function fin() {
        if (done) return; done = true;
        a.removeEventListener('ended', fin);
        a.removeEventListener('error', fin);
        resolve();
      }
      a.addEventListener('ended', fin);
      a.addEventListener('error', fin);
      var p;
      try { p = a.play(); } catch (e) { fin(); return; }
      if (p && p.catch) p.catch(function () { fin(); });
    });
  }
  function playSeq(urls) {
    hardStop();
    if (muted || !urls || !urls.length) return;
    var mine = ++token;
    var i = 0;
    (function next() {
      if (muted || mine !== token || i >= urls.length) return;
      playOne(urls[i++]).then(function () {
        if (mine !== token) return;
        if (i < urls.length) setTimeout(next, 85); else cur = null;
      });
    })();
  }

  window.GameVoice = {
    // play a single clip (interrupts whatever's playing)
    play: function (url) { playSeq([url]); },
    // play a list of clips back-to-back
    seq: function (urls) { playSeq(urls); },
    stop: hardStop,
    setMuted: function (b) { muted = !!b; if (muted) hardStop(); },
    isMuted: function () { return muted; },
    // warm a few clips so the first line isn't delayed
    preload: function (urls) {
      (urls || []).forEach(function (u) { try { el(u).load(); } catch (e) {} });
    },
    // iOS/Safari needs a play() inside the first user gesture to unlock audio
    unlock: function () {
      if (unlocked) return; unlocked = true;
      try {
        var a = el('narrator/and.mp3');
        a.volume = 0;
        var p = a.play();
        if (p && p.then) p.then(function () { a.pause(); a.currentTime = 0; a.volume = 1; }).catch(function () { a.volume = 1; });
        else { a.pause(); a.volume = 1; }
      } catch (e) {}
    }
  };
})();
