import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import routerLivre from './src/routes/livre.route.js';
import routerUtilisateur from './src/routes/utilisateur.route.js';
import routerTest from './src/routes/test.route.js'
import { Authentification } from './src/middleware/authentification.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
app.use(express.json());

// Morgan : journalisation des requêtes vers la console
app.use(morgan('dev'));

// Routes publiques (sans authentification par clé API)
app.use('/api/bibliotheque/utilisateurs', routerUtilisateur);

// Routes test 
app.use('/api/bibliotheque', routerTest);

// Middleware d'authentification par clé API et route protégé
app.use('/api/bibliotheque/livres', Authentification, routerLivre);

// Ecriture dans le fichier formater par Gemini
app.use((err, req, res, next) => {
    const message = err.message || 'Erreur serveur interne.';
    const status = err.status || 500;
    console.error(`[ERREUR] ${message}`);
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.originalUrl} - STATUS ${status} - ${message}\n`;
    accessLogStream.write(logEntry);
    res.status(status).json({ error: message });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});