---
title: "Vídeo 23 · El repo como sistema de registro"
description: "Sacar el estado de la conversación al repo (instrucciones, progreso, documento de traspaso) para que cualquier sesión retome el trabajo sin perder el hilo."
ruta: "pi-oh-my-pi"
orden: 23
duracion: "23 min"
video: "23-el-repo-como-sistema-de-registro.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/23-el-repo-como-sistema-de-registro.es.vtt"
---

Sacar el estado de la conversación al repo (instrucciones, progreso, documento de traspaso) para que cualquier sesión retome el trabajo sin perder el hilo.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que no está en el repo no existe

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- Si mañana cierras la terminal, ¿dónde está el estado? Qué está terminado, qué quedó a medias, por qué, qué falta probar. Si la respuesta es «en la conversación», está en el sitio más frágil.
- Lección 3 de Learn Harness Engineering: lo que no está en el repositorio no existe para el agente. Sus tres entradas son el prompt y la tarea, los ficheros del repo y la salida de sus herramientas; tu cabeza, el chat del equipo y la sesión de ayer no están.
- El repositorio como sistema de registro: el sitio donde vive, con autoridad, el estado del trabajo. No el código, que ya está ahí, sino qué hay que hacer, en qué punto estamos, cómo se arranca y se comprueba, y qué tiene que saber la siguiente sesión.
- La prueba de fuego: una sesión de Pi deja una tarea a medias y una sesión nueva de oh my pi, con otro modelo y sin conversación previa, la retoma leyendo solo el repositorio.

### 2 · El mapa del repositorio y la quinta pregunta

<p><button type="button" class="ir-a" data-t="128">▶ Ir a 2:08</button></p>

- El mapa 2 del vídeo 22 tiene cinco piezas, y cada una es un fichero o una costumbre: instrucciones (el AGENTS.md del vídeo 6), estado (progreso y lista de funcionalidades), alcance (una funcionalidad cada vez), ciclo de vida (arranque, rutinas de entrada y salida, traspaso) y verificación (el vídeo 24).
- La prueba de la sesión nueva del vídeo 6 hace cinco preguntas: qué es el proyecto, cómo está organizado, cómo se arranca, cómo se verifica y en qué punto está. AGENTS.md responde a las cuatro primeras. La quinta es la que cambia cada día.
- *En la demo:* en master, Pi responde a la quinta deduciendo del historial de git. Pero un historial dice lo que se hizo, no lo que falta. Faltan cuatro ficheros, más un quinto cuando haga falta, que cualquier agente lea al empezar y actualice al terminar.

### 3 · El paquete mínimo

<p><button type="button" class="ir-a" data-t="232">▶ Ir a 3:52</button></p>

- El paquete mínimo, según la guía de plantillas de Learn Harness Engineering: instrucciones, script de arranque, progreso y lista de funcionalidades. El traspaso y la lista de estado limpio, cuando el proyecto crece. Las plantillas son © 2025 WalkingLab con licencia MIT: si las adaptas, cítalas en los créditos, en el AGENTS.md y con la licencia en el repo.
- Los nombres dan igual (los traducimos; tabla más abajo, en «Código y comandos»). Lo que importa es que AGENTS.md los nombre: ningún agente actualiza un fichero de progreso por su cuenta.
- Anthropic (noviembre de 2025) cuenta la misma idea con un agente inicializador: su primera sesión no escribe código de producto, deja la lista de funcionalidades pendientes, el arranque, el progreso y un commit. Cada sesión siguiente confirma la carpeta, lee historial y progreso, elige la siguiente funcionalidad y comprueba que lo básico funciona antes de tocar nada.
- Lección 6: inicializar es una fase propia. Mezclada con el código, la infraestructura pierde, porque su valor solo aparece en la siguiente sesión. Un repo está bien inicializado si cumple cuatro condiciones: se puede arrancar, se puede probar, se ve el progreso y se puede retomar. Ninguna habla de cuánto código hay.
- Estado limpio al final de cada sesión:
  - el arranque estándar sigue funcionando;
  - la verificación sigue pasando;
  - el progreso está apuntado;
  - la lista refleja lo que pasa de verdad, no lo que se espera;
  - no queda ningún paso a medias sin anotar;
  - la siguiente sesión puede seguir sin arreglos manuales.

### 4 · La lista de funcionalidades

<p><button type="button" class="ir-a" data-t="392">▶ Ir a 6:32</button></p>

