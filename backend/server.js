const { Client } = require('pg');  // Импортируем PostgreSQL клиент
const express = require('express');
const path = require('path');

const app = express();
const mediaFolder = path.join(__dirname, '../frontend/media');

// Строка подключения, которую вы предоставили
const connectionString = 'postgresql://mark:KFUmxM6505PvmXV7ekowAJmuLkI2L9YU@dpg-ctnkq123esus73a2t4h0-a/polinadolce_db';

const client = new Client({
    connectionString: connectionString,  // Используем вашу строку подключения
    ssl: {
        rejectUnauthorized: false  // Требуется для подключения по SSL к базе данных на OnRender
    }
});

// Подключаемся к базе данных
client.connect()
    .then(() => console.log('Подключение к базе данных PostgreSQL успешно установлено!'))
    .catch(err => console.error('Ошибка при подключении к базе данных:', err));

app.use(express.json());  // Для обработки JSON данных
app.use(express.static(path.join(__dirname, '../frontend')));

// Пример маршрута для сохранения результатов в базу данных
app.post('/save-results', async (req, res) => {
    const { username, results } = req.body; // Получаем имя пользователя и результаты из запроса

    try {
        // Сохраняем данные в таблице users_results
        const query = 'INSERT INTO users_results (username, results) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET results = $2';
        await client.query(query, [username, JSON.stringify(results)]); // Сохраняем или обновляем данные
        res.status(200).send('Результаты успешно сохранены');
    } catch (err) {
        console.error('Ошибка при сохранении данных:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Пример маршрута для загрузки результатов из базы данных
app.get('/load-results/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const query = 'SELECT results FROM users_results WHERE username = $1';
        const result = await client.query(query, [username]);
        if (result.rows.length > 0) {
            res.json(result.rows[0].results); // Отправляем результат
        } else {
            res.status(404).send('Результаты не найдены');
        }
    } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        res.status(500).send('Ошибка сервера');
    }
});

const PORT = process.env.PORT || 3000; // Порт, на котором сервер будет слушать запросы
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
