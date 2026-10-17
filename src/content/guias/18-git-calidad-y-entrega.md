---
title: "Vídeo 18 · Git, calidad y entrega"
description: "Revisar, preparar y hacer commits desde omp, trabajar en worktrees y pasar el código por revisión automática antes de entregarlo."
ruta: "pi-oh-my-pi"
orden: 18
duracion: "25 min"
video: "18-git-calidad-y-entrega.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/18-git-calidad-y-entrega.es.vtt"
---

Revisar, preparar y hacer commits desde omp, trabajar en worktrees y pasar el código por revisión automática antes de entregarlo.

<p class="guia__nota">Dura 25 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

> **Seguridad:** las demos de este vídeo corren con approvalMode yolo (todo se aprueba solo); en tu proyecto, configura las aprobaciones antes (vídeo 19).

## Resumen por capítulos

### 1 · Cerrar el ciclo del cambio

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- Un cambio no está terminado cuando pasan los tests. Lo está cuando alguien lo ha revisado, sabes qué entra en el commit y el mensaje cuenta lo que pasó.
- **La idea del vídeo:** las herramientas proponen; tú decides qué entra en la historia. Y algunas hacen más de lo que su nombre sugiere: un modo de prueba que prepara ficheros, un consentimiento que envía datos, una opción que publica.
- El montaje: DeepSeek V4 Pro lleva la conversación, Flash (rol `smol`) escribe los mensajes de commit, y trabajamos en una rama de usar y tirar (`demo-18`) de un repositorio sin remoto: nada sale de la máquina.
- En la rama hay un cambio sin commitear (un envío urgente de +3 €) con un fallo sembrado que los tests no detectan, y una línea en el README que no tiene nada que ver. Separar lo que va en cada commit es parte del oficio.
- *En terminal:* Rama demo-18 · sin commitear (más abajo, en «Código y comandos»).

### 2 · /review: una revisión con método

<p><button type="button" class="ir-a" data-t="176">▶ Ir a 2:56</button></p>

- `/review` es un comando incluido en omp, escrito en TypeScript, no una plantilla de prompt como la del vídeo 06. Su menú ofrece cinco opciones: contra una rama base, cambios sin commitear, un commit, una pull request (necesita `gh` y tu cuenta) o instrucciones a medida. Usamos la segunda.
- **El diff congelado:** lee el diff una vez y lo mete en el mensaje, con una tabla de ficheros. Si el árbol cambia mientras tanto, la revisión sigue siendo sobre lo que había. Deja fuera ficheros de bloqueo y código generado.
- No revisa el modelo de la conversación: reparte con `task` entre agentes `reviewer` (vídeo 16), de uno a dieciséis según el tamaño del diff. El reviewer solo informa de fallos con impacto demostrable, arreglables, no intencionados e introducidos por el parche. Usa el rol `slow`; sin asignar, hereda tu modelo por defecto (vídeo 14).
- *En la demo:* en 38 segundos y un céntimo, el reviewer devuelve hallazgos y un veredicto que pide cambios. Pro no se fía: lee el código, confirma el fallo sembrado (el umbral de envío gratis se evalúa con IVA) y lo explica con un carrito de 35 €. Después lista tres hallazgos menores y pregunta antes de tocar nada.
- **Trampa:** el reviewer tiene `bash`. «Solo lectura» en sus instrucciones es una instrucción, no un permiso; con yolo nada lo para. Y si copias tu plantilla `review.md` de Pi a los comandos de omp, el `/review` incluido la tapa: ponle otro nombre.

> **Nota:** la locución dice que el veredicto es «changes requested». En la tarjeta de omp, el veredicto se expresa como `correct` o `incorrect`, con un grado de confianza; `correct` significa que no se encontraron fallos ni bloqueos. Aquí, por tanto, el parche no era correcto: había que cambiar algo antes de entregarlo.

### 3 · Arreglar y mirar el diff con /git

<p><button type="button" class="ir-a" data-t="457">▶ Ir a 7:37</button></p>

- *En terminal:* La petición (más abajo, en «Código y comandos»).
- Pro arregla el cálculo y añade la prueba del carrito de 35 €: con el código viejo habría dado 45,35 en lugar de 50,30. **La revisión no sustituye a las pruebas; las señala.** Lo retoma el vídeo 24.
- `/git` (igual que `omp git`) abre una interfaz a pantalla completa: a la derecha, cambios sin preparar y preparados; a la izquierda, el diff. Las teclas `1`–`4` cambian la vista (fichero, partida, en línea, por hunk) y `?` abre la hoja de atajos.
- Preparar: la barra espaciadora prepara o quita la fila; dentro del diff, `s` prepara el hunk y `u` lo quita, y con mayúsculas y flechas eliges líneas sueltas.
- *En la demo:* pulsamos espacio sobre la cabecera de la sección y se prepararon los cinco ficheros, README incluido. Lo arreglamos quitando su hunk con `u`. Mira dónde está el cursor antes de pulsar.
- **Teclas que borran:** `x` descarta el hunk o las líneas y `Supr` el fichero entero. Piden una segunda pulsación, pero lo descartado no estaba en ningún commit: no se recupera. `q` sale sin commitear.

