---
title: "Vídeo 10 · Pi programático: scripts, CI, RPC y SDK"
description: "Pi sin interfaz, en scripts, en integración continua, por JSON y RPC y como librería. Lo metemos en un pipeline real."
ruta: "pi-oh-my-pi"
orden: 10
duracion: "26 min"
video: "10-pi-programatico.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/10-pi-programatico.es.vtt"
---

Pi sin interfaz, en scripts, en integración continua, por JSON y RPC y como librería. Lo metemos en un pipeline real.

<p class="guia__nota">Dura 26 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Cuatro formas de hablar con Pi

<p><button type="button" class="ir-a" data-t="21">▶ Ir a 0:21</button></p>

- **Ya lo asomamos**
  - `04` · pi -p: una pregunta de una línea
  - `07` · --mode json: medir el contexto con jq
  - `08` · Permisos: bloquea sin interfaz
- **Mismo agente:** Cambia cómo entra, cómo sale y cuánto vive — Mismas sesiones, recursos y herramientas en todos los modos.
- **Cuatro modos**
  - `tui` · Interactivo: el que conoces
  - `-p` · Print: texto final y sale
  - `json` · JSON: eventos, uno por línea
  - `rpc` · RPC: se queda escuchando
- **Y una quinta vía:** El SDK — Pi como librería dentro de tu programa de Node o de Bun.
- **Cuál elegir**
  - `print` · Respuesta final
  - `json` · Qué pasó: herramientas y coste
  - `rpc` · Conversar: y contestar diálogos
  - `sdk` · TypeScript: acceso a todo

### 2 · Pi guion p en scripts

<p><button type="button" class="ir-a" data-t="138">▶ Ir a 2:18</button></p>

- **pi -p · --print:** Ejecuta, escribe y termina — Sin interfaz, sin colores, sin pie.
- *En la demo:* Sin -p: al redirigir, modo print
- *En la demo:* git diff master | pi -p
- *En la demo:* Solo herramientas de lectura
- *En terminal:* Más formas de dar entrada a pi -p (más abajo, en «Código y comandos»)
- **Tres opciones para scripts**
  - `--tools` · Solo lectura: read, grep, find, ls
  - `--no-session` · Sin rastro: no guarda sesión
  - `--model` · Fijado: no depende de nadie
- *En la demo:* Código de salida: 0
- **Cuidado:** Cero = ha terminado de hablar — No que sea correcto, ni que haya podido hacer lo que pediste.

### 3 · El modo JSON

<p><button type="button" class="ir-a" data-t="305">▶ Ir a 5:05</button></p>

- *En la demo:* --mode json
- *En la demo:* jq sobre eventos.jsonl
- *En la demo:* Los mismos eventos que las extensiones
- **message_update y message_end**
  - `update` · Solo el delta: para pintar en directo
  - `end` · El definitivo: con uso y coste
- **¿Cuándo ha terminado?**
  - `agent_end` · No siempre: reintentos, compactación, cola
  - `agent_settled` · El final: ya no hará nada más
- **Leer JSONL desde código:** Corta solo por \n — readline también corta en U+2028 y U+2029. Y lee sin parar.
- *En la demo:* stopReason: toolUse, stop

### 4 · Pi en un pipeline

<p><button type="button" class="ir-a" data-t="474">▶ Ir a 7:54</button></p>

- *En la demo:* scripts/revisar.sh
- *En la demo:* 1 · Los tests, sin modelo
- *En la demo:* 2 · Pi revisa el diff
- *En la demo:* La petición
- *En la demo:* 3 · Leer los eventos
- *En la demo:* revisar.sh master
- *En la demo:* errores.jsonl
- **La lección:** Mira los eventos, no solo el código de salida — Un bloqueo no es un error de Pi. Lo detecta el script.

### 5 · Integración continua

<p><button type="button" class="ir-a" data-t="681">▶ Ir a 11:21</button></p>

- *En la demo:* .github/workflows/revision-pi.yml
- *En la demo:* Disparo, permisos e instalación
- *En la demo:* Rama base y tests sin clave
- *En la demo:* secrets.DEEPSEEK_API_KEY
- *En la demo:* Arranque limpio y solo lectura
- *En la demo:* upload-artifact, if: always()
- **Variables de ida y vuelta**
  - `shellCommandPrefix` · export CI=1: antes de cada bash
  - `AI_AGENT=pi` · Lo ve el proceso: que lanza Pi
- **El apunte honesto**
  - `lectura` · Solo leer: --tools de lectura
  - `docker` · Contenedor: como en el vídeo 05
  - `secretos` · Forks: revisa tu plataforma

### 6 · RPC: Pi como proceso de larga vida

<p><button type="button" class="ir-a" data-t="882">▶ Ir a 14:42</button></p>

