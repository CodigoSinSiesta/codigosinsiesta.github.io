---
title: "Vídeo 21 · oh my pi programático, métricas y equipo"
description: "omp en scripts e integración continua, su panel de estadísticas y trazas, y las funciones para trabajar en equipo."
ruta: "pi-oh-my-pi"
orden: 21
duracion: "22 min"
video: "21-omp-programatico-metricas-equipo.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/21-omp-programatico-metricas-equipo.es.vtt"
---

omp en scripts e integración continua, su panel de estadísticas y trazas, y las funciones para trabajar en equipo.

<p class="guia__nota">Dura 22 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que ya sabes y lo que cambia

<p><button type="button" class="ir-a" data-t="19">▶ Ir a 0:19</button></p>

- **Vídeo 10 · Pi fuera de la TUI:** print (scripts) → JSON (eventos) → RPC (otro proceso) → SDK (tu programa) → CI (la revisión)
- **¿Qué cambia en oh my pi?**
  - `modos` · Los mismos: con detalles que rompen scripts
  - `ACP` · Un quinto camino: dentro de un editor
  - `nuevo` · Lo que Pi no tiene: panel, trazas, equipo
- **Por orden:** omp -p (JSON) → Revisión (con red) → CI → RPC (v2) → SDK (ACP) → Métricas (/trace /stats) → Equipo (/ratchet)
- **El montaje**
  - `demo` · Perfil demo
  - `Flash` · DeepSeek: barato para leer
  - `OMP_PROFILE` · = demo: también en los scripts

### 2 · omp -p y el modo JSON

<p><button type="button" class="ir-a" data-t="123">▶ Ir a 2:03</button></p>

- *En terminal:* omp -p con una tubería (más abajo, en «Código y comandos»)
- *En la demo:* omp -p, mientras trabaja
- *En la demo:* La respuesta, entera al final
- **Herramientas de lectura**
  - `Pi` · read grep find ls: vídeo 10
  - `oh my pi` · read grep glob
  - `find · ls` · No arranca: revisa tus scripts
- **Vídeo 14:** omp -p --advisor — Espera las revisiones finales del advisor: hasta diez minutos.
- *En la demo:* --mode json | jq
- **oh my pi:** No hay agent_settled — El final se lee en agent_end.
- *En la demo:* isTerminal · yielded · stopReason
- **El código de salida**
  - `omp` · ≠ 0 también en JSON: si acaba en error
  - `Pi` · No era así
  - `0` · Terminó: no que acertara

### 3 · La revisión, con la red de oh my pi

<p><button type="button" class="ir-a" data-t="297">▶ Ir a 4:57</button></p>

- *En la demo:* scripts/revisar-omp.sh
- *En la demo:* La línea de oh my pi
- *En la demo:* --approval-mode always-ask
- **Vídeo 10 → 21:** Un flag, no una extensión — --approval-mode always-ask: la red de seguridad del script.
- *En la demo:* errores.jsonl
- *En la demo:* informe.md · salida 1 · git status limpio
- *En la demo:* errores.jsonl con «corrígelo» y edit, write
- **Por qué el flag**
  - `.omp/config.yml` · Modo write: vídeo 19
  - `edit` · Se aprueba sola
  - `flag` · Gana al proyecto
- **Dos redes y un vigilante:** --tools (la principal) → always-ask (la segunda) → El script (lo detecta)

### 4 · Integración continua

<p><button type="button" class="ir-a" data-t="488">▶ Ir a 8:08</button></p>

- *En la demo:* .github/workflows/revision-omp.yml
- *En la demo:* Bun, la clave y el modelo
- *En la demo:* timeout-minutes: 15 · --max-time 5m
- **El bash de oh my pi:** CI=true — Los comandos saben que no hay nadie delante.
- **Sin /trust, el .omp del pull request se carga**
  - `config` · Políticas: por herramienta
  - `reglas` · Instrucciones
  - `hooks` · Código: con tu clave en el entorno
  - `MCP` · Programas
- **En integración continua**
  - `clave` · Solo en su paso
  - `flags` · En la rama base
  - `--tools` · De lectura
  - `contenedor` · Vídeo 5
- **Vídeos 5, 19 y 20:** Aprobar no es aislar — Y en oh my pi, un flag tampoco.

### 5 · RPC, versión dos

<p><button type="button" class="ir-a" data-t="592">▶ Ir a 9:52</button></p>

- *En la demo:* omp --mode rpc --no-session --tools read,grep,glob
- *En la demo:* ready · negotiate_protocol
- *En la demo:* prompt_result · session_settled
- *En la demo:* get_session_stats
- *En terminal:* ~/csn/rpc/aprobador-omp.mjs (resumen) (más abajo, en «Código y comandos»)
- *En la demo:* aprobador-omp.mjs
- *En la demo:* Aprobado desde el cliente
- **RPC v2, además**
  - `set_host_tools` · Tus herramientas: las ofrece el cliente
  - `título` · Apagado: una llamada menos
  - `clientes` · TS · Python · Rust · Go: oficiales

