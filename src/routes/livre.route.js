import express from 'express'
import {_recupererTousLesLivresBibliotheque, _recupererDetailDeLivre, _ajouterUnLivre, _modifierStatut, _modifierUnLivre, _supprimerUnLivre} from '../controller/livre.controller.js'

const router = express.Router()

router.get('/liste', _recupererTousLesLivresBibliotheque)
router.get('/:id', _recupererDetailDeLivre)
router.post('/', _ajouterUnLivre)
router.put('/:id', _modifierUnLivre)
router.patch('/:id', _modifierStatut)
router.delete('/:id', _supprimerUnLivre)

export default router
