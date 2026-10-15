---
title: "Vídeo 15 · Planificar y dirigir"
description: "planes revisables, objetivos con presupuesto, bucles con condición de parada y colas de tareas. Cuándo usar cada modo y por qué no se combinan."
ruta: "pi-oh-my-pi"
orden: 15
duracion: "23 min"
video: "15-planificar-y-dirigir.mp4"
---

planes revisables, objetivos con presupuesto, bucles con condición de parada y colas de tareas. Cuándo usar cada modo y por qué no se combinan.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De pedir a dirigir

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Hoy decidimos**
  - `aprobar` · Quién aprueba
  - `parar` · Cuándo para
  - `gastar` · Cuánto gasta
- **Cuatro modos**
  - `plan` · Investiga y propone
  - `goal` · Objetivo con presupuesto
  - `loop` · Repite hasta una señal
  - `vibe` · Dirige a otros
- **La regla:** Plan, goal y vibe no se combinan — Se encadenan: primero un plan, después un objetivo que lo ejecuta.
- **Hoy**
  - `V4 Pro` · El capaz: rol plan
  - `Flash` · El rápido: ejecuta
  - `18.6.3` · Recién actualizado: omp update
- *En la demo:* /pl
- *En la demo:* /go

### 2 · El modo plan

<p><button type="button" class="ir-a" data-t="136">▶ Ir a 2:16</button></p>

- **Separar pensar de hacer:** Explora (sin tocar) → Plan (escrito) → Tú apruebas → Ejecuta
- *En la demo:* plan = DeepSeek V4 Pro :high
- *En la demo:* /plan · Alt+Shift+P
- **Mientras dura**
  - `write · edit` · Solo lectura: el plan va a local://
  - `rename · delete` · Tampoco
  - `ask` · Sin temporizador: espera tu respuesta
- **Cómo termina cada turno**
  - `ask` · Pregunta
  - `xd://propose` · Propone el plan: …-plan.md en local
- **La petición:** Códigos de cupón — BIENVENIDA10 resta un 10 % antes del envío; un código desconocido da un error claro.
- **Límite:** Planificar no es aislar — Aislamiento: vídeo 05. Permisos: vídeo 19.

### 3 · Revisar el plan

<p><button type="button" class="ir-a" data-t="308">▶ Ir a 5:08</button></p>

- *En la demo:* La revisión del plan
- *En la demo:* El plan quita la API de objeto
- *En la demo:* a anotar · e editar · d borrar · u deshacer
- *En la demo:* a · anotar la sección
- *En la demo:* Notas por sección
- *En la demo:* Refine plan
- *En la demo:* El plan corregido
- *En la demo:* Cinco salidas
- *En la demo:* ¿Qué rol ejecuta el plan?
- **Más**
  - `título` · La sesión toma el del plan
  - `plan.autosave` · .omp/plans/: apagado
  - `--plan-yolo` · Sin revisión: → smol
- *En la demo:* Save and quit
- *En la demo:* El plan, en un fichero del repo

### 4 · Objetivos con presupuesto

<p><button type="button" class="ir-a" data-t="536">▶ Ir a 8:56</button></p>

- **Modo goal:** Objetivo → Turno → Cede (oh my pi le recuerda) → goal complete (lo decide el modelo)
- *En terminal:* /goal (más abajo, en «Código y comandos»)
- **Ojo:** /goal &lt;objetivo&gt; no lleva presupuesto — Empieza en el acto. Y Esc lo pausa.
- **/guided-goal busca cinco cosas**
  - `éxito` · Comprobable
  - `verificar` · Cómo
  - `intentos` · Cuántos
  - `alcance` · Qué toca
  - `parar` · Cuándo
- *En la demo:* /guided-goal · pregunta 1
- *En la demo:* Preguntas 2 y 3
- *En la demo:* Presupuesto desde el primer momento
- *En la demo:* Goal: complete
- **El presupuesto**
  - `cuenta` · Entrada, escritura de caché, salida: no las lecturas de caché
  - `límite` · budget limited: avisa y deja de continuar
  - `final` · Lo decide el modelo

### 5 · Dirigir mientras trabaja

<p><button type="button" class="ir-a" data-t="757">▶ Ir a 12:37</button></p>

- *En la demo:* /goal sin presupuesto · /goal show
- **La lista de tareas**
  - `todo` · La lleva el agente: por fases
  - `estados` · 5 estados: pendiente … bloqueada
  - `sesión` · Se guarda
- *En la demo:* /todo append
- *En la demo:* /queue
- **Parar sin perder nada**
  - `/pause` · Congela: agente, subagentes y advisor
  - `Esc` · Interrumpe: y pausa el objetivo
