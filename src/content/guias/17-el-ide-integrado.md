---
title: "Vídeo 17 · El IDE integrado"
description: "Lo que convierte a omp en un entorno de desarrollo. LSP, depuración, búsquedas y ediciones por estructura del código, y lectura de PDF o bases de datos."
ruta: "pi-oh-my-pi"
orden: 17
duracion: "24 min"
video: "17-el-ide-integrado.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/17-el-ide-integrado.es.vtt"
---

Lo que convierte a omp en un entorno de desarrollo. LSP, depuración, búsquedas y ediciones por estructura del código, y lectura de PDF o bases de datos.

<p class="guia__nota">Dura 24 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Un entorno de desarrollo sin ventanas

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Vídeo 16:** Quien reparte, verifica — Hoy, la otra mitad de esa idea.
- *En la demo:* /tools · herramientas descubribles
- **Una tarea real:** Carpeta (de datos) → Leer (PDF y SQLite) → Refactor (LSP) → Limpieza (AST) → Fallo (depurador) → eval

### 2 · Varias carpetas en una sesión

<p><button type="button" class="ir-a" data-t="158">▶ Ir a 2:38</button></p>

- *En terminal:* ~/csn/datos (fuera del repositorio) (más abajo, en «Código y comandos»)
- *En la demo:* /dirs
- *En la demo:* /add-dir ../datos
- *En la demo:* /remove-dir .
- **Cuándo sirve**
  - `app + lib` · Cruza repos
  - `servicio` · Y su cliente
  - `docs` · En otro sitio
- **Aviso:** Añadir no es aislar — «Solo lectura» en AGENTS.md es una petición. Permisos de verdad: vídeo 19.

### 3 · Una sola puerta: read

<p><button type="button" class="ir-a" data-t="292">▶ Ir a 4:52</button></p>

- *En terminal:* La petición (más abajo, en «Código y comandos»)
- *En la demo:* read sobre un PDF
- *En la demo:* La base, por bash
- *En la demo:* El error está en los datos
- *En terminal:* read con sufijos (más abajo, en «Código y comandos»)
- **Vídeo 11:** Hashline — Cada línea con su número y la lectura con una etiqueta.

### 4 · El servidor de lenguaje

<p><button type="button" class="ir-a" data-t="451">▶ Ir a 7:31</button></p>

- **Rename con grep: funciona casi siempre:** gastosEnvio → calcularEnvio — El casi: un nombre en un comentario, una importación con alias, un fichero sin mirar.
- **Hay que pedirlo:** rename con apply: false — Por defecto, rename aplica los cambios.
- *En la demo:* lsp references
- *En la demo:* Vista previa
- *En la demo:* git diff
- *En la demo:* El modelo lo hizo aparte

### 5 · Editar con precisión: hashline, ast_grep y ast_edit

<p><button type="button" class="ir-a" data-t="646">▶ Ir a 10:46</button></p>

- **Edición anclada:** Etiqueta (de la lectura) → Líneas (por número) → ¿Cambió? (no aplica a ciegas)
- *En terminal:* Hashline (diapositiva) (más abajo, en «Código y comandos»)
- **Regla:** No edita lo que no ha visto — Partes plegadas: primero hay que leerlas.
- *En la demo:* edit con DeepSeek: sustitución de cadenas
- *En terminal:* La petición (más abajo, en «Código y comandos»)
- **ast_grep · apagada de fábrica:** Math.round($X * 100) / 100 — $X atrapa cualquier expresión; los espacios dan igual.
- *En la demo:* AST Grep · 3 coincidencias
- *En la demo:* ast_edit: propuesta, reject y resolve
- *En la demo:* Si quieres decidir tú, pídelo

### 6 · Depurar de verdad

<p><button type="button" class="ir-a" data-t="862">▶ Ir a 14:22</button></p>

- *En la demo:* Romper a mano
- *En la demo:* Debug variables
- *En la demo:* Parar es mirar
- *En la demo:* Arreglado
- **/debug · para reportar un fallo de oh my pi:** Revisa antes de compartir — Enseña sesiones y peticiones tal cual.

### 7 · Eval, el navegador y el escritorio

<p><button type="button" class="ir-a" data-t="1040">▶ Ir a 17:20</button></p>

- **eval:** Un proceso que sigue vivo — JavaScript o Python, con estado entre llamadas.
- *En la demo:* Una celda JavaScript
- *En la demo:* Con 40 € y cupón, se paga más
- **Relé:** Tu propio Chrome — Con tus sesiones iniciadas. Lo que haga, lo hace con tu cuenta.
- *En terminal:* /browser (no se pulsa) (más abajo, en «Código y comandos»)
- **/computer · solo diapositiva:** Tu escritorio real — Capturas, accesibilidad, ratón, teclado y portapapeles. Viene apagado.

### 8 · Límites, riesgos y coste

