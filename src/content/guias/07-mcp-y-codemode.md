---
title: "Vídeo 07 · MCP y codemode: lo nuevo de la 1.0"
description: "La gran novedad de Pi 1.0. Conectar servidores MCP y usarlos en modo codemode, donde el modelo escribe código para llamar a las herramientas y ahorra contexto."
ruta: "pi-oh-my-pi"
orden: 7
duracion: "17 min"
video: "07-mcp-y-codemode.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/07-mcp-y-codemode.es.vtt"
---

La gran novedad de Pi 1.0. Conectar servidores MCP y usarlos en modo codemode, donde el modelo escribe código para llamar a las herramientas y ahorra contexto.

<p class="guia__nota">Dura 17 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De «no MCP» a MCP de serie

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Qué es MCP:** el Model Context Protocol es un estándar abierto para que un agente (el cliente) use herramientas que expone otro programa (el servidor MCP): buscar en un repositorio, consultar una base de datos, leer documentación. Claude Code, Cursor, Codex y muchos otros hablan MCP.
- **Por qué Pi no lo tenía:** cada herramienta declarada viaja en cada petición, con nombre, descripción y parámetros, y un servidor grande puede llenar el contexto antes de empezar. Pi proponía CLI y skills, que solo cuestan cuando se usan.
- **Qué cambia en la 1.0:** MCP viene de serie como extensión integrada (`builtin:mcp`), acompañado de dos piezas contra ese coste: codemode y tool search.

### 2 · Conectar un servidor

<p><button type="button" class="ir-a" data-t="98">▶ Ir a 1:38</button></p>

- **Añadir y comprobar:** `pi mcp add <nombre> -- <comando>` lo guarda en `mcp.json`, y `pi mcp list` dice si conecta, cuántas herramientas tiene y en qué modo. *En la demo:* el servidor de ficheros oficial, limitado a la carpeta de la tienda, conecta con catorce herramientas en modo codemode, sin credenciales.
- **Dónde se configura:** `~/.pi/agent/mcp.json` para los tuyos y `.pi/mcp.json` en el proyecto, que solo se carga con confianza. El formato es el de Claude Code o Cursor, así que puedes copiar tus servidores casi tal cual.
- **Locales y remotos:** un servidor local es un proceso que Pi arranca y con el que habla por la entrada y la salida estándar; uno remoto, una URL por HTTP. Las credenciales van con variables de entorno (`${VAR}`) o un comando con `!`; para OAuth, `/mcp login`.
- **Recomendación:** servidores personales y con credenciales, en el fichero del usuario; en el del proyecto, solo lo que el proyecto necesita.

### 3 · El coste de las herramientas en el contexto

<p><button type="button" class="ir-a" data-t="282">▶ Ir a 4:42</button></p>

- **El problema:** cada herramienta declarada viaja en cada petición, con su esquema de parámetros, y se paga en tokens en cada turno. La caché de prompts lo abarata (vídeo 04), pero no quita el otro coste: cuantas más herramientas ve el modelo, más fácil es que elija mal.
- **La medida:** con la petición «Di solo: hola», el primer contexto pasa de 1971 tokens sin servidor a 4054 con las catorce herramientas declaradas: más del doble. La tabla completa está en «Código y comandos».
- **Mídelo tú:** `pi -p --mode json` con una petición trivial y mira el uso de tokens del primer mensaje del asistente, o el porcentaje de contexto del pie.

### 4 · Cuatro formas de exponer un servidor

<p><button type="button" class="ir-a" data-t="380">▶ Ir a 6:20</button></p>

- **La exposición se elige por servidor:**
  - **codemode** (por defecto): las herramientas no se declaran al modelo; solo se llaman desde un script de la herramienta `codemode`, que las busca cuando las necesita.
  - **deferred**: no se declaran hasta que la herramienta `tool_search` las encuentra; desde ahí se llaman directamente.
  - **direct**: se declaran como una herramienta de serie más.
  - **hidden**: registradas, pero inaccesibles.
- **`/mcp`** muestra cada servidor con su estado, origen y exposición, y permite reconectar, cambiar la exposición o desactivarlo (también solo en este proyecto). Los cambios se guardan en `mcp.json`.
- **Escala:** en codemode y deferred el coste inicial casi no depende del tamaño del servidor; en direct, cada herramienta suma.
- **Afinar por herramienta:** `toolExposure` cambia la exposición de herramientas concretas con patrones `*`. Dale además a cada servidor una descripción de una frase: es lo que ve el modelo. *En la demo:* con `write_file`, `edit_file`, `move_file` y `create_directory` en `hidden`, el servidor de ficheros queda de solo lectura.

