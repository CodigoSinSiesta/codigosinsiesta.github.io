---
title: "Vídeo 22 · Diseñar tu harness"
description: "Las taxonomías de harness engineering aplicadas. Pocas herramientas bien elegidas, límites centralizados y separación entre host y sandbox."
ruta: "pi-oh-my-pi"
orden: 22
duracion: "26 min"
video: "22-disenar-tu-harness.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/22-disenar-tu-harness.es.vtt"
---

Las taxonomías de harness engineering aplicadas. Pocas herramientas bien elegidas, límites centralizados y separación entre host y sandbox.

<p class="guia__nota">Dura 26 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De usar un harness a diseñarlo

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **De usar a diseñar:** Pi (núcleo pequeño) → oh my pi (el taller) → Bloque D (qué decides tú)
- **Vídeo 1:** Harness: dos sentidos — El programa que ejecuta el bucle y el andamiaje de tu repositorio.

### 2 · Tres mapas de Learn Harness Engineering

<p><button type="button" class="ir-a" data-t="97">▶ Ir a 1:37</button></p>

- **Fuente:** Learn Harness Engineering — WalkingLab · © 2025 · licencia MIT. Ideas y estructura, con nuestras palabras.
- **Mapa 1 · el agente**
  - `5 piezas` · Las del vídeo 1: qué trae el agente y qué pones tú
  - `uso` · Analizar productos: Pi, Claude Code, Codex
  - `alcance` · Runtime y entorno
- **Mapa 2 · el repositorio:** Instrucciones (AGENTS.md) → Estado (progreso) → Verificación (pruebas) → Alcance (una cosa) → Ciclo de vida (arranque y traspaso)
- **Los tres mapas:** Un mismo asiento: el de quien usa — Un agente que ya existe y quiere que trabaje mejor. Hay otro asiento.

### 3 · El Harness Playbook: la vista desde el motor

<p><button type="button" class="ir-a" data-t="213">▶ Ir a 3:33</button></p>

- **Can Bölük · septiembre de 2026:** The Harness Playbook — De Stencil, la empresa detrás de oh my pi. Una opinión influyente, no una metodología neutral.
- **Su tesis:** Software de sistemas, no un bucle — Un harness no es un bucle alrededor de una petición.
- **Cinco principios:** Sesión (con autoridad) → Control (de confianza) → Trabajo (acotado) → Compatibilidad (explícita) → Vistas (proyecciones)
- **Aviso 1:** omp² aún se construye — No es la oh my pi que tienes instalada, y no la enseñamos como disponible.
- **En lo que coinciden**
  - `terminado` · Definido antes
  - `contexto` · Un presupuesto
  - `estado` · Fuera del modelo: repositorio o registro

### 4 · Cada esquema cobra un impuesto

<p><button type="button" class="ir-a" data-t="387">▶ Ir a 6:27</button></p>

- **Playbook:** Cada esquema cobra un impuesto — Y no solo en tokens.
- **La lección:** El roster se mide — No es quién gana: son cifras de su autor, con su prueba, que no hemos reproducido.
- *En terminal:* Pi · el roster por ejecución (más abajo, en «Código y comandos»)
- *En terminal:* .pi/settings.json (más abajo, en «Código y comandos»)
- **Regla práctica:** Decide el roster al empezar — Las herramientas van al principio de cada petición: ahí vive la caché.

### 5 · Medir el prefijo

<p><button type="button" class="ir-a" data-t="574">▶ Ir a 9:34</button></p>

- *En la demo:* prefijo.sh
- *En la demo:* Pi: tokens antes de trabajar
- *En la demo:* oh my pi: tres configuraciones

### 6 · La misma tarea con rosters distintos

<p><button type="button" class="ir-a" data-t="723">▶ Ir a 12:03</button></p>

- **El encargo:** faltaParaEnvioGratis(subtotal) — Cuánto falta para el envío gratis, a céntimos; 0 si ya lo tiene; misma validación; pruebas y npm test.
- *En la demo:* medir.sh
- *En la demo:* Juez externo y parada ante fallos
- **Dieciocho ejecuciones:** Una sola es una anécdota — El mismo modelo, con el mismo encargo, no hace siempre lo mismo.
- *En la demo:* time ./medir.sh 3
- *En la demo:* ./resumen.sh
- **18 ejecuciones:** Menos de 7 céntimos — DeepSeek Flash, los dos agentes, 5 min 48 s.
- *En la demo:* oh my pi: media de tres
- **Por la caché:** Más del 90 % sale de la caché — Leerla cuesta muy poco. Pagas lo que escribe el modelo y lo que no estaba en caché.
- **Coste:** Cabe en el ruido — Con tres repeticiones, no has demostrado nada sobre el coste.
- *En la demo:* Pi: mínimo frente a serie
- *En la demo:* pi-minimo-1: los comandos de bash
- **Solo read y bash:** Reescribe el fichero entero — En lugar de un cambio pequeño que puedes revisar.
- *En la demo:* Un cambio que nadie pidió
- **El método:** Encargo (pequeño y verificable) → Rosters (una diferencia) → Carpetas (aisladas) → Repeticiones → Juez (externo)