<p><button type="button" class="ir-a" data-t="1202">▶ Ir a 20:02</button></p>

- **Primero:** Todo se ejecuta en tu máquina — Lo que en tu editor decides con un clic, aquí lo decide el modelo.
- **Aprobaciones**
  - `yolo` · De fábrica: nadie pregunta
  - `write` · Para computer: y una máquina dedicada
- **Tercero:** Lo que ve no es una orden — Una página o un PDF pueden traer instrucciones escondidas.
- **Pauta:** Activa (lo justo) → Instala (LSP y DAP) → computer (apagado) → Vista previa (antes de cambios grandes)

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1346">▶ Ir a 22:26</button></p>

- **Próximo vídeo:** Git, calidad y entrega — /git, /wt, /review, omp commit, Auto QA y /security.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### ~/csn/datos (fuera del repositorio)

```text
tarifas-envio.pdf   # tarifa: 4,95 €, gratis desde 40 € sin IVA
pedidos.db          # SQLite, tabla pedidos (20 filas)
AGENTS.md           # «Datos de ejemplo. Solo lectura.»
```

- `PDF`: Tarifa
- `SQLite`: Pedidos
- `AGENTS.md`: Instrucciones

### La petición

```text
Lee la tarifa de envío del PDF de la carpeta datos y dime el umbral.
Mira qué tablas tiene pedidos.db y busca pedidos ≥ 40 € con envío cobrado.
Compáralo con src/envio.js. No cambies nada.
```

- `PDF`: read
- `pedidos.db`: Consulta
- `No cambies`: Solo lectura

### read con sufijos

```text
read src/carrito.js:20-40       # un rango
read src/carrito.js:raw         # tal cual
read datos/pedidos.db:pedidos   # esquema y filas
read datos.zip:informe.csv      # dentro de un archivo
```

- `:20-40`: Rango
- `:raw`: Sin resumen
- `.db:tabla`: SQLite

### Hashline (diapositiva)

```text
PUT 12-14  …nuevas líneas…    # sustituye, o inserta antes/después
CUT 20-25 → PUT 40             # cortar y pegar
REM fichero · MV a → b
```

- `PUT`: Sustituir
- `CUT`: Cortar
- `REM · MV`: Borrar, mover

### La petición

```text
Encuentra los redondeos a céntimos con ast_grep.
Sustitúyelos con ast_edit por redondear(…), con vista previa.
Después crea la función redondear.
```

- `ast_grep`: Buscar
- `ast_edit`: Reescribir
- `Después`: El orden importa

### /browser (no se pulsa)

```text
/browser            # alterna oculto/visible y lo guarda
/browser headless   # explícito
```

