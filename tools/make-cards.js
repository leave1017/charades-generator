/**
 * make-cards.js — build printable charades card PDFs from the site's word data.
 *
 *   node tools/make-cards.js --pack sample --out downloads/charades-cards-sample.pdf
 *
 * Layout: 3x3 flush grid on A4 (or US Letter with --paper letter), so every cut
 * is a straight line right across the sheet. One instructions page up front.
 */
const fs = require('fs');
const path = require('path');
// Playwright is a dev-time dependency only: `npm i -D playwright`, or set
// PLAYWRIGHT_PATH / CHROMIUM_PATH if it lives outside this project.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const ROOT = path.resolve(__dirname, '..');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : fallback;
}

// ── data ──────────────────────────────────────────────────────────────
function loadWords(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  return new Function(src + '; return ' + varName + ';')();
}

const ALL = loadWords('charades-words.js', 'CHARADES_WORDS');

const PACKS = {
  // Small proof-of-design set: broad categories, even difficulty spread.
  sample: {
    title: 'Printable Charades Cards',
    subtitle: 'Free sample pack',
    pick: () => {
      const want = {
        easy:   ['actions', 'animals', 'objects', 'food', 'sports', 'kids'],
        medium: ['actions', 'movies', 'objects', 'food', 'sports', 'famous'],
        hard:   ['actions', 'movies', 'objects', 'famous', 'tvshows', 'adults'],
      };
      const out = [];
      for (const [diff, cats] of Object.entries(want)) {
        for (const cat of cats) {
          const pool = ALL.filter(w => w.difficulty === diff && w.category === cat &&
                                       !out.includes(w) && w.word.length <= 22);
          if (pool.length) out.push(pool[Math.floor(pool.length / 2)]);
        }
      }
      return out;
    },
  },
};

const PAPER = {
  // contentH = paper height - 2 x 10mm margin; paged media has no percentage
  // height to resolve against, so the grid needs a real number.
  a4:     { format: 'A4',     label: 'A4',        contentH: 277, contentW: 190 },
  letter: { format: 'Letter', label: 'US Letter', contentH: 259, contentW: 196 },
};

const DIFF = {
  easy:   { label: 'Easy',   color: '#15803d' },
  medium: { label: 'Medium', color: '#b45309' },
  hard:   { label: 'Hard',   color: '#b91c1c' },
};

const CAT_LABEL = {
  actions: 'Action', animals: 'Animal', objects: 'Object', food: 'Food & Drink',
  sports: 'Sport', kids: 'For Kids', movies: 'Movie', famous: 'Famous Person',
  tvshows: 'TV Show', adults: 'Everyday Life', christmas: 'Christmas',
  halloween: 'Halloween',
};

// ── html ──────────────────────────────────────────────────────────────
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Pick the largest point size at which no single word overflows the card and
// the phrase still wraps to at most two lines. Guarantees we never break a
// word mid-way, which looked broken on "Skateboarding".
const CARD_TEXT_PT = 161;      // 57mm of usable width inside a 63mm card
const CHAR_W = 0.63;           // approx advance width of DejaVu Sans Bold, in em

function fitSize(phrase, maxLines = 2) {
  const tokens = phrase.split(/\s+/);
  const longest = Math.max(...tokens.map(t => t.length));
  for (let size = 30; size >= 12; size--) {
    const perLine = CARD_TEXT_PT / (size * CHAR_W);
    if (longest > perLine) continue;
    let lines = 1, cur = 0;
    for (const t of tokens) {
      const grown = cur ? cur + 1 + t.length : t.length;
      if (grown <= perLine) cur = grown;
      else { lines++; cur = t.length; }
    }
    if (lines <= maxLines) return size;
  }
  return 12;
}

function cardHTML(w) {
  return `
      <div class="card">
        <div class="cat">${esc(CAT_LABEL[w.category] || w.category)}</div>
        <div class="word" style="font-size:${fitSize(w.word)}pt"><span>${esc(w.word)}</span></div>
        <div class="foot">
          <span class="pip"><i style="background:${DIFF[w.difficulty].color}"></i>${DIFF[w.difficulty].label}</span>
          <span class="src">charades-generator.org</span>
        </div>
      </div>`;
}

function pagesHTML(words) {
  const per = 9;
  let out = '';
  for (let i = 0; i < words.length; i += per) {
    const slice = words.slice(i, i + per);
    const blanks = per - slice.length;
    out += `\n  <section class="sheet cards">\n    <div class="grid">` +
      slice.map(cardHTML).join('') +
      '<div class="card empty"></div>'.repeat(blanks) +
      `\n    </div>\n  </section>`;
  }
  return out;
}