- **Modo RPC:** Pi como proceso de larga vida — Órdenes por la entrada estándar, respuestas y eventos por la salida.
- *En terminal:* pi --mode rpc --no-session --tools read,grep,find,ls (más abajo, en «Código y comandos»)
- **La clave del protocolo:** El identificador — Las órdenes se atienden de forma asíncrona: empareja por id, no por orden.
- *En terminal:* Una petición por RPC (más abajo, en «Código y comandos»)
- *En la demo:* Eventos hasta agent_settled
- **Órdenes RPC**
  - `steer` · Encolar: steer y follow_up
  - `abort` · Parar
  - `set_model` · Cambiar: modelo, compact, fork
  - `Ctrl+D` · Cerrar: cerrar stdin
- **En RPC:** has UI = true — No hay terminal, pero hay un cliente que puede contestar.
- *En terminal:* Diálogos de extensión por RPC (más abajo, en «Código y comandos»)
- *En la demo:* aprobador.mjs
- *En la demo:* node aprobador.mjs
- *En la demo:* «n»
- **La misma extensión**
  - `tui` · Pregunta: en la interfaz
  - `print` · Bloquea: en un script
  - `rpc` · Pregunta: por cualquier cliente
- **Dos avisos**
  - `RpcClient` · No contesta diálogos: los atiendes tú
  - `ctx.mode` · No todo viaja: componentes, temas…

### 7 · El SDK: Pi dentro de tu programa

<p><button type="button" class="ir-a" data-t="1172">▶ Ir a 19:32</button></p>

- **SDK:** createAgentSession — Sin otro proceso, sin JSON, sin protocolo: métodos de TypeScript.
- *En la demo:* resumen.ts
- *En la demo:* subscribe · prompt · dispose
- *En la demo:* node resumen.ts ~/csn/tienda
- **Sin opciones:** Como la línea de comandos — Extensiones, skills, AGENTS.md, ajustes, credenciales y modelo por defecto. Mira examples/sdk/.
- **Tres diferencias**
  - `builtin` · Sin integradas: codemode, MCP… las añades tú
  - `hasUI` · Falso: permisos bloquea
  - `AI_AGENT` · Sin marcar: no se ponen las variables
- **¿SDK o RPC?**
  - `SDK` · Node o Bun: acceso completo
  - `RPC` · Otro lenguaje: proceso aparte

### 8 · Fuera del escritorio: tmux, Termux y Windows

<p><button type="button" class="ir-a" data-t="1347">▶ Ir a 22:27</button></p>

- **Fuera del escritorio:** tmux · Termux · Windows — La documentación de Pi dedica una guía a cada uno.
- *En terminal:* ~/.tmux.conf (tmux 3.5 o posterior) (más abajo, en «Código y comandos»)
- **Termux**
  - `pkg` · Node y git: y Pi con npm
  - `storage` · Almacenamiento: termux-setup-storage
  - `AGENTS.md` · Cuéntaselo: en tu AGENTS.md global
- **Windows**
  - `Git Bash` · bash nativo: shellPath si usas otro
  - `powershell` · Herramienta opcional: solo en Windows nativo
  - `Ctrl+Q` · follow up: en Windows y WSL

### 9 · Cierre

<p><button type="button" class="ir-a" data-t="1461">▶ Ir a 24:21</button></p>

- **Repaso**
  - `-p` · Print: respuesta final
  - `json` · JSON: agent_settled
  - `rpc` · RPC: ids y diálogos
  - `sdk` · SDK: createAgentSession
- **Tres ideas**
  - `1` · Sin modelo: lo comprueba el script
  - `2` · Los eventos: no el código de salida
  - `3` · En CI: lectura, secreto, contenedor
- **La práctica:** revisar.sh (tests + Pi en JSON) → Una rama rota (que falle un test) → Pide arreglarlo (y detecta el bloqueo)
- **Bloque C:** De Pi a oh my pi — Un fork sobre Bun, núcleo en Rust y las baterías incluidas.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Más formas de dar entrada a pi -p

```text
pi -p @src/envio.js "¿Qué hace este fichero?"
pi -p "Primero esto" "Después esto"
pi -p -- "-1 es un número negativo"
```

- `@src/envio.js`: Adjuntar
- `"Después esto"`: Varias peticiones
- `--`: Fin de opciones

### pi --mode rpc --no-session --tools read,grep,find,ls

```text
→ {"id":"1","type":"get_state"}
← {"id":"1","type":"response","command":"get_state","success":true,
   "data":{"model":{"id":"deepseek-flash","provider":"deepseek",…},…}}
```

- `"type":"get_state"`: Orden
- `"success":true`: Respuesta
- `"deepseek-flash"`: Modelo

### Una petición por RPC

