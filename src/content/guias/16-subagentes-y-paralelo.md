---
title: "Vídeo 16 · Subagentes y trabajo en paralelo"
description: "repartir una tarea entre varios agentes, seguirlos desde el Hub y definir agentes propios para tu proyecto."
ruta: "pi-oh-my-pi"
orden: 16
duracion: "23 min"
video: "16-subagentes-y-paralelo.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/16-subagentes-y-paralelo.es.vtt"
---

repartir una tarea entre varios agentes, seguirlos desde el Hub y definir agentes propios para tu proyecto.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De dirigir a repartir

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Vídeo 15 → hoy:** Un agente (paso a paso) → Varios agentes (a la vez) → Seguirlos (mientras trabajan)
- **Repartir no es gratis**
  - `contexto` · Cada uno el suyo: relee lo que necesita
  - `tiempo` · Antes: pero no más barato
  - `verificar` · Terminar ≠ acertar
- **Hoy:** task (y sus agentes) → /agents (y los tuyos) → Agent Hub (seguir) → /tan · /jobs → /cleanse
- **Hoy**
  - `18.7.0` · Recién salido
  - `V4 Pro` · Reparte y revisa: la conversación
  - `Flash` · Hace los encargos: los subagentes
- *En la demo:* /ag
- *En la demo:* /j

### 2 · La herramienta task y sus agentes

<p><button type="button" class="ir-a" data-t="134">▶ Ir a 2:14</button></p>

- **task:** El modelo llama (task) → Sesión hija (modelo, herramientas) → Trabaja sola → yield (resumen al principal)
- *En terminal:* Una llamada a task (más abajo, en «Código y comandos»)
- **En segundo plano**
  - `async` · Devuelve el control
  - `agent://` · La salida: por nombre
  - `history://` · Lo que hizo: aunque esté aparcado
- **Importante:** No hereda la conversación — Recibe el árbol de trabajo, AGENTS.md y el contexto común. Nada más.
- **Cinco agentes de serie**
  - `task` · Generalista: rol task
  - `sonic` · Mecánico: smol
  - `scout` · Explora: smol · solo lectura
  - `reviewer` · Revisa: slow
  - `security` · Seguridad
- **Dos detalles**
  - `reviewer` · Tiene bash: no es solo lectura
  - `task` · Sin rol task: usa el modelo activo: Pro
- **Cómo pedir que reparta**
  - `explícito` · Pídelo: task, cuántos y qué
  - `orchestrate` · Palabra mágica: decide él cuántos

### 3 · /agents y tus propios agentes

<p><button type="button" class="ir-a" data-t="297">▶ Ir a 4:57</button></p>

- *En la demo:* /agents
- *En la demo:* task hereda Pro
- *En la demo:* model → pattern…
- *En la demo:* task → @smol → Flash
- *En la demo:* scout
- *En la demo:* config get task.agentModelOverrides
- **Más en /agents**
  - `espacio` · Activar / desactivar
  - `New agent` · Un arquitecto lo redacta: sin modelo: hereda
- *En terminal:* Dónde viven los agentes (más abajo, en «Código y comandos»)
- *En la demo:* .omp/agents/revisor-tests.md
- **Más campos**
  - `spawns` · A quién lanza
  - `output` · Esquema
  - `blocking` · Se espera
  - `prewalk` · advisor
  - `unpack` · Copiar incluidos
- **Trampa:** «Solo lectura» con bash es una instrucción — Si no debe escribir, no le des bash ni edición.

### 4 · Repartir y seguir en el Agent Hub

<p><button type="button" class="ir-a" data-t="542">▶ Ir a 9:02</button></p>

- **El reparto**
  - `scout` · Localizar: subtotal, envío, sin test
  - `revisor-tests` · Revisar tests: carrito
  - `sonic` · JSDoc: envío, sin cambiar código
- *En la demo:* Una llamada, tres agentes
- *En la demo:* En segundo plano
- *En la demo:* Alt+A · Agent Hub
- *En la demo:* El inspector
- *En la demo:* Teclas del Hub
- **Al Hub**
  - `Alt+A` · El más corto
  - `Ctrl+S` · Compatibilidad
  - `/hub` · Comando
- *En la demo:* Actividad de los tres
- **Al terminar**
  - `idle` · Sigue vivo: con su contexto
  - `parked` · A los 7 min: r revive
  - `mensaje` · Corrige el mismo: no lances otro
- *En la demo:* Quien reparte, verifica

### 5 · /tan y /jobs

<p><button type="button" class="ir-a" data-t="785">▶ Ir a 13:05</button></p>

