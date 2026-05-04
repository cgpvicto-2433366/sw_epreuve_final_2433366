import express from 'express'
import {_recupererTousLesLivresBibliotheque} from '../controller/livre.controller.js'

const router = express.Router()

// Route de test pour générer une erreur 500 afin de valider morgan
router.get('/test-500', (req, res, next) => {
    const error = new Error('Accès refusé ou données invalides'); 
    error.status = 500;
    next(error); 
});

router.get('/liste/:id', _recupererTousLesLivresBibliotheque)

export default router