```text
→ {"id":"2","type":"prompt","message":"En una frase: qué hace src/carrito.js"}
← {"id":"2","type":"response","command":"prompt","success":true,"disposition":"started"}
← {"type":"agent_start"} … {"type":"message_update",…} … {"type":"agent_settled"}
```

- `"disposition":"started"`: Aceptada
- `"agent_settled"`: Terminada

### Diálogos de extensión por RPC

```text
← {"type":"extension_ui_request","id":"u1","method":"select","title":"Pi quiere ejecutar: …","options":[…]}
→ {"type":"extension_ui_response","id":"u1","value":"Bloquear"}
← {"type":"extension_ui_request","method":"setStatus","statusText":"permisos: 0 aprobadas · 1 bloqueadas"}
```

- `"method":"select"`: Pregunta
- `"value":"Bloquear"`: Respuesta exacta
- `"setStatus"`: Sin respuesta

### ~/.tmux.conf (tmux 3.5 o posterior)

```text
set -g extended-keys on
set -g extended-keys-format csi-u

# Comprobar: Shift+Enter = salto de línea · Enter = enviar · Alt+Enter = follow-up
```

- `extended-keys on`: Teclas extendidas
- `csi-u`: Formato
- `Alt+Enter`: follow-up

## Fuentes

- Documentación instalada de Pi 1.0.1 (`$(npm root -g)/@earendil-works/pi-coding-agent/docs/`): `cli.md`
  (*Invocation and output*, *Tools*, *Prompts and process*), `cli-integration.md` (entero), `json.md` (entero),
  `rpc.md` (entero), `rpc-commands.md` (`prompt`, `get_state`, `abort`, `bash`), `rpc-extension-ui.md` (entero,
  incluida la nota de que en RPC `ctx.hasUI` es `true`), `sdk.md` (entero), `message-types.md` (`stopReason`, `usage`),
  `providers.md` (tabla de variables, `DEEPSEEK_API_KEY`; «useful in CI»), `models.md` (claves por entorno en CI),
  `environment-variables.md` (`PI_CODING_AGENT_DIR`, `PI_SKIP_VERSION_CHECK`, `PI_OFFLINE`, `AI_AGENT`,
  `PI_CODING_AGENT`, `PI_SESSION_ID`…), `shell-aliases.md` (`shellCommandPrefix`, `"export CI=1"`), `tmux.md`,
  `termux.md`, `windows.md`.
- Código instalado: `dist/modes/print-mode.js` (código de salida 1 solo si el último mensaje del asistente acaba en
  `error` o `aborted`), `dist/core/extensions/runner.js` (sin contexto de UI, `hasUI` es falso y el modo por defecto es
  `print`), `dist/core/extensions/types.d.ts` (`ExtensionMode = "tui" | "rpc" | "json" | "print"`),
  `dist/modes/rpc/rpc-client.d.ts` y `.js` (`RpcClient`, `cliPath` por defecto `dist/cli.js`; no gestiona
  `extension_ui_request`), `dist/core/sdk.d.ts` (`CreateAgentSessionOptions`), `dist/core/agent-session.d.ts`
  (`getLastAssistantText`, `bindExtensions`, `dispose`).
- Ejemplos instalados: `examples/rpc-client.ts`, `examples/rpc-extension-ui.ts`, `examples/extensions/rpc-demo.ts`,
  `examples/sdk/01-minimal.ts`, `02-custom-model.ts`, `05-tools.ts`, `06-extensions.ts`, `examples/sdk/README.md`.
- `pi --help` (Pi 1.0.1) y `CHANGELOG.md` (disposición de `prompt` en RPC, `AI_AGENT=pi`, `message_update` solo con
  deltas, `agent_settled`).
- Vídeos anteriores: 02 (prometió `pi -p` para este vídeo; Windows y Termux como plataformas; `Ctrl+Q` en Windows),
  04 (`pi -p` con una pregunta de una línea; claves por variable de entorno para CI), 05 (`--approve`/`--no-approve` en
  pipelines, Docker), 07 (medida de contexto con `pi -p --mode json` y `jq`; el SDK no carga las extensiones
  integradas), 08 (`permisos.ts`; en `pi -p` bloquea porque `ctx.hasUI` es falso; «aprobar no es aislar»), 09
  (`permisos.ts` con «Permitir siempre en esta rama», paquete en `~/csn/extensiones`; anunció este vídeo: «pi guion p
  en scripts y en integración continua, el modo JSON, el modo RPC y el SDK con create agent session»).
- Documentación oficial de Pi: [tmux.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/tmux.md), [windows.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/windows.md)

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Cuatro formas de hablar con Pi**

Hasta ahora casi todo lo hemos hecho en la interfaz de terminal: escribes, Pi trabaja, tú miras. Pero ya hemos asomado la cabeza fuera unas cuantas veces. En el vídeo cuatro le hicimos una pregunta de una línea con pi guion p. En el siete medimos lo que cuesta un servidor MCP con el modo JSON y jota cu. Y en el ocho vimos que nuestra extensión de permisos bloquea en modo print, porque no hay nadie para contestar.

