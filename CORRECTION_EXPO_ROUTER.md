# 🔧 Correction Erreur Expo Router - MiniGénie

## ❌ Erreur

```
Invalid call at line 2: process.env.EXPO_ROUTER_APP_ROOT
First argument of `require.context` should be a string denoting the directory to require.
```

**Cause** : Expo Router 6 nécessite une configuration explicite du répertoire `app/` dans `app.json`.

---

## ✅ Corrections Effectuées

### 1. Configuration Expo Router dans app.json

**Avant** :
```json
"plugins": [
  "expo-router"
]
```

**Après** :
```json
"plugins": [
  [
    "expo-router",
    {
      "root": "./app"
    }
  ]
]
```

### 2. Création de metro.config.js

Création d'un fichier `metro.config.js` pour configurer Metro Bundler correctement :

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'json');

module.exports = config;
```

### 3. Nettoyage Complet

- ✅ Suppression du cache `.expo`
- ✅ Suppression du cache Metro
- ✅ Relance avec `--clear`

---

## 📝 Notes Importantes

### Expo Router 6

Avec Expo Router 6, il faut :
1. **Configurer explicitement le répertoire `app/`** dans `app.json`
2. **Créer un `metro.config.js`** pour la configuration Metro
3. **S'assurer que le dossier `app/` existe** (✅ déjà présent)

### Structure Requise

```
apps/mobile/
  ├── app/          ✅ Existe
  │   ├── _layout.tsx
  │   ├── index.tsx
  │   └── ...
  ├── app.json      ✅ Configuré
  ├── metro.config.js  ✅ Créé
  └── package.json   ✅ "main": "expo-router/entry"
```

---

## ✅ Statut

- ✅ Configuration Expo Router corrigée
- ✅ metro.config.js créé
- ✅ Cache nettoyé
- ✅ Application relancée

**L'erreur `EXPO_ROUTER_APP_ROOT` devrait être résolue !**

---

*Correction effectuée : Configuration Expo Router 6 pour SDK 54*

