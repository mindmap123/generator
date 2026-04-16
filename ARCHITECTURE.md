# 🏗️ Architecture - Séparation Admin/Poster

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                      UTILISATEURS                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    /login (Public)                           │
│              Page de connexion                               │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌───────────────────┐   ┌───────────────────┐
        │   ADMIN ROLE      │   │   POSTER ROLE     │
        │   👑 admin        │   │   🎯 poster       │
        └───────────────────┘   └───────────────────┘
                    │                   │
                    │                   │
        ┌───────────┴───────────┐       │
        │                       │       │
        ▼                       ▼       ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   /admin     │   │  /dashboard  │   │   /poster    │
│   Hub admin  │   │  Stats full  │   │  Interface   │
│              │   │              │   │  simplifiée  │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │               │
        └───────────────────┴───────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │         API ENDPOINTS             │
        │  (Protégées par auth.js)          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │      Vercel KV (Database)         │
        │         Reviews Storage           │
        └───────────────────────────────────┘
```

## 🔐 Flux d'authentification

```
1. Utilisateur → /login
                    │
                    ▼
2. Saisie username/password
                    │
                    ▼
3. POST /api/auth/login
                    │
                    ▼
4. auth.js vérifie credentials
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    ✅ Valide              ❌ Invalide
        │                       │
        ▼                       ▼
5. Génère token         Erreur 401
        │
        ▼
6. Stocke dans localStorage
        │
        ▼
7. Redirection selon rôle
        │
    ┌───┴───┐
    ▼       ▼
  /admin  /poster
```

## 🛡️ Protection des routes

### Pages HTML

```
┌─────────────────┬──────────┬────────┬────────────┐
│      Page       │  Admin   │ Poster │  Public    │
├─────────────────┼──────────┼────────┼────────────┤
│ /login          │    ✅    │   ✅   │     ✅     │
│ /               │    ✅    │   ✅   │     ✅     │
│ /admin          │    ✅    │   ❌   │     ❌     │
│ /dashboard      │    ✅    │   ❌   │     ❌     │
│ /poster         │    ✅    │   ✅   │     ❌     │
└─────────────────┴──────────┴────────┴────────────┘
```

### API Endpoints

```
┌──────────────────────────────┬──────────┬────────┐
│          Endpoint            │  Admin   │ Poster │
├──────────────────────────────┼──────────┼────────┤
│ POST /api/auth/login         │    ✅    │   ✅   │
│ POST /api/auth/logout        │    ✅    │   ✅   │
│ GET  /api/auth/me            │    ✅    │   ✅   │
├──────────────────────────────┼──────────┼────────┤
│ GET  /api/reviews            │    ✅    │   ✅   │
│ POST /api/reviews            │    ✅    │   ❌   │
│ PUT  /api/reviews/:id        │    ✅    │   ✅   │
│ DELETE /api/reviews/:id      │    ✅    │   ❌   │
│ DELETE /api/reviews/last-imp │    ✅    │   ❌   │
├──────────────────────────────┼──────────┼────────┤
│ POST /api/generate           │    ✅    │   ❌   │
└──────────────────────────────┴──────────┴────────┘
```

## 📁 Structure des fichiers

```
avis-generator/
│
├── 🔐 Authentification
│   ├── auth.js                    # Logique serveur
│   ├── public/login.html          # Page de connexion
│   ├── public/auth-client.js      # Logique client
│   └── api/auth/
│       ├── login.js               # POST /api/auth/login
│       ├── logout.js              # POST /api/auth/logout
│       └── me.js                  # GET /api/auth/me
│
├── 🎨 Interfaces
│   ├── public/admin.html          # Hub admin (Admin)
│   ├── public/dashboard.html     # Dashboard complet (Admin)
│   ├── public/poster.html        # Interface poster (Admin+Poster)
│   └── public/review-generator.html  # Générateur (Public)
│
├── 🔌 API
│   ├── api/generate.js            # Génération IA (Admin)
│   ├── api/reviews.js             # CRUD reviews
│   └── api/reviews/
│       ├── [id].js                # Update/Delete
│       └── last-import.js         # Undo import (Admin)
│
├── ⚙️ Configuration
│   ├── server.js                  # Serveur local
│   ├── vercel.json                # Config Vercel
│   └── .env.example               # Variables d'env
│
└── 📚 Documentation
    ├── README.md                  # Documentation principale
    ├── AUTH.md                    # Doc technique auth
    ├── AUTHENTICATION_SETUP.md    # Guide setup
    ├── QUICKSTART_AUTH.md         # Démarrage rapide
    ├── TEST_AUTH.md               # Tests
    ├── SEPARATION_ADMIN_POSTER.md # Résumé
    └── ARCHITECTURE.md            # Ce fichier
