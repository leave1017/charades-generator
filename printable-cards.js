/**
 * printable-cards.js — the card builder behind /printable-charades-cards/.
 *
 * Renders real sheets into #print-area at true millimetre size, shows them on
 * screen inside a scaled preview, and hands them to the browser's own print
 * dialog. The layout comes from print-cards.css, which tools/make-cards.js
 * also uses, so a set printed here cuts to the same size as a downloaded pack.
 */
(function () {
  'use strict';

  // Safari does not apply the @page margin below. iOS gives no margin control
  // at all and prints with the engine's own ~12.7mm, so the page area is
  // smaller than the one the sheet is sized for: a 276mm sheet overflowed by
  // about 4mm and the last row of cards was pushed onto a sheet of its own,
  // turning an 18-card set into four pages.
  //
  // The sheet cannot simply be sized as a percentage of the page — Safari
  // resolves that against something much smaller and the grid collapsed to a
  // fraction of the sheet. So the two engines get two fixed sizes instead.
  // Chromium, where the 63 x 92mm card was measured off real paper and where
  // the paid packs are rendered, is left exactly as it was.
  var ua = navigator.userAgent;
  var WEBKIT =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua));

  var PAPER = {
    // sheet = printable box minus 1mm, so no border sits on the page edge
    // where the renderer clips it away. See print-cards.css.
    //   w/h    the page's own 10mm margin, honoured by Chromium
    //   ww/wh  WebKit's larger margin, which it applies whatever we ask for
    a4: {
      css: 'A4', label: 'A4',
      w: 189, h: 276, card: '63 × 92 mm',
      ww: 183, wh: 270, wcard: '61 × 90 mm',
    },
    letter: {
      css: 'Letter', label: 'US Letter',
      w: 195, h: 258, card: '65 × 86 mm',
      ww: 189, wh: 253, wcard: '63 × 84 mm',
    },
  };

  // Everything downstream asks for .w/.h/.card, so resolve it once here
  // rather than branching at each of the four places that read it.
  function paperOf(id) {
    var p = PAPER[id];
    return WEBKIT ? { css: p.css, label: p.label, w: p.ww, h: p.wh, card: p.wcard } : p;
  }

  var DIFF = {
    easy:   { label: 'Easy',   color: '#15803d' },
    medium: { label: 'Medium', color: '#b45309' },
    hard:   { label: 'Hard',   color: '#b91c1c' },
  };

  var CATS = [
    { id: 'animals',   label: 'Animals' },
    { id: 'movies',    label: 'Movies' },
    { id: 'tvshows',   label: 'TV Shows' },
    { id: 'famous',    label: 'Famous People' },
    { id: 'actions',   label: 'Actions' },
    { id: 'objects',   label: 'Objects' },
    { id: 'food',      label: 'Food & Drink' },
    { id: 'sports',    label: 'Sports' },
    { id: 'kids',      label: 'For Kids' },
    { id: 'adults',    label: 'Everyday Life' },
    { id: 'christmas', label: 'Christmas' },
    { id: 'halloween', label: 'Halloween' },
  ];
  var LABEL = {};
  CATS.forEach(function (c) { LABEL[c.id] = c.label; });

  var PER_SHEET = 9;

  var words = typeof CHARADES_WORDS !== 'undefined' ? CHARADES_WORDS : [];

  var state = {
    cats: CATS.map(function (c) { return c.id; }),
    diff: 'all',
    count: 18,
    paper: 'a4',
  };

  var area = document.getElementById('print-area');
  var frame = document.getElementById('preview-frame');
  var status = document.getElementById('status');
  var sheetNote = document.getElementById('sheet-note');
  var pageRule = document.createElement('style');
  document.head.appendChild(pageRule);

  // ── word selection ───────────────────────────────────────────────────
  function pool() {
    return words.filter(function (w) {
      return state.cats.indexOf(w.category) > -1 &&
             (state.diff === 'all' || w.difficulty === state.diff);
    });
  }

  function draw() {
    var p = pool().slice();
    for (var i = p.length - 1; i > 0; i--) {           // Fisher-Yates
      var j = Math.floor(Math.random() * (i + 1));
      var t = p[i]; p[i] = p[j]; p[j] = t;
    }
    return p.slice(0, state.count);
  }

  // ── layout ───────────────────────────────────────────────────────────
  // A first guess at the type size, so the measured pass below only has to
  // nudge rather than walk down from 30pt on every card.
  var TEXT_PT = 161;      // usable width inside a card, in points
  var CHAR_W = 0.63;      // rough advance width of the bold face, in em

  function guessSize(phrase) {
    var tokens = phrase.split(/\s+/);
    var longest = 0;
    tokens.forEach(function (t) { longest = Math.max(longest, t.length); });
    for (var size = 30; size >= 12; size--) {
      var perLine = TEXT_PT / (size * CHAR_W);
      if (longest > perLine) continue;
      var lines = 1, cur = 0;
      for (var i = 0; i < tokens.length; i++) {
        var grown = cur ? cur + 1 + tokens[i].length : tokens[i].length;
        if (grown <= perLine) cur = grown;
        else { lines++; cur = tokens[i].length; }
      }
      if (lines <= 2) return size;
    }
    return 12;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function cardHTML(w) {
    var d = DIFF[w.difficulty] || DIFF.easy;
    return '<div class="pc-card">' +
      '<div class="pc-cat">' + esc(LABEL[w.category] || w.category) + '</div>' +
      '<div class="pc-word" style="font-size:' + guessSize(w.word) + 'pt"><span>' +
        esc(w.word) + '</span></div>' +
      '<div class="pc-foot">' +
        '<span class="pc-pip"><i style="background:' + d.color + '"></i>' + d.label + '</span>' +
        '<span class="pc-src">charades-generator.org</span>' +
      '</div></div>';
  }

  function render(list) {
    var paper = paperOf(state.paper);
    area.style.setProperty('--sheet-w', paper.w + 'mm');
    area.style.setProperty('--sheet-h', paper.h + 'mm');
    pageRule.textContent = '@page { size: ' + paper.css + '; margin: 10mm; }';

    var html = '';
    for (var i = 0; i < list.length; i += PER_SHEET) {
      var slice = list.slice(i, i + PER_SHEET);
      html += '<section class="pc-sheet"><div class="pc-grid">';
      slice.forEach(function (w) { html += cardHTML(w); });
      for (var b = slice.length; b < PER_SHEET; b++) html += '<div class="pc-card"></div>';
      html += '</div></section>';
    }
    area.innerHTML = html;

    fitType();
    scalePreview();
  }

  // The guess above assumes a character width, and an assumed width is wrong
  // for some words — it let "Metronome" run past the card edge in the PDF
  // tool. Measure the laid-out box instead and step down until it truly fits.
  // Transforms do not affect scrollWidth/clientWidth, so the scaled preview
  // does not disturb this.
  function fitType() {
    var els = area.querySelectorAll('.pc-word');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], span = el.firstElementChild;
      if (!span) continue;
      var pt = parseFloat(el.style.fontSize);
      while (pt > 8 &&
             (span.scrollWidth > el.clientWidth + 0.5 ||
              span.scrollHeight > el.clientHeight + 0.5)) {
        pt -= 0.5;
        el.style.fontSize = pt + 'pt';
      }
    }
  }

  // mm are device-independent in CSS, so this converts at the fixed 96dpi
  // reference the browser uses for layout — not the printer's resolution.
  function mmToPx(mm) { return mm * 96 / 25.4; }

  function scalePreview() {
    var paper = paperOf(state.paper);
    var avail = frame.clientWidth;
    if (!avail) return;
    var scale = Math.min(1, avail / mmToPx(paper.w));
    area.style.transform = 'scale(' + scale + ')';
    var sheets = area.children.length;
    var gap = 6;                                   // the mm gap between sheets
    var total = sheets * paper.h + Math.max(0, sheets - 1) * gap;
    frame.style.height = mmToPx(total) * scale + 'px';
  }

  // ── controls ─────────────────────────────────────────────────────────
  function buildCatOptions() {
    var box = document.getElementById('cat-opts');
    box.innerHTML = CATS.map(function (c) {
      var n = words.filter(function (w) { return w.category === c.id; }).length;
      return '<button class="opt on" data-cat="' + c.id + '">' + c.label +
             ' <span class="opt-n">' + n + '</span></button>';
    }).join('');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      var id = b.dataset.cat, at = state.cats.indexOf(id);
      if (at > -1) state.cats.splice(at, 1); else state.cats.push(id);
      b.classList.toggle('on', at === -1);
      refresh();
    });
  }

  function pickGroup(id, key, cast) {
    var box = document.getElementById(id);
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-' + key + ']');
      if (!b) return;
      Array.prototype.forEach.call(box.children, function (c) { c.classList.remove('on'); });
      b.classList.add('on');
      state[key] = cast ? cast(b.dataset[key]) : b.dataset[key];
      refresh();
    });
  }

  function setAll(on) {
    state.cats = on ? CATS.map(function (c) { return c.id; }) : [];
    Array.prototype.forEach.call(
      document.getElementById('cat-opts').children,
      function (b) { b.classList.toggle('on', on); });
    refresh();
  }

  function refresh() {
    var available = pool().length;
    var paper = paperOf(state.paper);

    if (available === 0) {
      area.innerHTML = '';
      frame.style.height = '0px';
      status.innerHTML = '<span class="text-red-600">Pick at least one category to build a set.</span>';
      sheetNote.textContent = '';
      document.getElementById('print-btn').disabled = true;
      document.getElementById('print-btn').classList.add('opacity-50', 'cursor-not-allowed');
      return;
    }

    document.getElementById('print-btn').disabled = false;
    document.getElementById('print-btn').classList.remove('opacity-50', 'cursor-not-allowed');

    var n = Math.min(state.count, available);
    var sheets = Math.ceil(n / PER_SHEET);
    status.textContent = n + ' cards from ' + available + ' available' +
      (n < state.count ? ' — that is every word matching your filters' : '') + '.';
    sheetNote.textContent = sheets + (sheets === 1 ? ' sheet' : ' sheets') +
      ' · ' + paper.label + ' · cards ' + paper.card;

    render(draw());
  }

  // ── go ───────────────────────────────────────────────────────────────
  buildCatOptions();
  pickGroup('diff-opts', 'diff');
  pickGroup('count-opts', 'count', Number);
  pickGroup('paper-opts', 'paper');
  document.getElementById('cat-all').addEventListener('click', function () { setAll(true); });
  document.getElementById('cat-none').addEventListener('click', function () { setAll(false); });
  document.getElementById('shuffle-btn').addEventListener('click', refresh);
  document.getElementById('print-btn').addEventListener('click', function () { window.print(); });
  window.addEventListener('resize', scalePreview);

  refresh();
})();