- `/browser`: Alterna
- `guarda`: En la configuración
- `perfil`: De pruebas

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh)):
  - `tools/read.md`: un solo `path`; selectores `:N`, `:A-B`, `:raw`, `:conflicts`; documentos convertibles (`.pdf`,
    `.docx`, `.xlsx`…, conversión con markit; `doc.pdf:page11.png` hace captura de página con Chromium); SQLite
    (`.sqlite`, `.sqlite3`, `.db`, `.db3` con cabecera válida; `db` lista tablas con filas, `db:tabla` esquema y cinco
    filas, `db:tabla:clave`, `?limit/offset/order/where`, `?q=SELECT…`; conexión con `PRAGMA query_only = ON`; límites
    20, 500, 1000); archivos comprimidos (`archivo.zip:ruta`); URLs internas (`pr://`, `issue://`, `agent://`,
    `history://`, `proc://`, `omp://`, `xd://`…); `pr://<N>`, `pr://<N>/diff` pasan por la caché SQLite de la
    herramienta `github` (`gh`); vídeo con ffmpeg; cuadernos `.ipynb` como texto editable; hashline: cabecera
    `[PATH#TAG]` y líneas `N:texto`, instantáneas en el `EditStore` de la sesión; `read.summarize.*` (resumen estructural
    desde 100 líneas).
  - `tools/edit.md`: modo por defecto `hashline`; etiqueta de cuatro hex derivada del contenido; operaciones `PUT`,
    `CUT`, `REM`, `MV`; números de línea del snapshot original; `edit.enforceSeenLines` (no edita líneas no vistas);
    recuperación de etiquetas viejas solo si es segura; **los modelos de la familia DeepSeek (entre otros) caen a modo
    `replace`** salvo `PI_STRICT_EDIT_MODE`; «Hashline applies in one tool call; it does not use the staged
    `xd://resolve` / `xd://reject` flow used by `ast_edit`».
  - `tools/lsp.md`: acciones (`diagnostics`, `definition`, `references`, `hover`, `symbols`, `rename`, `rename_file`,
    `code_actions`, `type_definition`, `implementation`, `status`, `reload`, `capabilities`, `request`); `lsp.enabled`
    `true`; herramienta descubrible; lectura con aprobación `read`, `rename`/`code_actions`/`reload`/`request` con
    `write`; **`rename` aplica salvo `apply: false`**; `symbol` obligatorio con `line`; `diagnostics` con `file: "*"`
    lanza `npx tsc --noEmit` si hay `tsconfig.json`; `lsp.lazy` (arranque en el primer uso); servidor compartido por
    proyecto (`lsp.shared`).
  - `lsp-config.md`: autodetección por `rootMarkers` **solo en el cwd** y binario en `node_modules/.bin` o `PATH`;
    ficheros `lsp.json|yaml` (proyecto `.omp/lsp.json`, usuario en el directorio del agente); tabla de servidores
    (`typescript-language-server` para JS/TS hasta TS 6, `typescript-native` para TS 7+); un solo servidor de TS por
    proyecto.
  - `tools/debug.md`: herramienta `debug` = **una sesión DAP** (`launch`, `attach`, `set_breakpoint`, `continue`,
    `step_*`, `stack_trace`, `scopes`, `variables`, `evaluate`, `output`, `terminate`…); `debug.enabled` `true`;
    aprobación `read` para las de solo lectura y `exec` para el resto; una sola sesión raíz; adaptadores incluidos
    (`gdb`, `lldb-dap`, `debugpy`, `dlv`, `js-debug-adapter`…) y `dap.json` propio; **adaptador JS: `dapDebugServer.js`
    de vscode-js-debug por TCP**, autodescubierto en `~/.local/opt/js-debug/src/` o con `JS_DEBUG_DAP_SERVER` (no existe
    el paquete npm `js-debug-adapter`); corre con `node` del PATH o con Bun. **El selector `/debug` es otra cosa:**
    rutas de interfaz `open-artifacts`, `performance`, `work`, `dump`, `memory`, `logs`, `system`, `terminal`,
    `protocols`, `raw-sse`, `remote-debugger`, `transcript`, `clear-cache`; los paquetes de informe contienen sesión,
    logs, ajustes y SSE en crudo.
  - `tools/ast-grep.md` (**desactivada por defecto**, `astGrep.enabled: false`; metavariables `$X`, `$$$`; salida con
    anclas hashline), `tools/ast-edit.md` (activa; **siempre vista previa** «Staged as a proposal — files NOT modified
    yet»; se aplica con `write xd://resolve` y se descarta con `xd://reject`; comprueba que la vista previa no ha
    caducado), `resolve-tool-runtime.md` (dispositivos `xd://resolve|reject|propose`).
  - `tools/eval.md` (una celda por llamada, `py` o `js`, estado que sobrevive; `tool.<nombre>()`, `agent()`; aprobación
    `exec`; `%pip install`, `%bun add`; preludes de extensión documentados en `xd://eval/<nombre>`), `python-repl.md`,
    `notebook-tool-runtime.md` (los cuadernos se editan, no se ejecutan).
  - `tools/browser.md` (prelude de `eval`; `browser.enabled` `true`; Chromium gestionado que se instala en el primer
    uso, CDP, relay sobre tu Chrome real; `observe`, `screenshot`…; aprobación `exec`; `allowed_domains` «is not a
    sandbox»), `computer-use.md` (prelude desactivado; `/computer` solo cambia la sesión; actúa sobre aplicaciones
    reales; «Screen content is untrusted data»; la doc recomienda `tools.approvalMode: write` y una cuenta o VM
    dedicada).
  - `settings.md` (`workspace.additionalDirectories`), `cli-reference.md` (`--add-dir`), `natives-text-search-pipeline.md`
    (ast-grep y grep nativos en Rust).
- **Código instalado de omp 18.6.1** (`~/.bun/install/global/node_modules/@oh-my-pi/pi-coding-agent/src/`):
  - `slash-commands/builtin-lifecycle.ts`: `/debug` llama a `showDebugSelector()` (el selector de diagnóstico, **no**
    el DAP); `/add-dir <ruta>` («Directory does not exist», «Not a directory», «Already in the workspace», «Added …»,
    regenera el system prompt), `/remove-dir` («Cannot remove the working directory; use /move to change it.»),
    `/dirs` («Workspace directories:», el cwd marcado «(working directory)»).
  - `session/session-manager.ts`: los directorios extra se guardan en la cabecera de la sesión (sobreviven a retomarla).
  - `system-prompt.ts` y `prompts/system/project-prompt.md`: bloque `<workspace-roots>` («Use absolute paths under these
    roots…»); carga también el `AGENTS.md` y el árbol de cada raíz extra.
  - `slash-commands/builtin-collaboration.ts`: `/browser` **sin argumento alterna** headless/visible y lo guarda con
    `settings.set`; la etiqueta del menú dice «Browser: headless|visible|disabled».
  - `slash-commands/builtin-modes.ts`: `/computer [on|off|status]`, «Toggle the native computer-use tool for this
    session».
  - `config/settings-schema.ts`: `edit.mode` `hashline`, `astGrep.enabled` `false`, `astEdit.enabled` `true`,
    `debug.enabled` `true`, `lsp.enabled` `true`, `lsp.diagnosticsOnWrite` `true`, `lsp.diagnosticsOnEdit` `false`,
    `lsp.formatOnWrite` `false`, `eval.py`/`eval.js` `true`, `browser.enabled` `true`, `computer.enabled` `false`.
  - `lsp/defaults.json` (`typescript-language-server --stdio`, `rootMarkers` `package.json`, `tsconfig.json`,
    `jsconfig.json`) y `dap/defaults.json` (`js-debug-adapter`, `rootMarkers` `package.json`…, `type: pwa-node`,
    `stopOnEntry: true`).