- **Preguntas y encargos laterales**
  - `/btw` · Pregunta: vídeo 13
  - `/tan` · Trabajo: un agente completo
- **task frente a /tan**
  - `task` · Sin historial
  - `/tan` · Clona tu sesión: mismo modelo
- *En la demo:* /tan · /jobs
- *En la demo:* Nadie lo ha verificado todavía
- *En la demo:* Seguimos en la sesión principal
- *En la demo:* git diff README.md
- **Aviso:** El clon comparte tu carpeta — Cancelar para el trabajo, pero no deshace lo escrito. Trabaja en una rama descartable.
- *En terminal:* /jobs y proc:// (más abajo, en «Código y comandos»)

### 6 · /cleanse

<p><button type="button" class="ir-a" data-t="952">▶ Ir a 15:52</button></p>

- **/cleanse:** Comprobadores (descubre) → Diagnósticos (agrupa y pesa) → Subagentes (reparte) → Verifica (vuelve a ejecutar)
- *En terminal:* /cleanse (más abajo, en «Código y comandos»)
- *En la demo:* Romper a mano
- *En la demo:* /cleanse --tests
- *En la demo:* El tablero
- *En la demo:* Verificado
- *En la demo:* git diff
- *En la demo:* La actividad de CleanseA1
- *En la demo:* 5 agentes · 83K tokens

### 7 · Límites, riesgos y coste

<p><button type="button" class="ir-a" data-t="1132">▶ Ir a 18:52</button></p>

- **Permisos:** Los subagentes van en yolo — No pueden preguntarte. Su barrera: las herramientas que les das. Vídeo 19.
- **Espacio de trabajo**
  - `compartido` · Por defecto: encargos que no se pisen
  - `isolation` · Una copia por agente: parche o rama · apagado
- **En modo plan:** Explorar sí, cambiar no — Solo lectura y búsqueda; no lanzan a otros.
- **Frenos de serie**
  - `32` · A la vez
  - `2` · Profundidad
  - `peticiones` · Presupuesto blando
- **Contener el gasto**
  - `pequeños` · Encargos separados
  - `barato` · Modelo de smol
  - `uno` · Verifica uno

### 8 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1241">▶ Ir a 20:41</button></p>

- **Repaso:** task (lotes) → Sin historial (encargo autónomo) → 5 agentes (de serie) → Verifica (quien reparte)
- **Y además:** /agents (@smol) → .omp/agents (los tuyos) → Agent Hub (Alt+A) → /tan · /jobs → /cleanse
- **Cuál usar**
  - `task` · Partes separadas
  - `/tan` · Encargo lateral
  - `/cleanse` · Errores de checker
  - `ninguno` · Tarea pequeña
- **Práctica:** Agente propio (barato) → Reparto (tres encargos) → Hub (actividad) → Gasto y diff
- **Próximo vídeo:** El entorno de desarrollo integrado — read, LSP, depurador, ast grep, hashline, eval y el navegador.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Una llamada a task

```text
task({
  context: "Tienda de juguete… trabajad en paralelo",
  tasks: [ { name, agent: "scout", task }, { agent: "revisor-tests", … }, { agent: "sonic", … } ]
})
```

- `context`: Común
- `tasks`: Un encargo por agente
- `agent`: Tipo

### Dónde viven los agentes

```text
<repo>/.omp/agents/*.md        # del proyecto
<config de usuario>/agents/*.md  # tuyos, para todos
.claude/agents  → se ignora
```

- `.omp/agents`: Proyecto
- `usuario`: Todos
- `.claude`: Ignorado

### /jobs y proc://

```text
/jobs            # en marcha y recientes
/jobs full       # líneas completas
read proc://<id>  · write proc://<id>/kill
```

- `full`: Completo
- `proc://`: Inspeccionar
- `kill`: Cancelar

### /cleanse

```text
/cleanse                 # selector de comprobadores
/cleanse --all           # todos
/cleanse -n 4 -m @smol   # agentes y modelo
/cleanse --tests         # añade los tests
```