### 6 · El SDK y ACP

<p><button type="button" class="ir-a" data-t="769">▶ Ir a 12:49</button></p>

- **El SDK**
  - `createAgentSession` · Sin protocolo
  - `Bun` · No Node
  - `bun add` · Misma versión: que tu binario
- *En la demo:* ~/csn/sdk-omp/resumen.ts
- *En la demo:* stderr: herramientas · stdout: la respuesta
- **Un detalle:** ¿En qué carpeta estoy? — El modelo dijo la del script, no la tienda. Y aun así leyó la tienda.
- **Perfil, y SDK o RPC**
  - `OMP_PROFILE` · Imprescindible: o usa tu agente de verdad
  - `SDK` · En Bun: acceso a todo
  - `RPC` · Otro lenguaje: su propio proceso
- *En terminal:* settings.json de Zed (diapositiva) (más abajo, en «Código y comandos»)

### 7 · Métricas: /trace, /stats y /export

<p><button type="button" class="ir-a" data-t="897">▶ Ir a 14:57</button></p>

- *En la demo:* omp --profile demo, sesión guardada
- **/trace y /stats:** Abren tu navegador — Si grabas o compartes pantalla: un navegador limpio, sin sesiones.
- *En la demo:* /trace
- *En la demo:* La traza de la sesión
- *En la demo:* Timeline
- *En la demo:* Transcript: npm test 178 s · git status 321 s
- *En la demo:* /stats · Overview
- *En la demo:* Models
- *En la demo:* Requests
- *En la demo:* Tools
- *En la demo:* Costs
- *En la demo:* Projects
- **Puerto 3847:** Un panel abierto se reutiliza — Antes de compartir pantalla, mira de qué perfil es.
- **Frustración, y sin navegador**
  - `página` · Señales de enfado: en tus mensajes
  - `botón` · Modelo juez: ese sí gasta
  - `terminal` · omp stats: --summary · --json
- *En la demo:* omp stats --summary
- *En la demo:* /export /tmp/csn/omp21/sesion.html
- *En la demo:* La exportación
- **/export:** No redacta secretos — AGENTS.md, rutas y conversación: revísala antes de enviarla.

### 8 · Equipo: /ratchet y lo que publica

<p><button type="button" class="ir-a" data-t="1127">▶ Ir a 18:47</button></p>

- **Solo explicado:** /ratchet — Mejorar un flujo con modelo con datos, no con intuición.
- **Dos tiempos:** Evaluación (3 aprobaciones) → Reparto (congelado) → Rondas (un cambio)
- **Dos ideas que valen siempre**
  - `ruido` · Calcúlalo antes: diez puntos pueden ser azar
  - `reservados` · Casos no vistos: solo ahí cuenta
- **Lo que publica (no se enseña)**
  - `/share` · Instantánea: cifrada, clave en el enlace
  - `/collab` · En directo
  - `/join` · Escribe al agente: en tu máquina
  - `omp stream` · Página pública
- **/collab:** El enlace es el acceso — Lo que sale de tu máquina se explica, no se enseña.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1217">▶ Ir a 20:17</button></p>

- **Repaso · 1**
  - `omp -p` · Al final: Working por stderr
  - `JSON` · agent_end: isTerminal · yielded
  - `lectura` · read grep glob
  - `script` · Flags: y always-ask
- **Repaso · 2**
  - `RPC` · ready · v2: prompt_result · settled
  - `SDK` · Bun: restrictToolNames
  - `ACP` · Editor
  - `/trace /stats` · Miden: perfil demo, navegador limpio
  - `/export` · No redacta
  - `/ratchet` · Mide antes
- **La práctica:** revisar.sh (a omp) → always-ask (que se rechace) → Con sesión (un par de veces) → /stats (modelo o herramientas)
- **Vídeo 22 · Bloque D:** Diseñar tu harness — Pocas herramientas, límites centralizados, anfitrión y sandbox. Y medirlo.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### omp -p con una tubería

```text
git diff master \
  | omp -p --tools read,grep,glob \
      "Revisa este diff en tres viñetas."
```

- `git diff`: Contra la base
- `|`: Entra como contexto
- `-p`: Responde y sale

### ~/csn/rpc/aprobador-omp.mjs (resumen)

```text
const omp = spawn("omp", ["--mode", "rpc", "--no-session"]);
// 1. espera {"type":"ready"} y manda el prompt
// 2. texto y [herramientas] según llegan
if (ev.type === "extension_ui_request" && ev.method === "select")
  responder(ev.id, await pregunta("¿Aprobar? (s/n)") ? "Approve" : "Deny");
// 3. get_session_stats → una línea
```

- `ready`: Arranque
- `select`: Approve / Deny
- `stats`: Al final

### settings.json de Zed (diapositiva)

```text
"agent_servers": {
  "Oh My Pi": { "type": "custom", "command": "omp",
                "args": ["--profile", "demo", "acp"] } }
```