- Máquina (5 oct 2026, solo lectura): `typescript-language-server` 5.3.0 y `typescript` 6.0.3 instalados con npm
  global (con `lib/tsserver.js`); `dapDebugServer.js` **no** está; `gh` instalado; la tienda no tiene remoto.
- Vídeos anteriores: 01 (edición anclada), 11 (cabecera de hashline al desplegar la tarjeta de `read`; «servidor de
  lenguaje, depurador, navegador»), 12 (`/move`), 15 (`xd://propose` del modo plan), 16 (cierre: «la depuración con
  barra debug», que aquí se corrige; subagentes en modo plan sin LSP ni eval), 19 (permisos, se anuncia).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Un entorno de desarrollo sin ventanas**

En el vídeo anterior repartimos trabajo entre agentes y aprendimos una regla: quien reparte, verifica. Hoy toca la otra mitad de esa idea. Para verificar bien, el agente necesita las mismas herramientas que usas tú cuando programas: un servidor de lenguaje que sepa dónde se usa cada función, un depurador que pare el programa y enseñe las variables, y una forma de editar que no rompa nada por el camino.

Tu editor tiene todo eso, pero el agente no ve tu editor. oh my pi se lo da en forma de herramientas: LSP, para el servidor de lenguaje; debug, para el depurador; ast grep y ast edit, para buscar y reescribir por estructura; y eval, para ejecutar código con estado. Más una herramienta read que abre casi cualquier cosa. Es un entorno de desarrollo sin ventanas, pensado para que lo maneje el modelo.

La razón de fondo es la de todo el curso: dar al modelo hechos en lugar de suposiciones. Si el modelo adivina dónde se llama una función, a veces acierta. Si se lo pregunta al servidor de lenguaje, lo sabe. Y si adivina por qué falla un test, puede arreglar el síntoma. Si para el programa y mira las variables, encuentra la causa.

Antes de seguir, una aclaración, porque el nombre confunde. El comando barra debug no abre el depurador: abre un selector de diagnóstico del propio oh my pi, con logs, informes y peticiones en crudo. El depurador es la herramienta debug, y la maneja el modelo. A barra debug le dedicamos una diapositiva más adelante.

Además veremos los otros comandos del tema: barra add dir, barra remove dir y barra dirs, para trabajar con varias carpetas a la vez, y barra browser y barra computer, que controlan el navegador y el escritorio. Todo en la tienda de siempre, con el perfil demo, en oh my pi, y con DeepSeek V cuatro Pro, que razona más, porque hoy hay que pensar el código.

El orden será el de una tarea real. Primero, dar al agente acceso a una carpeta de datos que no está en el repositorio. Después, leer lo que hay en ella. Luego, un refactor con el servidor de lenguaje, una limpieza con búsqueda estructural y un fallo que encontraremos con el depurador. Al final, eval, el navegador y el escritorio, y los límites de todo esto.

**2 · Varias carpetas en una sesión**

Empezamos por el espacio de trabajo, porque condiciona todo lo demás. Una sesión de oh my pi tiene un directorio de trabajo y puede tener más raíces. Junto a la tienda hemos preparado una carpeta llamada datos, con la tarifa de envío en PDF y una base de datos SQLite de pedidos. No es parte del repositorio, pero queremos que el agente la vea.

Escribimos barra dirs. Aparece una sola raíz, la tienda, marcada como working directory. Ahora, barra add dir punto punto barra datos; el autocompletado ya ofrece la carpeta. El aviso dice added y vuelve a listar las raíces: ya son dos. Si la carpeta no existe, o no es una carpeta, te lo dice y no cambia nada.

¿Qué cambia por dentro? oh my pi regenera el system prompt. Añade un bloque con las raíces extra y le dice al modelo que use rutas absolutas bajo ellas para leer, buscar y editar. Además carga el AGENTS punto md de cada raíz y su árbol de ficheros. Nuestra carpeta datos tiene uno de dos líneas que dice que es de solo lectura. El agente lo sabrá sin que se lo repitas.

