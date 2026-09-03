import { Router } from 'express';
import pool from '../db.js';

const statsRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Trois indicateurs : objets par statut, poids total reçu, poids détourné de la déchetterie
// IA pour cette route
statsRouter.get("/", async (req, res, next) => {
    try {
        // 1. Répartition par statut
        const statsParStatut = await pool.query(`
            SELECT statut, COUNT(*)::integer AS nombre_objets
            FROM objet
            GROUP BY statut;
        `);

        // 2. Totaux de poids global et détourné
        const totauxPoids = await pool.query(`
            SELECT
              COALESCE(SUM(poids_kg), 0)::float AS poids_total_recu_kg,
              COALESCE(
                SUM(poids_kg) FILTER (WHERE statut IN ('vendu', 'en_rayon', 'recycle')), 
                0
              )::float AS poids_detourne_kg
            FROM objet;
        `);

        // Combinaison des résultats dans la réponse JSON
        res.json({
          objets_par_statut: statsParStatut.rows,
          poids_total_recu_kg: totauxPoids.rows[0].poids_total_recu_kg,
          poids_detourne_kg: totauxPoids.rows[0].poids_detourne_kg
        });

    } catch (err) {
        next(err);
    }
});

export default statsRouter;