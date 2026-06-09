/* ════════════════════════════════════════
   TIENDA — filtros de productos y
   botones de añadir al carrito
════════════════════════════════════════ */

(function () {

    /* ── Filtros de productos ── */
    var filtros   = document.querySelectorAll('.filtro-btn');
    var productos = document.querySelectorAll('.tienda-grid .latest-item');

    if (filtros.length) {
        filtros.forEach(function (btn) {
            btn.addEventListener('click', function () {

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
    }


    /* ── Botones añadir al carrito desde tienda ── */
    document.querySelectorAll('.tienda-btn-carrito').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            window.agregarAlCarrito({
                id:    btn.getAttribute('data-product-id'),
                title: btn.getAttribute('data-product-title'),
                price: parseFloat(btn.getAttribute('data-product-price')),
                image: btn.getAttribute('data-product-image'),
                qty:   1
            });

            var textoOriginal = btn.textContent;
            btn.classList.add('added');
            btn.textContent = '✓ Añadido';

            setTimeout(function () {
                btn.classList.remove('added');
                btn.textContent = textoOriginal;
            }, 1400);
        });
    });

})();