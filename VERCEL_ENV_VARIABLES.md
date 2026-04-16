# 🔐 Variables d'environnement pour Vercel

## Variables à configurer sur Vercel

Allez sur : **Vercel Dashboard → Votre projet → Settings → Environment Variables**

### 1. OpenRouter API Key (OBLIGATOIRE)
```
Nom: OPENROUTER_API_KEY
Valeur: sk-or-v1-VOTRE_CLE_ICI
Environnements: Production, Preview, Development
```

### 2. Mots de passe (OPTIONNEL - déjà dans le code)
```
Nom: ADMIN_PASSWORD
Valeur: wawa07
Environnements: Production, Preview, Development

Nom: POSTER_PASSWORD
Valeur: poster123
Environnements: Production, Preview, Development
```

### 3. Base de données Redis (OPTIONNEL - pour persistance)
```
Si vous installez Upstash Redis depuis le Marketplace Vercel,
ces variables seront ajoutées automatiquement :

KV_REST_API_URL
KV_REST_API_TOKEN
```

## Comment ajouter les variables

1. Allez sur https://vercel.com/dashboard
2. Cliquez sur votre projet "generator"
3. Onglet "Settings"
4. Menu "Environment Variables"
5. Cliquez "Add New"
6. Entrez le nom et la valeur
7. Cochez "Production", "Preview", "Development"
8. Cliquez "Save"

## Variables actuellement nécessaires

**MINIMUM pour que ça fonctionne :**
- `OPENROUTER_API_KEY` - Pour générer les avis avec Claude

**OPTIONNEL :**
- `ADMIN_PASSWORD` - Sinon utilise "wawa07" par défaut
- `POSTER_PASSWORD` - Sinon utilise "poster123" par défaut
- Redis (KV) - Sinon les données sont en mémoire (temporaire)

## Obtenir votre clé OpenRouter

1. Allez sur https://openrouter.ai
2. Créez un compte
3. Allez dans "Keys"
4. Créez une nouvelle clé
5. Copiez la clé (commence par `sk-or-v1-`)
6. Ajoutez-la sur Vercel

## Après avoir ajouté les variables

1. Allez dans "Deployments"
2. Cliquez sur le dernier déploiement
3. Menu "..." → "Redeploy"
4. Cochez "Use existing Build Cache"
5. Cliquez "Redeploy"

Ou attendez simplement le prochain push Git (auto-redeploy).
