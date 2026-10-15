---
title: "Vídeo 09 · Extensiones II: estado y paquetes"
description: "extensiones con estado que sobreviven a rebobinar la sesión, el fallo típico y cómo evitarlo. Empaquetar, instalar y publicar."
ruta: "pi-oh-my-pi"
orden: 9
duracion: "24 min"
video: "09-extensiones-ii-y-paquetes.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/09-extensiones-ii-y-paquetes.es.vtt"
---

extensiones con estado que sobreviven a rebobinar la sesión, el fallo típico y cómo evitarlo. Empaquetar, instalar y publicar.

<p class="guia__nota">Dura 24 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo que se pierde

<p><button type="button" class="ir-a" data-t="20">▶ Ir a 0:20</button></p>

- **El modo aprobación del vídeo 08**
  - `tool_call` · Un evento: antes de cada herramienta
  - `3` · Opciones: permitir, siempre, bloquear
  - `/reload` · Se olvidaba: contadores y «siempre» a cero
- **Barra reload:** Tira el entorno y lo vuelve a crear — Lo que vive en variables de la factoría desaparece con él.
- **La sesión es un árbol:** Raíz (el inicio) → Rama A (la que dejas) → Rama B (el camino nuevo)
- **La pregunta:** ¿Sigue permitido en otra rama? — No: en esa historia, nadie ha aprobado nada.
- **Hoy:** Estado (dónde guardarlo) → El fallo (provocarlo y arreglarlo) → Paquete (instalar y elegir)

### 2 · Cuatro sitios para guardar

<p><button type="button" class="ir-a" data-t="125">▶ Ir a 2:05</button></p>

- **docs/extensions.md · State:** Cuatro sitios — Se elige según cómo participa el estado en la conversación.
- **Cuatro sitios para guardar**
  - `details` · Sigue a la rama: en el resultado de la herramienta
- **Cuatro sitios para guardar**
  - `details` · Sigue a la rama: en el resultado de la herramienta
  - `appendEntry` · Duradero, invisible: entrada custom en el árbol
- **Cuatro sitios para guardar**
  - `details` · Sigue a la rama: en el resultado de la herramienta
  - `appendEntry` · Duradero, invisible: entrada custom en el árbol
  - `sendMessage` · Lo ve el modelo: cuesta tokens
- **Cuatro sitios para guardar**
  - `details` · Sigue a la rama: en el resultado de la herramienta
  - `appendEntry` · Duradero, invisible: entrada custom en el árbol
  - `sendMessage` · Lo ve el modelo: cuesta tokens
  - `externo` · Fuera de la sesión: fichero o base de datos
- **Dos formas de leer**
  - `getEntries()` · Todo el fichero: todas las ramas
  - `getBranch()` · La rama activa: de la raíz a donde estás
- **La regla:** Reconstruye con get branch — Las ramas abandonadas son historias alternativas.

### 3 · Details: el estado que viaja con la herramienta

<p><button type="button" class="ir-a" data-t="266">▶ Ir a 4:26</button></p>

- **Promesa del vídeo 08:** details en el pie — ejecutar_tests ya devolvía cuántas pasan y cuántas fallan.
- *En la demo:* git diff tests.ts
- *En la demo:* session_start y session_tree
- *En la demo:* ¿Pasan los tests del carrito?
- *En la demo:* ¿Y los del envío?
- *En la demo:* /tree
- *En la demo:* Sin resumen
- **details:** El árbol hace el trabajo difícil — El estado ya estaba en los resultados de la herramienta.

### 4 · Append entry: aprobaciones que se recuerdan

<p><button type="button" class="ir-a" data-t="405">▶ Ir a 6:45</button></p>

- **Las decisiones no son resultados**
  - `tool_call` · Antes de ejecutar: edit, write, bash…
  - `appendEntry` · Guardar aparte: el modelo no lo ve
- *En la demo:* git diff permisos.ts
- *En la demo:* getEntries(): a propósito
- *En la demo:* Permitir siempre en esta sesión
- *En la demo:* /reload: el estado sobrevive
- **Cuidado:** Funciona en la prueba que hiciste — Así llega este fallo a producción.

### 5 · El fallo típico: rebobinar

<p><button type="button" class="ir-a" data-t="546">▶ Ir a 9:06</button></p>