- `--all`: Todos
- `-n`: Agentes
- `--tests`: Tests

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh)):
  - `tools/task.md`: forma por lotes (`task.batch`, `context` obligatorio, `tasks[]` con `name`, `agent`, `task`,
    `solutionSpace`, `model`…), `async.enabled` (en segundo plano, «Spawned N background agents…»),
    `task.speculativeLaunch`, cierre con `yield` (tres recordatorios), `agent://<id>`, `history://<id>`, `proc://`,
    paso 12 (**`tools.approvalMode` forzado a `yolo`** en los hijos; advisor apagado salvo opt-in), paso 8 y «plan mode»,
    «Child sessions do not inherit conversation history» (sí árbol de trabajo, skills, ficheros de contexto, `local://` y
    plan aprobado), `todo` del padre no se hereda; límites: `task.maxConcurrency` 32, `task.maxRecursionDepth` 2,
    `task.softRequestBudget` 200 (scout/sonic menos), `task.maxRuntimeMs` 0, `task.agentIdleTtlMs` 420 000 (aparcado);
    `task.isolation.enabled` (apagado) con backends y fusión por patch o rama.
  - `task-agent-discovery.md`: campos del frontmatter (`name`, `description`, `tools`, `spawns`, `model`,
    `thinking-level`, `output`, `blocking`, `autoloadSkills`, `read-summarize`, `prewalk`, `advisor`), nombres reservados
    `main` y `sub`, `tools` siempre añade `yield`; raíces `.omp/agents` (proyecto) y `~/.omp/agent/agents` (usuario),
    extensiones, plugins de Claude, incluidos; **primero gana** por nombre exacto; `.claude/agents`, `.codex/agents` y
    `.gemini/agents` se ignoran; precedencia de modelo (llamada → `task.agentModelOverrides` → frontmatter → modelo
    activo del padre); `task.disabledAgents`; «Plan mode behavior»; modelos etiquetados con `^` (no se usa).
  - `agent-hub.md`: `Alt+A` (`app.agents.hub`), `Ctrl+S` (`app.session.observe`, heredada), doble `←`; columnas de la
    lista (estado `running`/`idle`/`parked`/`aborted`, modelo, rol, coste, peticiones, herramientas, tokens; `usage —`
    sin datos); teclas `j`/`k`, `Enter`, `t`, `/`, `1`/`2`, `Tab`, `r`, `x`, `Esc`; registro de actividad (`f`, `s`,
    espacio); dirigir un subagente enfocado (Esc vuelve sin interrumpirlo); bloque fijo «Subagents»
    (`display.pinnedAgents`, `display.subagentLivePreview`, `tui.mouse`); `/agents` es otra cosa; `/jobs`.
  - `magic-keywords.md`: `orchestrate` (contrato: abarcar la tarea, delegar en paralelo, verificar cada fase, seguir hasta
    terminar; exige `task`), minúsculas exactas, palabra suelta, solo ese turno, `magicKeywords.orchestrate`.
  - `settings.md` (`async.enabled` `true`, `async.maxJobs` 100, `task.agentAdvisor` desde `/agents`, `tui.mouse`,
    `display.*`), `bash-tool-runtime.md` (trabajos de bash en segundo plano, autobackground a los 60 s), `extensions.md`
    (los clones de `/tan` son subagentes de profundidad cero), `cli-reference.md` (`cleanse`).
- `omp cleanse --help` y `omp agents --help` (18.6.1, ejecutados).
- **Código 18.5.1** (`~/orca/oh-my-pi`, `git show v18.5.1:…/prompts/agents/*.md`): `scout` (`read, find, grep, glob,
  web_search`, `@smol`, salida estructurada), `reviewer` (**incluye `bash`**, `spawns: scout`, `@slow`),
  `security-reviewer` (solo lectura).
- **Binario de omp 18.6.1** (`strings ~/.bun/bin/omp`):
  - Registro: `/hub` llama a `showAgentHub({ initialSection: "activity" })` (Alt+A, sin argumentos); `/agents` →
    `showAgentsDashboard`; `/jobs [full]` con «Jobs: none» / «Jobs: N running, N recent», «Background Jobs», «Running
    Jobs», «Recent Jobs» y el aviso de que los terminados se ven «at most ~5 minutes»; `/tan <work>`; `/cleanse` con
    «Usage: /cleanse [request] [--all] [--tests] [-n <agents>] [-m <model>]».
  - Agentes incluidos: `task` («General-purpose subagent…», `spawns: *`, `model: @task`) y `sonic` («Low-reasoning agent
    for strictly mechanical updates or data collection only», `@smol`, `medium`); presupuesto interno 100 para scout y
    sonic.
  - `/agents`: lista con fuentes «All agents / project / user / bundled»; espacio activa o desactiva; «configure» abre
    tiras de modelo, prewalk y advisor (`task.agentModelOverrides`, `task.agentPrewalk`, `task.agentAdvisor`,
    `task.disabledAgents`); `Ctrl+R` recarga; «New agent — describe it and let the architect draft it» (genera con el
    modelo activo o `default`, ámbito por defecto `project`, `Tab` cambia el ámbito; guarda solo `name`, `description`
    y el prompt, **sin `model`**).
  - `/tan`: «Usage: /tan <work>», «/tan requires a persisted session.», «Background jobs are disabled; enable async jobs
    to use /tan.», «Dispatched background tan <id>»; bifurca la sesión (`Tan-N`, coste heredado a cero), mismo modelo,
    thinking, prompt de sistema y herramientas, sin MCP propio, nota de «cambio de contexto», trabajo `task`; al acabar
    queda `parked`.
  - `/cleanse`: modelo por defecto **`@smol`**, hasta 32 agentes; descubrimiento con el agente `task`
    («CleanseDiscovery») si hay petición; trabajadores `sonic` («CleanseA1…») por grupos de ficheros con peso, con
    seguimientos por IRC; verificación final («Verification: N diagnostics remaining», «Clean: all detected diagnostics
    are resolved.»); sesión propia «Cleanse»; checkers detectados (eslint, biome, TypeScript, oxlint… y, con tests,
    `<gestor> test` desde `package.json`).
  - Changelog embebido 18.5.x–18.6.1: `/jobs` abre la hoja viva de trabajos; respuestas de seguimiento de subagentes
    como trabajos en segundo plano (18.6.1); `task` con varios subagentes ya no da éxito si uno falla; `model` por
    elemento de `task`.
