# 🎎 Waifu Deal Sniper

> *"Protect the waifu. Save the laifu. Snipe the deal."*

A Discord bot that hunts anime figure deals on AmiAmi. Users just DM the bot — no setup for them!

---

## 🚀 DEPLOY IN 10 MINUTES

### Step 1: Create Discord Bot (3 min)

1. Go to **[Discord Developer Portal](https://discord.com/developers/applications)**
2. Click **"New Application"**
3. Name it `Waifu Deal Sniper` → Click **Create**
4. Go to **"Bot"** in sidebar
5. Click **"Reset Token"** → **Copy the token** (save it somewhere safe!)
6. Scroll down and enable:
   - ✅ **MESSAGE CONTENT INTENT** (required!)
7. Go to **"OAuth2" → "URL Generator"**
8. Select scopes: `bot`
9. Select permissions: `Send Messages`, `Embed Links`, `Read Message History`
10. **Copy the URL** at the bottom → This is your invite link!

---

### Step 2: Get Mino API Key (2 min)

1. Go to **[Tinyfish.ai](https://tinyfish.ai)** (Mino)
2. Sign up / Log in
3. Go to API Keys
4. **Copy your API key**

---

### Step 3: Deploy to Railway (5 min)

#### Option A: Deploy from GitHub (Recommended)

1. **Push this code to a GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/waifu-deal-sniper.git
   git push -u origin main
   ```

2. Go to **[Railway.app](https://railway.app)**
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repo
5. Railway will auto-detect and start building

#### Option B: Deploy with Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

---

### Step 4: Add Environment Variables

In **Railway Dashboard** → Your Project → **Variables** tab:

| Variable | Value |
|----------|-------|
| `DISCORD_TOKEN` | Your Discord bot token from Step 1 |
| `MINO_API_KEY` | Your Mino API key from Step 2 |

Click **"Add"** after each one.

---

### Step 5: Verify It's Running

1. Check **Railway Logs** — you should see:
   ```
   🎎 ═══════════════════════════════════════
   🎎  WAIFU DEAL SNIPER is ONLINE!
   🎎  Logged in as WaifuDealSniper#1234
   🎎 ═══════════════════════════════════════
   ```

2. **Open Discord** and DM your bot: `hey`

3. The bot should respond with a welcome message!

---

## 💬 How It Works

### Users Just Chat!

```
User: hey
Bot:  Hey! 👋 I'm Waifu Deal Sniper!
      🎎 I search AmiAmi's pre-owned section
      💰 I find "mint figure, damaged box" deals
      🔔 I can alert you when your grails appear
      
      What are we hunting today? 🎯

User: looking for rem bunny figures

Bot:  💙 Rem! The maid that launched a thousand collections~
      🐰 Bunny suit? Excellent choice, fellow intellectual 😏
      🔍 Hunting for rem bunny... Give me a sec!
      
      [Shows actual AmiAmi results with prices & links]

User: watch marin under 15000

Bot:  ✅ Got it! I'll DM you when marin appears under ¥15,000!
```

### Spicy Mode 😏

The bot reacts differently to... *cultured* searches:

```
User: any sonico bikini figures?

Bot:  🎧 Super Sonico! The OG thicc queen since 2006~
      👀 sonico bikini?? Naughty naughty~ Let me look...
```

---

## 📋 Commands

| Say This | What Happens |
|----------|--------------|
| `hey` / `hi` | Greets you |
| `looking for rem` | Searches AmiAmi |
| `any miku under 10000?` | Searches with price filter |
| `watch power under 5000` | Alerts you via DM when deals appear |
| `watchlist` | Shows your active hunts |
| `stop watching rem` | Removes from watchlist |
| `stats` | Your hunting statistics |
| `help` | Shows all commands |
---

## 🔒 Security Features

✅ **User Data Isolation** — Users can't see each other's data  
✅ **SQL Injection Protection** — Parameterized queries  
✅ **Rate Limiting** — 10 searches/min per user  
✅ **Input Sanitization** — No Discord markdown injection  
✅ **Watch Limits** — Max 20 watches per user  

Run `npm test` to verify all 29 security tests pass!

---

## 📁 Project Structure

```
waifu-deal-sniper/
├── bot.js           # Main bot code
├── database.js      # SQLite user management
├── templates.js     # 200+ personality responses
├── test.js          # Security test suite
├── package.json     # Dependencies
├── railway.json     # Railway config
└── data/            # SQLite database (auto-created)
```

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your tokens

# Run tests
npm test

# Start bot
npm start
```

---

## 🎯 Share Your Bot

Once deployed, share your invite link from Step 1!

Users can:
1. Click your invite link
2. DM the bot directly
3. Start hunting figures!

---

## ❤️ Built With

- [Discord.js](https://discord.js.org/)
- [Mino AI](https://tinyfish.ai)
- [Railway](https://railway.app)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)

---

*Happy hunting!* 🎎
