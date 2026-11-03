---
title: "Vídeo 04 · La ventana de contexto"
description: "Todo lo que el modelo tiene delante en cada petición, por qué no recuerda nada, por qué una sesión larga va peor y cuándo empezar otra o compactar."
ruta: "ia-desde-cero"
orden: 4
duracion: "10 min"
video: "04-la-ventana-de-contexto.mp4"
subtitulos: "/subtitulos/ia-desde-cero/04-la-ventana-de-contexto.es.vtt"
---

Por qué el agente «olvida», por qué una sesión larga acaba yendo peor y cuándo conviene empezar de cero. La ventana de contexto es todo lo que el modelo tiene delante al responder, y nada más. No recuerda nada entre peticiones: OpenCode le reenvía la conversación entera cada vez. Tiene un límite, pero el trabajo empeora antes de llenarla. Y para aligerarla hay dos herramientas: la sesión nueva y compactar. Lo medimos en el laboratorio.

<p class="guia__nota">Dura 10 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · El escritorio

<p><button type="button" class="ir-a" data-t="16">▶ Ir a 0:16</button></p>

- **Ventana de contexto:** todo lo que el modelo tiene delante en el momento de escribir su respuesta, medido en tokens (vídeo 01). Piensa en un escritorio: caben varios documentos a la vez (el enunciado de la tarea, un par de ficheros, tus notas), pero la mesa tiene un tamaño, y si quieres abrir otro y no cabe, tienes que guardar alguno.
- **La regla es estricta:** lo que está en la mesa existe para él; lo que no está, no existe. No hay un cajón donde mire por su cuenta ni una memoria aparte donde guarde lo de ayer.
- **Si un fichero no está en el escritorio, no lo conoce**, por mucho que esté en tu proyecto. Y entonces se imagina cómo es: es la falta de información que, como vimos en el vídeo 01, hace que se equivoque más.

### 2 · No recuerda: se le reenvía todo

<p><button type="button" class="ir-a" data-t="92">▶ Ir a 1:32</button></p>

- **El modelo no guarda nada entre una petición y la siguiente:** cada vez que le llega una, empieza con la mesa vacía.
- **Parece que recuerda porque OpenCode se lo reenvía todo:** en cada petición le vuelve a poner encima la conversación entera, lo que dijiste, lo que respondió y todo lo que leyó. Como un compañero sin memoria al que, antes de cada pregunta, le das el expediente desde la primera página: responde bien porque lo acaba de leer todo, pero lo ha leído otra vez.
- **Una pregunta tuya pueden ser varias peticiones:** si le pides que lea un fichero, el modelo hace una petición para pedir la lectura, OpenCode lee el fichero y hace otra petición, con el fichero ya encima, para responderte. En cada una viaja todo.
- **Dos consecuencias:** cuanto más larga es la conversación, más pesa cada petición, porque lleva todo lo anterior. Y lo que no esté en la conversación no lo sabe: si abres otra sesión, el expediente empieza en blanco.

### 3 · Qué hay encima de la mesa

<p><button type="button" class="ir-a" data-t="173">▶ Ir a 2:53</button></p>

- **Cuatro cosas viajan en cada petición:**
  1. **El manual del agente:** un texto largo que trae OpenCode y que le explica al modelo cómo debe trabajar y qué normas sigue (a menudo lo verás llamado *system prompt*). No lo escribes tú; se ve con calma en la guía 07.
  2. **La lista de herramientas**, cada una con su descripción: leer un fichero, buscar, editar, ejecutar un comando. Para pedir una herramienta, el modelo tiene que saber que existe.
  3. **Las instrucciones de tu proyecto:** si hay un fichero `AGENTS.md` (un texto con las normas de tu proyecto para el agente), OpenCode también lo pone en la mesa, en cada petición. El laboratorio todavía no tiene uno: lo escribirás en la guía 07.
  4. **La conversación**, con tu mensaje nuevo al final. Es lo que más crece: tus mensajes, sus respuestas y, sobre todo, lo que leen las herramientas. Cada fichero que abre el agente entra y se queda; uno pequeño apenas se nota, pero uno grande, o la salida larga de un comando, ocupa mucho de golpe.
