# 🔧 Fix Vercel Error - Slet vercel.json

## Problemet
Vercel kan ikke finde API filerne fordi `vercel.json` peger forkert.

## Løsning: Slet vercel.json helt

### I dit GitHub repo:
1. **Find `vercel.json` filen** i din fil liste
2. **Klik på filen**
3. **Klik "Delete file" knappen** (skraldespand ikon)
4. **Commit message:** `Remove vercel.json - use defaults`
5. **Klik "Commit changes"**

### Derefter i Vercel:
1. **Gå tilbage til Vercel**
2. **Klik "Redeploy"** (eller import projektet igen)

## Hvorfor dette virker
Next.js har smart auto-detection. Vercel finder automatisk:
- `src/app/` mappen
- API routes i `src/app/api/`
- Build settings

**Ingen vercel.json fil påkrævet!** 🚀

## Alternativ: Fix vercel.json
Hvis du vil beholde filen, ændre den til:
```json
{
  "functions": {
    "src/app/api/*/route.ts": {
      "maxDuration": 30
    }
  }
}
```

**Men sletning er nemmere!** ✅