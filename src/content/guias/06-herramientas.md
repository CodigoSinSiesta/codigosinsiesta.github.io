---
title: "Guía 06 · Herramientas: cómo actúa"
description: "Qué es una herramienta, cómo elige el modelo cuál usar, qué herramientas trae OpenCode 2 y cuáles piden permiso en el laboratorio, y por qué cada resultado ocupa sitio en la ventana de contexto."
ruta: "ia-desde-cero"
orden: 6
duracion: "15 min"
---

En el [vídeo 05](/rutas/ia-desde-cero/05-el-bucle-y-las-herramientas) viste el bucle del agente con una tarea real: leer, razonar, actuar y observar, vuelta tras vuelta. Esta guía mira de cerca el paso de **actuar**: qué es una herramienta, cómo decide el modelo cuál pedir, qué herramientas trae OpenCode 2, cuáles te piden permiso en el laboratorio y cuánto ocupa cada una en la ventana de contexto.

## Qué es una herramienta

Una **herramienta** es una acción que el programa que rodea al modelo (OpenCode) sabe hacer y que le ofrece al modelo. Para el modelo no es código: es un texto con tres partes, como un plato en la carta de un restaurante.

- **Nombre:** cómo se pide. Por ejemplo, `edit`.
- **Descripción:** para qué sirve y cuándo conviene usarla, escrita para que la lea el modelo. La de `edit` dice, en resumen, que cambia un fichero buscando un texto exacto y sustituyéndolo.
- **Parámetros:** los datos que hay que darle. `edit` necesita la ruta del fichero, el texto que se busca y el texto que lo sustituye.

Cuando el modelo quiere actuar, en lugar de responder con prosa escribe una **llamada a herramienta**: el nombre y los parámetros rellenos, con un formato que OpenCode sabe leer. OpenCode comprueba los permisos, la ejecuta y le devuelve el resultado como un mensaje más de la conversación.

Lo importante: **el modelo solo pide**. Si rechazas la llamada, no pasa nada en tus ficheros: el modelo recibe el rechazo como resultado y decide qué hacer después.

## Cómo elige el modelo

En cada llamada al modelo, OpenCode le envía tres cosas: sus instrucciones, la conversación hasta ese momento y **la carta completa** de herramientas disponibles. El modelo lee las descripciones, compara con lo que le falta y escoge. No hay una regla fija detrás: es el mismo mecanismo con el que escribe cualquier texto. De ahí salen cuatro cosas:

- **Puede pedir varias a la vez**, y OpenCode las ejecuta todas antes de volver a llamarle.
- **No siempre elige la más obvia.** `read` sabe listar una carpeta, pero en la prueba del vídeo 05 el modelo prefirió listar con un comando de la shell. Las dos sirven; una pide permiso en el laboratorio y la otra no.
- **Si una puerta se cierra, busca otra.** En nuestras pruebas sin nadie para aprobar, el modelo intentó un comando, se lo rechazaron y probó a buscar los ficheros con otra herramienta.
- **La carta cambia según el modelo y la configuración.** `patch` solo se ofrece a algunos modelos GPT (los demás reciben `edit` y `write`), y `websearch` solo aparece si el proveedor elegido la admite.

Si quieres que use una concreta, díselo en la petición («busca con grep dónde se calcula el total»): lo que escribes pesa en su elección.

## Las herramientas de OpenCode 2

Estos son los nombres de la versión 2. Si lees tutoriales antiguos, en OpenCode 1 la shell se llamaba `bash` y los subagentes se lanzaban con `task`.

La columna «En el laboratorio» sale del `opencode.json` del laboratorio, que pide permiso para cinco acciones: `shell`, `edit` (que cubre también `write` y `patch`), `webfetch`, `execute` y `external_directory`, que es cualquier acceso fuera de la carpeta del proyecto. Todo lo demás se ejecuta sin preguntar, salvo leer ficheros `.env`, que OpenCode pregunta siempre por defecto.

| Herramienta | Para qué sirve | En el laboratorio |
|---|---|---|
| `read` | Lee un fichero con sus líneas numeradas, o lista lo que hay en una carpeta. Los ficheros grandes los lee por trozos. | No pregunta (salvo `.env` o fuera del proyecto) |
| `glob` | Busca ficheros por su nombre, con patrones como `**/*.js` («todos los `.js`, en cualquier carpeta»). | No pregunta |
| `grep` | Busca un texto dentro de los ficheros y devuelve el fichero, la línea y un trozo. | No pregunta |
| `edit` | Cambia un trozo de un fichero que ya existe: el texto buscado tiene que aparecer una sola vez. | **Pregunta** |
| `write` | Crea un fichero o lo sustituye entero. | **Pregunta** |
| `patch` | Aplica de una vez cambios en varios ficheros. Solo para algunos modelos GPT. | **Pregunta** |
| `shell` | Ejecuta un comando en la terminal, como `npm test`. Tiene todo el poder de tu usuario sobre ficheros, procesos y red. | **Pregunta** |
| `webfetch` | Descarga una página web como texto. | **Pregunta** |
| `websearch` | Busca en internet, si el proveedor del modelo lo permite. | No pregunta |
| `question` | Te hace una o varias preguntas con opciones y espera tu respuesta. | Es ella la que te pregunta |
| `skill` | Carga las instrucciones de una *skill*: un paquete de instrucciones para un tipo de tarea. | No pregunta |
| `subagent` | Encarga una parte del trabajo a otro agente, en una sesión aparte. | No pregunta |
| `execute` | *Code Mode*: el modelo escribe un pequeño programa en JavaScript que combina herramientas o ejecuta código, sin pasar por la shell. | **Pregunta** |

