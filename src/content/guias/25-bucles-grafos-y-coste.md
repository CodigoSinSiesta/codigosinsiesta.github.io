---
title: "Vídeo 25 · Bucles, grafos y el coste de orquestar"
description: "Cuándo compensa un bucle, un plan o varios agentes y cuándo solo añade coste. La misma tarea con uno y con varios agentes, medida."
ruta: "pi-oh-my-pi"
orden: 25
duracion: "25 min"
video: "25-bucles-grafos-y-coste.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/25-bucles-grafos-y-coste.es.vtt"
---

Cuándo compensa un bucle, un plan o varios agentes y cuándo solo añade coste. La misma tarea con uno y con varios agentes, medida.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Tres deudas

<p><button type="button" class="ir-a" data-t="19">▶ Ir a 0:19</button></p>

- Este vídeo paga tres deudas: cuándo compensa un bucle (`/loop` y `/goal`, vídeo 15), cuándo compensa repartir entre subagentes (vídeo 16: tres agentes leen tres veces) y qué pasa cuando una medida se optimiza (el aviso del final del vídeo 24).
- Las tres son la misma pregunta: cuánto trabajo dejas que el sistema haga sin ti, y cómo sabes que lo ha hecho bien. Learn Harness Engineering la trata en sus dos últimas lecciones: la 13, bucles; la 14, grafos.
- La lección 14 ordena el vocabulario en cuatro capas, y cada una contiene a la anterior: el prompt (la instrucción), el contexto (lo que el modelo sabe), el bucle (repite hasta cumplir un objetivo) y el grafo (varios agentes, bucles y comprobadores conectados). Debajo de todas, el harness.

### 2 · Cuándo compensa un bucle

<p><button type="button" class="ir-a" data-t="113">▶ Ir a 1:53</button></p>

- Un bucle tiene tres piezas: un objetivo, una forma de verificarlo y una condición de parada. Si falta una, tienes un agente que da vueltas. Con las tres, sales de dentro del bucle (escribes cada instrucción) y pasas a estar fuera (solo decides).
- La prueba de una frase: ¿tiene final? Si lo tiene, es un objetivo; si no, algo que se vigila cada cierto tiempo. En otros agentes `/loop` es un reloj; en oh my pi, `/loop --until` sí tiene final.
- Compensa cuando la parada la comprueba un programa, cuando cada vuelta deja el estado en disco (el andamiaje del vídeo 23) y cuando quien trabaja no es quien lo da por bueno. La lección lo resume así: alguien de tu equipo no debe creerte.
- No compensa cuando no sabes escribir la condición, cuando el fallo necesita una decisión tuya (repetir solo repite el error) o cuando la tarea cabe en una vuelta. En el vídeo 15 el techo de tres vueltas no era un objetivo: bastó una.
- Cuatro costes que no se ven: deuda de verificación (lo que se da por bueno sin comprobar), pérdida de comprensión (código que nadie ha leído), rendición (dejar de opinar) y explosión de tokens (cada vuelta arrastra lo anterior; para eso están los modos `compact` y `reset` de `/loop`). Y una escalera para no saltar escalones: objetivo con parada, tarea programada, bucle con un agente que hace y otro que comprueba, bucle que encuentra su siguiente tarea y varios bucles a la vez. Empieza por el primero.

### 3 · /loop aquí y allí

<p><button type="button" class="ir-a" data-t="250">▶ Ir a 4:10</button></p>

- `/loop` en oh my pi (más abajo, en «Código y comandos») reenvía tu mensaje cada vez que el agente cede el turno, acotado por un número de vueltas, una duración o un comando. Con `--until`, el harness ejecuta el comando tras cada vuelta y para cuando sale con 0: quien decide parar no es el modelo.
- `/loop` en Claude Code es un temporizador: repite un prompt cada cierto tiempo, vive con la sesión abierta y las tareas recurrentes caducan a los siete días. Sirve para vigilar, no para terminar.
- `/goal`: en oh my pi, el propio modelo da el objetivo por cumplido, con un presupuesto de tokens como freno. En Claude Code, un modelo pequeño aparte lee la conversación tras cada turno; es otro juez, pero no ejecuta nada.
- Pi no trae ni `/loop` ni `/goal`. Puedes escribir un bucle de shell que repita `pi -p` hasta que el verificador salga con 0, o una extensión con `agent_before_settle` (vídeo 24). En un bucle de shell, cuándo se mira la condición depende de cómo lo escribas: si la compruebas al principio, se mira antes de cada vuelta; oh my pi la mira siempre después.
- Regla práctica: pregunta quién decide que ha terminado. El modelo: una opinión con presupuesto. Otro modelo que lee: una segunda opinión. Un programa tuyo, como `verificar.sh`: una condición. Los tres agentes tienen un punto al final del turno donde el harness puede negarse a terminar (el Stop hook de Claude Code, bajo su `/goal`; `session_stop` en oh my pi; `agent_before_settle` en Pi). Lo que cambia es quién juzga ahí.

### 4 · De un bucle a un grafo

<p><button type="button" class="ir-a" data-t="398">▶ Ir a 6:38</button></p>