### 5 · Codemode por dentro

<p><button type="button" class="ir-a" data-t="536">▶ Ir a 8:56</button></p>

- **Tres cosas con el mismo nombre:** (a) `codemode` es una **herramienta** que deja al modelo escribir un script de JavaScript que llama a otras herramientas; (b) la **exposición** codemode de un servidor MCP hace que sus herramientas solo sean accesibles desde esa herramienta; (c) el **ajuste** `codemode.mode` decide qué pasa con las herramientas de serie: con `on` siguen declaradas y codemode también puede llamarlas; con `only` se ocultan y todo pasa por scripts.
- **Por qué ahorra:** el script corre en un sandbox QuickJS, sin APIs de Node, sin ficheros, sin red y sin temporizadores; solo toca el mundo a través de las herramientas, y al modelo solo le llega la salida del script. Eso permite lanzar llamadas en paralelo y filtrar resultados enormes antes de que entren en el contexto.
- **Dentro del script:** cada herramienta es un método de `tools`; para encontrar las no declaradas están `searchTools`, `describeTool` y `ALL_TOOLS`; `text` y `return` añaden salida, y `store`/`load` guardan valores pequeños entre scripts, ligados a la rama de la sesión.
- *En la demo:* el modelo necesitó siete scripts para sacar el tamaño de cuatro ficheros. El primero olvidó el `await`; varios solo servían para descubrir qué herramientas había y cómo respondían. **La lección:** el descubrimiento cuesta. En un servidor que usas a menudo, una buena descripción o exponer en direct las dos o tres herramientas clave ahorra esos rodeos.
- **Sin MCP:** `--tools read,bash,edit,write,codemode` (o `"+codemode"` en `defaultTools`; el `+` añade a las de serie en lugar de sustituirlas). *En la demo:* un solo script lista los ficheros, los lee en paralelo y devuelve cuatro líneas de conteo; el contenido de los ficheros nunca entra en el contexto.

### 6 · Tool search y el modo deferred

<p><button type="button" class="ir-a" data-t="794">▶ Ir a 13:14</button></p>

- **Cómo funciona:** el modelo llama a `tool_search` con una búsqueda en lenguaje natural; Pi le devuelve las herramientas que encajan y las declara. Desde ahí las llama directamente, sin script. Quedan declaradas en esa rama de la sesión, así que no hay que buscarlas otra vez.
- **¿Cuándo cada uno?**

| Exposición | Úsala cuando… |
|---|---|
| codemode | Hay que combinar o filtrar muchas llamadas |
| deferred | Usas unas pocas herramientas de un servidor grande, una y otra vez |
| direct | El conjunto es pequeño y lo usas casi en cada tarea |
| hidden | No quieres que el modelo use esa herramienta (p. ej. las que escriben) |

### 7 · Seguridad y buenas prácticas

<p><button type="button" class="ir-a" data-t="866">▶ Ir a 14:26</button></p>

- **1 · La misma tubería:** todas las llamadas MCP, también las de un script de codemode, pasan por la misma tubería que las de serie. Una extensión de permisos (vídeo 08) se aplica igual.
- **2 · Anotaciones y `hidden`:** los servidores pueden marcar sus herramientas como de solo lectura, destructivas o idempotentes, y una extensión puede usarlo para decidir qué confirmar. Si solo quieres consultar, pon en `hidden` las que escriben.
- **3 · Un servidor local corre con tus permisos,** y uno remoto recibe lo que el modelo le mande. Instala solo servidores de confianza y guarda las credenciales en el fichero del usuario. El estado, en `pi mcp list`; los mensajes, en `mcp.log`.
- **Detalles:** los resultados de texto de más de 20 KB llegan recortados por el medio (salvo dentro de codemode, donde el script recibe el texto entero), y `/reload` vuelve a leer la configuración.
- **En otros agentes:** Claude Code, Cursor, Codex y opencode también hablan MCP, y el `mcp.json` de Pi usa el mismo formato que Claude Code o Cursor; la documentación trae una tabla para convertir los de VS Code, Codex y OpenCode.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### ~/.pi/agent/mcp.json

