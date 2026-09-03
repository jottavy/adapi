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
            next(err);
        }
});

// --------------------------------------------------
// POST
// --------------------------------------------------

// Enregistre un dépôt — personne_id, date_depot, type
depotsRouter.post("/", async (req, res) => {
    const { personne_id, date_depot, type } = req.body;

    if (!personne_id || !type) {
        return res.status(400).json({ error: "L'identifiant de la personne et le type sont obligatoires." });
    }

    try {
        const result = await pool.query(`
            INSERT INTO depot (personne_id, date_depot, type)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [personne_id, date_depot || new Date(), type]);

        res.status(201).json(result.rows[0]);
  
    } catch (err) {
        next(err);
    }
});

// Ajoute un objet au dépôt — libelle, poids_kg, etat_arrivee, categorie_id
depotsRouter.post("/:id/objets", async (req, res) => {
    const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;
    const depot_id = req.params.id;
    const etats = ["bon_etat", "a_reparer", "hors_service"];

    if (!libelle || !categorie_id) {
        return res.status(400).json({ error: "Le libellé et la categorie sont obligatoires." });
    }

    if (etat_arrivee && !etats.includes(etat_arrivee)) {
        return res.status(400).json({ error: `L'état d'arrivée doit être l'un des suivants : ${etats.join(', ')}` });
    }

    try {
        const result = await pool.query(`
            INSERT INTO objet (libelle, poids_kg, etat_arrivee, categorie_id, depot_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `, [libelle, poids_kg || null, etat_arrivee || null, categorie_id, depot_id]);

        res.status(201).json(result.rows[0]);
  
    } catch (err) {
        next(err);
    }
});

export default depotsRouter;