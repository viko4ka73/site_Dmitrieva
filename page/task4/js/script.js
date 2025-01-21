const latinPhrases = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra",
    "Veni, vidi, vici",
    "Carpe diem",
    "Alea iacta est",
    "In vino veritas",
    "Tempus fugit",
    "Ad astra per aspera"
];

        const translations = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам",
    "Пришел, увидел, победил",
    "Лови момент",
    "Жребий брошен",
    "Истина в вине",
    "Время летит",
    "К звездам через тернии"
];

let phrasesLeft = [...latinPhrases.keys()];
let clickCount = 0;

console.log(phrasesLeft);

document.getElementById("display-phrase").addEventListener("click", () => {
    if (phrasesLeft.length === 0) {
        alert("Фразы закончились");
        return;
    }

    clickCount++;
    const randomIndex = Math.floor(Math.random() * phrasesLeft.length);
    const phraseIndex = phrasesLeft.splice(randomIndex, 1)[0];
    const container = document.getElementById("phrases-container");

    const phraseElement = document.createElement("div");
    phraseElement.className = clickCount % 2 === 0 ? "class1" : "class2";
    phraseElement.textContent = `${latinPhrases[phraseIndex]} - ${translations[phraseIndex]}`;
    container.appendChild(phraseElement);
});

document.getElementById("recolor").addEventListener("click", () => {
    const phrases = document.querySelectorAll("#phrases-container div:nth-child(even)");
    phrases.forEach(phrase => {
        phrase.classList.add("bold");
    });
});
document.getElementById("create-list").addEventListener("click", () => {
    const list = document.getElementById("nested-list");
    list.innerHTML = "";
    const container = document.getElementById("phrases-container");
    const displayedPhrases = container.querySelectorAll("div");

    displayedPhrases.forEach(phraseElement => {
        const listItem = document.createElement("li");
        listItem.textContent = phraseElement.textContent.split(" - ")[0];
        listItem.className = phraseElement.className + "-list";

        const subList = document.createElement("ul");
        const subItem = document.createElement("li");
        subItem.textContent = phraseElement.textContent.split(" - ")[1];
        subItem.className = "nested-sublist";
        subList.appendChild(subItem);

        listItem.appendChild(subList);
        list.appendChild(listItem);
    });
});