- *En la demo:* Objetivo cumplido
- *En la demo:* La cola, al ceder el turno

### 6 · Por qué son excluyentes

<p><button type="button" class="ir-a" data-t="902">▶ Ir a 15:02</button></p>

- *En la demo:* /plan con un objetivo activo
- *En la demo:* Bloqueado
- **Quién bloquea a quién**
  - `plan` · Bloquea goal y vibe
  - `goal` · Bloquea plan y vibe: también en pausa
  - `vibe` · Bloquea los dos
- **Cada modo cambia dos cosas**
  - `plan` · Solo lectura: para en tu aprobación
  - `goal` · Herramienta goal: para al cumplir o con el presupuesto
  - `vibe` · Sin edición: dirige a otros
- **Encadenar:** /plan (revisado) → Save and quit (fichero) → /guided-goal (con presupuesto)

### 7 · /loop

<p><button type="button" class="ir-a" data-t="981">▶ Ir a 16:21</button></p>

- **goal frente a loop**
  - `goal` · El modelo decide
  - `loop` · Algo de fuera lo para
- *En terminal:* /loop (más abajo, en «Código y comandos»)
- **La condición**
  - `después` · Tras cada vuelta: la primera siempre ocurre
  - `30 s` · Si falla raro: el bucle se apaga
- *En la demo:* Un test que falla, a mano
- *En la demo:* /loop 3 --until 'node --test'
- *En la demo:* Una sola vuelta
- **loop.mode**
  - `prompt` · Reenvía: de fábrica
  - `compact` · Compacta antes: gasta modelo
  - `reset` · De cero: no en vibe
- *En la demo:* git diff

### 8 · /vibe

<p><button type="button" class="ir-a" data-t="1184">▶ Ir a 19:44</button></p>

- **/vibe: la sesión dirige**
  - `spawn` · Crear
  - `send` · Mensaje
  - `wait` · Esperar
  - `kill` · Parar
  - `list` · Ver
- **Trabajadores**
  - `fast` · Modelo de smol: mecánico, borradores
  - `good` · Rol task: decidir y revisar
- **La documentación:** Terminar no es acertar — La directora verifica leyendo los ficheros que tocaron.
- **Solo diapositiva:** Varios agentes, varios contextos — El gasto se multiplica. Subagentes y paralelo: vídeo 16.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1269">▶ Ir a 21:09</button></p>

- **Repaso: plan:** /plan (solo lectura) → Revisión (anotar, refinar) → continue with (qué rol) → Save and quit (o aprobar)
- **Repaso: dirigir:** /guided-goal (con presupuesto) → todo · queue (sin interrumpir) → /loop (acotado) → /vibe (dirige)
- **Práctica:** Rol plan → Anotar (y refinar) → Save and quit → /guided-goal (con presupuesto) → Comparar (tokens y diff)
- **Próximo vídeo:** Subagentes y trabajo en paralelo — task, el Agent Hub, tus agentes, /tan y /jobs.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### /goal

```text
/goal set <objetivo>       # fija o sustituye (sin presupuesto)
/goal show · pause · resume · drop
/goal budget 200000 | off
omp --goal "<objetivo>"      # desde la terminal
```

- `set`: Fija
- `show`: Detalle
- `budget`: Presupuesto

### /loop

```text
/loop 10 <mensaje>                      # vueltas
/loop 10m <mensaje>                     # minutos (o h)
/loop 3 --until 'node --test' <mensaje>  # hasta que salga con 0
/loop --while '<comando>' <mensaje>
```

