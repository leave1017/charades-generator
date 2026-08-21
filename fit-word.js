/**
 * fit-word.js — keep the word inside a fixed box.
 *
 * The word display used to be sized by its contents, so a long phrase wrapped
 * to a second line and the whole card grew by about 40px. That moved the
 * buttons under the player's thumb mid-round, and it made "does the tool fit
 * on the first screen" depend on which word came up. The box is a fixed height
 * in CSS; this scales the type to fit it.
 *
 * All measuring happens on a separate off-screen probe whose font size never
 * changes — only its text does. Earlier versions set a size on the real
 * element and measured it straight afterwards, and the rect came back
 * describing the previous size: stepping down one notch and re-reading stopped
 * early every time, and forcing a reflow in between did not help. Nothing is
 * read back from the display now. The probe is measured at a known size, the
 * result is arithmetic, and the display is written exactly once.
 *
 * A MutationObserver rather than a hook in the generators: script.js and
 * inner-game.js both write to #word-display and round-mode.js drives them.
 * Watching the element covers all of them without any needing to know.
 */
(function () {
  'use strict';

  var el = document.getElementById('word-display');
  if (!el || !window.MutationObserver) return;

  var PROBE_PX = 100;   // measure here, then scale; large enough to be precise
  var MIN = 18;
  var SAFETY = 0.96;    // sub-pixel rounding, and wraps that split unevenly
  var lastText = null;
  var probe = null;
  var baseSize = null;   // the stylesheet's size, captured before we write one

  function makeProbe() {
    var cs = getComputedStyle(el);
    // Read once, before any inline size exists. Reading it per word would
    // return the previous word's fitted size, so every long phrase would
    // ratchet the ceiling down and short words could never come back up.
    baseSize = parseFloat(cs.fontSize) || PROBE_PX;
    // line-height computes to an absolute length, so copying it straight over
    // pins the probe's line box to the display's size and it stops scaling
    // with the probe's own font: a 100px probe measured 50px tall, the height
    // constraint never bound, and long phrases were left at full size and
    // clipped. Carry it as a ratio instead.
    var ratio = parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
    if (!isFinite(ratio) || !ratio) ratio = 1.2;

    probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;' +
      'font-size:' + PROBE_PX + 'px;font-family:' + cs.fontFamily + ';' +
      'font-weight:' + cs.fontWeight + ';letter-spacing:' + cs.letterSpacing + ';' +
      'line-height:' + ratio;
    document.body.appendChild(probe);
  }

  function measure(text) {
    probe.textContent = text;
    var r = probe.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  function fit() {
    var text = el.textContent.trim();
    if (text === lastText) return;
    lastText = text;
    if (!text) return;
    if (!probe) makeProbe();

    var boxW = el.clientWidth, boxH = el.clientHeight;
    if (!boxW || !boxH) return;

    var whole = measure(text);
    if (!whole.w || !whole.h) return;

    // The longest single word cannot be broken, so it caps any layout.
    var longest = text.split(/\s+/).reduce(function (a, b) {
      return b.length > a.length ? b : a;
    }, '');
    var token = measure(longest);

    // One line: the whole phrase has to fit the width, and one line box the height.
    var one = Math.min(boxW / whole.w, boxH / whole.h);

    // Two lines: each carries roughly half the phrase, no line can be narrower
    // than the longest word, and two line boxes have to fit the height.
    var two = Math.min(boxW / (whole.w / 2), boxW / token.w, boxH / (whole.h * 2));

    // Whichever is bigger. A thirty-character phrase squeezed onto one line on
    // a phone lands near 16px and is useless from across the room; on two
    // lines it stays close to 28px.
    var scale = Math.max(one, two) * SAFETY;
    var size = Math.min(baseSize, PROBE_PX * scale);

    // whiteSpace before the size, and neither is read back.
    el.firstElementChild && (el.firstElementChild.style.whiteSpace = one >= two ? 'nowrap' : 'normal');
    // setProperty with priority: styles.css carries
    // '#word-display { font-size: 2.5rem !important }' from an earlier mobile
    // pass, and a plain inline write silently loses to it.
    el.style.setProperty('font-size', Math.max(MIN, Math.floor(size)) + 'px', 'important');
  }

  // The generators write textContent, wiping any wrapper, so it goes back on
  // every time. The display centres its text with flex, and content that
  // overflows a centred flex box spills equally above and below — so a
  // wrapper is also the only thing whose white-space can be switched.
  function wrap() {
    var span = el.firstElementChild;
    if (span && span.className === 'fw-text') return;
    var text = el.textContent;
    el.textContent = '';
    span = document.createElement('span');
    span.className = 'fw-text';
    span.textContent = text;
    el.appendChild(span);
  }

  function update() {
    wrap();
    fit();
  }

  new MutationObserver(update).observe(el, { childList: true, characterData: true, subtree: true });
  // A breakpoint change alters both the box and the stylesheet size, so the
  // probe and the captured base have to be rebuilt.
  window.addEventListener('resize', function () {
    lastText = null;
    if (probe) { probe.parentNode.removeChild(probe); probe = null; }
    el.style.removeProperty('font-size');
    update();
  });
  update();
})();