- Un bucle es una decisión aplazada: todo ocurre en el contexto de un agente, y ni él sabe dónde se ha atascado. Un grafo es la decisión tomada por adelantado. Tiene nodos (un script, una llamada al modelo o un agente), aristas (en paralelo, según una condición o hacia atrás), un estado compartido y reglas de enrutado.
- La pieza clave es el nodo que verifica: empieza con un contexto nuevo y solo ve el resultado, no el razonamiento.
- Tres fallos de un bucle solo que no se arreglan con más comprobaciones dentro: Goodhart (capítulo 8), la ceguera hacia arriba (nunca pregunta si su objetivo es el correcto) y el conflicto (dos bucles, velocidad y calidad, tirando en sentidos contrarios).
- Ya has dibujado grafos: `task` con tres agentes en paralelo y verificación final (vídeo 16) es un abanico que se abre y se cierra, y `/cleanse` (reparte arreglos de diagnósticos entre subagentes y vuelve a comprobar) también.
- Hace falta un grafo si se cumplen al menos tres de estos cinco criterios:
  - [ ] el trabajo se divide en partes independientes;
  - [ ] hay ramas o vueltas atrás;
  - [ ] merece la pena guardar el estado intermedio;
  - [ ] cada nodo se puede verificar de forma automática;
  - [ ] lo que ahorras al repartir supera lo que cuesta coordinar.
- Veinte pasos en fila no son un grafo: son un script.

### 5 · Lo que cuesta orquestar

<p><button type="button" class="ir-a" data-t="548">▶ Ir a 9:08</button></p>

- Anthropic, sobre su sistema de investigación: un agente gasta unas cuatro veces los tokens de un chat, y su sistema de varios agentes unas quince; superó a un agente solo en un 90 % en su evaluación. Pero no encaja cuando todos necesitan el mismo contexto o hay muchas dependencias, y la mayoría de tareas de programación son menos paralelizables. Es su conclusión sobre su sistema, no una ley.
- En una de sus pruebas, los tokens gastados explicaban el 80 % de las diferencias de rendimiento: buena parte de lo que ganan varios agentes viene de gastar más. Más lectura y más intentos se pagan.
- Cada subagente es una sesión: paga su prefijo (en el vídeo 22, de unos 4400 a más de 10 000 tokens en oh my pi, según el roster) y vuelve a leer. La caché abarata solo lo que se repite igual. Y el impuesto de orquestación (la lección 14, a partir de Addy Osmani): lanzar un agente cuesta una tecla, pero revisarlo e integrarlo cuesta tu atención, que no se paraleliza.
- La tarea: `ticket-004`, la función `desglose()`, que devuelve base sin IVA, IVA, envío y total. Cruza cupón, IVA y envío, y se reparte bien: implementación en un fichero, pruebas en otro. Rúbrica y aceptación, escritas antes y etiquetadas; `verificar.sh` sale en rojo antes del trabajo.
- `verificar.sh` cambió: comparaba la verificación con la etiqueta de `ticket-003` y ahora compara con la última etiqueta de rúbrica. Lo cambiamos nosotros, no un agente (en el capítulo 8 verás por qué importa).

### 6 · La misma tarea, con uno y con varios

<p><button type="button" class="ir-a" data-t="713">▶ Ir a 11:53</button></p>

- `orquestar.sh` lanza cada ejecución en su propio worktree desde la etiqueta de la rúbrica, con oh my pi en modo print, DeepSeek Flash en todos los agentes y la puerta del vídeo 24. Las mismas herramientas en las dos condiciones (quitar `task` cambiaría el prefijo) y un ajuste de configuración, `sin-async.yml`, para que `task` espere a sus subagentes, porque en modo print oh my pi no los esperaba.
- Solo cambia una frase del encargo. «Uno»: hazlo tú solo, sin `task`. «Varios»: un subagente implementa, otro escribe las pruebas sin ver la implementación y tú integras, verificas, marcas y haces commit. Quien escribe las pruebas no es quien escribe el código (lección 13).
- El juez está fuera: el script mide el tiempo, ejecuta `verificar.sh`, cuenta ficheros tocados y llamadas a `task`, y suma tokens y coste de todos los agentes. Una ejecución de «varios» que no reparte, o una de «uno» que sí, no cuenta. Tres repeticiones de cada: seis ejecuciones.
- El grafo de «varios»: dos nodos en paralelo (implementar y escribir pruebas), una arista que los junta en la sesión principal, que integra y ejecuta `verificar.sh`; una arista de vuelta si falla; y el commit, que pasa por la puerta. El estado compartido es la carpeta de trabajo, por eso los dos nodos no tocan el mismo fichero. oh my pi vuelve a cargar los hooks en cada subagente, así que la puerta también los vigila.
- Las seis ejecuciones son válidas y terminan en verde sin tocar rúbrica ni aceptación (10 min 25 s en total). En las tres de «varios», las piezas encajaron a la primera, y aun así la sesión principal leyó lo de los dos, verificó, anotó y repartió el trabajo en tres commits, frente a uno. Ese trabajo de integración es el impuesto de orquestación, en pequeño.

### 7 · Lo que dicen los números

<p><button type="button" class="ir-a" data-t="911">▶ Ir a 15:11</button></p>

| Media de 3 ejecuciones | Un agente | Varios |
|---|---|---|
| Tiempo | 62 s (de 48 a 80 s) | 144 s (de 93 a 190 s) |
| Tokens | ≈413 000 | ≈914 000 (de ≈400 000 a más de 1,3 millones) |
| Caché | 95 % | 94 % |
| Coste | casi 1 céntimo de dólar | 2,5 céntimos |
| Verificación y prueba oculta | 3 de 3 | 3 de 3 |