- `/loop 10`: Número
- `10m`: Duración
- `--until`: Condición

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh)):
  - `vibe-mode.md`: director con `read`, `todo` opcional y cinco herramientas `vibe_*` (`vibe_spawn`, `vibe_send`,
    `vibe_wait` con 30 s por defecto, `vibe_kill`, `vibe_list`); niveles `fast` (agente `sonic`, `@smol`) y `good`
    (agente `task`, `@task`; sin asignar, el modelo activo o `default`); `task.agentModelOverrides`; trabajadores
    persistentes que empiezan en blanco; al salir se cancelan y quedan terminales; excluyente con plan y goal activos
    **y en pausa**; se rechazan nueva sesión, borrar, bifurcar, mover, `/wt` y handoff, y los `/loop` de tipo reset;
    indicador `Vibe` con la velocidad agregada; «worker completion means the turn settled, not that its claims are
    correct».
  - `settings.md` §«Interaction» (`plan.enabled` `true`, `plan.defaultOnStartup` `false`; `steeringMode` y
    `followUpMode` `one-at-a-time`), §«Precedence» (`--plan` como override de runtime), variables (`PI_PLAN_MODEL`),
    familias de ajustes `goal.*` y `loop.*` (nombradas, sin tabla).
  - `models.md` §«Role aliases and settings»: «assigning `plan` does not itself enter plan mode, and calling `todo`
    does not itself select the plan model. While plan mode is active, changing the `plan` role reapplies its model».
  - `cli-reference.md` §«Prewalk and plan modes»: `--plan-yolo` (solo lectura, autoaprueba y pasa a ejecutar),
    `--plan-yolo-into` (por defecto el rol `smol`), `--goal <objetivo>` (sesión nueva en goal mode, solo interactivo,
    incompatible con `--plan-yolo` y con `plan.defaultOnStartup`); `--plan <id>`; en modo print se ignora
    `plan.defaultOnStartup`.
  - `slash-command-internals.md` §8 (*streaming*: `steer`, `followUp`, `aside`), §10 (`/pause`: puerta global para el
    agente principal, subagentes y advisor; para en el siguiente punto seguro; no aborta; Esc, Enter, espacio o Ctrl+C
    reanudan), §13 (`/plan-review`: solo en modo plan; `a` anota sección o primera línea visible, `e` edita, `u` deshace;
    el editor de notas se comporta como el de `/annotate`, §12).
  - `resolve-tool-runtime.md`: `xd://propose` (cuerpo = el *slug* de `local://<slug>-plan.md`), solo válido en modo
    plan; *plan-yolo* autoaprueba.
  - `tools/todo.md`: operaciones (`init`, `start`, `done`, `drop`, `block`, `unblock`, `rm`, `append`, `view`), estados
    (`pending`, `in_progress`, `completed`, `abandoned`, `blocked`), una sola tarea en curso, HUD que se oculta a los
    60 s (`tasks.todoClearDelay`), ida y vuelta Markdown de `/todo`, aviso `<system-reminder>` al modelo tras una
    edición manual, los subagentes no heredan `todo`.
  - `tools/task.md` (en modo plan, los subagentes tienen `read`, `grep`, `glob`, `web_search` y `ast_grep`; sin
    aislamiento ni herramientas de eval), `tools/ask.md` (en modo plan no hay temporizador), `tools/edit.md` y
    `tools/write.md` (guarda de modo plan; `write` admite borradores `local://`), `session-tree-plan.md` §«Plan approval
    session naming» (al aprobar, la sesión toma el título del plan si no tenía nombre), `session.md` (`mode_change` con
    `planFilePath`), `rpc.md` (comando `goal` con `token_budget`; `queuedMessages`), `keybindings.md`
    (`app.plan.toggle` `Alt+Shift+P`; `app.message.followUp` `Ctrl+Q`, `Ctrl+Enter`; `app.message.dequeue` `Alt+Up`,
    `Shift+Up`), `magic-keywords.md` (`orchestrate`, solo se nombra), `non-compaction-retry-policy.md` (goal mode).
