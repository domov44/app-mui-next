const fs = require('fs');
const path = require('path');

function containsShockingWords(chaine) {
    const forbiddenWordsPath = path.join(__dirname, '../forbidden_words.json');
    const forbiddenWordsData = fs.readFileSync(forbiddenWordsPath);
    const forbiddenWords = JSON.parse(forbiddenWordsData).forbiddenWords;

    const wordsAndPlurals = forbiddenWords.reduce((acc, word) => {
        acc.push(word);
        acc.push(word + 's');
        return acc;
    }, []);

    // Création des expressions régulières pour chaque mot interdit et sa forme plurielle
    const forbiddenRegex = wordsAndPlurals.map(word => new RegExp(`\\b${word}\\b`, 'i'));

    // Vérifie chaque expression régulière
    for (let regex of forbiddenRegex) {
        if (regex.test(chaine)) {
            return true;
        }
    }
    return false;
}

function containsShockingWordsInSteps(steps) {
    for (let step of steps) {
        if (containsShockingWords(step.description)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    containsShockingWords,
    containsShockingWordsInSteps
};

