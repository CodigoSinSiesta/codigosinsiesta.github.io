---
title: "Vídeo 13 · Contexto y memoria"
description: "medir el contexto, adelgazarlo y traspasarlo a una sesión nueva. Los sistemas de memoria de omp y las preguntas laterales sin ensuciar la conversación."
ruta: "pi-oh-my-pi"
orden: 13
duracion: "25 min"
video: "13-contexto-y-memoria.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/13-contexto-y-memoria.es.vtt"
---

medir el contexto, adelgazarlo y traspasarlo a una sesión nueva. Los sistemas de memoria de omp y las preguntas laterales sin ensuciar la conversación.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que ya sabes del contexto

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **oh my pi va más lejos**
  - `5` · Formas de compactar: encadenadas en orden
  - `sin LLM` · Adelgazar: sin llamar al modelo
  - `memoria` · Entre sesiones: Pi no la tiene
- **Hoy:** Medir (/context) → Adelgazar (/shake · /compact) → Traspasar (/handoff) → Laterales (/btw · extended) → Memoria (entre sesiones)
- **Perfil demo · DeepSeek V4.1 Flash:** Ventana de 1M tokens — Hoy sí editamos tests. /compact, /handoff y /btw gastan modelo.

### 2 · Medir con /context

<p><button type="button" class="ir-a" data-t="115">▶ Ir a 1:55</button></p>

- *En la demo:* omp --profile demo --no-session · /context
- *En la demo:* Una sesión vacía: 6,7K tokens
- *En la demo:* Reserva: 15 % de la ventana
- **Sesión vacía:** Herramientas 3,7K prompt 2,6K — Cada herramienta viaja en cada petición: 12 activas de 20 disponibles.
- *En la demo:* --tools read,bash,edit,write
- **¿Quitar herramientas?**
  - `1M` · Ventana grande: 3K tokens son poca cosa
  - `MCP` · Ventana pequeña: aquí la cuenta cambia decisiones
- **.omp/RULES.md:** Una regla que siempre viaja — Completa en cada petición, aunque la conversación crezca o se compacte.
- *En la demo:* /co: el estado en el menú

### 3 · Cuándo compacta solo oh my pi

<p><button type="button" class="ir-a" data-t="306">▶ Ir a 5:06</button></p>

- **La reserva para la respuesta**
  - `16 384` · Pi: siempre fija
  - `máx(16 384; 15 %)` · oh my pi: con 1M: 150K
- **El umbral**
  - `% · tokens` · A mano: ajustes de compactación
  - `mitad de turno` · También: entre herramientas
- **Activada de fábrica:** Compactación especulativa — El resumen se prepara en segundo plano antes de cruzar el umbral.
- **Limpieza previa, sin modelo**
  - `truncar` · Resultados antiguos: protege los recientes
  - `superadas` · Lecturas repetidas
  - `una línea` · Resultados inútiles
- **Vídeo 12:** Contexto lleno → compactar — No se reintenta tal cual: se compacta y se reintenta el turno.
- **compaction.methodOrder:** remote (proveedor) → snapcompact (imágenes) → handoff (traspaso) → shake (sin modelo) → soft (resumen local)

### 4 · Adelgazar sin modelo: /shake

<p><button type="button" class="ir-a" data-t="437">▶ Ir a 7:17</button></p>

- **Tres turnos:** T1 (leer y testear) → T2 (registro de 2000 líneas) → T3 (test de 40 €)
- *En la demo:* grep en vez de leer 2000 líneas
- *En la demo:* Messages: 13K
- *En la demo:* /shake
- *En la demo:* Messages: 8,1K
- **La pantalla no cambia:** Lo que adelgaza es lo que ve el modelo — Cada resultado quitado queda como referencia artifact://, recuperable.
- *En la demo:* Lo digerido puede irse
- **Los tres modos de /shake**
  - `elide` · Resultados y bloques: por defecto
  - `images` · Imágenes
  - `thinking` · Razonamiento
- **Shake automático frente a manual**
  - `automático` · Prudente: protege lo reciente
  - `/shake` · Agresivo: úsalo cuando sabes qué sobra

### 5 · /compact y sus modos

<p><button type="button" class="ir-a" data-t="602">▶ Ir a 10:02</button></p>

- **Perfil demo:** keepRecentTokens: 3000 — Solo para la demo. De fábrica, 20 000.
- **/compact [modo] [foco]**
  - `soft` · Resumen local: modelo activo
  - `remote` · Del proveedor
  - `snapcompact` · En imágenes: sin modelo
- **Gasta modelo:** /compact soft — conserva la decisión sobre el caso de 40 euros y el estado de los tests
- *En la demo:* El divisor: 15K → 9,3K
- *En la demo:* Control O y la rueda
- *En la demo:* El resumen detecta el desliz
- *En la demo:* Turno partido, ficheros y la huella de /shake
- *En la demo:* Messages: 2,6K
- *En la demo:* Distingue lo que sabe de lo que supone
- **remote**
  - `Responses` · OpenAI: resumen guardado: un marcador
  - `Anthropic` · Beta
  - `completions` · DeepSeek: aquí no aplica
