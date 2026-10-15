---
title: "Vídeo 12 · La TUI y las sesiones"
description: "atajos, selector de comandos y todas las formas de rebobinar, bifurcar y retomar una sesión en omp."
ruta: "pi-oh-my-pi"
orden: 12
duracion: "25 min"
video: "12-la-tui-y-las-sesiones.mp4"
---

atajos, selector de comandos y todas las formas de rebobinar, bifurcar y retomar una sesión en omp.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que ya sabes del árbol

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Pi, vídeo 03:** JSONL (un árbol) → /tree (saltar) → /fork · /clone (fichero nuevo) → /resume (cambiar de sesión)
- **oh my pi: mismo árbol, otros movimientos**
  - `/branch` · Rebobinar: en el menú, /rewind
  - `/tree` · Navegar: otro comportamiento por defecto
  - `/fork` · Bifurcar: solo se parece en el nombre
- **Hoy:** Atajos (y selector) → Mirar (y nombrar) → Volver atrás (branch · tree · fork) → Cambiar (de sesión) → Empezar de cero (y mantenimiento)
- **Perfil demo · DeepSeek V4.1 Flash:** Hoy no se edita ningún fichero — Todo el código va en las respuestas: rebobinar no deja el disco desfasado.

### 2 · Atajos y selector de comandos

<p><button type="button" class="ir-a" data-t="111">▶ Ir a 1:51</button></p>

- **Ya los conoces (vídeo 11)**
  - `Esc` · Parar
  - `Ctrl+Q` · Encolar
  - `Alt+M` · Modelo
  - `⇧Tab` · Thinking
  - `Ctrl+O` · Herramientas
- **Borradores que no se pierden**
  - `Ctrl+C` · Vacía el editor
  - `↑` · Lo recupera: con imágenes y pegados
  - `100` · Borradores: solo mientras está abierto
- **Más espacio, menos ruido**
  - `Ctrl+G` · $EDITOR: mensajes largos
  - `Ctrl+T` · Thinking: ocultar o mostrar
  - `Ctrl+⇧+O` · Herramientas: esconder actividad
  - `Ctrl+R` · Historial: el del perfil
- *En terminal:* Atajos con comando (más abajo, en «Código y comandos»)
- **/settings · Input:** Modo Vim — Apagado de fábrica. Movimientos, borrados y objetos de texto; nunca roba los atajos con Ctrl.
- *En la demo:* Las descripciones dicen el estado
- *En la demo:* /re filtra el menú

### 3 · Mirar la sesión y ponerle nombre

<p><button type="button" class="ir-a" data-t="289">▶ Ir a 4:49</button></p>

- **Tres peticiones sin editar:** T1 (resumir envio.js) → T2 (gratis desde 50 €) → T3 (+3 € urgente)
- *En la demo:* El código, en la respuesta
- *En la demo:* Título automático: una llamada extra
- *En la demo:* /session
- *En la demo:* Mensajes, tokens y coste
- **/session tiene subcomandos (solo diapositiva)**
  - `/session delete` · Borra la sesión: no se deshace
  - `/session pin` · Fija una cuenta: enseña cuentas · no es /pin
- *En la demo:* /rename envio-umbrales
- **Para qué:** Un nombre se encuentra solo — Una sesión sin nombre es una línea más con la fecha.

### 4 · Rebobinar con /branch

<p><button type="button" class="ir-a" data-t="462">▶ Ir a 7:42</button></p>

- **La idea:** T1 (resumen) → T2 (gratis desde 50) → T3 (+3 € urgente) → T2′ (2,95 € entre 25 y 40)
- *En la demo:* /branch · /rewind
- *En la demo:* ↑/↓ paso · ←/→ tus mensajes · f filtro · ⏎ rebobina
- *En la demo:* Contorno punteado sobre T2
- *En la demo:* Rewound to selected point
- *En la demo:* La petición nueva: 2,95 €
- **En el fichero:** Nada se ha borrado — La rama del umbral de 50 sigue ahí; la nueva cuelga del mismo punto, como una hermana.
- **Qué eliges al rebobinar**
  - `tu mensaje` · Vuelve al editor: para reescribirlo
  - `respuesta` · Editor vacío: la rama sale desde ahí
- **Frente a Pi**
  - `sin resumen` · Inmediato: no gasta modelo
  - `Esc Esc` · Abre el rewind: doubleEscapeAction: rewind · tree · none
- *En la demo:* Esc Esc · las dos ramas lado a lado

### 5 · Navegar con /tree

<p><button type="button" class="ir-a" data-t="642">▶ Ir a 10:42</button></p>

- *En la demo:* /tree
- **Filtros del árbol**
  - `default` · Por defecto
  - `Alt+T` · Sin tool results
  - `Alt+U` · Solo tuyos
  - `Alt+L` · Etiquetadas
  - `Alt+A` · Todo
