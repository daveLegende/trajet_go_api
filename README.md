# 🚗 TrajetGo API (Backend)

Bienvenue sur le dépôt du backend de **TrajetGo**, la plateforme de covoiturage moderne pour le Togo 🇹🇬.

Ce projet est construit avec **NestJS**, **TypeScript**, **PostgreSQL** (via Neon) et **Prisma ORM**. Il suit rigoureusement les principes de la **Clean Architecture** et du **Domain-Driven Design (DDD)**.

---

## 🛠️ Stack Technique

- **Framework** : [NestJS](https://nestjs.com/) (v11)
- **Langage** : TypeScript
- **Base de données** : PostgreSQL hébergé sur Neon
- **ORM** : [Prisma](https://www.prisma.io/) avec le connecteur `@prisma/adapter-pg`
- **Authentification** : JWT (Access & Refresh tokens) / OTP
- **WebSockets** : Socket.IO (Messagerie en temps réel)
- **Notifications Push** : Firebase Cloud Messaging (FCM) via le SDK `firebase-admin` (v12)

---

## 🏗️ Architecture (Clean Architecture)

Le projet est découpé par **modules métier** dans le dossier `src/modules/`.
Chaque module respecte strictement l'isolation des couches :

```
src/modules/<nom-du-module>/
├── domain/         # Cœur du métier : Entités, Enums, Interfaces des Repositories
├── application/    # Cas d'usage (Use Cases), DTOs
├── infrastructure/ # Implémentations techniques (PrismaRepositories, Adaptateurs externes)
└── presentation/   # Contrôleurs HTTP, WebSockets (Gateways)
```

**Règles strictes :**
- Le `domain/` ne dépend d'aucune autre couche ni de bibliothèques techniques externes.
- Les dépendances sont injectées via des tokens (ex: `@Inject(USER_REPOSITORY)`).
- Les contrôleurs appellent uniquement les Use Cases.

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js v20+
- Un fichier `.env` configuré avec votre `DATABASE_URL` PostgreSQL.
- Le fichier `firebase-adminsdk.json` à la racine (pour les notifications FCM).

### 2. Installation
```bash
npm install
```

### 3. Base de données & Prisma
L'API utilise un client Prisma généré dans un dossier custom (`generated/prisma`).

Générer le client :
```bash
npm run prisma:generate
```

Appliquer les migrations :
```bash
npm run prisma:migrate
```

Peupler la base de données avec des données de test (1 Admin, 20 Utilisateurs, Trajets, Réservations, etc.) :
```bash
npm run seed
```

### 4. Démarrer le serveur
```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod
```

L'API sera disponible sur `http://localhost:3000/api/v1` (par défaut).

---

## 📚 Documentation API (Swagger)

Une fois le serveur démarré, la documentation interactive Swagger est accessible à :
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

Vous y trouverez la liste exhaustive des endpoints, des DTOs, et pourrez tester les requêtes en ajoutant votre token JWT (bouton `Authorize`).

---

## 📮 Collection Postman

Une collection Postman complète est disponible dans le dossier :
`docs/postman/TrajetGo_Postman_Collection.json`

Elle contient tous les scénarios de test organisés par module, avec la gestion automatique du token JWT via la variable de collection `jwtToken`.

---

## 🧑‍💻 Utilisateurs générés par le Seed

Si vous avez exécuté `npm run seed`, voici quelques comptes utilisables (le mot de passe est toujours `password123`) :

- **Admin** : `admin@trajetgo.com`
- **Passager** : `passager1@example.com`
- **Conducteur** : `conducteur1@example.com`
- **Mixte** : `mixte1@example.com`