### 4 · omp commit en modo de prueba

<p><button type="button" class="ir-a" data-t="609">▶ Ir a 10:09</button></p>

- `omp --profile demo commit --dry-run` genera un mensaje sin commitear. El perfil también se aplica a los subcomandos.
- Por pasos: resuelve el modelo (rol `commit`, que sin asignar cae a `smol`), busca changelogs, descubre los ficheros de contexto (lee nuestro `AGENTS.md`) y arranca un agente de commit con sus propias herramientas; si los cambios no tienen relación, puede proponer dividirlos.
- **Gana el validador.** El formato es conventional commits: tipo, ámbito y un resumen que empieza por un verbo en pasado, de 72 caracteres como mucho. Un validador del código lo exige: la primera propuesta (*add*) no pasa y la segunda (*added*) sí. Nuestro `AGENTS.md` pide español, imperativo y el prefijo `tienda:`; el agente lo leyó, pero no lo cumplió.
- **Trampa del dry-run:** si no hay nada preparado, `omp commit` prepara todos los cambios antes de generar el mensaje, también en modo de prueba. Por eso pasamos primero por `/git`.
- Sin `--dry-run` crea el commit y actualiza el CHANGELOG si lo hay (`--no-changelog` para no tocarlo); con `--push` publica. No lo ejecutamos.
- *En terminal:* Conventional commits y omp commit sin --dry-run (más abajo, en «Código y comandos»).

### 5 · El commit desde /git

<p><button type="button" class="ir-a" data-t="779">▶ Ir a 12:59</button></p>

- La tecla `c` abre el compositor: resumen, descripción y el botón de commitear lo preparado. Con los campos vacíos, genera un mensaje con la misma tubería de `omp commit`; si no hay nada preparado, además lo prepara todo.
- Escribimos nosotros el mensaje, con las reglas de la tienda. `git log --oneline` confirma el commit. **El generador sirve de borrador; el mensaje final lo decides tú**, que conoces las reglas del equipo.
- *En terminal:* Nuestro mensaje (más abajo, en «Código y comandos»).
- «Stage all & commit» solo cuando de verdad quieres todo. «Amend» reescribe el commit anterior: úsalo solo en commits que no hayas compartido. «Stage by description» usa el rol `judge` (un modelo que decide qué hunks preparar); no lo tenemos asignado.

### 6 · /wt: la sesión a un worktree

<p><button type="button" class="ir-a" data-t="888">▶ Ir a 14:48</button></p>

- Un worktree es una segunda carpeta de trabajo del mismo repositorio, con otra rama. `/wt <rama>` (o `/worktree`) lo crea y se lleva la sesión allí, con los cambios sin commitear y sin perder la conversación. Sin nombre, la rama lleva fecha y hora.
- La carpeta la gestiona omp (con un perfil, dentro del perfil). En macOS se clona con APFS, una copia instantánea que no duplica datos en el disco.
- *En la demo:* commiteamos el README en el worktree. En la carpeta original el README sigue modificado: `/wt` se lleva una copia y, por defecto, no limpia el origen.
- **Cuidado:** `worktree.cleanSource` limpia el origen con `reset --hard` y `clean`, y borra lo no commiteado. Déjalo apagado.
- Úsalo cuando la conversación ya tiene el contexto de un trabajo y quieres seguirlo en su rama. No funciona mientras el modelo responde ni en vibe (vídeo 15). Para cambiar de carpeta sin crear rama, `/move` (vídeo 12).

### 7 · Auto-QA y omp grievances

<p><button type="button" class="ir-a" data-t="1055">▶ Ir a 17:35</button></p>

- **Auto-QA no es QA de tu código.** Es un buzón de quejas del modelo sobre las herramientas de omp: si una herramienta no hace lo que dice su descripción, el modelo lo apunta. Es información para los autores de omp.
- Viene activado, pero nada se guarda hasta que das tu consentimiento. Si dices que sí, cada queja se guarda en local y se envía sola a un servidor de omp. La queja la escribe el modelo y puede citar una ruta o un comando.
- Para que no salga nada, deja el consentimiento denegado (`dev.autoqaConsent`), apaga `dev.autoqa` o pon `PI_AUTO_QA=0`. Manda el consentimiento.
- `omp grievances` lista, limpia (`clean`) o envía (`push`) las quejas. Te sirve para ver si el modelo también ha notado que una herramienta falla.

### 8 · /security y los límites

<p><button type="button" class="ir-a" data-t="1218">▶ Ir a 20:18</button></p>

