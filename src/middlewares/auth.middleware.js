import pool from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
    const cleApi = req.headers['x-api-key'];

    if (!cleApi) {
        return res.status(401).json({
            erreur: "Clé API manquante."
        });
    }

    try {
        const resultat = await pool.query(
            `SELECT id FROM bibliotheques WHERE cle_api = $1`,
            [cleApi]
        );

        if (resultat.rows.length === 0) {
            return res.status(401).json({
                erreur: "Clé API invalide."
            });
        }

        // Injecter le bibliothequeId dans la requête
        req.bibliothequeId = resultat.rows[0].id;
        next();

    } catch (erreur) {
        console.error(`Erreur middleware auth : ${erreur.message}`);
        return res.status(500).json({
            erreur: "Erreur lors de la vérification de la clé API."
        });
    }
}