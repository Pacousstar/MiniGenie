# 🧪 Guide de Test - Authentification MiniGénie

## 📋 Prérequis

1. ✅ Backend démarré (`npm run dev` dans `backend/`)
2. ✅ Fichier `.env` créé avec les clés Supabase
3. ✅ Tables créées dans Supabase
4. ✅ Politiques RLS activées (optionnel pour les tests)

---

## 🚀 Méthode 1 : Test avec Terminal (curl)

### Étape 1 : Vérifier que le serveur fonctionne

```bash
curl http://localhost:3001/health
```

**Réponse attendue :**
```json
{
  "status": "ok",
  "message": "MiniGénie Backend API"
}
```

---

### Étape 2 : Inscription d'un parent

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123456\",\"name\":\"Parent Test\"}"
```

**Réponse attendue :**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Parent Test"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Important :** Copiez le `accessToken` pour les prochaines étapes !

---

### Étape 3 : Connexion (alternative)

Si vous avez déjà un compte :

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123456\"}"
```

**Réponse attendue :** Même format que l'inscription avec les tokens.

---

### Étape 4 : Vérifier le profil utilisateur

Remplacez `{accessToken}` par le token reçu :

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

**Exemple :**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse attendue :**
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "name": "Parent Test"
}
```

---

### Étape 5 : Créer un profil enfant

Remplacez `{accessToken}` par votre token :

```bash
curl -X POST http://localhost:3001/api/auth/child \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d "{\"pseudo\":\"Emma\",\"age\":5,\"level\":\"maternelle_gs\"}"
```

**Réponse attendue :**
```json
{
  "id": "child-uuid-here",
  "pseudo": "Emma",
  "age": 5,
  "level": "maternelle_gs",
  "userLevel": 0,
  "overallScore": 0,
  "userId": "parent-uuid-here"
}
```

**⚠️ Important :** Copiez l'`id` de l'enfant (childId) pour les prochaines étapes !

---

### Étape 6 : Récupérer tous les enfants

```bash
curl -X GET http://localhost:3001/api/auth/children \
  -H "Authorization: Bearer {accessToken}"
```

**Réponse attendue :**
```json
[
  {
    "id": "child-uuid-here",
    "pseudo": "Emma",
    "age": 5,
    "level": "maternelle_gs",
    "userLevel": 0,
    "overallScore": 0,
    "userId": "parent-uuid-here"
  }
]
```

---

### Étape 7 : Tester le dashboard (endpoint protégé)

Remplacez `{accessToken}` et `{childId}` :

```bash
curl -X GET http://localhost:3001/api/dashboard/{childId} \
  -H "Authorization: Bearer {accessToken}"
```

**Exemple :**
```bash
curl -X GET http://localhost:3001/api/dashboard/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Réponse attendue :**
```json
{
  "childName": "Emma",
  "overallScore": 0,
  "userLevel": 0,
  "totalSessions": 0,
  "totalTime": 0,
  "todayTime": 0,
  "modulesCompleted": 0,
  "badgesUnlocked": 0,
  "progressByModule": {},
  "recentSessions": [],
  "timeByModule": {},
  "sessionsByDate": [],
  "weeklyProgress": []
}
```

---

### Étape 8 : Déconnexion

```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer {accessToken}"
```

---

## 🌐 Méthode 2 : Test avec le Navigateur (Thunder Client / Postman)

### Installation

**Option 1 : Thunder Client (VS Code)**
1. Installez l'extension "Thunder Client" dans VS Code
2. Ouvrez Thunder Client dans la barre latérale

**Option 2 : Postman**
1. Téléchargez [Postman](https://www.postman.com/downloads/)
2. Installez et ouvrez Postman

---

### Configuration

1. **Base URL** : `http://localhost:3001`
2. **Headers par défaut** : `Content-Type: application/json`

---

### Tests pas à pas

#### Test 1 : Health Check

- **Méthode** : GET
- **URL** : `http://localhost:3001/health`
- **Headers** : Aucun
- **Body** : Aucun

**Vérifiez** : Réponse 200 avec `{"status":"ok"}`

---

#### Test 2 : Inscription

- **Méthode** : POST
- **URL** : `http://localhost:3001/api/auth/register`
- **Headers** : 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON) :
  ```json
  {
    "email": "test@example.com",
    "password": "test123456",
    "name": "Parent Test"
  }
  ```