### 7 · Límites centralizados

<p><button type="button" class="ir-a" data-t="1006">▶ Ir a 16:46</button></p>

- **Playbook:** Acota la salida una sola vez — Si cada herramienta trunca, cada una avisa a su manera y alguna se olvida.
- *En la demo:* Pi · truncate.js
- **Playbook:** Truncar dentro rompe el codemode — En un script, bash devuelve hasta 1 MiB para que el script filtre.
- **Pi · un punto para la política:** Llamada (integrada, MCP o anidada) → tool_call (el evento) → Decisión (en un sitio)
- *En la demo:* oh my pi · config get
- **Pregúntate:** ¿Dónde vive su límite ? — Dentro de la pieza: repítelo. En un sitio común: escríbelo ahí y versiónalo.

### 8 · El anfitrión decide, el sandbox ejecuta

<p><button type="button" class="ir-a" data-t="1215">▶ Ir a 20:15</button></p>

- **Documentación de Pi:** Pi entero dentro: lo más fuerte — Aislar solo las herramientas es una frontera más estrecha. A veces se combinan.
- **Vídeo 7:** codemode, del lado del harness — El script pide; las herramientas ejecutan, por el mismo punto de control.
- **Lo más importante:** Aprobar no es aislar — Las aprobaciones deciden qué se ejecuta; una frontera decide qué puede tocar.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1411">▶ Ir a 23:31</button></p>

- **Apunta la fecha:** El harness se degrada — Cuando cambie el modelo, repite la medida.
- **Vídeo 23:** El repo como sistema de registro — AGENTS.md, funcionalidades, progreso, arranque y traspaso.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Pi · el roster por ejecución

```text
pi -t read,bash
pi -t +codemode,-write
pi --exclude-tools "mcp__*"
pi --no-mcp
```

- `-t read,bash`: Lista cerrada
- `+codemode,-write`: Sobre las de serie
- `--exclude-tools`: Quita por nombre o patrón
- `--no-mcp`: Sin MCP en esta ejecución

### .pi/settings.json

```text
{
  "defaultTools": ["+codemode", "-write"]
}
```

- `defaultTools`: La misma sintaxis, en un fichero
- `["+codemode", "-write"]`: El roster del equipo, versionado

## Fuentes

- Pi 1.0.4 instalado (`$(npm root -g)/@earendil-works/pi-coding-agent/`):
  - `CHANGELOG.md` 1.0.2–1.0.4: `--tools` y `--exclude-tools` con patrones `*`, `--no-mcp`, `--tools` ya no quita
    MCP salvo que una entrada empiece por `mcp__`; las reglas del system prompt ya no nombran herramientas ocultas
    (1.0.4); en Anthropic, redefinir herramientas a mitad de conversación conserva la caché (1.0.1).
  - `docs/cli.md` §Tools (`-t`, `-xt`, `-nbt`, `-nt`; integradas `read`, `bash`, `edit`, `write`, `grep`, `find`,
    `ls` y `powershell`; `codemode` y `tool_search` como extensiones integradas).
  - `docs/settings.md` §Tools (`defaultTools` con `+name`/`-name`, `codemode.mode`, `codemode.inlineBudget` 3000).
  - `docs/extensions.md` §Tools («Truncate large model-facing results…»; las llamadas anidadas con
    `ctx.executeTool()` pasan por `tool_call` y `tool_result`) y §Tool exposure.
  - `examples/extensions/truncated-tool.ts` («Custom tools MUST truncate… 50KB… 2000 lines») y
    `dist/core/tools/truncate.js` (`DEFAULT_MAX_LINES = 2000`, `DEFAULT_MAX_BYTES = 50 * 1024`).
  - `docs/mcp.md` (resultados de texto de más de 20 KB recortados por el medio; `timeout` 60 s por servidor) y
    `docs/codemode.md` (`max_output_tokens` 10000; `bash` dentro de un script no está limitado a las 2000 líneas o
    50 KB que ve el modelo).
  - `docs/security.md` («Choose how to run Pi», tabla de tres formas; «Watching the transcript… do not create a
    security boundary») y `docs/containerization.md`.
