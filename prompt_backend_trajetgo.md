# Prompt — Backend TrajetGo (NestJS, Clean Architecture)

> À coller tel quel dans Antigravity, Cursor, ou tout agent de codage IA.
> Le prompt est conçu pour être traité **étape par étape** : l'agent doit s'arrêter après chaque étape et attendre validation avant de continuer.

---

## Contexte du projet

Tu vas construire le backend d'une application mobile de covoiturage nommée **TrajetGo**, destinée au Togo (Lomé et ses environs). Les utilisateurs peuvent être passagers, conducteurs, ou les deux. Le frontend est déjà en développement en Flutter (Clean Architecture, BLoC/Cubit) et te fera des appels REST (et WebSocket pour la messagerie/notifications temps réel).

## Stack technique imposée

- **Framework** : NestJS (TypeScript)
- **Base de données** : PostgreSQL
- **ORM** : Prisma (ou TypeORM si tu préfères — précise ton choix avant de commencer et reste cohérent sur tout le projet)
- **Auth** : JWT (access token + refresh token), Passport.js
- **Validation** : class-validator / class-transformer sur tous les DTO
- **Documentation API** : Swagger (`@nestjs/swagger`), généré automatiquement, à jour à chaque étape
- **Paiement** : intégration future Mobile Money (Flooz, T-Money) — prévoir une interface abstraite dès le départ, sans implémenter le vrai appel externe tant que ce n'est pas demandé
- **Temps réel** : WebSocket (`@nestjs/websockets`) pour la messagerie et les notifications, uniquement à l'étape dédiée
- **Tests** : au minimum des tests unitaires sur la couche use-cases/services à chaque étape (Jest)

## Architecture imposée — Clean Architecture

Structure en couches, un module par domaine métier. Respecte cette organisation pour **chaque module** :

```
src/
  modules/
    <nom-du-module>/
      domain/
        entities/          # entités métier pures (pas de dépendance NestJS/ORM)
        repositories/       # interfaces (ports) des repositories
        value-objects/      # si pertinent
      application/
        use-cases/           # un fichier par cas d'usage (CreateTrajetUseCase, etc.)
        dto/                 # DTO d'entrée/sortie avec validation
      infrastructure/
        persistence/         # implémentation concrète des repositories (Prisma/TypeORM)
        mappers/              # mapping entité domaine <-> modèle DB
      presentation/
        controllers/          # controllers REST
        gateways/              # WebSocket gateways (si applicable)
  common/
    guards/
    decorators/
    filters/                  # exception filters globaux
    interceptors/
  config/
```