function instructionsHTML(pack, count, paperLabel) {
  return `
  <section class="sheet intro">
    <header>
      <h1>${esc(pack.title)}</h1>
      <p class="sub">${esc(pack.subtitle)} &middot; ${count} cards &middot; ${paperLabel}</p>
    </header>

    <div class="cols">
      <div>
        <h2>How to play</h2>
        <ol>
          <li>Print at <strong>100% scale</strong> — turn off &ldquo;fit to page&rdquo; — then cut along the dashed lines. Use <strong>160gsm card stock or heavier</strong>: on ordinary copy paper the word shows through from the back and the other team can read it.</li>
          <li>Split into two teams and put the cards face down in a bowl.</li>
          <li>One player draws a card and acts out the word — <strong>no talking, no sounds, no pointing at letters</strong>.</li>
          <li>Their team guesses for up to two minutes. A correct guess scores a point; then the turn passes.</li>
          <li>First team to ten points wins.</li>
        </ol>

        <h2>Difficulty</h2>
        <p class="legend">
          <span><i style="background:${DIFF.easy.color}"></i>Easy — one clear gesture, good for children</span>
          <span><i style="background:${DIFF.medium.color}"></i>Medium — needs a short scene</span>
          <span><i style="background:${DIFF.hard.color}"></i>Hard — abstract or multi-part, for adults</span>
        </p>
        <p class="note">Deal by difficulty to balance a mixed-age table: children draw from the Easy pile, adults from Hard.</p>
      </div>

      <div>
        <h2>Standard signals</h2>
        <table>
          <tr><td>Film</td><td>Crank an old film camera</td></tr>
          <tr><td>Book</td><td>Open your palms like a book</td></tr>
          <tr><td>Song</td><td>Mime singing into a microphone</td></tr>
          <tr><td>TV show</td><td>Draw a rectangle in the air</td></tr>
          <tr><td>Number of words</td><td>Hold up that many fingers</td></tr>
          <tr><td>Which word</td><td>Hold up fingers again, then act it</td></tr>
          <tr><td>Number of syllables</td><td>Fingers laid on your forearm</td></tr>
          <tr><td>Sounds like</td><td>Cup a hand behind your ear</td></tr>
          <tr><td>Close — keep going</td><td>Wave both hands towards yourself</td></tr>
          <tr><td>Correct</td><td>Point at the person who guessed it</td></tr>
        </table>

        <h2>Score sheet</h2>
        <table class="score">
          <tr><th>Round</th><th>Team A</th><th>Team B</th></tr>
          ${'<tr><td>&nbsp;</td><td></td><td></td></tr>'.repeat(6)}
          <tr class="total"><th>Total</th><td></td><td></td></tr>
        </table>
      </div>
    </div>

    <h2 class="wide">Four ways to play</h2>
    <div class="formats">
      <div><strong>Family game night</strong><span>Two teams, two minutes a turn, first to ten points. About 40 minutes.</span></div>
      <div><strong>With young children</strong><span>No teams, no score, no timer. Each child takes a turn on Easy while the adults guess.</span></div>
      <div><strong>Party or office</strong><span>Teams of four or five, one minute a turn. Short turns keep a big room moving.</span></div>
      <div><strong>Mixed ages</strong><span>Use the difficulty as a handicap: children draw Easy, teenagers Medium, adults Hard.</span></div>
    </div>

    <footer>Free printable charades cards from <strong>charades-generator.org</strong> — play online or print more sets.</footer>
  </section>`;
}

// Chromium's A4 page is 209.89mm wide, not 210, so a 10mm margin leaves
// 189.89mm of content while the layout rounds borders to the 190mm edge. Any
// element whose right edge lands there has its border clipped to a sliver that
// does not survive printing — it took out the last column's cut line and the
// score table's right rule. Inset everything by 1mm and nothing sits on the
// boundary.
const SAFE = 1;