- **snapcompact:** La historia, en imágenes — Sin modelo, sin clave, sin red. Exige un modelo que lea imágenes: DeepSeek Flash las lee.
- *En la demo:* Nada que archivar tras /compact soft
- **Vídeo 04:** Adelgazar rompe la caché — La siguiente petición se paga casi entera. Adelgaza cuando compense.

### 6 · Traspasar con /handoff

<p><button type="button" class="ir-a" data-t="873">▶ Ir a 14:33</button></p>

- *En la demo:* Antes: 17 mensajes
- **Gasta modelo:** /handoff — céntrate en el estado de los tests y en lo que falta por hacer
- *En la demo:* Generating handoff…
- *En la demo:* Compactado en el sitio
- *En la demo:* Mismo ID, mismo fichero
- **Frente a /compact**
  - `traspaso` · Escrito para otra instancia: contexto de trabajo, no instrucciones
  - `caché` · Misma clave: aprovecha la caché
- **handoffSaveToDisk:** Los automáticos, a disco — Tercero en la lista. Los traspasos manuales no se guardan aparte.
- **Vídeo 23:** Lo que importa va al repo — Código, tests y decisiones. Un traspaso es un resumen de un modelo.

### 7 · Preguntas laterales y contexto extendido

<p><button type="button" class="ir-a" data-t="1021">▶ Ir a 17:01</button></p>

- **/btw:** Barra by the way — Una pregunta que no se queda en la sesión.
- *En la demo:* /btw ¿qué ficheros hemos modificado hoy?
- *En la demo:* f · seguimiento en el historial
- *En la demo:* Las laterales no entran en Messages
- **Pero se paga**
  - `/btw` · Dudas rápidas: envía el contexto actual
  - `/tan` · Trabajo lateral: vídeo 16
- *En la demo:* /extended-context status
- **/extended-context on|off**
  - `config` · Se guarda: no solo esta sesión
  - `tokens` · No es gratis: el umbral sube con la ventana

### 8 · Memoria entre sesiones

<p><button type="button" class="ir-a" data-t="1162">▶ Ir a 19:22</button></p>

- **memory.backend: off:** Memoria entre sesiones — Guarda lo aprendido y lo inyecta en sesiones futuras.
- **Backends**
  - `local` · Resume sesiones: al arrancar
  - `mnemopi` · SQLite local
  - `hindsight` · Servidor: de equipo
- **Backend local, al arrancar:** Fase 1 (extraer de cada sesión) → Fase 2 (consolidar) → Inyectar (resumen corto)
- *En terminal:* Memoria de la demo (perfil demo, fuera de cámara) (más abajo, en «Código y comandos»)
- *En la demo:* /memory stats
- *En la demo:* Herramienta descubrible: retain
- *En la demo:* Working: 1
- *En la demo:* Sesión nueva: recuerda y avisa
- *En la demo:* /memory view
- *En la demo:* Dos recuerdos: uno no lo pedimos
- **Si quieres más**
  - `embeddings` · Por significado: variante multilingüe
  - `smol` · Con modelo: gasta al consolidar
  - `hindsight` · De equipo: servidor y token
- **/memory**
  - `queue` · Pendiente
  - `sync` · Consolidar
  - `clear` · Borrar: nunca en cámara
- **Límite honesto:** Memoria = pista, no verdad — Si contradice al código o a ti, gana el código y ganas tú.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1402">▶ Ir a 23:22</button></p>

- **Repaso:** /context (medir) → Herramientas (3,7K → 1,1K) → Umbral (y methodOrder) → /shake (sin modelo)
- **Y además:** /compact (soft · remote · snap) → /handoff (en el sitio) → /btw (no ensucia) → Memoria (como pista)
- **Práctica:** /context (antes) → /shake (tras unos turnos) → /compact soft (y léelo) → /handoff (compara)
- **Próximo vídeo:** Modelos, roles y razonamiento — DeepSeek Flash para el trabajo, DeepSeek V4 Pro para revisar.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Memoria de la demo (perfil demo, fuera de cámara)

```text
omp --profile demo config set memory.backend mnemopi
omp --profile demo config set mnemopi.noEmbeddings true
omp --profile demo config set mnemopi.llmMode none
```