- *En la demo:* /tree al mensaje del README
- *En la demo:* Primer síntoma
- *En la demo:* Los ficheros no se rebobinan
- *En la demo:* Sin diálogo
- *En la demo:* /reload no lo arregla
- **El fallo típico**
  - `getEntries()` · Todas las ramas: en lugar de la activa
  - `session_tree` · Sin escuchar: solo se reconstruye al arrancar
- **No es estético:** Es un fallo de seguridad — Una aprobación de una historia que ya no existe autoriza acciones en la actual.

### 6 · El arreglo, y por qué funciona

<p><button type="button" class="ir-a" data-t="697">▶ Ir a 11:37</button></p>

- *En la demo:* El arreglo
- **Por qué funciona:** appendEntry (cuelga del punto actual) → /tree (la entrada queda en la otra rama) → getBranch (ya no la ve)
- *En la demo:* /reload con el arreglo
- *En la demo:* El diálogo vuelve
- *En la demo:* El pie sigue a la rama
- *En terminal:* Las entradas custom en el fichero de la sesión (más abajo, en «Código y comandos»)
- **El resto de casos**
  - `/new` · Vacío: todo a cero
  - `/resume` · session_start: reconstruye
  - `/fork` · Copia el camino: motivo fork
  - `compactar` · No borra: entradas del fichero
- **De la misma familia**
  - `setLabel` · Etiquetas: visibles en /tree
  - `registerEntryRenderer` · Dibujar: tus entradas custom
- **La lección:** estado = f(rama) — Recargar, retomar, bifurcar y rebobinar pasan a ser el mismo caso.

### 7 · Un paquete de Pi

<p><button type="button" class="ir-a" data-t="900">▶ Ir a 15:00</button></p>

- **Un paquete de Pi lleva**
  - `ts` · Extensiones
  - `SKILL` · Skills
  - `/` · Prompts
  - `json` · Temas
- **Cómo decir qué contiene**
  - `carpetas` · Convención: extensions, skills, prompts, themes
  - `"pi"` · Manifiesto: rutas en package.json
- *En la demo:* package.json
- *En la demo:* peerDependencies: "*"
- **Dependencias**
  - `dependencies` · Otras librerías: npm y git las instalan
  - `local` · Ruta local: npm install es cosa tuya
- *En la demo:* pi install · pi list
- *En la demo:* settings.json
- **Paquete local:** No se copia — Pi lo carga desde donde está: sigues editando y usando barra reload.
- *En la demo:* pi, sin -e

### 8 · Elegir, instalar y publicar

<p><button type="button" class="ir-a" data-t="1105">▶ Ir a 18:25</button></p>

- *En la demo:* command pi config
- *En la demo:* settings.json
- *En la demo:* /ho
- *En terminal:* settings.json · filtrar los recursos de un paquete (más abajo, en «Código y comandos»)
- *En terminal:* Quitar o probar sin instalar (más abajo, en «Código y comandos»)
- *En terminal:* Orígenes de un paquete (más abajo, en «Código y comandos»)
- **Identidad de un paquete**
  - `npm` · El nombre
  - `git` · El repositorio: sin la versión
  - `local` · Ruta absoluta
- **Ámbitos**
  - `usuario` · Ajustes personales: settings.json del agente
  - `-l` · Proyecto: solo con confianza (vídeo 05)
- **Publicar (solo explicado)**
  - `git` · Etiqueta: pi install git:…@v1
  - `npm` · npm publish
  - `pi-package` · Galería: pi.dev/packages
- **El apunte honesto:** Instalar un paquete es ejecutar código ajeno — Lee el código, fija versiones y revisa actualizaciones.

### 9 · Cierre

<p><button type="button" class="ir-a" data-t="1321">▶ Ir a 22:01</button></p>

- **Repaso: dónde va el estado**
  - `details` · Herramienta: sigue a la rama
  - `appendEntry` · Duradero: el modelo no lo ve
  - `sendMessage` · Para el modelo
  - `externo` · Fuera: de la sesión
- **El fallo típico:** get entries y sin session tree — Una rama abandonada sigue mandando.
- **Repaso: paquetes**
  - `"pi"` · Manifiesto: peerDependencies "*"
  - `install` · Ruta, npm o git: list · config · remove
  - `publish` · Publicar: npm o etiqueta git
