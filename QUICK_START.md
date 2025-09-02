# 🚀 Quick Start Guide

## Super Simple Setup (Windows)

**Just double-click `start.bat` and you're done!**

The script will:
1. Install all dependencies automatically
2. Set up a local SQLite database (no setup needed)
3. Start the web app at http://localhost:3000

## What You Get

✅ **Full stock analysis web app** with no API keys required  
✅ **Yahoo Finance data** - unlimited free access to all US stocks  
✅ **Real-time quotes, charts, fundamentals, and news**  
✅ **Works immediately** - no configuration needed  

## How to Use

1. **Start the app**: Double-click `start.bat`
2. **Open browser**: Go to http://localhost:3000
3. **Search stocks**: Type any ticker (AAPL, MSFT, etc.)
4. **Explore**: View charts, fundamentals, news, and analysis

## No Setup Required

- ❌ No PostgreSQL installation
- ❌ No Redis installation  
- ❌ No API key registration
- ❌ No complex configuration

The app uses:
- **SQLite database** (auto-created)
- **Yahoo Finance APIs** (free, unlimited)
- **Local file caching** (no Redis needed)

## If You Want More Features Later

You can optionally add:
- PostgreSQL database (for production)
- Redis caching (for better performance)
- Google OAuth (for social login)
- Email provider (for magic links)

But the app works great without any of these!

## Troubleshooting

**If start.bat doesn't work:**
1. Open Command Prompt in the webapp folder
2. Run: `npm install`
3. Run: `npm run db:generate`
4. Run: `npm run dev`
5. Open http://localhost:3000

**Need help?** Just ask!