- **Binario de omp 18.6.1** (`strings ~/.bun/bin/omp`), para lo que la documentación no cuenta:
  - Registro: descripciones dinámicas «Plan: on (…)», «Plan: blocked by goal mode», «Vibe: blocked by plan mode»,
    «Vibe: blocked by goal mode», «Goal: blocked by plan mode», «Goal: <estado> (<objetivo>)», «Loop: on (…)», «Loop:
    paused», «Todos: N open (N in progress, N done)»; sintaxis `/loop [count|duration] [--while|--until '<cmd>']
    [prompt]`; subcomandos de `/goal` y `/todo`.
  - Modo plan: «Plan mode enabled. Plan file: local://PLAN.md»; al entrar cambia al modelo del rol `plan` y al salir lo
    restaura; añade `write`; la guarda de escritura rechaza renombrar, borrar y «Plan mode: the working tree is
    read-only. Write your plan to a local://<slug>-plan.md file instead.»; recordatorio si el turno acaba sin `ask` ni
    `xd://propose`; «Exit plan mode? This exits plan mode without approving a plan.».
  - Revisión: título «Plan mode - next step»; opciones «Approve and execute» (vacía el contexto), «Approve and compact
    context», «Approve and keep context (~N / M)» (desactivada por encima del 95 % de contexto), «Refine plan», «Save
    and quit» (elige ruta, guarda, sale del modo plan y vacía el contexto); selector «continue with» con los roles del
    ciclo; «Continuing with <rol>: <modelo>»; «No plan to review yet — write one to a local://<slug>-plan.md file
    first.»; ajustes `plan.autosave` (`false`) y `plan.autosaveDir` (vacío = `<proyecto>/.omp/plans/`).
  - Goal: `goal.enabled` (`true`), `goal.statusInFooter` (`true`), `goal.continuationModes` (`["interactive"]`);
    `/goal <objetivo>` crea el objetivo **sin presupuesto** y lo envía al momento; `budget` exige objetivo activo
    («Resume the goal before adjusting the budget.»); «Goal budget set to N.»; «Drop goal? This removes the goal record.
    Accumulated usage stays in the session log.»; `/goal show` (Objective, Status, Tokens usados / presupuesto y
    restantes, Time spent); herramienta `goal` con `op` `create|get|complete|resume|drop` y `token_budget`; cuenta
    entrada + escritura de caché + salida (no lecturas de caché); al llegar al presupuesto, estado `budget-limited`,
    un mensaje oculto `goal-budget-limit` y no más continuaciones; interrumpir pausa el objetivo; «Goal mode completed.»
    y «Goal achieved. Report final budget usage to the user».
  - Loop: «Loop mode enabled. Limited to N iterations. … Continuing until '<cmd>' succeeds.»; el contador baja en cada
    reenvío; la condición se evalúa tras cada vuelta; `--until` sigue con salida 1 y para con 0 («… is now satisfied.
    Loop mode disabled.»), `--while` al revés; otro código, fallo al arrancar o tiempo agotado apagan el bucle;
    `loop.mode` (`prompt`, `compact`, `reset`), `loop.conditionTimeoutMs` (30 000); «Loop limit reached. Loop mode
    disabled.»; «Exit vibe mode before using reset loops.».
  - Vibe: «Vibe mode enabled. You direct fast/good worker sessions; toolset is read + optional parent Todo + vibe
    tools.», «Vibe mode disabled. Killed N worker sessions.».
  - `/queue`: «Usage: /queue <message> (or start a prompt with -> / =>)», «Queued message for after compaction»; si el
    agente está parado, se envía en el acto.
  - Changelog embebido 18.5.x–18.6.1: `--goal` (18.4.11), goal en RPC con `goal.continuationModes: ["rpc"]`, goal
    espera si todas las tareas están bloqueadas, goal se detiene si las continuaciones repiten la misma evidencia,
    `/guided-goal` conversacional, `/drop` renombrado a `/delete` por `/goal drop`, `/vibe` con `todo`.
- Vídeos anteriores: 04 (el coste de cambiar de modelo), 05 (aislamiento de verdad), 11 (`Ctrl+Q` para encolar,
  `--plan` y `--goal` en la ayuda), 12 (`Alt+Up` devuelve un mensaje encolado; el menú enseña estado), 13 (compactar
  cambia lo que ve el modelo), 14 (roles; `/prewalk` planifica con el caro y ejecuta con el barato; el rol `plan` «que
  hoy solo hemos nombrado»; cierre que anuncia este vídeo).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De pedir a dirigir**

En el vídeo catorce repartimos el trabajo entre modelos. Barra prewalk dejaba que el modelo capaz planificara y pasara el testigo al rápido en la primera edición, y el advisor revisaba cada turno. Pero la forma de trabajar seguía siendo la misma: tú escribes, el agente trabaja hasta que cree que ha terminado y te devuelve el control. Hoy cambiamos eso. Vamos a decidir quién aprueba, cuándo para el agente y cuánto puede gastar.

oh my pi trae para eso cuatro modos de trabajo. El modo plan, en el que el agente solo investiga y te entrega un plan para aprobar. El modo goal, un objetivo que persigue turno tras turno, con un presupuesto de tokens. El modo loop, que repite un mensaje hasta un límite o hasta que un comando dé la señal. Y el modo vibe, en el que la sesión deja de programar y dirige a otros agentes.

Junto a los modos hay dos herramientas que valen siempre: la cola de mensajes y la lista de tareas. Y una regla que atraviesa todo el vídeo: plan, goal y vibe no se pueden combinar. Al final entenderás por qué, y verás que la forma de usarlos juntos es encadenarlos: primero un plan, después un objetivo que lo ejecuta.

Trabajamos en la tienda, con el perfil demo y los dos modelos del vídeo catorce: DeepSeek V cuatro Pro, el capaz, y DeepSeek Flash, el rápido. Y una novedad: oh my pi ha sacado la versión dieciocho punto seis punto tres mientras preparábamos el vídeo, así que actualizamos antes de grabar. Nada de lo de hoy cambia en ella, pero la regla del curso es grabar siempre con la última.

Antes de nada, un vistazo gratis. Escribimos barra p ele, y el menú dice plan off y plan review: el modo plan no está activo. Con barra g o aparecen los demás: goal off, guided goal con su descripción, vibe off y loop off. Guided goal enseña una descripción en lugar de un estado porque no es un modo, es una acción.

**2 · El modo plan**

