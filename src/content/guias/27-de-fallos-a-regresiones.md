---
title: "Vídeo 27 · De fallos a regresiones"
description: "Convierte un fallo del agente en un caso de regresión que se ejecuta solo, y reprodúcelo con el mismo modelo, con otro y con un arreglo para saber si era del modelo o del harness."
ruta: "pi-oh-my-pi"
orden: 27
duracion: "22 min"
video: "27-de-fallos-a-regresiones.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/27-de-fallos-a-regresiones.es.vtt"
---

Convierte un fallo del agente en un caso de regresión que se ejecuta solo, y reprodúcelo con el mismo modelo, con otro y con un arreglo para saber si era del modelo o del harness.

<p class="guia__nota">Dura 22 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que se cuela una vez

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **El punto de partida:** en el vídeo 26, la revisión con DeepSeek V4 Pro aprobó el cupón de importe fijo sin ver un borde: `{ importe: undefined }` no lanza `TypeError`, cae en el cupón de porcentaje y devuelve `NaN`. La integración continua, con Pi y Flash, sí lo vio.
- **La idea:** hacer con un fallo del agente lo que haces con un fallo de tu programa, convertirlo en una prueba que se ejecuta sola. Lo que falló no es la tienda: es el *harness* (el modelo, sus instrucciones, sus herramientas y la forma de lanzarlo).
- **De dónde viene:** del curso abierto *Building a Coding Agent From Scratch*, de Decoding AI (Apache-2.0). Aquí, con lo que traen Pi y oh my pi y unos scripts pequeños.
- **Por qué hace falta:** el harness cambia aunque no lo toques. Actualizas Pi u oh my pi, cambias de modelo, retocas el `AGENTS.md`. Sin casos guardados, te enteras cuando falla delante de ti.

### 2 · Dos preguntas: ¿funciona? ¿Y como lo diseñamos?

<p><button type="button" class="ir-a" data-t="125">▶ Ir a 2:05</button></p>

- **¿Funciona?** Un *banco de pruebas*: tareas con un resultado comprobable y un juez que el agente no ve. El `orquestar.sh` del vídeo 25 ya era un banco de una tarea.
- **¿Funciona como lo diseñamos?** *Casos de regresión*: miran el comportamiento (la herramienta correcta, la puerta respetada, solo lo que debía tocar) y salen de fallos reales.
- **Dos cifras distintas:** si repites cada tarea tres veces, «pasó al menos una vez» mide capacidad y «pasó las tres» mide fiabilidad. Para un agente que trabaja sin ti importa la segunda.
- **Fallos de infraestructura, aparte:** si el proveedor no contesta o falta la clave, no mide al agente. Se cuentan aparte y fuera de la media (en el vídeo 22, sin la clave, oh my pi cae a otro modelo).
- **Un caso:** estado de partida, orden exacta y comprobaciones que fallan con lo malo y pasan con lo bueno, de la más barata a la más cara. Un modelo que juzga, solo donde un programa no puede decidir. Es el «convertir lo que se cuela en un criterio» del vídeo 24, aplicado al harness.

### 3 · Lo que guarda una sesión

<p><button type="button" class="ir-a" data-t="266">▶ Ir a 4:26</button></p>

- **Lo que hay:** las sesiones son ficheros JSONL en forma de árbol (vídeos 03 y 12). Guardan mensajes, cada llamada a herramienta con su resultado y, en cada respuesta, proveedor, modelo, tokens y coste. oh my pi añade la versión del harness por entrada, una huella del *system prompt* y el cierre del proceso; un subagente guarda además su *system prompt* entero y sus herramientas. Pi guarda el *system prompt* por secciones y las herramientas en un primer mensaje de sistema.
- **Lo que no hay:** el commit en que estaba el repositorio y, en la sesión principal de oh my pi, las opciones con que lanzaste el proceso.
- **El manifiesto:** por eso cada ejecución lanzada desde un script deja a su lado un `manifiesto.json`: commit de partida, orden y opciones, modelo, versión del harness y fecha.
- **Guárdalas donde no se borren:** las sesiones de Pi de los vídeos 23 a 26 vivían en una carpeta temporal y ya no existen.
- **Leer y compartir sin navegador:** `omp render --plain`, `omp anonymize` (turnos tapados, rutas sustituidas; modelo y coste intactos), `omp session pack` y `pi --export`.

### 4 · Buscar fallos en el archivo

<p><button type="button" class="ir-a" data-t="454">▶ Ir a 7:34</button></p>

- **Minar trazas:** buscar entre las ejecuciones grabadas las que acabaron en error, las más caras y las que chocaron con los permisos, y agruparlas por *firma* (herramienta, primera línea del error y modelo). `minar.sh` lo hace sobre las 40 sesiones del perfil demo en menos de un segundo, sin modelo.
- **Decidir qué es un fallo lo hace una persona:** casi todas las firmas son el harness funcionando (el hook que protege `AGENTS.md`, el script del 21 hecho para fallar sin interfaz, aserciones mientras se arregla una prueba, una prueba sin la clave). Candidatas de verdad: argumentos que no eran JSON válido y una sesión de 2,3 millones de tokens.
- **El fallo que más importa no sale:** la revisión del 26 no tuvo ningún error. La palabra `undefined` aparece 8 veces en su sesión (el diff y el código que leyó) y ninguna en su respuesta. Los fallos silenciosos los encuentra otra mirada: la integración continua, una prueba oculta, tú leyendo.

### 5 · De sesión a caso

<p><button type="button" class="ir-a" data-t="617">▶ Ir a 10:17</button></p>