- `noEmbeddings`: Solo texto, sin descargas
- `llmMode none`: Sin modelo
- `memory.backend`: De fábrica: off

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh); `omp read omp://…` en 18.6.1 da
  `compaction.md`, `handoff-generation-pipeline.md`, `memory.md`, `mnemosyne-memory-backend.md` y `magic-keywords.md`
  idénticos):
  - `compaction.md`: entradas `compaction` y `branch_summary`; qué ve el modelo (sistema, resumen, mensajes desde
    `firstKeptEntryId`); seis disparadores (manual, desbordamiento, salida incompleta, umbral, a mitad de turno, inactivo);
    promoción de contexto antes de compactar; el desbordamiento salta `handoff`; método `shake` (local, `artifact://`,
    ventana reciente protegida) y «Manual `/shake` is a separate, more aggressive command»; `snapcompact` (historial en
    PNG con fuente de píxeles, sin modelo, sin clave, sin red; exige modelo con entrada de imagen; rechaza foco; evals de
    recuerdo a menor coste); modos remotos (V2 streaming de Responses, V1 `/responses/compact`, beta de Anthropic,
    endpoint propio) y que en los carriles de OpenAI el `summary` guardado es un marcador; *display transcript* con el
    divisor «compacted · ctrl+o» y el scrollback intacto; poda previa (protege 40 000 tokens recientes de herramientas,
    exige 20 000 de ahorro, `[Output truncated - N tokens]`); `dropUseless` (`[Uneventful result elided]`);
    `supersedeReads`; ficheros leídos y modificados en `<files>`; recompactación con `compaction-update-summary.md` y
    `<previous-summary>`; modo experimental de notas (`compaction.experimentalContextManagement`, `context_notes`,
    `new_context`, `history://current/full`); `/handoff` compacta en el sitio (mismo id, mismo
    fichero, misma clave de caché); valores por defecto (`methodOrder` `remote, snapcompact, handoff, shake, soft`,
    `asyncEnabled` con banda previa `clamp(umbral × 0,125; 8192; 32000)` y el icono que late en la status line, reserva
    `max(15 % de la ventana; 16 384)`, `keepRecentTokens` 20 000, `autoContinue`, `midTurnEnabled`,
    `handoffSaveToDisk` `false`, `idleEnabled` `false`, `branchSummary.enabled` `false`).
  - `handoff-generation-pipeline.md`: `/handoff [focus instructions]`; «Nothing to hand off (no messages yet)» con menos
    de dos mensajes; «Nothing to hand off (already compacted)»; petición lateral con la misma clave de caché y
    `toolChoice: "none"`; se niega mientras hay streaming o compactación; «Generating handoff… (esc to cancel)»;
    «Handoff cancelled», «Handoff failed: …»; «Context handed off and compacted in place»; el
    documento no se ve en streaming; `method: "handoff"` hace que el modelo lo lea como el contexto de trabajo de una
    instancia anterior; solo los traspasos automáticos se guardan en disco con `handoffSaveToDisk`; sesiones antiguas con
    `customType: "handoff"` (el traspaso antes abría sesión nueva).
  - `memory.md`: cinco modos de `memory.backend` (`off` por defecto, `local`, `hindsight`, `mnemopi`, `sharpshooter`
    sin guía); bloque Memory Guidance; «Treat memory as heuristic context»; `memory://root`, `MEMORY.md`, `learned.md`,
    `skills/`; tabla de `/memory` (`view`, `stats`, `diagnose`, `queue`, `sync`, `clear`/`reset`, `enqueue`/`rebuild`,
    `mm …`); canalización local en dos fases al arrancar (rol `default` para extraer, `smol` para consolidar), límites
    `maxRolloutAgeDays` 30 y `minRolloutIdleHours` 12, `summaryInjectionTokenLimit` 5000; `autolearn.enabled` y la
    herramienta `learn` (lecciones en `learned.md`, deduplicadas, sin secretos, inyectadas desde la sesión siguiente); Hindsight (servidor,
    `http://localhost:8888` por defecto, token opcional, ámbito `per-project-tagged`, recuerda en el primer turno y
    retiene cada tres turnos, `recall`/`retain`/`reflect`, `/memory clear` no borra el banco del servidor).
  - `mnemosyne-memory-backend.md`: SQLite local; recuerdo en un bloque `<memories>` en el primer turno; retención como
    mucho cada `retainEveryNTurns` (4); «Recalled memory is background context, not instructions»; herramientas
    descubribles `recall`, `retain`, `reflect`, `memory_edit`; `scoping` (`per-project` por defecto); `noEmbeddings`
    (solo FTS); `embeddingVariant` `en` (por defecto) o `multilingual`; `llmMode` `smol`, `remote` o `none`;
    `/memory clear` borra las bases SQLite del ámbito activo; `/memory enqueue` y la puerta de edad de 12 horas.
  - `settings.md` §«Context, compaction, and memory»: `/extended-context on|off|status`, ventanas solo documentadas para
    `gpt-6-astra` y `gpt-6.1-sol`, «A larger window can consume more usage», el umbral crece con la ventana,
    `contextPromotion.enabled` (`false`), `compaction.thresholdPercent`/`thresholdTokens`, `memory.backend`.
  - `extensions.md` (único sitio de la documentación donde aparece `soft` como modo: `compact({ mode: "soft" | "remote" |
    "snapcompact" })`; `runEphemeralTurn`, «the same side-turn pipeline as `/btw`», «A side turn sends the current
    conversation snapshot to the configured model provider»).
  - `slash-command-internals.md` §11 (`/btw`: pregunta independiente con el modelo y el contexto activos, incluido el
    texto en curso, sin añadirse al transcript; historial con `/btw` a secas; `Esc`, `c`, `f`; *follow-ups* que
    sobreviven al retomar; historial en `btw-history/` junto a los artefactos de la sesión; no entra en export ni share;
    caché «depends on the provider»). `session-operations-export-share-fork-resume.md` («BTW history»).
  - `context-files.md` (`RULES.md` en `.omp/` como regla fija que viaja completa en cada petición; perfiles en
    `~/.omp/profiles/<name>/agent`), `non-compaction-retry-policy.md` (el
    desbordamiento de contexto no se reintenta: va a compactación). `magic-keywords.md` consultado (avisos ocultos por
    turno; no se usa en la locución).