- Tres avisos: son tres repeticiones, con un modelo barato y una tarea pequeña; con pocos casos, una diferencia puede ser ruido (vídeo 21); y DeepSeek cobra distinto según la franja horaria, así que las seis se lanzaron seguidas.
- Los dos aciertan, y repartir no mejora el resultado. Cuesta dos veces y media lo que costó uno, porque con la caché casi igual el coste sigue a los tokens. Ni siquiera va más rápido, aunque trabajen dos a la vez, y es menos predecible. Repartir no ahorró lectura: la multiplicó, porque las dos partes dependen de las mismas funciones de la tienda. Y tu revisión, que no sale en ninguna columna, sigue siendo una.
- Con los cinco criterios, la tarea cumple uno o dos: no hacía falta un grafo. Varios agentes compensan con partes grandes y de verdad independientes, para explorar varias soluciones, cuando el contexto de uno no da para todo o cuando la revisión necesita un contexto limpio (y ahí basta un revisor al final). La regla del vídeo 16 sigue en pie: una tarea pequeña, en la sesión principal.
- El plan (el modo plan del vídeo 15) es un nodo humano: el trabajo se detiene hasta que apruebas. Compensa cuando equivocarse de camino cuesta más que esperar: un cambio que toca varias piezas, una decisión de diseño o algo difícil de deshacer. En `ticket-004`, la rúbrica escrita antes ya era la aprobación.
- **La regla, por ese orden** (cada escalón cuesta más que el anterior):
  1. Tarea pequeña con verificación: un agente y, si hace falta, un bucle con techo.
  2. Equivocarse de camino es caro: un plan antes.
  3. Partes grandes que no se pisan: varios agentes, con un solo punto de integración y la verificación al final.
- *En la demo:* `/loop 3 --until './verificar.sh ticket-004'` con un solo agente para en la primera vuelta: el agente escribe `desglose()` y doce pruebas, hace commit, y el harness, no el modelo, ejecuta `verificar.sh`, que sale con 0. Alrededor de un céntimo, y la prueba oculta también pasa. Un agente, una condición que no depende de él y un techo: para esta tarea, la opción más barata que verifica de verdad.

### 8 · Goodhart: cuando verificar es el objetivo

<p><button type="button" class="ir-a" data-t="1137">▶ Ir a 18:57</button></p>

- Goodhart (1975) observó que una regularidad estadística tiende a romperse en cuanto se usa para controlar algo; Strathern (1997) lo generalizó en la versión que todo el mundo cita: cuando una medida se convierte en objetivo, deja de ser una buena medida. La lección 14 lo ilustra con un ejemplo: imagina un equipo de soporte que optimiza las incidencias resueltas y aprende a cerrarlas, no a resolverlas.
- Un juez que lee la conversación (el `/goal` de Claude Code) mide lo que el agente cuenta: con una condición vaga, se optimiza el relato. Y `/loop --until ./verificar.sh` solo quiere que el script salga con 0: si mide algo que no importa, el bucle lo encontrará, no por malicia, sino porque es lo que optimiza.
- *En la demo:* una aceptación que solo comprobaba que el total era el de la tienda y que base, IVA y envío sumaban ese total. La rama `cuadre`, escrita a mano, calcula el envío antes del cupón y saca el IVA por diferencia, y `verificar.sh` sale con 0. Con el pedido de la frontera da envío 0 € (la tienda cobra 4,95 €) e IVA 12,89 € (debería ser 7,94 €). Es una cifra de cuadre: medíamos que cuadrase, no que fuese correcto.
- Lo detecta un ancla: una prueba que vive fuera del repositorio, con otro pedido e importes calculados a mano (una silla de 45 € con un cupón del 20 %), que ningún agente ve. En `cuadre` falla (envío 0 €, IVA 12,51 € en vez de 7,56 €) y las seis ejecuciones de la comparación la superan. Es la idea de `/ratchet` (vídeo 21): solo cuenta lo que mejora en casos que el agente no ha visto.
- Después reforzamos la aceptación (cada importe exacto en dos pedidos) y movimos la etiqueta. `cuadre` sale en rojo, y A5, el criterio del vídeo 24 que comprueba que nadie ha tocado la verificación, avisa de que ha cambiado desde su etiqueta. Pero el ancla se queda fuera. Y ojo: si `verificar.sh` confía en la última etiqueta, un agente que pueda crear una etiqueta nueva tras tocar la verificación pasaría A5. Las etiquetas también son verificación.
- Ninguna métrica sola: solo coste premia al que no verifica; funcionalidades en `pasa`, al que marca deprisa; tokens por tarea, al que lee de menos. Mira varias a la vez y guarda al menos una que el agente no pueda optimizar: una prueba oculta o una revisión tuya.

### 9 · Lo que viene, repaso y cierre

<p><button type="button" class="ir-a" data-t="1363">▶ Ir a 22:43</button></p>

