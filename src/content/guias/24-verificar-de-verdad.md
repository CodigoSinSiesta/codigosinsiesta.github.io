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

- En el vídeo 23, el cambio a `pasa` lo ejecutaba y lo anotaba el propio agente: era una instrucción, no una puerta. Hoy cierras ese hueco, para que «terminado» no dependa de que el agente diga que ha terminado.
- Lección 9 de Learn Harness Engineering: el agente canta victoria antes de tiempo. El código tiene buena pinta, sus propias pruebas pasan y eso se toma por terminado, pero nadie ha comprobado lo que importaba.
- Por qué pasa: la lección cita a Guo y otros (2017), que vieron que las redes neuronales están más seguras de lo que aciertan (era sobre clasificadores: tómalo como analogía). Y Anthropic cuenta que un agente que evalúa su propio trabajo tiende a valorarlo demasiado bien. El Harness Playbook coincide: sin definir «verificado», el agente se inventa pruebas que no prueban nada.
- La solución no es pedirle al modelo que sea más objetivo, sino sacar el juicio de «terminado» fuera del agente. El plan: definir antes qué es terminado, escribir una rúbrica con un script que la comprueba, ver un «hecho» desmentido, convertir la regla en una puerta en Pi y en oh my pi, y poner en su sitio lo que parece verificación y no lo es.

### 2 · Definir antes qué es terminado

<p><button type="button" class="ir-a" data-t="160">▶ Ir a 2:40</button></p>

- La definición de hecho del vídeo 6 (prueba añadida, `npm test` pasa, resumen) tiene un hueco: el agente escribe la prueba, la ejecuta y cuenta el resultado. Si entiende mal una regla de negocio, el código y la prueba llevan el mismo error, coinciden y `npm test` pasa. Las pruebas comprueban lo que el agente cree, no lo que tú querías.
- Learn Harness Engineering propone tres capas de terminación, cada una más cara y que ve más:
  1. **Estática:** el código se carga, linter, tipos.
  2. **De ejecución:** las pruebas y el arranque.
  3. **De sistema:** el recorrido completo, como un usuario. La lección 10 explica por qué hace falta: las pruebas unitarias aíslan cada pieza y no ven los fallos en la frontera entre dos.
- Lección 11: escríbelo antes. Un contrato (alcance, cómo se comprueba y qué queda fuera) y una rúbrica, una lista de criterios puntuados para que dos evaluadores lleguen a lo mismo. La plantilla de WalkingLab trae seis criterios de 0 a 2 y un veredicto (aceptar, revisar o bloquear); aquí la separamos en criterios automáticos, que comprueba un script, y criterios de juicio, que puntúa un revisor.
- Dos reglas: la rúbrica la escribes tú, o un agente distinto, antes del trabajo, y se commitea; y quien hace el trabajo no toca la verificación. En el vídeo 23 se la pedíamos al agente; hoy se la imponemos.

### 3 · Una rúbrica para ticket-003

<p><button type="button" class="ir-a" data-t="309">▶ Ir a 5:09</button></p>

- En la rama `verificar`, antes de que ningún agente la toque, añadimos tres piezas: la rúbrica (`rubricas/ticket-003.md`), la prueba de aceptación (`aceptacion/ticket-003.mjs`) y `verificar.sh`.
- La rúbrica lleva el crédito a WalkingLab, el contrato (alcance: `ticket.js` y sus pruebas; fuera: carrito, envío y las demás funcionalidades), cinco criterios automáticos, tres de juicio (J1–J3, de 0 a 2) y el veredicto. Los automáticos:
  - **A1:** el código se carga (capa estática).
  - **A2:** `npm test` pasa (ejecución).
  - **A3:** pasa la prueba de aceptación (sistema).
  - **A4:** ninguna funcionalidad está en `pasa` sin evidencias.
  - **A5:** nadie ha tocado la verificación: la rúbrica, la aceptación y `verificar.sh` siguen como en el commit etiquetado `rubrica-ticket-003`.
