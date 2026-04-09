// ============================================================
// script.js  –  homepage quick-start game (bug-fixed)
// Fixes:
//   • alert() → showTimeUpOverlay()
//   • Timer concurrency: uses SafeTimer so only one interval runs
//   • Removed duplicate clearInterval calls that could race
// ============================================================

// ── Charades data (fallback if vocabulary DB not loaded) ─────
const charadesData = {
  adult: {
    movies: ["The Godfather","Casablanca","Pulp Fiction","The Shawshank Redemption","Forrest Gump","The Matrix","Titanic","Avatar"],
    actions: ["Rock climbing","Salsa dancing","Cooking a gourmet meal","Painting a masterpiece","Playing chess","Meditating","Writing a novel"],
    animals: ["Elephant","Giraffe","Penguin","Dolphin","Eagle","Lion","Tiger","Bear","Wolf","Shark","Octopus","Butterfly"],
    phrases: ["Actions speak louder than words","Don't judge a book by its cover","The early bird catches the worm","A picture is worth a thousand words"],
    celebrities: ["Marilyn Monroe","Elvis Presley","Michael Jackson","Madonna","Brad Pitt","Leonardo DiCaprio","Johnny Depp"],
    books: ["Pride and Prejudice","To Kill a Mockingbird","1984","The Great Gatsby","Lord of the Rings","Harry Potter","The Hobbit"]
  },
  kids: {
    movies: ["Frozen","Toy Story","Finding Nemo","The Lion King","Cinderella","Beauty and the Beast","Aladdin","Moana","Coco","Inside Out"],
    actions: ["Jumping","Running","Dancing","Singing","Drawing","Reading","Playing","Sleeping","Eating","Swimming"],
    animals: ["Dog","Cat","Bird","Fish","Rabbit","Horse","Cow","Pig","Sheep","Duck","Chicken","Mouse"],
    simple: ["Happy","Sad","Big","Small","Hot","Cold","Fast","Slow","Loud","Quiet"]
  },
  movies: {
    disney: ["Snow White","Cinderella","Sleeping Beauty","Beauty and the Beast","The Little Mermaid","Aladdin","The Lion King","Mulan"],
    pixar: ["Toy Story","Finding Nemo","The Incredibles","Up","Wall-E","Inside Out","Coco","Soul"],
    romance: ["Titanic","The Notebook","La La Land","Casablanca","Gone with the Wind"],
    action: ["Die Hard","Mission Impossible","The Matrix","Mad Max","John Wick","Fast and Furious"],
    animation: ["Toy Story","Frozen","The Lion King","Finding Nemo","Spirited Away","Up","Coco","Inside Out"],
    comedy: ["The Hangover","Bridesmaids","Superbad","Anchorman","Ghostbusters"]
  },
  christmas: ["Santa Claus","Christmas Tree","Gift Giving","Snowman","Reindeer","Christmas Carols","Mistletoe","Christmas Dinner"],
  actions: ["Running","Jumping","Dancing","Swimming","Cooking","Reading","Writing","Painting","Singing","Playing"]
};

// ── Hint data ────────────────────────────────────────────────
const hintsData = {
  "Cat":"A furry pet that purrs and catches mice",
  "Dog":"Man's best friend, barks and wags tail",
  "Bird":"Has wings, can fly, chirps or sings",
  "Rabbit":"Hops around, has long ears, eats carrots",
  "Horse":"Large animal you can ride, says neigh",
  "Running":"Moving fast with your legs",
  "Jumping":"Leaving the ground with both feet",
  "Dancing":"Moving rhythmically to music",
  "Swimming":"Moving through water using arms and legs",
  "Cooking":"Preparing food using heat and ingredients",
  "Frozen":"Disney movie about two sisters, one with ice powers",
  "Toy Story":"Pixar movie about toys that come to life",
  "Finding Nemo":"Movie about a lost clownfish",
  "The Lion King":"Disney movie about a lion prince named Simba",
  "TikTok":"Popular short video app with dancing and trends",
  "Selfie":"Photo you take of yourself",
  "Meme":"Funny image or video that spreads online",
  "ChatGPT":"AI chatbot that can answer questions",
  "default":"Think about the category and use gestures to act it out!"
};

