/* ════════════════════════════════════════
   PAGO — lee carrito real, valida
   formulario y confirma pedido
════════════════════════════════════════ */

(function () {

    /* ── Claves localStorage ── */
    var CART_KEY   = 'mi_carrito_v1';
    var COUPON_KEY = 'mi_carrito_cupon';

    /* ── Leer carrito y cupón guardados ── */
    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch (e) { return []; }
    }

    function getCouponFromStorage() {
        return localStorage.getItem(COUPON_KEY) || null;
    }

    /* ── Cupones válidos ── */
    var cupones  = { 'MARCA10': 10, 'BIENVENIDO': 15, '1234': 20 };
    var descuento = 0;

    /* Restaurar cupón si ya fue aplicado en el carro */
    var cuponGuardado = getCouponFromStorage();
    if (cuponGuardado && cupones[cuponGuardado]) {
        descuento = cupones[cuponGuardado];
    }


    /* ════════════════════════════
       RENDERIZAR ITEMS DEL RESUMEN
    ════════════════════════════ */
    var itemsEl = document.getElementById('pago-resumen-items');

    function renderResumenItems() {
        if (!itemsEl) return;

        var cart = getCart();
        itemsEl.innerHTML = '';

        if (cart.length === 0) {
            itemsEl.innerHTML =
                '<p style="font-size:10px;opacity:0.5;text-transform:uppercase;' +
                'letter-spacing:0.08em;color:var(--cream);">El carrito está vacío</p>';
            return;
        }

        cart.forEach(function (item) {
            var div = document.createElement('div');
            div.className = 'pago-resumen-item';
            div.innerHTML =
                '<div class="pago-resumen-item-img">' +
                (item.image
                    ? '<img src="' + item.image + '" alt="' + item.title + '">'
                    : '<div class="img-ph" style="height:100%;"></div>') +
                '<span class="pago-resumen-cant">' + (item.qty || 1) + '</span>' +
                '</div>' +
                '<div class="pago-resumen-item-info">' +
                '<span class="pago-resumen-item-nombre">' + item.title + '</span>' +
                '<span class="pago-resumen-item-var">' + (item.variant || '') + '</span>' +
                '</div>' +
                '<span class="pago-resumen-item-precio">€ ' +
                (Number(item.price) * (item.qty || 1)).toFixed(2) +
                '</span>';
            itemsEl.appendChild(div);
        });
    }


    /* ════════════════════════════
       CALCULAR Y MOSTRAR TOTALES
    ════════════════════════════ */
    function getSubtotal() {
        return getCart().reduce(function (s, i) {
            return s + Number(i.price || 0) * (i.qty || 1);
        }, 0);
    }

    function actualizarTotales() {
        var subtotal = getSubtotal();
        var euros    = subtotal * descuento / 100;
        var total    = subtotal - euros;

        var elSub  = document.getElementById('pago-subtotal');
        var elDesc = document.getElementById('pago-descuento');
        var elTot  = document.getElementById('pago-total');
        var elLine = document.getElementById('pago-linea-descuento');

        if (elSub)  elSub.textContent = '€ ' + subtotal.toFixed(2);
        if (elTot)  elTot.textContent = '€ ' + total.toFixed(2);

        if (elLine) elLine.style.display = descuento > 0 ? 'flex' : 'none';
        if (elDesc && descuento > 0) {
            elDesc.textContent =
                '− € ' + euros.toFixed(2) + ' (' + descuento + '%)';
        }
    }


    /* ════════════════════════════
       CUPÓN EN PÁGINA DE PAGO
    ════════════════════════════ */
    var btnCupon   = document.getElementById('pago-cupon-btn');
    var inputCupon = document.getElementById('pago-cupon-input');
    var msgCupon   = document.getElementById('pago-cupon-msg');

    /* Mostrar cupón ya aplicado si venía del carro */
    if (cuponGuardado && cupones[cuponGuardado] && inputCupon) {
        inputCupon.value    = cuponGuardado;
        inputCupon.disabled = true;
        if (btnCupon) {
            btnCupon.disabled      = true;
            btnCupon.style.opacity = '0.3';
        }
        if (msgCupon) {
            msgCupon.textContent = '✓ Código aplicado: ' + descuento + '% dto.';
            msgCupon.className   = 'pago-cupon-msg ok';
        }
    }

    if (btnCupon && inputCupon) {
        btnCupon.addEventListener('click', function () {
            var cod = inputCupon.value.trim().toUpperCase();

            if (cupones[cod]) {
                descuento = cupones[cod];
                localStorage.setItem(COUPON_KEY, cod);
                msgCupon.textContent   = '✓ Código aplicado: ' + descuento + '% dto.';
                msgCupon.className     = 'pago-cupon-msg ok';
                inputCupon.disabled    = true;
                btnCupon.disabled      = true;
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


    /* ════════════════════════════
       FORMATEO AUTOMÁTICO TARJETA
    ════════════════════════════ */
    var inputTarjeta = document.getElementById('p-tarjeta');
    if (inputTarjeta) {
        inputTarjeta.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 16);
            this.value = val.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    var inputExp = document.getElementById('p-exp');
    if (inputExp) {
        inputExp.addEventListener('input', function () {
            var val = this.value.replace(/\D/g, '').substring(0, 4);
            this.value = val.length >= 3
                ? val.substring(0, 2) + '/' + val.substring(2)
                : val;
        });
    }

    var inputCvv = document.getElementById('p-cvv');
    if (inputCvv) {
        inputCvv.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }


    /* ════════════════════════════
       VALIDACIÓN DE FORMULARIO
    ════════════════════════════ */

    /* Crear spans de error en cada campo al cargar */
    document.querySelectorAll('.pago-campo').forEach(function (campo) {
        if (!campo.querySelector('.pago-error-msg')) {
            var span = document.createElement('span');
            span.className = 'pago-error-msg';
            campo.appendChild(span);
        }
    });

    /* Limpiar error al escribir */
    document.querySelectorAll('.pago-campo input, .pago-campo select')
        .forEach(function (input) {
            input.addEventListener('input', function () {
                input.closest('.pago-campo').classList.remove('error');
            });
        });

    function validarCampo(input, condicion, mensaje) {
        var campo = input.closest('.pago-campo');
        var msgEl = campo.querySelector('.pago-error-msg');

        if (!condicion) {
            campo.classList.add('error');
            if (msgEl) msgEl.textContent = mensaje;
            return false;
        }

        campo.classList.remove('error');
        if (msgEl) msgEl.textContent = '';
        return true;
    }

    function validarFormulario() {
        var ok = true;

        /* — Contacto — */
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
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                document.getElementById('p-email').value.trim()
            ),
            'Email no válido'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-telefono'),
            document.getElementById('p-telefono').value.trim().length >= 9,
            'Número no válido'
        ) && ok;

        /* — Envío — */
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

        /* — Pago — */
        var tarjetaLimpia =
            document.getElementById('p-tarjeta').value.replace(/\s/g, '');

        ok = validarCampo(
            document.getElementById('p-tarjeta'),
            tarjetaLimpia.length === 16,
            '16 dígitos requeridos'
        ) && ok;

        ok = validarCampo(
            document.getElementById('p-exp'),
            /^\d{2}\/\d{2}$/.test(
                document.getElementById('p-exp').value.trim()
            ),
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


    /* ════════════════════════════
       BOTÓN REALIZAR PEDIDO
    ════════════════════════════ */
    var btnRealizar = document.getElementById('pago-btn-realizar');
    var modal       = document.getElementById('pago-modal');
    var modalRef    = document.getElementById('pago-modal-ref-num');

    if (btnRealizar) {
        btnRealizar.addEventListener('click', function () {

            /* Comprobar que el carrito no está vacío */
            if (getCart().length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            /* Validar todos los campos */
            if (!validarFormulario()) {
                var primerError = document.querySelector(
                    '.pago-campo.error input, .pago-campo.error select'
                );
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
                var ref =
                    'MRC-' +
                    Math.random().toString(36).substring(2, 7).toUpperCase() +
                    '-' +
                    Date.now().toString().slice(-4);

                if (modalRef) modalRef.textContent = ref;

                /* Vaciar carrito y cupón tras pedido completado */
                localStorage.removeItem(CART_KEY);
                localStorage.removeItem(COUPON_KEY);

                /* Mostrar modal de confirmación */
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


    /* ── Inicializar al cargar la página ── */
    renderResumenItems();
    actualizarTotales();

})();