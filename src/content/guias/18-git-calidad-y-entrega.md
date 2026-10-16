---
title: "Vídeo 18 · Git, calidad y entrega"
description: "Revisar, preparar y hacer commits desde omp, trabajar en worktrees y pasar el código por revisión automática antes de entregarlo."
ruta: "pi-oh-my-pi"
orden: 18
duracion: "25 min"
video: "18-git-calidad-y-entrega.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/18-git-calidad-y-entrega.es.vtt"
---

Revisar, preparar y hacer commits desde omp, trabajar en worktrees y pasar el código por revisión automática antes de entregarlo.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Cerrar el ciclo del cambio

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **La idea del vídeo:** Las herramientas proponen; tú decides — Y algunas hacen más de lo que su nombre sugiere.
- **El montaje**
  - `V4 Pro` · Conversación
  - `Flash` · Rol smol: mensajes de commit
  - `demo-18` · Rama de usar y tirar
  - `sin remoto` · Nada sale
- *En terminal:* Rama demo-18 · sin commitear (más abajo, en «Código y comandos»)
- *En la demo:* git status · git log
- *En la demo:* /security
- *En la demo:* review · bundled

### 2 · /review: una revisión con método

<p><button type="button" class="ir-a" data-t="176">▶ Ir a 2:56</button></p>

- *En la demo:* Review Mode
- *En la demo:* 4: con gh y tu cuenta · 2: sin commitear
- **El diff congelado:** Lee (el diff) → Lo congela (en el mensaje) → Tabla (de ficheros) → Sin ruido (locks, generado)
- *En la demo:* task · 1 agente
- *En la demo:* El encargo al reviewer
- *En la demo:* ReviewTiendaChanges · 38,2 s · $0.01
- *En la demo:* Pro comprueba antes de contarlo
- *En la demo:* Bloqueante: el umbral con IVA
- *En la demo:* Menores · y pregunta
- **Vídeo 16:** El reviewer tiene bash — «Solo lectura» es una instrucción, no un permiso. Con yolo nada lo para.

### 3 · Arreglar y mirar el diff con /git

<p><button type="button" class="ir-a" data-t="457">▶ Ir a 7:37</button></p>

- *En terminal:* La petición (más abajo, en «Código y comandos»)
- *En la demo:* edit · edit · npm test
- *En la demo:* «Antes habría dado 45.35»
- **Vídeo 24:** La revisión señala las pruebas — No las sustituye.
- *En la demo:* /git
- *En la demo:* ? · hoja de atajos
- *En la demo:* Stage
- *En la demo:* Unstaged README.md
- *En la demo:* x · Supr · q

### 4 · omp commit en modo de prueba

<p><button type="button" class="ir-a" data-t="609">▶ Ir a 10:09</button></p>

- *En la demo:* omp --profile demo commit --dry-run
- *En la demo:* Modelo · changelogs · contexto
- *En la demo:* El agente de commit
- *En la demo:* Presente → pasado
- *En terminal:* Conventional commits (validado) (más abajo, en «Código y comandos»)
- *En la demo:* Generated commit message
- *En terminal:* omp commit (sin --dry-run, diapositiva) (más abajo, en «Código y comandos»)

### 5 · El commit desde /git

<p><button type="button" class="ir-a" data-t="779">▶ Ir a 12:59</button></p>

- *En la demo:* c · compositor
- *En la demo:* «empty: generate one»
- *En terminal:* Nuestro mensaje (más abajo, en «Código y comandos»)
- *En la demo:* Created commit
- *En la demo:* git log --oneline -2
- *En la demo:* Amend · Stage all & commit

### 6 · /wt: la sesión a un worktree

<p><button type="button" class="ir-a" data-t="888">▶ Ir a 14:48</button></p>

- **Nos queda:** El README — En otra rama, sin perder la conversación.
- *En la demo:* /wt demo-18-wt
- *En la demo:* ~/.omp/profiles/demo/wt/…
- *En la demo:* /git en el worktree
- *En la demo:* Stage all & commit
- *En la demo:* En la carpeta original
- **Cuidado:** worktree.cleanSource — Limpia el origen con reset --hard y clean. Déjalo apagado.

### 7 · Auto-QA y omp grievances

<p><button type="button" class="ir-a" data-t="1055">▶ Ir a 17:35</button></p>

- **Auto-QA:** No revisa tu código — Es un buzón de quejas del modelo sobre las herramientas.
- *En terminal:* Auto-QA (lo escribe el modelo) (más abajo, en «Código y comandos»)
- **Texto libre:** La queja la escribe el modelo — Puede citar una ruta o un comando. En el perfil demo, denegado de antemano.
- *En la demo:* config get dev.autoqa · dev.autoqaConsent
- *En la demo:* omp grievances --help
- *En la demo:* omp --profile demo grievances

### 8 · /security y los límites

<p><button type="button" class="ir-a" data-t="1218">▶ Ir a 20:18</button></p>

- **Por qué no lo activamos**
  - `OAuth` · Exige cuenta: o Bedrock
  - `coste` · Mucho modelo
  - `cloud` · Codex Security: fuera de tu máquina
