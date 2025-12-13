# Spécifications du Projet MiniGénie

Ce dossier contient les spécifications détaillées du projet.

## Fichiers recommandés

- **PROJECT_SPEC.md** - Spécifications principales du projet
- **FEATURES.md** - Liste des fonctionnalités à développer
- **REQUIREMENTS.md** - Exigences techniques et fonctionnelles
- **USER_STORIES.md** - Histoires utilisateur

## Comment utiliser

Placez ici tous les documents de spécification. Je les consulterai avant et pendant le développement.


# Spécifications du Projet MiniGénie

Ce document constitue la **référence centrale** pour le développement de MiniGénie. Il regroupe les spécifications produit, fonctionnelles et techniques nécessaires à Cursor pour développer l’application de manière cohérente, robuste et alignée avec la vision éducative.

---

## 1. PROJECT_SPEC.md – Spécifications principales

### 1.1 Vision du projet

MiniGénie est une **application éducative intelligente pour enfants**, conçue pour accompagner l’apprentissage scolaire de façon ludique, guidée et sécurisée, même **sans connexion internet**.

Objectif :

* Aider l’enfant à **comprendre**, pas à tricher
* Favoriser l’autonomie progressive
* S’adapter au niveau réel de l’enfant
* Fonctionner dans des contextes africains (connexion instable, appareils modestes)

### 1.2 Public cible

* Enfants : 3 à 8 ans
* Niveaux : classe maternelle (petite section, moyenne section et grande section) et classe primaire (Cp1 et Cp2)
* Parents et enseignants : supervision indirecte

### 1.3 Plateformes

* Web (Next.js)
* Mobile Android / iOS (Expo – React Native)
* Backend commun (Node.js)

### 1.4 Principes fondateurs

* Offline-first
* UX enfant (simple, visuelle, guidée)
* IA pédagogique (pas bavarde, pas adulte)
* Coûts maîtrisés (tokens, audio, stockage)

---

## 2. FEATURES.md – Fonctionnalités

### 2.1 Fonctionnalités cœur (MVP)

* Création de profil enfant (pseudo, âge, classe)
* Détection du niveau réel (progressive)
* Interaction IA texte
* Interaction IA audio (TTS / STT)
* Mode hors ligne (contenus + cache)
* Historique local des échanges
* Mascotte MiniGénie (guide visuel)

### 2.2 Fonctionnalités pédagogiques

* Explication pas-à-pas
* Reformulation si incompris
* Exemples adaptés au contexte local
* Encouragements intelligents
* Limitation automatique de répétition

### 2.3 Fonctionnalités techniques

* Cache IA local
* Synchronisation différée
* Gestion des quotas d’usage
* Compression audio

### 2.4 Fonctionnalités futures (post-MVP)

* Tableau parent / enseignant
* Statistiques de progression
* Défis pédagogiques
* Mode multi-enfants

---

## 3. REQUIREMENTS.md – Exigences

### 3.1 Exigences fonctionnelles

* L’enfant ne doit jamais être bloqué brutalement
* L’IA doit toujours expliquer avant de répondre
* Le système doit fonctionner sans compte obligatoire

### 3.2 Exigences techniques

* Next.js pour le web
* Expo pour le mobile
* Backend Node.js
* API IA centralisée
* Stockage local prioritaire (AsyncStorage / IndexedDB)

### 3.3 Exigences IA

* Prompts strictement pédagogiques
* Limitation de tokens par session
* Mémoire courte, contrôlée
* Pas de contenu adulte

### 3.4 Exigences offline

* Accès aux contenus essentiels sans internet
* Mise en cache automatique
* Synchronisation silencieuse

---

## 4. USER_STORIES.md – Histoires utilisateur

👉 Alignée exactement sur le public cible 3–8 ans (maternelle + CP1/CP2)

🎯 Contexte général

MiniGénie est une application éducative interactive, vocale et ludique destinée aux enfants de 3 à 8 ans, avec :

Une utilisation autonome par l’enfant

Une supervision indirecte par les parents et enseignants

Une IA pédagogique bienveillante, jamais punitive

Une logique offline-first

👶 1. User Stories – Enfants (3 à 8 ans)
👧👦 1.1 Enfants – Maternelle (3 à 5 ans)

(Petite, Moyenne, Grande Section)

🧸 Découverte & interaction

