const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer();
const port = process.env.PORT || 3000;
const cacheDir = path.resolve(__dirname, './cache');

// Створюємо папку для кешу, якщо її немає
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

// Middleware для парсингу JSON
app.use(express.json());

// GET /notes/<ім’я нотатки>
app.get('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, `${noteName}.txt`);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Нотатку не знайдено');
    }

    const noteText = fs.readFileSync(notePath, 'utf-8');
    res.send(noteText);
});

// PUT /notes/<ім’я нотатки>
app.put('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, `${noteName}.txt`);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Нотатку не знайдено');
    }

    const noteText = req.body.text;
    fs.writeFileSync(notePath, noteText);
    res.send('Нотатку оновлено');
});

// DELETE /notes/<ім’я нотатки>
app.delete('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, `${noteName}.txt`);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Нотатку не знайдено');
    }

    fs.unlinkSync(notePath);
    res.send('Нотатку видалено');
});

// GET /notes
app.get('/notes', (req, res) => {
    const files = fs.readdirSync(cacheDir);
    const notes = files.map(file => {
        const noteName = path.basename(file, '.txt');
        const noteText = fs.readFileSync(path.join(cacheDir, file), 'utf-8');
        return { name: noteName, text: noteText };
    });

    res.status(200).json(notes);
});

// POST /write
app.post('/write', upload.none(), (req, res) => {
    const noteName = req.body.note_name;
    const noteText = req.body.note;
    const notePath = path.join(cacheDir, `${noteName}.txt`);

    if (fs.existsSync(notePath)) {
        return res.status(400).send('Нотатка з таким іменем вже існує');
    }

    fs.writeFileSync(notePath, noteText);
    res.status(201).send('Нотатку створено');
});

// GET /UploadForm.html
app.get('/UploadForm.html', (req, res) => {
    const formPath = path.join(__dirname, 'UploadForm.html');

    if (!fs.existsSync(formPath)) {
        return res.status(404).send('HTML форма не знайдена');
    }

    res.sendFile(formPath);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});
