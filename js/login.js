/* ============================================
   BARAMATI TOURISM PORTAL – Login Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            // Simple Admin Check
            if (email === 'admin@baramati.com' && password === 'admin123') {
                localStorage.setItem('isAdminLoggedIn', 'true');
                alert('Login Successful! Redirecting to Admin Panel...');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid Credentials. For demo, use: admin@baramati.com / admin123');
            }
        });
    }
});
