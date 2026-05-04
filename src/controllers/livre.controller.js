import { recupererTousLesLivresBibliotheque } from "../models/livre.model.js";

/**
 * Recuperer la liste de tous les livres d'une bibliothèque
 * Par défaut seulement les livres disponibles sont retournés
 * @param {*} req 
 * @param {*} res 
 */
export const getLivres = async (req, res) => {
    // bibliothequeId sera injecté par le middleware d'auth
    const bibliothequeId = req.bibliothequeId;
    const tousLesLivres = req.query.tous === 'true';

    try {
        const livres = await recupererTousLesLivresBibliotheque(bibliothequeId, tousLesLivres);

        if (livres.length === 0) {
            return res.status(404).json({
                message: "Aucun livre trouvé pour cette bibliothèque."
            });
        }

        return res.status(200).json({ livres });

    } catch (erreur) {
        console.error('Erreur : ', erreur.message);
        return res.status(500).json({
            erreur: "Échec lors de la récupération des livres."
        });
    }
}