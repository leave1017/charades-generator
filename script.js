// 猜字游戏数据
const charadesData = {
  // 成人猜字游戏
  adult: {
    movies: [
      "The Godfather", "Casablanca", "Gone with the Wind", "Citizen Kane", "Pulp Fiction",
      "The Shawshank Redemption", "Forrest Gump", "The Matrix", "Titanic", "Avatar"
    ],
    actions: [
      "Rock climbing", "Salsa dancing", "Cooking a gourmet meal", "Painting a masterpiece",
      "Playing chess", "Meditating", "Writing a novel", "Learning to drive"
    ],
    animals: [
      "Elephant", "Giraffe", "Penguin", "Dolphin", "Eagle", "Lion", "Tiger", "Bear",
      "Wolf", "Shark", "Octopus", "Butterfly"
    ],
    phrases: [
      "Actions speak louder than words", "Don't judge a book by its cover",
      "The early bird catches the worm", "A picture is worth a thousand words",
      "Better late than never", "Practice makes perfect"
    ],
    celebrities: [
      "Marilyn Monroe", "Elvis Presley", "Michael Jackson", "Madonna",
      "Brad Pitt", "Angelina Jolie", "Leonardo DiCaprio", "Johnny Depp"
    ],
    books: [
      "Pride and Prejudice", "To Kill a Mockingbird", "1984", "The Great Gatsby",
      "Lord of the Rings", "Harry Potter", "The Hobbit", "Jane Eyre"
    ]
  },

  // 儿童猜字游戏
  kids: {
    movies: [
      "Frozen", "Toy Story", "Finding Nemo", "The Lion King", "Cinderella",
      "Beauty and the Beast", "Aladdin", "Moana", "Coco", "Inside Out"
    ],
    actions: [
      "Jumping", "Running", "Dancing", "Singing", "Drawing", "Reading",
      "Playing", "Sleeping", "Eating", "Swimming"
    ],
    animals: [
      "Dog", "Cat", "Bird", "Fish", "Rabbit", "Horse", "Cow", "Pig",
      "Sheep", "Duck", "Chicken", "Mouse"
    ],
    simple: [
      "Happy", "Sad", "Big", "Small", "Hot", "Cold", "Fast", "Slow",
      "Loud", "Quiet", "Bright", "Dark"
    ],
    books: [
      "The Very Hungry Caterpillar", "Where the Wild Things Are", "Goodnight Moon",
      "The Cat in the Hat", "Charlotte's Web", "Winnie the Pooh"
    ]
  },

  // 电影猜字游戏
  movies: {
    disney: [
      "Snow White", "Cinderella", "Sleeping Beauty", "Beauty and the Beast",
      "The Little Mermaid", "Aladdin", "The Lion King", "Mulan"
    ],
    pixar: [
      "Toy Story", "Finding Nemo", "The Incredibles", "Up", "Wall-E",
      "Inside Out", "Coco", "Soul"
    ],
    ghibli: [
      "Spirited Away", "My Neighbor Totoro", "Princess Mononoke",
      "Howl's Moving Castle", "Kiki's Delivery Service"
    ],
    romance: [
      "Titanic", "The Notebook", "La La Land", "Casablanca",
      "Gone with the Wind", "Romeo and Juliet", "Pride and Prejudice"
    ],
    action: [
      "Die Hard", "Mission Impossible", "The Matrix", "Mad Max",
      "John Wick", "Fast and Furious", "The Avengers"
    ],
    animation: [
      "Toy Story", "Frozen", "The Lion King", "Finding Nemo",
      "Spirited Away", "Up", "Coco", "Inside Out"
    ],
    comedy: [
      "The Hangover", "Bridesmaids", "Superbad", "Anchorman",
      "The 40 Year Old Virgin", "Knocked Up", "This Is Spinal Tap"
    ],
    thriller: [
      "The Silence of the Lambs", "Se7en", "Gone Girl", "The Sixth Sense",
      "Shutter Island", "Inception", "The Prestige"
    ],
    scifi: [
      "Star Wars", "Star Trek", "Blade Runner", "The Matrix",
      "Interstellar", "Arrival", "Ex Machina"
    ]
  },

  // 圣诞主题
  christmas: [
    "Santa Claus", "Christmas Tree", "Gift Giving", "Snowman", "Reindeer",
    "Christmas Carols", "Mistletoe", "Christmas Dinner", "Christmas Lights",
    "Nativity Scene", "Christmas Stocking", "Christmas Presents"
  ],

  // 动物主题
  animals: {
    land: [
      "Lion", "Tiger", "Elephant", "Giraffe", "Bear", "Wolf",
      "Fox", "Deer", "Horse", "Cow", "Pig", "Sheep"
    ],
    marine: [
      "Dolphin", "Shark", "Whale", "Octopus", "Seahorse", "Starfish",
      "Jellyfish", "Crab", "Lobster", "Sea turtle", "Clownfish"
    ],
    amphibians: [
      "Frog", "Toad", "Salamander", "Newt", "Axolotl", "Caecilian"
    ],
    birds: [
      "Eagle", "Owl", "Penguin", "Parrot", "Sparrow", "Robin",
      "Blue Jay", "Cardinal", "Hummingbird", "Woodpecker"
    ],
    insects: [
      "Butterfly", "Bee", "Ant", "Spider", "Ladybug", "Dragonfly",
      "Grasshopper", "Cricket", "Firefly", "Mosquito"
    ],
    reptiles: [
      "Snake", "Lizard", "Turtle", "Crocodile", "Alligator", "Chameleon",
      "Gecko", "Iguana", "Komodo Dragon", "Anaconda"
    ]
  },

  // 动作主题
  actions: [
    "Running", "Jumping", "Dancing", "Swimming", "Cooking", "Reading",
    "Writing", "Painting", "Singing", "Playing", "Sleeping", "Eating",
    "Driving", "Flying", "Climbing", "Fishing", "Gardening", "Shopping"
  ]
};