- oh my pi 18.6.1 (`omp read omp://…`; `settings.md` leído en tres tramos por el corte de 50 KB):
  - `settings.md` §«Tools and approvals»: `tools.approvalMode` (`yolo` por defecto), `tools.approval`,
    `tools.maxTimeout` (**`0` = sin tope**), `tools.outputMaxColumns` 768, `tools.artifactSpillThreshold` 50 KB,
    `tools.artifactHeadBytes`/`TailBytes` 20 KB, `tools.artifactTailLines` 500, `tools.artifactMaxBytes` 16 MB,
    `tools.intentTracing` (`true`), `tools.xdev` (`true`: herramientas descubribles bajo `xd://`; desactivarlo «exposes
    enabled tools top-level»), `tools.xdevDocs` (`catalog`).
  - `bash-tool-runtime.md`: `OutputSink` compartido (50 KiB de presupuesto cabeza/cola, artefacto con el resto),
    tiempo por defecto 300 s acotado a 1–3600 y por `tools.maxTimeout`; «Pattern approval is not containment»; los
    patrones no cubren `eval`. `python-repl.md`: el mismo `OutputSink` y el mismo tope de tiempo.
  - `cli-reference.md`: `--tools` («default: all»), `--no-tools`, `--config <file>` («extra config.yml-style overlay
    for this run»), `--no-session`, `--approval-mode`, `--max-time`.
  - `tools/task.md`: `isolated` y `task.isolation.enabled` (espacio de trabajo aislado con captura de parches; no se
    presenta como frontera de seguridad).
  - notas de investigación del curso §3.8 «Tools index» (clases Read/Write/Exec/Mixed, qué viene activo).
- Guiones: 01 (terminado: `/context` de omp, 2,7K de prompt y 3,9K de herramientas; 12 activas de 24), 05, 06, 07
  (terminado: 1971 / 2492 / 2193 / 4054 tokens), 08, 09, 11, 13 (borrador: `/context` con cuatro herramientas; no se
  usa como dato), 19 y 21 (borradores).
- Documentación oficial de Pi: [cli.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md), [codemode.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md), [containerization.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/containerization.md), [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md), [mcp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md), [security.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/security.md), [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md)

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De usar un harness a diseñarlo**

Hasta aquí has aprendido a usar dos harnesses. En el bloque de Pi, un núcleo pequeño que moldeas con ficheros y extensiones. En el de oh my pi, un taller completo con aprobaciones, subagentes, reglas y métricas. Con este vídeo empieza el último bloque, y cambia la pregunta. Ya no es qué hace este comando, sino qué decides tú y por qué.

Recuerda el vídeo uno. La palabra harness tiene dos sentidos: el programa que ejecuta el bucle, como Pi u oh my pi, y el andamiaje que pones en tu repositorio. Y usamos cinco piezas para describir los dos: instrucciones, herramientas, entorno, estado y feedback. No vamos a repetirlo. Vamos a usarlo para decidir.

Hoy empezamos por los mapas: dos formas de pensar un harness que vienen de sitios muy distintos. Lo que veas te sirve con cualquier agente. Después tomaremos tres decisiones concretas que salen de esos mapas. Cuántas herramientas ve el modelo. Dónde viven los límites, como el truncado de la salida, los tiempos o las aprobaciones. Y quién decide y quién ejecuta, que es la separación entre el anfitrión y el sandbox. La primera la vamos a medir, porque un diseño que no se mide es solo una opinión.

**2 · Tres mapas de Learn Harness Engineering**

Buena parte de este bloque se apoya en Learn Harness Engineering, el curso abierto de WalkingLab, con copyright de dos mil veinticinco y licencia MIT. Reutilizamos sus ideas y su estructura, con nuestras palabras, y lo citamos en los créditos. Lo curioso es que el propio curso no trae una taxonomía, sino tres, y cada una responde a una pregunta distinta.

La primera ya la conoces: instrucciones, herramientas, entorno, estado y feedback. Es la que usa para analizar productos reales, como Pi, Claude Code o Codex. Sirve para describir qué trae un agente y qué pones tú. Es un mapa del runtime y de su entorno.

