---
title: "Vídeo 08 · Extensiones I: comandos, herramientas y eventos"
description: "La API de extensiones (comandos, herramientas propias y eventos). Construimos en directo el modo de aprobación que Pi no trae de serie."
ruta: "pi-oh-my-pi"
orden: 8
duracion: "21 min"
video: "08-extensiones-i.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/08-extensiones-i.es.vtt"
---

La API de extensiones (comandos, herramientas propias y eventos). Construimos en directo el modo de aprobación que Pi no trae de serie.

<p class="guia__nota">Dura 21 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Qué es una extensión

<p><button type="button" class="ir-a" data-t="20">▶ Ir a 0:20</button></p>

- **Petición frente a código:** pedirle al modelo que pregunte antes de borrar es una petición; hacer que Pi no ejecute nada sin tu permiso es código. Para eso están las extensiones.
- **Qué es:** un módulo de TypeScript que corre dentro del proceso de Pi. Exporta por defecto una función, la factoría, que recibe el objeto `pi` con la API: registrar comandos, herramientas, atajos, opciones de CLI, proveedores o servidores MCP, y escuchar eventos.
- **Sin compilar:** Pi carga el `.ts` con jiti (un cargador que ejecuta TypeScript sin compilarlo). `pi -e fichero.ts` la carga solo en esa ejecución; en `~/.pi/agent/extensions/`, siempre; en `.pi/extensions/`, para el proyecto, y solo con confianza.
- **Cuidado:** una extensión corre con tus permisos. Puede leer prompts, ficheros, credenciales e historial, y ejecutar lo que quiera. Instala solo las que entiendas.
- **El plan del vídeo:** `hola.ts` (un comando), `tests.ts` (una herramienta) y `permisos.ts` (un modo de aprobación, que Pi no trae a propósito).

### 2 · Un comando en diez líneas

<p><button type="button" class="ir-a" data-t="140">▶ Ir a 2:20</button></p>

- **`registerCommand`** recibe el nombre, una descripción y un handler. El handler recibe el texto escrito tras el comando y `ctx`, la puerta a lo que rodea a la extensión: directorio de trabajo, modelo activo, sesión e interfaz.
- *En la demo:* `hola.ts` llama a `ctx.ui.notify` con el saludo; cargada con `pi -e`, `/hola` aparece en el selector junto a los de serie, y `/hola Ana` muestra «hola, Ana».
- **Más piezas de interfaz:** `select`, `confirm`, `input`, `editor` y `setStatus` (un texto fijo en el pie). Son asíncronas: tu código espera la respuesta.
- **Los comandos los ejecutas tú;** el modelo no puede llamarlos. Si quieres darle algo al modelo, necesitas una herramienta.

### 3 · Herramientas propias con TypeBox

<p><button type="button" class="ir-a" data-t="244">▶ Ir a 4:04</button></p>

- **Por qué una herramienta y no bash:** hace siempre lo mismo, devuelve solo lo que importa y se puede tratar distinto al pedir permisos.
- **La definición:** nombre, etiqueta, descripción (es para el modelo: decide cuándo usarla) y parámetros con TypeBox, una librería que escribe esquemas JSON con sintaxis de TypeScript. Del mismo esquema salen el JSON schema que viaja al modelo y el tipo de los parámetros en tu código; Pi valida los argumentos antes de llamar a `execute()`.
- **`content` frente a `details`:** `content` es lo que ve el modelo (aquí, una línea con el recuento); `details` es para ti, datos estructurados que se guardan en la sesión y sirven para dibujar la herramienta o reconstruir el estado (vídeo 09).
- **Fallar de verdad:** para decir que la herramienta ha fallado, lanza un error desde `execute()`. Devolver un objeto, aunque diga «error», cuenta como éxito. *En la demo:* «¿pasan los tests del carrito?» → el modelo elige la herramienta, y al contexto solo entra «12 pasan, 0 fallan».
- **Como con MCP:** las herramientas propias admiten exposición (codemode, deferred, hidden…) y anotaciones de solo lectura o destructiva (vídeo 07).

### 4 · Eventos: engancharse al ciclo de Pi

<p><button type="button" class="ir-a" data-t="400">▶ Ir a 6:40</button></p>

- **El ciclo de una petición** (`pi.on(evento, handler)`, entre decenas de eventos):

