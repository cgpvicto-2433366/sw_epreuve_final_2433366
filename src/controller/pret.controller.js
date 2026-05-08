import { ajouterUnPret, modifierPret, modifierStatutPret, supprimerPret } from "../models/pret.model.js";
import { verifierDisponibiliteLivre, modifierStatut } from "../models/livre.model.js";

/**
 * Ajouter un prêt
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const _ajouterUnPret = async (req, res, next) => {
    try {
        const { livreId, emprunteur, dateRetourPrevu } = req.body;
        const bibliothequeId = req.bibliotheque.id

        if (!livreId || !emprunteur || !dateRetourPrevu) {
            return res.status(400).json({
                message: 'Les champs identifiant du livre, emprunteur et date de retour prévu sont obligatoires.'
            });
        }

        if (!livreId || isNaN(Number(livreId)) || Number(livreId) <= 0) {
            return res.status(400).json({
                message: "L'identifiant du livre est obligatoire et doit être supérieur à 0."
            });
        }

        // Vérifie que le livre existe et appartient à cette bibliothèque
        const livre = await verifierDisponibiliteLivre(livreId, bibliothequeId);

        if (!livre) {
            return res.status(404).json({
                message: 'Le livre n\'existe pas dans votre bibliotheque.'
            });
        } else if (!livre.disponible) {
            return res.status(409).json({
                message: 'Le livre n\'est pas disponible pour le prêt.'
            });
        }

        const resultat = await ajouterUnPret(livreId, emprunteur, dateRetourPrevu);

        // Mettre à jour le statut du livre (indisponible)
        await modifierStatut(livreId, bibliothequeId, false);

        return res.status(201).json({
            message: 'Prêt ajouté avec succès.',
            pret: resultat
        });

    } catch (erreur) {
        console.error('Erreur lors de l\'ajout d\'un prêt :', erreur.message);
        const error = new Error('Erreur lors de l\'ajout d\'un prêt.');
        next(error);
    }
};


/**
 * Modifier les informations d'un prêt
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const _modifierUnPret = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { emprunteur, dateRetourPrevue } = req.body;
        const bibliothequeId = req.bibliotheque.id;

        if (!id || isNaN(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "L'identifiant du prêt est obligatoire et doit être supérieur à 0."
            });
        }

        if (!emprunteur || !dateRetourPrevue) {
            return res.status(400).json({
                message: "Les champs emprunteur et date de retour prévu sont obligatoires."
            });
        }

        const resultat = await modifierPret(id, bibliothequeId, emprunteur, dateRetourPrevue);

        if(!resultat){
            return res.status(404).json({
                message: 'Aucun prêt ne correspond à ces informations.'
            })
        }

        return res.status(200).json({
            message: 'Prêt modifié avec succès.',
            pret: resultat
        });

    } catch (erreur) {
        console.error('Erreur lors de la modification d\'un prêt :', erreur.message);
        const error = new Error('Erreur lors de la modification d\'un prêt.');
        next(error);
    }
};


/**
 * Modifier le statut d'un prêt dans le cas d'un livre retourner
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const _modifierStatutPret = async (req, res, next) => {
    try {
        const id = req.params.id;
        const terminer = req.body.terminer === true;
        const bibliothequeId = req.bibliotheque.id

        if (!id || isNaN(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "L'identifiant du prêt est obligatoire et doit être supérieur à 0."
            })
        }

        const resultat = await modifierStatutPret(id, bibliothequeId, terminer);

        if(!resultat){
            return res.status(404).json({
                message: 'Aucun prêt ne correspond à ces informations.'
            })
        }

        await modifierStatut(resultat.livre_id, bibliothequeId, terminer);

        return res.status(200).json({
            message: 'Statut du prêt modifié avec succès.',
            pret: resultat
        });

    } catch (erreur) {
        console.error('Erreur lors de la modification du statut d\'un prêt :', erreur.message);
        const error = new Error('Erreur lors de la modification du statut d\'un prêt.');
        next(error);
    }
};

/**
 * Supprimer un prêt
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const _supprimerUnPret = async (req, res, next) => {
    try {
        const id = req.params.id;
        const bibliothequeId = req.bibliotheque.id;

        if (!id || isNaN(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "L'identifiant du prêt est obligatoire et doit être supérieur à 0."
            });
        }

        const resultat = await supprimerPret(id, bibliothequeId);
        if(!resultat){
            return res.status(404).json({
                message: 'Aucun prêt ne correspond à ces informations.'
            })
        }

        // Remettre le livre disponible uniquement si le prêt était encore en cours
        if (resultat.statut === false) {
            await modifierStatut(resultat.livre_id, bibliothequeId, true);
        }

        return res.status(200).json({
            message: 'Prêt supprimé avec succès.',
            pret: resultat
        });

    } catch (erreur) {
        console.error('Erreur lors de la suppression d\'un prêt :', erreur.message);
        const error = new Error('Erreur lors de la suppression d\'un prêt.');
        next(error);
    }
};