- **Diseño:** Un plan inmutable — Lo revisado es exactamente lo que pediste. Como el diff congelado.
- **Límite 5 · el de siempre:** Solo lectura no es una barrera — El reviewer tiene bash y el modo yolo no pregunta.
- *En la demo:* Revisión y arreglo: $0.01

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1380">▶ Ir a 23:00</button></p>

- **Lo demás**
  - `Auto-QA` · Quejas sobre herramientas: con consentimiento
  - `/security` · Apagado: exige OAuth
- **Vídeo 19:** De instrucciones a límites — Aprobaciones, patrones de bash, TTSR, hooks y secretos.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Rama demo-18 · sin commitear

```text
// src/envio.js
export function envioUrgente(subtotal) { … gastosEnvio(subtotal) + 3 … }
// src/carrito.js · totalUrgente
const envio = envioUrgente(aplicarIVA(totalCupon, tipoIVA));   // ✗ con IVA
```

- `envioUrgente`: +3 €
- `aplicarIVA`: El fallo
- `npm test`: Pasa

### La petición

```text
Arregla el hallazgo de totalUrgente para que el envío se calcule sin IVA,
como en totalConEnvio, y añade la prueba del carrito de 35 euros
que lo habría detectado. Ejecuta npm test.
No hagas commit ni toques el README.
```

- `sin IVA`: El arreglo
- `35 €`: La prueba
- `README`: Fuera

### Conventional commits (validado)

```text
feat(envio): added urgent shipping total calculation
tipo: feat · ámbito: envio · verbo en pasado
en inglés · 72 caracteres como mucho
```

- `feat`: Tipo
- `(envio)`: Ámbito
- `added`: Pasado

### omp commit (sin --dry-run, diapositiva)

```text
omp --profile demo commit                  # crea el commit (y el CHANGELOG si hay)
omp --profile demo commit --no-changelog   # no toca el CHANGELOG
omp --profile demo commit --push           # publica ⚠
```

- `commit`: Crea
- `--no-changelog`: Sin changelog
- `--push`: Publica

### Nuestro mensaje

```text
tienda: añade el envío urgente

El envío urgente suma 3 € y se calcula sin IVA, como el normal.
```

- `Resumen`: tienda:
- `Descripción`: Una línea
- `Commit`: Created commit

### Auto-QA (lo escribe el modelo)

```text
write xd://report_issue
  tool: <herramienta>
  report: «no hace lo que dice su descripción»
```

- `Desajuste`: Herramienta
- `xd://`: Dispositivo
- `omp`: Para sus autores

## Fuentes

- Documentación instalada de omp 18.6.1 (`omp read omp://…`; la copia de la documentación de omp (omp.sh)
  coincide en lo citado):
  - `cli-reference.md`: tabla de subcomandos (`commit`: «Generate a commit message and update changelogs»; `git`:
    «Interactive fullscreen git UI: split diff viewer, staging sidebar, and commit composer»; `grievances`: «View, clean,
    or push reported tool issues (auto-QA grievances)»; `worktree`, `wt`); `--profile` se aplica antes de enrutar el
    subcomando, así que también afecta a `config`, `commit`…
  - `settings.md`: `PI_AUTO_QA` → `dev.autoqa`; roles de chat (`commit` entre ellos); el catálogo detallado de ajustes
    de 18.6.1 no lista `git.*`, `worktree.*`, `commit.*` ni `security.*` (solo los nombra en «Execution and content»):
    sus valores por defecto salen del esquema embebido (ver [bin]).
  - `tools/security_scan.md`: `security.enabled` `false`; herramienta `exec`; `preflight` exige repositorio git,
    modelo activo y **credencial OAuth** guardada (o Bedrock); «Ordinary API-key-only providers are not accepted»;
    plan inmutable con huella («Security scan plan is stale… Run security preflight again»); fases `queued → preparing
    → reviewing → publishing → completed`; sesión restringida con solo `security-reviewer`; acciones `cloud_*` contra
    Codex Security de ChatGPT («never a fallback»).
  - `secrets.md`: la redacción de secretos viene **desactivada** (`secrets.enabled`); se cita solo para el apunte de
    que el diff viaja entero al proveedor (el tema es del 19).
  - `slash-command-internals.md` §«Name-collision» y publicación de comandos: built-ins, skills, extensiones, comandos
    TypeScript/MCP (aquí está el `/review` incluido) y después los comandos de fichero, **primero gana**.
- Web: https://omp.sh/docs/review (cuatro opciones del menú, P0–P3, confianza, veredicto «correct»/«incorrect»,
  «Correct means no correctness bugs or blockers were established», hasta 16 porciones en paralelo, «intentionally
  read-only», excluye ficheros de bloqueo, minificados y generados) y https://omp.sh/docs/commit (con el índice vacío
  «behaves like `git add -A`»; `--dry-run` «may automatically stage all changes… stage the intended files yourself
  first»; resumen en pasado, 72 caracteres; rol `commit`; changelog en «unreleased»; *split* con confirmación).
- `omp commit --help`, `omp git --help`, `omp worktree --help`, `omp grievances --help` (18.6.1, ejecutados; solo
  ayuda).