```text
session_start → input → before_agent_start
  → turn_start → tool_call → tool_result → turn_end   (se repite en cada vuelta)
→ agent_end → … → session_shutdown
```

- **Tres tipos de evento:** unos solo avisan (lo que devuelves se ignora), otros transforman (tu valor sustituye al original) y otros pueden cancelar. Cada evento declara su tipo de resultado, y TypeScript te lo dice mientras escribes.
- **`tool_call`** llega antes de ejecutar una herramienta, con su nombre y sus argumentos. Puedes dejarla pasar, modificar los argumentos o devolver `{ block: true, reason }`; el modelo recibe el motivo como resultado.
- **Fallo seguro:** si tu handler de `tool_call` lanza un error, Pi bloquea la herramienta. Un fallo en tu control de permisos no deja pasar la acción.

### 5 · Reglas de convivencia

<p><button type="button" class="ir-a" data-t="522">▶ Ir a 8:42</button></p>

- **1 · La factoría solo registra.** Nada de procesos, sockets ni temporizadores ahí: a veces se carga sin abrir sesión. Arráncalo en `session_start` (o en el comando o la herramienta) y ciérralo en `session_shutdown`, con un cierre que aguante ejecutarse dos veces.
- **2 · El ctx de un comando no es el de un evento.** Solo el de un comando puede esperar al agente, recargar, navegar por el árbol o cambiar de sesión; desde un evento, Pi se esperaría a sí mismo. Si una herramienta necesita recargar, encola un mensaje con el comando (ejemplo `reload-runtime`).
- **3 · Los handlers pueden correr en paralelo.** Tres lecturas en un mensaje son tres `tool_call` a la vez. Si guardas estado en memoria, marca la herramienta para que se ejecute en secuencia; para editar ficheros, Pi ofrece una cola.
- **4 · Errores y salidas largas.** Si un handler falla, Pi avisa y sigue, salvo en `tool_call` (bloquea) y en `execute()` (resultado de error). Si tu herramienta puede devolver mucho texto, recórtalo y di dónde está el resto.
- **5 · Los modos.** Las extensiones se cargan igual en interactivo que en un script. `ctx.mode` vale `"tui"`, `"print"`, `"json"` o `"rpc"`, y `ctx.hasUI` dice si hay alguien para contestar un diálogo. La lógica no debería depender de la interfaz.

> **En otros agentes:** esto se parece más a un plugin de editor que a los hooks de Claude Code. Un hook es un proceso externo que el agente llama y del que lee la salida; una extensión de Pi es código dentro del proceso, con acceso directo a su estado y su interfaz. Más potente y más delicado.

### 6 · El modo aprobación

<p><button type="button" class="ir-a" data-t="709">▶ Ir a 11:49</button></p>

- **Dos listas:** herramientas de solo lectura que pasan sin preguntar (`read`, `grep`, `find`, `ls` y la de tests) y comandos de bash que no cambian nada (`cd`, `ls`, `cat`, `git status`, `git log`, `git diff`, los tests).
- **Mirar el principio no basta:** `ls && rm -rf` empieza por `ls`, y un `cat` con redirección sobrescribe. `bashSeguro()` corta el comando por `&&`, `;` y `|`, exige que todos los trozos sean seguros, y cualquier redirección o sustitución de comandos va a la pregunta. Ojo: un comando de tests como `npm test` ejecuta lo que defina el `package.json` del repo; en un repositorio ajeno no es «seguro».
- **El handler:** si es lectura, bash seguro o algo ya permitido, pasa. Si no hay interfaz, bloquea. Si la hay, pregunta con `ctx.ui.select`: Permitir, Permitir siempre en esta sesión o Bloquear, y los contadores en el pie con `setStatus`.
- *En la demo:* al pedir una sección «Tests» en el README, las lecturas y los tests pasan sin diálogo; la edición del README pide aprobación con el diff encima; el commit lo bloqueamos, el modelo recibe el motivo y no insiste. Un modo que pregunta por todo acaba con la persona aprobando sin leer.
- **Permitir siempre** guarda la acción exacta (la misma edición o el mismo comando). Vive en memoria: una sesión nueva con `/new` carga la extensión de cero y la lista empieza vacía.

### 7 · Barra reload y rutas protegidas