**Vérifiez** : 
- Réponse 201
- Copiez le `accessToken` de la réponse

---

#### Test 3 : Connexion

- **Méthode** : POST
- **URL** : `http://localhost:3001/api/auth/login`
- **Headers** : 
  ```
  Content-Type: application/json
  ```
- **Body** (JSON) :
  ```json
  {
    "email": "test@example.com",
    "password": "test123456"
  }
  ```

**Vérifiez** : Réponse 200 avec tokens

---

#### Test 4 : Profil utilisateur

- **Méthode** : GET
- **URL** : `http://localhost:3001/api/auth/me`
- **Headers** : 
  ```
  Authorization: Bearer {votre_accessToken}
  ```

**Vérifiez** : Réponse 200 avec les infos utilisateur

---

#### Test 5 : Créer un enfant

- **Méthode** : POST
- **URL** : `http://localhost:3001/api/auth/child`
- **Headers** : 
  ```
  Authorization: Bearer {votre_accessToken}
  Content-Type: application/json
  ```
- **Body** (JSON) :
  ```json
  {
    "pseudo": "Emma",
    "age": 5,
    "level": "maternelle_gs"
  }
  ```

**Vérifiez** : 
- Réponse 201
- Copiez l'`id` de l'enfant

---

#### Test 6 : Dashboard (endpoint protégé)

- **Méthode** : GET
- **URL** : `http://localhost:3001/api/dashboard/{childId}`
- **Headers** : 
  ```
  Authorization: Bearer {votre_accessToken}
  ```

**Vérifiez** : Réponse 200 avec les données du dashboard

---

## 📱 Méthode 3 : Test avec Script Node.js

Créez un fichier `test-auth.js` dans `backend/` :

```javascript
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  try {
    // 1. Health check
    console.log('1. Health check...');
    const health = await fetch(`${BASE_URL}/health`);
    console.log('✅ Health:', await health.json());

    // 2. Inscription
    console.log('\n2. Inscription...');
    const register = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123456',
        name: 'Parent Test'
      })
    });
    const registerData = await register.json();
    console.log('✅ Inscription:', registerData);
    
    const accessToken = registerData.accessToken;
    if (!accessToken) {
      console.error('❌ Pas de token reçu');
      return;
    }

    // 3. Profil utilisateur
    console.log('\n3. Profil utilisateur...');
    const me = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Profil:', await me.json());

    // 4. Créer un enfant
    console.log('\n4. Créer un enfant...');
    const child = await fetch(`${BASE_URL}/api/auth/child`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pseudo: 'Emma',
        age: 5,
        level: 'maternelle_gs'
      })
    });
    const childData = await child.json();
    console.log('✅ Enfant créé:', childData);

    const childId = childData.id;

    // 5. Dashboard
    console.log('\n5. Dashboard...');
    const dashboard = await fetch(`${BASE_URL}/api/dashboard/${childId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log('✅ Dashboard:', await dashboard.json());

    console.log('\n✅ Tous les tests réussis !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAuth();
```

**Exécuter :**
```bash
cd backend
node test-auth.js
```

---

## 🐛 Dépannage

### Erreur "Cannot connect"
- Vérifiez que le serveur est démarré : `npm run dev` dans `backend/`
- Vérifiez que le port 3001 est libre

### Erreur "Supabase non configuré"
- Vérifiez que le fichier `.env` existe dans `backend/`
- Vérifiez que les clés Supabase sont correctes

### Erreur "Token invalide"
- Vérifiez que le token est bien dans le header `Authorization: Bearer {token}`
- Vérifiez qu'il n'y a pas d'espaces supplémentaires

### Erreur "Enfant non trouvé"
- Vérifiez que l'ID de l'enfant est correct
- Vérifiez que l'enfant appartient à l'utilisateur connecté

### Erreur "Table does not exist"
- Exécutez le script SQL dans Supabase
- Vérifiez que toutes les tables sont créées

---

## ✅ Checklist de Test

- [ ] Health check fonctionne
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Profil utilisateur récupéré
- [ ] Création d'enfant fonctionne
- [ ] Liste des enfants fonctionne
- [ ] Dashboard accessible avec token
- [ ] Déconnexion fonctionne
- [ ] Endpoints protégés rejettent les requêtes sans token

---

*Guide de test créé par Agent 4 - MiniGénie Backend*
