# 🧪 Guide de Test - MiniGénie Mobile

## 📋 Prérequis

Avant de commencer les tests, assurez-vous d'avoir :

1. **Node.js** installé (version 18+)
2. **Expo CLI** installé globalement : `npm install -g expo-cli`
3. **Expo Go** installé sur votre téléphone (iOS ou Android)
4. **Connexion Internet** pour le premier lancement
5. **Backend** démarré (si vous testez les fonctionnalités backend)

---

## 🚀 Étape 1 : Préparation de l'environnement

### 1.1 Vérifier les dépendances

```bash
cd apps/mobile
npm install
```

### 1.2 Vérifier que les sons sont générés

```bash
# Vérifier que le dossier existe
ls assets/sounds/

# Si les fichiers n'existent pas, les générer
node scripts/generateSounds.js
```

**Résultat attendu** : 6 fichiers `.wav` dans `apps/mobile/assets/sounds/`
- ✅ success.wav
- ✅ error.wav
- ✅ badge.wav
- ✅ celebration.wav
- ✅ click.wav
- ✅ encouragement.wav

---

## 🎯 Étape 2 : Lancement de l'application

### 2.1 Démarrer le serveur Expo

```bash
cd apps/mobile
npx expo start
```

**Résultat attendu** :
- ✅ QR code affiché dans le terminal
- ✅ Options : `a` pour Android, `i` pour iOS, `w` pour web

### 2.2 Connecter votre appareil

**Option A - Expo Go (Recommandé pour les tests)**
1. Ouvrir Expo Go sur votre téléphone
2. Scanner le QR code avec :
   - **iOS** : Appareil photo natif
   - **Android** : Expo Go app

**Option B - Émulateur**
- **Android** : Appuyer sur `a` dans le terminal
- **iOS** : Appuyer sur `i` (nécessite Xcode sur Mac)

**Résultat attendu** :
- ✅ L'application se charge
- ✅ Écran d'accueil s'affiche avec Assena
- ✅ Pas d'erreurs dans la console

---

## 📱 Étape 3 : Tests de l'écran d'accueil

### 3.1 Vérifier l'affichage

**Actions** :
1. Observer l'écran d'accueil
2. Vérifier que Assena est visible
3. Vérifier que les modules sont affichés

**Résultats attendus** :
- ✅ Assena change d'expression toutes les 5 secondes
- ✅ 8 modules visibles avec leurs icônes
- ✅ Animations d'entrée fluides
- ✅ Pas de lag ou de freeze

### 3.2 Tester la navigation

**Actions** :
1. Cliquer sur chaque module
2. Observer les transitions

**Résultats attendus** :
- ✅ Transitions fluides (fade + slide)
- ✅ Pas de délai anormal
- ✅ Retour à l'accueil fonctionne

---

## 🎓 Étape 4 : Tests des modules pédagogiques

### 4.1 Module Alphabet

**Actions** :
1. Ouvrir le module Alphabet
2. Observer la première lettre (A)
3. Cliquer sur "Répéter"
4. Cliquer sur "Suivant"
5. Parcourir quelques lettres
6. Revenir en arrière
7. Aller jusqu'à la fin (Z)

**Résultats attendus** :
- ✅ Lettre affichée avec majuscule et minuscule
- ✅ Animation d'apparition fluide
- ✅ TTS prononce la lettre et l'exemple
- ✅ Son de clic joué (si activé)
- ✅ Transitions entre lettres fluides
- ✅ Progression mise à jour
- ✅ Message de fin à la lettre Z

**Tests de performance** :
- ⏱️ Temps de chargement < 1 seconde
- ⏱️ Transition entre lettres < 300ms
- ⏱️ Pas de freeze pendant la navigation

### 4.2 Module Chiffres

**Actions** :
1. Ouvrir le module Chiffres
2. Parcourir de 1 à 20
3. Aller jusqu'à 50
4. Aller jusqu'à 100

**Résultats attendus** :
- ✅ Chiffre affiché clairement
- ✅ Représentation visuelle adaptée (points pour petits nombres, texte pour grands)
- ✅ TTS prononce le chiffre
- ✅ Navigation fluide
- ✅ Pas de ralentissement avec les grands nombres

### 4.3 Module Calcul

**Actions** :
1. Ouvrir le module Calcul
2. Répondre à 5 questions
3. Observer les feedbacks
4. Vérifier les sons

**Résultats attendus** :
- ✅ Questions variées (additions, soustractions, comparaisons)
- ✅ 4 options proposées
- ✅ Son de succès pour bonne réponse ✅
- ✅ Son d'erreur pour mauvaise réponse ❌
- ✅ Animation de feedback (vert/rouge)
- ✅ Message d'encouragement TTS
- ✅ Score mis à jour
- ✅ Nouvelle question après 2 secondes