<p><button type="button" class="ir-a" data-t="951">▶ Ir a 15:51</button></p>

- **Rutas protegidas:** `AGENTS.md` y `.git/` no se tocan ni preguntando. Una regla al principio del handler: si es `write` o `edit` sobre una de esas rutas, aviso y `block: true`, sin diálogo.
- **`/reload`** vuelve a cargar extensiones, skills, prompts, temas y ficheros de contexto, también las cargadas con `-e`. No actualiza en caliente: tira el entorno de extensiones y lo crea de nuevo, así que contadores y permisos vuelven a cero. El ciclo de desarrollo es editar, `/reload` y probar.
- *En la demo:* bloqueada la edición de `AGENTS.md`, el modelo intenta cambiar los permisos del fichero con `chmod u+w`. Como no está en la lista segura, la extensión pregunta y lo bloqueamos; solo entonces el modelo se detiene y propone el texto para que lo añadas tú. El modelo busca otro camino cuando le cierras uno.

### 8 · Sin interfaz, y lo que no es

<p><button type="button" class="ir-a" data-t="1081">▶ Ir a 18:01</button></p>

- **Sin interfaz se bloquea:** en print y JSON no hay diálogos, así que la extensión mira `ctx.hasUI` antes de preguntar; en RPC sí puede haberlos (vídeo 10). *En la demo:* `pi -p "Haz commit del cambio del README."` deja pasar `git status`, bloquea `git add` y `git commit`, y el modelo te da los dos comandos para hacerlo a mano. En un script o en CI, lo que no está en la lista segura no se ejecuta.
- **Variantes:** diálogos con `timeout` (sin respuesta, se bloquea); decidir por anotaciones, como Codex (preguntar por todo lo que no sea de solo lectura, incluidas las herramientas MCP destructivas); y los ejemplos instalados `permission-gate`, `protected-paths`, `confirm-destructive` y `status-line`.
- **Aprobar no es aislar:** la extensión reconoce comandos con expresiones regulares, y un modelo con prisa o un texto malicioso puede encontrar un camino que no previste. Te protege de errores y te da control; contra un ataque, limita lo que Pi alcanza con un contenedor o una máquina aparte (vídeo 05). Lo ideal, las dos cosas.

### 9 · Cierre

<p><button type="button" class="ir-a" data-t="1213">▶ Ir a 20:13</button></p>

