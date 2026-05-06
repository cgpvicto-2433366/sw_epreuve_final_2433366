import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import routerLivre from './src/routes/livre.route.js';
import routerUtilisateur from './src/routes/utilisateur.route.js';
import routerPret from './src/routes/pret.route.js';
import routerTest from './src/routes/test.route.js';
import { Authentification } from './src/middleware/authentification.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Journal des erreurs 500
// https://www.npmjs.com/package/morgan
const errorLogStream = fs.createWriteStream('./logs/error.log', { flags: 'a' });

// Chargement de la documentation OpenAPI
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Bibliothèque"
};

app.use(express.json());

// journalisation des requêtes vers la console
app.use(morgan('dev'));

// Documentation OpenAPI 
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Routes publiques (sans authentification par clé API)
app.use('/api/bibliotheque/utilisateurs', routerUtilisateur);

// Routes test
app.use('/api/bibliotheque', routerTest);

// rroutes protégées
app.use('/api/bibliotheque/livres', Authentification, routerLivre);
app.use('/api/bibliotheque/prets', Authentification, routerPret);

// Gestionnaire d'erreurs 500
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Erreur serveur interne.';

    // format d'ecriture suggéré par claude IA
    if (status >= 500) {
        const timestamp = new Date().toISOString();
        const qui = req.bibliotheque?.nom || 'Non authentifié';
        const quoi = `${req.method} ${req.originalUrl}`;
        const cible = req.params?.id ? `ID ${req.params.id}` : (req.body?.isbn ? `ISBN ${req.body.isbn}` : 'N/A');

        const entree = `[${timestamp}] QUI: ${qui} | QUOI: ${quoi} | CIBLE: ${cible} | ERREUR: ${message}\n`;
        console.error(entree);
        errorLogStream.write(entree);
    }

    res.status(status).json({ erreur: message });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