// 全局变量
let currentCharade = '';
let gameTimer = null;
let timeLeft = 0;
let countdownTimer = null;
let countdownTimeLeft = 0;

// 快速开始游戏变量
let quickGameActive = false;
let quickGameTimer = null;
let quickGameTimeLeft = 0;
let quickCharadeIndex = 0;
let quickCharadeList = [];
let quickGamePaused = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
  initializeMobileMenu();
  addScrollAnimations();
});

// 移动端菜单功能
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// 添加滚动动画
function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // 观察所有卡片和章节
  document.querySelectorAll('.card, .section-header').forEach(el => {
    observer.observe(el);
  });
}

// 生成随机猜字游戏
function generateRandomCharade() {
  const randomCharadeDiv = document.getElementById('random-charade');
  const charadeContent = document.getElementById('charade-content');

  // 从所有类别中随机选择一个
  const allCategories = Object.values(charadesData);
  const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];

  if (Array.isArray(randomCategory)) {
    // 直接是数组的情况
    currentCharade = randomCategory[Math.floor(Math.random() * randomCategory.length)];
  } else {
    // 是对象的情况，随机选择一个子类别
    const subCategories = Object.values(randomCategory);
    const randomSubCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    currentCharade = randomSubCategory[Math.floor(Math.random() * randomSubCategory.length)];
  }

  // 显示猜字游戏
  charadeContent.textContent = currentCharade;
  randomCharadeDiv.classList.remove('hidden');

  // 滚动到显示区域
  randomCharadeDiv.scrollIntoView({ behavior: 'smooth' });

  // 开始计时器
  startGameTimer();
}

// 开始游戏计时器
function startGameTimer() {
  // 清除之前的计时器
  if (gameTimer) {
    clearInterval(gameTimer);
  }

  // 根据难度设置时间
  if (currentCharade.length <= 10) {
    timeLeft = 120; // 2分钟
  } else if (currentCharade.length <= 20) {
    timeLeft = 180; // 3分钟
  } else {
    timeLeft = 240; // 4分钟
  }

  // 更新计时器显示
  updateTimerDisplay();

  // 开始倒计时
  gameTimer = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(gameTimer);
      showTimeUpMessage();
    }
  }, 1000);
}