- *En la demo:* ⇧L · etiqueta umbral-50
- *En la demo:* Enter salta sin preguntar · ⇧Enter resume y salta
- **branchSummary.enabled: false:** Moverse no cuesta — Pero la rama nueva no sabe que la otra existió.
- *En la demo:* Solo conoce su rama
- **Vídeo 03:** En el fichero ≠ lo que ve el modelo — La otra rama está etiquetada y a un Enter, pero no viaja en la petición.
- **Apunte honesto:** La hoja no se guarda — Al cargar, la sesión vuelve a la última entrada escrita. Tras moverte, envía algo.
- **Lo que no cambia**
  - `git` · El código: el árbol no deshace ficheros
  - `rewind` · Otra cosa: herramienta de checkpoints, apagada

### 6 · Bifurcar con /fork

<p><button type="button" class="ir-a" data-t="854">▶ Ir a 14:14</button></p>

- *En la demo:* ls $S
- *En la demo:* jq: tipo, id y parentId
- **/fork:** Sin selector — Duplica la sesión entera, con todas sus ramas, en un fichero nuevo.
- *En la demo:* El comando ya lleva --profile demo
- *En la demo:* wc -l: 20 y 20
- **Sin /clone: una rama a su fichero:** /fork (copia todo) → /tree (elige la rama) → Sigue (desde ahí)
- **Tres formas de volver atrás**
  - `/branch` · Rebobina: mismo fichero · sin resumen · Pi: no existía
  - `/tree` · Navega: mismo fichero · resumen solo con ⇧Enter · Pi: preguntaba
  - `/fork` · Duplica: fichero nuevo, entero · Pi: desde un mensaje

### 7 · Cambiar de sesión: /resume y /pin

<p><button type="button" class="ir-a" data-t="1015">▶ Ir a 16:55</button></p>

- **/pin:** Session pinned — Arriba de la lista de /resume. Otra vez /pin la desfija.
- *En la demo:* /resume
- *En la demo:* Tab y Supr: no en cámara
- *En la demo:* /resume
- *En terminal:* Dónde viven las sesiones (más abajo, en «Código y comandos»)
- *En terminal:* Retomar desde la terminal (más abajo, en «Código y comandos»)

### 8 · Empezar de cero sin perderlo todo

<p><button type="button" class="ir-a" data-t="1149">▶ Ir a 19:09</button></p>

- **Cuatro formas de empezar de cero**
  - `/fresh` · Proveedor
  - `/clear` · Contexto
  - `/new` · Sesión
  - `/delete` · Borrar
- *En la demo:* /fresh
- *En la demo:* /clear
- *En la demo:* Sin memoria de lo anterior
- *En la demo:* /tree · Alt+A
- *En la demo:* /new
- **/delete · solo diapositiva:** No se deshace — Borra la sesión, su fichero y sus artefactos.
- **Cuál usar**
  - `/clear` · Mismo trabajo: mente despejada
  - `/new` · Otro trabajo
  - `/fresh` · El proveedor: falla o se atasca

### 9 · Reintentar, reiniciar, mover y cierre

<p><button type="button" class="ir-a" data-t="1321">▶ Ir a 22:01</button></p>

- *En la demo:* /retry · F5 · antes, hasta 10 reintentos automáticos
- *En la demo:* /restart · mismos flags
- *En terminal:* /move (no grabado) (más abajo, en «Código y comandos»)
- **Repaso:** Atajos (y selector) → /session (/rename) → /branch (rebobina) → /tree (navega) → /fork (duplica)
- **Y dos límites honestos**
  - `ficheros` · El árbol no los deshace
  - `hoja` · Un salto no se guarda: hasta que escribes algo
- **Práctica:** Tres turnos (sin editar) → Esc Esc (y reescribe) → /tree (etiqueta y pregunta) → /fork (wc -l) → /clear (y pregunta)
- **Próximo vídeo:** Contexto y memoria — /context, /compact, /shake, /handoff, memoria entre sesiones y /btw.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Atajos con comando

```text
F5 · Alt+R        /retry: reintenta el último turno fallido
Alt+↑             saca de la cola un mensaje encolado
# keybindings.yml: tecla para acciones de sesión (sin tecla de fábrica)
```

- `F5 · Alt+R`: /retry
- `Alt+↑`: Desencolar
- `keybindings.yml`: Tus teclas

### Dónde viven las sesiones

```text
~/.omp/profiles/demo/agent/sessions/
  -csn-tienda/
    2026-10-06T11-39-15-275Z_<id>.jsonl
# autoResume: false (de fábrica)
```

- `sessions/`: Por carpeta
- `.jsonl`: Una por sesión
- `autoResume`: Retomar al arrancar

### Retomar desde la terminal

```text
omp --profile demo -c            # continúa la última
omp --profile demo -r [id]       # selector o una sesión
/resume @claude · /resume @codex # solo diapositiva
```

- `-c`: Continuar
- `-r`: Elegir
- `@claude`: Importar

### /move (no grabado)

