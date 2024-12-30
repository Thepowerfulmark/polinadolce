// Revised results.js with admin functionality and persistent user authentication
let results = {}; // Store current user's results
let allResults = {}; // Store all users' results (visible to admin)

function loadResults() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Пожалуйста, войдите на сайт!');
        window.location.href = 'auth.html';
        return;
    }
    const storedResults = localStorage.getItem('allResults');
    allResults = storedResults ? JSON.parse(storedResults) : {};

    results = allResults[username] || {};
}

function saveResults() {
    const username = localStorage.getItem('username');
    if (username) {
        allResults[username] = results;
        localStorage.setItem('allResults', JSON.stringify(allResults));
    }
}

function toggleSelection(element, choice) {
    element.classList.toggle('selected');
    const question = document.querySelector('h1').textContent.trim();

    if (!results[question]) {
        results[question] = [];
    }

    if (results[question].includes(choice)) {
        results[question] = results[question].filter(answer => answer !== choice);
    } else {
        results[question].push(choice);
    }

    saveResults();
}

function addCustomResult(inputId) {
    const customInput = document.getElementById(inputId);
    const customValue = customInput.value.trim();
    const question = document.querySelector('h1').textContent.trim();

    if (customValue) {
        if (!results[question]) {
            results[question] = [];
        }

        if (!results[question].includes(customValue)) {
            results[question].push(customValue);
        }

        customInput.value = '';
        saveResults();
        alert('Ваш ответ добавлен!');
    }
}

function savePageResults() {
    saveResults();
    alert('Ваш выбор сохранен!');
}

function viewResults() {
    saveResults();
    window.location.href = 'results.html';
}

function displayResults() {
    const username = localStorage.getItem('username');
    const isAdmin = username === 'admin';

    const resultsBody = document.getElementById('resultsBody');

    if (isAdmin) {
        if (!allResults || Object.keys(allResults).length === 0) {
            resultsBody.innerHTML = '<tr><td colspan="2">Нет сохраненных результатов</td></tr>';
            return;
        }

        resultsBody.innerHTML = '';
        for (const [user, userResults] of Object.entries(allResults)) {
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

function checkAuthorization() {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('Вы не авторизованы! Пожалуйста, войдите на сайт.');
        window.location.href = 'auth.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthorization();
    loadResults();

    if (document.body.contains(document.getElementById('resultsBody'))) {
        displayResults();
    }
});
