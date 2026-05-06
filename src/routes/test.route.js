import express from 'express'

const router = express.Router()

// Route de test pour générer une erreur 500 afin de valider morgan
router.get('/test-500', (req, res, next) => {
    const error = new Error('Accès refusé ou données invalides'); 
    error.status = 500;
    next(error); 
});

export default router