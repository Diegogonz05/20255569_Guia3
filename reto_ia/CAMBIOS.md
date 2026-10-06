# Cambios frente a 01_codigo_original

- **Identidad:** misma cabecera, navegación, fuentes y controles en Inicio, Menú y Contacto. Se conserva el diseño compacto que aprobaste.
- **CSS:** una hoja compartida, organizada por secciones y variables.
- **Grid:** se mantiene y reorganiza la distribución principal de Inicio en cinco áreas; en móvil se apilan. No se limita a las tarjetas.
- **Animaciones:** apariciones suaves en todas las páginas. Cabecera de 420ms, contenido con opacidad y desplazamiento de 14px, y ventanas de 240ms. Se eliminó el salto de −100px: el hover sube solo 3px. Se respeta la preferencia de movimiento reducido.
- **Footer:** verde Campero, texto café y formato compacto.
- **Catálogo:** filtros reales Todos, Pollo, Sándwiches y Acompañamientos. Los productos ocultos no ocupan espacio.
- **Carrito:** agregar, aumentar/disminuir cantidades, quitar productos, vaciar y conservar la selección entre páginas. Cuenta unidades; prepara el pedido para consultar precio/disponibilidad por WhatsApp. No se inventan precios ni se procesa un pago.
- **Cuenta representativa:** crear cuenta con correo y contraseña, iniciar/cerrar sesión. Funciona en el mismo navegador y origen; no hay base de datos, recuperación de contraseña ni verificación de correo. Las contraseñas no se guardan en texto: se usa sal y derivación PBKDF2. Esto no sustituye una autenticación real.
- **Acceso libre:** ninguna función del catálogo o carrito exige una cuenta.
- **Contenido:** sin avisos académicos ni enlaces de créditos dentro del sitio. Las explicaciones están en estos documentos.

## Reemplazo
Reemplazá completa la carpeta `reto_ia`; incluí `js/`, `css/`, `fonts/` e `img/`. Usá Live Server o tu publicación HTTPS. Las cuentas creadas en localhost no aparecen en otro dominio: el almacenamiento pertenece a cada origen. `01_codigo_original` permanece intacto; no se agrega otra copia del código final.
