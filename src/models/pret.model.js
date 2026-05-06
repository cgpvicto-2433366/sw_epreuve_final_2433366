import pool from '../config/db.js'

/**
 * Ajouter un prêt
 * @param {*} livreId
 * @param {*} emprunteur
 * @param {*} dateRetourPrevue
 */
export const ajouterUnPret = async (livreId, emprunteur, dateRetourPrevue) => {
    //Mistral AI 2026-05-06: Formater la date pour une valeur acceptable dans ma bd
    const dateDebut = new Date().toISOString().split('T')[0];

    const sqlQuery = `
        INSERT INTO prets (livre_id, emprunteur, date_debut, date_retour_prevue)
        VALUES ($1, $2, $3, $4)
        RETURNING id, livre_id, emprunteur, date_debut, date_retour_prevue
    `;
    const params = [livreId, emprunteur, dateDebut, dateRetourPrevue];

    try {
        const resultat = await pool.query(sqlQuery, params);
        return resultat.rows[0];
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
};


/**
 * Modifier les informations d'un prêt
 * Vérifie que le prêt appartient à un livre de la bibliothèque authentifiée.
 * @param {*} id
 * @param {*} bibliothequeId
 * @param {*} emprunteur
 * @param {*} dateRetourPrevue
 */
export const modifierPret = async (id, bibliothequeId, emprunteur, dateRetourPrevue) => {
    const sqlQuery = `
        UPDATE prets
        SET emprunteur = $1, date_retour_prevue = $2
        WHERE id = $3
        AND livre_id IN (SELECT id FROM livres WHERE bibliotheque_id = $4)
        RETURNING id, livre_id, emprunteur, date_debut, date_retour_prevue, statut
    `;
    const params = [emprunteur, dateRetourPrevue, id, bibliothequeId];

    try {
        const resultat = await pool.query(sqlQuery, params);
        if (resultat.rows.length === 0) {
            throw new Error('Aucun prêt ne correspond à ces informations.');
        }
        return resultat.rows[0];
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
};


/**
 * Modifier le statut d'un prêt (ex: retourner un livre)
 * Vérifie que le prêt appartient à un livre de la bibliothèque authentifiée.
 * @param {*} id
 * @param {*} bibliothequeId
 * @param {*} terminer
 */
export const modifierStatutPret = async (id, bibliothequeId, terminer) => {
    let dateRetour = terminer ? new Date().toISOString().split('T')[0] : null;

    // https://sql.sh/cours/sous-requete#google_vignette sous requete
    const sqlQuery = `
        UPDATE prets
        SET statut = $1, date_retour = $2
        WHERE id = $3
        AND livre_id IN (SELECT id FROM livres WHERE bibliotheque_id = $4)
        RETURNING livre_id, emprunteur, date_debut, date_retour_prevue, date_retour
    `;
    const params = [terminer, dateRetour, id, bibliothequeId];

    try {
        const resultat = await pool.query(sqlQuery, params);
        if (resultat.rows.length === 0) {
            throw new Error('Aucun prêt ne correspond à ces informations.');
        }
        return resultat.rows[0];
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
};

/**
 * Supprimer un prêt
 * Vérifie que le prêt appartient à un livre de la bibliothèque authentifiée.
 * @param {*} id
 * @param {*} bibliothequeId
 */
export const supprimerPret = async (id, bibliothequeId) => {
    const sqlQuery = `
        DELETE FROM prets
        WHERE id = $1
        AND livre_id IN (SELECT id FROM livres WHERE bibliotheque_id = $2)
        RETURNING id, livre_id, emprunteur
    `;
    const params = [id, bibliothequeId];

    try {
        const resultat = await pool.query(sqlQuery, params);
        if (resultat.rows.length === 0) {
            throw new Error('Aucun prêt ne correspond à ces informations.');
        }
        return resultat.rows[0];
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
};