- **Repaso:** una extensión es un módulo de TypeScript con una factoría que recibe la API de Pi. `registerCommand` añade comandos que ejecutas tú; `registerTool`, herramientas que llama el modelo, con parámetros TypeBox y `content` para el modelo y `details` para ti. `pi.on` te engancha a los eventos, y `tool_call` puede bloquear cualquier herramienta. `/reload` lo recarga todo mientras trabajas.
- **Práctica:** escribe tu `permisos.ts` con la lista de comandos seguros de tu proyecto y úsalo una tarde; apunta qué pregunta de más y de menos y ajústalo con `/reload`. Después, una herramienta propia para tests, linter o despliegue.
- **Materiales:** [`extensiones/hola.ts`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/extensiones/hola.ts), [`extensiones/tests.ts`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/extensiones/tests.ts) y [`extensiones/permisos.ts`](https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/extensiones/permisos.ts), en el [repositorio de materiales del curso](https://github.com/CodigoSinSiesta/curso-pi-materiales). Clónalo en `~/csn` y ejecuta `./preparar.sh`.
- **Próximo vídeo:** Extensiones II y paquetes: estado que sobrevive a rebobinar, el fallo típico y cómo empaquetar, instalar y publicar.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Una extensión

```text
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand(…);   pi.registerTool(…);   pi.registerShortcut(…);
  pi.on("tool_call", async (event, ctx) => { … });
}
```

- `export default function`: la factoría. Solo registra; lo que dure la sesión se arranca en `session_start`.
- Los paquetes de Pi y TypeBox se importan sin instalarlos: Pi los resuelve. Para otras dependencias de npm, un `package.json` junto a la extensión o un paquete de Pi (vídeo 09).

### tool_call: tres respuestas posibles

```text
pi.on("tool_call", async (event, ctx) => {
  if (seguro(event)) return;                          // pasa
  event.input.command = "…";                          // modifica en el sitio
  return { block: true, reason: "No permitido" };     // bloquea
});
```

- Con `block: true` la herramienta no se ejecuta y el modelo recibe `reason` como resultado.
- Si el handler lanza un error, también se bloquea.

### Cargar las dos extensiones

```text
cp permisos.ts ~/.pi/agent/extensions/
pi -e tests.ts

[Extensions]
  permisos.ts, tests.ts
```

- En `~/.pi/agent/extensions/`, la extensión se carga en todas las sesiones; con `pi -e`, solo en esa ejecución.
- Al arrancar, la cabecera lista las extensiones cargadas.

## Fuentes

- Documentación oficial de Pi: [extensions.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/extensions.md), [configuration.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/configuration.md) y [slash-commands.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/slash-commands.md). Grabado con Pi 1.0.1.
- Para profundizar en la API: los tipos de `ToolCallEventResult` y `ExtensionUIContext`, en `dist/core/extensions/types.d.ts` del paquete instalado.
- Ejemplos que se instalan con Pi, en `examples/extensions/`: `hello.ts`, `permission-gate.ts`, `protected-paths.ts`, `status-line.ts`, `reload-runtime.ts` y `timed-confirm.ts`.
- Relacionados en el curso: vídeo 05 (aislamiento), 07 (exposición y anotaciones), 09 (estado y paquetes), 10 (RPC) y 19 (aprobaciones en oh my pi).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Qué es una extensión**

Hasta ahora hemos personalizado Pi sin escribir código: ficheros de contexto, prompts, skills, ajustes, y en el vídeo anterior, servidores MCP. Todo eso cambia lo que el modelo sabe o lo que tiene a mano. Pero hay cosas que ninguna instrucción puede garantizar. Pedirle al modelo que te pregunte antes de borrar algo es una petición. Hacer que Pi no ejecute nada sin tu permiso es código. Para eso están las extensiones.

Una extensión es un módulo de TypeScript que se ejecuta dentro del proceso de Pi. Exporta por defecto una función, la factoría, que recibe un objeto pi con toda la API de extensiones. Desde ahí puede registrar comandos con barra, herramientas que el modelo puede llamar, atajos de teclado, opciones de línea de comandos, proveedores de modelos o servidores MCP. Y, sobre todo, puede escuchar los eventos de Pi: cuando empieza la sesión, cuando llega un mensaje, cuando el modelo pide ejecutar una herramienta.

No hace falta compilar nada. Pi carga el TypeScript directamente con jiti, así que escribes un fichero punto ts, lo guardas y lo cargas. Para desarrollar, lo más cómodo es la opción guion e, de extension, que carga un fichero concreto solo para esa ejecución. Para tenerla siempre, la extensión va en la carpeta extensions del directorio de tu agente, y para un proyecto, en punto pi barra extensions. Recuerda lo del vídeo cinco: las extensiones del proyecto solo se cargan si confías en él, porque una extensión es código que corre con tus permisos.

Y esto conviene repetirlo: una extensión puede leer tus prompts, tus ficheros, tus credenciales y el historial de la sesión, y ejecutar lo que quiera. Instala solo las que entiendas o vengan de alguien de confianza.

En este vídeo vamos a escribir tres. Una que añade un comando, otra que añade una herramienta, y la tercera, la importante: un modo de aprobación, para que Pi te pregunte antes de tocar nada. Pi no lo trae de serie, a propósito, y en cincuenta líneas lo tendremos funcionando.

**2 · Un comando en diez líneas**

Empezamos por lo más pequeño. Esta es la extensión hola punto ts entera. Importa el tipo extension API, exporta la factoría y, dentro, llama a register command con el nombre del comando, hola, una descripción, y un handler. El handler recibe dos cosas: el texto que escribas después del comando, y un contexto, ctx.

Ese contexto es tu puerta a todo lo que rodea a la extensión: el directorio de trabajo, el modelo activo, la sesión y la interfaz. Con ctx punto ui punto notify mostramos una notificación con el saludo.

La cargamos con pi guion e y la ruta del fichero. En el arranque, Pi lista las extensiones cargadas, y ahí está, hola punto ts.

Al escribir una barra, el comando aparece en el selector, junto a los de serie, con su descripción. Y si escribimos barra hola Ana, aparece la notificación: hola, Ana.

Parece poco, pero los comandos son la forma de dar a tu equipo atajos propios, con lógica de verdad: lanzar una revisión con un formato concreto, cambiar de modelo y de herramientas a la vez, o abrir un formulario. La interfaz ofrece más piezas que notify: select para elegir entre opciones, confirm para un sí o un no, input para pedir un texto, editor para un texto largo, y set status para dejar un texto fijo en el pie. Todas son asíncronas: tu código espera a que la persona responda.

Un detalle importante: los comandos los ejecutas tú. El modelo no puede llamarlos. Si quieres darle algo al modelo, lo que necesitas es una herramienta.

**3 · Herramientas propias con TypeBox**

La segunda extensión, tests punto ts, registra una herramienta para ejecutar los tests de la tienda. Es verdad que el modelo ya podría lanzarlos con bash, pero una herramienta propia tiene tres ventajas: hace siempre lo mismo, devuelve solo lo que importa en vez de páginas de salida, y, como veremos enseguida, se puede tratar distinto a la hora de pedir permisos.

Una herramienta tiene un nombre, ejecutar tests; una etiqueta para la interfaz; y una descripción. Ojo con la descripción, porque es para el modelo: es lo que lee para decidir cuándo usarla. Y luego los parámetros, que se definen con TypeBox. TypeBox es una librería que construye esquemas JSON con sintaxis de TypeScript: type punto object, type punto string, type punto optional. De ese esquema salen dos cosas a la vez: el JSON schema que viaja al modelo con la definición de la herramienta, y el tipo de TypeScript de los parámetros en tu código. Pi, además, valida los argumentos contra el esquema antes de llamar a tu función.

Aquí hay un único parámetro, fichero, opcional, con su propia descripción: un fichero de test concreto, u omitirlo para ejecutarlos todos.

Lo demás es la función execute. Recibe el identificador de la llamada, los parámetros ya validados, una señal para cancelar, una función para informar del progreso y el contexto. La nuestra lanza node guion guion test con el reporter TAP, que es fácil de leer, y saca de la salida cuántas pruebas pasan y cuántas fallan.

El resultado tiene dos partes, y es una distinción que conviene entender bien. Content es lo que ve el modelo: aquí, una línea con el recuento y, si hay fallos, cuáles. Details es para ti: datos estructurados que se guardan en la sesión, que puedes usar para dibujar la herramienta en la interfaz o para reconstruir el estado. Lo usaremos mucho en el próximo vídeo.

¿Y si algo va mal? Si no se ha ejecutado ningún test, lanzamos un error. Lanzar un error desde execute es la forma de decirle al modelo que la herramienta ha fallado; devolver un objeto, aunque contenga la palabra error, cuenta como éxito.

Cargamos la extensión y preguntamos: ¿pasan los tests del carrito? El modelo elige nuestra herramienta y le pasa el fichero test barra carrito punto test punto js. Doce pasan, cero fallan. Y eso es todo lo que entra en el contexto.

Las herramientas propias aceptan también todo lo que vimos con MCP: la exposición, para que solo se llamen desde codemode o se carguen con tool search, y las anotaciones, que dicen si una herramienta solo lee o si es destructiva.

**4 · Eventos: engancharse al ciclo de Pi**

Comandos y herramientas añaden cosas. Los eventos te dejan intervenir en lo que Pi ya hace. Se escuchan con pi punto on, el nombre del evento y un handler, y Pi tiene cuarenta y uno.

Para orientarte, piensa en una petición de principio a fin. Session start, cuando arranca la sesión, buen sitio para preparar recursos. Input, cuando escribes algo, y que puede transformarlo antes de que llegue al modelo. Before agent start, justo antes de empezar a trabajar, que puede cambiar el system prompt de esa petición. Turn start y turn end, cada vuelta del bucle del agente. Tool call, cuando el modelo pide ejecutar una herramienta, y tool result, cuando la herramienta ha terminado. Agent end, cuando el agente termina. Y session shutdown, al cerrar, para liberar lo que hayas abierto.

Hay más: eventos de la sesión, como antes de compactar o antes de bifurcar, que se pueden cancelar; eventos del proveedor, para ver las peticiones o las respuestas; y context, que te deja reescribir los mensajes que se envían al modelo en cada petición.

Lo importante es que no todos hacen lo mismo con lo que devuelves. Unos solo avisan: lo que devuelvas se ignora. Otros transforman: tu valor de retorno sustituye al original. Y otros pueden cancelar la operación. Cada evento declara su tipo de resultado, y TypeScript te lo dice mientras escribes.

El que nos interesa hoy es tool call. Llega antes de que se ejecute la herramienta, con su nombre y los argumentos que ha pedido el modelo. Puedes dejarla pasar sin devolver nada, modificar los argumentos en el sitio, o devolver block true con un motivo. Si la bloqueas, la herramienta no se ejecuta, y el modelo recibe el motivo como resultado, igual que si hubiera fallado.

Y un detalle de diseño que nos viene muy bien: si tu handler de tool call lanza un error, Pi bloquea la herramienta. Es un fallo seguro. Si tu control de permisos tiene un error, la acción no se ejecuta.

**5 · Reglas de convivencia**

Antes de construir algo más serio, cinco reglas que te ahorrarán sustos, porque una extensión vive dentro de Pi y comparte su ciclo de vida.

La primera: la factoría solo registra. No arranques procesos, sockets, temporizadores ni vigilantes de ficheros dentro de ella, porque a veces se cargan las extensiones sin llegar a abrir una sesión. Lo que tenga que vivir mientras dura la sesión, arráncalo en session start o en el comando o la herramienta que lo necesite, y ciérralo en session shutdown. Y que ese cierre se pueda ejecutar dos veces sin romperse, porque cancelar, recargar, cambiar de sesión y salir pueden acabar llamándolo todos.

La segunda: no todos los contextos son iguales. El ctx que recibe un comando tiene operaciones que el de un evento o una herramienta no tiene: esperar a que el agente termine, recargar, navegar por el árbol o cambiar de sesión. Son solo para comandos porque, llamadas desde dentro de un evento, bloquearían a Pi esperándose a sí mismo. Si una herramienta necesita recargar, la solución del ejemplo reload runtime es encolar un mensaje con el comando, y que lo ejecute Pi cuando quede libre.

La tercera: las herramientas de un mismo mensaje pueden ejecutarse en paralelo. Si el modelo pide tres lecturas a la vez, tus handlers de tool call pueden estar atendiendo tres llamadas al mismo tiempo. No supongas que la anterior ya ha terminado, y si tu herramienta guarda estado en memoria y lo modifica, márcala para que se ejecute en secuencia. Para las que modifican ficheros, Pi ofrece una cola que evita que dos ediciones se pisen.

La cuarta: los errores. Si un handler de un evento falla, Pi lo informa y sigue adelante siempre que puede. Las excepciones son las que ya hemos visto: un fallo en tool call bloquea la herramienta, y un fallo dentro de execute se convierte en un resultado de error para el modelo. Y una salida demasiado larga tampoco es buena idea: si tu herramienta puede devolver mucho texto, recórtalo y dile al modelo dónde está el resto.

Y la quinta: los modos. Las extensiones se cargan igual en el modo interactivo que en un script, así que lo que dependa de la terminal tiene que estar protegido. Ctx punto mode te dice en qué modo estás, y ctx punto has UI si hay alguien que pueda contestar un diálogo. La lógica de tus herramientas y eventos no debería depender de la interfaz.

Sobre las importaciones, un apunte práctico. Las extensiones pueden importar los paquetes de Pi, como el de tipos y TypeBox, sin instalarlos, porque Pi los resuelve por ti. Para cualquier otra dependencia de npm, pon un package punto json junto a la extensión, o mejor, conviértela en un paquete de Pi, que es lo que haremos en el próximo vídeo.

Y si vienes de otros agentes: esto es más parecido a un plugin de un editor que a los hooks de Claude Code. No es un script que Pi llama y del que lee la salida, sino código que corre dentro de Pi, con acceso directo a su estado y a su interfaz. Más potente, y por eso mismo, más delicado.

**6 · El modo aprobación**

Ya tenemos todas las piezas. Recuerda el vídeo cinco: Pi no tiene modos de permiso. Ejecuta lo que el modelo decide, y la seguridad la pones tú, aislando el entorno. oh my pi sí trae modos de aprobación, y los veremos en el vídeo diecinueve. Pero con un evento, un diálogo y un poco de lógica, podemos tener el nuestro en Pi.

Este es permisos punto ts. Arriba, dos listas. Herramientas de solo lectura, que pasan sin preguntar: read, grep, find, ls y nuestra ejecutar tests. Y comandos de bash que tampoco cambian nada: cd, ls, cat, git status, git log, git diff, ejecutar los tests y poco más.

Un detalle de seguridad en esa lista. No basta con mirar cómo empieza el comando. Ls y después rm guion rf empieza por ls, y cat algo con una redirección puede sobrescribir un fichero. Por eso la función bash seguro corta el comando por cada doble ampersand, punto y coma o tubería, exige que todos los trozos sean seguros, y cualquier redirección o sustitución de comandos va directa a la pregunta.

Dentro de la factoría, un conjunto con lo que hayas permitido para siempre, y dos contadores. Y luego, el handler de tool call. Si la herramienta es de lectura, sale sin devolver nada: puede ejecutarse. Si es bash y el comando es seguro, también. Si ya la habías permitido para siempre, también.

Si no hay interfaz, no hay a quién preguntar, y bloqueamos. Lo veremos al final.

Y si hay interfaz, preguntamos con ctx punto ui punto select: Pi quiere ejecutar, la acción, y tres opciones. Permitir, permitir siempre en esta sesión, o bloquear. Actualizamos los contadores, los mostramos en el pie con set status, y si la respuesta no es permitir, devolvemos block true con el motivo: el usuario lo ha bloqueado.

Copiamos la extensión a la carpeta extensions de nuestro directorio de agente, así que a partir de ahora se carga siempre, y arrancamos Pi con la extensión de tests además. En la lista del arranque aparecen las dos: permisos y tests.

Le pedimos algo con varios pasos: añade al README una sección corta sobre los tests, y comprueba que siguen pasando.

Fíjate en lo que no pregunta. El modelo mira el estado del repositorio con git status y git log, y lee el README. Después intenta usar nuestra herramienta de tests, pero le pasa como fichero la palabra null, entre comillas. No se ejecuta ningún test, nuestra herramienta lanza el error, y Pi lo pinta en rojo: así se ve un fallo de herramienta. El modelo lo entiende y recurre a npm test, que también está en la lista de seguros. Todo eso es lectura, y pasa sin interrumpirte. Un modo de aprobación que pregunta por todo acaba con la persona aprobando sin leer, que es lo mismo que no tenerlo.

Y cuando llega la edición del README, Pi se detiene. Encima del diálogo vemos el cambio propuesto, el diff, con las líneas nuevas. Debajo, nuestra pregunta, con la acción: edit README punto md. Permitimos, y el modelo termina la tarea. En el pie, nuestro contador: una aprobada, cero bloqueadas.

Ahora le pedimos que haga commit del cambio. Esto ya no es lectura: git add, git commit con su mensaje, y un git log para comprobarlo. El diálogo aparece con el comando completo, y esta vez elegimos bloquear.

El modelo recibe nuestro motivo como resultado de la herramienta, el usuario lo ha bloqueado, y no insiste: dice que no se ha ejecutado nada y pregunta si lo intenta con otro mensaje o preferimos revisarlo antes. El pie lo refleja: una aprobada, una bloqueada.

Permitir siempre en esta sesión guarda la acción exacta. Si el modelo vuelve a pedir la misma edición o el mismo comando, pasa sin preguntar. Y es de verdad en esta sesión: una sesión nueva, con barra new, carga la extensión de cero, y el conjunto empieza vacío.

**7 · Barra reload y rutas protegidas**

Lo bueno de escribir tu propio modo de aprobación es que puedes ajustarlo mientras trabajas. Pongamos que hay ficheros que nunca quieres que el modelo toque, ni siquiera preguntando: las instrucciones del proyecto, en AGENTS punto md, y la carpeta punto git.

En otra pestaña, el diff de permisos punto ts con el cambio, que copiamos a la carpeta del agente. Una lista de rutas protegidas, y una regla nueva al principio del handler: si la herramienta es write o edit y la ruta es una de esas, una notificación de aviso y block true, sin diálogo.

No hace falta salir de Pi. Barra reload vuelve a cargar las extensiones, las skills, los prompts, los temas y los ficheros de contexto. El pie con el contador desaparece. Reload no actualiza la extensión en caliente, sino que tira el entorno de extensiones y lo crea de nuevo, así que los contadores y lo permitido para siempre vuelven a cero. Si algo tiene que sobrevivir a una recarga, hay que guardarlo, y eso es el tema del próximo vídeo.

Probamos: añade a AGENTS punto md una regla para no usar dependencias externas. El modelo prepara la edición, y en lugar del diálogo aparece nuestro motivo en rojo y el aviso: ruta protegida, AGENTS punto md. Sin opción a permitir.

Y ahora, algo muy instructivo. El modelo no se rinde a la primera: piensa que quizá el fichero es de solo lectura, e intenta comprobarlo y cambiar sus permisos con chmod. Ese comando no está en la lista de seguros, así que nuestra extensión lo para y nos pregunta. Lo bloqueamos. Y solo entonces el modelo se detiene: nos cuenta que el fichero está protegido, nos propone el texto de la regla para que la añadamos nosotros, y pregunta si queremos desprotegerlo. Quédate con esta escena, porque volveremos a ella en un momento.

Este ciclo, editar el fichero, barra reload y probar, es la forma de desarrollar extensiones. Y fíjate en que la extensión de tests, cargada con guion e, también se recarga: si cambias su código, barra reload lo vuelve a leer del disco.

**8 · Sin interfaz, y lo que no es**

Las extensiones se cargan en todos los modos de Pi: el interactivo, el modo print con pi guion p, el modo JSON y el modo RPC. En los dos primeros que no son interactivos no hay diálogos. Por eso nuestra extensión mira ctx punto has UI antes de preguntar.

Salimos de Pi y lo probamos en modo print: haz commit del cambio del README. El modelo intenta el commit, nuestra extensión lo bloquea con el motivo, sin interfaz para aprobar la acción, y el modelo nos lo explica: los comandos de solo lectura, como git status, sí funcionan, pero git add y git commit necesitan una aprobación que aquí nadie puede dar. Nos deja el estado del repositorio y los dos comandos para hacerlo a mano. Es la decisión segura: si Pi corre en un script o en integración continua, lo que no esté en la lista de seguros no se ejecuta.

Algunas variantes que puedes construir sobre esta base. Los diálogos aceptan un timeout: si nadie responde en, digamos, treinta segundos, se cierran solos, y tu extensión puede tratarlo como un bloqueo. En lugar de una lista de comandos, puedes decidir con las anotaciones de las herramientas, como hace Codex: preguntar por todo lo que no sea de solo lectura, que incluye las herramientas MCP que se declaran destructivas. La documentación de Pi trae ese fragmento casi listo. Y Pi incluye ejemplos instalados que conviene leer: permission gate, protected paths, confirm destructive, que pide confirmación antes de borrar o cambiar de sesión, y status line, con el pie.

Y ahora, lo que no es. Esto es un modo de aprobación, no un aislamiento. Acuérdate del chmod: bloqueamos la edición, y el modelo buscó otro camino por bash. Esta vez lo cazamos porque chmod no está en la lista de seguros. Pero la extensión se basa en reconocer comandos con expresiones regulares, y un modelo con prisa, o un texto malicioso en tu repositorio, puede encontrar caminos que no hayas previsto. Te protege de errores y te da control, que es mucho. Pero contra un ataque, la respuesta sigue siendo la del vídeo cinco: limitar lo que Pi puede alcanzar, con un contenedor o una máquina aparte. Lo ideal es combinar las dos cosas.

**9 · Cierre**

Repasemos. Una extensión es un módulo de TypeScript con una factoría que recibe la API de Pi. Register command añade comandos que ejecutas tú. Register tool añade herramientas que llama el modelo, con parámetros definidos con TypeBox y un resultado con content para el modelo y details para ti. Pi punto on te engancha a los eventos, y tool call puede bloquear cualquier herramienta antes de que se ejecute. Barra reload vuelve a cargarlo todo mientras trabajas.

La práctica: copia permisos punto ts, adapta la lista de comandos seguros a tu proyecto, y úsalo una tarde. Apunta qué te pregunta de más y qué te pregunta de menos, y ajústalo con barra reload. Después añade una herramienta propia para algo que hagas a menudo: los tests, el linter o el despliegue a un entorno de pruebas.

En el próximo vídeo seguimos con las extensiones: estado que sobrevive a rebobinar la sesión, el fallo típico al hacerlo, y cómo empaquetar, instalar y publicar tus extensiones. Nos vemos allí.

</details>

