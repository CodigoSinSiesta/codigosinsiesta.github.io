---
title: "Vídeo 03 · Pi por dentro"
description: "Qué pasa en cada turno y qué recibe exactamente el modelo. La sesión como un árbol que se puede rebobinar, bifurcar y compactar sin perder nada."
ruta: "pi-oh-my-pi"
orden: 3
duracion: "23 min"
video: "03-pi-por-dentro.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/03-pi-por-dentro.es.vtt"
---

Qué pasa en cada turno y qué recibe exactamente el modelo. La sesión como un árbol que se puede rebobinar, bifurcar y compactar sin perder nada.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · El bucle, turno a turno

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Hoy abrimos la tapa:** El bucle (turno a turno) → El contexto (qué ve el modelo) → La sesión (un árbol) → Compactar (cuando no cabe)
- *En la demo:* Una tarea, muchas peticiones
- *En la demo:* Con un modelo de pago, el pie muestra el coste
- **Errores del proveedor:** Pi espera y reintenta: retrying 2/3 — Los intentos fallidos quedan en la sesión, marcados para que el modelo no los vea.
- **Recuperación por desbordamiento:** ¿No cabe en la ventana? Compacta y reintenta una vez — Por eso a veces aparece una compactación que no pediste.

### 2 · Qué recibe el modelo

<p><button type="button" class="ir-a" data-t="194">▶ Ir a 3:14</button></p>

- **01 · El prompt de sistema**
  - `base` · Instrucciones de Pi: cortas y fijas
  - `repo` · AGENTS.md del proyecto: y de las carpetas superiores
  - `~` · AGENTS.md global: del directorio del agente
- *En terminal:* El prompt de sistema de Pi (guardado en la sesión) (más abajo, en «Código y comandos»)
- **Todo queda guardado:** El principio de la conversación es lo que está en caché — La primera petición guarda el prompt completo; los cambios, solo como diferencia.

### 3 · La sesión es un árbol

<p><button type="button" class="ir-a" data-t="363">▶ Ir a 6:03</button></p>

- *En terminal:* ~/.pi/agent/sessions/--…-csn-tienda--/ _ .jsonl (más abajo, en «Código y comandos»)
- *En la demo:* /name precios: el nombre, en el pie
- *En la demo:* Los tipos de entrada de la sesión
- *En la demo:* Cada entrada apunta a su padre
- **Más tipos de entrada:** Todo lo que pasa deja una línea — Etiquetas, ediciones de contexto, mensajes y datos de extensiones…
- *En terminal:* Sesiones desde la línea de comandos (más abajo, en «Código y comandos»)

### 4 · Volver atrás sin perder nada

<p><button type="button" class="ir-a" data-t="506">▶ Ir a 8:26</button></p>

- *En la demo:* Opción A: el umbral se mide con IVA
- **La duda:** ¿Y si el umbral debería ir sin IVA? — Volvemos al punto de decisión y probamos en otra rama, sin perder la primera.
- **Aviso:** /tree mueve la conversación, no tus ficheros — Tu control de versiones es git; el árbol de Pi es la memoria de la conversación.
- *En la demo:* La opción A, a salvo en git
- *En la demo:* /tree: el árbol de la sesión
- *En la demo:* «Summarize branch?»
- **Otra forma de moverse:** Elige una respuesta y sigue desde ahí — Pi te coloca justo después, con el editor vacío.
- *En la demo:* El resumen de rama, en el punto de vuelta
- *En la demo:* Branch summary: estructura fija
- *En terminal:* El mensaje, editado: la opción B (más abajo, en «Código y comandos»)
- *En terminal:* Razonamiento del modelo en la rama B (más abajo, en «Código y comandos»)
- *En la demo:* Opción B: 12/12, con el caso de los 35 €
- *En la demo:* Las dos ramas, en el mismo fichero

### 5 · Fork, clone y resume

<p><button type="button" class="ir-a" data-t="783">▶ Ir a 13:03</button></p>

- *En la demo:* /fork: elige el mensaje
- *En la demo:* Forked to new session
- *En la demo:* Una sesión nueva, casi vacía
- *En la demo:* /resume: las sesiones de la carpeta
- *En terminal:* La sesión original y su clon (más abajo, en «Código y comandos»)