```text
/move                       # buscador de rutas
/move ~/csn/tienda-b         # pregunta si no existe
# mueve sesión y artefactos; recarga ajustes, skills y comandos
```

- `/move`: Buscador
- `ruta`: Directo
- `recarga`: Del proyecto nuevo

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh); `omp read omp://…` en 18.6.1 da `tree.md`,
  `session-tree-plan.md`, `session-operations-export-share-fork-resume.md` y `keybindings.md` idénticos):
  - `tree.md`: `/tree` frente a `/branch`, `/fork` y `/resume` («`/tree` and `/branch` navigate inside one session
    file. `/fork` duplicates the file; `/resume` switches files»); rewind a pantalla completa (unas 600 entradas, `a`,
    `f`, izquierda/derecha); teclas del árbol (`Ctrl+O` cicla filtros, `Alt+D/T/U/L/A`, `Shift+L`, `Shift+Enter`);
    `branchSummary.enabled` (`false` por defecto); qué pasa al elegir un mensaje del usuario o cualquier otra entrada.
  - `session-tree-plan.md`: rewind llama a `navigateTree(…, { summarize: false })`; `doubleEscapeAction` (`rewind`,
    `tree`, `none`); la API `AgentSession.branch()` sí crea otro fichero (origen de la confusión).
  - `session.md`: ruta `~/.omp/agent/sessions/<cwd codificado>/<timestamp>_<id>.jsonl`, ranura de título de 256 bytes,
    cabecera con `parentSession`, `title_change` y `/rename` (roles `tiny`, `commit`, `smol`), `reset_boundary`, y
    «There is no separate persisted leaf field: loading rebuilds the leaf from the last physical entry».
  - `session-operations-export-share-fork-resume.md`: matriz de operaciones; `/new`, `/delete`, `/fresh`, `/clear`,
    `/fork` (`SessionManager.fork()` conserva todas las entradas, `parentSession`, hereda la clave de caché), `--fork`
    (copia completa), `AgentSession.fork(entryId)` y RPC `fork` (desde una entrada), `/resume` con argumento,
    `/restart` (conserva los flags y añade `--resume <id>`).
  - `session-switching-and-recent-listing.md`: selector de `/resume` (fijadas primero, marca `current`, `Tab` para todos
    los proyectos, `Delete` o `Backspace` con búsqueda vacía borra tras confirmar, búsqueda con `history.db`).
  - `keybindings.md`: `Ctrl+R`, `Ctrl+G`, `Ctrl+T`, `Ctrl+Shift+O`, `Alt+Up`, `F5`/`Alt+R`, `Ctrl+C` y flecha arriba
    para recuperar un borrador (100 entradas, `composer.recallClearedDrafts`), `keybindings.yml` (los perfiles heredan
    del perfil por defecto), modo Vim (`tui.vimMode`, Interaction → Input).
  - `non-compaction-retry-policy.md`: reintento automático (`retry.enabled`, `retry.maxRetries` 10,
    `retry.baseDelayMs` 500, tope de 8 s con *jitter*), errores que no se reintentan (desbordamiento de contexto → vídeo
    13).
  - `slash-command-internals.md` (§1 y §4: los integrados se reservan antes que los de ficheros; el autocompletado
    combina fuentes), `settings.md` (`doubleEscapeAction`, `autoResume`, migración `branch` → `rewind`),
    `environment-variables.md` y `rpc.md` (título automático en el primer mensaje: «an extra model call»,
    `PI_NO_TITLE`), `cli-reference.md` (`--no-title`).
  - `tui.md` (consultado: es el contrato de componentes para extensiones; sin datos para la locución).
- Código fuente 18.5.1 (`~/orca/oh-my-pi`, tag `v18.5.1`, `packages/coding-agent/src/`):
  `slash-commands/builtin-session.ts` (`/session`, `/branch` → `showUserMessageSelector`, `/fork` →
  `handleForkCommand`, `/tree`), `slash-commands/builtin-lifecycle.ts` (`/new`, `/fresh`, `/clear`, `/delete`,
  `/resume`, `/pin`, `/rename`, `/move`, `/restart`, `/retry`, con sus textos «Session pinned to the top of the resume
  list.», «Nothing to retry.», «Could not generate a session title…»), `modes/controllers/command-controller.ts`
  (`handleSessionCommand`: File, ID, Provider, Messages, Tokens, Cost; `handleForkCommand`: «Session forked · return to
  original: omp --profile demo --resume <id> or /resume <id>»; `handleMoveCommand`),
  `modes/controllers/selector-controller.ts` (`#rewindFromTranscript`: «Rewound to selected point», «Already at this
  point»), `session/session-manager.ts` (`fork()` copia el fichero entero), `utils/resume-command.ts` (añade
  `--profile` al comando sugerido), y `packages/tui/src/overlays/rewind-selector.ts` (pantalla completa, contorno
  punteado, tira de ramas con izquierda/derecha, botones «Cancel» y «Rewind here»).
  **Comprobado en el binario 18.6.1** (`strings`): mismos textos de `/fork`, rewind y `/retry`, y `/fork` sigue
  llamando a `session.fork()` sin elegir mensaje. No existe un comando `/clone`.
