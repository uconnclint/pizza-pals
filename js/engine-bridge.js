// ============================================================
// engine-bridge.js — ES module bridge between the classic-script game
// (window.GameAudio / window.GameVoice / window.GAME_ASSETS / js/game.js)
// and clint-engine.
//
// Loaded via ONE <script type="module"> tag, AFTER every classic script in
// index.html. Module scripts run after the document has finished parsing
// (like `defer`) and strictly after every classic script that precedes them
// in source order, so by the time this file executes, audio.js/voice.js/
// assets-*.js/game.js have already run and defined their globals.
//
// js/game.js reads its save blob from window.CE.save at the TOP of its boot
// function — synchronously, before any other game logic — so the WHOLE
// game.js body has to run AFTER window.CE exists, not just its own boot
// call. game.js therefore no longer self-invokes; it defines
// window.__ppStart (scoop-troop's window.__stStart pattern, itself mirroring
// critter-codex's window.__ccStart) and this file calls it once window.CE is
// built — the least-invasive option that's still correct, since a lazier
// "CE ready promise" wouldn't help that eager top-level read.
//
// Nothing here changes audio.js's synth internals. voice.js keeps owning
// clip playback/caching too — it hands this file a ready-made `source` +
// `playClip` (see the speech: {...} block below) rather than this file
// reaching into voice.js's internals.
// ============================================================

import { createGameContext } from '../engine/core/context.js';

function isPlainObject(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

// ── Save: adopt the game's pre-engine flat envelope ─────────────
// Before this migration, js/game.js's `save` object was ONE flat blob
// written wholesale via localStorage.setItem(SAVE_KEY, JSON.stringify(save)).
// Shape: { coins, served, sandboxMade, stickers, muted, tutorialSeen,
// settings:{...}, stats:{...}, unlocks:{...}, theme }. `muted` is
// deliberately DROPPED here: it moves to ctx.settings (single source of
// truth, see readLegacyMuted below, which adopts it from this exact same
// legacy key) — the new primary save key never carries it.
const DEF_SETTINGS = { difficulty: 1, instructionMode: 'both', memory: false, hints: true, quickPrep: true, timer: false, reducedMotion: false };
const DEF_STATS = { orders: 0, firstTry: 0, mistakes: 0, replays: 0, toppingsPlaced: 0, bestLevel: 0, totalSeconds: 0 };
const SAVE_DEFAULTS = {
  coins: 0, served: 0, sandboxMade: 0, stickers: {},
  tutorialSeen: false,
  settings: DEF_SETTINGS,
  stats: DEF_STATS,
  unlocks: { classic: true }, theme: 'classic',
};

// createSave()'s outer merge is SHALLOW ({...defaults, ...migrated}), so a
// migrated `settings`/`stats`/`unlocks` sub-object would wholesale REPLACE
// the default one, not deep-merge field by field. Reproduce the exact
// nested-default backfill the old code did by hand
// (`Object.assign({difficulty:1,...}, save.settings || {})` etc.) so an old
// save missing a newer nested field still gets it filled in.
function migrateLegacySave(raw) {
  if (!isPlainObject(raw)) return null;
  const out = {};
  for (const k in raw) { if (Object.prototype.hasOwnProperty.call(raw, k)) out[k] = raw[k]; }
  delete out.muted; // now owned by ctx.settings — see readLegacyMuted
  out.settings = Object.assign({}, DEF_SETTINGS, isPlainObject(raw.settings) ? raw.settings : {});
  out.stats = Object.assign({}, DEF_STATS, isPlainObject(raw.stats) ? raw.stats : {});
  out.unlocks = Object.assign({ classic: true }, isPlainObject(raw.unlocks) ? raw.unlocks : {});
  if (!isPlainObject(raw.stickers)) out.stickers = {};
  return out;
}

// ── Settings: adopt the game's current `muted` flag ────────────
// Pizza Pals never had a separate settings/prefs key — `muted` has always
// lived INSIDE the main save blob (default `false` in the in-memory `save`
// object literal, i.e. sound ON by default), and game.js's persist() writes
// the WHOLE save object on every mutating action. That means any returning
// player who has played at all (persist() has run at least once) has an
// EXPLICIT `muted` boolean sitting in this exact key today — which is
// exactly the "kid's previously saved explicit muted value" this reader
// must honor (Q11 flips the game's own in-code default from false to the
// engine's start-muted-true, but never a real player's own saved choice).
// A brand-new player with no save yet correctly gets null here -> falls
// through to the engine's muted:true default.
function readLegacyMuted(storage) {
  let raw;
  try { raw = storage.getItem('pizzaPals.save.v1'); } catch { return null; }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (isPlainObject(parsed) && typeof parsed.muted === 'boolean') return { muted: parsed.muted };
  } catch { /* corrupt legacy blob — nothing to adopt */ }
  return null;
}

// ── Speech: js/voice.js's clip source + cached clip player ─────
// voice.js (a classic script, loaded before this module) already built its
// clip-resolving `source` and a cache-reusing `playClip` — see its header
// comment for why a game that already knows its exact clip path per call
// doesn't fit Math Arcade's phrase-template `clipBank()` shape. Guarded
// with `&&` (not assumed present) purely for robustness if voice.js ever
// fails to load — ctx.speech still works, just as TTS-only, never a throw.
const voiceSource = window.GameVoice && window.GameVoice.speechSource;
const voicePlayClip = window.GameVoice && window.GameVoice.playClip;

window.CE = createGameContext({
  gameId: 'pizza-pals',
  saveVersion: 1,
  saveDefaults: SAVE_DEFAULTS,
  legacySaveKeys: ['pizzaPals.save.v1'],
  saveMigrate: migrateLegacySave,
  legacySettingsReaders: [readLegacyMuted],
  speech: {
    sources: voiceSource ? [voiceSource] : [],
    playClip: voicePlayClip,
  },
});

// Everything js/game.js needs (window.CE, and every classic script's own
// global) exists now — boot the actual game.
window.__ppStart();
