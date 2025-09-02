# 📤 Sådan pusher du webapp mappen til GitHub

## Metode 1: GitHub Web Upload (Nemmest)

### Trin 1: Opret nyt repository
1. **Gå til:** [github.com](https://github.com)
2. **Klik "New"** (grøn knap øverst til højre)
3. **Repository name:** `stock-webapp-only`
4. **Klik "Create repository"**

### Trin 2: Upload webapp filer
1. **I det nye tomme repo**, klik **"uploading an existing file"**
2. **Åbn Windows Explorer** i ny fane
3. **Gå til:** `C:\Users\krist\OneDrive\Skrivebord\stock opdelt\stock_analysis_tool\webapp`
4. **Vælg ALT** (Ctrl+A) - ALLE filer og mapper i webapp
5. **Træk** alle filer til GitHub browseren
6. **Vent** til upload er færdig (1-2 min)
7. **Commit message:** `Initial webapp upload`
8. **Klik "Commit changes"**

---

## Metode 2: Git Commands (Hvis du vil lære)

### Trin 1: Åbn Command Prompt
1. **Windows key + R**
2. **Skriv:** `cmd`
3. **Tryk Enter**

### Trin 2: Naviger til webapp
```bash
cd "C:\Users\krist\OneDrive\Skrivebord\stock opdelt\stock_analysis_tool\webapp"
```

### Trin 3: Initialiser git i webapp mappen
```bash
git init
git add .
git commit -m "Initial webapp commit"
```

### Trin 4: Connect til dit nye GitHub repo
```bash
git remote add origin https://github.com/DIT-BRUGERNAVN/stock-webapp-only.git
git branch -M main
git push -u origin main
```

**Erstat "DIT-BRUGERNAVN" med dit rigtige GitHub brugernavn!**

---

## Hvad skal være i dit GitHub repo

Efter upload skulle du se:
```
📁 prisma/
📁 src/
   📁 app/
   📁 components/
   📁 lib/
📁 public/
📄 package.json
📄 next.config.ts
📄 tailwind.config.js
📄 tsconfig.json
📄 vercel.json
📄 .env.example
📄 start.bat
```

## Næste skridt

**Efter GitHub upload:**
1. **Gå til Vercel**
2. **Import det nye repo** `stock-webapp-only`
3. **Deploy**

**Nu burde Vercel finde `src/app` mappen og bygge korrekt!** 🚀

---

## Troubleshooting

**Hvis git commands ikke virker:**
- Brug Metode 1 (web upload) - det er nemmere!

**Hvis upload er langsom:**
- Det er normalt - 50+ filer tager tid

**Hvis du får fejl:**
- Screenshot fejlen og send til mig