- `omp --help` (18.6.1): `-c`, `-r/--resume`, `--session-dir`, `--no-session`, `--no-title`, `--export`.
- Vídeos anteriores: 03 (árbol JSONL en Pi, `/tree` con «Summarize branch?», `/fork` desde un mensaje, `/clone`,
  `/resume`, `/name`, `Esc Esc` abre `/tree`, «el árbol mueve la conversación, no tus ficheros»), 04 (caché), 09 (estado
  de extensiones al rebobinar con `/tree`), 11 (perfil `--profile demo`, `PI_CODING_AGENT_DIR` en el pane, «o eme pe»,
  DeepSeek V4.1 Flash, `/hotkeys` con `Esc`, `Ctrl+Q`, `Alt+M`, `Shift+Tab`, `Ctrl+O`, `Alt+A`, `Esc Esc`; cierra anunciando
  «la diferencia entre rebobinar, bifurcar y navegar el árbol, con barra branch, barra fork y barra tree»).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que ya sabes del árbol**

En el vídeo tres abrimos Pi por dentro y vimos que una sesión no es una lista de mensajes, sino un árbol guardado en un fichero JSONL. Cada entrada apunta a su padre, y la hoja en la que estás decide qué rama ve el modelo. Con barra tree saltábamos a un punto anterior, con barra fork y barra clone sacábamos una alternativa a un fichero nuevo, y con barra resume cambiábamos de sesión.

oh my pi hereda ese árbol, con el mismo formato de fondo. Lo que cambia es la forma de moverse por él. Hay un comando nuevo para rebobinar, barra branch, que en el menú aparece como barra rewind. Barra tree sigue ahí, pero con otro comportamiento por defecto. Y barra fork se parece a la de Pi solo en el nombre. Esa es la parte central de este vídeo.

Antes de llegar ahí, dos cosas más de la interfaz. Unos cuantos atajos que no vimos en el vídeo once, y el selector de comandos, que con ochenta y cinco comandos integrados merece que sepas leerlo. Después, los comandos de sesión: los de mirar y nombrar, los de volver atrás, los de cambiar de sesión, los de empezar de cero y tres de mantenimiento.

Trabajamos como en el vídeo anterior: en la tienda, con el perfil demo y DeepSeek V cuatro punto uno Flash. Hoy no vamos a editar ningún fichero. Todas las peticiones piden el código en la respuesta. Así, cuando rebobinemos, el disco no se quedará desfasado respecto a la conversación, que es el problema que vimos en el vídeo tres. Y cuando algo gaste modelo, te lo diremos.

**2 · Atajos y selector de comandos**

En el vídeo once recorrimos barra hotkeys: escape para parar, control q para encolar, alt m para el modelo, mayúsculas tab para el thinking, control o para desplegar herramientas. Hoy añadimos los que más se usan cuando una sesión crece. Ninguno llama al modelo.

El primero salva borradores. Escribes un mensaje largo, cambias de idea y pulsas control c: el editor se vacía. Si te arrepientes, la flecha arriba lo recupera, con sus imágenes y sus pegados. Guarda hasta cien borradores mientras oh my pi está abierto, y no los escribe en el historial permanente. Si no te gusta, se desactiva en barra settings, en la parte de entrada de la pestaña de interacción.

Para mensajes largos de verdad, control g abre el borrador en tu editor de texto, el de la variable EDITOR, y al cerrarlo vuelve al editor de oh my pi. Control t oculta o muestra los bloques de thinking, útil cuando el razonamiento ocupa más que la respuesta. Y control mayúsculas o esconde la actividad de las herramientas. Control erre busca en el historial de prompts; el perfil demo tiene el suyo propio, así que ahí no se cuela nada de tu trabajo real.

Dos más que vienen con su comando. Efe cinco, o alt erre, reintenta el último turno que falló: es barra retry, y lo veremos al final. Y alt flecha arriba saca de la cola un mensaje que habías encolado y lo devuelve al editor. Las acciones de sesión, como abrir el árbol, bifurcar o retomar, no tienen tecla de fábrica. Si las usas mucho, puedes asignarles una en keybindings punto yml, con su nombre de acción.

Y si vienes de Vim, hay un modo de edición al estilo Vim para el editor, apagado de fábrica. Se activa en barra settings, en la parte de entrada. Escape pasa al modo normal y el borde del editor cambia de color para que sepas dónde estás. No es Vim completo, pero cubre movimientos, borrados y objetos de texto, y nunca roba los atajos con control.

Ahora el selector de comandos. Escribes una barra y aparece el menú. Fíjate en las descripciones: muchas no explican el comando, sino que te dicen su estado. Barra tools dice cuántas herramientas tienes activas, doce de veinte disponibles. Barra plan dice off, y barra vibe, también off. Es una forma rápida de ver cómo está la sesión sin abrir nada.