La segunda está en la portada del curso, y es otra lista de cinco: instrucciones, estado, verificación, alcance y ciclo de vida de la sesión. Fíjate en lo que falta: herramientas y entorno. Es un mapa del repositorio. Cada pieza es un fichero o una costumbre: el AGENTS punto md, el fichero de progreso, la batería de pruebas, una sola funcionalidad cada vez, un script de arranque y una nota de traspaso al terminar. Ese mapa es el del próximo vídeo.

La tercera es una herramienta de diagnóstico, de la primera lección: cinco capas donde puede estar el fallo. La especificación de la tarea, el contexto, el entorno, la verificación y el estado. Es lo que hicimos en el vídeo uno al preguntar qué pieza había fallado. Antes de cambiar de modelo, atribuye el fallo a una capa. Hoy la usaremos con un resultado de la demo.

¿Por qué tres? Porque responden a preguntas distintas. Qué tiene mi agente. Qué tiene mi repositorio. Dónde se ha roto. No compiten. Pero todas están escritas desde el mismo asiento: el de alguien que usa un agente que ya existe y quiere que trabaje mejor. Hay otro asiento, y desde él las cosas se ven distintas.

**3 · El Harness Playbook: la vista desde el motor**

Ese otro asiento es el de quien construye el runtime. El texto más claro escrito desde ahí es The Harness Playbook, publicado en septiembre de dos mil veintiséis por Can Bölük, el autor de oh my pi. Su empresa, Stencil, es la que está detrás de oh my pi. Tenlo en cuenta al leerlo: es un punto de vista influyente, con opinión, no una metodología neutral.

Su tesis cabe en una frase: un harness es software de sistemas, no un bucle alrededor de una petición. Y su analogía central es un motor de videojuego. Un motor mantiene un mundo con autoridad, registra cada cambio, ejecuta acciones de código que no es de fiar, replica el estado en varias pantallas y adapta protocolos incompatibles. Según el autor, un harness hace exactamente eso.

Para diseñar, propone pensar en cuatro escenarios extremos. Varios agentes trabajando en la misma carpeta. Un agente remoto que manejas desde el móvil. Un espectador que mira desde una web en la que no confías. Y una fábrica de software automática, alimentada por un programa, con entradas hostiles. Si el diseño aguanta esos cuatro, aguanta tu día a día.

De ahí salen sus cinco principios. Una sola sesión con autoridad, derivada del registro, para que rebobinar, bifurcar y retomar no mientan. Un plano de control de confianza: la política vive en el anfitrión y el sandbox solo ejecuta peticiones acotadas. Trabajo acotado: herramientas, subagentes y procesos en segundo plano son flujos cancelables con límites centrales. Compatibilidad explícita con cada modelo. Y vistas que son proyecciones del mismo estado.

Dos avisos para leerlo bien. El primero: buena parte del texto describe la próxima arquitectura, que el autor llama omp al cuadrado y que aún se está construyendo. No es la oh my pi que tienes instalada, y no la enseñamos como disponible. El segundo: critica abiertamente a Pi. Por ejemplo, dice que de diecisiete extensiones de ejemplo con estado, solo dos lo guardaban bien, algo que vimos en el vídeo nueve. Y la ficha de Pi de WalkingLab elogia justo esas extensiones. Las dos lecturas son útiles; ninguna es la verdad.

Y aunque miren desde asientos distintos, los dos textos coinciden más de lo que chocan. Los dos piden definir antes qué significa terminado, porque sin eso el agente se inventa pruebas que no prueban nada. Los dos tratan el contexto como un presupuesto que se gasta. Y los dos quieren el estado fuera de la cabeza del modelo: uno en el repositorio, el otro en el registro de la sesión.

Hoy nos quedamos con tres de sus ideas, porque son las que más afectan a lo que tú configuras: un roster pequeño de herramientas, límites centralizados, y el anfitrión que decide frente al sandbox que ejecuta. Las otras, como el estado en el registro o la verificación definida de antemano, vuelven en los próximos vídeos.

**4 · Cada esquema cobra un impuesto**

Empecemos por las herramientas. En el vídeo uno citamos la frase del Playbook: cada esquema cobra un impuesto. Hoy vamos a ver de qué está hecho ese impuesto, porque no es solo de tokens. Tiene tres partes.

La primera es el prefijo. Cada herramienta viaja en cada petición con su nombre, su descripción y sus parámetros, y además suele llevar alguna línea en el prompt de sistema que explica cuándo usarla. La caché de prompts lo abarata, pero no lo regala. La segunda es la elección: cada herramienta es una opción más entre las que el modelo duda, y a veces elige la que no toca. La tercera es la menos visible: una herramienta cambia cómo trabaja el modelo, para bien o para mal.