```text
{ "mcpServers": {
    "tienda-fs": { "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/ruta/a/tienda"] },
    "docs": { "url": "https://example.com/mcp", "headers": { "Authorization": "Bearer ${DOCS_TOKEN}" } }
} }
```

- `"tienda-fs"`: un servidor local; Pi lanza el comando y habla con él por stdio. El último argumento es la carpeta a la que se limita.
- `"docs"`: un servidor remoto por HTTP.
- `${DOCS_TOKEN}`: se sustituye por esa variable de entorno, para no escribir el token en el fichero.

### Tamaño del primer contexto según la exposición

Petición «Di solo: hola», medida con `pi -p --mode json`, con las cuatro herramientas de serie y el `AGENTS.md` de la tienda.

| Exposición de `tienda-fs` | Tokens | Diferencia | Qué se declara |
|---|---|---|---|
| Sin servidor MCP | 1971 | — | Las herramientas de serie |
| codemode | 2492 | +521 | La herramienta `codemode` y una línea que presenta el servidor |
| deferred | 2193 | +222 | Nada del servidor hasta que `tool_search` lo encuentra |
| direct | 4054 | +2083 | Las 14 herramientas del servidor |

### Mídelo tú

```text
pi -p --no-session --mode json "Di solo: hola" | jq -c 'select(.type=="message_end") | .message.usage'
# o: el porcentaje de contexto del pie tras el primer mensaje
```

- `--mode json` emite cada evento como una línea JSON; `jq` se queda con el uso de tokens de cada mensaje.

### toolExposure (ejemplo de la documentación)

```text
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "exposure": "deferred",
  "description": "Issues, pull requests y código de GitHub",
  "toolExposure": { "search_code": "direct", "get_*": "codemode", "delete_*": "hidden" }
}
```

- `"exposure": "deferred"`: la exposición por defecto *de este servidor*; el valor por defecto de Pi es codemode.
- `toolExposure`: excepciones por herramienta. La búsqueda de código, muy usada, en direct; las de lectura, en codemode; las de borrar, inaccesibles.
- `"description"`: una frase para que el modelo sepa para qué sirve el servidor.

### Globales de un script de codemode

```text
await tools.mcp__tienda_fs__list_directory_with_sizes({ path: "src" })
await searchTools("listar directorio", { limit: 8 })
await describeTool("mcp__tienda_fs__get_file_info")
ALL_TOOLS.filter(t => t.name.startsWith("mcp__tienda_fs"))
text(…) · return … · store(k, v) · load(k)
```

- `tools.<nombre>(…)`: llama a una herramienta, aunque no esté declarada al modelo.
- `searchTools`: busca herramientas por relevancia; `describeTool`: devuelve la declaración de una; `ALL_TOOLS`: la lista completa.
- `store`/`load`: guardan valores pequeños entre scripts, ligados a la rama de la sesión.

### Los scripts de la demo (resumen de la sesión)

```text
1  const t = searchTools("tienda_fs", …)          # sin await: no obtiene nada
2  JSON.stringify(ALL_TOOLS) · describeNamespace(…)
3  ALL_TOOLS.map(t => t.name).filter(n => n.startsWith("mcp__tienda_fs"))
4  await Promise.all([list_directory_with_sizes(src), list_directory_with_sizes(test)])
5–6  get_file_info: probar el formato
7  bucle: get_file_info de cada fichero → 4 líneas
```

- Los scripts 1 a 3 solo sirven para descubrir las herramientas: es el coste del descubrimiento. `describeNamespace` aparece en la sesión, pero no en la lista de ayudas que da la locución.
- El 4 lanza dos llamadas en paralelo con `Promise.all`, y el 7 devuelve solo el resultado filtrado.

### Codemode también sin MCP

```text
"defaultTools": ["+codemode"]          # en settings.json
models.classify(…) · models.generateImages(…)
# límites: 256 MB de memoria; un script no lanza otros scripts
```

- `"+codemode"`: el `+` añade codemode a las herramientas de serie en lugar de sustituirlas.
- `models.`: desde un script también se accede a modelos que no conversan, como clasificadores y generadores de imágenes.

### settings.json: codemode

```text
"codemode": {
  "mode": "on",            # "only": oculta las demás y obliga a usar scripts
  "inlineBudget": 3000     # tokens para declaraciones en su descripción
}
```

