const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/stream', async (req, res) => {
    try {
        const query = req.query.q; // On récupère le nom de la musique (ex: "Soolking Casanova")
        if (!query) return res.status(400).send("Recherche manquante");

        // 1. On cherche la vidéo sur YouTube
        const r = await ytSearch(query);
        const video = r.videos[0]; // On prend le premier résultat

        if (!video) return res.status(404).send("Aucun morceau trouvé");

        // 2. On configure le header audio
        res.setHeader('Content-Type', 'audio/mpeg');

        // 3. On stream le son complet de YouTube vers ton site
        ytdl(video.url, {
            filter: 'audioonly',
            quality: 'highestaudio',
            highWaterMark: 1 << 25
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur de streaming");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Musique Ready sur le port ${PORT}`));