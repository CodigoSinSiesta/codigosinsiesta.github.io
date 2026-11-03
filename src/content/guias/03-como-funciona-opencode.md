---
title: "Vídeo 03 · Cómo funciona OpenCode"
description: "Un recorrido por la herramienta: la pantalla, elegir un modelo gratuito, los agentes plan y build, las peticiones de permiso, deshacer, parar y las sesiones."
ruta: "ia-desde-cero"
orden: 3
duracion: "11 min"
video: "03-como-funciona-opencode.mp4"
subtitulos: "/subtitulos/ia-desde-cero/03-como-funciona-opencode.es.vtt"
---

Primer recorrido por OpenCode dentro del laboratorio: qué hay en la pantalla, cómo elegir un modelo gratuito (y por qué mirar su privacidad), la diferencia entre los agentes plan y build, cómo responder a una petición de permiso, cómo deshacer y parar, y cuándo empezar una sesión nueva. Al final tienes una tabla con todos los atajos del vídeo.

<p class="guia__nota">Dura 11 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · La pantalla

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **Se abre en la terminal:** escribe `opencode` en la terminal del laboratorio. Lo que aparece es una *TUI* (una interfaz de texto dentro de la terminal) que se parece a un chat. Arriba, la conversación: lo que pides, lo que responde el agente y, entre medias, lo que va haciendo, como leer un fichero o ejecutar un comando. Abajo, la caja de texto; Enter envía.
- **Mira siempre la fila de debajo de la caja:** qué agente está activo, qué modelo usa y de qué *proveedor* viene (la empresa o el servicio que lo sirve).
- **El pie de la pantalla:** en cuanto conversas, enseña cuánto llevas ocupado de la memoria de trabajo del modelo, en porcentaje. Es la *ventana de contexto*, el tema del vídeo 04. Con un modelo de pago saldría también lo gastado; con los gratuitos no, porque no hay nada que cobrar.
- **Si te pierdes:** Ctrl+P abre la lista de todos los comandos, y puedes escribir para filtrarla. Una `/` al principio de la caja muestra los comandos que empiezan así. Para salir, `/exit`.

### 2 · Elegir un modelo gratuito

<p><button type="button" class="ir-a" data-t="102">▶ Ir a 1:42</button></p>