// 更新计时器显示
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // 如果页面上有计时器显示元素，更新它
  const timerElement = document.querySelector('.timer-display');
  if (timerElement) {
    timerElement.textContent = timeDisplay;
  }
}

// 显示时间到消息
function showTimeUpMessage() {
  alert('Time\'s up! The word was: ' + currentCharade);
}

// 复制到剪贴板
function copyToClipboard() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentCharade).then(function () {
      showCopySuccess();
    }).catch(function () {
      fallbackCopyTextToClipboard();
    });
  } else {
    fallbackCopyTextToClipboard();
  }
}

// 备用复制方法
function fallbackCopyTextToClipboard() {
  const textArea = document.createElement('textarea');
  textArea.value = currentCharade;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess();
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

// 显示复制成功消息
function showCopySuccess() {
  const copyBtn = document.querySelector('button[onclick="copyToClipboard()"]');
  const originalText = copyBtn.textContent;

  copyBtn.textContent = '✅ Copied!';
  copyBtn.style.background = '#10B981';

  setTimeout(function () {
    copyBtn.textContent = originalText;
    copyBtn.style.background = '';
  }, 2000);
}

// 倒计时功能
function startTimer() {
  const countdownTimerDiv = document.getElementById('countdown-timer');
  const startTimerBtn = document.getElementById('start-timer-btn');
  const minutesSpan = document.getElementById('minutes');
  const secondsSpan = document.getElementById('seconds');

  // 设置倒计时时间（3分钟）
  countdownTimeLeft = 3 * 60;

  // 显示倒计时
  countdownTimerDiv.classList.remove('hidden');
  startTimerBtn.classList.add('hidden');

  // 开始倒计时
  countdownTimer = setInterval(() => {
    countdownTimeLeft--;

    const minutes = Math.floor(countdownTimeLeft / 60);
    const seconds = countdownTimeLeft % 60;

    minutesSpan.textContent = minutes;
    secondsSpan.textContent = seconds.toString().padStart(2, '0');

    if (countdownTimeLeft <= 0) {
      clearInterval(countdownTimer);
      showTimeUpMessage();
      countdownTimerDiv.classList.add('hidden');
      startTimerBtn.classList.remove('hidden');
    }
  }, 1000);
}


// 滚动到指定章节
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}


// 平滑滚动到页面顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 添加键盘快捷键
document.addEventListener('keydown', function (e) {
  // 空格键生成新的猜字游戏
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    generateRandomCharade();
  }

  // ESC键关闭随机猜字游戏显示
  if (e.code === 'Escape') {
    const randomCharadeDiv = document.getElementById('random-charade');
    if (randomCharadeDiv && !randomCharadeDiv.classList.contains('hidden')) {
      randomCharadeDiv.classList.add('hidden');
    }
  }
});

// 添加触摸手势支持（移动端）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function (e) {
  if (!touchStartX || !touchStartY) return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;

  // 检测滑动方向
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // 水平滑动
    if (diffX > 50) {
      // 向左滑动 - 可以用于下一个猜字游戏
      console.log('Swiped left');
    } else if (diffX < -50) {
      // 向右滑动 - 可以用于上一个猜字游戏
      console.log('Swiped right');
    }
  }

  touchStartX = 0;
  touchStartY = 0;
});

// 性能优化：防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 优化滚动事件
const optimizedScrollHandler = debounce(function () {
  // 滚动时的优化逻辑
  const scrolled = window.pageYOffset;
  const header = document.querySelector('header');

  if (scrolled > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// 添加页面可见性API支持
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    // 页面隐藏时暂停计时器
    if (gameTimer) {
      clearInterval(gameTimer);
    }
  } else {
    // 页面重新可见时恢复计时器
    if (timeLeft > 0 && !gameTimer) {
      startGameTimer();
    }
  }
});

