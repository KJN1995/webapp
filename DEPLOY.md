# 🚀 Deploy til Vercel

## 1. Forbered deployment

```bash
# Push til GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## 2. Opret Vercel projekt

1. Gå til [vercel.com](https://vercel.com)
2. Connect GitHub og importér dit repo
3. Vælg **Next.js** framework (auto-detect)
4. Deploy!

## 3. Opret database (Vercel Postgres)

```bash
# I Vercel dashboard:
Storage → Create → Postgres
```

Kopier `DATABASE_URL` til environment variables.

## 4. Environment Variables

I Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgres://...  (fra Vercel Postgres)
NEXTAUTH_URL=https://dit-domæne.vercel.app
NEXTAUTH_SECRET=din-secure-secret-her
```

Valgfrit (til login features):
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_SERVER=...
EMAIL_FROM=...
```

## 5. Migrate database

```bash
# I Vercel → Settings → Functions → Post-deployment:
npx prisma migrate deploy
```

## 6. Færdig! 🎉

Din app kører nu på `https://webapp-git-main-[username].vercel.app`

**Gratis features:**
- Yahoo Finance APIs (unlimited)
- Vercel Postgres (hobby tier)
- Auto HTTPS + CDN
- Serverless functions

**Upgrade senere:**
- Custom domain
- Vercel Pro (mere storage/bandwidth)
- Redis cache (Upstash)