- **El caso** (`casos/revision-borde-cupon.json`), fuera de la tienda: síntoma, origen (sesión, fecha, modelo y cómo se lanzó), punto de partida (`ticket-005` comparada con `final`), orden y comprobaciones, con un tope de 10 minutos y 10 céntimos.
- **La misma prueba, no la misma ejecución:** en el 26 la revisión la lanzó `/review`, interactivo y con un subagente. El caso usa el encargo exacto que recibió el revisor, con el diff pegado, en `omp -p` con el mismo modelo y sus herramientas de trabajo. La diferencia queda escrita en el caso.
- **De la más barata a la más cara:** que la revisión no tocó ningún fichero (`git status`), que oh my pi terminó sin error, que no pasó del tope de coste y, solo al final, un *juez*.
- **El juez:** Pi sin herramientas, con Flash, recibe el texto de la revisión y una afirmación en español y contesta PASA o FALLA. Buscar «undefined» no sirve: está en la propia condición del código.
- **Calibrarlo antes de fiarse:** el informe de la CI del 26 tiene que dar PASA y la revisión de Pro, FALLA. Acertó las dos a la primera. Un juez revisa una verificación; no la sustituye.

### 6 · Reproducir: ¿el modelo o el harness?

<p><button type="button" class="ir-a" data-t="789">▶ Ir a 13:09</button></p>

- **Desde cero, no desde la grabación:** Pi y oh my pi no reutilizan los resultados de las herramientas al repetir: se ejecutan de verdad. `reproducir.sh` crea un worktree en el commit de partida y solo cambia lo que quieres probar.
- **Desde un punto de la conversación:** por RPC, en Pi `get_fork_messages` y `fork` (la sesión nueva acaba justo antes de tu mensaje); en oh my pi `navigate_tree`, como `/tree`. Bifurcar la conversación no bifurca el disco: vuelve también al commit del manifiesto. Y trabaja sobre una copia: abrir la de oh my pi le añadió una línea.
- **Tres tandas, en este orden:**

| Tanda | Ven el borde | Por revisión |
|---|---|---|
| Control · Pro, sin cambiar nada | 2 de 3 | ~3 min, 4,5 céntimos |
| Otro modelo · Flash | 3 de 3 | ~1,5 min, 1,4 céntimos |
| Arreglo · Pro + instrucción de entradas límite | 1 de 2 (más 1 de infraestructura) | 4 min, 5,3 céntimos |

- **Comprueba qué modelo respondió de verdad** en cada sesión antes de mirar el resultado.
- **Lo que se puede concluir:** el fallo de Pro existe, pero es intermitente; Flash lo ve siempre en este caso, lo que no dice nada de otros fallos. La instrucción, con tres repeticiones, no demuestra nada: se apunta como deuda y se mide más. Y un arreglo comprobado con el caso que lo inspiró es una promesa, no una prueba (el `/ratchet` del vídeo 21).

### 7 · Que se ejecuten solos, y cierre

<p><button type="button" class="ir-a" data-t="1046">▶ Ir a 17:26</button></p>