// 提示系统数据
const hintsData = {
  // 基本动物类提示
  "Cat": "A furry pet that purrs and catches mice",
  "Dog": "Man's best friend, barks and wags tail",
  "Bird": "Has wings, can fly, chirps or sings",
  "Fish": "Lives in water, has fins and gills",
  "Rabbit": "Hops around, has long ears, eats carrots",
  "Horse": "Large animal you can ride, says neigh",
  "Cow": "Large farm animal that gives milk, says moo",
  "Pig": "Pink farm animal that rolls in mud",
  "Sheep": "Farm animal with wooly coat, says baa",
  "Duck": "Water bird with webbed feet, says quack",

  // 动作类提示
  "Running": "Moving fast with your legs",
  "Jumping": "Leaving the ground with both feet",
  "Dancing": "Moving rhythmically to music",
  "Swimming": "Moving through water using arms and legs",
  "Cooking": "Preparing food in the kitchen",
  "Reading": "Looking at words in a book or paper",
  "Writing": "Using a pen or pencil to make words",
  "Painting": "Using brushes and colors on canvas",
  "Singing": "Making musical sounds with your voice",
  "Playing": "Having fun with games or toys",
  "Sleeping": "Resting with eyes closed at night",
  "Eating": "Putting food in your mouth and chewing",

  // 电影类提示
  "Frozen": "Disney movie about two sisters, one with ice powers",
  "Toy Story": "Pixar movie about toys that come to life",
  "Finding Nemo": "Movie about a lost clownfish",
  "The Lion King": "Disney movie about a lion prince named Simba",
  "Cinderella": "Fairy tale about a girl with a glass slipper",
  "Beauty and the Beast": "Story about a girl who falls in love with a monster",
  "Aladdin": "Story about a boy with a magic lamp and genie",
  "Moana": "Disney movie about a Polynesian girl who sails the ocean",

  // 社交媒体和网络热词提示
  "TikTok": "Popular short video app with dancing and trends",
  "Instagram": "Photo-sharing social media platform",
  "Going Viral": "When content spreads rapidly across the internet",
  "Hashtag": "Symbol # used to tag topics on social media",
  "Influencer": "Person with many followers who promotes products",
  "Selfie": "Photo you take of yourself",
  "Streaming": "Watching videos or content live online",
  "Podcast": "Audio show you can listen to online",
  "Vlog": "Video blog showing someone's daily life",
  "Meme": "Funny image or video that spreads online",
  "ChatGPT": "AI chatbot that can answer questions",
  "NFT": "Digital artwork you can buy with cryptocurrency",
  "Cryptocurrency": "Digital money like Bitcoin",
  "Metaverse": "Virtual reality world you can explore",
  "Zoom Meeting": "Video call for work or school",
  "Work From Home": "Doing your job from your house",
  "Going Viral": "When everyone starts sharing your content",
  "Cancel Culture": "When people stop supporting someone online",
  "Karen": "Internet term for demanding or entitled person",
  "OK Boomer": "Phrase young people say to dismiss older generations",

  // 默认提示
  "default": "Think about the category and use gestures to act it out!"
};

// 快速游戏提示功能
function showQuickHint() {
  const hintArea = document.getElementById('quick-hint-area');
  const hintContent = document.getElementById('quick-hint-content');
  const currentWord = document.getElementById('quick-charade-content').textContent;
  
  if (currentWord && currentWord !== "Click 'Start Game' to begin!" && currentWord !== "Game Complete! 🎉") {
    const hint = hintsData[currentWord] || hintsData["default"];
    hintContent.textContent = hint;
    hintArea.classList.remove('hidden');
    
    // 自动隐藏提示（10秒后）
    setTimeout(() => {
      hintArea.classList.add('hidden');
    }, 10000);
  }
}

// 导出函数供HTML使用
window.generateRandomCharade = generateRandomCharade;
window.copyToClipboard = copyToClipboard;
window.scrollToSection = scrollToSection;
window.navigateToCategory = navigateToCategory;
window.scrollToTop = scrollToTop;
window.startTimer = startTimer;
window.showQuickHint = showQuickHint;

