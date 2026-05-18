// Interacciones para la página de membresía
(function(){
    const mainImg = document.getElementById('mb-main-img');
    const priceEl = document.querySelector('.mb-producto-precio');
    if (!mainImg || !priceEl) return;

    const plans = Array.from(document.querySelectorAll('.mb-plan'));
    const addButtons = Array.from(document.querySelectorAll('.mb-btn-carrito'));
    const cartLink = document.querySelector('.cart-link');

    const original = { src: mainImg.src, price: priceEl.textContent };

    plans.forEach(plan => {
        plan.addEventListener('mouseenter', function(){
            const img = plan.dataset.image;
            const price = plan.dataset.price;
            if (img) mainImg.src = img;
            if (price) priceEl.textContent = price;
            plan.classList.add('mb-plan-hover');
        });
        plan.addEventListener('mouseleave', function(){
            mainImg.src = original.src;
            priceEl.textContent = original.price;
            plan.classList.remove('mb-plan-hover');
        });
    });

    // Animación y lógica de añadir al carrito
    addButtons.forEach(btn => {
        btn.addEventListener('click', function(e){
            e.preventDefault();
            // animación del botón
            btn.classList.add('added');
            setTimeout(()=> btn.classList.remove('added'), 900);

            // iluminar nav 'Carro'
            if (cartLink) {
                cartLink.classList.add('cart-flash');
                setTimeout(()=> cartLink.classList.remove('cart-flash'), 1000);
            }

            // opcional: incrementar contador (simple)
            // crear pequeño toast
            const toast = document.createElement('div');
            toast.className = 'mb-toast';
            toast.textContent = 'Añadido al carrito';
            document.body.appendChild(toast);
            setTimeout(()=> toast.classList.add('visible'), 10);
            setTimeout(()=>{ toast.classList.remove('visible'); setTimeout(()=> toast.remove(),300); }, 1500);
        });
    });

    // Formulario de contacto (animación envío)
    const form = document.getElementById('mb-contact-form');
    const sendBtn = document.getElementById('mb-send-btn');
    if (form && sendBtn) {
        sendBtn.addEventListener('click', function(e){
            e.preventDefault();
            // Validación básica
            const email = document.getElementById('mb-email').value.trim();
            const name = document.getElementById('mb-nombre').value.trim();
            if (!email || !name) {
                // mostrar error temporal
                sendBtn.classList.add('error');
                setTimeout(()=> sendBtn.classList.remove('error'), 900);
                return;
            }

            // Simular envío
            sendBtn.disabled = true;
            sendBtn.classList.add('sending');
            const oldText = sendBtn.textContent;
            sendBtn.textContent = 'Enviando...';

            setTimeout(()=>{
                sendBtn.classList.remove('sending');
                sendBtn.classList.add('sent');
                sendBtn.textContent = 'Enviado ✓';
                form.classList.add('mb-form-sent');
                // breve animación de check
                setTimeout(()=>{
                    sendBtn.classList.remove('sent');
                    sendBtn.disabled = false;
                    sendBtn.textContent = oldText;
                    form.classList.remove('mb-form-sent');
                    // opcional: limpiar campos
                    form.querySelectorAll('input').forEach(i=> i.value='');
                }, 2200);
            }, 900);
        });
    }
})();
