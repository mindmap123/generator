# 🎯 Avis Generator - Google Reviews Management Tool

Outil complet de génération et gestion d'avis Google avec IA (Claude 3.5 Sonnet via OpenRouter).

## 🔐 Authentification

Le système est maintenant sécurisé avec deux rôles :

### 👑 Admin (accès complet)
- Username: `admin` / Password: `admin123`
- Génération d'avis, dashboard complet, gestion totale

### 🎯 Poster (accès limité)
- Username: `poster` / Password: `poster123`
- Interface de posting et vérification uniquement

⚠️ **Changez ces mots de passe avant le déploiement !**

📖 **Documentation complète** : Voir `AUTH.md` et `QUICKSTART_AUTH.md`

## 🚀 Démarrage rapide

```bash
npm run dev
# Ouvrir http://localhost:3457/login
```

## 🚀 Déploiement sur Vercel

### 1. Prérequis

- Compte [Vercel](https://vercel.com)
- Compte [OpenRouter](https://openrouter.ai) avec clé API
- Vercel KV (base de données Redis)

### 2. Configuration Vercel

1. **Créer un nouveau projet Vercel**
   ```bash
   vercel
   ```

2. **Ajouter Vercel KV**
   - Dans le dashboard Vercel → Storage → Create Database → KV
   - Connecter la base à votre projet

3. **Configurer les variables d'environnement**
   - Dans Vercel Dashboard → Settings → Environment Variables
   - Ajouter : 
     - `OPENROUTER_API_KEY` = votre clé OpenRouter
     - `ADMIN_PASSWORD` = mot de passe admin sécurisé
     - `POSTER_PASSWORD` = mot de passe poster sécurisé

### 3. Déployer

```bash
vercel --prod
```

## 📋 Structure

```
/
├── api/                    # API Routes (Vercel Serverless)
│   ├── auth/              # Authentification
│   │   ├── login.js       # Connexion
│   │   ├── logout.js      # Déconnexion
│   │   └── me.js          # Info utilisateur
│   ├── generate.js        # Génération d'avis via OpenRouter (Admin)
│   ├── reviews.js         # CRUD avis
│   └── reviews/
│       ├── [id].js        # Update/Delete avis
│       └── last-import.js # Undo import (Admin)
├── public/                # Pages HTML statiques
│   ├── login.html             # Page de connexion
│   ├── auth-client.js         # Gestion auth client
│   ├── review-generator.html  # Générateur d'avis
│   ├── dashboard.html         # Dashboard admin complet (Admin)
│   ├── poster.html            # Interface poster (Admin + Poster)
│   └── admin.html             # Hub admin (Admin)
├── auth.js                # Système d'authentification
└── vercel.json            # Configuration Vercel
```

## 🎨 Interfaces

### 0. **Login** (`/login`) - Public
- Connexion avec username/password
- Redirection automatique selon le rôle

### 1. **Générateur** (`/`) - Public
- Génération d'avis avec Claude 3.5 Sonnet
- Configuration : salon, ville, prestations, équipe, note, longueur
- Modes : Manuel (1-10 avis) ou Automatique (jusqu'à 100 avis)

### 2. **Dashboard** (`/dashboard`) - Admin uniquement
- Vue complète avec tous les statuts
- Timeline des horodatages (created, posted, checked, gone)
- Import d'anciens avis depuis Google Sheets
- Statistiques détaillées

### 3. **Poster** (`/poster`) - Admin + Poster
- Interface simplifiée pour l'équipe
- 3 onglets : To Post / Check Online / Gone
- Marquer comme posté avec nom du compte Google
- Vérifier si les avis sont toujours en ligne

### 4. **Admin** (`/admin`) - Admin uniquement
- Hub central avec accès à tous les outils
- Statistiques rapides
- Liens vers toutes les interfaces

## 🔑 Variables d'environnement

```env
# OpenRouter API Key (obligatoire)
OPENROUTER_API_KEY=sk-or-v1-...

# Authentification (recommandé en production)
ADMIN_PASSWORD=votre_mot_de_passe_securise
POSTER_PASSWORD=votre_mot_de_passe_securise

# Vercel KV (automatique via Vercel)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

## 📊 Workflow

1. **Connexion** : Se connecter sur `/login` avec son rôle
2. **Admin** : Génère des avis → Clique "+ Dashboard"
3. **Poster** : Voit les avis "To Post" → Poste sur Google → Marque comme "Posted" avec nom du compte
4. **Vérification** : Vérifie régulièrement si les avis sont toujours en ligne
5. **Tracking** : Historique complet avec horodatages

## 🔒 Sécurité

- Authentification par token (24h)
- Contrôle d'accès par rôle (Admin/Poster)
- Sessions sécurisées (localStorage + HttpOnly cookies)
- Protection des endpoints API
- Redirection automatique si non autorisé

⚠️ **Production** : Migrez les sessions vers Vercel KV (voir `AUTH.md`)

## 🛠️ Développement local

```bash
# Installer les dépendances
npm install

# Créer .env avec vos clés
cp .env.example .env

# Lancer le serveur
npm run dev
```

## 📝 Notes

- Base de données : Vercel KV (Redis)
- IA : Claude 3.5 Sonnet via OpenRouter
- Hébergement : Vercel (Serverless Functions)
- Pas de backend Node.js persistant nécessaire