- A octubre de 2026 ya existen `omp --restore`, que retoma una sesión caída con lo que dejó a medias, subagentes incluidos, y Pi Durable, un paquete aparte y experimental para agentes de larga duración (cada paso guarda un punto de control que otro proceso puede retomar). omp² sigue anunciado sin fecha.
- Para repartir en Pi hoy, la extensión de ejemplo `subagent` lanza procesos de Pi aparte (reconocimiento, planificación, trabajo y revisión) y enseña tokens y coste de cada uno. Ves todo el código del reparto y decides tú cuánto cuesta.
- **Práctica:** elige una tarea pequeña y escribe antes su verificación y una prueba oculta fuera del repositorio. La prueba importa el código desde la ruta del worktree que le pases. Ejecuta la tarea tres veces con un agente y tres repartiendo, en worktrees separados, y apunta tiempo, tokens, coste y cuántas superan la prueba oculta. Pasa la tarea por los cinco criterios y decide con tus números si repartir compensaba.
- **Materiales:** [`medir/orquestar.sh`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/medir/orquestar.sh), [`medir/resumen-orquestar.sh`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/medir/resumen-orquestar.sh), [`medir/sin-async.yml`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/medir/sin-async.yml) y [`fuera/ticket-004-oculta.mjs`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/fuera/ticket-004-oculta.mjs), en el [repositorio de materiales del curso](https://github.com/CodigoSinSiesta/curso-pi-materiales). Clónalo en `~/csn` y ejecuta `./preparar.sh`.
- **Vídeo 26 · el último:** el proyecto final, una funcionalidad de principio a fin con Pi y con oh my pi: el plan, la rúbrica antes de empezar, el reparto si compensa, la revisión y las pruebas, el commit y la pull request.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### oh my pi · /loop, como en el vídeo 15

```text
/loop 3 --until './verificar.sh ticket-004' <encargo>
```

- `3`: el techo, en vueltas; también acepta una duración.
- `--until '…'`: el harness ejecuta el comando después de cada vuelta y para cuando sale con 0. Con 1 sigue; con otro código, el bucle se apaga (vídeo 24).

## Fuentes

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT): lección 13 (bucles: objetivo, verificación y parada; costes silenciosos; escalera de madurez) y lección 14 (grafos: las cuatro capas, los tres fallos de un bucle solo, anclas, impuesto de orquestación y los cinco criterios). Ideas y estructura adaptadas y traducidas.
- Anthropic, «How we built our multi-agent research system» (13 jun 2025), https://www.anthropic.com/engineering/multi-agent-research-system: tokens frente a un chat, el 80 % de la varianza explicado por los tokens y cuándo no encaja.
- Documentación de Claude Code: `/loop` en https://code.claude.com/docs/en/scheduled-tasks y `/goal` en https://code.claude.com/docs/en/goal.
- Goodhart: C. A. E. Goodhart (1975), «Problems of Monetary Management: The U.K. Experience»; M. Strathern (1997), «“Improving ratings”: audit in the British University system», *European Review* 5(3).
- Grabado con oh my pi 18.6.1: `/loop` (`--until`, `loop.mode`), `omp://tools/task.md` (subagentes, `async.enabled`) y `omp://agent-hub.md` (coste por agente). Web: https://omp.sh/.
- Pi: el ejemplo `examples/extensions/subagent/` y Pi Durable (experimental), https://earendil.com/posts/pi-durable/.
- Vídeos relacionados: 15 (`/loop`, `/goal` y modo plan), 16 (subagentes y `/cleanse`), 21 (`/ratchet`), 22 (prefijos y método de medida) y 24 (`verificar.sh`, A1–A5 y `puerta.ts`).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Tres deudas**

Este vídeo paga tres deudas. En el quince usamos barra loop y barra goal, y dejamos para hoy cuándo compensa un bucle. En el dieciséis repartimos trabajo entre subagentes y dijimos que tres agentes leen tres veces; cuándo compensa repartir también quedaba para hoy. Y el veinticuatro terminó con una advertencia: cualquier medida que se optimice se puede engañar.

Las tres son la misma pregunta: cuánto trabajo dejas que el sistema haga sin ti, y cómo sabes que lo ha hecho bien. Learn Harness Engineering, el curso de WalkingLab con licencia MIT que nos acompaña en este bloque, le dedica sus dos últimas lecciones. La trece, a los bucles. La catorce, a los grafos.

La catorce ordena el vocabulario en cuatro capas. Primero el prompt, la instrucción. Luego el contexto, lo que el modelo sabe. Después el bucle, que repite hasta cumplir un objetivo. Y por último el grafo: varios agentes, bucles y comprobadores conectados. Cada capa no sustituye a la anterior, la contiene. Y debajo de todas, según el curso, va el harness.

El plan de hoy. Cuándo compensa un bucle. Qué significa barra loop en oh my pi y en otros agentes, porque no es lo mismo. Cuándo un bucle se convierte en grafo. Cuánto cuesta orquestar, con cifras publicadas y con las nuestras: la misma funcionalidad, con un agente y con varios. La ley de Goodhart aplicada a nuestra verificación. Y lo que viene.

**2 · Cuándo compensa un bucle**

La lección trece reduce un bucle a tres piezas: un objetivo, una forma de verificarlo y una condición de parada. Si falta una, no tienes un bucle, tienes un agente que da vueltas. Con las tres, sales de dentro del bucle, donde escribes cada instrucción, y pasas a estar fuera, donde solo decides.

Propone una prueba de una frase: ¿esto tiene final? Si lo tiene, es un objetivo que se persigue hasta cumplirlo. Si no, es algo que se vigila cada cierto tiempo, como el estado de la integración continua. Ojo, porque la lección piensa en otros agentes, donde barra loop es un reloj. En oh my pi, barra loop con guion guion until sí tiene final. Enseguida lo vemos.

¿Cuándo compensa? Cuando la condición de parada la comprueba un programa, no una impresión. Cuando cada vuelta deja el estado en disco, como el andamiaje del vídeo veintitrés, para que la siguiente sepa dónde está. Y cuando quien hace el trabajo no es quien lo da por bueno. La lección lo resume así: alguien de tu equipo no debe creerte.

