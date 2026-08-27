import { Router } from 'express';
import pool from '../db.js';

const categoriesRouter = Router();

// Toutes les catégories — id et libelle
categoriesRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM categorie ORDER BY id ASC;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur GET api/categories : ", err.message)
        res.status(500).json({ error: err.message })
    }
});

// categoriesRouter.post("/", async (req, res) => {
//   const { libelle } = req.body;

//   const data = await pool.query(
//     "INSERT INTO categorie (libelle) VALUES ($1) RETURNING *",
//     [libelle]
//   );

// });

export default categoriesRouter;