- `acp`: Proceso hijo
- `agent_servers`: La entrada
- `--profile demo`: Nuestro perfil

## Fuentes

- Documentación instalada de omp 18.6.1 (`omp read omp://…`), comparada con la documentación de omp (omp.sh):
  **idénticas** `cli-reference.md`, `sdk.md`, `stream.md`, `session-operations-export-share-fork-resume.md`,
  `collab.md`, `config-usage.md`, `approval-mode.md` y `advisor-watchdog.md`; `rpc.md` y `environment-variables.md`
  solo difieren porque `omp read` corta a 50 KB (prefijo idéntico; se leyeron enteros en la copia).
  - `cli-reference.md`: «Headless / print mode» (última respuesta por stdout al terminar, `Working...` por stderr,
    stdin no TTY elige print, `--print-thoughts`, `--no-title`, `--max-time`); «`--mode json` emits a session header
    followed by events… Terminal turn failures produce a nonzero exit status in both text and JSON modes»; tabla de
    `--mode` (`text`, `json`, `rpc`, `rpc-ui`, `acp`); `--no-ui`; `--approval-mode`, `--auto-approve`/`--yolo`,
    `--tools`, `--no-extensions`, `--no-skills`, `--no-rules`, `--config`, `--profile` («applied before subcommand
    routing»); subcomandos `acp`, `stats`, `share`, `join`, `collab`, `stream`, `clip`, `play`.
  - `rpc.md`: `ready` con `supportedProtocolVersions: [1, 2]`; `negotiate_protocol` y `rpc_chunk`; la respuesta de
    `prompt` = admitido; `prompt_result` (`agentInvoked`, `status`, `sessionSettled`) y `session_settled` («Yield vs
    settled»); fallo del proveedor = `success: true` + `stopReason: "error"`; RPC desactiva el título automático;
    `extension_ui_request` (`select`, `confirm`, `input`, `editor`, `ask`…) y `--no-ui`; «Tool approval prompts use
    the extension runner… Under `--no-ui`, tools requiring approval fail closed»; herramientas del host
    (`set_host_tools`, `host_tool_call`, `host_tool_result`); `get_session_stats`, `export_html`; clientes TypeScript,
    Python (`omp-rpc`), Rust y Go generados del esquema; cerrar stdin = apagado ordenado con código 0.
  - `sdk.md`: `bun add @oh-my-pi/pi-coding-agent`, Bun 1.3.14 o superior; «provide to override, omit to discover»;
    `agentDir` por defecto `~/.omp/agent`; `SessionManager.inMemory()`; **`toolNames` no es una lista blanca sin
    `restrictToolNames: true`** (que además apaga MCP, extensiones, comandos y LSP); `hasUI` falso por defecto;
    `agent_end` con `isTerminal`/`yielded`; `await session.dispose()`.
  - `approval-mode.md` §«ACP sessions» (la puerta de permisos del cliente se mantiene con la configuración por defecto;
    `omp acp --yolo` o `--approval-mode yolo` para ir desatendido) y §«Subagents».
  - `advisor-watchdog.md` §«Headless runs»: `omp -p --advisor` espera hasta diez minutos las revisiones finales; las
    salidas con error, 30 segundos.
  - `session-operations-export-share-fork-resume.md`: `/export [--themes] [ruta]`, nombre por defecto
    `omp-session-<…>.html` en el directorio actual, abre el navegador, **sin redacción ni cifrado**, incluye system
    prompt, descripciones de herramientas y transcripciones de subagentes; `--export` en la CLI; `/dump`; `/share`
    (cifrado AES-256-GCM, clave en el fragmento, `share.redactSecrets`, `my.omp.sh` o gist secreto).
  - `collab.md`: `/collab`, `/collab view`, `/join`, `/leave`; «Possession of the link is the trust boundary»; el
    relay ve solo texto cifrado; `collab.displayName` por defecto = nombre de usuario del sistema; `collab.autoStart`.
  - `stream.md`: `omp stream` emite la pantalla en `live.omp.sh/<usuario>` (cuenta Stencil); `/record` es local;
    `omp clip` sube la grabación como clip público; el chat no se redacta.
  - `config-usage.md` §«Profiles» (`--profile`, `OMP_PROFILE`; sesiones y `agent.db` por perfil); 
    `environment-variables.md`: orden de `$env` (proceso → `.env` del cwd → `.env` del perfil → `~/.omp/.env` →
    `~/.env`, solo para claves sin valor), `OMP_PROFILE`, `PI_CODING_AGENT_DIR` (solo perfil por defecto),
    `PI_NO_TITLE`, `PI_RPC_EMIT_TITLE`, **`PI_BASH_NO_CI`** («Suppresses automatic `CI=true` injection»), `PI_PROXY`,
    `DEEPSEEK_API_KEY` (§1 y `providers.md`), OpenTelemetry (`OTEL_EXPORTER_OTLP_*`, `telemetry.otlpExportEnabled`).