- **Binario de omp 18.6.1** (`strings ~/.bun/bin/omp`), solo para lo que la documentación no cuenta:
  - `/context`: informe «Context Usage» (cabecera con modelo y ventana) con categorías `System prompt`, `System tools`,
    `System context`, `Skills` y `Messages`, más «Free space», «Autocompact buffer» (rayado) y una marca
    «Auto-compaction at N%»; «Snapcompact: inactive (model has no image input)» solo aparece si
    `snapcompact.systemPrompt` o `snapcompact.toolResults` están activos.
  - `/compact`: modos con su descripción («Summarize locally with the active model (skip server compaction)» para `soft`,
    «Summarize via OpenAI-compatible server compaction, then fall back to a local summary» para `remote`, «Archive history
    onto dense bitmap images the model reads back (no LLM call)» para `snapcompact`), error «/compact snapcompact does
    not take focus instructions…», mensaje «Compaction complete. Tokens: A -> B (saved C).» (ruta no TUI).
  - `/shake`: «Shook N tool results + M blocks (~T tokens freed).», «Nothing to shake.», «Dropped N thinking blocks…».
  - `/memory` en la TUI: `sync` llama al mismo `enqueue` que `enqueue` y muestra «Memory consolidation ran.»; con
    `local`, `enqueue` solo marca trabajo pendiente. `/memory view` vacío: «Memory payload is empty (memory backend off,
    disabled, or no memory available).» `clear`: «Memory data cleared and system prompt refreshed.»
  - `/extended-context`: «Extended context is off.», y `on`/`off` escriben el ajuste con `.set`.
- `omp --help` (18.6.1): `--tools`, `--no-tools`, `--no-session`, `--profile`; `omp config --help` (`path`, `get`, `set`).
- Vídeos anteriores: 03 (cómo Pi monta el contexto; reserva fija de 16 384 y 20 000 tokens recientes; «Nothing to
  compact (session too small)» y `keepRecentTokens: 3000` en la demo; resumen estructurado y sus errores; caché que cae
  tras compactar; «las decisiones de verdad tienen que vivir en ficheros»), 04 (caché), 07 (coste de las herramientas en
  el contexto), 11 (perfil `--profile demo`, «o eme pe», DeepSeek V4.1 Flash; promete: «Cada herramienta tiene un coste en
  contexto, y lo mediremos en el vídeo trece»), 12 (cierra anunciando «barra shake para adelgazar sin modelo, barra
  handoff para traspasar, el contexto extendido, la memoria entre sesiones y barra btw»; «el contexto lleno no se
  reintenta: eso es compactación»; las sesiones del 12 se quedan en el perfil demo).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que ya sabes del contexto**

En el vídeo tres vimos cómo Pi monta lo que el modelo recibe en cada petición: el prompt de sistema con tus ficheros de contexto, las herramientas, y la rama activa de la conversación. Vimos también la compactación: cuando la conversación no cabe, se resume lo antiguo y se conservan los mensajes recientes. Y sacamos una lección incómoda: el resumen lo escribe un modelo, y puede equivocarse.

oh my pi hereda esa idea, pero la lleva mucho más lejos. No tiene una forma de compactar, sino cinco, encadenadas en orden. Puede adelgazar una sesión sin llamar al modelo. Puede resumir en segundo plano antes de que lo necesites. Y añade algo que Pi no tiene: memoria entre sesiones, para que lo aprendido en una conversación llegue a la siguiente.

El plan de hoy tiene tres verbos: medir, adelgazar y traspasar. Mediremos con barra context, y por fin cumpliremos lo que prometimos en el vídeo once: cuánto contexto cuestan las herramientas. Adelgazaremos con barra shake, sin modelo, y con barra compact y sus modos. Y traspasaremos con barra handoff. Después, barra by the way y el contexto extendido, y al final la memoria.

Trabajamos como siempre en la tienda, con el perfil demo y DeepSeek V cuatro punto uno Flash, que tiene una ventana de un millón de tokens. Hoy sí editamos algún test, porque no vamos a rebobinar. Y varios comandos de hoy llaman al modelo sin que el nombre lo sugiera: barra compact, barra handoff y las preguntas laterales. Te lo iremos diciendo, porque eso es dinero.

**2 · Medir con barra context**

Empezamos sin gastar nada. Arrancamos oh my pi con el perfil demo y la opción guion guion no session, para no dejar una sesión a medias, y escribimos barra context. Aparece un informe, context usage, con el nombre del modelo y el tamaño de su ventana: un millón. En esta versión, el informe ya no se queda en la conversación: lo miras, pulsas escape y desaparece.

El informe tiene un medidor de bloques de colores y una leyenda. System prompt es el prompt de sistema de oh my pi: dos mil seiscientos tokens. System tools son las definiciones de las herramientas: tres mil setecientos. System context recoge lo que se inyecta además, como tus ficheros de contexto: cuatrocientos cuarenta y dos. Skills, cero, porque el perfil demo no las carga. Y Messages, cero: aún no hemos escrito nada.