El Playbook mide tiempos. Con unas cinco herramientas, oh my pi hizo su tarea de prueba en treinta y seis segundos y medio, frente a treinta y siete de Pi y cuarenta y dos de Codex. Y la misma oh my pi, con sus veintitrés definiciones de serie, tardaba ochenta y seis. Son cifras de su autor, con su prueba, que no hemos reproducido. La lección no es quién gana, sino que el roster se mide.

¿Cómo lo resuelve cada uno? Pi parte de cuatro herramientas y te deja quitar y poner. Guion guion tools acepta una lista cerrada, o un más o un menos delante de cada nombre: más codemode añade codemode a las de serie, y menos write quita write. Guion guion exclude tools quita por nombre o con asterisco, y guion guion no mcp apaga MCP para una ejecución.

Y el roster se puede versionar. En los ajustes de Pi, default tools acepta la misma sintaxis. Si lo pones en los ajustes del proyecto, todo el equipo arranca con el mismo roster, igual que en el vídeo diecinueve compartimos las aprobaciones de oh my pi en un fichero del repositorio. Lo que no cabe en el roster se esconde detrás de codemode o de tool search, como vimos en el vídeo siete.

oh my pi trae muchas más herramientas, pero no las declara todas. Las poco usadas se montan como dispositivos descubribles, con direcciones que empiezan por equis de, como vimos con barra tools en el vídeo once: el modelo sabe que existen y lee su documentación cuando las necesita. Es lo que el Playbook llama dejar la cola larga detrás de superficies estables. El ajuste se llama tools punto xdev, y viene encendido.

Learn Harness Engineering dice lo mismo con otras palabras: divulgación progresiva. Lo barato y necesario, siempre presente. Lo demás, cargado cuando hace falta. Pero ojo con el extremo contrario. Si le quitas al modelo una herramienta que necesita, no se para: improvisa con otra. Sin herramienta de edición, edita con bash. Por eso hay que medir dos cosas a la vez: lo que cuesta el roster y lo que cambia en el resultado.

Un apunte antes de medir. Las herramientas van al principio de cada petición, que es justo lo que aprovecha la caché. Algunos proveedores ya aceptan herramientas nuevas a mitad de conversación sin perder la caché, pero no todos. La regla práctica: decide el roster al empezar, no a mitad.

**5 · Medir el prefijo**

Vamos a la demo. Primero, una precaución que vale para cualquier medida. Comprobamos que no queda nada de vídeos anteriores que cambie lo que medimos: ninguna extensión en el directorio del agente de Pi, ningún servidor MCP y ninguna configuración de oh my pi en la tienda. Y los dos agentes usan el mismo modelo, DeepSeek Flash.

El primer script es prefijo punto sh. Hace lo mismo que en el vídeo siete: en modo print, con guion guion mode json, la petición di solo hola, y de la respuesta saca los tokens de entrada, contando los que vienen de la caché. Son lo que pesa el roster antes de que el modelo haga nada. Cinco filas para Pi y tres para oh my pi.

La tabla de Pi. Sin ninguna herramienta, setecientos noventa y cuatro tokens: es el suelo, el agente sin manos. Con read y bash, mil cuatrocientos veintiocho. Con las cuatro de serie, mil novecientos setenta y uno, exactamente la cifra del vídeo siete. Con las siete integradas, dos mil quinientos treinta y nueve.

Lo interesante no es el total, sino la diferencia entre filas. Read y bash suman unos seiscientos tokens. Edit y write, unos quinientos cincuenta. Grep, find y ls juntos, otros quinientos setenta. Y la quinta fila, las de serie más codemode, da dos mil quinientos cuarenta y dos: codemode sola pesa lo mismo que esas tres herramientas, porque su descripción explica cómo escribir scripts. Esa diferencia incluye el esquema y las líneas del prompt que hablan de cada herramienta, que es justo lo que pagas.

Ahora oh my pi, con tres configuraciones. Con read, bash, edit y write, cuatro mil cuatrocientos veintiocho tokens. Con todo lo de serie y el catálogo de descubribles, casi ocho mil. Y con todo pero sin catálogo, más de diez mil seiscientos. Para quitar el catálogo usamos guion guion config con un fichero de una línea que apaga tools punto xdev, solo para esa ejecución.

