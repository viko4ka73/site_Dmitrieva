document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const nextLevelButton = document.getElementById("next-level");
    const timeLeftElement = document.getElementById("time-left");
    const scoreValueElement = document.getElementById("score-value");
    const retryButton = document.getElementById("retry");

    let timeLeft = 60; 
    let score = 0; 
    let answeredQuestions = 0; 
    let currentQuestionIndex = 0; 
    let timerInterval;
    let correctGridSelections = 0;
    let gameData = { 
        questions: [],
        score: 0,
        timeLeft: timeLeft,
        level: 1, 
        timeSpent: 0, 
    };

    const allQuestions = [
        { type: "choice", question: "Какое животное является самым быстрым на суше?", items: ["Гепард", "Тигр", "Лев", "Кенгуру"], correctAnswer: "Гепард" },
        { type: "choice", question: "Какое животное не имеет хвоста?", items: ["Тигр", "Кенгуру", "Медведь", "Петух"], correctAnswer: "Петух" },
        { type: "choice", question: "Какое животное является символом Австралии?", items: ["Лев", "Кенгуру", "Панда", "Тигр"], correctAnswer: "Кенгуру" },
        { type: "choice", question: "Какое животное является самым крупным на Земле?", items: ["Слон", "Кит", "Жираф", "Лев"], correctAnswer: "Кит" },
        { type: "grid", question: "Найдите всех животных, которые обитают в джунглях", grid: ["Тигр", "Кенгуру", "Гепард", "Лев", "Обезьяна", "Зебра", "Ягуар", "Пингвин"], correctAnswers: ["Тигр", "Обезьяна", "Ягуар"] },
        { type: "grid", question: "Найдите всех хищников", grid: ["Лев", "Тигр", "Зебра", "Лиса", "Овца", "Гепард", "Слон", "Кролик"], correctAnswers: ["Лев", "Тигр", "Лиса", "Гепард"] },
        { type: "grid", question: "Найдите всех животных с крыльями", grid: ["Петух", "Собака", "Курица", "Ласточка", "Лев", "Енот", "Дельфин", "Рыба"], correctAnswers: ["Петух", "Курица", "Ласточка"] }
    ];

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function getRandomQuestions() {
        return shuffle(allQuestions).slice(0, 3);
    }

    function startTimer() {
        const startTime = Date.now(); 
        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(startTime); 
            }
        }, 1000);
    }

    function displayQuestion() {
        const question = questions[currentQuestionIndex];

        if (question.type === "choice") {
            gameArea.innerHTML = ` 
                <div class="question">${question.question}</div>
                <div class="answers">
                    ${question.items.map(item => ` 
                        <div class="game-item">
                            <button class="answer-button">${item}</button>
                        </div>
                    `).join('')}
                </div>
            `;
            document.querySelectorAll('.answer-button').forEach(button => {
                button.addEventListener('click', checkAnswer);
            });
        } else if (question.type === "grid") {
            correctGridSelections = 0;
            gameArea.innerHTML = `
                <div class="question">${question.question}</div>
                <div class="grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    ${question.grid.map(item => `
                        <div class="grid-item answer-button" style="padding: 10px; border: 1px solid #ccc; text-align: center; cursor: pointer;">${item}</div>
                    `).join('')}
                </div>
            `;
            document.querySelectorAll('.grid-item').forEach(item => {
                item.addEventListener('click', checkGridAnswer);
            });
        }
    }

    function checkAnswer(event) {
        const selectedAnswer = event.target.textContent;
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        gameData.questions.push({
            question: questions[currentQuestionIndex].question,
            selectedAnswer: selectedAnswer,
            correctAnswer: correctAnswer
        });

        if (selectedAnswer === correctAnswer) {
            score += 10;
            event.target.style.backgroundColor = '#94ca95'; 
            event.target.classList.add('correct');
        } else {
            score -= 5;
            timeLeft -= 10; 
            timeLeftElement.textContent = timeLeft; 
            event.target.style.backgroundColor = '#da7272'; 
            event.target.classList.add('incorrect');
        }

        scoreValueElement.textContent = score;
        if (score < 0) {
            scoreValueElement.style.color = '#da7272';
        } else {
            scoreValueElement.style.color = '#94ca95';
        }
        document.querySelectorAll('.answer-button').forEach(button => {
            button.disabled = true;
        });

        answeredQuestions++;
        currentQuestionIndex++;

        if (answeredQuestions < questions.length) {
            setTimeout(displayQuestion, 1000); 
        } else {
            setTimeout(endGame, 1000); 
        }
    }
    function checkGridAnswer(event) {
        const selectedWord = event.target.textContent;
        const question = questions[currentQuestionIndex];
        
        let selectedWords = gameData.questions.find(q => q.question === question.question);
        if (!selectedWords) {
            selectedWords = { question: question.question, selectedAnswers: [], correctAnswers: question.correctAnswers }; // Добавляем правильные ответы
            gameData.questions.push(selectedWords);
        }
    
        selectedWords.selectedAnswers.push(selectedWord); 
        
        if (question.correctAnswers.includes(selectedWord)) {
            score += 5;
            correctGridSelections++;
            event.target.style.backgroundColor = '#94ca95'; 
            event.target.classList.add('correct');
        } else {
            score -= 2;
            timeLeft -= 5; 
            event.target.style.backgroundColor = '#da7272'; 
            event.target.classList.add('incorrect');
        }
    
        scoreValueElement.textContent = score;
    
        event.target.removeEventListener('click', checkGridAnswer);
    
        if (correctGridSelections === question.correctAnswers.length) {
            timeLeft += 10;
            answeredQuestions++;
            currentQuestionIndex++;
            if (answeredQuestions < questions.length) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(endGame, 1000);
            }
        }
    }
    

    function endGame(startTime) {
        clearInterval(timerInterval);
        gameData.score = score;
        gameData.timeLeft = timeLeft;
        gameData.timeSpent = Math.round((Date.now() - startTime) / 1000); // Вычисляем потраченное время в секундах

        const gameHistory = JSON.parse(localStorage.getItem('gameHistory_' + localStorage.getItem('gameUsername'))) || [];
        gameHistory.push(gameData);
        localStorage.setItem('gameHistory_' + localStorage.getItem('gameUsername'), JSON.stringify(gameHistory));
        const username = localStorage.getItem('gameUsername');

        if (username) {
            updateUserRanking(username, score, gameData.timeLeft); 
        }

        if (score >= 5 && timeLeft > 0) {
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false];
            completedLevels[0] = true; 
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));

            gameArea.innerHTML = `<p>Поздравляем! Вы успешно прошли уровень 1!</p>`;
            nextLevelButton.style.display = 'inline-block';
            retryButton.style.display = 'none';
        } else {
            gameArea.innerHTML = `<p>Уровень не пройден. Попробуйте снова!</p>`;
            retryButton.style.display = 'inline-block';
            nextLevelButton.style.display = 'none';
        }
    }

    function updateUserRanking(username, score, timeSpent) {
        const userRanking = JSON.parse(localStorage.getItem('userRanking')) || [];

        userRanking.push({
            username: username,
            score: score,
            timeSpent: timeSpent
        });

        userRanking.sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent);

        localStorage.setItem('userRanking', JSON.stringify(userRanking));
    }

    retryButton.addEventListener('click', () => {
        location.reload(); 
    });

    nextLevelButton.addEventListener('click', () => {
        window.location.href = 'level2.html'; 
    });

    const questions = getRandomQuestions();
    displayQuestion();
    startTimer();
});
