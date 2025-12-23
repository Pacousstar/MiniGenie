# 🔍 Vérification du Serveur - MiniGénie

## ❌ Problème

```
ERR_CONNECTION_REFUSED sur http://localhost:19000
```

**Cause** : Le serveur Expo n'est pas démarré ou n'écoute pas sur le port attendu.

---

## ✅ Solutions

### 1. Vérifier les Ports

Vérifier quels ports sont utilisés :
```powershell
Get-NetTCPConnection -LocalPort 8081,8082,8083,19000 | Select-Object LocalPort, State
```

### 2. Relancer le Serveur

```bash
cd apps/mobile
npx expo start --web
```

Le serveur devrait démarrer et afficher l'URL à utiliser.

### 3. Vérifier les Logs

Regarder dans le terminal où Expo est lancé pour voir :
- Sur quel port le serveur écoute
- S'il y a des erreurs
- L'URL complète à utiliser

---

## 📝 Notes

- Expo peut utiliser différents ports (8081, 8082, 8083, etc.)
- Le port peut changer si un autre processus l'utilise
- Vérifier toujours les logs du terminal pour connaître le bon port

---

*Vérification du serveur en cours*