- **Código 18.5.1** (`~/orca/oh-my-pi`, `git show v18.5.1:…`, solo lectura). **Ojo:** el paquete global de bun
  (`~/.bun/install/global/node_modules/@oh-my-pi/pi-coding-agent`) es **17.4.1**, no la versión instalada; no se cita.
  - `commit/agentic/index.ts`: «No staged changes detected, staging all changes...» **también con `--dry-run`**;
    pasos «● Resolving model...», «● Detecting changelog targets...», «● Discovering context files...» (lista
    `AGENTS.md`/`CLAUDE.md`), «● Starting commit agent...», «Generated commit message:»; *split* con «Split commit plan
    (dry run):» y confirmación `y/yes` fuera del *dry-run*; `--push` con `pushOrAbort`.
  - `commit/model-selection.ts`: modelo = `--model` o roles `commit` → `smol` → resto de roles de chat.
  - `commit/agentic/prompts/system.md` y `agentic/validation.ts`: herramientas `git_overview`, `git_file_diff`,
    `git_hunk`, `recent_commits`, `analyze_files` (subagentes `sonic`), `propose_changelog`, `propose_commit`,
    `split_commit`; «Summary line: past-tense verb, ≤ 72 chars»; error «Summary must start with a past-tense verb».
  - `commit/changelog/detect.ts`: busca el `CHANGELOG.md` más cercano a cada fichero preparado.
  - `extensibility/custom-commands/bundled/review/*` y `prompts/review-request.md`: menú «Review Mode» (PR citadas en
    la conversación, «1. Review against a base branch (PR Style)», «2. Review uncommitted changes», «3. Review a
    specific commit», «4. Review a specific PR» con `gh pr list`, «5. Custom review instructions» solo sin argumentos);
    el diff se congela en el prompt; «Use the `task` tool with `agent: "reviewer"`»; número de revisores por tamaño
    (1 si menos de 100 líneas o hasta 2 ficheros… hasta 16).
  - `prompts/agents/reviewer.md`: `tools: read, find, grep, glob, bash, lsp, web_search, ast_grep`, `spawns: scout`,
    `model: "@slow"`; «Bash read-only: git diff, git log, git show… NEVER edit files or trigger builds» (instrucción,
    no barrera); criterios (impacto demostrable, accionable, no intencionado, introducido en el parche…); P0–P3.
  - `session/session-worktree.ts`: rama por defecto `wt/AAAAMMDD-hhmmss`; carpeta bajo `~/.omp/wt`; `keepChanges:
    true`; `worktree.cleanSource` hace `reset --hard` y `clean` en el origen; «Moved to worktree … on branch …
    (…, uncommitted changes carried over).»
  - `tools/report-tool-issue.ts`, `cli/grievances-cli.ts`, `prompts/system/system-prompt.md`: Auto-QA = el modelo
    escribe `<herramienta>: <descripción>` en `xd://report_issue` cuando una herramienta no se comporta como dice;
    nada se graba hasta el consentimiento; con «Yes» se graba en `autoqa.db` **y se envía solo** a
    `dev.autoqaPush.endpoint`; con «No» se apaga; `autoqa.db` en `~/.omp/` (raíz, no perfil).
  - `cli/git-tui/ai-stage.ts`: «Stage by description» juzga cada hunk con el rol `judge`.
- **Binario de omp 18.6.1** (`strings ~/.bun/bin/omp`, que lleva el código fuente empaquetado):
  - `/git`: «Open the git UI (split diff viewer, staging, commit composer)», `[revision]`, abre `showGitTui`. Hoja de
    atajos (`?`): Move (`↑↓`, `←→`, `Enter`, `Tab`, `]`/`[`, `Alt+↑↓`, `g`/`G`), Stage (`espacio`, `s`/`u`,
    `Shift+↑↓`, `x` y `Supr` descartan «press twice»), View (`v`, `1`–`4` «File, split, inline or hunk view», `w`,
    `b`, `t`, `r`), Commit (`c` «Write the commit message (empty: generate one)», `Esc`, `q`). Botones «Stage all»,
    «Stage by description» («What should we stage?»), «Unstage all», «Generate message», «Stage all & commit»,
    «Commit the staged changes», «Amend the previous commit». Avisos «Created commit», «Amended commit», «Generating
    commit message…», «Staged all changes and generated commit message», «Generated message needs review: …»,
    «Discard changes to …? Press Supr again to confirm». Con el resumen y la descripción vacíos, el botón de commit
    **genera** en lugar de commitear; si no hay nada preparado, `stageAll`.
  - `/wt` (alias `/worktree`): «Move this session into a new worktree, changes included», `[<branch>]`, «Creating
    worktree on …», «Worktree creation failed: …», «Branch '…' already exists; pick another name.», «Wait for the
    current response to finish or abort it before creating a worktree.».
  - `/review`: «Launch interactive code review»; tarjeta del revisor «Patch is <correct|incorrect> … (NN%
    confidence)», resumen y hallazgos `[P]` título `fichero:línea` (tres plegados, todos al desplegar).
  - `/security`: «Plan, run, inspect, import, and compare OMP-native security scans»; subcomandos `plan`, `scan`,
    `status`, `cancel`, `scans`, `show`, `import`, `export`, `validate`, `compare`, `disposition`; con el ajuste
    apagado: «Security is disabled. Enable security.enabled before using /security.».
  - Auto-QA: descripción del ajuste «On by default; the first report asks for consent, and denying it disables
    reporting until re-enabled explicitly»; endpoint por defecto `https://qa.omp.sh/v1/grievances`; diez textos de
    consentimiento («Your agent drafted a strongly worded letter to one of its tools… Mail it to the devs?»); «No
    grievances recorded yet.».
  - Valores por defecto (esquema embebido): `git.enabled` `true`, `worktree.clone` `true`, `worktree.cleanSource`
    `false`, `security.enabled` `false`, `github.enabled` `false`, `dev.autoqa` `true`, `dev.autoqaConsent` `unset`,
    `commit.mapReduceThreshold` 5000.
  - Changelog 18.5.1–18.6.1: nada nuevo en `/git`, `/review` ni `/wt`; «Fixed `omp commit` never closing its
    credential store»; `omp worktree add` ejecuta el hook `post-checkout` (18.5.1).