- Vídeos anteriores: 11 (`Alt+A` abre el hub; `.claude/agents` se ignora, los de omp en `.omp/agents`), 13 (`/btw`
  efímera; «si necesita trabajo de verdad, eso es barra tan»), 14 (roles, `smol` = Flash, prewalk, advisor; «los
  subagentes se revisan por agente, desde barra agents»), 15 (subagentes en modo plan «lo veremos en el dieciséis»;
  vibe; `orchestrate`).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De dirigir a repartir**

En el vídeo quince aprendimos a dirigir una sesión: un plan que apruebas, un objetivo con presupuesto, un bucle con un freno. Pero en todos esos modos había un solo agente haciendo el trabajo, paso a paso. Hoy cambiamos eso. Vamos a repartir una tarea entre varios agentes que trabajan a la vez, cada uno con su encargo, y a seguir lo que hacen mientras lo hacen.

Antes de empezar, una idea que va a atravesar todo el vídeo. Repartir no es gratis. Cada subagente es una conversación entera, con su propio contexto, que lee de nuevo los ficheros que necesita. Tres agentes en paralelo terminan antes, pero no gastan menos. Y que un agente diga que ha terminado no demuestra que lo haya hecho bien. Repartir bien es saber qué encargar, a quién y cómo comprobarlo.

El recorrido. Primero, la herramienta task, que es la que lanza subagentes, y los cinco agentes que trae oh my pi. Después, barra agents, donde se configura cada agente por su nombre, y tus propios agentes. Con eso, repartimos una tarea y la seguimos en el Agent Hub. Y terminamos con tres comandos: barra tan, barra jobs y barra cleanse.

Trabajamos en la tienda, con el perfil demo, ahora en oh my pi dieciocho punto siete, que salió justo antes de grabar. Hoy la conversación la lleva DeepSeek V cuatro Pro, el capaz, y los subagentes trabajarán con Flash, el rápido. Esa es la regla de la demo: Pro reparte y revisa, Flash hace los encargos.

Un vistazo gratis para empezar. Con barra a ge, el menú enseña agents: abre el hub de agentes, con el modelo, el prewalk y el advisor de cada uno. Con barra jota, jobs dice none: no hay trabajos en segundo plano. Y justo debajo, cleanse, que detecta y arregla diagnósticos del proyecto con subagentes en paralelo.

**2 · La herramienta task y sus agentes**

La pieza central es una herramienta, task. Cuando el modelo la llama, oh my pi crea una sesión hija, un subagente, con su propio modelo, sus herramientas y sus instrucciones. El subagente trabaja solo hasta terminar y entrega su resultado con una herramienta oculta, yield. Lo que entrega llega al agente principal como un resumen.

Por defecto, task trabaja por lotes. En una sola llamada, el modelo manda un contexto común y una lista de encargos. Cada encargo lleva el texto de la tarea, un nombre y el tipo de agente. Un encargo, un subagente, y todos arrancan a la vez. Incluso pueden arrancar antes de que el modelo acabe de escribir la llamada: cada uno se lanza en cuanto su encargo está completo.

Con los trabajos asíncronos activados, que es lo normal, los subagentes corren en segundo plano. La herramienta devuelve el control al momento con la lista de agentes lanzados, y los resultados llegan cuando terminan. Cada salida se guarda en un fichero que se lee con agent dos puntos barra barra y el nombre del agente. Y con history dos puntos barra barra, el agente principal puede leer un resumen de lo que hizo cualquiera de ellos, aunque ya esté aparcado.

