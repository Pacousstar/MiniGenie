# Règles de Développement - MiniGénie

Ce dossier contient les règles et contraintes à suivre pour le développement.

## Fichiers recommandés

- **DEVELOPMENT_RULES.md** - Règles de développement, conventions de code
- **PROJECT_RULES.md** - Règles spécifiques au projet MiniGénie
- **CONSTRAINTS.md** - Contraintes techniques, limitations

## Comment utiliser

Placez ici toutes les règles que je dois suivre. Je les respecterai lors du développement.

# 📐 Règles de Développement – MiniGénie

Ce document définit les **règles strictes, contraintes et conventions** à respecter pour tout développement du projet MiniGénie. Il sert de **cadre obligatoire** pour Cursor AI et pour tout développeur humain.

---

## 📄 DEVELOPMENT_RULES.md

### 1. Principes généraux

* Le projet est **offline-first** par défaut
* Le code doit être **lisible, modulaire et documenté**
* Aucune logique métier critique ne doit dépendre uniquement d’une connexion internet
* Toute fonctionnalité doit être pensée pour un **enfant de 3 à 8 ans**

---

### 2. Conventions de code

**Langage & Frameworks**

* JavaScript / TypeScript
* React Native (Expo) pour mobile
* React (Next.js) pour web

**Nommage**

* camelCase pour variables et fonctions
* PascalCase pour composants React
* Noms explicites et pédagogiques

**Structure**

* Un composant = une responsabilité
* Pas de logique métier dans les composants UI
* Services séparés pour : IA, audio, storage, sync

---

### 3. Bonnes pratiques obligatoires

* Gestion des erreurs silencieuse côté enfant
* Aucun crash visible pour l’enfant
* Logs techniques uniquement côté développeur
* Pas de dépendances inutiles

---

## 📄 PROJECT_RULES.md

### 1. Règles produit MiniGénie (non négociables)

* Offline-first obligatoire
* Audio prioritaire au texte
* UX enfant > performance brute
* Encouragements positifs uniquement (jamais de punition)

---

### 2. Règles pédagogiques

* Progression graduelle
* Répétition bienveillante
* Adaptation automatique du niveau (`user_level`)

---

### 3. Règles IA

* L’IA doit parler comme une éducatrice bienveillante
* Langage simple, phrases courtes
* Jamais de ton négatif
* IA désactivable si hors connexion

---

### 4. Mascotte Assena

* Toujours visible ou audible
* Sert de guide, jamais d’autorité
* Voix chaleureuse et rassurante

---

## 📄 CONSTRAINTS.md

### 1. Contraintes techniques

* Doit fonctionner sur appareils modestes
* Consommation mémoire faible
* Chargement rapide des écrans

---

### 2. Contraintes réseau

* Connexion instable prise en compte
* Mode hors ligne complet
* Synchronisation différée

---

### 3. Contraintes IA & coûts

* Limiter les appels IA
* Prioriser contenus locaux
* Mutualiser les requêtes audio

---

### 4. Contraintes éthiques & légales

* Données enfants protégées
* Aucun tracking publicitaire
* Aucune donnée vendue ou partagée

---

## ✅ Statut

Ces règles sont **obligatoires** pour tout le développement MiniGénie.
Tout code généré doit s’y conformer strictement.
