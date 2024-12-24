const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Путь к папке frontend, которая находится на уровне выше
const frontendPath = path.join(__dirname, '..', 'frontend');

// Устанавливаем папку для статических файлов
app.use(express.static(frontendPath));

// Перенаправляем на auth.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'auth.html'));
});

// Запускаем сервер
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});