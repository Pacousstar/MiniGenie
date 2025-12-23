# 📚 Guide de Test - MiniGénie Mobile

## 📖 Fichiers de Documentation

Deux guides de test sont disponibles pour vous aider :

### 1. 📘 `GUIDE_TEST.md` - Guide Complet et Détaillé
**Pour qui ?** : Tests approfondis et complets

**Contenu** :
- ✅ 9 étapes détaillées
- ✅ Instructions pas à pas
- ✅ Tests de tous les modules
- ✅ Tests de performance
- ✅ Tests de gestion d'erreurs
- ✅ Section dépannage
- ✅ Modèle de rapport de test

**Quand l'utiliser ?** :
- Premier test complet
- Tests de validation avant release
- Tests approfondis de performance
- Dépannage de problèmes

---

### 2. ✅ `CHECKLIST_TEST.md` - Checklist Rapide
**Pour qui ?** : Tests rapides et validation basique

**Contenu** :
- ✅ Checklist simple avec cases à cocher
- ✅ Tests essentiels de chaque module
- ✅ Tests des sons et animations
- ✅ Section de résultats

**Quand l'utiliser ?** :
- Tests rapides après modifications
- Validation basique
- Tests de régression
- Vérification rapide avant commit

---

## 🚀 Démarrage Rapide

### Étape 1 : Préparation (5 minutes)

```bash
# 1. Aller dans le dossier mobile
cd apps/mobile

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Générer les sons (si pas déjà fait)
node scripts/generateSounds.js

# 4. Vérifier que les sons sont créés
ls assets/sounds/
# Vous devriez voir 6 fichiers .wav
```

### Étape 2 : Lancer l'application (2 minutes)

```bash
# Démarrer Expo
npx expo start

# Scanner le QR code avec Expo Go sur votre téléphone
# OU appuyer sur 'a' pour Android / 'i' pour iOS
```

### Étape 3 : Choisir votre guide

**Pour un test complet** → Ouvrir `GUIDE_TEST.md` et suivre les 9 étapes

**Pour un test rapide** → Ouvrir `CHECKLIST_TEST.md` et cocher les cases

---

## 📋 Ordre Recommandé des Tests

### Test 1 : Vérification de base (10 min)
1. ✅ Application démarre
2. ✅ Écran d'accueil s'affiche
3. ✅ Navigation fonctionne
4. ✅ Tous les modules s'ouvrent

### Test 2 : Tests des modules (30 min)
1. ✅ Module Alphabet (5 min)
2. ✅ Module Chiffres (3 min)
3. ✅ Module Calcul (5 min)
4. ✅ Module Écriture (5 min)
5. ✅ Module Vocabulaire (5 min)
6. ✅ Module Syllabes (3 min)
7. ✅ Module Lecture (2 min)
8. ✅ Module Famille (2 min)

### Test 3 : Tests des sons (5 min)
1. ✅ Son de succès
2. ✅ Son d'erreur
3. ✅ Son de badge
4. ✅ Son de célébration
5. ✅ Son d'encouragement

### Test 4 : Tests de performance (10 min)
1. ✅ Navigation rapide
2. ✅ Transitions fluides
3. ✅ Pas de freeze
4. ✅ Pas de crash

---

## 🎯 Objectifs des Tests

### Fonctionnalité
- ✅ Tous les modules fonctionnent correctement
- ✅ Toutes les interactions répondent
- ✅ Tous les sons jouent
- ✅ Toutes les animations sont fluides

### Performance
- ✅ Temps de chargement < 2 secondes
- ✅ Transitions < 300ms
- ✅ Pas de lag ou freeze
- ✅ Mémoire stable

### Qualité
- ✅ Pas d'erreurs dans la console
- ✅ Expérience utilisateur fluide
- ✅ UI cohérente et intuitive

---

## 🐛 En Cas de Problème

### Problème : Application ne démarre pas
→ Voir section "Dépannage" dans `GUIDE_TEST.md`

### Problème : Sons ne jouent pas
→ Vérifier `apps/mobile/assets/sounds/` contient 6 fichiers .wav

### Problème : Animations saccadées
→ Vérifier que vous testez sur un appareil récent ou émulateur

### Problème : Module ne fonctionne pas
→ Vérifier les logs dans la console Expo
→ Vérifier que toutes les dépendances sont installées

---

## 📊 Rapport de Test

Après vos tests, remplir le rapport dans `GUIDE_TEST.md` (section "Rapport de test") ou utiliser `CHECKLIST_TEST.md` pour un résumé rapide.

---

## ✅ Checklist de Validation Finale

Avant de considérer les tests comme réussis :

- [ ] Tous les modules testés
- [ ] Tous les sons testés
- [ ] Performance validée
- [ ] Pas de crash
- [ ] Pas d'erreurs critiques
- [ ] Rapport de test rempli

---

**Bon courage pour les tests ! 🚀**

Si vous rencontrez des problèmes, consultez la section "Dépannage" dans `GUIDE_TEST.md`.
