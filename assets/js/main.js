document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('[data-bs-toggle="offcanvas"]');
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            document.body.classList.toggle('sidebar-open');
        });
    }

    const yearNode = document.getElementById('currentYear');
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }

    const savedState = localStorage.getItem('careerPilotState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        const progress = document.querySelectorAll('[data-progress-value]');
        progress.forEach((bar) => {
            const val = parsed[bar.dataset.progressValue];
            if (typeof val === 'number') {
                bar.style.width = val + '%';
            }
        });
    }

    const progressBars = document.querySelectorAll('[data-progress-animate]');
    progressBars.forEach((bar) => {
        const target = Number(bar.dataset.progressAnimate) || 0;
        bar.style.width = '0%';
        requestAnimationFrame(() => {
            setTimeout(() => {
                bar.style.width = target + '%';
            }, 120);
        });
    });

    const heroAiQuestion = document.getElementById('heroAiQuestion');
    if (heroAiQuestion) {
        const questions = [
            'Tell me about yourself and your technical skills.',
            'Why should we hire you?'
        ];

        let questionIndex = 0;

        function typeText(text, callback) {
            let index = 0;
            heroAiQuestion.textContent = '';

            const interval = setInterval(() => {
                heroAiQuestion.textContent += text[index] || '';
                index += 1;

                if (index >= text.length) {
                    clearInterval(interval);
                    if (typeof callback === 'function') {
                        setTimeout(callback, 1100);
                    }
                }
            }, 32);
        }

        function cycleQuestions() {
            const nextQuestion = questions[questionIndex];
            questionIndex = (questionIndex + 1) % questions.length;
            typeText(nextQuestion, cycleQuestions);
        }

        cycleQuestions();
    }
});