- Cada entrada tiene tres partes: comportamiento (qué tiene que pasar), verificación (cómo se comprueba) y estado. Si falta una, no sirve. Los estados son cuatro: `sin empezar`, `en curso`, `bloqueada` y `pasa`. `bloqueada` no es un fracaso: es la forma honesta de decir que algo no puede avanzar, con el motivo en las notas.
- Dos reglas: solo una funcionalidad `en curso` a la vez, y una funcionalidad solo cambia a `pasa` cuando la verificación se ha ejecutado y la evidencia (el comando y lo que salió) está anotada. Que el código esté escrito no cuenta.
- Granularidad: que cada entrada quepa en una sesión. «Implementar el ticket» nunca llega a `pasa`; «crear la variable del total» convierte la lista en burocracia.
- En JSON y no en Markdown, porque se lee con un programa (`init.sh`, `jq`, una extensión) y porque, según el artículo de Anthropic, el modelo tiende menos a reescribir un JSON; por eso pedían a las sesiones tocar solo el campo de estado.
- Límite: según Learn Harness Engineering, el cambio a `pasa` lo decide el harness, no el agente. En esta demo lo hace el propio agente porque AGENTS.md se lo pide: es una instrucción, no una puerta. El vídeo 24 lo convierte en comprobación.

### 5 · Progreso, init.sh y traspaso

<p><button type="button" class="ir-a" data-t="545">▶ Ir a 9:05</button></p>

- `progreso.md` tiene arriba el estado verificado (dónde está el repo, cómo se arranca y se verifica, la siguiente funcionalidad, bloqueos) y debajo un registro por sesión (objetivo, completado, verificación, evidencia, commits, riesgos, siguiente paso). Verificado significa lo que comprobó, no lo que cree. Y resume las sesiones viejas: cada línea cuesta contexto.
- `init.sh` es el arranque estándar. El de la tienda no instala nada (un `npm install` podría dejar un fichero de bloqueo nuevo sin seguimiento): enseña la carpeta y la versión de node, lo que queda sin commitear, ejecuta `npm test` y dice cuál es la funcionalidad activa o la siguiente. Regla: si la base ya falla al empezar, primero arregla eso. Lo usan tú, el agente y la integración continua.
- `traspaso.md`, solo si algo queda a medias, tiene cinco apartados:
  1. lo que está verificado ahora;
  2. lo que cambió en esta sesión;
  3. lo que está roto o sin verificar;
  4. el siguiente paso, con qué cuenta como terminado y qué no hay que tocar;
  5. los comandos para arrancar y verificar.
- `/handoff` de oh my pi guarda el traspaso como compactación en la sesión (o entre los artefactos, con `handoffSaveToDisk`), y la extensión `handoff.ts` de Pi lo convierte en el prompt de una sesión nueva. Útiles, pero ninguno se versiona con el código.
- Lección 5: la compactación conserva el qué y pierde el porqué. El traspaso, escrito por la sesión que tomó las decisiones, es el sitio del porqué. Lo que tenga que durar más que una tarea, a un registro de decisiones.

### 6 · Montar el andamiaje en la tienda

<p><button type="button" class="ir-a" data-t="720">▶ Ir a 12:00</button></p>

- Controla variables antes de probar: ningún fichero de contexto fuera del repo, memoria de oh my pi apagada, sin retomar sesiones y ninguna carpeta `.omp` en la tienda (un `.omp/AGENTS.md` taparía el de la raíz).
- AGENTS.md (el del vídeo 6, con una línea de crédito a WalkingLab) gana dos rutinas:
  - **Al empezar:** confirmar la carpeta; leer el progreso y el traspaso si tiene algo; leer la lista y elegir la funcionalidad en curso o la siguiente; mirar los últimos commits; ejecutar `./init.sh`.
  - **Al terminar:** actualizar la lista y el progreso; escribir el traspaso si queda algo a medias o vaciarlo si no; hacer commit solo si las pruebas pasan. Es la rutina más fácil de olvidar: si no está escrita, no ocurre.
- Y tres reglas: solo una funcionalidad en curso; `pasa` solo con la verificación ejecutada y la evidencia anotada; y no cambiar la verificación de una funcionalidad para que pase.
- `funcionalidades.json` tiene tres entradas para un fichero nuevo, `ticket.js` (formatear euros, línea de ticket y ticket completo), todas sin empezar, con su verificación y las evidencias vacías.
- *En la demo:* con el andamiaje, la quinta pregunta ya no se deduce del historial: se lee. Esa es la diferencia entre un repositorio documentado y un sistema de registro.

### 7 · Sesión uno, en Pi

<p><button type="button" class="ir-a" data-t="872">▶ Ir a 14:32</button></p>

