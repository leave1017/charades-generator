// movie-themes.js — genre word banks + in-page generator for the
// "Movie & TV Charades Themes" section on the homepage.
// Self-contained: does not touch script.js state or the main game card.

const MOVIE_THEME_WORDS = {
  action: {
    label: 'Action',
    words: [
      { word: "Die Hard",           difficulty: "easy",   hint: "Cop in a vest crawls through air vents on Christmas Eve" },
      { word: "Mission Impossible", difficulty: "easy",   hint: "Spy dangles from a wire inches above the floor" },
      { word: "Jurassic Park",      difficulty: "easy",   hint: "Ripples in a water glass, then a T-Rex" },
      { word: "The Matrix",         difficulty: "easy",   hint: "Bend backwards in slow motion to dodge bullets" },
      { word: "Top Gun",            difficulty: "easy",   hint: "Fighter pilots, aviator sunglasses, beach volleyball" },
      { word: "Fast and Furious",   difficulty: "easy",   hint: "Street racing crew that only talks about family" },
      { word: "Indiana Jones",      difficulty: "medium", hint: "Whip, fedora, and a giant rolling boulder" },
      { word: "Black Panther",      difficulty: "medium", hint: "Crossed arms salute — 'Wakanda Forever'" },
      { word: "John Wick",          difficulty: "medium", hint: "Retired hitman comes back over a stolen car and a dog" },
      { word: "Mad Max Fury Road",  difficulty: "medium", hint: "Desert convoy chase with a guitarist on the truck" },
      { word: "Gladiator",          difficulty: "medium", hint: "'Are you not entertained?' — sword raised in the arena" },
      { word: "The Bourne Identity",difficulty: "medium", hint: "Amnesiac agent fights with a rolled-up magazine" },
      { word: "Terminator",         difficulty: "hard",   hint: "Robot with a red eye — 'I'll be back'" },
      { word: "Casino Royale",      difficulty: "hard",   hint: "Bond orders a martini, then plays high-stakes poker" },
      { word: "Kill Bill",          difficulty: "hard",   hint: "Yellow tracksuit, samurai sword, revenge list" },
      { word: "Speed",              difficulty: "hard",   hint: "Bus that explodes if it drops below 50 mph" }
    ]
  },
  comedy: {
    label: 'Comedy',
    words: [
      { word: "Home Alone",         difficulty: "easy",   hint: "Hands on cheeks, screaming face" },
      { word: "Shrek",              difficulty: "easy",   hint: "Green ogre and a very talkative donkey" },
      { word: "Mrs Doubtfire",      difficulty: "easy",   hint: "Dad disguises himself as an elderly nanny" },
      { word: "Elf",                difficulty: "easy",   hint: "Grown man in green tights eats spaghetti with syrup" },
      { word: "Night at the Museum",difficulty: "easy",   hint: "Museum guard watches the exhibits come alive" },
      { word: "Despicable Me",      difficulty: "easy",   hint: "Supervillain with an army of yellow minions" },
      { word: "Mean Girls",         difficulty: "medium", hint: "'On Wednesdays we wear pink'" },
      { word: "Bridesmaids",        difficulty: "medium", hint: "Maid of honor ruins a bridal shop with food poisoning" },
      { word: "Ghostbusters",       difficulty: "medium", hint: "Proton pack on the back — 'Who you gonna call?'" },
      { word: "The Hangover",       difficulty: "medium", hint: "Friends wake in Vegas with a tiger and no memory" },
      { word: "Ferris Buellers Day Off", difficulty: "medium", hint: "Student fakes sick and lip-syncs on a parade float" },
      { word: "Anchorman",          difficulty: "medium", hint: "Mustached 70s news anchor plays jazz flute" },
      { word: "Groundhog Day",      difficulty: "hard",   hint: "Weatherman relives the same day over and over" },
      { word: "Monty Python",       difficulty: "hard",   hint: "Knights gallop with coconut shells for hooves" },
      { word: "The Grand Budapest Hotel", difficulty: "hard", hint: "Pink hotel, pastry box, very symmetrical shots" },
      { word: "Airplane",           difficulty: "hard",   hint: "'Surely you can't be serious' — deadpan disaster spoof" }
    ]
  },
  romance: {
    label: 'Romance',
    words: [
      { word: "Titanic",            difficulty: "easy",   hint: "Arms spread wide at the bow of a sinking ship" },
      { word: "Cinderella",         difficulty: "easy",   hint: "Glass slipper left on the palace stairs at midnight" },
      { word: "Beauty and the Beast", difficulty: "easy", hint: "Ballroom dance in a yellow gown with a cursed prince" },
      { word: "The Notebook",       difficulty: "easy",   hint: "Kiss in the rain beside a rowing boat" },
      { word: "Grease",             difficulty: "easy",   hint: "Leather jackets, poodle skirts, 'You're the one that I want'" },
      { word: "Romeo and Juliet",   difficulty: "easy",   hint: "Balcony scene between two feuding families" },
      { word: "La La Land",         difficulty: "medium", hint: "Jazz pianist and actress dance in the LA hills" },
      { word: "Pretty Woman",       difficulty: "medium", hint: "Shopping spree on Rodeo Drive in thigh-high boots" },
      { word: "Notting Hill",       difficulty: "medium", hint: "'Just a girl standing in front of a boy' — London bookshop" },
      { word: "Dirty Dancing",      difficulty: "medium", hint: "The lift — 'Nobody puts Baby in a corner'" },
      { word: "Pride and Prejudice",difficulty: "medium", hint: "Mr Darcy, letters, and a very stiff proposal in the rain" },
      { word: "Ten Things I Hate About You", difficulty: "medium", hint: "Serenade with a marching band on the bleachers" },
      { word: "Eternal Sunshine",   difficulty: "hard",   hint: "Couple erase each other from their memories" },
      { word: "Casablanca",         difficulty: "hard",   hint: "'Here's looking at you, kid' — airport farewell in fog" },
      { word: "Call Me By Your Name", difficulty: "hard", hint: "Italian summer, bicycles, peaches, one long goodbye" },
      { word: "Before Sunrise",     difficulty: "hard",   hint: "Two strangers walk and talk through Vienna all night" }
    ]
  },
  horror: {
    label: 'Horror',
    words: [
      { word: "Jaws",               difficulty: "easy",   hint: "Fin above the water, two ominous notes" },
      { word: "Scream",             difficulty: "easy",   hint: "Ghost-face mask and a ringing phone" },
      { word: "Frankenstein",       difficulty: "easy",   hint: "Stiff-armed monster with bolts in its neck" },
      { word: "Dracula",            difficulty: "easy",   hint: "Cape over the face, fangs, and a coffin" },
      { word: "The Mummy",          difficulty: "easy",   hint: "Bandaged figure shuffles out of a sarcophagus" },
      { word: "Ghostbusters",       difficulty: "easy",   hint: "Marshmallow man stomps through New York" },
      { word: "The Shining",        difficulty: "medium", hint: "Axe through the door — 'Here's Johnny!'" },
      { word: "It",                 difficulty: "medium", hint: "Clown with a red balloon in a storm drain" },
      { word: "Get Out",            difficulty: "medium", hint: "Teacup, a tapping spoon, and the sunken place" },
      { word: "A Quiet Place",      difficulty: "medium", hint: "Family that must never make a sound" },
      { word: "Poltergeist",        difficulty: "medium", hint: "'They're heeere' — girl talks to the TV static" },
      { word: "The Exorcist",       difficulty: "medium", hint: "Possessed girl and a priest with holy water" },
      { word: "The Blair Witch Project", difficulty: "hard", hint: "Shaky camcorder, lost in the woods, crying into the lens" },
      { word: "Hereditary",         difficulty: "hard",   hint: "Miniature dollhouses and a tongue-clicking sound" },
      { word: "The Babadook",       difficulty: "hard",   hint: "Pop-up book unleashes a top-hatted shadow" },
      { word: "Nosferatu",          difficulty: "hard",   hint: "Silent-film vampire with long fingers climbing the stairs" }
    ]
  },
  bollywood: {
    label: 'Bollywood',
    words: [
      { word: "Sholay",             difficulty: "easy",   hint: "Two friends on one motorbike take on a bandit" },
      { word: "Dangal",             difficulty: "easy",   hint: "Father trains his daughters to become wrestlers" },
      { word: "3 Idiots",           difficulty: "easy",   hint: "Engineering students and 'All is well'" },
      { word: "Krrish",             difficulty: "easy",   hint: "Masked Indian superhero in a long black coat" },
      { word: "Chennai Express",    difficulty: "easy",   hint: "Whole story happens on a runaway train journey south" },
      { word: "Bajrangi Bhaijaan",  difficulty: "easy",   hint: "Man walks a lost mute girl back across the border" },
      { word: "Dilwale Dulhania Le Jayenge", difficulty: "medium", hint: "Hand reaching from a moving train door" },
      { word: "Kabhi Khushi Kabhie Gham", difficulty: "medium", hint: "Big family, bigger tears, helicopter arrival" },
      { word: "Lagaan",             difficulty: "medium", hint: "Village plays cricket against colonial officers to cancel a tax" },
      { word: "Devdas",             difficulty: "medium", hint: "Heartbroken man, huge palace sets, a lamp-lit dance" },
      { word: "Zindagi Na Milegi Dobara", difficulty: "medium", hint: "Three friends road trip through Spain and skydive" },
      { word: "Om Shanti Om",       difficulty: "medium", hint: "Film extra reborn as a superstar seeking revenge" },
      { word: "Mughal-e-Azam",      difficulty: "hard",   hint: "Prince and court dancer defy the emperor in a mirrored hall" },
      { word: "Gully Boy",          difficulty: "hard",   hint: "Mumbai street rapper battles his way out of the slums" },
      { word: "Kahaani",            difficulty: "hard",   hint: "Pregnant woman searches Kolkata for a missing husband" },
      { word: "Andhadhun",          difficulty: "hard",   hint: "Pianist pretending to be blind witnesses a murder" }
    ]
  }
};

