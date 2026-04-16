# ✅ Configuration de l'Authentification - Terminée

## 🎯 Ce qui a été fait

Votre application est maintenant sécurisée avec un système d'authentification qui sépare les accès entre **Admin** et **Poster**.

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
- ✅ `auth.js` - Système d'authentification serveur
- ✅ `public/login.html` - Page de connexion
- ✅ `public/auth-client.js` - Gestion auth côté client
- ✅ `api/auth/login.js` - Endpoint de connexion
- ✅ `api/auth/logout.js` - Endpoint de déconnexion
- ✅ `api/auth/me.js` - Endpoint infos utilisateur
- ✅ `AUTH.md` - Documentation complète
- ✅ `AUTHENTICATION_SETUP.md` - Ce fichier

### Fichiers modifiés
- ✅ `server.js` - Routes protégées + middleware auth
- ✅ `vercel.json` - Routes d'authentification
- ✅ `public/admin.html` - Script auth ajouté
- ✅ `public/poster.html` - Script auth ajouté
- ✅ `public/dashboard.html` - Script auth ajouté
- ✅ `api/reviews.js` - Contrôle d'accès
- ✅ `api/reviews/[id].js` - Contrôle d'accès
- ✅ `api/reviews/last-import.js` - Contrôle d'accès
- ✅ `api/generate.js` - Contrôle d'accès
- ✅ `.env.example` - Variables d'auth

## 🔐 Comptes par défaut

### Admin (accès complet)
```
Username: admin
Password: admin123
```

### Poster (accès limité)
```
Username: poster
Password: poster123
```

⚠️ **IMPORTANT** : Changez ces mots de passe avant le déploiement !

## 🎭 Permissions par rôle

### 👑 Admin
- ✅ Générer des avis (`/`, `/generate`)
- ✅ Dashboard complet (`/dashboard`)
- ✅ Interface admin (`/admin`)
- ✅ Interface poster (`/poster`)
- ✅ Créer des avis (POST `/api/reviews`)
- ✅ Modifier des avis (PUT `/api/reviews/:id`)
- ✅ Supprimer des avis (DELETE `/api/reviews/:id`)
- ✅ Annuler import (DELETE `/api/reviews/last-import`)

### 🎯 Poster
- ✅ Interface poster (`/poster`)
- ✅ Voir les avis (GET `/api/reviews`)
- ✅ Modifier le statut (PUT `/api/reviews/:id`)
- ❌ Générer des avis
- ❌ Dashboard complet
- ❌ Interface admin
- ❌ Créer/supprimer des avis

## 🚀 Tester en local

1. Démarrez le serveur :
```bash
npm run dev
```

2. Ouvrez http://localhost:3457/login

3. Testez avec les comptes :
   - `admin` / `admin123` → Redirigé vers `/admin`
   - `poster` / `poster123` → Redirigé vers `/poster`

4. Essayez d'accéder à `/admin` avec le compte poster → Accès refusé ✅

## 📦 Déployer sur Vercel

### ⚠️ Important : Sessions en production

Les sessions en mémoire ne fonctionnent pas sur Vercel (serverless).
Vous devez utiliser **Vercel KV** pour stocker les sessions.

### Étapes de déploiement

1. **Créer un store Vercel KV**
   ```bash
   vercel kv create
   ```

2. **Modifier `auth.js` pour utiliser KV**
   
   Remplacez :
   ```javascript
   const sessions = new Map();
   ```
   
   Par :
   ```javascript
   const { kv } = require('@vercel/kv');
   
   async function verifyToken(token) {
     if (!token) return null;
     const session = await kv.get(`session:${token}`);
     if (!session) return null;
     
     if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
       await kv.del(`session:${token}`);
       return null;
     }
     
     return session;
   }
   ```

3. **Ajouter les variables d'environnement sur Vercel**
   
   Dans Settings → Environment Variables :
   ```
   ADMIN_PASSWORD=votre_mot_de_passe_securise
   POSTER_PASSWORD=votre_mot_de_passe_securise
   OPENROUTER_API_KEY=votre_cle_api
   ```

4. **Déployer**
   ```bash
   vercel --prod
   ```

## 🔒 Sécurité en production

### À faire avant le déploiement

1. ✅ Changer les mots de passe par défaut
2. ✅ Utiliser Vercel KV pour les sessions
3. ✅ Hasher les mots de passe avec bcrypt
4. ✅ Ajouter rate limiting sur `/api/auth/login`
5. ✅ Configurer HTTPS uniquement
6. ✅ Ajouter des logs de sécurité

### Exemple avec bcrypt

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// Dans auth.js
const USERS = {
  admin: {
    // Hash généré avec: bcrypt.hash('votre_password', 10)
    passwordHash: '$2b$10$...',
    role: 'admin'
  }
};

function login(username, password) {
  const user = USERS[username];
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  
  // ... reste du code
}
```

## 🧪 Tests à effectuer

- [ ] Connexion avec admin → accès à `/admin` ✓
- [ ] Connexion avec poster → accès à `/poster` ✓
- [ ] Poster essaie d'accéder à `/admin` → refusé ✓
- [ ] Poster essaie de générer des avis → refusé ✓
- [ ] Poster peut modifier le statut d'un avis ✓
- [ ] Déconnexion fonctionne ✓
- [ ] Token expiré → redirection login ✓
- [ ] Accès direct sans login → redirection login ✓

## 📚 Documentation

Consultez `AUTH.md` pour :
- Architecture détaillée
- Guide de migration vers KV
- Améliorations de sécurité
- Exemples de code

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que `auth.js` est bien importé
2. Vérifiez les logs du serveur
3. Testez les endpoints avec curl :
   ```bash
   curl -X POST http://localhost:3457/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'
   ```

## ✨ Prochaines étapes

1. Tester l'authentification en local
2. Modifier les mots de passe par défaut
3. Migrer vers Vercel KV pour les sessions
4. Déployer sur Vercel
5. Tester en production

---

**Système d'authentification installé avec succès ! 🎉**
