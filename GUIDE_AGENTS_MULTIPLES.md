# 🔄 Guide : Utiliser Plusieurs Agents dans Cursor

## 📊 Situation Actuelle

Vous avez atteint **94% du contexte utilisé** dans cette session. Cela signifie que :
- Le modèle a presque atteint sa limite de mémoire contextuelle
- Il peut commencer à "oublier" les premières informations
- Il est temps de passer à un nouvel agent

---

## 🚀 Comment Utiliser un Nouvel Agent

### Méthode 1 : Nouvelle Conversation (Recommandé)

1. **Ouvrir une nouvelle conversation** dans Cursor
   - Cliquez sur le bouton "New Chat" ou "Nouvelle Conversation"
   - Ou utilisez le raccourci clavier (généralement `Ctrl+L` ou `Cmd+L`)

2. **Référencer les fichiers importants**
   - Dans la nouvelle conversation, mentionnez les fichiers clés :
     - `DEVELOPMENT_PROMPT.md` - Le prompt principal
     - `docs/README.md` - La documentation complète
     - `specs/README.md` - Les spécifications
     - `rules/README.md` - Les règles de développement

3. **Donner le contexte rapidement**
   ```
   "Je continue le développement de MiniGénie. 
   Voici les fichiers de référence :
   - DEVELOPMENT_PROMPT.md
   - docs/README.md
   - specs/README.md
   - rules/README.md
   
   L'application est déjà bien avancée avec 8 modules pédagogiques.
   Je veux maintenant [votre nouvelle demande]."
   ```

### Méthode 2 : Utiliser les Fichiers de Documentation

Les fichiers suivants contiennent TOUT le contexte nécessaire :

1. **`DEVELOPMENT_PROMPT.md`** - Prompt complet de développement
2. **`docs/README.md`** - Documentation technique complète
3. **`specs/README.md`** - Spécifications détaillées
4. **`rules/README.md`** - Règles de développement
5. **`FONCTIONNALITES_COMPLETEES.md`** - État actuel des fonctionnalités
6. **`TEST_REPORT.md`** - Rapport de tests

**Le nouvel agent peut lire ces fichiers pour comprendre le projet !**

### Méthode 3 : Résumé pour le Nouvel Agent

Créez un message comme celui-ci dans la nouvelle conversation :

```
Je développe MiniGénie, une app éducative pour enfants 3-8 ans.

📚 Documentation complète dans :
- DEVELOPMENT_PROMPT.md (prompt principal)
- docs/README.md (architecture, stack technique)
- specs/README.md (spécifications, user stories)
- rules/README.md (règles de code)

✅ Déjà fait :
- 8 modules pédagogiques (Alphabet, Chiffres, Calcul, etc.)
- Système de badges
- Dashboard parent
- Gestion des sessions
- Progression automatique

🎯 Prochaine étape : [votre demande]
```

---

## 💡 Astuces

### 1. Utiliser les @ Mentions
Dans Cursor, vous pouvez mentionner des fichiers avec `@` :
```
@DEVELOPMENT_PROMPT.md Peux-tu lire ce fichier et continuer le développement ?
```

### 2. Ouvrir les Fichiers Clés
Avant de commencer une nouvelle conversation, ouvrez ces fichiers dans l'éditeur :
- Le nouvel agent pourra les voir dans le contexte

### 3. Créer un Fichier de Contexte
Créez `CONTEXTE_POUR_AGENT.md` avec un résumé :
```markdown
# Contexte MiniGénie pour Nouvel Agent

## État Actuel
- 8 modules pédagogiques fonctionnels
- Système de badges implémenté
- Dashboard parent avec données réelles
- Gestion des sessions et progression

## Stack Technique
- Expo SDK 54
- React Native 0.76.5
- Next.js 14
- TypeScript

## Structure
/apps/mobile - Application Expo
/apps/web - Dashboard Next.js
/packages/shared - Code partagé
```

---

## 🔄 Transition Fluide

### Pour Continuer le Développement

1. **Nouvelle conversation**
2. **Message initial** :
   ```
   Je continue MiniGénie. Lis @DEVELOPMENT_PROMPT.md et @FONCTIONNALITES_COMPLETEES.md
   pour comprendre l'état actuel. Ensuite, [votre demande].
   ```

3. **Le nouvel agent** :
   - Lira les fichiers mentionnés
   - Comprendra le contexte
   - Pourra continuer le développement

---

## ✅ Avantages

- **Contexte frais** : Nouvel agent = nouvelle mémoire
- **Performance** : Plus rapide avec moins de contexte
- **Clarté** : Focus sur la tâche actuelle
- **Documentation** : Les fichiers servent de référence permanente

---

**Astuce** : Gardez toujours les fichiers de documentation ouverts dans l'éditeur pour que le nouvel agent puisse les voir !

