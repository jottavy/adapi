## TABLES DU MLD

personne (
id INT [PK],
nom VARCHAR(100) NOT NULL,
prenom VARCHAR(100) NOT NULL,
telephone VARCHAR(20),
adherente BOOLEAN NOT NULL DEFAULT false
);

benevole (
id INT [PK],
nom VARCHAR(100) NOT NULL,
prenom VARCHAR(100) NOT NULL,
telephone VARCHAR(20),
date_arrivee DATE NOT NULL
);

competence (
id INT [PK],
libelle VARCHAR(100) NOT NULL UNIQUE
);

categorie (
id INT [PK],
libelle VARCHAR(100) NOT NULL UNIQUE
);

vente (
id INT [PK],
date_vente DATE NOT NULL,
mode_paiement mode_paiement NOT NULL
);

depot (
id INT [PK],
date_depot DATE NOT NULL,
type type_depot NOT NULL,
personne_id INT NOT NULL [FK ➔ personne.id]
);

atelier (
id INT [PK],
intitule VARCHAR(255) NOT NULL,
date_debut DATE NOT NULL,
duree NUMERIC(4, 1) NOT NULL,
places INT NOT NULL,
benevole_id INT NOT NULL [FK ➔ benevole.id]
);

benevole_competence (
benevole_id INT [PK, FK ➔ benevole.id ON DELETE CASCADE],
competence_id INT [PK, FK ➔ competence.id ON DELETE CASCADE]
);

objet (
id INT [PK],
libelle VARCHAR(255) NOT NULL,
poids_kg NUMERIC(6, 2) NOT NULL,
etat_arrivee etat_objet NOT NULL,
statut statut_objet NOT NULL DEFAULT 'arrive',
prix NUMERIC(8, 2),
date_mise_rayon DATE,
categorie_id INT NOT NULL [FK ➔ categorie.id],
depot_id INT NOT NULL [FK ➔ depot.id],
vente_id INT [FK ➔ vente.id] (NULLABLE),
prix_paye NUMERIC(8, 2)
);

inscription (
personne_id INT [PK, FK ➔ personne.id ON DELETE CASCADE],
atelier_id INT [PK, FK ➔ atelier.id ON DELETE CASCADE],
date_inscription DATE NOT NULL,
presente BOOLEAN NOT NULL DEFAULT false
);

reparation (
id INT [PK],
date_repa DATE NOT NULL,
duree_h NUMERIC(4, 1) NOT NULL,
resultat resultat_reparation NOT NULL,
objet_id INT NOT NULL [FK ➔ objet.id],
benevole_id INT NOT NULL [FK ➔ benevole.id]
);
