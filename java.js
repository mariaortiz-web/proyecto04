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

/* ════════════════════════════════════════
   CARRO — lógica de cantidades, totales,
   eliminación y cupón de descuento
════════════════════════════════════════ */

(function () {

    /* ── Precios base por item ── */
    var precios = {
        '1': 20.5,
        '2': 20.5,
        '3': 20.5
    };

    var cantidades = {
        '1': 1,
        '2': 1,
        '3': 1
    };

    var descuento = 0;

    /* Cupones válidos */
    var cupones = {
        'MARCA10': 10,
        'BIENVENIDO': 15,
        '1234': 20
    };

    /* ── Actualizar total de un item ── */
    function actualizarItem(id) {
        var item = document.querySelector('.carro-item[data-id="' + id + '"]');
        if (!item) return;

        var cant = cantidades[id];
        var precio = precios[id];

        item.querySelector('.carro-cant-num').textContent = cant;
        item.querySelector('.carro-item-total').textContent = '€ ' + (precio * cant).toFixed(1);

        actualizarResumen();
    }

    /* ── Calcular y mostrar resumen ── */
    function actualizarResumen() {
        var subtotal = 0;

        Object.keys(cantidades).forEach(function (id) {
            if (precios[id] !== undefined) {
                subtotal += precios[id] * cantidades[id];
            }
        });

        var descuentoEuros = (subtotal * descuento / 100);
        var total = subtotal - descuentoEuros;

        var elSubtotal  = document.getElementById('carro-subtotal');
        var elDescuento = document.getElementById('carro-descuento');
        var elTotal     = document.getElementById('carro-total');

        if (elSubtotal)  elSubtotal.textContent  = '€ ' + subtotal.toFixed(1);
        if (elDescuento) elDescuento.textContent  = descuento > 0
            ? '− € ' + descuentoEuros.toFixed(1) + ' (' + descuento + '%)'
            : '— €';
        if (elTotal)     elTotal.textContent      = '€ ' + total.toFixed(1);

        comprobarVacio();
    }

    /* ── Comprobar si el carro está vacío ── */
    function comprobarVacio() {
        var itemsRestantes = document.querySelectorAll('.carro-item');
        var vacio = document.getElementById('carro-vacio');
        var layout = document.querySelector('.carro-layout');

        if (itemsRestantes.length === 0) {
            if (layout) layout.style.display = 'none';
            if (vacio)  vacio.style.display  = 'flex';
        }
    }

    /* ── Botones + y − de cantidad ── */
    document.querySelectorAll('.carro-cant-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id     = btn.dataset.id;
            var accion = btn.dataset.action;

            if (accion === 'sumar') {
                cantidades[id] = (cantidades[id] || 1) + 1;
            } else if (accion === 'restar') {
                if (cantidades[id] > 1) {
                    cantidades[id]--;
                }
            }

            actualizarItem(id);
        });
    });

    /* ── Eliminar item ── */
    document.querySelectorAll('.carro-item-eliminar').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id   = btn.dataset.id;
            var item = document.querySelector('.carro-item[data-id="' + id + '"]');
            var sep  = item ? item.nextElementSibling : null;

            if (item) {
                item.classList.add('eliminando');

                setTimeout(function () {
                    item.remove();
                    if (sep && sep.classList.contains('carro-sep')) sep.remove();
                    delete precios[id];
                    delete cantidades[id];
                    actualizarResumen();
                }, 320);
            }
        });
    });

    /* ── Cupón de descuento ── */
    var btnCupon  = document.getElementById('carro-cupon-btn');
    var inputCupon = document.getElementById('carro-cupon-input');
    var msgCupon  = document.getElementById('carro-cupon-msg');

    if (btnCupon && inputCupon) {
        btnCupon.addEventListener('click', function () {
            var codigo = inputCupon.value.trim().toUpperCase();

            if (cupones[codigo]) {
                descuento = cupones[codigo];
                msgCupon.textContent  = '✓ Código aplicado: ' + descuento + '% de descuento';
                msgCupon.className    = 'carro-cupon-msg ok';
                inputCupon.disabled   = true;
                btnCupon.disabled     = true;
                btnCupon.style.opacity = '0.3';
            } else {
                msgCupon.textContent = '✗ Código no válido';
                msgCupon.className   = 'carro-cupon-msg err';
                inputCupon.value     = '';
            }

            actualizarResumen();
        });

        /* Aplicar con Enter */
        inputCupon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') btnCupon.click();
        });
    }

    /* ── Botón tramitar pedido ── */
    var btnTramitar = document.getElementById('carro-tramitar-btn');

    if (btnTramitar) {
        btnTramitar.addEventListener('click', function () {
            var itemsRestantes = document.querySelectorAll('.carro-item');

            if (itemsRestantes.length === 0) {
                return;
            }

            /* Feedback visual */
            var textoOriginal    = btnTramitar.textContent;
            btnTramitar.textContent  = '✓ Procesando...';
            btnTramitar.disabled = true;

             setTimeout(function () {
                 btnTramitar.textContent  = textoOriginal;
                 btnTramitar.disabled = false;
                 window.location.href = 'pagar.html';
             }, 2000);
        });
    }

    /* Inicializar totales al cargar */
    actualizarResumen();

})();
/* ════════════════════════════════════════
   PAGO — validación, formateo y modal
════════════════════════════════════════ */