- **Medido en el laboratorio:** en una sesión nueva le escribimos solo «hola», y al modelo le llegaron unos 5.500 tokens. Casi todo era el manual y las herramientas; el saludo, una parte diminuta. La mesa ya está ocupada cuando te sientas a trabajar.

### 4 · El límite y la mochila

<p><button type="button" class="ir-a" data-t="270">▶ Ir a 4:30</button></p>

- **El límite existe y depende del modelo:** unos admiten mucho más que otros, y las cifras cambian con cada versión. Una sesión con un agente se acerca a él antes de lo que crees, porque todo lo que lee se queda en la mesa.
- **Más importante que el límite: el trabajo empeora antes de llegar a él.** Los estudios miden que el rendimiento de los modelos baja a medida que crece lo que les envías, aun sin llenar la ventana (en «Fuentes»). Como una mochila a la que solo se le mete: al principio encuentras lo que buscas a la primera; con el tiempo, lo que necesitas está debajo de todo y cargas con peso que ya no sirve.
- **El ruido de una sesión larga:** ficheros que leyó y ya no importan, intentos que fallaron, caminos descartados. Todo compite por su atención con lo que importa ahora, y por eso a veces repite pasos que ya hizo, se contradice o pierde de vista lo que le pediste al principio.
- **La lección:** más contexto no siempre es mejor. Lo que quieres es una mesa con lo que hace falta para la tarea de ahora.

### 5 · Sesión nueva o compactar

<p><button type="button" class="ir-a" data-t="351">▶ Ir a 5:51</button></p>

- **Sesión nueva:** `/new`, o Ctrl+X y luego N. Despeja la mesa entera: el agente arranca otra vez solo con su manual, sus herramientas y las instrucciones de tu proyecto. La sesión anterior no se borra; vuelves a ella con `/sessions`.
- **Cuándo conviene:** cada vez que cambias de tarea (lo que leyó para arreglar un fallo ya es peso cuando pasas a otra cosa) y cuando notas que la sesión se enreda: repite, se contradice o vuelve a proponer algo que ya descartaste.
- **Lo que cuesta:** hay que volver a ponerla al día, y leerá otra vez los ficheros que necesite. Por eso, lo importante, guárdalo en ficheros del proyecto: lo que está en un fichero lo puede volver a leer; lo que solo estaba en la conversación se ha ido.
- **Compactar:** con `/compact`, OpenCode le pide al modelo un resumen de la conversación hasta ese momento, y a partir de ahí viaja el resumen en lugar de toda la conversación. Es vaciar la mochila y quedarte con una nota de lo que llevabas. OpenCode también compacta solo, sin que se lo pidas, cuando la ventana se acerca al límite.
- **Un resumen siempre pierde detalles:** un nombre exacto, un mensaje de error o una decisión tomada a mitad de camino pueden no sobrevivir. La regla: si cambia la tarea, sesión nueva; si sigues con la misma y la mesa está muy llena, compactar.

### 6 · Pruébalo: el pie de la pantalla

<p><button type="button" class="ir-a" data-t="453">▶ Ir a 7:33</button></p>

- **El pie de la pantalla** enseña cuánto contexto llevas ocupado, en tokens y en porcentaje de la ventana. Es el número del que habla todo el vídeo: tenlo siempre a la vista.
- **Lo que medimos** con el agente plan, en una sola sesión que lee ficheros uno detrás de otro (tokens que le llegan al modelo en la última llamada de cada petición):

| Petición | Tokens de entrada, aproximados |
|---|---|
| «hola», en una sesión nueva | 5.500 |
| + lee `src/compra.js` | 5.800 |
| + lee las pruebas y el README | 7.350 |
| + lee `.devcontainer/devcontainer.json` | 8.300 |

