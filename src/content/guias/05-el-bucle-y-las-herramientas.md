---
title: "Vídeo 05 · De chat a agente: el bucle y las herramientas"
description: "Cómo un modelo que solo escribe acaba cambiando ficheros: el bucle de leer, razonar, actuar y observar, y las herramientas de OpenCode, paso a paso en una tarea real."
ruta: "ia-desde-cero"
orden: 5
duracion: "11 min"
video: "05-el-bucle-y-las-herramientas.mp4"
subtitulos: "/subtitulos/ia-desde-cero/05-el-bucle-y-las-herramientas.es.vtt"
---

Cómo un modelo que solo escribe acaba cambiando ficheros: el bucle de leer, razonar, actuar y observar, y las herramientas de OpenCode, paso a paso en una tarea real.

<p class="guia__nota">Dura 11 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Un chat habla; un agente actúa

<p><button type="button" class="ir-a" data-t="19">▶ Ir a 0:19</button></p>

- **Vídeo cinco:** Del texto a la acción — Cómo un modelo que solo escribe acaba cambiando ficheros
- **Quién hace qué**
  - `escribe` · El chat: el código, nada más
  - `todo lo demás` · Tú: buscar, aplicar, ejecutar, mirar y contárselo
- **La frase:** Un chat habla; un agente actúa — El modelo puede ser el mismo: cambia lo que hay alrededor

### 2 · El bucle

<p><button type="button" class="ir-a" data-t="87">▶ Ir a 1:27</button></p>

- **Por eso se corrige:** El error entra en la siguiente vuelta — En el chat, se lo pegabas tú

### 3 · El modelo nunca ejecuta

<p><button type="button" class="ir-a" data-t="153">▶ Ir a 2:33</button></p>

- **La idea clave:** El modelo no ejecuta nada — Solo escribe texto, pieza a pieza (vídeo uno)
- **Ayuda por teléfono**
  - `1` · Abre tal fichero: «…y léemelo»
  - `2` · Cambia esta línea: si te convence
  - `3` · Ejecuta las pruebas: y cuéntame qué pasa
  - *Él no toca nada: las manos son tuyas*
- **Por qué importa lo del vídeo dos**
  - `permisos` · Las peticiones de permiso: hay un programa en medio que puede decir que no
  - `laboratorio` · El laboratorio: lo que OpenCode ejecuta es real

### 4 · Qué es una herramienta

<p><button type="button" class="ir-a" data-t="243">▶ Ir a 4:03</button></p>

- **La carta de un restaurante**
  - `1` · Nombre: cómo se llama el plato
  - `2` · Descripción: qué es y para quién
  - `3` · Opciones: el punto de la carne, la guarnición
  - *Lees la carta y pides: la cocina hace el resto*
- *En terminal:* La herramienta edit, tal como la recibe el modelo (resumida) (más abajo, en «Código y comandos»)

### 5 · Las herramientas de OpenCode

<p><button type="button" class="ir-a" data-t="317">▶ Ir a 5:17</button></p>