(function () {

    /* ── Cupón ── */
    var cupones = { 'MARCA10': 10, 'BIENVENIDO': 15, '1234': 20 };
    var descuento = 0;
    var subtotalBase = 61.5;

    var btnCupon   = document.getElementById('pago-cupon-btn');
    var inputCupon = document.getElementById('pago-cupon-input');
    var msgCupon   = document.getElementById('pago-cupon-msg');

    function actualizarTotales() {
        var euros = subtotalBase * descuento / 100;
        var total = subtotalBase - euros;

        document.getElementById('pago-subtotal').textContent = '€ ' + subtotalBase.toFixed(1);
        document.getElementById('pago-total').textContent    = '€ ' + total.toFixed(1);

        var lineaDesc = document.getElementById('pago-linea-descuento');
        if (descuento > 0) {
            lineaDesc.style.display = 'flex';
            document.getElementById('pago-descuento').textContent =
                '− € ' + euros.toFixed(1) + ' (' + descuento + '%)';
        }
    }

    if (btnCupon && inputCupon) {
        btnCupon.addEventListener('click', function () {
            var cod = inputCupon.value.trim().toUpperCase();
            if (cupones[cod]) {
                descuento = cupones[cod];
                msgCupon.textContent  = '✓ Código aplicado: ' + descuento + '% dto.';
                msgCupon.className    = 'pago-cupon-msg ok';
                inputCupon.disabled   = true;
                btnCupon.disabled     = true;
                btnCupon.style.opacity = '0.3';
                actualizarTotales();
            } else {
                msgCupon.textContent = '✗ Código no válido';
                msgCupon.className   = 'pago-cupon-msg err';
                inputCupon.value     = '';
            }
        });

        inputCupon.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') btnCupon.click();
        });
    }

    /* ── Formateo automático de tarjeta ── */
    var inputTarjeta = document.getElementById('p-tarjeta');
    if (inputTarjeta) {
        inputTarjeta.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = val.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    /* Formateo MM/AA */
    var inputExp = document.getElementById('p-exp');
    if (inputExp) {
        inputExp.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 4);
            if (val.length >= 3) {
                this.value = val.substring(0, 2) + '/' + val.substring(2);
            } else {
                this.value = val;
            }
        });
    }

    /* Solo números en CVV */
    var inputCvv = document.getElementById('p-cvv');
    if (inputCvv) {
        inputCvv.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    /* ── Validación ── */
    function validarCampo(input, condicion, mensaje) {
        var campo = input.closest('.pago-campo');
        var msgEl = campo.querySelector('.pago-error-msg');

        if (!condicion) {
            campo.classList.add('error');
            if (msgEl) msgEl.textContent = mensaje;
            return false;
        } else {
            campo.classList.remove('error');
            if (msgEl) msgEl.textContent = '';
            return true;
        }
    }

    function validarFormulario() {
        var ok = true;

        /* Contacto */
        ok = validarCampo(
            document.getElementById('p-nombre'),
            document.getElementById('p-nombre').value.trim().length >= 2,
            'Campo requerido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-apellido'),
            document.getElementById('p-apellido').value.trim().length >= 2,
            'Campo requerido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-email'),
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('p-email').value.trim()),
            'Email no válido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-telefono'),
            document.getElementById('p-telefono').value.trim().length >= 9,
            'Número no válido'
        ) && ok;

        /* Envío */
        ok = validarCampo(
            document.getElementById('p-direccion'),
            document.getElementById('p-direccion').value.trim().length >= 4,
            'Campo requerido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-ciudad'),
            document.getElementById('p-ciudad').value.trim().length >= 2,
            'Campo requerido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-pais'),
            document.getElementById('p-pais').value !== '',
            'Selecciona un país'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-cp'),
            document.getElementById('p-cp').value.trim().length >= 4,
            'Código no válido'
        ) && ok;

        /* Pago */
        var tarjetaLimpia = document.getElementById('p-tarjeta').value.replace(/\s/g, '');
        ok = validarCampo(
            document.getElementById('p-tarjeta'),
            tarjetaLimpia.length === 16,
            '16 dígitos requeridos'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-exp'),
            /^\d{2}\/\d{2}$/.test(document.getElementById('p-exp').value.trim()),
            'Formato MM/AA'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-cvv'),
            document.getElementById('p-cvv').value.trim().length >= 3,
            'Mínimo 3 dígitos'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-titular'),
            document.getElementById('p-titular').value.trim().length >= 3,
            'Campo requerido'
        ) && ok;

        return ok;
    }

    /* Añadir span de error a cada campo al cargar */
    document.querySelectorAll('.pago-campo').forEach(function (campo) {
        var span = document.createElement('span');
        span.className = 'pago-error-msg';
        campo.appendChild(span);
    });

    /* Limpiar error al escribir */
    document.querySelectorAll('.pago-campo input, .pago-campo select').forEach(function (input) {
        input.addEventListener('input', function () {
            var campo = input.closest('.pago-campo');
            campo.classList.remove('error');
        });
    });

    /* ── Botón realizar pedido ── */
    var btnRealizar = document.getElementById('pago-btn-realizar');
    var modal       = document.getElementById('pago-modal');
    var modalRef    = document.getElementById('pago-modal-ref-num');

    if (btnRealizar) {
        btnRealizar.addEventListener('click', function () {

            if (!validarFormulario()) {
                /* Scroll al primer error */
                var primerError = document.querySelector('.pago-campo.error input, .pago-campo.error select');
                if (primerError) {
                    primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    primerError.focus();
                }
                return;
            }

            /* Feedback en botón */
            btnRealizar.textContent = '✓ Procesando...';
            btnRealizar.disabled    = true;

            setTimeout(function () {

                /* Generar referencia aleatoria */
                var ref = 'MRC-' + Math.random().toString(36).substring(2, 7).toUpperCase()
                    + '-' + Date.now().toString().slice(-4);
                if (modalRef) modalRef.textContent = ref;

                /* Mostrar modal */
                if (modal) {
                    modal.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                }

            }, 1400);
        });
    }

    /* Cerrar modal al hacer clic en el fondo */
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.remove('visible');
                document.body.style.overflow = '';
            }
        });
    }

    /* Inicializar totales */
    actualizarTotales();

})();

