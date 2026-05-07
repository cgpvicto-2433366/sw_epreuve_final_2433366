import { recupererTousLesLivresBibliotheque, recupererDetailDeLivre, ajouterUnLivre, modifierLivre, modifierStatut, supprimerLivre } from '../models/livre.model.js'

//https://www.postgresql.org/docs/current/errcodes-appendix.html
const VALEUR_NON_UNIQUE = '23505';

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

        const afficherTous = req.query.tous === '1'

        const livres = await recupererTousLesLivresBibliotheque(bibliothequeId, afficherTous)

        return res.status(200).json({
            bibliotheque: req.bibliotheque.nom,
            afficherTous,
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
        const bibliothequeId = req.bibliotheque.id

        const id = req.params.id
        if(!id || isNaN(Number(id)) || Number(id) <= 0){
            res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0"
            });
            return;
        }

        const resultat = await recupererDetailDeLivre(id, bibliothequeId)

        if (!resultat.livre){
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

/**
 * Ajouter un livre dans une bibliothèque
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const _ajouterUnLivre = async(req, res, next) =>{

    try {
        const { titre, auteur, isbn, description } = req.body
        const disponible =  req.body.disponible != '0'
        const bibliothequeId = req.bibliotheque.id

        if (!titre || !auteur || !isbn ) {
            return res.status(400).json({
                erreur: 'Les champs titre, auteur et isbn sont obligatoires.'
            })
        }

        const resultat = await ajouterUnLivre(bibliothequeId, titre, auteur, isbn, disponible, description)

        return res.status(201).json({
            message: 'Livre ajouté avec succès.',
            identifiant: resultat.id 
        })

    } catch (erreur) {
        console.error('Erreur lors de l\'ajout d\'un livre :', erreur.message)
        let error = new Error()
        if(erreur.code === VALEUR_NON_UNIQUE){
            error = Error("Un livre existe déjà dans votre bibliothèque avec cet isbn")
        }else{
            error = new Error('Erreur lors de l\'ajout d\'un livre')
        } 
        next(error)
    }
}

/**
 * Modifier les informations d'un livre
 * dans la base de donnée
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const _modifierUnLivre = async(req, res, next) =>{
    try {
        const { titre, auteur, isbn} = req.body
        const bibliothequeId = req.bibliotheque.id
        const description = req.body.description?.length > 0 ? req.body.description : null;
        const id = req.params.id
        if(!id || isNaN(Number(id)) || Number(id) <= 0){
            res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0"
            });
            return;
        }

        if (!titre || !auteur || !isbn ) {
            return res.status(400).json({
                erreur: 'Les champs titre, auteur et isbn sont obligatoires.'
            })
        }

        const resultat = await modifierLivre(id, bibliothequeId, titre, auteur, isbn, description)

        if(!resultat){
            res.status(400).json({
                message: 'Aucun livre ne correspond a ces informations dans votre bibliotheque.'
            })
        }

        return res.status(200).json({
            message: 'Livre modifié avec succès.',
            livre: resultat
        })

    } catch (erreur) {
        console.error('Erreur lors de la modification d\'un livre :', erreur.message)
        let error = new Error()
        if(erreur.code === VALEUR_NON_UNIQUE){
            error = Error("Un livre existe déjà dans votre bibliothèque avec cet isbn")
        }else{
            error = new Error('Erreur lors de la modification d\'un livre')
        } 
        next(error)
    }
}

/**
 * Modifier le statut d'un livre
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const _modifierStatut = async(req, res, next) => {

    try{
        const disponible = req.body.disponible === '1'
        const bibliothequeId = req.bibliotheque.id
        const id = req.params.id
        if(!id || isNaN(Number(id)) || Number(id) <= 0){
            res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0"
            });
            return;
        }

        const resultat = await modifierStatut(id, bibliothequeId, disponible)

        if(!resultat){
            res.status(400).json({
                message: 'Aucun livre ne correspond a ces informations dans votre bibliotheque.'
            })
        }

        return res.status(200).json({
            message: 'Livre modifié avec succès.',
            livre: resultat
        })
    }catch (erreur) {
        console.error('Erreur lors de la modification du statut d\'un livre :', erreur.message)
        const error = new Error('Erreur lors de la modification du statut du livre')
        next(error)
    }
    
}

/**
 * Supprimer un livre de la base de donnée
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const _supprimerUnLivre = async(req, res, next) =>{
    try {
        const bibliothequeId = req.bibliotheque.id
        const id = req.params.id
        if(!id || isNaN(Number(id)) || Number(id) <= 0){
            res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0"
            });
            return;
        }

        const resultat = await supprimerLivre(id, bibliothequeId)

        if(!resultat){
            res.status(400).json({
                message: 'Aucun livre ne correspond a ces informations dans votre bibliotheque.'
            })
        }

        return res.status(200).json({
            message: 'Livre supprimé avec succès.',
            livre: resultat
        })

    } catch (erreur) {
        console.error('Erreur lors de la modification d\'un livre :', erreur.message)
        const error =  new Error('Erreur lors de la suppression du livre')
        next(error)
    }
}