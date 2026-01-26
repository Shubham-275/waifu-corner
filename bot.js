// =====================================
// 🎎 WAIFU DEAL SNIPER - PRODUCTION BOT
// =====================================
// "Protect the waifu. Save the laifu. Snipe the deal."
// 
// A hosted Discord bot for anime figure collectors
// Users just DM the bot - no setup required!

require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, Partials } = require('discord.js');
const { TEMPLATES, SPICY_KEYWORDS, HUSBANDO_KEYWORDS, FIGURE_TYPE_KEYWORDS } = require('./templates');
const db = require('./database');

// =====================================
// ⚙️ CONFIG
// =====================================
const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MINO_API_KEY: process.env.MINO_API_KEY,
  MINO_ENDPOINT: 'https://mino.ai/v1/automation/run-sse',
  WATCH_INTERVAL: 5 * 60 * 1000, // 5 minutes
  RATE_LIMIT_WINDOW: 60000,      // 1 minute
  RATE_LIMIT_MAX: 10,            // 10 searches per minute
  MAX_WATCHES_PER_USER: 20,
};

// =====================================
// 🎲 HELPERS
// =====================================
function pick(arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(template, vars) {
  if (!template) return '';
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    const safeVal = sanitizeForDisplay(String(val));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), safeVal);
  }
  return result;
}

// =====================================
// 🔒 SECURITY HELPERS
// =====================================