- `/security` hace escaneos de seguridad con agentes `security-reviewer`. Viene apagado (`security.enabled`) y no lo activamos: exige una cuenta OAuth guardada en omp (o Amazon Bedrock), gasta mucho modelo y su variante en la nube envía el trabajo a Codex Security.
- Su idea útil: el plan es inmutable. Si el código o el alcance cambian antes del escaneo, se niega a empezar, igual que el diff congelado de `/review`.
- Los cinco límites del vídeo:
  1. **Dry-run no es solo lectura:** `omp commit --dry-run` y el mensaje generado en `/git` preparan todo si el índice está vacío. Prepara tú antes y mira `git status` después.
  2. **Las convenciones de la herramienta pueden ganar a tu `AGENTS.md`:** usa el mensaje generado como borrador.
  3. **Lo que publica:** `--push`, la opción de PR de `/review`, el envío de Auto-QA y `/security` en la nube mandan algo fuera, a veces con tu cuenta. Y el diff de `/review` viaja entero al proveedor; la redacción de secretos viene apagada (vídeo 19).
  4. **Las teclas que borran:** `x` y `Supr` en `/git`, y `worktree.cleanSource`.
  5. **Solo lectura no es una barrera:** el reviewer tiene `bash` y yolo no pregunta.
- **Coste:** la revisión y el arreglo costaron un céntimo; los mensajes de Flash, menos. Con diffs grandes, `/review` lanza más revisores y el coste crece.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1380">▶ Ir a 23:00</button></p>

- El flujo recomendado: `/review` (congela el diff) → arreglo con la prueba que lo habría detectado → `/git` (preparas tú, por hunk) → `omp commit --dry-run` como borrador → tu mensaje → `/wt` para lo que va aparte.
- **Práctica:** en tu perfil de pruebas y una rama de usar y tirar, haz un cambio que mezcle dos cosas. Lanza `/review` sobre los cambios sin commitear. En `/git`, prepara solo una, lanza `omp commit --dry-run` y compara el mensaje con las reglas de tu repositorio. Escribe tú el mensaje final. Al terminar, comprueba con `git status` y `git worktree list` que no queda nada suelto.
- **En otros agentes:** la lección vale igual. Revisa el diff tú, prepara a mano y no dejes que el agente publique. Cualquier herramienta trae sus convenciones, y pueden ganar a tu `AGENTS.md`.
- **Vídeo 19:** de instrucciones a límites: aprobaciones, patrones de bash, TTSR, hooks y secretos.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Rama demo-18 · sin commitear

```text
// src/envio.js
export function envioUrgente(subtotal) { … gastosEnvio(subtotal) + 3 … }
// src/carrito.js · totalUrgente
const envio = envioUrgente(aplicarIVA(totalCupon, tipoIVA));   // ✗ con IVA
```

El fallo sembrado: `totalUrgente` calcula el envío sobre el total con IVA, al revés que el resto de la tienda. `npm test` pasa igualmente.

### La petición

```text
Arregla el hallazgo de totalUrgente para que el envío se calcule sin IVA,
como en totalConEnvio, y añade la prueba del carrito de 35 euros
que lo habría detectado. Ejecuta npm test.
No hagas commit ni toques el README.
```

### Conventional commits

```text
feat(envio): added urgent shipping total calculation
tipo: feat · ámbito: envio · verbo en pasado
en inglés · 72 caracteres como mucho
```

El validador de `omp commit` exige el verbo en pasado y 72 caracteres como mucho. El inglés es lo que escribió el agente en la demo; la documentación no dice que el validador lo exija.

### omp commit sin --dry-run

No se ejecuta en el vídeo; está aquí como referencia.

```text
omp --profile demo commit                  # crea el commit (y el CHANGELOG si hay)
omp --profile demo commit --no-changelog   # no toca el CHANGELOG
omp --profile demo commit --push           # publica ⚠
```

- `--push`: sube los commits al terminar. Publica.

### Nuestro mensaje

```text
tienda: añade el envío urgente

El envío urgente suma 3 € y se calcula sin IVA, como el normal.
```

Sigue las reglas del `AGENTS.md` de la tienda: español, imperativo y el prefijo `tienda:`.

### Auto-QA (lo escribe el modelo)

```text
write xd://report_issue
  tool: <herramienta>
  report: «no hace lo que dice su descripción»
```

`xd://report_issue` es un dispositivo virtual: el modelo escribe ahí la queja, y solo se guarda y se envía a los autores de omp si diste tu consentimiento.

## Fuentes

