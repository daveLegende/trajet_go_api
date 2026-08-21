# Documentation & Collection Postman — TrajetGo API

Ce dossier contient la collection et l'environnement Postman officiels pour tester l'API TrajetGo.

---

## 📁 Fichiers disponibles

* **[`TrajetGo_API.postman_collection.json`](./TrajetGo_API.postman_collection.json)** : Collection complète contenant les requêtes organisées par étapes/modules.
* **[`TrajetGo_Local.postman_environment.json`](./TrajetGo_Local.postman_environment.json)** : Variables d'environnement pour le développement local.

---

## 🚀 Comment importer dans Postman

1. Ouvrez **Postman**.
2. Cliquez sur le bouton **Import** (en haut à gauche).
3. Glissez-déposez les deux fichiers `.json` ou sélectionnez-les depuis ce dossier `docs/postman/`.
4. Sélectionnez l'environnement **TrajetGo - Local Environment** en haut à droite.

---

## ⚡ Fonctionnalités incluses dans la Collection

* **Automatisation JWT** : Lorsque vous lancez une requête d'**Inscription** ou de **Connexion**, un script Postman capture automatiquement l'`access_token` et le `refresh_token` pour les injecter dans toutes les routes protégées (`GET /users/me`, etc.).
* **Test de la rotation des tokens** : La requête `POST /auth/refresh` met à jour automatiquement les variables de session.