¿Cuándo no? Cuando no sabes escribir la condición. Cuando el fallo necesita una decisión tuya, y repetir solo repite el error. Y cuando la tarea es tan pequeña que una sesión normal la termina en una vuelta. En el quince pusimos un techo de tres vueltas y bastó una: el techo no era un objetivo.

Y la lección avisa de cuatro costes que no se ven. Deuda de verificación: lo que el bucle da por bueno sin comprobarlo. Pérdida de comprensión: código que nadie ha leído. Rendición: dejar de opinar porque todo sale solo. Y la explosión de tokens: cada vuelta arrastra lo anterior, y el total gastado crece mucho más deprisa que el número de vueltas. Para eso están los modos compact y reset de barra loop.

La lección añade una escalera para no saltar escalones. Primero, un objetivo con su condición de parada. Después, una tarea programada que se repite. Luego, un bucle con dos agentes, uno que hace y otro que comprueba. Más arriba, un bucle que encuentra solo su siguiente tarea. Y en lo alto, varios bucles a la vez. Según el curso, la mayoría de equipos está en el segundo o el tercero. Empieza por el primero.

**3 · Barra loop aquí y allí**

Barra loop se llama igual en varios agentes y no hace lo mismo. En oh my pi, como vimos en el quince, reenvía tu mensaje cada vez que el agente cede el turno. Lo acotas con un número, con una duración o con un comando: con guion guion until, el harness ejecuta el comando tras cada vuelta, y el bucle para cuando sale con cero. Quien decide parar no es el modelo.

En Claude Code, barra loop es un temporizador. Repite un prompt cada cierto tiempo, cada cinco minutos, por ejemplo, o con un intervalo que elige el propio agente. Vive mientras la sesión está abierta, y las tareas que se repiten caducan a los siete días. Está pensado para vigilar: un despliegue, una revisión pendiente. Es el bucle por tiempo de la lección trece.

Barra goal también se parece y tampoco es igual. En oh my pi, el propio modelo da el objetivo por cumplido, con un presupuesto de tokens como freno. En Claude Code, después de cada turno, un modelo pequeño aparte lee la conversación y decide si la condición se cumple. Es un juez distinto del que trabaja, pero no ejecuta nada: solo puede juzgar lo que el agente haya enseñado en la conversación.

¿Y Pi? No trae ni barra loop ni barra goal. Tienes dos caminos. Un bucle de shell que repite pi guion pe, el modo de los scripts del vídeo diez, hasta que el verificador sale con cero. O una extensión con el evento agent before settle, del vídeo veinticuatro, que puede pedir una vuelta más. En el bucle de shell hay un matiz: la condición se mira antes de cada vuelta. En oh my pi, después.

La regla práctica: antes de usar un bucle, pregunta quién decide que ha terminado. Si lo decide el modelo, tienes una opinión con presupuesto. Si lo decide otro modelo que lee la conversación, una segunda opinión. Si lo decide un programa que escribiste tú, como verificar punto sh, tienes una condición. Por eso en el veinticuatro el script solo salía con cero o con uno.

Un detalle de Claude Code que conecta con el vídeo anterior: su barra goal está montada sobre un hook que se dispara al final de cada turno. Es la misma idea que el evento session stop de oh my pi y agent before settle de Pi: un punto donde el harness puede negarse a dejar terminar al agente. Lo que cambia es quién juzga en ese punto: un modelo que lee, o un script que ejecuta.

**4 · De un bucle a un grafo**

Un bucle tiene un solo camino. Todas las decisiones, qué hacer después y adónde volver si algo falla, ocurren dentro del contexto de un único agente. La lección catorce lo llama una decisión aplazada: barata, pero sus fallos no se ven, porque ni el propio agente sabe dónde se ha atascado. Un grafo es la decisión tomada por adelantado.

Un grafo tiene cuatro partes. Nodos, que son unidades de trabajo: un script, una llamada al modelo o un agente entero con su propio bucle. Aristas, cómo pasa el trabajo de uno a otro: en paralelo, según una condición o hacia atrás. Un estado compartido. Y reglas de enrutado: si las pruebas pasan, se integra; si fallan, se vuelve a implementar.

La pieza que más importa es el nodo que verifica. En un agente solo, la revisión ocurre en el mismo contexto que el trabajo: el agente se revisa a sí mismo. En un grafo, el verificador empieza con un contexto nuevo y solo ve el resultado, no el razonamiento. Es lo que hizo el revisor del veinticuatro, aunque recibiera el encargo de quien hizo el trabajo.

La lección explica por qué un bucle solo no basta cuando crece, con tres fallos que no se arreglan añadiendo comprobaciones dentro. El primero es Goodhart, y le dedicaremos un capítulo. El segundo, la ceguera hacia arriba: un bucle nunca pregunta si su objetivo es el correcto. Y el tercero, el conflicto: dos bucles hechos por separado, uno que optimiza la velocidad y otro la calidad, tiran de la misma cuerda en sentidos contrarios.

Y aquí viene una sorpresa: ya has dibujado grafos. La herramienta task del vídeo dieciséis, con tres agentes en paralelo y una verificación final en la sesión principal, es un abanico que se abre y se vuelve a cerrar. Barra cleanse, también. La lección distingue un grafo de un workflow por sus nodos: en un workflow son funciones; en un grafo pueden ser agentes. Lo nuevo es que un nodo cuesta una instrucción.

