// ============================================================
// game-ui.js  –  shared helpers for all charades pages
// Fixes:
//   1. Replaces all alert() with in-page result cards
//   2. Provides a safe timer wrapper that prevents concurrent intervals
// ============================================================

// ── Safe Timer ──────────────────────────────────────────────
// Wraps setInterval so only ONE interval can run at a time per key.
const _timers = {};
const SafeTimer = {
  start(key, fn, ms) {
    this.stop(key);
    _timers[key] = setInterval(fn, ms);
  },
  stop(key) {
    if (_timers[key]) {
      clearInterval(_timers[key]);
      _timers[key] = null;
    }
  }
};

// ── Result Overlay ───────────────────────────────────────────
// Shows a full-page overlay instead of alert() when time is up.
function showTimeUpOverlay(answer, onPlayAgain) {
  // Remove any existing overlay
  const old = document.getElementById('_timeup-overlay');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = '_timeup-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,0.72);
    display:flex;align-items:center;justify-content:center;
    animation:_fadeIn .25s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes _fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes _popIn{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:scale(1)}}
      #_timeup-card{animation:_popIn .3s cubic-bezier(.34,1.56,.64,1)}
    </style>
    <div id="_timeup-card" style="
      background:#fff;border-radius:20px;padding:2.5rem 2rem;
      max-width:380px;width:90%;text-align:center;
      box-shadow:0 25px 60px rgba(0,0,0,.35);
    ">
      <div style="font-size:3.5rem;margin-bottom:.5rem">⏰</div>
      <div style="font-size:1.5rem;font-weight:700;color:#111;margin-bottom:.5rem">Time's Up!</div>
      <div style="font-size:.95rem;color:#555;margin-bottom:1rem">The answer was:</div>
      <div style="
        font-size:1.6rem;font-weight:800;color:#2563eb;
        background:#eff6ff;border-radius:12px;padding:.75rem 1.25rem;
        margin-bottom:1.75rem;word-break:break-word;
      ">${answer}</div>
      <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
        <button id="_overlay-next" style="
          background:#10b981;color:#fff;border:none;border-radius:10px;
          padding:.65rem 1.4rem;font-size:1rem;font-weight:600;cursor:pointer;
        ">▶ Play Again</button>
        <button id="_overlay-close" style="
          background:#f3f4f6;color:#374151;border:none;border-radius:10px;
          padding:.65rem 1.4rem;font-size:1rem;font-weight:600;cursor:pointer;
        ">✕ Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('_overlay-close').onclick = () => overlay.remove();
  document.getElementById('_overlay-next').onclick = () => {
    overlay.remove();
    if (typeof onPlayAgain === 'function') onPlayAgain();
  };

  // Click backdrop to close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });
}
