# 🚀 Guide de déploiement Vercel

## Étape 1 : Préparer OpenRouter

1. Aller sur [OpenRouter.ai](https://openrouter.ai)
2. Créer un compte / Se connecter
3. Aller dans **Keys** → **Create Key**
4. Copier la clé (commence par `sk-or-v1-...`)
5. Ajouter des crédits (minimum $5 recommandé)

## Étape 2 : Déployer sur Vercel

### Option A : Via Dashboard Vercel (Recommandé)

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Import Project** → Sélectionner votre repo Git
3. **Configure Project** :
   - Framework Preset: `Other`
   - Build Command: (laisser vide)
   - Output Directory: `public`
4. **Cliquer sur Deploy**

### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## Étape 3 : Configurer Vercel KV

1. **Dans le dashboard Vercel** → Votre projet
2. **Storage** → **Create Database** → **KV**
3. Nom : `avis-generator-kv`
4. **Create**
5. **Connect to Project** → Sélectionner votre projet
6. Les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont ajoutées automatiquement

## Étape 4 : Ajouter la clé OpenRouter

1. **Dans le dashboard Vercel** → Votre projet
2. **Settings** → **Environment Variables**
3. **Add New**
   - Name: `OPENROUTER_API_KEY`
   - Value: `sk-or-v1-...` (votre clé)
   - Environments: **Production**, **Preview**, **Development**
4. **Save**

## Étape 5 : Redéployer

1. **Deployments** → **...** (menu) → **Redeploy**
2. Ou faire un nouveau commit Git

## Étape 6 : Tester

Votre app est maintenant disponible sur :
- `https://votre-projet.vercel.app/` → Générateur
- `https://votre-projet.vercel.app/dashboard` → Dashboard
- `https://votre-projet.vercel.app/poster` → Interface Poster
- `https://votre-projet.vercel.app/admin` → Admin

## 🔧 Vérifications

### Test de l'API OpenRouter

```bash
curl -X POST https://votre-projet.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Génère 1 avis Google 5 étoiles pour un salon de coiffure. Réponds en JSON: [{\"auteur\":\"...\",\"note\":5,\"texte\":\"...\"}]"}'
```

### Test de la base de données

```bash
# Ajouter un avis
curl -X POST https://votre-projet.vercel.app/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"texte":"Test","note":5,"status":"pending"}'

# Récupérer tous les avis
curl https://votre-projet.vercel.app/api/reviews
```

## ⚠️ Troubleshooting

### Erreur "OPENROUTER_API_KEY not found"
→ Vérifier que la variable est bien ajoutée dans Settings → Environment Variables

### Erreur "KV_REST_API_URL not found"
→ Vérifier que Vercel KV est bien connecté au projet

### Erreur 500 sur /api/generate
→ Vérifier les crédits OpenRouter
→ Vérifier les logs dans Vercel Dashboard → Functions

### Les avis ne se sauvegardent pas
→ Vérifier que Vercel KV est actif
→ Vérifier les logs de l'API /api/reviews

## 💰 Coûts estimés

- **Vercel** : Gratuit (Hobby plan)
- **Vercel KV** : Gratuit jusqu'à 256 MB
- **OpenRouter (Claude 3.5 Sonnet)** :
  - Input: $3 / 1M tokens
  - Output: $15 / 1M tokens
  - ~$0.05 par batch de 3 avis

## 🔒 Sécurité

Pour ajouter une authentification :
1. Utiliser Vercel Edge Middleware
2. Ou ajouter un mot de passe simple dans les variables d'environnement
3. Ou utiliser Vercel Authentication

## 📊 Monitoring

- **Logs** : Vercel Dashboard → Functions → Logs
- **Analytics** : Vercel Dashboard → Analytics
- **KV Usage** : Vercel Dashboard → Storage → KV
