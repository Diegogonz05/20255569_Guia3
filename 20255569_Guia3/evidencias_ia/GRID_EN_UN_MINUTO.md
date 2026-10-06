# Grid para explicar en el video

Archivo final: `reto_ia/css/style.css`, selector `.inicio-grid` (sección 05). Contenedor: `<main class="contenedor inicio-grid">` en `reto_ia/index.html`.

- Los **cinco hijos directos** son los Grid items: presentación, foto, favoritos, categoría y franja de atención.
- `display: grid` activa la cuadrícula principal.
- `grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr)` forma dos columnas; la segunda recibe 1.2 veces el espacio de la primera.
- `grid-template-rows: auto auto auto` declara tres filas cuya altura depende del contenido.
- `grid-template-areas` ubica cada bloque; `atencion atencion` ocupa ambas columnas. `grid-area` asigna cada hijo a su nombre en ese mapa.
- `gap: 28px` deja separación entre filas y columnas.
- En `@media (max-width: 760px)` la página pasa a una columna y `gap: 24px`; las cinco áreas se apilan.

**Cambio en vivo:** con ventana mayor de 760px, anunciá que cambiar `gap: 28px` por `48px` separará más los bloques y reducirá algo el ancho disponible para las columnas. Guardá, recargá, mostrá el resultado y devolvé el valor a `28px`.