- `"mode": "on"` (por defecto): las herramientas de siempre siguen declaradas y se añade una nota sobre cómo llamarlas desde un script.
- `inlineBudget`: lo que no cabe en esos tokens se encuentra con `searchTools`.

### La sesión en modo deferred: llamadas a herramientas

```text
tool_search   { "query": "tienda_fs MCP list directory file sizes" }
mcp__tienda_fs__list_allowed_directories   {}
mcp__tienda_fs__list_directory_with_sizes  { "path": "…/tienda/src", "sortBy": "name" }
```

- Tras `tool_search`, las dos herramientas quedan declaradas y el modelo las llama directamente, sin escribir ningún script.

### MCP desde extensiones y ajustes

```text
pi.registerMcpServer("docs", { url: "https://example.com/mcp" })   // solo para la sesión
// una extensión que registra /mcp sustituye a la integrada (p. ej. pi-mcp-adapter)
"extensions": ["-builtin:mcp"]   // desactivar la integrada
```

- `registerMcpServer` usa el mismo formato que `mcp.json`. Las extensiones llegan en el vídeo 08.
- Desde el SDK (vídeo 10), las extensiones integradas no se cargan solas: hay que añadirlas.

## Fuentes

- Documentación oficial de Pi: [mcp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md), [codemode.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md), [cli.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md) (`pi mcp`, `--tools`) y [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md) (`defaultTools`, `codemode.*`). Grabado con Pi 1.0.1.
- Especificación MCP: modelcontextprotocol.io.
- Servidor de la demo: `@modelcontextprotocol/server-filesystem`, en npm.
- Relacionados en el curso: vídeo 04 (caché de prompts), 05 (seguridad de lo que instalas), 08 (extensiones de permisos) y 10 (`pi -p --mode json`).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De «no MCP» a MCP de serie**

MCP, el Model Context Protocol, es un estándar abierto para que un agente use herramientas y datos de otros programas. Un servidor MCP expone herramientas, como buscar en un repositorio, consultar una base de datos o leer la documentación de un producto, y cualquier cliente compatible puede usarlas. Claude Code, Cursor, Codex y muchos otros hablan MCP.

Pi tardó en sumarse, y no por descuido. Durante mucho tiempo su README presumía de no tener MCP. El argumento era el coste: cada herramienta que declaras viaja en cada petición al modelo, con su nombre, su descripción y sus parámetros, y un servidor grande puede llenar el contexto antes de empezar. La alternativa que proponía era usar herramientas de línea de comandos y skills, que solo cuestan cuando se usan.

Ahora eso ha cambiado: MCP viene integrado, como una extensión de serie llamada builtin mcp. Pero no a cualquier precio. Llega acompañado de dos piezas pensadas precisamente para ese problema del coste: codemode y tool search. De eso va este vídeo.

Primero conectaremos un servidor real a nuestra tienda. Después mediremos cuánto contexto cuestan sus herramientas según cómo las expongas. Y veremos por dentro un script de codemode, que es la idea más interesante de todo el vídeo.

**2 · Conectar un servidor**

Para la demo usamos el servidor de ficheros oficial de MCP, limitado a la carpeta de la tienda. Es un buen ejemplo porque no necesita credenciales y tiene bastantes herramientas: leer ficheros, listar carpetas con tamaños, buscar, mover, escribir.

Se añade con pi mcp add, el nombre que le damos, tienda fs, dos guiones, y el comando que lo arranca: npx guion y, el paquete del servidor y la carpeta permitida. Y con pi mcp list comprobamos que conecta. La respuesta: añadido como servidor global en mcp punto json, conectado, catorce herramientas, en modo codemode. Y debajo, la lista de las catorce.

Un detalle de nuestra grabación: escribimos command pi en lugar de pi, porque en este curso pi es un alias que desactiva las skills, y ese alias no admite subcomandos. Tú no lo necesitarás.

Pi lee los servidores de dos ficheros: mcp punto json en el directorio del agente, para los tuyos, y punto pi barra mcp punto json en el proyecto, que solo se carga si el proyecto tiene confianza. El formato es el mismo que usan Claude Code o Cursor, así que puedes copiar tus servidores casi tal cual. La documentación trae una tabla para convertir los de VS Code, Codex y OpenCode.

Hay dos tipos de servidor. Los locales, que Pi arranca como un proceso y con los que habla por la entrada y la salida estándar. Y los remotos, por HTTP, con una URL. Para las credenciales, el fichero admite variables de entorno con dólar y llaves, o un comando con exclamación, como en auth punto json. Y para los remotos con OAuth, como Sentry, barra mcp login abre el navegador y guarda los tokens en mcp auth punto json.

