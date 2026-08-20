/**
 * curate-words.js — one-off editor for charades-words.js.
 *
 *   node tools/curate-words.js            # report only
 *   node tools/curate-words.js --write    # apply
 *
 * Two jobs:
 *
 * 1. Drop words that cannot be played. A charades word fails if a perfect
 *    mime still gives the guesser no route to the exact phrase — either the
 *    thing has no distinguishing gesture (Retirement Planning, Bouillabaisse)
 *    or the word is not in ordinary vocabulary (Orrery, Sepak Takraw). These
 *    look like impressive "hard" entries in a word list and are dead cards on
 *    a table.
 * 2. Refill each category to its stated count and grow christmas to 100+,
 *    which is the pack people actually print.
 *
 * Existing lines are left byte-for-byte alone; only flagged lines are removed
 * and new ones appended inside their section, padded to that section's own
 * column width, so the diff stays readable.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.resolve(__dirname, '..', 'charades-words.js');

// ── words to remove ────────────────────────────────────────────────────────
// Keyed by category so a same-named word elsewhere is never touched.
const REMOVE = {
  animals:   ['Quokka', 'Tapir', 'Mantis Shrimp', 'Pangolin'],
  // Abstract life admin: nothing to mime, and the guesser must land the exact
  // phrase. "Doing Taxes" and "Jury Duty" survive because they have a scene.
  adults:    ['Identity Theft', 'Retirement Planning', 'Dealing with Insurance',
              'Getting a Mortgage', 'Stock Market Trading', 'Adulting', 'Networking',
              'Going Viral', 'Starting a Business', 'Filing a Lawsuit', 'Writing a Will'],
  actions:   ['Aerial Silks'],
  // Museum-cabinet objects. Also Guillotine, which is mimeable but not
  // something to hand a family at a kitchen table.
  objects:   ['Orrery', 'Astrolabe', 'Stereoscope', 'Daguerreotype', 'Zoetrope',
              'Sextant', 'Sousaphone', 'Trebuchet', 'Guillotine'],
  // Every dish is mimed by eating it; only shapes and rituals distinguish one
  // from another, which these do not have.
  food:      ['Ossobuco', 'Rendang', 'Bouillabaisse', 'Bibimbap', 'Shakshuka',
              'Goulash', 'Ceviche', 'Coq au Vin', 'Baklava', 'Crème Brûlée',
              'Soufflé', 'Bruschetta'],
  // Pentathlon and Modern Pentathlon were the same card twice.
  sports:    ['Sepak Takraw', 'Jai Alai', 'Kabaddi', 'Underwater Hockey',
              'Canoe Polo', 'Modern Pentathlon', 'Pentathlon'],
  halloween: ['Wendigo', 'Necromancer', 'Doppelganger', 'Shadow People',
              'Samhain', 'Catacombs', 'Blood Moon'],
  christmas: ['Wassailing', 'Feast of the Seven Fishes', 'St. Nicholas Day',
              'Winter Solstice', 'Pantomime', 'Boxing Day'],
  kids:      ['Astronomy', 'Coding'],
  // Thinkers with no signature gesture. Cleopatra appeared twice; the second
  // copy goes and the name stays.
  famous:    ['Copernicus', 'Aristotle', 'Karl Marx'],
};

// Cleopatra is listed twice in famous — drop the later copy only.
const DEDUPE = { famous: ['Cleopatra'] };

// ── replacements ───────────────────────────────────────────────────────────
const e = (word, hint) => ({ word, difficulty: 'easy', hint });
const m = (word, hint) => ({ word, difficulty: 'medium', hint });
const h = (word, hint) => ({ word, difficulty: 'hard', hint });

const ADD = {
  animals: [
    e('Squirrel', 'Bushy tail, darts up trees, buries nuts'),
    e('Owl', 'Night bird with huge eyes that hoots and swivels its head'),
    e('Shark', 'Fin cutting through water, rows of sharp teeth'),
    m('Camel', 'Desert animal with humps that goes days without water'),
  ],
  adults: [
    e('Folding Laundry', 'The basket that never empties'),
    e('Snoozing the Alarm', 'Five more minutes, six times over'),
    e('Losing Your Car Keys', 'Patting every pocket, tearing up the sofa'),
    e('Missing the Bus', 'Running, waving, watching it pull away'),
    e('Mowing the Lawn', 'Pushing a loud machine in straight lines'),
    m('Waiting on Hold', 'Phone to your ear, hold music, slow despair'),
    m('Changing a Flat Tire', 'Jack, lug nuts, and a very dirty shirt'),
    m('Hosting a Dinner Party', 'Cooking, cleaning and smiling all at once'),
    m('Karaoke Night', 'Confidence, a microphone, and no key at all'),
    h('Assembling Flat-Pack Furniture', 'Hex key, wordless diagram, one screw left over'),
    h('Nursing a Hangover', 'Sunglasses indoors, water, deep regret'),
  ],
  actions: [
    m('Line Dancing', 'A room of people stepping and turning in unison'),
  ],
  objects: [
    e('Toothbrush', 'Small brush you scrub your teeth with'),
    e('Scissors', 'Two blades on finger loops that cut paper'),
    e('Guitar', 'Strum the strings and press the neck'),
    e('Camera', 'Hold it up, one eye closed, press the shutter'),
    e('Hammer', 'Swing it to drive a nail'),
    m('Vacuum Cleaner', 'Noisy machine pushed back and forth over the carpet'),
    m('Wheelbarrow', 'One wheel, two handles, hauls dirt in the garden'),
    m('Accordion', 'Squeeze box you pull apart and push together'),
    h('Revolving Door', 'Walk into a hotel through a spinning glass drum'),
  ],
  food: [
    e('Corn on the Cob', 'Eaten in rows, like a typewriter'),
    e('Watermelon', 'Huge green fruit, red inside, spit the seeds'),
    e('Pancakes', 'Flipped in a pan, stacked with syrup'),
    e('Fried Egg', 'Cracked into a pan, sunny side up'),
    e('Lollipop', 'Hard candy on a stick'),
    m('Cotton Candy', 'Pink cloud of spun sugar on a paper cone'),
    m('Nachos', 'Chips buried under melted cheese, pulling long strings'),
    m('Barbecue Ribs', 'Eaten with both hands, sauce everywhere'),
    m('Chili Pepper', 'One bite and you are fanning your mouth'),
    m('Bubble Tea', 'Fat straw, chewy pearls at the bottom'),
    h('Fortune Cookie', 'Snap it open and read the paper inside'),
    h('Oyster', 'Pried open with a knife and swallowed whole'),
  ],
  sports: [
    e('Ice Hockey', 'Skates, a stick, and a puck slapped into a net'),
    e('Badminton', 'Racket sport with a feathered shuttlecock'),
    e('Darts', 'Throwing small arrows at a numbered board'),
    m('Rugby', 'Oval ball, no helmets, everyone piles on'),
    m('Cricket', 'Bat, wickets, and a bowler running up to throw'),
    m('Sumo Wrestling', 'Two heavy wrestlers stamping and shoving in a ring'),
    m('Figure Skating', 'Spins and jumps on ice, arms held high'),
  ],
  halloween: [
    e('Carving a Pumpkin', 'Scooping out seeds and cutting a face'),
    e('Bobbing for Apples', 'Hands behind your back, face in the water'),
    e('Costume Party', 'Everyone arrives as someone else'),
    e('Broomstick Ride', 'Straddle the handle and take off into the night'),
    m('Mad Scientist', 'Wild hair, bubbling flasks, maniacal laugh'),
    m('Grim Reaper', 'Black hood and a long curved scythe'),
    h('Sleepy Hollow', 'A rider with no head chases you through the woods'),
  ],
  kids: [
    e('Playing Catch', 'Throwing a ball back and forth'),
    e('Feeding the Ducks', 'Tossing crumbs at the edge of a pond'),
  ],
  famous: [
    m('Charlie Chaplin', 'Silent film tramp — bowler hat, cane, waddling walk'),
    m('Bob Marley', 'Reggae legend with dreadlocks and a guitar'),
    m('Usain Bolt', 'Fastest sprinter alive, strikes a lightning-bolt pose'),
    m('Freddie Mercury', 'Queen frontman — moustache, fist in the air, huge voice'),
  ],
  christmas: [
    // easy
    e('Sleigh Ride', 'Gliding over snow behind the reindeer'),
    e('Snowball Fight', 'Scooping, packing and throwing snow'),
    e('Making Snow Angels', 'Lie back in the snow and sweep your arms'),
    e('Hanging Stockings', 'Pinning socks along the fireplace'),
    e('Opening a Present', 'Tearing paper off a box on Christmas morning'),
    e('Hot Chocolate', 'Warm mug with marshmallows floating on top'),
    e('Sledding Down a Hill', 'Sitting on a sled and racing to the bottom'),
    e('Ice Skating', 'Gliding around a frozen rink'),
    e('Santa Hat', 'Red cap with a white bobble on the end'),
    e('Snowflake', 'Tiny six-sided crystal drifting down'),
    e('Chimney', 'The brick shaft Santa somehow squeezes down'),
    e('Christmas Card', 'Writing and posting greetings to everybody'),
    e('Christmas Ornament', 'Shiny ball hung on a branch'),
    e('Tinsel', 'Sparkly strands draped over the tree'),
    e('Milk and Cookies for Santa', 'A plate left out by the fireplace'),
    e('Warm Mittens', 'Pulling thick gloves onto cold hands'),
    e('Winter Scarf', 'Wrapping wool around your neck against the cold'),
    e('Shoveling Snow', 'Clearing the driveway before anyone can leave'),
    e('Jingle Bells', 'The bells that ring all the way'),
    e('Decorating Cookies', 'Icing and sprinkles on gingerbread shapes'),
    e('Toy Train', 'Little engine circling the base of the tree'),
    e('Reindeer Antlers Headband', 'Fake antlers worn all through December'),
    e('Snow Globe', 'Shake it and watch the flakes settle'),
    e('Wrapping Paper', 'The roll that is always six inches too short'),
    // medium
    m('Hanging Christmas Lights', 'Up a ladder, stapling bulbs along the roof'),
    m('Tangled String of Lights', 'An hour of unknotting before anything glows'),
    m('Roast Turkey', 'The big bird carried out and carved at the table'),
    m('Christmas Pudding', 'Dark steamed dessert set alight at the table'),
    m('Eggnog', 'Thick spiced holiday drink with nutmeg on top'),
    m('Mulled Wine', 'Hot spiced wine steaming in a mug'),
    m('Roasting Chestnuts', 'Nuts popping over an open fire'),
    m('Christmas Market', 'Wooden stalls, lights and food in the town square'),
    m('Cutting Down a Christmas Tree', 'Sawing at the trunk and hauling it home'),
    m('North Pole', 'Where the workshop and all the elves are'),
    m("Santa's Workshop", 'Elves at benches building toys all year'),
    m('Naughty or Nice List', 'Santa checking the names twice'),
    m('Three Wise Men', 'Travellers following a star with gifts'),
    m('Baby in the Manger', 'The nativity scene at the centre of it all'),
    m('Christmas Pageant', 'Children in tea towels performing the nativity'),
    m('Angel on the Tree', 'The figure placed at the very top'),
    m('The Grinch', 'Green grump who tries to steal the whole holiday'),
    m('Home Alone', 'Boy left behind sets traps for two burglars'),
    m('Polar Express', 'Night train carrying children to the North Pole'),
    m('Frosty the Snowman', 'Snowman brought to life by a magic hat'),
    m('Rudolph the Red-Nosed Reindeer', 'The one with the glowing nose who leads the sleigh'),
    m('Regifting', 'Passing on a present you never wanted'),
    m('Matching Family Pajamas', 'Everyone in the same print for the photo'),
    m('Holiday Travel', 'Airports, queues and too much luggage'),
    // hard
    h('Snowed In', 'Nobody is going anywhere until the plough comes'),
    h('The Return Line', 'Standing in line the day after with a receipt'),
    h("It's a Wonderful Life", 'Angel shows a man what the town would be without him'),
    h('Miracle on 34th Street', 'A courtroom is asked to prove Santa is real'),
    h('White Christmas', 'The song everyone dreams of, and the film about it'),
    h('Silent Night', 'The quietest, most famous carol of all'),
    h('Deck the Halls', 'Boughs of holly and a chorus of fa-la-la'),
    h('Twelve Days of Christmas', 'A song that counts gifts all the way up'),
    h('Partridge in a Pear Tree', 'The very first gift in that song'),
    h('The Little Drummer Boy', 'A boy with nothing to give but a drum'),
    h('Midnight Mass', 'The late church service on Christmas Eve'),
    h('Christmas Cracker', 'Two people pull, it bangs, out falls a paper crown'),
    h('Panettone', 'Tall Italian sweet bread eaten at Christmas'),
    h('Yule Goat', 'Straw goat from Nordic Christmas tradition'),
    h('La Befana', 'Italian witch who brings gifts on a broomstick in January'),
    h('Sinterklaas', 'Dutch gift-bringer who arrives by steamboat in December'),
    h('Christmas Truce', 'Soldiers stopped fighting and played football in 1914'),
    h('Christmas Pickle', 'Glass pickle hidden on the tree for a child to find'),
  ],
};

// ── rewrite ────────────────────────────────────────────────────────────────
const SECTION = /^\s*\/\/ ── ([A-Z& ]+?) \((\d+)\) ─+$/;
const CATEGORY_OF = {
  'ANIMALS': 'animals', 'MOVIES': 'movies', 'KIDS': 'kids', 'ADULTS': 'adults',
  'ACTIONS': 'actions', 'CHRISTMAS': 'christmas', 'HALLOWEEN': 'halloween',
  'FAMOUS PEOPLE': 'famous', 'OBJECTS': 'objects', 'FOOD & DRINK': 'food',
  'SPORTS': 'sports', 'TV SHOWS': 'tvshows',
};

function esc(s) {
  // Hints are written with plain apostrophes, so double-quoted strings need
  // nothing escaped beyond the quote character itself.
  return s.replace(/"/g, '\\"');
}

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
const out = [];
const removed = [];
const added = [];

let cat = null;         // current section's category
let pad = 0;            // width of the word column in this section
let lastEntry = -1;     // index in `out` of the last entry line of the section
let seen = new Set();

function flushSection() {
  if (!cat || lastEntry < 0) return;
  const extra = ADD[cat] || [];
  const rows = extra.map(x =>
    `  { word: ${(`"${esc(x.word)}",`).padEnd(pad)} category: "${cat}", ` +
    `difficulty: "${x.difficulty}",${x.difficulty === 'easy' ? '   ' : x.difficulty === 'hard' ? '   ' : ' '}` +
    `hint: "${esc(x.hint)}" },`);
  out.splice(lastEntry + 1, 0, ...rows);
  added.push(...extra.map(x => `${cat}/${x.word}`));
}

for (const line of lines) {
  const sec = line.match(SECTION);
  if (sec) {
    flushSection();
    cat = CATEGORY_OF[sec[1].trim()];
    if (!cat) throw new Error('unmapped section: ' + sec[1]);
    seen = new Set();
    pad = 0;
    lastEntry = -1;
    out.push(line);              // count is patched in a second pass below
    continue;
  }

  const entry = line.match(/^\s*\{ word: ("(?:[^"\\]|\\.)*"),\s+category:/);
  if (entry && cat) {
    const word = JSON.parse(entry[1]);
    pad = Math.max(pad, entry[1].length + 1);
    const isDupe = seen.has(word) && (DEDUPE[cat] || []).includes(word);
    if ((REMOVE[cat] || []).includes(word) || isDupe) {
      removed.push(`${cat}/${word}${isDupe ? ' (duplicate)' : ''}`);
      continue;
    }
    seen.add(word);
    lastEntry = out.length;
  }
  out.push(line);
}
flushSection();

// Second pass: fix the (n) in every section header from the real content.
const counts = {};
for (const line of out) {
  const entry = line.match(/category: "(\w+)"/);
  if (entry) counts[entry[1]] = (counts[entry[1]] || 0) + 1;
}
const final = out.map(line => {
  const sec = line.match(SECTION);
  if (!sec) return line;
  const c = counts[CATEGORY_OF[sec[1].trim()]];
  return line.replace(/\((\d+)\)/, `(${c})`);
});

console.log(`removed ${removed.length}:`);
removed.forEach(r => console.log('  -', r));
console.log(`added ${added.length}`);
console.log('\nfinal counts:');
Object.entries(counts).forEach(([k, v]) => console.log('  ' + k.padEnd(12), v));
console.log('  TOTAL', Object.values(counts).reduce((a, b) => a + b, 0));

if (process.argv.includes('--write')) {
  fs.writeFileSync(FILE, final.join('\n'));
  console.log('\nwritten:', FILE);
}