Si sigues escribiendo, el menú se filtra. Con barra r e aparecen rewind, resume, retry, rename y restart, entre otros. Rewind rebobina a un mensaje anterior conservando el camino viejo como rama. Rename avisa de que, sin título, lo genera. Y restart reinicia con los mismos flags y retoma esta sesión. Un detalle más: los comandos integrados se reservan su nombre antes que los de tus ficheros, así que un comando propio no puede tapar a barra tree.

**3 · Mirar la sesión y ponerle nombre**

Hacemos tres peticiones baratas. Primera: lee src barra envio punto js y resume en tres líneas cómo se calculan los gastos de envío, sin editar nada. Segunda: escribe en la respuesta una versión de gastos envío con envío gratis desde cincuenta euros. Tercera: añádele un recargo de tres euros para pedidos urgentes. Ninguna toca el disco.

DeepSeek contesta con el código, una tabla con los cuatro casos y una nota honesta: los tests actuales fijan el umbral en cuarenta euros, así que esta versión los rompería si se aplicara. Por eso pedimos las respuestas en pantalla y no en el disco.

Fíjate en la esquina derecha, encima de la línea de estado. Tras la primera respuesta, la sesión ya tiene nombre sin que lo pidamos: resumir cálculo de gastos de envío. oh my pi genera un título automático con el primer mensaje. Es cómodo, pero conviene saber que es una llamada extra al modelo, con un rol pensado para tareas pequeñas. Si no la quieres, existe guion guion no title.

Barra session nos enseña la ficha de la sesión. Arriba, la ruta del fichero y el identificador; la ruta la difuminamos porque incluye la carpeta personal. Después, el proveedor: deepseek, el modelo, la API compatible con OpenAI, y de dónde sale la clave: una variable de entorno. Si tu proveedor enseñara aquí una cuenta, esta pantalla no se compartiría tal cual.

Luego el recuento de mensajes: tres tuyos, cuatro del asistente, que son más porque leer el fichero cuenta, y una llamada a herramienta con su resultado. Ocho en total. Al final, los tokens: setecientos setenta y dos de entrada, unos mil trescientos de salida y más de treinta y cuatro mil leídos de caché. Coste total, una décima de céntimo. Es la versión ampliada del barra session de Pi del vídeo tres.

Barra session tiene dos subcomandos que no vas a ver aquí. Delete borra la sesión. Y pin, con una cuenta, fija el proveedor a una cuenta concreta de las que tengas guardadas, así que enseña cuentas. No lo confundas con barra pin, a secas, que veremos enseguida y no tiene nada que ver.

En Pi, el nombre se ponía con barra name. Aquí es barra rename. Con un título, lo fija sin gastar nada: barra rename envio guion umbrales, y la línea de estado confirma session renamed. Sin título, genera uno a partir de la conversación, y eso sí llama al modelo. Un nombre puesto por ti tiene prioridad: el título automático ya no lo sobrescribe.

¿Para qué tanto nombre? Porque en un par de minutos vamos a tener varias ramas y varios ficheros, y el selector de barra resume enseña los títulos. Una sesión llamada envío umbrales se encuentra sola. Una sesión sin nombre es una línea más con la fecha.

**4 · Rebobinar con barra branch**

Ahora, la situación que motiva todo esto. La versión con envío gratis desde cincuenta euros está bien, pero queremos probar otra idea desde ese mismo punto: un envío reducido entre veinticinco y cuarenta euros. No queremos pedirle que deshaga lo anterior. Queremos volver al momento de la segunda petición y escribirla de otra forma.

Barra branch, o barra rewind, que es lo mismo. La pantalla cambia entera. Arriba dice rewind: elige el punto desde el que continuar. Debajo aparece la conversación tal como la ves, con un contorno punteado sobre uno de sus bloques. No es una lista aparte de mensajes sueltos, como el barra fork de Pi; es la propia conversación, y eliges el punto mirándola.

Abajo tienes la barra de teclas. Arriba y abajo avanzan paso a paso. Izquierda y derecha saltan entre tus mensajes. Efe filtra por texto, útil en sesiones largas. Control o despliega lo que está plegado. Escape cancela. Y Enter rebobina hasta el bloque marcado. Subimos hasta nuestra segunda petición, la del umbral de cincuenta, y pulsamos Enter.

Vuelve la pantalla normal, la conversación termina justo antes de esa petición, y la línea de estado dice rewound to selected point. El texto de la petición está otra vez en el editor, listo para cambiarlo. Lo sustituimos: un envío de dos euros con noventa y cinco entre veinticinco y cuarenta euros, sin editar ficheros. Y lo enviamos.

¿Qué ha pasado en el fichero? Nada se ha borrado. La rama del umbral de cincuenta sigue ahí, con su recargo de urgencia, y nuestra nueva petición cuelga del mismo punto como una hermana. Es exactamente lo que dice la descripción del menú: rebobinar conservando el camino viejo como rama. Todo dentro del mismo fichero de sesión.

