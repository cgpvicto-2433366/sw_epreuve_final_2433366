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
    const cleAPI = crypto.randomBytes(16).toString('hex')
    
    const sqlQuery = `
        INSERT INTO bibliotheques (nom, email, mot_de_passe, cle_api)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nom, email, cle_api
    `
    
    try {
        const resultat = await pool.query(sqlQuery, [nomBibliotheque, email, motDePasse, cleAPI])
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}

/**
 * Récupérer la clé API d'un utilisateur
 * @param {*} email adresse courriel
 * @param {*} motDePasse mot de passe
 * @returns 
 */
export const recupererCleAPI = async (email, motDePasse) => {
    const sqlQuery = `
        SELECT id, nom, email, cle_api
        FROM bibliotheques
        WHERE email = $1 AND mot_de_passe = $2
    `
    
    try {
        const resultat = await pool.query(sqlQuery, [email, motDePasse])
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
 * Générer une nouvelle clé API
 * @param {*} email adresse courriel
 * @param {*} motDePasse mot de passe
 * @returns 
 */
export const genererNouvelleClé = async (email, motDePasse) => {
    const nouvelleClé = crypto.randomBytes(16).toString('hex')
    
    const sqlQuery = `
        UPDATE bibliotheques
        SET cle_api = $1
        WHERE email = $2 AND mot_de_passe = $3
        RETURNING id, nom, email, cle_api
    `
    
    try {
        const resultat = await pool.query(sqlQuery, [nouvelleClé, email, motDePasse])
        if (resultat.rows.length === 0) {
            throw new Error('Email ou mot de passe incorrect.')
        }
        return resultat.rows[0]
    } catch (erreur) {
        console.error(`Erreur BD : ${erreur.message}`)
        throw erreur
    }
}
