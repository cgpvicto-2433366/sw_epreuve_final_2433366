import pool from '../config/db.js'

/**
 * Recuperer la liste de tous les livres d'une bibliothèques
 * par défaut la liste ne contient que les livres disponibles
 * mais on peut aussi afficher tous les livres
 * @param {*} bibliothequeId identifiant de la bibliothèque dans la BD
 * @param {*} disponible booléen pour choisir le filtre
 *                          si true : afficher tous les livres
 *                          sinon : afficher uniquement les livres disponibles
 */
export const recupererTousLesLivresBibliotheque =  async(bibliothequeId, disponible) =>{

    let sqlQuery;
    const params = [bibliothequeId];

    if (disponible) {
        sqlQuery = `SELECT * FROM livres WHERE bibliotheque_id = $1`;
    } else {
        sqlQuery = `SELECT * FROM livres WHERE bibliotheque_id = $1 AND disponible = true`;
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
 */
export const recupererDetailDeLivre =  async(livreId) =>{

    const sqlLivre = `
        SELECT id, titre, auteur, isbn, disponible, description 
        FROM livres WHERE id = $1
    `
    const sqlPrets = `
        SELECT id, emprunteur, date_debut, date_retour
            CASE WHEN date_retour IS NULL THEN 'en cours' ELSE 'terminé' END AS statut
        FROM prets
        WHERE livre_id = $1
    `

    const params = [livreId];
    
    try{
        const livreResult = await pool.query(sqlLivre, [livreId])
        const pretsResult = await pool.query(sqlPrets, [livreId])
        return {
            livre: livreResult.rows[0],
            prets: pretsResult.rows
        }
    } catch(erreur){
        console.error(`Erreur BD : ${erreur.message}`);
        throw erreur;
    }
}
