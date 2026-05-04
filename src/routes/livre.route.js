import express from 'express'
import {_recupererTousLesLivresBibliotheque} from '../controller/livre.controller.js'

const router = express.Router()

// Route de test pour générer une erreur 500 afin de valider morgan
router.get('/test-500', (req, res, next) => {
    const error = new Error('Accès refusé ou données invalides'); 
    error.status = 500;
    next(error); 
});

// Route pour récupérer les livres de la bibliothèque authentifiée
// GET /api/bibliotheque/liste?disponible=1
router.get('/liste', _recupererTousLesLivresBibliotheque)

export default router
