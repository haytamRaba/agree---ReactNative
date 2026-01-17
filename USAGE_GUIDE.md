# 📱 Guide d'Utilisation - Agree App

## 🎯 Démarrage Rapide

### Installation

```bash
cd agree---ReactNative
npm install
npm run web  # ou android/ios
```

## 🏠 HomeScreen - Écran Accueil

### Fonctionnalités

1. **Recherche de Produits**
   - Tapez dans la barre 🔍 pour rechercher par nom/description
   - Recherche en temps réel (sans bouton confirmer)
   - Bouton ✕ pour effacer la recherche

2. **Filtrer par Catégorie**
   - Appuyez sur une catégorie pour filtrer
   - Le badge devient vert (sélectionnée)
   - Appuyez de nouveau pour désélectionner

3. **Plats Populaires**
   - Affichés en haut (premier démarrage)
   - Scroll horizontal pour voir plus

4. **Panier Flottant**
   - Badge rouge avec nombre d'articles
   - Appuyez pour accéder au checkout

### Ajouter au Panier

```
1. Trouvez un produit
2. Appuyez sur le bouton "+"
3. Toastification de confirmation
4. Panier mis à jour automatiquement
```

## 🛒 CheckoutScreen - Validation Commande

### Formulaire

```
1. Prénom (min 2 caractères)
2. Nom (min 2 caractères)
3. Téléphone (format: 06XX XXXX XX)
4. Adresse (min 5 caractères)
5. Ville (optionnel)
6. Code Postal (optionnel, 4-5 chiffres)
```

### Validation

- ❌ Messages d'erreur rouges pour champs invalides
- ✅ Champ devient vert quand validé
- Bouton désactivé si erreurs présentes
- Confirmation automatique après succès

### Exemples Téléphones Valides

- `0612345678`
- `06 12 34 56 78`
- `+212612345678`
- `+212 6 12 34 56 78`

## 📋 OrdersScreen - Historique Commandes

### Affichage

- Liste de toutes les commandes du client
- Statuts couleur-codés:
  - 🟠 Attente (orange)
  - 🔵 Confirmée (bleu)
  - 🟣 Livraison (violet)
  - 🟢 Livrée (vert)
  - 🔴 Annulée (rouge)

### Interactions

- Appuyez pour voir détails complets
- Montant et date affichés
- Adresse et téléphone visibles au clic

## ⚙️ AdminScreen - Gestion

### Accès

1. Appuyez sur ⚙️ en haut à droite (HomeScreen)
2. Identifiants par défaut (voir AdminLoginScreen)
3. Accès à toutes les données

### Fonctionnalités

- Voir toutes les commandes
- Statistiques globales
- Gestion clients
- Mise à jour statuts commandes

## 📱 Points Importants

### Persistance

- Panier sauvegardé automatiquement (AsyncStorage)
- Données utilisateur persistantes
- Base de données SQLite locale

### Validation

- Tous les formulaires validés avant envoi
- Messages d'erreur clairement affichés
- Suggestions pour formats corrects

### Performance

- Listes optimisées avec FlatList
- Composants mémorisés
- Lazy loading activé

## 🐛 Troubleshooting

### Problème: Panier vide au retour

→ Assurez-vous d'être sur l'écran Home pour voir le panier

### Problème: Validation téléphone échoue

→ Format correct: `06XX XXXX XX` ou `+212 6XX XXXX XX`

### Problème: Commande non créée

→ Vérifiez que tous les champs sont remplis correctement
→ Vérifiez la connexion internet

### Problème: Erreur base de données

→ L'app créera automatiquement les tables manquantes
→ Consultez les logs (F12 en web)

## 🎨 Personnalisation

### Couleurs

Fichier: `src/constants/colors.js`

```javascript
primary: '#2ECC71',      // Vert sain
accent: '#E91E63',       // Rose
background: '#F5F5F5',   // Gris clair
```

### Textes

Fichier: `src/data/productsData.js`

```javascript
export const PRODUCTS = [...]  // Produits
export const CATEGORIES = [...] // Catégories
```

## 📧 Support

Pour tout problème:

1. Vérifiez la console (F12)
2. Consultez les logs de l'app
3. Redémarrez l'app

---

**Bon appétit! 🍽️**
