import express from 'express';
import { _ajouterUnPret, _modifierStatutPret, _supprimerUnPret } from '../controller/pret.controller.js';

const router = express.Router();

router.post('/', _ajouterUnPret);
router.patch('/:id', _modifierStatutPret);
router.delete('/:id', _supprimerUnPret);

export default router;