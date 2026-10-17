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

- Con este vídeo empieza la última etapa, «Diseñar tu harness», y cambia la pregunta: ya no es qué hace este comando (lo que viste con Pi y con oh my pi), sino qué decides tú y por qué.
- Harness tiene dos sentidos (vídeo 1): el programa que ejecuta el bucle, como Pi u oh my pi, y el andamiaje de tu repositorio. Las cinco piezas del vídeo 1 (instrucciones, herramientas, entorno, estado y feedback) describen los dos.
- Hoy tomas tres decisiones: cuántas herramientas ve el modelo, dónde viven los límites (truncado, tiempos, aprobaciones) y quién decide frente a quién ejecuta. La primera se mide, porque un diseño que no se mide es solo una opinión.

### 2 · Tres mapas de Learn Harness Engineering

<p><button type="button" class="ir-a" data-t="97">▶ Ir a 1:37</button></p>

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT) es la base de esta etapa. Usamos sus ideas y su estructura, con nuestras palabras. No trae una taxonomía, sino tres, y cada una responde a una pregunta:

| Mapa | Pregunta | Elementos | Dónde lo usas |
|---|---|---|---|
| 1 · El agente | ¿Qué tiene mi agente? | instrucciones, herramientas, entorno, estado, feedback | analizar productos (Pi, Claude Code, Codex); vídeo 1 |
| 2 · El repositorio | ¿Qué tiene mi repo? | instrucciones (AGENTS.md), estado (progreso), verificación (pruebas), alcance (una funcionalidad cada vez), ciclo de vida (arranque y traspaso) | vídeo 23 |
| 3 · El diagnóstico | ¿Dónde se ha roto? | especificación de la tarea, contexto, entorno, verificación, estado | capítulo 6 de este vídeo |

- Al mapa 2 le faltan herramientas y entorno: cada pieza es un fichero o una costumbre del repo.
- En el vídeo 1 diagnosticamos con las cinco piezas del mapa 1. El mapa 3 es más fino: separa la especificación de la tarea. La regla es la misma: antes de cambiar de modelo, atribuye el fallo a una capa.
- Los tres están escritos desde el asiento de quien usa un agente que ya existe y quiere que trabaje mejor. Hay otro asiento.

### 3 · El Harness Playbook: la vista desde el motor

<p><button type="button" class="ir-a" data-t="213">▶ Ir a 3:33</button></p>

- The Harness Playbook (Can Bölük, septiembre de 2026) mira desde quien construye el runtime. Su autor es el de oh my pi, y su empresa, Stencil, está detrás: es una opinión influyente, no una metodología neutral.
- Tesis: un harness es software de sistemas, no un bucle alrededor de una petición, como un motor de videojuego. Para diseñar, propone cuatro escenarios extremos: varios agentes en la misma carpeta, un agente remoto manejado desde el móvil, un espectador en una web de la que no te fías y una fábrica de software automática con entradas hostiles.
- Sus cinco principios:
  - **Sesión con autoridad:** una sola, reconstruida desde el registro, para que rebobinar, bifurcar y retomar no mientan. Si una extensión guarda su estado aparte, rebobinar miente (vídeo 9).
  - **Control de confianza:** la política vive en el anfitrión y el sandbox solo ejecuta peticiones acotadas.
  - **Trabajo acotado:** herramientas, subagentes y procesos en segundo plano se pueden cancelar y tienen límites centrales.
  - **Compatibilidad explícita** con cada modelo, en vez de suponer que todos se portan igual.
  - **Vistas como proyecciones:** la TUI, la web o el móvil enseñan el mismo estado, no copias.
- Dos avisos para leerlo: parte del texto describe omp², la próxima arquitectura, que aún se construye y no es la oh my pi que tienes instalada; y critica abiertamente a Pi (de diecisiete extensiones de ejemplo con estado, dice que solo dos lo guardaban bien), mientras la ficha de Pi de WalkingLab elogia esas mismas extensiones.
- Donde coinciden los dos textos: definir antes qué significa terminado, tratar el contexto como un presupuesto y guardar el estado fuera del modelo (en el repositorio o en el registro de la sesión).

### 4 · Cada esquema cobra un impuesto

<p><button type="button" class="ir-a" data-t="387">▶ Ir a 6:27</button></p>