Algo que conviene tener claro: el subagente no hereda la conversación. No sabe lo que habéis hablado. Recibe el árbol de trabajo, los ficheros de contexto como AGENTS punto md y el contexto común del lote. Nada más. Por eso cada encargo tiene que explicarse solo: qué ficheros, qué restricciones y cómo se sabe que está hecho.

oh my pi trae cinco agentes. Task es el generalista, con todas las herramientas. Sonic es para trabajo mecánico, con el modelo de smol. Scout explora en solo lectura, también con smol, y devuelve un resumen con los ficheros relevantes. Reviewer revisa código con el modelo de slow. Y security reviewer busca vulnerabilidades.

Un detalle de reviewer que no se ve en su descripción: entre sus herramientas está bash. Puede ejecutar comandos, así que no lo trates como un agente de solo lectura. Y otro de task: pide el rol task, y si no lo has asignado, usa el modelo activo de la sesión que lo lanza. En nuestro caso, Pro. Eso es justo lo que vamos a corregir.

¿Cómo consigues que el modelo reparta? La forma más fiable es pedirlo: di que use la herramienta task, cuántos agentes quieres y qué hace cada uno. Hay otra, la palabra mágica orchestrate, escrita en minúsculas en tu mensaje: pide al modelo, durante ese turno, delegar en paralelo el trabajo independiente y seguir hasta terminar. Hoy no la usamos, a propósito: con ella decides menos cuántos agentes salen. Para aprender, mejor un reparto que puedas contar.

**3 · Barra agents y tus propios agentes**

Barra agents abre el hub de agentes. Ojo, no es el Agent Hub en vivo: aquí no se ve quién está trabajando, sino qué agentes existen y cómo están configurados. A la izquierda, las fuentes: todos, seis; del proyecto, uno; incluidos, cinco. En el centro, la lista. Y abajo, para el seleccionado, su descripción, su modelo efectivo, el prewalk, el advisor y de dónde sale.

Bajamos a task. Su modelo efectivo es deepseek v cuatro pro: hereda el de la sesión, como decíamos. Pulsamos Enter para configurarlo, y aparece una tira: deshabilitarlo, el modelo, que dice auto, el prewalk y el advisor. Entramos en el modelo, y oh my pi ofrece dos caminos: elegir un modelo en el selector, o escribir un patrón.

Elegimos el patrón y escribimos arroba smol. Arriba, la confirmación: task model, arroba smol, que resuelve a deepseek flash con razonamiento bajo. Y en la lista, la fila de task lleva ahora la etiqueta arroba smol. Usar el rol en lugar del modelo tiene una ventaja: si mañana cambias smol, el agente le sigue.

Bajamos a scout para comparar: ya usa Flash de serie, porque pide smol. Su descripción dice que hay que usarlo para investigar el código y que devuelve contexto comprimido. Las otras dos tiras de la configuración son el prewalk, el traspaso del vídeo catorce aplicado a un subagente, y el advisor. Lo prometimos en el vídeo catorce: los subagentes se revisan por agente, y es aquí donde se activa.

¿Dónde se guarda esto? En la otra pestaña, pedimos al perfil demo el valor de task punto agent model overrides, y ahí está: task, arroba smol. Es configuración del perfil, no de la sesión, así que al terminar lo deshacemos.

Con la barra espaciadora, en la lista, se activa o desactiva un agente. Uno desactivado no se puede lanzar, y si el modelo lo intenta recibe un error con las alternativas. Es una forma sencilla de quitar de en medio un agente que no quieres que use. Y al final de la lista hay una opción más, new agent: describes lo que quieres y un modelo que hace de arquitecto redacta la definición. Dos avisos: el arquitecto usa el modelo activo, y el fichero que escribe no lleva modelo, así que ese agente heredaría el de la sesión. Por eso el nuestro lo escribimos a mano.

Ahora, tus propios agentes. Un agente propio es un fichero Markdown con una cabecera. Los del proyecto viven en punto omp barra agents, dentro del repositorio; los tuyos, para todos los proyectos, en la carpeta de agentes de tu configuración de usuario. Como dijimos en el vídeo once, punto claude barra agents se ignora a propósito.

El nuestro ya está escrito. Se llama revisor guion tests. Su descripción dice que revisa los tests de un módulo y propone casos que faltan, en solo lectura; es lo que lee el modelo para decidir cuándo usarlo. Herramientas: read, grep, glob y bash. Modelo, arroba smol, con razonamiento bajo. Y debajo, el cuerpo, que es su prompt de sistema: qué revisar, que no edite nada y cómo responder.