- **Mirar sin tocar**
  - `read` · Lee: un fichero, o lo que hay en una carpeta
  - `glob` · Busca por nombre: por ejemplo, **/*.js
  - `grep` · Busca un texto: dentro de los ficheros
- **Cambiar**
  - `edit` · Un trozo: busca un texto y lo sustituye
  - `write` · El fichero entero: nuevo, o en lugar del que había

### 6 · Una tarea, paso a paso

<p><button type="button" class="ir-a" data-t="396">▶ Ir a 6:36</button></p>

- *En la demo:* La petición, en la TUI · rama guia-05 · agente build
- *En la demo:* Vuelta 1: pide un comando para listar, y OpenCode pregunta
- *En terminal:* Lo que cambió el agente (ejecución real) (más abajo, en «Código y comandos»)
- **La misma petición, dos veces**
  - `6 vueltas` · Una vez: listar · leer ×4 · editar ×3 · npm test: 3 de 3
  - `5 vueltas` · Otra vez: leer ×3 y listar a la vez · editar ×3 · npm test: 4 de 4

### 7 · Cuándo para

<p><button type="button" class="ir-a" data-t="512">▶ Ir a 8:32</button></p>

- **Ojo:** Para cuando cree que ha terminado — No cuando lo ha comprobado · escape lo interrumpe
- **Dos nombres para que te suenen**
  - `subagent` · Subagentes: otro agente, con su propia conversación · explore solo lee y busca
  - `enchufes` · MCP: enchufar herramientas de otros: la carta crece
  - *En esta ruta no hacen falta*

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### La herramienta edit, tal como la recibe el modelo (resumida)

```text
{
  name: "edit",
  description: "Edit the contents of a file by finding
                and replacing exact text. …",
  parameters: {
    path: "el fichero",
    oldString: "el texto que hay que buscar",
    newString: "el texto que lo sustituye",
    // replaceAll: opcional
  }
}
```

- `"edit"`: El nombre
- `description`: Para qué sirve y cuándo usarla
- `parameters`: Los datos que hay que darle

### Lo que cambió el agente (ejecución real)

```text
// src/compra.js
export function quitar(lista, nombre) {
  return lista.filter((p) => p.nombre !== nombre);
}

// tests/compra.test.js
import { crearLista, anadir, quitar, total } from …;
test('quitar devuelve una lista nueva…', () => { … });
```

- `quitar(lista, nombre)`: Vuelta 3 · edit
- `quitar, total`: Vuelta 3 · edit
- `test('quitar`: Vuelta 4 · edit

## Fuentes

- [Herramientas de OpenCode](https://opencode.ai/v2/docs/tools/): `read`, `glob`, `grep`, `edit`, `write`, `shell`, `webfetch` y `subagent`.
- [permisos de OpenCode](https://opencode.ai/v2/docs/permissions/) y el `opencode.json` del [laboratorio de la ruta](https://github.com/CodigoSinSiesta/empieza-aqui-laboratorio).
- Presentaciones [Coding agents](https://codigosinsiesta.com/coding-agents-presentation/), [Taller de OpenCode](https://codigosinsiesta.com/taller-opencode-presentation/) y [De agente a orquestador](https://codigosinsiesta.com/agente-a-orquestador-presentation/): el bucle del agente.
- La tarea del vídeo se ejecutó de verdad en el laboratorio; las llamadas que se ven son las reales.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Un chat habla; un agente actúa**

Hasta ahora hemos visto qué es un modelo, hemos montado el laboratorio, hemos recorrido OpenCode y hemos visto qué le cabe en la ventana de contexto. En este vídeo vamos a responder a la pregunta que lo une todo: cómo un modelo que solo escribe texto acaba cambiando ficheros y ejecutando pruebas por ti.

Empecemos por lo que ya conoces, aunque sea de oídas: un chat. Le pegas tu código y le pides un cambio. Te contesta con código. Tú lo copias en tu editor, ejecutas las pruebas y, si fallan, copias el error y se lo pegas de vuelta. Y vuelta a empezar.

Fíjate en quién hace qué. El chat escribe. Todo lo demás lo haces tú: buscar los ficheros, aplicar el cambio, ejecutar, mirar el resultado y contárselo. Tú eres sus ojos y sus manos.

Un agente hace ese mismo recorrido sin ti en medio. Lee los ficheros que necesita, aplica el cambio, ejecuta las pruebas y mira qué ha pasado. La frase que lo resume es esta: un chat habla; un agente actúa. Y lo curioso es que, por dentro, el modelo puede ser el mismo. Lo que cambia es lo que hay alrededor.

**2 · El bucle**

Piensa en cómo haces una salsa. La pruebas, piensas qué le falta, le echas sal y vuelves a probar. No echas toda la sal de golpe y te vas: das vueltas, y cada una aprovecha lo que has aprendido en la anterior.

Un agente trabaja igual, en cuatro tiempos. Primero lee: qué le has pedido y qué ha pasado hasta ahora. Luego razona: qué hace falta a continuación. Después actúa: pide leer un fichero, cambiarlo o ejecutar un comando. Y por último observa: recibe el resultado de esa acción. Con ese resultado vuelve a leer, y el bucle empieza otra vez.

Cada vuelta es una llamada al modelo. Y recuerda lo que vimos en el vídeo anterior: el modelo no recuerda nada. En cada vuelta, OpenCode le envía otra vez toda la conversación, ahora con el resultado de la última acción añadido al final. Así es como se entera de lo que ha pasado.

Por eso un agente puede corregirse. Si las pruebas fallan, el error entra en la siguiente vuelta, y el modelo lo tiene delante para decidir qué hacer. En el chat, ese error se lo tenías que pegar tú.

**3 · El modelo nunca ejecuta**

Ahora, una idea que conviene tener muy clara. El modelo no ejecuta nada. No puede. Como vimos en el primer vídeo, lo único que sabe hacer es escribir texto, pieza a pieza.

Imagina a alguien que te ayuda por teléfono con tu ordenador. Te dice: «abre tal fichero y léemelo», «cambia esta línea», «ahora ejecuta las pruebas». Él no toca nada. Las manos son tuyas, y si una orden no te convence, no la haces.

En un agente, el modelo es la voz del teléfono y OpenCode son las manos. Cuando el modelo quiere actuar, escribe una petición con un formato especial: qué herramienta quiere usar y con qué datos. OpenCode la lee, decide si la ejecuta, la ejecuta en el laboratorio y le devuelve el resultado como un mensaje más.

Esto lo hemos comprobado. Le pedimos al agente una tarea sin nadie delante para aprobar los permisos. El modelo pidió ejecutar un comando, y OpenCode lo rechazó. El modelo recibió el rechazo como resultado y probó por otro camino: buscar los ficheros con otra herramienta. Pidió editar, y también se lo rechazaron. Al final se paró y explicó que no podía aplicar el cambio. No tocó ni un fichero, porque quien toca no es él.

Y aquí está la razón de lo que hicimos en el vídeo dos. Las peticiones de permiso funcionan porque hay un programa en medio que puede decir que no. Y el laboratorio importa porque lo que OpenCode ejecuta es real.

**4 · Qué es una herramienta**

¿Y cómo sabe el modelo qué puede pedir? Piensa en la carta de un restaurante. Cada plato tiene un nombre, una descripción y unas opciones: el punto de la carne, la guarnición. Tú no entras en la cocina: lees la carta y pides. La cocina hace el resto.

Una herramienta es un plato de esa carta. Tiene un nombre, por ejemplo edit. Tiene una descripción, escrita para el modelo, que explica para qué sirve y cuándo usarla. Y tiene unos parámetros: los datos que hay que darle. Para edit, le das tres: la ruta del fichero, el texto que hay que buscar y el texto que lo sustituye.

OpenCode le manda al modelo esa carta entera en cada petición, junto con sus instrucciones y la conversación. El modelo lee las descripciones, elige la que encaja con lo que hace falta y rellena los parámetros. No hay magia, solo texto bien escrito. En nuestras pruebas, antes de que el agente hiciera nada, ya iban unos miles de tokens solo en instrucciones y en la carta.

Y cada resultado también ocupa sitio. Cuando el agente lee un fichero, su contenido entra en la conversación y viaja en todas las vueltas siguientes. Es la ventana de contexto del vídeo anterior, que ahora se va llenando con lo que hacen las herramientas.

**5 · Las herramientas de OpenCode**

Vamos con la carta de OpenCode. Hay tres herramientas para mirar sin tocar. read lee un fichero, o lista lo que hay en una carpeta. glob busca ficheros por su nombre, por ejemplo todos los que acaban en punto js. Y grep busca un texto dentro de los ficheros.

Hay dos para cambiar cosas. edit cambia un trozo concreto de un fichero: busca un texto y lo sustituye por otro. write escribe un fichero entero, nuevo o en lugar del que había.

Y hay una para ejecutar: shell. Con ella el agente lanza cualquier comando en la terminal del laboratorio, como ene pe eme test. Es la más potente y la más delicada, porque un comando puede hacer todo lo que pueda hacer tu usuario.

Mirar, cambiar y ejecutar. Además, hay otras para salir fuera o pedir ayuda: webfetch descarga una página web, websearch busca en internet y subagent le pasa una parte del trabajo a otro agente. Esta última la nombraremos al final.

En el laboratorio, las herramientas que solo miran no piden permiso. Las que cambian ficheros, ejecutan comandos o descargan de la web, sí. Así ves cada cambio y cada comando antes de que pase. Recuerda que esto es la configuración del laboratorio: OpenCode, tal como viene, casi no pregunta.

**6 · Una tarea, paso a paso**

Juntémoslo todo con una tarea real en el laboratorio. Le pedimos esto: añade a compra punto js una función quitar, que devuelva la lista sin ese producto, añade su prueba y ejecuta ene pe eme test. Y miramos qué herramienta pide en cada vuelta.

En la primera vuelta, el agente aún no sabe cómo es el proyecto, así que mira qué hay: pide listar las carpetas y los ficheros. En la segunda, lee cuatro ficheros a la vez: el README, el package punto json, las pruebas y compra punto js. En una misma vuelta puede pedir varias herramientas, y OpenCode las ejecuta todas antes de volver a llamar al modelo.

En la tercera vuelta ya sabe lo que hay, y actúa. Hace dos ediciones: añade la función quitar a compra punto js, y la añade también a la línea de las pruebas que importa las funciones. En la cuarta, otra edición más: escribe la prueba nueva, que comprueba que el producto desaparece y que la lista original no cambia.

En la quinta vuelta comprueba su trabajo: pide la herramienta shell para ejecutar ene pe eme test. Las pruebas pasan, y ese resultado vuelve al modelo. En la sexta ya no pide ninguna herramienta: responde con un resumen de lo que ha hecho. Todo, en unos veinte segundos.

Ahora mírala en el tiempo, con los permisos del laboratorio. Listar es un comando: te habría pedido permiso. Las cuatro lecturas, no. Las tres ediciones, sí. Y el comando de las pruebas, también. Cinco preguntas en total. Y la respuesta final, ninguna: escribir texto no necesita permiso.

Y una cosa que ya te sonará del primer vídeo. Lo repetimos con la misma petición, y el camino fue otro. Esta vez leyó y listó a la vez, y escribió dos pruebas en lugar de una. El bucle es el mismo; los pasos, no siempre.

**7 · Cuándo para**

¿Y cómo sabe el agente que ha terminado? Fíjate en la sexta vuelta. Mientras el modelo pide herramientas, OpenCode las ejecuta y vuelve a llamarle. Cuando responde solo con texto, sin pedir ninguna, el bucle se acaba.

En lo que registra OpenCode se ve muy claro. Las cinco primeras vueltas terminan con el motivo «llamadas a herramientas». La última termina con otro motivo, stop: el modelo ha dado su respuesta.

Es decir, para cuando el modelo cree que ha terminado. No cuando ha comprobado que todo está bien. Por eso le pedimos que ejecutara las pruebas: sin eso, podría decirte que funciona sin haberlo probado. Y si ves que va por mal camino, no hace falta esperar: con la tecla escape lo interrumpes.

Dos nombres más, solo para que te suenen. El primero, los subagentes: con la herramienta subagent, el agente encarga una parte del trabajo a otro agente, con su propia conversación. OpenCode trae uno llamado explore, que solo lee y busca. El segundo, MCP: una forma estándar de enchufar herramientas de otros, como un cargador universal. Con él, la carta crece. En esta ruta no hacen falta.

Repasemos. Un agente es un modelo dentro de un bucle: lee, razona, actúa y observa, vuelta tras vuelta. El modelo solo pide; quien ejecuta es OpenCode. Lo que puede pedir son herramientas, con su nombre, su descripción y sus parámetros. Y para cuando responde sin pedir ninguna.

La práctica de este vídeo. En el laboratorio, cambia a la rama guía cero cinco y, con el agente build, pídele la misma tarea: la función quitar, su prueba y ene pe eme test. Aprueba cada permiso una sola vez y, en cada paso, apunta qué herramienta usa y si te ha preguntado. Al final, ejecuta tú las pruebas. Si quieres repetirla, barra undo deja los ficheros como estaban.

Las guías siete, ocho y nueve, en texto, cuentan qué le dices al agente, qué cuesta y qué puede romper. Y en el próximo vídeo veremos qué puede romper un agente que actúa, y qué te protege. Nos vemos allí.

</details>