// 新的生成器函数
// 成人猜字游戏生成器
function generateEasyCharades() {
  const easyCharades = [
    "Reading a book", "Walking the dog", "Making coffee", "Brushing teeth",
    "Watching TV", "Listening to music", "Taking a photo", "Opening a door"
  ];
  const randomCharade = easyCharades[Math.floor(Math.random() * easyCharades.length)];
  alert(`Easy Charade: ${randomCharade}`);
}

function generateMediumCharades() {
  const mediumCharades = [
    "Cooking dinner", "Playing guitar", "Painting a picture", "Writing an email",
    "Doing yoga", "Shopping for groceries", "Fixing a car", "Teaching a class"
  ];
  const randomCharade = mediumCharades[Math.floor(Math.random() * mediumCharades.length)];
  alert(`Medium Charade: ${randomCharade}`);
}

function generateHardCharades() {
  const hardCharades = [
    "Performing surgery", "Flying an airplane", "Conducting an orchestra",
    "Solving a complex math problem", "Building a house", "Directing a movie"
  ];
  const randomCharade = hardCharades[Math.floor(Math.random() * hardCharades.length)];
  alert(`Hard Charade: ${randomCharade}`);
}

// 儿童猜字游戏生成器
function generatePrimaryCharades() {
  const primaryCharades = [
    "Jumping", "Running", "Singing", "Drawing", "Reading", "Playing",
    "Sleeping", "Eating", "Swimming", "Dancing"
  ];
  const randomCharade = primaryCharades[Math.floor(Math.random() * primaryCharades.length)];
  alert(`Primary School Charade: ${randomCharade}`);
}

function generateMiddleCharades() {
  const middleCharades = [
    "Playing basketball", "Riding a bicycle", "Making a sandwich",
    "Watching a movie", "Listening to music", "Playing video games"
  ];
  const randomCharade = middleCharades[Math.floor(Math.random() * middleCharades.length)];
  alert(`Middle School Charade: ${randomCharade}`);
}

function generateHighCharades() {
  const highCharades = [
    "Driving a car", "Studying for exams", "Playing sports",
    "Hanging out with friends", "Going to the mall", "Learning to cook"
  ];
  const randomCharade = highCharades[Math.floor(Math.random() * highCharades.length)];
  alert(`High School Charade: ${randomCharade}`);
}

// 动物猜字游戏生成器
function generateLandAnimalCharades() {
  const landAnimals = [
    "Lion", "Tiger", "Elephant", "Giraffe", "Bear", "Wolf",
    "Fox", "Deer", "Horse", "Cow", "Pig", "Sheep"
  ];
  const randomCharade = landAnimals[Math.floor(Math.random() * landAnimals.length)];
  alert(`Land Animal Charade: ${randomCharade}`);
}

function generateMarineAnimalCharades() {
  const marineAnimals = [
    "Dolphin", "Shark", "Whale", "Octopus", "Seahorse", "Starfish",
    "Jellyfish", "Crab", "Lobster", "Sea turtle", "Clownfish"
  ];
  const randomCharade = marineAnimals[Math.floor(Math.random() * marineAnimals.length)];
  alert(`Marine Animal Charade: ${randomCharade}`);
}

function generateAmphibianCharades() {
  const amphibians = [
    "Frog", "Toad", "Salamander", "Newt", "Axolotl", "Caecilian"
  ];
  const randomCharade = amphibians[Math.floor(Math.random() * amphibians.length)];
  alert(`Amphibian Charade: ${randomCharade}`);
}

// 电影猜字游戏生成器
function generateRomanceMovieCharades() {
  const romanceMovies = [
    "Titanic", "The Notebook", "La La Land", "Casablanca",
    "Gone with the Wind", "Romeo and Juliet", "Pride and Prejudice"
  ];
  const randomCharade = romanceMovies[Math.floor(Math.random() * romanceMovies.length)];
  alert(`Romance Movie Charade: ${randomCharade}`);
}