Dos lecturas. La primera: el catálogo te ahorra unos dos mil seiscientos tokens en cada petición, porque las descubribles no se declaran enteras. No es gratis del todo: cuando el modelo necesita una, primero lee su documentación, como pasaba con codemode en el vídeo siete. La segunda: con las mismas cuatro herramientas, oh my pi pesa más del doble que Pi. Su prompt de sistema trae mucho más. Ni bueno ni malo: es una decisión de diseño, y ahora sabes cuánto cuesta.

**6 · La misma tarea con rosters distintos**

El prefijo es solo la mitad. La pregunta importante es qué cambia en una tarea de verdad. El encargo es pequeño y verificable: añadir a envío punto js una función que diga cuántos euros faltan para el envío gratis, redondeados a céntimos, y cero si ya lo tiene, con la misma validación que gastos envío, con sus pruebas, y ejecutar npm test.

Para no hacerlo a mano, está en un script corto, medir punto sh. Para cada configuración y cada repetición crea un worktree de git propio desde master. Recuerda el vídeo uno: dos agentes en la misma carpeta se pisan. Learn Harness Engineering lo dice en su primer proyecto: para comparar, directorios aislados, nunca ramas en la misma carpeta. Un detalle práctico: el worktree se crea con guion guion detach, porque master ya está abierta en la tienda.

Después lanza el agente en modo JSON y guarda los eventos. Al terminar, entra en la carpeta y juzga desde fuera, nunca desde lo que cuenta el agente: si npm test pasa y cuántos ficheros cambiaron. Y el script lleva set guion e: si un paso falla, se para antes de lanzar el agente. Lo aprendimos preparando el vídeo: un worktree que no se creó y un agente que trabajó en la carpeta equivocada.

Seis configuraciones. En Pi: read y bash, las cuatro de serie, y las siete integradas. En oh my pi: cuatro herramientas, todo con catálogo y todo sin catálogo. Tres repeticiones de cada, dieciocho ejecuciones en total. Una sola ejecución es una anécdota: el mismo modelo, con el mismo encargo, no hace siempre lo mismo. Lo vimos con barra ratchet en el vídeo veintiuno.

Tardó cinco minutos y cuarenta y ocho segundos, y las dieciocho pasan npm test. El tercer script, resumen punto sh, saca de cada fichero de eventos las llamadas por herramienta, los tokens y el coste, y debajo pone la media de cada configuración. Todo el experimento costó menos de siete céntimos de dólar.

Empecemos por oh my pi, porque ahí el prefijo se nota. De media, unos setenta mil tokens con cuatro herramientas, casi cien mil con catálogo y ciento cuarenta y dos mil sin catálogo. El prefijo viaja en cada vuelta del bucle, así que crece con él. Pero mira el coste: tres décimas de céntimo, tres décimas y cuatro décimas. Con catálogo sale incluso más barato que con cuatro herramientas.

¿Por qué? Por la caché. En oh my pi, en conjunto, más del noventa por ciento de esos tokens se leen de la caché, y leer de la caché cuesta muy poco. Lo que pagas de verdad es lo que el modelo escribe y lo que no estaba en caché. Y mira la dispersión dentro de una misma configuración: sin catálogo, una ejecución costó dos décimas de céntimo y otra casi ocho décimas. La diferencia de coste entre configuraciones cabe dentro de ese ruido. Con tres repeticiones, no has demostrado nada sobre el coste.

Ahora Pi. Read y bash solos no salen más baratos: unos veintiocho mil tokens, frente a veintitrés mil con las cuatro de serie. Hacen más llamadas a bash y necesitan más vueltas, de seis a ocho, frente a cinco. Y mira cómo editó en la primera repetición. Sin edit ni write, escribió el fichero entero en una carpeta temporal con un heredoc y lo copió encima. Añadió las pruebas con cat. Intentó cambiar el import con sed, falló, y lo arregló con perl.

Funcionó, y npm test pasa. Pero pierdes la edición precisa: en lugar de un cambio pequeño que puedes revisar, una reescritura completa del fichero. Y en el diff aparece algo más. El agente sacó la validación de gastos envío a una función nueva, validar subtotal, y la usó en las dos. Nadie se lo pidió.

Aquí entra el diagnóstico por capas. ¿Lo causó el roster mínimo? Contamos: esa refactorización aparece en diez de las dieciocho ejecuciones, con todos los rosters y en los dos agentes. No es la capa de herramientas, es la de especificación: el encargo dice con la misma validación, y el modelo lo lee como reutilízala. Si no la quieres, dilo en el encargo. Y fíjate en que npm test pasa en las dieciocho: el juez externo no ve un cambio de más. Para eso sigue haciendo falta mirar el diff.