- Con el encargo más vago posible («trabaja en la siguiente funcionalidad»), Pi sigue la rutina de entrada tal cual y elige `ticket-001` sin que se lo digas: el qué, el dónde y el cómo se prueba salen del repo.
- Escribe el código y las pruebas, cambia el estado a `pasa` con dos evidencias (comando y resultado), actualiza el progreso, hace commit y vuelve a ejecutar `init.sh`, que ya señala `ticket-002`. Todo en menos de un minuto. No la marcó antes `en curso`: la regla se cumple, pero el estado intermedio no llegó a verse.
- Para dejar algo a medias, el segundo encargo pide «escribe solo la función, sin las pruebas». La rutina de salida la hace sin pedírsela, porque está en AGENTS.md: deja `ticket-002` `en curso`, escribe en el traspaso qué falta (pruebas con una y con varias unidades, y el redondeo) y hace commit solo tras comprobar que las pruebas existentes pasan.
- La sesión de Pi existe y se podría retomar. No la retomamos: a partir de aquí, la conversación no existe.

### 8 · Sesión dos, en oh my pi

<p><button type="button" class="ir-a" data-t="1035">▶ Ir a 17:15</button></p>

- Sesión nueva de oh my pi, con otro modelo (DeepSeek V4 Pro), memoria apagada y una sola palabra: «Continúa.». Si tuvieras que explicarle más, el andamiaje no funciona: lo que no está escrito, el agente lo adivina en cada sesión.
- oh my pi carga solo el AGENTS.md de la raíz, sigue la misma rutina de entrada y su plan es justo el del traspaso: añadir las pruebas, ejecutarlas, marcar `pasa` con evidencia, actualizar progreso y traspaso, y commit. No rehace `ticket-001`.
- Coste de reconstrucción (Learn Harness Engineering): lo que tarda una sesión nueva en volver a ser productiva. Aquí, cuatro turnos y unos 48 000 tokens antes de la primera edición, unas tres décimas de céntimo, incluido un comando de bash que falló y repitió. Sin andamiaje, esos cuatro turnos serían una conversación contigo.
- La sesión entera: 15 turnos y 0,7 céntimos. La de Pi fueron 22 turnos y 1,5 céntimos por dos funcionalidades; no son comparables, porque cambian el modelo y la cantidad de trabajo.
- Desde fuera y sin agente: dos sesiones de dos agentes en un mismo `git log`, dos funcionalidades en `pasa` con dos evidencias cada una, ninguna en `pasa` sin evidencias, el traspaso vacío e `init.sh` en verde señalando `ticket-003`.
- Hay dos registros. El JSONL de la sesión dice qué vio e hizo la conversación (por eso en el vídeo 9 guardamos el estado de las extensiones en la rama de la sesión). El repositorio dice qué es verdad del proyecto. Rebobinar la conversación no rebobina tus ficheros (vídeo 3): eso lo arbitra git.

### 9 · Límites, repaso y cierre

<p><button type="button" class="ir-a" data-t="1224">▶ Ir a 20:24</button></p>

- Tres límites:
  - **Límite 1 · Son instrucciones.** Si la sesión se corta de golpe (escape, contexto agotado), no hay rutina de salida. La siguiente lo detecta con `git status` e `init.sh`, pero reconstruye sin traspaso.
  - **Límite 2 · Un fichero desfasado es peor que ninguno.** Manda al agente en la dirección equivocada mientras cree que va bien. Si el progreso y las pruebas discrepan, ganan las pruebas.
  - **Límite 3 · Dos agentes a la vez se pisan el progreso.** Un fichero de progreso por agente, o ramas y worktrees (vídeos 16 y 18).
- La memoria del vídeo 13 no sustituye esto: es contexto heurístico fuera del repo, que Pi no ve y quien clona no recibe. Úsala para tus preferencias; el estado del proyecto, en el repo.
- **Práctica:** en un proyecto tuyo, monta el paquete mínimo a partir de las plantillas de Learn Harness Engineering, citando su licencia. Divide una tarea en tres funcionalidades de una sesión cada una, trabaja la primera, deja la segunda a medias y continúa en una sesión nueva, mejor con el otro agente. Anota el coste de reconstrucción y qué tuviste que explicar a mano: eso es lo que le falta a tu andamiaje.
- **Vídeo 24:** verificar de verdad, para que «terminado» no dependa de que el agente diga que ha terminado.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Plantilla de WalkingLab → la tienda

```text
AGENTS.md              → AGENTS.md
feature_list.json      → funcionalidades.json
claude-progress.md     → progreso.md
init.sh                → init.sh
session-handoff.md     → traspaso.md
```

- `funcionalidades.json`: la lista de funcionalidades, cada una con comportamiento, verificación, estado y evidencias.
- `progreso.md`: el estado verificado arriba y el registro por sesión debajo. `claude-progress.md` es un nombre histórico: vale para cualquier agente.
- `init.sh`: el arranque estándar; dice si la base funciona y cuál es la siguiente funcionalidad.
- `traspaso.md`: lo que queda a medias, en cinco apartados; vacío si no queda nada.

