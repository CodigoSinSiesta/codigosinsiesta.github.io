---
title: "Vídeo 03 · Cómo funciona OpenCode"
description: "Un recorrido por la herramienta: la pantalla, elegir un modelo gratuito, los agentes plan y build, las peticiones de permiso, deshacer, parar y las sesiones."
ruta: "ia-desde-cero"
orden: 3
duracion: "11 min"
video: "03-como-funciona-opencode.mp4"
subtitulos: "/subtitulos/ia-desde-cero/03-como-funciona-opencode.es.vtt"
---

Un recorrido por la herramienta: la pantalla, elegir un modelo gratuito, los agentes plan y build, las peticiones de permiso, deshacer, parar y las sesiones.

<p class="guia__nota">Dura 11 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · La pantalla

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **Vídeo 03:** Antes de arrancar, mira los mandos — Hoy toca lo práctico: la pantalla, los agentes, los permisos y las sesiones
- *En la demo:* OpenCode recién abierto en el laboratorio
- *En la demo:* Arriba, la conversación; abajo, la caja de texto
- *En la demo:* Agente · modelo · proveedor, y en el pie el contexto ocupado

### 2 · Elegir un modelo gratuito

<p><button type="button" class="ir-a" data-t="102">▶ Ir a 1:42</button></p>

- *En la demo:* Los nombres cambian; la etiqueta Free, no · F2: el siguiente usado hace poco
- *En la demo:* El tope es común a todos los gratuitos: toca esperar a la hora que indica

### 3 · Dos agentes: build y plan

<p><button type="button" class="ir-a" data-t="199">▶ Ir a 3:19</button></p>

- **Una obra**
  - `plan` · La arquitecta: mira, mide y dibuja el plano
  - `build` · El albañil: coge el martillo
- **Plan no edita, pero puede ejecutar**
  - `de serie` · Sin preguntar: plan lanza comandos, y un comando puede cambiar ficheros
  - `laboratorio` · Te lo pide: los comandos están en «preguntar»: decides tú

### 4 · La primera conversación

<p><button type="button" class="ir-a" data-t="281">▶ Ir a 4:41</button></p>

- *En la demo:* Plan · «¿Qué hace este proyecto?»: busca y lee antes de responder
- **Lo que respondió**
  - `qué es` · Laboratorio de prácticas: el de la ruta
  - `código` · Lista de la compra: de juguete, en JavaScript
  - `detalle` · Precios en céntimos: sin errores con decimales
  - `fuente` · README.md: la documentación influye en la respuesta
- **Herramientas · vídeos 05 y 06:** Leer no pide permiso; actuar, sí — Buscar, leer y ejecutar: las ves pasar en la conversación
- *En la demo:* @compra: los ficheros que coinciden
- *En la demo:* Adjunto desde el principio: responde sin ir a leer nada más

### 5 · El primer cambio y el permiso

<p><button type="button" class="ir-a" data-t="367">▶ Ir a 6:07</button></p>

- *En la demo:* La petición real: editar src/compra.js, con el cambio a la vista
- *En la demo:* Allow once · Always allow · Reject
- **En esta ruta**
  - `una vez` · «Una vez»: ves cada acción
  - `siempre` · «Siempre»: la ventana se cierra y dejas de verlo
- **Rechazar no lo apaga:** edit (rechazado) → write (rechazado también) → El código (para pegarlo a mano)

### 6 · Deshacer y parar

<p><button type="button" class="ir-a" data-t="476">▶ Ir a 7:56</button></p>

- *En la demo:* /undo: los dos ficheros vuelven a como estaban
- **Segundo límite:** /undo ⇄ /redo (atrás y adelante) → Mensaje nuevo (queda fijo) → git (la rama de la guía)
- *En la demo:* Mientras trabaja, el pie te lo recuerda: esc interrumpe

### 7 · Sesiones y tu práctica

<p><button type="button" class="ir-a" data-t="560">▶ Ir a 9:20</button></p>

- *En la demo:* /sessions: las sesiones del proyecto, por fecha
- **/compact · vídeo 04:** Tarea nueva, sesión nueva — Una sesión larga acumula todo lo hablado
- **Dos aspectos, un funcionamiento**
  - `tui` · La terminal: la de esta ruta
  - `app` · App de escritorio: otro aspecto
  - `por dentro` · El mismo servicio: sesiones, agentes y permisos

## Fuentes

- [documentación de OpenCode](https://opencode.ai/v2/docs/): la interfaz, los agentes *build* y *plan*, las sesiones y `/undo`.
- [permisos de OpenCode](https://opencode.ai/v2/docs/permissions/): «Allow once», «Always allow» y «Reject».
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

