---
title: "Vídeo 24 · Verificar de verdad"
description: "Definir antes qué significa «terminado» y comprobarlo con pruebas, rúbricas y revisores, para dejar atrás el «parece que funciona»."
ruta: "pi-oh-my-pi"
orden: 24
duracion: "25 min"
video: "24-verificar-de-verdad.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/24-verificar-de-verdad.es.vtt"
---

Definir antes qué significa «terminado» y comprobarlo con pruebas, rúbricas y revisores, para dejar atrás el «parece que funciona».

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Parece que funciona

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Hoy:** Que terminado no dependa de que el agente lo diga — Sacar el juicio de «hecho» fuera del agente.
- **Learn Harness Engineering · lección 9:** Cantar victoria antes de tiempo — Curso de WalkingLab, licencia MIT.
- **Harness Playbook · Can Bölük, autor de oh my pi:** Sin definir verificado, pruebas que no prueban — Vídeo 22: los dos textos coinciden en esto.
- **La solución:** Sacar el juicio de terminado fuera del agente — No pedirle al modelo que sea más objetivo.
- **El plan de hoy:** Definir (terminado, antes) → Rúbrica (y un script) → Hecho (y desmentido) → Puerta (Pi y oh my pi) → Lo que parece (verificación y no lo es)

### 2 · Definir antes qué es terminado

<p><button type="button" class="ir-a" data-t="160">▶ Ir a 2:40</button></p>

- *En la demo:* AGENTS.md · la definición de hecho del vídeo 6
- **El hueco:** Regla (mal entendida) → Código (con el error) → Prueba (con el mismo error) → npm test (pasa)
- **La definición de hecho se cumple:** Lo que el agente cree, no lo que tú querías — Eso es lo que comprueban sus pruebas.
- **Lección 10 · por qué la tercera:** Las unitarias no ven la frontera — Aíslan cada pieza: los fallos entre dos piezas se les escapan.
- **Hoy:** No se la pedimos: se la imponemos — Al agente.

### 3 · Una rúbrica para ticket-003

<p><button type="button" class="ir-a" data-t="309">▶ Ir a 5:09</button></p>

- **Rama verificar · antes de que ningún agente la toque:** Tres piezas — La rúbrica, la prueba de aceptación y verificar.sh.
- *En la demo:* rubricas/ticket-003.md · crédito y contrato
- *En la demo:* Cinco criterios automáticos, tres de juicio y el veredicto
- *En la demo:* aceptacion/ticket-003.mjs · fuera de test/
- **Como en el vídeo 18:** Un fallo en la frontera — Sobre qué importe se calcula el envío: lo que las pruebas unitarias no ven.
- *En la demo:* verificar.sh · los criterios automáticos
- **Lección 10 · y la experiencia de OpenAI:** Errores escritos para el agente — Que metan la reparación en su contexto.
- *En la demo:* La etiqueta rubrica-ticket-003 y el segundo commit
- *En la demo:* AGENTS.md · la nueva definición de hecho
- *En la demo:* ./verificar.sh ticket-003 · antes del trabajo

### 4 · El agente dice hecho

<p><button type="button" class="ir-a" data-t="514">▶ Ir a 8:34</button></p>

- *En la demo:* hecho-falso · ticket-003 en pasa con «24 pass»
- *En la demo:* npm test · 24 de 24
- *En la demo:* ./verificar.sh ticket-003 · la verificación lo desmiente
- *En la demo:* hecho-falso · ticket() y sus pruebas
- **Código y pruebas:** El mismo malentendido — Por eso coinciden.
- **Una aclaración honesta:** Pi con Flash lo hizo bien — Encontró verificar.sh y lo ejecutó. Por eso la rama hecho-falso está escrita a mano.
- **No sabemos con qué frecuencia un agente cae en esto:** Sí sabemos que nada lo impedía

### 5 · De instrucción a puerta, en Pi

<p><button type="button" class="ir-a" data-t="670">▶ Ir a 11:10</button></p>

- **Vídeo 8 · el evento tool_call:** Modelo (pide una herramienta) → tool_call (nuestro código) → Decide (si se ejecuta)
- *En la demo:* ~/csn/extensiones/puerta.ts
- *En la demo:* puerta.ts · el commit y el tiempo agotado
- *En la demo:* puerta.ts · compara el fichero y devuelve la salida
- **Learn Harness Engineering · lección 8:** El paso a pasa lo controla el harness — No el agente.
- *En la demo:* pi -e ~/csn/extensiones/puerta.ts
- *En la demo:* Pi marca ticket-003 como pasa
- *En la demo:* La puerta deshace el marcado
- *En la demo:* Flash arregla el código, no la verificación
- *En la demo:* Desde fuera · verificar.sh sale con 0
- *En la demo:* El resumen de Flash
- **No le dijimos que había un error:** Se lo dijo la verificación — En el momento en que intentaba dar el trabajo por bueno.
- *En la demo:* La aceptación es una ruta protegida
- **De regla escrita a barrera:** No debería poder mover la portería — No es que el agente sea malo.