function generateActionMovieCharades() {
  const actionMovies = [
    "Die Hard", "Mission Impossible", "The Matrix", "Mad Max",
    "John Wick", "Fast and Furious", "The Avengers"
  ];
  const randomCharade = actionMovies[Math.floor(Math.random() * actionMovies.length)];
  alert(`Action Movie Charade: ${randomCharade}`);
}

function generateAnimationMovieCharades() {
  const animationMovies = [
    "Toy Story", "Frozen", "The Lion King", "Finding Nemo",
    "Spirited Away", "Up", "Coco", "Inside Out"
  ];
  const randomCharade = animationMovies[Math.floor(Math.random() * animationMovies.length)];
  alert(`Animation Movie Charade: ${randomCharade}`);
}

// 圣诞节猜字游戏生成器
function generateChristmasCharades() {
  const christmasCharades = [
    "Santa Claus", "Christmas Tree", "Gift Giving", "Snowman",
    "Reindeer", "Christmas Carols", "Mistletoe", "Christmas Dinner"
  ];
  const randomCharade = christmasCharades[Math.floor(Math.random() * christmasCharades.length)];
  alert(`Christmas Charade: ${randomCharade}`);
}

// 带图片的猜字游戏生成器
function generatePictureCharades() {
  const pictureCharades = [
    "Sun and Moon", "Tree and Bird", "House and Car", "Cat and Dog",
    "Flower and Butterfly", "Ocean and Fish", "Mountain and Cloud"
  ];
  const randomCharade = pictureCharades[Math.floor(Math.random() * pictureCharades.length)];
  alert(`Picture Charade: ${randomCharade}`);
}

// 快速开始游戏函数
function startQuickGame() {
  // 生成猜字游戏列表
  generateQuickCharadeList();

  // 重置游戏状态
  quickCharadeIndex = 0;
  quickGameActive = true;
  quickGamePaused = false;

  // 显示第一个猜字游戏
  showQuickCharade();

  // 开始计时器
  startQuickGameTimer();

  // 更新按钮状态
  updateQuickGameButtons();
}

function generateQuickCharadeList() {
  // 从新的词汇库中随机选择猜字游戏
  quickCharadeList = [];

  // 检查是否有新的词汇库可用
  if (typeof CHARADES_VOCABULARY !== 'undefined') {
    // 使用新的扩展词汇库

    // 添加成人猜字游戏 (从各难度级别随机选择)
    const adultSample = [
      ...CHARADES_VOCABULARY.adult.easy.slice(0, 15),
      ...CHARADES_VOCABULARY.adult.medium.slice(0, 15),
      ...CHARADES_VOCABULARY.adult.hard.slice(0, 10)
    ];
    quickCharadeList.push(...adultSample);

    // 添加儿童猜字游戏 (从各主题随机选择)
    const kidsSample = [
      ...CHARADES_VOCABULARY.kids.disney.slice(0, 20),
      ...CHARADES_VOCABULARY.kids.halloween.slice(0, 15),
      ...CHARADES_VOCABULARY.kids.kids.slice(0, 15)
    ];
    quickCharadeList.push(...kidsSample);

    // 添加电影猜字游戏
    const moviesSample = [
      ...CHARADES_VOCABULARY.movies.action.slice(0, 15),
      ...CHARADES_VOCABULARY.movies.animation.slice(0, 15),
      ...CHARADES_VOCABULARY.movies.comedy.slice(0, 10)
    ];
    quickCharadeList.push(...moviesSample);

    // 添加动物猜字游戏
    const animalsSample = [
      ...CHARADES_VOCABULARY.animals.land.slice(0, 15),
      ...CHARADES_VOCABULARY.animals.marine.slice(0, 10),
      ...CHARADES_VOCABULARY.animals.birds.slice(0, 10)
    ];
    quickCharadeList.push(...animalsSample);

    // 添加圣诞主题
    quickCharadeList.push(...CHARADES_VOCABULARY.christmas.slice(0, 15));

    // 添加热门社交媒体和网络流行词汇 (核心功能)
    quickCharadeList.push(...CHARADES_VOCABULARY.trending.slice(0, 25));

  } else {
    // 回退到旧的词汇数据
    // 添加成人猜字游戏
    Object.values(charadesData.adult).forEach(category => {
      if (Array.isArray(category)) {
        quickCharadeList.push(...category);
      }
    });

    // 添加儿童猜字游戏
    Object.values(charadesData.kids).forEach(category => {
      if (Array.isArray(category)) {
        quickCharadeList.push(...category);
      }
    });

    // 添加电影猜字游戏
    Object.values(charadesData.movies).forEach(category => {
      if (Array.isArray(category)) {
        quickCharadeList.push(...category);
      }
    });

    // 添加动物猜字游戏
    Object.values(charadesData.animals).forEach(category => {
      if (Array.isArray(category)) {
        quickCharadeList.push(...category);
      }
    });

    // 添加其他类别
    quickCharadeList.push(...charadesData.christmas, ...charadesData.actions);
  }

  // 随机打乱顺序
  quickCharadeList = quickCharadeList.sort(() => Math.random() - 0.5);
}

