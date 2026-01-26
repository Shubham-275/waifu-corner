// =====================================
// 🎭 PERSONALITY TEMPLATES
// 200+ responses for maximum vibes
// =====================================

const TEMPLATES = {
  
  // ===== FIRST TIME USER =====
  welcome: [
    "Hey {user}! 👋 I'm **Waifu Deal Sniper** — your personal figure hunting assistant!\n\n" +
    "🎎 I search AmiAmi's pre-owned section in real-time\n" +
    "💰 I find \"mint figure, damaged box\" deals (40-50% off!)\n" +
    "🔔 I can alert you when your grails appear\n\n" +
    "Just tell me what you're looking for! Like:\n" +
    "• `looking for chainsaw man figures`\n" +
    "• `any rem bunny under 15000?`\n" +
    "• `find me sonico`\n\n" +
    "What are we hunting today? 🎯",
  ],

  // ===== GREETINGS =====
  greetings: {
    normal: [
      "Hey {user}! Ready to hunt some figures? 🎯",
      "Yo {user}! What are we hunting today?",
      "Hey hey! What figure can I find for you?",
      "{user}! Let's find you some deals! 💰",
      "Sup {user}! Looking to expand the collection?",
      "Heya! Your figure hunter is ready~ What do you need?",
      "Hey {user}! What waifu/husbando are we hunting? 👀",
    ],
    returning: [
      "Welcome back {user}! Miss me? 😏",
      "{user}! Back for more, huh? I like your dedication~",
      "Oh look who's back! Ready to hurt your wallet again? 💸",
      "{user} returns! The hunt continues~",
      "Ayyy {user}! Ready to find some deals?",
      "The hunter returns! What are we sniping today?",
    ],
  },

  // ===== SEARCHING =====
  searching: {
    normal: [
      "🔍 Hunting for **{query}**... Give me a sec!",
      "🎯 Locking onto **{query}**... Stand by!",
      "👀 Scanning AmiAmi for **{query}**...",
      "🔎 Let me check what's available for **{query}**...",
      "⏳ Searching the depths of AmiAmi for **{query}**...",
      "🎯 On the hunt for **{query}**...",
      "🔍 Scouting **{query}** deals...",
      "👁️ Eyes on **{query}**... searching...",
    ],
    spicy: [
      "👀 Oh? **{query}**? A person of culture I see... Searching~",
      "😏 **{query}** huh? Naughty naughty~ Let me look...",
      "🔥 Down bad for **{query}**? Say no more fam, searching...",
      "👀 **{query}**... Your FBI agent is taking notes. Searching anyway~",
      "😳 **{query}**?! Okay okay, no judgment here... *searches*",
      "🍷 Ah, **{query}**... A fellow researcher. Let me assist~",
      "👀💦 **{query}**... For \"display purposes\" right? RIGHT? Searching...",
      "😏 Looking for **{query}**... I respect the honesty. Searching~",
      "🔥 **{query}**? The horny jail can wait. Searching...",
      "👀 Ah yes, **{query}**... *tips fedora* Searching, m'collector...",
      "😏 **{query}**... I see you're a scholar of the arts~",
      "🌶️ **{query}**? Spicy choice. Let me look...",
    ],
    husbando: [
      "😍 **{query}**? Valid. Respectfully simping. Searching...",
      "👀 **{query}**? Excellent taste in husbandos! Looking...",
      "🔥 **{query}** huh? I don't blame you. Searching~",
      "💕 Ah, **{query}**... A cultured choice. Let me find him~",
      "✨ **{query}**? *chef's kiss* Looking now~",
      "😳 **{query}**... understandable. Searching!",
    ],
  },

  // ===== FOUND RESULTS =====
  found: {
    normal: [
      "🎉 Found **{count}** results for **{query}**!",
      "✨ Got **{count}** hits for **{query}**!",
      "🎯 Locked on! **{count}** figures found:",
      "📦 **{count}** **{query}** figures spotted:",
      "💫 Boom! **{count}** results:",
      "🔥 Got **{count}** for you:",
    ],
    spicy: [
      "😏 Found **{count}** \"research materials\" for **{query}**:",
      "👀 **{count}** cultured items found for **{query}**:",
      "🔥 **{count}** spicy finds for **{query}**... bon appétit:",
      "💦 Here's **{count}** **{query}** figures for your... collection:",
      "📚 **{count}** \"art pieces\" found for **{query}**:",
      "😏 **{count}** items for your \"research\" on **{query}**:",
      "🍷 A refined selection of **{count}** **{query}** figures:",
    ],
    single: [
      "🎯 Found one! Here's the **{query}**:",
      "✨ Got a hit on **{query}**!",
      "👀 Spotted a **{query}**:",
    ],
  },

  // ===== DEAL ALERTS =====
  deal_alert: [
    "🚨 **DEAL ALERT!** Mint figure, damaged box = BIG SAVINGS",
    "💰 **THE SWEET SPOT** — Perfect figure, sad box",
    "🔥 **SNIPER SPECIAL** — Box took an L so you don't have to",
    "👀 **CULTURED DEAL** — Who displays the box anyway?",
    "🎯 **SMART MONEY** — Mint figure, discount price",
    "💸 **STEAL ALERT** — Box got yeeted, figure pristine",
    "🧠 **BIG BRAIN DEAL** — Same figure, fraction of the price",
  ],

  // ===== NO RESULTS =====
  no_results: {
    normal: [
      "😢 No **{query}** found right now... Want me to alert you when one appears?",
      "💨 **{query}** is sold out or not listed atm. I can watch for you!",
      "🫥 Nothing for **{query}** at the moment. Shall I keep an eye out?",
      "😤 The scalpers got to **{query}** first... Want alerts for restocks?",
      "🔍 Couldn't find **{query}** right now. Say `watch {query}` and I'll ping you when it appears!",
      "😅 **{query}** is playing hard to get... Want me to stalk it for you?",
    ],
    spicy: [
      "😢 No **{query}** available... Your fellow degenerates bought them all",
      "💨 **{query}** is gone... Too many people of culture out there",
      "🫥 Someone beat you to the **{query}**... Down bad together 😔",
      "😤 All the **{query}** got sniped... The FBI was faster",
    ],
  },

  // ===== CONDITION COMMENTARY =====
  condition: {
    mint_box_damaged: [
      "🎯 THE PLAY — Mint figure, crushed box. Who displays boxes anyway?",
      "💰 Box got yeeted but figure is *chef's kiss*",
      "🧠 Big brain deal — perfect figure, discount price",
      "👀 Box took one for the team. Figure is immaculate.",
      "🔥 Damaged box = your wallet's best friend",
      "💸 Box said 📦💀 but figure said ✨😌✨",
      "🎯 Box is mid, figure is mint. Easy choice.",
      "💰 Box went through customs hell. Figure survived.",
    ],
    mint_mint: [
      "✨ Pristine condition. Instagram-ready.",
      "💎 Perfect condition but you're paying for it~",
      "👑 Mint everything. Treat yourself, king/queen.",
      "⭐ Flawless. Museum quality.",
      "✨ Immaculate vibes. No notes.",
    ],
    good: [
      "👍 Good condition! Solid pickup.",
      "✨ Looking good! Minor wear at most.",
      "👌 Nice condition for pre-owned!",
    ],
    used: [
      "👀 Has some wear but still displayable",
      "🤔 Pre-loved. Character building, as they say.",
      "💭 Someone else's ex-waifu. Could be yours now.",
      "📦 Lived a life. Still got it though.",
    ],
  },

  // ===== FIGURE TYPE REACTIONS =====
  figure_types: {
    bunny: [
      "🐰 Bunny suit? Excellent choice, fellow intellectual 😏",
      "🐰 Ah yes, the bunny aesthetic... For \"artistic\" reasons",
      "🐰 Bunny figures hit different... and hit the wallet too 💸",
      "🐰 B-style energy. Your shelf is about to glow up~",
      "🐰 Bunny ver? The pinnacle of culture.",
    ],
    bikini: [
      "👙 Bikini figure? Research purposes, I assume? 📚",
      "👙 Summer vibes~ Your display case is getting warmer",
      "👙 Bikini ver... for your beach-themed shelf, obviously",
      "👙 Swimsuit figure? Hydration is important. Stay cultured.",
    ],
    wedding: [
      "💒 Wedding dress ver? DOWN ASTRONOMICAL 💀",
      "💒 Marrying your waifu in figure form... valid honestly",
      "💒 Wedding ver... This is commitment. I respect it.",
      "💒 Bridal figure? Someone's ready to settle down~",
      "💒 Wedding dress? This is a PROPOSAL 💍",
    ],
    maid: [
      "🎀 Maid outfit? Cultured AND classy~",
      "🎀 Ah, the maid aesthetic... A timeless choice",
      "🎀 Maid ver? Someone knows what they want 😏",
      "🎀 Maid figure? *tips hat* Excellent taste.",
    ],
    nurse: [
      "💉 Nurse outfit? For... medical appreciation? 😏",
      "💉 Nurse ver! Here to heal your collection~",
      "💉 Medical professional? I'm suddenly feeling unwell...",
    ],
    racing: [
      "🏎️ Racing ver? Speed AND style, I see you~",
      "🏎️ Racing queen aesthetic? Cultured choice!",
      "🏎️ Racing figure? Fast and fabulous~",
    ],
    school: [
      "🎓 School uniform ver! Classic anime aesthetic~",
      "🎓 Uniform figure? Clean and simple. Nice.",
      "🎓 Seifuku vibes? A timeless classic.",
    ],
    china_dress: [
      "🧧 China dress? Elegant AND spicy~",
      "🧧 Qipao ver? Immaculate taste.",
    ],
    kimono: [
      "🎎 Kimono figure? Traditional beauty~",
      "🎎 Kimono ver? Elegant choice!",
    ],
  },

  // ===== CHARACTER REACTIONS =====
  characters: {
    // Chainsaw Man
    "power": [
      "🩸 POWER! Best girl energy. Nobel Prize worthy taste.",
      "🩸 Power figure?! You understand greatness.",
      "🩸 Ah, Power... The blood fiend of our hearts~",
      "🩸 POWER SUPREMACY! Let's find her!",
    ],
    "makima": [
      "🐕 Makima? Down bad for the control devil I see...",
      "🐕 Makima figure... She's already controlling your wallet",
      "🐕 woof. (You know what you're getting into)",
      "🐕 Makima? Understandable. *sits*",
    ],
    "reze": [
      "💣 Reze! Explosive taste, literally~",
      "💣 Bomb girl? Your heart AND wallet will explode",
    ],
    "denji": [
      "🪚 Denji! Chainsawman himself!",
      "🪚 Denji figure? Roof dog energy~",
    ],
    "aki": [
      "🚬 Aki? Pain incoming. Good taste though.",
      "🚬 Aki figure... *cries in manga reader*",
    ],

    // Sonico & friends
    "sonico": [
      "🎧 Super Sonico! The OG thicc queen since 2006~",
      "🎧 Sonico? Headphones AND curves. A classic.",
      "🎧 Ah, Sonico... A person of refined taste I see 😏",
      "🎧 Sonico figure? There's literally 500. Let me narrow it down~",
    ],

    // My Dress-Up Darling
    "marin": [
      "📸 MARIN?! Elite taste detected! The cosplay girlfriend everyone wants~",
      "📸 Marin Kitagawa! JuJu-sama approves 😏",
      "📸 My Dress-Up Darling? More like My Wallet's Nightmare amirite",
      "📸 Marin? Peak fiction. Peak waifu. Let's go!",
    ],

    // Re:Zero
    "rem": [
      "💙 Rem! The maid that launched a thousand collections~",
      "💙 Rem > Ram (I will not be taking questions)",
      "💙 Ah, Rem... Who's Emilia again? 😏",
      "💙 Rem figure? Your taste is *chef's kiss*",
    ],
    "ram": [
      "💗 Ram! A rare but valid choice~",
      "💗 Ram enjoyer spotted! Underrated pick.",
      "💗 Ram figure? Finally some Ram appreciation!",
    ],
    "emilia": [
      "💜 Emilia-tan! The actual main girl~",
      "💜 Emilia? Subaru would be proud.",
    ],
    "echidna": [
      "🖤 Echidna? Tea-drinking witch supremacy~",
      "🖤 Witch of Greed? Cultured choice.",
    ],

    // Vocaloid
    "miku": [
      "🎤 Hatsune Miku! The virtual diva herself~",
      "🎤 Miku? There's like 9000 figures of her. Let me narrow it down...",
      "🎤 Miku collector? Your wallet has my condolences 💐",
      "🎤 Miku figure? Which era? Which outfit? Which dimension? 😂",
    ],

    // High School DxD
    "rias": [
      "😈 Rias Gremory? Going full cultured tonight I see 🍷",
      "😈 High School DxD... A fellow researcher of the oppai arts",
      "😈 Rias? Crimson-haired cultured choice~",
    ],
    "akeno": [
      "⚡ Akeno? Ara ara~ Good taste.",
      "⚡ Akeno figure? Thunder waifu appreciation!",
    ],

    // Fate
    "saber": [
      "⚔️ Saber! The OG Fate waifu~",
      "⚔️ Artoria? A classic choice. Unlimited Budget Works incoming.",
      "⚔️ Saber figure? Which version? There's only like... 500 😅",
    ],
    "rin": [
      "💎 Rin Tohsaka! Tsundere supremacy~",
      "💎 Rin? Twin-tails and thigh-highs. Classic.",
    ],
    "sakura": [
      "🌸 Sakura Matou! The angst queen~",
      "🌸 Sakura figure? Heaven's Feel taste.",
    ],

    // Darling in the Franxx
    "zero two": [
      "🦕 Zero Two! Dino girl supremacy~",
      "🦕 Dahling~ Zero Two figure located!",
      "🦕 002? A person of culture since 2018~",
    ],

    // Demon Slayer
    "nezuko": [
      "🎋 Nezuko! Must protecc energy~",
      "🎋 Nezuko-chan! Wholesome choice!",
    ],
    "shinobu": [
      "🦋 Shinobu! Ara ara with a blade~",
      "🦋 Shinobu figure? Butterfly beauty!",
    ],
    "mitsuri": [
      "💕 Mitsuri! Love hashira energy~",
      "💕 Mitsuri? Pink AND powerful!",
    ],

    // Spy x Family
    "yor": [
      "🗡️ Yor! Mommy? Sorry. Mommy? Sorry. Mommy?",
      "🗡️ Yor Forger? Assassin waifu supremacy!",
      "🗡️ Yor? She can step on me— I mean, nice choice!",
    ],
    "anya": [
      "🥜 Anya! Waku waku! 🥜",
      "🥜 Anya figure? Heh~ *smug face*",
    ],

    // Overlord
    "albedo": [
      "🖤 Albedo! Bone daddy's #1 simp~",
      "🖤 Overlord's Albedo? Cultured Nazarick enjoyer detected",
    ],
    "shalltear": [
      "🩸 Shalltear! Vampire chair loli~",
      "🩸 Shalltear? True vampire enthusiast!",
    ],

    // Konosuba
    "megumin": [
      "💥 EXPLOSION! Megumin best girl!",
      "💥 Megumin? Bakuretsu bakuretsu la la la~",
    ],
    "darkness": [
      "⚔️ Darkness? She'd enjoy being hunted like this~",
      "⚔️ Lalatina! *gets bonked*",
    ],
    "aqua": [
      "💧 Aqua! Useless goddess but we love her~",
      "💧 Aqua figure? Nature's beauty! (party tricks not included)",
    ],

    // Dragon Maid
    "tohru": [
      "🐉 Tohru! Dragon maid of culture~",
      "🐉 Tohru figure? THICC dragon energy incoming",
    ],
    "kanna": [
      "⚡ Kanna! Ravioli ravioli~",
      "⚡ Kanna? Must protect the dragon loli!",
    ],
    "lucoa": [
      "🌽 Lucoa?! 👀👀👀 Searching...",
      "🌽 Quetzalcoatl? Top heavy dragon incoming~",
    ],
    "ilulu": [
      "🔥 Ilulu! Smol but stacked dragon~",
      "🔥 Ilulu figure? Chaos energy!",
    ],

    // Genshin
    "raiden": [
      "⚡ Raiden Shogun! Eternity waifu~",
      "⚡ Ei? Booba sword supremacy!",
    ],
    "hu tao": [
      "🔥 Hu Tao! Funeral parlor bestie~",
      "🔥 Hu Tao? Who? Tao, yeah!",
    ],
    "ganyu": [
      "🐐 Ganyu! Cocogoat located!",
      "🐐 Ganyu figure? Cryo waifu secured!",
    ],
    "keqing": [
      "⚡ Keqing! Hardworking cat girl~",
      "⚡ Keqing? Electro queen!",
    ],

    // Husbandos - JJK
    "gojo": [
      "👁️ Gojo? Valid. Those eyes... I get it.",
      "👁️ Satoru Gojo! The blindfold can stay on or off, your choice~",
      "👁️ Gojo? He IS the honored one.",
    ],
    "sukuna": [
      "👹 Sukuna?! Down bad for the King of Curses I see~",
      "👹 Ryomen Sukuna! Malevolent but make it hot.",
    ],
    "toji": [
      "💪 Toji? DILF of culture detected",
      "💪 Toji Fushiguro! The sorcerer killer and heart stealer~",
    ],
    "nanami": [
      "👔 Nanami! Working overtime in your heart~",
      "👔 Kento Nanami? 9-5 husband material.",
    ],
    "geto": [
      "🖤 Geto? The better villain?",
      "🖤 Suguru Geto! *cries*",
    ],
    "megumi": [
      "🐕 Megumi? Good boy energy!",
      "🐕 Fushiguro! Ten shadows taste~",
    ],

    // Husbandos - AoT
    "levi": [
      "🧹 Levi Ackerman! Short king energy~",
      "🧹 Levi? Clean taste. He'd approve.",
      "🧹 Captain Levi? *salutes*",
    ],
    "eren": [
      "🔥 Eren? *paths noises*",
      "🔥 Eren Yeager! Freedom!",
    ],

    // Husbandos - Misc
    "kakashi": [
      "📖 Kakashi! Reading... literature. 👀",
      "📖 Kakashi-sensei? Cultured choice.",
    ],
    "itachi": [
      "🌀 Itachi... *cries in Sasuke*",
      "🌀 Itachi Uchiha? Pain. Beautiful pain.",
    ],
  },

  // ===== PRICE REACTIONS =====
  prices: {
    budget: [
      "💰 That's a steal! Your wallet says thanks~",
      "🤑 Budget-friendly AND cute? We love to see it",
      "💵 Cheap AND good? This is the way.",
      "💰 Your bank account approves this message.",
    ],
    mid: [
      "💴 Fair price for the quality~",
      "💵 Not bad, not bad. Solid deal.",
      "💰 Reasonable! Your wallet will survive.",
      "👍 Standard pricing. No complaints.",
    ],
    expensive: [
      "💸 Pricey but she's worth it... right? RIGHT?",
      "💰 Your wallet is crying but your shelf will be happy",
      "💳 Credit card-kun is sweating rn",
      "💸 Expensive? Yes. Worth it? Also yes.",
    ],
    whale: [
      "🐋 WHALE ALERT. This is commitment.",
      "💎 Grail-tier pricing. Only for the dedicated.",
      "💸💸💸 Your bank account will remember this decision.",
      "🏦 Time to sell a kidney? Worth it honestly.",
      "💳 Credit card just fainted.",
    ],
  },

  // ===== WATCH/SUBSCRIBE =====
  watch: {
    added: [
      "✅ Got it! I'll DM you when **{query}** appears under ¥{price}!",
      "🔔 Subscribed! You'll be first to know about **{query}** deals~",
      "👀 I'm watching **{query}** for you now. I never sleep. Never blink.",
      "🎯 Alert set! I'll ping you faster than scalpers can checkout~",
      "🔔 **{query}** is on my radar! I'll DM you when it drops!",
    ],
    already_watching: [
      "👀 You're already watching **{query}**! I gotchu~",
      "🔔 **{query}** is already on your list! Patience, hunter~",
    ],
    removed: [
      "❌ Removed **{query}** from your watchlist. Giving up? 😢",
      "🔕 Unsubscribed from **{query}**. Your wallet thanks you... for now.",
      "👋 **{query}** removed. The hunt ends... for now.",
    ],
    list_header: [
      "📋 **Your Watchlist** — I'm hunting these for you:",
      "👀 **Active Hunts** — Always watching~",
      "🎯 **Your Targets** — I never sleep:",
    ],
    list_empty: [
      "📋 Your watchlist is empty! Tell me what to hunt~",
      "👀 Nothing on your radar yet. What should I watch for?",
      "🎯 No active hunts. Give me a target!",
    ],
  },

  // ===== HELP =====
  help: [
    "**🎎 WAIFU DEAL SNIPER — How to Use**\n\n" +
    "Just chat with me naturally! I understand:\n\n" +
    "🔍 **Searching**\n" +
    "• `looking for rem figures`\n" +
    "• `any sonico bikini under 10000?`\n" +
    "• `find me chainsaw man power`\n\n" +
    "🔔 **Watch Alerts** (I'll DM you!)\n" +
    "• `watch marin under 15000`\n" +
    "• `alert me for zero two`\n" +
    "• `notify me when gojo appears`\n\n" +
    "📋 **Manage Watchlist**\n" +
    "• `my watchlist` — see your hunts\n" +
    "• `stop watching rem` — remove alert\n\n" +
    "💡 **Tips**\n" +
    "• I find **\"mint figure, damaged box\"** deals — 40-50% off!\n" +
    "• Be specific: `rem bunny` > just `rem`\n" +
    "• I search AmiAmi's pre-owned section\n\n" +
    "*Happy hunting!* 🎯",
  ],

  // ===== ERROR / MISC =====
  errors: {
    search_failed: [
      "😵 Something went wrong! AmiAmi might be down or my brain broke. Try again?",
      "💀 Error! The hunt failed... Let's try again?",
      "🫠 Oops, something died. Not the waifus though, they're fine.",
      "😅 Technical difficulties! Even the best hunters miss sometimes. Retry?",
    ],
    slow: [
      "⏳ AmiAmi is being slow... Must be all the collectors shopping",
      "⏳ Taking a moment... *taps table impatiently*",
      "⏳ Loading... The waifu hunt requires patience~",
    ],
    invalid_price: [
      "🤔 I couldn't understand that price. Try like: `watch rem under 10000`",
      "❓ Price unclear! Use numbers like: `watch sonico 15000`",
    ],
  },

  // ===== FUN FACTS / EASTER EGGS =====
  fun_facts: [
    "💡 Did you know? The average figure collector has 47 figures and 0 savings.",
    "💡 Fun fact: 'I'll just buy one more' is the biggest lie in the hobby.",
    "💡 Remember: You're not addicted, you're ✨passionate✨",
    "💡 Hot take: Nendoroids are gateway drugs to 1/4 scale bunnies.",
    "💡 Pro tip: Damaged box figures are the secret meta.",
    "💡 Studies show: 100% of figure collectors have excellent taste.",
  ],

};

