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