- La prueba de aceptación la escribe otro y vive fuera de `test/`, así que `npm test` no la ejecuta. Monta un pedido en la frontera: mochila de 30 € y tres libretas de 4 € con un cupón del 10 %. Sin cupón son 42 € (envío gratis); con cupón, 37,80 €, y la tienda calcula el envío sobre el total con cupón, así que paga envío. Exige que el total del ticket sea el de `totalConEnvio`, escrito con `formatearEuros`. Es la familia de fallo del vídeo 18.
- `verificar.sh` recibe un identificador (o, sin él, revisa las que ya están en `pasa`), falla si el identificador no existe y solo sale con 0 o con 1. Cada fallo imprime tres líneas escritas para el agente (error, por qué y cómo), como propone la lección 10: que el mensaje meta la reparación en su contexto.
- AGENTS.md cambia su definición de hecho: una funcionalidad pasa solo si `verificar.sh` sale con 0, la evidencia es su salida y la rúbrica, la aceptación y el script no se tocan. Antes del trabajo, el script sale en rojo, porque la función `ticket` aún no existe: una rúbrica que falla antes del trabajo demuestra que comprueba algo.

### 4 · El agente dice hecho

<p><button type="button" class="ir-a" data-t="514">▶ Ir a 8:34</button></p>

- La rama `hecho-falso`, escrita a mano, imita a un agente que sigue la definición antigua al pie de la letra: `ticket-003` en `pasa` con «npm test, 24 de 24» como evidencia. Las 24 pruebas pasan de verdad.
- `verificar.sh ticket-003` lo desmiente en la tercera capa: el ticket dice 45,74 € y la tienda, 50,69 €. Por qué: el envío se calcula sobre el total con cupón. Cómo: usa `totalConEnvio`. Sale con 1.
- La función calculaba el envío sobre el subtotal antes del cupón y se ahorraba los 4,95 € que la tienda cobra. Sus pruebas usaban carritos de 20 € y 60 €, donde el envío sale igual se calcule como se calcule. Código y pruebas comparten el malentendido; por eso coinciden. La verificación tiene que estar escrita antes, y por otro.
- Pi con DeepSeek Flash, con el mismo encargo, lo hizo bien: encontró `verificar.sh` y lo ejecutó. No sabemos con qué frecuencia un agente cae en esto; sí que nada lo impedía. Mientras dependa de que el agente ejecute el script, sigue siendo una instrucción.

### 5 · De instrucción a puerta, en Pi

<p><button type="button" class="ir-a" data-t="670">▶ Ir a 11:10</button></p>

- `puerta.ts` es una extensión sobre el evento `tool_call` del vídeo 8, que decide si se ejecuta cada herramienta. Hace tres cosas:
  1. Bloquea sin preguntar cualquier edición o escritura de la rúbrica, la aceptación o `verificar.sh`.
  2. Si se edita `funcionalidades.json`, compara el fichero antes y después (evento `tool_result`). Si hay una funcionalidad nueva en `pasa`, ejecuta `verificar.sh` con `pi.exec`; si falla, restaura el fichero y marca el resultado de la herramienta como error.
  3. Antes de un `git commit` por bash, comprueba que todo lo que ya está en `pasa` sigue pasando. El trabajo a medias se puede seguir commiteando.
- Decisiones de diseño: compara el fichero en disco y no la edición, porque Pi y oh my pi describen las ediciones de forma distinta; trata un tiempo agotado como fallo, porque Pi no devuelve código de error y una verificación que no termina no ha pasado; y devuelve la salida del script como motivo, que el modelo recibe como feedback con el siguiente paso, no como un «no» a secas.
- No confía en lo que el agente diga que ha ejecutado: ejecuta la verificación ella misma al marcar. Es la lección 8: el cambio a `pasa` lo controla el harness, no el agente.
- *En la demo:* sobre el código con el error, Pi marca `ticket-003` como `pasa`; la puerta lo deshace y le devuelve el error de la aceptación. Flash lee la prueba, arregla el código (no la verificación), añade una prueba de regresión y vuelve a marcar: esta vez `verificar.sh` sale con 0. Nadie le dijo que había un error: se lo dijo la verificación.
- *En la demo:* al pedirle un comentario inofensivo en la prueba de aceptación, la edición se bloquea por ruta protegida. Ya no es una regla escrita, sino una barrera: no es que el agente sea malo, es que no debería poder mover la portería. Para el final del trabajo existen `agent_before_settle` en Pi y `session_stop` en oh my pi (hasta ocho continuaciones), que podrían ejecutar la verificación cada vez que el agente dice que ha terminado; no se usan en el vídeo.