function showQuickCharade() {
  const charadeContent = document.getElementById('quick-charade-content');
  if (quickCharadeList.length > 0 && quickCharadeIndex < quickCharadeList.length) {
    charadeContent.textContent = quickCharadeList[quickCharadeIndex];
  } else {
    charadeContent.textContent = "Game Complete! 🎉";
    endQuickGame();
  }
}

function nextQuickCharade() {
  if (quickGameActive && !quickGamePaused) {
    quickCharadeIndex++;
    if (quickCharadeIndex < quickCharadeList.length) {
      showQuickCharade();
      resetQuickGameTimer();
    } else {
      endQuickGame();
    }
  }
}

function pauseQuickGame() {
  if (quickGameActive) {
    quickGamePaused = !quickGamePaused;
    if (quickGamePaused) {
      pauseQuickGameTimer();
      document.getElementById('pause-game-btn').textContent = '▶️ Resume';
      document.getElementById('pause-game-btn').classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
      document.getElementById('pause-game-btn').classList.add('bg-green-500', 'hover:bg-green-600');
    } else {
      resumeQuickGameTimer();
      document.getElementById('pause-game-btn').textContent = '⏸️ Pause';
      document.getElementById('pause-game-btn').classList.remove('bg-green-500', 'hover:bg-green-600');
      document.getElementById('pause-game-btn').classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    }
  }
}

function resetQuickGame() {
  endQuickGame();
  const charadeContent = document.getElementById('quick-charade-content');
  charadeContent.textContent = "Click 'Start Game' to begin!";

  // 隐藏倒计时
  document.getElementById('quick-countdown-timer').classList.add('hidden');

  // 重置按钮状态
  updateQuickGameButtons();
}

function startQuickGameTimer() {
  // 设置游戏时间（2分钟）
  quickGameTimeLeft = 2 * 60;

  // 显示倒计时
  document.getElementById('quick-countdown-timer').classList.remove('hidden');

  // 开始倒计时
  quickGameTimer = setInterval(() => {
    if (!quickGamePaused) {
      quickGameTimeLeft--;
      updateQuickGameTimerDisplay();

      if (quickGameTimeLeft <= 0) {
        clearInterval(quickGameTimer);
        showQuickGameTimeUp();
      }
    }
  }, 1000);
}

function pauseQuickGameTimer() {
  // 暂停计时器逻辑在setInterval中处理
}

function resumeQuickGameTimer() {
  // 恢复计时器逻辑在setInterval中处理
}

function resetQuickGameTimer() {
  // 重置为2分钟
  quickGameTimeLeft = 2 * 60;
  updateQuickGameTimerDisplay();
}

function updateQuickGameTimerDisplay() {
  const minutes = Math.floor(quickGameTimeLeft / 60);
  const seconds = quickGameTimeLeft % 60;

  document.getElementById('quick-minutes').textContent = minutes;
  document.getElementById('quick-seconds').textContent = seconds.toString().padStart(2, '0');
}

