# 🧞 MiniGénie

Application éducative intelligente pour enfants de 3 à 8 ans, avec la mascotte IA Assena.

## 🎯 Vision

MiniGénie aide les enfants à apprendre de manière ludique, guidée et sécurisée, même **sans connexion internet**.

## 🏗️ Architecture

Monorepo avec :
- **Mobile** : Expo + React Native (`apps/mobile`)
- **Web** : Next.js (`apps/web`)
- **Packages partagés** : Types, utils, IA, offline (`packages/`)

## 🚀 Développement

### Installation

```bash
npm install
```

### Lancer le développement

**Mobile uniquement :**
```bash
npm run dev:mobile
```

**Web uniquement :**
```bash
npm run dev:web
```

**Les deux en parallèle :**
```bash
npm run dev:all
```

## 📚 Documentation

- [Documentation complète](./docs/README.md)
- [Spécifications](./specs/README.md)
- [Règles de développement](./rules/README.md)
- [Prompt de développement](./DEVELOPMENT_PROMPT.md)

## 🎨 Design

- [Logo et Assena](./assets/design/LOGO_ET_ASSENA.md)

## 🚧 Statut

En développement actif.

