# 🧪 Guide de Tests MiniGénie - Instructions Étape par Étape

## ✅ ÉTAPE 0 : Vérification Préalable (FAIT ✅)

**Status** : ✅ Compilation TypeScript OK
**Status** : ✅ Fichiers audio WAV présents

---

## 📱 ÉTAPE 1 : Tester l'Application Mobile (Expo Go)

### 1.1. Ouvrir un Terminal PowerShell

**Action** :
1. Appuyez sur `Windows + X`
2. Sélectionnez **"Windows PowerShell"** ou **"Terminal"**

### 1.2. Aller dans le Dossier Mobile

**Commande à copier-coller** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile"
```

**Vérification** : Vous devez voir le chemin dans votre terminal

### 1.3. Installer les Dépendances (si nécessaire)

**Commande** :
```powershell
npm install
```

**Temps estimé** : 2-3 minutes
**Résultat attendu** : Installation des packages sans erreur

### 1.4. Lancer Expo

**Commande** :
```powershell
npx expo start --clear
```

**Résultat attendu** :
- Un QR code s'affiche dans le terminal
- Un menu avec options :
  - `a` pour Android
  - `i` pour iOS  
  - `w` pour web
  - `r` pour reload

**⚠️ Si erreur "Port déjà utilisé"** :
```powershell
# Trouver le processus
netstat -ano | findstr :8081
# Tuer le processus (remplacez <PID> par le numéro)
taskkill /PID <PID> /F
# Relancer
npx expo start --clear
```

### 1.5. Scanner avec Expo Go sur Votre Téléphone

**Sur votre téléphone** :
1. Ouvrez l'application **Expo Go**
2. Appuyez sur **"Scan QR Code"**
3. Scannez le QR code affiché dans le terminal
4. ⏳ Attendez le chargement (30-60 secondes)

**Résultat attendu** :
- L'application MiniGénie se charge
- L'écran splash s'affiche (logo MiniGénie)
- Navigation automatique vers `/home` ou `/profile`

### 1.6. Tests dans l'Application

**Navigation de Base** :
- [ ] ✅ Splash screen s'affiche (2-3 secondes)
- [ ] ✅ Redirection vers `/home` ou `/profile`
- [ ] ✅ Écran d'accueil avec Assena visible
- [ ] ✅ Boutons de modules cliquables

**Si vous êtes sur `/profile`** :
- [ ] Créez un profil enfant (nom, âge)
- [ ] Sauvegardez
- [ ] Redirection vers `/home`

**Sur l'écran `/home`** :
- [ ] Assena s'affiche avec animation
- [ ] Les 8 modules sont visibles :
  - Alphabet
  - Chiffres
  - Syllabes
  - Lecture
  - Écriture
  - Calcul
  - Vocabulaire
  - Famille

**Test d'un Module (ex: Alphabet)** :
1. Cliquez sur "Alphabet"
2. Vérifiez :
   - [ ] La lettre s'affiche (A, B, C...)
   - [ ] Le son TTS joue (Assena prononce la lettre)
   - [ ] Boutons "Précédent", "Répéter", "Suivant" fonctionnent
   - [ ] La progression s'affiche (1/26, 2/26...)
   - [ ] Navigation retour fonctionne

**Test des Sons** :
- [ ] Module Calcul : Répondez correctement → Son de succès joue
- [ ] Module Calcul : Répondez incorrectement → Son d'erreur joue
- [ ] Débloquez un badge → Son de badge + célébration jouent

**Si erreur** : Notez le message d'erreur exact et l'écran où ça se produit

---

## 🌐 ÉTAPE 2 : Tester le Dashboard Web

### 2.1. Ouvrir un NOUVEAU Terminal PowerShell

**Important** : Gardez Expo ouvert dans le premier terminal

**Action** :
1. Ouvrez un nouveau terminal (Windows + X → Terminal)
2. Ou créez un nouvel onglet dans votre terminal actuel

### 2.2. Aller dans le Dossier Web

**Commande** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\web"
```

### 2.3. Installer les Dépendances (si nécessaire)

**Commande** :
```powershell
npm install
```

**Temps estimé** : 2-3 minutes

### 2.4. Lancer Next.js

**Commande** :
```powershell
npm run dev
```

**Résultat attendu** :
- Message : `Ready in X ms`
- URL : `http://localhost:3000`
- Pas d'erreur rouge

**⚠️ Si erreur "Port 3000 déjà utilisé"** :
```powershell
# Trouver le processus
netstat -ano | findstr :3000
# Tuer le processus
taskkill /PID <PID> /F
# Relancer
npm run dev
```

### 2.5. Ouvrir dans le Navigateur

