// Simple login for Laboratorio
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('lab-btn-entrar');
    const emailInput = document.getElementById('lab-email');
    const passInput = document.getElementById('lab-password');
    const msg = document.getElementById('lab-error-msg');
    const toggle = document.getElementById('lab-pass-toggle');

    if (toggle && passInput) {
        toggle.addEventListener('click', () => {
            passInput.type = passInput.type === 'password' ? 'text' : 'password';
        });
    }

    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = (emailInput.value || '').trim();
        const pass = (passInput.value || '').trim();
        msg.textContent = '';

        if (email === 'materiaviva@gmail.com' && pass === '0000') {
            // success -> redirect
            window.location.href = 'interiorlab.html';
            return;
        }

        msg.textContent = 'Credenciales incorrectas.';
        msg.classList.add('lab-error-visible');
        setTimeout(() => msg.classList.remove('lab-error-visible'), 2000);
    });
});