### 6 · La compactación

<p><button type="button" class="ir-a" data-t="920">▶ Ir a 15:20</button></p>

- *En la demo:* No es un fallo: no hay nada antiguo que resumir
- *En terminal:* Ajustes de la demo: /settings.json (más abajo, en «Código y comandos»)
- *En la demo:* Compacted from 8,927 tokens
- **Cómo compacta:** Punto de corte (hacia atrás) → Resumen (de lo anterior) → Entrada compaction (con firstKeptEntryId) → Siguiente petición (sistema + resumen + recientes)
- **Nada se borra:** Compactar no destruye: cambia lo que el modelo ve — Las entradas originales siguen en el fichero, en /tree y en /export.
- *En la demo:* El resumen: solo la primera tarea
- *En la demo:* «Las dos opciones de IVA»… que no lo eran
- **Un error sutil:** El modelo obedece aunque no tenga el material — Quien leyera solo el resumen creería que probamos dos tipos de IVA.
- *En la demo:* Acierta con el resumen de rama y lo reciente
- *En la demo:* Ficheros leídos y modificados, acumulados
- **Y una cuarta**
  - `/model` · Un modelo mejor: justo antes de compactar
  - `modelOverrides` · Márgenes por modelo: 200k no es 1M
- *En la demo:* Tras compactar, la caché cae

### 7 · Exportar y cerrar

<p><button type="button" class="ir-a" data-t="1223">▶ Ir a 20:23</button></p>

- *En terminal:* Exportar la sesión (más abajo, en «Código y comandos»)
- **/share publica:** Revisa la sesión antes de que salga — Prompts, respuestas, comandos, ficheros… y hasta rutas con tu usuario.
- **Recapitulando**
  - `↻` · Turnos: sistema + herramientas + rama activa
  - `🌳` · Árbol JSONL: tree · fork · clone · resume
  - `⇣` · Compactación: resume lo antiguo, a veces mal
- **Una sola idea:** La conversación es memoria de trabajo; la verdad vive en el repositorio — Código, pruebas y git.
- *En terminal:* Para ir más allá (más abajo, en «Código y comandos»)
- **Próximo vídeo:** Modelos y proveedores — Varios proveedores, cambiar a mitad de tarea, modelos locales y costes.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### El prompt de sistema de Pi (guardado en la sesión)

```text
jq 'select(.message.role=="system") | .message.sections | keys' <sesión>
preamble: You are an expert coding assistant operating inside pi…
tools: read · bash · edit · write
rules: Use read to examine files… Use edit for precise changes…
docs: Pi documentation…
cwd: ~/csn/tienda
```

- `preamble`: Quién es
- `tools:`: Las cuatro herramientas
- `rules:`: Reglas
- `cwd:`: Carpeta de trabajo

### ~/.pi/agent/sessions/--…-csn-tienda--/ _ .jsonl

```text
head -3 <sesión>
{"type":"session","version":3,"id":"01a10687-…","cwd":"~/csn/tienda"}
{"type":"model_change","id":"f53893a8","parentId":null,"provider":"deepseek",…}
{"type":"thinking_level_change","id":"a2faad55","parentId":"f53893a8",…}
```

- `"type":"model_change"`: Una línea por entrada
- `"type":"session"`: La cabecera

### Sesiones desde la línea de comandos

```text
pi --no-session          # sin guardar nada
pi --session 01a106…     # una sesión concreta
pi --fork <ruta|id>      # sesión nueva a partir de otra
pi --session-dir ./.sesiones
```

- `--no-session`: Efímera
- `--session 01a`: Abrir una
- `--fork`: Bifurcar
- `--session-dir`: Dónde se guardan

### El mensaje, editado: la opción B

```text
Ahora haz que totalConEnvio calcule el envío sobre el total con cupón SIN IVA
y aplique el IVA al final, solo a los productos.
Actualiza las pruebas y ejecuta npm test.
```

- `SIN IVA`: El cambio
- `ejecuta npm test`: Rama nueva desde aquí

### Razonamiento del modelo en la rama B