¿Por qué planificar aparte? Porque el error más caro no es un fallo de sintaxis: es código correcto para el problema equivocado. Cuando el agente empieza a editar a la vez que piensa, cada malentendido se convierte en cambios que hay que deshacer. El modo plan separa las dos cosas. El agente explora sin tocar el proyecto, escribe un plan, y nada se ejecuta hasta que tú lo apruebas.

Primero, el rol plan, que en el vídeo catorce solo nombramos. Abrimos barra model, filtramos por deepseek, elegimos Pro y, en la barra de roles, plan, con razonamiento high. Asignar un rol que no es default no cambia la conversación: se guarda en el perfil y espera a que alguien lo use. Asignar plan no entra en modo plan. Lo que pasa es que, al entrar, oh my pi cambia al modelo de plan.

Para entrar hay dos caminos: barra plan, o alt mayúsculas pe. Escribimos barra plan. El aviso dice plan mode enabled, y el fichero del plan: local dos puntos barra barra PLAN punto md. Local es una carpeta de la sesión, fuera de tu repositorio. Y fíjate en el pie: el modelo ha pasado solo de Flash a Pro, y al lado aparece plan.

¿Qué cambia mientras dura? Las herramientas de escritura y edición rechazan tocar el proyecto; si el modelo lo intenta, recibe un error que le dice que el árbol de trabajo es de solo lectura y que escriba su plan en local. Tampoco puede renombrar ni borrar ficheros. Y la herramienta ask, la que te hace preguntas, no tiene temporizador: el agente espera tu respuesta.

El modo plan también decide cómo termina cada turno. El agente tiene dos salidas: preguntarte algo con ask, o escribir el plan en un fichero de local que termina en guion plan punto md y proponerlo escribiendo en un dispositivo especial, equis de dos puntos barra barra propose. Si un turno acaba sin ninguna de las dos, oh my pi le recuerda que tiene que elegir.

Le pedimos esto: que el carrito acepte códigos de cupón. Bienvenida diez resta un diez por ciento del subtotal, antes del envío, y un código desconocido da un error claro. Que investigue y prepare un plan con tests. Pro lee el carrito, los gastos de envío, los tests y el AGENTS punto md, busca quién usa cada función, y en poco más de un minuto escribe el plan en local y lo propone. Sin preguntas: tenía todo lo que necesitaba.

Un límite que conviene decir claro: planificar no es aislar. Las herramientas de escritura y edición se niegan a tocar el proyecto, pero el modo plan es una forma de trabajar, no un sandbox. No lo uses para abrir un repositorio en el que no confías. Para eso está el aislamiento del vídeo cinco, y los permisos de herramientas, que veremos en el vídeo diecinueve.

**3 · Revisar el plan**

Cuando el agente propone, se abre la revisión a pantalla completa. Arriba a la izquierda, el índice de secciones: contexto, enfoque, ficheros críticos, verificación, y supuestos y contingencias. En el centro, el plan entero. Y abajo, plan mode, next step, con las opciones. Es lo más parecido a revisar un pull request antes de que exista el código: es barato cambiar de idea ahora, y caro después.

Leemos el contexto y hay algo que no nos gusta. El carrito ya acepta un cupón como objeto, con un porcentaje, y el plan propone quitar esa forma y aceptar solo el código en texto. Los tests son los únicos que la usan, dice, así que no rompe nada. Puede que sea verdad hoy, pero no queremos cambiar una API pública por el camino.

Con tabulador pasamos al índice, y abajo cambian las teclas: a para anotar, e para editar, d para borrar, u para deshacer. Sobre contexto, pulsamos a y escribimos: no elimines la API de objeto; total con cupón debe seguir aceptando el porcentaje y además un código en texto. Enter guarda la nota.

Bajamos a verificación y anotamos otra cosa: añade un caso con un subtotal que no dé céntimos exactos, para comprobar el redondeo. Las notas aparecen debajo de cada sección, y en el índice las secciones anotadas llevan un lápiz. Volvemos a las opciones con tabulador y elegimos refine plan.

Las notas viajan al agente como respuesta. En pantalla se ven como un mensaje: refinement feedback on the plan, con cada nota bajo su sección. Pro rehace el plan y lo vuelve a proponer. Ahora el contexto dice que la API de objeto se conserva tal cual, y aparece una función auxiliar nueva que acepta un objeto o un código. Y en la verificación, un caso de veintinueve con noventa y nueve euros que debe dar veintiséis con noventa y nueve.

Ahora, las opciones. Approve and execute aprueba y empieza con el contexto vacío: el plan es lo único que pasa a la ejecución. Approve and compact context aprueba y compacta antes de ejecutar, y compactar gasta modelo. Approve and keep context lo conserva todo y te dice cuántos tokens llevas: aquí, unos treinta y cuatro mil de un millón. Refine plan pide otra vuelta. Y save and quit guarda el plan en un fichero y sale del modo plan sin ejecutar.