Hay una más, experimental, para generar imágenes, que no verás en esta ruta. Ojo con `execute`: en nuestras pruebas, con la shell denegada, el agente la usó para ejecutar las pruebas del proyecto por otra vía. Por eso el laboratorio también la pone en «preguntar».

Ojo: esta columna es **la configuración del laboratorio**. OpenCode 2, tal como viene, lo permite todo sin preguntar salvo leer un `.env`. Y una petición de permiso te deja **ver** lo que va a pasar, no te protege por sí sola: la barrera es el contenedor. La [guía 09](/rutas/ia-desde-cero/09-lo-que-puede-romper) cuenta la diferencia.

## Cada resultado ocupa sitio

En la [guía 04](/rutas/ia-desde-cero/04-la-ventana-de-contexto) viste que la **ventana de contexto** es todo lo que el modelo tiene delante en una llamada, medido en **tokens** (los trozos de texto con los que trabaja el modelo, de unas pocas letras cada uno). Las herramientas la llenan por dos lados:

- **La carta viaja en cada llamada.** En nuestras pruebas, antes de que el agente hiciera nada ya iban unos miles de tokens solo en instrucciones y descripciones de herramientas.
- **Cada resultado se queda.** Cuando el agente lee un fichero, su contenido entra en la conversación y se reenvía en todas las vueltas siguientes. Una búsqueda que devuelve cien líneas, también.

OpenCode pone topes (`read` lee los ficheros grandes por trozos; `glob` y `grep` limitan sus resultados), pero buena parte la decides tú con la petición: señala el fichero con `@` en lugar de dejar que lo busque, pide buscar con `grep` antes de leer carpetas enteras y empieza una sesión nueva cuando cambies de tema.

## Dos nombres para que te suenen

- **Subagentes.** Con la herramienta `subagent`, el agente principal lanza otro agente con su propia sesión. OpenCode trae `explore`, que solo lee y busca, y `general`, para tareas amplias. Como trabaja en una sesión aparte, lo que lee no llena la tuya: a la principal le llega su respuesta.
- **MCP** (*Model Context Protocol*). Una forma estándar de enchufar herramientas de otros programas: cada servidor MCP conectado añade las suyas a la carta, con su propio permiso. Es el cargador universal de las herramientas.

En esta ruta no hacen falta. Los dos se tratan a fondo en el curso de Pi.

## Pruébalo en OpenCode

Repite la tarea del vídeo 05 fijándote solo en las herramientas. Todo dentro del laboratorio.

1. En la terminal del laboratorio, ponte en la rama de esta práctica:

   ```bash
   git checkout guia-05 && git reset --hard origin/guia-05
   ```

2. Ejecuta `cat opencode.json` y localiza las cuatro reglas con `"effect": "ask"`. Antes de empezar, apunta qué herramientas de la tabla crees que te van a preguntar.
3. Arranca `opencode`, comprueba que el agente activo es *build* y pídele: «Añade a `src/compra.js` una función `quitar` que devuelva la lista sin ese producto, añade su prueba y ejecuta `npm test`».
4. En cada paso, apunta en una tabla de tres columnas: la vuelta, la herramienta que pide y si te preguntó. Aprueba cada permiso **una sola vez** («Allow once»), no «siempre».
5. Compara tu tabla con tu predicción del paso 2. ¿Usó alguna herramienta que no esperabas? ¿Listó con `read` o con `shell`?
6. Deshaz el cambio con `/undo`. Cambia al agente *plan* con Shift+Tab y pídele: «Busca dónde se calcula el total y explícamelo, sin cambiar nada». Mira qué herramientas usa ahora: deberían ser de las que no preguntan (`glob`, `grep`, `read`).
7. Mira el porcentaje de contexto en el pie de la pantalla después de cada paso: ¿cuándo sube más?

## Fuentes

- [Herramientas de OpenCode 2](https://opencode.ai/v2/docs/tools/): la lista completa, qué hace cada una y cómo llegan al modelo.
- [Permisos de OpenCode 2](https://opencode.ai/v2/docs/permissions/): las acciones, los efectos `allow`, `ask` y `deny`, y los valores por defecto.
- [Agentes de OpenCode 2](https://opencode.ai/v2/docs/agents/): *build*, *plan* y los subagentes `general` y `explore`.
- [Migrar de OpenCode 1](https://opencode.ai/v2/docs/migrate-v1/): los cambios de nombre, como `bash` a `shell` y `task` a `subagent`.
- [Laboratorio de la ruta](https://github.com/CodigoSinSiesta/ia-desde-cero-laboratorio): su `opencode.json` y la rama `guia-05`.
- [Vídeo 05 · De chat a agente: el bucle y las herramientas](/rutas/ia-desde-cero/05-el-bucle-y-las-herramientas): la tarea de esta práctica, vuelta a vuelta.