```text
Let me look at the current state of the files, since the summary says a branch modified totalConEnvio.
read src/carrito.js · read test/carrito.test.js
The current state on this branch is the original version (summary described a different branch).
```

- `current state of the files`: Mira el disco
- `different branch`: Confía en el disco

### La sesión original y su clon

```text
jq -r .type <sesión> | grep -c message
37   precios (las dos ramas)
29   clon (solo la rama activa)
head -1 <clon> | jq .parentSession  →  …/2026-10-04T10-48-52-933Z_….jsonl
```

- `37`: Original
- `29`: Clon
- `parentSession`: De dónde viene

### Ajustes de la demo: /settings.json

```text
{ "compaction": { "keepRecentTokens": 3000 } }
/reload
/compact Conserva las dos opciones de IVA probadas y cuál quedó en la rama activa
```

- `keepRecentTokens`: Margen conservado
- `/reload`: Recargar ajustes

### Exportar la sesión

```text
/export /tmp/csn/precios.html
Session exported to: /tmp/csn/precios.html
ls -lh /tmp/csn/precios.html   →   378K
```

- `/export`: HTML o JSONL
- `378K`: Toda la conversación

### Para ir más allá

```text
jq -c 'select(.type=="compaction") | {firstKeptEntryId, tokensBefore}' <sesión>
/export sesion.html
```

- `firstKeptEntryId`: Dónde empieza lo conservado
- `/export`: Compara con lo que vio el modelo

## Fuentes

- Documentación instalada de Pi 1.0.1: `docs/how-pi-works.md`, `docs/sessions.md`, `docs/session-format.md`,
  `docs/compaction.md`, `docs/settings.md`, `docs/keybindings.md`.
- Documentación oficial de Pi: [compaction.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/compaction.md), [how-pi-works.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/how-pi-works.md), [keybindings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md), [session-format.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/session-format.md), [sessions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sessions.md), [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md)

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · El bucle, turno a turno**

En el vídeo anterior usamos Pi como cualquier usuario: pedir, corregir y retomar. Hoy abrimos la tapa. Vamos a ver qué hace Pi entre que pulsas Enter y aparece la respuesta, cómo decide qué le envía al modelo, dónde guarda todo y qué pasa cuando la conversación crece demasiado.

Antes, un cambio. En los dos primeros vídeos usamos un modelo gratuito, y ya visteis que el proveedor se saturaba y devolvía errores cuatrocientos veintinueve. Para el resto del bloque de Pi usamos DeepSeek Flash, un modelo de pago muy barato, con el nivel de razonamiento en high. Todo lo que contamos vale igual para cualquier modelo.

Empecemos por el bucle. Cuando envías un mensaje, Pi lo añade a la rama activa de la sesión. Después monta una petición con cuatro ingredientes: el prompt de sistema, la historia de esa rama, las definiciones de las herramientas disponibles y los ajustes del modelo, como el nivel de razonamiento. Y la envía al proveedor.

El proveedor responde en streaming: texto, razonamiento y, a menudo, llamadas a herramientas. Pi registra esa respuesta, ejecuta cada llamada y registra también los resultados. Eso es un turno. Si hay resultados de herramientas que el modelo tiene que ver, empieza otro turno con una petición nueva. Si no, la ejecución termina.

Fíjate en una consecuencia. Una tarea que a ti te parece una sola pregunta son, en realidad, muchas peticiones al modelo. En nuestra primera tarea de hoy, añadir una función de IVA con sus pruebas, el modelo listó el proyecto, leyó tres ficheros, hizo dos ediciones y ejecutó las pruebas. Cada uno de esos pasos vuelve a enviar toda la historia. Por eso importan tanto la caché y el tamaño del contexto.

Y ahora que usamos un modelo de pago, el pie lo enseña. Al terminar esa primera tarea marca cero coma cero cero dos dólares. Al final de la demo, después de dos alternativas, una compactación y varias preguntas, la sesión se queda en poco más de un céntimo. Es barato, pero no es gratis, y el pie te lo recuerda en cada turno.