**Règles strictes :**
- La couche `domain` ne dépend de rien d'externe (ni Nest, ni Prisma, ni Express).
- La couche `application` orchestre le domaine, ne connaît que les interfaces de repository (pas l'implémentation).
- La couche `infrastructure` implémente les interfaces définies dans `domain/repositories`.
- La couche `presentation` ne contient aucune logique métier — elle appelle des use-cases et retourne des DTO de sortie.
- Injection de dépendances via les tokens NestJS (`@Inject`), jamais d'instanciation directe entre couches.

## Règles de fonctionnement pour toi (l'agent)

1. **Ne fais qu'une étape à la fois**, dans l'ordre du plan ci-dessous. Ne commence pas l'étape suivante sans validation explicite de ma part.
2. À la fin de chaque étape, donne-moi un **résumé court** : fichiers créés, endpoints exposés, commandes à lancer (migration, seed, etc.), et comment tester (exemples de requêtes curl/Postman ou route Swagger).
3. Si une étape est trop grosse, propose de la découper en sous-étapes plutôt que de tout faire d'un coup.
4. Utilise des migrations versionnées (pas de `synchronize: true` en dur) dès l'étape 0.
5. Toute variable sensible (secrets JWT, credentials DB) passe par `.env` + `@nestjs/config`, jamais en dur dans le code.
6. Écris du code en anglais (noms de variables, fonctions) mais les messages d'erreur retournés à l'API peuvent être en français (l'app cible des utilisateurs francophones).
7. Si tu identifies une ambiguïté sur une règle métier, pose-moi la question au lieu de supposer.

## Exigences de sécurité — obligatoires à chaque étape

Tu dois appliquer ces règles en continu, pas seulement à la fin. Chaque nouvelle route, entité ou champ que tu crées doit être passé au filtre de cette liste avant d'être considéré comme terminé.

- **Validation stricte des entrées** : chaque DTO utilise `class-validator` avec des règles explicites (types, longueurs min/max, formats — email, téléphone, UUID). Active `whitelist: true` et `forbidNonWhitelisted: true` sur le `ValidationPipe` global pour rejeter tout champ non attendu.
- **Autorisation systématique** : aucune route ne doit se fier uniquement à l'authentification (JWT valide) — vérifie aussi que l'utilisateur a le droit d'agir sur la ressource précise (ex : un passager ne peut annuler que SA réservation, pas celle d'un autre). Implémente ces vérifications au niveau des use-cases, pas seulement dans les guards de rôle.
- **Mots de passe et secrets** : hash avec bcrypt (coût ≥ 12) ou argon2, jamais de mot de passe en clair en base ni dans les logs. Aucun secret (JWT, DB, clés API) en dur dans le code — uniquement via `.env`, exclu du dépôt Git (`.gitignore`).
- **Injection SQL** : uniquement des requêtes paramétrées (le comportement par défaut de Prisma/TypeORM) — jamais de concaténation de chaînes dans une requête, y compris pour `$queryRaw`.
- **Rate limiting** : applique `@nestjs/throttler` sur les routes sensibles en priorité (login, inscription, vérification OTP, mot de passe oublié) pour limiter le brute-force.
- **JWT** : access token à durée de vie courte (15-30 min), refresh token stocké de façon sécurisée (hashé en base, révocable), rotation du refresh token à chaque utilisation.
- **Upload de fichiers** (photos véhicule, pièces d'identité, carte grise) : valider le type MIME réel (pas juste l'extension), limiter la taille, scanner ou au minimum isoler ces fichiers dans un stockage dédié (pas de chemin construit à partir d'une entrée utilisateur brute — risque de path traversal).
- **CORS** : configuration explicite (origines autorisées listées), pas de wildcard `*` en production.
- **En-têtes de sécurité HTTP** : utilise `helmet` dès l'étape 0.
- **Messages d'erreur** : ne jamais exposer de détails internes (stack trace, requête SQL, nom de colonne) dans les réponses API — l'exception filter global doit renvoyer des messages génériques en production, avec le détail réservé aux logs serveur.
- **Logs** : journalise les tentatives d'authentification échouées, les changements de rôle/statut sensible, et les accès admin — sans jamais logger de mot de passe, token, ou donnée bancaire en clair.
- **Données sensibles au repos** : les numéros de pièce d'identité et documents (carte grise, assurance) doivent être accessibles uniquement via des URLs signées/temporaires, pas des liens publics permanents.
- **Idempotence sur les paiements** : chaque transaction doit avoir une clé d'idempotence pour éviter les doubles débits en cas de retry réseau.
- **Dépendances** : signale-moi toute dépendance ajoutée avec des vulnérabilités connues (`npm audit`) avant de continuer.

Si une étape du plan touche à l'un de ces points sans que je l'aie mentionné explicitement, applique la règle quand même — ce ne sont pas des options.

---

## Plan d'implémentation — étape par étape

### Étape 0 — Setup du projet
- Initialisation NestJS, structure Clean Architecture ci-dessus (squelette vide, un module `core` ou `shared`)
- Configuration PostgreSQL + ORM choisi, connexion via `.env`
- Configuration Swagger de base
- Exception filter global (format d'erreur uniforme : `{ statusCode, message, error }`)
- Docker Compose pour PostgreSQL en local (optionnel mais apprécié)

### Étape 1 — Authentification & Utilisateurs (module `auth` + `users`)
Entité **UTILISATEUR** :
- id (UUID), nom, prenom, email (unique), telephone (unique), mot_de_passe_hash, date_naissance, photo_profil_url, type_utilisateur (ENUM: passager / conducteur / les_deux / admin), statut_verification (ENUM: non_verifie / en_attente / verifie), piece_identite_url, note_moyenne (decimal), nombre_trajets (int), langue_preferee, statut_compte (ENUM: actif / suspendu / supprime), date_creation, date_derniere_connexion

Fonctionnalités :
- Inscription (email/téléphone + mot de passe, hash bcrypt/argon2)
- Connexion (retourne access token + refresh token)
- Vérification OTP (structure de la table/flow, sans branchement SMS réel pour l'instant — juste une génération/validation de code stockée en base ou Redis)
- Endpoint `GET /me` protégé par JWT
- Guard de rôles (`RolesGuard`) réutilisable pour toutes les futures routes (`@Roles('conducteur')`, `@Roles('admin')`, etc.)
- Refresh token endpoint
- Déconnexion (invalidation du refresh token)

### Étape 2 — Véhicules (module `vehicules`)
Entité **VEHICULE** liée à UTILISATEUR : marque, modele, couleur, immatriculation (unique), nombre_places, annee, carte_grise_url, assurance_url, date_expiration_assurance, statut_verification (ENUM), photos (array d'URL)
- CRUD complet, accessible seulement au propriétaire (guard) et à l'admin
- Endpoint admin pour valider/rejeter un véhicule (`statut_verification`)

### Étape 3 — Trajets (module `trajets`)
Entités **TRAJET** et **POINT_ARRET** (voir doc MCD pour les champs complets : ville_depart, ville_arrivee, coordonnées GPS, date/heure, places_disponibles, prix_par_place, statut, type_reservation, recurrence, preferences JSON, etc.)
- Création de trajet (conducteur vérifié uniquement — vérifier `VEHICULE.statut_verification == verifie`)
- Recherche de trajets (filtres : ville départ/arrivée, date, places disponibles)
- Détail d'un trajet
- Annulation par le conducteur
- Gestion des points d'arrêt (CRUD imbriqué)

### Étape 4 — Réservations (module `reservations`)
Entité **RESERVATION** : trajet_id, passager_id, nombre_places_reservees, statut (ENUM), point_montee, point_descente, montant_total, etc.
- Création de réservation (vérifier les places disponibles, décrémenter atomiquement)
- Acceptation/refus par le conducteur (si `type_reservation == avec_approbation`)
- Annulation par le passager (avec règles de délai à définir ensemble)
- Historique des réservations (à venir / passées) pour un utilisateur

### Étape 5 — Paiement & Portefeuille (module `paiements`)
Entités **PAIEMENT** et **PORTEFEUILLE**
- Création d'une transaction liée à une réservation
- Interface abstraite `PaymentProviderPort` (implémentations Mobile Money branchées plus tard)
- Gestion du solde du portefeuille interne (crédit/débit)
- Historique des transactions

### Étape 6 — Avis & Notation (module `avis`)
Entité **AVIS** : auteur_id, cible_id, trajet_id, note (1-5), commentaire
- Un avis par (auteur, trajet) maximum
- Recalcul automatique de `note_moyenne` sur UTILISATEUR après chaque nouvel avis

### Étape 7 — Messagerie (module `messagerie`)
Entités **CONVERSATION** et **MESSAGE**
- REST pour l'historique (liste des conversations, messages d'une conversation)
- WebSocket Gateway pour l'envoi/réception en temps réel
- Marquage lu/non lu

### Étape 8 — Notifications (module `notifications`)
Entité **NOTIFICATION**
- Création de notifications internes (déclenchées par les autres modules : nouvelle réservation, message, etc.)
- Endpoint de liste + marquage comme lue
- Prévoir un port abstrait pour un futur envoi push (FCM), sans l'implémenter tout de suite

### Étape 9 — Signalement & Sécurité (module `signalements`)
Entités **SIGNALEMENT** et **ALERTE_SOS**
- Création de signalement (utilisateur, trajet)
- Déclenchement d'une alerte SOS (position GPS, trajet concerné) — notification immédiate à prévoir (juste la structure pour l'instant)
- Endpoints admin pour traiter les signalements (changement de statut)

### Étape 10 — Parrainage (module `parrainage`)
Entité **PARRAINAGE**
- Génération de code de parrainage unique par utilisateur
- Validation du parrainage à la première réservation/trajet du filleul
- Crédit de récompense au portefeuille

### Étape 11 — Mode Entreprise (module `entreprises`, optionnel)
Entité **ENTREPRISE**
- Rattachement d'utilisateurs à une entreprise via domaine email
- Filtrage des trajets internes à l'entreprise

### Étape 12 — Administration (module `admin`)
- Dashboard API : statistiques globales (nombre d'utilisateurs, trajets actifs, revenus, signalements ouverts)
- Endpoints de modération (suspendre un compte, valider un véhicule, traiter un signalement)

---

## Comment démarrer

Commence uniquement par l'**Étape 0**. Confirme ton choix d'ORM (Prisma recommandé pour la vitesse de développement avec NestJS), propose la structure de dossiers exacte, puis attends ma validation avant de passer à l'authentification.
