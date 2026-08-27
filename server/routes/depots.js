import { Router } from 'express';
import pool from '../db.js';

const depotRouter = Router();

depotsRouter.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
            depot.*,
            personne.nom AS personne_nom,
            personne.prenom AS personne_prenom
            objet.libelle AS liste_objet
            FROM objet
            JOIN categorie ON objet.categorie_id = categorie.id
            JOIN depot ON objet.depot_id = depot.id
            JOIN personne ON depot.personne_id = personne.id
            WHERE depot.id = $1;
          `, [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }

        res.json(result.rows[0]);

        } catch (err) {
            console.error("Erreur GET api/objets/:id : ", err.message)
            res.status(500).json({ error: err.message })
        }
});


export default depotRouter;