Lo que te llevas no es nuestra tabla, sino el método. Un encargo pequeño y verificable, rosters que solo cambian en una cosa, carpetas aisladas, repeticiones y un juez externo. Es la ablación del vídeo uno, aplicada a las herramientas y con números. Y el resultado depende del modelo: con otro modelo, otra tabla. Por eso conviene repetir la medida cuando cambies de modelo.

**7 · Límites centralizados**

Segunda decisión: dónde viven los límites. Hablamos de cuánto texto de una herramienta llega al modelo, cuánto puede tardar un comando, y qué se aprueba solo. El principio del Playbook es acotar la salida una sola vez, en el centro. Si cada herramienta trunca por su cuenta, cada una pone su propio aviso, y alguna se olvida de truncar.

Mira cómo lo hace Pi. Las herramientas integradas cortan lo que ve el modelo en dos mil líneas o cincuenta kilobytes, como enseña el grep del fichero de truncado. Pero ese límite es una utilidad que cada herramienta tiene que llamar. El ejemplo de la documentación lo dice en mayúsculas: las herramientas propias deben truncar su salida. Los resultados MCP tienen su propio corte, a los veinte kilobytes, y la salida de codemode el suyo, de diez mil tokens.

Son tres sitios, y cada uno tiene su motivo. El Playbook avisa de que truncar dentro de una herramienta rompe el codemode, porque el aviso se mezcla con los datos. Pi lo evita así: dentro de un script, bash devuelve hasta un mega de salida, no los cincuenta kilobytes que ve el modelo, para que el script la filtre. Pero si escribes una extensión con una herramienta, el truncado es cosa tuya.

Para la política, en cambio, Pi sí tiene un punto central: el evento tool call. Toda llamada pasa por él, también las de MCP y las que hace una herramienta desde dentro de otra, como un script de codemode. Por eso la extensión de permisos del vídeo ocho vigilaba todas las herramientas a la vez. Un solo sitio para decidir.

oh my pi va más lejos en los límites. La salida de bash y la de eval pasan por el mismo recolector, con un presupuesto de cincuenta kilobytes entre el principio y el final, y el resto se guarda en un artefacto. Todo se ajusta en un único grupo de la configuración, tools. En pantalla, con config get: el umbral del artefacto, cincuenta; la cabeza, veinte; y el tope de tiempo, tools punto max timeout, a cero, que significa sin tope.

Y aquí hay letra pequeña, que comprobamos en el código. Si pones un tope, se aplica al tiempo que pida el modelo y al de por defecto, que son cinco minutos. Pero si el modelo pide un timeout de cero, el comando se queda sin límite de tiempo, con tope o sin él. Si de verdad necesitas un límite duro, ponlo fuera del modelo: guion guion max time para toda la sesión, como en medir punto sh, o el límite de tu sistema de integración continua.

Y la política también es central: cada herramienta declara su nivel, y el modo de aprobación decide, como vimos en el vídeo diecinueve. Pero allí apareció el hueco que demuestra el principio: los patrones de bash no cubren eval, que puede lanzar una shell por su cuenta. Una regla que vive en una herramienta concreta no protege de las demás. Learn Harness Engineering lo llama fallar cerrado: lo que no está clasificado se trata como peligroso. Y hay rutas que nunca se aprueban solas, pase lo que pase con el modo, como la carpeta punto git: es lo que hacía el hook de rutas protegidas del vídeo diecinueve.

La lección práctica: cuando añadas una pieza a tu harness, pregúntate dónde vive su límite. Si la respuesta es dentro de la propia pieza, apúntalo, porque tendrás que repetirlo en cada pieza nueva. Si vive en un sitio común, como el evento tool call de Pi o el grupo tools de oh my pi, escríbelo ahí y versiónalo con el repositorio.

**8 · El anfitrión decide, el sandbox ejecuta**

Tercera decisión. El Playbook la formula así: el anfitrión es dueño de la sesión, del modelo, de la política, de las aprobaciones y de los límites. El sandbox solo ejecuta lo que le piden, y devuelve una salida acotada. Quien decide no es quien ejecuta, como ya dijimos en el vídeo uno. Hoy vemos qué significa en la práctica.

En el vídeo cinco vimos las formas de ejecutar Pi que propone su documentación: directamente con tu usuario, entero dentro de un contenedor o una máquina virtual, o fuera con solo sus herramientas dentro. Léelas ahora con este principio. Con Pi entero en un contenedor, el que decide y el que ejecuta están en la misma caja: aíslas bien tu máquina, pero la política y las credenciales que metas viven dentro.