### 6 · La misma puerta en oh my pi

<p><button type="button" class="ir-a" data-t="947">▶ Ir a 15:47</button></p>

- *En terminal:* Un solo fichero, sin imports del paquete (más abajo, en «Código y comandos»)
- **La opción, no la carpeta de hooks:** Sin carpeta .omp — La tienda sigue como la dejamos en el vídeo 23.
- *En la demo:* oh my pi · omp --hook ~/csn/extensiones/puerta.ts
- **Rama verificar, sin la función ticket:** «Trabaja en la siguiente funcionalidad » — Lo mismo que en el vídeo 23.
- *En la demo:* oh my pi verifica por su cuenta
- *En la demo:* Desde fuera · verificar.sh sale con 0
- **Por eso solo 0 o 1, y falla con un id que no existe:** Un error de tecleo no da verde — No puede parar el bucle con un falso verde.
- **Harness Playbook:** La verificación, parte de la interfaz — El agente la usa, pero no la redefine.

### 7 · Lo que no se automatiza: el revisor

<p><button type="button" class="ir-a" data-t="1118">▶ Ir a 18:38</button></p>

- *En la demo:* Los criterios de juicio de la rúbrica
- *En la demo:* El encargo al reviewer
- *En la demo:* J1=2, J2=2, J3=2 · Aceptar
- **En su razonamiento, antes de lanzarlo:** «Probablemente aceptar » — Y luego se corrige: no debería sesgarlo.
- **Anthropic · su evaluador, al principio:** Veía el problema y aprobaba igual — Se convencía de que no era grave.
- **Calibrar al evaluador:** Lee (sus registros) → Busca (dónde se separa de una persona) → Ajusta (sus instrucciones)
- **Vídeo 14 · una regla más en WATCHDOG.md:** Avisa si pasa a «pasa» sin verificar.sh
- **El reparto:** La opinión no sustituye a la ejecución

### 8 · Auto-QA: quejas sobre el harness

<p><button type="button" class="ir-a" data-t="1287">▶ Ir a 21:27</button></p>

- **omp grievances:** Lista las quejas, las limpia o las envía

### 9 · Límites, repaso y cierre

<p><button type="button" class="ir-a" data-t="1360">▶ Ir a 22:40</button></p>

- *En terminal:* Límite 2 · el hook de pre-commit (más abajo, en «Código y comandos»)
- **Límite 3:** Tan buena como la rúbrica — Cada fallo que se cuele, un criterio nuevo: convertir la revisión en comprobaciones.
- **Límite 5:** Lo que se optimiza se puede engañar — Goodhart, en el próximo vídeo.
- **Vídeo 25:** Bucles, grafos y el coste de orquestar — Cuándo compensa un bucle, un plan o varios agentes, y cuándo no.
- **Lo que todo bucle necesita:** Una condición de parada que no depende del agente

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Un solo fichero, sin imports del paquete

```text
pi  -e     ~/csn/extensiones/puerta.ts
$ omp --hook ~/csn/extensiones/puerta.ts
```

- `-e`: Pi · como extensión
- `--hook`: oh my pi · como hook (vídeo 19)

### Límite 2 · el hook de pre-commit

```text
git commit --no-verify
```

- `--no-verify`: Se salta el hook: bloquea ese patrón

## Fuentes

- Pi 1.0.4 instalado (`$(npm root -g)/@earendil-works/pi-coding-agent/`): `CHANGELOG.md` 1.0.2–1.0.4 (nada que afecte
  a eventos de extensiones); `docs/extensions.md` (`tool_call` puede bloquear o mutar la entrada; `tool_result`
  compone y puede cambiar `content`/`isError`; un fallo del handler de `tool_call` bloquea como *fail-safe*;
  `agent_before_settle` «final actionable boundary… can append entries and request one continuation», con aviso de
  bucles); `dist/core/extensions/types.d.ts` (`ToolCallEventResult {block, reason, terminate}`,
  `ToolResultEventResult {content, isError…}`, `BoundaryResult {entries, continue}`, `pi.exec(command, args, {cwd,
  timeout})` → `{stdout, stderr, code, killed}`; entrada de `edit`: `path` + `edits[].oldText/newText`; de `write`:
  `path` + `content`); `examples/extensions/protected-paths.ts`.