Dentro de un turno, si el modelo pide varias herramientas a la vez, Pi puede ejecutarlas en paralelo. Y entre turno y turno es donde entran los mensajes que escribiste mientras trabajaba: el steering, al acabar el turno en curso; el follow-up, cuando ya no queda trabajo pendiente. Ahora ya sabes exactamente dónde encajan.

El bucle también se ocupa de los errores. Si el proveedor falla, como nos pasó en el vídeo anterior con los cuatrocientos veintinueve, Pi espera y reintenta, y en la parte de abajo lo indica: retrying, dos de tres. Los intentos fallidos se quedan en la sesión, pero marcados para que el modelo no los vuelva a ver.

Hay un segundo tipo de recuperación, menos visible. Si el proveedor responde que la petición no cabe en la ventana de contexto, o corta la respuesta antes de tiempo por falta de espacio, Pi compacta la conversación y reintenta una vez. No tienes que hacer nada; solo saber que existe, porque explica por qué a veces aparece una compactación que no pediste.

**2 · Qué recibe el modelo**

Vamos con el contexto, es decir, con lo que el modelo recibe en cada petición. La primera pieza es el prompt de sistema. Pi lo construye con sus instrucciones base y le añade los ficheros de contexto que encuentra: el AGENTS punto md de tu proyecto, el de las carpetas superiores y el global del directorio del agente.

Las instrucciones base son cortas. Dicen que el modelo es un asistente de programación dentro de Pi, describen las cuatro herramientas, dan unas pocas reglas, como usar read para leer ficheros y edit para cambios precisos, e indican dónde está la documentación de Pi y cuál es la carpeta de trabajo. Lo hemos podido leer porque queda guardado en la sesión, como veremos enseguida.

Si quieres cambiar ese prompt tienes dos ficheros. SYSTEM punto md lo sustituye entero, y APPEND SYSTEM punto md le añade texto al final. Pueden estar en el directorio del agente o en la carpeta punto pi del proyecto, y en ese caso solo se usan si confías en el proyecto. Lo veremos con detalle en el vídeo seis, dedicado a personalizar sin código.

La segunda pieza son las herramientas. Cada petición lleva la definición de las herramientas activas: su nombre, su descripción y sus parámetros. En Pi, de serie, son cuatro: read, bash, edit y write. Las skills funcionan de otra forma: en cada petición viaja solo su descripción, y las instrucciones completas se cargan cuando el modelo decide usarlas.

La tercera pieza es la conversación, pero no toda. El modelo recibe únicamente la rama activa de la sesión. Si has vuelto atrás y probado otra cosa, la rama abandonada sigue en el fichero, pero no viaja. Esta es la clave de todo lo que veremos hoy, así que quédate con la idea: lo que está en el fichero y lo que ve el modelo no son lo mismo.

La cuarta pieza es lo que tú añades al mensaje. Las plantillas de prompt se expanden antes de enviarse. Los ficheros que señalas con la arroba, las imágenes que pegas y la salida de los comandos con una exclamación pasan a formar parte del contenido. Todo eso es texto que entra en el contexto y que se volverá a enviar en cada turno siguiente.

Y todo esto se guarda. La primera petición de una sesión registra un mensaje de sistema con todas las secciones del prompt y las declaraciones de herramientas. Si algo cambia después, por ejemplo porque activas una herramienta, Pi guarda solo la diferencia. El objetivo es no tocar el principio de la conversación, porque ese principio es lo que el proveedor tiene en caché.

¿Cómo puedes ver todo esto con tus propios ojos? Barra session te da los totales: mensajes, llamadas a herramientas y tokens, con la parte servida desde la caché. Para el detalle, el propio fichero de sesión guarda el prompt de sistema que se envió y cada mensaje tal cual. Y barra export lo convierte en una página que se lee cómodamente. Si alguna vez dudas de qué sabía el modelo en un momento dado, la respuesta está ahí.

**3 · La sesión es un árbol**

Ahora, la sesión. Cada sesión es un fichero JSONL dentro del directorio del agente, en una carpeta por proyecto. JSONL significa una línea por entrada, y cada entrada es un objeto JSON. La primera línea es la cabecera de la sesión; las demás son mensajes y eventos.