(function () {
  var activeTheme = null;
  var currentWord = null;

  function el(id) { return document.getElementById(id); }

  function pick(theme, exclude) {
    var list = MOVIE_THEME_WORDS[theme] ? MOVIE_THEME_WORDS[theme].words : [];
    if (!list.length) return null;
    var pool = exclude ? list.filter(function (w) { return w.word !== exclude; }) : list;
    if (!pool.length) pool = list;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function render(wordObj) {
    if (!wordObj) return;
    currentWord = wordObj;

    var display = el('theme-word-display');
    if (display) {
      display.textContent = wordObj.word;
      display.classList.remove('word-pop');
      void display.offsetWidth;
      display.classList.add('word-pop');
    }

    var badge = el('theme-cat-badge');
    if (badge && activeTheme) badge.textContent = MOVIE_THEME_WORDS[activeTheme].label;

    var diffBadge = el('theme-diff-badge');
    if (diffBadge) {
      diffBadge.textContent = wordObj.difficulty.charAt(0).toUpperCase() + wordObj.difficulty.slice(1);
      diffBadge.className = 'text-xs font-semibold px-3 py-1 rounded-full';
      if (wordObj.difficulty === 'easy') diffBadge.classList.add('bg-green-100', 'text-green-700');
      else if (wordObj.difficulty === 'medium') diffBadge.classList.add('bg-yellow-100', 'text-yellow-700');
      else diffBadge.classList.add('bg-red-100', 'text-red-700');
    }

    el('theme-hint-area')?.classList.add('hidden');
  }

  function selectMovieTheme(theme) {
    if (!MOVIE_THEME_WORDS[theme]) return;
    activeTheme = theme;
    document.querySelectorAll('.movie-theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    el('theme-result')?.classList.remove('hidden');
    render(pick(theme));
  }

  function nextThemeWord() {
    if (!activeTheme) return;
    render(pick(activeTheme, currentWord && currentWord.word));
  }

  function toggleThemeHint() {
    var area = el('theme-hint-area');
    var text = el('theme-hint-text');
    if (!area || !text || !currentWord) return;
    if (area.classList.contains('hidden')) {
      text.textContent = currentWord.hint ||
        'Starts with "' + currentWord.word[0].toUpperCase() + '"';
      area.classList.remove('hidden');
    } else {
      area.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.movie-theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { selectMovieTheme(btn.dataset.theme); });
    });
  });

  window.selectMovieTheme = selectMovieTheme;
  window.nextThemeWord   = nextThemeWord;
  window.toggleThemeHint = toggleThemeHint;
})();