- oh my pi 18.6.1 (`omp read omp://…`): `hooks.md` (los hooks se cargan con el runner de extensiones; `--hook` es alias
  de `--extension`; descubrimiento solo en `.omp/hooks/pre|post/`; `tool_call` puede devolver `block`/`reason`;
  `tool_result` puede cambiar `content`/`isError`; «`edit` event input can also contain derived `path`/`paths`
  fields»; `pi.exec` disponible); `extensions.md` (contexto con `cwd`, `ui`, `hasUI`; los handlers se vuelven a
  enlazar en cada subagente, y las herramientas del advisor también pasan por `tool_call`/`tool_result`);
  `skills/examples/safety-hook/README.md` («The `reason` text is what the LLM receives as the tool error»; el ejemplo
  avisa de que una regex no es una frontera de seguridad completa); `advisor-watchdog.md` («does not approve actions»).
  `omp grievances --help` (18.6.1, solo ayuda: `list|clean|push`). **No se ejecutó `omp grievances` sin `--help`**:
  según las notas del 18, listar crea `~/.omp/autoqa.db`.
- Web: https://omp.sh/docs/review (vía borrador 18: «Correct means no correctness bugs or blockers were established»).
- Guiones: 01 (terminado: «la evidencia que cuenta es la prueba que se ejecuta, no lo que el agente cuenta de sí
  mismo»; feedback como quinta pieza), 06 (terminado: «Hecho significa» de la tienda, plantilla de WalkingLab), 08
  (terminado: `tool_call`, `block`, rutas protegidas, el modelo busca otro camino por bash), 10 (`scripts/revisar.sh`:
  el código de salida lo ponen las pruebas, no el veredicto del modelo), 14 (advisor: `WATCHDOG.md` con la regla de
  ejecutar los tests antes de terminar; nit/concern/blocker; «no aprueba ni bloquea»), 15 (`/loop N --until '<cmd>'`:
  omp ejecuta el comando tras cada vuelta; 0 para, 1 sigue, otro código apaga el bucle), 16 (agente `reviewer`), 18
  (`/review` sin garantía de encontrar el fallo sembrado de la base del envío; Auto-QA aclarado; «volveremos… en el
  vídeo veinticuatro»), 19 (hooks en `.omp/hooks/pre/`, sin imports; dos capas: hook + `bash.patterns`; el hueco de
  `eval`), 21 (script de revisión con omp en CI), 22 (los dos textos piden «definir antes qué significa terminado»), 23
  (rama `andamiaje`, `funcionalidades.json`, regla «no cambiar la verificación para que pase», «es una instrucción, no
  una puerta… lo veremos en el próximo vídeo»).
- Tienda (`~/csn/tienda`, leída): `master` con `AGENTS.md` («Hecho significa»: prueba, `npm test`, resumen),
  `src/carrito.js` (`totalConCupon`, `totalConEnvio`: envío y umbral sobre el total con cupón **sin IVA**, IVA solo a
  los productos), `src/envio.js` (4,95 €, gratis desde 40 €), `"test": "node --test"`. La rama `andamiaje` **todavía no
  existe** (el 23 no está grabado).
- Documentación oficial de Pi: [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md)

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Parece que funciona**

Al final del vídeo veintitrés quedó algo pendiente. Nuestro andamiaje decía que una funcionalidad solo pasa cuando la verificación se ha ejecutado y la evidencia está anotada. Pero quien ejecutaba esa verificación, y quien escribía la evidencia, era el propio agente. Era una instrucción, no una puerta. Hoy vamos a cerrar ese hueco: que terminado no dependa de que el agente diga que ha terminado.

Ya lo viste en el vídeo uno. El resumen final de Pi daba un total que no era el que salía al ejecutar el código. De ahí sacamos una regla para todo el curso: la evidencia que cuenta es la prueba que se ejecuta, no lo que el agente cuenta de sí mismo. Hoy le damos método a esa regla.

Learn Harness Engineering, el curso de WalkingLab con licencia MIT que nos acompaña en este bloque, le dedica su novena lección: evitar que el agente cante victoria antes de tiempo. El patrón siempre es parecido. El código tiene buena pinta, las pruebas que ha escrito el agente pasan, y eso se toma como prueba de que la funcionalidad está terminada. Parece que funciona. Pero nadie ha comprobado lo que de verdad importaba.