La lista de raíces se guarda en la sesión: si la retomas mañana, vuelven. Si las quieres en todas las sesiones, existe el ajuste workspace punto additional directories, y al arrancar, la opción guion guion add dir. Y una prueba: barra remove dir punto. Se niega: cannot remove the working directory, y te sugiere barra move, del vídeo doce, para cambiarlo.

¿Cuándo sirve esto? Cuando el cambio cruza repositorios: una aplicación y la librería que usa, un servicio y su cliente, el código y la documentación que vive en otro sitio. En lugar de abrir dos sesiones y copiar de una a otra, abres una con dos raíces, y el agente ve ambas con sus propias instrucciones.

Un aviso que conviene tener claro. Añadir una carpeta no es aislarla. Si el agente puede editar en la tienda, puede editar en datos. La frase de solo lectura de su AGENTS punto md es una petición, no una barrera. Imponer permisos de verdad es el tema del vídeo diecinueve.

**3 · Una sola puerta: read**

Ya tenemos la carpeta. Le pedimos al agente que lea la tarifa en el PDF, que mire qué tablas tiene la base de datos de pedidos y que busque pedidos de cuarenta euros o más a los que se les cobró envío. Sin cambiar nada.

La herramienta read, con un único parámetro, la ruta, abre casi todo. Para el PDF, lo convierte a texto y se lo da al modelo; lo mismo haría con un Word, una hoja de cálculo o un ePub. Y en la pantalla se ve justo eso: read, tarifas envío punto pdf, y debajo el modelo resume la tabla de tarifas, con el envío gratis desde cuarenta euros sin IVA.

Para la base de datos, read también sirve: reconoce SQLite, lista las tablas, enseña el esquema y acepta filtros o una consulta SQL, en un modo que impide escribir. Pero Pro hizo otra cosa: usó sqlite tres desde bash. Funciona igual, y el resultado es el mismo, pero conviene saberlo: el modelo elige la herramienta, y con bash nada impide escribir. Si quieres la garantía de solo lectura, pídele que use read.

El resultado: los pedidos diez cero uno y diez cero dos superan los cuarenta euros y se les cobraron cuatro noventa y cinco de envío. El resto, bien. Y compara con el código: el umbral de src barra envio punto js es cuarenta, igual que la tarifa. Así que el error está en los datos, no en el código. Hasta añade un matiz del PDF que el código no modela, el envío urgente.

Los sufijos también sirven para el código. Dos puntos y dos números lee solo ese rango de líneas, y dos puntos raw devuelve el fichero tal cual. Sin sufijo, si el fichero de código es largo, read entrega un resumen con las declaraciones y pliega los cuerpos, y al final dice qué rangos volver a leer. El modelo ve la forma del fichero sin gastar contexto en lo que no necesita.

Y abre direcciones internas de oh my pi. Ya conoces agent y history del vídeo dieciséis. Hay más, y una interesa aquí: pr dos puntos barra barra y el número, que lee una pull request de GitHub con sus comentarios, y su diff si añades barra diff. Por debajo usa el cliente gh, con tu cuenta y el repositorio remoto. La tienda no tiene remoto y no vamos a enseñar cuentas, así que se queda en esta diapositiva.

Un detalle más, que vimos en el vídeo once. Cuando read entrega un fichero de código, cada línea lleva delante su número, y la lectura lleva una etiqueta corta que la identifica. Eso es hashline, la edición anclada, y es la base de cómo edita oh my pi, como veremos dentro de un momento.

**4 · El servidor de lenguaje**

Pasamos al refactor. Queremos cambiar el nombre de la función gastos envio por calcular envio en todo el proyecto. Podríamos pedírselo al modelo sin más, y lo haría con grep y varias ediciones. Funciona casi siempre. El casi es el problema: un nombre parecido en un comentario, una importación con alias, un fichero que no ha mirado.

Un servidor de lenguaje resuelve eso porque entiende el código: sabe qué es una definición, qué es una referencia y qué es solo texto. oh my pi habla el protocolo LSP, el mismo que usa tu editor, y arranca el servidor solo. Mira dos cosas en el directorio de trabajo: un marcador de proyecto y el binario del servidor. Para JavaScript, el marcador es el package punto json, y el servidor, typescript language server, que en esta máquina está instalado con npm.

Le pedimos que use la herramienta LSP, que busque las referencias de gastos envio y que prepare una vista previa del cambio de nombre, sin aplicarla. Lo de la vista previa hay que pedirlo: la acción rename aplica los cambios directamente salvo que se le diga lo contrario.

Pro encuentra diez referencias en tres ficheros: la definición en envio punto js, la importación y la llamada en carrito punto js, y la importación y seis llamadas en el test. Las pone en una tabla. Y descubre una rareza del servidor: preguntando desde la definición, solo devolvía la definición; preguntando desde un uso, el conjunto completo. La tarjeta LSP rename, con apply false, enseña la vista previa: uno, dos y siete cambios.