- Documentación de oh my pi: https://omp.sh/docs/review (menú, prioridades P0–P3, confianza, veredicto `correct`/`incorrect`, revisión de solo lectura) y https://omp.sh/docs/commit (dry-run, validación, rol `commit`, changelog).
- `cli-reference.md` (`omp commit`, `omp git`, `omp grievances`, `omp worktree`) y `settings.md` (`dev.autoqa`, roles).
- `tools/security_scan.md` (por qué `/security` exige OAuth, plan inmutable) y `secrets.md` (la redacción de secretos viene apagada).
- `omp commit --help`, `omp git --help`, `omp worktree --help` y `omp grievances --help`.
- Grabado con omp 18.6.1.
- Vídeos relacionados del curso: 06 (la plantilla `/review` de Pi), 12 (`/move`), 14 (roles `commit`, `slow` y `judge`), 16 (el agente `reviewer`), 19 (aprobaciones y secretos), 24 (verificar de verdad).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Cerrar el ciclo del cambio**

Hasta ahora hemos hecho cambios. Los hemos planificado, repartido entre agentes y verificado con el servidor de lenguaje y el depurador. Pero un cambio no está terminado cuando pasan los tests. Está terminado cuando alguien lo ha revisado, cuando sabes exactamente qué entra en el commit y cuando el mensaje cuenta lo que pasó. Hoy cerramos ese ciclo.

oh my pi trae de serie varias piezas para eso. Barra review, una revisión de código con un método. Barra git, una interfaz de git a pantalla completa, con el diff, el staging y el compositor de commits. O eme pe commit, que genera el mensaje por ti. Barra uve doble te, que lleva tu sesión a un worktree. Y dos más que conviene entender aunque no las usemos a fondo: Auto QA, con o eme pe grievances, y barra security.

Una idea va a atravesar el vídeo. Las herramientas proponen; tú decides qué entra en la historia del repositorio. Y algunas hacen más de lo que su nombre sugiere: un modo de prueba que puede preparar ficheros, un consentimiento que envía datos a un servidor, una opción que publica. Iremos señalando cada caso.

DeepSeek V cuatro Pro lleva la conversación, y Flash vuelve al rol smol, que es el que usarán los mensajes de commit. Como en los dos vídeos anteriores, trabajamos en una rama de usar y tirar, demo dieciocho. La tienda no tiene remoto, así que nada de lo que hagamos hoy sale de la máquina.

En esa rama hemos dejado preparado, sin commitear, un cambio pequeño: un envío urgente que suma tres euros al envío normal, con una función en envio punto js, otra en carrito punto js y sus pruebas. Y un detalle, con toda la intención: hemos sembrado un fallo. La función del carrito calcula el envío sobre el total con IVA, al revés que el resto de la tienda. Los tests pasan igualmente. Veremos si la revisión lo encuentra.

Además hay una línea nueva en el README, que dice que hace falta Node veinte o posterior, y que no tiene nada que ver con el envío. Es lo que pasa en la vida real: el árbol de trabajo mezcla cosas, y parte del oficio es separar lo que va en cada commit. En el otro panel, git status lo confirma: cinco ficheros modificados.

Antes de empezar, un vistazo gratis. Ejecutamos barra security, y responde que la seguridad está desactivada y que hay que activar el ajuste security punto enabled. Volveremos a eso al final. Escribimos barra re, y en el menú aparece review, que lanza la revisión interactiva y lleva la etiqueta de incluido, porque viene con el programa. En la barra de estado, la rama demo dieciocho, con un asterisco y un cinco: cinco ficheros cambiados.

**2 · Barra review: una revisión con método**

Empezamos por revisar. Recuerda el vídeo seis: en Pi escribimos un template barra review, un fichero Markdown con unas pocas instrucciones, que el mismo modelo de la conversación seguía al pie de la letra. Funcionaba, y era nuestro. El barra review de oh my pi es otra cosa: un comando escrito en TypeScript que viene con el programa y que no se limita a enviar un prompt.

Lo ejecutamos. Aparece un menú, review mode, con cinco opciones. Revisar contra una rama base, como en una pull request. Revisar los cambios sin commitear. Revisar un commit concreto. Revisar una pull request concreta. Y unas instrucciones a medida, para cuando quieres decir tú qué mirar.

La opción de las pull requests usa el cliente gh con tu cuenta para listar las abiertas del repositorio. La tienda no tiene remoto y no vamos a enseñar cuentas, así que se queda en la diapositiva. Elegimos la segunda: revisar los cambios sin commitear.

Aquí está la primera diferencia con nuestro template. Barra review lee el diff una vez y lo congela dentro del mensaje: una tabla con los ficheros, las líneas añadidas y quitadas, y el diff completo. El modelo no tiene que adivinar qué revisar, y si el árbol cambia mientras tanto, la revisión sigue siendo sobre lo que había al pedirla. Los ficheros que no aportan, como los de bloqueo de dependencias o el código generado, quedan fuera.

La segunda diferencia: el mensaje le dice al modelo que no revise él. Le pide que reparta el trabajo con la herramienta task entre agentes reviewer, los del vídeo dieciséis. Cuántos depende del tamaño del diff: con uno pequeño, como el nuestro, uno solo; con diffs enormes, hasta dieciséis en paralelo. Pro lanza la tarea. El primer intento falla porque le falta un campo obligatorio, el contexto, y lo repite.

