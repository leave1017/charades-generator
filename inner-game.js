// inner-game.js — category page game logic
// Requires charades-words.js loaded first
// Requires window.PAGE_CATEGORIES (array) and window.PAGE_LABEL (string)
//
// Optional sub-filters. A page can offer a second row of chips that narrows
// its word pool — movie genres, animal habitats, kid themes. Declare:
//   window.PAGE_SUBSET_PARAM = 'genre'          // the URL parameter to honour
//   window.PAGE_SUBSETS = {
//     action: { label: 'Action', list: [...] },       // an explicit word array
//     land:   { label: 'Land',   words: ['Lion'] },   // names from CHARADES_WORDS
//     spooky: { label: 'Spooky', categories: ['halloween'] }
//   }
// Mark the chips with class "subset-btn" and data-subset="<key>". Landing on
// ?<param>=<key> preselects that chip, so a link from the homepage lands on
// the words it promised.
(function () {
  var activeDiff = 'all';
  var activeSubset = null;
  var currentWord = null;
  var timerInterval = null;
  var timerSeconds = 120;
  var timerRunning = false;

  function allWords() {
    return (typeof CHARADES_WORDS !== 'undefined' ? CHARADES_WORDS : []);
  }

  function subsetWords(key) {
    var def = (window.PAGE_SUBSETS || {})[key];
    if (!def) return null;
    if (def.list) return def.list;
    var all = allWords();
    if (def.categories) {
      return all.filter(function (w) { return def.categories.indexOf(w.category) !== -1; });
    }
    if (def.words) {
      return all.filter(function (w) { return def.words.indexOf(w.word) !== -1; });
    }
    return null;
  }

  function getWords() {
    var all = allWords();
    var base = activeSubset ? subsetWords(activeSubset) : null;
    if (!base || !base.length) {
      var cats = window.PAGE_CATEGORIES || [];
      base = cats.length ? all.filter(function (w) { return cats.indexOf(w.category) !== -1; }) : all;
    }
    if (!base.length) base = all;
    if (activeDiff === 'all') return base;
    var words = base.filter(function (w) { return w.difficulty === activeDiff; });
    return words.length ? words : base;
  }

  function randomWord(exclude) {
    var words = getWords();
    if (!words.length) return { word: '---', category: '', difficulty: '', hint: '' };
    if (words.length === 1) return words[0];
    var w;
    do { w = words[Math.floor(Math.random() * words.length)]; } while (w === exclude);
    return w;
  }

  function showWord(obj) {
    currentWord = obj;
    var el = document.getElementById('word-display');
    if (el) {
      el.textContent = obj.word;
      el.classList.remove('word-pop');
      void el.offsetWidth;
      el.classList.add('word-pop');
    }
    var db = document.getElementById('diff-badge');
    if (db) {
      var map = { easy: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', hard: 'bg-red-100 text-red-700' };
      db.className = 'text-xs font-semibold px-3 py-1 rounded-full ' + (map[obj.difficulty] || 'bg-gray-100 text-gray-600');
      db.textContent = obj.difficulty ? obj.difficulty[0].toUpperCase() + obj.difficulty.slice(1) : '';
    }
    var ha = document.getElementById('hint-area');
    if (ha) ha.classList.add('hidden');
    var ht = document.getElementById('hint-text');
    if (ht) ht.textContent = obj.hint || '';
    updateBadge();
  }

  // Card badge shows the active sub-filter, falling back to the page label.
  function updateBadge() {
    var cb = document.getElementById('cat-badge');
    if (!cb) return;
    var def = activeSubset ? (window.PAGE_SUBSETS || {})[activeSubset] : null;
    cb.textContent = (def && def.label) || window.PAGE_LABEL || '';
  }

  function setSubset(key, rerender) {
    activeSubset = (window.PAGE_SUBSETS || {})[key] ? key : null;
    document.querySelectorAll('.subset-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.subset === (activeSubset || 'all'));
    });
    if (rerender !== false) showWord(randomWord());
  }

  function setDifficulty(key, rerender) {
    activeDiff = ['easy', 'medium', 'hard'].indexOf(key) !== -1 ? key : 'all';
    document.querySelectorAll('.diff-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.difficulty === activeDiff);
    });
    if (rerender !== false) showWord(randomWord());
  }

  window.nextWord = function () { showWord(randomWord(currentWord)); };
  window.toggleHint = function () {
    var a = document.getElementById('hint-area');
    if (a) a.classList.toggle('hidden');
  };
  window.toggleTimer = function () { timerRunning ? stopTimer() : startTimer(); };

  function startTimer() {
    var wrap = document.getElementById('timer-wrap');
    if (wrap) wrap.classList.remove('hidden');
    timerSeconds = 120;
    timerRunning = true;
    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function tick() {
    updateDisplay();
    if (timerSeconds <= 0) { stopTimer(); timeUp(); return; }
    timerSeconds--;
  }

  window.stopTimer = function () {
    clearInterval(timerInterval);
    timerRunning = false;
    var wrap = document.getElementById('timer-wrap');
    if (wrap) wrap.classList.add('hidden');
  };

  function updateDisplay() {
    var m = Math.floor(timerSeconds / 60), s = timerSeconds % 60;
    var el = document.getElementById('timer-display');
    if (el) el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
  }

  function timeUp() {
    var el = document.getElementById('word-display');
    if (!el) return;
    var prev = el.textContent;
    el.textContent = "⏰ Time's Up!";
    setTimeout(function () { if (el.textContent === "⏰ Time's Up!") el.textContent = prev; }, 2000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.diff-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setDifficulty(btn.dataset.difficulty); });
    });
    document.querySelectorAll('.subset-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setSubset(btn.dataset.subset); });
    });

    // Honour the deep links from the homepage cards: land on the promised words.
    var qs = new URLSearchParams(location.search);
    var param = window.PAGE_SUBSET_PARAM;
    if (param && qs.get(param)) setSubset(qs.get(param), false);
    if (qs.get('difficulty')) setDifficulty(qs.get('difficulty'), false);

    updateBadge();
    showWord(randomWord());
  });

  // legacy compat
  window.startQuickGame = window.nextWord;
  window.nextQuickCharade = window.nextWord;
  window.pauseQuickGame = function () {};
  window.startGame = window.nextWord;
  window.nextCharade = window.nextWord;
})();