Debajo, el espacio libre y una franja rayada: el autocompact buffer, ciento cincuenta mil tokens, el quince por ciento de la ventana. Es la reserva que oh my pi deja libre para la respuesta y para compactar a tiempo. Ahora veremos de dónde sale ese quince por ciento. Lo importante: sabes de un vistazo cuánto margen te queda antes de que algo pase sin pedirlo.

Fíjate en las herramientas. En una sesión vacía, sin haber escrito nada, son lo más grande de la petición, más que el propio prompt de sistema. Es lo que vimos en el vídeo siete con los servidores MCP: cada herramienta viaja en cada petición, con su nombre, su descripción y sus parámetros. En el vídeo doce vimos que el perfil demo tiene doce activas de veinte disponibles. Eso se paga en cada turno, aunque no las uses.

Lo comprobamos. Salimos y volvemos a entrar con guion guion tools y solo cuatro herramientas: read, bash, edit y write. Barra context otra vez. System tools baja de tres mil setecientos a mil cien. Y el prompt de sistema también adelgaza, de dos mil seiscientos a dos mil, porque parte de sus instrucciones hablan de las herramientas que ya no están. En total, la sesión vacía pasa de seis mil setecientos tokens a tres mil seiscientos.

No te estamos diciendo que quites herramientas: con un millón de tokens de ventana, tres mil son poca cosa. Te decimos que ahora sabes medir lo que cuestan, que era la promesa del vídeo once. Y que con un modelo de ventana pequeña, o con muchos servidores MCP, esta cuenta sí cambia decisiones.

Una nota sobre el prompt de sistema. Tus ficheros de contexto, como AGENTS punto md, se cargan al empezar. Pero oh my pi admite además un RULES punto md, en punto omp, que se convierte en una regla fija y viaja completo en cada petición. Sirve para lo poco que debe seguir a la vista aunque la conversación crezca o se compacte.

Un atajo para no abrir el informe: el selector de comandos. Al escribir barra c o, barra context ya dice en su descripción uno por ciento, seis mil seiscientos noventa y nueve de un millón. Barra compact repite el porcentaje. Y barra extended context dice off. Es lo que vimos en el vídeo doce: muchas descripciones del menú te cuentan el estado.

**3 · Cuándo compacta solo oh my pi**

Antes de adelgazar a mano, conviene saber qué hace oh my pi por su cuenta. Como Pi, compacta cuando el contexto supera un umbral. Pero la reserva cambia. Pi guardaba siempre dieciséis mil trescientos ochenta y cuatro tokens. oh my pi reserva el mayor de dos valores: esos mismos tokens, o el quince por ciento de la ventana. Con un millón de tokens, el quince por ciento gana: los ciento cincuenta mil de la franja rayada.

El umbral se puede fijar a mano, con un porcentaje o con un número de tokens, en los ajustes de compactación. Y según la documentación se comprueba en dos momentos: al terminar un turno, y también a mitad de un turno largo, entre una llamada a herramienta y la siguiente. Es importante en tareas con muchas herramientas, donde un solo turno puede llenar la ventana.

Lo más llamativo es la compactación especulativa, activada de fábrica. Cuando te acercas al umbral, oh my pi empieza a preparar el resumen en segundo plano, sin parar tu trabajo. Cuando cruzas el umbral, ese resumen ya está listo y se aplica al instante. Hoy no lo veremos: con un millón de tokens, nuestra sesión de juguete no se acerca ni de lejos.

Hay también limpieza previa, sin modelo. Si los resultados de herramientas ocupan mucho, oh my pi puede sustituir los antiguos por un aviso de salida truncada, protegiendo siempre los más recientes. Las lecturas de un fichero que has vuelto a leer después se dan por superadas. Y los resultados inútiles, como una búsqueda sin coincidencias, se quedan en una línea.

Recuerda lo que dijimos al final del vídeo doce: el contexto lleno no se reintenta, eso es compactación. Si el proveedor responde que la petición no cabe, oh my pi compacta y reintenta el turno. Tú solo ves el aviso.

¿Y cómo compacta? Recorriendo una lista de métodos en orden, el ajuste compaction method order. De fábrica es remote, snapcompact, handoff, shake y soft. Si un método no está disponible para tu modelo, o falla, pasa al siguiente. Esa lista es la clave del vídeo: cada nombre es una forma distinta de adelgazar, y ahora vamos a ver casi todas en la tienda.

**4 · Adelgazar sin modelo: barra shake**

Primero, hacemos crecer la sesión. Arrancamos una sesión normal y le pedimos tres cosas. Leer todos los ficheros de src y de test, ejecutar los tests y resumir la tienda: quince de quince pasan. Mirar un registro de pedidos de dos mil líneas, que hemos dejado fuera del repositorio, y contar los errores de envío. Y añadir un test para un subtotal de exactamente cuarenta euros.

El segundo turno tiene una lección. Esperábamos que leyera las dos mil líneas, y no lo hizo: usó grep desde bash y solo trajo las catorce líneas con error. Es lo que hace un buen agente con un fichero grande. Y fíjate en un desliz: en la nota final dice dos de los pedidos y luego enumera nueve. Lo guardamos, porque luego reaparece.

El tercer turno, el del test, también razona. Ve que ya había una comprobación de cuarenta euros dentro de otra prueba, crea el caso dedicado, quita la duplicada y ejecuta los tests: dieciséis de dieciséis. Barra context: ahora Messages ocupa trece mil tokens, de un total de veinte mil.