function showQuickGameTimeUp() {
  const charadeContent = document.getElementById('quick-charade-content');
  const originalContent = charadeContent.textContent;

  charadeContent.textContent = '⏰ Time\'s Up!';
  charadeContent.style.color = '#dc2626';

  setTimeout(() => {
    charadeContent.textContent = originalContent;
    charadeContent.style.color = '';

    // 自动进入下一个猜字游戏
    if (quickGameActive) {
      nextQuickCharade();
    }
  }, 2000);
}

function endQuickGame() {
  quickGameActive = false;
  if (quickGameTimer) {
    clearInterval(quickGameTimer);
    quickGameTimer = null;
  }

  // 隐藏倒计时
  document.getElementById('quick-countdown-timer').classList.add('hidden');

  // 更新按钮状态
  updateQuickGameButtons();
}

function updateQuickGameButtons() {
  const startBtn = document.getElementById('start-quick-game-btn');
  const nextBtn = document.getElementById('next-charade-btn');
  const pauseBtn = document.getElementById('pause-game-btn');
  const resetBtn = document.getElementById('reset-game-btn');
  const hintBtn = document.getElementById('hint-btn');

  if (quickGameActive) {
    startBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    pauseBtn.classList.remove('hidden');
    resetBtn.classList.remove('hidden');
    if (hintBtn) hintBtn.classList.remove('hidden');
  } else {
    startBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    pauseBtn.classList.add('hidden');
    resetBtn.classList.add('hidden');
    if (hintBtn) hintBtn.classList.add('hidden');
  }
}

// 更新导航函数以支持新的类别
function navigateToCategory(category) {
  console.log('Navigating to category:', category);
  showCategoryCharades(category);
}

// 更新显示特定类别猜字游戏的函数
function showCategoryCharades(category) {
  let charadeList = [];

  // 根据类别获取相应的猜字游戏列表
  switch (category) {
    case 'adult-easy':
      charadeList = charadesData.adult.movies.concat(charadesData.adult.actions).slice(0, 10);
      break;
    case 'adult-medium':
      charadeList = charadesData.adult.books.concat(charadesData.adult.actions).slice(0, 10);
      break;
    case 'adult-hard':
      charadeList = charadesData.adult.movies.concat(charadesData.adult.books).slice(0, 10);
      break;
    case 'kids-primary':
      charadeList = charadesData.kids.movies.concat(charadesData.kids.actions).slice(0, 10);
      break;
    case 'kids-middle':
      charadeList = charadesData.kids.books.concat(charadesData.kids.actions).slice(0, 10);
      break;
    case 'kids-high':
      charadeList = charadesData.kids.movies.concat(charadesData.kids.books).slice(0, 10);
      break;
    case 'land-animals':
      charadeList = charadesData.animals.land;
      break;
    case 'marine-animals':
      charadeList = charadesData.animals.marine;
      break;
    case 'amphibians':
      charadeList = charadesData.animals.amphibians;
      break;
    case 'birds':
      charadeList = charadesData.animals.birds;
      break;
    case 'insects':
      charadeList = charadesData.animals.insects;
      break;
    case 'reptiles':
      charadeList = charadesData.animals.reptiles;
      break;
    case 'romance-movies':
      charadeList = charadesData.movies.romance;
      break;
    case 'action-movies':
      charadeList = charadesData.movies.action;
      break;
    case 'animation-movies':
      charadeList = charadesData.movies.animation;
      break;
    case 'comedy-movies':
      charadeList = charadesData.movies.comedy;
      break;
    case 'thriller-movies':
      charadeList = charadesData.movies.thriller;
      break;
    case 'sci-fi-movies':
      charadeList = charadesData.movies.scifi;
      break;
    case 'christmas':
      charadeList = charadesData.christmas;
      break;
    case 'actions':
      charadeList = charadesData.actions;
      break;
    default:
      charadeList = ['Coming soon!', 'This category is under development'];
  }

  // 随机选择一个猜字游戏
  const randomCharade = charadeList[Math.floor(Math.random() * charadeList.length)];

  // 显示结果
  alert(`Here's a ${category.replace('-', ' ')} charade: ${randomCharade}`);
} 