**Tests de variété** :
- ✅ Au moins 1 addition
- ✅ Au moins 1 soustraction
- ✅ Au moins 1 comparaison (sur 10 questions)

### 4.4 Module Écriture

**Actions** :
1. Ouvrir le module Écriture
2. Tracer une lettre (ex: A)
3. Activer/désactiver le guide
4. Passer à la lettre suivante
5. Tester avec majuscules et minuscules

**Résultats attendus** :
- ✅ Guide pulsant visible (si activé)
- ✅ Tracé visible en temps réel
- ✅ Feedback après le tracé
- ✅ Son d'encouragement ou d'erreur
- ✅ Animation de feedback
- ✅ 52 lettres disponibles (26 majuscules + 26 minuscules)

### 4.5 Module Vocabulaire

**Actions** :
1. Ouvrir le module Vocabulaire
2. Parcourir différentes catégories
3. Tester les heures (avec horloges)
4. Vérifier les catégories complètes

**Résultats attendus** :
- ✅ 200+ mots disponibles
- ✅ Catégories : Couleurs, Animaux, Objets, Fruits, Parties du corps, Légumes, Vêtements, Météo, Jours, Mois, Heures
- ✅ Horloges analogiques affichées pour les heures
- ✅ TTS adapté pour les heures ("Il est X heures")
- ✅ Navigation fluide

**Tests spécifiques** :
- ✅ Vérifier toutes les parties du corps (32 items)
- ✅ Vérifier les heures avec horloges (18 items)
- ✅ Vérifier les jours de la semaine (10 items)
- ✅ Vérifier les mois (13 items)

### 4.6 Module Syllabes

**Actions** :
1. Ouvrir le module Syllabes
2. Parcourir plusieurs syllabes
3. Vérifier la complétude

**Résultats attendus** :
- ✅ 100+ syllabes disponibles
- ✅ Toutes les consonnes + voyelles
- ✅ Syllabes avec accents
- ✅ Syllabes composées
- ✅ TTS prononce chaque syllabe

### 4.7 Module Lecture

**Actions** :
1. Ouvrir le module Lecture
2. Parcourir mots et phrases
3. Tester le bouton "Voir la réponse"

**Résultats attendus** :
- ✅ 50+ items (mots simples, phrases courtes, phrases longues)
- ✅ Bouton "Voir la réponse" fonctionne
- ✅ TTS adapté selon le mode
- ✅ Navigation fluide

### 4.8 Module Famille

**Actions** :
1. Ouvrir le module Famille
2. Parcourir les membres de la famille

**Résultats attendus** :
- ✅ 20+ membres de famille
- ✅ Parents, grands-parents, frères/sœurs, oncles/tantes, cousins, etc.
- ✅ Description pour chaque membre
- ✅ TTS prononce le mot et la description

---

## 🔊 Étape 5 : Tests des sons

### 5.1 Vérifier que les sons jouent

**Actions** :
1. Dans le module Calcul, répondre correctement → Son de succès
2. Répondre incorrectement → Son d'erreur
3. Terminer un module → Son de badge + célébration
4. Dans Écriture, tracer une lettre → Son d'encouragement

**Résultats attendus** :
- ✅ Son de succès joué (2 tons montants)
- ✅ Son d'erreur joué (ton descendant doux)
- ✅ Son de badge joué (séquence montante)
- ✅ Son de célébration joué (fanfare)
- ✅ Son d'encouragement joué (séquence positive)
- ✅ Son de clic joué (si activé)

**Si les sons ne jouent pas** :
1. Vérifier que les fichiers existent : `ls apps/mobile/assets/sounds/`
2. Vérifier que `SoundService.ts` charge les fichiers (switch décommenté)
3. Vérifier le volume du téléphone
4. Vérifier les logs : `console.log` dans SoundService

---

## 🎨 Étape 6 : Tests des animations

### 6.1 Animations Assena

**Actions** :
1. Observer Assena sur l'écran d'accueil
2. Observer Assena dans les modules

**Résultats attendus** :
- ✅ Assena change d'expression toutes les 5 secondes
- ✅ Animations fluides (pas de saccades)
- ✅ Expressions distinctes : happy, encouraging, thinking, celebrating, listening

### 6.2 Animations des modules

**Actions** :
1. Naviguer entre les éléments dans chaque module
2. Observer les transitions

**Résultats attendus** :
- ✅ Fade in/out fluide
- ✅ Scale animations fluides
- ✅ Pas de lag pendant les animations
- ✅ Animations se terminent correctement

### 6.3 Animations de célébration

**Actions** :
1. Terminer un module pour débloquer un badge
2. Observer la célébration

