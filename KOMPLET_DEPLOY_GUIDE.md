# 📚 KOMPLET DEPLOY GUIDE - Med Screenshots og Detaljer

## Del 1: Forbered din kode til upload

### Trin 1.1: Saml alle webapp filer
1. **Åbn Windows Explorer**
2. **Naviger til:** `C:\Users\krist\OneDrive\Skrivebord\stock opdelt\stock_analysis_tool\webapp`
3. **Vælg ALT** (Ctrl+A) - du skal se disse mapper/filer:
   ```
   📁 prisma/
   📁 src/
   📁 public/
   📄 package.json
   📄 next.config.js
   📄 tailwind.config.js
   📄 .env.example
   📄 start.bat
   📄 QUICK_START.md
   📄 DEPLOY.md
   ... og flere
   ```

### Trin 1.2: Kopier filerne
1. **Højreklik** på alle valgte filer
2. **Vælg "Copy"** (eller tryk Ctrl+C)

---

## Del 2: Opret GitHub repository

### Trin 2.1: Gå til GitHub
1. **Åbn din browser**
2. **Gå til:** [github.com](https://github.com)
3. **Log ind** (eller opret konto hvis du ikke har en)

### Trin 2.2: Opret nyt repository
1. **Klik den grønne "New" knap** (øverst til højre)
2. **Repository name:** `stock-analysis-webapp`
3. **Description:** `Professional stock analysis web application with Yahoo Finance integration`
4. **Vælg Public eller Private** (dit valg)
5. **IKKE tilføj README, .gitignore eller license** (vi har allerede filer)
6. **Klik "Create repository"**

### Trin 2.3: Upload filerne
Du ser nu en tom repository side. Der er flere måder:

**Metode A: Upload via web (nemmest)**
1. **Klik "uploading an existing file"** (blå link)
2. **Træk alle dine kopierede filer** ind i browseren
   - ELLER klik "choose your files" og vælg alt fra webapp mappen
3. **Vent** til alle filer er uploaded (kan tage 1-2 minutter)
4. **Commit message:** `Initial webapp deployment ready`
5. **Klik "Commit changes"**

**Metode B: Git kommandoer (hvis du kender git)**
```bash
cd "C:\Users\krist\OneDrive\Skrivebord\stock opdelt\stock_analysis_tool\webapp"
git init
git add .
git commit -m "Initial webapp deployment ready"
git remote add origin https://github.com/DIT-BRUGERNAVN/stock-analysis-webapp.git
git push -u origin main
```

---

## Del 3: Deploy til Vercel

### Trin 3.1: Gå til Vercel
1. **Åbn ny fane:** [vercel.com](https://vercel.com)
2. **Klik "Start Deploying"** eller "Sign Up"
3. **Vælg "Continue with GitHub"**
4. **Autorisér Vercel** til at tilgå dine GitHub repos

### Trin 3.2: Import projekt
1. **Du ser nu "Import Git Repository" siden**
2. **Find dit "stock-analysis-webapp" repo** i listen
3. **Klik "Import"** ved siden af det

### Trin 3.3: Configure projekt
Du ser nu projekt setup siden:
1. **Project Name:** `stock-analysis-webapp` (eller vælg selv)
2. **Framework Preset:** `Next.js` (auto-detekteret)
3. **Root Directory:** `./` (standard)
4. **Build Command:** `npm run build` (standard)
5. **Output Directory:** `.next` (standard)
6. **Install Command:** `npm install` (standard)

**VIGTIG:** Udvid "Environment Variables" sektionen:
1. **Klik "Add" for hver af disse:**

```
Name: NEXTAUTH_URL
Value: https://stock-analysis-webapp.vercel.app (eller dit projekt navn)

Name: NEXTAUTH_SECRET  
Value: super-secret-key-123456789-change-this-later
```

### Trin 3.4: Deploy!
1. **Klik den store "Deploy" knap**
2. **Vent 2-5 minutter** mens Vercel bygger din app
3. **Se byggeprocessen** - du burde se "Building..." → "Success!"

---

## Del 4: Tilføj database

### Trin 4.1: Opret Vercel Postgres
1. **I dit Vercel projekt dashboard**
2. **Klik "Storage" fanen** (øverst)
3. **Klik "Create Database"**
4. **Vælg "Postgres"** → **Klik "Continue"**
5. **Database Name:** `stock-analysis-db`
6. **Region:** `Frankfurt (fra1)` (nærmest Danmark)
7. **Klik "Create"**

### Trin 4.2: Database setup
Vercel tilføjer automatisk `DATABASE_URL` til dine environment variables.

**Men vi skal køre database migration:**
1. **Gå til Settings → Functions**
2. **Find "Post-deployment Command"**
3. **Tilføj:** `npx prisma migrate deploy`
4. **Save**

---

## Del 5: Redeploy med database

### Trin 5.1: Trigger ny deployment
1. **Gå til "Deployments" fanen**
2. **Klik "..." på seneste deployment**
3. **Vælg "Redeploy"**
4. **Vent 2-3 minutter**

### Trin 5.2: Test din app
1. **Klik "View Deployment"** når det er færdigt
2. **Din app åbner** på `https://dit-projekt.vercel.app`
3. **Test stock søgning:** Prøv "AAPL" eller "MSFT"

---

## Del 6: Troubleshooting

### Hvis deployment fejler:
1. **Gå til "Deployments"** → **Klik på fejlende deployment**
2. **Læs "Build Logs"** for fejlbeskeder
3. **Common issues:**
   - TypeScript errors → Fix i koden og push til GitHub
   - Missing dependencies → Check package.json
   - Environment variables → Check de er tilføjet korrekt

### Hvis appen ikke loader:
1. **Check "Functions" logs** i Vercel dashboard
2. **Verify database connection** i logs
3. **Check environment variables** er sat korrekt

### Hvis stock data ikke vises:
- Yahoo Finance APIs er gratis og skulle virke med det samme
- Check browser developer tools (F12) for JavaScript errors

---

## Del 7: Næste skridt (valgfrit)

### Custom domain
1. **Køb et domæne** (fx hos One.com, GoDaddy)
2. **I Vercel:** Settings → Domains → Add din-domain.dk
3. **Opdater DNS** hos din domain provider med Vercel's værdier

### Google Login (valgfrit)
1. **Gå til [Google Cloud Console](https://console.cloud.google.com)**
2. **Opret nyt projekt** → **Enable Google+ API**
3. **Credentials** → **OAuth 2.0 Client**
4. **Authorized redirect URI:** `https://dit-domæne.vercel.app/api/auth/callback/google`
5. **Tilføj Client ID og Secret** til Vercel environment variables

### Email Magic Links (valgfrit)
Brug en email service som:
- **SendGrid** (gratis tier: 100 emails/dag)
- **Mailgun** (gratis tier: 5000 emails/måned)
- **Amazon SES** (billig)

---

## 📞 Hjælp

**Hvis noget går galt:**
1. **Screenshot fejlen** og send til mig
2. **Kopier fejlbesked** fra Vercel logs
3. **Fortæl hvilket trin** du er nået til

**Vercel Support:**
- Dokumentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [discord.gg/vercel](https://discord.gg/vercel)

**Din app vil være live og tilgængelig for hele verden når du er færdig! 🌍**