import { recupererTousLesLivresBibliotheque as recupererTousLesLivresModel } from '../models/livre.model.js'

/**
 * Recuperer la liste des livres d'une bibliotheque précise
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererTousLesLivresBibliotheque = async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "L'identifiant de la bibliothèque doit être un entier positif."
            })
        }

        const disponible = req.query.disponible === '1'

        const livres = await recupererTousLesLivresModel(id, disponible)

        return res.status(200).json({
            identifiant: id,
            disponible,
            total: livres.length,
            livres
        })

    } catch (erreur) {
        console.error('Erreur contrôleur livre :', erreur.message)
        return res.status(500).json({ error: 'Impossible de récupérer les livres pour cette bibliothèque.' })
    }
}
