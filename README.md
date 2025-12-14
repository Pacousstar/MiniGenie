# 🎓 MiniGénie

Application éducative intelligente pour enfants de 3 à 8 ans, avec la mascotte Assena.

## 🚀 État du Développement

### ✅ Fonctionnalités Implémentées

- **Structure Monorepo** : Organisation claire avec apps et packages
- **Splash Screen** : Écran d'accueil animé
- **Profil Enfant** : Création et gestion du profil (pseudo, âge, niveau)
- **Écran d'Accueil** : Interface avec Assena et sélection de modules
- **Module Alphabet** : Apprentissage des lettres A-Z avec TTS
- **Système TTS** : Synthèse vocale avec voix enfantine
- **Stockage Local** : Système offline-first avec AsyncStorage/localStorage
- **Dashboard Web** : Interface parent (Next.js)

### 🚧 En Cours

- Système STT (Speech To Text)
- Synchronisation Supabase
- Autres modules pédagogiques

### 📋 À Faire

- Module Écriture (tracé tactile)
- Module Chiffres
- Module Calcul
- Module Vocabulaire
- Module Famille
- Gamification (badges, récompenses)
- Animations Assena

## 🏗️ Structure du Projet

```
MiniGenie/
├── apps/
│   ├── mobile/          # Application Expo/React Native
│   └── web/             # Dashboard Next.js
├── packages/
│   ├── shared/          # Code partagé (types, constantes, utils)
│   ├── ai/              # Logique IA
│   ├── offline/         # Gestion offline
│   └── database/        # Schémas Supabase
└── assets/              # Images, audio, fonts
```

## 🛠️ Technologies

- **Mobile** : Expo ~50.0.0, React Native 0.73.0
- **Web** : Next.js 14.0.4
- **Langage** : TypeScript
- **Stockage** : AsyncStorage (mobile), localStorage (web)
- **Audio** : expo-speech (TTS)

## 🚀 Démarrage

### Mobile

```bash
cd apps/mobile
npm install
npm start
```

### Web

```bash
cd apps/web
npm install
npm run dev
```

Le dashboard sera accessible sur http://localhost:3000

## 📱 Modules Disponibles

1. **Alphabet** ✅ - Apprendre les lettres A-Z
2. **Syllabes** 🚧 - Sons et syllabes
3. **Lecture** 🚧 - Mots et phrases
4. **Écriture** 🚧 - Tracé tactile
5. **Chiffres** 🚧 - Comptage 1-100
6. **Calcul** 🚧 - Additions/soustractions
7. **Vocabulaire** 🚧 - Couleurs, animaux, etc.
8. **Famille** 🚧 - Membres de la famille

## 🎨 Design

- **Couleurs** : Orange (#FF6B35), Vert (#4ECDC4), Blanc, Bleu, Rouge
- **Mascotte** : Assena (bienveillante, patiente, joyeuse)
- **Style** : Moderne, coloré, adapté aux enfants

## 📝 Notes

- Application **offline-first** : fonctionne sans internet
- **TTS activé** : Assena parle avec une voix enfantine
- **Stockage local** : Toutes les données sont sauvegardées localement

---

Développé avec ❤️ pour les enfants d'Afrique francophone
