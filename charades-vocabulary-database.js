// 统一词汇库 - 每种类型扩充到100个词汇
// Unified Charades Vocabulary Database - 100 words per category

const CHARADES_VOCABULARY = {
  
  // =======================
  // ADULT CHARADES (成人词汇)
  // =======================
  
  adult: {
    easy: [
      // 基础动作和物品 (20个)
      'Movie', 'Book', 'Action', 'Animal', 'Food', 'Sport', 'Job', 'Hobby', 'Place', 'Object',
      'Dancing', 'Singing', 'Cooking', 'Reading', 'Writing', 'Painting', 'Swimming', 'Running', 'Jumping', 'Climbing',
      
      // 日常活动 (20个)
      'Shopping', 'Driving', 'Walking', 'Sleeping', 'Eating', 'Drinking', 'Laughing', 'Crying', 'Talking', 'Listening',
      'Watching', 'Playing', 'Working', 'Studying', 'Teaching', 'Learning', 'Helping', 'Cleaning', 'Building', 'Fixing',
      
      // 情绪和感受 (20个)
      'Happy', 'Sad', 'Angry', 'Excited', 'Tired', 'Hungry', 'Thirsty', 'Cold', 'Hot', 'Scared',
      'Brave', 'Calm', 'Nervous', 'Proud', 'Shy', 'Curious', 'Bored', 'Surprised', 'Confused', 'Relaxed',
      
      // 职业 (20个)
      'Teacher', 'Doctor', 'Police', 'Firefighter', 'Chef', 'Artist', 'Musician', 'Farmer', 'Builder', 'Driver',
      'Nurse', 'Lawyer', 'Engineer', 'Scientist', 'Writer', 'Actor', 'Singer', 'Dancer', 'Photographer', 'Designer',
      
      // 运动和游戏 (20个)
      'Football', 'Basketball', 'Tennis', 'Golf', 'Baseball', 'Soccer', 'Hockey', 'Bowling', 'Fishing', 'Hiking',
      'Skiing', 'Surfing', 'Cycling', 'Yoga', 'Chess', 'Cards', 'Puzzle', 'Board Game', 'Video Game', 'Karate'
    ],
    
    medium: [
      // 电影类型和娱乐 (25个)
      'Romantic Comedy', 'Science Fiction', 'Horror Movie', 'Action Thriller', 'Documentary', 'Animated Film', 'Musical Theater', 'Stand-up Comedy', 'Reality TV', 'Game Show',
      'Talk Show', 'News Broadcast', 'Sports Commentary', 'Weather Forecast', 'Radio Drama', 'Podcast', 'YouTube Video', 'Social Media', 'Streaming Service', 'Concert Hall',
      'Opera House', 'Art Gallery', 'Museum', 'Theme Park', 'Carnival',
      
      // 历史和文化 (25个)
      'Ancient Rome', 'Medieval Times', 'Renaissance Period', 'Industrial Revolution', 'World War', 'Cold War', 'Space Race', 'Cultural Revolution', 'Civil Rights', 'Women\'s Liberation',
      'Greek Mythology', 'Egyptian Pharaoh', 'Viking Warrior', 'Samurai Code', 'Native American', 'Aboriginal Culture', 'African Tribe', 'European Monarchy', 'Asian Philosophy', 'Latin America',
      'Immigration', 'Colonization', 'Independence Day', 'Revolution', 'Democracy',
      
      // 科学技术 (25个)
      'Artificial Intelligence', 'Virtual Reality', 'Smartphone', 'Social Network', 'Cloud Computing', 'Genetic Engineering', 'Renewable Energy', 'Climate Change', 'Space Exploration', 'Robotics',
      'Biotechnology', 'Nanotechnology', 'Quantum Computer', 'Solar Panel', 'Electric Car', 'Satellite', 'Telescope', 'Microscope', 'Laboratory', 'Research',
      'Innovation', 'Patent', 'Invention', 'Discovery', 'Experiment',
      
      // 商业和经济 (25个)
      'Stock Market', 'Real Estate', 'Cryptocurrency', 'Online Shopping', 'Startup Company', 'Business Meeting', 'Marketing Campaign', 'Brand Strategy', 'Customer Service', 'Supply Chain',
      'Global Economy', 'Financial Crisis', 'Economic Growth', 'Inflation Rate', 'Exchange Rate', 'Investment Portfolio', 'Venture Capital', 'Entrepreneurship', 'Corporate Culture', 'Work-Life Balance',
      'Remote Work', 'Freelancing', 'Gig Economy', 'Digital Marketing', 'E-commerce'
    ],
    
    hard: [
      // 哲学和心理学 (25个)
      'Existentialism', 'Nihilism', 'Stoicism', 'Utilitarianism', 'Determinism', 'Free Will', 'Consciousness', 'Subconscious', 'Cognitive Dissonance', 'Confirmation Bias',
      'Gestalt Psychology', 'Behavioral Economics', 'Game Theory', 'Social Psychology', 'Developmental Psychology', 'Neuroplasticity', 'Emotional Intelligence', 'Mindfulness', 'Meditation', 'Self-Actualization',
      'Transcendence', 'Enlightenment', 'Wisdom', 'Ethics', 'Morality',
      
      // 科学理论 (25个)
      'Quantum Physics', 'String Theory', 'Theory of Relativity', 'Evolution', 'Natural Selection', 'DNA Sequencing', 'Gene Therapy', 'Stem Cell Research', 'Cloning', 'CRISPR Technology',
      'Particle Physics', 'Nuclear Fusion', 'Black Hole', 'Dark Matter', 'Multiverse Theory', 'Chaos Theory', 'Complexity Science', 'Systems Thinking', 'Emergence', 'Entropy',
      'Thermodynamics', 'Electromagnetism', 'Gravitational Waves', 'Quantum Entanglement', 'Uncertainty Principle',
      
      // 社会学和政治学 (25个)
      'Social Stratification', 'Cultural Hegemony', 'Postmodernism', 'Globalization', 'Multiculturalism', 'Identity Politics', 'Social Justice', 'Human Rights', 'Democracy', 'Authoritarianism',
      'Totalitarianism', 'Capitalism', 'Socialism', 'Communism', 'Anarchism', 'Liberalism', 'Conservatism', 'Nationalism', 'Internationalism', 'Diplomacy',
      'Geopolitics', 'International Relations', 'United Nations', 'European Union', 'NATO',
      
      // 艺术和文学 (25个)
      'Abstract Expressionism', 'Surrealism', 'Impressionism', 'Cubism', 'Minimalism', 'Pop Art', 'Conceptual Art', 'Performance Art', 'Installation Art', 'Digital Art',
      'Romanticism', 'Realism', 'Modernism', 'Postmodernism', 'Magical Realism', 'Stream of Consciousness', 'Allegory', 'Metaphor', 'Symbolism', 'Irony',
      'Tragedy', 'Comedy', 'Satire', 'Epic Poetry', 'Haiku'
    ]
  },
  
  // =======================
  // KIDS CHARADES (儿童词汇)
  // =======================
  
  kids: {
    disney: [
      // 经典迪士尼角色 (35个)
      'Mickey Mouse', 'Minnie Mouse', 'Donald Duck', 'Goofy', 'Pluto', 'Elsa', 'Anna', 'Olaf', 'Simba', 'Timon',
      'Pumbaa', 'Mufasa', 'Buzz Lightyear', 'Woody', 'Ariel', 'Flounder', 'Sebastian', 'Belle', 'Beast', 'Gaston',
      'Aladdin', 'Jasmine', 'Genie', 'Jafar', 'Mulan', 'Mushu', 'Moana', 'Maui', 'Rapunzel', 'Flynn Rider',
      'Snow White', 'Seven Dwarfs', 'Cinderella', 'Fairy Godmother', 'Prince Charming',
      
      // 迪士尼电影 (30个)
      'Frozen', 'The Lion King', 'Toy Story', 'Finding Nemo', 'Monsters Inc', 'The Incredibles', 'Cars', 'Up', 'Wall-E', 'Ratatouille',
      'Inside Out', 'Coco', 'Moana', 'Zootopia', 'Big Hero 6', 'Wreck-It Ralph', 'Tangled', 'Princess and the Frog', 'Bolt', 'Chicken Little',
      'Meet the Robinsons', 'Treasure Planet', 'Atlantis', 'Tarzan', 'Hercules', 'Pocahontas', 'The Hunchback of Notre Dame', 'Aladdin', 'Beauty and the Beast', 'The Little Mermaid',
      
      // 迪士尼物品和地点 (25个)
      'Magic Wand', 'Glass Slipper', 'Magic Mirror', 'Flying Carpet', 'Genie Lamp', 'Poison Apple', 'Magic Castle', 'Fairy Tale', 'Princess Crown', 'Royal Ball',
      'Enchanted Forest', 'Underwater Kingdom', 'Pride Rock', 'Neverland', 'Wonderland', 'Hundred Acre Wood', 'Agrabah', 'Arendelle', 'Corona Kingdom', 'Motunui Island',
      'Disney World', 'Magic Kingdom', 'Pixie Dust', 'Wishing Star', 'Happy Ending',
      
      // 迪士尼歌曲 (10个)
      'Let It Go', 'A Whole New World', 'Be Our Guest', 'Under the Sea', 'Hakuna Matata', 'You\'ve Got a Friend in Me', 'Colors of the Wind', 'Can You Feel the Love Tonight', 'Part of Your World', 'Beauty and the Beast'
    ],
    
    halloween: [
      // 万圣节角色 (30个)
      'Pumpkin', 'Jack-o-lantern', 'Ghost', 'Witch', 'Wizard', 'Vampire', 'Werewolf', 'Zombie', 'Mummy', 'Skeleton',
      'Frankenstein', 'Dracula', 'Black Cat', 'Bat', 'Spider', 'Owl', 'Raven', 'Crow', 'Scarecrow', 'Goblin',
      'Troll', 'Monster', 'Demon', 'Devil', 'Angel', 'Pirate', 'Ninja', 'Superhero', 'Princess', 'Knight',
      
      // 万圣节活动 (25个)
      'Trick or Treat', 'Costume Party', 'Haunted House', 'Scary Story', 'Halloween Parade', 'Pumpkin Carving', 'Apple Bobbing', 'Ghost Hunt', 'Monster Dance', 'Magic Spell',
      'Flying on Broomstick', 'Casting Magic', 'Howling at Moon', 'Creeping in Dark', 'Hiding in Shadows', 'Jumping out to Scare', 'Making Scary Face', 'Walking Like Zombie', 'Flying Like Bat', 'Crawling Like Spider',
      'Cackling Like Witch', 'Roaring Like Monster', 'Moaning Like Ghost', 'Rattling Chains', 'Opening Creaky Door',
      
      // 万圣节物品 (25个)
      'Candy', 'Chocolate', 'Lollipop', 'Gummy Bears', 'Halloween Mask', 'Costume', 'Witch Hat', 'Magic Wand', 'Crystal Ball', 'Cauldron',
      'Broomstick', 'Spider Web', 'Haunted Mirror', 'Creepy Doll', 'Coffin', 'Tombstone', 'Candle', 'Lantern', 'Fog Machine', 'Dry Ice',
      'Orange Decorations', 'Black Decorations', 'Fake Blood', 'Plastic Bones', 'Rubber Snake',
      
      // 万圣节地点和氛围 (20个)
      'Haunted Mansion', 'Spooky Forest', 'Creepy Cemetery', 'Dark Alley', 'Abandoned House', 'Mysterious Cave', 'Foggy Night', 'Full Moon', 'Thunder and Lightning', 'Howling Wind',
      'Creaking Floorboards', 'Slamming Doors', 'Flickering Lights', 'Mysterious Sounds', 'Eerie Silence', 'Spine-Chilling', 'Hair-Raising', 'Goosebumps', 'Nightmare', 'Sweet Dreams'
    ],
    
    kids: [
      // 基础活动 (30个)
      'Playing Soccer', 'Riding Bicycle', 'Flying Kite', 'Building Sandcastle', 'Playing Piano', 'Drawing Picture', 'Brushing Teeth', 'Doing Homework', 'Playing Video Games', 'Eating Ice Cream',
      'Going to School', 'Playing with Friends', 'Reading Story', 'Watching Cartoon', 'Playing Hide and Seek', 'Jumping Rope', 'Playing Tag', 'Swinging on Swing', 'Sliding Down Slide', 'Climbing Tree',
      'Building with Blocks', 'Playing with Toys', 'Coloring Book', 'Making Crafts', 'Playing Dress Up', 'Having Tea Party', 'Playing House', 'Riding Scooter', 'Playing Catch', 'Blowing Bubbles',
      
      // 学校和学习 (20个)
      'Math Class', 'Reading Time', 'Art Class', 'Music Class', 'PE Class', 'Science Experiment', 'Show and Tell', 'Field Trip', 'Library Visit', 'Playground Time',
      'Lunch Break', 'Making Friends', 'Raising Hand', 'Writing on Blackboard', 'Using Computer', 'Group Project', 'School Play', 'Graduation Day', 'Summer Vacation', 'Back to School',
      
      // 家庭活动 (25个)
      'Family Dinner', 'Movie Night', 'Game Night', 'Bedtime Story', 'Morning Routine', 'Helping Mom', 'Helping Dad', 'Walking Dog', 'Feeding Pet', 'Watering Plants',
      'Cleaning Room', 'Making Bed', 'Setting Table', 'Washing Dishes', 'Taking Bath', 'Getting Dressed', 'Packing Backpack', 'Birthday Party', 'Christmas Morning', 'Easter Egg Hunt',
      'Family Picnic', 'Going to Park', 'Visiting Grandparents', 'Road Trip', 'Beach Day',
      
      // 想象游戏 (25个)
      'Being Superhero', 'Flying Like Bird', 'Swimming Like Fish', 'Roaring Like Lion', 'Hopping Like Bunny', 'Slithering Like Snake', 'Galloping Like Horse', 'Barking Like Dog', 'Meowing Like Cat', 'Chirping Like Bird',
      'Being Robot', 'Being Dinosaur', 'Being Pirate', 'Being Princess', 'Being Knight', 'Being Astronaut', 'Being Doctor', 'Being Teacher', 'Being Chef', 'Being Artist',
      'Magic Show', 'Puppet Show', 'Dance Performance', 'Singing Concert', 'Talent Show'
    ]
  },
  
  // =======================
  // MOVIE CHARADES (电影词汇)
  // =======================
  
  movies: {
    action: [
      // 经典动作片 (40个)
      'Die Hard', 'Mission Impossible', 'The Matrix', 'Mad Max Fury Road', 'John Wick', 'Fast and Furious', 'The Avengers', 'Terminator', 'Predator', 'Speed',
      'Top Gun', 'Rambo', 'Rocky', 'Indiana Jones', 'James Bond', 'Lethal Weapon', 'Beverly Hills Cop', 'Bad Boys', 'Rush Hour', 'Jackie Chan Movies',
      'Bruce Lee Films', 'The Expendables', 'Transporter', 'Taken', 'Bourne Identity', 'Casino Royale', 'Skyfall', 'Iron Man', 'Captain America', 'Thor',
      'Spider-Man', 'Batman', 'Superman', 'Wonder Woman', 'Black Panther', 'Guardians of the Galaxy', 'X-Men', 'Deadpool', 'Wolverine', 'Ant-Man',
      
      // 动作场景和元素 (35个)
      'Car Chase', 'Explosion', 'Gun Fight', 'Sword Fight', 'Martial Arts', 'Helicopter Scene', 'Motorcycle Chase', 'Rooftop Chase', 'Bank Robbery', 'Heist',
      'Spy Mission', 'Secret Agent', 'Undercover Cop', 'SWAT Team', 'Special Forces', 'Navy SEAL', 'Marine', 'Sniper', 'Assassin', 'Hitman',
      'Rescue Mission', 'Hostage Situation', 'Prison Break', 'Time Bomb', 'Defusing Bomb', 'Jumping off Building', 'Parachute Jump', 'Bungee Jump', 'Zip Line', 'Rock Climbing',
      'Desert Chase', 'Jungle Adventure', 'Arctic Mission', 'Space Battle', 'Underwater Fight',
      
      // 动作明星和角色 (25个)
      'Arnold Schwarzenegger', 'Sylvester Stallone', 'Bruce Willis', 'Tom Cruise', 'Jackie Chan', 'Jet Li', 'Jason Statham', 'Dwayne Johnson', 'Vin Diesel', 'Keanu Reeves',
      'Will Smith', 'Nicolas Cage', 'Harrison Ford', 'Mel Gibson', 'Danny Glover', 'Wesley Snipes', 'Jean-Claude Van Damme', 'Steven Seagal', 'Chuck Norris', 'Clint Eastwood',
      'Liam Neeson', 'Daniel Craig', 'Pierce Brosnan', 'Sean Connery', 'Roger Moore'
    ],
    
    animation: [
      // 皮克斯动画 (25个)
      'Toy Story', 'Finding Nemo', 'The Incredibles', 'Cars', 'Ratatouille', 'Wall-E', 'Up', 'Brave', 'Monsters Inc', 'Inside Out',
      'The Good Dinosaur', 'Coco', 'Incredibles 2', 'Cars 2', 'Cars 3', 'Monsters University', 'Finding Dory', 'Toy Story 2', 'Toy Story 3', 'Toy Story 4',
      'A Bug\'s Life', 'Soul', 'Luca', 'Turning Red', 'Lightyear',
      
      // 迪士尼动画 (25个)
      'Frozen', 'Moana', 'Zootopia', 'Big Hero 6', 'Wreck-It Ralph', 'Tangled', 'The Princess and the Frog', 'Bolt', 'Chicken Little', 'Meet the Robinsons',
      'The Lion King', 'Beauty and the Beast', 'The Little Mermaid', 'Aladdin', 'Pocahontas', 'Mulan', 'Tarzan', 'Hercules', 'The Hunchback of Notre Dame', 'Atlantis',
      'Treasure Planet', 'Brother Bear', 'Home on the Range', 'The Wild', 'Dinosaur',
      
      // 其他动画工作室 (25个)
      'Shrek', 'Madagascar', 'Kung Fu Panda', 'How to Train Your Dragon', 'The Croods', 'Trolls', 'Boss Baby', 'Rio', 'Ice Age', 'Epic',
      'Despicable Me', 'Minions', 'The Secret Life of Pets', 'Sing', 'Illumination', 'Hotel Transylvania', 'Cloudy with a Chance of Meatballs', 'Open Season', 'Surf\'s Up', 'The Smurfs',
      'SpongeBob Movie', 'The Simpsons Movie', 'South Park Movie', 'Family Guy Movie', 'Futurama Movie',
      
      // 动画角色和元素 (25个)
      'Talking Animals', 'Magic Kingdom', 'Fairy Tale', 'Princess', 'Prince', 'Dragon', 'Wizard', 'Fairy', 'Pixie', 'Elf',
      'Superhero Family', 'Robot', 'Alien', 'Monster', 'Dinosaur', 'Underwater World', 'Space Adventure', 'Time Travel', 'Magic Carpet', 'Flying Car',
      'Singing', 'Dancing', 'Musical Number', 'Happy Ending', 'Friendship'
    ],
    
    comedy: [
      // 经典喜剧片 (30个)
      'The Hangover', 'Bridesmaids', 'Superbad', 'Anchorman', 'Ghostbusters', 'Dumb and Dumber', 'Coming to America', 'Mrs Doubtfire', 'The Mask', 'Home Alone',
      'Meet the Parents', 'Austin Powers', 'Wayne\'s World', 'Bill and Ted', 'Ace Ventura', 'The Truman Show', 'Liar Liar', 'Yes Man', 'Bruce Almighty', 'Click',
      'Big Daddy', 'Happy Gilmore', 'Billy Madison', 'The Waterboy', 'Wedding Singer', 'Grown Ups', 'Pixels', 'Paul Blart Mall Cop', 'Zoolander', 'Dodgeball',
      
      // 浪漫喜剧 (25个)
      'When Harry Met Sally', 'Pretty Woman', 'The Princess Bride', 'Sleepless in Seattle', 'You\'ve Got Mail', 'Notting Hill', 'Four Weddings and a Funeral', 'Love Actually', 'The Holiday', 'Valentine\'s Day',
      'Crazy Stupid Love', 'Friends with Benefits', 'No Strings Attached', 'The Proposal', 'Hitch', 'How to Lose a Guy', 'Bridget Jones Diary', 'My Best Friend\'s Wedding', 'Runaway Bride', 'Sweet Home Alabama',
      'The Wedding Planner', 'Maid in Manhattan', 'Shall We Dance', 'Two Weeks Notice', 'Miss Congeniality',
      
      // 家庭喜剧 (25个)
      'Mrs Doubtfire', 'Home Alone', 'Daddy Day Care', 'Cheaper by the Dozen', 'The Santa Clause', 'Elf', 'School of Rock', 'Night at the Museum', 'Jumanji', 'Honey I Shrunk the Kids',
      'The Incredibles', 'Monsters Inc', 'Finding Nemo', 'Ice Age', 'Madagascar', 'Shrek', 'Despicable Me', 'Minions', 'The Grinch', 'A Christmas Story',
      'Beethoven', 'Air Bud', 'Stuart Little', 'Garfield', 'Alvin and the Chipmunks',
      
      // 喜剧元素 (20个)
      'Slapstick Comedy', 'Physical Comedy', 'Pratfall', 'Mistaken Identity', 'Fish Out of Water', 'Buddy Comedy', 'Romantic Mix-up', 'Awkward Situation', 'Embarrassing Moment', 'Comic Relief',
      'Running Gag', 'One-Liner', 'Punchline', 'Setup and Payoff', 'Comic Timing', 'Deadpan Delivery', 'Overacting', 'Double Take', 'Sight Gag', 'Happy Ending'
    ]
  },
  
  // =======================
  // ANIMAL CHARADES (动物词汇)
  // =======================
  
  animals: {
    land: [
      // 大型哺乳动物 (25个)
      'Lion', 'Tiger', 'Elephant', 'Giraffe', 'Rhino', 'Hippo', 'Bear', 'Gorilla', 'Chimpanzee', 'Orangutan',
      'Zebra', 'Buffalo', 'Bison', 'Moose', 'Elk', 'Deer', 'Antelope', 'Gazelle', 'Wildebeest', 'Kangaroo',
      'Koala', 'Panda', 'Polar Bear', 'Grizzly Bear', 'Black Bear',
      
      // 中型哺乳动物 (25个)
      'Wolf', 'Fox', 'Coyote', 'Jackal', 'Hyena', 'Cheetah', 'Leopard', 'Jaguar', 'Lynx', 'Bobcat',
      'Monkey', 'Baboon', 'Lemur', 'Sloth', 'Armadillo', 'Anteater', 'Aardvark', 'Wombat', 'Badger', 'Otter',
      'Raccoon', 'Skunk', 'Opossum', 'Porcupine', 'Hedgehog',
      
      // 小型哺乳动物 (25个)
      'Rabbit', 'Hare', 'Squirrel', 'Chipmunk', 'Mouse', 'Rat', 'Hamster', 'Guinea Pig', 'Ferret', 'Mole',
      'Shrew', 'Bat', 'Cat', 'Dog', 'Horse', 'Pig', 'Cow', 'Sheep', 'Goat', 'Chicken',
      'Duck', 'Goose', 'Turkey', 'Llama', 'Alpaca',
      
      // 其他陆地动物 (25个)
      'Snake', 'Lizard', 'Iguana', 'Gecko', 'Chameleon', 'Turtle', 'Tortoise', 'Frog', 'Toad', 'Salamander',
      'Alligator', 'Crocodile', 'Komodo Dragon', 'Ostrich', 'Emu', 'Cassowary', 'Roadrunner', 'Peacock', 'Pheasant', 'Quail',
      'Snail', 'Slug', 'Earthworm', 'Centipede', 'Millipede'
    ],
    
    marine: [
      // 大型海洋动物 (25个)
      'Blue Whale', 'Humpback Whale', 'Sperm Whale', 'Orca', 'Dolphin', 'Porpoise', 'Manatee', 'Dugong', 'Walrus', 'Seal',
      'Sea Lion', 'Great White Shark', 'Tiger Shark', 'Hammerhead Shark', 'Whale Shark', 'Mako Shark', 'Bull Shark', 'Nurse Shark', 'Reef Shark', 'Thresher Shark',
      'Manta Ray', 'Stingray', 'Electric Ray', 'Sawfish', 'Marlin',
      
      // 中型海洋动物 (25个)
      'Tuna', 'Swordfish', 'Barracuda', 'Grouper', 'Sea Bass', 'Cod', 'Salmon', 'Trout', 'Mackerel', 'Sardine',
      'Octopus', 'Squid', 'Cuttlefish', 'Nautilus', 'Sea Turtle', 'Loggerhead Turtle', 'Green Sea Turtle', 'Leatherback Turtle', 'Hawksbill Turtle', 'Ridley Turtle',
      'Moray Eel', 'Electric Eel', 'Garden Eel', 'Conger Eel', 'American Eel',
      
      // 小型海洋动物 (25个)
      'Clownfish', 'Angelfish', 'Butterflyfish', 'Parrotfish', 'Triggerfish', 'Pufferfish', 'Boxfish', 'Seahorse', 'Pipefish', 'Mandarin Fish',
      'Gobies', 'Wrasse', 'Damselfish', 'Chromis', 'Blenny', 'Cardinalfish', 'Basslet', 'Dottyback', 'Fairy Wrasse', 'Cleaner Wrasse',
      'Sea Anemone', 'Coral', 'Sponge', 'Sea Urchin', 'Sea Cucumber',
      
      // 其他海洋生物 (25个)
      'Starfish', 'Sand Dollar', 'Sea Biscuit', 'Crab', 'Lobster', 'Shrimp', 'Prawn', 'Krill', 'Barnacle', 'Mussel',
      'Oyster', 'Scallop', 'Clam', 'Abalone', 'Conch', 'Whelk', 'Snail', 'Nudibranch', 'Sea Slug', 'Chiton',
      'Jellyfish', 'Man o\' War', 'Sea Nettle', 'Moon Jelly', 'Box Jellyfish'
    ],
    
    birds: [
      // 猛禽 (25个)
      'Bald Eagle', 'Golden Eagle', 'Harpy Eagle', 'Peregrine Falcon', 'Gyrfalcon', 'Kestrel', 'Red-tailed Hawk', 'Cooper\'s Hawk', 'Sharp-shinned Hawk', 'Goshawk',
      'Buzzard', 'Kite', 'Osprey', 'Great Horned Owl', 'Barn Owl', 'Screech Owl', 'Snowy Owl', 'Barred Owl', 'Tawny Owl', 'Eagle Owl',
      'Secretary Bird', 'Caracara', 'Hobby', 'Merlin', 'Sparrowhawk',
      
      // 水鸟 (25个)
      'Swan', 'Goose', 'Duck', 'Mallard', 'Teal', 'Widgeon', 'Pintail', 'Canvasback', 'Redhead', 'Scaup',
      'Pelican', 'Cormorant', 'Anhinga', 'Gannet', 'Booby', 'Frigatebird', 'Albatross', 'Petrel', 'Shearwater', 'Storm Petrel',
      'Heron', 'Egret', 'Bittern', 'Ibis', 'Spoonbill',
      
      // 鸣鸟 (25个)
      'Robin', 'Blue Jay', 'Cardinal', 'Mockingbird', 'Thrush', 'Wren', 'Sparrow', 'Finch', 'Canary', 'Goldfinch',
      'Chickadee', 'Nuthatch', 'Titmouse', 'Warbler', 'Vireo', 'Flycatcher', 'Kingbird', 'Phoebe', 'Pewee', 'Swallow',
      'Martin', 'Swift', 'Hummingbird', 'Kingfisher', 'Woodpecker',
      
      // 其他鸟类 (25个)
      'Penguin', 'Emperor Penguin', 'King Penguin', 'Adelie Penguin', 'Chinstrap Penguin', 'Ostrich', 'Emu', 'Cassowary', 'Kiwi', 'Rhea',
      'Peacock', 'Pheasant', 'Quail', 'Partridge', 'Grouse', 'Turkey', 'Chicken', 'Rooster', 'Guinea Fowl', 'Pigeon',
      'Dove', 'Parrot', 'Macaw', 'Cockatoo', 'Parakeet'
    ]
  },
  
  // =======================
  // CHRISTMAS CHARADES (圣诞词汇)
  // =======================
  
  christmas: [
    // 圣诞角色 (25个)
    'Santa Claus', 'Mrs. Claus', 'Christmas Elf', 'Rudolph', 'Reindeer', 'Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet',
    'Cupid', 'Donner', 'Blitzen', 'Frosty the Snowman', 'Jack Frost', 'Christmas Angel', 'Wise Men', 'Three Kings', 'Shepherd', 'Mary and Joseph',
    'Baby Jesus', 'Grinch', 'Scrooge', 'Ghost of Christmas Past', 'Nutcracker',
    
    // 圣诞电影 (25个)
    'Home Alone', 'Elf', 'The Polar Express', 'A Christmas Story', 'It\'s a Wonderful Life', 'The Grinch', 'Miracle on 34th Street', 'Love Actually', 'The Holiday', 'Klaus',
    'Arthur Christmas', 'The Santa Clause', 'Jingle All the Way', 'Last Christmas', 'The Christmas Chronicles', 'A Christmas Carol', 'White Christmas', 'Holiday Inn', 'The Bishop\'s Wife', 'Scrooged',
    'National Lampoon\'s Christmas Vacation', 'Four Christmases', 'Deck the Halls', 'Christmas with the Kranks', 'Fred Claus',
    
    // 圣诞歌曲 (25个)
    'Jingle Bells', 'Silent Night', 'White Christmas', 'Rudolph the Red-Nosed Reindeer', 'Frosty the Snowman', 'Let It Snow', 'Silver Bells', 'Rockin\' Around the Christmas Tree', 'Blue Christmas', 'All I Want for Christmas Is You',
    'The Christmas Song', 'Have Yourself a Merry Little Christmas', 'I\'ll Be Home for Christmas', 'Santa Claus Is Coming to Town', 'Feliz Navidad', 'Mary Did You Know', 'O Holy Night', 'The First Noel', 'Angels We Have Heard on High', 'Joy to the World',
    'Hark the Herald Angels Sing', 'O Come All Ye Faithful', 'Deck the Halls', 'We Wish You a Merry Christmas', 'Last Christmas',
    
    // 圣诞活动和传统 (25个)
    'Decorating Christmas Tree', 'Hanging Christmas Stockings', 'Gift Wrapping', 'Christmas Card Making', 'Advent Calendar', 'Christmas Light Display', 'Mistletoe Kiss', 'Christmas Morning', 'Family Dinner', 'Nativity Scene',
    'Christmas Shopping', 'Carol Singing', 'Cookie Baking', 'Gingerbread House', 'Christmas Market Visit', 'Santa\'s Workshop', 'Milk and Cookies for Santa', 'Reindeer Carrots', 'Christmas Pageant', 'Church Service',
    'Christmas Eve', 'Midnight Mass', 'Boxing Day', 'New Year\'s Eve', 'Holiday Vacation'
  ],
  
  // =======================
  // TRENDING & SOCIAL MEDIA (流行热词和社交媒体)
  // =======================
  
  trending: [
    // 社交媒体平台 (20个)
    'TikTok', 'Instagram', 'Twitter', 'Facebook', 'YouTube', 'Snapchat', 'LinkedIn', 'Pinterest', 'Reddit', 'Discord',
    'WhatsApp', 'WeChat', 'Telegram', 'Signal', 'Clubhouse', 'BeReal', 'Twitch', 'OnlyFans', 'Patreon', 'Medium',
    
    // 网络热词和梗 (25个)
    'Going Viral', 'Hashtag', 'Influencer', 'Content Creator', 'Streaming', 'Podcast', 'Vlog', 'Blog', 'Meme', 'GIF',
    'Emoji', 'Selfie', 'Story', 'Reels', 'Shorts', 'Live Stream', 'DM', 'Slide into DMs', 'Ghosting', 'Catfish',
    'FOMO', 'YOLO', 'Salty', 'Stan', 'Simp',
    
    // AI和科技热词 (20个)
    'ChatGPT', 'Artificial Intelligence', 'Machine Learning', 'NFT', 'Cryptocurrency', 'Bitcoin', 'Blockchain', 'Metaverse', 'Virtual Reality', 'Augmented Reality',
    'Cloud Computing', 'Big Data', 'Internet of Things', 'Smart Home', '5G', 'Drone', 'Electric Vehicle', 'Tesla', 'Zoom Meeting', 'Work From Home',
    
    // 网络文化和现象 (25个)
    'Cancel Culture', 'Woke', 'Toxic', 'Cringe', 'Based', 'Cap', 'No Cap', 'Flex', 'Clout', 'Periodt',
    'Slay', 'It\'s Giving', 'Main Character Energy', 'Pick Me Girl', 'That Girl', 'Soft Launch', 'Hard Launch', 'Red Flag', 'Green Flag', 'Gaslighting',
    'Mansplaining', 'Karen', 'OK Boomer', 'Cheugy', 'Bussin',
    
    // 网络购物和电商 (10个)
    'Online Shopping', 'Amazon', 'E-commerce', 'Dropshipping', 'Unboxing', 'Haul', 'Review', 'Rating', 'Wishlist', 'Cart'
  ]
};

// 导出词汇库供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CHARADES_VOCABULARY;
}

// 浏览器环境下的全局变量
if (typeof window !== 'undefined') {
  window.CHARADES_VOCABULARY = CHARADES_VOCABULARY;
}