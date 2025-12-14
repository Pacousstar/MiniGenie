# 🚀 Guide de Redémarrage Expo - MiniGénie

## ⚠️ Si l'application ne se charge pas sur Expo Go

### Étape 1 : Arrêter Tous les Processus

1. **Dans tous les terminaux**, appuyez sur `Ctrl+C` pour arrêter Expo
2. **Fermez tous les terminaux** qui lancent Expo
3. **Vérifiez** qu'aucun processus n'utilise le port 8081

### Étape 2 : Nettoyer le Cache

```bash
cd apps/mobile

# Nettoyer le cache Expo et redémarrer
npx expo start --clear
```

### Étape 3 : Si ça ne fonctionne pas, Nettoyer Complètement

```bash
cd apps/mobile

# Supprimer node_modules
rm -rf node_modules

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
npm install

# Redémarrer avec cache nettoyé
npx expo start --clear
```

### Étape 4 : Utiliser le Mode Tunnel

Si le réseau local ne fonctionne pas :

```bash
cd apps/mobile
npx expo start --clear --tunnel
```

Le mode tunnel utilise les serveurs Expo pour créer une connexion sécurisée.

---

## 📱 Sur le Téléphone

1. **Fermer complètement Expo Go** (swipe vers le haut)
2. **Rouvrir Expo Go**
3. **Supprimer MiniGénie** de la liste des projets (si présent)
4. **Scanner le nouveau QR code**

---

## ✅ Vérification

Après avoir lancé `npx expo start --clear`, vous devriez voir :

```
› Metro waiting on exp://127.0.0.1:8081
› Scan the QR code above with Expo Go
```

Si vous voyez ce message, le serveur fonctionne correctement.

---

*Guide créé par Agent 2*
