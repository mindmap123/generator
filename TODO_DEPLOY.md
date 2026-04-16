# ✅ Checklist de déploiement

## Avant de déployer

- [ ] Lire `QUICKSTART.md` (5 min)
- [ ] Avoir un compte GitHub
- [ ] Avoir un compte Vercel
- [ ] Avoir un compte OpenRouter

## Étape 1 : OpenRouter

- [ ] Aller sur https://openrouter.ai
- [ ] Créer un compte / Se connecter
- [ ] Aller dans **Keys** → **Create Key**
- [ ] Copier la clé (commence par `sk-or-v1-...`)
- [ ] **Credits** → Ajouter $5 minimum
- [ ] Garder la clé dans un endroit sûr

## Étape 2 : GitHub

- [ ] Créer un nouveau repo sur GitHub
- [ ] Push le code :
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/TON-USERNAME/TON-REPO.git
  git push -u origin main
  ```

## Étape 3 : Vercel

- [ ] Aller sur https://vercel.com
- [ ] **Import Project**
- [ ] Sélectionner ton repo GitHub
- [ ] **Deploy** (attendre 1-2 min)
- [ ] Noter l'URL : `https://ton-projet.vercel.app`

## Étape 4 : Vercel KV

- [ ] Dans le dashboard Vercel → Ton projet
- [ ] **Storage** → **Create Database**
- [ ] Sélectionner **KV**
- [ ] Nom : `avis-generator-kv`
- [ ] **Create**
- [ ] **Connect to Project** → Sélectionner ton projet
- [ ] Vérifier que les variables `KV_REST_API_URL` et `KV_REST_API_TOKEN` sont ajoutées

## Étape 5 : Variables d'environnement

- [ ] Dans le dashboard Vercel → Ton projet
- [ ] **Settings** → **Environment Variables**
- [ ] **Add New** :
  - Name: `OPENROUTER_API_KEY`
  - Value: `sk-or-v1-...` (ta clé OpenRouter)
  - Environments: Cocher **Production**, **Preview**, **Development**
- [ ] **Save**

## Étape 6 : Redéployer

- [ ] **Deployments** → **...** (menu) → **Redeploy**
- [ ] Attendre 1 min

## Étape 7 : Tester

- [ ] Ouvrir `https://ton-projet.vercel.app/`
- [ ] Tester la génération d'un avis
- [ ] Cliquer "+ Dashboard"
- [ ] Aller sur `/poster`
- [ ] Marquer comme posté
- [ ] Vérifier que tout fonctionne

## ✅ C'est prêt !

Ton app est maintenant en ligne et fonctionnelle !

## 📝 URLs à partager

- **Générateur** (Admin) : `https://ton-projet.vercel.app/`
- **Dashboard** (Admin) : `https://ton-projet.vercel.app/dashboard`
- **Poster** (Équipe) : `https://ton-projet.vercel.app/poster`
- **Admin Hub** : `https://ton-projet.vercel.app/admin`

## 🔒 Sécurité (optionnel)

Pour ajouter un mot de passe simple :
- [ ] Ajouter une variable `ADMIN_PASSWORD` dans Vercel
- [ ] Modifier les API routes pour vérifier le mot de passe
- [ ] Ou utiliser Vercel Authentication

## 📊 Monitoring

- **Logs** : Vercel Dashboard → Functions → Logs
- **Analytics** : Vercel Dashboard → Analytics
- **KV Data** : Vercel Dashboard → Storage → KV → Data Browser
- **Coûts OpenRouter** : https://openrouter.ai/activity

## 🎉 Félicitations !

Ton outil de gestion d'avis Google est maintenant déployé et prêt à l'emploi !
