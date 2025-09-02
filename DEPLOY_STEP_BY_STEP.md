# 🚀 Sådan deployer du til Vercel (trin-for-trin)

## 1. Gå til GitHub

**Hvis du ikke har GitHub konto:**
1. Gå til [github.com](https://github.com)
2. Opret gratis konto

**Opret nyt repository:**
1. Klik "New repository" 
2. Navn: `stock-analysis-webapp`
3. Offentlig eller privat (valgfrit)
4. Klik "Create repository"

## 2. Upload din kode

**I Windows Explorer:**
1. Gå til mappen: `C:\Users\krist\OneDrive\Skrivebord\stock opdelt\stock_analysis_tool\webapp`
2. Kopier ALT indhold i mappen

**I GitHub:**
1. Klik "uploading an existing file"
2. Træk alle filer ind (eller klik "choose your files")
3. Skriv commit besked: "Initial webapp upload"
4. Klik "Commit changes"

## 3. Gå til Vercel

1. Gå til [vercel.com](https://vercel.com)
2. Klik "Continue with GitHub"
3. Log ind med din GitHub konto

## 4. Deploy appen

1. Klik "Add New..." → "Project"
2. Find dit `stock-analysis-webapp` repository
3. Klik "Import"
4. **Framework**: Next.js (auto-detect)
5. Klik "Deploy"

## 5. Vent 2-3 minutter...

Vercel bygger din app automatisk!

## 6. Tilføj database

**I Vercel dashboard:**
1. Gå til dit projekt
2. Klik "Storage" → "Create Database"
3. Vælg "Postgres" → "Continue"
4. Accepter default indstillinger

## 7. Tilføj environment variables

**I Vercel dashboard:**
1. Gå til "Settings" → "Environment Variables"
2. Tilføj disse:

```
NEXTAUTH_URL = https://dit-projekt-navn.vercel.app
NEXTAUTH_SECRET = din-hemmelige-nøgle-her-123456
```

(DATABASE_URL tilføjes automatisk af Vercel Postgres)

## 8. Redeploy

1. Gå til "Deployments"
2. Klik "..." på seneste deployment
3. Klik "Redeploy"

## 9. Færdig! 🎉

Din app kører nu på: `https://dit-projekt-navn.vercel.app`

**Hvad virker:**
- Stock søgning og analyse
- Yahoo Finance data (gratis, unlimited)
- Real-time kurser og charts
- Responsive design

**Senere kan du tilføje:**
- Google login
- Email magic links
- Custom domain