/* ════════════════════════════════════════
   PRODUCTO — animación flotante de imágenes
   + descripción colapsable + carrito
════════════════════════════════════════ */

(function () {

    /* ════════════════════════════
       ANIMACIÓN FLOTANTE SUAVE
    ════════════════════════════ */

    var imagenes = document.querySelectorAll('.prod-img-float');

    /* Cada imagen tiene su propio ciclo con fase aleatoria
       para que no se muevan todas al mismo tiempo */
    var estados = [];

    imagenes.forEach(function (img, i) {
        var speed = parseFloat(img.dataset.speed) || 1;

        estados.push({
            el:        img,
            speed:     speed,
            /* Fase inicial aleatoria para desincronizar */
            phaseX:    Math.random() * Math.PI * 2,
            phaseY:    Math.random() * Math.PI * 2,
            /* Amplitud en píxeles — muy suave */
            ampX:      6 + Math.random() * 5,
            ampY:      8 + Math.random() * 6,
            /* Rotación mínima */
            ampR:      0.4 + Math.random() * 0.6
        });
    });

    var startTime = null;

    function animar(timestamp) {
        if (!startTime) startTime = timestamp;
        /* Tiempo en segundos, muy lento */
        var t = (timestamp - startTime) * 0.0006;

        estados.forEach(function (e) {
            var tx = Math.sin(t * e.speed + e.phaseX) * e.ampX;
            var ty = Math.cos(t * e.speed * 0.85 + e.phaseY) * e.ampY;
            var r  = Math.sin(t * e.speed * 0.6 + e.phaseX) * e.ampR;

            e.el.style.transform =
                'translate(' + tx + 'px, ' + ty + 'px) rotate(' + r + 'deg)';
        });

        requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);


    /* ════════════════════════════
       DESCRIPCIÓN COLAPSABLE
    ════════════════════════════ */

    var toggle = document.getElementById('prod-desc-toggle');
    var body   = document.getElementById('prod-desc-body');
    var icono  = document.getElementById('prod-desc-icono');

    if (toggle && body) {
        toggle.addEventListener('click', function () {
            var abierto = body.classList.contains('open');

            if (abierto) {
                body.classList.remove('open');
                icono.classList.remove('open');
                icono.textContent = '[+]';
            } else {
                body.classList.add('open');
                icono.classList.add('open');
                icono.textContent = '[−]';
            }
        });
    }


    /* ════════════════════════════
       BOTÓN AÑADIR AL CARRITO
    ════════════════════════════ */

    var btnCarrito = document.getElementById('prod-btn-carrito');

    /* Crear toast */
    var toast = document.createElement('div');
    toast.className = 'prod-toast';
    toast.textContent = '✓ Añadido al carrito';
    document.body.appendChild(toast);

    if (btnCarrito) {
        btnCarrito.addEventListener('click', function () {

            /* Cambiar texto del botón */
            var textoOriginal = btnCarrito.textContent;
            btnCarrito.textContent = '✓ Añadido';
            btnCarrito.classList.add('added');
            btnCarrito.disabled = true;

            /* Mostrar toast */
            toast.classList.add('visible');

            /* Flashear enlace del carro en navbar */
            var cartLink = document.querySelector('.cart-link');
            if (cartLink) {
                cartLink.classList.add('cart-flash');
                setTimeout(function () {
                    cartLink.classList.remove('cart-flash');
                }, 900);
            }

            /* Restaurar botón y ocultar toast */
            setTimeout(function () {
                toast.classList.remove('visible');
            }, 2200);

            setTimeout(function () {
                btnCarrito.textContent = textoOriginal;
                btnCarrito.classList.remove('added');
                btnCarrito.disabled = false;
            }, 2800);
        });
    }

})();
/* ════════════════════════════════════════
   LABORATORIO — login, validación y
   acceso al interior
════════════════════════════════════════ */

