import pool from '../config/db.js'

/**
 * Middleware d'authentification
 * si tout se passe bien, il creera une variable contenant 
 * les infos de la bibliotheque actuelle
 */
export const verifierCleAPI = async (req, res, next) => {
    try {
        const cleAPI = req.headers.authorization
        if (!cleAPI) {
            return res.status(401).json({ message: "Autorisation nécessaire pour accéder à cette route"})
        }

        const sqlQuery = `SELECT id, nom, email FROM bibliotheques WHERE cle_api = $1`

        const resultat = await pool.query(sqlQuery, [cleAPI])

        if (resultat.rows.length === 0) {
            return res.status(401).json({
                error: 'Clé API invalide ou non autorisée.'
            })
        }

        // stocke les infos sur la bibliotheque actuelle 
        req.bibliotheque = resultat.rows[0]
        next()
    } catch (erreur) {
        console.error('Erreur middleware authentification :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}
