// Simple cart implementation using localStorage
const CART_KEY = 'mi_carrito_v1';
const COUPON_KEY = 'mi_carrito_cupon';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCoupon() {
    return localStorage.getItem(COUPON_KEY) || null;
}

function setCoupon(code) {
    if (code) localStorage.setItem(COUPON_KEY, code);
    else localStorage.removeItem(COUPON_KEY);
}

function formatPrice(n) {
    return '€ ' + Number(n).toFixed(2);
}

function flashCartLink() {
    const link = document.querySelector('.cart-link');
    if (!link) return;
    link.classList.add('cart-flash');
    setTimeout(() => link.classList.remove('cart-flash'), 900);
}

function showToast(message) {
    const t = document.createElement('div');
    t.className = 'cart-toast';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 10);
    setTimeout(() => { t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, 2000);
}

// Global function to add items to cart from any page
window.agregarAlCarrito = function(item) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx > -1) {
        cart[idx].qty = (cart[idx].qty || 1) + (item.qty || 1);
    } else {
        cart.push(Object.assign({ qty: 1 }, item));
    }
    saveCart(cart);
    flashCartLink();
    showToast('Añadido al carrito');
};

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
}

function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + (Number(i.price || 0) * (i.qty || 1)), 0);
    const coupon = getCoupon();
    let discount = 0;
    if (coupon === '1234') discount = subtotal * 0.20;
    const total = subtotal - discount;
    return { subtotal, discount, total };
}

function renderCartPage() {
    const page = document.getElementById('carro-page');
    if (!page) return;
    const listEl = document.getElementById('carro-items-list');
    const carroVacio = document.getElementById('carro-vacio');
    const cart = getCart();

    if (!listEl) return;
    listEl.innerHTML = '';

    if (cart.length === 0) {
        carroVacio.style.display = 'block';
        const layout = document.querySelector('.carro-layout');
        if (layout) layout.style.display = 'none';
        return;
    } else {
        carroVacio.style.display = 'none';
        const layout = document.querySelector('.carro-layout');
        if (layout) layout.style.display = '';
    }

    cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'carro-item';
        row.setAttribute('data-id', item.id);
        row.innerHTML = `
            <div class="carro-item-producto">
                <div class="carro-item-img"><img src="${item.image || ''}" alt="${item.title}"></div>
                <div class="carro-item-info">
                    <span class="carro-item-nombre">${item.title}</span>
                    <span class="carro-item-variante"></span>
                    <button class="carro-item-eliminar" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
            <span class="carro-item-precio">${formatPrice(item.price)}</span>
            <div class="carro-cantidad">
                <button class="carro-cant-btn" data-action="restar" data-id="${item.id}">−</button>
                <span class="carro-cant-num">${item.qty}</span>
                <button class="carro-cant-btn" data-action="sumar" data-id="${item.id}">+</button>
            </div>
            <span class="carro-item-total">${formatPrice(item.price * item.qty)}</span>
        `;
        listEl.appendChild(row);
    });

    // attach listeners for delete
    listEl.querySelectorAll('.carro-item-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            removeItem(id);
            renderCartPage();
        });
    });

    // attach listeners for quantity controls
    listEl.querySelectorAll('.carro-cant-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const action = btn.getAttribute('data-action');
            const cart = getCart();
            const it = cart.find(i => i.id === id);
            if (!it) return;
            if (action === 'sumar') it.qty = (it.qty || 1) + 1;
            else it.qty = Math.max(0, (it.qty || 1) - 1);
            saveCart(cart);
            renderCartPage();
        });
    });
    // Botón tramitar → redirige a pago
    var btnTramitar = document.getElementById('carro-tramitar-btn');
    if (btnTramitar && !btnTramitar._listener) {
        btnTramitar._listener = true;
        btnTramitar.addEventListener('click', function () {
            if (getCart().length === 0) return;
            btnTramitar.textContent = '✓ Procesando...';
            btnTramitar.disabled = true;
            setTimeout(function () { window.location.href = 'pago.html'; }, 800);
        });
    }
    // update totals display
    updateTotalsDisplay();
}

function updateTotalsDisplay() {
    const totals = calculateTotals();
    const subtotalEl = document.getElementById('carro-subtotal');
    const descuentoEl = document.getElementById('carro-descuento');
    const totalEl = document.getElementById('carro-total');
    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    if (descuentoEl) descuentoEl.textContent = totals.discount > 0 ? `- ${formatPrice(totals.discount)}` : '— €';
    if (totalEl) totalEl.textContent = formatPrice(totals.total);
}

// Apply coupon button on cart page
function setupCouponOnCartPage() {
    const btn = document.getElementById('carro-cupon-btn');
    const input = document.getElementById('carro-cupon-input');
    const msg = document.getElementById('carro-cupon-msg');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
        const code = (input.value || '').trim();
        if (!code) {
            msg.textContent = 'Introduce un código.';
            return;
        }
        if (code === '1234') {
            setCoupon(code);
            msg.textContent = 'Cupón aplicado: 20%';
            renderCartPage();
        } else {
            msg.textContent = 'Código no válido.';
        }
    });
}

// Setup add to cart buttons for product pages and membership pages
function setupAddToCartButtons() {
    // Producto page (producto1.html)
    var prodBtn = document.getElementById('prod-btn-carrito');
    if (prodBtn) {
        prodBtn.addEventListener('click', function () {
            window.agregarAlCarrito({
                id:    prodBtn.getAttribute('data-product-id'),
                title: prodBtn.getAttribute('data-product-title'),
                price: parseFloat(prodBtn.getAttribute('data-product-price')),
                image: prodBtn.getAttribute('data-product-image'),
                qty:   1
            });
            prodBtn.classList.add('added');
            setTimeout(function () { prodBtn.classList.remove('added'); }, 900);
        });
    }

    // Tienda page - all products
    document.querySelectorAll('[data-product-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-product-id');
            const title = btn.getAttribute('data-product-title');
            const price = parseFloat(btn.getAttribute('data-product-price'));
            const image = btn.getAttribute('data-product-image');
            
            if (!id || !title) return;
            
            const item = { id, title, price: price || 0, image: image || '', qty: 1 };
            window.agregarAlCarrito(item);
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 900);
        });
    });

    // Membership page (contacto.html) - add to cart buttons
    document.querySelectorAll('.mb-btn-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.closest('.mb-plan');
            if (!plan) return;
            
            const nombre = plan.querySelector('.mb-plan-nombre')?.textContent || 'Membresía';
            const precio = plan.getAttribute('data-price') || '€ 0';
            const image = plan.getAttribute('data-image') || 'imagenes/3.jpg';
            
            // Parse price (remove € and convert to number)
            const precioNum = parseFloat(precio.replace('€', '').trim());
            
            const item = {
                id: 'membresia-' + nombre.toLowerCase(),
                title: 'Membresía ' + nombre,
                price: precioNum,
                image: image,
                qty: 1
            };
            window.agregarAlCarrito(item);
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 900);
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupAddToCartButtons();
    renderCartPage();
    setupCouponOnCartPage();
});