## Fuentes

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT): lecciones 3 (lo que no está en el repo no existe), 5 (la compactación pierde el porqué) y 6 (inicializar es una fase propia), y su biblioteca de plantillas (`AGENTS.md`, `feature_list.json`, `claude-progress.md`, `init.sh`, `session-handoff.md`).
- Anthropic, *Effective harnesses for long-running agents* (Justin Young, 26 nov 2025), https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents: el agente inicializador, la lista de funcionalidades en JSON y la rutina de cada sesión.
- The Harness Playbook (Can Bölük): el journal de la sesión como única autoridad de la sesión.
- Grabado con Pi 1.0.4: ejemplos de extensiones `handoff.ts`, `todo.ts`, `auto-commit-on-exit.ts` y `dirty-repo-guard.ts`.
- Grabado con oh my pi 18.6.1: `context-files.md` (cómo busca el `AGENTS.md` y por qué `.omp/AGENTS.md` lo tapa) y `handoff-generation-pipeline.md` (`/handoff` y `handoffSaveToDisk`).
- Vídeos relacionados: 3 (compactación y árbol), 6 (AGENTS.md y la prueba de la sesión nueva), 9 (estado de las extensiones), 12 (sesiones de oh my pi), 13 (`/handoff` y memoria), 22 (el mapa del repositorio) y 24 (verificar de verdad).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que no está en el repo no existe**

Empecemos con una pregunta incómoda. Si mañana cierras la terminal, ¿dónde está el estado de lo que estabas haciendo con el agente? Qué funcionalidades están terminadas, cuál quedó a medias, por qué elegiste una solución y no otra, qué falta probar. Si la respuesta es en la conversación, lo tienes en el sitio más frágil de todos.

Recuerda lo que hemos ido viendo. En el vídeo tres, la compactación de Pi escribió un resumen que contaba otra historia, y sacamos una lección: las decisiones de verdad tienen que vivir en ficheros. En el doce, las sesiones de oh my pi son ficheros JSONL en la carpeta de tu perfil, no en tu proyecto. En el trece, barra handoff y la memoria, que son útiles, pero son resúmenes y pistas, no la verdad.

Learn Harness Engineering, el curso de WalkingLab con licencia MIT que nos acompaña en este bloque, lo resume en una idea de su tercera lección: lo que no está en el repositorio no existe para el agente. Un agente tiene tres entradas: el prompt y la tarea, los ficheros del repositorio, y la salida de sus herramientas. Tu cabeza, el chat del equipo y la sesión de ayer no están en esa lista.

Por eso este vídeo va de convertir el repositorio en el sistema de registro: el sitio donde vive, con autoridad, el estado del trabajo. No el código, que ya vive ahí, sino todo lo demás: qué hay que hacer, en qué punto estamos, cómo se arranca y se comprueba, y qué tiene que saber la siguiente sesión.

Y la prueba de fuego la haremos con dos agentes. Una sesión de Pi trabajará en la tienda y dejará una tarea a medias. Después, una sesión nueva de oh my pi, con otro modelo y sin ninguna conversación previa, tendrá que retomarla leyendo solo el repositorio.

**2 · El mapa del repositorio y la quinta pregunta**

En el vídeo veintidós presentamos el segundo mapa de Learn Harness Engineering, el del repositorio, con cinco piezas: instrucciones, estado, verificación, alcance y ciclo de vida de la sesión. Prometimos que era el mapa de este vídeo. Cada pieza es un fichero o una costumbre, y hoy vamos a montarlas.

Las instrucciones ya las tienes: el AGENTS punto md del vídeo seis. El estado será un fichero de progreso y una lista de funcionalidades. El alcance, una regla sencilla: una funcionalidad cada vez. El ciclo de vida, un script de arranque, una rutina de entrada, una de salida y un documento de traspaso. Y la verificación la nombramos hoy, pero es el tema entero del próximo vídeo.

En el vídeo seis hicimos la prueba de la sesión nueva, con sus cinco preguntas: qué es el proyecto, cómo está organizado, cómo se arranca, cómo se verifica y en qué punto está. Nuestro AGENTS punto md estaba pensado para responder a las cuatro primeras. La quinta es la que hoy nos importa, porque es la única que cambia cada día.

Lo comprobamos en la tienda, tal como quedó en master. En modo print, sin sesión, le pedimos a Pi que no edite nada y conteste las cinco preguntas. Qué es, cómo está organizada, cómo se arranca y cómo se prueba, lo saca del AGENTS punto md. Pero en qué punto está el trabajo lo deduce del historial de git: árbol limpio, el último commit y lo que añadieron los anteriores. Y un historial dice lo que se hizo, no lo que falta.

