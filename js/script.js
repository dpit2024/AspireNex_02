document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const quizCreation = document.getElementById('quiz-creation');
    const quizInterface = document.getElementById('quiz-interface');
    const quizResult = document.getElementById('quiz-result');
    
    // Loader timeout simulation
    setTimeout(() => {
        loader.style.display = 'none';
        quizCreation.style.display = 'block';
    }, 2000);

    const quizForm = document.getElementById('quiz-form');
    const addQuestionBtn = document.getElementById('add-question');
    const questionContainer = document.getElementById('question-container');
    let questionCount = 1;

    addQuestionBtn.addEventListener('click', () => {
        questionCount++;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <label for="question-${questionCount}">Question ${questionCount}:</label>
            <input type="text" id="question-${questionCount}" name="question-${questionCount}" required>
            <div class="options">
                <label for="q${questionCount}-option1">Option 1:</label>
                <input type="text" id="q${questionCount}-option1" name="q${questionCount}-option1" required>
                <label for="q${questionCount}-option2">Option 2:</label>
                <input type="text" id="q${questionCount}-option2" name="q${questionCount}-option2" required>
                <label for="q${questionCount}-option3">Option 3:</label>
                <input type="text" id="q${questionCount}-option3" name="q${questionCount}-option3" required>
                <label for="q${questionCount}-option4">Option 4:</label>
                <input type="text" id="q${questionCount}-option4" name="q${questionCount}-option4" required>
            </div>
            <label for="correct-answer-${questionCount}">Correct Answer:</label>
            <select id="correct-answer-${questionCount}" name="correct-answer-${questionCount}" required>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
            </select>
        `;
        questionContainer.appendChild(questionDiv);
    });

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quizForm);
        const quizData = [];
        
        for (let i = 1; i <= questionCount; i++) {
            const question = formData.get(`question-${i}`);
            const options = [
                formData.get(`q${i}-option1`),
                formData.get(`q${i}-option2`),
                formData.get(`q${i}-option3`),
                formData.get(`q${i}-option4`)
            ];
            const correctAnswer = formData.get(`correct-answer-${i}`);
            quizData.push({ question, options, correctAnswer });
        }

        localStorage.setItem('quizData', JSON.stringify(quizData));
        quizCreation.style.display = 'none';
        loadQuiz();
    });

    const loadQuiz = () => {
        const quizData = JSON.parse(localStorage.getItem('quizData'));
        let currentQuestionIndex = 0;
        let score = 0;
        let quizTimer;
        let timeLeft = 30;

        quizInterface.style.display = 'block';

        const quizQuestion = document.getElementById('quiz-question');
        const quizOptions = document.getElementById('quiz-options');
        const prevQuestionBtn = document.getElementById('prev-question');
        const nextQuestionBtn = document.getElementById('next-question');
        const submitQuizBtn = document.getElementById('submit-quiz');
        const pauseQuizBtn = document.getElementById('pause-quiz');

        const loadQuestion = () => {
            const currentQuestion = quizData[currentQuestionIndex];
            quizQuestion.textContent = currentQuestion.question;
            quizOptions.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.innerHTML = `
                    <input type="radio" id="option-${index + 1}" name="option" value="${index + 1}">
                    <label for="option-${index + 1}">${option}</label>
                `;
                quizOptions.appendChild(optionDiv);
            });
            startTimer();
        };

        const startTimer = () => {
            timeLeft = 30;
            quizTimer = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(quizTimer);
                    alert("Time's up! Moving to the next question.");
                    nextQuestion();
                } else {
                    timeLeft--;
                    pauseQuizBtn.textContent = `Pause (${timeLeft}s)`;
                }
            }, 1000);
        };

        const nextQuestion = () => {
            clearInterval(quizTimer);
            const selectedOption = document.querySelector('input[name="option"]:checked');
            if (selectedOption && selectedOption.value == quizData[currentQuestionIndex].correctAnswer) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                showResult();
            }
        };

        const showResult = () => {
            quizInterface.style.display = 'none';
            quizResult.style.display = 'block';
            document.getElementById('result-text').textContent = `Your score is ${score} out of ${quizData.length}`;
        };

        prevQuestionBtn.addEventListener('click', () => {
            clearInterval(quizTimer);
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion();
            }
        });

        nextQuestionBtn.addEventListener('click', nextQuestion);

        submitQuizBtn.addEventListener('click', showResult);

        pauseQuizBtn.addEventListener('click', () => {
            if (quizTimer) {
                clearInterval(quizTimer);
                quizTimer = null;
                pauseQuizBtn.textContent = 'Resume';
            } else {
                startTimer();
                pauseQuizBtn.textContent = `Pause (${timeLeft}s)`;
            }
        });

        loadQuestion();
    };

    document.getElementById('restart-quiz').addEventListener('click', () => {
        quizResult.style.display = 'none';
        quizCreation.style.display = 'block';
    });
});
