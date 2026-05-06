/**
 * Ajouter un prêt
 * @param {*} livreId
 * @param {*} emprunteur
 * @param {*} dateRetourPrevue
 */
export const ajouterUnPret = async (livreId, emprunteur,  dateRetourPrevue) => {
    //Mistral AI 2026-05-06: Formater la date pour une valeur acceptable dans ma bd
    const dateDebut= new Date().toISOString().split('T')[0];

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
 * Modifier le statut d'un prêt (ex: retourner un livre)
 * @param {*} id
 * @param {*} terminer
 */
export const modifierStatutPret = async (id, terminer) => {

    let dateRetour = terminer ? new Date().toISOString().split('T')[0] : null;
    
    const sqlQuery = `
        UPDATE prets
        SET statut = $1, date_retour = $2
        WHERE id = $3
        RETURNING livre_id, emprunteur, date_debut, date_retour_prevue, date_retour
    `;
    const params = [terminer, dateRetour, id];

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
 * @param {*} id
 */
export const supprimerPret = async (id) => {
    const sqlQuery = `
        DELETE FROM prets
        WHERE id = $1
        RETURNING id, livre_id, emprunteur
    `;
    const params = [id];

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