(function () {

    /* ── Credenciales de acceso ──
       Para cambiarlas, edita aquí.
       En producción esto iría en un backend. */
    var CREDENCIALES = {
        'miembro@marca.com':   'marca2026',
        'demo@marca.com':      'demo1234',
        'admin@marca.com':     'admin0000'
    };

    /* ── Comprobar si ya está logueado ──
       Si estamos en lab-interior y no hay sesión → redirigir al login */
    var enInterior = document.getElementById('lab-interior');
    if (enInterior) {
        var sesion = sessionStorage.getItem('lab-sesion');
        if (!sesion) {
            window.location.href = 'laboratorio.html';
            return;
        }

        /* Botón de logout */
        var btnLogout = document.getElementById('lab-logout-btn');
        if (btnLogout) {
            btnLogout.addEventListener('click', function () {
                sessionStorage.removeItem('lab-sesion');
                window.location.href = 'laboratorio.html';
            });
        }

        /* La página interior no necesita más lógica de login */
        return;
    }

    /* ── Lógica del formulario de login ── */
    var inputEmail    = document.getElementById('lab-email');
    var inputPassword = document.getElementById('lab-password');
    var btnEntrar     = document.getElementById('lab-btn-entrar');
    var errorMsg      = document.getElementById('lab-error-msg');
    var passToggle    = document.getElementById('lab-pass-toggle');

    if (!btnEntrar) return; /* No estamos en la página de login */

    /* Mostrar / ocultar contraseña */
    if (passToggle && inputPassword) {
        passToggle.addEventListener('click', function () {
            var tipo = inputPassword.type === 'password' ? 'text' : 'password';
            inputPassword.type = tipo;
            passToggle.style.opacity = tipo === 'text' ? '1' : '0.45';
        });
    }

    /* Limpiar error al escribir */
    [inputEmail, inputPassword].forEach(function (input) {
        if (!input) return;
        input.addEventListener('input', function () {
            errorMsg.textContent = '';
            input.closest('.lab-campo-wrap').classList.remove('error');
        });
    });

    /* Validar y enviar */
    function intentarLogin() {
        var email    = inputEmail.value.trim().toLowerCase();
        var password = inputPassword.value;

        /* Validación básica */
        if (!email) {
            errorMsg.textContent = 'Introduce tu correo electrónico';
            inputEmail.closest('.lab-campo-wrap').classList.add('error');
            inputEmail.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMsg.textContent = 'El formato del correo no es válido';
            inputEmail.closest('.lab-campo-wrap').classList.add('error');
            inputEmail.focus();
            return;
        }

        if (!password) {
            errorMsg.textContent = 'Introduce tu contraseña';
            inputPassword.closest('.lab-campo-wrap').classList.add('error');
            inputPassword.focus();
            return;
        }

        /* Comprobar credenciales */
        btnEntrar.textContent = 'Comprobando...';
        btnEntrar.disabled    = true;

        /* Simular petición al servidor con pequeño delay */
        setTimeout(function () {

            if (CREDENCIALES[email] && CREDENCIALES[email] === password) {

                /* Login correcto */
                sessionStorage.setItem('lab-sesion', email);
                btnEntrar.textContent = '✓ Accediendo...';

                setTimeout(function () {
                    window.location.href = 'lab-interior.html';
                }, 700);

            } else {

                /* Login incorrecto */
                errorMsg.textContent = 'Correo o contraseña incorrectos';
                inputEmail.closest('.lab-campo-wrap').classList.add('error');
                inputPassword.closest('.lab-campo-wrap').classList.add('error');

                /* Efecto shake en la card */
                var card = document.querySelector('.lab-login-card');
                if (card) {
                    card.style.animation = 'labShake 0.5s ease';
                    setTimeout(function () {
                        card.style.animation = '';
                    }, 550);
                }

                btnEntrar.textContent = 'Únirme';
                btnEntrar.disabled    = false;
                inputPassword.value   = '';
                inputPassword.focus();
            }

        }, 900);
    }

    /* Click en botón */
    btnEntrar.addEventListener('click', intentarLogin);

    /* Enter en cualquier campo */
    [inputEmail, inputPassword].forEach(function (input) {
        if (!input) return;
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') intentarLogin();
        });
    });

    /* Animación shake para errores */
    var styleShake = document.createElement('style');
    styleShake.textContent = [
        '@keyframes labShake {',
        '  0%   { transform: translateX(0); }',
        '  18%  { transform: translateX(-8px); }',
        '  36%  { transform: translateX(8px); }',
        '  54%  { transform: translateX(-5px); }',
        '  72%  { transform: translateX(5px); }',
        '  100% { transform: translateX(0); }',
        '}'
    ].join('\n');
    document.head.appendChild(styleShake);

})();