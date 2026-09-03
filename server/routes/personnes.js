import { Router } from 'express';
import pool from '../db.js';

const personnesRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Toutes les personnes, noms et prénoms, téléphone et s'ils sont adhérents ou non
personnesRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT personne.nom, personne.prenom, personne.telephone, personne.adherente
            FROM personne
            ORDER BY id ASC;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur GET api/categories : ", err.message)
        res.status(500).json({ error: err.message })
    }
});


// --------------------------------------------------
// POST
// --------------------------------------------------

// Crée une donatrice — nom, prenom, telephone?, adherente?
personnesRouter.post("/", async (req, res) => {
    const { nom, prenom, telephone, adherente } = req.body;

    if (!nom || !prenom) {
        return res.status(400).json({ error: "Le nom est le prénom sont obligatoires." });
    }

    try {
        const result = await pool.query(`
            INSERT INTO personne (nom, prenom, telephone, adherente)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [nom, prenom, telephone || null, adherente ?? false ]);

        res.status(201).json(result.rows[0]);
  
    } catch (err) {
        console.error("Erreur POST /api/personnes :", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default personnesRouter;