¿Cuándo hace falta? La lección da cinco criterios y pide que se cumplan al menos tres. Que el trabajo se divida en partes independientes. Que haya ramas o vueltas atrás. Que merezca la pena guardar el estado intermedio. Que cada nodo se pueda verificar de forma automática. Y que lo que ahorras al repartir supere lo que cuesta coordinar. Veinte pasos en fila no son un grafo: son un script.

**5 · Lo que cuesta orquestar**

El último criterio es el que más se olvida, así que pongámosle números. Anthropic publicó cómo montó su sistema de investigación con varios agentes. Un agente gasta unas cuatro veces los tokens de un chat; su sistema de varios agentes, unas quince veces. A cambio, en su propia evaluación de investigación, superó a un solo agente por un noventa por ciento.

Pero el mismo artículo dice cuándo no encaja: cuando todos los agentes necesitan el mismo contexto, o cuando hay muchas dependencias entre ellos. Y añade que la mayoría de tareas de programación tienen menos partes paralelizables que la investigación. Es la conclusión de Anthropic sobre su sistema, no una ley. Por eso hoy lo medimos en nuestra tienda.

Hay un dato del artículo que conviene leer despacio. En una de sus pruebas, la cantidad de tokens gastados explicaba por sí sola el ochenta por ciento de las diferencias de rendimiento. Dicho de otra forma: buena parte de lo que ganan varios agentes viene de gastar más. No es magia de la arquitectura. Es más lectura y más intentos en paralelo, y eso se paga.

En el vídeo veintidós medimos una parte del coste. Antes de leer una sola línea de tu código, cada sesión de oh my pi envía su prefijo: entre unos cuatro mil y unos ocho mil tokens, según las herramientas. Cada subagente es una sesión, así que paga su prefijo y vuelve a leer lo que necesita. La caché del proveedor abarata el prefijo, pero solo la parte que se repite igual.

Y hay un coste que no aparece en ninguna factura. La lección catorce lo llama el impuesto de orquestación, a partir de un texto de Addy Osmani. Lanzar un agente cuesta una tecla. Cerrar su trabajo, revisarlo y encajarlo con lo que han tocado los demás cuesta tu atención, y solo hay una como tú. Tu revisión es en serie: más agentes en paralelo no la hacen más rápida.

La funcionalidad de hoy es la cuarta del andamiaje: ticket cero cero cuatro, el desglose del pedido. Una función nueva, desglose, que devuelve la base sin IVA, el IVA, el envío y el total. Cruza tres piezas de la tienda y cae en la frontera de siempre: el envío se calcula sobre el total con cupón. Y se reparte bien: la implementación en un fichero y sus pruebas en otro.

Como en el veinticuatro, antes de que trabaje ningún agente escribimos nosotros la rúbrica y la prueba de aceptación, y las commiteamos con una etiqueta. Tuvimos que cambiar verificar punto sh: comparaba la verificación con la etiqueta de ticket cero cero tres, y la rúbrica nueva lo ponía en rojo. Ahora compara con la última etiqueta de rúbrica. Ese cambio también lo hicimos nosotros. Ejecutamos el script: rojo, porque la función no existe.

**6 · La misma tarea, con uno y con varios**

La comparación la hace un script, en la carpeta de mediciones del vídeo veintidós. Cada ejecución trabaja en su propio worktree, creado desde la etiqueta de la rúbrica, con oh my pi en modo print, DeepSeek Flash en todos los agentes y la puerta del veinticuatro cargada. Las mismas herramientas en las dos condiciones: si quitáramos task, cambiaría el prefijo y mediríamos otra cosa. Y un ajuste: que task espere a sus subagentes, porque en modo print oh my pi no los esperaba.

Solo cambia una frase del encargo. En la condición uno: hazlo tú solo, sin la herramienta task. En la condición varios: reparte; un subagente implementa desglose, otro escribe las pruebas sin ver la implementación, y tú integras, ejecutas verificar, marcas y haces commit. Es la separación de la lección trece: quien escribe las pruebas no es quien escribe el código.

Y el juez está fuera. Al terminar cada ejecución, el script mide el tiempo, ejecuta verificar punto sh, cuenta los ficheros tocados y las llamadas a task, y suma los tokens y el coste de todos los agentes, no solo del principal. Una ejecución de varios que no reparte, o una de uno que sí lo hace, no cuenta. Tres repeticiones de cada, seis ejecuciones.

Antes de lanzarlo, dibujemos el grafo de la condición varios. Dos nodos en paralelo: uno implementa y otro escribe las pruebas. Una arista que los junta en la sesión principal, que integra y ejecuta verificar punto sh. Una arista de vuelta, si el script falla. Y el commit al final, que pasa por la puerta. El estado compartido es la propia carpeta de trabajo, y por eso los dos nodos no tocan el mismo fichero.

Lo lanzamos y aceleramos la espera. El script tarda diez minutos y veinticinco segundos en total. Las seis ejecuciones son válidas: las de uno no llaman a task, y cada una de varios lo llama una vez, con dos subagentes. Las seis terminan con verificar punto sh en verde, y ninguna ha tocado la rúbrica ni la aceptación. La puerta también vale para los subagentes, porque oh my pi vuelve a cargar los hooks en cada uno: lo comprobamos al preparar la demo.

