let results = {}; // Хранение текущих результатов пользователя

// Загружаем результаты при открытии страницы
function loadResults() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Пожалуйста, войдите на сайт!');
        window.location.href = 'auth.html';
        return;
    }

    // Запрос к серверу для получения результатов
    fetch(`/load-results/${username}`)
        .then(response => response.json())
        .then(data => {
            results = data; // Сохраняем полученные данные
            displayResults(); // Функция для отображения результатов
        })
        .catch(error => {
            console.error('Ошибка при загрузке результатов', error);
            alert('Ошибка загрузки результатов');
        });
}

// Сохранение результатов на сервере
function saveResults() {
    const username = localStorage.getItem('username');
    if (username) {
        // Отправка результатов на сервер
        fetch('/save-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                results: results // Пример результатов, которые вы хотите сохранить
            })
        }).then(response => response.json())
          .then(data => console.log('Результаты успешно сохранены', data))
          .catch(error => console.error('Ошибка при сохранении результатов', error));
    }
}

// Отображение результатов на странице
function displayResults() {
    const username = localStorage.getItem('username');
    const isAdmin = username === 'admin';
    const resultsBody = document.getElementById('resultsBody');

    if (isAdmin) {
        if (!results || Object.keys(results).length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="2">Нет сохраненных результатов</td></tr>';
            return;
        }

        resultsBody.innerHTML = '';
        for (const [user, userResults] of Object.entries(results)) {
            for (const [question, answers] of Object.entries(userResults)) {
                const row = document.createElement('tr');
                const userCell = document.createElement('td');
                const questionCell = document.createElement('td');
                const answerCell = document.createElement('td');

                userCell.textContent = user;
                questionCell.textContent = question;
                answerCell.textContent = answers.join(', ') || 'Нет ответа';

                row.appendChild(userCell);
                row.appendChild(questionCell);
                row.appendChild(answerCell);
                resultsBody.appendChild(row);
            }
        }
    } else {
        if (!results || Object.keys(results).length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="2">Нет сохраненных результатов</td></tr>';
            return;
        }

        resultsBody.innerHTML = '';
        for (const [question, answers] of Object.entries(results)) {
            const row = document.createElement('tr');
            const questionCell = document.createElement('td');
            const answerCell = document.createElement('td');

            questionCell.textContent = question;
            answerCell.textContent = answers.join(', ') || 'Нет ответа';

            row.appendChild(questionCell);
            row.appendChild(answerCell);
            resultsBody.appendChild(row);
        }
    }
}
