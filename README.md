# Adapi — API La Remise

API REST de gestion pour **La Remise**, un magasin de seconde main et centre de réutilisation communautaire. Gère les objets, dépôts, personnes, catégories, bénévoles, ateliers, réparations, ventes et statistiques.

## Stack technique

- Node.js (ES Modules)
- Express 5
- PostgreSQL 16 (via Docker)
- pg (node-postgres)
- Swagger UI
- Nodemon

## Installation

git clone <url-du-depot>
cd adapi
npm install

Configurer les variables d'environnement :

```bash
cp .env.example .env
```

Modifier `.env` avec vos accès PostgreSQL :

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=database
```

## Lancement

### 1. Démarrer la base de données

```bash
cd db
docker compose up -d
cd ..
```

### 2. Initialiser la base

Appliquer les migrations et le jeu de données de test :

```bash
psql -h localhost -p 5432 -U username -d database -f db/migration_up.sql
psql -h localhost -p 5432 -U username -d database -f db/seed.sql
```

### 3. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`.

## Base de données

### Tables

| Table                 | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `personne`            | Donatrices et acheteuses                                    |
| `benevole`            | Bénévoles du magasin                                        |
| `competence`          | Compétences des bénévoles                                   |
| `categorie`           | Catégories d'objets                                         |
| `vente`               | Ventes réalisées                                            |
| `depot`               | Dépôts d'objets (boutique ou domicile)                      |
| `atelier`             | Ateliers de réparation/formation                            |
| `benevole_competence` | Association bénévole ↔ compétence                           |
| `objet`               | Objets déposés, en réparation, en rayon, vendus ou recyclés |
| `inscription`         | Inscriptions aux ateliers                                   |
| `reparation`          | Réparations effectuées sur les objets                       |

### Énumérations

- `type_depot` : `boutique`, `domicile`
- `etat_objet` : `bon_etat`, `a_reparer`, `hors_service`
- `statut_objet` : `arrive`, `en_reparation`, `en_rayon`, `vendu`, `recycle`
- `resultat_reparation` : `reussie`, `echouee`
- `mode_paiement` : `especes`, `carte`, `cheque`

## Endpoints API

### Catégories

| Méthode | Chemin            | Description                 |
| ------- | ----------------- | --------------------------- |
| `GET`   | `/api/categories` | Liste toutes les catégories |

### Objets

| Méthode | Chemin                   | Description                                                      |
| ------- | ------------------------ | ---------------------------------------------------------------- |
| `GET`   | `/api/objets`            | Liste les objets (filtres optionnels : `statut`, `categorie_id`) |
| `GET`   | `/api/objets/:id`        | Détails d'un objet (catégorie, dépôt, donatrice)                 |
| `PATCH` | `/api/objets/:id/statut` | Met à jour le statut et le prix d'un objet                       |

### Personnes

| Méthode | Chemin           | Description                                                              |
| ------- | ---------------- | ------------------------------------------------------------------------ |
| `GET`   | `/api/personnes` | Liste toutes les personnes                                               |
| `POST`  | `/api/personnes` | Crée une personne (champs : `nom`, `prenom`, `telephone?`, `adherente?`) |

### Dépôts

| Méthode | Chemin                   | Description                                                         |
| ------- | ------------------------ | ------------------------------------------------------------------- |
| `GET`   | `/api/depots/:id`        | Détails d'un dépôt avec donatrice et objets                         |
| `POST`  | `/api/depots`            | Enregistre un dépôt (champs : `personne_id`, `type`, `date_depot?`) |
| `POST`  | `/api/depots/:id/objets` | Ajoute un objet à un dépôt                                          |

### Statistiques

| Méthode | Chemin       | Description                                                     |
| ------- | ------------ | --------------------------------------------------------------- |
| `GET`   | `/api/stats` | Répartition des objets par statut, poids total reçu et détourné |

## Documentation Swagger

Disponible sur `http://localhost:3000/api-docs` dès que le serveur est démarré.

## Structure du projet

```
adapi/
├── db/
│   ├── docker-compose.yml    # Conteneur PostgreSQL 16
│   ├── migration_up.sql      # Création des tables
│   ├── migration_down.sql    # Suppression des tables
│   ├── seed.sql              # Jeu de données de test
│   └── queries.sql           # Requêtes SQL diverses
├── server/
│   ├── index.js              # Point d'entrée Express
│   ├── db.js                 # Connexion PostgreSQL (pool)
│   ├── swagger.json          # Documentation OpenAPI 3.0
│   └── routes/
│       ├── objets.js         # Routes /api/objets
│       ├── categories.js     # Routes /api/categories
│       ├── depots.js         # Routes /api/depots
│       ├── personnes.js      # Routes /api/personnes
│       └── stats.js          # Routes /api/stats
├── conception/
│   └── MLD.md                # Modèle Logique de Données
├── .env.example              # Variables d'environnement (modèle)
├── package.json
└── README.md
```