### 6 · La misma puerta en oh my pi

<p><button type="button" class="ir-a" data-t="947">▶ Ir a 15:47</button></p>

- En oh my pi un hook tiene la forma de una extensión de Pi (vídeo 19). Como `puerta.ts` no importa nada del paquete, el mismo fichero se carga con `pi -e` y con `omp --hook` (más abajo, en «Código y comandos»). Se usa la opción y no `.omp/hooks/`, para que la tienda siga sin carpeta `.omp`.
- *En la demo:* con DeepSeek V4 Pro y el encargo del vídeo 23 («trabaja en la siguiente funcionalidad»), oh my pi lee la rúbrica y la aceptación, usa `totalConEnvio`, ejecuta `verificar.sh ticket-003`, comprueba que sale con 0 y solo entonces marca. La puerta no tuvo que actuar: con un agente que verifica, es una red; con uno que no, es la diferencia entre dar por bueno un error y no darlo.
- `/loop --until` (vídeo 15) ejecuta el comando después de cada vuelta: con 0 para, con 1 sigue y con cualquier otro código el bucle se apaga sin cumplir nada. Por eso `verificar.sh` solo sale con 0 o con 1. Y, aparte, por eso falla con un identificador que no existe: un error de tecleo no debe dar un falso verde.
- Un solo script y cuatro sitios: la puerta (en Pi y en oh my pi), la condición de `/loop`, la integración continua (cambia `npm test` por `verificar.sh` en los scripts de los vídeos 10 y 21) y tú, a mano. Un hook de pre-commit de git lo aplica a cualquiera que haga commit. El Playbook lo llama hacer de la verificación parte de la interfaz: el agente la usa, pero no la redefine.

### 7 · Lo que no se automatiza: el revisor

<p><button type="button" class="ir-a" data-t="1118">▶ Ir a 18:38</button></p>

- Los criterios de juicio (alcance, si las pruebas tienen sentido, si la siguiente sesión lo entenderá) los puntúa un revisor con dos condiciones: que no sea quien hizo el trabajo y que use la rúbrica, no su intuición.
- *En la demo:* el agente `reviewer` (vídeo 16) devuelve J1, J2 y J3 a 2 y «aceptar», con líneas como evidencia. Pero antes, el agente principal razona «probablemente aceptar» y se corrige; el revisor no ve ese razonamiento, sí el encargo que le escribe quien hizo el trabajo. Y justifica el traspaso con «reutiliza `totalConEnvio`», que no es el criterio. Un revisor es otra opinión, aunque venga con tabla.
- `/review` (vídeo 18) busca fallos sin preguntas previas, y «correcto» significa que no ha encontrado ninguno, no que funcione. Con la rúbrica, el revisor responde a preguntas escritas antes.
- Calibra al evaluador: según Anthropic, el suyo veía problemas reales, se convencía de que no eran graves y aprobaba. Lo arreglaron leyendo sus registros, buscando dónde se separaba del juicio de una persona y ajustando sus instrucciones.
- El reparto:

| Pieza | Qué hace |
|---|---|
| `verificar.sh` | decide lo que se puede comprobar |
| `puerta.ts` | impide marcar o commitear sin él |
| Revisor | puntúa lo que necesita juicio, con la rúbrica |
| Advisor (vídeo 14) | vigila mientras se trabaja; con una regla en `WATCHDOG.md` avisa si algo cambia a `pasa` sin la salida de `verificar.sh`, pero no aprueba ni bloquea |
| Tú | firmas el veredicto final |

### 8 · Auto-QA: quejas sobre el harness

<p><button type="button" class="ir-a" data-t="1287">▶ Ir a 21:27</button></p>