Hoy convertimos esas pruebas sueltas en un método. Pi tiene cuatro modos, y los cuatro usan el mismo agente, las mismas sesiones, los mismos recursos y las mismas herramientas. Lo único que cambia es cómo entra lo que le pides, cómo sale lo que hace, y si el proceso se queda vivo esperando más.

El interactivo es el que conoces. El modo print ejecuta lo que le pidas, escribe el texto final de la respuesta y sale. El modo JSON también ejecuta y sale, pero en lugar del texto final te da todos los eventos de la ejecución, uno por línea. Y el modo RPC no sale: se queda escuchando órdenes por su entrada estándar y contestando por la salida, todo el tiempo que quieras.

Y hay una quinta vía que no es un modo de la línea de comandos: el SDK. En lugar de lanzar Pi como otro proceso, lo importas como una librería dentro de tu programa de Node o de Bun, y hablas con la sesión directamente, con sus métodos y sus eventos de TypeScript.

La regla para elegir es sencilla. Si solo necesitas la respuesta final, print. Si necesitas saber qué ha pasado por el camino, qué herramientas ha usado y cuánto ha costado, JSON. Si tu programa tiene que mantener una conversación, cambiar de modelo o contestar diálogos, RPC. Y si tu programa ya es TypeScript y quieres acceso a todo, el SDK. Vamos uno a uno, y por el camino los juntamos en un pipeline de verdad.

**2 · Pi guion p en scripts**

Empezamos por el más útil en el día a día. Pi guion p, o guion guion print, ejecuta las peticiones que le pases, escribe por la salida estándar el texto final del asistente, y termina. Sin interfaz, sin colores, sin pie. Justo lo que necesita un script.

Hay un detalle que conviene saber. Si la entrada o la salida no son una terminal, porque las rediriges o las encadenas con una tubería, Pi elige el modo print él solo, aunque no escribas guion p. En la demo lo vemos: lanzamos pi con una pregunta y redirigimos la salida a un fichero. No se abre ninguna interfaz. Pi responde, escribe la línea en el fichero, y sale.

Lo que entra también tiene sus reglas. Lo que le llegue por una tubería se antepone a tu primera petición. Así funciona la primera prueba de hoy: en una rama de la tienda donde hemos subido el umbral del envío gratis, git diff master, una tubería, y pi guion p con la petición: revisa este cambio en tres viñetas cortas. El diff entra como contexto y la revisión sale por la pantalla: el JSDoc sigue diciendo cuarenta euros, varios tests del envío y del carrito se rompen con el nuevo umbral, y falta la prueba del cambio.

Y el propio modelo avisa de que no tiene shell para ejecutar los tests, porque solo le hemos dado herramientas de lectura.

Además del texto de la tubería, puedes adjuntar ficheros con arroba y la ruta, igual que en la interfaz. Puedes pasar varias peticiones seguidas, y Pi las ejecuta en orden en la misma sesión. Y si tu petición empieza por un guion, pon antes guion guion, para que Pi no la confunda con una opción.

Tres opciones que en un script casi siempre quieres. Guion guion tools, para darle solo las herramientas que necesita. Para una revisión bastan las de lectura: read, grep, find y ls. Sin bash, sin edit y sin write, no puede cambiar nada, por mucho que se equivoque. Guion guion no session, para que no deje una sesión guardada por cada ejecución del script. Y guion guion model, para fijar el modelo y no depender de lo que alguien tenga configurado.

Y lo último, el código de salida, que es lo que mira un script para saber si algo ha ido bien. En modo print, Pi sale con un código distinto de cero si la respuesta final acaba en error o se ha abortado: la clave no vale, el proveedor falla, se corta la conexión. Los errores van a la salida de errores, no se mezclan con la respuesta. En la demo, después de la revisión, el código de salida es cero.

Pero fíjate en lo que eso no dice. Un cero significa que Pi ha terminado de hablar, no que lo que ha dicho sea correcto, ni que haya podido hacer lo que le pediste. Lo veremos enseguida con la extensión de permisos.

**3 · El modo JSON**

Cuando el texto final no basta, pasamos a guion guion mode json. La ejecución es la misma, pero por la salida estándar sale un registro JSON por línea. Es el formato JSONL que ya conoces de las sesiones del vídeo tres. La primera línea es la cabecera de la sesión, con su identificador y su directorio. Y después, todos los eventos de la ejecución, en orden.

En la demo guardamos los eventos de una pregunta sencilla en un fichero, y los miramos con jota cu. Primero la cabecera. Después, un recuento por tipo de evento: verás muchísimos message update, unos pocos de inicio y fin de mensaje, de turno y de herramienta, y al final uno solo que se llama agent settled.