Esa es la carencia que vamos a cubrir. Cuatro ficheros, más un quinto cuando haga falta, que cualquier agente pueda leer al empezar y actualizar al terminar.

**3 · El paquete mínimo**

Learn Harness Engineering trae una biblioteca de plantillas, y su guía dice qué copiar primero: el fichero de instrucciones, un script de arranque, un fichero de progreso y una lista de funcionalidades. El traspaso y una lista de comprobación de estado limpio se añaden cuando el proyecto crece. Nosotros partimos de esas plantillas, con copyright de WalkingLab de dos mil veinticinco y licencia MIT, las adaptamos a la tienda y las traducimos, y lo dejamos dicho en los créditos, en el propio AGENTS punto md y con el texto de la licencia en la rama.

Un detalle sobre los nombres. La plantilla de progreso se llama claude progress punto md, y la propia plantilla explica que es un nombre histórico y que vale para cualquier agente. Añade algo importante: ningún agente lo actualiza solo. Funciona porque las instrucciones del repositorio le dicen que lo lea al empezar y lo actualice al terminar. Por eso nosotros usamos nombres en español: funcionalidades punto json, progreso punto md, init punto sh y traspaso punto md. El nombre da igual; lo que importa es que AGENTS punto md los nombre.

Esta idea no es solo de WalkingLab. Anthropic publicó en noviembre de dos mil veinticinco un artículo sobre agentes que trabajan durante muchas sesiones. Su primera sesión, a la que llaman inicializador, no escribe código de producto: deja una lista de más de doscientas funcionalidades, todas marcadas como pendientes, un script de arranque, un fichero de progreso y un primer commit. Cada sesión siguiente empieza igual: confirma la carpeta, lee el historial y el progreso, elige la siguiente funcionalidad y comprueba que lo básico funciona antes de tocar nada.

Learn Harness Engineering lo convierte en un principio: la inicialización es una fase propia. Su sexta lección lo explica así: si mezclas montar el entorno con escribir funcionalidades, el agente prioriza el código, porque se ve, y descuida la infraestructura, cuyo valor solo aparece en la siguiente sesión.

¿Cuándo está bien inicializado un repositorio? Con cuatro condiciones: se puede arrancar, se puede probar, se ve el progreso y se puede retomar. Fíjate en que ninguna habla de cuánto código hay. Hablan de si una sesión que no sabe nada puede ponerse a trabajar sin adivinar.

Y hay una condición simétrica para el final de cada sesión, que el curso llama estado limpio. Su lista de comprobación es corta: el arranque estándar sigue funcionando, la verificación sigue pasando, el progreso está apuntado, la lista refleja lo que pasa de verdad y no lo que se espera, no queda ningún paso a medias sin anotar, y la siguiente sesión puede seguir sin arreglos manuales.

**4 · La lista de funcionalidades**

Empecemos por la pieza más nueva, la lista de funcionalidades. Para Learn Harness Engineering no es una lista de tareas para personas, sino una estructura del harness. Cada entrada tiene tres partes: un comportamiento, que dice qué tiene que pasar; una verificación, que dice cómo se comprueba; y un estado. Si falta una de las tres, la entrada no sirve.

Los estados de la plantilla son cuatro: sin empezar, en curso, bloqueada y pasa. Y tiene dos reglas que valen más que todo lo demás. Solo puede haber una funcionalidad en curso a la vez. Y una funcionalidad solo pasa a pasa cuando la verificación se ha ejecutado de verdad y la evidencia está anotada: el comando y lo que salió. Que el código esté escrito no cuenta.

Nuestra lista tiene tres entradas, todas en un fichero nuevo de la tienda, ticket punto js. La primera, formatear euros, que devuelve un importe con dos decimales, coma y el símbolo del euro. La segunda, línea de ticket, que escribe una línea con la cantidad, el nombre, el precio y el importe. La tercera, ticket, que monta el texto completo con el envío y el total. Cada una cabe en una sesión, que es la granularidad que recomienda el curso.

La granularidad importa más de lo que parece. Una entrada como implementar el ticket es demasiado grande: no se termina en una sesión y nunca llega a pasar. Una como crear la variable del total es demasiado pequeña, y la lista se convierte en burocracia. Y el estado bloqueada no es un fracaso: es la forma honesta de decir que algo no puede avanzar, con el motivo escrito en las notas.

¿Por qué en JSON y no en una lista en markdown? Por dos razones. La primera es que se puede leer con un programa: init punto sh, una consulta de jota cu o una extensión pueden saber cuál es la siguiente sin preguntarle a nadie. La segunda la cuenta Anthropic en su artículo: el modelo tiende menos a cambiar o sobrescribir un JSON que un markdown, y por eso pedían a las sesiones que solo tocaran el campo que dice si pasa.

