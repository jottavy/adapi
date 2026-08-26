// Importation du package 'pg' qui permet à Node.js de communiquer avec PostgreSQL
import pg from 'pg';

// Importation de 'dotenv' pour charger les variables cachées dans le fichier .env
import dotenv from 'dotenv';

// Exécution de dotenv : lit le fichier .env à la racine et injecte ses clés/valeurs dans process.env
dotenv.config();

// Extraction de la classe 'Pool' depuis l'objet global 'pg'
const { Pool } = pg;

// Instanciation du bassin de connexions (Pool)
// Au lieu d'ouvrir et fermer une connexion à chaque requête,
// le Pool maintient plusieurs connexions ouvertes et réutilisables en arrière-plan.
const pool = new Pool({
  host: process.env.DB_HOST,         // Adresse du serveur BDD (ex: localhost)
  port: process.env.DB_PORT,         // Port réseau (ex: 5433 défini dans Docker)
  user: process.env.DB_USER,         // Nom d'utilisateur BDD (ex: laremise)
  password: process.env.DB_PASSWORD, // Mot de passe BDD (ex: laremise)
  database: process.env.DB_NAME,     // Nom de la base de données (ex: laremise_db)
});

// Écouteur d'événement : se déclenche à chaque fois qu'une nouvelle connexion est établie par le pool
pool.on('connect', () => {
  console.log('⚡️ Connecté à la base de données PostgreSQL (laremise_db)');
});

// Écouteur d'événement : capture les erreurs inattendues sur les connexions inactives du pool
pool.on('error', (err) => {
  console.error('❌ Erreur inattendue du pool PostgreSQL :', err);
});

// Exportation de l'instance du pool pour pouvoir l'utiliser dans tes fichiers de routes (ex: pool.query(...))
export default pool;