Cada entrada tiene un identificador y la referencia a su padre, el parent id. Con eso basta para formar un árbol. La entrada actual, la hoja en la que estás, marca la rama activa: Pi recorre los padres desde la hoja hasta la raíz y esa es la historia que reconstruye para el modelo.

En la demo le pusimos nombre a la sesión con barra name, precios, y ese nombre aparece en el pie, junto a la carpeta y la rama de git. Nombrar las sesiones es un hábito barato que te ahorra tiempo cuando tienes muchas y quieres encontrarlas después.

Al final de la demo miramos el fichero por dentro con jq. Había treinta y seis entradas de tipo mensaje, un resumen de rama, una compactación, un cambio de modelo, otro de nivel de razonamiento, la información de la sesión y la cabecera. En los mensajes cuentan tanto los tuyos como los del asistente y los resultados de cada herramienta.

La segunda consulta enseña las últimas entradas con su identificador y el de su padre. Se ve la cadena: cada mensaje apunta al anterior, la compactación apunta al último mensaje antes de ella, y los mensajes nuevos cuelgan de la compactación. Eso es todo el formato. No hay base de datos ni magia, y puedes leerlo, filtrarlo o procesarlo con tus propias herramientas.

Hay más tipos de entrada que no salieron hoy: etiquetas, ediciones de contexto para los intentos fallidos, mensajes de extensiones o datos propios que guardan las extensiones. La documentación de formato de sesión los describe todos. Para el día a día basta con saber que todo lo que pasa en la sesión deja una línea, y que esas líneas no se borran aunque el modelo deje de verlas.

Unas cuantas opciones de línea de comandos completan el cuadro. Guion guion no session arranca sin guardar nada, útil para preguntas rápidas. Guion guion session, con una ruta o un identificador parcial, abre una sesión concreta. Guion guion fork crea una sesión nueva a partir de otra antes incluso de entrar en la interfaz. Y guion guion session dir, o el ajuste session dir, cambia la carpeta donde se guardan, por ejemplo para tenerlas dentro del proyecto.

**4 · Volver atrás sin perder nada**

Ahora vamos a aprovechar ese árbol. La situación de la demo es muy habitual. Le pedimos al modelo que aplicara el IVA al total con cupón antes de calcular el envío. Lo hizo, pasaron las diez pruebas, y el umbral de envío gratis pasó a medirse con IVA. Con esa regla, un pedido de treinta y cinco euros sin IVA, que con impuestos son cuarenta y dos con treinta y cinco, ya no paga envío.

Eso nos hizo dudar. ¿Y si el umbral debería calcularse sin IVA? Podríamos pedirle que deshiciera el cambio, pero la conversación quedaría llena de idas y venidas. Lo limpio es volver al punto de decisión y probar la otra opción en una rama nueva, sin perder la primera.

Pero antes, un aviso muy importante. Barra tree mueve la conversación, no tus ficheros. Pi no deshace lo que el modelo escribió en el disco. Si vuelves atrás en el árbol, el código sigue como estaba. Por eso fuimos guardando el trabajo en git con comandos de doble exclamación: primero, un commit con la función de IVA; después, la opción A en su propia rama, iva antes, para volver a master sin ella. Tu control de versiones es git; el árbol de Pi es la memoria de la conversación.

Ahora sí: barra tree. Se abre el árbol de la sesión con todas sus entradas. El prompt de sistema, nuestros mensajes, los comandos de bash, las lecturas, las ediciones, las respuestas y también nuestros commits. Arriba, la ayuda: flechas para moverte, filtros para ocultar tipos de entrada, etiquetas y búsqueda.

Con sesiones largas, el árbol se llena enseguida. Para eso están los filtros: control t oculta los resultados de herramientas, control u deja solo tus mensajes y control a lo muestra todo. Mayúsculas l pone una etiqueta a la entrada seleccionada, por ejemplo opción A, y control l filtra para ver solo las etiquetadas. Y un atajo práctico: con el editor vacío, pulsar Escape dos veces abre directamente barra tree.

