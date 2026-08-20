/**
 * round-mode.js — turns the word generator into something that can run a turn.
 *
 * Without this the tool only hands out words: no deck, no clock tied to the
 * deck, no score. A round is "N words, X seconds each" — the way charades is
 * actually played, where the clock belongs to the word rather than to the
 * whole set. A guess or a pass ends the word immediately and resets the
 * clock, so a fast team simply gets through the deck sooner.
 *
 * The module injects its own markup, so a page opts in with one script tag.
 * It drives the page's existing generator through window.nextWord(), which
 * means every category, difficulty and sub-filter already on the page keeps
 * working untouched.
 *
 * Requires, on the page: #difficulty-filters, .game-card-inner, #word-display
 * and .next-word-btn. Those are shared by every tool page on the site.
 */
(function () {
  'use strict';

  // Charades is acted, not described, so a word needs far longer than in a
  // talking game: 60 seconds is the usual party pace, two minutes the classic
  // rule. Ten words at a minute each is about one pass around five players.
  var COUNTS = [5, 10, 20];
  var SECONDS = [60, 90, 120];
  var DEFAULT_COUNT = 10;
  var DEFAULT_SECONDS = 60;

  var state = {
    running: false,
    count: DEFAULT_COUNT,
    seconds: DEFAULT_SECONDS,
    index: 0,          // words dealt so far
    got: 0,
    left: 0,           // seconds on the current word
    tick: null,
    log: [],           // [{ word, got }] for the summary
  };

  var el = {};

  function $(id) { return document.getElementById(id); }

  // ── markup ───────────────────────────────────────────────────────────
  function chipRow(name, values, active, suffix) {
    return values.map(function (v) {
      return '<button type="button" class="rm-chip' + (v === active ? ' on' : '') +
        '" data-' + name + '="' + v + '">' + (suffix ? suffix(v) : v) + '</button>';
    }).join('');
  }

  function injectStyles() {
    var css = document.createElement('style');
    css.textContent = [
      '.rm-setup{max-width:42rem;margin:0 auto 1.25rem;background:#fff;border:1px solid #e5e7eb;',
      'border-radius:1rem;padding:.9rem 1rem;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
      '.rm-row{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;margin-bottom:.5rem}',
      '.rm-row:last-of-type{margin-bottom:0}',
      '.rm-label{font-size:.8rem;font-weight:600;color:#6b7280;min-width:6.5rem}',
      '.rm-chip{border:1px solid #d1d5db;background:#fff;color:#374151;padding:.3rem .7rem;',
      'border-radius:9999px;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .15s}',
      '.rm-chip:hover{border-color:#6366f1;color:#4f46e5}',
      '.rm-chip.on{background:#4f46e5;border-color:#4f46e5;color:#fff}',
      '.rm-start{width:100%;margin-top:.7rem;background:#4f46e5;color:#fff;font-weight:700;',
      'padding:.7rem;border-radius:.75rem;border:0;cursor:pointer;font-size:1rem;transition:background .15s}',
      '.rm-start:hover{background:#4338ca}',
      '.rm-hud{display:flex;justify-content:space-between;align-items:center;gap:1rem;',
      'margin-bottom:1.1rem;font-weight:700}',
      '.rm-progress{font-size:.85rem;color:#6b7280;letter-spacing:.03em}',
      '.rm-clock{font-size:1.9rem;color:#dc2626;font-variant-numeric:tabular-nums}',
      '.rm-clock.calm{color:#111827}',
      '.rm-actions{display:flex;gap:.6rem;margin-bottom:1rem}',
      '.rm-actions button{flex:1;font-weight:700;font-size:1.05rem;padding:1rem;border-radius:.75rem;',
      'border:0;cursor:pointer;color:#fff;transition:background .15s}',
      '.rm-got{background:#16a34a}.rm-got:hover{background:#15803d}',
      '.rm-pass{background:#9ca3af}.rm-pass:hover{background:#6b7280}',
      '.rm-quit{display:block;margin:0 auto;background:none;border:0;color:#9ca3af;',
      'font-size:.78rem;cursor:pointer;text-decoration:underline}',
      '.rm-result{text-align:center}',
      '.rm-score{font-size:2.6rem;font-weight:800;color:#111827;line-height:1.1}',
      '.rm-score small{display:block;font-size:.85rem;font-weight:600;color:#6b7280;margin-top:.35rem}',
      '.rm-list{margin:1rem 0;text-align:left;font-size:.85rem;max-height:11rem;overflow:auto}',
      '.rm-list div{padding:.25rem 0;border-bottom:1px solid #f3f4f6;display:flex;gap:.5rem}',
      '.rm-list span:first-child{width:1.2rem}',
      '.rm-again{width:100%;background:#4f46e5;color:#fff;font-weight:700;padding:.85rem;',
      'border-radius:.75rem;border:0;cursor:pointer;font-size:1rem}',
    ].join('');
    document.head.appendChild(css);
  }

  function injectMarkup() {
    var filters = $('difficulty-filters');
    var inner = document.querySelector('.game-card-inner');
    if (!filters || !inner) return false;

    var setup = document.createElement('div');
    setup.className = 'rm-setup';
    setup.id = 'rm-setup';
    setup.innerHTML =
      '<div class="rm-row"><span class="rm-label">Words in round</span>' +
      chipRow('count', COUNTS, DEFAULT_COUNT) + '</div>' +
      '<div class="rm-row"><span class="rm-label">Time per word</span>' +
      chipRow('seconds', SECONDS, DEFAULT_SECONDS, function (v) {
        return v === 120 ? '2 min' : v + 's';
      }) + '</div>' +
      '<button type="button" class="rm-start" id="rm-start">▶ Start a timed round</button>';
    filters.parentNode.insertBefore(setup, filters.nextSibling);

    var hud = document.createElement('div');
    hud.className = 'rm-hud';
    hud.id = 'rm-hud';
    hud.hidden = true;
    hud.innerHTML = '<span class="rm-progress" id="rm-progress"></span>' +
      '<span class="rm-clock" id="rm-clock">0:60</span>';
    inner.insertBefore(hud, inner.firstChild);

    var actions = document.createElement('div');
    actions.id = 'rm-actions';
    actions.hidden = true;
    actions.innerHTML =
      '<div class="rm-actions">' +
      '<button type="button" class="rm-got" id="rm-got">✓ Got it</button>' +
      '<button type="button" class="rm-pass" id="rm-pass">↷ Pass</button>' +
      '</div><button type="button" class="rm-quit" id="rm-quit">End round</button>';
    var nextBtn = document.querySelector('.next-word-btn');
    nextBtn.parentNode.insertBefore(actions, nextBtn);

    var result = document.createElement('div');
    result.id = 'rm-result';
    result.className = 'rm-result';
    result.hidden = true;
    inner.insertBefore(result, inner.firstChild);

    el = {
      setup: setup, hud: hud, actions: actions, result: result,
      progress: $('rm-progress'), clock: $('rm-clock'), next: nextBtn,
      word: $('word-display'),
    };
    return true;
  }

  // ── round ────────────────────────────────────────────────────────────
  function show(node, on) { if (node) node.hidden = !on; }

  function paintClock() {
    var m = Math.floor(state.left / 60), s = state.left % 60;
    el.clock.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    // Only turn red at the end, so the colour means something.
    el.clock.classList.toggle('calm', state.left > 10);
  }

  // A round is a deck, so no word should come up twice in it. The page's
  // generator only avoids repeating the word immediately before, so redraw
  // until we get one this round has not used. The attempt cap matters: when
  // the filters leave fewer words than the round is long, repeats are
  // unavoidable and the round still has to deal something.
  function dealDistinct() {
    var used = state.log.map(function (r) { return r.word; });
    for (var i = 0; i < 40; i++) {
      if (window.nextWord) window.nextWord();
      var w = (el.word.textContent || '').trim();
      if (used.indexOf(w) === -1) return;
    }
  }

  function deal() {
    if (state.index >= state.count) return finish();
    state.index++;
    dealDistinct();
    el.progress.textContent = 'WORD ' + state.index + ' OF ' + state.count;
    state.left = state.seconds;
    paintClock();
  }

  function score(got) {
    if (!state.running) return;
    state.log.push({ word: (el.word.textContent || '').trim(), got: got });
    if (got) state.got++;
    deal();
  }

  function start() {
    // The page's own free-play timer would fight this one for the display.
    if (window.stopTimer) window.stopTimer();

    state.running = true;
    state.index = 0;
    state.got = 0;
    state.log = [];

    show(el.setup, false);
    show(el.result, false);
    show(el.hud, true);
    show(el.actions, true);
    el.next.style.display = 'none';
    var timerBtn = $('timer-btn');
    if (timerBtn) timerBtn.style.display = 'none';

    deal();
    clearInterval(state.tick);
    state.tick = setInterval(function () {
      state.left--;
      if (state.left <= 0) { score(false); return; }   // ran out: counts as a miss
      paintClock();
    }, 1000);

    document.querySelector('.game-card-inner')
      .scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function finish() {
    clearInterval(state.tick);
    state.running = false;

    show(el.hud, false);
    show(el.actions, false);

    var total = state.log.length;
    el.result.innerHTML =
      '<div class="rm-score">' + state.got + ' / ' + total +
      '<small>' + (total ? 'guessed in this round' : 'round ended early') + '</small></div>' +
      (total ? '<div class="rm-list">' + state.log.map(function (r) {
        return '<div><span>' + (r.got ? '✓' : '·') + '</span><span>' +
          r.word.replace(/[<>&]/g, '') + '</span></div>';
      }).join('') + '</div>' : '') +
      '<button type="button" class="rm-again" id="rm-again">Play another round</button>';
    show(el.result, true);
    el.word.style.display = 'none';

    $('rm-again').addEventListener('click', reset);
  }

  function reset() {
    show(el.result, false);
    el.word.style.display = '';
    el.next.style.display = '';
    var timerBtn = $('timer-btn');
    if (timerBtn) timerBtn.style.display = '';
    show(el.setup, true);
  }

  function quit() {
    // Ending early scores only the words actually played.
    state.count = state.index;
    finish();
  }

  // ── wire up ──────────────────────────────────────────────────────────
  function pick(attr, key, values) {
    el.setup.addEventListener('click', function (e) {
      var b = e.target.closest('[data-' + attr + ']');
      if (!b) return;
      var v = Number(b.dataset[attr]);
      if (values.indexOf(v) === -1) return;
      state[key] = v;
      el.setup.querySelectorAll('[data-' + attr + ']').forEach(function (o) {
        o.classList.toggle('on', o === b);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!injectMarkup()) return;
    injectStyles();
    pick('count', 'count', COUNTS);
    pick('seconds', 'seconds', SECONDS);
    $('rm-start').addEventListener('click', start);
    $('rm-got').addEventListener('click', function () { score(true); });
    $('rm-pass').addEventListener('click', function () { score(false); });
    $('rm-quit').addEventListener('click', quit);
  });
})();