La cabecera admite más campos. Spawns dice a qué agentes puede lanzar él. Output define un esquema para que la respuesta salga estructurada. Blocking hace que el agente principal espere a ese agente aunque los demás vayan en segundo plano. Prewalk y advisor son los mismos de las tiras de barra agents, escritos en el fichero. Y si quieres partir de los incluidos, omp agents unpack los copia a tu carpeta, o al proyecto con guion guion project, para que los edites.

Fíjate en una trampa. Le damos bash para ejecutar los tests, pero bash puede hacer cualquier cosa, incluido escribir ficheros. Decir solo lectura en la descripción es una instrucción, no una barrera. Si quieres un agente que de verdad no pueda escribir, no le des bash ni herramientas de edición. Y si dos agentes se llaman igual, gana el del proyecto, luego el de usuario, y al final los incluidos.

**4 · Repartir y seguir en el Agent Hub**

Ahora, la demo. Le pedimos a Pro que reparta con la herramienta task, en paralelo y sin tocar los mismos ficheros, tres encargos. Un scout que localice dónde se calculan el subtotal y los gastos de envío, y qué funciones no tienen test. Revisor guion tests sobre los tests del carrito. Y un sonic que añada comentarios JSDoc a las funciones de envío sin cambiar el código. Y que, al terminar, compruebe el diff y ejecute los tests.

Pro piensa el reparto y escribe una sola llamada: task, tres agentes. Arriba, el contexto común, que él mismo ha redactado: qué es la tienda, qué hay en cada fichero, y que pueden trabajar en paralelo. Debajo, una fila por agente, con el nombre que les ha puesto, su tipo, las herramientas que lleva usadas, las peticiones, el contexto y el coste.

Justo debajo, Pro espera: waiting on dos de tres jobs, uno hecho. El sonic ha terminado el primero, en diez segundos. Y encima del editor aparece un bloque fijo, subagents, con los que siguen en marcha. En la esquina, el pie lo recuerda: dos agentes trabajando, y una pista para verlos.

Pulsamos alt a y se abre el Agent Hub. Arriba, el resumen: uno en marcha, dos en reposo, ocho décimas de céntimo en total, cuarenta y ocho segundos de agente y treinta y dos mil tokens. Debajo, una fila por agente, con su tarea, su rol, smol, y su modelo, deepseek flash con razonamiento bajo. Ninguno usa Pro. Era la regla.

A la derecha, el inspector del agente seleccionado: el revisor. Su tarea, lo que está haciendo en este momento, su uso, de quién depende, spawned by main, y una nota importante: shared workspace. Todos trabajan sobre el mismo árbol de ficheros, y oh my pi no puede atribuir cada línea cambiada a un agente. Debajo, su actividad reciente: lee los ficheros, ejecuta node guion guion test y calcula valores esperados.

Abajo, las teclas. Uno y dos cambian entre la lista y la actividad. Jota y ka seleccionan. Enter abre la conversación del agente, y desde ahí puedes escribirle para dirigirlo, igual que a la sesión principal. Te alterna entre la lista plana y el árbol de padres e hijos. Erre revive un agente aparcado. Y equis lo mata.

Al Hub se llega por varios caminos. Alt a es el más corto; control ese hace lo mismo, por compatibilidad; y barra hub abre la misma pantalla. En el registro de actividad, la tecla efe filtra por errores, respuestas o herramientas, y la barra espaciadora sigue o deja de seguir lo último. Si una cifra de uso no está disponible, verás una raya, no una estimación: el Hub no se inventa números.

Pulsamos dos: el registro de actividad, de los tres a la vez. Se ve cómo se reparten el trabajo en el tiempo: el sonic lee el fichero de envío, ve que ya tenía un bloque JSDoc y añade las etiquetas que faltaban; el scout busca con grep todas las funciones exportadas; el revisor ejecuta los tests. Es la forma rápida de ver si alguien se ha atascado.

Cuando terminan, las filas pasan a idle. No desaparecen: el agente sigue vivo con su contexto, y se le puede mandar otro mensaje. A los siete minutos sin actividad se aparca, y se libera la memoria; con erre, o mandándole un mensaje, revive. Si después quieres una corrección, es mejor escribirle al agente que ya hizo el trabajo que lanzar otro desde cero.

A Pro le llegan los tres resultados, y hace lo que le pedimos: comprueba el diff, que solo añade cuatro líneas de JSDoc, y ejecuta los tests, quince de quince. Y lo resume en una tabla por agente. El scout: ninguna función pública sin test. El revisor: quince casos que faltan, como el carrito vacío o el redondeo. El sonic: JSDoc añadido sin tocar el código. La verificación la hace quien reparte.