¿Por qué pasa? La lección cita un trabajo de Guo y otros, de dos mil diecisiete: las redes neuronales suelen estar más seguras de sí mismas de lo que aciertan. Era sobre clasificadores, así que tómalo como analogía. Más directo es lo que cuenta Anthropic en un artículo sobre harnesses para aplicaciones largas: cuando le pides a un agente que evalúe su propio trabajo, tiende a valorarlo demasiado bien.

Y el Harness Playbook de Can Bölük, el autor de oh my pi, lo dice desde su lado: si no defines qué significa verificado, el agente se inventa pruebas que no prueban nada. En el vídeo veintidós vimos que los dos textos coinciden en esto. La solución no es pedirle al modelo que sea más objetivo. Es sacar el juicio de terminado fuera del agente.

El plan de hoy. Primero, cómo se define terminado antes de empezar. Después, una rúbrica para la tercera funcionalidad de la tienda, con un script que la comprueba. Veremos un caso en que el agente dice hecho y la verificación lo desmiente. Convertiremos la regla en una puerta, en Pi y en oh my pi. Y pondremos en su sitio lo que parece verificación y no lo es: el revisor, el advisor, barra review y Auto QA.

**2 · Definir antes qué es terminado**

Recuerda la definición de hecho del AGENTS punto md de la tienda, la del vídeo seis. Tres líneas: has añadido o actualizado la prueba del cambio, has ejecutado npm test y pasa, y has resumido qué cambió y cómo lo verificaste. Para empezar está bien. Pero fíjate en quién hace cada cosa. El agente escribe la prueba, el agente la ejecuta y el agente cuenta el resultado.

Ese es el hueco. Si el agente ha entendido mal una regla del negocio, escribirá el código con ese error y escribirá la prueba con el mismo error. Las dos coinciden, npm test pasa, y la definición de hecho se cumple. Las pruebas comprueban que el código hace lo que el agente cree, no lo que tú querías.

Learn Harness Engineering propone tres capas de terminación. La primera es estática: que el código se pueda cargar, el linter, los tipos. La segunda es de ejecución: las pruebas y el arranque. La tercera es de sistema: el recorrido completo, como lo haría un usuario. Cada capa es más cara y ve más. Y la décima lección explica por qué hace falta la tercera: las pruebas unitarias aíslan cada pieza, así que no ven los fallos que aparecen en la frontera entre dos piezas.

La undécima lección añade la otra mitad: escribirlo antes. Un contrato, con el alcance, cómo se va a comprobar y qué queda fuera, y una rúbrica, una lista de criterios puntuados para que dos evaluadores lleguen a la misma conclusión. La biblioteca de WalkingLab trae una plantilla con seis criterios, puntuados de cero a dos, y un veredicto: aceptar, revisar o bloquear.

Nosotros partimos de esa plantilla, con copyright de WalkingLab de dos mil veinticinco y licencia MIT, y la dividimos en dos. Hay criterios que puede comprobar un programa: que pasan las pruebas, que el total coincide con el que calcula la tienda, que hay evidencia anotada. Y hay criterios de juicio: si el cambio se ha quedado en su alcance, si las pruebas tienen sentido, si la siguiente sesión lo entenderá. Los primeros los comprueba un script. Los segundos, un revisor.

Y dos reglas sobre quién escribe qué. La rúbrica la escribes tú, o un agente distinto, antes de que empiece el trabajo, y se commitea. Y quien hace el trabajo no toca la verificación. Es la regla del vídeo veintitrés, no cambiar la verificación para que pase. Pero hoy no se la vamos a pedir al agente: se la vamos a imponer.

**3 · Una rúbrica para ticket tres**

Vamos a la tienda. Partimos de cómo quedó la rama andamiaje en el vídeo veintitrés: formatear euros y línea de ticket pasan, y la siguiente es ticket cero cero tres, la función que monta el texto completo con las líneas, el envío y el total. Creamos una rama nueva, verificar, y antes de que ningún agente la toque, añadimos tres piezas.

La primera es la rúbrica, en la carpeta rúbricas. Arriba, el crédito a WalkingLab y el contrato. Alcance: ticket punto js y sus pruebas. Fuera de alcance: el carrito, el envío y las otras funcionalidades. Después, cinco criterios automáticos. Las tres capas: que el código se carga, que npm test pasa y una prueba de aceptación. Y dos más: que ninguna funcionalidad pasa sin evidencias, y que nadie ha tocado la verificación. Al final, tres criterios de juicio, de cero a dos, y el veredicto.

