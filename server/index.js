// Importation du framework Express pour créer le serveur HTTP et gérer les routes
import express from "express";

// Importation des routeurs modulaires depuis le dossier routes/
// Chaque routeur regroupe les endpoints d'un domaine spécifique
import objetsRouter from './routes/objets.js';
import categoriesRouter from './routes/categories.js';
import depotsRouter from './routes/depots.js';
import personnesRouter from './routes/personnes.js';
import statsRouter from './routes/stats.js';

// Initialisation de l'application Express (création de l'instance du serveur)
const app = express();

// Définition du port d'écoute : prend la valeur du .env ou 3000 par défaut
const port = process.env.PORT || 3000;

// Middleware global Express : analyse les corps de requêtes (req.body) au format JSON
// Indispensable pour récupérer les données envoyées via les méthodes POST ou PUT
app.use(express.json());

// Association (montage) des routeurs sur leurs préfixes d'URL respectifs
// Exemple : toutes les routes dans objetsRouter répondront après '/api/objets'
app.use('/api/objets', objetsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/depots', depotsRouter);
app.use('/api/personnes', personnesRouter);
app.use('/api/stats', statsRouter);

// Démarrage du serveur web : il reste à l'écoute des requêtes HTTP sur le port spécifié
app.listen(port, () => {
  console.log(`🚀 Serveur Express démarré sur http://localhost:${port}`);
});