// Sanitize for Discord display (prevent markdown injection)
function sanitizeForDisplay(str) {
  if (!str) return '';
  return str
    .replace(/`/g, '\\`')
    .replace(/@/g, '＠')      // Full-width @ to prevent mentions
    .replace(/#/g, '＃')      // Full-width # to prevent channel mentions
    .slice(0, 200);
}

// Validate search query
function sanitizeQuery(query) {
  if (!query || typeof query !== 'string') return null;
  let clean = query.trim().replace(/\s+/g, ' ');
  if (clean.length > 100) clean = clean.slice(0, 100);
  if (clean.length < 2) return null;
  return clean;
}

// Validate price
function sanitizePrice(price) {
  if (price === null || price === undefined) return null;
  const num = parseInt(price, 10);
  if (isNaN(num) || num < 0) return null;
  if (num > 10000000) return 10000000;
  return num;
}

// Rate limiting
const rateLimits = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { count: 0, resetAt: now + CONFIG.RATE_LIMIT_WINDOW };
  
  if (now > userLimits.resetAt) {
    userLimits.count = 0;
    userLimits.resetAt = now + CONFIG.RATE_LIMIT_WINDOW;
  }
  
  userLimits.count++;
  rateLimits.set(userId, userLimits);
  
  return userLimits.count <= CONFIG.RATE_LIMIT_MAX;
}

// =====================================
// 🎭 PERSONALITY DETECTION
// =====================================
function isSpicy(query) {
  const q = query.toLowerCase();
  return SPICY_KEYWORDS.some(kw => q.includes(kw));
}

function isHusbando(query) {
  const q = query.toLowerCase();
  return HUSBANDO_KEYWORDS.some(kw => q.includes(kw));
}

function getFigureType(query) {
  const q = query.toLowerCase();
  for (const [type, keywords] of Object.entries(FIGURE_TYPE_KEYWORDS)) {
    if (keywords.some(kw => q.includes(kw))) return type;
  }
  return null;
}

function getCharacterReaction(query) {
  const q = query.toLowerCase();
  for (const [char, reactions] of Object.entries(TEMPLATES.characters)) {
    if (q.includes(char)) return pick(reactions);
  }
  return null;
}

function getPriceReaction(price) {
  if (price < 3000) return pick(TEMPLATES.prices.budget);
  if (price < 10000) return pick(TEMPLATES.prices.mid);
  if (price < 25000) return pick(TEMPLATES.prices.expensive);
  return pick(TEMPLATES.prices.whale);
}

function getConditionComment(itemGrade, boxGrade) {
  const item = (itemGrade || '').toUpperCase();
  const box = (boxGrade || '').toUpperCase();
  
  if ((item === 'A' || item === 'A-') && (box === 'B' || box === 'B-' || box === 'C')) {
    return pick(TEMPLATES.condition.mint_box_damaged);
  }
  if (item === 'A' && box === 'A') {
    return pick(TEMPLATES.condition.mint_mint);
  }
  if (item === 'A-' || item === 'B+') {
    return pick(TEMPLATES.condition.good);
  }
  return pick(TEMPLATES.condition.used);
}

function isDeal(item) {
  const itemGrade = (item.item_grade || '').toUpperCase();
  const boxGrade = (item.box_grade || '').toUpperCase();
  return (itemGrade === 'A' || itemGrade === 'A-') && 
         (boxGrade === 'B' || boxGrade === 'B-' || boxGrade === 'C');
}

// =====================================
// 🔍 MINO API - AmiAmi Search
// =====================================
async function searchAmiAmi(query, maxPrice = null) {
  const searchUrl = `https://www.amiami.com/eng/search/list/?s_keywords=${encodeURIComponent(query)}&s_st_condition_flg=1`;
  
  const goal = `Scrape pre-owned figure listings from this AmiAmi page.

Look at each product card. The title text contains condition grades in format "(Pre-owned ITEM:X/BOX:Y)" where X and Y are grades like A, A-, B+, B, or C.

For each product (max 8), extract:
- raw_title: Copy the FULL title text EXACTLY as displayed, starting with "(Pre-owned ITEM:..."
- price: Price in JPY (number only)
- url: Product link
- image: Image URL
- in_stock: true/false

Return JSON array like:
[{"raw_title": "(Pre-owned ITEM:A/BOX:B)Figure Name", "price": 5000, "url": "...", "image": "...", "in_stock": true}]${maxPrice ? `\n\nOnly items under ${maxPrice} JPY.` : ''}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);
    
    const response = await fetch(CONFIG.MINO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': CONFIG.MINO_API_KEY,
      },
      body: JSON.stringify({ 
        url: searchUrl, 
        goal,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeout);

    if (!response.ok) {
      console.error('Mino API error:', response.status);
      return { success: false, error: `API error: ${response.status}` };
    }

    // Parse SSE response
    const text = await response.text();
    const lines = text.split('\n');
    
    console.log('Mino response length:', text.length, 'bytes');
    
    // Look for the COMPLETE event which contains results
    let foundItems = null;
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const event = JSON.parse(line.slice(6));
          
          // Log event types for debugging
          if (event.type) {
            console.log(`Mino event: ${event.type}`);
          }
          
          // Check for COMPLETE event
          if (event.type === 'COMPLETE') {
            console.log('Mino COMPLETE event received');
            
            // Try different fields where results might be
            let items = event.result || event.items || event.resultJson || event.output || event.data;
            
            if (typeof items === 'string') {
              items = items.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
              try {
                items = JSON.parse(items);
              } catch (e) {
                console.error('Failed to parse items string:', e.message);
              }
            }
            
            // Handle nested items/result
            if (items && typeof items === 'object') {
              foundItems = Array.isArray(items) ? items : (items.items || items.result || []);
            }
          }
          
          // Check for errors
          if (event.type === 'ERROR' || event.status === 'FAILED') {
            console.error('Mino error event:', event.error || event.message);
            return { success: false, error: event.error || event.message };
          }
        } catch (e) {
          // Not valid JSON, skip this line
        }
      }
    }
    
    if (foundItems && foundItems.length > 0) {
      // Post-process: Parse grades from raw_title/full_title/name
      foundItems = foundItems.map(item => {
        const title = item.raw_title || item.full_title || item.name || '';
        
        // Try to extract grades from title like "(Pre-owned ITEM:A/BOX:B)" or "(Pre-owned ITEM:A- BOX:B)"
        const gradeMatch = title.match(/ITEM:\s*([A-C][+-]?)\s*[\/\s]*BOX:\s*([A-C][+-]?)/i);
        
        if (gradeMatch) {
          item.item_grade = gradeMatch[1].toUpperCase();
          item.box_grade = gradeMatch[2].toUpperCase();
          // Clean the name - remove the condition prefix
          item.name = title.replace(/^\(Pre-owned\s+ITEM:[A-C][+-]?\s*[\/\s]*BOX:[A-C][+-]?\)\s*/i, '').trim() || item.name;
        } else {
          // Keep existing values if present, otherwise null
          item.item_grade = (item.item_grade && item.item_grade !== '') ? item.item_grade : null;
          item.box_grade = (item.box_grade && item.box_grade !== '') ? item.box_grade : null;
          item.name = item.name || title;
        }
        
        console.log(`  → ${(item.name || 'Unknown').slice(0, 40)}... | Item: ${item.item_grade || '?'} | Box: ${item.box_grade || '?'}`);
        
        return item;
      });
      
      console.log(`✅ Mino found ${foundItems.length} items`);
      return { success: true, items: foundItems };
    }
    
    // Fallback: try parsing entire response as JSON
    try {
      const fullJson = JSON.parse(text);
      const items = fullJson.items || fullJson.result || (Array.isArray(fullJson) ? fullJson : null);
      
      if (items && items.length > 0) {
        console.log(`✅ Mino found ${items.length} items (fallback JSON)`);
        return { success: true, items };
      }
    } catch (e) {
      // Not valid JSON
    }
    
    // Log last part of response for debugging
    console.log('Mino response tail:', text.slice(-500));
    console.error('❌ No items found in Mino response');
    return { success: false, error: 'No results found' };
  } catch (error) {
    console.error('Search error:', error.message);
    return { success: false, error: error.message };
  }
}

// =====================================
// 🎨 DISCORD EMBEDS
// =====================================
function createFigureEmbed(item) {
  const isGoodDeal = isDeal(item);
  const price = parseInt(item.price) || 0;
  
  const embed = new EmbedBuilder()
    .setColor(isGoodDeal ? 0xFF6B6B : 0x6C5CE7)
    .setTitle(`${isGoodDeal ? '🔥 ' : ''}${(item.name || 'Figure').slice(0, 250)}`)
    .setURL(item.url || 'https://www.amiami.com');
  
  if (item.image) {
    embed.setThumbnail(item.image);
  }
  
  let desc = '';
  if (isGoodDeal) {
    desc += `**${pick(TEMPLATES.deal_alert)}**\n\n`;
  }
  
  desc += `💴 **¥${price.toLocaleString()}**\n`;
  desc += `✨ Figure: **${item.item_grade || '?'}** | 📦 Box: **${item.box_grade || '?'}**\n`;
  desc += `${item.in_stock !== false ? '✅ In Stock' : '❌ Sold Out'}\n\n`;
  desc += `*${getConditionComment(item.item_grade, item.box_grade)}*`;
  
  embed.setDescription(desc);
  embed.setFooter({ text: `${getPriceReaction(price)} • Click title to buy!` });
  
  return embed;
}

function createResultsSummaryEmbed(items, query, spicy) {
  const deals = items.filter(isDeal);
  const templates = spicy ? TEMPLATES.found.spicy : TEMPLATES.found.normal;
  
  const embed = new EmbedBuilder()
    .setColor(spicy ? 0xE91E63 : 0x6C5CE7)
    .setTitle(`🎯 Results for "${sanitizeForDisplay(query)}"`)
    .setDescription(fill(pick(templates), { count: items.length, query }));
  
  if (deals.length > 0) {
    embed.addFields({
      name: '🔥 Deals Found!',
      value: `${deals.length} item(s) with mint figure + damaged box discount!`
    });
  }
  
  embed.setFooter({ text: `Say "watch ${query}" to get alerts! 🔔` });
  
  return embed;
}

// =====================================
// 🗣️ NATURAL LANGUAGE PARSER
// =====================================
function parseMessage(content) {
  const lower = content.toLowerCase().trim();
  
  // Help
  if (/^(help|commands|how|what can you do)/i.test(lower)) {
    return { intent: 'help' };
  }
  
  // Greetings
  if (/^(hey|hi|hello|yo|sup|henlo|hii+|hewwo|ohayo)(!|\?)?$/i.test(lower)) {
    return { intent: 'greeting' };
  }
  
  // Watchlist
  if (/^(my )?(watchlist|watches|alerts|list|hunting)$/i.test(lower)) {
    return { intent: 'watchlist' };
  }
  
  // Stop watching
  const unwatchMatch = lower.match(/^(stop watching|unwatch|remove|cancel|delete)\s+(.+)/i);
  if (unwatchMatch) {
    return { intent: 'unwatch', query: unwatchMatch[2].trim() };
  }
  
  // Watch/alert
  const watchPatterns = [
    /^(?:watch|alert|notify|ping|dm|tell)\s+(?:me\s+)?(?:for\s+|when\s+|if\s+)?(.+?)(?:\s+under\s+|\s*<\s*|\s+max\s+)?(\d+)?$/i,
    /^(.+?)\s+(?:alert|notify|watch)(?:\s+under\s+|\s*<\s*)?(\d+)?$/i,
  ];
  for (const pattern of watchPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const query = match[1].replace(/^(for|when|if)\s+/i, '').replace(/\s+(appears?|drops?|available|shows? up).*$/i, '').trim();
      const price = match[2] ? parseInt(match[2]) : null;
      if (query.length > 2) {
        return { intent: 'watch', query, maxPrice: price || 999999 };
      }
    }
  }
  
  // Search patterns
  const searchPatterns = [
    /^(?:looking for|find|search|hunt|show|any|got any|get me|i want|i need)\s+(.+?)(?:\s+under\s+|\s*<\s*)(\d+)?.*$/i,
    /^(?:any\s+)?(.+?)\s+(?:figures?|deals?|available|in stock)\??(?:\s+under\s+(\d+))?$/i,
    /^(.+?)\s+under\s+(\d+)/i,
  ];
  for (const pattern of searchPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const query = match[1]
        .replace(/\?+$/, '')
        .replace(/\s*(figures?|deals?|please|pls|thx|thanks)\s*/gi, ' ')
        .trim();
      const price = match[2] ? parseInt(match[2]) : null;
      if (query.length > 2) {
        return { intent: 'search', query, maxPrice: price };
      }
    }
  }
  
  // Stats
  if (/^(stats|statistics|my stats|status)$/i.test(lower)) {
    return { intent: 'stats' };
  }
  
  // Default: treat short text as search
  if (lower.length > 3 && lower.length < 50 && !lower.includes('?')) {
    return { intent: 'search', query: lower };
  }
  
  return { intent: 'unknown' };
}

// =====================================
// 🤖 MESSAGE HANDLERS
// =====================================
async function handleMessage(message, content) {
  const username = message.author.username;
  const discordId = message.author.id;
  
  // Get or create user
  const user = db.getOrCreateUser(discordId, username);
  db.updateUserActivity(discordId);
  
  const isNew = db.isNewUser(discordId);
  const parsed = parseMessage(content);
  
  try {
    switch (parsed.intent) {
      case 'help':
        await message.reply(TEMPLATES.help[0]);
        break;
        
      case 'greeting':
        if (isNew) {
          await message.reply(fill(TEMPLATES.welcome[0], { user: username }));
        } else {
          await message.reply(fill(pick(TEMPLATES.greetings.returning), { user: username }));
        }
        break;
        
      case 'search':
        await handleSearch(message, user, parsed.query, parsed.maxPrice);
        break;
        
      case 'watch':
        await handleWatch(message, user, parsed.query, parsed.maxPrice);
        break;
        
      case 'watchlist':
        await handleWatchlist(message, user);
        break;
        
      case 'unwatch':
        await handleUnwatch(message, user, parsed.query);
        break;
        
      case 'stats':
        await handleStats(message, user);
        break;
        
      default:
        if (!message.guild) { // DM
          const response = isNew 
            ? fill(TEMPLATES.welcome[0], { user: username })
            : `🤔 Not sure what you mean! Try:\n• \`looking for rem figures\`\n• \`watch marin under 15000\`\n• \`help\``;
          await message.reply(response);
        }
    }
  } catch (error) {
    console.error('Handler error:', error);
    await message.reply(pick(TEMPLATES.errors.search_failed)).catch(() => {});
  }
}

