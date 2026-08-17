// movie-themes.js — genre word banks for the homepage movie charades
// generator. Data only: script.js reads MOVIE_THEME_WORDS to build the
// pool behind the Action / Comedy / Romance / Horror / Bollywood filters.

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
  animation: {
    label: 'Animation',
    words: [
      { word: "The Lion King",      difficulty: "easy",   hint: "Cub held above a rock at sunrise, uncle with a scar" },
      { word: "Toy Story",          difficulty: "easy",   hint: "Toys drop and freeze whenever a human walks in" },
      { word: "Frozen",             difficulty: "easy",   hint: "Sister freezes a whole kingdom, builds an ice palace" },
      { word: "Finding Nemo",       difficulty: "easy",   hint: "Clownfish father crosses the ocean for his son" },
      { word: "Moana",              difficulty: "easy",   hint: "Girl sails past the reef to return a green stone" },
      { word: "Kung Fu Panda",      difficulty: "easy",   hint: "Chubby panda accidentally becomes a martial arts hero" },
      { word: "Up",                 difficulty: "medium", hint: "Old man lifts his house with a bundle of balloons" },
      { word: "WALL-E",             difficulty: "medium", hint: "Little robot tidies an abandoned Earth, falls in love" },
      { word: "Ratatouille",        difficulty: "medium", hint: "Rat cooks by pulling a chef's hair like puppet strings" },
      { word: "Inside Out",         difficulty: "medium", hint: "Five emotions run a control room inside a girl's head" },
      { word: "Zootopia",           difficulty: "medium", hint: "Rabbit cop and fox con artist, plus a very slow sloth" },
      { word: "How to Train Your Dragon", difficulty: "medium", hint: "Viking boy befriends the dragon he was meant to kill" },
      { word: "Spirited Away",      difficulty: "hard",   hint: "Girl works in a bathhouse for spirits to free her parents" },
      { word: "Into the Spider-Verse", difficulty: "hard", hint: "Many Spider-Men from different worlds, comic-book panels" },
      { word: "Princess Mononoke",  difficulty: "hard",   hint: "Girl raised by wolves fights for the forest gods" },
      { word: "Fantastic Mr Fox",   difficulty: "hard",   hint: "Stop-motion fox in a suit raids three farmers" }
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