- **La práctica:** Rómpela (get entries + /tree) → Arréglala (get branch + session_tree) → Empaquétala (pi install · pi config)
- **Próximo vídeo:** Pi programático — pi -p en scripts y CI, modo JSON, RPC y el SDK.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Las entradas custom en el fichero de la sesión

```text
jq -c 'select(.type=="custom")' <fichero de la sesión>.jsonl
{"type":"custom","id":"…","parentId":"…","customType":"permisos","data":{"que":"edit README.md","decision":"siempre"}}
```

- `select(.type=="custom")`: Filtra
- `"customType":"permisos"`: Nuestras
- `"parentId"`: Dónde cuelga

### settings.json · filtrar los recursos de un paquete

```text
{ "source": "npm:@ejemplo/pi-tools",
  "extensions": ["extensions/*.ts", "!extensions/legacy.ts"],
  "skills": [],
  "prompts": ["prompts/review.md"] }
```

- `"extensions"`: Patrones
- `"skills": []`: Ninguna
- `!extensions/legacy.ts`: Excluir

### Quitar o probar sin instalar

```text
pi remove ~/csn/extensiones
pi -e npm:@ejemplo/pi-tools        # solo esta ejecución
```

- `pi remove`: Quita la entrada
- `pi -e npm:`: Probar

### Orígenes de un paquete

```text
pi install npm:@ejemplo/pi-tools@1.0.0
pi install git:github.com/ejemplo/pi-tools@v1
pi install ./pi-tools
pi update --extensions      # no mueve versiones fijadas
```

- `npm:`: npm
- `git:`: git
- `--extensions`: Actualizar paquetes

## Fuentes

- Documentación instalada de Pi 1.0.1 (`$(npm root -g)/@earendil-works/pi-coding-agent/docs/`): `extensions.md`
  (secciones *Add it to Pi*, *Context and session changes*, *State*), `packages.md` (entero), `session-format.md`
  (`CustomEntry`, `CustomMessageEntry`, `LabelEntry`, *Tree Structure*), `sessions.md` (*Choose how to branch*),
  `cli.md` (*Resources*, *Package commands*, *Update Pi or packages*), `configuration.md` (rutas de `settings.json`).
- Tipos: `dist/core/extensions/types.d.ts` (`SessionStartEvent.reason` = `startup | reload | new | resume | fork`,
  `SessionTreeEvent`, `appendEntry`, `setLabel`, `registerEntryRenderer`, `sendMessage`) y
  `dist/core/session-manager.d.ts` (`getBranch`, `getEntries`, `ReadonlySessionManager`).
- Ejemplos instalados: `examples/extensions/todo.ts` (estado en `details`, reconstrucción con `getBranch` en
  `session_start` y `session_tree`), `bookmark.ts` (`pi.setLabel` y etiquetas en `/tree`), `with-deps/` (paquete con
  `dependencies` propias y manifiesto `pi.extensions`).
- `pi install --help` y `pi config --help` (Pi 1.0.1).
- Vídeos anteriores: 03 (`/tree`, los ficheros no se rebobinan, «Summarize branch?»), 05 (confianza de proyecto),
  06 (prometió los paquetes para este vídeo), 08 (`permisos.ts`, `tests.ts`, `hola.ts`; prometió `details`, estado que
  sobrevive a `/reload` y paquetes con dependencias).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo que se pierde**

Terminamos el vídeo anterior con un modo de aprobación hecho a mano. Un evento tool call, un diálogo con tres opciones y dos contadores en el pie. Funcionaba, pero tenía un punto débil que vimos en directo: al hacer barra reload, el pie desaparecía, los contadores volvían a cero y lo que habías permitido para siempre se olvidaba. Y con barra new, lo mismo.

No era un error de nuestro código. Era el diseño. Barra reload no actualiza la extensión en caliente: tira todo el entorno de extensiones y lo vuelve a crear. Lo que vivía en variables de la factoría desaparece con él. Si algo tiene que sobrevivir, hay que guardarlo en algún sitio que no sea la memoria del proceso.

La respuesta rápida sería un fichero en disco. Pero en Pi hay una complicación. Recuerda el vídeo tres: la sesión no es una lista, es un árbol. Con barra tree vuelves a un punto anterior y sigues por otro camino, y la rama que dejas sigue ahí, en el mismo fichero.