// ── Quick-game state ─────────────────────────────────────────
let quickGameActive   = false;
let quickGamePaused   = false;
let quickGameTimeLeft = 0;
let quickCharadeIndex = 0;
let quickCharadeList  = [];
let currentQuickWord  = '';

const QUICK_ROUND_SECONDS = 120;

// ── Build shuffled word list ──────────────────────────────────
function generateQuickCharadeList() {
  quickCharadeList = [];

  if (typeof CHARADES_VOCABULARY !== 'undefined') {
    const v = CHARADES_VOCABULARY;
    quickCharadeList.push(
      ...v.adult.easy.slice(0,15),
      ...v.adult.medium.slice(0,15),
      ...v.adult.hard.slice(0,10),
      ...v.kids.disney.slice(0,20),
      ...v.kids.halloween.slice(0,15),
      ...v.kids.kids.slice(0,15),
      ...v.movies.action.slice(0,15),
      ...v.movies.animation.slice(0,15),
      ...v.movies.comedy.slice(0,10),
      ...v.animals.land.slice(0,15),
      ...v.animals.marine.slice(0,10),
      ...v.animals.birds.slice(0,10),
      ...v.christmas.slice(0,15),
      ...v.trending.slice(0,25)
    );
  } else {
    // fallback
    [charadesData.adult, charadesData.kids, charadesData.movies].forEach(group => {
      Object.values(group).forEach(arr => { if (Array.isArray(arr)) quickCharadeList.push(...arr); });
    });
    quickCharadeList.push(...charadesData.christmas, ...charadesData.actions);
  }

  // Shuffle
  for (let i = quickCharadeList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quickCharadeList[i], quickCharadeList[j]] = [quickCharadeList[j], quickCharadeList[i]];
  }
}

// ── Timer helpers ────────────────────────────────────────────
function _tickQuickTimer() {
  if (quickGamePaused) return;
  quickGameTimeLeft--;
  _renderTimer();
  if (quickGameTimeLeft <= 0) {
    SafeTimer.stop('quick');
    _onTimeUp();
  }
}

function _startQuickTimer() {
  SafeTimer.start('quick', _tickQuickTimer, 1000);  // only ONE interval
}

function _renderTimer() {
  const m = Math.floor(quickGameTimeLeft / 60);
  const s = quickGameTimeLeft % 60;
  const mEl = document.getElementById('quick-minutes');
  const sEl = document.getElementById('quick-seconds');
  if (mEl) mEl.textContent = m;
  if (sEl) sEl.textContent = String(s).padStart(2, '0');
}

// ── Game flow ─────────────────────────────────────────────────
function startQuickGame() {
  generateQuickCharadeList();
  quickCharadeIndex = 0;
  quickGameActive   = true;
  quickGamePaused   = false;
  quickGameTimeLeft = QUICK_ROUND_SECONDS;

  _showCurrentWord();
  _renderTimer();
  document.getElementById('quick-countdown-timer').classList.remove('hidden');
  _startQuickTimer();
  _setButtonState(true);
}

function _showCurrentWord() {
  currentQuickWord = quickCharadeList[quickCharadeIndex] || '';
  const el = document.getElementById('quick-charade-content');
  if (el) {
    el.textContent = currentQuickWord || 'Game Complete! 🎉';
    // Tiny pulse animation
    el.style.transform = 'scale(1.04)';
    setTimeout(() => { el.style.transform = ''; }, 200);
  }
  // Hide hint
  const ha = document.getElementById('quick-hint-area');
  if (ha) ha.classList.add('hidden');
}

function nextQuickCharade() {
  if (!quickGameActive || quickGamePaused) return;
  quickCharadeIndex++;
  if (quickCharadeIndex >= quickCharadeList.length) {
    _onGameComplete();
    return;
  }
  quickGameTimeLeft = QUICK_ROUND_SECONDS;
  _renderTimer();
  _showCurrentWord();
  // timer already running – no need to restart
}