Pi conecta todos los servidores activos en segundo plano al empezar la sesión, así que no tienes que esperar a que arranquen. Solo el primer mensaje espera, como mucho diez segundos, a los servidores con herramientas en modo direct, que tienen que ir declaradas en esa petición. Cada petición a un servidor tiene un tiempo límite de sesenta segundos por defecto, los errores pasajeros de red se reintentan dos veces, y si un servidor se cae, se reconecta en la siguiente llamada.

La recomendación de la documentación es clara: los servidores personales y los que llevan credenciales, en el fichero del usuario. En el del proyecto, solo los que el proyecto necesita, y solo en proyectos de confianza. Y recuerda que un servidor local es un programa que se ejecuta en tu máquina con tus permisos.

Además de herramientas, un servidor MCP puede ofrecer recursos: documentos, registros o cualquier contenido que el servidor quiera exponer por una dirección. Cuando un servidor los tiene, Pi añade tres herramientas, las mismas que usan Codex y OpenCode: una para listar los recursos, otra para listar las plantillas de direcciones y otra para leer un recurso concreto. El texto llega al modelo como texto, las imágenes como imágenes, y el resto se guarda en un fichero temporal.

**3 · El coste de las herramientas en el contexto**

Antes de usar el servidor, entendamos el problema que Pi quiso evitar. Cada herramienta declarada al modelo viaja en cada petición: su nombre, su descripción y el esquema de sus parámetros. El modelo necesita esa información para saber que existe y cómo llamarla, pero la paga en tokens en cada turno de la conversación.

Lo hemos medido. Lanzamos a Pi en modo print la misma petición trivial, di solo hola, y miramos el tamaño del primer contexto. Sin ningún servidor MCP, con las cuatro herramientas de serie y el AGENTS punto md de la tienda, son mil novecientos setenta y un tokens.

Con las catorce herramientas del servidor declaradas directamente, como si fueran de serie, el contexto sube a cuatro mil cincuenta y cuatro. Más del doble, solo por catorce herramientas de ficheros. Un servidor como el de GitHub tiene muchas más, y si conectas tres o cuatro servidores, el contexto puede arrancar ocupado en buena parte antes de escribir nada.

La caché de prompts abarata repetir ese prefijo, como vimos en el vídeo cuatro, pero no lo hace gratis, y hay un coste que la caché no quita: la atención. Cuantas más herramientas ve el modelo, más fácil es que elija mal o que se distraiga. Por eso tiene sentido no declararlas todas.

Y esta medida la puedes repetir tú con cualquier servidor. Lanza pi en modo print con guion guion mode json y una petición trivial, y mira el uso de tokens del primer mensaje del asistente. O, en la interfaz, fíjate en el porcentaje de contexto del pie después del primer mensaje. Es la forma más honesta de saber qué te cuesta un servidor antes de dejarlo conectado.

**4 · Cuatro formas de exponer un servidor**

Pi resuelve esto con la exposición, que se elige por servidor. Hay cuatro. Codemode, la de por defecto: las herramientas no se declaran al modelo, pero se pueden llamar desde un script de codemode, que las busca cuando las necesita. Deferred: no se declaran hasta que la herramienta tool search las encuentra, y a partir de ahí se llaman directamente. Direct: se declaran como una herramienta más. Y hidden: registradas, pero inaccesibles.

En barra mcp lo vemos todo. El servidor aparece conectado, con catorce herramientas, en modo codemode y con origen global. Al entrar, vemos de dónde viene la configuración, el estado, la lista de herramientas, y opciones para reconectar, cambiar la exposición, desactivarlo, o desactivarlo solo en este proyecto.

En la opción de exposición, Pi explica cada modo en una línea. Codemode: se llaman desde scripts de codemode, que las encuentran con search tools. Deferred: no se declaran hasta que tool search las carga, y entonces se llaman directamente, sin codemode. Direct: se declaran al modelo como las de serie. El cambio se guarda en el mismo mcp punto json.

¿Y cuánto cuesta cada uno? Repetimos la medida. Con codemode, dos mil cuatrocientos noventa y dos tokens: quinientos más que sin servidor, que es lo que ocupan la herramienta codemode y una línea que presenta el servidor. Con deferred, dos mil ciento noventa y tres: solo doscientos más. Frente a los dos mil ochenta y tres de más del modo direct.