Piensa en lo que significa eso para nuestro modo de aprobación. Si en una rama permitiste algo para siempre, y vuelves atrás a un punto en el que todavía no lo habías permitido, ¿debería seguir permitido? La respuesta correcta es que no. En esa historia, nadie ha aprobado nada. El estado de una extensión bien hecha depende de la rama en la que estás, no de todo lo que ha pasado en el fichero.

De eso va la primera mitad del vídeo: dónde guardar el estado, cómo reconstruirlo desde la rama activa, y el fallo típico al hacerlo, que vamos a provocar a propósito. En la segunda mitad empaquetamos las tres extensiones del vídeo ocho como un paquete de Pi, lo instalamos, elegimos qué se carga con pi config, y vemos cómo se publica.

**2 · Cuatro sitios para guardar**

La documentación de extensiones tiene una tabla muy corta en la sección de estado, y conviene aprendérsela, porque decide casi todo. Hay cuatro sitios, y se elige según cómo participa ese estado en la conversación.

Primero, el estado de una herramienta que debe seguir a la rama activa: va en details, en el resultado de la herramienta. Ya lo conoces del vídeo ocho. Content es lo que lee el modelo, y details son datos estructurados para ti que se guardan en la sesión junto al resultado. Como el resultado es una entrada del árbol, si vuelves atrás, ese details queda fuera de tu rama, sin hacer nada especial.

Segundo, datos duraderos que no deben entrar en el contexto del modelo: pi punto append entry. Le das un tipo propio, un nombre que identifique a tu extensión, y unos datos en JSON. Pi lo guarda como una entrada de tipo custom, colgada del punto actual del árbol. El modelo nunca la ve. Es el sitio para decisiones del usuario, preferencias o marcas que tu extensión necesita recordar.

Tercero, contenido propio que sí debe llegar al modelo: pi punto send message. Se guarda como un mensaje personalizado, puede verse en la pantalla o no, y entra en el contexto como cualquier otro mensaje. Úsalo con cuidado, porque cada uno cuesta tokens en todas las peticiones siguientes.

Y cuarto, lo que tiene que vivir fuera de una sesión: almacenamiento externo, un fichero o una base de datos tuya. Por ejemplo, una lista de comandos aprobados para todo un proyecto. Eso ya no depende de ninguna rama, y por eso no va en la sesión.

Las tres primeras opciones tienen algo en común: todo queda en el fichero JSONL de la sesión, con su identificador y el de su padre. Eso es lo que permite rebobinar. Pero también es la trampa. Para leer ese estado, el gestor de sesión te ofrece dos métodos que se parecen mucho. Get entries devuelve todas las entradas del fichero, de todas las ramas. Get branch devuelve solo el camino desde la raíz hasta el punto en el que estás.

La regla de la documentación es explícita: reconstruye el estado que depende de la rama con get branch, al arrancar la sesión, y no lo reconstruyas recorriendo todas las entradas del fichero, porque las ramas abandonadas son historias alternativas. Quédate con esa frase, porque en un momento vamos a romperla.

**3 · Details: el estado que viaja con la herramienta**

Empezamos por lo fácil, que además es una promesa del vídeo ocho. Nuestra herramienta ejecutar tests ya devolvía en details cuántas pruebas pasan y cuántas fallan. Hasta ahora no lo usábamos para nada. Vamos a ponerlo en el pie, y a que el pie siga a la rama.

En la otra pestaña, el diff de tests punto ts. Hay una función nueva, reconstruir, copiada en su forma del ejemplo todo punto ts que trae Pi. Recorre get branch, se queda con las entradas de tipo mensaje cuyo rol es tool result y cuya herramienta es ejecutar tests, y la última que encuentra es la que vale. Con sus details, escribe en el pie cuántas pasan y cuántas fallan.

¿Cuándo se llama? En dos eventos. Session start, que llega al arrancar, al recargar, al empezar una sesión nueva, al retomar una y al bifurcar. Y session tree, que llega después de moverte con barra tree. Este segundo no lo menciona la sección de estado, pero el ejemplo todo lo escucha, y tiene sentido: moverte por el árbol no recarga las extensiones, así que session start no llega, y si no escuchas session tree, tu estado en memoria se queda en la rama que acabas de dejar.