- **Código 18.5.1** (`~/orca/oh-my-pi`, `git show v18.5.1:…`, solo lectura):
  - `modes/print-mode.ts`: cabecera en JSON; todos los eventos de sesión por stdout; el código de salida lo decide el
    `stopReason` final (`error`/`aborted`) en todos los modos (issue #11498); no hay evento `agent_settled`.
  - `extensibility/extensions/wrapper.ts`: `select(…, ["Approve", "Deny"])`; «Tool "…" requires approval but no
    interactive UI available».
  - `slash-commands/builtin-collaboration.ts`: `/export` («Export session to HTML file», rechaza `--copy`), `/trace`
    («Open this session's trace in the stats dashboard», «No session file yet — send a message first.», URL
    `…/#/traces?s=<fichero>`), `/share`, `/join`; `builtin-session.ts`: `/stats` registra un **juez** para la página
    Frustration cuyo coste va a la sesión.
  - `packages/stats` (`README.md`, `server.ts`, `frustration.ts`, `port-conflict.ts`): panel en `127.0.0.1:3847`;
    páginas Overview, Models, Providers, Costs, Requests, Errors, Traces, Tools, Frustration, Projects y Gain; abrir el
    panel no llama a ningún modelo; el juicio de frustración es un POST explícito con cabecera propia; **si ya hay un
    panel compatible en el puerto, se reutiliza**; métricas (tokens/s, tasa y ahorro de caché, errores, latencia,
    TTFT, coste estimado a precio de API, «N/A» para modelos solo de suscripción).
  - `utils/src/dirs.ts`: `getStatsDbPath()` y `getSessionsDir()` cuelgan de la raíz del perfil
    (`~/.omp/profiles/<nombre>/stats.db`).
  - `session/agent-session-types.ts`: `SessionStats` (mensajes, llamadas a herramientas, tokens, `cost`).
  - `prompts/ratchet-kickoff.md` y `prompts/tools/ratchet.md`: una ronda de preguntas con `ask`, tres aprobaciones
    (`inputs`, `grader`, `plan`), reparto train/test congelado, un cambio por ronda, `keep`/`revert`, suelo de ruido
    ≈ `1/sqrt(n_test · reps)`, parada en `plateau` o `done`, estado en `.omp/ratchet/<flujo>/`; sin `ask` no construye
    nada.
  - `examples/sdk/` (01-minimal … 13-sql-sessions).
- **Binario 18.6.1** (`~/.bun/bin/omp`, `grep -a`): «Launch the local stats dashboard», «Open this session's trace in
  the stats dashboard», «Build (or reuse) an eval for an LLM flow, then hillclimb it unattended», `negotiate_protocol`,
  `session_settled`. Changelog 18.5.1–18.6.1: solo un arreglo de `EPIPE` cuando un servidor RPC sale a mitad de una
  escritura (18.6.0); nada cambia lo que cuenta este vídeo.
- `omp --help`, `omp stats --help` (`--port`, `--host`, `--json`, `--summary`) y `omp acp --help` (18.6.1, solo
  ayuda). `bun --version` → 1.3.14. Zed no está instalado en la máquina.
- Vídeos anteriores: 10 (`pi -p`, JSON con `jq`, `scripts/revisar.sh`, red de seguridad con `permisos.ts`, workflow
  `revision-pi.yml` solo como fichero, RPC a mano y `aprobador.mjs`, SDK con `resumen.ts`; «aprobar no es aislar»), 11
  (perfil demo; `PI_CODING_AGENT_DIR` exportado en el pane: sin perfil, omp usaría el directorio de Pi; `archive`), 12
  (título automático: una llamada extra; `--no-title`), 13 (`/btw` no entra en las exportaciones), 14 (**promete**
  `omp -p --advisor` y el advisor en `/stats` para este vídeo; `DEEPSEEK_API_KEY` en omp), 19 (`.omp/config.yml` del
  equipo con `approvalMode: write`, `bash: prompt` y patrones; `-p` falla con lo que pide aprobación; ACP conserva la
  puerta del cliente; `/export` no redacta), 20 (sin `/trust`; lo que carga una carpeta; `skills.enableAgentsUser
  false`; **cierra anunciando este vídeo**).
- Tienda (`~/csn/tienda`, leída): rama `master` limpia, ramas `iva-antes` e `iva-despues`, sin remoto, sin `.omp/`,
  `scripts/` ni `.github/`; `package.json` con `"test": "node --test"`. No existen todavía `~/csn/omp-equipo/` ni el
  perfil `~/.omp/profiles/demo` (se crean al grabar los vídeos 11–20).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que ya sabes y lo que cambia**

En el vídeo diez sacamos Pi de su interfaz. Vimos el modo print para scripts, el modo JSON con todos los eventos, RPC para controlarlo desde otro proceso y el SDK para meterlo en tu programa. Montamos una revisión de rama en un script y la llevamos a integración continua. Todo eso sigue valiendo en oh my pi, porque lo hereda. Hoy no lo vamos a repetir.

La pregunta de este vídeo es la misma que la del veinte: si ya sabes hacerlo con Pi, ¿qué cambia en oh my pi? La respuesta tiene tres partes. Los modos son los mismos, pero con detalles que rompen un script si no los conoces. Hay un quinto camino, ACP, para usar oh my pi dentro de un editor. Y hay piezas que Pi no tiene: un panel local de estadísticas, trazas por sesión y comandos pensados para trabajar en equipo.

Vamos por orden. Primero o eme pe guion p y el modo JSON. Después, la revisión de rama, con una red de seguridad que oh my pi trae de serie. Integración continua. RPC, con su protocolo versión dos. El SDK y ACP. Las métricas, con barra trace, barra stats y barra export. Y para terminar, lo que se explica pero no se enseña: barra ratchet y los comandos que publican.

Trabajamos como siempre: la tienda, el perfil demo y DeepSeek Flash, que para leer y revisar va sobrado y cuesta muy poco. Un detalle nuevo en la terminal: exportamos OMP underscore PROFILE igual a demo, solo en este panel. Así cada omp que lancemos, también los de dentro de un script, usa el perfil demo.

**2 · O eme pe guion p y el modo JSON**

Guion p funciona como en Pi: procesa la petición, escribe la respuesta y sale. Si la entrada llega por una tubería, se usa como contexto. Estamos en una rama de la tienda que sube el umbral del envío gratis de cuarenta a cincuenta euros. Git diff contra la rama base, una tubería, y o eme pe guion p con la petición de revisarlo en tres viñetas.

Primera diferencia. Mientras trabaja, en la salida de errores aparece Working, y el texto no llega poco a poco: sale entero al terminar. Para un script es lo cómodo. Llegan tres viñetas: el cambio está incompleto, porque la documentación sigue diciendo cuarenta; rompe cuatro aserciones en tres pruebas; y una decisión antes de seguir: subir el umbral de verdad o revertirlo. Salida, cero.

Segunda diferencia, y nos la encontramos al preparar este vídeo: las herramientas. En Pi, una revisión de solo lectura usaba read, grep, find y ls. En oh my pi, find ya no existe y nunca existió ls: pedirlas hace que omp se niegue a arrancar. Para leer, read, grep y glob. Si reutilizas un script, revisa esa lista.

Y una promesa del vídeo catorce. Con guion guion advisor activas el revisor solo para esa ejecución. En modo print, al acabar la respuesta, oh my pi espera a que el advisor termine sus revisiones finales, hasta diez minutos. Tenlo en cuenta al poner el tiempo máximo de un trabajo de integración continua.

El modo JSON se pide con guion guion mode json. Guardamos los eventos de una pregunta sencilla, qué ficheros hay en src usando glob, y los miramos con jota cu. La primera línea es la cabecera de la sesión: tipo session, su identificador y la carpeta. Después, el recuento: un inicio y un fin de agente, dos turnos, mensajes, más de doscientas actualizaciones y dos herramientas, glob y read.

Aquí viene la diferencia que más importa: el evento agent settled de Pi no existe. Para saber si la ejecución terminó de verdad, mira el agent end. Trae dos campos: is terminal, que dice si es el final o si después viene algo más, como un reintento, y yielded, que dice si el agente terminó su trabajo. Aquí, los dos a true. Y cada mensaje del asistente cierra con su stop reason, tool use o stop, y con su coste en el uso de tokens.

Según la documentación, en oh my pi una respuesta final que acaba en error o abortada da un código de salida distinto de cero, también en JSON; en Pi no era así. Si reutilizas un script del vídeo diez, revísalo. Lo que no cambia es la otra lección: un cero significa que oh my pi terminó, no que hiciera lo que querías.

**3 · La revisión, con la red de oh my pi**

Con eso montamos la revisión de rama. Se llama revisar o eme pe punto sh y tiene las mismas tres partes que la del vídeo diez. Primero ejecuta npm test y guarda el código, porque lo que se comprueba sin modelo lo comprueba el script. Después le pasa el diff a oh my pi en modo JSON. Al final lee los eventos con jota cu: el stop reason, el informe en Markdown y las herramientas que fallaron.

Lo que cambia está en la línea de oh my pi. Sin sesión y sin título, para no gastar una llamada de más. Guion guion max time, cinco minutos, para que un agente atascado no se quede gastando. Sin extensiones ni skills descubiertas, para que la revisión no dependa de lo que haya en cada máquina. Las herramientas de lectura. Y el modelo, solo si alguien lo fija desde fuera, como hará la integración continua.

Y una opción que es la clave del capítulo: guion guion approval mode always ask. En el vídeo diecinueve vimos que en modo always ask solo pasa sin preguntar lo que lee, y que sin interfaz, lo que necesita aprobación falla. Allí era un problema. Aquí lo convertimos en la red de seguridad. En Pi tuvimos que cargar nuestra extensión de permisos. En oh my pi basta un flag.

¿Cómo sabe el script que algo se ha bloqueado? No lo adivina. Recorre los eventos de fin de herramienta y se queda con los que traen is error a true. Si hay alguno, escribe el aviso, guarda el nombre de la herramienta y el mensaje en un fichero aparte y sigue. Así el informe del modelo y el diagnóstico del script quedan separados, y cada uno se lee por su lado.

Lo ejecutamos contra la rama base. El informe es largo y concreto: la documentación desincronizada, el tramo de cuarenta a cincuenta euros que deja de tener envío gratis, un caso de cupón que nadie prueba, pruebas con nombres que ya mienten, y la última línea, veredicto, cambios. El script sale con uno, el código de npm test. Y git status, limpio.

Ahora la prueba de verdad. Cambiamos una frase de la petición por si encuentras un fallo, corrígelo, y le damos también edit y write. El modelo encuentra el fallo e intenta corregirlo. Las dos herramientas fallan con el mensaje del vídeo diecinueve: requiere aprobación y no hay interfaz. El script avisa de herramientas bloqueadas, git status sigue limpio y el fichero de errores enseña el motivo de cada una.

Fíjate en por qué el flag es imprescindible aquí. Esta rama trae el punto o eme pe barra config punto yml del equipo, el del vídeo diecinueve, con el modo write. En modo write, una edición se aprueba sola. Sin el flag, este mismo script habría cambiado el código sin que nadie se enterase. El flag gana al modo del proyecto.

Pero ojo: las políticas por herramienta del proyecto se siguen aplicando, y un allow para edit la aprobaría igual. Por eso la barrera principal es la lista de herramientas: una herramienta que no está activa no la aprueba ninguna política. Always ask es la segunda red. Y para oh my pi todo ha ido bien: el modelo entiende el rechazo y responde con normalidad. Quien lo detecta es el script, leyendo los eventos.

**4 · Integración continua**

El workflow de GitHub Actions no lo ejecutamos, y casi todo es lo del vídeo diez: permisos de solo lectura, el historial completo para el diff, el script copiado desde la rama base, los tests en un paso sin la clave y el informe subido como artefacto aunque algo falle.

Lo que cambia es la instalación. oh my pi necesita Bun, así que el workflow prepara Bun e instala el paquete de oh my pi con la versión fijada. La clave del modelo llega desde un secreto del repositorio, en DEEPSEEK underscore API underscore KEY, y el script recibe el modelo por una variable. En un runner no hay perfiles: una carpeta temporal como directorio del agente, y oh my pi arranca limpio.

Fíjate también en los tiempos. El trabajo tiene un límite de quince minutos, y el script le da a oh my pi cinco. La diferencia deja margen para instalar, ejecutar los tests y subir el informe. Y oh my pi pone CI igual a true en los comandos que lanza su bash, así que no hace falta ningún ajuste para que sepan que no hay nadie delante.

Y ahora el apunte honesto, que en oh my pi pesa más. oh my pi no tiene barra trust, como vimos en el vídeo veinte. Al arrancar dentro de un pull request, carga su punto o eme pe: la configuración, con sus políticas por herramienta, las reglas, los hooks y los servidores MCP. Los hooks son código que se ejecuta en tu runner, con tu clave en el entorno.

Por eso, en integración continua: la clave solo en el paso que la necesita, los flags en el script de la rama base, herramientas de lectura, y oh my pi dentro de un contenedor, como en el vídeo cinco. Aprobar no es aislar, y en oh my pi tampoco lo es un flag.

**5 · RPC, versión dos**

RPC es el modo para hablar con oh my pi desde otro programa, línea a línea por la entrada y la salida estándar. La idea es la del vídeo diez, pero el protocolo ha crecido. Lo arrancamos a mano, sin sesión y con las herramientas de lectura.

Lo primero que llega, sin escribir nada, es una línea de tipo ready. Anuncia que habla las versiones uno y dos del protocolo y el tamaño máximo de cada línea, un megabyte. Le pedimos la versión dos con negotiate protocol, y responde success true. Desde ese momento, un mensaje más grande que el límite llega troceado en varias líneas que tu cliente vuelve a juntar, en lugar de recortarse.

Mandamos un prompt con un identificador: en una frase, qué hace carrito punto js. Detrás, el chorro de eventos. Y al final, dos líneas nuevas. Prompt result, con el mismo identificador, dice cómo terminó esa petición: completed. Y session settled dice que ya no queda nada pendiente. Para enseñar la respuesta espera al primero. Para cerrar o reciclar el proceso, al segundo.

Y pedimos get session stats: mensajes, llamadas a herramientas, tokens y coste de la sesión. Aquí, una lectura, unos ocho mil tokens y menos de una décima de céntimo. Control d, y oh my pi se apaga de forma ordenada.

Ahora el cliente. En el vídeo diez escribimos uno que contestaba los diálogos de nuestra extensión de permisos. Este es el mismo esqueleto, pero contesta los diálogos de aprobación de oh my pi. Espera a ready, manda la petición, escribe el texto y las herramientas, y cuando llega una petición de tipo select, pregunta en la terminal y responde Approve o Deny. Al final pide las estadísticas y las escribe en una línea.

Lo lanzamos en la tienda, con la configuración del equipo del vídeo diecinueve, y le pedimos lo mismo que allí falló con guion p: ejecuta node guion guion version. Bash pregunta, y esta vez la pregunta viaja por el protocolo hasta nuestro programa: allow tool, bash, con el comando completo. El modelo ha encadenado, además, git status y git log, como pide el AGENTS punto md. Leemos y aprobamos.

Llega la respuesta: Node veinticinco, el árbol limpio y el último commit. Debajo, nuestra línea: una herramienta, unos diecisiete mil tokens y un coste de una décima de céntimo. La decisión sigue siendo de oh my pi y de su configuración; dónde se pregunta lo decide el cliente: una web, un bot del equipo o un editor.

Tres novedades más, en una diapositiva. Tu cliente puede ofrecer herramientas propias al modelo con set host tools. El título automático viene apagado en RPC, para no gastar una llamada. Y no tienes que escribir el cliente: hay clientes oficiales en TypeScript, Python, Rust y Go que negocian la versión dos y juntan los trozos por ti.

**6 · El SDK y ACP**

El SDK es la vía sin protocolo: importas create agent session y hablas con la sesión desde tu código. En oh my pi hay una diferencia de base: no es Node, es Bun. El paquete se instala con bun add, en la misma versión que tu binario.

Este es resumen punto ts, el mismo del vídeo diez traducido. Directorio de trabajo, sesión en memoria y una lista de herramientas de lectura. Y aquí está la trampa: en oh my pi, tool names no es una lista blanca. Pide esas herramientas, pero no quita las demás. Para que sean las únicas hay que añadir restrict tool names a true. Al final, dispose, con await, porque el cierre es asíncrono.

Lo ejecutamos con bun contra la tienda. Por la salida de errores, el nombre de cada herramienta que usa: glob y read. Por la estándar, la lista de funciones exportadas, con su fichero. Y un detalle que nos sorprendió: el modelo dice que su carpeta de trabajo es la del script, no la tienda que le pasamos, y aun así encuentra los ficheros. Si tu programa depende de la carpeta, compruébalo con tu versión.

El perfil importa aquí más que en ningún sitio: el SDK lee OMP underscore PROFILE, y sin él usaría el directorio de tu agente de verdad, con tus credenciales, tus ajustes y tus sesiones. ¿SDK o RPC? Si tu programa ya corre en Bun y quieres acceso a todo, el SDK. Si es de otro lenguaje, o prefieres que oh my pi viva en su propio proceso, RPC.

Y el quinto camino, ACP, el Agent Client Protocol. El editor lanza o eme pe acp como un proceso hijo y pone la interfaz: hilos, ficheros, terminales y permisos. oh my pi pone los modelos, las credenciales, los ajustes, las skills y las extensiones. En Zed se configura en una entrada de agent servers, con el comando omp y los argumentos acp; nosotros añadiríamos el perfil demo delante. Y el editor añade su propia puerta de permisos antes de ejecutar comandos.

**7 · Métricas: barra trace, barra stats y barra export**

Hasta aquí, cuánto ha costado una ejecución lo sabíamos por el pie, o leyendo los eventos. oh my pi tiene un panel para todas las sesiones. Abrimos oh my pi en la tienda, con una sesión guardada, y le hacemos una pregunta corta: qué cubre test barra envio punto test punto js, sin cambiar nada.

Un aviso antes de seguir: barra trace y barra stats abren tu navegador predeterminado. Si grabas o compartes pantalla, ese navegador enseña tus cuentas y tus pestañas. En este vídeo lo abrimos en un navegador limpio, sin ninguna sesión iniciada.

Barra trace imprime el enlace y abre la traza de esta sesión. Arriba, los números: casi ocho minutos de reloj, quince segundos de modelo, más de diez minutos de herramientas, cinco peticiones y tres décimas de céntimo. Debajo, la línea de tiempo, y en ella se ve por qué: dos barras largas de bash.

Esas barras son el tiempo que bash esperó a que aprobáramos, porque la tienda tiene la configuración del equipo con bash en prompt. Es la pregunta que responde una traza: si una sesión se te hace lenta, aquí sabes si el problema es el modelo, una herramienta que tarda o una aprobación que nadie contestó. Debajo, la transcripción, con cada llamada al modelo y cada herramienta en orden.

Barra stats abre el mismo panel completo, en un servidor local, en el puerto tres mil ochocientos cuarenta y siete. Lee las sesiones del perfil y las resume. La portada da peticiones, coste, tokens y la tasa de caché, aquí más del setenta por ciento, de la que hablamos en los vídeos cuatro y catorce. Hay páginas para modelos, costes, peticiones, herramientas y proyectos.

En modelos, cuánto trabajó cada uno y a qué velocidad. En peticiones, el registro de cada llamada, con su coste y su duración. En herramientas, cuántas veces se usó cada una y cuántas fallaron. Y un matiz sobre el coste: es una estimación a precio de API. Si usas un modelo por suscripción, el panel calcula lo que costaría con su tarifa pública. No es tu factura.

Ahora, por qué lo hacemos en el perfil demo. El panel enseña rutas de proyectos, modelos, costes y la traza completa de cada sesión. Con tu perfil de trabajo, eso es todo lo que has hecho, incluidos los modelos que usas en local. Con el perfil demo, solo la tienda. Y si ya hay un panel abierto en ese puerto, oh my pi lo reutiliza: antes de compartir pantalla, comprueba que no tienes abierto el de otro perfil.

Hay una página que no abrimos: frustración. Busca en tus mensajes señales de enfado con el agente y, si se lo pides con un botón, manda tus mensajes a un modelo juez. Ese juicio gasta modelo. Abrir el panel no cuesta nada, pero ese botón sí. Desde la terminal tienes lo mismo sin navegador: o eme pe stats con guion guion summary, el resumen por modelo y por carpeta, o con guion guion json para un script.

Lo probamos al final de la grabación. O eme pe stats guion guion summary escribe una tabla corta: por cada modelo, las peticiones, los tokens y el coste; y por cada carpeta, lo mismo. Sin navegador, sin puerto abierto y sin rutas de más en pantalla. Para un informe semanal del equipo es justo lo que necesitas, y con guion guion json lo lees desde un script.

Por último, barra export. Le damos una ruta en una carpeta temporal, porque por defecto la deja en el directorio actual, dentro del repositorio, y responde session exported. Es una página con la conversación y las herramientas y, al principio, el system prompt y la lista de herramientas disponibles. La exportación no redacta secretos: ahí va tu AGENTS punto md, tus rutas y todo lo que salió en la conversación. Revísala antes de enviarla a nadie.

**8 · Equipo: barra ratchet y lo que publica**

Queda una pieza que solo vamos a explicar, porque gasta mucho: barra ratchet. Sirve para mejorar un flujo que usa un modelo, por ejemplo el prompt que clasifica las incidencias de tu aplicación, con datos en lugar de intuición.

Funciona en dos tiempos. Primero construye una evaluación: lee tu código, te pregunta qué flujo, qué casos y qué objetivo, y te pide tres aprobaciones: los casos, el evaluador y el plan. Reparte los casos en dos grupos y congela el reparto. Con uno trabaja; el otro queda reservado y el agente nunca lo ve. Después, en cada ronda, propone un solo cambio y lo mantiene solo si mejora en los casos reservados.

Dos ideas de barra ratchet valen aunque no lo uses nunca. Antes de dar por buena una mejora, calcula el ruido: con pocos casos, una diferencia de diez puntos puede ser casualidad. Y un cambio solo cuenta si mejora en casos que el agente no ha visto. Medir antes de cambiar es justo el espíritu del bloque que viene.

Y los comandos de equipo que publican. Barra share sube una instantánea cifrada de la sesión y te da un enlace con la clave dentro. Barra collab comparte la sesión en directo: quien entra con barra join la ve y, con el enlace completo, puede escribirle al agente que corre en tu máquina. O eme pe stream emite tu pantalla en una página pública. Ninguno se enseña en este curso: lo que sale de tu máquina se explica, no se enseña. Y en barra collab, quien tiene el enlace tiene el acceso.

**9 · Repaso, práctica y cierre**

Repasemos. O eme pe guion p escribe la respuesta al final, con Working por la salida de errores. El modo JSON no tiene agent settled: mira is terminal y yielded en el agent end. Las herramientas de lectura en oh my pi son read, grep y glob. Un script desatendido lleva su política en flags: herramientas de lectura, tiempo máximo y always ask, porque la configuración del proyecto puede decir write.

RPC empieza con ready, negocia la versión dos y cierra cada petición con prompt result y session settled; los diálogos de aprobación viajan hasta tu cliente. El SDK corre en Bun y necesita restrict tool names para limitar de verdad las herramientas. ACP lleva oh my pi a un editor. Barra trace y barra stats miden, en el perfil demo y en un navegador limpio. Barra export no redacta. Y barra ratchet mide antes de cambiar.

La práctica: adapta a oh my pi el revisar punto sh del vídeo diez. Cambia las herramientas, añade always ask y comprueba, pidiéndole que corrija, que la edición se rechaza. Después ejecútalo sin guion guion no session un par de veces, abre barra stats en tu perfil de pruebas y busca en la traza cuánto tiempo fue del modelo y cuánto de las herramientas.

Con este vídeo cerramos el bloque de oh my pi. En el próximo empieza el último bloque, el de metodología: diseñar tu harness. Veremos las taxonomías del harness engineering, la importancia de un juego pequeño de herramientas, los límites centralizados y la separación entre el anfitrión y el sandbox. Y lo mediremos, como hoy. Nos vemos allí.

</details>

