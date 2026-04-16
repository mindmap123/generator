# ✅ Checklist de Déploiement

## 🎯 Avant de déployer

### 1. Tests locaux
- [ ] Le serveur démarre : `npm run dev`
- [ ] La page de login s'affiche : http://localhost:3457/login
- [ ] Connexion admin fonctionne
- [ ] Connexion poster fonctionne
- [ ] Les permissions sont respectées (voir `TEST_AUTH.md`)
- [ ] Tous les tests de `TEST_AUTH.md` passent

### 2. Sécurité
- [ ] Les mots de passe par défaut ont été changés
- [ ] Le fichier `.env` est dans `.gitignore`
- [ ] Les secrets ne sont pas commitées dans Git
- [ ] Les variables d'environnement sont prêtes

### 3. Code
- [ ] Pas d'erreurs dans la console
- [ ] Pas d'erreurs de diagnostic : `getDiagnostics`
- [ ] Le code est propre et commenté
- [ ] Les fichiers inutiles sont supprimés

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer Vercel KV

```bash
# Se connecter à Vercel
vercel login

# Créer un store KV
vercel kv create
```

- [ ] Store KV créé
- [ ] Store connecté au projet

### Étape 2 : Migrer les sessions vers KV

Modifier `auth.js` :

```javascript
const { kv } = require('@vercel/kv');

// Remplacer Map par KV
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

async function login(username, password) {
  const user = USERS[username];
  if (!user || user.password !== password) {
    return null;
  }
  
  const token = generateToken();
  const session = {
    username,
    role: user.role,
    createdAt: Date.now()
  };
  
  await kv.set(`session:${token}`, session, { ex: 86400 }); // 24h
  
  return { token, role: user.role, username };
}

async function logout(token) {
  await kv.del(`session:${token}`);
}
```

- [ ] Code modifié pour utiliser KV
- [ ] Testé en local avec KV

### Étape 3 : Configurer les variables d'environnement

Dans Vercel Dashboard → Settings → Environment Variables :

```
OPENROUTER_API_KEY=sk-or-v1-...
ADMIN_PASSWORD=votre_mot_de_passe_securise
POSTER_PASSWORD=votre_mot_de_passe_securise
```

- [ ] `OPENROUTER_API_KEY` ajoutée
- [ ] `ADMIN_PASSWORD` ajoutée
- [ ] `POSTER_PASSWORD` ajoutée
- [ ] Variables configurées pour Production, Preview, Development

### Étape 4 : Modifier auth.js pour utiliser les variables d'env

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

- [ ] Code modifié
- [ ] Testé en local

### Étape 5 : Déployer

```bash
# Déployer en production
vercel --prod
```

- [ ] Déploiement réussi
- [ ] URL de production obtenue

### Étape 6 : Tests en production

- [ ] Ouvrir l'URL de production
- [ ] Tester la connexion admin
- [ ] Tester la connexion poster
- [ ] Tester les permissions
- [ ] Vérifier que les avis se sauvegardent
- [ ] Tester la génération d'avis
- [ ] Tester le posting d'avis

## 🔒 Sécurité en production

### Recommandations

- [ ] HTTPS activé (automatique sur Vercel)
- [ ] Mots de passe forts (min 12 caractères)
- [ ] Rate limiting sur `/api/auth/login` (optionnel)
- [ ] Logs de sécurité activés (optionnel)
- [ ] Monitoring des erreurs (Vercel Analytics)

### Optionnel : Hasher les mots de passe

```bash
npm install bcrypt
```

Modifier `auth.js` :

```javascript
const bcrypt = require('bcrypt');

// Générer les hashes (une fois)
// bcrypt.hash('votre_password', 10).then(console.log)

const USERS = {
  admin: {
    passwordHash: '$2b$10$...', // Hash généré
    role: 'admin'
  },
  poster: {
    passwordHash: '$2b$10$...', // Hash généré
    role: 'poster'
  }
};

async function login(username, password) {
  const user = USERS[username];
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return null;
  
  // ... reste du code
}
```

- [ ] bcrypt installé
- [ ] Mots de passe hashés
- [ ] Code modifié
- [ ] Testé

## 📊 Post-déploiement

### Vérifications

- [ ] L'application est accessible
- [ ] Les connexions fonctionnent
- [ ] Les données se sauvegardent
- [ ] Les permissions sont respectées
- [ ] Pas d'erreurs dans les logs Vercel
- [ ] Les performances sont bonnes

### Documentation

- [ ] URL de production documentée
- [ ] Comptes admin/poster communiqués à l'équipe
- [ ] Guide d'utilisation partagé
- [ ] Support technique défini

### Monitoring

- [ ] Vercel Analytics activé
- [ ] Alertes configurées (optionnel)
- [ ] Logs consultés régulièrement

## 🎉 Déploiement terminé !

Votre application est maintenant en production avec :
- ✅ Authentification sécurisée
- ✅ Séparation Admin/Poster
- ✅ Sessions persistantes (Vercel KV)
- ✅ Mots de passe sécurisés
- ✅ HTTPS activé
- ✅ Monitoring en place

## 📞 Support

En cas de problème :

1. **Vérifier les logs Vercel**
   - Dashboard → Deployments → Logs

2. **Vérifier les variables d'environnement**
   - Dashboard → Settings → Environment Variables

3. **Vérifier Vercel KV**
   - Dashboard → Storage → KV

4. **Consulter la documentation**
   - `AUTH.md` pour les détails techniques
   - `TEST_AUTH.md` pour le debugging
   - `ARCHITECTURE.md` pour l'architecture

## 🔄 Mises à jour futures

Pour déployer des mises à jour :

```bash
# Faire les modifications
git add .
git commit -m "Description des changements"
git push

# Vercel déploie automatiquement
# Ou manuellement :
vercel --prod
```

## 📝 Notes importantes

- Les sessions expirent après 24h
- Les utilisateurs doivent se reconnecter après expiration
- Les données sont stockées dans Vercel KV (persistant)
- Les logs sont disponibles dans le dashboard Vercel
- Les déploiements sont automatiques sur `git push`

---

**Prêt pour la production ! 🚀**