Arrancamos Pi en la tienda con las dos extensiones, tests y permisos, cargadas con guion e. Preguntamos si pasan los tests del carrito. El modelo mira primero qué ficheros de test hay y después usa nuestra herramienta con el del carrito. En el pie aparece el resultado: doce pasan, cero fallan. Preguntamos por los del envío, y el pie cambia a su recuento: tres pasan, cero fallan.

Ahora, barra tree. Pi nos enseña el árbol de la sesión, con cada mensaje y cada llamada a herramienta, y elegimos nuestro segundo mensaje, el del envío. Pi pregunta si queremos resumir la rama que dejamos, y elegimos no summary, porque un resumen es una llamada al modelo y no la necesitamos. El texto del mensaje vuelve al editor. Y fíjate en el pie: ha vuelto a doce pasan. En este punto de la historia, la última ejecución de los tests fue la del carrito.

No hemos guardado nada aparte. El estado estaba en los resultados de la herramienta, que ya son parte del árbol, y la función reconstruir solo tiene que leer la rama. Por eso details es la primera opción para el estado de una herramienta: el árbol hace el trabajo difícil por ti.

**4 · Append entry: aprobaciones que se recuerdan**

Con los permisos no podemos hacer lo mismo. La decisión de aprobar o bloquear no es el resultado de una herramienta nuestra. Ocurre en el evento tool call, antes de que la herramienta se ejecute, y la herramienta puede ser cualquiera: edit, write, bash. Así que guardamos cada decisión aparte, con append entry. Además, es justo lo que queremos: el modelo no necesita saber qué hemos aprobado, y no debe gastar contexto en ello.

En la pestaña de extensiones, el diff de permisos punto ts. Después del diálogo, una línea nueva: pi punto append entry, con el tipo permisos, y como datos, la acción y la decisión: una vez, siempre o bloquear. Y una función reconstruir que vacía el conjunto de lo permitido y los contadores, recorre las entradas de la sesión, se queda con las de tipo custom que son nuestras, vuelve a contar y pinta el pie. La llamamos en session start.

Si te fijas, hay algo distinto respecto a la función de los tests. Aquí recorremos get entries, no get branch. Lo hemos escrito así a propósito, porque es el error más natural del mundo: quieres recuperar todo lo que la extensión guardó, y pides todas las entradas. Y de momento, no escuchamos session tree.

Barra reload para cargar la versión nueva. El pie de permisos aparece a cero, junto al de los tests. Le pedimos lo mismo que en el vídeo ocho: una sección corta en el README sobre los tests. El modelo lista los ficheros y lee el README sin preguntar, porque son comandos de lectura, y cuando llega a la edición aparece el diálogo, con el cambio propuesto encima. Esta vez elegimos permitir siempre en esta sesión. El modelo termina, y en el pie leemos una aprobada, cero bloqueadas.

Y ahora, la prueba que en el vídeo ocho fallaba: barra reload. El entorno de extensiones se destruye y se vuelve a crear, la factoría arranca de cero, session start llama a reconstruir, que lee nuestras entradas del fichero, y el pie vuelve con una aprobada. El estado ha sobrevivido a la recarga. Y también sobreviviría a cerrar Pi y retomar la sesión con barra resume, porque está en el fichero.

Hasta aquí, todo parece correcto. Y es exactamente así como este fallo llega a producción: funciona en la prueba que hiciste.

**5 · El fallo típico: rebobinar**

Volvemos atrás. Barra tree, y en el árbol ya se ven dos ramas que salen de la respuesta del carrito: la del envío y la del README. Elegimos el mensaje del README, el que pedía la sección de tests, y otra vez sin resumen. El texto vuelve al editor. Estamos en el punto anterior a esa petición: en esta historia, todavía no le hemos pedido nada al modelo sobre el README, y por tanto nadie ha aprobado ninguna edición.

Pero el pie sigue diciendo una aprobada. Primer síntoma. Moverse por el árbol no recarga la extensión, nadie ha llamado a reconstruir, y las variables siguen como estaban en la otra rama.

Antes de repetir la petición, un detalle que ya conoces del vídeo tres: barra tree mueve la conversación, no tus ficheros. El README del disco sigue con la sección que añadió el modelo. Así que en la otra pestaña lo devolvemos a su estado con git checkout. Ahora el disco y la conversación vuelven a contar la misma historia.