- **Sube cada vez que lee algo, y no baja.** Son ficheros pequeños; con los de un proyecto real, el salto es mucho mayor. Las cifras exactas cambian con cada modelo y versión: lo que se repite es la forma.
- **La misma pregunta, dos resultados:** «¿cómo se llama la función que suma el total de la lista?». En esa sesión responde al momento, sin abrir nada, porque el fichero sigue en la mesa (`total`, en `src/compra.js`). Tras `/new`, el pie vuelve casi al principio y tiene que buscar y leer el fichero otra vez. Si antes te pide permiso para ejecutar un comando, recházalo: no le hace falta.
- **Práctica:** hazlo tú en el laboratorio con plan, que no edita ficheros. Abre una sesión nueva, pídele que lea ficheros uno a uno y apunta el pie después de cada petición; luego repite la pregunta en otra sesión.
- **En resumen:** la ventana de contexto es el escritorio, todo lo que el modelo tiene delante y nada más; no recuerda, se le reenvía todo en cada petición; tiene un límite, pero el trabajo empeora antes de llenarla; y cuando la mochila pesa, sesión nueva o compactar.

**Siguiente:** [Vídeo 05 · De chat a agente: el bucle y las herramientas](/rutas/ia-desde-cero/05-el-bucle-y-las-herramientas)

## Código y comandos

Los comandos de sesión del vídeo.

| Comando | Qué hace |
|---|---|
| `/new` · Ctrl+X N | Empieza una sesión nueva, con la mesa despejada |
| `/sessions` | Lista las sesiones para volver a una anterior |
| `/compact` | Resume la conversación; desde ahí viaja el resumen |

## Fuentes