Le decimos que lo aplique y que ejecute los tests: quince de quince. Pero en el otro panel, git diff enseña algo más: el título de un test, gastos envio lanza TypeError, también ha cambiado. El servidor de lenguaje no lo tocó, porque es una cadena de texto. Fue el modelo, que después del rename hizo una edición aparte para que el título no quedara obsoleto. Y lo dijo: siete ediciones vía LSP, más una manual.

Es razonable, pero es una decisión que tomó él, y conviene verla en el diff. El servidor de lenguaje es preciso; el modelo que lo usa tiene criterio propio. La herramienta LSP hace más: ir a la definición, ver el tipo con hover, listar símbolos, aplicar las acciones rápidas del servidor. Y cuando el agente escribe un fichero, oh my pi le devuelve los diagnósticos del servidor en la misma vuelta.

Para otros lenguajes es lo mismo: rust analyzer, gopls, pyright y unas cincuenta configuraciones más vienen de serie. Si el binario está instalado y el marcador existe, funciona. Si necesitas otro, se declara en un LSP punto json dentro de punto o eme pe.

Dos detalles de funcionamiento. El servidor no arranca al abrir oh my pi, sino la primera vez que se usa, así que la primera consulta tarda un poco más. Y se comparte por proyecto: si tienes varias sesiones o subagentes en la misma carpeta, hablan con el mismo servidor en lugar de arrancar uno cada uno. Recuerda, eso sí, del vídeo dieciséis: en modo plan, los subagentes no tienen LSP.

**5 · Editar con precisión: hashline, ast grep y ast edit**

Ahora, cómo edita. En el vídeo uno hablamos de la edición anclada. Esta es su forma concreta. Cuando el modelo quiere cambiar un fichero, no copia el texto viejo para buscarlo. Copia la etiqueta de la última lectura y dice qué líneas sustituye, por número. Si el fichero cambió desde entonces, la etiqueta no coincide y oh my pi no aplica el cambio a ciegas. Solo lo recupera si puede demostrar que el resultado es seguro.

La gramática es pequeña, y la tienes en la diapositiva. Put sustituye un rango de líneas, o inserta antes o después de una. Cut corta un rango y lo guarda, para pegarlo en otro sitio, incluso en otro fichero. Rem borra el fichero, y mv lo mueve. Todos los números se refieren a la lectura original, así que el modelo no tiene que recalcular nada después de cada cambio.

Hay otra regla menos visible: el modelo no puede editar líneas que no ha visto. Si read le enseñó un resumen con partes plegadas, antes de tocar esas partes tiene que leerlas. Eso evita ediciones sobre código imaginado.

Un apunte honesto. Hashline es el modo por defecto, pero según la documentación algunos modelos usan en su lugar un modo clásico de buscar y sustituir, entre ellos la familia de DeepSeek. Lo vimos en la tabla de barra tools: la herramienta edit se describe como sustitución de cadenas, con coincidencia difusa de espacios.

Siguiente petición. En carrito punto js hay tres redondeos a céntimos escritos a mano, con la fórmula de nuestro AGENTS punto md. Le pedimos que los encuentre con ast grep, que los sustituya con ast edit por llamadas a una función redondear, enseñándonos antes la vista previa, y que después cree esa función. El orden importa: si la función existiera antes, su propio cuerpo también coincidiría con el patrón y acabaría llamándose a sí misma.

Ast grep busca por estructura, no por texto. El patrón se escribe como código, con huecos: math punto round de dólar equis por cien, entre cien. Dólar equis atrapa cualquier expresión, por larga que sea, y los espacios o los saltos de línea dan igual. Un aviso: ast grep viene desactivada de fábrica. La hemos activado en el perfil demo antes de grabar.

Aparece la tarjeta AST grep: el patrón, tres coincidencias en un fichero. Las líneas nueve, treinta y dos y cuarenta y tres de carrito punto js. Y en la cuarenta y tres hay un problema: la expresión va entre paréntesis, así que dólar equis los atrapa también, y la sustitución quedaría con paréntesis dobles.

Pro lo ve en la propia propuesta de ast edit, que no toca nada: enseña cada línea antes y después. Prueba con dos reglas a la vez y la vista previa muestra una colisión en la línea cuarenta y tres. Así que la descarta, escribiendo en equis de dos puntos barra barra reject, con el motivo. Y lo hace en dos etapas: primero una regla solo para la línea con paréntesis, que aprueba con equis de dos puntos barra barra resolve, y después la general para las otras dos.

