import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import morgan from 'morgan';
import router from './src/routes/livre.route.js';
import routerUtilisateur from './src/routes/utilisateur.route.js';
import { verifierCleAPI } from './src/middleware/authentification.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream('./access.log', { flags: 'a' });
app.use(express.json());

// Morgan : journalisation des requêtes vers la console
app.use(morgan('dev'));

// Routes publiques (sans authentification par clé API)
app.use('/api/utilisateurs', routerUtilisateur);

// Middleware d'authentification par clé API
app.use('/api/bibliotheque', verifierCleAPI);

// Routes protégées par clé API
app.use('/api/bibliotheque', router);

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