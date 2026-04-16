# 🧪 Tests d'Authentification

## Checklist de tests

### ✅ Tests de connexion

- [ ] **Test 1** : Connexion admin
  - Aller sur `/login`
  - Entrer `admin` / `admin123`
  - Vérifier redirection vers `/admin`
  - Vérifier affichage "👑 admin (Admin)" dans la nav

- [ ] **Test 2** : Connexion poster
  - Aller sur `/login`
  - Entrer `poster` / `poster123`
  - Vérifier redirection vers `/poster`
  - Vérifier affichage "🎯 poster (Poster)" dans la nav

- [ ] **Test 3** : Identifiants invalides
  - Aller sur `/login`
  - Entrer `admin` / `wrongpassword`
  - Vérifier message d'erreur "Identifiants invalides"

### ✅ Tests de permissions Admin

- [ ] **Test 4** : Admin accède à /admin
  - Se connecter en admin
  - Aller sur `/admin`
  - Vérifier accès autorisé

- [ ] **Test 5** : Admin accède à /dashboard
  - Se connecter en admin
  - Aller sur `/dashboard`
  - Vérifier accès autorisé

- [ ] **Test 6** : Admin accède à /poster
  - Se connecter en admin
  - Aller sur `/poster`
  - Vérifier accès autorisé

- [ ] **Test 7** : Admin peut générer des avis
  - Se connecter en admin
  - Aller sur `/`
  - Générer des avis
  - Vérifier que ça fonctionne

- [ ] **Test 8** : Admin peut créer des avis
  - Se connecter en admin
  - Aller sur `/dashboard`
  - Importer des avis
  - Vérifier que ça fonctionne

- [ ] **Test 9** : Admin peut supprimer des avis
  - Se connecter en admin
  - Aller sur `/dashboard`
  - Supprimer un avis
  - Vérifier que ça fonctionne

### ✅ Tests de permissions Poster

- [ ] **Test 10** : Poster accède à /poster
  - Se connecter en poster
  - Aller sur `/poster`
  - Vérifier accès autorisé

- [ ] **Test 11** : Poster ne peut pas accéder à /admin
  - Se connecter en poster
  - Aller sur `/admin`
  - Vérifier redirection vers `/poster` avec message d'erreur

- [ ] **Test 12** : Poster ne peut pas accéder à /dashboard
  - Se connecter en poster
  - Aller sur `/dashboard`
  - Vérifier redirection vers `/poster` avec message d'erreur

- [ ] **Test 13** : Poster peut voir les avis
  - Se connecter en poster
  - Aller sur `/poster`
  - Vérifier que les avis s'affichent

- [ ] **Test 14** : Poster peut modifier le statut
  - Se connecter en poster
  - Aller sur `/poster`
  - Marquer un avis comme "Posted"
  - Vérifier que ça fonctionne

- [ ] **Test 15** : Poster ne peut pas générer d'avis
  - Se connecter en poster
  - Ouvrir la console développeur
  - Essayer : `fetch('/api/generate', {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token')}, body: JSON.stringify({prompt: 'test'})})`
  - Vérifier erreur 403

### ✅ Tests de sécurité

- [ ] **Test 16** : Accès sans connexion
  - Vider le localStorage : `localStorage.clear()`
  - Aller sur `/admin`
  - Vérifier redirection vers `/login`

- [ ] **Test 17** : Token invalide
  - Mettre un faux token : `localStorage.setItem('auth_token', 'fake')`
  - Aller sur `/admin`
  - Vérifier redirection vers `/login`

- [ ] **Test 18** : Déconnexion
  - Se connecter
  - Cliquer sur "Déconnexion"
  - Vérifier redirection vers `/login`
  - Vérifier que le token est supprimé

- [ ] **Test 19** : API sans token
  - Ouvrir la console développeur
  - Essayer : `fetch('/api/reviews')`
  - Vérifier erreur 403

- [ ] **Test 20** : API avec token valide
  - Se connecter
  - Ouvrir la console développeur
  - Essayer : `fetch('/api/reviews', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('auth_token')}})`
  - Vérifier réponse 200

### ✅ Tests de navigation

- [ ] **Test 21** : Boutons quick login
  - Aller sur `/login`
  - Cliquer sur "👑 Admin"
  - Vérifier connexion automatique

- [ ] **Test 22** : Persistance de session
  - Se connecter
  - Rafraîchir la page
  - Vérifier que la session est maintenue

- [ ] **Test 23** : Navigation entre pages
  - Se connecter en admin
  - Naviguer entre `/admin`, `/dashboard`, `/poster`
  - Vérifier que la session est maintenue

## 🔧 Tests avec curl

### Connexion
```bash
curl -X POST http://localhost:3457/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Vérifier session
```bash
TOKEN="votre_token_ici"
curl http://localhost:3457/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Tester API protégée
```bash
TOKEN="votre_token_ici"
curl http://localhost:3457/api/reviews \
  -H "Authorization: Bearer $TOKEN"
```

### Tester sans token (doit échouer)
```bash
curl http://localhost:3457/api/reviews
```

## 📊 Résultats attendus

| Test | Admin | Poster | Sans auth |
|------|-------|--------|-----------|
| `/login` | ✅ | ✅ | ✅ |
| `/admin` | ✅ | ❌ | ❌ |
| `/dashboard` | ✅ | ❌ | ❌ |
| `/poster` | ✅ | ✅ | ❌ |
| `GET /api/reviews` | ✅ | ✅ | ❌ |
| `POST /api/reviews` | ✅ | ❌ | ❌ |
| `PUT /api/reviews/:id` | ✅ | ✅ | ❌ |
| `DELETE /api/reviews/:id` | ✅ | ❌ | ❌ |
| `POST /api/generate` | ✅ | ❌ | ❌ |

## 🐛 Debugging

### Vérifier le token
```javascript
console.log(localStorage.getItem('auth_token'));
```

### Vérifier le rôle
```javascript
console.log(localStorage.getItem('user_role'));
```

### Vérifier la session
```javascript
fetch('/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  }
}).then(r => r.json()).then(console.log);
```

### Réinitialiser
```javascript
localStorage.clear();
window.location.href = '/login';
```

## ✅ Validation finale

Tous les tests doivent passer avant le déploiement en production !

- [ ] Tous les tests de connexion passent
- [ ] Tous les tests de permissions Admin passent
- [ ] Tous les tests de permissions Poster passent
- [ ] Tous les tests de sécurité passent
- [ ] Tous les tests de navigation passent
- [ ] Les mots de passe ont été changés
- [ ] La documentation est à jour

---

**Tests terminés avec succès ! 🎉**