Un aviso: le pedimos que nos enseñara la vista previa antes de aplicar, y la enseñó, pero también aprobó él mismo cada etapa sin esperarnos. Las tarjetas de descartar y aceptar quedan en la conversación, con su motivo. Si quieres decidir tú, pídele explícitamente que pare tras la propuesta. Después añade la función redondear, con una edición normal, y ejecuta los tests: quince de quince.

**6 · Depurar de verdad**

Ahora, un fallo. En el otro panel rompemos a mano el cupón: hacemos que el descuento se aplique dos veces. Node guion guion test falla en el caso del cupón del diez por ciento. Al agente le pedimos que no toque el código todavía: que use la herramienta debug, lance el test del carrito, ponga un punto de ruptura dentro de total con cupon y nos enseñe las variables cuando pare.

La herramienta debug habla el protocolo DAP, el de los depuradores de los editores. oh my pi no trae un depurador propio: usa adaptadores que ya existen. gdb y lldb para C y Rust, debugpy para Python, delve para Go y, para JavaScript, js debug, el adaptador de Visual Studio Code. Este último no viene con oh my pi. Lo instalamos antes de grabar, siguiendo su documentación. Corre con el node de tu máquina.

El agente lanza el test con el adaptador js debug adapter, pone el punto de ruptura y continúa. Las tarjetas lo cuentan: debug variables, sesión debug dos, estado stopped, motivo breakpoint, en total con cupon, línea treinta y siete. Primero para en un test sin cupón, donde no pasa nada. Después, en el del cupón del diez por ciento: el total ya vale veintiséis con uno, descontado por línea.

Entonces avanza una línea, step over, y el total pasa a veintitrés con cuarenta y nueve. Ahí está: el descuento se aplica dos veces, una por línea y otra sobre el total. Pro lo explica, dice que el código sigue intacto, como pedimos, y propone quitar la segunda línea. Le decimos que lo arregle: borra la línea treinta y siete, ejecuta los tests, quince de quince.

El repertorio es el de cualquier depurador. Puntos de ruptura por línea o por función, con condición si quieres. Continuar, avanzar una línea, entrar en una función o salir de ella. Ver la pila de llamadas, los ámbitos y sus variables, y evaluar expresiones en el punto donde está parado. Y leer la salida del programa. Cada paso es una llamada a la herramienta, y tú ves en la conversación qué ha pedido y qué le ha contestado el depurador.

Tres detalles. Solo hay una sesión de depuración a la vez; para abrir otra hay que terminar la anterior. Puede engancharse a un proceso en marcha, por su identificador de proceso o por un puerto. Y si tu lenguaje necesita otro adaptador, se declara en un dap punto json.

Y ahora sí, barra debug, en diapositiva. Es un selector con herramientas para diagnosticar al propio oh my pi: los logs recientes, un perfil de rendimiento, información del sistema y del terminal, las respuestas en crudo del proveedor, un paquete de informe con la sesión y los logs, y una limpieza de la caché. Sirve para reportar un fallo de oh my pi. No lo abrimos en pantalla porque enseña sesiones y peticiones tal cual. Si generas un informe, revísalo antes de compartirlo.

**7 · Eval, el navegador y el escritorio**

La última herramienta del entorno es eval. Ejecuta una celda de JavaScript o de Python en un proceso que se mantiene vivo: lo que definas en una llamada sigue ahí en la siguiente, como en un cuaderno. Le pedimos que importe el carrito y calcule el total con envío para carritos de treinta y nueve con noventa y nueve, cuarenta y cuarenta y cinco euros, con y sin cupón del diez por ciento.

Aparece la celda, computing total con envío matrix, en ochenta y cinco milisegundos, y una tabla. Y con ella, un hallazgo que no habíamos pedido: con cuarenta euros y el cupón, el cliente paga más que sin cupón. Cuarenta y ocho con cincuenta y uno frente a cuarenta y ocho con cuarenta. El descuento le baja el subtotal a treinta y seis, por debajo del umbral, y vuelve a pagar envío. Es justo lo que dice la tarifa del PDF, y es un caso de negocio que merece una conversación.

¿Por qué no node guion e con bash? Porque cada llamada a bash empieza de cero, y eval no. Además, desde una celda se puede llamar a otras herramientas de la sesión y hasta lanzar subagentes. Y una aclaración: los cuadernos de Jupyter, oh my pi los lee y edita como texto, pero no los ejecuta. Para ejecutar código está eval.

Encima de eval viven dos complementos, que la documentación llama preludes. El primero es browser: un navegador Chromium que el agente maneja desde una celda, con pestañas con nombre. Puede abrir una página, observarla, hacer clic, rellenar campos o hacer capturas. La primera vez descarga Chromium. Para leer una página estática basta con read; browser es para interactuar.

Hay otra forma de usarlo que conviene conocer, aunque no la enseñemos: un relé que adopta una pestaña de tu propio Chrome, con tus sesiones iniciadas. Es muy útil para probar una aplicación en la que ya has entrado. Y es justo por eso delicado: lo que haga el agente en esa pestaña lo hace con tu cuenta.