- Vídeos anteriores: 06 (template `/review` de Pi: Markdown, foco opcional, tres viñetas, mismo modelo), 11 (el
  template del 06 no se traslada; «oh my pi ya trae su propio barra review»), 12 (`/move`), 14 (rol `commit`; `slow`
  sin asignar hereda `default`), 15 (no se puede mover a un worktree en vibe), 16 (agente `reviewer` con `bash`;
  `/agents`), 17 (cierre que anuncia este vídeo; `pr://` solo en diapositiva; la tienda no tiene remoto).
- Tienda (`~/csn/tienda`, leída): ramas `master`, `iva-antes`, `iva-despues`; sin remoto; sin `CHANGELOG.md`;
  `AGENTS.md` dice «Mensajes de commit en español y en imperativo, empezando por `tienda:`».

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Cerrar el ciclo del cambio**

Hasta ahora hemos hecho cambios. Los hemos planificado, repartido entre agentes y verificado con el servidor de lenguaje y el depurador. Pero un cambio no está terminado cuando pasan los tests. Está terminado cuando alguien lo ha revisado, cuando sabes exactamente qué entra en el commit y cuando el mensaje cuenta lo que pasó. Hoy cerramos ese ciclo.

oh my pi trae de serie varias piezas para eso. Barra review, una revisión de código con un método. Barra git, una interfaz de git a pantalla completa, con el diff, el staging y el compositor de commits. O eme pe commit, que genera el mensaje por ti. Barra uve doble te, que lleva tu sesión a un worktree. Y dos más que conviene entender aunque no las usemos a fondo: Auto QA, con o eme pe grievances, y barra security.

Una idea va a atravesar el vídeo. Las herramientas proponen; tú decides qué entra en la historia del repositorio. Y algunas hacen más de lo que su nombre sugiere: un modo de prueba que puede preparar ficheros, un consentimiento que envía datos a un servidor, una opción que publica. Iremos señalando cada caso.

DeepSeek V cuatro Pro lleva la conversación, y Flash vuelve al rol smol, que es el que usarán los mensajes de commit. Como en los dos vídeos anteriores, trabajamos en una rama de usar y tirar, demo dieciocho. La tienda no tiene remoto, así que nada de lo que hagamos hoy sale de la máquina.

En esa rama hemos dejado preparado, sin commitear, un cambio pequeño: un envío urgente que suma tres euros al envío normal, con una función en envio punto js, otra en carrito punto js y sus pruebas. Y un detalle, con toda la intención: hemos sembrado un fallo. La función del carrito calcula el envío sobre el total con IVA, al revés que el resto de la tienda. Los tests pasan igualmente. Veremos si la revisión lo encuentra.

Además hay una línea nueva en el README, que dice que hace falta Node veinte o posterior, y que no tiene nada que ver con el envío. Es lo que pasa en la vida real: el árbol de trabajo mezcla cosas, y parte del oficio es separar lo que va en cada commit. En el otro panel, git status lo confirma: cinco ficheros modificados.

Antes de empezar, un vistazo gratis. Ejecutamos barra security, y responde que la seguridad está desactivada y que hay que activar el ajuste security punto enabled. Volveremos a eso al final. Escribimos barra re, y en el menú aparece review, que lanza la revisión interactiva y lleva la etiqueta de incluido, porque viene con el programa. En la barra de estado, la rama demo dieciocho, con un asterisco y un cinco: cinco ficheros cambiados.

**2 · Barra review: una revisión con método**

Empezamos por revisar. Recuerda el vídeo seis: en Pi escribimos un template barra review, un fichero Markdown con unas pocas instrucciones, que el mismo modelo de la conversación seguía al pie de la letra. Funcionaba, y era nuestro. El barra review de oh my pi es otra cosa: un comando escrito en TypeScript que viene con el programa y que no se limita a enviar un prompt.

Lo ejecutamos. Aparece un menú, review mode, con cinco opciones. Revisar contra una rama base, como en una pull request. Revisar los cambios sin commitear. Revisar un commit concreto. Revisar una pull request concreta. Y unas instrucciones a medida, para cuando quieres decir tú qué mirar.