Los nombres te sonarán del vídeo ocho, porque son casi los mismos que escuchan las extensiones. Agent start y agent end, al empezar y terminar una ejecución. Turn start y turn end, por cada vuelta del bucle. Message start, message update y message end, por cada mensaje. Y tool execution start, update y end, por cada herramienta, con su nombre, sus argumentos y su resultado. Filtramos los inicios de herramienta, y ahí está la llamada a ls que hemos pedido, con su argumento.

Dos detalles que te ahorran disgustos. El primero: los message update solo traen el trozo nuevo de texto, el delta, no el mensaje entero cada vez. Si quieres pintar la respuesta en directo, vas sumando los deltas. Pero el mensaje que vale es el de message end, que es el completo y definitivo, con el uso de tokens y el coste. Es lo que leíamos en el vídeo siete para medir el contexto.

El segundo: agent end no siempre es el final. Después puede venir un reintento automático, una compactación, o mensajes que estaban en cola. El evento que te dice que Pi ya no va a hacer nada más por su cuenta es agent settled. Si tu programa espera a que termine, espera a ese.

Y un aviso para quien vaya a leer este flujo desde código. Corta las líneas solo por el salto de línea. El lector de líneas de Node, readline, también corta en dos caracteres de Unicode que son válidos dentro de un texto JSON, y acabarías partiendo un registro por la mitad. La documentación de Pi lo dice expresamente: usa un decodificador de bytes y separa por el salto de línea. Y lee la salida sin parar, porque si dejas de leer, Pi se queda esperando.

Por último, el código de salida, que aquí es todavía más estricto. En modo JSON, una respuesta que falla aparece en los eventos, pero no cambia el código de salida. Pi solo sale con error si la propia ejecución revienta. Así que, en este modo, quien decide si ha ido bien eres tú, mirando los eventos. Por ejemplo, el stop reason del último message end del asistente: si es stop, terminó con normalidad; si es error o aborted, no.

**4 · Pi en un pipeline**

Con estas dos piezas ya podemos montar algo serio: un script que revise una rama antes de integrarla. Se llama revisar punto sh y lo vamos a leer de arriba abajo, porque cada línea tiene su porqué.

Lo primero que hace no tiene nada que ver con Pi. Ejecuta npm test y guarda el código de salida. Es una decisión de diseño que viene del vídeo uno: lo que se puede comprobar sin modelo, lo comprueba el script. Que los tests pasen o fallen es un hecho, y no se lo vamos a preguntar a un modelo. El modelo aporta otra cosa: leer el cambio y decirte qué riesgos ve.

Después, el diff de la rama entra por una tubería a pi en modo JSON. Sin sesión. Con guion guion no approve, que recordarás del vídeo cinco: ignora la configuración y los recursos del proyecto que dependen de la confianza, para que una rama no pueda colar una extensión propia. Sin las skills personales de quien lo ejecute. Con el modelo fijado, deepseek flash, que para revisar un diff pequeño sobra. Y con guion e y nuestra extensión de permisos del vídeo ocho, como red de seguridad.

La petición le cuenta cómo han salido los tests, le dice que puede leer ficheros pero no modificar nada, y le pide un formato: resumen, riesgos, y una última línea con el veredicto, OK o CAMBIOS. Los eventos van a un fichero, y los diagnósticos de Pi a otro.

La tercera parte lee el resultado con jota cu. El stop reason del último mensaje, para saber si Pi terminó bien. El texto final, que se guarda como informe en Markdown. Y las herramientas que acabaron en error, con su motivo, en un fichero aparte. Si Pi no terminó bien, el script sale con un código propio. Si terminó bien, sale con el código de los tests.

Lo ejecutamos contra master. Tres tests fallan, porque subimos el umbral sin tocar las pruebas, y el script sale con uno. Antes, un aviso: hay herramientas con error o bloqueadas. El informe lo explica todo: el cambio sube el envío gratis de cuarenta a cincuenta euros, señala los tests que fallan con la línea de cada uno, los riesgos, las correcciones necesarias sin aplicarlas, y termina con veredicto: cambios. El veredicto del modelo es orientativo; el que rompe el pipeline es el test.

¿Y ese aviso? Es la red de seguridad funcionando. En esta ejecución no le quitamos bash, y el modelo, siguiendo el AGENTS punto md de la tienda, intentó lanzar comandos de shell que no están en la lista de seguros. En modo JSON no hay interfaz, así que nuestra extensión hizo lo que hacía en el vídeo ocho: bloquear con el motivo, sin interfaz para aprobar la acción. El fichero de errores lo enseña: dos llamadas a bash, cada una con ese motivo. Y git status, limpio.