- **El selector de modelos:** `/models`, o Ctrl+X y luego M. Como el dial de una radio: el aparato es el mismo y cambias de emisora.
- **Reconocer los gratuitos sin saberte nombres:** cambian casi cada semana y son gratis por tiempo limitado, así que no te damos ninguno. En el selector llevan la etiqueta *Free* al lado, y casi todos acaban en `-free`. Cuando ya hayas usado varios, F2 salta al siguiente que usaste hace poco.
- **Elige por privacidad, no por velocidad:** cada modelo gratuito tiene sus condiciones. Algunos dicen que ni guardan ni usan para entrenar lo que les envías; otros pueden usarlo para mejorar el modelo o lo guardan un tiempo. Míralo en la tabla de modelos de [OpenCode Console](https://opencode.ai/v2/docs/console/models/) y elige uno de los que no guardan nada. Aun así, la regla del laboratorio sigue: solo el proyecto de prácticas.
- **El tope de mensajes:** los gratuitos tienen un tope que se reinicia cada cierto tiempo. Si te avisa de que lo has gastado, no has roto nada: el aviso dice a qué hora se reinicia. Como el tope es común a todos los gratuitos, cambiar de modelo no sirve; toca esperar.

### 3 · Dos agentes: build y plan

<p><button type="button" class="ir-a" data-t="199">▶ Ir a 3:19</button></p>

- **Dos agentes principales**, como en una obra: *plan* es la arquitecta, que lee tus ficheros, busca, piensa y te propone qué haría, pero no edita nada del proyecto; *build* es el albañil, que lee, edita, crea ficheros y ejecuta comandos. Build es el que está activo al abrir OpenCode.
- **Cambiar de uno a otro:** Shift+Tab. La fila de debajo de la caja te dice cuál está activo.
- **Comprobado en el laboratorio:** le pedimos a plan que añadiera una función, aprobándole todo automáticamente. No tocó ningún fichero: leyó el código, escribió el plan con la función y su prueba, y nos dijo que pasáramos a build para aplicarlo.
- **Plan no edita, pero puede ejecutar:** con los valores de serie de OpenCode lanza comandos sin preguntarte, y un comando también puede cambiar ficheros. En el laboratorio los comandos están en «preguntar», así que te lo pide y decides tú.

### 4 · La primera conversación

<p><button type="button" class="ir-a" data-t="281">▶ Ir a 4:41</button></p>

- **La primera pregunta, en plan:** «¿Qué hace este proyecto?». No responde de golpe: antes verás pasar lo que va haciendo (busca los ficheros, lee el README, el `package.json`, el código y las pruebas), a veces resumido en una línea. Y solo entonces responde.
- **Lo que respondió:** que es el laboratorio de prácticas de la ruta, una lista de la compra de juguete en JavaScript con tres funciones, dos pruebas y los precios en céntimos para no tener errores con los decimales. Correcto, y parte lo sacó del README: el agente lee también la documentación del repositorio, y lo que pone influye en cómo te lo cuenta.
- **Herramientas:** esos pasos intermedios (buscar, leer, ejecutar) son las herramientas del agente, que tienen su propio vídeo (05) y su guía (06). Por ahora: las ves pasar en la conversación, y en el laboratorio leer no pide permiso; actuar, sí.
- **`@` para señalar un fichero:** escribe `@` y el principio del nombre (`compra`), elige `compra.js` y queda adjunto a tu petición. El agente lo tiene delante desde el principio: cuando lo probamos, respondió sin ir a leer nada más.

### 5 · El primer cambio y el permiso

<p><button type="button" class="ir-a" data-t="367">▶ Ir a 6:07</button></p>

- **La petición de permiso:** en build le pedimos la función `quitar`, que quita un producto, con su prueba, y que ejecutara `npm test`. Para leer no preguntó; en cuanto quiso editar un fichero o ejecutar un comando, se detuvo y nos dijo qué quería hacer: qué comando o qué fichero, con el cambio a la vista. Léela siempre antes de responder, como el portero que te llama antes de dejar subir a alguien.
- **Tres respuestas** (el texto exacto puede variar un poco, pero son estas):

| Respuesta | Qué hace |
|---|---|
| Permitir una vez (*Allow once*) | Solo esto; la próxima vez vuelve a preguntar |
| Permitir siempre (*Always allow*) | Esto y lo que se parezca, sin volver a preguntar en este proyecto |
| Rechazar (*Reject*) | No lo hace |

- **En esta ruta, casi siempre «una vez»:** no porque el agente sea malo, sino porque estás aprendiendo y cada petición es una ventana para ver qué hace. Con «siempre», esa ventana se cierra para ese tipo de acción y dejas de verlo.
- **Rechazar no apaga al agente; le dice «así no».** Le negamos la edición y lo intentó por otro camino, escribiendo el fichero entero de nuevo. Se lo volvimos a negar, y al final nos dio el código para pegarlo a mano.
- **Con todo aprobado:** añadió `quitar`, una prueba nueva y ejecutó `npm test`: tres pruebas de tres. Leyó, editó, ejecutó y comprobó: ese orden es el bucle del agente, el tema del vídeo 05.

### 6 · Deshacer y parar

<p><button type="button" class="ir-a" data-t="476">▶ Ir a 7:56</button></p>

- **`/undo`** devuelve los ficheros a como estaban antes de tu última petición, y **`/redo`** lo vuelve a poner. Por debajo, OpenCode guarda fotos de tus ficheros en un sitio aparte, sin tocar tu historial de git; para eso el proyecto tiene que ser un repositorio git, y el laboratorio ya lo es.
- **Primer límite: deshace ficheros, no comandos.** Si el agente ejecutó algo que instaló un programa, borró algo fuera del proyecto o envió algo a internet, eso ya ha pasado. Es como la papelera: recupera el documento, no el correo que ya enviaste.
- **Segundo límite: el retroceso se queda fijo al enviar otra petición.** Mientras no escribas nada, puedes ir atrás y adelante con `/undo` y `/redo`; en cuanto mandas un mensaje nuevo, lo deshecho ya no se puede rehacer. Tu red de seguridad de verdad es git, con la rama de cada guía.
- **Parar antes de que termine:** Esc interrumpe al agente a mitad de trabajo y te devuelve el control (mientras trabaja, el pie te lo recuerda). Después le corriges con otra petición o deshaces lo que llegó a hacer.

### 7 · Sesiones y tu práctica

<p><button type="button" class="ir-a" data-t="560">▶ Ir a 9:20</button></p>

- **Sesión:** cada conversación con el agente. OpenCode las guarda solas, con su título y su fecha, así que puedes cerrar y volver otro día. `/new` empieza una sesión limpia; `/sessions` enseña la lista para retomar una anterior.
- **Tarea nueva, sesión nueva:** una sesión larga acumula todo lo hablado, y eso tiene un coste que se explica en el vídeo 04, junto con `/compact`, que resume la conversación para hacer sitio.
- **La app de escritorio:** si la terminal no es lo tuyo, OpenCode tiene app de escritorio. Las sesiones, los agentes y los permisos son los mismos, porque las dos se conectan al mismo servicio en segundo plano: cambia el aspecto, no el funcionamiento. En esta ruta trabajamos en la terminal del laboratorio.
- **Práctica:** en la rama `guia-03`, elige un modelo gratuito que no guarde lo que le envías. En plan, pregúntale qué hace el proyecto; luego señala `compra.js` con `@` y pídele que te lo explique. Pasa a build y pídele la función `quitar` con su prueba, leyendo cada permiso y aprobándolo «una vez». Para terminar, `/undo`, y comprueba que los ficheros vuelven a estar como al principio.

**Siguiente:** [Vídeo 04 · La ventana de contexto](/rutas/ia-desde-cero/04-la-ventana-de-contexto)

## Código y comandos

Los atajos y comandos del vídeo, para tenerlos a mano.

### Atajos de OpenCode

| Atajo o comando | Qué hace |
|---|---|
| `opencode` | Abre OpenCode en la carpeta actual |
| Enter | Envía la petición |
| Ctrl+P | Lista de todos los comandos; escribe para filtrar |
| `/` al principio de la caja | Los comandos que empiezan así |
| `/models` · Ctrl+X M | Elegir modelo |
| F2 | Pasar al siguiente modelo usado hace poco |
| Shift+Tab | Cambiar de agente (build ⇄ plan) |
| `@` + nombre | Adjuntar un fichero a la petición |
| Esc | Interrumpir al agente a mitad de trabajo |
| `/undo` · `/redo` | Deshacer y rehacer los cambios en ficheros de la última petición |
| `/new` · `/sessions` | Empezar una sesión nueva · retomar una anterior |
| `/compact` | Resumir la conversación para hacer sitio (vídeo 04) |
| `/exit` | Salir |

- Ctrl+X M significa: pulsa Ctrl+X, suelta y pulsa M.

## Fuentes

- [documentación de OpenCode](https://opencode.ai/v2/docs/): la interfaz, los agentes *build* y *plan*, las sesiones y `/undo`.
- [permisos de OpenCode](https://opencode.ai/v2/docs/permissions/): «Allow once», «Always allow» y «Reject».
- [modelos de OpenCode Console](https://opencode.ai/v2/docs/console/models/): qué modelos son gratuitos y qué hace cada uno con lo que le envías.
- El [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio), con los permisos en «preguntar».
- Todas las pantallas del vídeo son capturas reales de OpenCode en el laboratorio.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · La pantalla**

En el vídeo anterior montamos el laboratorio y comprobamos que la caja aguanta. Hoy abrimos OpenCode por primera vez. No vamos a ver todavía cómo funciona el agente por dentro; eso llega en los próximos vídeos. Hoy toca lo práctico. Es como sentarte por primera vez en un coche que no es el tuyo: antes de arrancar, miras dónde están los mandos.

Abre la terminal del laboratorio y escribe opencode. Lo que aparece se parece a un chat. Arriba está la conversación: lo que tú escribes, lo que responde el agente y, entre medias, lo que va haciendo, como leer un fichero o ejecutar un comando. Abajo está la caja de texto donde escribes tu petición, y la envías con Enter.

Dentro de la caja, justo debajo de lo que escribes, hay una fila pequeña que conviene mirar siempre: qué agente está activo, qué modelo usa y de qué proveedor viene. Y en el pie de la pantalla, en cuanto empiezas a conversar, verás cuánto llevas ocupado de la memoria de trabajo del modelo, en porcentaje. A esa memoria la llamaremos ventana de contexto, y es el tema del vídeo siguiente. Con un modelo de pago, ahí saldría también lo que llevas gastado; con los gratuitos no aparece, porque no hay nada que cobrar.

Si te pierdes, hay un atajo que lo resuelve casi todo: control pe. Abre la lista de todos los comandos, y puedes escribir para filtrarla. También puedes escribir una barra al principio de la caja de texto y ver los comandos que empiezan así. Y para salir de OpenCode, barra exit.

**2 · Elegir un modelo gratuito**

Lo primero es elegir con qué modelo trabajar. Escribe barra models, o pulsa control equis y luego la eme. Se abre un selector con todos los modelos que tienes disponibles. Piensa en él como en el dial de una radio: el aparato es el mismo, cambias de emisora.

Fíjate en que no te voy a decir ninguno por su nombre. Los modelos gratuitos de OpenCode cambian casi cada semana: salen unos, desaparecen otros, y todos son gratis por tiempo limitado. Si te diera un nombre, dentro de un mes este vídeo estaría mal. Lo que sí te enseño es a reconocerlos: en el selector, los gratuitos llevan la etiqueta free al lado, y casi todos también al final del nombre. Y cuando ya hayas usado varios, efe dos salta al siguiente que hayas usado hace poco.

Hay un segundo criterio, más importante que la velocidad: la privacidad. Cada modelo gratuito tiene sus condiciones. Algunos dicen que ni guardan ni usan para entrenar lo que les envías. Otros pueden usarlo para mejorar el modelo, o lo guardan un tiempo. OpenCode lo indica en su página de modelos, y la guía te dice dónde mirarlo. Elige uno de los que no guardan nada, y aun así recuerda la regla del laboratorio: solo el proyecto de prácticas, nunca código de tu empresa ni datos personales.

Y una cosa más. Los modelos gratuitos tienen un tope de mensajes que se reinicia cada cierto tiempo. Si un día te avisa de que has gastado los mensajes gratuitos, no has roto nada. El aviso te dice a qué hora se reinicia, y el tope es común a todos los gratuitos, así que cambiar de modelo no sirve: toca esperar.

**3 · Dos agentes: build y plan**

Ahora mira otra vez esa fila pequeña de la caja. Donde aparece el agente, verás build. OpenCode trae dos agentes principales, y la diferencia entre ellos es lo más importante de este vídeo. Piensa en una obra. La arquitecta mira, toma medidas y te dibuja un plano. El albañil coge el martillo.

Plan es la arquitecta. Lee tus ficheros, busca, piensa y te propone qué haría, pero no edita nada del proyecto. Build es el albañil: puede leer, editar, crear ficheros y ejecutar comandos. Para cambiar de uno a otro pulsas shift tabulador, y esa fila te dice cuál está activo.

Lo probamos en el laboratorio. Le pedimos a plan que añadiera una función a la lista de la compra, y le aprobamos todo automáticamente. No tocó ningún fichero. Leyó el código, escribió el plan con la función y su prueba, y nos dijo que cambiáramos a build para aplicarlo.

Pero ojo: que plan no edite no quiere decir que no ejecute. Con los valores de serie de OpenCode, plan puede lanzar comandos sin preguntarte, y un comando también puede cambiar ficheros. En nuestra prueba, lo primero que intentó plan fue listar la carpeta con un comando. En el laboratorio eso no pasa a escondidas, porque los comandos están en «preguntar»: te lo pedirá, y decides tú.

**4 · La primera conversación**

Vamos con la primera pregunta. Cambia a plan con shift tabulador y escribe: ¿qué hace este proyecto? Envíalo y mira la conversación. No responde de golpe. Antes verás pasar lo que va haciendo, a veces resumido en una sola línea: busca los ficheros del proyecto, lee el README, el package punto json, el código y las pruebas. Y solo entonces responde.

En nuestra prueba, respondió que es el laboratorio de prácticas de la ruta: una lista de la compra de juguete en JavaScript, con tres funciones, dos pruebas y los precios en céntimos para no tener errores con los decimales. Correcto. Y fíjate de dónde sacó parte de eso: del README. El agente lee también la documentación del repositorio, y lo que pone ahí influye en cómo te lo cuenta.

Esos pasos intermedios, buscar, leer, ejecutar, son las herramientas del agente. No hace falta entenderlas todavía: tienen su propio vídeo. Por ahora, quédate con dos cosas. Puedes verlas pasar en la conversación. Y en el laboratorio, leer no te pide permiso; actuar, sí.

A veces no quieres que busque: quieres señalarle un fichero concreto. Para eso está la arroba. Escribe arroba y empieza a escribir el nombre, por ejemplo compra. OpenCode te ofrece los ficheros que coinciden, eliges compra punto js y queda adjunto a tu petición. Así el agente lo tiene delante desde el principio. Cuando lo probamos, respondió directamente, sin ir a leer nada más.

**5 · El primer cambio y el permiso**

Ahora pasamos a build y le pedimos un cambio pequeño: añade a la lista una función quitar, que quite un producto, con su prueba, y ejecuta ene pe eme test. Aquí empieza lo interesante. Para leer no pregunta, pero en cuanto quiere editar un fichero o ejecutar un comando, se detiene y te pide permiso.

La petición te dice qué quiere hacer: qué comando quiere ejecutar o qué fichero quiere cambiar. Léela siempre antes de responder. Es como el portero de un edificio que te llama antes de dejar subir a alguien: te dice quién es y a qué viene, y tú decides si le abres.

Tienes tres respuestas. Permitir una vez: le dejas hacer esto, solo esto, y la próxima vez volverá a preguntar. Permitir siempre: le dejas hacerlo, y lo que se parezca, sin volver a preguntar en este proyecto. Y rechazar: no lo hace. El texto exacto puede variar un poco, pero las tres respuestas son estas.

En esta ruta, casi siempre vas a elegir «una vez». No porque el agente sea malo, sino porque estás aprendiendo, y cada petición de permiso es una ventana para ver qué está haciendo. Si eliges «siempre», esa ventana se cierra para ese tipo de acción, y dejas de verlo.

¿Y si rechazas? No tiene por qué pararse. En nuestra prueba le negamos la edición, y lo intentó por otro camino: escribir el fichero entero de nuevo. Volvió a pedir permiso, se lo volvimos a negar, y al final nos dio el código para pegarlo a mano. Rechazar no apaga al agente; le dice «así no».

Cuando se lo aprobamos todo, hizo justo lo que le pedimos. Añadió la función quitar, añadió una prueba nueva y ejecutó ene pe eme test: tres pruebas de tres, correctas. Fíjate en el orden: leyó, editó, ejecutó y comprobó. Ese orden tiene nombre, el bucle del agente, y lo veremos con calma en el vídeo cinco.

**6 · Deshacer y parar**

¿Y si el cambio no te gusta? Escribe barra undo. OpenCode devuelve los ficheros a como estaban antes de tu última petición. Si te arrepientes de haber deshecho, barra redo lo vuelve a poner. Por debajo, OpenCode guarda fotos de tus ficheros en un sitio aparte, sin tocar tu historial de git. Para eso necesita que el proyecto sea un repositorio git, y el laboratorio ya lo es.

Pero hay dos límites que tienes que conocer. El primero: barra undo deshace ficheros, no comandos. Si el agente ejecutó un comando que instaló algo, borró algo fuera del proyecto o envió algo a internet, eso ya ha pasado, y deshacer no lo devuelve. Es como la papelera del ordenador: recupera el documento, pero no el correo que ya enviaste.

El segundo límite: el retroceso se queda fijo en cuanto envías otra petición. Mientras no escribas nada, puedes ir atrás y adelante con undo y redo. En cuanto mandas un mensaje nuevo, lo deshecho ya no se puede rehacer. Por eso git sigue siendo tu red de seguridad de verdad, y en el laboratorio cada guía tiene su rama para volver a empezar.

Y a veces no quieres deshacer después, sino parar antes. Si ves que el agente se va por donde no quieres, pulsa escape. Lo interrumpe a mitad de trabajo y te devuelve el control. Después puedes corregirle con otra petición, o deshacer lo que llegó a hacer.

**7 · Sesiones y tu práctica**

Cada conversación con el agente es una sesión. OpenCode las guarda solas, con su título y su fecha, así que puedes cerrar y volver otro día. Barra new empieza una sesión limpia, y barra sessions te enseña la lista para retomar una anterior.

¿Cuándo empezar una nueva? Cuando cambies de tarea. Una sesión larga acumula todo lo hablado, y eso tiene un coste que veremos en el vídeo siguiente. Allí explicaremos también barra compact, que resume la conversación para hacer sitio. Por ahora, basta con saber que existe.

Y si la terminal no es lo tuyo, OpenCode tiene app de escritorio. Por dentro es lo mismo: las sesiones, los agentes y los permisos son los de la terminal, porque las dos se conectan al mismo servicio en segundo plano. Cambia el aspecto, no el funcionamiento. Aun así, en esta ruta trabajamos en la terminal del laboratorio.

Te propongo la práctica de este vídeo. Abre el laboratorio en la rama de la guía cero tres y elige un modelo gratuito que no guarde lo que le envías. En plan, pregúntale qué hace este proyecto. Luego señala compra punto js con la arroba y pídele que te lo explique. Pasa a build y pídele la función quitar con su prueba, leyendo cada permiso y aprobándolo «una vez». Y para terminar, barra undo, y comprueba que los ficheros vuelven a estar como al principio.

En el próximo vídeo miramos ese porcentaje del pie: la ventana de contexto, qué cabe en ella y por qué una sesión larga empieza a fallar antes de llenarse. Nos vemos allí.

</details>

