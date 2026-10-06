# Respuestas para entender la guía

Son explicaciones del comportamiento esperado; realiza los experimentos en tu navegador.

## Ejemplo 1

- **16:** Flexbox intenta una sola fila (`nowrap` inicial); las tarjetas intentan encogerse hasta sus límites y pueden desbordar. Se dificulta la lectura.
- **17–18:** `flex-wrap: wrap` permite nuevas filas; `flex: 1 1 300px` permite crecer, reducirse y partir de 300px.
- **19:** `gap` separa tarjetas; `padding` separa su contenido de su borde.
- **20:** el `flex-grow: 1` reparte el espacio sobrante. Si queda una sola tarjeta, recibe todo el sobrante; `max-width: 360px` la limita y `justify-content: center` la centra.
- **22:** `overflow: hidden` recorta lo que sobresale de las esquinas redondeadas.
- **23–24:** imponer ancho y alto sin object-fit puede deformar. `contain` muestra toda la foto con posibles espacios; `cover` conserva proporción y llena, recortando extremos.
- **26:** `margin-top: auto` absorbe el espacio vertical libre encima del enlace y lo empuja hacia abajo. El contenido flexible crece; en cada fila los enlaces quedan alineados.
- **27–28:** relative desplaza desde el lugar original y lo reserva. left positivo mueve a la derecha; right positivo mueve a la izquierda. Puede superponerse.
- **29–31:** absolute elimina la reserva del espacio; las otras tarjetas se reacomodan. Toma como referencia el ancestro posicionado más cercano. `position: relative` en `.maravillas` la convierte en referencia sin desplazarla. Sin ese ancestro, usa el bloque contenedor inicial.
- **32:** static vuelve al flujo; top y left no desplazan. Se eliminan las reglas experimentales.
- **33:** imagen relativa + etiqueta absoluta permite poner el continente encima de su propia foto.
- **35–37:** sticky necesita un límite como top: 0. z-index: 10 hace que el encabezado quede delante de las etiquetas con z-index: 1 en esta estructura.
- **38:** sticky conserva su espacio; fixed sale del flujo y se mantiene respecto de la ventana en este ejemplo.

## Ejemplo 2

- El label cambia el checkbox porque su for coincide con el id.
- `:checked` activa las reglas solo cuando está marcado.
- `~` selecciona hermanos posteriores; `+`, el inmediatamente posterior; `>` selecciona hijos directos; el espacio, descendientes.
- Cerrado: menú left: -250px. Abierto: left: 0 y main con margin-left: 250px.
- `transition` suaviza el cambio; `opacity: 0` oculta el icono y `pointer-events: none` evita clics sobre él.
- `height: 100vh` equivale a toda la altura de la ventana; cover conserva proporción y puede recortar el fondo.

## Complementarios

- Las cartas usan absolute y top/left en escalera. El body relativo es su referencia.
- Resultado 1: z-index de 1 a 5; el as está delante.
- Resultado 2: z-index de 5 a 1; el diez está delante. El orden del HTML se conserva.
