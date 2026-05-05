import { ajouterUtilisateur, recupererCleAPI} from '../models/utilisateur.model.js'

/**
 * Ajouter un nouvel utilisateur (bibliothèque)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _ajouterUtilisateur = async (req, res, next) => {
    try {
        const { nom, email, mdp } = req.body

        if (!nom || !email || !mdp) {
            return res.status(400).json({
                erreur: 'Les champs nom de la bibliothèque, email et mot de passe sont obligatoires.'
            })
        }

        const resultat = await ajouterUtilisateur(nom, email, mdp)

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            cle_api: resultat.cle_api
        })
    } catch (erreur) {
        console.error('Erreur contrôleur utilisateur :', erreur.message)
        const error = new Error(erreur.message)
        next(error)
    }
}

/**
 * Récupérer ou generer la clé API d'un utilisateur
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererCleAPI = async (req, res, next) => {
    try {
        const { email, motDePasse } = req.body
        const nouveau = req.query.nouveau === '1'

        if (!email || !motDePasse) {
            return res.status(400).json({
                erreur: 'Les champs email et mot de passe sont obligatoires.'
            })
        }

        const resultat = await recupererCleAPI(email, motDePasse, nouveau)

        if(nouveau){
            return res.status(201).json({
                message: 'Clé API regénéré.',
                bibliotheque: resultat
            })
        }

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

