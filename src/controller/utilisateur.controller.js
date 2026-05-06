import { ajouterUtilisateur, recupererCleAPI, regenererCleAPI} from '../models/utilisateur.model.js'
import bcrypt from 'bcrypt'

/**
 * Ajouter un nouvel utilisateur (bibliothèque)
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _ajouterUtilisateur = async (req, res, next) => {

    //https://www.postgresql.org/docs/current/errcodes-appendix.html
    const VALEUR_NON_UNIQUE = '23505';

    try {
        const { nom, email, mdp } = req.body

        if (!nom || !email || !mdp) {
            return res.status(400).json({
                erreur: 'Les champs nom de la bibliothèque, email et mot de passe sont obligatoires.'
            })
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regexEmail.test(email)) {
            return res.status(400).json({
                erreur: 'Le format de l\'email est invalide.'
            });
        }

        const resultat = await ajouterUtilisateur(nom, email, mdp)

        return res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            cle_api: resultat.cle_api
        })
    } catch (erreur) {
        console.error('Erreur lors de l\'ajout d\'un utilisateur :', erreur.message)
        let error = new Error()
        if(erreur.code === VALEUR_NON_UNIQUE){
           error = Error("Un compte existe déjà avec cet email.")
        }else{
            error = new Error('Erreur lors de l\'ajout d\'un utilisateur')
        } 
        next(error)
    }
}

/**
 * Récupérer ou generer la clé API d'un utilisateur
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const _recupererCleAPI = async (req, res, next) => {
    try {
        const { email, mdp} = req.body
        const nouveau = req.query.nouveau === '1'

        if (!email || !mdp) {
            return res.status(400).json({
                erreur: 'Les champs email et mot de passe sont obligatoires.'
            })
        }

        const utilisateur= await recupererCleAPI(email)

        if (!utilisateur) {
            return res.status(401).json({
                message: 'Email ou mot de passe invalide',
            })
        }

        const estValide = await bcrypt.compare(mdp, utilisateur.password)
        if (!estValide) {
            return res.status(401).json({
                message: 'Email ou mot de passe invalide',
            })
        }

        //Mistral AI: Comment extraire le mot de passe de la réponse
        const { password, ...utilisateurSansMotDePasse } = utilisateur;

        if(nouveau){
            const resultat = await regenererCleAPI(email)
            return res.status(200).json({
                message: 'Clé API régénérée avec succès.',
                bibliotheque: resultat
            });
        }

        return res.status(200).json({
            message: 'Clé API récupérée avec succès.',
            bibliotheque: utilisateurSansMotDePasse
        })

    } catch (erreur) {
        console.error('Erreur recuperer ou generer la clé API :', erreur.message)
        const error = new Error('Erreur lors de la recupereration ou genereration la clé API.')
        next(error)
    }
}