- Cada herramienta cobra tres impuestos: el prefijo (su esquema y sus líneas del prompt viajan en cada petición; la caché lo abarata, no lo regala), la elección (una opción más entre las que el modelo duda) y el estilo (cambia cómo trabaja el modelo).
- Cifras del Playbook, que no hemos reproducido: con unas cinco herramientas, oh my pi hizo su prueba en 36,5 s, frente a 37 s de Pi y 42 s de Codex; con sus 23 definiciones de serie, 86 s. La lección no es quién gana, sino que el roster se mide.
- En Pi decides el roster por ejecución (`-t`, `--exclude-tools`, `--no-mcp`) o lo versionas en `.pi/settings.json` con `defaultTools` (los dos, más abajo, en «Código y comandos»). Lo que no cabe se esconde detrás de codemode o `tool_search` (vídeo 7).
- oh my pi monta las herramientas poco usadas como dispositivos descubribles, con direcciones `xd://`: el modelo sabe que existen y lee su documentación cuando las necesita. Es el ajuste `tools.xdev`, encendido por defecto. Learn Harness Engineering lo llama divulgación progresiva.
- Si quitas una herramienta que el modelo necesita, no se para: improvisa con otra (sin edición, edita con bash). Y decide el roster al empezar: las herramientas van al principio de cada petición, que es lo que aprovecha la caché.

### 5 · Medir el prefijo

<p><button type="button" class="ir-a" data-t="574">▶ Ir a 9:34</button></p>

- Antes de medir, controla variables: ninguna extensión ni servidor MCP de vídeos anteriores, ninguna configuración de oh my pi en la tienda y el mismo modelo en los dos agentes (DeepSeek Flash).
- `prefijo.sh` lanza «di solo hola» en modo print con `--mode json` y suma los tokens de entrada, también los de caché: lo que pesa el roster antes de trabajar.

| Agente · roster | Tokens de entrada |
|---|---|
| Pi · sin herramientas | 794 |
| Pi · `read,bash` | 1428 |
| Pi · las 4 de serie | 1971 |
| Pi · las 7 integradas | 2539 |
| Pi · las de serie + codemode | 2542 |
| oh my pi · `read,bash,edit,write` | 4428 |
| oh my pi · todo, con catálogo `xd://` | ≈8000 |
| oh my pi · todo, sin catálogo (`tools.xdev: false`) | más de 10 600 |

- Lee las diferencias, no los totales: `read`+`bash` suman unos 600 tokens, `edit`+`write` unos 550 y `grep`+`find`+`ls` otros 570. Codemode sola pesa como esas tres, porque su descripción explica cómo escribir scripts.
- El catálogo de oh my pi ahorra unos 2600 tokens por petición, aunque usar una descubrible obliga antes a leer su documentación. Con las mismas cuatro herramientas, oh my pi pesa más del doble que Pi porque su prompt de sistema trae mucho más.
- En el vídeo 1, `/context` daba unos 6,6K para oh my pi (2,7K de prompt y 3,9K de herramientas). Aquí la cifra sale de los tokens de entrada de una petición real y con otro roster, así que no tiene por qué coincidir.

### 6 · La misma tarea con rosters distintos

<p><button type="button" class="ir-a" data-t="723">▶ Ir a 12:03</button></p>

- El encargo es pequeño y verificable: añadir a `envio.js` `faltaParaEnvioGratis(subtotal)`, que diga cuánto falta para el envío gratis, a céntimos, y 0 si ya lo tiene, con la misma validación que `gastosEnvio`, con pruebas y `npm test`.
- `medir.sh` crea un worktree de git por configuración y repetición (`git worktree add --detach`, porque master ya está abierta), lanza el agente con `--mode json`, guarda los eventos y juzga desde fuera: si `npm test` pasa y cuántos ficheros cambiaron. Lleva `set -e` para pararse si un paso falla, antes de lanzar el agente en la carpeta equivocada.
- Seis configuraciones (Pi: `read,bash`, las 4 de serie, las 7 integradas; oh my pi: 4 herramientas, con catálogo, sin catálogo), tres repeticiones cada una: 18 ejecuciones en 5 min 48 s, todas pasan `npm test` y el experimento cuesta menos de 7 céntimos de dólar.

