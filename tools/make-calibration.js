/**
 * make-calibration.js — a one-page print calibration sheet.
 *
 *   node tools/make-calibration.js --paper a4 --out downloads/print-calibration-a4.pdf
 *
 * Printed once and measured with a ruler, this sheet answers everything the
 * card layout depends on: did the printer scale the page, does it clip the
 * 10mm margin, is a card really 63x92mm, is the cut line followable, and is
 * the smallest type readable. Eyeballing a sample pack cannot tell you the
 * first of those, and scaling is the failure that silently ruins every pack.
 *
 * The geometry is verifiable: the ruler bar and the card box are drawn at
 * exact millimetre sizes and can be measured inside the PDF before printing,
 * so any deviation on paper is the printer's doing, not the file's.
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const ROOT = path.resolve(__dirname, '..');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const PAPER = {
  a4:     { format: 'A4',     label: 'A4 (210 x 297 mm)',     contentH: 277, contentW: 190 },
  letter: { format: 'Letter', label: 'US Letter (8.5 x 11 in)', contentH: 259, contentW: 196 },
};

const RULER_MM = 150;   // long enough that a 4% "fit to page" shrink shows as 6mm
const VRULER_MM = 100;
const CARD_W = 63, CARD_H = 92;

function ticks(lengthMm, step = 10) {
  let out = '';
  for (let mm = 0; mm <= lengthMm; mm += step) {
    const major = mm % 50 === 0;
    out += `<span class="tick${major ? ' major' : ''}" style="left:${mm}mm">` +
           (major ? `<b>${mm}</b>` : '') + '</span>';
  }
  return out;
}

function vticks(lengthMm, step = 10) {
  let out = '';
  for (let mm = 0; mm <= lengthMm; mm += step) {
    const major = mm % 50 === 0;
    out += `<span class="vtick${major ? ' major' : ''}" style="top:${mm}mm">` +
           (major ? `<b>${mm}</b>` : '') + '</span>';
  }
  return out;
}

function documentHTML(paper) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<style>
  @page { size: ${paper.format}; margin: 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DejaVu Sans', 'Liberation Sans', sans-serif; color: #111; }
  .sheet { position: relative; height: ${paper.contentH - 1}mm; width: ${paper.contentW - 1}mm; margin: 0 auto; }

  h1 { font-family: 'Bitstream Charter', 'Liberation Serif', serif; font-size: 19pt; }
  .sub { font-size: 8.5pt; color: #6b7280; margin-top: 1mm; }
  h2 { font-size: 10pt; margin-bottom: 1.5mm; letter-spacing: .04em; text-transform: uppercase; }
  p  { font-size: 8.5pt; line-height: 1.45; }
  .muted { color: #4b5563; }

  .warn {
    border: 0.5mm solid #b91c1c; color: #b91c1c; padding: 3mm 4mm; margin: 4mm 0 6mm;
    font-size: 9.5pt; line-height: 1.45;
  }
  .warn b { font-size: 10.5pt; }

  section { margin-bottom: 6mm; }

  /* corner marks sit at the corners of the printable box: 10mm from paper edge */
  .corner { position: absolute; width: 12mm; height: 12mm; }
  .corner.tl { top: 0; left: 0; border-top: .5mm solid #111; border-left: .5mm solid #111; }
  .corner.tr { top: 0; right: 0; border-top: .5mm solid #111; border-right: .5mm solid #111; }
  .corner.bl { bottom: 0; left: 0; border-bottom: .5mm solid #111; border-left: .5mm solid #111; }
  .corner.br { bottom: 0; right: 0; border-bottom: .5mm solid #111; border-right: .5mm solid #111; }

  /* horizontal ruler: the bar itself is exactly ${RULER_MM}mm wide */
  .ruler { position: relative; width: ${RULER_MM}mm; height: 9mm; margin: 5mm 0 2mm; }
  .ruler .bar { position: absolute; top: 0; left: 0; width: ${RULER_MM}mm; height: 1.2mm; background: #111; }
  .tick { position: absolute; top: 1.2mm; width: .3mm; height: 2.5mm; background: #111; }
  .tick.major { height: 4.5mm; width: .5mm; }
  .tick b { position: absolute; top: 5mm; left: -3mm; width: 6mm; text-align: center;
            font-size: 6.5pt; font-weight: normal; }

  /* vertical ruler: exactly ${VRULER_MM}mm tall */
  .vruler { position: relative; width: 9mm; height: ${VRULER_MM}mm; }
  .vruler .vbar { position: absolute; top: 0; left: 0; width: 1.2mm; height: ${VRULER_MM}mm; background: #111; }
  .vtick { position: absolute; left: 1.2mm; height: .3mm; width: 2.5mm; background: #111; }
  .vtick.major { width: 4.5mm; height: .5mm; }
  .vtick b { position: absolute; left: 5mm; top: -1.8mm; font-size: 6.5pt; font-weight: normal; }

  /* These widths must sum with the gaps to exactly contentW. If the row
     overflows, Chromium silently shrinks the whole page to fit and every
     printed millimetre is wrong — the bug this sheet exists to catch.
     They sum to contentW - 1mm: see SAFE in make-cards.js. */
  .row { display: flex; gap: 4mm; align-items: flex-start; }
  .row > :nth-child(1) { width: 52mm; flex: none; }
  .row > :nth-child(2) { width: 67mm; flex: none; }
  .row > :nth-child(3) { width: 62mm; flex: none; }

  /* a real card, drawn at the exact size the packs use */
  .card {
    width: ${CARD_W}mm; height: ${CARD_H}mm; border: .4mm dashed #9ca3af;
    padding: 4mm 3mm; display: flex; flex-direction: column; text-align: center;
  }
  .card .cat { font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase;
               color: #6b7280; font-weight: bold; }
  .card .word { flex: 1; display: flex; align-items: center; justify-content: center;
                font-weight: bold; font-size: 30pt; line-height: 1.15; }
  .card .foot { display: flex; justify-content: space-between; align-items: center;
                font-size: 6.5pt; color: #6b7280; }
  .card .pip { display: flex; align-items: center; gap: 1mm; font-weight: bold; }
  .card .pip i { width: 2mm; height: 2mm; border-radius: 50%; background: #15803d; display: inline-block; }
  .card .src { color: #9ca3af; }

  .cutline { width: 58mm; border-top: .4mm dashed #9ca3af; margin: 3mm 0; }

  .specimen span { display: block; margin-bottom: 1.5mm; }
  .s65 { font-size: 6.5pt; color: #6b7280; }
  .s75 { font-size: 7.5pt; color: #6b7280; letter-spacing: .12em; text-transform: uppercase; font-weight: bold; }
  .s12 { font-size: 12pt; font-weight: bold; }
  .s30 { font-size: 30pt; font-weight: bold; }

  .report { border: .4mm solid #111; padding: 4mm; }
  .report ol { padding-left: 5mm; font-size: 9pt; line-height: 2.1; }
  .fill { display: inline-block; border-bottom: .3mm solid #111; min-width: 22mm; }
  footer { position: absolute; bottom: 0; left: 0; right: 0; text-align: center;
           font-size: 7.5pt; color: #9ca3af; }
</style></head><body>
  <div class="sheet">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>

    <h1>Print Calibration Sheet</h1>
    <p class="sub">Charades card packs &middot; ${paper.label}</p>

    <div class="warn">
      <b>Before printing:</b> set scale to <b>100%</b> / <b>Actual size</b>.<br>
      Turn <b>off</b> "Fit to page", "Shrink oversized pages" and "Scale to fit" — that setting is the
      single thing this sheet exists to catch.
    </div>

    <section>
      <h2>1 &nbsp; Scale check</h2>
      <p class="muted">Measure the black bar below with a ruler. It is drawn <b>exactly ${RULER_MM} mm</b>.</p>
      <div class="ruler"><div class="bar"></div>${ticks(RULER_MM)}</div>
    </section>

    <section class="row">
      <div>
        <h2>2 &nbsp; Vertical scale</h2>
        <p class="muted">This bar is <b>exactly ${VRULER_MM} mm</b> tall.<br>
          Some printers squash one axis only.</p>
        <div class="vruler" style="margin-top:3mm"><div class="vbar"></div>${vticks(VRULER_MM)}</div>
      </div>

      <div>
        <h2>3 &nbsp; Card size</h2>
        <p class="muted">Cut this card out along the dashed line.
          It should measure <b>${CARD_W} &times; ${CARD_H} mm</b> — near a standard playing card.</p>
        <div class="card" style="margin-top:3mm">
          <div class="cat">Action</div>
          <div class="word">Painting</div>
          <div class="foot"><span class="pip"><i></i>Easy</span><span class="src">charades-generator.org</span></div>
        </div>
      </div>

      <div>
        <h2>4 &nbsp; Cut line</h2>
        <p class="muted">This is the exact line weight the packs use for cutting.
          Is it dark enough to follow with scissors or a blade?</p>
        <div class="cutline"></div>
        <div class="cutline"></div>

        <h2 style="margin-top:6mm">5 &nbsp; Smallest type</h2>
        <p class="muted">Hold the sheet at arm's length. Can you read every line?</p>
        <div class="specimen" style="margin-top:2mm">
          <span class="s75">Category label 7.5pt</span>
          <span class="s65">Difficulty and website line 6.5pt — charades-generator.org</span>
          <span class="s12">Longest card word 12pt</span>
          <span class="s30">Short word 30pt</span>
        </div>
      </div>
    </section>

    <section class="report">
      <h2>Report these five answers back</h2>
      <ol>
        <li>Horizontal bar measured <span class="fill"></span> mm &nbsp;<span class="muted">(should be ${RULER_MM})</span></li>
        <li>Vertical bar measured <span class="fill"></span> mm &nbsp;<span class="muted">(should be ${VRULER_MM})</span></li>
        <li>All four corner marks fully printed?&nbsp; <span class="fill"></span> &nbsp;<span class="muted">(yes / which one is cut off)</span></li>
        <li>Cut-out card measured <span class="fill"></span> &times; <span class="fill"></span> mm &nbsp;<span class="muted">(should be ${CARD_W} &times; ${CARD_H})</span></li>
        <li>Cut line followable, and smallest type readable?&nbsp; <span class="fill"></span></li>
      </ol>
    </section>

    <footer>charades-generator.org &middot; calibration sheet &middot; ${paper.label}</footer>
  </div>
</body></html>`;
}

(async () => {
  const paperKey = arg('paper', 'a4');
  const paper = PAPER[paperKey];
  if (!paper) throw new Error('unknown paper: ' + paperKey);
  const out = arg('out', `downloads/print-calibration-${paperKey}.pdf`);

  const htmlPath = path.join('/tmp', `calibration-${paperKey}.html`);
  fs.writeFileSync(htmlPath, documentHTML(paper));

  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  const outPath = path.join(ROOT, out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  // preferCSSPageSize hands page size and margins entirely to the CSS @page
  // rule. Passing format/margin here as well made Chromium lay the content out
  // at 210mm, add 10mm margins on top, then scale the lot down to fit the
  // sheet — every dimension came out at 91.4% of what it should be.
  await page.pdf({ path: outPath, printBackground: true, preferCSSPageSize: true });
  await browser.close();

  console.log(`${out}  (${paper.label})`);
})();
