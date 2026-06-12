# Sistema de Carrito de Compras - Documentación

## ✅ Funcionalidades Implementadas

### 1. **Renderizado Dinámico de Productos en el Carrito**
- Los productos se muestran en `carro.html` con:
  - ✅ Imagen del producto
  - ✅ Nombre del producto
  - ✅ Precio unitario
  - ✅ Cantidad del producto
  - ✅ Total por producto
  - ✅ Botón para eliminar el producto

### 2. **Controles de Cantidad**
- Botones **+** y **−** para aumentar/disminuir cantidad
- El precio total se actualiza automáticamente al cambiar la cantidad
- Los cambios se guardan en localStorage

### 3. **Resumen del Pedido**
- **Subtotal**: Se calcula automáticamente
- **Descuento**: Aplicable con cupones válidos
- **Total**: Se actualiza en tiempo real

### 4. **Persistencia de Datos**
- Los productos se guardan en localStorage (`mi_carrito_v1`)
- El carrito persiste entre sesiones del navegador
- Los datos se sincronizan automáticamente

## 📁 Archivos Principales

### `cart.js` (Sistema de Carrito)
- Gestiona todas las operaciones del carrito
- Renderiza dinámicamente los items
- Maneja eventos de cantidad y eliminación
- Sincroniza con localStorage

### `java.js` (Interactividad General)
- Controla navbar, sliders, y otros elementos
- Se integra con cart.js para operaciones del carrito

### `carro.html` (Página del Carrito)
- Contenedor dinámico para los items: `#carro-items-list`
- Resumen del pedido con totales

## 🛒 Cómo Agregar Productos

### Desde `tienda.html`:
```html
<button class="tienda-btn-carrito"
        data-product-id="vol01"
        data-product-title="Vol. 01 Las Solanaceas"
        data-product-price="20.5"
        data-product-image="imagenes/MOCKUP_REVISTA copia.jpg">
    + Añadir
</button>
```

### Desde `producto1.html`:
```html
<button id="prod-btn-carrito"
        data-product-id="vol01"
        data-product-title="Vol. 01 Las Solanaceas"
        data-product-price="20.5"
        data-product-image="imagenes/MOCKUP_REVISTA copia.jpg">
    Añadir al carrito
</button>
```

## 💰 Sistema de Cupones

Cupones disponibles:
- **1234**: 20% de descuento
- **MARCA10**: 10% de descuento
- **BIENVENIDO**: 15% de descuento

## 📱 Responsive Design

- Desktop: Grid de 2 columnas (items + resumen)
- Tablet: Ajustes en espacios y tamaños
- Mobile: Una columna, items apilados

## 🧪 Testing

Se incluye `test-carrito.html` para:
- Agregar productos de prueba
- Ver contenido del carrito
- Limpiar el carrito

Accede a: `test-carrito.html`

## 🔄 Flujo de Uso

1. Usuario agrega productos desde tienda o páginas de producto
2. El producto se guarda en localStorage
3. Usuario abre `carro.html`
4. Los productos se renderizan dinámicamente
5. Usuario puede:
   - Aumentar/disminuir cantidad (precio se actualiza)
   - Eliminar productos
   - Aplicar cupón de descuento
   - Ver total final
   - Tramitar el pedido (redirección a `pagar.html`)

## 🐛 Notas Técnicas

- El sistema usa `localStorage` para persistencia
- Los eventos se adjuntan dinámicamente al renderizar
- Compatible con localStorage nativo del navegador
- Sin dependencias externas