async function handleSearch(message, user, query, maxPrice) {
  // Validate inputs
  const cleanQuery = sanitizeQuery(query);
  if (!cleanQuery) {
    await message.reply("🤔 That search doesn't look right. Try: `looking for rem figures`");
    return;
  }
  
  const cleanPrice = sanitizePrice(maxPrice);
  
  // Rate limit check
  if (!checkRateLimit(user.discord_id)) {
    await message.reply("⏳ Slow down! Too many searches. Try again in a minute~");
    return;
  }
  
  const spicy = isSpicy(cleanQuery);
  const husbando = isHusbando(cleanQuery);
  const figureType = getFigureType(cleanQuery);
  const charReaction = getCharacterReaction(cleanQuery);
  
  // Build response
  let searchMsg = '';
  if (charReaction) {
    searchMsg += charReaction + '\n\n';
  } else if (figureType && TEMPLATES.figure_types[figureType]) {
    searchMsg += pick(TEMPLATES.figure_types[figureType]) + '\n\n';
  }
  
  const templates = husbando ? TEMPLATES.searching.husbando :
                    spicy ? TEMPLATES.searching.spicy :
                    TEMPLATES.searching.normal;
  searchMsg += fill(pick(templates), { query: cleanQuery });
  
  const statusMsg = await message.reply(searchMsg);
  
  // Search!
  const result = await searchAmiAmi(cleanQuery, cleanPrice);
  db.incrementSearchCount(user.id);
  
  if (!result.success) {
    await statusMsg.edit(searchMsg + '\n\n' + pick(TEMPLATES.errors.search_failed));
    return;
  }
  
  if (!result.items || result.items.length === 0) {
    const noResult = fill(
      pick(spicy ? TEMPLATES.no_results.spicy : TEMPLATES.no_results.normal),
      { query: cleanQuery }
    );
    await statusMsg.edit(searchMsg + '\n\n' + noResult);
    return;
  }
  
  // Log & count deals
  db.logSearch(user.id, cleanQuery, result.items.length);
  const deals = result.items.filter(isDeal);
  if (deals.length > 0) {
    db.incrementDealsFound(user.id, deals.length);
  }
  
  // Send results
  const summaryEmbed = createResultsSummaryEmbed(result.items, cleanQuery, spicy);
  await statusMsg.edit({ content: searchMsg, embeds: [summaryEmbed] });
  
  const toShow = result.items.slice(0, 5);
  for (const item of toShow) {
    await message.channel.send({ embeds: [createFigureEmbed(item)] });
  }
  
  if (result.items.length > 5) {
    await message.channel.send(`*...and ${result.items.length - 5} more! Say \`watch ${sanitizeForDisplay(cleanQuery)}\` to get alerts~*`);
  }
}