Y aquí está la lección del capítulo: para Pi, todo ha ido bien. El último stop reason es stop. Un bloqueo no es un error de Pi; es una herramienta que no se ejecutó, y el modelo lo entiende y responde con normalidad. Este fichero, además, mezcla dos cosas distintas: herramientas bloqueadas y herramientas que fallaron, como un npm test en rojo; si tu pipeline necesita distinguirlas, filtra por el motivo. Si tu pipeline solo mirara si Pi ha terminado, no se habría enterado. Quien lo detecta es el script, leyendo los eventos. Cuando automatizas un agente, decide de antemano qué señales miras, y no te fíes de una sola.

**5 · Integración continua**

Llevar este script a integración continua es casi trivial, y por eso conviene hacerlo con cuidado. En la ventana de código tienes un workflow de GitHub Actions. No lo ejecutamos contra GitHub, pero se entiende paso a paso.

Se dispara en cada pull request, con permisos de solo lectura sobre el repositorio y un tiempo máximo de diez minutos, para que un agente atascado no se quede gastando. Descarga el código con todo el historial, porque el script necesita la rama base para el diff. Prepara Node veintidós e instala Pi con npm, con guion guion ignore scripts y la versión fijada, uno punto cero punto cuatro. En integración continua no quieres que una versión nueva te cambie el comportamiento sin avisar.

Después, dos pasos que parecen detalles y no lo son. El primero copia el script y la extensión de permisos desde la rama base, no desde el pull request. Lo que protege el pipeline no puede venir de la rama que se revisa, o cualquiera podría quitar la red en el mismo cambio. El segundo ejecuta los tests aparte, sin la clave en el entorno, porque los tests también son código de la rama.

Y el paso de la revisión. Aquí entra la clave del modelo, y es la parte que no vas a ver en pantalla. Pi lee la clave de una variable de entorno, en nuestro caso DEEPSEEK underscore API underscore KEY, como vimos en los vídeos dos y cuatro. En el workflow esa variable se rellena desde un secreto del repositorio, que se da de alta en la configuración del proyecto y que la plataforma oculta en los registros. La clave nunca está en el código ni en el fichero del workflow.

Junto a la clave, otras variables. PI underscore CODING underscore AGENT underscore DIR apunta a un directorio temporal del runner, así que Pi arranca limpio, sin ajustes, sesiones ni credenciales de nadie. PI underscore SKIP underscore VERSION underscore CHECK evita que pregunte a pi punto dev si hay versión nueva. Y PI underscore TOOLS hace que el script le dé a Pi solo las herramientas de lectura. En la demo local no la pusimos, y por eso pudo intentar usar bash.

Al final, el informe, los errores y los eventos se suben como artefacto, también si algo ha fallado, para que puedas mirar después qué hizo el agente. En integración continua nadie mira en directo, y los eventos son tu forma de reconstruir la ejecución.

Un truco más, que viene de la documentación de los alias. El ajuste shell command prefix ejecuta un texto antes de cada comando de bash que lance Pi. El ejemplo de la documentación es justo este caso: export CI igual a uno, para que las herramientas que lance el modelo sepan que no hay nadie delante. Y en sentido contrario, los procesos que lanza Pi reciben la variable AI underscore AGENT igual a pi, por si tus scripts quieren saber que los ha llamado un agente.

Y el apunte honesto, que aquí es obligatorio. Un pull request es texto de otra persona. Su diff y su AGENTS punto md llegan al modelo, que trabaja en una máquina con tu clave en el entorno. Guion guion no approve evita que cargue extensiones del proyecto, pero no impide que el texto le dé instrucciones. Y ya lo dijimos en el vídeo ocho: aprobar no es aislar. En integración continua, lo prudente es darle a Pi solo herramientas de lectura, ejecutarlo dentro de un contenedor como en el vídeo cinco, y revisar la política de secretos de tu plataforma para ramas de terceros.

**6 · RPC: Pi como proceso de larga vida**

Print y JSON tienen algo en común: le das todo al principio, Pi trabaja y sale. A veces necesitas otra cosa. Un editor que habla con Pi durante horas, o un programa en Python que quiere mandar una petición, mirar el estado, cambiar de modelo y mandar otra. Para eso está el modo RPC.

Lo arrancamos con pi guion guion mode rpc, guion guion no session y las herramientas de lectura. Y ahora no hay petición: Pi se queda esperando. Le escribimos a mano una línea de JSON con un identificador y el tipo get state. Pi contesta con una línea de respuesta: el mismo identificador, el comando, success true, y en data el estado de la sesión, con el modelo que está usando.

Ese identificador es la clave del protocolo. Cada orden puede llevar el suyo, y la respuesta lo repite. Como las órdenes se atienden de forma asíncrona, tu cliente no debe fiarse del orden de llegada, sino del identificador.