| Configuración | Tokens de media | Coste de media | Vueltas |
|---|---|---|---|
| oh my pi · 4 herramientas | ≈70 000 | ≈0,3 céntimos | — |
| oh my pi · con catálogo | ≈100 000 | ≈0,3 céntimos (algo menos que con 4) | — |
| oh my pi · sin catálogo | ≈142 000 | ≈0,4 céntimos | — |
| Pi · `read,bash` | ≈28 000 | — | 6 a 8 |
| Pi · las 4 de serie | ≈23 000 | — | 5 |

- Los tokens siguen al prefijo, que viaja en cada vuelta; el coste no, porque más del 90 % sale de la caché. Y dentro de una misma configuración, una ejecución costó 0,2 céntimos y otra casi 0,8: con tres repeticiones, la diferencia de coste es ruido.
- Con solo `read` y `bash`, Pi reescribió el fichero entero con un heredoc, añadió las pruebas con `cat` y arregló el import con `perl` tras fallar con `sed`. Funciona, pero pierdes un cambio pequeño que puedes revisar.
- Diagnóstico por capas (mapa 3): el agente sacó la validación a una función nueva, `validarSubtotal`, que nadie pidió. Aparece en 10 de las 18 ejecuciones, con todos los rosters y en los dos agentes, así que no es la capa de herramientas, sino la de especificación: «con la misma validación» se lee como «reutilízala». `npm test` pasa en las 18: el juez externo no ve un cambio de más, y por eso sigues mirando el diff.
- El método es lo que te llevas: un encargo pequeño y verificable, rosters que cambian en una sola cosa, carpetas aisladas, repeticiones y un juez externo. Con otro modelo, otra tabla.

### 7 · Límites centralizados

<p><button type="button" class="ir-a" data-t="1006">▶ Ir a 16:46</button></p>

- Principio del Playbook: acota la salida una sola vez, en el centro. Si cada herramienta trunca por su cuenta, cada una avisa a su manera y alguna se olvida.
- Pi trunca en tres sitios: las herramientas integradas cortan en 2000 líneas o 50 KB con una utilidad que cada herramienta tiene que llamar (las tuyas deben truncar; lo dice la documentación), MCP corta a los 20 KB y codemode a los 10 000 tokens.
- El Playbook avisa de que truncar dentro de una herramienta rompe el codemode, porque el aviso se mezcla con los datos. Pi lo evita: dentro de un script de codemode, bash no se limita a los 50 KB que ve el modelo (en el vídeo, hasta un mega), para que el script filtre.
- Para la política, Pi sí tiene un punto central: el evento `tool_call`. Por él pasa toda llamada, también las de MCP y las anidadas en un script de codemode. Por eso la extensión de permisos del vídeo 8 vigilaba todo desde un sitio.
- oh my pi centraliza los límites en el grupo `tools` de su configuración: bash y eval comparten un recolector con 50 KB entre cabeza y cola, y el resto va a un artefacto. `tools.maxTimeout` a 0 significa sin tope. Y aunque pongas uno, no es un límite duro: en el código que revisamos, si el modelo pide un timeout de 0, el comando queda sin límite. El límite duro, fuera del modelo: `--max-time` o el de tu integración continua.

> **Nota:** `bash-tool-runtime.md` dice que el tiempo se acota a 1–3600 s; el comportamiento con un timeout de 0 lo comprobamos en el código de omp 18.6.1. Comprueba tu versión.

- Pregúntate, por cada pieza nueva, dónde vive su límite. Si vive dentro de la pieza, apúntalo, porque lo repetirás en cada pieza nueva. Si vive en un sitio común (`tool_call` en Pi, `tools` en oh my pi), escríbelo ahí y versiónalo. Lo que no está clasificado, trátalo como peligroso: los patrones de bash no cubren `eval` (vídeo 19).

### 8 · El anfitrión decide, el sandbox ejecuta

<p><button type="button" class="ir-a" data-t="1215">▶ Ir a 20:15</button></p>

- El anfitrión es dueño de la sesión, el modelo, la política, las aprobaciones y los límites; el sandbox solo ejecuta lo que le piden y devuelve una salida acotada.
- Las tres formas de ejecutar Pi del vídeo 5, leídas con este principio:

| | Pi directo | Pi entero en un contenedor | Pi fuera, herramientas en una micro-VM (Gondolin) |
|---|---|---|---|
| Sesión, claves y política | en tu máquina | dentro de la caja | en el anfitrión |
| Carpeta y comandos | en tu máquina | dentro de la caja | en la micro-VM |
| Lo que protege | ninguna frontera | toda tu máquina | las claves y la política, frente a menos superficie |

- Según la documentación de Pi, meterlo entero en un entorno aislado suele ser lo más fuerte; aislar solo las herramientas es una frontera más estrecha (las de otras extensiones siguen en el anfitrión, y los comandos heredan sus variables de entorno). Son dos decisiones distintas y se pueden combinar. Docker Sandboxes aplica la idea a las credenciales: la clave real se queda fuera y dentro hay un valor de relleno.
- `task.isolation.enabled` en oh my pi da a los subagentes un espacio aislado y devuelve sus cambios como parche: evita que se pisen, pero no es una frontera de seguridad.
- Aprobar no es aislar: las aprobaciones deciden qué se ejecuta; solo una frontera del sistema operativo o una máquina virtual decide qué puede tocar. Lo que cruza la frontera, lo más estrecho posible: la carpeta que la tarea necesita, credenciales de poco alcance y corta vida, y red solo si hace falta.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1411">▶ Ir a 23:31</button></p>

- Tres decisiones: un roster pequeño y medido, con la cola larga detrás de codemode, `tool_search` o el catálogo; límites en un solo sitio, sabiendo cuáles dependen de cada herramienta; y el anfitrión que decide frente al sandbox que ejecuta.
- **Práctica, 1:** escribe la ficha de tu harness en una página, con tres apartados: qué herramientas ve el modelo y por qué, dónde vive cada límite, y qué se ejecuta dentro de una frontera y qué fuera.
- **Práctica, 2:** elige una tarea pequeña con una prueba que la juzgue y lánzala con dos rosters, tres veces cada uno, en worktrees separados. Compara tokens, coste, llamadas, si la prueba pasa y qué hay en el diff. Si la diferencia es ruido, quédate con el roster que entiendes mejor.
- Apunta la fecha: el harness se degrada como el código. Cuando cambie el modelo, repite la medida.
- **Vídeo 23:** el repo como sistema de registro: AGENTS.md, funcionalidades, progreso, arranque y traspaso.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Pi · el roster por ejecución

```text
pi -t read,bash
pi -t +codemode,-write
pi --exclude-tools "mcp__*"
pi --no-mcp
```

- `-t read,bash`: lista cerrada; solo esas dos.
- `-t +codemode,-write`: parte de las de serie, añade codemode y quita write.
- `--exclude-tools "mcp__*"`: quita herramientas por nombre o con asterisco.
- `--no-mcp`: apaga MCP solo en esta ejecución.

### .pi/settings.json

```text
{
  "defaultTools": ["+codemode", "-write"]
}
```

- `defaultTools`: la misma sintaxis que `-t`, en un fichero del proyecto. Versionado, todo el equipo arranca con el mismo roster.

## Fuentes

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT): sus tres mapas, la divulgación progresiva y los directorios aislados para comparar. Ideas y estructura reutilizadas con nuestras palabras.
- The Harness Playbook (Can Bölük, septiembre de 2026): los cinco principios, el impuesto de cada esquema y la separación entre anfitrión y sandbox. Es la opinión del autor de oh my pi.
- Grabado con Pi 1.0.4. Documentación oficial de Pi: [cli.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/cli.md) (§Tools), [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md) (`defaultTools`), [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md) (truncado y `tool_call`), [codemode.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/codemode.md), [mcp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md), [security.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/security.md) y [containerization.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/containerization.md).
- Grabado con oh my pi 18.6.1. Documentación (`omp read omp://…`): `settings.md` (§«Tools and approvals»: `tools.xdev`, `tools.maxTimeout`, artefactos), `bash-tool-runtime.md` («Pattern approval is not containment»), `cli-reference.md` (`--tools`, `--config`, `--max-time`) y `tools/task.md` (aislamiento de subagentes).
- Vídeos relacionados: 1 (las cinco piezas y `/context`), 5 (formas de ejecutar Pi), 7 (el coste de las herramientas y codemode), 8 (extensión de permisos), 9 (estado de las extensiones) y 19 (aprobaciones de oh my pi).

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