Nos movemos hasta nuestro segundo mensaje, el de aplicar el IVA antes del envío, y pulsamos Enter. Antes de saltar, Pi pregunta si queremos resumir la rama que abandonamos. Hay tres opciones: no resumir, resumir, o resumir con instrucciones propias. Elegimos resumir.

Elegir un mensaje tuyo no es la única forma de moverse. Si eliges una respuesta del asistente o cualquier otra entrada, Pi te coloca justo después de ella con el editor vacío, y lo siguiente que escribas crea la rama desde ahí. Es útil cuando la respuesta era buena pero quieres seguir por otro camino.

El resumen de rama es una pieza muy útil. Pi le pide al modelo que resuma lo que se hizo en la rama que dejamos y lo cuelga en el punto al que volvemos. Así, la nueva rama sabe que existió la otra, sin cargar con todos sus mensajes. En la pantalla aparece una entrada llamada branch, con el resumen plegado.

Desplegado con control o, el resumen tiene una estructura fija: el objetivo, las restricciones y preferencias, el progreso con lo hecho y lo pendiente, las decisiones clave, los siguientes pasos y la lista de ficheros modificados. Esta vez lo escribió en inglés y recoge bien lo que pasó: el IVA antes del envío, el umbral medido con IVA y las diez pruebas. Es la misma estructura que usa la compactación, que veremos enseguida.

Al volver, el texto de nuestro mensaje original aparece en el editor, listo para editarlo. Lo sustituimos por la opción B: calcula el envío sobre el total con cupón sin IVA, y aplica el IVA al final, solo a los productos. Lo enviamos, y eso crea una rama nueva desde ese punto.

Lo primero que hace el modelo en la rama nueva es revelador. En su razonamiento dice que el resumen habla de una rama que modificó la función, así que antes de nada mira el estado real de los ficheros. Los lee, comprueba que están en la versión original, y concluye que el resumen describía otra rama. Gracias a git, el disco y la conversación cuentan la misma historia, y el modelo confía en el disco.

La opción B también funcionó. Doce pruebas pasan, y una de ellas es justo el caso que nos preocupaba: un pedido de treinta y cinco euros sin IVA sigue pagando envío, aunque con impuestos supere los cuarenta. Guardamos esta versión en otra rama de git, iva después.

Si volvemos a abrir barra tree, se ven las dos ramas en la misma pantalla. En el punto de bifurcación está el resumen de rama, y debajo, la opción B con todos sus pasos. Más abajo, con otro sangrado, la opción A, intacta. Podemos saltar de una a otra cuando queramos, y Pi volverá a ofrecer un resumen cada vez que dejemos una.

**5 · Fork, clone y resume**

Barra tree mantiene las alternativas juntas, en el mismo fichero. A veces prefieres lo contrario: que una alternativa se convierta en un trabajo aparte. Para eso están barra fork y barra clone, que crean un fichero de sesión nuevo.

Barra fork te enseña tus mensajes de usuario y te pide que elijas uno. La descripción lo explica: copia el camino activo hasta ese punto en una sesión nueva. Elegimos el primero, el de añadir la función de IVA. Pi responde forked to new session, y el texto de ese mensaje aparece en el editor, como en barra tree. La sesión nueva empieza justo antes de él.

Fíjate en el pie: el contexto ha bajado al cero coma uno por ciento. Es una sesión nueva que solo contiene lo que había antes de ese mensaje, es decir, casi nada. Es la forma limpia de decir: quiero volver a empezar esta parte, pero en otro sitio, sin tocar la sesión original.

Para movernos entre sesiones está barra resume. El selector muestra las sesiones de la carpeta actual, con su nombre o su primer mensaje, el número de entradas y la antigüedad. Ahí está precios, con treinta y cuatro entradas, y la sesión del vídeo anterior. El fork no aparece, porque no llegamos a escribir nada en él.

El selector tiene sus propios atajos. Tabulador cambia entre la carpeta actual y todas. Control n deja solo las sesiones con nombre, otro motivo para nombrarlas. Control r renombra y control d borra; si tienes instalada la utilidad trash, Pi la usa para que el borrado se pueda deshacer. Elegimos precios y volvemos a la sesión.

