# 🧪 Guide de Tests MiniGénie - Étape par Étape

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Node.js installé (v18+)
- ✅ Expo CLI installé (`npm install -g expo-cli`)
- ✅ Expo Go installé sur votre téléphone (Android/iOS)
- ✅ Git installé
- ✅ Terminal PowerShell ou CMD ouvert

---

## 🎯 Tests à Effectuer

### Test 1 : Vérifier la Compilation TypeScript ✅
### Test 2 : Vérifier les Fichiers Audio WAV ✅
### Test 3 : Lancer l'Application Mobile (Expo Go) 📱
### Test 4 : Lancer le Dashboard Web 🌐
### Test 5 : Lancer le Backend API 🔧

---

## 📝 Instructions Détaillées

### ✅ ÉTAPE 1 : Vérifier la Compilation TypeScript

**Où** : Terminal dans le dossier racine du projet

**Commandes** :
```powershell
# 1. Aller dans le dossier mobile
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile"

# 2. Vérifier la compilation TypeScript
npx tsc --noEmit
```

**Résultat attendu** : Aucune erreur (Exit code: 0)

**Si erreur** : Signalez-moi les erreurs affichées

---

### ✅ ÉTAPE 2 : Vérifier les Fichiers Audio WAV

**Où** : Explorateur de fichiers Windows

**Chemin** : `C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile\assets\sounds\`

**Fichiers à vérifier** :
- ✅ `success.wav` (doit exister)
- ✅ `error.wav` (doit exister)
- ✅ `badge.wav` (doit exister)
- ✅ `celebration.wav` (doit exister)
- ✅ `click.wav` (doit exister)
- ✅ `encouragement.wav` (doit exister)

**Vérification rapide** :
```powershell
# Dans le dossier racine
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile\assets\sounds"
dir *.wav
```

**Résultat attendu** : 6 fichiers WAV listés

---

### 📱 ÉTAPE 3 : Lancer l'Application Mobile (Expo Go)

#### 3.1. Préparer l'Environnement

**Où** : Terminal PowerShell

**Commandes** :
```powershell
# 1. Aller dans le dossier mobile
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile"

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Nettoyer le cache Expo
npx expo start --clear
```

#### 3.2. Lancer Expo

**Commande** :
```powershell
npx expo start --clear
```

**Résultat attendu** :
- Un QR code s'affiche dans le terminal
- Un menu Expo s'ffiche avec options :
  - `a` pour Android
  - `i` pour iOS
  - `w` pour web
  - `r` pour reload

#### 3.3. Scanner avec Expo Go

**Sur votre téléphone** :
1. Ouvrez l'application **Expo Go**
2. Appuyez sur **"Scan QR Code"**
3. Scannez le QR code affiché dans le terminal
4. Attendez le chargement de l'application

**Résultat attendu** :
- L'application MiniGénie se charge
- L'écran splash s'affiche
- Navigation vers `/home` ou `/profile`

#### 3.4. Tests à Effectuer dans l'App

**Navigation** :
- [ ] Splash screen s'affiche
- [ ] Redirection vers `/home` ou `/profile`
- [ ] Écran d'accueil avec Assena visible
- [ ] Navigation vers les modules fonctionne

**Modules** :
- [ ] Module Alphabet : Lettres s'affichent, TTS fonctionne
- [ ] Module Calcul : Exercices s'affichent, réponses fonctionnent
- [ ] Module Chiffres : Nombres s'affichent
- [ ] Module Syllabes : Syllabes s'affichent
- [ ] Module Vocabulaire : Mots s'affichent
- [ ] Module Lecture : Textes s'affichent
- [ ] Module Famille : Membres s'affichent
- [ ] Module Écriture : Lettres traçables

**Fonctionnalités** :
- [ ] Sons de récompense jouent (success, error, badge)
- [ ] Badges se débloquent
- [ ] Progression se sauvegarde
- [ ] Sessions se créent

**Si erreur** : Notez le message d'erreur et l'écran où ça se produit

---

### 🌐 ÉTAPE 4 : Lancer le Dashboard Web

#### 4.1. Préparer l'Environnement

**Où** : Nouveau terminal PowerShell (gardez Expo ouvert dans l'autre)

**Commandes** :
```powershell
# 1. Aller dans le dossier web
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\web"

# 2. Installer les dépendances (si pas déjà fait)
npm install
```

#### 4.2. Lancer Next.js

**Commande** :
```powershell
npm run dev
```

**Résultat attendu** :
- Serveur démarre sur `http://localhost:3000`
- Message : "Ready in X ms"