- Auto-QA no revisa tu código, aunque el nombre engañe (vídeo 18): es un buzón donde el modelo deja quejas sobre las herramientas de oh my pi. `omp grievances` las lista, las limpia o las envía.
- Puede darte una pista: si una herramienta de edición falla a medias, tu verificación puede fallar por culpa del harness. Atribuye el fallo a una capa antes de cambiar de modelo. Pero no lo uses para dar nada por terminado.
- Viene activado, no guarda nada hasta que das tu consentimiento y, si aceptas, cada queja va a un servidor de oh my pi. Para que no salga nada, deja el consentimiento denegado o apaga `dev.autoqa`.

### 9 · Límites, repaso y cierre

<p><button type="button" class="ir-a" data-t="1360">▶ Ir a 22:40</button></p>

- Cinco límites:
  1. **La puerta solo ve lo que sabe mirar:** `edit`, `write` y los commits por bash. Un `sed` sobre `funcionalidades.json` desde bash no lo reconoce. Hace falta la segunda capa de los vídeos 8 y 19 (aprobación para el bash fuera de una lista), y oh my pi tiene más herramientas que escriben, como `eval`.
  2. **El pre-commit se salta** con `git commit --no-verify`, y un agente lo sabe: bloquea ese patrón (más abajo, en «Código y comandos»).
  3. **La verificación es tan buena como la rúbrica.** Si la aceptación no cubre un caso, el script lo deja pasar. Cada fallo que se cuele, un criterio nuevo (lección 10: convertir la revisión en comprobaciones).
  4. **Verificar cuesta.** Cada marcado y cada commit ejecutan el script. Mantén rápida la parte que corre siempre y deja la lenta para la integración continua.
  5. **Lo que se optimiza se puede engañar** (ley de Goodhart, en el vídeo 25). Un ejemplo propio: A5 compara con el commit etiquetado. Si el agente puede crear o mover la etiqueta después de tocar la verificación, A5 pasa, y la puerta no vigila `git tag`.
- **Práctica:** en un proyecto tuyo, escribe la rúbrica de la siguiente funcionalidad antes de empezar, a partir de la plantilla de WalkingLab y citando su licencia. Incluye una prueba de aceptación que cruce dos piezas y un script que solo salga con 0 o 1, y comprueba que falla antes del trabajo. Después deja trabajar al agente con la puerta cargada y apunta cuántas veces lo paró y por qué.
- **Vídeo 25:** bucles, grafos y el coste de orquestar. Ya tienes lo que todo bucle necesita: una condición de parada que no depende de lo que diga el agente.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Un solo fichero, sin imports del paquete

```text
pi -e ~/csn/extensiones/puerta.ts
omp --hook ~/csn/extensiones/puerta.ts
```

- `pi -e`: Pi carga el fichero como extensión.
- `omp --hook`: oh my pi lo carga como hook (vídeo 19); es alias de `--extension`.

### Límite 2 · el hook de pre-commit

```text
git commit --no-verify
```

- `--no-verify`: se salta el hook de pre-commit. Si usas uno, bloquea este patrón en tu política de bash.

## Fuentes

- Learn Harness Engineering (WalkingLab, © 2025, licencia MIT): lecciones 8 (el harness controla el cambio de estado), 9 (cantar victoria antes de tiempo, con la cita de Guo y otros, 2017), 10 (capa de sistema, mensajes de error para el agente, revisión convertida en comprobaciones) y 11 (contrato y rúbrica), y su plantilla de rúbrica.
- The Harness Playbook (Can Bölük): definir «verificado» y la verificación como parte de la interfaz.
- Anthropic: su artículo sobre harnesses para aplicaciones largas (autoevaluación optimista y calibración del evaluador).
- Grabado con Pi 1.0.4. Documentación oficial: [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md) (`tool_call`, `tool_result`, `pi.exec`, `agent_before_settle`) y el ejemplo `protected-paths.ts`.
- Grabado con oh my pi 18.6.1: `hooks.md` (`--hook` es alias de `--extension`; `.omp/hooks/pre|post/`), `extensions.md`, `advisor-watchdog.md` («does not approve actions») y la documentación de `/review` en https://omp.sh/docs/review.
- Vídeos relacionados: 6 (definición de hecho), 8 (`tool_call` y rutas protegidas), 14 (advisor), 15 (`/loop --until`), 16 (agente `reviewer`), 18 (`/review` y Auto-QA), 19 (hooks) y 23 (la rama `andamiaje` y `funcionalidades.json`).

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

