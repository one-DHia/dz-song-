const express = require('express');
const ytSearch = require('yt-search');
const cors = require('cors');
const app = express();

// Configuration CORS pour autoriser ton site Netlify
app.use(cors());

app.get('/stream', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Recherche manquante");

        console.log(`Recherche pour : ${query}`);

        // 1. On cherche la vidéo sur YouTube
        const r = await ytSearch(query);
        const video = r.videos[0];

        if (!video) {
            return res.status(404).send("Aucun morceau trouvé");
        }

        const videoId = video.videoId;
        console.log(`Lancement du stream pour l'ID : ${videoId}`);

        /**
         * LE SECRET : Le Redirect
         * Au lieu de télécharger la musique sur Render (qui est bloqué par Google),
         * on redirige le navigateur vers un flux audio direct (itag 140 = Audio M4A).
         */
        const streamUrl = `https://inv.tux.rs/latest_version?id=${videoId}&itag=140`;

        res.redirect(streamUrl);

    } catch (err) {
        console.error('Erreur Serveur:', err);
        res.status(500).send("Erreur interne du serveur");
    }
});

// Route de test pour vérifier si le serveur est vivant
app.get('/', (req, res) => {
    res.send("✅ DZ Music API est en ligne !");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});