async function handleWatch(message, user, query, maxPrice) {
  const cleanQuery = sanitizeQuery(query);
  if (!cleanQuery) {
    await message.reply("🤔 That doesn't look right. Try: `watch rem under 10000`");
    return;
  }
  
  const cleanPrice = sanitizePrice(maxPrice) || 999999;
  
  // Check limit
  const currentWatches = db.getUserWatchlist(user.id);
  if (currentWatches.length >= CONFIG.MAX_WATCHES_PER_USER) {
    await message.reply(`😅 You have ${CONFIG.MAX_WATCHES_PER_USER} watches! Remove some with \`stop watching <figure>\` first.`);
    return;
  }
  
  const result = db.addToWatchlist(user.id, cleanQuery, cleanPrice);
  const template = result.new ? pick(TEMPLATES.watch.added) : pick(TEMPLATES.watch.already_watching);
  await message.reply(fill(template, { query: cleanQuery, price: cleanPrice.toLocaleString() }));
}

async function handleWatchlist(message, user) {
  const watches = db.getUserWatchlist(user.id);
  
  if (watches.length === 0) {
    await message.reply(pick(TEMPLATES.watch.list_empty));
    return;
  }
  
  let response = pick(TEMPLATES.watch.list_header) + '\n\n';
  watches.forEach((w, i) => {
    const price = w.max_price < 999999 ? `under ¥${w.max_price.toLocaleString()}` : 'any price';
    response += `${i + 1}. **${sanitizeForDisplay(w.query)}** — ${price}\n`;
  });
  response += `\n*Say \`stop watching <name>\` to remove~*`;
  
  await message.reply(response);
}

