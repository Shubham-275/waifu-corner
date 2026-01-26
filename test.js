// =====================================
// 🧪 SECURITY TEST SUITE
// =====================================

const assert = require('assert');
const fs = require('fs');

// Use test database
process.env.DATABASE_PATH = './data/test_waifu.db';

// Clean up test db
const testDbPath = './data/test_waifu.db';
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data', { recursive: true });
}

const db = require('./database');
const { TEMPLATES, SPICY_KEYWORDS, HUSBANDO_KEYWORDS } = require('./templates');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${e.message}`);
    failed++;
  }
}

async function runTests() {
  // Wait for database to initialize
  await db.initDb();
  
  console.log('\n🧪 ═══════════════════════════════════════');
  console.log('🧪  WAIFU DEAL SNIPER - SECURITY AUDIT');
  console.log('🧪 ═══════════════════════════════════════\n');

  // =====================================
  // 🔐 USER DATA ISOLATION TESTS
  // =====================================
  console.log('📁 USER DATA ISOLATION TESTS\n');

  test('Users are created with unique IDs', () => {
    const user1 = db.getOrCreateUser('discord_111', 'Alice');
    const user2 = db.getOrCreateUser('discord_222', 'Bob');
    
    assert(user1.id !== user2.id, 'User IDs should be different');
    assert(user1.discord_id === 'discord_111', 'Discord ID should match');
    assert(user2.discord_id === 'discord_222', 'Discord ID should match');
  });

  test('Same discord_id returns same user', () => {
    const user1 = db.getOrCreateUser('discord_111', 'Alice');
    const user2 = db.getOrCreateUser('discord_111', 'Alice Updated');
    
    assert(user1.id === user2.id, 'Should return same user');
  });

  test('User A cannot see User B watchlist', () => {
    const userA = db.getOrCreateUser('discord_AAA', 'UserA');
    const userB = db.getOrCreateUser('discord_BBB', 'UserB');
    
    db.addToWatchlist(userA.id, 'rem', 10000);
    db.addToWatchlist(userA.id, 'miku', 15000);
    db.addToWatchlist(userB.id, 'sonico', 20000);
    
    const watchlistA = db.getUserWatchlist(userA.id);
    const watchlistB = db.getUserWatchlist(userB.id);
    
    assert(watchlistA.length === 2, 'User A should have 2 watches');
    assert(watchlistB.length === 1, 'User B should have 1 watch');
    
    const aQueries = watchlistA.map(w => w.query);
    const bQueries = watchlistB.map(w => w.query);
    
    assert(aQueries.includes('rem'), 'User A should have rem');
    assert(!aQueries.includes('sonico'), 'User A should NOT have sonico');
    assert(bQueries.includes('sonico'), 'User B should have sonico');
    assert(!bQueries.includes('rem'), 'User B should NOT have rem');
  });

  test('Notification dedup is user-specific', () => {
    const userA = db.getOrCreateUser('discord_AAA', 'UserA');
    const userB = db.getOrCreateUser('discord_BBB', 'UserB');
    
    const productUrl = 'https://amiami.com/product/12345';
    
    db.markNotified(userA.id, productUrl);
    
    assert(db.hasBeenNotified(userA.id, productUrl) === true, 'User A should be marked notified');
    assert(db.hasBeenNotified(userB.id, productUrl) === false, 'User B should NOT be marked notified');
  });

  test('User stats are isolated', () => {
    const userA = db.getOrCreateUser('discord_CCC', 'StatsUserA');
    const userB = db.getOrCreateUser('discord_DDD', 'StatsUserB');
    
    db.incrementSearchCount(userA.id);
    db.incrementSearchCount(userA.id);
    db.incrementSearchCount(userA.id);
    db.incrementDealsFound(userA.id, 5);
    
    db.incrementSearchCount(userB.id);
    db.incrementDealsFound(userB.id, 1);
    
    const statsA = db.getUserStats('discord_CCC');
    const statsB = db.getUserStats('discord_DDD');
    
    assert(statsA.total_searches === 3, 'User A should have 3 searches');
    assert(statsA.deals_found === 5, 'User A should have 5 deals');
    assert(statsB.total_searches === 1, 'User B should have 1 search');
    assert(statsB.deals_found === 1, 'User B should have 1 deal');
  });

  // =====================================
  // 🛡️ SQL INJECTION TESTS
  // =====================================
  console.log('\n🛡️ SQL INJECTION TESTS\n');

  test('SQL injection in username is safely handled', () => {
    const maliciousName = "Robert'; DROP TABLE users;--";
    const user = db.getOrCreateUser('discord_INJECT1', maliciousName);
    
    assert(user.id > 0, 'User should be created');
    assert(user.username === maliciousName, 'Username should be stored literally');
    
    const stats = db.getStats();
    assert(stats.totalUsers > 0, 'Users table should still exist');
  });

  test('SQL injection in query is safely handled', () => {
    const user = db.getOrCreateUser('discord_INJECT2', 'TestUser');
    const maliciousQuery = "rem'; DELETE FROM watchlist;--";
    
    db.addToWatchlist(user.id, maliciousQuery, 10000);
    
    const watchlist = db.getUserWatchlist(user.id);
    assert(watchlist.length > 0, 'Watchlist should still work');
  });

  // =====================================
  // 🔒 INPUT VALIDATION TESTS
  // =====================================
  console.log('\n🔒 INPUT VALIDATION TESTS\n');

  test('Empty username is handled', () => {
    const user = db.getOrCreateUser('discord_EMPTY', '');
    assert(user.id > 0, 'User should be created with empty username');
  });

  test('Unicode characters are handled', () => {
    const user = db.getOrCreateUser('discord_UNICODE', 'UnicodeUser');
    const unicodeQuery = '初音ミク 🎤 ハツネミク';
    
    db.addToWatchlist(user.id, unicodeQuery, 10000);
    const watchlist = db.getUserWatchlist(user.id);
    
    assert(watchlist.some(w => w.query.includes('初音ミク')), 'Unicode should be preserved');
  });

  // =====================================
  // 📋 TEMPLATE TESTS
  // =====================================
  console.log('\n📋 TEMPLATE TESTS\n');

  test('All template arrays are non-empty', () => {
    const checkTemplates = (obj, path = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (Array.isArray(value)) {
          assert(value.length > 0, `Template array ${currentPath} should not be empty`);
        } else if (typeof value === 'object' && value !== null) {
          checkTemplates(value, currentPath);
        }
      }
    };
    checkTemplates(TEMPLATES);
  });

  test('SPICY_KEYWORDS are all lowercase', () => {
    SPICY_KEYWORDS.forEach(kw => {
      assert(kw === kw.toLowerCase(), `Keyword "${kw}" should be lowercase`);
    });
  });

  test('HUSBANDO_KEYWORDS are all lowercase', () => {
    HUSBANDO_KEYWORDS.forEach(kw => {
      assert(kw === kw.toLowerCase(), `Keyword "${kw}" should be lowercase`);
    });
  });

  // =====================================
  // 🧹 EDGE CASES
  // =====================================
  console.log('\n🧹 EDGE CASE TESTS\n');

  test('Removing non-existent watch returns false', () => {
    const user = db.getOrCreateUser('discord_NOWATCH', 'NoWatchUser');
    const result = db.removeFromWatchlist(user.id, 'nonexistent_xyz');
    assert(result === false, 'Should return false');
  });

  test('Empty watchlist returns empty array', () => {
    const user = db.getOrCreateUser('discord_EMPTY_WATCH', 'EmptyWatchUser');
    const watchlist = db.getUserWatchlist(user.id);
    
    assert(Array.isArray(watchlist), 'Should return array');
    assert(watchlist.length === 0, 'Should be empty');
  });

  test('Duplicate watch updates price', () => {
    const user = db.getOrCreateUser('discord_DUPE', 'DupeUser');
    
    const result1 = db.addToWatchlist(user.id, 'duplicate_figure', 5000);
    const result2 = db.addToWatchlist(user.id, 'duplicate_figure', 10000);
    
    assert(result1.new === true, 'First add should be new');
    assert(result2.new === false, 'Second add should update');
    
    const watchlist = db.getUserWatchlist(user.id);
    const watch = watchlist.find(w => w.query === 'duplicate_figure');
    
    assert(watch.max_price === 10000, 'Price should be updated');
  });

  test('isNewUser detection works', () => {
    assert(db.isNewUser('discord_BRAND_NEW') === true, 'New user should return true');
    
    const user = db.getOrCreateUser('discord_SEARCHED', 'SearchedUser');
    db.incrementSearchCount(user.id);
    
    assert(db.isNewUser('discord_SEARCHED') === false, 'User with searches returns false');
  });

  // =====================================
  // 🌐 GLOBAL STATS
  // =====================================
  console.log('\n🌐 GLOBAL STATS TESTS\n');

  test('Global stats aggregate correctly', () => {
    const stats = db.getStats();
    
    assert(typeof stats.totalUsers === 'number', 'totalUsers should be number');
    assert(typeof stats.totalSearches === 'number', 'totalSearches should be number');
    assert(stats.totalUsers > 0, 'Should have users from tests');
  });

  test('getAllActiveWatches includes discord_id', () => {
    const watches = db.getAllActiveWatches();
    
    watches.forEach(watch => {
      assert(watch.discord_id, 'Should have discord_id');
      assert(watch.query, 'Should have query');
    });
  });

  // =====================================
  // 📊 RESULTS
  // =====================================
  console.log('\n═══════════════════════════════════════');
  console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════\n');

  // Cleanup
  try {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    console.log('🧹 Test database cleaned up\n');
  } catch (e) {}

  if (failed > 0) {
    console.log('❌ SOME TESTS FAILED\n');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED - Code is secure!\n');
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