Fíjate en la línea de encima: continue with. Es un selector con los roles, smol, default y slow, que decide qué modelo ejecuta el plan aprobado, y debajo te dice cuál es. En el vídeo catorce, prewalk hacía ese cambio solo, en la primera edición. Aquí lo decides tú, con el plan delante. Si cierras la revisión con escape, sigues en modo plan, y barra plan review la reabre.

Tres detalles más. Al aprobar, si la sesión no tenía nombre, toma el título del plan. El ajuste plan autosave, apagado de fábrica, guarda cada plan aprobado en la carpeta punto omp barra plans del proyecto. Y para trabajar sin interfaz existe guion guion plan yolo: planifica en solo lectura, aprueba solo y ejecuta con el destino de guion guion plan yolo into, que por defecto es smol. Sin revisión humana, claro: úsalo solo con planes que no te importe rehacer.

Hoy elegimos save and quit, porque queremos ejecutar con presupuesto, y eso es otro modo. oh my pi propone una ruta dentro de la tienda, con un nombre sacado del título del plan, en mayúsculas y con guiones bajos: códigos de cupón plan punto md. Aceptamos. El aviso dice saved plan to y la ruta, y se abre una sesión nueva, ya fuera del modo plan, con Flash en el pie.

**4 · Objetivos con presupuesto**

El modo goal convierte una petición en un objetivo persistente. Cuando el agente cede el turno, oh my pi no te devuelve el control: le recuerda el objetivo y le pide que siga. Así, turno tras turno, hasta que el propio modelo lo da por cumplido con una herramienta que solo existe en este modo, goal. En el pie verás el objetivo y lo que lleva gastado.

Barra goal tiene subcomandos. Set fija o sustituye el objetivo. Show enseña el detalle. Pause lo detiene y resume lo retoma. Drop lo abandona, con confirmación. Y budget cambia el presupuesto, con un número de tokens u off. Desde la línea de comandos, guion guion goal arranca una sesión directamente en este modo.

Ahora, lo delicado. Barra goal con un objetivo escrito lo crea sin presupuesto y empieza a trabajar en el acto. Si después pides barra goal budget, durante ese rato el agente ha trabajado sin límite. Y no puedes pulsar escape para ganar tiempo, porque interrumpir pausa el objetivo. Por eso, para el trabajo de verdad, usamos el otro camino.

Barra guided goal hace que el agente te entreviste en el chat antes de fijar el objetivo, con una pregunta por turno. Busca cinco cosas: criterios de éxito que se puedan comprobar, cómo se comprueban, cuántos intentos admite, el alcance y cuándo debe parar. Lo que puede sacar del repositorio no te lo pregunta. Al terminar crea el objetivo con la herramienta goal, que sí admite un presupuesto desde el principio.

Escribimos barra guided goal, implementar el plan guardado en códigos de cupón plan punto md. Flash razona en voz alta qué le falta: la verificación la saca del repositorio, npm test, y el criterio de hecho, del AGENTS punto md. Primera pregunta, de seis como mucho: cuántos ciclos de implementar y probar autoriza antes de parar. Le damos cinco.

Segunda, el alcance: solo el plan, o también ajustes, documentación o tests extra. Solo el plan y sus pruebas, y si hay que tocar otro fichero, que pregunte. Tercera, las condiciones de parada. Elegimos decidir y documentar: ante una ambigüedad menor, la opción más conservadora, anotada en el resumen. Y añadimos: pon un presupuesto de doscientos mil tokens. Con eso tiene sus cinco campos.

Aparece la tarjeta de goal: set, activo, el objetivo, y debajo, cero de doscientos mil tokens. El presupuesto está desde el primer momento. Flash lee el plan, comprueba que los quince tests de partida pasan, hace los cambios en el carrito y sus tests, y verifica por consola los números del plan: diez por ciento, treinta y seis con cincuenta y tres, y veintiséis con noventa y nueve en el caso del redondeo.

Y cierra: la tarjeta de goal pasa a complete, con doce mil tokens de doscientos mil, ciento ochenta y ocho mil libres, en veintitrés segundos. Veintiún tests de veintiuno, y una tabla de comprobaciones. Una sola vuelta, sin reintentos. El presupuesto no hizo falta, pero estaba ahí.

¿Qué cuenta el presupuesto? Los tokens de entrada, los que se escriben en la caché y los de salida. Las lecturas de caché no cuentan, así que mide trabajo nuevo. Y al llegar al límite no corta en seco: el objetivo pasa a budget limited, el agente recibe un aviso para cerrar y oh my pi deja de pedirle que continúe. Recuerda también quién decide el final: el modelo, que puede declarar cumplido algo que no lo está.

