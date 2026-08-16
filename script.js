// script.js — Charades Generator homepage game logic

// ── State ─────────────────────────────────────────────────────
let activeCategory   = 'all';
let activeDifficulty = 'all';
let currentWord      = null;
let timerInterval    = null;
let timerSeconds     = 120;
let timerRunning     = false;

// ── Word pools ────────────────────────────────────────────────
// The homepage tool is a movie charades generator: "all" mixes every
// genre with the generic film/TV titles, and each genre button narrows
// it to that genre's bank in movie-themes.js.
let POOLS = null;

function buildPools() {
  const byGenre = {};
  const all     = [];
  const seen    = new Set();

  const add = (list) => list.forEach(w => {
    if (seen.has(w.word)) return;
    seen.add(w.word);
    all.push(w);
  });

  if (typeof MOVIE_THEME_WORDS !== 'undefined') {
    Object.keys(MOVIE_THEME_WORDS).forEach(genre => {
      const label = MOVIE_THEME_WORDS[genre].label;
      byGenre[genre] = MOVIE_THEME_WORDS[genre].words.map(w => ({ ...w, category: label }));
      add(byGenre[genre]);
    });
  }

  // Generic film & TV titles already in the shared word list widen "All".
  if (typeof CHARADES_WORDS !== 'undefined') {
    add(CHARADES_WORDS
      .filter(w => w.category === 'movies' || w.category === 'tvshows')
      .map(w => ({ ...w, category: w.category === 'tvshows' ? 'TV Show' : 'Movie' })));
  }

  return { byGenre, all };
}

// ── Word selection ────────────────────────────────────────────
function getFilteredWords() {
  if (!POOLS) POOLS = buildPools();
  const base = POOLS.byGenre[activeCategory] || POOLS.all;
  if (!base.length) return [];
  if (activeDifficulty === 'all') return base;
  const words = base.filter(w => w.difficulty === activeDifficulty);
  return words.length ? words : base;
}

function getRandomWord(excludeWord) {
  const words = getFilteredWords();
  if (!words.length) return null;
  let pool = excludeWord ? words.filter(w => w.word !== excludeWord) : words;
  if (!pool.length) pool = words;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Display ───────────────────────────────────────────────────
function showWord(wordObj) {
  if (!wordObj) return;
  currentWord = wordObj;

  const display = document.getElementById('word-display');
  if (display) {
    display.textContent = wordObj.word;
    display.classList.remove('word-pop');
    void display.offsetWidth;
    display.classList.add('word-pop');
  }

  // Category badge (already a display label: "Action", "Movie", "TV Show")
  const catBadge = document.getElementById('cat-badge');
  if (catBadge) catBadge.textContent = wordObj.category;

  // Difficulty badge
  const diffBadge = document.getElementById('diff-badge');
  if (diffBadge) {
    diffBadge.textContent = capitalize(wordObj.difficulty);
    diffBadge.className = 'text-xs font-semibold px-3 py-1 rounded-full';
    if (wordObj.difficulty === 'easy')   diffBadge.classList.add('bg-green-100', 'text-green-700');
    else if (wordObj.difficulty === 'medium') diffBadge.classList.add('bg-yellow-100', 'text-yellow-700');
    else                                  diffBadge.classList.add('bg-red-100', 'text-red-700');
  }

  hideHint();
}

// ── Game controls ──────────────────────────────────────────────
function nextWord() {
  showWord(getRandomWord(currentWord?.word));
  if (timerRunning) {
    timerSeconds = 120;
    renderTimer();
  }
}

function toggleHint() {
  const area = document.getElementById('hint-area');
  const text = document.getElementById('hint-text');
  if (!area || !text || !currentWord) return;
  if (area.classList.contains('hidden')) {
    text.textContent = currentWord.hint ||
      `Starts with "${currentWord.word[0].toUpperCase()}" · ${currentWord.word.replace(/\s/g,'').length} letters`;
    area.classList.remove('hidden');
  } else {
    area.classList.add('hidden');
  }
}

function hideHint() {
  document.getElementById('hint-area')?.classList.add('hidden');
}

function toggleTimer() {
  timerRunning ? stopTimer() : startTimer();
}

function startTimer() {
  timerSeconds  = 120;
  timerRunning  = true;
  document.getElementById('timer-wrap')?.classList.remove('hidden');
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = '⏱ Stop';
  renderTimer();
  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();
    if (timerSeconds <= 0) {
      stopTimer();
      onTimerEnd();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  document.getElementById('timer-wrap')?.classList.add('hidden');
  const btn = document.getElementById('timer-btn');
  if (btn) btn.textContent = '⏱ Timer';
}

function renderTimer() {
  const m  = Math.floor(timerSeconds / 60);
  const s  = timerSeconds % 60;
  const el = document.getElementById('timer-display');
  if (el) el.textContent = `${m}:${String(s).padStart(2, '0')}`;
}

function onTimerEnd() {
  if (typeof showTimeUpOverlay === 'function') {
    showTimeUpOverlay(currentWord?.word || '', () => nextWord());
  } else {
    nextWord();
  }
}

// ── Filters ───────────────────────────────────────────────────
function setCategoryFilter(category) {
  activeCategory = category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  showWord(getRandomWord());
}

function setDifficultyFilter(difficulty) {
  activeDifficulty = difficulty;
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
  });
  showWord(getRandomWord());
}

// ── Utilities ─────────────────────────────────────────────────
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ── Navigation helpers (kept for inner pages) ─────────────────
function selectMovieGenre(genre) {
  window.location.href = `Movies-for-Charades.html?genre=${genre}#quick-start-game`;
}
function selectAnimalHabitat(habitat) {
  window.location.href = `Animal-Charades-Game.html?habitat=${habitat}#quick-start-game`;
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu is owned by mobile-nav.js — binding a second toggle here
  // cancelled it out and left the burger dead on this page.

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => setCategoryFilter(btn.dataset.category))
  );
  document.querySelectorAll('.diff-btn').forEach(btn =>
    btn.addEventListener('click', () => setDifficultyFilter(btn.dataset.difficulty))
  );

  // Auto-show first word
  showWord(getRandomWord());
});

// ── Global exports ────────────────────────────────────────────
window.nextWord            = nextWord;
window.toggleHint          = toggleHint;
window.toggleTimer         = toggleTimer;
window.stopTimer           = stopTimer;
window.setCategoryFilter   = setCategoryFilter;
window.setDifficultyFilter = setDifficultyFilter;
window.selectMovieGenre    = selectMovieGenre;
window.selectAnimalHabitat = selectAnimalHabitat;
// Legacy no-ops (inner pages still reference these)
window.startQuickGame   = nextWord;
window.nextQuickCharade = nextWord;
window.pauseQuickGame   = () => {};
window.resetQuickGame   = () => {};
window.showQuickHint    = toggleHint;