El comando barra browser cambia el modo del navegador entre oculto y visible. Ojo: sin argumento, alterna, y lo guarda en la configuración. Por eso hoy no lo tocamos. Si lo cambias, hazlo en tu perfil de pruebas, y recuerda que el modo visible abre ventanas en tu escritorio.

El segundo es computer, y este va solo en diapositiva. Da al agente tu escritorio real: capturas de pantalla, el árbol de accesibilidad de las ventanas, el ratón, el teclado y el portapapeles. Viene apagado. Barra computer on lo activa solo para la sesión, barra computer off lo apaga y barra computer status dice cómo está. No lo vamos a activar en cámara, y enseguida verás por qué.

**8 · Límites, riesgos y coste**

Los límites, sin rodeos. El primero: todas estas herramientas ejecutan cosas en tu máquina. El servidor de lenguaje y el adaptador del depurador son programas que oh my pi arranca por ti. Eval ejecuta código. El depurador ejecuta el programa que le pidas. Lo que en tu editor decides con un clic, aquí lo decide el modelo.

El segundo es el modo de aprobación. Recuerda que oh my pi viene en yolo: aprueba todo sin preguntar. Las herramientas distinguen lectura, escritura y ejecución, y eval, el navegador y el depurador piden permiso de ejecución. Pero en yolo nadie lo pide. Con computer activado, eso significa que el modelo puede mover tu ratón y escribir en tus aplicaciones sin consultarte. La propia documentación recomienda el modo write para usarlo, y una cuenta o una máquina virtual dedicadas para lo arriesgado.

El tercero: lo que el agente ve en pantalla, en una web o en un PDF no es una orden. Es texto que viene de fuera. Una página puede contener instrucciones escondidas, y un navegador con tu sesión iniciada actúa en tu nombre. Limitar los dominios del navegador ayuda, pero la documentación lo dice claro: no es un sandbox.

El cuarto, las dependencias. El servidor de lenguaje y el adaptador del depurador no vienen con oh my pi, y si faltan, la herramienta falla o no aparece. Antes de confiar en el LSP de un proyecto, pregúntale por su estado. Y recuerda que solo busca marcadores en el directorio de trabajo, no en las carpetas que añadas.

¿Y el coste? La buena noticia es que casi todo lo de hoy es local. El servidor de lenguaje, el depurador y ast grep no gastan modelo. Lo que gasta son los turnos que deciden qué hacer, y la salida que vuelve al contexto. Toda esta demo, con Pro razonando a fondo, costó unos cuatro céntimos. Y conviene pedir lo concreto: una tabla, un rango de líneas, una referencia.

Si te quedas con una pauta práctica, que sea esta. Activa solo lo que vayas a usar. Instala el servidor de lenguaje y el adaptador del depurador de tus lenguajes, y comprueba que responden. Deja computer apagado, y el navegador en tu perfil de pruebas hasta que lo necesites. Y pide siempre la vista previa antes de un cambio grande, sea un rename o una reescritura estructural.

**9 · Repaso, práctica y cierre**

Repasemos. read es la puerta única: ficheros, PDF y documentos, bases SQLite en solo lectura, archivos comprimidos, páginas web y direcciones internas como pr. La herramienta LSP habla con el servidor de lenguaje: referencias, definiciones y cambios de nombre, con vista previa si la pides, y diagnósticos después de escribir. La herramienta debug maneja un depurador por DAP; barra debug es otra cosa, el diagnóstico del propio oh my pi.

Hashline edita por número de línea y etiqueta, en una sola llamada, y se niega si el fichero cambió. Ast grep busca por estructura y viene apagada; ast edit reescribe por estructura, siempre con propuesta, que se aplica con resolve o se descarta con reject. Eval mantiene vivo un proceso de JavaScript o Python, con dos complementos: browser, que se gobierna con barra browser, y computer, apagado salvo barra computer on. Y barra add dir, barra remove dir y barra dirs gestionan las carpetas de la sesión.

La práctica: en tu perfil de pruebas, abre un proyecto tuyo con un servidor de lenguaje instalado. Pregunta por su estado con LSP. Pide las referencias de una función y una vista previa de su cambio de nombre antes de aplicarla. Luego rompe algo a propósito y pide que lo encuentre con el depurador antes de tocar el código. Y apunta qué te ha dado cada herramienta que no te habría dado grep.

En el próximo vídeo cerramos el ciclo del cambio: git, calidad y entrega. La interfaz de barra git, con su diff, el staging y los commits; barra wt, para llevar la sesión a un worktree; barra review; o eme pe commit en modo de prueba; las quejas que recoge Auto QA, con o eme pe grievances; y barra security, solo explicado. Nos vemos allí.

</details>

