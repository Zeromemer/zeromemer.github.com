const question = document.getElementById('question');
const buttons = document.getElementById('buttons').children;
const questionsInput = document.getElementById('questions-input');

let questions;
questionsInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.readAsText(file);
  
    reader.onload = function() {
        questions = JSON.parse(reader.result);

        loadQuestion();
    };
});

function loadQuestion() {
    const questionKeys = Object.keys(questions);
    const elementToQuestion = Math.floor(Math.random() * questionKeys.length);
    questionKeys.splice(elementToQuestion, 1);
    const elementToQuestionProperties = Object.keys(questions[questionKeys[elementToQuestion]]);
    const propertyToQuestion = elementToQuestionProperties[Math.floor(Math.random() * elementToQuestionProperties.length)];

    const wrongAnswers = new Array(3);
    for (let i = 0; i < 3; i++) {
        
    }
}