La prueba de aceptación es la pieza clave, y la hemos escrito nosotros. Vive en su propia carpeta, aceptación, fuera de test, así que npm test no la ejecuta. Monta un pedido concreto: una mochila de treinta euros y tres libretas de cuatro, con un cupón del diez por ciento. Y exige que el total que imprime el ticket sea exactamente el que calcula total con envío, la función de la tienda, escrito con formatear euros.

¿Por qué ese pedido? Porque está justo en la frontera. Sin cupón son cuarenta y dos euros, por encima del umbral de envío gratis. Con el cupón se queda en treinta y siete con ochenta, por debajo. La tienda calcula el envío sobre el total con cupón y sin IVA, así que ese pedido paga envío. Es la misma familia de fallo que sembramos en el vídeo dieciocho: sobre qué importe se calcula el envío. Un fallo en la frontera entre dos piezas, justo lo que las pruebas unitarias no ven.

La segunda pieza es verificar punto sh, el script que comprueba los criterios automáticos. Recibe el identificador de una funcionalidad o, si no se lo das, revisa las que ya están en pasa. Ejecuta las tres capas, comprueba que ninguna funcionalidad pasa sin evidencias, y con git diff, que la rúbrica, la aceptación y el propio script siguen igual que en el commit etiquetado. Si el identificador no existe, falla. Y solo sale con cero o con uno. Enseguida verás por qué eso importa.

Los mensajes de error los escribimos para el agente. La décima lección propone que digan qué falla, por qué y cómo arreglarlo, y cita la experiencia de OpenAI, que escribe sus mensajes de error para meter la reparación en el contexto del agente. Así que cada fallo imprime tres líneas: error, por qué y cómo. El por qué cita la regla de la tienda. El cómo apunta a la función que hay que reutilizar.

Lo commiteamos y lo etiquetamos. Después, en un segundo commit, cambiamos AGENTS punto md. La definición de hecho ya no dice que pase npm test. Dice que una funcionalidad pasa solo si verificar punto sh sale con cero, que la evidencia es su salida, y que la rúbrica, la aceptación y el script no se tocan. Y antes de trabajar, ejecutamos el script nosotros. Sale en rojo, como debe: la prueba de aceptación no puede importar la función ticket, porque todavía no existe. Una rúbrica que falla antes del trabajo demuestra que comprueba algo.

**4 · El agente dice hecho**

Ahora el caso que da título a este capítulo. Fuera de cámara hemos preparado otra rama, hecho falso, que sale del primer commit, cuando AGENTS punto md todavía decía que hecho es que pase npm test. La hemos escrito nosotros, imitando a un agente que sigue esa definición al pie de la letra. Mira sus dos últimos commits: la función ticket con sus pruebas, y después ticket cero cero tres marcada como pasa, con su evidencia: npm test, veinticuatro de veinticuatro. El progreso la da por terminada.

Lo comprobamos sin ningún agente. Ejecutamos npm test: veinticuatro pruebas, todas en verde. Todo lo que pedía la definición del vídeo seis se cumple. Ahora, verificar punto sh. La primera capa pasa, la segunda también. La tercera, no. La prueba de aceptación dice que el ticket termina en cuarenta y cinco con setenta y cuatro, y que el total de la tienda es cincuenta con sesenta y nueve. Por qué: el envío se calcula sobre el total con cupón. Cómo: usa total con envío en lugar de recalcularlo. Y el script sale con uno.

Leemos el código para entender qué ha pasado. La función calcula el envío sobre el subtotal, antes del cupón. Con cuarenta y dos euros, el envío sale gratis, y el ticket se ahorra cuatro con noventa y cinco que la tienda sí cobra. Y las pruebas que acompañan al código usan un carrito de veinte euros y otro de sesenta. En los dos casos el envío es el mismo, se calcule como se calcule. Código y pruebas comparten el mismo malentendido. Por eso coinciden.

Nada de esto es mentira: las pruebas pasan de verdad. El problema es qué significaba pasa. Con la definición del vídeo seis, la funcionalidad estaba terminada; con la rúbrica, no. Por eso la verificación tiene que estar escrita antes, y por otro.

Una aclaración honesta. Antes de escribir esa rama, le pedimos a Pi, con DeepSeek Flash, la misma funcionalidad sobre el mismo commit, y lo hizo bien: encontró verificar punto sh y lo ejecutó. Por eso la rama la hemos escrito a mano. No sabemos con qué frecuencia un agente cae en este error; sí sabemos que nada lo impedía.

Y ahí está el punto. Si el agente lee el AGENTS punto md nuevo y ejecuta verificar antes de marcar, verá el rojo en su propia sesión y lo arreglará. Puede pasar, y sería lo correcto. Pero que pueda pasar no es lo mismo que esté garantizado. Mientras dependa de que el agente lo ejecute, sigue siendo una instrucción. Vamos a convertirla en una puerta.

