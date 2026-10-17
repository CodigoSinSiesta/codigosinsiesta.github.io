---
title: "Vídeo 16 · Subagentes y trabajo en paralelo"
description: "Repartir una tarea entre varios agentes, seguirlos desde el Hub y definir agentes propios para tu proyecto."
ruta: "pi-oh-my-pi"
orden: 16
duracion: "23 min"
video: "16-subagentes-y-paralelo.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/16-subagentes-y-paralelo.es.vtt"
---

Repartir una tarea entre varios agentes, seguirlos desde el Hub y definir agentes propios para tu proyecto.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

> **Seguridad:** las demos de este vídeo corren con approvalMode yolo (todo se aprueba solo); en tu proyecto, configura las aprobaciones antes (vídeo 19).

## Resumen por capítulos

### 1 · De dirigir a repartir

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- En el vídeo 15 dirigías a un solo agente, paso a paso. Hoy repartes una tarea entre varios agentes que trabajan a la vez, y los sigues mientras trabajan.
- **Repartir no es gratis.** Cada subagente es una conversación entera, con su propio contexto, que vuelve a leer los ficheros que necesita. Tres agentes en paralelo terminan antes, pero no gastan menos.
- **Terminar no es acertar.** Que un agente diga que ha terminado no demuestra que lo haya hecho bien. Repartir bien es saber qué encargar, a quién y cómo comprobarlo.
- La regla de la demo: DeepSeek V4 Pro (el capaz) reparte y revisa; Flash (el rápido) hace los encargos.
- El recorrido: la herramienta `task` y sus agentes, el panel `/agents` y tus propios agentes, el Agent Hub para seguirlos, y tres comandos: `/tan`, `/jobs` y `/cleanse`.

### 2 · La herramienta task y sus agentes

<p><button type="button" class="ir-a" data-t="127">▶ Ir a 2:07</button></p>

- `task` es la herramienta que lanza subagentes: sesiones hijas con su propio modelo, herramientas e instrucciones. Cada una trabaja sola y entrega su resultado con una herramienta oculta, `yield`; al agente principal le llega un resumen.
- Trabaja por lotes: en una llamada van un contexto común y una lista de encargos (texto, nombre y tipo de agente). Un encargo, un subagente, y todos arrancan a la vez, en segundo plano si los trabajos asíncronos están activos (lo normal). La salida de cada uno se lee en `agent://<id>` y un resumen de lo que hizo en `history://<id>`.
- **El subagente no hereda la conversación.** Recibe el árbol de trabajo, los ficheros de contexto (como `AGENTS.md`) y el contexto común del lote. Por eso cada encargo tiene que explicarse solo: qué ficheros, qué restricciones y cómo se sabe que está hecho.
- Cinco agentes de serie: `task` (generalista, todas las herramientas), `sonic` (trabajo mecánico, rol `smol`), `scout` (explora en solo lectura, rol `smol`), `reviewer` (revisa código, rol `slow`) y `security-reviewer` (busca vulnerabilidades).
- Dos detalles: `reviewer` tiene `bash`, así que no es de solo lectura. Y `task` pide el rol `task`; si no lo has asignado, usa el modelo activo de la sesión (aquí, Pro).
- Para que el modelo reparta, pídelo explícitamente: que use `task`, cuántos agentes y qué hace cada uno. La palabra mágica `orchestrate` (en minúsculas, en tu mensaje) le pide delegar en paralelo durante ese turno, pero con ella decides menos cuántos agentes salen.

### 3 · /agents y tus propios agentes

<p><button type="button" class="ir-a" data-t="291">▶ Ir a 4:51</button></p>

