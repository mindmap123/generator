# 🚀 Démarrage Rapide - Authentification

## En 3 minutes

### 1. Démarrer le serveur
```bash
npm run dev
```

### 2. Ouvrir la page de connexion
```
http://localhost:3457/login
```

### 3. Se connecter

**Compte Admin** (accès complet)
- Username: `admin`
- Password: `admin123`

**Compte Poster** (accès limité)
- Username: `poster`
- Password: `poster123`

## 🎯 Que peut faire chaque rôle ?

### 👑 Admin
- Générer des avis avec Claude
- Voir le dashboard complet
- Créer, modifier, supprimer des avis
- Accéder à toutes les interfaces

### 🎯 Poster
- Voir les avis à poster
- Marquer les avis comme postés
- Vérifier si les avis sont toujours en ligne
- Modifier le statut des avis

## 🔐 Changer les mots de passe

Éditez `auth.js` ligne 6-15 :

```javascript
const USERS = {
  admin: {
    password: 'VOTRE_NOUVEAU_MOT_DE_PASSE',
    role: 'admin'
  },
  poster: {
    password: 'VOTRE_NOUVEAU_MOT_DE_PASSE',
    role: 'poster'
  }
};
```

## 📱 Interfaces disponibles

| URL | Rôle requis | Description |
|-----|-------------|-------------|
| `/login` | Public | Page de connexion |
| `/` | Public | Générateur d'avis |
| `/admin` | Admin | Dashboard admin |
| `/dashboard` | Admin | Dashboard complet |
| `/poster` | Admin + Poster | Interface de posting |

## ⚡ Raccourcis de test

Sur la page de login, cliquez sur :
- **👑 Admin** → Connexion automatique admin
- **🎯 Poster** → Connexion automatique poster

## 🐛 Problèmes courants

### "Non autorisé" après connexion
→ Videz le localStorage : `localStorage.clear()` dans la console

### Redirection infinie vers /login
→ Vérifiez que `auth.js` est bien importé dans `server.js`

### 403 Forbidden sur les API
→ Le token n'est pas envoyé. Vérifiez `auth-client.js`

## 📖 Documentation complète

- `AUTH.md` - Architecture et détails techniques
- `AUTHENTICATION_SETUP.md` - Ce qui a été fait
- `QUICKSTART_AUTH.md` - Ce fichier

## ✅ Checklist avant déploiement

- [ ] Mots de passe changés
- [ ] Sessions migrées vers Vercel KV
- [ ] Variables d'environnement configurées
- [ ] Tests effectués en local
- [ ] HTTPS activé

---

**Prêt à démarrer ! 🎉**