La tercera forma, la de Gondolin, es la separación del Playbook: Pi y sus decisiones en el anfitrión, y las herramientas integradas en una micro máquina virtual. Con su letra pequeña: las herramientas de otras extensiones siguen ejecutándose en el anfitrión, salvo que deleguen, y los comandos heredan las variables de entorno del anfitrión. Y Docker Sandboxes aplica la idea a las credenciales: la clave real se queda en el anfitrión, y dentro solo hay un valor de relleno.

Ojo con sacar una conclusión equivocada. La documentación de Pi dice que meter Pi entero en un entorno aislado suele ser la opción práctica más fuerte, y que aislar solo las herramientas es una frontera más estrecha. Separar anfitrión y sandbox deja la política y las claves fuera del alcance de lo que se ejecuta, pero protege menos superficie. Son dos decisiones distintas, y a veces se combinan.

Hay un tercer ejemplo, más sutil. Cuando Pi integró MCP, sus autores explicaron que codemode se ejecuta del lado del harness, que es el lado de confianza, y no donde corre bash. El script no toca el sistema: solo pide cosas a las herramientas, y esas peticiones pasan por el mismo punto de control. Es la misma idea a pequeña escala.

En oh my pi, si activas task punto isolation punto enabled, los subagentes pueden trabajar en un espacio aislado, con la opción isolated de la herramienta task, y sus cambios vuelven como un parche. Ayuda mucho a que no se pisen. Pero es aislamiento del espacio de trabajo, no una frontera de seguridad: el subagente sigue siendo un proceso en tu máquina, con tus permisos.

Para tu diseño, la pregunta es qué va a cada lado. Del lado del anfitrión: la sesión, las claves del modelo, la política de aprobaciones y los límites. Del lado del sandbox: la carpeta del proyecto, las dependencias y los comandos. Y lo que cruza la frontera, lo más estrecho posible: solo la carpeta que la tarea necesita, credenciales de poco alcance y de corta vida, y red solo si hace falta.

Y un apunte honesto, que repetimos porque es lo más importante del vídeo. Aprobar no es aislar. La documentación de oh my pi lo dice: un patrón aprobado no confina nada, el comando tiene todo el acceso de tu shell. Y la de Pi, que mirar la conversación o revisar los cambios no crea ninguna frontera. Las aprobaciones deciden qué se ejecuta; solo una frontera del sistema operativo o una máquina virtual decide qué puede tocar.

**9 · Repaso, práctica y cierre**

Repasemos. Learn Harness Engineering nos da tres mapas: las cinco piezas para describir un agente, cinco subsistemas para tu repositorio y cinco capas para diagnosticar. El Harness Playbook mira desde el motor y propone cinco principios. Es la opinión del autor de oh my pi, valiosa y discutible, y parte describe una arquitectura que aún no existe.

De ahí salen tres decisiones. Un roster pequeño, con la cola larga detrás de codemode, tool search o el catálogo de oh my pi, y medido: el prefijo, y el resultado de una tarea con repeticiones y carpetas aisladas. Recuerda lo que vimos: los tokens siguen al prefijo, el coste lo suaviza la caché, y quitar herramientas cambia cómo trabaja el modelo. Límites en un solo sitio, sabiendo cuáles dependen de cada herramienta y cuáles se pueden saltar. Y el anfitrión que decide frente al sandbox que ejecuta, recordando que aprobar no es aislar.

La práctica tiene dos partes. Primero, escribe en una página la ficha de tu harness: qué herramientas ve el modelo y por qué, dónde vive cada límite, y qué se ejecuta dentro de una frontera y qué fuera. Segundo, elige una tarea pequeña de tu proyecto, con una prueba que la juzgue, y lánzala con dos rosters, tres veces cada uno, en worktrees separados. Compara tokens, coste, llamadas, si la prueba pasa y qué hay en el diff.

Si la diferencia es ruido, quédate con el roster que entiendes mejor. Si no lo es, ya tienes un dato para tu diseño, y no una intuición. Y apunta la fecha: el harness se degrada como el código, y cuando cambie el modelo, conviene repetir la medida.

En el próximo vídeo bajamos del runtime al repositorio: el repo como sistema de registro. El estado fuera de la conversación: AGENTS punto md, la lista de funcionalidades, el progreso, el script de arranque y el documento de traspaso, para que una sesión nueva retome el trabajo sin perder el hilo. Nos vemos allí.

</details>

