import pool from '../config/db.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

/**
 * Ajouter un utilisateur (responsable de bibliothèque)
 * @param {*} nomBibliotheque nom de la bibliothèque
 * @param {*} email adresse courriel
 * @param {*} motDePasse mot de passe
 * @returns 
 */
export const ajouterUtilisateur = async (nomBibliotheque, email, motDePasse) => {
    const cleAPI = crypto.randomUUID() 
    
    //https://laconsole.dev/blog/hacher-mot-de-passe-js-bcrypt
    const sel = await bcrypt.genSalt(10)
    const motDePasseHache = await bcrypt.hash(motDePasse, sel);

    //https://dev.to/satyam_gupta_0d1ff2152dcc/master-postgresql-with-nodejs-a-complete-guide-to-building-robust-backends-5epd
    // Format de la requete d'insertion
    const sqlQuery = `
        INSERT INTO bibliotheques (nom, courriel, cle_api, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nom, courriel, cle_api
    `
    
    try {
        const resultat = await pool.query(sqlQuery, [nomBibliotheque, email, cleAPI, motDePasseHache])
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}

/**
 * Récupérer ou générer une clé API d'un utilisateur
 * @param {*} email adresse courriel
 * @returns 
 */
export const recupererCleAPI = async (email) => {

    const sqlQuery = `
        SELECT nom, courriel, cle_api, password
        FROM bibliotheques
        WHERE courriel = $1
    `
    const values = [email]
   
    try {
        const resultat = await pool.query(sqlQuery, values)
        if(resultat.rows.length === 0){
            return null; 
        }
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}

/**
 * Régénérer une clé API d'un utilisateur
 * @param {*} email adresse courriel
 * @returns 
 */
export const regenererCleAPI = async (email) => {

    const nouvelleCle = crypto.randomUUID()
    const updateQuery = `
        UPDATE bibliotheques
        SET cle_api = $1
        WHERE courriel = $2
        RETURNING nom, courriel, cle_api`
    
    const updateValues = [nouvelleCle, email] 

    try{
        const resultat = await pool.query(updateQuery, updateValues)
        if(resultat.rows.length === 0){
            throw new Error('Aucun utilisateur trouvé avec cet email.');
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