async function handleUnwatch(message, user, query) {
  const cleanQuery = sanitizeQuery(query);
  if (!cleanQuery) {
    await message.reply("🤔 What should I stop watching? Say `watchlist` to see your hunts!");
    return;
  }
  
  const removed = db.removeFromWatchlist(user.id, cleanQuery);
  if (removed) {
    await message.reply(fill(pick(TEMPLATES.watch.removed), { query: cleanQuery }));
  } else {
    await message.reply(`🤔 Couldn't find "${sanitizeForDisplay(cleanQuery)}" in your watchlist.`);
  }
}

async function handleStats(message, user) {
  const stats = db.getUserStats(user.discord_id);
  const globalStats = db.getStats();
  
  const embed = new EmbedBuilder()
    .setColor(0x6C5CE7)
    .setTitle('📊 Your Hunting Stats')
    .setDescription(`
🔍 **Searches:** ${stats.total_searches}
🔥 **Deals Found:** ${stats.deals_found}
👀 **Active Watches:** ${stats.active_watches}
📅 **Joined:** ${new Date(stats.created_at).toLocaleDateString()}
    `)
    .setFooter({ text: `🌍 Global: ${globalStats.totalUsers} hunters • ${globalStats.totalSearches} searches` });
  
  await message.reply({ embeds: [embed] });
}