Y aquí va el primer apunte honesto. Learn Harness Engineering insiste en que el paso a pasa no lo decide el agente, sino el harness: el agente pide la verificación, y es otra pieza la que la ejecuta y cambia el estado. En nuestra demo, ese paso lo da el propio agente, porque AGENTS punto md se lo pide. Es una instrucción, no una puerta. De cómo convertir una instrucción en una comprobación hablaremos en el próximo vídeo.

**5 · Progreso, init punto sh y traspaso**

El fichero de progreso tiene dos partes. Arriba, el estado verificado: dónde está el repositorio, cómo se arranca, cómo se verifica, cuál es la siguiente funcionalidad y si hay algún bloqueo. Debajo, un registro con una entrada por sesión: objetivo, lo completado, qué verificación se ejecutó, la evidencia, los commits, los riesgos y el siguiente paso.

Fíjate en la palabra verificado. El estado de arriba no es lo que el agente cree, sino lo que comprobó. Es la misma idea de la definición de hecho del vídeo seis, aplicada a todo el proyecto. Y conviene que el registro no crezca sin fin: cada sesión lo lee entero, y cada línea cuesta contexto. Cuando se haga largo, resume las sesiones viejas en una línea.

El segundo fichero es init punto sh, el arranque estándar. La plantilla instala dependencias, verifica y arranca la aplicación. La tienda no tiene dependencias, así que no instalamos nada: un npm install podría dejar un fichero de bloqueo nuevo sin seguimiento, justo lo contrario de un estado limpio. El nuestro enseña la carpeta y la versión de node, lo que queda sin commitear, ejecuta npm test, y termina diciendo cuál es la funcionalidad activa o la siguiente.

¿Para qué un script si el agente sabe ejecutar npm test? Porque el arranque deja de depender de la memoria de nadie. La regla de la plantilla es clara: si la verificación de base ya falla al empezar, primero se arregla eso, y no se apila trabajo nuevo encima de un punto de partida roto. Y el mismo script lo usas tú, el agente de mañana y la integración continua.

El tercero es el traspaso, y es el que el vídeo trece nos dejó pendiente. La plantilla tiene cinco apartados: lo que está verificado ahora; lo que cambió en esta sesión; lo que está roto o sin verificar; el siguiente paso, con qué cuenta como terminado y qué no hay que tocar; y los comandos para arrancar y verificar. Solo hace falta cuando una sesión deja algo a medias.

Compáralo con lo que ya conoces. Barra handoff de oh my pi genera un documento de traspaso, pero lo guarda como una compactación dentro de la misma sesión. Si activas handoff save to disk, los traspasos automáticos se guardan además como ficheros, pero entre los artefactos de la sesión, no en tu proyecto. Y Pi trae un ejemplo de extensión, handoff punto ts, que resume la conversación en un prompt para abrir una sesión nueva. Los tres son útiles. Ninguno se versiona con el código.

Nuestro traspaso punto md sí, y cualquier agente lo puede leer. La quinta lección de Learn Harness Engineering explica que la compactación conserva el qué y pierde el porqué: el código queda, pero no el motivo de cada decisión. El traspaso, escrito por la sesión que tomó las decisiones, es el sitio para ese porqué. Lo que tenga que durar más que una tarea va a un registro de decisiones.

**6 · Montar el andamiaje en la tienda**

Vamos a la demo. Trabajamos en una rama nueva de la tienda, andamiaje, creada desde master, para no ensuciar los demás vídeos. Antes de grabar comprobamos lo que podría colarse: ningún fichero de contexto fuera del repositorio, la memoria de oh my pi apagada, sin retomar sesiones al arrancar y ninguna carpeta punto omp en la tienda, porque un AGENTS punto md dentro de ella taparía el de la raíz.

Hoy hacemos nosotros de sesión inicializadora: los ficheros los hemos escrito a mano, aunque podrías encargárselos a una primera sesión del agente. Primero, AGENTS punto md. Es el del vídeo seis, con una línea de crédito a WalkingLab y dos secciones nuevas. Al empezar: confirmar la carpeta, leer el progreso y el traspaso si tiene algo, leer la lista y elegir la funcionalidad en curso o la siguiente, mirar los últimos commits y ejecutar init punto sh.

Al terminar: actualizar la lista y el progreso, escribir el traspaso si queda algo a medias o vaciarlo si no, y hacer commit solo si las pruebas pasan. Esa rutina de salida es la que dejamos pendiente en el vídeo seis, y la más fácil de olvidar: al final de una sesión, el agente quiere contestar que ha terminado, y tú quieres cerrar la terminal. Si no está escrita, no ocurre.

