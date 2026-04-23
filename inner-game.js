// inner-game.js — category page game logic
// Requires charades-words.js loaded first
// Requires window.PAGE_CATEGORIES (array) and window.PAGE_LABEL (string)
(function () {
  var activeDiff = 'all';
  var currentWord = null;
  var timerInterval = null;
  var timerSeconds = 120;
  var timerRunning = false;

  function getWords() {
    var cats = window.PAGE_CATEGORIES || [];
    var all = (typeof CHARADES_WORDS !== 'undefined' ? CHARADES_WORDS : []);
    var words = cats.length ? all.filter(function (w) { return cats.indexOf(w.category) !== -1; }) : all;
    if (activeDiff !== 'all') words = words.filter(function (w) { return w.difficulty === activeDiff; });
    return words.length ? words : all;
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
      btn.addEventListener('click', function () {
        activeDiff = this.dataset.difficulty;
        document.querySelectorAll('.diff-btn').forEach(function (b) {
          b.classList.toggle('active', b.dataset.difficulty === activeDiff);
        });
        showWord(randomWord());
      });
    });
    var cb = document.getElementById('cat-badge');
    if (cb) cb.textContent = window.PAGE_LABEL || '';
    showWord(randomWord());
  });

  // legacy compat
  window.startQuickGame = window.nextWord;
  window.nextQuickCharade = window.nextWord;
  window.pauseQuickGame = function () {};
  window.startGame = window.nextWord;
  window.nextCharade = window.nextWord;
})();
