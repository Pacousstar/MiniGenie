# 🔑 Guide : Obtenir les Clés API IA pour Assena

## 📋 Vue d'ensemble

Pour activer les réponses intelligentes d'Assena, vous devez configurer une clé API. Deux options sont disponibles :

1. **DeepSeek** (Recommandé) - Moins cher, très performant
2. **OpenAI** (Alternative) - Plus cher mais très populaire

---

## 🎯 Option 1 : DeepSeek (Recommandé)

### Pourquoi DeepSeek ?
- ✅ **Moins cher** : ~$0.14 par million de tokens (vs ~$0.50-2.00 pour OpenAI)
- ✅ **Performant** : Qualité similaire à GPT-3.5
- ✅ **Rapide** : Réponses rapides
- ✅ **Gratuit** : Crédits gratuits au démarrage

### Étapes pour obtenir la clé

#### 1. Créer un compte DeepSeek

1. Allez sur [https://platform.deepseek.com](https://platform.deepseek.com)
2. Cliquez sur **"Sign Up"** ou **"Sign In"**
3. Créez un compte avec votre email ou connectez-vous avec GitHub/Google

#### 2. Accéder à la section API

1. Une fois connecté, allez dans **"API Keys"** ou **"Settings"** > **"API Keys"**
2. Cliquez sur **"Create API Key"** ou **"New Key"**

#### 3. Créer et copier la clé

1. Donnez un nom à votre clé (ex: "MiniGenie Production")
2. Cliquez sur **"Create"**
3. **⚠️ IMPORTANT** : Copiez la clé immédiatement (elle ne sera plus visible après)
4. La clé ressemble à : `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 4. Configurer dans le backend

Ajoutez dans `backend/.env` :

```env
DEEPSEEK_API_KEY=sk-votre-cle-ici
DEEPSEEK_MODEL=deepseek-chat
```

#### 5. Redémarrer le serveur

```powershell
# Arrêter (Ctrl+C)
npm run dev
```

Vous devriez voir :
```
✅ Service IA DeepSeek configuré
```

---

## 🎯 Option 2 : OpenAI (Alternative)

### Pourquoi OpenAI ?
- ✅ **Très populaire** : Standard de l'industrie
- ✅ **Documentation complète** : Beaucoup de ressources
- ⚠️ **Plus cher** : ~$0.50-2.00 par million de tokens selon le modèle

### Étapes pour obtenir la clé

#### 1. Créer un compte OpenAI

1. Allez sur [https://platform.openai.com](https://platform.openai.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Créez un compte avec votre email

#### 2. Ajouter un mode de paiement

⚠️ **Important** : OpenAI nécessite un mode de paiement même pour les crédits gratuits.

1. Allez dans **"Settings"** > **"Billing"**
2. Ajoutez une carte de crédit
3. Configurez vos limites de dépenses (recommandé : $5-10/mois pour commencer)

#### 3. Créer une clé API

1. Allez dans **"API Keys"** (menu de gauche)
2. Cliquez sur **"Create new secret key"**
3. Donnez un nom (ex: "MiniGenie")
4. Cliquez sur **"Create secret key"**
5. **⚠️ IMPORTANT** : Copiez la clé immédiatement
6. La clé ressemble à : `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 4. Configurer dans le backend

Ajoutez dans `backend/.env` :

```env
OPENAI_API_KEY=sk-proj-votre-cle-ici
OPENAI_MODEL=gpt-3.5-turbo
```

#### 5. Redémarrer le serveur

```powershell
# Arrêter (Ctrl+C)
npm run dev
```

Vous devriez voir :
```
✅ Service IA OpenAI configuré
```

---

## 💰 Comparaison des Coûts

### DeepSeek
- **Entrée** : ~$0.14 par million de tokens
- **Sortie** : ~$0.28 par million de tokens
- **Exemple** : 1000 conversations/mois (~150 tokens chacune) = **~$0.05/mois**

### OpenAI (GPT-3.5-turbo)
- **Entrée** : ~$0.50 par million de tokens
- **Sortie** : ~$1.50 par million de tokens
- **Exemple** : 1000 conversations/mois (~150 tokens chacune) = **~$0.30/mois**

### OpenAI (GPT-4)
- **Entrée** : ~$10-30 par million de tokens
- **Sortie** : ~$30-60 par million de tokens
- **Exemple** : 1000 conversations/mois = **~$6-15/mois**

**💡 Recommandation** : Commencez avec DeepSeek pour économiser, passez à OpenAI si nécessaire.

---

## 🔧 Configuration Complète

### Fichier `.env` complet

```env
# ... autres variables ...

# DeepSeek (Recommandé)
DEEPSEEK_API_KEY=sk-votre-cle-deepseek
DEEPSEEK_MODEL=deepseek-chat

# OU OpenAI (Alternative)
# OPENAI_API_KEY=sk-proj-votre-cle-openai
# OPENAI_MODEL=gpt-3.5-turbo

# Configuration IA (optionnel)
AI_MAX_TOKENS=150
AI_TEMPERATURE=0.7
```

### Paramètres IA

- **`AI_MAX_TOKENS`** : Longueur maximale des réponses (150 = court, 300 = moyen)
- **`AI_TEMPERATURE`** : Créativité (0.0 = prévisible, 1.0 = créatif, 0.7 = équilibré)

---

## ✅ Vérifier la Configuration

### Test rapide

```powershell
# Vérifier que le service est configuré
Invoke-WebRequest -Uri "http://localhost:3001/api/ai/config" -Headers @{"Authorization" = "Bearer VOTRE_TOKEN"} | Select-Object -ExpandProperty Content
```

**Résultat attendu :**
```json
{
  "configured": true,
  "message": "Service IA configuré et opérationnel"
}
```

### Test complet

```powershell
# Tester un chat avec Assena
$body = @{
    childId = "ID_ENFANT"
    message = "Bonjour Assena !"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/ai/chat" -Method POST -Body $body -ContentType "application/json" -Headers @{"Authorization" = "Bearer VOTRE_TOKEN"} | Select-Object -ExpandProperty Content
```

---

## 🐛 Dépannage

### "Service IA non configuré"
- Vérifiez que la clé API est dans le fichier `.env`
- Vérifiez qu'il n'y a pas d'espaces avant/après la clé
- Redémarrez le serveur après modification du `.env`

### Erreurs API (401, 403)
- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits disponibles
- Pour OpenAI : Vérifiez que le mode de paiement est configuré

### Erreurs API (429 - Rate Limit)
- Vous avez dépassé la limite de requêtes
- Attendez quelques minutes ou augmentez votre plan

### Mode Fallback Activé
- Si aucune clé n'est configurée, le mode fallback utilise des réponses pré-définies
- C'est normal et fonctionnel, mais moins personnalisé

---

## 📝 Notes Importantes

1. **Sécurité** : Ne partagez jamais vos clés API publiquement
2. **Coûts** : Surveillez votre utilisation pour éviter les surprises
3. **Limites** : Configurez des limites de dépenses dans les deux plateformes
4. **Fallback** : L'application fonctionne sans IA (mode fallback)

---

## 🔗 Liens Utiles

- **DeepSeek** : [https://platform.deepseek.com](https://platform.deepseek.com)
- **OpenAI** : [https://platform.openai.com](https://platform.openai.com)
- **Documentation DeepSeek** : [https://api-docs.deepseek.com](https://api-docs.deepseek.com)
- **Documentation OpenAI** : [https://platform.openai.com/docs](https://platform.openai.com/docs)

---

*Guide créé par Agent 4*