**Résultats attendus** :
- ✅ Badge apparaît avec animation de rebond
- ✅ Confettis animés (25 confettis)
- ✅ Sons de célébration joués
- ✅ Animation de sortie fluide

---

## ⚡ Étape 7 : Tests de performance

### 7.1 Tests de navigation rapide

**Actions** :
1. Naviguer rapidement entre les modules
2. Cliquer rapidement sur "Suivant" dans un module
3. Tester avec plusieurs modules ouverts

**Résultats attendus** :
- ✅ Pas de freeze
- ✅ Pas de crash
- ✅ Réactivité maintenue
- ✅ Pas de fuite mémoire (vérifier avec les outils de développement)

### 7.2 Tests de mémoire

**Actions** :
1. Ouvrir plusieurs modules successivement
2. Naviguer beaucoup dans un module
3. Observer l'utilisation mémoire

**Résultats attendus** :
- ✅ Pas d'augmentation excessive de la mémoire
- ✅ Pas de ralentissement progressif
- ✅ Garbage collection fonctionne

### 7.3 Tests sur différents appareils

**Appareils à tester** :
- ✅ iPhone récent (iOS 15+)
- ✅ iPhone ancien (iOS 13+)
- ✅ Android récent (Android 10+)
- ✅ Android ancien (Android 8+)

**Résultats attendus** :
- ✅ Application fonctionne sur tous les appareils
- ✅ Performance acceptable même sur anciens appareils
- ✅ Pas de crash spécifique à un OS

---

## 🐛 Étape 8 : Tests de gestion d'erreurs

### 8.1 Tests sans connexion

**Actions** :
1. Désactiver le WiFi/Données
2. Essayer d'utiliser l'application
3. Réactiver la connexion

**Résultats attendus** :
- ✅ Application fonctionne en mode offline
- ✅ Pas de crash
- ✅ Messages d'erreur appropriés (si backend requis)

### 8.2 Tests avec données corrompues

**Actions** :
1. Simuler une erreur TTS
2. Simuler une erreur de chargement audio

**Résultats attendus** :
- ✅ Application continue de fonctionner
- ✅ Erreurs loggées avec `console.warn`
- ✅ Pas de freeze ou crash

---

## 📊 Étape 9 : Checklist finale

### Fonctionnalités
- [ ] Tous les modules s'ouvrent correctement
- [ ] Navigation fonctionne dans tous les modules
- [ ] TTS fonctionne pour tous les modules
- [ ] Sons jouent correctement
- [ ] Animations fluides
- [ ] Badges se débloquent
- [ ] Progression sauvegardée

### Performance
- [ ] Temps de chargement < 2 secondes
- [ ] Transitions < 300ms
- [ ] Pas de freeze
- [ ] Pas de crash
- [ ] Mémoire stable

### Compatibilité
- [ ] iOS fonctionne
- [ ] Android fonctionne
- [ ] Anciens appareils supportés

### Qualité
- [ ] Pas d'erreurs dans la console
- [ ] UI cohérente
- [ ] Expérience utilisateur fluide

---

## 🔧 Dépannage

### Problème : L'application ne démarre pas

**Solutions** :
1. Vérifier Node.js : `node --version` (doit être 18+)
2. Nettoyer le cache : `npx expo start -c`
3. Réinstaller les dépendances : `rm -rf node_modules && npm install`

### Problème : Les sons ne jouent pas

**Solutions** :
1. Vérifier les fichiers : `ls apps/mobile/assets/sounds/`
2. Régénérer les sons : `node scripts/generateSounds.js`
3. Vérifier le volume du téléphone
4. Vérifier les logs dans la console

### Problème : Animations saccadées

**Solutions** :
1. Vérifier que `useNativeDriver: true` est utilisé
2. Réduire le nombre d'animations simultanées
3. Tester sur un appareil plus puissant

### Problème : TTS ne fonctionne pas

**Solutions** :
1. Vérifier les permissions audio sur le téléphone
2. Vérifier que `expo-speech` est installé
3. Tester avec un message simple

---

## 📝 Rapport de test

Après chaque session de test, remplir ce rapport :

```
Date : [DATE]
Appareil : [MODÈLE + OS]
Version Expo : [VERSION]

Modules testés :
- [ ] Alphabet
- [ ] Chiffres
- [ ] Calcul
- [ ] Écriture
- [ ] Vocabulaire
- [ ] Syllabes
- [ ] Lecture
- [ ] Famille

Problèmes rencontrés :
1. [DESCRIPTION]
2. [DESCRIPTION]

Performance :
- Temps de chargement : [X] secondes
- Fluidité : [EXCELLENTE/BONNE/MOYENNE/MAUVAISE]

Notes :
[VOS NOTES]
```

---

**Bon test ! 🚀**