**5 · Barra tan y barra jobs**

En el vídeo trece vimos barra btw, una pregunta lateral que no deja rastro en la sesión. Y dijimos que si la pregunta necesitaba trabajo de verdad, eso era barra tan. Barra tan lanza un agente completo en segundo plano para un trabajo tangencial, algo que no quieres mezclar con lo que estás haciendo, mientras tú sigues en la sesión principal.

La diferencia con task es de dónde parte. Un subagente de task empieza sin historial. Barra tan, en cambio, clona tu sesión: el clon sabe de qué va el proyecto y usa el mismo modelo y las mismas herramientas. Lleva una nota que le dice que solo atienda ese encargo y no toque tu trabajo. Por eso, antes, escribimos barra switch arroba smol: el clon trabajará con Flash.

Barra tan, añade al README una sección corta que explique cómo ejecutar los tests. En la conversación aparece tangent dispatched, de tipo task, con el identificador be ge tres, y el aviso dispatched background tan. Barra jobs lo confirma: un trabajo en marcha, be ge tres, con el texto del encargo. Barra jobs lista los trabajos en segundo plano: subagentes, clones de tan y comandos de bash largos.

En catorce segundos aparece background job completed. Y la sesión principal reacciona de una forma interesante: razona que ese trabajo es de otro agente, que no es responsabilidad suya, y no lo revisa. Dice: el cambio del README es de otra sesión y queda fuera de mi encargo. Es lo correcto según sus instrucciones, pero significa que nadie lo ha verificado todavía. Esa parte es tuya.

Así que, mientras tanto, seguimos con otra cosa en la sesión principal: cuántos tests hay, en una línea. Quince. Y en la otra pestaña verificamos nosotros: git diff. El README tiene una sección nueva, ejecutar los tests, con el comando y cómo lanzar un fichero concreto. Y el diff de envío sigue siendo solo el JSDoc de antes.

Un aviso: el clon comparte el directorio de trabajo contigo. Si los dos tocáis el mismo fichero a la vez, os pisaréis. Y cancelar un trabajo, desde el Hub con equis, lo para, pero no deshace nada: lo que ya haya cambiado en disco, se queda. Por eso conviene trabajar en una rama que puedas descartar.

Barra jobs tiene una variante, full, que enseña las líneas de comando completas, y lista también los trabajos recientes durante unos minutos después de terminar. Y el agente principal puede inspeccionar un trabajo sin consumir su resultado, leyendo proc dos puntos barra barra y su identificador, o cancelarlo escribiendo en la ruta kill de ese identificador. Es lo que usa por dentro cuando le pides que pare algo que lanzó.

**6 · Barra cleanse**

Barra cleanse es un reparto ya montado, para un caso concreto: arreglar diagnósticos. Primero averigua qué comprobadores tiene el proyecto, como eslint, TypeScript o los tests. Ejecuta los que elijas, agrupa los errores por fichero, les da un peso y reparte los arreglos entre subagentes que no comparten ficheros, con el modelo de smol. Al final, vuelve a ejecutar los comprobadores para verificar.

Sin argumentos, enseña un selector con los comprobadores que ha encontrado; con guion guion all, los ejecuta todos sin preguntar. Si le escribes una petición, como errores de tipos, un agente de descubrimiento averigua qué comando ejecutar. Guion ene limita el número de agentes, que por defecto puede llegar a treinta y dos, y guion eme elige el modelo. Y guion guion tests añade los tests del proyecto, que es lo que usamos hoy, porque la tienda no tiene linters.

Preparamos el terreno. En la otra pestaña rompemos a mano el umbral de envío gratis: de cuarenta a cuarenta y cinco euros. Ejecutamos node guion guion test: doce pasan, tres fallan, código de salida uno.

En oh my pi escribimos barra cleanse guion guion tests. Aparece un selector: ejecutar los dos comprobadores descubiertos, npm test, ShellCheck sobre el script de revisión que añadimos en el vídeo diez, o describir qué arreglar con palabras. Elegimos solo npm test.

Aparece un tablero. npm test, un problema, en cinco segundos. Checkers done: un diagnóstico en cero ficheros. Con un linter, cada error trae fichero y línea, y eso permite repartir. La salida de los tests no tiene ese formato, así que cleanse la convierte en un solo diagnóstico para todo el proyecto. Resultado: un único trabajador, cleanse a uno, con deepseek flash.