**5 · Dirigir mientras trabaja**

Para ver cómo se dirige un objetivo en marcha, lanzamos otro, esta vez con barra goal a secas, sin presupuesto, a propósito: añade un segundo cupón, envío gratis, que deje a cero los gastos de envío sin tocar el subtotal, con sus tests. Y enseguida, barra goal show: el objetivo, el estado active, cero tokens, y entre paréntesis, no budget. Es justo el riesgo del que hablábamos.

Mientras Flash trabaja, mira encima del editor. Ahí está la lista de tareas, que el agente mantiene con la herramienta todo. Se organiza en fases, y cada tarea tiene un estado: pendiente, en curso, completada, abandonada o bloqueada. Cuando todas se cierran, la lista se esconde, pero sigue guardada en la sesión.

Barra todo te deja tocar esa lista a ti. Edit la abre en tu editor como Markdown, con casillas. Append añade una tarea, start la marca en curso, done la completa, drop la abandona y rm la quita. Probamos: barra todo append, documentación, explicar los cupones en el README. La línea gris confirma que se ha añadido, y la tarea aparece en una fase nueva de la lista.

La cola es la otra forma de dirigir. Si escribes y pulsas Enter mientras trabaja, tu mensaje le llega en el siguiente paso, entre herramientas: es guiar. Si lo encolas, espera a que el agente ceda el turno. Barra queue y el mensaje: cuando termines, dime en una línea qué ficheros has cambiado. El aviso dice queued message for when the agent yields, y abajo aparece after yield, uno, con el mensaje.

Y a veces quieres que todo se detenga sin perder nada. Barra pause congela al agente, a sus subagentes y al advisor en su siguiente punto seguro, sin abortar nada, hasta que reanudas. Es distinto de escape a secas, que interrumpe el turno y, en modo goal, pausa el objetivo.

Flash termina enseguida: veinticuatro tests de veinticuatro, la tarjeta en complete con catorce mil tokens en treinta y tres segundos. Y entonces llega el mensaje encolado, como un turno más: solo ha cambiado el carrito y sus tests. Nada más: src barra envio punto js y el resto del repositorio, intactos.

**6 · Por qué son excluyentes**

Con el segundo objetivo todavía activo, hicimos dos pruebas. Escribimos barra plan, y la respuesta fue un aviso: exit goal mode first, sal primero del modo goal. Y en el menú, plan decía blocked by goal mode. No es un error: es una regla del diseño.

La regla completa. El modo plan bloquea goal y vibe. El modo goal, activo o en pausa, bloquea plan y vibe. Y vibe bloquea a los otros dos. Para pasar de uno a otro, cierras el que tienes.

¿Por qué? Porque cada modo cambia dos cosas: las herramientas del agente y quién decide parar. Plan deja al agente en solo lectura y para en tu aprobación. Goal añade la herramienta goal y no para hasta que el modelo da el objetivo por cumplido o se acaba el presupuesto. Vibe le quita la edición y le da herramientas para dirigir a otros. Combinarlos sería pedirle a la vez que no toque nada, que siga sin preguntar y que no programe él.

La forma de usarlos juntos es encadenarlos, que es justo lo que hemos hecho: un plan revisado, guardado en un fichero, y un objetivo con presupuesto que lo ejecuta. Las demás piezas sí se combinan. La cola y la lista de tareas funcionan en cualquier modo. Y barra loop tampoco es excluyente.

**7 · Barra loop**

Barra loop activa el modo bucle. Mientras está activo, el mensaje que envíes se reenvía cada vez que el agente cede el turno. La diferencia con goal es de fondo. En goal, el modelo decide cuándo ha terminado. En loop, el modelo no decide nada: el mismo mensaje se repite hasta que algo de fuera lo para. Por eso un bucle sin límite es la forma más directa de gastar sin techo.

Hay tres formas de acotarlo. Un número: barra loop diez. Una duración: barra loop diez eme, en minutos, o en horas. Y una condición: guion guion while o guion guion until, seguido de un comando entre comillas. Con until, el bucle sigue mientras el comando falla, y para cuando sale con cero. Con while, al revés. Puedes combinar un número con una condición.

Dos matices de la condición. Se evalúa después de cada vuelta, nunca antes de la primera: la primera vuelta siempre ocurre. Y si el comando sale con un código raro, no arranca o tarda más de treinta segundos, el bucle se apaga con un error. Así un verificador roto no se convierte en un bucle infinito. Escape suspende el bucle, y barra loop otra vez lo apaga.