Merece la pena leer el encargo. Un objetivo, revisar los cambios sin commitear. Unas restricciones: solo los cinco ficheros y el diff que ya tiene. Y el contrato del repositorio, sacado del AGENTS punto md, con los importes a céntimos y los commits en español. Es la regla del vídeo dieciséis: cada encargo se explica solo.

El agente reviewer trae además sus propias reglas. Solo debe informar de fallos con impacto demostrable, que se puedan arreglar de forma concreta, que no parezcan intencionados y que haya introducido el parche, no los que ya estaban. Es una forma de evitar las revisiones que llenan la pantalla de sugerencias de estilo.

¿Con qué modelo revisa? El reviewer pide el rol slow, y como no lo hemos asignado, hereda el modelo por defecto, Pro, como vimos en el vídeo catorce. Tarda treinta y ocho segundos, cuesta un céntimo y devuelve su resultado con forma fija: unos hallazgos y un veredicto. Aquí, changes requested: hay que cambiar algo antes de entregarlo.

Lo interesante viene después. Pro no se fía sin más: lee carrito punto js y envio punto js para comprobar el hallazgo principal, y lo confirma. Total urgente evalúa el umbral del envío gratis con IVA, mientras que total con envío lo hace sin IVA, como dice su propio comentario. Es justo el fallo que habíamos sembrado.

Y lo explica con un ejemplo que se entiende. Un carrito de treinta y cinco euros sin IVA pasa a cuarenta y dos con treinta y cinco con IVA, supera el umbral de cuarenta, y el envío urgente cobra solo los tres euros del suplemento. Lo coherente sería cuatro con noventa y cinco más tres: siete con noventa y cinco. Incluso propone el código corregido.

Después vienen tres hallazgos menores. Que aplicar IVA se calcula dos veces. Que falta una prueba en el límite, precisamente con ese carrito de treinta y cinco euros. Y que la línea del README sobre Node veinte no está respaldada por nada del repositorio. Fíjate: la revisión mira todos los cambios sin commitear, también los que no tienen que ver. Y al final pregunta si aplica el arreglo; no toca nada sin permiso.

Un apunte honesto sobre el reviewer. Entre sus herramientas está bash, como ya dijimos en el vídeo dieciséis. Sus instrucciones le dicen que solo ejecute comandos de lectura, como git diff o git log, y que no edite nada. Pero eso es una instrucción, no un permiso. Con el modo yolo, nada lo impediría. Cómo convertir instrucciones en límites reales es el tema del vídeo diecinueve.

Y si vienes de Pi con tu template: si copias tu review punto md a los comandos de oh my pi, el incluido tiene prioridad y el tuyo quedará tapado. Ponle otro nombre. El template es ligero y lo controlas tú; el comando incluido es más pesado, pero da hallazgos con forma y método.

**3 · Arreglar y mirar el diff con barra git**

Con el hallazgo delante, le pedimos a Pro que lo arregle: que calcule el envío sin IVA, como en total con envío, que añada la prueba del carrito de treinta y cinco euros, que ejecute npm test, y que no haga commit ni toque el README. Edita el carrito, con tres líneas nuevas y dos quitadas, añade la prueba, y los dieciocho tests pasan.

Fíjate en lo que cuenta al final: con el código viejo, esa prueba habría dado cuarenta y cinco con treinta y cinco en lugar de cincuenta con treinta. La prueba nueva es la que habría hecho visible el fallo desde el principio. La revisión no sustituye a las pruebas; las señala. Volveremos a esta idea, con más calma, en el vídeo veinticuatro.

Ahora toca mirar qué hemos cambiado antes de commitear. Escribimos barra git. Se abre una interfaz a pantalla completa, la misma que obtienes con o eme pe git desde la terminal. A la derecha, la barra lateral con dos secciones: los cambios sin preparar, que son cinco, y los preparados, que de momento no hay. A la izquierda, el diff, partido en dos columnas.

Con las flechas nos movemos por los ficheros, y con Enter abrimos uno en el diff. Con las teclas del uno al cuatro cambiamos la vista: fichero completo, partida, en línea o por hunks. La tecla uve doble ajusta las líneas largas y la be ignora los espacios. Y con la interrogación aparece la hoja de atajos completa.

Preparar es igual de directo. La barra espaciadora prepara o quita la fila en la que estás. Dentro del diff, la tecla ese prepara el hunk en el que estás y la tecla u lo quita, y con mayúsculas y las flechas puedes seleccionar líneas sueltas. Es el git add por partes de toda la vida, pero viendo exactamente lo que añades.

Y aquí nos pasó algo que conviene contar. Pulsamos la barra espaciadora con el cursor sobre la cabecera de la sección, no sobre un fichero, y preparó los cinco, README incluido. Lo arreglamos sin salir: con el tabulador pasamos al diff, avanzamos hasta el README y, con la tecla u, quitamos su hunk. Aparece el aviso de que el README ya no está preparado. Quedan cuatro preparados y el README fuera.