**5 · De instrucción a puerta, en Pi**

En el vídeo ocho escribimos una extensión de permisos con el evento tool call: cada vez que el modelo pide una herramienta, nuestro código decide si se ejecuta. En el veintitrés dijimos que una puerta de verdad para el estado pasa sería algo así. La hemos escrito: puerta punto ts, en el repositorio de extensiones del curso, fuera de la tienda.

Hace tres cosas. Primera: si el modelo intenta editar o escribir la rúbrica, la prueba de aceptación o verificar punto sh, lo bloquea sin preguntar. Segunda: si edita funcionalidades punto json, compara el fichero antes y después, con el evento tool result. Si ha aparecido una funcionalidad nueva en pasa, ejecuta verificar punto sh por su cuenta, con pi punto exec. Si falla, devuelve el fichero a como estaba y marca el resultado de la herramienta como error.

Tercera: antes de un git commit por bash, comprueba que todo lo que ya está en pasa sigue pasando, y si no, lo bloquea. El trabajo a medias se puede seguir commiteando, como pedía la rutina de salida del vídeo veintitrés. Y un detalle que descubrimos al probarla: si el script se cuelga y se agota el tiempo, Pi no devuelve un código de error. La puerta lo trata como un fallo, porque una verificación que no termina no ha pasado.

Compara el fichero antes y después, en lugar de leer la edición, porque Pi y oh my pi describen una edición de forma distinta, pero el fichero en disco es el mismo. Y el motivo del bloqueo es la salida del script, que el modelo recibe como resultado de la herramienta. No es una ventana para ti, es feedback para el agente. Un bloqueo que solo dice no deja al modelo adivinando; uno que dice qué regla rompe y qué función usar le da el siguiente paso.

Y un detalle de diseño. La extensión no confía en lo que el agente diga que ha ejecutado. No lee su resumen ni busca en la conversación una salida de npm test. Ejecuta la verificación ella misma, en el momento de marcar. Es lo que pide la octava lección de Learn Harness Engineering: el paso a pasa lo controla el harness, no el agente.

La demo. Partimos del commit anterior al marcado en la rama hecho falso: el código con el error, sus pruebas en verde y ticket cero cero tres todavía en curso. Ahí AGENTS punto md ni siquiera nombra la rúbrica. A la puerta le da igual. Arrancamos Pi con guion e y la ruta de puerta punto ts. Como barra extensions no enseña lo que se carga así, la puerta se anuncia al arrancar: activa, pasa y commit pasan por verificar.

Le decimos: las pruebas pasan, marca ticket cero cero tres como pasa con la evidencia de npm test. El modelo edita funcionalidades punto json. La edición se ejecuta, la puerta ejecuta verificar y la deshace. En pantalla aparece el aviso; en el resultado de la herramienta, el error de la aceptación con su por qué y su cómo, y una última línea: arregla el código, no la verificación.

Y lo que hace Flash después es justo lo que queríamos. Lee la prueba de aceptación, entiende que el envío se calculaba sin el cupón, cambia la función para usar total con envío, añade una prueba de regresión con el pedido de la frontera y vuelve a marcar. Esta vez el script sale con cero y el marcado se queda. Hace tres commits, y la puerta comprueba el último antes de dejarlo pasar.

Su resumen lo dice mejor que nosotros: npm test pasaba, y aun así ticket cero cero tres no estaba correcto. Fíjate en que no le hemos dicho que había un error. Se lo ha dicho la verificación, en el momento en que intentaba dar el trabajo por bueno.

Ahora probamos la otra mitad. Le pedimos que añada al principio de la prueba de aceptación un comentario con la fecha de hoy. Es un cambio inofensivo, y el modelo llega a razonar que lo hará avisando. La edición se bloquea sin diálogo, por ruta protegida, y el modelo nos contesta que no puede: quien implementa no toca la aceptación. Ya no es una regla escrita en AGENTS punto md, sino una barrera. No es que el agente sea malo; es que no debería poder mover la portería.

Pi trae además un evento pensado para el final, agent before settle, justo antes de que el agente dé por cerrado su trabajo. Puede añadir un mensaje y pedir una vuelta más. En oh my pi el equivalente es session stop, que puede negarse a dejar terminar al agente, con un máximo de ocho continuaciones. Con cualquiera de los dos podrías ejecutar la verificación cada vez que el agente dice que ha terminado. Hoy lo dejamos en la diapositiva.

**6 · La misma puerta en oh my pi**

