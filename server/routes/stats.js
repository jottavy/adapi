import { Router } from 'express';
import pool from '../db.js';

const statsRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Trois indicateurs : objets par statut, poids total reçu, poids détourné de la déchetterie
statsRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
          SELECT
            statut,
            COUNT(*)::integer AS nombre_objets,
            COALESCE(SUM(poids_kg), 0)::float AS poids_total_kg
          FROM objet
          GROUP BY statut;
        `);
        // IA pour cette requête 

        res.json(result.rows);

    } catch (err) {
        console.error("Erreur GET /api/stats :", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default statsRouter;