function documentHTML(pack, words, paper) {
  const sheetW = paper.contentW - SAFE;
  const sheetH = paper.contentH - SAFE;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<style>
  @page { size: ${paper.format}; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; color: #111; }
  .sheet { page-break-after: always; width: ${sheetW}mm; height: ${sheetH}mm; margin: 0 auto; overflow: hidden; }
  .sheet:last-child { page-break-after: auto; }

  /* ── cards ── */
  .grid {
    /* minmax(0, 1fr) not 1fr: a bare 1fr is minmax(auto, 1fr), so a long word
       inflates its column and squashes the others. That shipped 59/59/70mm
       columns instead of three equal 63mm cards. */
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    height: ${sheetH}mm; border: 0.4mm dashed #9ca3af;
  }
  .card {
    border-right: 0.4mm dashed #9ca3af; border-bottom: 0.4mm dashed #9ca3af;
    padding: 4mm 3mm; display: flex; flex-direction: column; text-align: center;
  }
  .grid > .card:nth-child(3n) { border-right: none; }
  .grid > .card:nth-child(n+7) { border-bottom: none; }
  .card.empty { }

  .cat {
    font-size: 7.5pt; letter-spacing: 0.12em; text-transform: uppercase;
    color: #6b7280; font-weight: bold;
  }
  .word {
    flex: 1; display: flex; align-items: center; justify-content: center;
    font-weight: bold; line-height: 1.15; hyphens: none; overflow-wrap: normal;
    min-width: 0; min-height: 0;
  }
  .word span { display: block; text-align: center; }

  .foot { display: flex; justify-content: space-between; align-items: center; font-size: 6.5pt; color: #6b7280; }
  .pip { display: flex; align-items: center; gap: 1mm; font-weight: bold; }
  .pip i { width: 2mm; height: 2mm; border-radius: 50%; display: inline-block; }
  .src { color: #9ca3af; }

  /* ── instructions ── */
  .intro { display: flex; flex-direction: column; }
  .intro header { border-bottom: 0.6mm solid #111; padding-bottom: 3mm; margin-bottom: 6mm; }
  .intro h1 { font-family: 'Bitstream Charter', 'Liberation Serif', serif; font-size: 26pt; letter-spacing: -0.01em; }
  .intro .sub { font-size: 9pt; color: #6b7280; margin-top: 1.5mm; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; }
  .intro h2 {
    font-family: 'Bitstream Charter', 'Liberation Serif', serif;
    font-size: 12.5pt; margin: 0 0 2.5mm; padding-bottom: 1mm; border-bottom: 0.3mm solid #d1d5db;
  }
  .intro h2 + * { margin-bottom: 6mm; }
  .intro ol { padding-left: 5mm; font-size: 9pt; line-height: 1.5; }
  .intro ol li { margin-bottom: 1.5mm; }
  .legend { font-size: 9pt; line-height: 1.6; display: flex; flex-direction: column; gap: 0.5mm; }
  .legend i { width: 2.4mm; height: 2.4mm; border-radius: 50%; display: inline-block; margin-right: 2mm; }
  .note { font-size: 8.5pt; color: #4b5563; font-style: italic; margin-top: 2mm; }
  .intro table { width: 100%; border-collapse: collapse; font-size: 8.5pt; }
  .intro table td { padding: 1.2mm 0; border-bottom: 0.2mm solid #e5e7eb; vertical-align: top; }
  .intro table td:first-child { font-weight: bold; width: 42%; padding-right: 3mm; }
  .score th, .score td { border: 0.2mm solid #9ca3af; padding: 1.8mm; text-align: center; }
  .score th { background: #f3f4f6; font-size: 8pt; }
  .score .total th, .score .total td { background: #f3f4f6; }
  .intro h2.wide { margin-top: 7mm; }
  .formats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 3mm 8mm; font-size: 8.5pt; }
  .formats div { display: flex; flex-direction: column; gap: 0.8mm; }
  .formats strong { font-size: 9pt; }
  .formats span { color: #4b5563; line-height: 1.4; }
  .intro footer { margin-top: auto; padding-top: 6mm; padding-top: 3mm; border-top: 0.3mm solid #d1d5db; font-size: 8pt; color: #6b7280; text-align: center; }
</style></head><body>
${instructionsHTML(pack, words.length, paper.label)}
${pagesHTML(words)}
</body></html>`;
}

// ── run ───────────────────────────────────────────────────────────────
(async () => {
  const packName = arg('pack', 'sample');
  const paperKey = arg('paper', 'a4');
  const out = arg('out', `downloads/charades-cards-${packName}-${paperKey}.pdf`);

  const pack = PACKS[packName];
  if (!pack) throw new Error('unknown pack: ' + packName);
  const paper = PAPER[paperKey];
  if (!paper) throw new Error('unknown paper: ' + paperKey);

  const words = pack.pick();
  const html = documentHTML(pack, words, paper);

  const htmlPath = path.join('/tmp', `cards-${packName}-${paperKey}.html`);
  fs.writeFileSync(htmlPath, html);

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });

  // fitSize() only estimates from an assumed character width, and it was
  // optimistic enough to let words push past the card edge. Ask the laid-out
  // page instead and step each word down until it genuinely fits its box.
  const shrunk = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('.word')) {
      const span = el.firstElementChild;
      const fits = () => span.scrollWidth <= el.clientWidth + 0.5 &&
                         span.scrollHeight <= el.clientHeight + 0.5;
      let pt = parseFloat(el.style.fontSize);
      const from = pt;
      while (!fits() && pt > 8) { pt -= 0.5; el.style.fontSize = pt + 'pt'; }
      if (pt !== from) out.push(`${span.textContent}: ${from} -> ${pt}pt`);
    }
    return out;
  });
  if (shrunk.length) console.log('  refit: ' + shrunk.join(', '));
  const outPath = path.join(ROOT, out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  // preferCSSPageSize hands page size and margins entirely to the CSS @page
  // rule. Passing format/margin here as well made Chromium lay the content out
  // at 210mm, add 10mm margins on top, then scale the lot down to fit the
  // sheet — every dimension came out at 91.4% of what it should be.
  await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });
  await browser.close();

  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`${out}  ${words.length} cards, ${Math.ceil(words.length / 9) + 1} pages, ${kb} KB`);
  console.log('words:', words.map(w => `${w.word}(${w.difficulty})`).join(', '));
})();