Ahora una orden de tipo prompt, con un mensaje: en una frase, qué hace src barra carrito punto js. La respuesta llega enseguida, con disposition started. Y aquí está la sutileza: esa respuesta solo dice que la petición se ha aceptado, no que haya terminado. Detrás viene el chorro de eventos, los mismos del modo JSON, hasta agent settled. Si quieres saber cuándo ha acabado, esperas a ese evento, igual que antes.

Hay órdenes para casi todo lo que haces en la interfaz: steer y follow up para encolar mensajes, abort para pararlo, set model, compact, fork, o bash para ejecutar un comando. Y para terminar, basta con cerrar su entrada estándar: pulsamos control d, y Pi se apaga de forma ordenada.

Ahora viene lo más interesante de RPC, y enlaza directamente con las extensiones. En el vídeo ocho, nuestra extensión miraba ctx punto has UI antes de preguntar, y en modo print bloqueaba porque no había interfaz. En RPC, has UI es verdadero. No hay terminal, pero hay un cliente al otro lado que puede contestar. Así que el diálogo de permisos no desaparece: viaja por el protocolo.

Funciona así. Cuando una extensión llama a select, confirm, input o editor, Pi escribe una línea de tipo extension UI request, con un identificador, el método, el título y las opciones. Y espera. Tu cliente muestra la pregunta como quiera, y devuelve una línea de tipo extension UI response con el mismo identificador y la opción elegida, escrita exactamente igual. Las notificaciones y los textos del pie, como nuestro contador, también llegan como peticiones, pero esas no esperan respuesta.

Para verlo, un cliente mínimo, aprobador punto mjs, en unas cuarenta líneas de JavaScript sin dependencias. Lanza Pi en modo RPC con nuestra extensión de permisos. Lee su salida cortando solo por el salto de línea, como manda la documentación. Escribe en pantalla los trozos de texto de la respuesta y el nombre de cada herramienta. Y cuando llega una petición de select, nos hace la pregunta en la terminal, sí o no, y contesta permitir o bloquear.

Lo lanzamos en la tienda con la petición del vídeo ocho: añade al README una sección corta sobre los tests. Lo primero que llega es el estado del pie, como texto: cero aprobadas, cero bloqueadas. Después, las herramientas que usa el modelo, bash y read, para mirar el repositorio y leer el README, sin preguntar porque son lecturas. Al llegar al edit, nuestro cliente imprime el título del diálogo de permisos, el mismo que veíamos en la interfaz, pi quiere ejecutar edit README punto md, y nos pregunta.

Contestamos que no. Llega el pie actualizado, cero aprobadas y una bloqueada, y el modelo nos explica que el cambio fue bloqueado y el README sigue intacto.

Piensa en lo que acabamos de hacer. La misma extensión, sin cambiar una línea, pregunta en la interfaz de Pi, bloquea en un script, y pregunta a través de cualquier programa que hable RPC. Ese programa podría ser una web, un bot de chat del equipo, o un editor. La decisión de permisos sigue en la extensión; dónde se pregunta lo decide el cliente.

Dos avisos prácticos. Para clientes de TypeScript, Pi exporta una clase, RPC client, que lanza el proceso, empareja respuestas y te da métodos con tipos. Pero no contesta los diálogos de las extensiones: si cargas una que pregunta, los atiendes tú. Y no todo lo de la interfaz llega por RPC: los componentes propios, los cambios de pie o de cabecera y los temas no funcionan, y la documentación lista cuáles. Si una extensión depende de la terminal, que lo compruebe con ctx punto mode igual a tui.

**7 · El SDK: Pi dentro de tu programa**

La última vía es la más directa. Con el SDK no hay otro proceso, ni JSON, ni protocolo. Importas create agent session del paquete de Pi, y te devuelve una sesión con la que hablas con métodos normales de TypeScript.

Este es resumen punto ts, en unas veinte líneas. Crea la sesión con tres opciones. El directorio de trabajo, que le pasamos como argumento, porque decide qué AGENTS punto md se carga y dónde trabajan las herramientas. Las herramientas, solo las de lectura, igual que en el script. Y un gestor de sesión en memoria, para que no quede ningún fichero de sesión.

Después nos suscribimos a los eventos, y por cada herramienta que empieza escribimos su nombre por la salida de errores. Son los mismos eventos del modo JSON, pero aquí llegan como objetos de TypeScript, sin pasar por texto. Luego, prompt, con la petición: lista las funciones exportadas de src. Prompt devuelve una promesa que se resuelve cuando la ejecución termina, reintentos incluidos. Leemos el texto final con get last assistant text, y en el bloque finally, dispose, que para lo que quede activo y suelta los recursos.