Y la diferencia crece con el tamaño del servidor. En codemode y deferred el coste inicial casi no depende de cuántas herramientas tenga el servidor, porque no se declaran. En direct, cada herramienta suma.

Para afinar, existe tool exposure, que cambia la exposición de herramientas concretas, con patrones de asterisco. La documentación pone el ejemplo de GitHub: el servidor en deferred, la búsqueda de código en direct porque se usa mucho, las de lectura en codemode y las de borrar en hidden. Y conviene darle a cada servidor una descripción de una frase: es lo que ve el modelo para saber para qué sirve.

Lo probamos con nuestro servidor. En mcp punto json añadimos tool exposure con cuatro herramientas en hidden: write file, edit file, move file y create directory. Y pi mcp list las marca entre corchetes. El servidor sigue ofreciendo catorce herramientas, pero el modelo solo puede usar las de lectura. Es una forma sencilla de convertir un servidor de ficheros en uno de solo lectura.

**5 · Codemode por dentro**

Codemode es una herramienta que permite al modelo escribir un script de JavaScript que llama a las demás herramientas. El script se ejecuta en un sandbox QuickJS: sin las APIs de Node, sin sistema de ficheros, sin red y sin temporizadores. Solo puede tocar el mundo exterior a través de las herramientas. Y lo más importante: al modelo solo le llega la salida del script.

Eso tiene dos ventajas. La primera, el paralelismo: un script puede lanzar varias llamadas a la vez y esperar a todas. La segunda, el filtrado: si una herramienta devuelve un resultado enorme, el script puede quedarse con lo que interesa antes de que entre en el contexto. Por eso Pi usa codemode como modo por defecto para MCP.

Dentro del script, cada herramienta es un método de tools, con su nombre. Para encontrar las que no están declaradas hay tres ayudas: search tools, que las ordena por relevancia; describe tool, que devuelve la declaración de una; y all tools, la lista completa. Además, text y return añaden salida, y store y load guardan pequeños valores entre scripts, ligados a la rama de la sesión.

Veámoslo en la demo. Le pedimos a Pi, usando solo el servidor tienda fs, ni bash ni read, el tamaño de cada fichero punto js de src y de test, en una tabla. El modelo escribió siete scripts de codemode, y merece la pena ver cómo fue, porque no fue perfecto.

El primer script llamó a search tools pero olvidó el await, así que no obtuvo nada. En los siguientes exploró all tools y describe namespace, y filtró las herramientas que empiezan por mcp tienda fs. Ya con la lista, lanzó en paralelo, con promise punto all, dos llamadas a list directory with sizes, una para src y otra para test.

Después probó get file info sobre un fichero para ver el formato de la respuesta, y en el último script recorrió los cuatro ficheros, sacó el tamaño de cada uno con una expresión regular y devolvió solo cuatro líneas. En pantalla se ven las cuatro llamadas al servidor, de un milisegundo cada una. La tabla final: mil quinientos setenta y cinco bytes para carrito punto js, cuatrocientos ochenta y seis para envio punto js, y los dos de pruebas. Toda la tarea costó tres décimas de céntimo.

La lección es doble. Codemode funciona y el modelo acaba orquestando las llamadas de forma eficiente. Pero el descubrimiento tiene un coste: varios scripts solo para averiguar qué herramientas había y cómo respondían. Con un servidor que vas a usar a menudo, una buena descripción, o exponer en direct las dos o tres herramientas clave, ahorra esos rodeos.

Codemode no es solo para MCP. Puedes activarlo con las herramientas de serie añadiendo más codemode a default tools, y entonces el modelo puede, por ejemplo, leer diez ficheros en paralelo y devolver un resumen. Y desde codemode se accede también a modelos que no conversan, como clasificadores y generadores de imágenes, que veremos más adelante. El script tiene límites: doscientos cincuenta y seis megas de memoria, y no puede lanzar otros scripts.

Lo probamos sin ningún servidor, arrancando Pi con guion guion tools read, bash, edit, write y codemode. Le pedimos que, con un solo script, leyera a la vez los cuatro ficheros de la tienda y nos dijera cuántas funciones exporta cada fichero de src y cuántas pruebas tiene cada fichero de test.