Si eliges una respuesta del asistente en lugar de un mensaje tuyo, el comportamiento cambia un poco. Te quedas justo después de esa respuesta, con el editor vacío, y lo siguiente que escribas abre la rama desde ahí. Sirve cuando la respuesta era buena y lo que quieres cambiar es la siguiente pregunta.

Dos diferencias con Pi que conviene tener claras. Rebobinar nunca hace un resumen de la rama que dejas: es inmediato y no gasta. Y el atajo de escape dos veces, con el editor vacío, abre este selector, no el árbol como en Pi. Si lo prefieres a la antigua, el ajuste double escape action admite rewind, tree o none.

Probamos el atajo. Escape, escape, y el mismo selector. Al subir hasta el punto donde se separan las ramas pasa algo nuevo: la pantalla se divide en dos columnas. A la izquierda, uno de dos, la rama actual, con el envío reducido. A la derecha, dos de dos, la del umbral de cincuenta. Con izquierda y derecha cambias de rama y comparas las dos versiones lado a lado, sin salir. Escape, y seguimos.

**5 · Navegar con barra tree**

Barra branch es la herramienta rápida. Barra tree es el mapa. Abre el árbol de la sesión entera, con todas las ramas, y la entrada en la que estás resaltada. El funcionamiento lo conoces del vídeo tres, así que vamos a lo que cambia en oh my pi. Arriba tienes la línea de ayuda, y conviene leerla entera.

Lo primero, los filtros. Control o los recorre en orden: el modo por defecto, sin resultados de herramientas, solo tus mensajes, solo las entradas etiquetadas, y todo. Y con alt más una letra saltas directo a uno: de, te, u, ele o a. Ojo, porque control o, fuera del árbol, despliega herramientas. Dentro del árbol, las teclas significan otra cosa.

Las etiquetas funcionan como en Pi. Nos situamos en la última respuesta de la rama del umbral de cincuenta, pulsamos mayúsculas ele, y en el campo de etiqueta escribimos umbral guion cincuenta. La etiqueta aparece entre corchetes delante de la respuesta. Desde ahora, el filtro de etiquetadas nos lleva a ella en un segundo.

Y lo segundo, el cambio que más se nota. Pulsamos Enter sobre esa respuesta y saltamos, sin ninguna pregunta. La línea de estado dice navigated to selected point. En Pi, cada salto te ofrecía resumir la rama que abandonabas. En oh my pi, esa pregunta viene desactivada. Si quieres el resumen, la ayuda lo dice: mayúsculas Enter resume y salta. Y si activas el ajuste branch summary enabled, vuelve la pregunta del vídeo tres.

¿Por qué desactivarlo? Porque un resumen es una llamada al modelo, y la mayoría de los saltos son para mirar o para probar algo rápido. Así, moverse por el árbol no cuesta nada salvo que lo pidas. La contrapartida: la rama nueva no sabrá que la otra existió. El modelo solo recibe el camino desde la raíz hasta la hoja, sin resúmenes de por medio.

Lo comprobamos. Volvemos con barra tree a la última respuesta de la rama de dos con noventa y cinco y le pedimos que resuma en una línea la diferencia entre las dos versiones que hemos escrito. Contesta que la nueva añade un tramo intermedio, de veinticinco a cuarenta euros, que pasa de pagar cuatro noventa y cinco a dos noventa y cinco. Compara con el código original. De la versión del umbral de cincuenta, ni una palabra.

Y tiene razón desde lo que ve. Para él solo hemos escrito una versión: la de esta rama. La otra está en el fichero, etiquetada y a un Enter de distancia, pero no viaja en la petición. Es la idea del vídeo tres: lo que está en el fichero y lo que ve el modelo no son lo mismo. Si quieres que una rama sepa de la otra, tienes que contárselo, o pedir el resumen al saltar.

Ese mensaje tiene además una función práctica, y es un apunte honesto. El fichero no guarda en qué hoja estás. Al cargar una sesión, oh my pi coloca la hoja en la última entrada escrita. Si rebobinas o saltas y cierras sin escribir nada, al volver estarás donde estabas antes del salto. Por eso, después de moverte, envía algo antes de cerrar, de retomar o de bifurcar.

Y lo que tampoco cambia respecto a Pi: barra branch y barra tree mueven la conversación, no tus ficheros. Por eso hoy no editamos nada. Con ediciones de por medio, la receta es la del vídeo tres: git para el código y el árbol para la conversación. Un último aviso para no confundirte: oh my pi tiene también una herramienta llamada rewind, para puntos de control, que viene apagada. No tiene relación con el comando.

**6 · Bifurcar con barra fork**

Hasta aquí, todo ha pasado en un único fichero. En la otra pestaña lo comprobamos. En la carpeta de sesiones de la tienda hay dos ficheros: el del vídeo once y el de hoy, uno solo, aunque ya tenga dos ramas. Barra fork es la que crea ficheros.

