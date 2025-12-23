# 🤖 Service IA pour Assena

## 📋 Vue d'ensemble

Le service IA permet à Assena de générer des réponses contextuelles et pédagogiques adaptées à chaque enfant, basées sur :
- Le profil de l'enfant (âge, niveau, progression)
- Le contexte d'apprentissage actuel
- Les messages de l'enfant

## 🎯 Fonctionnalités

### 1. Chat avec Assena
- Réponses contextuelles basées sur le profil de l'enfant
- Langage adapté à l'âge
- Encouragements personnalisés

### 2. Messages d'encouragement
- Génération automatique de messages motivants
- Basés sur la progression de l'enfant

### 3. Explications pédagogiques
- Explications adaptées à l'âge et au niveau
- Support pour différents sujets

## 🔧 Configuration

### Variables d'environnement

Ajoutez dans votre fichier `.env` :

```env
# DeepSeek (Recommandé - moins cher)
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_MODEL=deepseek-chat

# OU OpenAI (Alternative)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo

# Configuration optionnelle
AI_MAX_TOKENS=150
AI_TEMPERATURE=0.7
```

### Mode Fallback

Si aucune clé API n'est configurée, le service utilise un **mode fallback** avec des réponses pré-définies. Cela permet à l'application de fonctionner même sans IA.

## 📡 Endpoints API

### POST `/api/ai/chat`
Chat avec Assena

**Requête :**
```json
{
  "childId": "uuid-enfant",
  "message": "Bonjour Assena !"
}
```

**Réponse :**
```json
{
  "response": "Bonjour ! Je suis Assena, ravie de te voir ! Prêt(e) à apprendre quelque chose de nouveau aujourd'hui ? 🌟"
}
```

### POST `/api/ai/encouragement`
Générer un message d'encouragement

**Requête :**
```json
{
  "childId": "uuid-enfant"
}
```

**Réponse :**
```json
{
  "message": "Bravo Emma ! Tu progresses vraiment bien ! Continue comme ça ! 🌟"
}
```

### POST `/api/ai/explain`
Générer une explication pédagogique

**Requête :**
```json
{
  "childId": "uuid-enfant",
  "topic": "Pourquoi 2+2=4 ?"
}
```

**Réponse :**
```json
{
  "explanation": "C'est une excellente question ! Quand on a 2 pommes et qu'on en ajoute 2 autres, on a 4 pommes au total. C'est comme compter : 1, 2, puis 3, 4 ! 🍎"
}
```

### GET `/api/ai/config`
Vérifier la configuration IA

**Réponse :**
```json
{
  "configured": true,
  "message": "Service IA configuré et opérationnel"
}
```

## 🎨 Caractéristiques d'Assena

Le prompt système d'Assena inclut :
- **Bienveillance** : Toujours positif et encourageant
- **Adaptation** : Langage adapté à l'âge de l'enfant
- **Pédagogie** : Explications simples et claires
- **Contexte** : Utilise les informations de progression

## 💰 Coûts et Limites

### DeepSeek
- **Prix** : ~$0.14 par million de tokens (entrée), ~$0.28 (sortie)
- **Limite** : Selon votre plan
- **Recommandé** : Oui (moins cher)

### OpenAI
- **Prix** : ~$0.50-2.00 par million de tokens selon le modèle
- **Limite** : Selon votre plan
- **Recommandé** : Alternative si DeepSeek indisponible

### Optimisation
- `maxTokens: 150` : Limite la longueur des réponses (économise les coûts)
- `temperature: 0.7` : Équilibre créativité/cohérence
- Mode fallback : Pas de coût si IA non configurée

## 🔒 Sécurité

- Authentification requise pour tous les endpoints
- Rate limiting appliqué
- Validation des entrées
- Pas de stockage des conversations (respect de la vie privée)

## 📝 Exemple d'utilisation

```typescript
// Dans le frontend (mobile/web)
const response = await fetch('http://localhost:3001/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    childId: 'uuid-enfant',
    message: 'Bonjour Assena !',
  }),
});

const data = await response.json();
console.log(data.response); // Réponse d'Assena
```

## 🐛 Dépannage

### "Service IA non configuré"
- Vérifiez que les variables d'environnement sont définies
- Redémarrez le serveur après modification du `.env`
- Le mode fallback sera utilisé automatiquement

### Erreurs API
- Vérifiez que votre clé API est valide
- Vérifiez votre quota/limite
- Consultez les logs du serveur pour plus de détails

---

*Service créé par Agent 4*