```

## 🔄 Flux de données

### Génération d'avis (Admin uniquement)

```
Admin → /
    │
    ▼
Configure paramètres
    │
    ▼
Clique "Générer"
    │
    ▼
POST /api/generate
    │
    ▼
auth.js vérifie role=admin
    │
    ▼
OpenRouter API (Claude)
    │
    ▼
Avis générés
    │
    ▼
Affichage + bouton "+ Dashboard"
    │
    ▼
POST /api/reviews (batch)
    │
    ▼
Vercel KV stocke
    │
    ▼
Visible dans /poster pour l'équipe
```

### Posting d'avis (Poster)

```
Poster → /poster
    │
    ▼
Onglet "To Post"
    │
    ▼
Voit les avis status=pending
    │
    ▼
Copie un avis
    │
    ▼
Poste sur Google
    │
    ▼
Clique "Mark as Posted"
    │
    ▼
Modal : saisit nom compte Google
    │
    ▼
PUT /api/reviews/:id
    │
    ▼
auth.js vérifie role=admin|poster
    │
    ▼
Update status=posted
    │
    ▼
Vercel KV update
    │
    ▼
Avis passe dans "Check Online"
```

### Vérification (Poster)

```
Poster → /poster → "Check Online"
    │
    ▼
Voit les avis status=posted
    │
    ▼
Vérifie sur Google
    │
    ├─ Toujours là
    │   │
    │   ▼
    │   Clique "Still There"
    │   │
    │   ▼
    │   PUT /api/reviews/:id
    │   │
    │   ▼
    │   Update last_checked_at
    │
    └─ Disparu
        │
        ▼
        Clique "Gone"
        │
        ▼
        PUT /api/reviews/:id
        │
        ▼
        Update status=disappeared
        │
        ▼
        Avis passe dans "Gone"
```

## 🔒 Sécurité - Couches de protection

```
┌─────────────────────────────────────────────────┐
│  1. Client-side (auth-client.js)                │
│     - Vérification token localStorage           │
│     - Redirection si non autorisé               │
│     - Ajout auto token dans headers             │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  2. Server-side (server.js / API)               │
│     - requireAuth() vérifie token               │
│     - requireRole() vérifie permissions         │
│     - Retourne 401/403 si refusé                │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  3. Session Management (auth.js)                │
│     - Validation token                          │
│     - Vérification expiration (24h)             │
│     - Gestion des rôles                         │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  4. Data Layer (Vercel KV)                      │
│     - Stockage sécurisé                         │
│     - Isolation des données                     │
└─────────────────────────────────────────────────┘
```

## 🚀 Déploiement

### Local (Développement)

```
npm run dev
    │
    ▼
server.js démarre
    │
    ▼
Sessions en mémoire (Map)
    │
    ▼
Data dans data.json
    │
    ▼
http://localhost:3457
```

### Production (Vercel)

```
vercel --prod
    │
    ▼
Vercel Serverless Functions
    │
    ▼
Sessions dans Vercel KV
    │
    ▼
Data dans Vercel KV
    │
    ▼
https://votre-app.vercel.app
```

## 📊 Statistiques d'implémentation

- **Fichiers créés** : 11
- **Fichiers modifiés** : 11
- **Lignes de code** : ~1500
- **Endpoints protégés** : 8
- **Pages protégées** : 3
- **Rôles** : 2 (Admin, Poster)
- **Temps d'implémentation** : ~2h

## 🎯 Points clés

1. **Séparation claire** : Admin vs Poster
2. **Sécurité multicouche** : Client + Server + Session
3. **UX fluide** : Redirection automatique selon rôle
4. **Scalable** : Facile d'ajouter de nouveaux rôles
5. **Documenté** : 6 fichiers de documentation
6. **Testé** : Checklist complète de tests

---

**Architecture robuste et sécurisée ! 🏗️**
