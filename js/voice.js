/* ============================================================
   Pizza Pals! — character voice playback (ElevenLabs clips)
   Plays pre-generated MP3s from art/audio/ through window.CE.speech
   (engine/core/speech.js, wired up in js/engine-bridge.js), which adds
   the one thing this file never had: if a clip is missing or fails to
   load, the line gets SPOKEN via SpeechSynthesis instead of going silent
   — the exact bug this migration exists to kill (silence inside
   "Listening only" instruction mode was total silence with no recourse).
   Cancel-token interruption (a new play()/seq() silently stops whatever
   was playing) is unchanged in effect — it now lives in core/speech.js
   (modeled on THIS file's original token design) instead of here.
   ============================================================ */
(function () {
  'use strict';
  var BASE = 'art/audio/';
  var cache = {};    // full URL -> HTMLAudioElement, warmed by preload()
  var unlocked = false;

  // ---- clip cache (shared by preload() and the custom playClip below) ----
  function cachedEl(url) {
    var a = cache[url];
    if (!a) { a = new Audio(url); a.preload = 'auto'; cache[url] = a; }
    return a;
  }
  function toUrl(rel) { return BASE + rel; }

  // Custom playClip for core/speech.js's createSpeech(): reuses the SAME
  // cached <audio> elements preload() warms (the default playClip would
  // create a fresh Audio() per call, silently defeating preload()), and
  // preserves this file's original ~85ms gap between clips in a sequence
  // — inserted as a delay after 'ended' rather than before the next clip,
  // and cancelled by .stop() so an interrupting say() is still instant,
  // not delayed by a stale gap timer.
  function playClipCached(url) {
    var a;
    try { a = cachedEl(url); a.currentTime = 0; } catch (err) { return Promise.reject(err); }
    var gapTimer = null;
    var promise = new Promise(function (resolve, reject) {
      var settled = false;
      function cleanup() {
        try { a.removeEventListener('ended', onEnded); a.removeEventListener('error', onError); } catch (e) {}
      }
      function onEnded() {
        if (settled) return; settled = true; cleanup();
        gapTimer = setTimeout(resolve, 85);
      }
      function onError() {
        if (settled) return; settled = true; cleanup();
        reject(new Error('clip playback error: ' + url));
      }
      try { a.addEventListener('ended', onEnded); a.addEventListener('error', onError); } catch (e) {}
      var p;
      try { p = a.play(); } catch (err) { onError(); return; }
      if (p && p.catch) p.catch(onError);
    });
    promise.stop = function () {
      try { a.pause(); } catch (e) {}
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null; }
    };
    return promise;
  }

  // ---- clip source for core/speech.js ----
  // Every call site in game.js already knows the EXACT clip path it wants
  // (built from character/order data, not free text) — there's no phrase to
  // template-match against. So play()/seq() below stash the resolved URL(s)
  // in `pendingClipUrls` immediately before calling ctx.speech.say(text),
  // and this source's resolve() just returns them, ignoring its `text`
  // argument entirely (that argument is only ever the TTS FALLBACK text
  // here, e.g. "a pizza with sauce, cheese and..." — it was never a clip
  // key to begin with). This is safe despite the shared variable: say()
  // calls resolve() SYNCHRONOUSLY as part of its own call stack (see
  // engine/core/speech.js's say() -> resolveFromSources()), before this
  // function ever returns control to anything that could call play()/seq()
  // again, so there is no reentrancy/race window.
  var pendingClipUrls = null;
  var clipSource = {
    resolve: function () {
      var urls = pendingClipUrls;
      pendingClipUrls = null;
      return urls;
    }
  };

  function speech() { return window.CE && window.CE.speech; }

  function speak(url, fallbackText) {
    if (!url) return;
    pendingClipUrls = [toUrl(url)];
    var s = speech();
    if (s) s.say(fallbackText || '');
  }
  function speakSeq(urls, fallbackText) {
    if (!urls || !urls.length) return;
    pendingClipUrls = urls.map(toUrl);
    var s = speech();
    if (s) s.say(fallbackText || '');
  }

  window.GameVoice = {
    // play a single clip (interrupts whatever's playing); fallbackText is
    // spoken via SpeechSynthesis if the clip is missing/fails.
    play: speak,
    // play a list of clips back-to-back; fallbackText covers the WHOLE
    // sequence (if ANY clip in it fails, the whole line falls back to TTS
    // rather than leaving a silent gap mid-sentence).
    seq: speakSeq,
    stop: function () { var s = speech(); if (s) s.stop(); },
    // core/speech.js's say() already gates every FUTURE call on
    // ctx.settings.get('muted') itself (single source of truth) — this
    // only needs to silence whatever is CURRENTLY mid-playback the instant
    // mute is switched on, matching the original hardStop()-on-mute behavior.
    setMuted: function (b) { if (b) { var s = speech(); if (s) s.stop(); } },
    // warm a few clips so the first line isn't delayed
    preload: function (urls) {
      (urls || []).forEach(function (u) { try { cachedEl(toUrl(u)).load(); } catch (e) {} });
    },
    // iOS/Safari needs a play() inside the first user gesture to unlock
    // audio. Keeps the original real-clip trick (proven on Clint's target
    // iPads) AND calls the engine's own unlock() so ctx.speech's internal
    // bookkeeping (and its SpeechSynthesis-side unlock, which this file's
    // old version never did) both get the same gesture.
    unlock: function () {
      if (unlocked) return; unlocked = true;
      try {
        var a = cachedEl(toUrl('narrator/and.mp3'));
        a.volume = 0;
        var p = a.play();
        if (p && p.then) p.then(function () { a.pause(); a.currentTime = 0; a.volume = 1; }).catch(function () { a.volume = 1; });
        else { a.pause(); a.volume = 1; }
      } catch (e) {}
      var s = speech();
      if (s) s.unlock();
    },
    // Consumed by js/engine-bridge.js when building window.CE (createSpeech's
    // `sources`/`playClip` options) — not part of the public play/seq/stop
    // API game.js calls, but exported here since this file owns both.
    speechSource: clipSource,
    playClip: playClipCached
  };
})();
