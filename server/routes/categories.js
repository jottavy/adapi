import { Router } from 'express';
import pool from '../db.js';

const categoriesRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Toutes les catégories — id et libelle
categoriesRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM categorie ORDER BY id ASC;
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

// --------------------------------------------------
// POST
// --------------------------------------------------

categoriesRouter.post("/", async (req, res) => {
    const { libelle } = req.body;

    if (!libelle) {
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
        next(err);
    }
});

export default categoriesRouter;