import { Router } from 'express';
import pool from '../db.js';

const categoriesRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Toutes les catégories — id et libelle
categoriesRouter.get("/", async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT * FROM categorie ORDER BY id ASC;
        `);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});


export default categoriesRouter;