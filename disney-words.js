// disney-words.js — word bank for the Disney charades generator page.
// Same entry shape as charades-words.js: { word, category, difficulty, hint }
// Loaded only by /disney/ — it does not affect the homepage word pool.
//
// Each entry also carries group: "characters" | "movies" | "songs", which
// drives the sub-filter chips on the page. The sections used to exist only as
// comments here, so nothing could actually filter on them.

const DISNEY_CHARADES_WORDS = [

  // ── CHARACTERS ────────────────────────────────────────────
  { word: "Mickey Mouse",     category: "disney", group: "characters", difficulty: "easy",   hint: "Round ears, white gloves, red shorts" },
  { word: "Minnie Mouse",     category: "disney", group: "characters", difficulty: "easy",   hint: "Polka-dot bow on round ears" },
  { word: "Donald Duck",      category: "disney", group: "characters", difficulty: "easy",   hint: "Sailor hat, no trousers, very short temper" },
  { word: "Goofy",            category: "disney", group: "characters", difficulty: "easy",   hint: "Tall clumsy dog — 'A-hyuck!'" },
  { word: "Winnie the Pooh",  category: "disney", group: "characters", difficulty: "easy",   hint: "Yellow bear with his head stuck in a honey pot" },
  { word: "Simba",            category: "disney", group: "characters", difficulty: "easy",   hint: "Lion cub held up on a rock at sunrise" },
  { word: "Elsa",             category: "disney", group: "characters", difficulty: "easy",   hint: "Freezes everything she touches, then lets it go" },
  { word: "Olaf",             category: "disney", group: "characters", difficulty: "easy",   hint: "Snowman who dreams about summer" },
  { word: "Ariel",            category: "disney", group: "characters", difficulty: "easy",   hint: "Mermaid brushing her hair with a fork" },
  { word: "Cinderella",       category: "disney", group: "characters", difficulty: "easy",   hint: "Loses a glass slipper running from the ball" },
  { word: "Snow White",       category: "disney", group: "characters", difficulty: "easy",   hint: "Bites the apple, wakes up to seven small friends" },
  { word: "Buzz Lightyear",   category: "disney", group: "characters", difficulty: "easy",   hint: "'To infinity and beyond!' — pop-out wings" },
  { word: "Woody",            category: "disney", group: "characters", difficulty: "easy",   hint: "Cowboy doll with a pull string in his back" },
  { word: "Stitch",           category: "disney", group: "characters", difficulty: "medium", hint: "Blue alien pretending to be a Hawaiian dog" },
  { word: "Genie",            category: "disney", group: "characters", difficulty: "medium", hint: "Blue, smoky, and grants exactly three wishes" },
  { word: "Maleficent",       category: "disney", group: "characters", difficulty: "medium", hint: "Horned villain with a raven and a spinning wheel" },
  { word: "Ursula",           category: "disney", group: "characters", difficulty: "medium", hint: "Sea witch with tentacles who trades voices for legs" },
  { word: "Captain Hook",     category: "disney", group: "characters", difficulty: "medium", hint: "Pirate terrified of a ticking crocodile" },
  { word: "Cruella de Vil",   category: "disney", group: "characters", difficulty: "medium", hint: "Black-and-white hair, obsessed with puppy coats" },
  { word: "Mary Poppins",     category: "disney", group: "characters", difficulty: "medium", hint: "Nanny who lands by umbrella and snaps to tidy the room" },
  { word: "Peter Pan",        category: "disney", group: "characters", difficulty: "medium", hint: "Boy in green who refuses to grow up and can fly" },
  { word: "Tinker Bell",      category: "disney", group: "characters", difficulty: "medium", hint: "Tiny fairy trailing pixie dust" },
  { word: "Baymax",           category: "disney", group: "characters", difficulty: "hard",   hint: "Inflatable white robot nurse — 'On a scale of one to ten...'" },
  { word: "Scar",             category: "disney", group: "characters", difficulty: "hard",   hint: "Lion with a scarred eye who sings about being prepared" },
  { word: "Jafar",            category: "disney", group: "characters", difficulty: "hard",   hint: "Vizier with a cobra staff and a loud parrot" },

  // ── MOVIES ────────────────────────────────────────────────
  { word: "The Lion King",    category: "disney", group: "movies", difficulty: "easy",   hint: "Cub, uncle, stampede, and a rock at sunrise" },
  { word: "Frozen",           category: "disney", group: "movies", difficulty: "easy",   hint: "Two sisters, an ice palace, and a reindeer" },
  { word: "Toy Story",        category: "disney", group: "movies", difficulty: "easy",   hint: "Toys freeze whenever a human walks in" },
  { word: "Finding Nemo",     category: "disney", group: "movies", difficulty: "easy",   hint: "Clownfish dad crosses the ocean for his son" },
  { word: "Moana",            category: "disney", group: "movies", difficulty: "easy",   hint: "Girl sails past the reef to return a green stone" },
  { word: "Aladdin",          category: "disney", group: "movies", difficulty: "easy",   hint: "Magic lamp and a flying carpet ride" },
  { word: "Beauty and the Beast", category: "disney", group: "movies", difficulty: "easy", hint: "Enchanted rose, dancing candlestick, yellow gown" },
  { word: "Tangled",          category: "disney", group: "movies", difficulty: "medium", hint: "Very long glowing hair and floating lanterns" },
  { word: "Mulan",            category: "disney", group: "movies", difficulty: "medium", hint: "Cuts her hair to take her father's place in the army" },
  { word: "Encanto",          category: "disney", group: "movies", difficulty: "medium", hint: "Magic house in Colombia — 'We don't talk about...'" },
  { word: "Coco",             category: "disney", group: "movies", difficulty: "medium", hint: "Boy with a guitar crosses into the Land of the Dead" },
  { word: "Monsters Inc",     category: "disney", group: "movies", difficulty: "medium", hint: "Factory powered by children's screams" },
  { word: "The Incredibles",  category: "disney", group: "movies", difficulty: "medium", hint: "Superhero family in red suits — no capes!" },
  { word: "Ratatouille",      category: "disney", group: "movies", difficulty: "medium", hint: "Rat cooks by pulling a chef's hair like puppet strings" },
  { word: "Zootopia",         category: "disney", group: "movies", difficulty: "medium", hint: "Rabbit cop and a fox con artist crack a case" },
  { word: "Pinocchio",        category: "disney", group: "movies", difficulty: "hard",   hint: "Wooden puppet whose nose grows when he lies" },
  { word: "Fantasia",         category: "disney", group: "movies", difficulty: "hard",   hint: "Mouse in a wizard hat conducts marching brooms" },
  { word: "Hercules",         category: "disney", group: "movies", difficulty: "hard",   hint: "'Zero to hero' — Greek demigod trained by a satyr" },
  { word: "Lilo and Stitch",  category: "disney", group: "movies", difficulty: "hard",   hint: "Hawaiian girl adopts an escaped alien experiment" },
  { word: "The Aristocats",   category: "disney", group: "movies", difficulty: "hard",   hint: "Parisian cats kidnapped by the family butler" },

  // ── SONGS ─────────────────────────────────────────────────
  { word: "Let It Go",        category: "disney", group: "songs", difficulty: "easy",   hint: "Sung while building an ice palace on a mountain" },
  { word: "Hakuna Matata",    category: "disney", group: "songs", difficulty: "easy",   hint: "'No worries' — sung by a meerkat and a warthog" },
  { word: "A Whole New World",category: "disney", group: "songs", difficulty: "easy",   hint: "Duet performed on a flying carpet" },
  { word: "Under the Sea",    category: "disney", group: "songs", difficulty: "easy",   hint: "Crab conducts an underwater orchestra" },
  { word: "You've Got a Friend in Me", category: "disney", group: "songs", difficulty: "medium", hint: "Cowboy doll's theme about loyalty" },
  { word: "Circle of Life",   category: "disney", group: "songs", difficulty: "medium", hint: "Opening chant as animals gather at a rock" },
  { word: "How Far I'll Go",  category: "disney", group: "songs", difficulty: "medium", hint: "Sung standing on the shore, staring at the horizon" },
  { word: "Be Our Guest",     category: "disney", group: "songs", difficulty: "medium", hint: "Dinner service performed by dancing crockery" },
  { word: "Supercalifragilisticexpialidocious", category: "disney", group: "songs", difficulty: "hard", hint: "The longest word a nanny ever sang" },
  { word: "I'll Make a Man Out of You", category: "disney", group: "songs", difficulty: "hard", hint: "Army training montage song" }
];