Antes, miremos dentro del de hoy. Con jq sacamos de cada línea el tipo, el identificador y el padre. Los mensajes se encadenan: cada uno apunta al anterior por su parent id. Ahí se ve la bifurcación: un mensaje cuyo padre no es la línea anterior, sino una respuesta muy de atrás, la del primer turno. Y la etiqueta es una entrada propia, de tipo label, con un target id que apunta a la respuesta etiquetada. El fichero solo crece; nunca se reescribe.

Volvemos a oh my pi y lanzamos barra fork, justo después de nuestro último mensaje. Y aquí está la sorpresa para quien viene de Pi: no aparece ningún selector. En Pi, barra fork te pedía elegir un mensaje y copiaba el camino hasta él. En oh my pi, barra fork duplica la sesión entera, con todas sus ramas, en un fichero nuevo, y te cambia a él.

La respuesta dice session forked, y te da dos formas de volver a la original: el comando completo para la terminal, que ya incluye guion guion profile demo, y un barra resume con su identificador. Es un detalle cuidado: sin el perfil, oh my pi buscaría la sesión en el directorio por defecto y no la encontraría.

En la otra pestaña contamos las líneas de cada fichero. La sesión original tiene veinte. El fork, también veinte. Es una copia completa, con la rama abandonada, la etiqueta y los títulos, no un recorte desde un mensaje. La descripción del menú habla de un mensaje anterior, pero lo que hace es copiar todo.

Entonces, ¿cómo saco solo una rama a un fichero aparte, como hacía barra clone en Pi? oh my pi no tiene barra clone. La forma natural es esta: haces fork, y en la copia te mueves con barra tree a la rama que quieres y sigues desde ella. Las otras siguen en el fichero, pero no viajan al modelo. Bifurcar desde una entrada concreta sí existe, pero en el modo RPC y en el SDK, que son terreno del vídeo veintiuno.

En resumen, tres operaciones con tres alcances. Barra branch rebobina dentro del fichero, sin resumen y sin coste. Barra tree navega el árbol dentro del fichero, con filtros, etiquetas y un resumen solo si lo pides. Y barra fork duplica el fichero entero para que sigas por tu cuenta. Tienes la tabla en pantalla, con la columna de Pi al lado.

**7 · Cambiar de sesión: barra resume y barra pin**

Con dos sesiones de hoy y la del vídeo once, ya tiene sentido barra pin. Fija una sesión arriba de la lista de barra resume. Sin argumentos, fija la actual; con un identificador, cualquier otra. La lanzamos en el fork y nos responde que la sesión queda fijada arriba de la lista. Volver a lanzarla la desfija.

Barra resume abre el selector a pantalla completa, con las sesiones de esta carpeta. Arriba, con una chincheta, el fork: envío umbrales, su primer mensaje, hace un momento, quince kilobytes y medio, y tres marcas, current, done y fork. Debajo, la original, con el mismo título. Y al final, la del vídeo once, con el título que le puso el modelo.

Abajo, las teclas del selector, y tres que en una grabación no vas a ver pulsadas. Tab cambia a las sesiones de todos los proyectos, y eso enseñaría trabajo de otras carpetas. La búsqueda también consulta el historial de prompts. Y suprimir, o borrar con la búsqueda vacía, elimina la sesión seleccionada, después de pedir confirmación. Salimos con escape.

Con argumento, barra resume salta directo, sin selector. Le damos el identificador de la original, el que nos dio barra fork, y la línea de estado dice resumed session. La conversación se reconstruye desde su fichero y quedamos en la última entrada escrita: la respuesta sobre la diferencia entre versiones. Lo que te decíamos de la hoja, en directo.

¿Dónde viven todas estas sesiones? En la carpeta del perfil, dentro de sessions, con una subcarpeta por cada directorio de trabajo y un fichero JSONL por sesión, cuyo nombre empieza por la fecha. Por eso barra resume enseña primero las de la carpeta actual. Y si quieres que oh my pi retome por su cuenta la última sesión de la carpeta al arrancar, existe el ajuste auto resume, que viene apagado.

Desde la terminal tienes lo mismo que en Pi: guion c continúa la última sesión, y guion erre abre el selector o retoma la que le indiques. Y arroba claude y arroba codex importan sesiones de esas herramientas, como vimos en el vídeo once. Eso solo lo enseñamos en diapositiva, porque lista tus sesiones reales.

**8 · Empezar de cero sin perderlo todo**

A veces no quieres volver atrás, sino quitarte de encima lo que llevas. oh my pi tiene cuatro comandos para eso, y se parecen lo bastante como para confundirlos. La diferencia está en qué conservan: el fichero, lo que ve el modelo o lo que guarda el proveedor.

Barra fresh es el más raro de los cuatro, y el más útil cuando algo falla. No toca ni la pantalla, ni el fichero, ni lo que ve el modelo. Lo que reinicia es el estado del lado del proveedor. Lo lanzamos en el fork y la respuesta es escueta: sesión del proveedor nueva, un estado descartado. La conversación sigue igual. Úsalo cuando el proveedor parece atascado o da errores que no se explican por tu conversación.

