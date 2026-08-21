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

// The card layout lives in print-cards.css so the browser generator at
// /printable-charades-cards/ and these packs cut to the same size.
const SHARED_CSS = fs.readFileSync(path.join(ROOT, 'print-cards.css'), 'utf8');

// The six Christmas themes, in the order they are dealt. Colouring the card's
// top label by theme is what makes a printed pack sortable into piles — the
// cheapest possible ink for the most useful signal.
const XMAS_THEMES = [
  { key: 'santa', label: 'Santa & Reindeer',   color: '#b91c1c' },
  { key: 'tree',  label: 'Tree & Decorations', color: '#15803d' },
  { key: 'food',  label: 'Food & Drink',       color: '#b45309' },
  { key: 'songs', label: 'Songs & Films',      color: '#6d28d9' },
  { key: 'snow',  label: 'Snow & Outdoors',    color: '#0369a1' },
  { key: 'trad',  label: 'Traditions & Gifts', color: '#a16207' },
];

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

  // The paid pack. Every Christmas word, dealt theme by theme with each theme
  // starting on a fresh sheet, so cutting a stack leaves six ready-made piles
  // rather than one shuffled heap.
  christmas: {
    title: 'Christmas Charades',
    subtitle: 'Complete pack',
    paid: true,
    cover: {
      lead: '204 cards in six themed decks',
      blurb: 'Cut them out once and they are ready every December. Rules, the ' +
             'standard hand signals and a score sheet are on the next page, and ' +
             'the clue list at the back is for whoever is running the game.',
    },
    // A theme per pile: pad each one out to a full sheet.
    pick: () => {
      const out = [];
      for (const t of XMAS_THEMES) {
        const words = ALL.filter(w => w.category === 'christmas' && w.group === t.key);
        out.push(...words);
        while (out.length % 9) out.push(null);      // finish the sheet
      }
      return out;
    },
    label: w => (XMAS_THEMES.find(t => t.key === w.group) || {}).label || 'Christmas',
    tint: w => (XMAS_THEMES.find(t => t.key === w.group) || {}).color || '#6b7280',
    hintList: true,
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

function cardHTML(w, pack) {
  if (!w) return '<div class="pc-card"></div>';       // padding to a full sheet
  const label = pack && pack.label ? pack.label(w) : (CAT_LABEL[w.category] || w.category);
  const tint = pack && pack.tint ? pack.tint(w) : '';
  return `
      <div class="pc-card">
        <div class="pc-cat"${tint ? ` style="color:${tint}"` : ''}>${esc(label)}</div>
        <div class="pc-word" style="font-size:${fitSize(w.word)}pt"><span>${esc(w.word)}</span></div>
        <div class="pc-foot">
          <span class="pc-pip"><i style="background:${DIFF[w.difficulty].color}"></i>${DIFF[w.difficulty].label}</span>
          <span class="pc-src">charades-generator.org</span>
        </div>
      </div>`;
}

function pagesHTML(words, pack) {
  const per = 9;
  let out = '';
  for (let i = 0; i < words.length; i += per) {
    const slice = words.slice(i, i + per);
    while (slice.length < per) slice.push(null);
    out += `\n  <section class="pc-sheet">\n    <div class="pc-grid">` +
      slice.map(w => cardHTML(w, pack)).join('') +
      `\n    </div>\n  </section>`;
  }
  return out;
}

// A cover exists so the pack looks like a product when it lands in a
// downloads folder, and so the buyer can see what they have at a glance.
function coverHTML(pack, count, paperLabel) {
  const themes = XMAS_THEMES.map(t =>
    `<li><i style="background:${t.color}"></i>${esc(t.label)}</li>`).join('');
  return `
  <section class="pc-sheet cover">
    <div class="cover-inner">
      <p class="cover-kicker">Printable charades cards</p>
      <h1>${esc(pack.title)}</h1>
      <p class="cover-lead">${esc(pack.cover.lead)}</p>
      <ul class="cover-themes">${themes}</ul>
      <p class="cover-blurb">${esc(pack.cover.blurb)}</p>
      <footer>${count} cards &middot; ${esc(paperLabel)} &middot; charades-generator.org</footer>
    </div>
  </section>`;
}

// The clue list is for the person running the game: it is the one thing that
// cannot go on a card without giving the answer away to the table.
function hintsHTML(words, perPage = 78) {
  const real = words.filter(Boolean);
  let out = '';
  for (let i = 0; i < real.length; i += perPage) {
    const rows = real.slice(i, i + perPage).map(w =>
      `<div><b>${esc(w.word)}</b><span>${esc(w.hint || '')}</span></div>`).join('');
    out += `
  <section class="pc-sheet hints">
    <h2>Clue list${i ? ' (continued)' : ''}</h2>
    <p class="hint-note">For whoever is running the game — never show this to the guessers.</p>
    <div class="hint-cols">${rows}</div>
  </section>`;
  }
  return out;
}

function instructionsHTML(pack, count, paperLabel) {
  return `
  <section class="pc-sheet intro">
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
${SHARED_CSS}
  /* after the shared :root, so this overrides the sheet box and keeps the
     palette — replacing that block instead left --cut undefined and the
     dashed cut lines simply stopped being drawn */
  :root { --sheet-w: ${sheetW}mm; --sheet-h: ${sheetH}mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; color: #111; }

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
  /* ── cover ── */
  .cover { display: flex; align-items: center; justify-content: center; text-align: center; }
  .cover-inner { max-width: 140mm; }
  .cover-kicker { font-size: 9pt; letter-spacing: .22em; text-transform: uppercase; color: #6b7280; }
  .cover h1 {
    font-family: 'Bitstream Charter', 'Liberation Serif', serif;
    font-size: 40pt; line-height: 1.05; margin: 4mm 0 3mm; letter-spacing: -0.015em;
  }
  .cover-lead { font-size: 12pt; color: #374151; margin-bottom: 8mm; }
  .cover-themes {
    list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 6mm;
    font-size: 10pt; text-align: left; margin: 0 auto 8mm; max-width: 110mm;
  }
  .cover-themes li { display: flex; align-items: center; }
  .cover-themes i { width: 3mm; height: 3mm; border-radius: 50%; margin-right: 2.5mm; flex: none; }
  .cover-blurb { font-size: 9.5pt; line-height: 1.55; color: #4b5563; }
  .cover footer { margin-top: 10mm; font-size: 8.5pt; color: #9ca3af; }

  /* ── clue list ── */
  .hints h2 {
    font-family: 'Bitstream Charter', 'Liberation Serif', serif;
    font-size: 18pt; margin-bottom: 1mm;
  }
  .hint-note { font-size: 8.5pt; color: #b45309; font-style: italic; margin-bottom: 4mm; }
  .hint-cols { column-count: 2; column-gap: 8mm; font-size: 7.6pt; line-height: 1.35; }
  .hint-cols div {
    break-inside: avoid; padding: 0.7mm 0; border-bottom: 0.15mm solid #f3f4f6;
    display: flex; gap: 2mm;
  }
  .hint-cols b { flex: 0 0 34mm; }
  .hint-cols span { color: #4b5563; }

  .intro footer { margin-top: auto; padding-top: 6mm; padding-top: 3mm; border-top: 0.3mm solid #d1d5db; font-size: 8pt; color: #6b7280; text-align: center; }
</style></head><body>
${pack.cover ? coverHTML(pack, words.filter(Boolean).length, paper.label) : ''}
${instructionsHTML(pack, words.filter(Boolean).length, paper.label)}
${pagesHTML(words, pack)}
${pack.hintList ? hintsHTML(words) : ''}
</body></html>`;
}

// ── run ───────────────────────────────────────────────────────────────
(async () => {
  const packName = arg('pack', 'sample');
  const paperKey = arg('paper', 'a4');
  const out = arg('out', `downloads/charades-cards-${packName}-${paperKey}.pdf`);

  const pack = PACKS[packName];
  if (!pack) throw new Error('unknown pack: ' + packName);

  // resolve, not join: path.join(ROOT, '/tmp/x.pdf') yields
  // ROOT + '/tmp/x.pdf', so an absolute --out landed back inside the repo.
  const outPath = path.resolve(ROOT, out);

  // A paid pack written into the repo would be committed to public history
  // and served by Vercel — permanently, and for free. The first version of
  // this check tested path.resolve(out) while the write used
  // path.join(ROOT, out); the two disagreed for absolute paths and it waved
  // three paid PDFs straight into the working tree. A guard has to test the
  // exact value the write will use.
  if (pack.paid && !path.relative(ROOT, outPath).startsWith('..')) {
    throw new Error(
      'refusing to write a paid pack inside the repository: ' + outPath +
      '\n  the repo is public and Vercel serves it — pass --out with a path outside ' + ROOT);
  }
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
    for (const el of document.querySelectorAll('.pc-word')) {
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
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  // preferCSSPageSize hands page size and margins entirely to the CSS @page
  // rule. Passing format/margin here as well made Chromium lay the content out
  // at 210mm, add 10mm margins on top, then scale the lot down to fit the
  // sheet — every dimension came out at 91.4% of what it should be.
  await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });
  await browser.close();

  const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`${out}  ${words.length} cards, ${Math.ceil(words.length / 9) + 1} pages, ${kb} KB`);
  const real = words.filter(Boolean);
  console.log('words:', real.length, '| padding blanks:', words.length - real.length);
})();
