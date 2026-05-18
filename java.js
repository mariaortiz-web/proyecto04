/* ════════════════════════════════════════
   NAVBAR — cambia color del texto según
   el fondo de la sección visible
════════════════════════════════════════ */

const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('[data-theme]');

function updateNav() {
    const navBottom = navbar.getBoundingClientRect().bottom + 2;
    let currentTheme = 'dark'; // valor por defecto (hero es oscuro)

    sections.forEach(function(sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= navBottom && rect.bottom >= navBottom) {
            currentTheme = sec.dataset.theme;
        }
    });

    navbar.classList.toggle('on-dark',  currentTheme === 'dark');
    navbar.classList.toggle('on-light', currentTheme === 'light');
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // ejecutar al cargar la página


/* ════════════════════════════════════════
   SCROLL REVEAL — anima elementos al
   entrar en el viewport
════════════════════════════════════════ */

const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // dejar de observar tras animar
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
});
/* ════════════════════════════════════════
   SLIDER LABORATORIO
════════════════════════════════════════ */

(function () {
    const slides   = document.querySelectorAll('.lab-slide');
    const dots     = document.querySelectorAll('.lab-dot');
    const btnPrev  = document.querySelector('.lab-arrow-prev');
    const btnNext  = document.querySelector('.lab-arrow-next');
    let current    = 0;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); });
    });
})();
/* ════════════════════════════════════════
   TIENDA — filtros de productos
════════════════════════════════════════ */

(function () {
    const filtros   = document.querySelectorAll('.filtro-btn');
    const productos = document.querySelectorAll('.tienda-grid .latest-item');

    if (!filtros.length) return;

    filtros.forEach(function (btn) {
        btn.addEventListener('click', function () {

            /* Actualizar botón activo */
            filtros.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filtro = btn.dataset.filter;

            productos.forEach(function (prod) {
                var categorias = prod.dataset.category || '';

                if (filtro === 'all' || categorias.includes(filtro)) {
                    prod.style.display = '';
                } else {
                    prod.style.display = 'none';
                }
            });
        });
    });
})();