Lo ejecutamos con node, que entiende TypeScript sin compilar, contra la tienda. Por la salida de errores, las herramientas que usa, ls y grep. Por la salida estándar, la lista: cinco funciones en carrito punto js y una en envio punto js, cada una con sus parámetros. Y como las dos salidas van separadas, si redirigieras la estándar a un fichero, quedaría limpio, listo para otro programa.

Sin opciones, create agent session se comporta como la línea de comandos: usa el directorio de trabajo, descubre las extensiones, las skills y el AGENTS punto md, lee tus ajustes y tus credenciales, y elige el modelo por defecto. Cada pieza se puede cambiar: el modelo y el nivel de razonamiento, los ajustes en memoria, o un cargador de recursos propio con extensiones escritas en línea. Los catorce ejemplos del SDK que se instalan con Pi recorren todas estas variantes, y merece la pena leerlos.

Tres diferencias con la línea de comandos que suelen pillar. La primera, del vídeo siete: el SDK no carga solas las extensiones integradas, ni codemode, ni tool search, ni MCP; si las quieres, las añades tú. La segunda: sin una interfaz conectada, has UI es falso, así que si tu directorio de agente carga nuestra extensión de permisos, en el SDK bloquea, igual que en print. Y la tercera: las variables que marcan a Pi como agente, AI underscore AGENT y compañía, no se ponen cuando lo embebes.

¿SDK o RPC? Si tu programa es de Node o de Bun y quieres acceso completo, el SDK. Si es de otro lenguaje, o prefieres que Pi viva en su propio proceso, que puedas reiniciar o aislar sin tumbar tu programa, RPC.

**8 · Fuera del escritorio: tmux, Termux y Windows**

Pi programático también significa Pi en sitios que no son tu terminal de siempre. La documentación dedica una guía a tres de ellos, y te cuento lo esencial de cada una.

Tmux. Pi funciona dentro de tmux, pero tmux puede enviar mayúsculas enter o control enter como si fueran un enter a secas, y para Pi no son lo mismo: mayúsculas enter es un salto de línea, y enter envía. La solución es activar las teclas extendidas. En tmux tres punto cinco o posterior, dos líneas en tu configuración: extended keys on, y el formato CSI u. En las versiones de la tres punto dos a la tres punto cuatro, solo la primera. Después hay que reiniciar el servidor de tmux y comprobar tres cosas: mayúsculas enter hace un salto de línea, enter envía, y alt enter encola un follow up.

Termux, para llevar Pi a Android. Se instalan Node y git con el gestor de paquetes de Termux, y Pi con npm, igual que en el vídeo dos. Para que Pi vea el almacenamiento compartido del teléfono hay que concederlo con termux setup storage, y solo conviene hacerlo si Pi de verdad lo necesita. El portapapeles funciona con Termux API, pero solo con texto, no con imágenes. Y como Pi no sabe cómo quieres que use Android, la guía recomienda contárselo en tu AGENTS punto md global.

Y Windows. Puedes usar Pi de forma nativa o dentro de WSL. En nativo, la herramienta bash usa Git Bash, que se instala con Git para Windows, y si tienes otro bash, lo indicas con el ajuste shell path. Hay además una herramienta opcional, powershell, que solo existe en Windows nativo y que puedes dar al modelo en lugar de bash. En WSL todo es Linux. Y recuerda los atajos del vídeo dos: en Windows y WSL, el follow up es control q.

**9 · Cierre**

Repasemos. Pi tiene cuatro modos y un SDK, sobre el mismo agente. Pi guion p para la respuesta final, y se elige solo cuando rediriges. El modo JSON para todos los eventos, con message end como mensaje definitivo y agent settled como final de verdad. RPC para controlarlo desde otro proceso, con identificadores y con los diálogos de las extensiones viajando por el protocolo. Y create agent session para tenerlo dentro de tu programa.

Y tres ideas que valen más que cualquier opción. Lo que se puede comprobar sin modelo lo comprueba el script. El código de salida de Pi no te dice si el agente hizo lo que querías: mira los eventos. Y en integración continua, solo lectura, la clave como secreto, y un contenedor, porque aprobar no es aislar.

La práctica: escribe tu propio revisar punto sh para un repositorio tuyo. Que ejecute los tests por su cuenta, que le pase el diff a Pi en modo JSON con herramientas de solo lectura y la extensión de permisos, y que guarde el informe y los errores. Pruébalo con una rama en la que un test falle y con otra en la que le pidas arreglarlo, y comprueba que tu script detecta el bloqueo aunque Pi termine con normalidad.

Con este vídeo cerramos el bloque de Pi. En el próximo empezamos con oh my pi: un fork de Pi sobre Bun, con un núcleo en Rust y las baterías incluidas. Veremos qué hereda de todo lo que hemos aprendido, qué añade, cómo se instala y cómo arrancarlo por primera vez con un perfil de demo. Nos vemos allí.

</details>