La demo. En la otra pestaña escribimos nosotros un test nuevo: el código bienvenida diez, escrito en minúsculas, también debe aceptarse. Ejecutamos node guion guion test: veinticuatro pasan, uno falla, y el código de salida es uno. Es lo que necesita until para seguir.

En oh my pi escribimos barra loop tres, guion guion until, node guion guion test, y el mensaje: ejecuta los tests y, si alguno falla, corrige el código de src, nunca los tests. El aviso dice loop mode enabled, limitado a tres iteraciones, tres restantes, continuando hasta que node guion guion test tenga éxito. Y el pie lo recuerda: loop running, tres de tres, until node guion guion test.

Flash ejecuta los tests, ve el fallo y corrige el carrito: el código se pasa a mayúsculas antes de buscarlo, y el mensaje de error sigue mostrando lo que escribió el usuario. Veinticinco de veinticinco. Y avisa de una cosa: la tarea del README que añadimos sigue pendiente, porque estaba fuera del alcance de la entrevista, y no la toca sin que se lo pidamos. Cede el turno, oh my pi ejecuta el comando, sale con cero, y la línea gris dice que la condición se cumple y que el modo bucle se apaga. Una sola vuelta. El tres era un techo, no un objetivo.

Entre vuelta y vuelta pasa algo más, y lo decide el ajuste loop mode. Prompt, el de fábrica, reenvía el mensaje sin más, así que el contexto crece en cada vuelta. Compact compacta antes de cada vuelta, como vimos en el vídeo trece, y eso gasta modelo. Y reset empieza de cero cada vez, como si cada vuelta fuera una sesión nueva; es la única opción que no se puede usar en vibe. Para un bucle corto como el nuestro, prompt basta.

Los riesgos, sin rodeos. La condición la escribes tú, y es tu verificador: si es floja, el bucle para en un resultado flojo. Un modelo con prisa podría cambiar el test en lugar del código, y por eso lo prohibimos en el mensaje y lo comprobamos con git diff: nuestro test sigue tal cual lo escribimos. Cuándo compensa un bucle lo veremos en el vídeo veinticinco.

**8 · Barra vibe**

El último modo es el más distinto. Con barra vibe, la sesión deja de programar y pasa a ser directora. Sus herramientas se reducen a leer, la lista de tareas, y cinco herramientas para manejar trabajadores: spawn para crearlos, send para mandarles un mensaje, wait para esperar a que terminen, kill para pararlos y list para ver cómo van.

Los trabajadores son agentes completos y persistentes, cada uno con su conversación. Hay dos tipos. Fast usa el modelo de smol, para trabajo mecánico y borradores. Good usa el rol task, para decisiones y para revisar lo que hizo fast. Empiezan en blanco, así que cada encargo tiene que explicarse solo: ficheros, restricciones y cómo se sabe que está hecho.

La directora reparte y, cuando llega un resultado, lo verifica leyendo los ficheros que tocaron. La documentación lo deja claro: que un trabajador termine solo significa que su turno acabó, no que lo que dice sea cierto. Para salir, barra vibe otra vez: se cancelan los trabajadores y el aviso te dice cuántos.

Hoy lo dejamos en la diapositiva, por coste. Cada trabajador es una conversación entera, con su contexto, y varios en paralelo multiplican el gasto en poco tiempo. Los subagentes, el Agent Hub y el trabajo en paralelo son el tema del vídeo dieciséis.

**9 · Repaso, práctica y cierre**

Repasemos. Barra plan, o alt mayúsculas pe, deja al agente en solo lectura con el modelo del rol plan. El plan se propone para revisión. En la revisión anotas por secciones, refinas, apruebas con o sin contexto, eliges con continue with qué rol lo ejecuta, o lo guardas y sales. Y recuerda que es una forma de trabajar, no un sandbox.

Barra guided goal te entrevista y fija el presupuesto desde el principio; barra goal a secas lo deja sin presupuesto. El presupuesto cuenta entrada, escritura de caché y salida, y frena sin cortar en seco. La lista de tareas y la cola dirigen sin interrumpir. Barra loop repite un mensaje, acotado por número, duración o un comando. Barra vibe dirige trabajadores. Plan, goal y vibe se encadenan, no se mezclan.

La práctica: en tu perfil de pruebas, asigna un modelo al rol plan y pide un plan para un cambio pequeño. Anota una sección con algo que no te convenza, refínalo y guárdalo con save and quit. Después, lanza barra guided goal para ejecutarlo, con un presupuesto decidido antes. Al terminar, compara los tokens con lo que habías previsto, y revisa el diff.

En el próximo vídeo, subagentes y trabajo en paralelo: la herramienta task y sus agentes, el Agent Hub, tus propios agentes, agentes en segundo plano con barra tan y los trabajos con barra jobs. Nos vemos allí.

</details>