function pauseQuickGame() {
  if (!quickGameActive) return;
  quickGamePaused = !quickGamePaused;
  const btn = document.getElementById('pause-game-btn');
  if (btn) {
    btn.textContent = quickGamePaused ? '▶️ Resume' : '⏸️ Pause';
    btn.className = btn.className
      .replace(/bg-\w+-500|hover:bg-\w+-600/g, '')
      .trim();
    if (quickGamePaused) {
      btn.classList.add('bg-green-500', 'hover:bg-green-600');
    } else {
      btn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    }
  }
}

function resetQuickGame() {
  quickGameActive   = false;
  quickGamePaused   = false;
  SafeTimer.stop('quick');

  const el = document.getElementById('quick-charade-content');
  if (el) el.textContent = "Click 'Start Game' to begin!";
  const ha = document.getElementById('quick-hint-area');
  if (ha) ha.classList.add('hidden');
  document.getElementById('quick-countdown-timer').classList.add('hidden');
  _setButtonState(false);
}

function _onTimeUp() {
  showTimeUpOverlay(currentQuickWord, () => {
    // Play again = next word
    quickCharadeIndex++;
    if (quickCharadeIndex >= quickCharadeList.length) {
      _onGameComplete();
      return;
    }
    quickGameTimeLeft = QUICK_ROUND_SECONDS;
    _renderTimer();
    _showCurrentWord();
    quickGamePaused = false;
    _startQuickTimer();
  });
}

function _onGameComplete() {
  SafeTimer.stop('quick');
  quickGameActive = false;
  const el = document.getElementById('quick-charade-content');
  if (el) el.textContent = 'Game Complete! 🎉';
  _setButtonState(false);
}

function _setButtonState(active) {
  const ids = ['start-quick-game-btn','next-charade-btn','pause-game-btn','reset-game-btn','hint-btn'];
  const show = active ? ids.slice(1) : [ids[0]];
  const hide = active ? [ids[0]] : ids.slice(1);
  show.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); });
  hide.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });

  // Reset pause button appearance
  const pauseBtn = document.getElementById('pause-game-btn');
  if (pauseBtn && active) {
    pauseBtn.textContent = '⏸️ Pause';
    pauseBtn.classList.remove('bg-green-500','hover:bg-green-600');
    pauseBtn.classList.add('bg-yellow-500','hover:bg-yellow-600');
  }
}

// ── Hint ──────────────────────────────────────────────────────
function showQuickHint() {
  const ha = document.getElementById('quick-hint-area');
  const hc = document.getElementById('quick-hint-content');
  if (!ha || !hc) return;
  const word = document.getElementById('quick-charade-content')?.textContent || '';
  hc.textContent = hintsData[word] || hintsData.default;
  ha.classList.remove('hidden');
  setTimeout(() => ha.classList.add('hidden'), 10000);
}

// ── Utility ───────────────────────────────────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function navigateToCategory(cat) { showCategoryCharades(cat); }

function selectMovieGenre(genre) {
  window.location.href = `Movies-for-Charades.html?genre=${genre}#quick-start-game`;
}
function selectAnimalHabitat(habitat) {
  window.location.href = `Animal-Charades-Game.html?habitat=${habitat}#quick-start-game`;
}

function showCategoryCharades(category) {
  const map = {
    'land-animals': charadesData.animals?.land || [],
    'marine-animals': charadesData.animals?.marine || [],
    'action-movies': charadesData.movies.action,
    'animation-movies': charadesData.movies.animation,
    'comedy-movies': charadesData.movies.comedy,
    'christmas': charadesData.christmas,
    'actions': charadesData.actions,
  };
  const list = map[category] || ['Coming soon!'];
  const word = list[Math.floor(Math.random() * list.length)];
  alert(`${category.replace(/-/g,' ')} charade: ${word}`);
}

// ── Mobile menu ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
});

// ── Expose globals ────────────────────────────────────────────
window.startQuickGame      = startQuickGame;
window.nextQuickCharade    = nextQuickCharade;
window.pauseQuickGame      = pauseQuickGame;
window.resetQuickGame      = resetQuickGame;
window.showQuickHint       = showQuickHint;
window.scrollToSection     = scrollToSection;
window.navigateToCategory  = navigateToCategory;
window.selectMovieGenre    = selectMovieGenre;
window.selectAnimalHabitat = selectAnimalHabitat;
window.generateRandomCharade = () => {};  // no-op placeholder (kept for safety)
