import pool from '../config/db.js'

/**
 * Recuperer la liste de tous les livres d'une bibliothèques
 * par défaut la listge ne contient que les livres disponibles
 * mais on peut aussi afficher tous les livres
 * @param {*} bibliothequeId identifiant de la bibliothèque dans la BD
 * @param {*} tousLesLivres, valeur booléen , si true on affiche tous les livres
 *                          sinon uniquement les livres disponibles (par défaut)
 */
export const recupererTousLesLivresBibliotheque =  async(bibliothequeId, tousLesLivres = false) =>{

    let sqlQuery;
    const params = [bibliothequeId];

    if (tousLesLivres) {
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