Cuidado con otras dos teclas. La tecla equis descarta el hunk o las líneas seleccionadas, y la tecla suprimir descarta el fichero entero. Las dos piden una segunda pulsación para confirmar, pero lo que descartan no estaba en ningún commit, así que no hay forma de recuperarlo. No las tocamos. Salimos con la tecla cu, sin commitear todavía.

**4 · O eme pe commit en modo de prueba**

Antes de escribir el mensaje, veamos qué propone oh my pi. En el otro panel, ejecutamos o eme pe guion guion profile demo commit guion guion dry run. El perfil también se aplica a los subcomandos, así que este commit usa los modelos del perfil demo. Lo primero que enseña es el resumen de lo preparado: cuatro ficheros, treinta y cinco líneas añadidas y tres quitadas.

La salida va por pasos. Primero resuelve el modelo: DeepSeek V cuatro punto uno Flash. Usa el rol commit y, como no está asignado, cae al rol smol. Después busca changelogs, y no encuentra ninguno, porque la tienda no tiene. Luego descubre los ficheros de contexto, y aparece nuestro AGENTS punto md. Y arranca un agente de commit.

Ese agente tiene sus propias herramientas. Aquí usa tres: una vista general de lo preparado, el diff de los cuatro ficheros y una para proponer el commit. Si los cambios no tuvieran relación, podría proponer dividirlos en varios commits. Esta vez es un solo cambio.

Y aquí está lo interesante: propone dos veces. La primera, feat, ámbito envio, add urgent shipping total calculation. La segunda, igual, pero con added, en pasado. El formato es el de conventional commits: un tipo, como feat o fix, un ámbito entre paréntesis y un resumen en inglés que empieza por un verbo en pasado. No es una sugerencia: un validador del código lo exige, y la segunda propuesta es la que lo pasa.

El resultado final es feat, envio, added urgent shipping total calculation, con dos viñetas en inglés que explican las dos funciones. Nuestro AGENTS punto md dice otra cosa: mensajes en español, en imperativo y empezando por tienda dos puntos. El agente lo ha leído, pero el validador no le deja cumplirlo, y gana el validador. Cuando una herramienta trae sus propias convenciones, las reglas de tu repositorio no siempre ganan. Compruébalo antes de confiar en ella.

El modo de prueba no ha commiteado nada, y como ya había cosas preparadas, no ha tocado el índice: el README sigue fuera, como veremos enseguida. Pero hay una trampa que conviene conocer. Si lo lanzas con nada preparado, o eme pe commit prepara todos los cambios antes de generar el mensaje, también en dry run. Por eso hemos pasado primero por barra git.

Sin dry run, o eme pe commit crea el commit. Si encuentra un CHANGELOG, actualiza su sección de cambios sin publicar y lo prepara para que entre en el mismo commit; con guion guion no changelog, no lo toca. Si propone dividir el cambio en varios commits, te enseña el plan y te pide confirmación. Y con guion guion push, sube los commits al terminar. Eso publica, y en este curso se queda en la diapositiva.

**5 · El commit desde barra git**

Volvemos a barra git. Los cuatro ficheros siguen preparados y el README fuera. Pulsamos la tecla ce para ir al compositor, abajo a la derecha, que tiene dos campos: el resumen y la descripción. Debajo, el botón para commitear lo preparado.

La hoja de atajos lo dice: si dejas los campos vacíos, se genera un mensaje. Es la misma tubería que acabamos de ver, con Flash y en inglés, así que no lo repetimos. Dos avisos: si el mensaje generado no pasa la validación, la interfaz te dice que necesita revisión. Y si no hubiera nada preparado, generar el mensaje prepararía todos los cambios.

Escribimos nosotros. En el resumen: tienda dos puntos añade el envío urgente. En la descripción, una línea: el envío urgente suma tres euros y se calcula sin IVA, como el normal. Pulsamos el botón, y arriba aparece el aviso de commit creado. La barra lateral se queda solo con el README, y el botón cambia a preparar todo y commitear.

En el otro panel, git log guion guion oneline. Ahí está el commit, encima de master, con el mensaje que pide la tienda. El generador nos ha servido de borrador, pero el mensaje final lo hemos decidido nosotros, que somos quienes conocemos las reglas del equipo.

Dos opciones más del compositor. Ese botón de preparar todo y commitear es útil, pero solo cuando de verdad quieres todo. Y la casilla de enmendar el commit anterior, que rellena el formulario con su mensaje. Es el amend de git: reescribe la historia, así que úsalo solo en commits que no hayas compartido. Hay también un botón para preparar por descripción, con un modelo que juzga cada hunk; usa el rol judge, que no tenemos, y queda en la diapositiva.