Como vimos en el diecinueve, en oh my pi un hook es un módulo con la misma forma que una extensión de Pi. Por eso puerta punto ts no importa nada del paquete de Pi: el mismo fichero se carga en Pi con guion e y en oh my pi con guion guion hook. Usamos la opción, y no la carpeta de hooks del proyecto, porque en el vídeo veintitrés dejamos la tienda sin carpeta punto omp, y queremos que siga así.

La demo en oh my pi es la que no hemos preparado. Volvemos a la rama verificar, sin la función ticket, y abrimos oh my pi con el perfil demo, DeepSeek V cuatro Pro y la puerta cargada, que se anuncia igual que en Pi. Y le decimos lo mismo que en el vídeo veintitrés: trabaja en la siguiente funcionalidad.

Podía pasar de dos formas: que se fiara de sus pruebas y la puerta tuviera que deshacer el marcado, o que verificara por su cuenta. Pasó lo segundo. Lee la rúbrica y la prueba de aceptación, escribe la función con total con envío, y ejecuta verificar punto sh ticket cero cero tres. Como la salida no enseña el código, lo vuelve a ejecutar pidiendo el código de salida: cero. Solo entonces marca la funcionalidad y anota como evidencia la salida del script.

La puerta no ha tenido que hacer nada, y eso también es un buen resultado. Lo que importa es lo que no ha pasado: que ticket cero cero tres quede en pasa con la aceptación en rojo. Con un agente que verifica, la puerta es una red. Con uno que no lo hace, es la diferencia entre dar por bueno un error y no darlo.

Hay otra forma de que sea el harness quien comprueba, y ya la conoces. En el vídeo quince usamos barra loop con guion guion until. oh my pi reenvía el encargo y, después de cada vuelta, ejecuta él el comando. Si sale con cero, para. Si sale con uno, sigue. Con cualquier otro código, el bucle se apaga. Por eso el script solo sale con cero o con uno, y por eso falla si le das un identificador que no existe: un error de tecleo no puede parar el bucle con un falso verde.

Y vale fuera del agente. En los scripts de integración continua de los vídeos diez y veintiuno, el código de salida lo ponían las pruebas: basta con cambiar npm test por verificar punto sh. Y si quieres una puerta que no dependa de ningún agente, un hook de pre commit de git hace lo mismo con cualquiera que haga commit, persona o modelo.

Fíjate en lo que tenemos: un solo script y cuatro sitios. Lo ejecuta la puerta, en Pi y en oh my pi; la condición de barra loop; la integración continua; y tú, a mano. La verificación se define una vez y vive en el repositorio, versionada, con su rúbrica al lado. Es lo que el Playbook llama hacer de la verificación parte de la interfaz: el agente la usa, pero no la redefine.

**7 · Lo que no se automatiza: el revisor**

Quedan los criterios de juicio: si el cambio se ha quedado en su alcance, si las pruebas tienen sentido y si la siguiente sesión lo entenderá. Ningún script lo decide bien. Aquí entra un revisor, con dos condiciones: que no sea quien hizo el trabajo, y que puntúe con la rúbrica, no con su intuición.

En la misma sesión de oh my pi le pedimos que use el agente reviewer, el del vídeo dieciséis, para puntuar los tres criterios de juicio, de cero a dos, con fichero y línea como evidencia, y que dé un veredicto sin modificar nada. El agente principal copia en el encargo los criterios y el contrato, y lanza al revisor.

El revisor tarda un minuto y medio y devuelve una tabla. Alcance, dos: los cambios se quedan en ticket punto js y sus pruebas. Pruebas con sentido, dos: cubren los dos lados del umbral, con y sin cupón, con valores esperados escritos a mano. Traspaso, dos: reutiliza total con envío y formatear euros. Veredicto: aceptar. Y cada puntuación lleva sus líneas.

Pero mira un detalle de la sesión. Antes de lanzar al revisor, el agente principal escribe en su razonamiento que el veredicto probablemente será aceptar, y luego se corrige: no debería sesgarlo. El revisor no ve ese razonamiento, pero sí el encargo que le escribe quien hizo el trabajo. Por eso un revisor es otra opinión, aunque venga con tabla.

Frente a barra review, del vídeo dieciocho, la diferencia es la lista. Barra review busca fallos sin preguntas previas, y su documentación aclara que correcto significa que no se ha establecido ningún fallo, no que funcione. Con la rúbrica, el revisor responde a preguntas concretas escritas antes de empezar.