#### 4.3. Ouvrir dans le Navigateur

**Action** :
1. Ouvrez votre navigateur (Chrome, Firefox, Edge)
2. Allez sur : `http://localhost:3000`
3. Attendez le chargement

**Résultat attendu** :
- Dashboard parent s'affiche
- Graphiques visibles (si données disponibles)
- Filtres fonctionnels
- Pas d'erreurs dans la console (F12)

**Tests à Effectuer** :
- [ ] Page se charge sans erreur
- [ ] Dashboard s'affiche
- [ ] Graphiques s'affichent (ou message "Aucune donnée")
- [ ] Filtres par période fonctionnent
- [ ] Filtres par module fonctionnent
- [ ] Pas d'erreurs dans la console (F12 → Console)

**Si erreur** : Notez le message d'erreur dans la console (F12)

---

### 🔧 ÉTAPE 5 : Lancer le Backend API

#### 5.1. Préparer l'Environnement

**Où** : Nouveau terminal PowerShell (gardez Expo et Next.js ouverts)

**Commandes** :
```powershell
# 1. Aller dans le dossier backend
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"

# 2. Installer les dépendances (si pas déjà fait)
npm install
```

#### 5.2. Configurer le Fichier .env

**Où** : Explorateur de fichiers

**Chemin** : `C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend\.env`

**Action** :
1. Vérifiez si le fichier `.env` existe
2. Si non, créez-le avec ce contenu (ou utilisez `create-env.js`) :

```env
# Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon

# Port
PORT=3001

# CORS
CORS_ORIGIN=http://localhost:3000

# IA (optionnel)
DEEPSEEK_API_KEY=votre_cle_deepseek
# ou
OPENAI_API_KEY=votre_cle_openai
```

**Alternative** : Utiliser le script de création
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
node create-env.js
```

#### 5.3. Lancer le Backend

**Commande** :
```powershell
npm run dev
```

**Résultat attendu** :
- Serveur démarre sur `http://localhost:3001`
- Messages :
  - `✅ Fichier .env chargé depuis: ...`
  - `✅ Service IA DeepSeek configuré` (ou `Mode fallback activé`)
  - `🚀 Serveur MiniGénie démarré sur le port 3001`

#### 5.4. Tester le Backend

**Action** :
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3001/health`
3. Vérifiez la réponse

**Résultat attendu** :
```json
{
  "status": "ok",
  "message": "MiniGénie Backend API"
}
```

**Tests API** :
- [ ] Health check fonctionne (`/health`)
- [ ] API accessible (`/api`)
- [ ] Pas d'erreurs dans le terminal

**Si erreur** : Notez le message d'erreur dans le terminal

---

## 🔍 Vérifications Finales

### Checklist Complète

**Mobile (Expo Go)** :
- [ ] Application se charge
- [ ] Navigation fonctionne
- [ ] Modules s'affichent
- [ ] Sons jouent
- [ ] Progression se sauvegarde

**Web (Dashboard)** :
- [ ] Page se charge
- [ ] Dashboard s'affiche
- [ ] Graphiques s'affichent
- [ ] Filtres fonctionnent
- [ ] Pas d'erreurs console

**Backend (API)** :
- [ ] Serveur démarre
- [ ] Health check OK
- [ ] API accessible
- [ ] Pas d'erreurs

---

## ⚠️ Résolution de Problèmes

### Problème : Port déjà utilisé

**Solution** :
```powershell
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus (remplacez <PID> par le numéro trouvé)
taskkill /PID <PID> /F
```

### Problème : Expo ne démarre pas

**Solution** :
```powershell
# Nettoyer complètement
cd apps\mobile
npx expo start --clear
# Ou
Remove-Item -Recurse -Force .expo
npx expo start --clear
```

### Problème : Next.js ne démarre pas

**Solution** :
```powershell
# Nettoyer
cd apps\web
Remove-Item -Recurse -Force .next
npm run dev
```

### Problème : Backend ne démarre pas

**Solution** :
```powershell
# Vérifier le .env
cd backend
node create-env.js
# Puis
npm run dev
```

---

## 📞 Support

Si vous rencontrez des erreurs :
1. Notez le message d'erreur exact
2. Notez l'étape où ça se produit
3. Notez le terminal/écran concerné
4. Partagez-moi ces informations

---

*Guide de tests - MiniGénie*