- `/agents` abre el **panel de agentes**: qué agentes existen y cómo están configurados (modelo efectivo, prewalk, advisor y de dónde sale cada uno). No es el **Agent Hub** (`Alt+A`), que enseña quién está trabajando ahora.
- Recordatorio del vídeo 14: el **prewalk** hace que el capaz planifique y el rápido ejecute; el **advisor** es un segundo modelo que revisa el trabajo de uno más barato. Aquí se activan por agente.
- *En la demo:* asignamos a `task` el patrón `@smol` y pasa a resolver a Flash. Usar el rol en vez del modelo tiene una ventaja: si mañana cambias `smol`, el agente le sigue. El ajuste se guarda en el perfil (`task.agentModelOverrides`), no en la sesión, así que al terminar hay que deshacerlo.
- Con la barra espaciadora activas o desactivas un agente; uno desactivado no se puede lanzar. **New agent** deja que un modelo «arquitecto» redacte la definición, pero el fichero sale sin modelo y heredaría el de la sesión. Por eso el nuestro lo escribimos a mano.
- Un agente propio es un Markdown con cabecera (`name`, `description`, `tools`, `model`…). Los del proyecto viven en `.omp/agents/`, los tuyos en la carpeta de agentes de tu configuración de usuario; `.claude/agents` se ignora. Si dos se llaman igual, gana el del proyecto, luego el de usuario y al final los incluidos.
- Más campos: `spawns` (a quién puede lanzar), `output` (esquema de respuesta), `blocking` (el principal le espera), `prewalk` y `advisor`. `omp agents unpack` copia los incluidos para que los edites.
- **Trampa:** «solo lectura» en la descripción es una instrucción, no una barrera. Si un agente no debe escribir, no le des `bash` ni herramientas de edición.

### 4 · Repartir y seguir en el Agent Hub

<p><button type="button" class="ir-a" data-t="536">▶ Ir a 8:56</button></p>

- *En la demo:* Pro escribe una sola llamada a `task` con tres agentes (un `scout`, nuestro `revisor-tests` y un `sonic`). Los tres van en segundo plano y Pro espera sus resultados.
- `Alt+A` abre el Agent Hub: coste total, tokens y una fila por agente con su rol y su modelo. Ninguno usaba Pro: la regla se cumplió. También se llega con `Ctrl+S` o `/hub`.
- El inspector marca **shared workspace**: todos trabajan sobre el mismo árbol de ficheros y omp no puede atribuir cada línea cambiada a un agente. Por eso pedimos encargos que no toquen los mismos ficheros.
- Teclas: `1`/`2` cambian entre lista y actividad, `j`/`k` seleccionan, `Enter` abre la conversación del agente para dirigirlo, `t` alterna lista plana y árbol, `r` revive un agente aparcado y `x` lo mata. Si falta una cifra de uso, verás una raya: el Hub no estima.
- Al terminar, un agente pasa a `idle` y conserva su contexto; a los siete minutos sin actividad se aparca. Para una corrección, escríbele al agente que ya hizo el trabajo antes que lanzar otro.
- **Quien reparte, verifica.** Pro comprueba el diff y ejecuta los tests (15 de 15) antes de resumir el resultado de cada agente.

### 5 · /tan y /jobs

<p><button type="button" class="ir-a" data-t="779">▶ Ir a 12:59</button></p>

- `/tan <encargo>` lanza un agente completo en segundo plano para un trabajo lateral, mientras tú sigues en la sesión principal. A diferencia de `task`, **clona tu sesión**: el clon sabe de qué va el proyecto y usa el mismo modelo y herramientas.
- Como el clon hereda el modelo, antes cambiamos el de la sesión con `/switch @smol` (vídeo 14). **Ojo:** `/switch` cambia el modelo de la sesión principal, así que a partir de ahí tú también vas con Flash. Al terminar, vuelve a cambiarlo.
- `/jobs` lista los trabajos en segundo plano: subagentes, clones de `/tan` y comandos de bash largos.
- *En la demo:* el clon añade una sección al README y la sesión principal no lo revisa porque «es de otra sesión». Nadie lo había verificado: lo comprobamos nosotros con `git diff`.
- **Aviso:** el clon comparte tu carpeta. Si los dos tocáis el mismo fichero, os pisáis. Cancelar un trabajo lo para, pero no deshace lo escrito. Trabaja en una rama descartable.
- *En terminal:* /jobs y proc:// (más abajo, en «Código y comandos»).

