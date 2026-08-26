import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/objets (Tous les objets + Filtres optionnels)
router.get('/', async (req, res) => {
  try {
    const { statut, categorie_id, libelle } = req.query;

    let query = 'SELECT * FROM objet WHERE 1=1';
    const values = [];

    if (statut) {
      values.push(statut);
      query += ` AND statut = $${values.length}`;
    }

    if (categorie_id) {
      values.push(categorie_id);
      query += ` AND categorie_id = $${values.length}`;
    }

    if (libelle) {
      values.push(`%${libelle}%`);
      query += ` AND libelle ILIKE $${values.length}`;
    }

    query += ' ORDER BY id ASC;';

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur GET /api/objets :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/objets/:id (Un seul objet par son ID)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM objet WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Objet non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Erreur GET /api/objets/${id} :`, err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;