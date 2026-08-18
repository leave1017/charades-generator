#!/usr/bin/env python3
"""Assert that a generated PDF is at true physical scale.

    python3 tools/check-print-geometry.py downloads/print-calibration-a4.pdf --ruler 150
    python3 tools/check-print-geometry.py downloads/cards.pdf --grid 189x276 --edges

Chromium shrinks the whole page to fit whenever any element overflows the
content box, and nothing about the resulting PDF looks wrong on screen — the
layout is simply 8-9% small, so cut cards come out the wrong size. Run this
after generating anything meant to be printed.

Exit code 1 on failure, so it can gate a build.
"""
import argparse, sys

try:
    import pymupdf
except ImportError:
    sys.exit('pymupdf is required: pip install pymupdf')

MM = 72 / 25.4
TOL = 0.5          # mm; Chromium rounds page boxes slightly


def inked(page):
    """Drawings that put ink on the page.

    A page-sized white fill is background, not content, and counting it makes
    every extent measurement come out as the full page.
    """
    out = []
    for d in page.get_drawings():
        white = d.get('fill') and all(c > 0.95 for c in d['fill'])
        if white and not d.get('color'):
            continue
        out.append(d)
    return out


def rects_mm(page):
    return [(d['rect'].width / MM, d['rect'].height / MM) for d in inked(page)]


def bbox_mm(page):
    """Union of every drawing on the page, in mm.

    A dashed border is emitted as hundreds of separate dash segments rather
    than one rectangle, so the card grid can only be measured as an extent.
    """
    ds = inked(page)
    if not ds:
        return None
    x0 = min(d['rect'].x0 for d in ds) / MM
    y0 = min(d['rect'].y0 for d in ds) / MM
    x1 = max(d['rect'].x1 for d in ds) / MM
    y1 = max(d['rect'].y1 for d in ds) / MM
    return x1 - x0, y1 - y0


def edge_rules(page, dpi=300):
    """Widths, in pixels, of the leftmost and rightmost full-height vertical rules.

    Borders that land exactly on the page content edge get clipped to a
    sub-pixel sliver: present in the vector data, invisible on paper. Comparing
    the outer rules against each other catches that, which measuring the
    geometry cannot.
    """
    pix = page.get_pixmap(dpi=dpi)
    runs, run = [], []
    for px in range(pix.width):
        ink = sum(1 for y in range(0, pix.height, 8) if pix.pixel(px, y)[0] < 200)
        if ink > pix.height / 8 * 0.3:
            run.append(px)
        elif run:
            runs.append((run[0], len(run)))
            run = []
    if run:
        runs.append((run[0], len(run)))
    return runs


def check(path, ruler=None, grid=None, edges=False):
    doc = pymupdf.open(path)
    pw, ph = doc[0].rect.width / MM, doc[0].rect.height / MM
    print(f'{path}\n  {doc.page_count} page(s), {pw:.2f} x {ph:.2f} mm')

    ok = True
    # Measure across every page: in a card pack the grid lives on page 2,
    # while page 1 is the instructions sheet.
    rs = [r for page in doc for r in rects_mm(page)]
    if not rs:
        print('  no vector drawings found — nothing to measure')
        return False

    if ruler:
        bar = max((r for r in rs if r[1] < 2), key=lambda r: r[0], default=None)
        if bar is None:
            print('  FAIL: no horizontal ruler bar found'); ok = False
        else:
            err = abs(bar[0] - ruler)
            print(f'  ruler bar: {bar[0]:.2f} mm (want {ruler}) '
                  f'{"OK" if err <= TOL else f"FAIL off by {err:.2f} mm"}')
            ok &= err <= TOL

    if grid:
        want_w, want_h = (float(v) for v in grid.lower().split('x'))
        boxes = [(i, bbox_mm(pg)) for i, pg in enumerate(doc, 1)]
        best = max((b for b in boxes if b[1]), key=lambda b: b[1][0] * b[1][1], default=None)
        if best is None:
            print('  card grid: FAIL — no drawings on any page'); ok = False
        else:
            i, (w, h) = best
            err = max(abs(w - want_w), abs(h - want_h))
            print(f'  card grid (page {i}): {w:.2f} x {h:.2f} mm (want {want_w} x {want_h}) '
                  f'{"OK" if err <= TOL else f"FAIL off by {err:.2f} mm, scale {w / want_w:.4f}"}')
            ok &= err <= TOL

    if edges:
        # The card grid is a handful of dashed paths, so it has far fewer
        # drawing objects than the instructions page's tables — pick by extent.
        page = max((pg for pg in doc if bbox_mm(pg)),
                   key=lambda pg: bbox_mm(pg)[0] * bbox_mm(pg)[1])
        runs = edge_rules(page)
        if len(runs) < 2:
            print('  edge rules: FAIL — fewer than two vertical rules found'); ok = False
        else:
            (lx, lw), (rx, rw) = runs[0], runs[-1]
            same = abs(lw - rw) <= 1
            print(f'  edge rules: left {lw}px at {lx / 300 * 25.4:.1f} mm, '
                  f'right {rw}px at {rx / 300 * 25.4:.1f} mm '
                  f'{"OK" if same else "FAIL — right rule is clipped at the page edge"}')
            ok &= same

    print('  =>', 'true scale' if ok else 'SCALED — do not ship this file')
    return ok


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('--ruler', type=float, help='expected width of the ruler bar, mm')
    ap.add_argument('--grid', help='expected card-grid box, e.g. 189x276')
    ap.add_argument('--edges', action='store_true',
                    help='check the outer cut lines print at equal weight')
    a = ap.parse_args()
    sys.exit(0 if check(a.pdf, a.ruler, a.grid, a.edges) else 1)
