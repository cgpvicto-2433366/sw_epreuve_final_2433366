import express from 'express'
import { _ajouterUtilisateur, _recupererCleAPI } from '../controller/utilisateur.controller.js'

const router = express.Router()

// Ajouter un nouvel utilisateur
router.post('/inscription', _ajouterUtilisateur)

// Récupérer  ou generer la clé API
router.post('/connexion', _recupererCleAPI)

export default router