La opción de las pull requests usa el cliente gh con tu cuenta para listar las abiertas del repositorio. La tienda no tiene remoto y no vamos a enseñar cuentas, así que se queda en la diapositiva. Elegimos la segunda: revisar los cambios sin commitear.

Aquí está la primera diferencia con nuestro template. Barra review lee el diff una vez y lo congela dentro del mensaje: una tabla con los ficheros, las líneas añadidas y quitadas, y el diff completo. El modelo no tiene que adivinar qué revisar, y si el árbol cambia mientras tanto, la revisión sigue siendo sobre lo que había al pedirla. Los ficheros que no aportan, como los de bloqueo de dependencias o el código generado, quedan fuera.

La segunda diferencia: el mensaje le dice al modelo que no revise él. Le pide que reparta el trabajo con la herramienta task entre agentes reviewer, los del vídeo dieciséis. Cuántos depende del tamaño del diff: con uno pequeño, como el nuestro, uno solo; con diffs enormes, hasta dieciséis en paralelo. Pro lanza la tarea. El primer intento falla porque le falta un campo obligatorio, el contexto, y lo repite.

Merece la pena leer el encargo. Un objetivo, revisar los cambios sin commitear. Unas restricciones: solo los cinco ficheros y el diff que ya tiene. Y el contrato del repositorio, sacado del AGENTS punto md, con los importes a céntimos y los commits en español. Es la regla del vídeo dieciséis: cada encargo se explica solo.

El agente reviewer trae además sus propias reglas. Solo debe informar de fallos con impacto demostrable, que se puedan arreglar de forma concreta, que no parezcan intencionados y que haya introducido el parche, no los que ya estaban. Es una forma de evitar las revisiones que llenan la pantalla de sugerencias de estilo.

¿Con qué modelo revisa? El reviewer pide el rol slow, y como no lo hemos asignado, hereda el modelo por defecto, Pro, como vimos en el vídeo catorce. Tarda treinta y ocho segundos, cuesta un céntimo y devuelve su resultado con forma fija: unos hallazgos y un veredicto. Aquí, changes requested: hay que cambiar algo antes de entregarlo.

Lo interesante viene después. Pro no se fía sin más: lee carrito punto js y envio punto js para comprobar el hallazgo principal, y lo confirma. Total urgente evalúa el umbral del envío gratis con IVA, mientras que total con envío lo hace sin IVA, como dice su propio comentario. Es justo el fallo que habíamos sembrado.

Y lo explica con un ejemplo que se entiende. Un carrito de treinta y cinco euros sin IVA pasa a cuarenta y dos con treinta y cinco con IVA, supera el umbral de cuarenta, y el envío urgente cobra solo los tres euros del suplemento. Lo coherente sería cuatro con noventa y cinco más tres: siete con noventa y cinco. Incluso propone el código corregido.

Después vienen tres hallazgos menores. Que aplicar IVA se calcula dos veces. Que falta una prueba en el límite, precisamente con ese carrito de treinta y cinco euros. Y que la línea del README sobre Node veinte no está respaldada por nada del repositorio. Fíjate: la revisión mira todos los cambios sin commitear, también los que no tienen que ver. Y al final pregunta si aplica el arreglo; no toca nada sin permiso.

Un apunte honesto sobre el reviewer. Entre sus herramientas está bash, como ya dijimos en el vídeo dieciséis. Sus instrucciones le dicen que solo ejecute comandos de lectura, como git diff o git log, y que no edite nada. Pero eso es una instrucción, no un permiso. Con el modo yolo, nada lo impediría. Cómo convertir instrucciones en límites reales es el tema del vídeo diecinueve.

Y si vienes de Pi con tu template: si copias tu review punto md a los comandos de oh my pi, el incluido tiene prioridad y el tuyo quedará tapado. Ponle otro nombre. El template es ligero y lo controlas tú; el comando incluido es más pesado, pero da hallazgos con forma y método.

**3 · Arreglar y mirar el diff con barra git**

Con el hallazgo delante, le pedimos a Pro que lo arregle: que calcule el envío sin IVA, como en total con envío, que añada la prueba del carrito de treinta y cinco euros, que ejecute npm test, y que no haga commit ni toque el README. Edita el carrito, con tres líneas nuevas y dos quitadas, añade la prueba, y los dieciocho tests pasan.

Fíjate en lo que cuenta al final: con el código viejo, esa prueba habría dado cuarenta y cinco con treinta y cinco en lugar de cincuenta con treinta. La prueba nueva es la que habría hecho visible el fallo desde el principio. La revisión no sustituye a las pruebas; las señala. Volveremos a esta idea, con más calma, en el vídeo veinticuatro.

Ahora toca mirar qué hemos cambiado antes de commitear. Escribimos barra git. Se abre una interfaz a pantalla completa, la misma que obtienes con o eme pe git desde la terminal. A la derecha, la barra lateral con dos secciones: los cambios sin preparar, que son cinco, y los preparados, que de momento no hay. A la izquierda, el diff, partido en dos columnas.