// =====================================
// 🔔 BACKGROUND WATCH CHECKER
// =====================================
async function runWatchChecker(client) {
  console.log('🔔 Running watch checker...');
  
  const watches = db.getAllActiveWatches();
  console.log(`   Checking ${watches.length} active watches`);
  
  for (const watch of watches) {
    try {
      await new Promise(r => setTimeout(r, 3000)); // Rate limit
      
      const result = await searchAmiAmi(watch.query, watch.max_price);
      db.updateWatchChecked(watch.id);
      
      if (!result.success || !result.items?.length) continue;
      
      const user = db.getOrCreateUser(watch.discord_id);
      const deals = result.items.filter(isDeal);
      
      for (const deal of deals) {
        if (!deal.url || db.hasBeenNotified(user.id, deal.url)) continue;
        
        try {
          const discordUser = await client.users.fetch(watch.discord_id);
          const embed = createFigureEmbed(deal);
          embed.setTitle(`🚨 DEAL: ${(deal.name || watch.query).slice(0, 200)}`);
          
          await discordUser.send({
            content: `🔔 **Found a deal for "${sanitizeForDisplay(watch.query)}"!**`,
            embeds: [embed]
          });
          
          db.markNotified(user.id, deal.url);
          db.incrementWatchNotified(watch.id);
          console.log(`   ✅ Notified ${watch.discord_id}`);
        } catch (e) {
          console.log(`   ❌ Couldn't DM ${watch.discord_id}: ${e.message}`);
        }
      }
    } catch (e) {
      console.error(`   Error on watch ${watch.id}:`, e.message);
    }
  }
  
  console.log('🔔 Watch check complete');
}

// =====================================
// 🚀 START BOT
// =====================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once('ready', () => {
  console.log('');
  console.log('🎎 ═══════════════════════════════════════');
  console.log('🎎  WAIFU DEAL SNIPER is ONLINE!');
  console.log(`🎎  Logged in as ${client.user.tag}`);
  console.log(`🎎  Serving ${client.guilds.cache.size} servers`);
  console.log('🎎 ═══════════════════════════════════════');
  console.log('');
  
  client.user.setActivity('DM me to hunt figures! 🎎', { type: ActivityType.Custom });
  
  // Start watch checker
  setInterval(() => runWatchChecker(client), CONFIG.WATCH_INTERVAL);
  setTimeout(() => runWatchChecker(client), 30000);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const isDM = !message.guild;
  const isMentioned = message.mentions.has(client.user);
  
  // Debug logging
  console.log(`📨 Message from ${message.author.username}: "${message.content.slice(0, 50)}" (DM: ${isDM})`);
  
  if (isDM || isMentioned) {
    // Remove bot mention from content if present
    const cleanContent = message.content.replace(/<@!?\d+>/g, '').trim();
    if (cleanContent || isDM) {
      await handleMessage(message, cleanContent || message.content);
    }
  }
});

client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

if (!CONFIG.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN not set!');
  process.exit(1);
}

if (!CONFIG.MINO_API_KEY) {
  console.error('❌ MINO_API_KEY not set!');
  process.exit(1);
}

// Initialize database then start bot
db.initDb().then(() => {
  console.log('💾 Database initialized');
  client.login(CONFIG.DISCORD_TOKEN);
}).catch(err => {
  console.error('❌ Database init failed:', err);
  process.exit(1);
});
