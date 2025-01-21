document.addEventListener('DOMContentLoaded', function () {
    const greetingElement = document.getElementById('greeting');
    const username = localStorage.getItem('gameUsername');

    if (username) {
        greetingElement.innerHTML = `Добро пожаловать, ${username}!`;
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const level1Button = document.getElementById('level1-button');
    const level2Button = document.getElementById('level2-button');
    const level3Button = document.getElementById('level3-button');
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false];

    function updateLevelButtons() {
        if (completedLevels[0]) {
            level2Button.classList.remove('locked');
            level2Button.querySelector('span').remove(); // Убираем иконку 🔒
        }
        if (completedLevels[1]) {
            level3Button.classList.remove('locked');
            level3Button.querySelector('span').remove(); // Убираем иконку 🔒
        }
    }

    level1Button.addEventListener('click', () => {
        window.location.href = '../page/level/level1.html';
    });

    level2Button.addEventListener('click', () => {
        if (!completedLevels[0]) {
            alert('Пройдите уровень 1, чтобы открыть этот уровень.');
            return;
        }
        window.location.href = '../page/level/level2.html';
    });

    level3Button.addEventListener('click', () => {
        if (!completedLevels[1]) {
            alert('Пройдите уровень 2, чтобы открыть этот уровень.');
            return;
        }
        window.location.href = '../page/level/level3.html';
    });
    updateLevelButtons();
});


function completeLevel(level) {
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [false, false, false];
    completedLevels[level - 1] = true; 
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
}


document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', function (event) {
        event.preventDefault(); 

        localStorage.removeItem('completedLevels');
        
        localStorage.removeItem('gameUsername');
        
        window.location.href = '../index.html';
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('gameUsername');

    if (!username) {
        localStorage.removeItem('completedLevels');
    } else {
        if (!localStorage.getItem('completedLevels')) {
            localStorage.setItem('completedLevels', JSON.stringify([false, false])); 
        }
    }

    if (typeof updateLevelButtons === 'function') {
        updateLevelButtons();
    }
});