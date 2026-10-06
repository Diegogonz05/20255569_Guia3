/* Compartido por Inicio, Menú y Contacto. Sin dependencias externas. */
'use strict';
(() => {
    const catalogo = {
        tradicional: { nombre: 'Menú tradicional', imagen: 'pollo2.jpg' },
        banquete: { nombre: 'Banquete familiar', imagen: 'tradicional.jpg' },
        camperitos: { nombre: 'Camperitos', imagen: 'nuggets.jpg' },
        tiras: { nombre: 'Tiras de pollo', imagen: 'pollo.jpg' },
        sandwich: { nombre: 'Sándwich crujiente', imagen: 'sandwich.jpg' },
        papas: { nombre: 'Papas', imagen: 'papas.jpg' }
    };
    const CLAVE_CARRITO = 'campero.carrito.v2';
    const CLAVE_CUENTAS = 'campero.cuentas.v1';
    const CLAVE_SESION = 'campero.sesion.v1';
    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];
    function leer(clave, fallback, storage = 'localStorage') {
        try { return JSON.parse(window[storage].getItem(clave)) ?? fallback; }
        catch { return fallback; }
    }
    function cargarCarrito() {
        const guardado = leer(CLAVE_CARRITO, {});
        return Object.fromEntries(Object.keys(catalogo).filter(id =>
            Number.isInteger(guardado?.[id]) && guardado[id] > 0 && guardado[id] <= 99
        ).map(id => [id, guardado[id]]));
    }
    let carrito = cargarCarrito();
    let tiempoAviso;
    function avisar(mensaje) {
        clearTimeout(tiempoAviso);
        $('#aviso-carrito').textContent = mensaje;
        tiempoAviso = setTimeout(() => { $('#aviso-carrito').textContent = ''; }, 4200);
    }
    function elemento(tag, clase, texto) {
        const el = document.createElement(tag);
        if (clase) el.className = clase;
        if (texto !== undefined) el.textContent = texto;
        return el;
    }
    function boton(texto, etiqueta, accion) {
        const b = elemento('button', '', texto);
        b.type = 'button'; b.setAttribute('aria-label', etiqueta);
        b.addEventListener('click', accion);
        return b;
    }
    function guardarCarrito() {
        try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); }
        catch { avisar('Tu navegador no permite guardar el carrito al cambiar de página.'); }
        mostrarCarrito();
    }
    function cambiarCantidad(id, cantidad) {
        if (cantidad > 99) { avisar('Podés agregar hasta 99 unidades por producto.'); return; }
        if (cantidad <= 0) delete carrito[id]; else carrito[id] = cantidad;
        guardarCarrito();
    }
    function mostrarCarrito() {
        const total = Object.values(carrito).reduce((a,b) => a+b, 0);
        $$('.contador-carrito').forEach(el => { el.textContent = total; });
        $('[data-abrir-carrito]').setAttribute('aria-label', `Abrir carrito, ${total} unidades`);
        const lista = $('#lista-carrito'); lista.replaceChildren();
        $('#resumen-carrito').hidden = total === 0;
        if (!total) {
            lista.append(elemento('p', '', 'Tu carrito está vacío. Elegí tus favoritos del menú.'));
            const enlace = elemento('a', 'enlace', 'Ver menú →'); enlace.href = 'menu.html';
            lista.append(enlace);
            $('#consultar-carrito').removeAttribute('href');
            return;
        }
        for (const [id,cantidad] of Object.entries(carrito)) {
            const producto = catalogo[id];
            const fila = elemento('article', 'linea-carrito');
            const foto = elemento('img'); foto.src = `img/${producto.imagen}`; foto.alt = '';
            const cuerpo = elemento('div');
            cuerpo.append(elemento('h3', '', producto.nombre));
            const controles = elemento('div', 'controles-cantidad');
            const menos = boton('−', `Quitar una unidad de ${producto.nombre}`, () => {
                cambiarCantidad(id, cantidad-1); restaurarFoco(id, 'menos');
            });
            menos.dataset.control = 'menos';
            const mas = boton('+', `Agregar una unidad de ${producto.nombre}`, () => {
                cambiarCantidad(id, cantidad+1); restaurarFoco(id, 'mas');
            });
            mas.dataset.control = 'mas';
            const quitar = boton('Quitar', `Quitar ${producto.nombre} del carrito`, () => {
                cambiarCantidad(id, 0); restaurarFoco(id, 'menos');
            });
            quitar.className = 'quitar';
            controles.append(menos, elemento('span', '', String(cantidad)), mas, quitar);
            cuerpo.append(controles); fila.append(foto, cuerpo); fila.dataset.id = id; lista.append(fila);
        }
        $('#total-unidades').textContent = `${total} ${total === 1 ? 'producto seleccionado' : 'productos seleccionados'}`;
        const pedido = Object.entries(carrito).map(([id,n]) => `${n} × ${catalogo[id].nombre}`).join('\n');
        $('#consultar-carrito').href = 'https://wa.me/50322736000?text=' + encodeURIComponent('Hola, quisiera consultar el precio y la disponibilidad de este pedido:\n\n'+pedido);
    }
    function restaurarFoco(id, control) {
        const destino = $(`[data-id="${id}"] [data-control="${control}"]`) || $('#carrito [data-cerrar]');
        destino.focus();
    }
    $('[data-abrir-carrito]').hidden = false;
    $('[data-abrir-carrito]').addEventListener('click', () => { mostrarCarrito(); $('#carrito').showModal(); });
    $$('.agregar-producto').forEach(b => {
        b.hidden = false;
        b.addEventListener('click', () => {
            const id = b.dataset.agregar;
            if ((carrito[id] || 0) >= 99) { avisar('Ya tenés 99 unidades de este producto.'); return; }
            cambiarCantidad(id, (carrito[id] || 0)+1);
            avisar(`${catalogo[id].nombre} agregado al carrito.`);
        });
    });
    $('#vaciar-carrito').addEventListener('click', () => {
        carrito = {}; guardarCarrito(); $('#carrito [data-cerrar]').focus();
    });
    $$('[data-cerrar]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));
    mostrarCarrito();

    // Filtrado real: los elementos ocultos dejan de ocupar celdas del Grid.
    const filtros = $$('.categorias-menu button');
    if (filtros.length) {
        $('.categorias-menu').hidden = false;
        $('#resultado-filtro').hidden = false;
        function filtrar(categoria) {
            let visibles = 0;
            $$('.producto').forEach(tarjeta => {
                tarjeta.hidden = categoria !== 'todos' && tarjeta.dataset.categoria !== categoria;
                if (!tarjeta.hidden) visibles++;
            });
            filtros.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === categoria)));
            $('#resultado-filtro').textContent = `${visibles} ${visibles === 1 ? 'opción disponible' : 'opciones disponibles'}`;
        }
        filtros.forEach(b => b.addEventListener('click', () => filtrar(b.dataset.filtro)));
        window.addEventListener('hashchange', () => {
            filtrar('todos');
            const destino = document.getElementById(location.hash.slice(1));
            if (destino?.classList.contains('producto')) destino.scrollIntoView({block:'start'});
        });
        filtrar('todos');
    }

    // Cuenta representativa local. No es autenticación de un servidor.
    // Solo guardamos sal + derivación PBKDF2, nunca la contraseña en texto.
    let modo = 'login';
    function cargarCuentas() {
        const datos = leer(CLAVE_CUENTAS, []);
        return Array.isArray(datos) ? datos.filter(c => typeof c?.correo === 'string' &&
            /^[a-f0-9]{32}$/.test(c.sal) && /^[a-f0-9]{64}$/.test(c.hash)) : [];
    }
    function mostrarCuenta() {
        const sesion = leer(CLAVE_SESION, null, 'sessionStorage');
        const activa = typeof sesion === 'string' && cargarCuentas().some(c => c.correo === sesion);
        $('#cuenta-acceso').hidden = activa;
        $('#cuenta-perfil').hidden = !activa;
        $('#correo-perfil').textContent = activa ? sesion : '';
        $('[data-abrir-cuenta]').textContent = activa ? 'Mi cuenta' : 'Ingresar';
    }
    function cambiarModo(nuevo) {
        modo = nuevo;
        $$('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === modo)));
        $('#confirmar-cuenta').textContent = modo === 'registro' ? 'Crear cuenta' : 'Iniciar sesión';
        $('#clave-cuenta').autocomplete = modo === 'registro' ? 'new-password' : 'current-password';
        $('#clave-cuenta').value = ''; $('#error-cuenta').textContent = '';
    }
    const hexadecimal = bytes => [...bytes].map(b => b.toString(16).padStart(2,'0')).join('');
    async function derivar(clave, sal) {
        const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveBits']);
        const bytesSal = Uint8Array.from(sal.match(/../g), b => parseInt(b,16));
        const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:bytesSal, iterations:120000, hash:'SHA-256'}, material, 256);
        return hexadecimal(new Uint8Array(bits));
    }
    $('[data-abrir-cuenta]').hidden = false;
    $('[data-abrir-cuenta]').addEventListener('click', () => { mostrarCuenta(); $('#cuenta').showModal(); });
    $$('[data-modo]').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.modo)));
    $('#cuenta').addEventListener('close', () => { $('#clave-cuenta').value = ''; $('#error-cuenta').textContent = ''; });
    $('#form-cuenta').addEventListener('submit', async event => {
        event.preventDefault();
        const correo = $('#correo-cuenta').value.trim().toLowerCase();
        const clave = $('#clave-cuenta').value;
        const registro = modo === 'registro';
        const controles = $$('#form-cuenta input, #confirmar-cuenta, [data-modo]');
        controles.forEach(c => { c.disabled = true; });
        $('#error-cuenta').textContent = '';
        try {
            const cuentas = cargarCuentas();
            const encontrada = cuentas.find(c => c.correo === correo);
            if (registro) {
                if (encontrada) { $('#error-cuenta').textContent = 'Ese correo ya tiene cuenta. Iniciá sesión.'; return; }
                const sal = hexadecimal(crypto.getRandomValues(new Uint8Array(16)));
                const hash = await derivar(clave, sal);
                cuentas.push({correo, sal, hash});
                localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas));
            } else {
                if (!encontrada || await derivar(clave, encontrada.sal) !== encontrada.hash) {
                    $('#error-cuenta').textContent = 'El correo o la contraseña no coinciden.'; return;
                }
            }
            sessionStorage.setItem(CLAVE_SESION, JSON.stringify(correo));
            $('#form-cuenta').reset(); mostrarCuenta();
            $('#cerrar-sesion').focus();
        } catch {
            $('#error-cuenta').textContent = 'No se pudo acceder a tu cuenta en este navegador. Intentá nuevamente.';
        } finally { controles.forEach(c => { c.disabled = false; }); }
    });
    $('#cerrar-sesion').addEventListener('click', () => {
        sessionStorage.removeItem(CLAVE_SESION); cambiarModo('login'); mostrarCuenta(); $('#correo-cuenta').focus();
    });
    mostrarCuenta();
    window.addEventListener('storage', e => {
        if (e.key === CLAVE_CARRITO || e.key === null) { carrito = cargarCarrito(); mostrarCarrito(); }
        if (e.key === CLAVE_CUENTAS || e.key === null) mostrarCuenta();
    });

    // Aparición suave en todas las páginas, una sola vez por elemento.
    const movimientoReducido = matchMedia('(prefers-reduced-motion: reduce)');
    if ('IntersectionObserver' in window && !movimientoReducido.matches) {
        const observador = new IntersectionObserver(entradas => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible'); observador.unobserve(entrada.target);
                }
            });
        }, {threshold:0.08});
        $$('main h1, main .etiqueta, .presentacion > p, .presentacion .acciones, .foto-principal, .favoritos, .categoria, .producto, .banda-atencion, .canales, .formulario, .pie-interior').forEach(el => {
            el.classList.add('revelar'); observador.observe(el);
        });
    } else { $$('.producto').forEach(el => el.classList.add('visible')); }
})();