### 6 · /cleanse

<p><button type="button" class="ir-a" data-t="946">▶ Ir a 15:46</button></p>

- `/cleanse` es un reparto ya montado para arreglar diagnósticos: descubre los comprobadores del proyecto (eslint, TypeScript, tests…), ejecuta los que elijas, agrupa los errores por fichero, reparte los arreglos entre subagentes con el modelo de `smol` y vuelve a ejecutar los comprobadores para verificar.
- *En terminal:* /cleanse (más abajo, en «Código y comandos»).
- *En la demo:* rompemos el umbral de envío gratis (de 40 a 45 €) y lanzamos `/cleanse --tests`. Como la salida de los tests no trae fichero y línea, cleanse la convierte en un solo diagnóstico y lanza un único trabajador. En veinte segundos el tablero dice «Clean».
- **Un tablero en verde no dice cómo se arregló.** Un agente con prisa puede hacer pasar un test cambiándolo. Revisa el diff de los tests, no solo el verde: aquí el umbral volvió a 40 y los tests no se tocaron.
- El total de la sesión: cinco agentes, 83 000 tokens y 1,6 céntimos, porque los encargos eran pequeños y todos usaron Flash.

### 7 · Límites, riesgos y coste

<p><button type="button" class="ir-a" data-t="1125">▶ Ir a 18:45</button></p>

- **Permisos:** los subagentes no tienen a quién preguntar, así que omp les fuerza el modo **yolo** (aprobar todo sin preguntar), aunque hayas configurado aprobaciones en la sesión principal. Su barrera principal son las herramientas que les das. En el vídeo 19, qué endurecimiento sí les llega.
- **Espacio de trabajo compartido.** Existe un modo aislado (`task.isolation.enabled`): cada agente trabaja en una copia y sus cambios vuelven como parche o rama. Viene apagado.
- **Modo plan:** los subagentes lanzados en modo plan solo leen y buscan. Explorar en paralelo, sí; cambiar algo, no.
- **Frenos de serie:** hasta 32 subagentes a la vez, profundidad 2 (un subagente puede lanzar otros, pero esos ya no) y un presupuesto blando de peticiones por agente.
- **Coste:** tres agentes leen tres veces. Mira en el Hub lo que gasta cada uno. Tres reglas para contenerlo: encargos pequeños y separados, modelo barato para los subagentes y verificación final en uno solo. Cuándo compensa repartir, en el vídeo 25.

### 8 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1235">▶ Ir a 20:35</button></p>

- Qué usar en cada caso:

| | `task` | `/tan` | `/cleanse` |
|---|---|---|---|
| Hereda la conversación | No | Sí (clona la sesión) | No |
| Modelo | El del rol de cada agente | El de la sesión | `@smol` por defecto |
| Espacio de trabajo | Compartido | Compartido | Compartido |
| Cuándo | Partes que no se pisan y quieres el resultado aquí | Encargo lateral que necesita saber del proyecto | Errores de un comprobador |

- Si es una sola tarea pequeña, ninguno: hazla en la sesión principal, que repartir también cuesta.
- **Práctica:** en tu perfil de pruebas, escribe un agente propio con un modelo barato y solo las herramientas que necesite. Pide un reparto de tres encargos que no compartan ficheros, uno para tu agente. Síguelos en el Agent Hub, apunta lo que gasta cada uno y revisa el diff antes de dar nada por bueno.
- **En otros agentes:** Claude Code también define subagentes en Markdown con frontmatter. La idea es la misma: no heredan la conversación y su barrera son las herramientas que les das.
- **Próximo vídeo:** el entorno de desarrollo integrado: read, LSP, depurador, ast grep, hashline, eval y el navegador.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Una llamada a task

