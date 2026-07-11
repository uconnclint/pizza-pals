/*
 * Pizza Pals! — audio.js
 * 100% synthesized Web Audio API sound library. No audio files, no external
 * resources. Plain script (no ES modules). Attaches window.GameAudio.
 *
 * Design: soft, round, toy-like (Toca Boca / Nintendo menu vibes). Sine &
 * triangle oscillators, gentle attacks, generous exponential decays, a touch
 * of detune sparkle. Noise is always lowpass-filtered. Nothing harsh or loud.
 * Master gain ~0.5 through a DynamicsCompressor to protect little ears.
 */
(function () {
  'use strict';

  // ---- Shared audio graph state -------------------------------------------
  var ctx = null;          // the single shared AudioContext
  var master = null;       // master gain -> compressor -> destination
  var compressor = null;
  var noiseBuffer = null;  // pre-rendered white noise, created once
  var muted = false;

  // Looping sizzle handles
  var sizzleNodes = null;  // { src, gain, filter, lfo, lfoGain } when running

  // BGM scheduler state
  var bgmPlaying = false;
  var bgmTimer = null;       // setInterval id
  var bgmNextNoteTime = 0;   // ctx time of next note to schedule
  var bgmStep = 0;           // running 16th-note counter
  var bgmGain = null;        // sub-mix gain for BGM

  var MASTER_LEVEL = 0.5;

  // ---- Tiny helpers --------------------------------------------------------

  // Returns true when we have a usable, running context and are not muted.
  function live() {
    return !!ctx && !muted && ctx.state !== 'closed';
  }

  function now() {
    return ctx ? ctx.currentTime : 0;
  }

  // Create a fresh white-noise buffer (mono, ~1s), reused for all noise SFX.
  function buildNoiseBuffer() {
    var len = Math.floor(ctx.sampleRate * 1.0);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buf;
  }

  // Make an oscillator connected through a gain envelope to master.
  // Returns { osc, gain }.
  function makeVoice(type, freq, destination) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now());
    g.gain.setValueAtTime(0.0001, now());
    osc.connect(g);
    g.connect(destination || master);
    return { osc: osc, gain: g };
  }

  // A short percussive gain envelope: quick attack, exponential decay.
  // t0 = start time, peak = peak gain, atk = attack seconds, dur = total.
  function pluckEnv(gainParam, t0, peak, atk, dur) {
    gainParam.setValueAtTime(0.0001, t0);
    gainParam.linearRampToValueAtTime(peak, t0 + atk);
    gainParam.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  // Create a lowpass-filtered noise burst source. Returns { src, filter, gain }.
  function makeNoise(destination) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now());
    src.connect(filter);
    filter.connect(g);
    g.connect(destination || master);
    return { src: src, filter: filter, gain: g };
  }

  // ---- Public: lifecycle ---------------------------------------------------

  function init() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return; // no Web Audio support: everything becomes a no-op
        ctx = new AC();

        compressor = ctx.createDynamicsCompressor();
        // Gentle, protective compression.
        compressor.threshold.setValueAtTime(-18, ctx.currentTime);
        compressor.knee.setValueAtTime(24, ctx.currentTime);
        compressor.ratio.setValueAtTime(4, ctx.currentTime);
        compressor.attack.setValueAtTime(0.005, ctx.currentTime);
        compressor.release.setValueAtTime(0.20, ctx.currentTime);

        master = ctx.createGain();
        master.gain.setValueAtTime(muted ? 0 : MASTER_LEVEL, ctx.currentTime);

        master.connect(compressor);
        compressor.connect(ctx.destination);

        noiseBuffer = buildNoiseBuffer();
      }
      // iPad Safari: the context starts suspended and must be resumed from a
      // user gesture. Safe to call repeatedly.
      if (ctx.state === 'suspended' && ctx.resume) {
        ctx.resume();
      }
    } catch (e) {
      // Swallow: audio simply stays unavailable.
    }
  }

  function setMuted(b) {
    try {
      muted = !!b;
      if (master && ctx) {
        var t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(muted ? 0 : MASTER_LEVEL, t);
      }
      if (muted) {
        // Stop anything that loops so it doesn't linger silently.
        bgmStop();
        sizzleStop();
      }
    } catch (e) {}
  }

  function isMuted() {
    return muted;
  }

  // ---- Public: one-shot SFX ------------------------------------------------

  // Soft bubbly pop — button taps, topping placed.
  function pop() {
    try {
      if (!live()) return;
      var t = now();
      var v = makeVoice('sine', 420, master);
      // Quick upward pitch blip gives the round "bloop".
      v.osc.frequency.setValueAtTime(420, t);
      v.osc.frequency.exponentialRampToValueAtTime(760, t + 0.06);
      pluckEnv(v.gain.gain, t, 0.5, 0.006, 0.16);
      v.osc.start(t);
      v.osc.stop(t + 0.2);
    } catch (e) {}
  }

  // Wet cartoon splat — sauce spreading.
  function splat() {
    try {
      if (!live()) return;
      var t = now();
      // Low round tone that drops in pitch = squelchy body.
      var v = makeVoice('sine', 240, master);
      v.osc.frequency.setValueAtTime(240, t);
      v.osc.frequency.exponentialRampToValueAtTime(90, t + 0.18);
      pluckEnv(v.gain.gain, t, 0.42, 0.005, 0.22);
      v.osc.start(t);
      v.osc.stop(t + 0.26);
      // Filtered noise "wet" layer.
      var n = makeNoise(master);
      n.filter.frequency.setValueAtTime(1200, t);
      n.filter.frequency.exponentialRampToValueAtTime(300, t + 0.16);
      n.filter.Q.setValueAtTime(2, t);
      pluckEnv(n.gain.gain, t, 0.22, 0.004, 0.18);
      n.src.start(t);
      n.src.stop(t + 0.22);
    } catch (e) {}
  }

  // Light shimmery shake — cheese sprinkle.
  function sprinkle() {
    try {
      if (!live()) return;
      var t = now();
      // A few tiny high sine "grains" of shimmer.
      var freqs = [1500, 1900, 2300, 1700, 2100];
      for (var i = 0; i < freqs.length; i++) {
        var start = t + i * 0.035;
        var v = makeVoice('sine', freqs[i], master);
        v.osc.detune.setValueAtTime((Math.random() - 0.5) * 30, start);
        pluckEnv(v.gain.gain, start, 0.14, 0.003, 0.08);
        v.osc.start(start);
        v.osc.stop(start + 0.1);
      }
      // Soft high-passed noise wisp underneath for the "shake".
      var n = makeNoise(master);
      n.filter.type = 'highpass';
      n.filter.frequency.setValueAtTime(3000, t);
      pluckEnv(n.gain.gain, t, 0.06, 0.01, 0.2);
      n.src.start(t);
      n.src.stop(t + 0.22);
    } catch (e) {}
  }

  // Soft dough squish — patting dough.
  function squish() {
    try {
      if (!live()) return;
      var t = now();
      // Round low triangle that bends down and back = squishy give.
      var v = makeVoice('triangle', 180, master);
      v.osc.frequency.setValueAtTime(180, t);
      v.osc.frequency.exponentialRampToValueAtTime(120, t + 0.09);
      v.osc.frequency.exponentialRampToValueAtTime(150, t + 0.18);
      pluckEnv(v.gain.gain, t, 0.4, 0.02, 0.2);
      v.osc.start(t);
      v.osc.stop(t + 0.24);
      // Very soft muffled noise pad.
      var n = makeNoise(master);
      n.filter.frequency.setValueAtTime(500, t);
      n.filter.Q.setValueAtTime(0.7, t);
      pluckEnv(n.gain.gain, t, 0.1, 0.02, 0.16);
      n.src.start(t);
      n.src.stop(t + 0.2);
    } catch (e) {}
  }

  // Quick swoosh — screen transitions, pizza sliding.
  function whoosh() {
    try {
      if (!live()) return;
      var t = now();
      var n = makeNoise(master);
      n.filter.type = 'bandpass';
      n.filter.Q.setValueAtTime(1.2, t);
      // Sweep the band up then let it fade = airy swoosh.
      n.filter.frequency.setValueAtTime(400, t);
      n.filter.frequency.exponentialRampToValueAtTime(2600, t + 0.18);
      n.gain.gain.setValueAtTime(0.0001, t);
      n.gain.gain.linearRampToValueAtTime(0.28, t + 0.08);
      n.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      n.src.start(t);
      n.src.stop(t + 0.34);
    } catch (e) {}
  }

  // Bright oven "ding!" bell.
  function ding() {
    try {
      if (!live()) return;
      var t = now();
      // Bell = fundamental + a shimmery upper partial, long soft tail.
      var partials = [
        { f: 1050, g: 0.35, d: 1.1 },
        { f: 2100, g: 0.16, d: 0.8 },
        { f: 3150, g: 0.07, d: 0.5 }
      ];
      for (var i = 0; i < partials.length; i++) {
        var p = partials[i];
        var v = makeVoice('sine', p.f, master);
        pluckEnv(v.gain.gain, t, p.g, 0.004, p.d);
        v.osc.start(t);
        v.osc.stop(t + p.d + 0.05);
      }
    } catch (e) {}
  }

  // ---- Public: looping sizzle ---------------------------------------------

  // Gentle baking sizzle: lowpass-filtered noise with a slow amplitude wobble.
  function sizzleStart() {
    try {
      if (!live()) return;
      if (sizzleNodes) return; // already sizzling
      var t = now();
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.Q.setValueAtTime(0.6, t);

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.4); // gentle fade-in

      // Slow LFO on gain for an organic crackle-swell.
      var lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(7, t);
      var lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.03, t);
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);

      src.connect(filter);
      filter.connect(g);
      g.connect(master);

      src.start(t);
      lfo.start(t);

      sizzleNodes = { src: src, gain: g, filter: filter, lfo: lfo, lfoGain: lfoGain };
    } catch (e) {}
  }

  function sizzleStop() {
    try {
      if (!sizzleNodes) return; // safe if never started
      var n = sizzleNodes;
      sizzleNodes = null;
      if (ctx) {
        var t = ctx.currentTime;
        try {
          n.gain.gain.cancelScheduledValues(t);
          n.gain.gain.setValueAtTime(n.gain.gain.value, t);
          n.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        } catch (e2) {}
        try { n.src.stop(t + 0.35); } catch (e3) {}
        try { n.lfo.stop(t + 0.35); } catch (e4) {}
      } else {
        try { n.src.stop(); } catch (e5) {}
        try { n.lfo.stop(); } catch (e6) {}
      }
    } catch (e) {}
  }

  // ---- Public: more SFX ----------------------------------------------------

  // Silly nom-nom chewing (2-3 quick soft bites).
  function munch() {
    try {
      if (!live()) return;
      var t = now();
      var bites = 3;
      for (var i = 0; i < bites; i++) {
        var start = t + i * 0.13;
        // Low round triangle bite that quickly drops in pitch.
        var v = makeVoice('triangle', 200 - i * 10, master);
        v.osc.frequency.setValueAtTime(200 - i * 10, start);
        v.osc.frequency.exponentialRampToValueAtTime(95, start + 0.07);
        pluckEnv(v.gain.gain, start, 0.34, 0.006, 0.1);
        v.osc.start(start);
        v.osc.stop(start + 0.12);
        // Soft muffled noise for the "nom" texture.
        var n = makeNoise(master);
        n.filter.frequency.setValueAtTime(600, start);
        pluckEnv(n.gain.gain, start, 0.12, 0.005, 0.08);
        n.src.start(start);
        n.src.stop(start + 0.1);
      }
    } catch (e) {}
  }

  // Short celebratory fanfare arpeggio (major, sparkly).
  function tada() {
    try {
      if (!live()) return;
      var t = now();
      // C major arpeggio up to a sparkly top: C5 E5 G5 C6.
      var notes = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < notes.length; i++) {
        var start = t + i * 0.09;
        var v = makeVoice('triangle', notes[i], master);
        v.osc.detune.setValueAtTime(4, start); // tiny sparkle detune
        pluckEnv(v.gain.gain, start, 0.34, 0.006, 0.5);
        v.osc.start(start);
        v.osc.stop(start + 0.55);
        // Sine sparkle octave layer, quieter.
        var s = makeVoice('sine', notes[i] * 2, master);
        pluckEnv(s.gain.gain, start, 0.1, 0.004, 0.3);
        s.osc.start(start);
        s.osc.stop(start + 0.35);
      }
      // Final shimmer chord ring.
      var ringStart = t + notes.length * 0.09;
      var chord = [523.25, 659.25, 783.99];
      for (var j = 0; j < chord.length; j++) {
        var c = makeVoice('sine', chord[j], master);
        pluckEnv(c.gain.gain, ringStart, 0.16, 0.01, 0.7);
        c.osc.start(ringStart);
        c.osc.stop(ringStart + 0.75);
      }
    } catch (e) {}
  }

  // Classic two-note coin chime.
  function coin() {
    try {
      if (!live()) return;
      var t = now();
      // B5 then E6 — the familiar bright coin lift.
      var v = makeVoice('square', 987.77, master);
      // Soften the square with a gentle lowpass.
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(4000, t);
      v.osc.disconnect();
      v.osc.connect(lp);
      lp.connect(v.gain);
      v.gain.gain.setValueAtTime(0.0001, t);
      v.gain.gain.linearRampToValueAtTime(0.26, t + 0.005);
      v.gain.gain.setValueAtTime(0.26, t + 0.07);
      v.osc.frequency.setValueAtTime(987.77, t);
      v.osc.frequency.setValueAtTime(1318.51, t + 0.08);
      v.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      v.osc.start(t);
      v.osc.stop(t + 0.44);
    } catch (e) {}
  }

  // Very gentle "aww" two-note downward blip (never scary) — gentle hints.
  function sad() {
    try {
      if (!live()) return;
      var t = now();
      // E5 down to C5, soft sine, rounded portamento. Warm, not mournful.
      var v = makeVoice('sine', 659.25, master);
      v.osc.frequency.setValueAtTime(659.25, t);
      v.osc.frequency.setValueAtTime(659.25, t + 0.16);
      v.osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.3);
      v.gain.gain.setValueAtTime(0.0001, t);
      v.gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
      v.gain.gain.setValueAtTime(0.3, t + 0.16);
      v.gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      v.osc.start(t);
      v.osc.stop(t + 0.55);
    } catch (e) {}
  }

  // ---- Public: background music -------------------------------------------
  //
  // Gentle, happy 8-bar loop at ~112 BPM in C major. Bouncy triangle bass on
  // the beats plus a soft plucky sine melody. Scheduled with a lookahead
  // timer. Low volume (~0.12) so it sits under SFX.

  var BPM = 112;
  var SECONDS_PER_BEAT = 60 / BPM;
  var SIXTEENTH = SECONDS_PER_BEAT / 4;   // one 16th note
  var LOOKAHEAD_MS = 25;                  // timer interval
  var SCHEDULE_AHEAD = 0.12;              // seconds to schedule in advance

  // Note frequencies (Hz).
  var N = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77
  };

  // Bass pattern: one entry per beat across 8 bars (32 beats). Bouncy root/fifth.
  var bassPattern = [
    // Bar 1: C
    N.C3, N.G3, N.C4, N.G3,
    // Bar 2: F
    N.F3, N.C4, N.F3, N.C4,
    // Bar 3: G
    N.G3, N.D4, N.G3, N.D4,
    // Bar 4: C
    N.C3, N.G3, N.C4, N.E4,
    // Bar 5: A min (relative warmth)
    N.A3, N.E4, N.A3, N.E4,
    // Bar 6: F
    N.F3, N.C4, N.F3, N.A3,
    // Bar 7: G
    N.G3, N.D4, N.B3, N.G3,
    // Bar 8: C
    N.C3, N.G3, N.E4, N.C4
  ];

  // Melody: 16th-note grid, 16 steps per bar, 8 bars = 128 steps.
  // 0 = rest. Phrases arranged A / A' / B / A'' style so it stays catchy but
  // not annoyingly repetitive.
  var R = 0;
  var A_phrase = [
    N.G4, R, N.E4, R,  N.G4, R, N.C5, R,   N.B4, R, N.G4, R,  N.E4, R, R, R
  ];
  var A2_phrase = [
    N.A4, R, N.F4, R,  N.A4, R, N.C5, R,   N.G4, R, N.E4, R,  N.C4, R, R, R
  ];
  var B_phrase = [
    N.C5, R, N.B4, N.A4,  N.G4, R, N.A4, R,  N.B4, R, N.D5, R,  N.C5, R, R, R
  ];
  var A3_phrase = [
    N.G4, R, N.E4, R,  N.C5, R, N.G4, R,   N.E5, R, N.D5, N.C5,  N.G4, R, N.E4, R
  ];
  // 8 bars: A A' B A''  then  A A' B A3 (vary A/A/B/A phrasing).
  var melodyPattern = []
    .concat(A_phrase, A2_phrase, B_phrase, A3_phrase,
            A_phrase, A2_phrase, B_phrase, A3_phrase);

  var TOTAL_STEPS = 128; // 8 bars * 16 sixteenths

  function scheduleBassNote(freq, time) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    // Bouncy short note.
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.9, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + SECONDS_PER_BEAT * 0.7);
    osc.connect(g);
    g.connect(bgmGain);
    osc.start(time);
    osc.stop(time + SECONDS_PER_BEAT * 0.8);
  }

  function scheduleMelodyNote(freq, time) {
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.detune.setValueAtTime(3, time); // faint sparkle
    // Soft plucky quick decay.
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.7, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
    osc.connect(g);
    g.connect(bgmGain);
    osc.start(time);
    osc.stop(time + 0.32);
    // Gentle octave shimmer, quiet.
    var osc2 = ctx.createOscillator();
    var g2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);
    g2.gain.setValueAtTime(0.0001, time);
    g2.gain.linearRampToValueAtTime(0.18, time + 0.006);
    g2.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
    osc2.connect(g2);
    g2.connect(bgmGain);
    osc2.start(time);
    osc2.stop(time + 0.2);
  }

  function scheduleStep(step, time) {
    // Bass fires on each beat (every 4 sixteenths).
    if (step % 4 === 0) {
      var beatIndex = (Math.floor(step / 4)) % bassPattern.length;
      scheduleBassNote(bassPattern[beatIndex], time);
    }
    // Melody on the 16th grid.
    var mel = melodyPattern[step % melodyPattern.length];
    if (mel && mel !== R) {
      scheduleMelodyNote(mel, time);
    }
  }

  function bgmScheduler() {
    try {
      if (!bgmPlaying || !ctx) return;
      while (bgmNextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
        scheduleStep(bgmStep % TOTAL_STEPS, bgmNextNoteTime);
        bgmNextNoteTime += SIXTEENTH;
        bgmStep++;
      }
    } catch (e) {}
  }

  function bgmStart() {
    try {
      if (!live()) return;
      if (bgmPlaying) return;
      if (!bgmGain) {
        bgmGain = ctx.createGain();
        bgmGain.connect(master);
      }
      bgmGain.gain.cancelScheduledValues(now());
      bgmGain.gain.setValueAtTime(0.0001, now());
      bgmGain.gain.linearRampToValueAtTime(0.12, now() + 0.5); // low, under SFX
      bgmPlaying = true;
      bgmStep = 0;
      bgmNextNoteTime = ctx.currentTime + 0.1;
      bgmScheduler();
      bgmTimer = setInterval(bgmScheduler, LOOKAHEAD_MS);
    } catch (e) {}
  }

  function bgmStop() {
    try {
      bgmPlaying = false;
      if (bgmTimer !== null) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
      if (bgmGain && ctx) {
        var t = ctx.currentTime;
        try {
          bgmGain.gain.cancelScheduledValues(t);
          bgmGain.gain.setValueAtTime(bgmGain.gain.value, t);
          bgmGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        } catch (e2) {}
      }
    } catch (e) {}
  }

  // ---- Export --------------------------------------------------------------

  window.GameAudio = {
    init: init,
    setMuted: setMuted,
    isMuted: isMuted,
    pop: pop,
    splat: splat,
    sprinkle: sprinkle,
    squish: squish,
    whoosh: whoosh,
    ding: ding,
    sizzleStart: sizzleStart,
    sizzleStop: sizzleStop,
    munch: munch,
    tada: tada,
    coin: coin,
    sad: sad,
    bgmStart: bgmStart,
    bgmStop: bgmStop
  };
})();