Y tres reglas nuevas, cortas. Solo una funcionalidad en curso. Pasa solo con la verificación ejecutada y la evidencia anotada. Y no cambiar la verificación de una funcionalidad para que pase, que es la trampa más tentadora cuando una prueba se resiste.

Después, con jota cu, la lista de funcionalidades: las reglas y las tres entradas, todas sin empezar, cada una con su comportamiento, su verificación con los casos concretos y sus evidencias vacías. Y el progreso, con el estado verificado y el registro vacío, junto a init punto sh. Lo commiteamos todo junto y ejecutamos init punto sh por primera vez: la carpeta, la versión de node, nada sin commitear, las pruebas pasan y la siguiente es ticket cero cero uno.

Ahora repetimos la prueba de la sesión nueva, con la misma orden que antes. Las cuatro primeras respuestas apenas cambian. La quinta, sí: los tres tickets están sin empezar, no hay ninguno en curso, el traspaso está vacío y la siguiente es ticket cero cero uno. Ya no deduce el punto en el que estamos: lo lee. Esa es la diferencia entre tener un repositorio documentado y tener un sistema de registro.

**7 · Sesión uno, en Pi**

Arrancamos Pi en la rama, con una sesión normal y DeepSeek Flash. En la cabecera, en contexto, solo aparece AGENTS punto md. Y le damos el encargo más vago posible: trabaja en la siguiente funcionalidad. No le decimos cuál, ni en qué fichero, ni cómo se prueba. Todo eso tiene que salir del repositorio.

Lo primero que hace es la rutina de entrada, tal cual está escrita: la carpeta y el log de git, la lectura del progreso, del traspaso y de la lista, y la ejecución de init punto sh. En su razonamiento lo dice: la siguiente es ticket cero cero uno, formatear euros, y no hay ninguna en curso. Después mira el código que ya existe para seguir el mismo estilo.

Escribe ticket punto js y su fichero de pruebas, ejecuta las pruebas y, con todo en verde, edita la lista. Mira el cambio: el estado pasa a pasa, y en evidencias anota dos entradas, cada una con su comando y su resultado. Un detalle honesto: no la marcó antes como en curso; la escribió, la probó y la cerró en el mismo turno. La regla de una sola en curso se cumple, pero el estado intermedio no llegó a verse.

Después actualiza el progreso con su entrada de sesión, hace commit con el formato de la tienda y, al final, vuelve a ejecutar init punto sh para comprobar que la siguiente sesión puede arrancar: pasa, y ya señala ticket cero cero dos. Toda la funcionalidad, en menos de un minuto.

Ahora queremos dejar algo a medias, como pasa en la vida real cuando se acaba el día o el presupuesto. Le pedimos: empieza la siguiente, y de momento escribe solo la función, sin las pruebas. Teníamos preparado un tercer mensaje para pedirle la rutina de salida. No hizo falta.

Al terminar el turno, la hizo por su cuenta, porque está en AGENTS punto md. Línea de ticket queda en curso, no en pasa, porque falta su prueba. Escribe el traspaso: lo que ya está hecho, lo que falta, que son las pruebas con una y con varias unidades y el redondeo, y que no ha tocado la verificación. Actualiza el progreso, comprueba que las pruebas que ya existían siguen pasando y, solo entonces, hace commit.

Salimos de Pi y lo comprobamos desde fuera. Git log enseña los dos commits de la sesión. Git show, que el último cambió la lista, el progreso, ticket punto js y el traspaso. Y init punto sh dice que línea de ticket está en curso. Esta sesión de Pi existe, en su fichero del directorio del agente, y podríamos retomarla. No lo vamos a hacer. A partir de aquí, la conversación no existe.

**8 · Sesión dos, en oh my pi**

Abrimos oh my pi con el perfil demo, en la misma carpeta, con una sesión nueva, sin retomar nada y con la memoria apagada. Otro agente y otro modelo, DeepSeek V cuatro Pro. Lo único que comparte con la sesión anterior es el repositorio. Y le escribimos una sola palabra: continúa.

Esa palabra es la prueba. Si tuvieras que explicarle qué estabas haciendo, qué fichero toca y cómo se prueba, el andamiaje no estaría funcionando: estarías haciendo tú de memoria del proyecto. Lo que no esté escrito, el agente lo va a adivinar, y lo va a adivinar de nuevo en cada sesión.

oh my pi carga por su cuenta el AGENTS punto md de la raíz, porque busca uno suelto desde la carpeta de trabajo hasta la raíz del repositorio. Y la rutina de entrada es la misma: la carpeta y el log, init punto sh, que le dice que línea de ticket está en curso, y la lectura del progreso, del traspaso, de la lista y del código. En su plan aparece justo lo que pedía el traspaso: añadir las pruebas, ejecutarlas, marcarla como pasa con evidencia, actualizar el progreso y el traspaso, y hacer commit. No rehace formatear euros.

