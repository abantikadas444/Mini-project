const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlink Text Management Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which language is used to style webpages?",
        options: [
            "HTML",
            "CSS",
            "Python",
            "SQL"
        ],
        answer: 1
    },
    {
        question: "Which language adds interactivity to webpages?",
        options: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        answer: 2
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById("question");
const optionsContainer = document.querySelector(".options");
const resultElement = document.getElementById("result");

function loadQuestion() {
    const question = questions[currentQuestion];

    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";
    resultElement.textContent = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.classList.add("option");
        button.textContent = option;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedAnswer === question.answer) {
        score++;
        resultElement.textContent = "Correct! 🎉";
    } else {
        resultElement.textContent = "Wrong answer. Try again!";
    }

    document.getElementById("next-button").style.display = "block";
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionElement.textContent = "Quiz Completed! 🎉";

    optionsContainer.innerHTML = `
        <h2>Your Score: ${score} / ${questions.length}</h2>
        <button class="btn" onclick="restartQuiz()">Try Again</button>
        <a href="tutorials.html" class="btn">Back to Tutorials</a>
    `;

    resultElement.textContent = getFeedback();
    document.getElementById("next-button").style.display = "none";
}

function getFeedback() {
    const percentage = (score / questions.length) * 100;

    if (percentage >= 90) {
        return "Excellent! 🌟 You have mastered this topic.";
    }

    if (percentage >= 70) {
        return "Great job! 👍 You understand most of the concepts.";
    }

    if (percentage >= 50) {
        return "Good effort! Review the tutorial and try again.";
    }

    return "Keep practicing! 💪 Go through the tutorial again and retry the quiz.";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;

    document.getElementById("next-button").style.display = "none";

    loadQuestion();
}

loadQuestion();