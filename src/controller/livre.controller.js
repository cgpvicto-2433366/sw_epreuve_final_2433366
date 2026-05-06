import { recupererTousLesLivresBibliotheque, recupererDetailDeLivre } from '../models/livre.model.js'

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

        const livres = await recupererTousLesLivresBibliotheque(bibliothequeId, disponible)

        return res.status(200).json({
            bibliotheque: req.bibliotheque.nom,
            disponible,
            total: livres.length,
            livres
        })

    } catch (erreur) {
        console.error('Erreur lors de la récupération de tous les livres: ', erreur.message)
        const error = new Error('Erreur lors de la récupération de tous les livres')
        next(error)
    }
}


/**
 * Recuperer les details sur un livre
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererDetailDeLivre =  async(req, res, next) =>{

    try{
        const id = req.params.id
        if(!id || isNaN(Number(id)) || Number(id) <= 0){
            res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0"
            });
            return;
        }

        const resultat = await recupererDetailDeLivre(id)

        if (!resultat.livre.length){
            return res.status(404).json({
                message: "Désolé, mais nous n'avons trouvé aucune information sur ce livre"
            })
        }

        return res.status(200).json({
            detail: resultat.livre,
            prets: resultat.prets
        })

    } catch(erreur){
        console.error('Erreur lors de la récupération des details du livre: ', erreur)
        const error = new Error('Erreur lors de la récupération des details du livre')
        next(error)
    }
}