**6 · Barra uve doble te: la sesión a un worktree**

Nos queda el README. Imagina que quieres seguir con él en otra rama, sin mezclarlo con el envío urgente, y sin perder la conversación. Para eso está barra uve doble te, que también se llama barra worktree.

Un worktree es una segunda carpeta de trabajo del mismo repositorio, con otra rama, que comparte la historia con la primera. Puedes tener dos ramas abiertas a la vez sin hacer stash ni cambiar de rama. Barra uve doble te lo crea y te lleva la sesión allí.

Escribimos barra uve doble te demo dieciocho uve doble te, el nombre de la rama nueva. Si no le das nombre, crea una rama con la fecha y la hora. Al momento aparece el mensaje: sesión movida al worktree, en la rama nueva, clonado con APFS y con los cambios sin commitear incluidos. La barra de estado cambia de carpeta y de rama, y ahora marca un solo fichero cambiado.

¿Dónde está esa carpeta? No junto a la tienda, sino en una carpeta que gestiona oh my pi. Como trabajamos con el perfil demo, dentro del perfil: punto o eme pe, profiles, demo, uve doble te, con el nombre de la rama y un sufijo. Y clonado con APFS significa que macOS ha hecho una copia instantánea de la carpeta, sin duplicar los datos en el disco.

Abrimos barra git en el worktree. Un solo cambio, el README, en la rama demo dieciocho uve doble te. No hay nada preparado, así que escribimos el resumen, tienda dos puntos indica la versión de Node, y usamos el botón de preparar todo y commitear. Commit creado. La pantalla pasa a la ficha del commit: el autor, que difuminamos, la fecha y el commit padre, que es el del envío urgente.

Ahora, un detalle importante. En el otro panel, que sigue en la carpeta original de la tienda, git status: el README sigue modificado también allí. Barra uve doble te se lleva una copia de los cambios, pero con la configuración por defecto no limpia el origen. Git worktree list enseña las dos carpetas, cada una con su rama. Y el último commit de demo dieciocho uve doble te es el del README.

Existe un ajuste, worktree punto clean source, que sí limpia el origen, y lo hace con un reset hard y un clean. Eso borra lo que no esté commiteado. Déjalo apagado salvo que lo tengas muy claro.

¿Cuándo usarlo? Cuando la conversación ya tiene el contexto de un trabajo y quieres que siga en su propia rama mientras tú haces otra cosa. No funciona mientras el modelo responde, ni en vibe mode, como vimos en el vídeo quince. Y si solo quieres cambiar de carpeta, sin crear rama, eso es barra move, del vídeo doce.

**7 · Auto QA y o eme pe grievances**

Pasamos a Auto QA, y aquí conviene deshacer una confusión, porque el nombre invita a pensar en control de calidad de tu código. No lo es. Auto QA es un buzón de quejas del modelo sobre las herramientas de oh my pi.

Funciona así. Cuando está activo, el system prompt le pide al modelo que, si una herramienta devuelve algo que no encaja con lo que dice su descripción, lo apunte escribiendo una línea en un dispositivo virtual, equis de dos puntos barra barra report issue: el nombre de la herramienta y una frase con el problema. Es información para los desarrolladores de oh my pi, no para ti ni para tu proyecto.

Viene activado de serie, pero nada se guarda hasta que das tu consentimiento. La primera vez que el modelo reporta algo, sale un diálogo con tono gracioso: tu agente ha escrito una carta enfadada a una herramienta, ¿se la mandamos a los desarrolladores? Si dices que no, Auto QA se apaga. Si dices que sí, cada queja se guarda en local y además se envía sola a un servidor de oh my pi.

Según el diálogo, solo viaja la herramienta y la queja. En el código se ve que van también el modelo, la versión, el sistema y un identificador de instalación. Y la queja la escribe el modelo, que puede citar una ruta o un comando. Por eso, en el perfil demo lo dejamos denegado de antemano.

Lo comprobamos en el otro panel. Config get dev punto auto QA responde true: activado, el valor de serie. Y el consentimiento, denied: denegado. Así, si el modelo se queja en cámara, no sale el diálogo y no se envía nada. Son dos ajustes distintos, y el que manda de verdad es el segundo.

La ayuda de o eme pe grievances lo resume: ver, limpiar o enviar las quejas. Sin acción, lista las últimas, y se pueden filtrar por herramienta. Con clean se borran por identificador, por herramienta o todas. Y con push se envían las pendientes al servidor. Ese último, en la diapositiva, porque publica.

Lo ejecutamos con el perfil demo, y responde que todavía no hay quejas registradas. Un detalle que vimos fuera de cámara: solo con listar, crea la base de datos vacía, y la crea dentro de la carpeta del perfil, como el worktree. Si usas perfiles para separar entornos, aquí también se separan.