**Action** :
1. Ouvrez Chrome, Firefox ou Edge
2. Allez sur : `http://localhost:3000`
3. ⏳ Attendez le chargement (5-10 secondes)

**Résultat attendu** :
- Dashboard parent s'affiche
- Header avec "MiniGénie" et "Dashboard Parent"
- Section de bienvenue avec Assena
- Statistiques visibles

### 2.6. Tests dans le Dashboard

**Affichage** :
- [ ] ✅ Page se charge sans erreur
- [ ] ✅ Dashboard s'affiche correctement
- [ ] ✅ Graphiques s'affichent (ou message "Aucune donnée disponible")
- [ ] ✅ Filtres visibles (par période, par module)

**Filtres** :
- [ ] Cliquez sur "Aujourd'hui" → Données filtrées
- [ ] Cliquez sur "Cette semaine" → Données filtrées
- [ ] Cliquez sur "Ce mois" → Données filtrées
- [ ] Sélectionnez un module → Données filtrées

**Console du Navigateur (F12)** :
1. Appuyez sur `F12`
2. Onglet **"Console"**
3. Vérifiez :
   - [ ] Pas d'erreurs rouges
   - [ ] Pas de warnings critiques

**Si erreur** : Copiez le message d'erreur de la console

---

## 🔧 ÉTAPE 3 : Tester le Backend API

### 3.1. Ouvrir un NOUVEAU Terminal PowerShell

**Important** : Gardez Expo et Next.js ouverts

### 3.2. Aller dans le Dossier Backend

**Commande** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
```

### 3.3. Installer les Dépendances (si nécessaire)

**Commande** :
```powershell
npm install
```

### 3.4. Configurer le Fichier .env

**Option A : Utiliser le Script Automatique** (Recommandé)
```powershell
node create-env.js
```
Suivez les instructions à l'écran

**Option B : Créer Manuellement**
1. Créez un fichier `.env` dans `backend/`
2. Copiez ce contenu (remplacez les valeurs) :
```env
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Note** : Si vous n'avez pas de clés Supabase, le backend fonctionnera en mode limité

### 3.5. Lancer le Backend

**Commande** :
```powershell
npm run dev
```

**Résultat attendu** :
- `✅ Fichier .env chargé depuis: ...`
- `✅ Service IA DeepSeek configuré` (ou `Mode fallback activé`)
- `🚀 Serveur MiniGénie démarré sur le port 3001`
- `📡 API disponible sur http://localhost:3001/api`
- `💚 Health check: http://localhost:3001/health`

**⚠️ Si erreur "Port 3001 déjà utilisé"** :
```powershell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
npm run dev
```

### 3.6. Tester le Backend

**Test 1 : Health Check**
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3001/health`
3. Vérifiez la réponse :
```json
{
  "status": "ok",
  "message": "MiniGénie Backend API"
}
```

**Test 2 : API Routes**
- [ ] Health check fonctionne (`/health`)
- [ ] Pas d'erreurs dans le terminal backend
- [ ] Serveur reste actif

---

## 📋 Checklist Finale

### Mobile (Expo Go)
- [ ] Application se charge
- [ ] Navigation fonctionne
- [ ] Modules s'affichent
- [ ] Sons jouent
- [ ] Progression se sauvegarde

### Web (Dashboard)
- [ ] Page se charge
- [ ] Dashboard s'affiche
- [ ] Graphiques s'affichent
- [ ] Filtres fonctionnent
- [ ] Pas d'erreurs console (F12)

### Backend (API)
- [ ] Serveur démarre
- [ ] Health check OK (`/health`)
- [ ] Pas d'erreurs terminal

---

## ⚠️ Résolution de Problèmes Rapide

### Problème : Expo ne démarre pas
```powershell
cd apps\mobile
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start --clear
```

### Problème : Next.js ne démarre pas
```powershell
cd apps\web
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

### Problème : Backend ne démarre pas
```powershell
cd backend
node create-env.js
npm run dev
```

### Problème : Port déjà utilisé
```powershell
# Pour port 8081 (Expo)
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Pour port 3000 (Next.js)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Pour port 3001 (Backend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📞 Si Vous Rencontrez des Erreurs

**Notez** :
1. Le message d'erreur exact
2. L'étape où ça se produit (Mobile/Web/Backend)
3. Le terminal/écran concerné
4. Partagez-moi ces informations

---

## ✅ Résumé des Commandes

**Terminal 1 - Mobile** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\mobile"
npx expo start --clear
```

**Terminal 2 - Web** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\apps\web"
npm run dev
```

**Terminal 3 - Backend** :
```powershell
cd "C:\Users\GSN EXPETISES  GROUP\Projets\minigenie\MiniGenie\backend"
npm run dev
```

---

*Guide de tests - Prêt à être exécuté ! 🚀*

