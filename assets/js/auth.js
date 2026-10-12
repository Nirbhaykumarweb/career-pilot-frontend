document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            if (!email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }

            localStorage.setItem('careerPilotUser', JSON.stringify({ email }));
            window.location.href = 'student/dashboard.html';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('mobile').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const terms = document.getElementById('terms');

            if (!fullName || !email || !phone || !password || !confirmPassword) {
                alert('Please fill in all fields.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }

            if (!terms || !terms.checked) {
                alert('Please agree to the terms and conditions.');
                return;
            }

            localStorage.setItem('careerPilotUser', JSON.stringify({ fullName, email }));
            alert('Registration successful!');
            window.location.href = 'login.html';
        });
    }

    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('forgotEmail').value.trim();
            if (!email) {
                alert('Please enter your registered email.');
                return;
            }
            alert('Password reset link has been generated for demo purposes.');
        });
    }
});
