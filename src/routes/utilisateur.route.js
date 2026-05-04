import express from 'express'
import { _ajouterUtilisateur, _recupererCleAPI, _genererNouvelleClé } from '../controller/utilisateur.controller.js'

const router = express.Router()

// Ajouter un nouvel utilisateur
// POST /api/utilisateurs/inscription
router.post('/inscription', _ajouterUtilisateur)

// Récupérer la clé API
// POST /api/utilisateurs/connexion
router.post('/connexion', _recupererCleAPI)

// Générer une nouvelle clé API
// POST /api/utilisateurs/regenerer-cle
router.post('/regenerer-cle', _genererNouvelleClé)

export default router
