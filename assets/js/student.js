document.addEventListener('DOMContentLoaded', function () {
    const questionCards = document.querySelectorAll('[data-save-question]');
    questionCards.forEach((card) => {
        card.addEventListener('click', function () {
            const questionTitle = this.dataset.saveQuestion;
            let saved = JSON.parse(localStorage.getItem('careerPilotSavedQuestions') || '[]');
            if (!saved.includes(questionTitle)) {
                saved.push(questionTitle);
                localStorage.setItem('careerPilotSavedQuestions', JSON.stringify(saved));
            }
            alert('Question saved to your saved list.');
        });
    });

    const solveButtons = document.querySelectorAll('[data-solved]');
    solveButtons.forEach((button) => {
        button.addEventListener('click', function () {
            this.textContent = 'Solved';
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-success');
        });
    });

    const progressBars = document.querySelectorAll('[data-progress]');
    progressBars.forEach((bar) => {
        const value = parseInt(bar.dataset.progress, 10) || 0;
        bar.style.width = value + '%';
        bar.setAttribute('aria-valuenow', value);
    });

    const quizForm = document.getElementById('aptitudeQuiz');
    if (quizForm) {
        const options = document.querySelectorAll('.quiz-option');
        let currentIndex = 0;
        const questions = [
            {
                question: 'If a train travels 120 km in 2 hours, what is its speed?',
                options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
                answer: '60 km/h'
            },
            {
                question: 'Which of the following is an example of a prime number?',
                options: ['21', '29', '33', '49'],
                answer: '29'
            },
            {
                question: 'Choose the correctly spelled word.',
                options: ['Acomodate', 'Accommodate', 'Acommadate', 'Acomodate'],
                answer: 'Accommodate'
            }
        ];

        const questionText = document.getElementById('quizQuestion');
        const optionButtons = document.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('nextQuestion');
        const prevBtn = document.getElementById('prevQuestion');
        const submitBtn = document.getElementById('submitQuiz');
        const resultBox = document.getElementById('quizResult');
        const answers = new Array(questions.length).fill(null);

        function renderQuestion() {
            const q = questions[currentIndex];
            questionText.textContent = `${currentIndex + 1}. ${q.question}`;
            optionButtons.forEach((button, idx) => {
                button.textContent = q.options[idx];
                button.classList.toggle('selected', answers[currentIndex] === q.options[idx]);
            });
            prevBtn.disabled = currentIndex === 0;
        }

        optionButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const selected = this.textContent;
                answers[currentIndex] = selected;
                optionButtons.forEach((btn) => btn.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        nextBtn.addEventListener('click', function () {
            if (currentIndex < questions.length - 1) currentIndex++;
            renderQuestion();
        });

        prevBtn.addEventListener('click', function () {
            if (currentIndex > 0) currentIndex--;
            renderQuestion();
        });

        submitBtn.addEventListener('click', function () {
            let score = 0;
            questions.forEach((q, idx) => {
                if (answers[idx] === q.answer) score++;
            });
            resultBox.innerHTML = `<strong>Quiz Completed:</strong> ${score}/${questions.length} correct.`;
        });

        renderQuestion();
    }

    const interviewButton = document.getElementById('startInterview');
    if (interviewButton) {
        interviewButton.addEventListener('click', function () {
            window.location.href = 'ai-interview.html';
        });
    }

    const reportButton = document.getElementById('generateReport');
    if (reportButton) {
        reportButton.addEventListener('click', function () {
            window.location.href = 'ai-interview-report.html';
        });
    }

    const interviewQuestion = document.getElementById('interviewQuestion');
    const interviewState = document.getElementById('interviewState');
    const listeningState = document.getElementById('listeningState');
    const speakerWindow = document.getElementById('speakerWindow');
    const candidateWindow = document.getElementById('candidateWindow');
    const transcriptText = document.getElementById('transcriptText');
    const interviewSummary = document.getElementById('interviewSummary');
    const timerValue = document.getElementById('interviewTimer');

    if (interviewQuestion) {
        let interviewSeconds = 155;
        const timerInterval = setInterval(() => {
            interviewSeconds += 1;
            const minutes = String(Math.floor(interviewSeconds / 60)).padStart(2, '0');
            const seconds = String(interviewSeconds % 60).padStart(2, '0');
            if (timerValue) timerValue.textContent = `${minutes}:${seconds}`;
        }, 1000);

        const setActiveSpeaker = (speaker) => {
            if (!speakerWindow || !candidateWindow) return;

            const isAiSpeaker = speaker === 'ai';
            speakerWindow.classList.toggle('active-speaker', isAiSpeaker);
            speakerWindow.classList.toggle('inactive-speaker', !isAiSpeaker);
            candidateWindow.classList.toggle('active-candidate', !isAiSpeaker);
        };

        const addTranscript = (message) => {
            if (!transcriptText) return;
            const p = document.createElement('p');
            p.className = 'mb-2';
            p.textContent = message;
            transcriptText.appendChild(p);
        };

        const typeText = (text) => {
            return new Promise((resolve) => {
                let i = 0;
                interviewQuestion.textContent = '';
                interviewQuestion.classList.remove('is-complete');
                const wrapper = interviewQuestion.closest('.question-copy-wrap');
                if (wrapper) {
                    wrapper.classList.remove('question-transition');
                    void wrapper.offsetWidth;
                    wrapper.classList.add('question-transition');
                }
                const typingInterval = setInterval(() => {
                    interviewQuestion.textContent += text.charAt(i);
                    i += 1;
                    if (i > text.length) {
                        clearInterval(typingInterval);
                        interviewQuestion.classList.add('is-complete');
                        setTimeout(resolve, 120);
                    }
                }, 32);
            });
        };

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const runInterviewSequence = async () => {
            if (interviewState) {
                interviewState.textContent = 'AI Interviewer • Online';
            }
            if (listeningState) {
                listeningState.textContent = 'Listening...';
            }
            if (interviewSummary) {
                interviewSummary.textContent = 'AI speaking indicator active';
            }
            setActiveSpeaker('ai');

            await typeText('Hello! Welcome to your AI Mock Interview.');
            addTranscript('AI Interviewer: Hello! Welcome to your AI Mock Interview.');
            await wait(1200);

            await typeText('Tell me about yourself and your technical skills.');
            addTranscript('AI Interviewer: Tell me about yourself and your technical skills.');
            if (interviewSummary) {
                interviewSummary.textContent = 'Candidate turn active';
            }
            if (interviewState) {
                interviewState.textContent = 'Your turn';
            }
            if (listeningState) {
                listeningState.textContent = 'Listening...';
            }
            setActiveSpeaker('candidate');
            await wait(2100);

            if (interviewState) {
                interviewState.textContent = 'AI Interviewer • Online';
            }
            if (interviewSummary) {
                interviewSummary.textContent = 'AI speaking indicator active';
            }
            setActiveSpeaker('ai');

            await typeText('Why do you want to join our company?');
            addTranscript('AI Interviewer: Why do you want to join our company?');
            if (interviewSummary) {
                interviewSummary.textContent = 'Candidate turn active';
            }
            if (interviewState) {
                interviewState.textContent = 'Your turn';
            }
            if (listeningState) {
                listeningState.textContent = 'Listening...';
            }
            setActiveSpeaker('candidate');
            await wait(2100);

            if (interviewQuestion) {
                interviewQuestion.textContent = 'Interview Complete';
                interviewQuestion.classList.add('is-complete');
            }
            if (interviewState) {
                interviewState.textContent = 'Interview Complete';
            }
            if (listeningState) {
                listeningState.textContent = 'Complete';
            }
            if (interviewSummary) {
                interviewSummary.textContent = 'Interview finished successfully';
            }
            setActiveSpeaker('ai');
            addTranscript('AI Interviewer: Interview Complete');
            clearInterval(timerInterval);
        };

        runInterviewSequence();
    }
});