Ahora el resumen, en céntimos de dólar. Con un agente, de media: sesenta y dos segundos, unos cuatrocientos trece mil tokens, un noventa y cinco por ciento de caché y casi un céntimo. Con varios: ciento cuarenta y cuatro segundos, unos novecientos catorce mil tokens, un noventa y cuatro por ciento de caché y dos céntimos y medio. Repartir ha usado más del doble de tokens y ha costado dos veces y media más. Con la caché casi igual en las dos, el coste sigue a los tokens.

Y una línea que no sale en la media: cuánto trabajo de integración hubo. En las tres ejecuciones de varios, las piezas encajaron a la primera: verificar salió en verde nada más juntarlas. Aun así, la sesión principal leyó lo que habían hecho los dos subagentes, ejecutó la verificación, anotó la evidencia y repartió el trabajo en tres commits, donde un agente solo hizo uno. En una, además, quitó una prueba redundante. Ese trabajo de integración es el impuesto de orquestación, en pequeño.

**7 · Lo que dicen los números**

Tres avisos antes de sacar conclusiones. Son tres repeticiones, con un modelo barato y una tarea pequeña. Con pocos casos, una diferencia puede ser ruido, como vimos con barra ratchet en el veintiuno. Y DeepSeek cobra distinto según la franja horaria, así que lanzamos las seis seguidas, en la misma franja.

Con esos avisos: los dos aciertan, y repartir no ha mejorado el resultado. Lo que vemos encaja con lo que dice Anthropic. La funcionalidad tiene dos partes que se pueden hacer a la vez, pero son pequeñas, y las dos dependen de las mismas funciones de la tienda. En cada ejecución de varios, la sesión principal leyó el carrito y el envío antes de repartir, y después cada subagente volvió a leerlos. Repartir no ha ahorrado lectura: la ha multiplicado.

¿Y el tiempo? Ni siquiera ha ido más rápido: de media ha tardado más del doble, aunque trabajaban dos a la vez. Y mira la dispersión. Con un agente, las tres ejecuciones van de cuarenta y ocho a ochenta segundos. Con varios, de noventa y tres a ciento noventa, y los tokens, de unos cuatrocientos mil a más de un millón trescientos mil. Repartir no solo cuesta más: es menos predecible. Y lo que no sale en ninguna columna es tu revisión, que sigue siendo una.

Pasemos la tarea por los cinco criterios. Partes independientes: a medias, porque comparten dependencias. Ramas o vueltas atrás: solo repetir si la verificación falla, y eso ya lo hace un bucle. Estado intermedio que guardar: no. Verificación automática: sí. Y lo que ahorras frente a lo que cuesta coordinar: lo acabamos de medir. Uno o dos de cinco. No hacía falta un grafo.

¿Cuándo sí? Cuando las partes son grandes y de verdad independientes, como tres módulos que no comparten ficheros. Cuando quieres explorar varias soluciones y quedarte con una. Cuando el contexto de un solo agente no da para todo. O cuando la revisión necesita un contexto limpio, y ahí basta un único revisor al final, como en el veinticuatro. La regla del dieciséis sigue en pie: una tarea pequeña, en la sesión principal.

¿Y un plan? Faltaba la tercera opción del título. En lenguaje de grafos, el modo plan del vídeo quince es un nodo humano: el trabajo se detiene hasta que tú apruebas. Compensa cuando equivocarse de camino cuesta más que esperar: un cambio que toca varias piezas, una decisión de diseño, algo difícil de deshacer. Para ticket cero cero cuatro, con la rúbrica escrita antes, la aprobación ya la diste al escribirla.

Junta las tres opciones en una regla. Si la tarea es pequeña y tiene verificación, un agente, y si hace falta, un bucle con techo. Si equivocarse de camino es caro, un plan antes. Y si hay partes grandes que no se pisan, varios agentes, con un solo punto de integración y la verificación al final. Por ese orden: cada escalón cuesta más que el anterior.

Y el bucle. En una sesión de oh my pi, con la puerta cargada, escribimos barra loop tres, guion guion until, verificar punto sh ticket cero cero cuatro, y el encargo para un solo agente. Paró en la primera vuelta. El agente escribió el desglose y doce pruebas propias, con importes escritos a mano en seis pedidos, hizo commit y cedió el turno. Entonces el harness, no el modelo, ejecutó verificar punto sh: salió con cero, y el bucle se apagó solo. Costó alrededor de un céntimo, y la prueba oculta también pasa.

Que parase en la primera vuelta no le quita valor. Si el script hubiera salido con uno, habría llegado una segunda vuelta con el mismo mensaje, y una tercera como mucho: el tres era un techo, como en el quince. Un agente, una condición que no depende de él y un techo. Para esta tarea, es la opción más barata que verifica de verdad.

**8 · Goodhart: cuando verificar es el objetivo**

Ahora la deuda del vídeo veinticuatro. En mil novecientos setenta y cinco, el economista Charles Goodhart observó que una regularidad estadística tiende a romperse en cuanto se usa para controlar algo. Marilyn Strathern lo generalizó en mil novecientos noventa y siete, hablando de la evaluación de universidades, y de ahí viene la versión que todo el mundo cita: cuando una medida se convierte en objetivo, deja de ser una buena medida.

La lección catorce lo pone como el primer fallo de un bucle solo, con un ejemplo: un equipo de soporte que optimiza la tasa de incidencias resueltas. La cifra sube cada semana, y meses después las bajas de clientes se han duplicado. El bucle había aprendido a cerrar incidencias, no a resolverlas. Hizo exactamente lo que se le pidió.