Barra shake. Sin argumentos usa el modo elide, que quita los resultados de herramientas y los bloques grandes. No llama al modelo, así que es instantáneo y gratis. Responde con una línea: ha sacudido once resultados de herramientas y ha liberado unos cuatro mil ochocientos tokens. Barra context lo confirma: Messages baja de trece mil a ocho mil cien.

Fíjate en que la pantalla no cambia. Los diffs y la salida de los tests siguen ahí. Lo que ha adelgazado es lo que recibe el modelo. Cada resultado quitado se sustituye por una referencia artifact, que apunta a una copia guardada junto a la sesión. Si el modelo vuelve a necesitarlo, puede leerla. Y el fichero de sesión sigue teniendo todo.

Lo comprobamos: cuántas líneas de error había en el registro. Responde catorce, sin volver a leer nada. No le hacía falta: el dato estaba en su propia respuesta, y shake quita los resultados de las herramientas, no lo que el modelo concluyó a partir de ellos. Esa es la idea: lo que ya se digirió puede irse.

Hay otros dos modos. Barra shake images quita las imágenes, útil si has pegado capturas que ya no hacen falta. Y barra shake thinking quita los bloques de razonamiento del modelo, que en sesiones largas pueden ocupar más que las respuestas. Ninguno de los tres llama al modelo.

Un matiz. Shake también está en la lista automática, pero allí es prudente: protege una ventana de tokens recientes y solo actúa si el ahorro merece la pena. El barra shake manual es más agresivo. Por eso conviene lanzarlo cuando sabes qué sobra, no por costumbre.

**5 · Barra compact y sus modos**

Shake quita peso, pero no resume. Para eso está barra compact. Igual que en el vídeo tres, en una sesión de juguete casi no habría nada que compactar, porque se conservan siempre veinte mil tokens recientes. Así que en el perfil demo hemos bajado ese margen, keep recent tokens, a tres mil. En tu trabajo real no lo toques.

Barra compact admite un modo y unas instrucciones de foco. Sin modo, recorre la lista de métodos. Con modo, lo fuerza. Hay tres: soft, remote y snapcompact. Y un aviso: barra snapcompact, barra remote y barra soft no existen como comandos. Son modos de barra compact, aunque alguna guía los presente sueltos.

Soft es el más parecido a Pi: un resumen local que escribe el modelo activo. Lo lanzamos con foco: barra compact soft, conserva la decisión sobre el caso de cuarenta euros y el estado de los tests. Esto gasta modelo. Abajo aparece compacting context, con escape para cancelar, y en unos segundos termina.

En el transcript aparece una línea fina: soft compacted, de quince mil a nueve mil trescientos, con control o. Aquí control o activa la expansión, y subiendo con la rueda aparece el resumen entero: compactado de quince mil ciento cincuenta y uno a nueve mil trescientos cuarenta y cuatro tokens. Las rutas que ves difuminadas llevan el nombre de usuario.

Léelo, como en el vídeo tres. Tiene secciones fijas: el objetivo, las restricciones y preferencias, el progreso con lo hecho, lo que está en curso y lo bloqueado, las decisiones clave, los siguientes pasos y el contexto crítico. Y una sorpresa buena: el resumen detecta el desliz del registro. Escribe que el texto decía dos pedidos pero listaba nueve, y que conviene reverificar esa cifra.

Más abajo, dos cosas que merece la pena ver. El turno del test aparece como un turno partido: la petición original, lo que se había hecho y lo que quedaba. Y al final, la lista de ficheros de la sesión, agrupados por carpeta y marcados como leídos o escritos. Además, una nota dice que las salidas de herramientas se entregaron como referencias artifact. Es la huella de barra shake.

Barra context lo remata: Messages baja de ocho mil cien a dos mil seiscientos. ¿Qué recibe ahora el modelo? Lo mismo que en Pi: el prompt de sistema, el resumen como un mensaje más, y los mensajes recientes. Si vuelves a compactar, oh my pi le pasa al modelo el resumen anterior junto con lo nuevo para que lo actualice. Cada pasada es otra oportunidad de perder un detalle.

Lo probamos con una pregunta: qué casos límite cubren ya los tests, sin ejecutar nada. Responde con los del resumen, treinta y nueve con noventa y nueve, cuarenta, cincuenta, y añade la validación de la entrada, pero marcada como inferencia, no reverificada. Es la actitud correcta: distingue lo que sabe por el resumen de lo que supone.

Remote usa la compactación del propio proveedor, cuando la ruta del modelo la ofrece: la de OpenAI en su API de Responses, la de Anthropic, o un servidor propio. Si falla, cae a un resumen local. Tiene una contrapartida honesta: con los carriles de OpenAI, lo que se guarda en tu fichero es un marcador, no un resumen legible. DeepSeek usa la API de completions, así que aquí no aplica.

Snapcompact es la idea más rara de oh my pi. No resume: imprime la historia antigua, en texto apretado, sobre imágenes con una fuente de píxeles, y el modelo las lee de vuelta. No llama a ningún modelo, no necesita clave ni red. Solo funciona con modelos que aceptan imágenes, y DeepSeek Flash las acepta, así que lo probamos.