Pulsamos Enter con el mismo texto. El modelo lee el README y prepara una edición parecida. Y no aparece ningún diálogo. La edición pasa directamente, el modelo comprueba el resultado y los tests, y nos dice que ha terminado. Pasa porque el conjunto de lo permitido para siempre todavía contiene edit README punto md, que se aprobó en una rama que ya no es la nuestra.

Quizá pienses que barra reload lo arregla, porque vuelve a construir el estado desde el fichero. Probémoslo. Barra reload, y el pie sigue diciendo una aprobada. La recarga ha leído el fichero entero con get entries, y en el fichero sigue estando la entrada de la rama abandonada. Ni la memoria ni el disco nos salvan, porque estábamos leyendo la historia equivocada.

Este es el fallo típico, y tiene dos mitades. La primera: reconstruir desde todas las entradas del fichero en lugar de desde la rama activa. La segunda: reconstruir solo al arrancar y no al moverte por el árbol. Cada una por separado ya basta para que el estado mienta.

Y en una extensión de permisos no es un detalle estético. Es un fallo de seguridad. Una aprobación de una historia que ya no existe sigue autorizando acciones en la historia actual. En una extensión de tareas pendientes verías una lista equivocada. En la nuestra, el modelo edita un fichero sin preguntarte. Cuanto más importante sea el estado, más importa leerlo de la rama correcta.

**6 · El arreglo, y por qué funciona**

El arreglo cabe en dos líneas, y lo vemos en el diff. Get entries pasa a ser get branch. Y añadimos pi punto on session tree, que llama a la misma función reconstruir. Aprovechamos para cambiar el texto de la opción: ya no dice permitir siempre en esta sesión, sino en esta rama, que es lo que de verdad hace.

¿Por qué funciona? Cuando append entry guarda una decisión, la entrada se cuelga del punto actual del árbol, igual que un mensaje. Al volver atrás con barra tree, esa entrada queda en la rama que dejas, y get branch, que solo recorre el camino desde la raíz hasta donde estás, ya no la ve. No hay que borrar nada ni llevar la cuenta de nada: el árbol ya sabe qué pertenece a cada historia.

Lo probamos. Restauramos otra vez el README y, en Pi, barra reload para cargar el arreglo. Seguimos en la rama donde la edición pasó sin preguntar, y el pie ya dice la verdad: cero aprobadas, cero bloqueadas. En esta rama nadie aprobó nada. Ahora barra tree al mensaje del README, sin resumen, y Enter. El modelo lee el fichero, prepara la edición, y esta vez aparece el diálogo, con la opción nueva: permitir siempre en esta rama. Permitimos, una sola vez, y el pie sube a una aprobada.

Y el viaje entre ramas. Abrimos barra tree, y ahora el árbol tiene tres ramas con la petición del README: la del permitir siempre, la de la edición sin diálogo y la que acabamos de hacer. Saltamos a la respuesta final de la segunda, sin resumen, y el pie cambia al momento a cero aprobadas, porque en esa historia nadie aprobó nada. No hay recarga de por medio: es session tree el que avisa y reconstruir el que vuelve a contar. El estado sigue a la rama en cada salto, que es lo que queríamos desde el principio.

Si quieres verlo con tus propios ojos, abre el fichero de la sesión, cuya ruta te da barra session, y filtra con jq las entradas de tipo custom. Cada una lleva el tipo permisos, nuestros datos, su propio identificador y el de su padre. Ese identificador del padre es todo el secreto: dice en qué punto de qué rama se tomó cada decisión.

El resto de casos salen solos con este diseño. Barra new empieza un fichero vacío, así que get branch no devuelve nada y todo empieza a cero, como vimos en el vídeo ocho. Barra resume y barra reload llaman a session start, que reconstruye. Barra fork crea una sesión nueva copiando el camino hasta el punto elegido, y session start llega con el motivo fork. Y la compactación cambia lo que ve el modelo, pero no borra entradas del fichero.

Dos herramientas más de la misma familia, por si las necesitas. Pi punto set label pone una etiqueta a una entrada, que luego ves y filtras en barra tree; el ejemplo bookmark punto ts la usa para marcar respuestas. Y register entry renderer te deja dibujar tus entradas custom en la conversación, si quieres que la persona las vea. Aun así, siguen sin llegar al modelo.