En tant qu’enfant de 3–5 ans, je veux que la mascotte Assena me parle avec une voix douce pour me mettre en confiance.

En tant qu’enfant, je veux toucher de gros boutons colorés pour jouer sans me tromper.

En tant qu’enfant, je veux entendre “Bravo”, “Encore”, “C’est bien” quand je réponds.

🔤 Apprendre à parler et reconnaître

En tant qu’enfant, je veux écouter et répéter les lettres (A,a; B,b; C,c…) à voix haute.

En tant qu’enfant, je veux entendre les sons des lettres et syllabes (ba, be, bi…).

En tant qu’enfant, je veux voir des images animées associées aux mots (A comme Arbre).

✍️ Premiers gestes d’écriture

En tant qu’enfant, je veux tracer les lettres avec mon doigt ou su stylet sur l’écran.

En tant qu’enfant, je veux que l’application me guide visuellement pour bien écrire.

En tant qu’enfant, je veux recommencer sans être pénalisé.

🔢 Premiers nombres

En tant qu’enfant, je veux compter des objets animés (1 à 10).

En tant qu’enfant, je veux que l’IA me dise si j’ai bien compté.

🎒 1.2 Enfants – Primaire débutant (6 à 8 ans)

(CP1 – CP2)

📖 Lecture & compréhension

En tant qu’enfant, je veux lire des mots simples (chat, papa, école).

En tant qu’enfant, je veux lire des phrases courtes.

En tant qu’enfant, je veux répondre oralement à des questions simples sur ce que j’ai lu.

✍️ Écriture active

En tant qu’enfant, je veux écrire des lettres (en Majuscule et en Miniscule), syllabes et mots à la main.

En tant qu’enfant, je veux que l’application détecte mes erreurs (lettre manquante, mauvaise forme).

En tant qu’enfant, je veux recevoir une correction expliquée gentiment.

🔢 Mathématiques

En tant qu’enfant, je veux compter jusqu’à 100.

En tant qu’enfant, je veux faire des additions et soustractions simples.

En tant qu’enfant, je veux apprendre en jouant (objets, animations).

🧠 Progression

En tant qu’enfant, je veux monter de niveau quand je progresse.

En tant qu’enfant, je veux gagner des badges et récompenses visuelles.

🧑‍👩‍👧 2. User Stories – Parents

(Supervision indirecte)

En tant que parent, je veux voir la progression de mon enfant sans intervenir.

En tant que parent, je veux savoir :

ce qu’il sait lire

ce qu’il sait écrire

ce qu’il sait compter

En tant que parent, je veux des conseils simples pour accompagner mon enfant.

En tant que parent, je veux que l’application soit sûre, sans contenu inadapté.

En tant que parent, je veux que l’enfant puisse apprendre même sans Internet.

🧑‍🏫 3. User Stories – Enseignants

(Usage complémentaire, non obligatoire)

En tant qu’enseignant, je veux que MiniGénie respecte le programme scolaire (maternelle, CP1, CP2).

En tant qu’enseignant, je veux recommander l’application comme outil d’appui pédagogique.

En tant qu’enseignant, je veux que l’enfant progresse à son rythme, sans pression.

🤖 4. User Stories – IA (Assena)

En tant qu’IA pédagogique, je dois :

Adapter le niveau automatiquement

Répéter autant que nécessaire

Ne jamais gronder ni frustrer

En tant qu’IA, je dois encourager avant de corriger.

En tant qu’IA, je dois fonctionner même hors ligne (voix, exercices de base).

En tant qu’IA, je dois agir comme :
👉 une éducatrice bienveillante, patiente et joyeuse

🔐 5. Règles implicites (non négociables)

❌ Pas de surcharge cognitive

❌ Pas de texte complexe pour l’enfant

❌ Pas de sanction

✅ Apprentissage par le jeu

✅ Répétition naturelle

✅ Autonomie maximale


### Système

> En tant que système, je dois limiter l’usage excessif sans frustrer l’enfant.

---

## 5. Règles clés pour Cursor

* Toujours privilégier l’offline
* Toujours simplifier l’UX
* Toujours expliquer avant répondre
* Jamais de dépendance réseau critique
* Jamais de langage adulte

---

📌 Ce document est **contractuel** pour le développement de MiniGénie.
Toute implémentation doit s’y conformer.
