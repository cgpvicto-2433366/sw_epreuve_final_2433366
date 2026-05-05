import pool from '../config/db.js'
import crypto from 'crypto'

/**
 * Ajouter un utilisateur (responsable de bibliothèque)
 * @param {*} nomBibliotheque nom de la bibliothèque
 * @param {*} email adresse courriel
 * @param {*} motDePasse mot de passe
 * @returns 
 */
export const ajouterUtilisateur = async (nomBibliotheque, email, motDePasse) => {
    const cleAPI = crypto.randomUUID() 
    
    //https://dev.to/satyam_gupta_0d1ff2152dcc/master-postgresql-with-nodejs-a-complete-guide-to-building-robust-backends-5epd
    // Format de la requete d'insertion
    const sqlQuery = `
        INSERT INTO bibliotheques (nom, courriel, cle_api, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nom, courriel, cle_api
    `
    
    try {
        const resultat = await pool.query(sqlQuery, [nomBibliotheque, email, cleAPI, motDePasse])
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}

/**
 * Récupérer ou générer une clé API d'un utilisateur
 * @param {*} email adresse courriel
 * @param {*} motDePasse mot de passe
 * @param {*} nouveau booléen, pour savoir si il faut
 *                    générer une nouvelle clé
 * @returns 
 */
export const recupererCleAPI = async (email, motDePasse, nouveau) => {

    let sqlQuery
    let values

    if (nouveau) {
        const nouvelleCle = crypto.randomUUID()
        sqlQuery = `
            UPDATE bibliotheques
            SET cle_api = $1
            WHERE courriel = $2 AND password = $3
            RETURNING id, nom, courriel, cle_api
        `
        values = [nouvelleCle, email, motDePasse]
    } else {
        sqlQuery = `
            SELECT id, nom, courriel, cle_api
            FROM bibliotheques
            WHERE courriel = $1 AND password = $2
        `
        values = [email, motDePasse]
    }
    
    try {
        const resultat = await pool.query(sqlQuery, values)

        if (resultat.rows.length === 0) {
            throw new Error('Email ou mot de passe incorrect.')
        }
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}


/**
 * Verifier l'existance d'une cle api dans la base de donnée
 * @param {*} cleAPI, cle d'api a vérifier de la bibliothque
 * @returns 
 */
export const verifierCleApi = async (cleApi) => {
    
    const sqlQuery = `SELECT id, nom, courriel, cle_api FROM bibliotheques WHERE cle_api = $1`
    const values = [cleApi]

    try {
        const resultat = await pool.query(sqlQuery, values)
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}