Con las flechas nos movemos por los ficheros, y con Enter abrimos uno en el diff. Con las teclas del uno al cuatro cambiamos la vista: fichero completo, partida, en línea o por hunks. La tecla uve doble ajusta las líneas largas y la be ignora los espacios. Y con la interrogación aparece la hoja de atajos completa.

Preparar es igual de directo. La barra espaciadora prepara o quita la fila en la que estás. Dentro del diff, la tecla ese prepara el hunk en el que estás y la tecla u lo quita, y con mayúsculas y las flechas puedes seleccionar líneas sueltas. Es el git add por partes de toda la vida, pero viendo exactamente lo que añades.

Y aquí nos pasó algo que conviene contar. Pulsamos la barra espaciadora con el cursor sobre la cabecera de la sección, no sobre un fichero, y preparó los cinco, README incluido. Lo arreglamos sin salir: con el tabulador pasamos al diff, avanzamos hasta el README y, con la tecla u, quitamos su hunk. Aparece el aviso de que el README ya no está preparado. Quedan cuatro preparados y el README fuera.

Cuidado con otras dos teclas. La tecla equis descarta el hunk o las líneas seleccionadas, y la tecla suprimir descarta el fichero entero. Las dos piden una segunda pulsación para confirmar, pero lo que descartan no estaba en ningún commit, así que no hay forma de recuperarlo. No las tocamos. Salimos con la tecla cu, sin commitear todavía.

**4 · O eme pe commit en modo de prueba**

Antes de escribir el mensaje, veamos qué propone oh my pi. En el otro panel, ejecutamos o eme pe guion guion profile demo commit guion guion dry run. El perfil también se aplica a los subcomandos, así que este commit usa los modelos del perfil demo. Lo primero que enseña es el resumen de lo preparado: cuatro ficheros, treinta y cinco líneas añadidas y tres quitadas.

La salida va por pasos. Primero resuelve el modelo: DeepSeek V cuatro punto uno Flash. Usa el rol commit y, como no está asignado, cae al rol smol. Después busca changelogs, y no encuentra ninguno, porque la tienda no tiene. Luego descubre los ficheros de contexto, y aparece nuestro AGENTS punto md. Y arranca un agente de commit.

Ese agente tiene sus propias herramientas. Aquí usa tres: una vista general de lo preparado, el diff de los cuatro ficheros y una para proponer el commit. Si los cambios no tuvieran relación, podría proponer dividirlos en varios commits. Esta vez es un solo cambio.

Y aquí está lo interesante: propone dos veces. La primera, feat, ámbito envio, add urgent shipping total calculation. La segunda, igual, pero con added, en pasado. El formato es el de conventional commits: un tipo, como feat o fix, un ámbito entre paréntesis y un resumen en inglés que empieza por un verbo en pasado. No es una sugerencia: un validador del código lo exige, y la segunda propuesta es la que lo pasa.

El resultado final es feat, envio, added urgent shipping total calculation, con dos viñetas en inglés que explican las dos funciones. Nuestro AGENTS punto md dice otra cosa: mensajes en español, en imperativo y empezando por tienda dos puntos. El agente lo ha leído, pero el validador no le deja cumplirlo, y gana el validador. Cuando una herramienta trae sus propias convenciones, las reglas de tu repositorio no siempre ganan. Compruébalo antes de confiar en ella.

El modo de prueba no ha commiteado nada, y como ya había cosas preparadas, no ha tocado el índice: el README sigue fuera, como veremos enseguida. Pero hay una trampa que conviene conocer. Si lo lanzas con nada preparado, o eme pe commit prepara todos los cambios antes de generar el mensaje, también en dry run. Por eso hemos pasado primero por barra git.

Sin dry run, o eme pe commit crea el commit. Si encuentra un CHANGELOG, actualiza su sección de cambios sin publicar y lo prepara para que entre en el mismo commit; con guion guion no changelog, no lo toca. Si propone dividir el cambio en varios commits, te enseña el plan y te pide confirmación. Y con guion guion push, sube los commits al terminar. Eso publica, y en este curso se queda en la diapositiva.

**5 · El commit desde barra git**

Volvemos a barra git. Los cuatro ficheros siguen preparados y el README fuera. Pulsamos la tecla ce para ir al compositor, abajo a la derecha, que tiene dos campos: el resumen y la descripción. Debajo, el botón para commitear lo preparado.

La hoja de atajos lo dice: si dejas los campos vacíos, se genera un mensaje. Es la misma tubería que acabamos de ver, con Flash y en inglés, así que no lo repetimos. Dos avisos: si el mensaje generado no pasa la validación, la interfaz te dice que necesita revisión. Y si no hubiera nada preparado, generar el mensaje prepararía todos los cambios.

Escribimos nosotros. En el resumen: tienda dos puntos añade el envío urgente. En la descripción, una línea: el envío urgente suma tres euros y se calcula sin IVA, como el normal. Pulsamos el botón, y arriba aparece el aviso de commit creado. La barra lateral se queda solo con el README, y el botón cambia a preparar todo y commitear.