En veinte segundos y diecisiete mil tokens, el trabajador termina. Cleanse vuelve a ejecutar npm test, que sale limpio, y el tablero dice: verification, cero diagnósticos pendientes. Clean: todos los diagnósticos detectados están resueltos.

Y ahora, lo que no hace por ti: comprobar cómo se ha arreglado. Un agente con prisa puede hacer pasar un test cambiándolo, y un tablero en verde no distingue una cosa de la otra. En la otra pestaña, git diff: el umbral ha vuelto a cuarenta en el código de envío, y los tests no se han tocado. Y en el Hub, la actividad de cleanse a uno lo cuenta: la causa está clara, el límite en envío punto js; edita, restaura el umbral a cuarenta y ejecuta los tests.

Abrimos el Hub una última vez. Ahí están todos los agentes de la sesión: cleanse a uno, los tres del reparto y el clon de tan, marcado como temporal y aparcado. En total, cinco agentes, ochenta y tres mil tokens y un céntimo y seis décimas. Es poco porque los encargos eran pequeños y todos usaron Flash.

**7 · Límites, riesgos y coste**

Los límites, sin rodeos. El primero es de permisos. Los subagentes no tienen a quién preguntar, porque trabajan sin interfaz, así que oh my pi les fuerza el modo yolo: no se paran a preguntarte, aunque tú hayas configurado aprobaciones en la sesión principal. En el vídeo diecinueve veremos qué parte del endurecimiento sí les llega. Mientras tanto, su barrera principal son las herramientas que les das.

El segundo es el espacio de trabajo. Lo vimos en el inspector: shared workspace. Todos los subagentes trabajan sobre tu mismo árbol de ficheros, a la vez. Por eso pedimos encargos que no toquen los mismos ficheros. Existe un modo aislado, que se activa con task punto isolation punto enabled: cada agente trabaja en una copia y sus cambios vuelven como un parche o una rama. Viene apagado.

El tercero, el modo plan del vídeo quince. Si lanzas subagentes en modo plan, solo tienen herramientas de lectura y búsqueda. No pueden lanzar a otros ni cambiar nada. Explorar en paralelo, sí; cambiar algo, no.

Hay frenos de serie. Hasta treinta y dos subagentes a la vez por sesión. Una profundidad de dos: un subagente puede lanzar otros, pero esos ya no. Un presupuesto blando de peticiones por agente, menor en scout y sonic: al cruzarlo se le pide que cierre. Todo se ajusta en la configuración de tareas.

Y el coste. Cada subagente es una conversación con su propio contexto, que vuelve a leer lo que necesita. Tres agentes leen tres veces. El Hub te enseña lo que gasta cada uno, y conviene mirarlo. Hoy lo hemos contenido con tres reglas: encargos pequeños y separados, modelo barato para los subagentes y verificación final en uno solo. Cuándo compensa de verdad repartir es el tema del vídeo veinticinco.

**8 · Repaso, práctica y cierre**

Repasemos. La herramienta task lanza subagentes en lotes, con un contexto común y un encargo por agente, en segundo plano. No heredan la conversación, así que cada encargo debe explicarse solo. Hay cinco agentes de serie: task, sonic, scout, reviewer y security reviewer. Y quien reparte, verifica.

Barra agents configura cada agente por su nombre: activarlo, su modelo, con un patrón como arroba smol, su prewalk y su advisor. Tus agentes viven en punto omp barra agents, con name, description y lo que necesites. El Agent Hub, con alt a, enseña quién trabaja, con qué modelo y cuánto gasta, y te deja entrar, revivir o matar. Barra jobs lista los trabajos, barra tan clona tu sesión para un encargo lateral y barra cleanse reparte arreglos.

Y una guía rápida para elegir. Si el trabajo se divide en partes que no se pisan y quieres el resultado en esta conversación, task. Si es un encargo lateral que necesita saber de qué va el proyecto pero no quieres mezclarlo con lo que haces, barra tan. Si lo que tienes son errores de un comprobador, barra cleanse. Y si es una sola tarea pequeña, ninguno: hazla en la sesión principal, que repartir también tiene un coste.

La práctica: en tu perfil de pruebas, escribe un agente propio con un modelo barato y solo las herramientas que necesite. Pide un reparto de tres encargos que no compartan ficheros, uno de ellos para tu agente. Síguelos en el Agent Hub y mira la actividad. Al terminar, apunta lo que ha gastado cada uno y revisa el diff antes de dar nada por bueno.

En el próximo vídeo, el entorno de desarrollo integrado: la herramienta read que abre PDF, bases de datos y pull requests, el LSP, un depurador, ast grep y ast edit, la edición con hashline, eval y el navegador. Nos vemos allí.

</details>