Barra clone es el tercer mecanismo: copia la rama activa, tal como está ahora, en una sesión nueva. Lo usamos al final de la demo y lo comprobamos en el disco. La sesión original tenía treinta y siete mensajes, contando las dos ramas. El clon tiene veintinueve, solo los de la rama activa. Y su cabecera incluye un campo parent session con la ruta de la sesión de la que viene.

Resumiendo las tres herramientas. Barra tree, cuando las alternativas deben quedarse juntas en el mismo fichero. Barra fork, cuando quieres empezar de nuevo desde un mensaje anterior en una sesión aparte. Y barra clone, cuando quieres una copia independiente del estado actual, por ejemplo para experimentar sin miedo a ensuciar la sesión buena.

**6 · La compactación**

Llegamos a la pieza más delicada: la compactación. Ya sabemos que cada turno vuelve a enviar toda la rama activa. Tarde o temprano, la conversación no cabe en la ventana del modelo. Pi lo resuelve resumiendo lo antiguo y conservando lo reciente.

La regla automática es sencilla. Cuando el contexto supera el tamaño de la ventana menos una reserva, Pi compacta. La reserva, por defecto, son dieciséis mil trescientos ochenta y cuatro tokens, que se dejan libres para la respuesta. Y al compactar, conserva sin resumir los veinte mil tokens más recientes. Con la ventana de un millón de tokens de DeepSeek Flash, eso tardaría mucho en pasar.

También se puede compactar a mano con barra compact, y añadir instrucciones sobre qué conservar. Lo probamos: barra compact, conserva las dos opciones de IVA probadas y cuál quedó en la rama activa. Y Pi respondió en rojo: nothing to compact, session too small. No es un fallo. Nuestra sesión ocupaba menos de diez mil tokens, menos que los veinte mil que se conservan siempre, así que no había nada antiguo que resumir.

Para verlo en acción, bajamos ese margen en los ajustes de la demo: compaction punto keep recent tokens, a tres mil. Hicimos barra reload y repetimos el comando. Esta vez sí: compacted from ocho mil novecientos veintisiete tokens. En la conversación aparece una entrada compaction, y el uso de contexto del pie se queda con una interrogación hasta la siguiente petición.

¿Qué hace exactamente? Busca un punto de corte recorriendo la historia hacia atrás hasta acumular los tokens que hay que conservar. Pide al modelo un resumen estructurado de todo lo anterior a ese punto. Guarda una entrada de compactación con el resumen y con el identificador del primer mensaje que se conserva. Y a partir de ahí, el modelo recibe el prompt de sistema, el resumen y los mensajes desde ese punto.

Lo importante: las entradas originales no se borran. Siguen en el fichero de sesión, y las puedes ver en barra tree o exportar. Solo dejan de enviarse al modelo. Compactar no destruye nada; cambia lo que el modelo ve.

Y ahora, la parte que más nos interesa. Desplegamos el resumen para revisarlo. Esta vez está en español, y describe muy bien la primera tarea: la función de IVA, sus tres pruebas y las diez que pasan. Pero no dice nada de las opciones A y B. ¿Por qué? Porque el corte cayó justo después de esa primera tarea. Todo lo demás, el resumen de rama y la opción B, quedó en la parte que se conserva íntegra.

Lo curioso es qué hizo con nuestra instrucción. Le pedimos conservar las dos opciones de IVA probadas, y en la parte que tenía que resumir no había ninguna. Así que la cumplió a su manera: en el contexto crítico presenta el veintiuno por ciento por defecto y el diez por ciento de una de las pruebas como si fueran las dos opciones de IVA. Suena razonable, pero no es lo que queríamos decir.

Es un error sutil, y por eso es instructivo. Un resumen lo escribe un modelo, y el modelo intenta obedecer las instrucciones aunque no tenga el material para hacerlo. Si alguien leyera solo ese resumen, creería que las alternativas que probamos eran dos tipos de IVA.

Así que lo pusimos a prueba. Le preguntamos al modelo, sin mirar ficheros, qué dos formas de aplicar el IVA habíamos probado y cuál está en la rama actual. Y acertó: primero, aplicar el IVA antes del envío, en la otra rama; segundo, el envío sin IVA y el IVA solo a los productos, que es la rama actual. En su razonamiento se ve que lo saca del resumen de rama y de los mensajes recientes, no del resumen de compactación.