Barra compact snapcompact. Y la respuesta es un aviso y un error: snapcompact no reduciría el contexto. Tiene razón. Acabamos de compactar con soft, la historia antigua es diminuta, y convertirla en imágenes costaría más que dejarla como texto. Es una herramienta para historias largas, no para sesiones recién compactadas. No admite foco, porque no hay resumen que orientar.

Y el coste que comparten todos, también shake: cambian el principio de la conversación. Recuerda el vídeo cuatro. La caché del proveedor sirve mientras el principio de la petición no cambia. Después de adelgazar, la siguiente petición se paga casi entera. Adelgaza cuando compense, no a cada rato.

**6 · Traspasar con barra handoff**

Seguimos trabajando. El caso que el modelo había marcado como inferencia, la validación, se lo pedimos: un test que compruebe que un subtotal negativo lanza TypeError. Lo añade, quita los valores negativos de la prueba genérica para no duplicar, y diecisiete de diecisiete. Antes del traspaso, barra session: apuntamos el identificador.

Barra handoff resume la sesión en un documento de traspaso. No es un resumen cualquiera: está pensado para que otra instancia del agente retome el trabajo, con el estado, las decisiones y los siguientes pasos. Admite foco, así que escribimos: barra handoff, céntrate en el estado de los tests y en lo que falta por hacer. Gasta modelo.

Abajo aparece generating handoff, con escape para cancelar. El documento no se escribe en pantalla mientras se genera. Al terminar, el transcript se reconstruye con un divisor nuevo, handed off, de catorce mil a nueve mil cuatrocientos, y dos avisos: la sesión se ha compactado dos veces, y context handed off and compacted in place.

Fíjate en lo de in place. Barra handoff no abre una sesión nueva. Guarda el documento como una compactación más, en el mismo fichero. Barra session lo confirma: el mismo identificador y la misma ruta. Lo que sí cambia son los recuentos: mensajes y tokens bajan, porque reflejan lo que queda vivo después del traspaso. Versiones anteriores sí abrían sesión aparte; puede que lo leas en guías antiguas.

¿Qué gana entonces frente a barra compact? El documento está escrito como un traspaso, y el modelo lo recibe marcado como el contexto de trabajo de una instancia anterior, no como instrucciones nuevas. Y la petición se hace con la misma clave de caché que tus turnos, así que aprovecha la caché. No funciona mientras el agente está respondiendo, y si cancelas no se guarda nada.

Handoff también está en la lista automática, en tercer lugar. Con el ajuste handoff save to disk, los traspasos automáticos se guardan además como un fichero markdown entre los artefactos de la sesión; los manuales, como el nuestro, no.

Y la pregunta de siempre: ¿esto sustituye a dejar las cosas escritas? No. Un traspaso es un resumen de un modelo, con los mismos riesgos que vimos en el vídeo tres. Lo que de verdad tiene que sobrevivir, el código, los tests, las decisiones, va al repositorio. De eso trata entero el vídeo veintitrés.

**7 · Preguntas laterales y contexto extendido**

A veces quieres preguntar algo sin que la pregunta se quede en la sesión. Para eso está barra by the way. Lanzamos un turno, que ejecute los tests y explique cada resultado en una línea, y con el turno en marcha preguntamos: qué ficheros hemos modificado hoy.

El turno termina con su tabla de diecisiete tests, y debajo, aparte, el panel de la pregunta lateral: solo test barra envio punto test punto js, sin commitear, con los casos de cuarenta euros y del subtotal negativo, y src intacto. Abajo, las teclas: ce para copiar, efe para una pregunta de seguimiento y escape para cerrar.

Pulsamos efe y preguntamos qué caso límite falta por probar. Se abre la hoja del historial: a la izquierda, el tema, y a la derecha, las dos preguntas con sus respuestas. Y la respuesta es buena: falta el subtotal cero, que es válido y paga cuatro noventa y cinco, y el caso de menos cero, que no lanza error. Material para el próximo test.

Ni la pregunta ni la respuesta entran en la conversación. Barra context lo confirma: Messages ha crecido por el turno de los tests, no por las preguntas laterales. El historial se guarda en una carpeta propia junto a la sesión y sobrevive si la retomas, pero no entra en las exportaciones.

Que no se quede en la sesión no significa que sea gratis. Cada pregunta lateral envía el contexto actual al proveedor, y la respuesta se paga. Úsala para dudas de verdad, no como chat paralelo. Y si la pregunta necesita trabajo de verdad, eso es barra tan, que veremos en el vídeo dieciséis.

El contexto extendido es otra cosa. Algunos modelos ofrecen dos ventanas, una estándar y otra mucho mayor, a veces con otro precio. Barra extended context on activa la grande, off vuelve a la estándar, y status te dice cómo está. En cámara solo lanzamos status, y responde: extended context is off.

Dos avisos. Primero, on y off guardan el ajuste en tu configuración, no solo en esta sesión. Segundo, una ventana mayor no es gratis aunque el modelo no cobre recargo: el umbral de compactación sube con ella, y cada petición puede llevar muchos más tokens. Antes de activarlo, pregúntate si no te bastaría con adelgazar.

