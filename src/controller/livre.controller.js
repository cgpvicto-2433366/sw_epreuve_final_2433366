import { recupererTousLesLivresBibliotheque as recupererTousLesLivresModel } from '../models/livre.model.js'

/**
 * Recuperer la liste des livres d'une bibliotheque précise
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererTousLesLivresBibliotheque = async (req, res, next) => {
    try {
        // L'ID de la bibliothèque vient de l'authentification par clé API
        const bibliothequeId = req.bibliotheque.id

        const disponible = req.query.disponible === '1'

        const livres = await recupererTousLesLivresModel(bibliothequeId, disponible)

        return res.status(200).json({
            bibliotheque: req.bibliotheque.nom,
            disponible,
            total: livres.length,
            livres
        })

    } catch (erreur) {
        console.error('Erreur contrôleur livre :', erreur.message)
        const error = new Error('Impossible de récupérer les livres pour cette bibliothèque.')
        next(error)
    }
}
