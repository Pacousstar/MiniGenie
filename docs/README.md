# Documentation du Projet MiniGénie

Ce dossier contient toute la documentation du projet MiniGénie.

## Structure recommandée

- **documents_techniques/** - Documents techniques, architecture, schémas
- **documents_fonctionnels/** - Spécifications fonctionnelles, user stories
- **documents_design/** - Maquettes, designs, wireframes
- **documents_reference/** - Documents de référence, recherches, inspirations

## Comment utiliser

Placez tous vos documents dans ce dossier ou ses sous-dossiers. Je pourrai les lire et m'en servir pour développer l'application.

# 📘 Documentation Complète du Projet MiniGénie

Ce document est la **source de vérité officielle** du projet MiniGénie. Il regroupe l’ensemble des informations nécessaires à Cursor AI pour développer l’application **sans ambiguïté**, en respectant la vision produit, les contraintes techniques et pédagogiques.

---

## 📂 documents_techniques/

### 1. Architecture générale

**Vision globale**
MiniGénie repose sur une architecture **full stack découplée**, offline-first, composée de :

* Une application mobile enfant (Expo / React Native)
* Une web app parent (Next.js / React)
* Un backend commun (Supabase)
* Une couche IA modulaire (DeepSeek par défaut)

```
[ Expo App Enfant ]  ←→  [ Backend Supabase ]  ←→  [ IA ]
        ↑                         ↑
   Offline local            Web Parent (Next.js)
```

---

### 2. Stack technique validée

**Mobile (enfant)**

* Expo (React Native)
* Expo AV (audio)
* Expo Speech / API STT
* SQLite ou MMKV (stockage local)
* Canvas / SVG pour écriture tactile

**Web (parents)**

* Next.js 14+
* React
* Tailwind ou CSS Modules

**Backend**

* Supabase

  * Auth (parent / enfant)
  * PostgreSQL
  * Storage (images, audios)

**IA**

* DeepSeek (par défaut)
* Architecture compatible GPT

---

### 3. Architecture Offline-first (verrouillée)

**Principes**

* L’application doit fonctionner sans internet
* Aucun blocage pédagogique hors ligne

**Données locales**

* Progression enfant
* Scores
* Historique exercices
* Paramètres

**Contenus locaux**

* Images pédagogiques
* Audios TTS pré-générés
* Animations

**Synchronisation**

* File d’attente locale
* Sync automatique dès connexion
* Résolution de conflit par horodatage

---

### 4. Sécurité & performance

* Aucune donnée enfant sensible exposée
* Pas de tracking publicitaire
* Chargement rapide (<2s écran principal)

---

## 📂 documents_fonctionnels/

### 1. Cible utilisateurs

**Enfants**

* Âge : 3 à 8 ans
* Non lecteurs (au départ)

**Parents**

* Suivi, contrôle, confiance

---

### 2. Objectifs pédagogiques

**Lecture**

* Alphabet A–Z
* Sons et syllabes
* Mots simples

**Écriture**

* Tracé lettres et chiffres
* Reconnaissance erreurs simples

**Mathématiques**

* Comptage
* Additions / soustractions simples

**Vocabulaire**

* Couleurs
* Animaux
* Famille
* Objets du quotidien

---

### 3. Fonctionnalités clés

**Interaction vocale**

* TTS : instructions, encouragements
* STT : répétition, prononciation

**Progression personnalisée**

* Niveau automatique (user_level)
* Recommandations d’exercices

**Gamification**

* Badges
* Félicitations
* Mascotte expressive

---

### 4. User stories principales

* En tant qu’enfant, je veux apprendre en jouant avec une mascotte
* En tant qu’enfant, je peux apprendre même sans internet
* En tant que parent, je vois la progression de mon enfant

---

## 📂 documents_design/

### 1. Direction artistique

**Style**

* Coloré
* Joyeux
* Rassurant
* Ludique

**Couleurs dominantes**

* Orange
* Blanc
* Vert

**Typographie**

* Arrondie
* Lisible
* Taille large

---

### 2. Mascotte officielle

**Nom** : Assena

**Rôle**

* Guide pédagogique
* Encourage
* Explique

**Personnalité**

* Bienveillante
* Intelligente
* Patiente
* Motivée

---

### 3. Écrans principaux

* Écran d’accueil
* Modules pédagogiques
* Écran écriture
* Récompenses
* Dashboard parent

---

## 📂 documents_reference/

### 1. Principes pédagogiques

* Apprentissage progressif
* Répétition positive
* Zéro punition
* Encouragement constant

---

### 2. Contraintes africaines prises en compte

* Connexion instable
* Coût data élevé
* Appareils modestes

---

### 3. Règles produit (non négociables)

* Offline-first obligatoire
* Audio prioritaire au texte
* UX enfant avant tout
* Pas de surcharge écran

### 4. Paiment
je te fournir les information pour cette partie plutard.

---

## ✅ Statut

Documentation **complète, validée et prête** pour développement par Cursor AI.
Ce document doit être utilisé comme **référence unique** pour toutes les générations de code MiniGénie.