- **La batería:** `regresiones.sh` ejecuta cada caso tres veces y sale con 0 o 1 según un umbral. Con un segundo caso de la otra pregunta (implementar `ticket-005` desde la rúbrica): 6 ejecuciones, 24 minutos y unos 12 céntimos. El ticket, 3 de 3; la revisión, 2 de 3. La que falla es Pro sin instrucción, cortada por el tope de tiempo, que tardó unos 16 minutos en cortar con un tope de 10.
- **Cuándo:** antes de actualizar Pi u oh my pi, de cambiar de modelo o de tocar el `AGENTS.md`, y por la noche (vídeo 28).
- **Sin gastar nada:** `comprobar-archivo.sh` pasa una comprobación de código por las sesiones grabadas: en el perfil demo, 30 pasan y 10 no.
- **Goodhart, otra vez:** si ajustas hasta que todos los casos pasan, puedes acabar con un agente que aprueba estos casos y nada más. Guarda casos que no hayas usado para escribir el arreglo.
- **Apagar una pieza y medir:** ahora sí se puede ver si una pieza del harness sigue haciendo falta.
- **Práctica:** busca un fallo de tus sesiones que te costó tiempo, aunque no diera error. Escribe su caso con un manifiesto, la orden y al menos una comprobación de código, comprueba que falla con la sesión original y repítelo tres veces con el mismo modelo y tres con otro.
- **Materiales:** la carpeta [`regresiones/`](https://github.com/CodigoSinSiesta/curso-pi-materiales/tree/main/regresiones) del [repositorio de materiales del curso](https://github.com/CodigoSinSiesta/curso-pi-materiales).

## Código y comandos

Se ejecuta en `~/csn/regresiones`. Hace falta `DEEPSEEK_API_KEY` en el entorno.

### Lo que guarda una sesión

```bash
jq -r .type sesion.jsonl | sort | uniq -c
jq -c 'select(.type=="session_init") | {tools}' subagente.jsonl
omp render sesion.jsonl --plain -w 120 | head -45
omp anonymize sesion.jsonl -o /tmp/csn/anon
omp session pack sesion.jsonl /tmp/csn/sesion.tar
pi --export sesion-de-pi.jsonl /tmp/csn/pi.html
```

### Minar, el caso y el juez

```bash
./minar.sh ~/.omp/profiles/demo/agent/sessions
cat casos/revision-borde-cupon.json
./juez.sh casos/revision-borde-cupon.json calibracion/bueno.md   # PASA
./juez.sh casos/revision-borde-cupon.json calibracion/malo.md    # FALLA
```

### Reproducir y la batería

```bash
./reproducir.sh casos/revision-borde-cupon.json 3                                  # control
MODELO=deepseek/deepseek-flash ./reproducir.sh casos/revision-borde-cupon.json 3   # otro modelo
ARREGLO=arreglos/revisor-bordes.md ./reproducir.sh casos/revision-borde-cupon.json 3
./resumen-regresiones.sh control otro-modelo arreglo
./regresiones.sh 3; echo $?
./comprobar-archivo.sh comprobaciones/sin-error.sh casos/revision-borde-cupon.json ~/.omp/profiles/demo/agent/sessions
node rpc-bifurcar.mjs omp copia.jsonl   # sobre una copia, nunca la original
```

## Fuentes

- *Building a Coding Agent From Scratch* (Decoding AI, licencia Apache-2.0), [repositorio](https://github.com/decodingai-magazine/building-a-coding-agent-from-scratch-course): lecciones de evaluación y de regresiones (banco frente a casos, *pass@k* y *pass^k*, fallos de infraestructura aparte, minado de trazas por firma, el juez que audita una verificación, reproducir antes de atribuir). Ideas adaptadas y traducidas, sin texto ni código copiado.
- oh my pi: `session.md` (formato de sesión), `rpc.md` (`fork`, `navigate_tree`), `cli-reference.md` (`-p`, `--max-time`, `--max-cost`, `--append-system-prompt`) y la ayuda de `omp anonymize`, `omp session` y `omp render`. Web: https://omp.sh/.
- Pi: `session-format.md`, `rpc-commands.md` (`get_fork_messages`, `fork`) y `cli.md` (`--export`).
- Vídeos relacionados: 03 y 12 (la sesión como árbol), 21 (`omp -p`, RPC y `/ratchet`), 22 (prefijos y la clave), 24 (rúbricas y calibrar al evaluador), 25 (`orquestar.sh`, prueba oculta y Goodhart) y 26 (la revisión que no vio el borde).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que se cuela una vez**

El proyecto final del veintiséis dejó una pregunta abierta. La revisión con el modelo más caro del día aprobó el cupón de importe fijo sin ver un borde: un cupón con el importe sin definir devolvía algo que no es un número. La integración continua, con Pi y un modelo barato, sí lo vio. Lo apuntamos como riesgo y seguimos.

Hoy vamos a hacer con ese fallo lo que haces con un fallo de tu programa: convertirlo en una prueba que se ejecuta sola, para enterarte si vuelve. Pero lo que falló no es la tienda. Es el agente, o mejor dicho, el harness: el modelo, sus instrucciones, sus herramientas y la forma de lanzarlo.

La idea viene de otro curso abierto, Building a Coding Agent From Scratch, de Decoding AI, con licencia Apache dos punto cero. Construyen un agente desde cero, y sus dos últimas lecciones tratan justo esto: medir el agente con un banco de pruebas, y convertir sus ejecuciones fallidas en casos de regresión que se reproducen con otro modelo. Nosotros no partimos de cero: usamos lo que Pi y oh my pi traen, y lo que falta, con scripts pequeños.

¿Por qué hace falta? Porque el harness cambia aunque no lo toques. Durante este curso hemos actualizado Pi y oh my pi casi cada semana, y alguna actualización cambió cosas que usábamos, como la herramienta que desapareció en el vídeo veintiuno. Cambias de modelo porque sale uno más barato. Retocas el AGENTS punto md. Cada cambio puede arreglar algo y romper otra cosa, y sin casos guardados solo te enteras cuando falla delante de ti.

El plan. Primero, dos preguntas que conviene no mezclar. Después, qué guarda una sesión de Pi y de oh my pi, y qué no. Buscaremos fallos en las sesiones del curso, convertiremos el del veintiséis en un caso, lo reproduciremos con el mismo modelo, con otro y con un arreglo, y al final dejaremos los casos ejecutándose solos.

**2 · Dos preguntas: ¿funciona? ¿Y como lo diseñamos?**

El curso de Decoding AI separa dos preguntas, y cada una tiene su herramienta. La primera: ¿funciona? Le das al agente tareas con un resultado comprobable y un juez que el agente no ve, y cuentas cuántas resuelve. Es un banco de pruebas. La segunda: ¿funciona como lo diseñamos? Ahí no miras solo el resultado, sino el comportamiento: si usó la herramienta correcta, si respetó la puerta, si tocó solo lo que debía.

Lo primero ya lo tenemos, aunque no lo llamáramos así. En el veinticinco, orquestar punto sh lanzaba la misma funcionalidad en worktrees separados y la juzgaba desde fuera: verificar punto sh desde la etiqueta de la rúbrica, y una prueba oculta fuera de la tienda. Eso es un banco con una sola tarea. Las tres funcionalidades con rúbrica, la tres, la cuatro y la cinco, ya son un banco pequeño.

Del banco salen dos cifras que conviene distinguir. Si repites cada tarea tres veces, puedes contar si pasó al menos una vez, o si pasó las tres. La primera mide capacidad: el agente sabe hacerlo. La segunda mide fiabilidad: lo hace siempre. La distancia entre las dos dice lo inestable que es. Para un agente que trabaja sin ti, la que importa es la segunda.

Y una distinción que ahorra discusiones. Si una ejecución falla porque el proveedor devolvió un error de cuota, o porque faltaba la clave, no es un fallo del agente: es un fallo de infraestructura. El curso de Decoding AI las cuenta aparte y las saca de la media. En el veintidós vimos el caso típico: sin la clave de DeepSeek, oh my pi cae a otro modelo. Esa ejecución no mide al agente que querías medir.

Los casos de regresión responden a la segunda pregunta, y salen de otro sitio: de fallos reales. Un caso es pequeño y concreto. El estado de partida, la orden exacta, y unas comprobaciones que fallan con el comportamiento malo que viste y pasan con el bueno. Cuanto más baratas y más deterministas sean, mejor. Un modelo que juzga, solo donde un programa no puede decidir.

Fíjate en que esto ya lo hicimos en el veinticuatro, con otro nombre: convertir lo que se cuela en un criterio. Allí, con la tienda: un fallo en la frontera del envío se convertía en una prueba de aceptación. Hoy, con el harness: un fallo del agente se convierte en un caso que se vuelve a ejecutar cada vez que cambias algo.

**3 · Lo que guarda una sesión**

Para convertir un fallo en un caso, primero tiene que estar grabado. Pi y oh my pi guardan cada sesión como un fichero JSONL, una línea por entrada, como vimos en los vídeos tres y doce. Cada entrada apunta a su padre, y por eso la sesión es un árbol: rebobinar o bifurcar no borra nada. Un fallo no se pierde por haber seguido trabajando después.

¿Qué hay dentro? Los mensajes, cada llamada a herramienta con sus argumentos y su resultado, si acabó en error, y en cada respuesta, el proveedor, el modelo, los tokens y el coste. oh my pi añade más: en cada entrada, la versión del harness que la escribió; una huella del system prompt, que cambia si cambian las instrucciones; y, al cerrar, cómo terminó el proceso, con las herramientas que quedaron a medias si se cayó. [VERIFICAR la lista de herramientas a medias: solo consta en la documentación; la entrada de cierre sí la hemos visto]

Pi, según su documentación, guarda el system prompt y la lista de herramientas como mensajes de sistema al principio de la sesión, y los cambios posteriores como parches. Así puedes saber con qué instrucciones y con qué herramientas trabajó el agente en cada momento, aunque hoy tengas otra configuración. Lo comprobaremos con la sesión que grabemos en la demo. [VERIFICAR]

Y ahora lo que no hay, que es lo importante. Ninguna de las dos guarda en qué commit estaba el repositorio cuando empezó la sesión. Y la sesión principal de oh my pi no guarda con qué opciones lanzaste el proceso: las herramientas permitidas, el modo de aprobación, los hooks. Sin eso, no puedes repetir la ejecución en las mismas condiciones. Esa información la tiene que guardar quien lanza al agente.

Por eso, desde hoy, cada ejecución que lancemos desde un script deja al lado de su sesión un manifiesto: el commit de partida, la orden completa, el modelo, la versión del harness y la fecha. Es una línea más en scripts como orquestar punto sh, y es la diferencia entre un fallo que puedes estudiar y uno que solo puedes recordar.

Un tropiezo que nos pasó a nosotros. Las sesiones de Pi de los vídeos veintitrés a veintiséis vivían en una carpeta temporal, y el Mac la borró al reiniciar. Ya no existen. Las de oh my pi, en el perfil demo, siguen ahí. Si una sesión puede acabar siendo un caso, guárdala en un sitio que no se borre solo.

Para leerlas tienes varias vías. Con jota cu, como en todo el curso. Con o eme pe render y la opción plain, que dibuja la conversación entera en la terminal, sin abrir el navegador. Con la exportación a HTML: barra export en las dos, o pi guion guion export con la ruta de la sesión. Y con barra trace y barra stats, del vídeo veintiuno, si lo que buscas son tiempos y costes.

Y dos comandos de oh my pi pensados para compartir un fallo. O eme pe anonymize escribe una copia con el contenido de los turnos tapado y las rutas sustituidas, pero conserva la forma: qué herramientas, en qué orden, con qué modelo y cuánto costó. Lo probamos con una sesión del veintiséis, y el nombre de usuario no aparece. Y o eme pe session pack la empaqueta con sus adjuntos para llevarla a otra máquina.

**4 · Buscar fallos en el archivo**

El curso de Decoding AI llama minar trazas a buscar, entre todas las ejecuciones grabadas, las que fueron mal. Propone tres búsquedas: las que acabaron en error, las más caras, y las que chocaron varias veces con los permisos. Y agrupa lo que encuentra por firma: el tipo de error, la última herramienta y el modelo. Dos ejecuciones con la misma firma probablemente son el mismo fallo.

Nuestras sesiones no están en ningún servicio, están en ficheros, así que la búsqueda es un script. Minar punto sh recorre una carpeta de sesiones, y en cada una cuenta los resultados de herramienta con error, las respuestas que acabaron en error o abortadas, y los tokens y el coste. Agrupa los errores por herramienta y por la primera línea del mensaje. No llama a ningún modelo y tarda segundos.

Lo pasamos por el perfil demo, con las sesiones de todo el bloque de oh my pi: [CIFRA] ficheros. Y salen firmas que reconoces. El hook del diecinueve que protege el AGENTS punto md. Bash bloqueado por la política de herramientas. Requiere aprobación pero no hay interfaz, del script del veintiuno. Una llamada a la lista de tareas con argumentos que no eran JSON válido. Aserciones que fallan. Y una sesión de más de dos millones de tokens.

Ahora viene lo que no hace el script: decidir qué es un fallo. Casi todas estas líneas son el harness funcionando. El hook bloqueó lo que debía bloquear. El script del veintiuno estaba hecho para que la edición fallara sin interfaz. Y una aserción que falla mientras el agente arregla una prueba es trabajo normal. El curso de Decoding AI hace lo mismo con un error de conexión: lo descarta como fallo del agente.

Quedan candidatas de verdad. Los argumentos que no eran JSON válido son un tropiezo del modelo con una herramienta, el tipo de cosa del que hablamos con Auto QA en el veinticuatro. Y la sesión carísima merece una mirada: puede ser una tarea grande o un agente dando vueltas. Pero el fallo que más nos importa no sale en la tabla, porque no produjo ningún error.

Es el del veintiséis. El revisor aprobó el cambio con todo a dos, sin un solo error de herramienta y con una respuesta impecable. Abrimos su sesión con o eme pe render: el subagente revisor, con DeepSeek V cuatro Pro, cita la línea que compara el importe con undefined, y aun así no ve el caso que se escapa por ahí. El fallo está en lo que no dijo, y ninguna búsqueda de errores lo encuentra.

Esa es la limitación de minar: encuentra los fallos que hacen ruido. Los silenciosos, una revisión que aprueba lo que no debía o un ticket en pasa que no pasa, los encuentra otra mirada: la integración continua, una prueba oculta, tú leyendo. El archivo se mina, pero los mejores casos suelen llegar de un informe que contradice a otro.

**5 · De sesión a caso**

Escribimos el caso. Cada caso es un fichero JSON en una carpeta de regresiones que vive fuera de la tienda, junto a la prueba oculta del veinticinco. Lo que juzga al agente no puede estar donde el agente trabaja. El primero se llama así: la revisión señala el cupón con el importe sin definir.

Tiene cinco partes. El síntoma, en una frase. El origen: el identificador de la sesión, la fecha, el modelo y la versión del harness que lo produjeron, para poder volver a ella. El punto de partida: la rama ticket cero cero cinco comparada con final, dos commits que siguen en la tienda. La orden: el mismo encargo de revisión, adaptado para ejecutarse sin interfaz. Y las comprobaciones.

Un detalle honesto sobre la orden. En el veintiséis la revisión se lanzó con barra review, que es interactivo: te pregunta la rama base y lanza un subagente. Un caso tiene que poder ejecutarse sin nadie delante, así que lo reproducimos con o eme pe guion pe: el mismo diff, la misma rúbrica, el mismo modelo, pero en la sesión principal. No es la misma ejecución; es la misma prueba. Y lo dejamos escrito en el caso.

Las comprobaciones van de la más barata a la más cara. Primero, las de código: que la revisión no ha tocado ningún fichero, con git status; que oh my pi terminó sin error; y que no ha pasado de un tope de coste. Son métricas de comportamiento, y un programa las decide sin dudar. Si una falla, el caso falla, y no hace falta preguntar a nadie más.

La última no la decide un programa: ¿la revisión señala el borde? Podríamos buscar la palabra undefined, pero la revisión de Pro la escribe, al citar el código, y aun así no ve el problema. Así que usamos un juez: Pi sin herramientas, con un modelo barato, que recibe solo el texto de la revisión y una afirmación escrita en español, y contesta pasa o falla. Es la otra superficie del curso de Decoding AI: una afirmación donde un número no basta.

¿Por qué Pi sin herramientas? Porque el juez no necesita leer la tienda, solo un texto, y en el vídeo veintidós medimos que es el prefijo más pequeño que tenemos: unos ochocientos tokens antes de empezar. Y porque es otro harness, distinto del que revisa. Pero un juez también se equivoca, y el curso de Decoding AI lo dice claro: un juez revisa una verificación, no la sustituye.

Por eso lo calibramos, como al revisor del veinticuatro. Antes de fiarnos, le damos dos textos que ya conocemos. El informe de la integración continua del veintiséis, que sí señala el borde, tiene que dar pasa. La revisión de Pro, que no lo señala, tiene que dar falla. Si se equivoca en cualquiera de los dos, el problema es el juez, y el caso aún no vale. [REVISAR TRAS GRABAR]

Es la regla de la rúbrica del veinticuatro: una comprobación que no falla antes del arreglo no comprueba nada. En el curso de Decoding AI, cada tarea del banco tiene una solución de referencia que tiene que sacar un uno, y el estado sin tocar, un cero, y eso se comprueba sin gastar modelo. Aquí, el informe que acierta y la revisión que no hacen ese papel.

**6 · Reproducir: desde el principio o desde un punto**

Con el caso escrito, la pregunta es: ¿se repite? Antes de arreglar nada, hay que volver a ver el fallo. Y conviene ser exacto con lo que significa reproducir, porque hay dos formas, y ninguna es la que usa el curso de Decoding AI.

Allí, cada ejecución se graba con una herramienta, Kitaru, que guarda también lo que devolvió cada herramienta. Al reproducir, puedes pedir que las herramientas devuelvan lo grabado en lugar de ejecutarse otra vez. Así cambias solo el modelo, y todo lo demás es idéntico. Pi y oh my pi no tienen nada parecido: si repites, las herramientas se ejecutan de verdad.

La primera forma, la que usa nuestro caso, es empezar de cero. Un worktree en el commit de partida, la misma orden y las mismas opciones, y solo cambia lo que quieres probar: el modelo, las instrucciones o una herramienta. Es lo que hacía orquestar punto sh. Las herramientas trabajan sobre el mismo código que vio el agente original, así que es una reproducción honesta, aunque no idéntica.

La segunda forma es volver a un punto de la conversación. En una sesión larga, el fallo puede estar en el turno quince, y repetir los catorce anteriores cuesta. Las dos herramientas permiten bifurcar desde un mensaje tuyo, y al probarlas por RPC, sin modelo y sobre una copia, encontramos una diferencia que conviene saber.

En Pi, get fork messages lista tus mensajes con su identificador, y fork crea una sesión nueva que acaba justo antes del mensaje elegido, y te devuelve su texto para enviarlo otra vez. En oh my pi, fork desde un mensaje lo incluye en la sesión nueva. Para quedarte justo antes, está navigate tree, que hace lo mismo que barra tree: vuelve al punto anterior y te devuelve el texto. Luego cambias de modelo y lo envías.

Y el aviso más importante del capítulo. Bifurcar una conversación no bifurca el disco. La sesión nueva cree que los ficheros están como en el turno catorce, pero tu carpeta está como la dejó el turno veinte. Si vuelves a un punto, devuelve también el repositorio a ese punto, con el commit que guardó el manifiesto. Por eso el rastro de commits de la rutina de salida del veintitrés vale tanto.

Otro detalle que vimos al probarlo: abrir una sesión, aunque solo sea para bifurcarla, escribe en el fichero. Pi le añadió una entrada con el nivel de razonamiento, y oh my pi, una de cierre de proceso. No rompe nada, pero la sesión original es la evidencia del fallo. Trabaja siempre sobre una copia.

Y una tercera vía, que no reproduce pero ayuda a entender. oh my pi tiene barra seance: abre una sesión antigua como un consultor de solo lectura, con el modelo que elijas. Puedes preguntarle a otro modelo, con aquella conversación delante, qué casos límite no comprobó la revisión. No sustituye a repetir la prueba, pero orienta el arreglo. [VERIFICAR]

**7 · ¿El modelo o el harness?**

Ahora sí, reproducimos, y el orden importa. Lo tomamos del curso de Decoding AI: primero, una reproducción de control, sin cambiar nada. El mismo modelo, Pro, tres veces. Si el fallo no se repite, todavía no tienes nada que arreglar, y cualquier cambio que hagas parecerá que funciona. Reproducir punto sh, el caso, y tres repeticiones.

Resultado del control: Pro señala el borde en [CIFRA] de tres. [REVISAR TRAS GRABAR: si lo señala tres de tres, decirlo así: lo del veintiséis no se repite, y el caso se guarda sin atribuir nada; si falla las tres, el fallo es reproducible.] Con tres repeticiones, como dijimos en el veinticinco, una diferencia pequeña puede ser ruido. Lo que buscamos es un patrón claro, no un decimal.

Segunda tanda: el mismo caso con Flash, el modelo que en el veintiséis sí lo vio dos veces, en la primera revisión y en la integración continua. Una opción del script cambia el modelo y nada más. Y antes de mirar el resultado, comprobamos en las sesiones grabadas qué modelo respondió de verdad. Un cambio de modelo que no se aplica es el error más tonto, y el más fácil de no ver.

Flash señala el borde en [CIFRA] de tres, y cuesta [CIFRA] céntimos por revisión, frente a [CIFRA] de Pro. [REVISAR TRAS GRABAR] Cuidado con la conclusión rápida, pasar la revisión al modelo barato. El caso mide una sola clase de fallo. Que Flash vea este borde no dice nada de los que Pro sí ve. El curso de Decoding AI lo avisa: un evaluador en verde solo dice que no volvió ese fallo, no que el cambio funcione.

Tercera tanda: cambiar el harness, no el modelo. El arreglo es una instrucción para quien revisa: antes de aprobar una validación nueva, prueba las entradas límite, la propiedad que falta, la que está pero sin valor, nulo, cero y negativos, y si puedes, ejecútalas. Va en un fichero aparte que se añade al system prompt con guion guion append system prompt, sin tocar la tienda. Pro otra vez, tres repeticiones. [VERIFICAR que la opción lee el fichero]

Con la instrucción, Pro señala el borde en [CIFRA] de tres. [REVISAR TRAS GRABAR] Y miramos también las comprobaciones de código: que la revisión sigue sin tocar ningún fichero, y que el coste no se ha disparado, porque ejecutar casos límite cuesta llamadas a herramientas. Un arreglo que encuentra el borde pero modifica la tienda no es un arreglo: es otro caso.

Junta las tres tandas y tienes la decisión que el veintiséis no podía tomar. Si el control no reproduce el fallo, guarda el caso y sigue mirando, sin atribuir nada. Si el modelo barato acierta y el caro no, sospecha del modelo, pero mide más casos antes de cambiar. Y si una instrucción lo arregla con el mismo modelo, el problema era el harness, que es lo más barato de cambiar.

Recuerda barra ratchet, del vídeo veintiuno: un cambio solo cuenta si mejora en casos que el agente no ha visto. Nuestra instrucción la escribimos mirando este caso. Para saber si generaliza hace falta otro caso, con otro borde, que no hayamos usado para escribirla. Si no lo tienes, apúntalo como deuda: un arreglo comprobado con el caso que lo inspiró es una promesa, no una prueba.

**8 · Que se ejecuten solos**

El caso ya vale, así que entra en la batería. Regresiones punto sh recorre la carpeta de casos, ejecuta cada uno tres veces en su worktree, aplica sus comprobaciones y escribe una fila por ejecución. Al final, por caso, cuántas veces pasó al menos una vez y si pasó todas. Y sale con cero o con uno, como verificar punto sh, según un umbral que eliges tú.

Añadimos un segundo caso, de la otra pregunta: implementar el ticket cero cero cinco desde final, juzgado por verificar punto sh y la prueba oculta. Es el banco del veinticinco en pequeño. Así la batería mira las dos cosas: que el agente resuelve la tarea, y que se comporta como lo diseñamos.

La ejecutamos entera: [CIFRA] ejecuciones, [CIFRA] minutos y [CIFRA] céntimos. [REVISAR TRAS GRABAR: si alguna acaba con error del proveedor, aparece aparte como fallo de infraestructura, fuera de la media; si no, decir que la columna existe y por qué.] Esa columna es la que te salva de perseguir un fallo que no es del agente.

¿Cuándo se ejecuta? No en cada commit: cada vuelta gasta modelo. Tiene sentido antes de actualizar Pi u oh my pi, antes de cambiar de modelo o de tocar el AGENTS punto md, y una vez por la noche. Y sin nadie delante, que es el tema del próximo vídeo: un agente lanzado por cron que ejecuta la batería y te deja el resultado por la mañana.

Hay además una forma de usar los casos sin gastar nada. Las comprobaciones de código se pueden pasar por las sesiones que ya tienes grabadas, sin repetir ninguna. El curso de Decoding AI lo llama evaluar sesiones sin reproducirlas. Antes de escribir un caso nuevo, es la mejor forma de saber cuántas veces había pasado ya, y si merece la pena.

Y el aviso del veinticinco, que aquí vuelve. En cuanto la batería decide si actualizas o no, se convierte en objetivo. Si ajustas las instrucciones hasta que todos los casos pasan, puedes acabar con un agente que aprueba estos casos y nada más. Guarda casos que no hayas usado para escribir el arreglo, y añade casos de fallos nuevos, no variantes de los mismos.

Y la otra cara, que dejamos en el veintiséis: cada pieza del harness existe porque el modelo no hacía algo bien, y de vez en cuando conviene apagar una y ver si empeora. Hasta hoy no teníamos cómo verlo. Ahora sí: apagas la puerta o la instrucción, ejecutas la batería, y miras si algún caso se pone en rojo. Si ninguno lo hace, esa pieza ya no hace falta.

**9 · Límites, repaso y cierre**

Los límites. Tres repeticiones dan una pista, no una estadística; con casos baratos, sube las repeticiones. El juez es un modelo y se equivoca: se calibra con ejemplos conocidos y se usa solo donde el código no llega. Las reproducciones ejecutan herramientas de verdad, así que no son idénticas: si un caso depende de la red o de la hora, fíjalas o déjalo fuera. Y la batería cuesta dinero cada vez.

Repasemos. Un banco pregunta si funciona; los casos de regresión, si funciona como lo diseñaste. Las sesiones guardan casi todo, pero no el commit ni las opciones: guárdalos tú en un manifiesto. Minar el archivo encuentra los fallos ruidosos; los silenciosos aparecen cuando dos miradas no coinciden. Y un caso tiene origen, punto de partida, orden y comprobaciones, de la más barata a la más cara.

Reproducir es empezar de cero en el mismo commit, o volver a un punto de la conversación, con el disco en el mismo punto y sobre una copia de la sesión. Primero el control con el mismo modelo, después el otro modelo, después el arreglo, comprobando siempre qué modelo respondió. Y la batería se ejecuta sola, con su umbral, antes de cada cambio que pueda romper algo.

La práctica: busca en tus sesiones un fallo que te haya costado tiempo, aunque no diera ningún error. Escribe su caso con un manifiesto, la orden y al menos una comprobación de código, y comprueba que falla con la sesión original. Repítelo tres veces con el mismo modelo y tres con otro, y apunta si el fallo era del modelo o del harness.

En el próximo vídeo, agentes que trabajan sin ti: oh my pi y Pi lanzados por cron, por un webhook o desde la integración continua, que te dejan una rama y una petición de cambios. Cómo aislarlos, dónde van las claves, qué pasa con las aprobaciones cuando nadie puede aprobar, y cuánto han gastado mientras dormías. Nos vemos allí.

## Demos que hay que grabar

Entorno aislado del curso: Orca, terminal en `~/csn/tienda`, `OMP_PROFILE=demo`, `PI_CODING_AGENT_DIR=/tmp/csn/pi-agent`
(rehacer con la clave de DeepSeek: `/tmp/csn` no existe hoy), `DEEPSEEK_API_KEY` cargada fuera de cámara (sin ella,
omp del perfil demo cae a un modelo local: el 22 lo vio). Modelos: `deepseek/deepseek-v4-pro` (el revisor del 26) y
`deepseek/deepseek-flash` (el otro modelo y el juez). Antes de cualquier captura del perfil demo: rutas con el nombre de
usuario difuminadas, ningún modelo local en pantalla. **Gastan modelo**: el juez (calibración: 2 llamadas), las tres
tandas de reproducción (9 revisiones), la batería (2 casos × 3) y, opcional, `/seance`. **No gastan**: el minado, `omp
render`, `omp anonymize`, `omp session pack`, `pi --export`, el RPC de bifurcación sin `prompt`. Gasto esperado:
**[CIFRA]** (referencia: en el 26 la revisión con Pro costó ≈1,2 c$ y la CI con Pi ≈1,2 c$; no extrapolar sin medir).

**Estado de la tienda que necesita:** ninguno nuevo. `final` (`6ff1952`, etiqueta `rubrica-ticket-005`) y `ticket-005`
(`afc315d`) tal como quedaron en el 26; remoto `revision` intacto. Los casos crean worktrees `--detach` en
`/tmp/csn/r27/-` y nunca tocan `final` ni `ticket-005`. Comprobar antes: `git -C ~/csn/tienda log --oneline -1
ticket-005` → `afc315d`; `git worktree list` sin restos del 25.

*Preparación fuera de cámara (la hace una persona, no un agente):*
1. Crear `~/csn/regresiones/` (material nuevo, ver abajo) y copiar las sesiones de partida **como copia**:
   `cp -R ~/.omp/profiles/demo/agent/sessions/-csn-tienda/2026-10-17T08-36-22-430Z_01a14901-451e-7596-a32c-60bab7337143*
   ~/csn/regresiones/archivo/` (la revisión del 26 con su subagente). Nunca abrir los originales con `--resume`.
2. Calibración del juez, **sin cámara primero**: `./juez.sh casos/revision-borde-cupon.json calibracion/bueno.md` →
   PASA y `calibracion/malo.md` → FALLA (bueno = `informe.md` de la CI del 26; malo = el texto final de la revisión de
   Pro, sacado del JSONL con `jq`). Si falla alguno, reescribir la afirmación hasta que acierte los dos **y anotar
   cuántas veces se reescribió** (se cuenta en la locución si fueron varias).
3. Ensayo de `reproducir.sh` con una sola repetición de Flash para medir tiempo y coste; ajustar `--max-time` y
   `--max-cost` del caso.
4. Una sesión corta de Pi grabada en `/tmp/csn/pi-agent` (por ejemplo, «Explica qué hace totalConCupon» en `final`) para
   enseñar el RPC de Pi y comprobar el mensaje `system` con las herramientas (Pendiente).

*Grabación:*
1. **(Diapositiva) Dos preguntas.** Banco («¿funciona?»: tarea + juez oculto; pasó alguna / pasó todas; infraestructura
   aparte) frente a casos de regresión («¿funciona como lo diseñamos?»: comportamiento, salen de fallos reales).
   Crédito: «Ideas de Building a Coding Agent From Scratch, Decoding AI, Apache-2.0».
2. **Lo que guarda una sesión.** `jq -r .type .jsonl | sort | uniq -c`; `jq -c 'select(.type=="custom")
   | .customType' … | sort | uniq -c` (`system-prompt-digest`, `tool_execution_start`, `session_exit`); `jq -c
   .runtime … | sort | uniq -c` (versión por entrada: **difuminar o recortar el número**, el vídeo no nombra
   versiones). Después, la cabecera de la sesión de Pi grabada en la preparación y su primer mensaje `system`.
3. **(Diapositiva) Lo que no guarda** y el manifiesto: `{commit, orden, modelo, harness, fecha}`.
4. **Leer y compartir.** `omp render  --plain -w 120 | head -60`; `omp anonymize  -o /tmp/csn/anon` y
   `grep -c "$USER" /tmp/csn/anon/session.jsonl` → 0; `jq` de un `toolCall` anonimizado (comando con huecos, modelo y
   coste intactos); `omp session pack  /tmp/csn/sesion.tar && tar tf /tmp/csn/sesion.tar`; `pi --export
    /tmp/csn/pi.html`.
5. **Minar.** `~/csn/regresiones/minar.sh ~/.omp/profiles/demo/agent/sessions` → tabla por firma (n.º, herramienta,
   primera línea, modelo) y la sesión más cara. **Difuminar** las carpetas con el nombre de usuario. Comentar 3–4 firmas
   según la locución.
6. **El fallo silencioso.** `omp render archivo//ticket005Review.jsonl --plain | tail -40`: «Approve…
   Aceptar». Y `sed -n 12p` del `informe.md` de la CI del 26.
7. **El caso.** `cat casos/revision-borde-cupon.json` (síntoma, origen, base, orden, flags, comprobaciones,
   afirmación); `cat comprobaciones/arbol-limpio.sh`.
8. **Calibrar el juez** en cámara: `./juez.sh … calibracion/bueno.md` → PASA; `… malo.md` → FALLA.
9. **(Diapositiva) Reproducir.** Desde cero (worktree en el commit + orden + otro `--model`) frente a desde un punto (Pi:
   `get_fork_messages` → `fork` corta antes; omp: `fork` incluye, `navigate_tree` vuelve antes). «El disco no se
   rebobina».
10. **RPC sin modelo**, sobre copias: `node rpc-bifurcar.mjs pi ` (lista y bifurca) y `… omp `
    (`navigate_tree` → `editorText`). Enseñar con `wc -l` que el original creció una línea (y por eso, copias).
11. **(Opcional, gasta) `/seance`** en omp, perfil demo: `/seance  --model deepseek/deepseek-flash`
    y «¿Qué entradas límite no comprobó esta revisión en totalConCupon?» [VERIFICAR antes].
12. **Tres tandas.** `./reproducir.sh casos/revision-borde-cupon.json 3` (control, Pro);
    `MODELO=deepseek/deepseek-flash ./reproducir.sh … 3`; `ARREGLO=arreglos/revisor-bordes.md ./reproducir.sh … 3`
    (Pro). Acelerar las esperas. Tras la segunda tanda, la comprobación del modelo:
    `jq -r 'select(.type=="message" and .message.role=="assistant") | .message.model' /tmp/csn/r27/*/sesion/*.jsonl | sort | uniq -c`.
13. **`./resumen-regresiones.sh`**: por tanda, pasa/falla de cada comprobación, tokens, coste, tiempo y modelo real.
14. **La batería.** `time ./regresiones.sh 3` con los dos casos → tabla y salida 0/1 según `UMBRAL`. Columna de
    infraestructura (error del proveedor, sin clave, `omp` con código distinto de 0 sin respuesta).
15. **Sin gastar:** `./comprobar-archivo.sh comprobaciones/sin-error.sh ~/.omp/profiles/demo/agent/sessions` → en
    cuántas sesiones del archivo se habría disparado.
16. Limpieza: `git -C ~/csn/tienda worktree prune`; `/tmp/csn/r27` se conserva hasta el montaje y luego se borra; las
    sesiones de los casos se quedan en `~/csn/regresiones/resultados/` (fuera de `/tmp`).

**Planos y diapositivas por capítulo:** 1 → captura del 26 (informe de CI con el borde, recortada) y figura nueva
«fallo → caso → batería»; 2 → diapositiva de las dos preguntas; 3 → terminal (pasos 2 y 4) y diapositiva del
manifiesto; 4 → terminal (5 y 6); 5 → terminal (7 y 8) y figura «comprobaciones de la más barata a la más cara»; 6 →
diapositiva de reproducir y terminal (10, 11); 7 → terminal (12, 13) y tabla de las tres tandas; 8 → terminal (14, 15);
9 → diapositiva de repaso. Reutilizable: figura de la puerta del 24 (`v24-puerta`) en el capítulo 2.

**Material nuevo para `CodigoSinSiesta/curso-pi-materiales`** (carpeta `regresiones/`, junto a `medir/`; MIT; en el
README, crédito a Decoding AI por las ideas, Apache-2.0, sin copiar su código):
- `minar.sh `: recorre JSONL de Pi y de omp; por sesión, errores de herramienta, paradas `error`/`aborted`,
  tokens y coste; agrupa por firma (herramienta + primera línea + modelo); solo lectura; tapa `$HOME` en la salida.
- `casos/revision-borde-cupon.json`: `{sintoma, origen: {sesion, fecha, modelo, harness}, base: "final",
  objetivo: "ticket-005", orden, harness: "omp", flags, comprobaciones: ["comprobaciones/arbol-limpio.sh",
  "comprobaciones/sin-error.sh", "comprobaciones/tope-coste.sh"], afirmacion, arreglado_en: null}`.
- `casos/ticket-005-desde-final.json`: implementar desde `rubrica-ticket-005` con Pi o omp; juez `verificar.sh
  ticket-005` (desde la etiqueta) + `~/csn/fuera/ticket-005-oculta.mjs`.
- `comprobaciones/*.sh` (cada una recibe la carpeta del worktree y la de la sesión, sale 0/1): `arbol-limpio.sh`,
  `sin-error.sh` (último `stopReason` del asistente y código de omp), `tope-coste.sh`.
- `juez.sh  `: `pi -p --no-tools --no-session --no-context-files --no-skills --no-extensions --model
  deepseek/deepseek-flash` con la afirmación y el texto por stdin; última línea `VEREDICTO: PASA|FALLA`.
- `calibracion/bueno.md` y `calibracion/malo.md` (sacados de los ficheros del 26; sin rutas con usuario).
- `arreglos/revisor-bordes.md`: la instrucción de entradas límite.
- `reproducir.sh  `: por repetición, worktree `--detach` en la base, manifiesto (`git rev-parse`, orden
  completa, `omp --version`/`pi --version`, fecha), `omp -p --mode json --model ${MODELO:-del caso} --session-dir
  /sesion --max-time … --max-cost … ${ARREGLO:+--append-system-prompt "$ARREGLO"}` y las comprobaciones.
- `regresiones.sh ` y `resumen-regresiones.sh`: como `orquestar.sh` / `resumen-orquestar.sh` (fila por ejecución,
  columna de infraestructura, pasó alguna / pasó todas por caso, `UMBRAL`, salida 0/1).
- `comprobar-archivo.sh  `: aplica una comprobación de código a sesiones ya grabadas.
- `rpc-bifurcar.mjs pi|omp `: el cliente RPC de la prueba (envía una orden y espera su respuesta por `id`,
  porque las respuestas llegan desordenadas: comprobado), sin `prompt`.
- README de la carpeta: «no abras nunca la sesión original: copia»; qué gasta y qué no.
- **No** hace falta rama nueva en la tienda ni prueba oculta nueva.

</details>

