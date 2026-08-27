import { Router } from 'express';
import pool from '../db.js';

const depotsRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// Un dépôt, sa donatrice, et la liste des objets qu’il contient
depotsRouter.get("/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
            depot.*,
            personne.nom AS personne_nom,
            personne.prenom AS personne_prenom,
            json_agg(objet.libelle) AS liste_objet
            FROM depot
            JOIN personne ON depot.personne_id = personne.id
            JOIN objet ON objet.depot_id = depot.id
            WHERE depot.id = $1
            GROUP BY depot.id, personne.id;
          `, [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Dépôt non trouvé" });
        }

        res.json(result.rows); // besoin de préciser qu'on veut seulement result.rows[0] ?

        } catch (err) {
            console.error("Erreur GET api/depots/:id : ", err.message)
            res.status(500).json({ error: err.message })
        }
});


export default depotsRouter;