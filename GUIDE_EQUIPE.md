# 👥 Guide pour l'Équipe

## 🎯 Bienvenue !

Ce guide explique comment utiliser l'application selon votre rôle.

## 🔐 Connexion

### Accéder à l'application
```
URL: http://localhost:3457/login
(ou votre URL de production)
```

### Vos identifiants
Votre administrateur vous a fourni :
- **Username** : votre nom d'utilisateur
- **Password** : votre mot de passe
- **Rôle** : Admin ou Poster

## 👑 Si vous êtes ADMIN

### Vous pouvez :
- ✅ Générer des avis avec l'IA
- ✅ Voir le dashboard complet
- ✅ Gérer tous les avis
- ✅ Importer des anciens avis
- ✅ Accéder à toutes les interfaces

### Vos interfaces

#### 1. Hub Admin (`/admin`)
Votre page d'accueil après connexion.
- Vue d'ensemble des statistiques
- Liens rapides vers tous les outils

#### 2. Générateur d'avis (`/`)
Pour créer de nouveaux avis.

**Comment générer des avis :**
1. Remplir les informations :
   - Nom du salon
   - Ville
   - Prestations (séparées par des virgules)
   - Membres de l'équipe (séparés par des virgules)
   - Note moyenne souhaitée
   - Longueur des avis

2. Choisir le mode :
   - **Manuel** : Générer 1 à 10 avis
   - **Automatique** : Générer jusqu'à 100 avis

3. Cliquer sur "Générer les avis"

4. Attendre la génération (quelques secondes)

5. Cliquer sur "+ Dashboard" pour sauvegarder

#### 3. Dashboard complet (`/dashboard`)
Vue complète de tous les avis.

**Fonctionnalités :**
- Voir tous les avis avec leur statut
- Filtrer par statut (pending, posted, disappeared)
- Voir la timeline complète
- Importer des anciens avis
- Supprimer des avis
- Annuler le dernier import

**Importer des anciens avis :**
1. Préparer un fichier CSV ou coller du texte
2. Format : `texte,auteur,prestation,note`
3. Cliquer sur "Importer"
4. Les avis apparaissent avec `source: historical`

#### 4. Interface Poster (`/poster`)
Même interface que l'équipe Poster.
Utile pour vérifier leur travail.

### Workflow typique Admin

```
1. Générer des avis
   ↓
2. Sauvegarder dans le dashboard
   ↓
3. L'équipe Poster les voit dans /poster
   ↓
4. Suivre l'avancement dans le dashboard
```

## 🎯 Si vous êtes POSTER

### Vous pouvez :
- ✅ Voir les avis à poster
- ✅ Marquer les avis comme postés
- ✅ Vérifier si les avis sont en ligne
- ✅ Gérer les avis disparus

### Vous ne pouvez pas :
- ❌ Générer de nouveaux avis
- ❌ Supprimer des avis
- ❌ Accéder au dashboard admin

### Votre interface : `/poster`

Après connexion, vous êtes automatiquement redirigé vers `/poster`.

#### Onglet 1 : "📝 To Post"

**Avis à poster sur Google**

Pour chaque avis :
1. Lire l'avis
2. Cliquer sur "📋 Copy" pour copier le texte
3. Aller sur Google et poster l'avis
4. Revenir sur l'application
5. Cliquer sur "✓ Mark as Posted"
6. Entrer le nom du compte Google utilisé
7. Cliquer sur "Confirm"

L'avis passe maintenant dans "Check Online".

#### Onglet 2 : "✅ Check Online"

**Avis déjà postés à vérifier**

Pour chaque avis :
1. Aller sur Google
2. Chercher l'avis (avec le nom du compte)
3. Si l'avis est toujours là :
   - Cliquer sur "✓ Still There"
   - Met à jour la date de vérification
4. Si l'avis a disparu :
   - Cliquer sur "❌ Gone"
   - L'avis passe dans "Gone"

#### Onglet 3 : "❌ Gone"

**Avis qui ont disparu de Google**

Pour chaque avis :
- Voir les avis qui ont été supprimés par Google
- Possibilité de les réactiver avec "🔄 Reactivate"
- Copier le texte pour le reposter

### Workflow typique Poster

```
1. Se connecter → /poster
   ↓
2. Onglet "To Post"
   ↓
3. Copier un avis
   ↓
4. Poster sur Google
   ↓
5. Marquer comme "Posted" avec nom du compte
   ↓
6. Répéter pour tous les avis
   ↓
7. Régulièrement : onglet "Check Online"
   ↓
8. Vérifier si les avis sont toujours là
   ↓
9. Marquer "Still There" ou "Gone"
```

## 📊 Statistiques

En haut de l'interface Poster, vous voyez :
- **To Post** : Nombre d'avis à poster
- **Online** : Nombre d'avis en ligne
- **Gone** : Nombre d'avis disparus

## 💡 Conseils

### Pour les Posters

1. **Postez régulièrement**
   - Ne postez pas tous les avis le même jour
   - Espacez les posts (1-2 par jour max)

2. **Variez les comptes Google**
   - Utilisez différents comptes
   - Notez bien le compte utilisé

3. **Vérifiez régulièrement**
   - Vérifiez les avis en ligne chaque semaine
   - Signalez rapidement les avis disparus

4. **Soyez précis**
   - Entrez le bon nom de compte Google
   - Vérifiez avant de valider

### Pour les Admins

1. **Générez avec parcimonie**
   - Ne générez pas trop d'avis d'un coup
   - Variez les paramètres

2. **Surveillez les statistiques**
   - Vérifiez le taux de disparition
   - Ajustez la stratégie si nécessaire

3. **Communiquez avec l'équipe**
   - Informez quand de nouveaux avis sont prêts
   - Donnez des consignes claires

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne partagez jamais votre mot de passe**
2. **Déconnectez-vous après utilisation**
3. **Ne laissez pas votre session ouverte**
4. **Signalez tout comportement suspect**

### Déconnexion

Cliquez sur le bouton "Déconnexion" en haut à droite.

## ❓ Questions fréquentes

### Je ne peux pas me connecter
- Vérifiez votre username et password
- Contactez votre administrateur

### Je ne vois pas les avis
- Vérifiez que vous êtes sur le bon onglet
- Rafraîchissez la page (F5)
- Contactez votre administrateur

### Un avis a disparu de Google
- Marquez-le comme "Gone" dans l'onglet "Check Online"
- Informez votre administrateur
- Il pourra le réactiver si nécessaire

### Je veux changer mon mot de passe
- Contactez votre administrateur
- Il peut le changer dans la configuration

### L'application ne répond pas
- Rafraîchissez la page (F5)
- Vérifiez votre connexion internet
- Contactez votre administrateur

## 📞 Support

En cas de problème :
1. Rafraîchir la page
2. Se déconnecter et se reconnecter
3. Contacter l'administrateur

## 🎉 Bon travail !

Merci de contribuer à la gestion des avis !

---

**Guide créé pour faciliter votre travail quotidien** 👥