**8 · Memoria entre sesiones**

Hasta ahora, todo vivía dentro de una sesión. Cuando abres otra, el modelo empieza de cero, salvo por tus ficheros de contexto. La memoria cambia eso: guarda lo aprendido y lo inyecta en sesiones futuras. Viene apagada. Se elige un backend en barra settings, o con el ajuste memory backend.

Hay tres principales. Local resume tus sesiones antiguas del proyecto al arrancar. Mnemopi guarda recuerdos en una base SQLite en tu máquina. Y Hindsight usa un servidor de memoria externo. Hay un cuarto, sharpshooter, que la documentación nombra sin explicar, así que no lo contamos.

Local trabaja en dos fases, en segundo plano, al arrancar. Primero, un modelo lee cada sesión pasada y extrae decisiones, restricciones, fallos resueltos y flujos que se repiten. Después, otra pasada lo consolida en un documento de memoria y un resumen corto que se inyecta al empezar cada sesión. Fíjate en el coste: todo eso usa modelo al arrancar, sin que escribas nada.

Para la demo usamos mnemopi, configurado fuera de cámara en el perfil demo con dos ajustes: no embeddings, para que busque solo por texto y no descargue un modelo de embeddings, y llm mode none, para que no llame a ningún modelo. Así, la memoria de hoy no cuesta nada.

Abrimos una sesión y miramos barra memory stats: un banco para la tienda, con cero memorias, y la base de datos dentro de la carpeta del perfil demo, no en tu configuración real. Le pedimos que use la herramienta retain para guardar un hecho: el límite de envío gratis es cuarenta euros y el caso exacto ya tiene test.

El modelo primero lee la documentación de la herramienta, en la dirección xd barra barra retain, porque es una de las herramientas que se descubren al usarlas. Luego llama a retain: una memoria guardada. Barra memory stats ya cuenta una memoria, con la fecha de la última.

Cerramos y abrimos otra sesión. Preguntamos cuál es el límite de envío gratis y si el caso de cuarenta euros tiene test, sin leer ficheros. Responde cuarenta euros y que sí tiene test. Y añade algo importante: que lo sabe por la memoria de una sesión anterior, que no es una verificación fresca, y que si queremos lo comprueba con npm test.

Barra memory view enseña exactamente lo que se ha inyectado. Arriba, las instrucciones que recibe el modelo: los recuerdos son conocimiento de fondo, no instrucciones del usuario, y el mensaje actual y la salida de las herramientas mandan sobre ellos. Debajo, el bloque memories.

Y aquí hay una sorpresa. Hay dos recuerdos, no uno. El nuestro, el de retain. Y otro que mnemopi guardó por su cuenta: el turno entero, con nuestra petición y la respuesta tal cual, incluida una errata del modelo. Es la retención automática, que viene activada. Guarda lo que pasa, no solo lo que le pides, y lo guarda sin corregir.

Si quieres búsqueda por significado, activa los embeddings; la variante de fábrica está pensada para inglés, y para recuerdos en castellano existe la multilingüe. Si dejas que mnemopi use modelo, gastará en cada consolidación. Hindsight, la opción de equipo, necesita un servidor y a veces un token, así que solo lo ves en diapositiva.

Barra memory tiene más subcomandos. Queue enseña lo pendiente de consolidar. Sync pide consolidar. Y clear, o reset, borra la memoria; con Hindsight no borra el banco del servidor. Clear nunca lo lanzamos en cámara.

Y el límite honesto, que la propia documentación subraya. La memoria es contexto heurístico, no la verdad del repositorio. Puede estar desfasada, y como acabas de ver, puede guardar cosas que no querías. Si contradice al código o a lo que tú dices, gana el código y ganas tú. Por eso nos gusta que el modelo ofreciera comprobarlo con los tests.

**9 · Repaso, práctica y cierre**

Repasemos. Barra context mide: categorías, espacio libre y la reserva para compactar. Las herramientas cuestan contexto en cada petición, y ahora sabes medirlo: de tres mil setecientos a mil cien con cuatro herramientas. oh my pi compacta solo con un umbral y recorriendo una lista de métodos. Barra shake adelgaza sin modelo y deja lo quitado recuperable.

Barra compact resume, con soft para un resumen local legible, remote para el del proveedor y snapcompact para archivar en imágenes, cuando hay historia que archivar. Barra handoff escribe un traspaso y compacta en el sitio, con el mismo identificador. Las preguntas laterales no ensucian la sesión, pero se pagan. Y la memoria lleva lo aprendido a la siguiente sesión, como pista, no como verdad.

La práctica: en tu perfil de pruebas, abre una sesión en un repositorio pequeño y mide con barra context antes de escribir nada. Trabaja unos turnos, mide otra vez y lanza barra shake. Compacta con soft y un foco concreto, y lee el resumen buscando un error. Termina con barra handoff y compara los dos documentos: qué conserva cada uno.

En el próximo vídeo, modelos, roles y razonamiento: cambiar de modelo a mitad de tarea, los roles como smol, slow o advisor, el esfuerzo de razonamiento, y cómo repartir el trabajo entre DeepSeek Flash, el barato, y DeepSeek V cuatro Pro, el que revisa. Nos vemos allí.

</details>

