// script.js — Charades Generator homepage game logic

// ── State ─────────────────────────────────────────────────────
let activeCategory   = 'all';
let activeDifficulty = 'all';
let currentWord      = null;
let timerInterval    = null;
let timerSeconds     = 120;
let timerRunning     = false;

// ── Word pools ────────────────────────────────────────────────
// The homepage tool covers every category the site has. Each chip narrows
// the pool to one of them; "all" mixes the lot. The chips deliberately
// mirror the themed landing pages, so a player who wants more of one thing
// has somewhere to go — and each of those pages then offers a second axis
// the homepage does not, which is what keeps them from being duplicates.
let POOLS = null;

// Display labels for the card badge. The word data stores lowercase keys.
const CAT_LABEL = {
  animals: 'Animal', movies: 'Movie', tvshows: 'TV Show', famous: 'Famous Person',
  actions: 'Action', objects: 'Object', food: 'Food & Drink', sports: 'Sport',
  kids: 'For Kids', adults: 'Everyday Life', christmas: 'Christmas',
  halloween: 'Halloween',
};

// Which word categories feed each chip. Anything not named here is still
// reachable through "all".
const CHIP_CATEGORIES = {
  movies:    ['movies', 'tvshows'],
  adults:    ['adults'],
  kids:      ['kids'],
  animals:   ['animals'],
  christmas: ['christmas'],
  halloween: ['halloween'],
};

function buildPools() {
  const byCategory = {};
  const all  = [];
  const seen = new Set();

  const add = (list) => list.forEach(w => {
    if (seen.has(w.word)) return;
    seen.add(w.word);
    all.push(w);
  });

  const shared = (typeof CHARADES_WORDS !== 'undefined' ? CHARADES_WORDS : [])
    .map(w => ({ ...w, category: CAT_LABEL[w.category] || w.category, key: w.category }));

  Object.keys(CHIP_CATEGORIES).forEach(chip => {
    byCategory[chip] = shared.filter(w => CHIP_CATEGORIES[chip].indexOf(w.key) !== -1);
  });

  // The movie genre banks are extra titles that only exist for the film
  // theme, so they widen the Movies chip rather than replacing it.
  if (typeof MOVIE_THEME_WORDS !== 'undefined') {
    const genreWords = [];
    Object.keys(MOVIE_THEME_WORDS).forEach(genre => {
      MOVIE_THEME_WORDS[genre].words.forEach(w => {
        genreWords.push({ ...w, category: MOVIE_THEME_WORDS[genre].label, key: 'movies' });
      });
    });
    byCategory.movies = byCategory.movies.concat(genreWords);
  }

  // "All" is every chip plus the categories with no chip of their own —
  // actions, food, sports, objects and famous people.
  Object.keys(byCategory).forEach(chip => add(byCategory[chip]));
  add(shared);

  return { byCategory, all };
}

// ── Word selection ────────────────────────────────────────────
function getFilteredWords() {
  if (!POOLS) POOLS = buildPools();
  const base = POOLS.byCategory[activeCategory] || POOLS.all;
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
  window.location.href = `/Movies-for-Charades/?genre=${genre}#game-section`;
}
function selectAnimalHabitat(habitat) {
  window.location.href = `/Animal-Charades-Game/?habitat=${habitat}#game-section`;
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