En el otro panel, git log guion guion oneline. Ahí está el commit, encima de master, con el mensaje que pide la tienda. El generador nos ha servido de borrador, pero el mensaje final lo hemos decidido nosotros, que somos quienes conocemos las reglas del equipo.

Dos opciones más del compositor. Ese botón de preparar todo y commitear es útil, pero solo cuando de verdad quieres todo. Y la casilla de enmendar el commit anterior, que rellena el formulario con su mensaje. Es el amend de git: reescribe la historia, así que úsalo solo en commits que no hayas compartido. Hay también un botón para preparar por descripción, con un modelo que juzga cada hunk; usa el rol judge, que no tenemos, y queda en la diapositiva.

**6 · Barra uve doble te: la sesión a un worktree**

Nos queda el README. Imagina que quieres seguir con él en otra rama, sin mezclarlo con el envío urgente, y sin perder la conversación. Para eso está barra uve doble te, que también se llama barra worktree.

Un worktree es una segunda carpeta de trabajo del mismo repositorio, con otra rama, que comparte la historia con la primera. Puedes tener dos ramas abiertas a la vez sin hacer stash ni cambiar de rama. Barra uve doble te lo crea y te lleva la sesión allí.

Escribimos barra uve doble te demo dieciocho uve doble te, el nombre de la rama nueva. Si no le das nombre, crea una rama con la fecha y la hora. Al momento aparece el mensaje: sesión movida al worktree, en la rama nueva, clonado con APFS y con los cambios sin commitear incluidos. La barra de estado cambia de carpeta y de rama, y ahora marca un solo fichero cambiado.

¿Dónde está esa carpeta? No junto a la tienda, sino en una carpeta que gestiona oh my pi. Como trabajamos con el perfil demo, dentro del perfil: punto o eme pe, profiles, demo, uve doble te, con el nombre de la rama y un sufijo. Y clonado con APFS significa que macOS ha hecho una copia instantánea de la carpeta, sin duplicar los datos en el disco.

Abrimos barra git en el worktree. Un solo cambio, el README, en la rama demo dieciocho uve doble te. No hay nada preparado, así que escribimos el resumen, tienda dos puntos indica la versión de Node, y usamos el botón de preparar todo y commitear. Commit creado. La pantalla pasa a la ficha del commit: el autor, que difuminamos, la fecha y el commit padre, que es el del envío urgente.

Ahora, un detalle importante. En el otro panel, que sigue en la carpeta original de la tienda, git status: el README sigue modificado también allí. Barra uve doble te se lleva una copia de los cambios, pero con la configuración por defecto no limpia el origen. Git worktree list enseña las dos carpetas, cada una con su rama. Y el último commit de demo dieciocho uve doble te es el del README.

Existe un ajuste, worktree punto clean source, que sí limpia el origen, y lo hace con un reset hard y un clean. Eso borra lo que no esté commiteado. Déjalo apagado salvo que lo tengas muy claro.

¿Cuándo usarlo? Cuando la conversación ya tiene el contexto de un trabajo y quieres que siga en su propia rama mientras tú haces otra cosa. No funciona mientras el modelo responde, ni en vibe mode, como vimos en el vídeo quince. Y si solo quieres cambiar de carpeta, sin crear rama, eso es barra move, del vídeo doce.

**7 · Auto QA y o eme pe grievances**

Pasamos a Auto QA, y aquí conviene deshacer una confusión, porque el nombre invita a pensar en control de calidad de tu código. No lo es. Auto QA es un buzón de quejas del modelo sobre las herramientas de oh my pi.

Funciona así. Cuando está activo, el system prompt le pide al modelo que, si una herramienta devuelve algo que no encaja con lo que dice su descripción, lo apunte escribiendo una línea en un dispositivo virtual, equis de dos puntos barra barra report issue: el nombre de la herramienta y una frase con el problema. Es información para los desarrolladores de oh my pi, no para ti ni para tu proyecto.

Viene activado de serie, pero nada se guarda hasta que das tu consentimiento. La primera vez que el modelo reporta algo, sale un diálogo con tono gracioso: tu agente ha escrito una carta enfadada a una herramienta, ¿se la mandamos a los desarrolladores? Si dices que no, Auto QA se apaga. Si dices que sí, cada queja se guarda en local y además se envía sola a un servidor de oh my pi.

Según el diálogo, solo viaja la herramienta y la queja. En el código se ve que van también el modelo, la versión, el sistema y un identificador de instalación. Y la queja la escribe el modelo, que puede citar una ruta o un comando. Por eso, en el perfil demo lo dejamos denegado de antemano.

Lo comprobamos en el otro panel. Config get dev punto auto QA responde true: activado, el valor de serie. Y el consentimiento, denied: denegado. Así, si el modelo se queja en cámara, no sale el diálogo y no se envía nada. Son dos ajustes distintos, y el que manda de verdad es el segundo.

La ayuda de o eme pe grievances lo resume: ver, limpiar o enviar las quejas. Sin acción, lista las últimas, y se pueden filtrar por herramienta. Con clean se borran por identificador, por herramienta o todas. Y con push se envían las pendientes al servidor. Ese último, en la diapositiva, porque publica.