Al desplegar nuestro resumen aparece también un detalle de formato: los ficheros leídos y modificados, al final, en dos listas. Pi los va acumulando de compactación en compactación, para que el modelo sepa qué ficheros tocó aunque ya no tenga los mensajes. Y si un solo turno, con todas sus herramientas, ocupa más que el margen conservado, Pi corta a mitad de ese turno y añade una sección aparte para su principio; es lo que la documentación llama un turno partido.

De aquí salen tres lecciones prácticas. La primera: revisa el resumen después de compactar; control o lo despliega y se lee en un minuto. La segunda: da instrucciones a barra compact, pero ten en cuenta que solo se aplican a la parte que se resume. Y la tercera, la más importante: las decisiones de verdad tienen que vivir en ficheros. El código, las pruebas y un commit con un buen mensaje no se resumen mal.

Y una cuarta, más técnica. El resumen lo escribe el modelo de la sesión, así que con un modelo pequeño el riesgo es mayor. Si la sesión es importante, puedes cambiar a un modelo más capaz con barra model justo antes de compactar. Los márgenes también se pueden ajustar por modelo con compaction punto model overrides, porque no es lo mismo una ventana de doscientos mil tokens que una de un millón.

Hay un último detalle en el pie después de compactar: la tasa de acierto de caché cae, en nuestro caso hasta el veintidós coma ocho por ciento. Es lógico. El principio de la conversación ha cambiado, porque ahora empieza con un resumen, así que la caché del proveedor ya no sirve para esa parte. La siguiente petición se paga casi entera, y a partir de ahí la caché vuelve a llenarse.

**7 · Exportar y cerrar**

Para terminar, dos herramientas de salida. Barra export escribe la sesión en un fichero HTML, o en JSONL si le das esa extensión. En la demo exportamos precios a un HTML de unos trescientos setenta y ocho kilobytes, con toda la conversación, las herramientas y sus resultados. Es la mejor forma de revisar una sesión larga con calma o de guardarla junto a un proyecto.

También existe barra share, que sube la sesión y te devuelve un enlace para verla en el navegador. No la usamos en el curso, porque publica, y conviene tener cuidado: una sesión exportada o compartida contiene tus prompts, las respuestas, los argumentos de las herramientas, la salida de los comandos y el contenido de los ficheros que se leyeron. En nuestra demo, por ejemplo, los resúmenes incluían rutas completas con el nombre de usuario. Revísala antes de que salga de tu máquina.

Recapitulemos. Cada mensaje desencadena uno o varios turnos, y en cada turno Pi envía el prompt de sistema, las herramientas y la rama activa. La sesión es un árbol en un fichero JSONL: barra tree se mueve dentro de él, barra fork y barra clone crean ficheros nuevos, y barra resume te lleva de una sesión a otra. Y la compactación resume lo antiguo para que quepa lo nuevo, a veces con errores.

Si te quedas con una sola idea de este vídeo, que sea esta: la conversación es memoria de trabajo, no la fuente de verdad. El árbol de Pi te deja explorar sin miedo, pero lo que importa tiene que acabar en el repositorio: en el código, en las pruebas y en git.

La práctica de hoy: en tu repositorio de juguete, pide un cambio y guárdalo en una rama de git. Vuelve atrás con barra tree, pide una alternativa con resumen de rama y compara las dos. Después baja keep recent tokens, compacta con instrucciones y lee el resumen con control o. Busca si dice algo que no sea cierto.

Si quieres ir un paso más allá, abre el fichero JSONL de esa sesión y busca la entrada de compactación. Comprueba a qué mensaje apunta su first kept entry id y cuenta cuántas entradas quedaron fuera. Después exporta la sesión a HTML y compara lo que ves allí con lo que el modelo recibió en su última petición.

En el próximo vídeo hablamos de modelos y proveedores: cómo conectar varios, cambiar de modelo a mitad de tarea, usar modelos locales y entender qué cuesta cada petición. Nos vemos allí.

</details>

