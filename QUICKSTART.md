# ⚡ Quick Start

## 🚀 Déploiement en 5 minutes

### 1. OpenRouter (2 min)
```
1. Aller sur https://openrouter.ai
2. Sign up / Login
3. Keys → Create Key
4. Copier la clé (sk-or-v1-...)
5. Credits → Add $5
```

### 2. Vercel (3 min)
```
1. Push ton code sur GitHub
2. Aller sur https://vercel.com
3. Import Project → Sélectionner ton repo
4. Deploy (attendre 1 min)
5. Storage → Create Database → KV → Create
6. Connect to Project
7. Settings → Environment Variables → Add:
   - OPENROUTER_API_KEY = ta clé
8. Deployments → Redeploy
```

### 3. C'est prêt ! ✅
```
https://ton-projet.vercel.app/          → Générateur
https://ton-projet.vercel.app/dashboard → Dashboard
https://ton-projet.vercel.app/poster    → Poster
https://ton-projet.vercel.app/admin     → Admin
```

## 🧪 Test rapide

### Générer un avis
1. Aller sur `/`
2. Remplir : Salon = "Test", Ville = "Paris"
3. Cliquer "Générer"
4. Cliquer "+ Dashboard"

### Marquer comme posté
1. Aller sur `/poster`
2. Onglet "To Post"
3. Cliquer "Mark as Posted"
4. Entrer "Test User"
5. Confirmer

### Vérifier
1. Onglet "Check Online"
2. Voir l'avis avec "Test User"
3. Cliquer "Still There" ou "Gone"

## 📋 Commandes utiles

```bash
# Installer
npm install

# Dev local
npm run dev

# Déployer
vercel --prod

# Logs
vercel logs

# Variables d'env
vercel env ls
vercel env add OPENROUTER_API_KEY
```

## 🔧 Variables d'environnement

```env
OPENROUTER_API_KEY=sk-or-v1-...  # Obligatoire
KV_REST_API_URL=...              # Auto (Vercel KV)
KV_REST_API_TOKEN=...            # Auto (Vercel KV)
```

## 💡 Tips

- **Coût** : ~$0.05 par batch de 3 avis
- **Limite** : Vercel KV gratuit jusqu'à 256 MB
- **Logs** : Vercel Dashboard → Functions → Logs
- **DB** : Vercel Dashboard → Storage → KV → Data Browser

## ⚠️ Troubleshooting

**Erreur 500 sur /api/generate**
→ Vérifier OPENROUTER_API_KEY dans Vercel

**Avis ne se sauvegardent pas**
→ Vérifier que Vercel KV est connecté

**"No credits"**
→ Ajouter des crédits sur OpenRouter

## 📞 Support

- OpenRouter : https://openrouter.ai/docs
- Vercel : https://vercel.com/docs
- Vercel KV : https://vercel.com/docs/storage/vercel-kv