La lección general va más allá de los permisos. El estado de una extensión debería poder calcularse a partir de la rama: una función que recorre get branch y devuelve el estado. Si la escribes así, recargar, retomar, bifurcar y rebobinar son el mismo caso, y ninguno es especial.

**7 · Un paquete de Pi**

Ya tenemos tres extensiones que nos gustan: hola, tests y permisos. Hasta ahora las cargábamos con guion e o copiándolas a la carpeta del agente. Eso funciona para ti, en tu máquina. Para compartirlas con tu equipo, tenerlas en varias máquinas o versionarlas, Pi tiene los paquetes. Lo anunciamos en el vídeo seis: un paquete puede llevar extensiones, skills, prompt templates y temas, todo junto.

Un paquete de Pi es un directorio normal, o un paquete de npm normal, con un package punto json. Hay dos formas de decirle a Pi qué contiene. La más sencilla es por convención: carpetas llamadas extensions, skills, prompts y themes, y Pi descubre lo que hay dentro. La otra es un manifiesto: una clave pi dentro del package punto json, con la lista de rutas de cada tipo.

Nuestro repositorio tiene los tres ficheros en la raíz, no en una carpeta extensions, así que la convención no los encontraría. Por eso usamos el manifiesto. En la pestaña de extensiones, cat package punto json. Un nombre, csn extensiones, una versión, la palabra clave pi package, y la clave pi con sus extensiones: hola, tests y permisos.

Y luego, las dependencias, que es la otra promesa del vídeo ocho. Nuestras extensiones importan el paquete de Pi y TypeBox. Esos los pone Pi: el agente de código, el núcleo del agente, la librería de modelos, la de la interfaz de terminal y TypeBox. La documentación dice que se declaran en peer dependencies, con un asterisco como versión, y nunca en dependencies. Si los metes como dependencia normal, tu paquete llevaría su propia copia, y Pi podría acabar con clases y registros duplicados. Pi incluso te avisa si lo detecta.

Cualquier otra librería de npm sí va en dependencies. El ejemplo with deps que trae Pi lo enseña con una librería pequeña para leer duraciones. Cuando instalas un paquete desde npm o desde git, Pi instala sus dependencias. Cuando lo instalas desde una ruta local, no toca nada: las dependencias son responsabilidad tuya, con un npm install en esa carpeta.

Salimos de Pi para instalarlo. Command pi install y la ruta del repositorio. Usamos command pi, como en el vídeo siete, porque nuestro alias no admite subcomandos. Pi responde installing y luego installed, y con command pi list lo vemos en la lista de paquetes del usuario, con la ruta tal como la guarda y la ruta absoluta debajo. Si miramos el settings punto json del directorio del agente, aparece una entrada nueva en packages: la ruta, escrita de forma relativa a ese directorio.

Un paquete local no se copia. Pi lo carga desde donde está, así que puedes seguir editando los ficheros y usar barra reload, igual que antes. Por eso instalar en local es una forma cómoda de trabajar: tienes tus extensiones siempre cargadas sin dejar de desarrollarlas.

Arrancamos pi, ya sin guion e. En la lista del arranque están las tres extensiones del paquete: hola, permisos y tests. Barra hola Ana saluda, y el pie de permisos está en su sitio, a cero, porque es una sesión nueva. Y un aviso práctico: si tienes el paquete instalado, no cargues además la misma extensión con guion e o desde la carpeta del agente, porque podría registrarse dos veces.

**8 · Elegir, instalar y publicar**

Instalar un paquete no te obliga a usarlo entero. Command pi config abre una pantalla con todos los recursos que Pi ha descubierto: arriba nuestro paquete con sus tres extensiones, y abajo las integradas, codemode, llama punto cpp, MCP y tool search, que también se pueden desactivar. Si tienes skills personales, salen en medio. Nos colocamos en hola y, con la barra espaciadora, la desactivamos. Con Tab se cambia de ámbito, del personal al del proyecto, y con guion l arrancas directamente en el del proyecto.

Al salir, miramos otra vez el settings punto json. La entrada del paquete ya no es una ruta suelta: es un objeto con el origen y una lista de extensiones con una sola línea, menos hola punto ts. Arrancamos Pi, la lista del arranque ya solo tiene permisos y tests, y si escribimos barra ho en el selector, hola no aparece.