El script hace exactamente eso. Llama a bash para listar los ficheros, lanza las cuatro lecturas en paralelo con promise punto all, cuenta con expresiones regulares las funciones exportadas y las pruebas, y devuelve solo cuatro líneas. Cinco funciones en carrito punto js, una en envio punto js, doce pruebas en las del carrito y tres en las del envío. Lo comprobamos después con grep, y las cuentas son correctas. El contenido de los ficheros nunca entró en el contexto del modelo: solo las cuatro líneas de resultado.

Dos ajustes controlan cómo se presenta codemode. Codemode punto mode, con el valor on por defecto, mantiene declaradas las herramientas de siempre y les añade una nota sobre cómo llamarlas desde un script; con only, las oculta y obliga a pasar por codemode. E inline budget limita cuánto puede ocupar la descripción de codemode con declaraciones de herramientas, tres mil tokens por defecto; lo que no cabe se encuentra con search tools.

**6 · Tool search y el modo deferred**

El otro camino es tool search. Cambiamos la exposición del servidor a deferred y repetimos una petición parecida: usando solo tienda fs, lista el contenido de src con sus tamaños.

Esta vez el modelo no escribe ningún script. Primero llama a tool search con una búsqueda en lenguaje natural: tienda fs, listar directorio, tamaños de fichero. Pi le devuelve las herramientas que encajan, con su descripción, y las declara para la siguiente llamada. Y a partir de ahí, el modelo las usa directamente: list allowed directories y list directory with sizes. La respuesta, una tabla con los dos ficheros.

Las herramientas que carga tool search quedan registradas en la sesión y siguen declaradas en esa rama de la conversación, así que no hay que buscarlas otra vez. Con codemode, en cambio, cada script vuelve a llamar a las herramientas por su nombre, sin declararlas nunca.

¿Cuándo cada uno? Codemode brilla cuando hay que combinar o filtrar muchas llamadas, y deferred cuando vas a usar unas pocas herramientas de un servidor grande, una y otra vez, de forma directa. Y direct, solo para conjuntos pequeños que usas casi en cada tarea.

**7 · Seguridad y buenas prácticas**

Tres apuntes de seguridad para terminar. El primero: todas las llamadas a herramientas MCP pasan por la misma tubería que las de serie, también las que hace un script de codemode. Eso significa que una extensión de permisos, como la que escribiremos en el próximo vídeo, se aplica igual a las herramientas MCP.

El segundo: los servidores pueden declarar anotaciones sobre sus herramientas, como solo lectura, destructiva o idempotente, y una extensión puede usarlas para decidir qué pedir confirmar. Fíjate en nuestro servidor de ficheros: además de leer, puede escribir, editar y mover ficheros. Si solo quieres consultarlo, marca esas herramientas como hidden con tool exposure.

Y el tercero, lo del vídeo cinco: un servidor MCP local es un programa con tus permisos, y uno remoto recibe lo que el modelo le mande. Instala solo servidores en los que confíes, y mantén las credenciales en el fichero del usuario. Si algo falla, pi mcp list te dice el estado de cada servidor, y los mensajes de los servidores quedan en mcp punto log.

Para quien vaya a programar: una extensión puede registrar servidores MCP para la sesión con register mcp server, con el mismo formato que mcp punto json. Y si prefieres otra implementación de MCP, una extensión que registre su propio comando barra mcp sustituye a la integrada; también puedes desactivar la integrada con menos builtin mcp en los ajustes. Desde el SDK, las extensiones integradas no se cargan solas y hay que añadirlas.

Dos detalles prácticos más. Los resultados de texto de más de veinte kilobytes llegan al modelo recortados por el medio, con el texto completo en un fichero temporal, salvo dentro de codemode, donde el script recibe el resultado entero y puede reducirlo. Y si cambias la configuración fuera de la sesión, barra reload la vuelve a leer. Al acabar la demo, quitamos el servidor con pi mcp remove.

La práctica: conecta un servidor MCP sin credenciales, como el de ficheros, a un proyecto tuyo. Mide el contexto inicial con y sin el servidor, en direct y en codemode, con pi en modo print. Pide una tarea que obligue a combinar varias llamadas y mira el script que escribe el modelo. Y marca como hidden las herramientas que escriben, si no las necesitas.

En el próximo vídeo empezamos con las extensiones: comandos, herramientas propias, eventos, y el modo de aprobación que Pi no trae de serie. Nos vemos allí.

</details>

