/**
 * round-mode.js — timer, words and score: the actual game, not just a word.
 *
 * A round is "N words, X seconds each". The clock belongs to the word rather
 * than to the whole set, which is how charades is really played — acting is
 * far slower than describing, so one clock across ten words would never be
 * finished. A guess or a pass ends the word at once and resets the clock, so
 * a quick team simply reaches the end of the deck sooner.
 *
 * Everything lives inside the existing game card. There is no second panel to
 * show and hide: during a round the card's own buttons change what they say
 * and what they do — Next Word becomes Got it, Skip becomes Pass — so the
 * layout never shifts and nothing new appears above the fold.
 *
 * The module injects its own markup and drives the page's generator through
 * window.nextWord(), so a page opts in with one script tag and keeps every
 * category, difficulty and sub-filter it already had.
 *
 * Requires, on the page: .game-card-inner, #word-display, .next-word-btn and
 * #skip-btn. Those are shared by every tool page on the site.
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
      // display:none must beat any utility class the element carries
      '.rm-hide{display:none !important}',
      // width is stated rather than left to the block default: measured
      // repeatedly, the row came out 197px on some loads and 322px on others,
      // and an unpredictable button size is not something to ship
      '.rm-mainrow{display:flex;gap:.5rem;width:100%}',
      '.rm-mainrow>*{flex:1 1 0;min-width:0;width:auto}',
      '.rm-passbig{background:#9ca3af !important}',
      '.rm-passbig:hover{background:#6b7280 !important}',
      // one row, so the settings cost a line rather than a block
      '.rm-setup{border-top:1px solid #f3f4f6;margin-top:.7rem;padding-top:.65rem}',
      '.rm-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.3rem}',
      '.rm-label{font-size:.68rem;font-weight:700;color:#9ca3af;letter-spacing:.05em;',
      'text-transform:uppercase;margin:0 .1rem 0 .35rem}',
      '.rm-row .rm-label:first-child{margin-left:0}',
      '.rm-chip{border:1px solid #d1d5db;background:#fff;color:#374151;padding:.2rem .55rem;',
      'border-radius:9999px;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .15s}',
      '.rm-chip:hover{border-color:#6366f1;color:#4f46e5}',
      '.rm-chip.on{background:#4f46e5;border-color:#4f46e5;color:#fff}',
      '.rm-start{width:100%;margin-top:.5rem;background:#4f46e5;color:#fff;font-weight:700;',
      'padding:.6rem;border-radius:.6rem;border:0;cursor:pointer;font-size:.92rem;transition:background .15s}',
      '.rm-start:hover{background:#4338ca}',
      '.rm-hud{display:flex;justify-content:space-between;align-items:center;gap:1rem;',
      'margin-bottom:1.1rem;font-weight:700}',
      '.rm-progress{font-size:.85rem;color:#6b7280;letter-spacing:.03em}',
      '.rm-clock{font-size:1.9rem;color:#dc2626;font-variant-numeric:tabular-nums}',
      '.rm-clock.calm{color:#111827}',
      '.rm-end{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}',
      '.rm-end:hover{background:#fee2e2}',
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
    var inner = document.querySelector('.game-card-inner');
    var nextBtn = document.querySelector('.next-word-btn');
    var skipBtn = $('skip-btn');
    if (!inner || !nextBtn || !skipBtn) return false;

    // Settings live at the foot of the card, under the buttons they belong to,
    // rather than in a panel of their own above it.
    var setup = document.createElement('div');
    setup.className = 'rm-setup';
    setup.id = 'rm-setup';
    setup.innerHTML =
      '<div class="rm-row"><span class="rm-label">Words</span>' +
      chipRow('count', COUNTS, DEFAULT_COUNT) +
      '<span class="rm-label">Each</span>' +
      chipRow('seconds', SECONDS, DEFAULT_SECONDS, function (v) {
        return v === 120 ? '2m' : v + 's';
      }) + '</div>' +
      '<button type="button" class="rm-start" id="rm-start">▶ Start timed round</button>';
    inner.appendChild(setup);

    var hud = document.createElement('div');
    hud.className = 'rm-hud';
    hud.id = 'rm-hud';
    hud.classList.add('rm-hide');
    hud.innerHTML = '<span class="rm-progress" id="rm-progress"></span>' +
      '<span class="rm-clock" id="rm-clock">1:00</span>';
    inner.insertBefore(hud, inner.firstChild);

    var result = document.createElement('div');
    result.id = 'rm-result';
    result.className = 'rm-result';
    result.classList.add('rm-hide');
    inner.insertBefore(result, inner.firstChild);

    // Got it and Pass are the two choices for the same decision, so they get
    // the same weight: the main button halves and Pass takes the other half,
    // both at full size. The small Skip in the row below stands down while a
    // round runs, since Pass is doing its job.
    var mainRow = document.createElement('div');
    mainRow.className = 'rm-mainrow';
    nextBtn.parentNode.insertBefore(mainRow, nextBtn);
    mainRow.appendChild(nextBtn);

    var passBtn = document.createElement('button');
    passBtn.type = 'button';
    passBtn.id = 'rm-pass';
    passBtn.className = nextBtn.className + ' rm-passbig rm-hide';
    passBtn.textContent = '↷ Pass';
    mainRow.appendChild(passBtn);

    // Ending a round needs a control of its own, so it borrows the shape of
    // the buttons beside it and sits in the same row.
    var endBtn = document.createElement('button');
    endBtn.type = 'button';
    endBtn.id = 'rm-end';
    endBtn.className = skipBtn.className + ' rm-end';
    endBtn.textContent = '⏹ End round';
    endBtn.classList.add('rm-hide');
    skipBtn.parentNode.appendChild(endBtn);

    el = {
      setup: setup, hud: hud, result: result, end: endBtn, pass: passBtn,
      progress: $('rm-progress'), clock: $('rm-clock'),
      next: nextBtn, skip: skipBtn, word: $('word-display'),
      nextLabel: nextBtn.innerHTML,
    };
    return true;
  }

  // ── round ────────────────────────────────────────────────────────────
  // Not the hidden attribute: Tailwind's preflight styles it as
  // [hidden]:where(...) { display: none }, which :where() gives zero
  // specificity, so any display utility on the element — .flex on a button
  // that borrowed another button's classes — ties on specificity and wins on
  // source order. The End round button stayed on screen from page load
  // because of exactly that. An explicit class settles it.
  function show(node, on) { if (node) node.classList.toggle('rm-hide', !on); }

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

  // During a round the card's own buttons take over. Repointing onclick
  // overrides the inline handlers the pages carry, and the original labels
  // were captured at injection time so leaving a round restores them exactly.
  function setRoundControls(on) {
    show(el.setup, !on);
    show(el.hud, on);
    show(el.end, on);
    show(el.pass, on);
    show(el.skip, !on);
    if (on) {
      el.next.innerHTML = '✓ Got it';
      el.next.onclick = function () { score(true); };
      el.pass.onclick = function () { score(false); };
    } else {
      el.next.innerHTML = el.nextLabel;
      el.next.onclick = function () { if (window.nextWord) window.nextWord(); };
    }
  }

  function start() {
    state.running = true;
    state.index = 0;
    state.got = 0;
    state.log = [];

    show(el.result, false);
    show(el.word, true);
    setRoundControls(true);

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
    setRoundControls(false);
    show(el.setup, false);
    show(el.next, false);
    show(el.pass, false);
    show(el.word, false);

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

    $('rm-again').addEventListener('click', reset);
  }

  function reset() {
    show(el.result, false);
    show(el.word, true);
    show(el.next, true);
    setRoundControls(false);
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
    el.end.addEventListener('click', quit);
  });
})();
