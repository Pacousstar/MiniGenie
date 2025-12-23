# 🎓 MiniGénie

L'application éducative intelligente pour les enfants de 3 à 8 ans — fun, intelligente et 100% interactive.

## 🎯 À Propos

MiniGénie est une application éducative complète avec :
- **8 modules pédagogiques** : Alphabet, Chiffres, Syllabes, Lecture, Écriture, Calcul, Vocabulaire, Famille
- **Mascotte IA Assena** : Bienveillante, patiente, joyeuse et encourageante
- **Système de badges** : Gamification pour motiver les enfants
- **Dashboard parent** : Suivi de la progression en temps réel
- **Mode offline-first** : Fonctionne sans internet

## 🏗️ Architecture

### Monorepo Structure
```
MiniGenie/
├── apps/
│   ├── mobile/          # Application Expo/React Native
│   └── web/             # Dashboard Next.js
├── backend/             # API Node.js (à venir)
├── packages/
│   ├── shared/          # Code partagé
│   ├── ai/              # Service IA
│   └── offline/         # Synchronisation offline
└── docs/                # Documentation
```

## 🚀 Technologies

- **Mobile** : Expo SDK 50, React Native 0.73.6, Expo Router 3.4
- **Web** : Next.js 14, React 18.2.0
- **Backend** : Node.js (à venir)
- **Base de données** : Supabase (à configurer)
- **IA** : DeepSeek/GPT (à intégrer)

## 📱 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI

### Installation
```bash
# Installer les dépendances
npm install

# Lancer l'application mobile
cd apps/mobile
npm start

# Lancer le dashboard web
cd apps/web
npm run dev
```

## 🎯 Fonctionnalités

### ✅ Complétées
- ✅ 8 modules pédagogiques fonctionnels
- ✅ Système de badges et gamification
- ✅ Gestion des sessions et progression
- ✅ Dashboard parent avec statistiques
- ✅ Stockage offline
- ✅ Animations Assena

### ⏳ En Développement
- ⏳ Backend API complet
- ⏳ Intégration Supabase
- ⏳ Intégration IA pour Assena
- ⏳ Synchronisation offline/online

## 👥 Équipe de Développement

- **Agent Principal** : Coordination, architecture, intégration
- **Agent 3** : Développement mobile & modules pédagogiques
- **Agent 4** : Backend, dashboard & intégrations

## 📚 Documentation

- `docs/README.md` - Documentation technique complète
- `specs/README.md` - Spécifications détaillées
- `rules/README.md` - Règles de développement
- `PLAN_REPARTITION_AGENTS.md` - Plan de répartition des tâches

## 🔗 Liens

- **GitHub** : https://github.com/Pacousstar/MiniGenie
- **Dashboard Web** : http://localhost:3000
- **Application Mobile** : http://localhost:8081

## 📄 Licence

Propriétaire - Tous droits réservés

---

*Développé avec ❤️ pour les enfants de 3 à 8 ans*
