// app.js
const express = require('express');
const { Command } = require('commander');
const app = express();

// Настройка командной строки с помощью Commander.js
const program = new Command();
program
    .requiredOption('-h, --host <type>', 'адреса сервера')
    .requiredOption('-p, --port <number>', 'порт сервера')
    .requiredOption('-c, --cache <path>', 'шлях до директориї для кеша');

program.parse(process.argv);
const options = program.opts();

// Проверка обязательных параметров
if (!options.host || !options.port || !options.cache) {
    console.error('Помилка: не вказані обовязкові параметри --host, --port, або --cache');
    process.exit(1);
}

const port = parseInt(options.port, 10);
const host = options.host;
const cachePath = options.cache;

// Настройка сервера
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Сервер для збереження нотаток');
});

app.listen(port, host, () => {
    console.log(`Сервер запущено на http://${host}:${port}`);
    console.log(`Кеш файли будуть збережені в директорії: ${cachePath}`);
});