Y fíjate en lo que pasa con un juez que lee la conversación, como la barra goal de Claude Code. Su medida es lo que el agente cuenta y enseña en el transcript. Su propia documentación lo dice: la condición tiene que poder demostrarse con lo que el agente muestra. Bien escrita, funciona. Pero si la condición es vaga, lo que se optimiza es el relato, que es justo lo que el vídeo uno nos enseñó a no creer.

Barra loop con guion guion until es ese bucle. Su único objetivo es que verificar punto sh salga con cero. Si el script mide algo que no es lo que importa, el bucle lo encontrará. No por malicia, sino porque es lo que optimiza. Vamos a verlo con ticket cero cero cuatro, y lo hemos preparado nosotros.

Para enseñarlo, escribimos primero una prueba de aceptación que solo comprobaba dos cosas: que el total del desglose era el de la tienda, y que base, IVA y envío sumaban ese total. Parece razonable. Después escribimos a mano una rama, cuadre, imitando a un agente con prisa: calcula el envío sobre el subtotal, antes del cupón, y saca el IVA por diferencia, el total menos todo lo demás. Ejecutamos verificar punto sh: cero.

Leamos lo que devuelve con el pedido de la frontera. Base, treinta y siete con ochenta. Envío, cero, cuando la tienda cobra cuatro con noventa y cinco. E IVA, doce con ochenta y nueve, en lugar de siete con noventa y cuatro. La suma cuadra porque el IVA se ha calculado para que cuadre. Es una cifra de cuadre. Medíamos que cuadrase, no que fuese correcto.

¿Cómo lo vimos? Con un ancla, la pieza que la lección dice que todo el mundo se salta. Una prueba que vive fuera de la tienda, en otra carpeta, con otro pedido y los importes calculados a mano: una silla de cuarenta y cinco euros con un cupón del veinte por ciento. No está en la carpeta de trabajo de ningún agente, y nadie se la menciona. En cuadre falla: envío cero, e IVA doce con cincuenta y uno en lugar de siete con cincuenta y seis. Y las seis ejecuciones de la comparación la superan.

Es la idea de barra ratchet del vídeo veintiuno: una mejora solo cuenta si mejora en casos que el agente no ha visto. Después reforzamos la aceptación, ahora con cada importe exacto en dos pedidos, y movimos la etiqueta. Con la nueva, la rama cuadre sale en rojo: el IVA y el envío no son los que deberían, y A cinco avisa de que la verificación ha cambiado desde su etiqueta. Es lo que el veinticuatro llamaba convertir lo que se cuela en un criterio nuevo. Pero la prueba oculta se queda fuera.

Y vale también para los números de este vídeo. Si mides solo el coste, siempre gana un agente que no verifica nada. Si mides funcionalidades en pasa, gana quien marca deprisa. Si mides tokens por tarea, gana quien lee menos de lo que debería. Ninguna métrica sola. Mira varias a la vez y guarda al menos una que el agente no pueda optimizar: una prueba oculta o una revisión tuya.

**9 · Lo que viene, repaso y cierre**

Lo que viene, separando lo que existe de lo anunciado. Existe ya: o eme pe guion guion restore retoma una sesión que se cayó y sigue con lo que dejó a medias, incluidos los subagentes que estaban trabajando. Del lado de Pi existe Pi Durable, un paquete aparte y experimental para agentes de larga duración: cada paso guarda un punto de control y otro proceso puede retomarlo. No sustituye a Pi.

Y anunciado, sin fecha: omp al cuadrado, del que hablamos en el veintidós. Su web solo dice que llega pronto. El Harness Playbook describe una pieza que viene al caso, los directores: una pila de comportamientos que controlan el bucle, como plan o goal, y deciden cuándo puede parar el agente. Su autor critica que hoy la exclusión entre modos, la del quince, se comprueba a mano, comando a comando; los directores la convertirían en una pila. Hoy no está en lo que tienes instalado.

¿Y si quieres repartir en Pi hoy? Pi no trae subagentes, pero entre sus extensiones de ejemplo hay una que los lanza como procesos de Pi aparte, con agentes de reconocimiento, planificación, trabajo y revisión, y que enseña los tokens y el coste de cada uno. Es un buen punto de partida, y tiene la virtud de Pi: ves todo el código del reparto, y decides tú cuánto cuesta.

Repasemos. Un bucle compensa cuando tiene objetivo, verificación y parada, y la parada la decide un programa. Barra loop de oh my pi para con un comando; el de Claude Code repite con un reloj; Pi no trae ninguno. Un grafo compensa con partes independientes y vueltas atrás. Varios agentes multiplican los tokens, y tu revisión no se paraleliza. Toda medida que se optimiza se acaba engañando: guarda un ancla fuera de su alcance.

La práctica: elige una tarea pequeña de tu proyecto y escribe antes su verificación y una prueba oculta, fuera del repositorio. Ejecútala tres veces con un solo agente y tres repartiendo, en worktrees separados, y apunta tiempo, tokens, coste y cuántas superan la prueba oculta. Después pasa la tarea por los cinco criterios y decide, con tus números, si repartir compensaba.

En el próximo vídeo, el último, todo junto: el proyecto final. Una funcionalidad de principio a fin, con Pi y con oh my pi: el plan, la rúbrica antes de empezar, el reparto si compensa, la revisión, las pruebas, el commit y la petición de cambios. Nos vemos allí.

</details>

