document.addEventListener('DOMContentLoaded', function () {
    const loadComponent = (selector, url) => {
        const target = document.querySelector(selector);
        if (!target) return;

        fetch(url)
            .then((res) => res.text())
            .then((html) => {
                target.innerHTML = html;
            })
            .catch(() => {
                target.innerHTML = '<div class="text-muted">Component could not be loaded.</div>';
            });
    };

    loadComponent('[data-component="student-sidebar"]', 'student/sidebar.html');
    loadComponent('[data-component="student-navbar"]', 'student/navbar.html');
    loadComponent('[data-component="student-footer"]', 'student/footer.html');
    loadComponent('[data-component="admin-sidebar"]', 'admin/sidebar.html');
    loadComponent('[data-component="admin-topbar"]', 'admin/topbar.html');
});
