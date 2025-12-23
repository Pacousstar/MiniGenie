# ⚡ Démarrage Rapide - Test d'Authentification

## 🚀 En 3 étapes

### 1. Démarrer le serveur

```bash
cd backend
npm install  # Si pas encore fait
npm run dev
```

Vous devriez voir :
```
🚀 Serveur MiniGénie démarré sur le port 3001
```

---

### 2. Tester avec le script automatique

**Dans un nouveau terminal :**

```bash
cd backend
npm run test:auth
```

Le script va automatiquement :
- ✅ Vérifier que le serveur fonctionne
- ✅ Créer un compte parent
- ✅ Se connecter
- ✅ Créer un profil enfant
- ✅ Tester le dashboard

---

### 3. Tester manuellement avec curl

**Inscription :**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123456\",\"name\":\"Parent Test\"}"
```

**Copiez le `accessToken` de la réponse, puis :**

**Créer un enfant :**
```bash
curl -X POST http://localhost:3001/api/auth/child \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json" \
  -d "{\"pseudo\":\"Emma\",\"age\":5,\"level\":\"maternelle_gs\"}"
```

**Copiez l'`id` de l'enfant, puis :**

**Dashboard :**
```bash
curl -X GET http://localhost:3001/api/dashboard/ID_ENFANT_ICI \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 📖 Guide Complet

Pour plus de détails, consultez `TEST_AUTHENTICATION.md`

---

*Guide rapide créé par Agent 4*
