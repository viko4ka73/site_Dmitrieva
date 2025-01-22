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
    let gameData = {
        questions: [],
        score: 0,
        timeLeft: timeLeft,
        level: 2,
        timeSpent: 0,
        answers: [],
        correctAnswers: [],
        groups: {
            predators: "",
            herbivores: ""
        },
        questionsList: []
    };
    
    const usedAnimals = [];
    
    const allQuestions = [
        {
            type: "drag-and-drop",
            question: "Перетащи страны в их климатические зоны",
            options:  ["Россия", "Бразилия", "Исландия", "Индия"],
            correctAnswer: {
                predators: ["Россия", "Исландия"],
                herbivores: ["Бразилия", "Индия"]
            },
            headers: {
                predators: "Холодный",
                herbivores: "Тёплый"
            }
        },
        { type: "text", question: "Какая страна известна своими фиордами и викингами?", correctAnswer: "Норвегия" },
        { type: "text", question: "Какая страна известна как 'Страна восходящего солнца'?", correctAnswer: "Япония" },
        { type: "text", question: "Какая страна является родиной пиццы?", correctAnswer: "Италия" }
    ];
    
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    
    function getRandomQuestions() {
        return shuffle(allQuestions).slice(0, 1);
    }
    
    function startTimer() {
        const startTime = Date.now();
        let timeDecayRate = 600;
    
        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftElement.textContent = timeLeft;
    
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(startTime, true); 
            }
    
            timeDecayRate -= 100;
        }, timeDecayRate);
    }
    
    function displayQuestion() {
        if (timeLeft <= 0) return; 
        
        const question = allQuestions[currentQuestionIndex];
    
        gameData.questionsList.push(question.question);
    
        if (question.type === "drag-and-drop") {
            gameArea.innerHTML = `
               <div id="hint" class="hint" style="display: inline-block;"> <span style="font-weight: bold; color: #FF6347;">Подсказка:</span> Перетащите ответы в соответствующие группы.</div>
                <div class="question">${question.question}</div>
                <div class="group-container">
                    <div class="group" id="predators">
                        <h3>${question.headers.predators}</h3>
                        <div class="drop-area" id="drop-predators"></div>
                    </div>
                    <div class="group" id="herbivores">
                        <h3>${question.headers.herbivores}</h3>
                        <div class="drop-area" id="drop-herbivores"></div>
                    </div>
                </div>
                <div class="options" id="options"></div>
            `;
            const optionsContainer = document.getElementById("options");
    
            question.options.forEach((animal) => {
                const option = document.createElement("div");
                option.classList.add("option");
                option.setAttribute("draggable", "true");
                option.textContent = animal;
                option.addEventListener("dragstart", dragStart);
                optionsContainer.appendChild(option);
            });
    
            const dropPredators = document.getElementById("drop-predators");
            const dropHerbivores = document.getElementById("drop-herbivores");
    
            dropPredators.addEventListener("dragover", dragOver);
            dropHerbivores.addEventListener("dragover", dragOver);
    
            dropPredators.addEventListener("drop", dropAnimal.bind(null, "predators"));
            dropHerbivores.addEventListener("drop", dropAnimal.bind(null, "herbivores"));
        }
        else if (question.type === "text") {
            gameArea.innerHTML = `
                <div id="hint" class="hint" style="display: inline-block;"> <span style="font-weight: bold; color: #FF6347;">Подсказка:</span>Введите ответ и нажмите ENTER.</div>
                <div class="question">${question.question}</div>
                <input type="text" id="text-answer" class="answer-input" placeholder="Введите ответ">
                <div id="correct-answer" class="correct-answer" style="display: none;">Правильный ответ: ${question.correctAnswer}</div>
            `;
            const input = document.getElementById("text-answer");
    
            input.addEventListener('keydown', function(event) {
                if (event.key === "Enter") {
                    checkTextAnswer();
                }
            });
        }
    }
    
    function checkTextAnswer() {
        const input = document.getElementById("text-answer");
        const userAnswer = input.value.trim();
        const question = allQuestions[currentQuestionIndex];
        const correctAnswer = question.correctAnswer;
    
        gameData.answers.push(userAnswer);
        gameData.correctAnswers.push(correctAnswer);
    
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score += 5;
            input.style.backgroundColor = '#94ca95';
        } else {
            score -= 10;
            timeLeft -= 15;
            input.style.backgroundColor = '#da7272';
        }
    
        scoreValueElement.textContent = score;
    
        answeredQuestions++;
        currentQuestionIndex++;
    
        if (answeredQuestions < allQuestions.length && timeLeft > 0) {
            setTimeout(displayQuestion, 1000);
        } else {
            setTimeout(endGame, 1000);
        }
    }
    
    function dragStart(event) {
        event.dataTransfer.setData("text", event.target.textContent);
    }
    
    function dragOver(event) {
        event.preventDefault();
    }
    
    function dropAnimal(group, event) {
        const animal = event.dataTransfer.getData("text");
    
        if (usedAnimals.includes(animal)) {
            return;
        }
    
        const dropArea = event.target;
    
        const question = allQuestions[currentQuestionIndex];
        const correctGroup = question.correctAnswer[group];
    
        const placedAnimal = document.createElement("div");
        placedAnimal.textContent = animal;
        placedAnimal.classList.add("dropped-animal");
    
        let isCorrect = correctGroup.includes(animal);
    
        if (isCorrect) {
            placedAnimal.classList.add("correct");
            score += 5;
        } else {
            placedAnimal.classList.add("incorrect");
            score -= 5;
            timeLeft -= 10;
        }
    
        dropArea.appendChild(placedAnimal);
    
        usedAnimals.push(animal);
    
        const optionsContainer = document.getElementById("options");
        const optionToRemove = [...optionsContainer.children].find(option => option.textContent === animal);
        if (optionToRemove) {
            optionsContainer.removeChild(optionToRemove);
        }
    
        scoreValueElement.textContent = score;
    
        if (group === "predators") {
            gameData.groups.predators += animal + ", ";
        } else {
            gameData.groups.herbivores += animal + ", ";
        }
    
        checkAnswer();
    }
    
    function checkAnswer() {
        const question = allQuestions[currentQuestionIndex];
        const predatorsGroup = document.getElementById("drop-predators");
        const herbivoresGroup = document.getElementById("drop-herbivores");
    
        const placedPredators = [...predatorsGroup.children].map(child => child.textContent);
        const placedHerbivores = [...herbivoresGroup.children].map(child => child.textContent);
    
        if (placedPredators.length === question.correctAnswer.predators.length &&
            placedHerbivores.length === question.correctAnswer.herbivores.length) {
            score += 10;
            scoreValueElement.textContent = score;
    
            gameData.correctAnswers.push({
                predators: question.correctAnswer.predators,
                herbivores: question.correctAnswer.herbivores
            });
    
            answeredQuestions++;
            currentQuestionIndex++;
    
            if (answeredQuestions < allQuestions.length && timeLeft > 0) {
                setTimeout(displayQuestion, 1000);
            } else {
                setTimeout(endGame, 1000);
            }
        }
    }
    
    function endGame(startTime, gameOver = false) {
        clearInterval(timerInterval);
        gameData.score = score;
        gameData.timeLeft = timeLeft;
        gameData.timeSpent = Math.round((Date.now() - startTime) / 1000);
    
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory_' + localStorage.getItem('gameUsername'))) || [];
        gameHistory.push(gameData);
        localStorage.setItem('gameHistory_' + localStorage.getItem('gameUsername'), JSON.stringify(gameHistory));
    
        const username = localStorage.getItem('gameUsername');
        if (username) {
            updateUserRanking(username, score, gameData.timeLeft);
        }
    
        if (gameOver || score < 5 || timeLeft <= 0) {
            gameArea.innerHTML = `<p>Игра завершена. Ваш результат: ${score} баллов.</p>`;
            retryButton.style.display = 'inline-block';
            nextLevelButton.style.display = 'none';
        } else {
            const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false];
            completedLevels[1] = true;
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    
            gameArea.innerHTML = `<p>Поздравляем! Вы успешно прошли уровень 2!</p>`;
            nextLevelButton.style.display = 'inline-block';
            retryButton.style.display = 'none';
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
        window.location.href = 'level3.html';
    });
    
    const questions = getRandomQuestions();
    displayQuestion();
    startTimer();
});