¿Y para qué te sirve a ti? Para dos cosas. Si una herramienta te falla a menudo, ahí verás si el modelo también lo ha notado. Y para saber qué sale de tu máquina. Si no quieres que salga nada, deja el consentimiento denegado o apaga dev punto auto QA. Con la variable de entorno PI AUTO QA a cero también se desactiva.

**8 · Barra security y los límites de todo esto**

La última pieza, barra security, va solo explicada. Al principio vimos que responde que está desactivada, y viene así de fábrica. Cuando lo activas, oh my pi hace escaneos de seguridad propios: un plan con el alcance exacto, un escaneo en segundo plano con agentes security reviewer, y comandos para ver el estado, listar los escaneos, validar hallazgos, compararlos entre escaneos e importarlos o exportarlos en SARIF, el formato que entienden muchas herramientas de seguridad.

¿Por qué no lo activamos? Porque el escaneo exige una cuenta con OAuth guardada en oh my pi, o Amazon Bedrock, y aquí no enseñamos cuentas. Y porque escanear un repositorio entero gasta mucho modelo. Hay además una variante en la nube que envía el trabajo a Codex Security, de ChatGPT. Todo eso, en la diapositiva.

Un detalle de diseño sí merece la pena: el plan es inmutable. Guarda una huella del código y del alcance, y si cambian antes del escaneo, se niega a empezar. Es la misma idea que el diff congelado de barra review: que lo revisado sea exactamente lo que pediste.

Ahora, los límites del vídeo, juntos. El primero: dry run no es solo lectura. O eme pe commit en modo de prueba, y el mensaje generado en barra git, preparan todos los cambios si el índice está vacío. Prepara tú antes, y mira git status después. Y en barra git, mira dónde está el cursor antes de pulsar la barra espaciadora.

El segundo: las convenciones. O eme pe commit escribe mensajes convencionales en inglés, aunque tu AGENTS punto md diga otra cosa; lo hemos visto en pantalla. Úsalo como borrador, o úsalo tal cual en repositorios que ya sigan ese estilo.

El tercero: lo que publica. Guion guion push, la opción de pull requests de barra review, el envío de quejas de Auto QA y la variante en la nube de security mandan algo fuera de tu máquina, a veces con tu cuenta. Y otro punto que se olvida: el diff que revisa barra review viaja entero al proveedor del modelo. La redacción de secretos de oh my pi viene apagada; la veremos en el vídeo diecinueve.

El cuarto: las teclas que borran. La equis y la tecla suprimir en barra git descartan trabajo que no está en ningún commit, y clean source limpia la carpeta original. Y el quinto, el de siempre: el reviewer tiene bash y el modo yolo no pregunta. Una instrucción de solo lectura no es una barrera.

En cuanto al coste, la barra de estado marcaba un céntimo después de la revisión y el arreglo, y los mensajes de Flash cuestan todavía menos. Con diffs grandes, barra review lanza más revisores, y el coste crece con ellos.

**9 · Repaso, práctica y cierre**

Repasemos. Barra review congela el diff que elijas, sin commitear, contra una rama, un commit o una pull request, y lo reparte entre agentes reviewer, de uno a dieciséis según el tamaño. Devuelve hallazgos y un veredicto, y el modelo de la conversación los comprueba y te pregunta antes de tocar nada. El reviewer usa el rol slow, que sin asignar hereda tu modelo por defecto.

Barra git, igual que o eme pe git, enseña el diff en cuatro vistas, prepara por fichero, por hunk o por líneas, y commitea con tu mensaje o con uno generado. O eme pe commit genera mensajes convencionales con el rol commit o smol, actualiza changelogs, puede dividir commits, y en dry run no commitea, aunque puede preparar. Barra uve doble te crea una rama y un worktree, y se lleva la sesión con una copia de los cambios.

Auto QA no revisa tu código: recoge quejas del modelo sobre las herramientas, y solo con tu consentimiento las guarda y las envía. O eme pe grievances las lista, las limpia y las envía. Y barra security viene apagado, exige OAuth y queda para cuando lo necesites de verdad.

La práctica: en tu perfil de pruebas y en una rama de usar y tirar, haz un cambio pequeño que mezcle dos cosas sin relación. Lanza barra review sobre los cambios sin commitear y apunta qué ha encontrado. Después, en barra git, prepara solo una de las dos cosas, lanza o eme pe commit guion guion dry run, y compara su mensaje con las reglas de tu repositorio. Escribe tú el mensaje final y commitea. Y cuando termines, comprueba con git status y git worktree list que no queda nada suelto.

En el próximo vídeo endurecemos oh my pi para un repositorio de equipo: el modo de aprobación, que hoy sigue en yolo, aprobaciones por herramienta y patrones de bash, las reglas TTSR y barra o eme efe ge, los hooks, y los secretos y su redacción. Lo que hoy han sido instrucciones, como el solo lectura del reviewer, pasarán a ser límites. Nos vemos allí.

</details>

