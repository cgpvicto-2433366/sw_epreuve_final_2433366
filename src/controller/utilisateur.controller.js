import { ajouterUtilisateur, recupererCleAPI, genererNouvelleClé } from '../models/utilisateur.model.js'

/**
 * Ajouter un nouvel utilisateur (bibliothèque)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _ajouterUtilisateur = async (req, res, next) => {
    try {
        const { nomBibliotheque, email, motDePasse } = req.body

        if (!nomBibliotheque || !email || !motDePasse) {
            return res.status(400).json({
                error: 'Les champs nomBibliotheque, email et motDePasse sont obligatoires.'
            })
        }

        const resultat = await ajouterUtilisateur(nomBibliotheque, email, motDePasse)

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            bibliotheque: resultat
        })
    } catch (erreur) {
        console.error('Erreur contrôleur utilisateur :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}

/**
 * Récupérer la clé API d'un utilisateur
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererCleAPI = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body

        if (!email || !motDePasse) {
            return res.status(400).json({
                error: 'Les champs email et motDePasse sont obligatoires.'
            })
        }

        const resultat = await recupererCleAPI(email, motDePasse)

        return res.status(200).json({
            message: 'Clé API récupérée avec succès.',
            bibliotheque: resultat
        })
    } catch (erreur) {
        console.error('Erreur contrôleur utilisateur :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}

/**
 * Générer une nouvelle clé API
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _genererNouvelleClé = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body

        if (!email || !motDePasse) {
            return res.status(400).json({
                error: 'Les champs email et motDePasse sont obligatoires.'
            })
        }

        const resultat = await genererNouvelleClé(email, motDePasse)

        return res.status(200).json({
            message: 'Nouvelle clé API générée avec succès.',
            bibliotheque: resultat
        })
    } catch (erreur) {
        console.error('Erreur contrôleur utilisateur :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}