Y el revisor también se equivoca. Anthropic cuenta que su evaluador, al principio, encontraba problemas reales, luego se convencía de que no eran graves y aprobaba el trabajo igualmente. Lo arreglaron leyendo sus registros, buscando dónde su juicio se separaba del de una persona y ajustando sus instrucciones. A eso se le llama calibrar al evaluador. Un revisor sin calibrar es otra opinión, con buena prosa.

¿Y el advisor del vídeo catorce? A su WATCHDOG punto md puedes añadir una regla: avisa si una funcionalidad pasa a pasa sin la salida de verificar punto sh. Avisa mientras se trabaja, pero no aprueba ni bloquea nada. Es una segunda opinión, no una puerta.

Así queda el reparto. El script decide lo que se puede comprobar. La puerta impide marcar o commitear sin él. El revisor puntúa lo que necesita juicio, con la rúbrica en la mano. El advisor vigila mientras se trabaja. Y el veredicto final lo firmas tú. Ninguna pieza de opinión sustituye a una de ejecución.

**8 · Auto QA: quejas sobre el harness**

El temario de este vídeo incluye Auto QA, y conviene ponerlo en su sitio, porque el nombre engaña. Como vimos en el dieciocho, Auto QA no revisa tu código. Es un buzón donde el modelo deja quejas sobre las herramientas de oh my pi cuando no se comportan como dicen. O eme pe grievances las lista, las limpia o las envía.

Todo lo que hemos hecho hoy comprueba tu trabajo. Auto QA es feedback sobre el harness, y quien opina es el modelo. Aun así, puede darte una pista: si una herramienta de edición falla a medias, tu verificación puede fallar por culpa del harness, no de tu código. Es la primera lección de Learn Harness Engineering: antes de cambiar de modelo, atribuye el fallo a una capa. Pero no lo uses para dar nada por terminado: no comprueba ningún criterio ni sabe nada de tu rúbrica.

Y recuerda sus condiciones. Viene activado, no guarda nada hasta que das tu consentimiento y, si aceptas, cada queja se envía a un servidor de oh my pi. En nuestro perfil demo lo tenemos denegado, y hoy no lo abrimos. Si no quieres que salga nada de tu máquina, deja el consentimiento denegado o apaga dev punto auto QA.

**9 · Límites, repaso y cierre**

Los límites, sin rodeos. El primero: la puerta solo ve lo que sabe mirar, edit, write y los commits por bash. Si el modelo escribe funcionalidades punto json con sed desde bash, no lo reconoce como un marcado. Hace falta la segunda capa de los vídeos ocho y diecinueve, que pide aprobación para el bash fuera de una lista. Y oh my pi tiene más herramientas que escriben, como vimos con el hueco de eval.

El segundo: el hook de pre commit de git se salta con guion guion no verify, y un agente lo sabe. Si lo usas, bloquea ese patrón. El tercero: la verificación es tan buena como la rúbrica. Si la prueba de aceptación no cubre un caso, el script lo dejará pasar con la misma seguridad. Las rúbricas también se revisan, y cada fallo que se cuele es un criterio nuevo. La décima lección lo llama convertir los comentarios de revisión en comprobaciones.

El cuarto: verificar cuesta. Cada marcado y cada commit ejecutan el script. El nuestro tarda un segundo, pero con una batería grande son minutos. Mantén rápida la parte que se ejecuta siempre y deja la lenta para la integración continua. Y el quinto: cualquier medida que se optimice se puede engañar. De medir lo que no importa, y de la ley de Goodhart, hablaremos en el próximo vídeo.

Repasemos. Terminado se define antes, por escrito, y no lo decide quien hace el trabajo. La rúbrica separa lo que comprueba un script de lo que necesita juicio. Una prueba de aceptación escrita por otro ve los fallos que el código y sus pruebas comparten. La puerta, en Pi o en oh my pi, ejecuta la verificación y protege lo que verifica. El revisor, el advisor y barra review opinan. Y Auto QA no comprueba tu código.

La práctica: en un proyecto tuyo, elige la siguiente funcionalidad y escribe su rúbrica antes de empezar, partiendo de la plantilla de WalkingLab y citando su licencia. Incluye una prueba de aceptación que cruce dos piezas. Escribe un script que solo salga con cero o con uno, y comprueba que falla antes del trabajo. Después deja trabajar al agente con la puerta cargada, y apunta cuántas veces lo paró y por qué.

En el próximo vídeo, bucles, grafos y el coste de orquestar. Cuándo compensa un bucle, un plan o varios agentes, y cuándo no. Hoy has construido la pieza que todo bucle necesita: una condición de parada que no depende de lo que diga el agente. Nos vemos allí.

</details>

