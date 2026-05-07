import pool from '../config/db.js'

/**
 * Recuperer la liste de tous les livres d'une bibliothèques
 * par défaut la liste ne contient que les livres disponibles
 * mais on peut aussi afficher tous les livres
 * @param {*} bibliothequeId identifiant de la bibliothèque dans la BD
 * @param {*} afficherTous booléen pour choisir le filtre
 *                          si true : afficher tous les livres
 *                          sinon : afficher uniquement les livres disponibles
 */
export const recupererTousLesLivresBibliotheque =  async(bibliothequeId, afficherTous) =>{

    let sqlQuery;
    const params = [bibliothequeId];

    if (afficherTous) {
        sqlQuery = `SELECT titre, auteur, isbn FROM livres WHERE bibliotheque_id = $1 ORDER BY titre `;
    } else {
        sqlQuery = `SELECT titre, auteur, isbn FROM livres WHERE bibliotheque_id = $1 AND disponible = true ORDER BY titre `;
    }
    
    try{
        const resultat = await pool.query(sqlQuery, params);
        return resultat.rows;
    } catch(erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}


/**
 * Récuperer les détails sur un livre (Son titre, son auteur, son ISBN, 
 * son statut, sa description et la liste de ses prêts ainsi qu’un
 *  indicateur détaillant si le prêt est en cours ou terminé.)
 * @param {*} livreId, identifiant du livre dans la base de donnée
 * @param {*} bibliothequeId, identifiant de la bibliotheque a qui le livre appartient
 */
export const recupererDetailDeLivre =  async(livreId, bibliothequeId) =>{

    const sqlLivre = `
        SELECT id, titre, auteur, isbn, disponible, description, date_ajout, date_modification
        FROM livres WHERE id = $1 AND bibliotheque_id = $2
    `

    const paramsLivre = [livreId, bibliothequeId]

    const sqlPrets = `
        SELECT id, emprunteur, date_debut, date_retour_prevue, date_retour,
            CASE WHEN statut IS false THEN 'en cours' ELSE 'terminé' END AS statut
        FROM prets
        WHERE livre_id = $1
        ORDER BY date_debut
    `

    const paramsPrets = [livreId]
    
    try{
        const livreResult = await pool.query(sqlLivre, paramsLivre)
        const pretsResult = await pool.query(sqlPrets, paramsPrets)
        return {
            livre: livreResult.rows[0],
            prets: pretsResult.rows
        }
    } catch(erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}

/**
 * Ajouter un livre a une bibliotèque 
 * @param {*} bibliothequeId, id de la bibliotheque
 * @param {*} titre, titre du livre
 * @param {*} auteur, auteur du livre
 * @param {*} isbn, isbn du livre
 * @param {*} disponible. disponibilité du livre, par défaut true
 * @param {*} description, description du livre optionnelle
 */
export const ajouterUnLivre = async(bibliothequeId, titre, auteur, isbn, disponible, description) =>{
    const sqlQuery = `
        INSERT INTO livres (bibliotheque_id, titre, auteur, isbn,  disponible, description)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `
    const params = [bibliothequeId, titre, auteur, isbn, disponible, description]

    try{
        const resultat = await pool.query(sqlQuery, params)
        return resultat.rows[0]
    }catch (erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}

/**
 * Modification des information d'un livre
 * @param {*} id 
 * @param {*} bibliothequeId
 * @param {*} titre 
 * @param {*} auteur 
 * @param {*} isbn 
 * @param {*} description 
 */
export const modifierLivre = async(id, bibliothequeId, titre, auteur, isbn, description) =>{
    //Mistral AI 2026-05-06: Formater la date pour une valeur acceptable dans ma bd
    const dateModification= new Date().toISOString().split('T')[0];

    const updateQuery = `
        UPDATE livres
        SET titre = $1, auteur = $2, isbn = $3, description = $4, date_modification = $5
        WHERE id = $6 AND bibliotheque_id = $7
        RETURNING titre, auteur, isbn, disponible, description, date_modification`
    
    const updateValues = [titre, auteur, isbn, description, dateModification, id, bibliothequeId] 

    try{
        const resultat = await pool.query(updateQuery, updateValues)
        return resultat.rows[0]
    }catch (erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}

/**
 * Modification le statut d'un livre
 * @param {*} id 
 * @param {*} bibliothequeId 
 * @param {*} disponible 
 */
export const modifierStatut = async(id, bibliothequeId, disponible) =>{
    //Mistral AI 2026-05-06: Formater la date pour une valeur acceptable dans ma bd
    const dateModification= new Date().toISOString().split('T')[0];

    const updateQuery = `
        UPDATE livres
        SET disponible = $1, date_modification = $2
        WHERE id = $3 AND bibliotheque_id = $4
        RETURNING titre, isbn, disponible, date_modification`
    
    const updateValues = [ disponible, dateModification, id, bibliothequeId] 

    try{
        const resultat = await pool.query(updateQuery, updateValues)
        return resultat.rows[0]
    }catch (erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}

/**
 * Supprimer un livre de la base de donnée
 * @param {*} id, identifiant du livre 
 * @param {*} bibliothequeId, identifiant de la bibliotheque 
 */
export const supprimerLivre = async(id, bibliothequeId) =>{
    const deleteQuery = `
        DELETE FROM livres
        WHERE id = $1 AND bibliotheque_id = $2
        RETURNING titre, isbn`
    
    const deleteValues = [ id, bibliothequeId] 

    try{
        const resultat = await pool.query(deleteQuery, deleteValues)
        return resultat.rows[0]
    }catch (erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}

/**
 * Vérifier si un livre est disponible
 * @param {*} livreId
 * @returns 
 */
export const verifierDisponibiliteLivre = async (livreId, bibliothequeId) => {
    const sqlQuery = `
        SELECT id, disponible
        FROM livres
        WHERE id = $1 AND bibliotheque_id = $2
    `;
    const params = [livreId, bibliothequeId];

    try {
        const resultat = await pool.query(sqlQuery, params);
        return resultat.rows[0] || null;
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
};

