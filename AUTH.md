# 🔐 Système d'Authentification

## Vue d'ensemble

Le système d'authentification sépare l'accès entre deux rôles :
- **Admin** : Accès complet (génération, dashboard, gestion)
- **Poster** : Accès limité (poster et vérifier les avis uniquement)

## Comptes par défaut

### Admin
- **Username** : `admin`
- **Password** : `admin123`
- **Accès** : Toutes les pages et fonctionnalités

### Poster
- **Username** : `poster`
- **Password** : `poster123`
- **Accès** : Interface Poster uniquement

⚠️ **IMPORTANT** : Changez ces mots de passe avant le déploiement en production !

## Pages et permissions

### Pages publiques
- `/login` - Page de connexion
- `/` - Générateur d'avis (public pour l'instant)

### Pages Admin uniquement
- `/admin` - Dashboard admin
- `/dashboard` - Dashboard complet avec statistiques

### Pages Admin + Poster
- `/poster` - Interface de posting et vérification

## Endpoints API et permissions

### Authentification (public)
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Informations utilisateur

### Reviews
- `GET /api/reviews` - **Admin + Poster** (lecture)
- `POST /api/reviews` - **Admin uniquement** (création)
- `PUT /api/reviews/:id` - **Admin + Poster** (mise à jour statut)
- `DELETE /api/reviews/:id` - **Admin uniquement** (suppression)
- `DELETE /api/reviews/last-import` - **Admin uniquement**

### Génération
- `POST /generate` - **Admin uniquement** (génération via Claude)

## Fonctionnement technique

### Côté serveur (`auth.js`)
- Gestion des sessions en mémoire
- Tokens générés avec `crypto.randomBytes`
- Expiration après 24h
- Middleware `requireAuth()` et `requireRole()`

### Côté client (`auth-client.js`)
- Token stocké dans `localStorage`
- Ajout automatique du token dans les headers
- Redirection automatique vers `/login` si non autorisé
- Vérification des permissions au chargement de la page

## Changer les mots de passe

### En développement
Éditez le fichier `auth.js` :

```javascript
const USERS = {
  admin: {
    password: 'votre_nouveau_mot_de_passe',
    role: 'admin'
  },
  poster: {
    password: 'votre_nouveau_mot_de_passe',
    role: 'poster'
  }
};
```

### En production (recommandé)
Utilisez des variables d'environnement :

1. Créez un fichier `.env` :
```bash
ADMIN_PASSWORD=votre_mot_de_passe_securise
POSTER_PASSWORD=votre_mot_de_passe_securise
```

2. Modifiez `auth.js` pour lire depuis `process.env` :
```javascript
const USERS = {
  admin: {
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin'
  },
  poster: {
    password: process.env.POSTER_PASSWORD || 'poster123',
    role: 'poster'
  }
};
```

3. Sur Vercel, ajoutez les variables dans Settings → Environment Variables

## Améliorations futures

### Pour la production
1. **Utiliser une vraie base de données** pour les sessions (Redis, Vercel KV)
2. **Hasher les mots de passe** avec bcrypt
3. **Ajouter un rate limiting** sur `/api/auth/login`
4. **Implémenter un refresh token** pour les sessions longues
5. **Ajouter 2FA** pour les comptes admin
6. **Logger les tentatives de connexion** échouées

### Exemple avec bcrypt
```javascript
const bcrypt = require('bcrypt');

// Hasher un mot de passe
const hashedPassword = await bcrypt.hash('admin123', 10);

// Vérifier un mot de passe
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

## Déploiement sur Vercel

Les sessions en mémoire ne fonctionneront pas sur Vercel (serverless).
Vous devrez utiliser Vercel KV pour stocker les sessions :

```javascript
const { kv } = require('@vercel/kv');

// Stocker une session
await kv.set(`session:${token}`, session, { ex: 86400 }); // 24h

// Récupérer une session
const session = await kv.get(`session:${token}`);

// Supprimer une session
await kv.del(`session:${token}`);
```

## Tester l'authentification

1. Démarrez le serveur : `npm run dev`
2. Allez sur http://localhost:3457/login
3. Connectez-vous avec `admin` / `admin123`
4. Vous serez redirigé vers `/admin`
5. Testez avec `poster` / `poster123` → redirigé vers `/poster`
6. Essayez d'accéder à `/admin` avec le compte poster → accès refusé

## Support

Pour toute question sur l'authentification, consultez :
- `auth.js` - Logique serveur
- `public/auth-client.js` - Logique client
- `server.js` - Routes protégées