Learn Harness Engineering llama a esto coste de reconstrucción: lo que tarda una sesión nueva en volver a ser productiva. Aquí, cuatro turnos y unos cuarenta y ocho mil tokens antes de su primera edición, unas tres décimas de céntimo. Y uno de esos turnos fue un tropiezo: su primer comando de bash llevaba un parámetro que no tocaba, falló, y lo repitió. Sin andamiaje, esos cuatro turnos serían una conversación contigo.

Después, el trabajo: tres pruebas nuevas para línea de ticket, con una unidad, con varias y con redondeo; las pruebas del fichero y las veintiuna de la tienda en verde; la funcionalidad en pasa, con sus evidencias; el progreso actualizado y el traspaso vaciado, porque ya no queda nada a medias. Commit, y comprueba que el árbol queda limpio. La sesión entera, quince turnos y siete décimas de céntimo.

Ahora lo comprobamos desde fuera, sin ningún agente. Git log enseña dos sesiones de dos agentes distintos en un mismo historial. Una consulta de jota cu sobre la lista enseña dos funcionalidades que pasan, cada una con dos evidencias, y una sin empezar. Otra busca funcionalidades que pasan sin evidencias, y sale vacía. El traspaso tiene cero bytes. E init punto sh termina en verde y dice que la siguiente es ticket cero cero tres. Mañana, cualquiera, persona o agente, empieza por ahí.

Ahora, una distinción que vale para todo el bloque. Hay dos registros. El journal de la sesión, ese fichero JSONL, dice qué vio y qué hizo la conversación; el Harness Playbook pide que sea la única autoridad de la sesión, y por eso en el vídeo nueve guardamos el estado de las extensiones en la rama. El repositorio dice qué es verdad del proyecto. No compiten. Y recuerda el vídeo tres: rebobinar la conversación no rebobina tus ficheros. Si hay que deshacer el progreso, lo arbitra git.

**9 · Límites, repaso y cierre**

Tres límites honestos. El primero ya lo dijimos: todo esto son instrucciones. Hoy los dos agentes las siguieron, pero si la sesión se corta de golpe, con escape o porque se agota el contexto, no hay rutina de salida y no se escribe nada. La siguiente sesión lo detecta gracias a git status y a init punto sh, pero tendrá que reconstruir sin traspaso. Pi trae ejemplos de extensiones que hacen commit al salir o vigilan el repositorio sucio, pero una red automática tiene que entender bien cuándo actúa.

El segundo: un fichero desfasado es peor que ninguno. La tercera lección del curso lo dice claro: la documentación vieja manda al agente en la dirección equivocada mientras él cree que va bien. Si el progreso dice una cosa y las pruebas otra, ganan las pruebas. El tercero: dos agentes escribiendo a la vez el mismo progreso se pisan. Para trabajo en paralelo, un fichero de progreso por agente, o ramas y worktrees, como en los vídeos dieciséis y dieciocho.

Y un apunte sobre la memoria del vídeo trece. No es incompatible con todo esto, pero no lo sustituye. La memoria es contexto heurístico y vive fuera del repositorio: Pi no la ve, y quien clona el proyecto no la recibe. Usa la memoria para tus preferencias y las pistas que se repiten. Lo que define el estado del proyecto, en el repositorio, junto al código y con su historial.

Repasemos. El repositorio es el sistema de registro: lo que no está escrito en él no existe para el agente. El paquete mínimo son cuatro ficheros: AGENTS punto md con rutina de entrada y de salida, una lista de funcionalidades con comportamiento, verificación y estado, un progreso verificado e init punto sh. El traspaso, cuando algo queda a medias. Y una sesión nueva, incluso con otro agente y otro modelo, retoma el trabajo sin conversación, con una sola palabra.

La práctica: en un proyecto tuyo, monta el paquete mínimo a partir de las plantillas de Learn Harness Engineering, citando su licencia. Divide una tarea en tres funcionalidades que quepan en una sesión cada una. Trabaja la primera con un agente, deja la segunda a medias, y continúa en una sesión nueva, mejor con el otro agente. Anota el coste de reconstrucción y qué tuviste que explicar a mano: eso es lo que le falta a tu andamiaje.

En el próximo vídeo, verificar de verdad. Definir antes qué significa terminado, pruebas, rúbricas, revisión con el advisor y con el reviewer, y Auto QA. Y lo que hoy ha quedado en instrucción: que terminado no dependa de que el agente diga que ha terminado. Nos vemos allí.

</details>