- Presentaciones [IA Generativa: conceptos fundamentales](https://codigosinsiesta.com/ai-presentation/) (el escritorio) y [De agente a orquestador](https://codigosinsiesta.com/agente-a-orquestador-presentation/) (la mochila).
- Hong, Troynikov y Huber, [*Context Rot: How Increasing Input Tokens Impacts LLM Performance*](https://www.trychroma.com/research/context-rot) (Chroma, 2025): el rendimiento baja a medida que crece la entrada, sin llegar al límite.
- Liu et al., [*Lost in the Middle: How Language Models Use Long Contexts*](https://arxiv.org/abs/2307.03172) (2023): lo que está en medio de un contexto largo se aprovecha peor.
- [documentación de OpenCode](https://opencode.ai/v2/docs/): sesiones, `/new`, `/sessions` y la compactación.
- Las cifras de tokens se midieron en el laboratorio el 2 de noviembre de 2026; cambian con cada modelo.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · El escritorio**

En el vídeo uno dijimos que todo lo que el modelo puede tener delante a la vez tiene un límite, y le pusimos nombre: la ventana de contexto. Hoy toca entenderla, porque explica casi todo lo que te va a extrañar al trabajar con un agente: por qué de repente olvida algo que le dijiste, por qué una sesión larga acaba yendo peor y cuándo conviene empezar de cero.

Piensa en un escritorio. Encima puedes tener varios documentos abiertos a la vez: el enunciado de la tarea, un par de ficheros, tus notas. Mientras están sobre la mesa, los consultas cuando quieras. Pero la mesa tiene un tamaño. Si quieres abrir otro documento y ya no cabe, tienes que guardar alguno.

La ventana de contexto es ese escritorio. Es todo lo que el modelo tiene delante en el momento de escribir su respuesta. Y la regla es estricta: lo que está en la mesa existe para él, y lo que no está, no existe. No hay un cajón donde mire por su cuenta, ni una memoria aparte donde guarde lo de ayer.

Esto conecta con lo que vimos en el vídeo uno: el modelo se equivoca más cuando le falta información. Si un fichero no está en el escritorio, no lo conoce, por mucho que esté en tu proyecto. Y entonces hace lo que mejor sabe hacer: se imagina cómo es.

**2 · No recuerda: se le reenvía todo**

Aquí viene la idea que más sorprende. Cuando hablas con un agente, parece que te recuerda: le preguntas algo, luego otra cosa, y responde teniendo en cuenta lo anterior. Pero el modelo no guarda nada entre una petición y la siguiente. Cada vez que le llega una, empieza con la mesa vacía.

¿Cómo es posible que parezca recordar? Porque OpenCode, en cada petición, le vuelve a poner encima de la mesa toda la conversación: lo que tú dijiste, lo que él respondió y todo lo que leyó. Imagina a un compañero sin memoria al que, cada vez que le haces una pregunta, le das primero el expediente entero, desde la primera página. Responde bien, porque lo acaba de leer todo. Pero lo ha leído otra vez.

Y esto pasa más veces de las que parece. Cuando le pides que lea un fichero, el modelo hace una petición para pedir la lectura, OpenCode lee el fichero, y luego hace otra petición, con el fichero ya encima de la mesa, para responderte. Una sola pregunta tuya pueden ser varias peticiones, y en cada una viaja todo.

De aquí salen dos consecuencias. La primera: cuanto más larga es la conversación, más pesa cada petición, porque cada una lleva todo lo anterior. La segunda: lo que no esté en la conversación, no lo sabe. Si cierras la sesión y abres otra, el expediente empieza en blanco.

**3 · Qué hay encima de la mesa**

Veamos qué hay encima de la mesa en cada petición. Son cuatro cosas: el manual del agente, la lista de herramientas, las instrucciones de tu proyecto y la conversación, con tu mensaje nuevo al final. Vamos una a una.

Lo primero no lo escribes tú. Es el manual de instrucciones del agente: un texto largo que trae OpenCode y que le explica al modelo cómo debe trabajar y qué normas sigue. Lo veremos con calma en la guía siete.

Lo segundo es la lista de herramientas que puede usar, cada una con su descripción: leer un fichero, buscar, editar, ejecutar un comando. Para pedir una herramienta, el modelo tiene que saber que existe, así que esa lista también viaja en cada petición.

Lo comprobamos en el laboratorio. En una sesión nueva le escribimos solo «hola», y medimos lo que le llegó al modelo: varios miles de tokens. Casi todo era el manual y las herramientas; nuestro saludo era una parte diminuta. Ese es el escritorio que ya está ocupado cuando te sientas a trabajar.

Lo tercero son las instrucciones de tu proyecto. Si el proyecto tiene un fichero llamado AGENTS punto md, OpenCode también lo pone encima de la mesa, y en cada petición. El laboratorio todavía no tiene uno: lo escribirás tú en la guía siete.

Y lo cuarto, lo que más crece: la conversación. Tus mensajes, sus respuestas y, sobre todo, lo que leen las herramientas. Cada fichero que el agente abre entra en el escritorio y se queda ahí. Un fichero pequeño apenas se nota. Uno grande, o la salida larga de un comando, ocupa mucho de golpe.

**4 · El límite y la mochila**

El escritorio tiene un tamaño máximo, y depende del modelo. Unos admiten mucho más que otros, y las cifras cambian con cada versión, así que no te voy a dar ninguna. Lo que importa es que el límite existe, y que una sesión con un agente se acerca a él antes de lo que crees, porque todo lo que lee se queda encima de la mesa.

Pero hay algo más importante que el límite. El modelo trabaja peor a medida que el contexto crece, sin necesidad de llegar al límite. Piensa en una mochila a la que sigues metiendo cosas sin sacar nunca nada. Al principio encuentras lo que buscas a la primera. Con el tiempo, lo que necesitas está debajo de todo lo demás, y cargas con peso que ya no sirve.

Con el contexto pasa algo parecido. Una sesión larga acumula ruido: ficheros que leyó y ya no importan, intentos que fallaron, caminos que se descartaron. El modelo lo sigue teniendo todo delante, y todo compite por su atención con lo que de verdad importa ahora. Por eso, en una sesión muy larga, a veces repite pasos que ya hizo, se contradice o pierde de vista lo que le pediste al principio.

Esa es la lección práctica: más contexto no siempre es mejor. Lo que quieres no es una mesa llena, sino una mesa con lo que hace falta para la tarea de ahora. Y para conseguirlo tienes dos herramientas.

**5 · Sesión nueva o compactar**

La primera es la más sencilla: empezar una sesión nueva. En OpenCode se hace con barra new, o con control equis y luego la ene. Es despejar la mesa entera. El agente arranca otra vez solo con su manual, sus herramientas y las instrucciones de tu proyecto. La sesión anterior no se borra: puedes volver a ella con barra sessions.

¿Cuándo conviene? Cada vez que cambias de tarea. Si acabas de arreglar un fallo y ahora quieres añadir otra cosa, lo que leyó para el fallo ya no te sirve: es peso en la mochila. Y también cuando notes que la sesión se enreda: que repite, que se contradice o que vuelve a proponer algo que ya descartaste.

Lo que cuesta una sesión nueva es que hay que volver a ponerla al día. No recuerda nada de la anterior, así que tendrá que leer otra vez los ficheros que necesite. Por eso merece la pena guardar lo importante fuera de la conversación, en ficheros del proyecto. Lo que está en un fichero lo puede volver a leer; lo que solo estaba en la conversación, se ha ido.

La segunda herramienta es compactar. OpenCode le pide al modelo un resumen de la conversación hasta ese momento, y a partir de ahí, en lugar de toda la conversación, viaja el resumen. Es como vaciar la mochila y quedarte con una nota de lo que llevabas. Se hace con barra compact. Y, además, OpenCode compacta solo, sin que se lo pidas, cuando la ventana se acerca al límite.

Compactar tiene un precio: un resumen siempre pierde detalles. Un nombre exacto, un mensaje de error o una decisión que tomasteis a mitad de camino pueden no sobrevivir. Por eso, cuando la tarea cambia, una sesión nueva suele ser mejor que compactar. Y cuando quieres seguir con la misma tarea pero la mesa está muy llena, compactar te deja continuar.

**6 · Pruébalo: el pie de la pantalla**

No hace falta que me creas: se ve. En la parte de abajo de la pantalla, OpenCode enseña cuánto contexto llevas ocupado, en tokens y en porcentaje de la ventana. Es el mismo número del que hemos hablado todo el vídeo, y a partir de ahora conviene que lo tengas siempre a la vista.

Te propongo esta práctica en el laboratorio, con el agente plan, que no edita ficheros. Abre una sesión nueva y ve pidiéndole que lea ficheros, uno detrás de otro. Después de cada petición, mira el pie de la pantalla y apunta cuánto contexto llevas.

Nosotros lo hicimos así al preparar el vídeo. En una sesión nueva, le pedimos que leyera compra punto js y nos dijera qué hace. Luego, que leyera las pruebas y el README. Después, el fichero de configuración del contenedor. El número sube cada vez que lee algo, y no baja. Son ficheros pequeños; con los de un proyecto real, el salto es mucho mayor.

Ahora pregúntale cómo se llama la función que suma el total de la lista. Lo responde al momento, sin abrir nada, porque el fichero sigue encima de la mesa. Después abre una sesión nueva con barra new y hazle exactamente la misma pregunta. El pie vuelve casi al principio, y el agente tiene que buscar y leer el fichero otra vez para responder. Si antes te pide permiso para ejecutar un comando, recházalo: no le hace falta.

Repasemos. La ventana de contexto es el escritorio: todo lo que el modelo tiene delante, y nada más. No recuerda: OpenCode le reenvía todo en cada petición. Tiene un límite, pero el trabajo empeora antes, a medida que se llena. Y cuando la mochila pesa, sesión nueva o compactar.

En el próximo vídeo veremos qué hace el agente con todo eso encima de la mesa: el bucle con el que deja de hablar y empieza a actuar, y las herramientas que usa para hacerlo. Nos vemos en el siguiente vídeo.

</details>

