// Importer le module express
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Créer une application express
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send("<h1>Mon premier serveur web sur express !</h1>");
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});