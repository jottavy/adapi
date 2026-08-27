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
categoriesRouter.post("/", async (req, res) => {
    const { nom, prenom, telephone, adherente } = req.body;

    if () {
        return res.status(400).json({ error: "Le libellé n'existe pas." });
    }

    try {
        const result = await pool.query(`
            INSERT INTO categorie (libelle)
            VALUES ($1)
            RETURNING *;
        `, [libelle]);

        res.status(201).json(result.rows[0]);
  
    } catch (err) {
        console.error("Erreur POST /api/categories :", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default personnesRouter;