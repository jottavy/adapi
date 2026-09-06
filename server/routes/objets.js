import { Router } from 'express';
import pool from '../db.js';

const objetsRouter = Router();

// --------------------------------------------------
// GET
// --------------------------------------------------

// La liste des objets, avec le libellé de leur catégorie
// objetsRouter.get("/", async (req, res) => {
//     try {
//         const result = await pool.query(`
//           SELECT
//           objet.*, categorie.libelle
//           FROM objet
//           JOIN categorie ON objet.categorie_id = categorie.id
//           `);
//         res.json(result.rows)
//           } catch (err) {
//         console.error("Erreur GET api/objets : ", err.message)
//         res.status(500).json({ error: err.message })
//     }
// });

// La même liste, filtrée — les deux filtres sont optionnels et cumulables
objetsRouter.get("/", async (req, res, next) => {
    try {
        const result = await pool.query(`
          SELECT
          objet.*, categorie.libelle
          FROM objet
          JOIN categorie ON objet.categorie_id = categorie.id
          WHERE objet.statut = COALESCE($1::statut_objet, objet.statut)
          AND objet.categorie_id = COALESCE($2::integer, objet.categorie_id)
          ORDER BY objet.id ASC
          `, [req.query.statut || null, req.query.categorie_id || null]
        );

        res.json(result.rows);

        } catch (err) {
            next(err);
        }
});

// Un objet, sa catégorie, son dépôt et le nom de sa donatrice
objetsRouter.get("/:id", async (req, res, next) => {
    try {
        const result = await pool.query(`
          SELECT
          objet.id,
          objet.libelle,
          categorie.libelle AS categorie_libelle,
          depot.type AS depot_type,
          personne.nom AS personne_nom,
          personne.prenom AS personne_prenom
          FROM objet
          JOIN categorie ON objet.categorie_id = categorie.id
          JOIN depot ON objet.depot_id = depot.id
          JOIN personne ON depot.personne_id = personne.id
          WHERE objet.id = $1;
          `, [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Objet non trouvé" });
        }

        res.json(result.rows[0]);

        } catch (err) {
            next(err);
        }
});

// --------------------------------------------------
// PATCH
// --------------------------------------------------

// Fait évoluer le statut d’un objet — statut, prix?
objetsRouter.patch("/:id/statut", async (req, res, next) => {
    const { statut, prix } = req.body;
    const id = req.params.id;
    const statuts = ["arrive", "en_reparation", "en_rayon", "vendu", "recycle"];

    if (!statut) {
        return res.status(400).json({ error: "Le statut est obligatoire." });
    }

    if (!statuts.includes(statut)) {
        return res.status(400).json({ error: `Le statut doit être l'un des suivants : ${statuts.join(', ')}` });
    }

    try {
        const result = await pool.query(`
            UPDATE objet
            SET statut = $2::statut_objet, prix = COALESCE($3, prix)
            WHERE id = $1
            RETURNING *;
          `, [id, statut, prix ?? null] // Prix est optionnel, on garde l'ancien si pas de nouvelle valeur
        );

        if (!result.rows[0]) {
            return res.status(404).json({ error: "Objet non trouvé." });
        }

        console.log(`Objet id: ${id} modifié avec succès`);
        res.json(result.rows[0]);

        } catch (err) {
            next(err);
        }
});


export default objetsRouter;