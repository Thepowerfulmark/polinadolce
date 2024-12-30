const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const mediaFolder = path.join(__dirname, '../frontend/media');


app.get('/list-media-files', (req, res) => {
    fs.readdir(mediaFolder, (err, files) => {
        if (err) {
            console.error('Ошибка чтения директории:', err);
            res.status(500).json({ error: 'Ошибка сервера' });
        } else {
            const mediaFiles = files.filter(file => /\.(jpg|jpeg|png|gif|mp4|webm|webp)$/i.test(file));
            res.json(mediaFiles);
        }
    });
});


app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/media', express.static(mediaFolder));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