Barra clear vacía el contexto del modelo sin cambiar de sesión. Lo lanzamos en la original. La pantalla se limpia y la línea de estado lo resume muy bien: contexto reiniciado, ocho mensajes descartados, la sesión continúa. El fichero es el mismo, con el mismo nombre, que sigue en la esquina. oh my pi añade una entrada que marca la frontera, y desde ahí reconstruye lo que ve el modelo.

Lo comprobamos. Preguntamos qué umbral de envío gratis habíamos propuesto antes, en una línea y sin leer ficheros. La respuesta: no tiene constancia, para él la sesión empieza ahora y no puede citar un umbral sin inventarlo. Y se ofrece a mirarlo en el código o en el historial de git. Exactamente lo que queríamos ver: honesto y sin memoria de lo anterior.

Pero la historia no se ha ido. Abrimos barra tree y pulsamos alt a, para ver todas las entradas. Ahí está todo: el modelo y el nivel de thinking, los títulos, la lectura del fichero, las dos ramas, la etiqueta umbral cincuenta, y en medio, una entrada que dice reset boundary. Debajo, nuestra pregunta nueva. Barra clear sirve para cambiar de tema en la misma sesión sin arrastrar el contexto.

Barra new es el más simple: una sesión nueva, en un fichero nuevo, con el mismo modelo y los mismos ajustes. La línea de estado dice new session started. La anterior queda intacta en la lista de barra resume. Es lo que harías al cambiar de tarea.

Y el cuarto, barra delete, borra la sesión actual, su fichero y sus artefactos, y abre una nueva. No se puede deshacer, así que en este curso solo lo ves en diapositiva, y en tu día a día úsalo solo sobre sesiones que de verdad no quieras. Desde el selector de barra resume se puede borrar igual, con confirmación.

Ninguno de los cuatro gasta modelo por sí mismo. Y una pista para elegir: si quieres seguir el mismo trabajo con la mente despejada, barra clear; si cambias de trabajo, barra new; si el problema es el proveedor, barra fresh. La compactación y el traspaso, que resumen en lugar de vaciar, son del próximo vídeo.

**9 · Reintentar, reiniciar, mover y cierre**

Quedan tres comandos de mantenimiento. Barra retry reintenta el último turno que falló. oh my pi ya reintenta por su cuenta los errores pasajeros, como límites de peticiones, servidores saturados o cortes de red: hasta diez veces, con esperas que empiezan en medio segundo y se duplican. Barra retry, o efe cinco, es para cuando se agotan esos intentos. En la sesión nueva no ha fallado nada, y nos lo dice: nothing to retry.

Barra restart cierra oh my pi y lo vuelve a abrir con los mismos flags, incluido guion guion profile demo, y retoma esta sesión. Sirve tras actualizar o cambiar algo que solo se lee al arrancar. Lo lanzamos sobre la sesión vacía de barra new, y vuelve el logotipo con un consejo distinto y la misma sesión, todavía vacía. Al salir con barra exit, oh my pi nos deja el comando para retomarla.

Barra move traslada la sesión actual a otra carpeta de trabajo. Sin argumentos abre un buscador de rutas; con una ruta, la usa, y si no existe te pregunta si la crea. Mueve el fichero de sesión y sus artefactos a la subcarpeta de la nueva carpeta de trabajo, y recarga los ajustes, las skills y los comandos de ese proyecto. Útil cuando empezaste en el directorio equivocado. Hoy no lo grabamos: te lo contamos.

Repasemos. La interfaz tiene atajos para no perder borradores, editar fuera y limpiar la pantalla, y un selector de comandos que te enseña el estado de la sesión. Barra session te da la ficha, barra rename le pone nombre, y el título automático gasta una llamada. Barra branch rebobina en el mismo fichero, barra tree navega el árbol sin resumir por defecto, y barra fork duplica la sesión entera.

Barra resume y barra pin te mueven entre sesiones. Barra fresh reinicia el proveedor, barra clear vacía el contexto, barra new empieza otra, y barra delete borra. Barra retry, barra restart y barra move cierran la lista. Y dos límites honestos: el árbol no deshace tus ficheros, y un salto no se guarda hasta que escribes algo.

La práctica: abre una sesión con tu perfil de pruebas y haz tres peticiones que no editen nada. Rebobina con escape escape, reescribe la segunda y compara las dos ramas en las columnas. Etiqueta una en barra tree y pregunta por la diferencia entre las dos. Después haz barra fork y cuenta las líneas de los dos ficheros. Termina con barra clear y pregunta algo de antes.

En el próximo vídeo, contexto y memoria: barra context para medir, barra compact y sus modos, barra shake para adelgazar sin modelo, barra handoff para traspasar, el contexto extendido, la memoria entre sesiones y barra btw para preguntas laterales. Nos vemos allí.

</details>