Lo mismo se puede escribir a mano. En lugar de solo la ruta del paquete, pones un objeto con el origen y, para cada tipo de recurso, qué cargar. Omitirlo lo carga todo, una lista vacía no carga nada, puedes excluir con un signo de exclamación delante de un patrón, y quitar una ruta concreta con un signo menos, que es lo que ha escrito pi config. Los filtros solo estrechan: no pueden cargar algo que el paquete no declare.

Para quitarlo, command pi remove con la misma ruta, que borra también su entrada de los ajustes. Y si quieres probar un paquete de otra persona sin instalarlo, guion e también acepta un paquete de npm: se carga solo para esa ejecución.

Ahora, los orígenes. Además de una ruta local, pi install acepta npm, con el prefijo npm dos puntos, y git, con git dos puntos o una URL de GitHub. Si indicas una versión en npm, o una etiqueta o un commit en git, queda fijada. Pi update guion guion extensions pone al día los paquetes, pero no mueve una versión que hayas fijado. Y ojo con pi update a secas, que actualiza Pi, no tus paquetes.

Un detalle que evita sorpresas: Pi identifica cada paquete por su nombre en npm, por la dirección del repositorio en git, sin la versión, y por la ruta absoluta en local. Así, aunque declares el mismo paquete de dos formas equivalentes, no se carga dos veces. Y cada paquete instalado carga sus módulos por separado, así que no cuentes con que dos paquetes compartan una misma dependencia.

Todo lo que hemos hecho escribe en tus ajustes personales. Con guion l, el paquete se declara en el punto pi barra settings punto json del proyecto, para que todo el equipo lo tenga al abrir el repositorio. Pero recuerda el vídeo cinco: esos paquetes solo se instalan y se cargan cuando concedes confianza al proyecto.

Publicar no lo vamos a hacer en la demo, porque publica cosas en tu cuenta, pero el camino es corto. Para git, subes el repositorio y creas una etiqueta de versión, y los demás lo instalan con pi install git y la etiqueta. Para npm, un npm publish normal. La palabra clave pi package, que ya pusimos, hace que el paquete pueda aparecer en la galería de pi punto dev barra packages, y los campos image y video de la clave pi añaden una vista previa.

Y el apunte honesto, que con paquetes es más importante que nunca. Instalar un paquete es ejecutar el código de otra persona dentro de Pi, con tus permisos, y además puede traer skills que le dicen al modelo que ejecute programas. Lee el código antes de instalarlo, fija las versiones, y revisa las actualizaciones como revisarías una dependencia de tu proyecto. Y antes de dar confianza a un repositorio, mira qué paquetes declara. Lo que vimos sobre aislamiento sigue valiendo.

**9 · Cierre**

Repasemos. El estado de una extensión va donde le corresponde según su relación con la conversación. Details, para el estado de una herramienta que sigue a la rama. Append entry, para datos duraderos que el modelo no ve. Send message, para lo que sí debe ver. Y almacenamiento externo, para lo que vive fuera de una sesión. Ese estado se reconstruye con get branch, en session start y en session tree.

El fallo típico tiene dos mitades: leer todas las entradas del fichero con get entries, y no escuchar la navegación por el árbol. Las dos hacen que una rama abandonada siga mandando. En una extensión de permisos, eso significa aprobaciones que nadie dio en esta historia.

Y para compartir, un paquete: un package punto json con la clave pi, las dependencias de Pi en peer dependencies, pi install desde una ruta, npm o git, pi list, pi config para elegir qué se carga y pi remove. Publicar es un npm publish o una etiqueta en git, con la palabra clave pi package para la galería.

La práctica: toma tu extensión de permisos del vídeo anterior y guarda las decisiones con append entry. Escríbela primero mal, con get entries, y provoca el fallo tú mismo con barra tree. Después arréglala con get branch y session tree, y compruébalo en las dos direcciones del árbol. Para terminar, conviértela en un paquete con su package punto json, instálala en local y desactiva con pi config lo que no uses.

En el próximo vídeo sacamos a Pi de la terminal interactiva: pi guion p en scripts y en integración continua, el modo JSON, el modo RPC y el SDK con create agent session. Nos vemos allí.

</details>