// ===== KEYWORD LISTS =====
const SPICY_KEYWORDS = [
  'bikini', 'bunny', 'swimsuit', 'bath', 'lingerie', 'maid', 'nurse',
  'wedding', 'bride', 'naked', 'cast off', 'b-style', 'freeing',
  'oppai', 'ecchi', 'sexy', 'hot', 'thicc', '1/4', 'bare leg',
  'succubus', 'demon girl', 'devil', 'china dress', 'leotard',
];

const HUSBANDO_KEYWORDS = [
  'gojo', 'levi', 'eren', 'sukuna', 'toji', 'nanami', 'geto', 'megumi',
  'deku', 'bakugo', 'todoroki', 'aizawa', 'hawks',
  'kakashi', 'itachi', 'sasuke', 'naruto', 'minato',
  'zoro', 'sanji', 'law', 'ace', 'shanks',
  'diluc', 'zhongli', 'childe', 'ayato', 'alhaitham', 'xiao',
  'cloud', 'sephiroth', 'noctis', 'leon',
];

const FIGURE_TYPE_KEYWORDS = {
  bunny: ['bunny', 'b-style', 'freeing', 'rabbit'],
  bikini: ['bikini', 'swimsuit', 'swim', 'beach', 'summer'],
  wedding: ['wedding', 'bride', 'bridal'],
  maid: ['maid', 'meido'],
  nurse: ['nurse', 'medical'],
  school: ['school', 'uniform', 'seifuku'],
  racing: ['racing', 'race queen'],
  china_dress: ['china dress', 'qipao', 'chinese dress'],
  kimono: ['kimono', 'yukata', 'japanese dress'],
};

module.exports = {
  TEMPLATES,
  SPICY_KEYWORDS,
  HUSBANDO_KEYWORDS,
  FIGURE_TYPE_KEYWORDS,
};