```text
task({
  context: "Tienda de juguete… trabajad en paralelo",
  tasks: [ { name, agent: "scout", task }, { agent: "revisor-tests", … }, { agent: "sonic", … } ]
})
```

- `context`: lo que comparten todos los encargos; cada subagente no sabe nada más de la conversación.
- `tasks`: un encargo por subagente, con su nombre, el tipo de agente (`agent`) y el texto de la tarea.

### Dónde viven los agentes

```text
<repo>/.omp/agents/*.md        # del proyecto
<config de usuario>/agents/*.md  # tuyos, para todos
.claude/agents  → se ignora
```

Si dos agentes se llaman igual, gana el del proyecto, luego el de usuario y al final los incluidos.

### /jobs y proc://

```text
/jobs            # en marcha y recientes
/jobs full       # líneas completas
read proc://<id>  · write proc://<id>/kill
```

- `read proc://<id>`: inspecciona un trabajo sin consumir su resultado.
- `write proc://<id>/kill`: lo cancela. Lo que ya escribió en disco se queda.

### /cleanse

```text
/cleanse                 # selector de comprobadores
/cleanse --all           # todos
/cleanse -n 4 -m @smol   # agentes y modelo
/cleanse --tests         # añade los tests
```

- `-n` limita el número de agentes (por defecto, hasta 32); `-m` elige el modelo (por defecto, `@smol`).
- Con una petición en texto («errores de tipos»), un agente de descubrimiento averigua qué comando ejecutar.

## Fuentes

- Documentación de oh my pi (omp.sh): `tools/task.md` (lotes, segundo plano, qué heredan los subagentes, límites y modo aislado), `task-agent-discovery.md` (campos del frontmatter, dónde se buscan los agentes y precedencia de modelo) y `agent-hub.md` (columnas, teclas y registro de actividad).
- `magic-keywords.md` (la palabra `orchestrate`), `settings.md` (`async.*`, `task.*`, `display.*`) y `cli-reference.md` (`omp cleanse`).
- `omp cleanse --help` y `omp agents --help`.
- Grabado con omp 18.6.1 (documentación de la 18.5.1).
- Vídeos relacionados del curso: 13 (`/btw` frente a `/tan`), 14 (roles, `/switch`, prewalk y advisor), 15 (modo plan y `orchestrate`), 19 (aprobaciones) y 25 (cuándo compensa repartir).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De dirigir a repartir**

En el vídeo quince aprendimos a dirigir una sesión: un plan que apruebas, un objetivo con presupuesto, un bucle con un freno. Pero en todos esos modos había un solo agente haciendo el trabajo, paso a paso. Hoy cambiamos eso. Vamos a repartir una tarea entre varios agentes que trabajan a la vez, cada uno con su encargo, y a seguir lo que hacen mientras lo hacen.

Antes de empezar, una idea que va a atravesar todo el vídeo. Repartir no es gratis. Cada subagente es una conversación entera, con su propio contexto, que lee de nuevo los ficheros que necesita. Tres agentes en paralelo terminan antes, pero no gastan menos. Y que un agente diga que ha terminado no demuestra que lo haya hecho bien. Repartir bien es saber qué encargar, a quién y cómo comprobarlo.

El recorrido. Primero, la herramienta task, que es la que lanza subagentes, y los cinco agentes que trae oh my pi. Después, barra agents, donde se configura cada agente por su nombre, y tus propios agentes. Con eso, repartimos una tarea y la seguimos en el Agent Hub. Y terminamos con tres comandos: barra tan, barra jobs y barra cleanse.

Hoy la conversación la lleva DeepSeek V cuatro Pro, el capaz, y los subagentes trabajarán con Flash, el rápido. Esa es la regla de la demo: Pro reparte y revisa, Flash hace los encargos.

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

