import pool from '../config/db.js'
import { verifierCleApi } from '../models/utilisateur.model.js'

/**
 * Middleware d'authentification
 * si tout se passe bien, il creera une variable contenant 
 * les infos de la bibliotheque actuelle
 */
export const Authentification = async (req, res, next) => {
    try {
        const cleAPI = req.headers.authorization
        if (!cleAPI) {
            return res.status(401).json({ message: "Autorisation nécessaire pour accéder à cette route"})
        }

        const resultat = await verifierCleApi(cleAPI)

        if (!resultat) {
            return res.status(401).json({
                error: 'Clé API invalide ou non autorisée.'
            })
        }

        // stocke les infos sur la bibliotheque actuelle (claude IA)
        req.bibliotheque = resultat
        next()
    } catch (erreur) {
        console.error('Erreur middleware authentification :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}