Lo ejecutamos con el perfil demo, y responde que todavía no hay quejas registradas. Un detalle que vimos fuera de cámara: solo con listar, crea la base de datos vacía, y la crea dentro de la carpeta del perfil, como el worktree. Si usas perfiles para separar entornos, aquí también se separan.

¿Y para qué te sirve a ti? Para dos cosas. Si una herramienta te falla a menudo, ahí verás si el modelo también lo ha notado. Y para saber qué sale de tu máquina. Si no quieres que salga nada, deja el consentimiento denegado o apaga dev punto auto QA. Con la variable de entorno PI AUTO QA a cero también se desactiva.

**8 · Barra security y los límites de todo esto**

La última pieza, barra security, va solo explicada. Al principio vimos que responde que está desactivada, y viene así de fábrica. Cuando lo activas, oh my pi hace escaneos de seguridad propios: un plan con el alcance exacto, un escaneo en segundo plano con agentes security reviewer, y comandos para ver el estado, listar los escaneos, validar hallazgos, compararlos entre escaneos e importarlos o exportarlos en SARIF, el formato que entienden muchas herramientas de seguridad.

¿Por qué no lo activamos? Porque el escaneo exige una cuenta con OAuth guardada en oh my pi, o Amazon Bedrock, y aquí no enseñamos cuentas. Y porque escanear un repositorio entero gasta mucho modelo. Hay además una variante en la nube que envía el trabajo a Codex Security, de ChatGPT. Todo eso, en la diapositiva.

Un detalle de diseño sí merece la pena: el plan es inmutable. Guarda una huella del código y del alcance, y si cambian antes del escaneo, se niega a empezar. Es la misma idea que el diff congelado de barra review: que lo revisado sea exactamente lo que pediste.

Ahora, los límites del vídeo, juntos. El primero: dry run no es solo lectura. O eme pe commit en modo de prueba, y el mensaje generado en barra git, preparan todos los cambios si el índice está vacío. Prepara tú antes, y mira git status después. Y en barra git, mira dónde está el cursor antes de pulsar la barra espaciadora.

El segundo: las convenciones. O eme pe commit escribe mensajes convencionales en inglés, aunque tu AGENTS punto md diga otra cosa; lo hemos visto en pantalla. Úsalo como borrador, o úsalo tal cual en repositorios que ya sigan ese estilo.

El tercero: lo que publica. Guion guion push, la opción de pull requests de barra review, el envío de quejas de Auto QA y la variante en la nube de security mandan algo fuera de tu máquina, a veces con tu cuenta. Y otro punto que se olvida: el diff que revisa barra review viaja entero al proveedor del modelo. La redacción de secretos de oh my pi viene apagada; la veremos en el vídeo diecinueve.

El cuarto: las teclas que borran. La equis y la tecla suprimir en barra git descartan trabajo que no está en ningún commit, y clean source limpia la carpeta original. Y el quinto, el de siempre: el reviewer tiene bash y el modo yolo no pregunta. Una instrucción de solo lectura no es una barrera.

En cuanto al coste, la barra de estado marcaba un céntimo después de la revisión y el arreglo, y los mensajes de Flash cuestan todavía menos. Con diffs grandes, barra review lanza más revisores, y el coste crece con ellos.

**9 · Repaso, práctica y cierre**

Repasemos. Barra review congela el diff que elijas, sin commitear, contra una rama, un commit o una pull request, y lo reparte entre agentes reviewer, de uno a dieciséis según el tamaño. Devuelve hallazgos y un veredicto, y el modelo de la conversación los comprueba y te pregunta antes de tocar nada. El reviewer usa el rol slow, que sin asignar hereda tu modelo por defecto.

Barra git, igual que o eme pe git, enseña el diff en cuatro vistas, prepara por fichero, por hunk o por líneas, y commitea con tu mensaje o con uno generado. O eme pe commit genera mensajes convencionales con el rol commit o smol, actualiza changelogs, puede dividir commits, y en dry run no commitea, aunque puede preparar. Barra uve doble te crea una rama y un worktree, y se lleva la sesión con una copia de los cambios.

Auto QA no revisa tu código: recoge quejas del modelo sobre las herramientas, y solo con tu consentimiento las guarda y las envía. O eme pe grievances las lista, las limpia y las envía. Y barra security viene apagado, exige OAuth y queda para cuando lo necesites de verdad.

La práctica: en tu perfil de pruebas y en una rama de usar y tirar, haz un cambio pequeño que mezcle dos cosas sin relación. Lanza barra review sobre los cambios sin commitear y apunta qué ha encontrado. Después, en barra git, prepara solo una de las dos cosas, lanza o eme pe commit guion guion dry run, y compara su mensaje con las reglas de tu repositorio. Escribe tú el mensaje final y commitea. Y cuando termines, comprueba con git status y git worktree list que no queda nada suelto.

En el próximo vídeo endurecemos oh my pi para un repositorio de equipo: el modo de aprobación, que hoy sigue en yolo, aprobaciones por herramienta y patrones de bash, las reglas TTSR y barra o eme efe ge, los hooks, y los secretos y su redacción. Lo que hoy han sido instrucciones, como el solo lectura del reviewer, pasarán a ser límites. Nos vemos allí.

</details>

