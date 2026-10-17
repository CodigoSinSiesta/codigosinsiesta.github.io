---
title: "Vídeo 19 · Aprobaciones, reglas y hooks"
description: "Endurecer omp para un repositorio de equipo con modos de aprobación, reglas que se activan solas, hooks y protección de secretos."
ruta: "pi-oh-my-pi"
orden: 19
duracion: "24 min"
video: "19-aprobaciones-reglas-y-hooks.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/19-aprobaciones-reglas-y-hooks.es.vtt"
---

Endurecer omp para un repositorio de equipo con modos de aprobación, reglas que se activan solas, hooks y protección de secretos.

<p class="guia__nota">Dura 24 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De instrucciones a límites

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- Este vídeo cumple una promesa: en el 05 dijimos que omp sí trae modos de aprobación, en el 08 escribimos `permisos.ts` a mano para Pi y en el 18 anunciamos que las instrucciones pasarían a ser límites.
- **De fábrica, omp va en yolo:** aprueba todo sin preguntar. Así han corrido los subagentes, el reviewer con `bash` y el navegador de los vídeos anteriores.
- El objetivo: un fichero de configuración dentro del repositorio, versionado con el código, para que todo el equipo trabaje con las mismas reglas. Cuatro piezas: el modo de aprobación (con políticas por herramienta y patrones de bash), un hook, las reglas TTSR y la redacción de secretos.
- El hilo del vídeo: pieza a pieza, qué de `permisos.ts` trae omp de serie, qué hace distinto y qué tienes que seguir escribiendo tú.

### 2 · Niveles, modos y el fichero del proyecto

<p><button type="button" class="ir-a" data-t="128">▶ Ir a 2:08</button></p>

- Cada herramienta declara un **nivel**: `read` (solo lee), `write` (modifica el espacio de trabajo sin ejecutar código, como editar) o `exec` (ejecuta código: `bash`, `eval`, el navegador, el depurador o `task`, que lanza subagentes). La que no declara nada cuenta como `exec`.
- **Ojo con MCP:** sus herramientas cuentan siempre como `write`, digan lo que digan sus anotaciones. Si una borra o publica, ponle `prompt` o `deny` en las políticas por herramienta.
- El **modo** decide qué se aprueba solo: `always-ask` solo la lectura, `write` lectura y escritura (pregunta por lo que ejecuta) y `yolo` todo. Para un equipo, `write` es un buen punto de partida: las ediciones quedan en git y lo que ejecuta pasa por ti.
- *En la demo:* el fichero del equipo lleva `tools.approvalMode: write`, las políticas `bash: prompt` y `eval: prompt`, una lista de `bash.patterns` y `secrets.enabled: true`. Copiado a `.omp/config.yml`, `omp config get tools.approvalMode` pasa de `yolo` a `write`: la configuración del proyecto gana a la de tu perfil (vídeo 11).
- `/settings` enseña lo que manda el proyecto, pero escribe en tu perfil. Lo que quieres compartir va en el fichero del repositorio.

### 3 · Aprobaciones en acción

<p><button type="button" class="ir-a" data-t="281">▶ Ir a 4:41</button></p>

- *En terminal:* La petición (más abajo, en «Código y comandos»).
- *En la demo:* `npm test` se ejecuta sin preguntar porque un patrón `allow` lo cubre, aunque la política de `bash` sea `prompt`. En cambio, `git status && git log` abre el diálogo: **un `allow` tiene que encajar con el comando entero y nunca aprueba una línea compuesta.**
- `bash.allowCompoundCommands` (apagado) trocea cadenas sencillas unidas solo por `&&`, con argumentos literales; si todos los trozos están permitidos, pasa. Nada de variables, redirecciones ni tuberías. Lo dejamos apagado: mejor una pregunta de más.
- **Diferencia con `permisos.ts`:** el diálogo solo tiene Approve y Deny, sin «permitir siempre en esta sesión». Lo permanente se escribe como patrón: más trabajo la primera vez, pero no se olvida y lo comparte el equipo.
- Las lecturas y las ediciones pasan sin preguntar (en modo `write`, la escritura se aprueba sola). Un modo que pregunta por todo acaba con la persona aprobando sin leer.

### 4 · Patrones, políticas y subagentes

<p><button type="button" class="ir-a" data-t="432">▶ Ir a 7:12</button></p>

- `bash.patterns` es una lista ordenada de reglas, cada una con un patrón y una decisión: `allow`, `prompt` o `deny`. **Gana la primera regla que encaja.** El único comodín es `*` y los espacios repetidos cuentan como uno.
- *En la demo:* el commit pasa tras aprobarlo, pero `git push` se bloquea sin diálogo por la regla `deny`. El modelo se plantea escribirlo de otra forma y decide no saltarse la política. Bien por él, pero **un `deny` no depende de su buena voluntad:** es absoluto, no lo salta ni yolo, y sí mira cada trozo de una línea compuesta (`&&`, `;`, tuberías, subshells).
- Los **patrones críticos** de bash (borrar desde la raíz, fork bomb, descargar y ejecutar, apagar) obligan a preguntar en `write` y `always-ask`, aunque un `allow` tuyo los cubra. En yolo se ignoran.
- **Políticas por herramienta:** `bash: prompt` no es redundante, porque `--yolo` y `--auto-approve` fuerzan yolo pero respetan las políticas y los `deny`. `eval: prompt` cierra un hueco: los patrones solo gobiernan `bash`, y `eval` puede abrir una shell desde Python o JavaScript.
- Qué gana a qué, según lo que se ve en el vídeo:
  1. Un `deny` (patrón o política) bloquea siempre, en cualquier modo.
  2. Un patrón crítico obliga a preguntar en `write` y `always-ask`, aunque haya un `allow`.
  3. Un patrón `allow` que cubre el comando entero gana a la política de la herramienta (`npm test` pasa con `bash: prompt`).
  4. La política de la herramienta gana al modo, también con `--yolo`.
  5. Si nada de lo anterior decide, decide el modo.
- **Sin interfaz** (modo print), una llamada que necesita aprobación no se ejecuta. omp sugiere poner yolo; no le hagas caso: añade un `allow` para ese comando.
- **Subagentes:** van en yolo (vídeo 16), pero un `deny` tuyo se aplica dentro de ellos y lo que se resuelve como `prompt` se rechaza. Con nuestro fichero, el reviewer del vídeo 18 puede ejecutar `git diff`, `git log` y `git show`, y nada más. Ya no es una petición, es un límite; afecta a todos los subagentes y cubre solo lo que nombra.
- **Ojo en modo `write`:** `task` es `exec`, así que cada reparto de subagentes (también el que lanza `/review`) te pregunta.

### 5 · Hooks: lo que la configuración no alcanza

<p><button type="button" class="ir-a" data-t="645">▶ Ir a 10:45</button></p>

- Las políticas son por herramienta, no por fichero. En modo `write`, una edición de `AGENTS.md` pasaría sin preguntar. Para proteger rutas hace falta código: un hook.
- En omp, un hook es un módulo TypeScript con la forma de una extensión del vídeo 08 (una función que recibe la API y se engancha con `pi.on`). Lo que lo hace hook es dónde vive: `.omp/hooks/pre/` o `.omp/hooks/post/`, del proyecto o de tu perfil. Directamente en `.omp/hooks/` no se descubre.
- `rutas-protegidas.ts` traslada el bloque de rutas de `permisos.ts`: en `tool_call`, si la herramienta es `edit`, `write` o `ast_edit` y la ruta es `AGENTS.md` o está en `.git/`, devuelve `block: true` con el motivo. Borrar y mover van dentro de `edit`, así que también quedan cubiertos.
- Añadimos dos rutas: `.omp/` (sin ella, en modo `write` el modelo podría cambiar el modo a yolo editando el fichero que lo limita) y la carpeta de datos del vídeo 17, cuyo «solo lectura» pasa de petición a barrera.
- *En la demo:* la edición de `AGENTS.md` se bloquea sin diálogo y el modelo propone la línea para que la añadas tú. Funciona con DeepSeek, que edita en modo replace (vídeo 17). Si lo intentara con `sed` por bash, saltaría el diálogo: **hacen falta las dos capas**, el hook para la edición y la política de bash para el atajo.
- Como en el vídeo 08: un handler de `tool_call` que lanza un error bloquea la herramienta, `ctx.hasUI` dice si hay alguien para responder y `tool_result` reescribe la salida antes de que la vea el modelo.

### 6 · Reglas TTSR

<p><button type="button" class="ir-a" data-t="810">▶ Ir a 13:30</button></p>

- Una convención en `AGENTS.md` o `RULES.md` (vídeo 13) viaja en cada petición, gasta contexto y el modelo puede olvidarla. **TTSR** (*time traveling stream rules*) es otra forma: una regla que solo actúa cuando el modelo está a punto de hacer lo que no debe.
- Una regla TTSR es un Markdown en `.omp/rules/`: la cabecera dice qué vigilar y el cuerpo qué debería haber hecho el modelo.
- **El mecanismo:** omp vigila el texto de la respuesta y los argumentos de las herramientas mientras el modelo escribe. Si aparece el patrón, corta antes de que la herramienta se ejecute, descarta lo escrito, inyecta el cuerpo de la regla como aviso del sistema y le pide reintentar.
- Tres disparos: `condition` (una expresión regular), `astCondition` (un patrón de ast-grep) y `question` (una pregunta que responde un modelo juez al terminar; no puede cortar nada y necesita el rol `judge`). `scope` acota dónde mira, por ejemplo solo ediciones de `*.js`.
- omp trae 27 reglas incluidas, de Go, Rust y TypeScript (`omp ttsr list`). Ninguna mira `*.js`, así que en la tienda no hacen nada.
- *En terminal:* `.omp/rules/<nombre>.md` (más abajo, en «Código y comandos»).

### 7 · /omfg: de la queja a la regla

<p><button type="button" class="ir-a" data-t="930">▶ Ir a 15:30</button></p>

- `/omfg <queja>` escribe una regla TTSR por ti. Comprueba que se habría disparado con algo que el modelo hizo antes en la conversación; si no encaja, reintenta hasta tres veces o te pregunta si guardarla igualmente.
- *En la demo:* la queja es el `toFixed` de `textoEnvio`. La regla generada vigila `toFixed` y el cambio de punto por coma, solo en ficheros `.js`. La guardamos en el proyecto (para el equipo) y queda activa sin reiniciar.
- `omp ttsr test` prueba la regla sin gastar modelo: simula una edición con `toFixed` y confirma que la condición encaja.
- *En terminal:* /omfg (más abajo, en «Código y comandos»).
- *En la demo:* al pedir `textoTotal`, la regla no se dispara: Pro la sigue desde el principio y además corrige `textoEnvio`. **Esto no demuestra el mecanismo** de cortar, inyectar y reintentar, que se describe pero no se ve en el vídeo: el modelo conocía la regla porque `/omfg` acababa de escribirla en esta conversación. Para ver un disparo de verdad, prueba en una sesión nueva (`/new`) pidiendo un formato con `toFixed`.

### 8 · Secretos y redacción

<p><button type="button" class="ir-a" data-t="1084">▶ Ir a 18:04</button></p>

- Todo lo que el modelo lee viaja al proveedor. Con `secrets.enabled` (apagado de fábrica), omp sustituye los valores sensibles por un marcador `$$…$$` antes de enviarlos.
- Reúne secretos de tres sitios: variables de entorno con nombre de secreto (`KEY`, `TOKEN`, `PASSWORD`…) y al menos ocho caracteres; los `secrets.yml` de tu perfil y del proyecto; y expresiones incluidas para formatos conocidos (tokens de GitHub, claves de proveedores, claves privadas).
- El marcador se calcula con una clave que solo está en tu máquina. Si el modelo usa el marcador en un comando, omp pone el valor real justo antes de ejecutarlo: **el modelo usa un secreto que nunca ha visto.**
- *En la demo:* con un valor falso en `TOKEN_DEMO`, tú ves el texto en pantalla (omp restaura los marcadores en la vista local) y el modelo cuenta 18 caracteres que empiezan por `$`, no los 26 del valor real.
- **Los huecos:** el system prompt no se redacta (nunca pongas secretos en `AGENTS.md` ni `RULES.md`); la exportación de sesiones tampoco; el `secrets.yml` del proyecto se versiona, así que ahí solo van expresiones regulares, nunca valores; y un secreto con forma desconocida en una variable de nombre inocente sale tal cual. Si el modelo pide `env` o `printenv`, deniégalo.

### 9 · Límites, repaso y cierre

<p><button type="button" class="ir-a" data-t="1240">▶ Ir a 20:40</button></p>

- **Aprobar no es aislar** (vídeo 08). Los patrones son una política de aprobación, no un confinamiento: un comando aprobado tiene todo el acceso de tu shell, y los patrones comparan texto (`git -C . push` no empieza por `git push`).
- **La capa del proyecto gana a la tuya**, y un repositorio ajeno puede traer un `.omp/` que ponga yolo o cargue hooks. Qué carga omp al abrir una carpeta, y por qué no hay `/trust`, se explica en el vídeo 20. Para lo que no conoces, la respuesta sigue siendo la del vídeo 05: un contenedor.
- **Coste:** la demo costó tres céntimos. El coste real de esta capa es la atención: cada pregunta que sobra te entrena para aprobar sin leer. Cada una que te sobre es un patrón `allow` que te falta.
- **Práctica:** en una rama de tu proyecto, con tu perfil de pruebas, escribe un `.omp/config.yml` con modo `write`, `bash: prompt`, una lista corta de comandos permitidos y un `deny` para lo que nunca debe pasar. Trabaja con él una tarde y apunta cada pregunta que te sobra. La próxima vez que el modelo haga algo que te moleste, prueba `/omfg` y comprueba la regla con `omp ttsr test`.
- **En otros agentes:** los cuatro conceptos son transferibles. Claude Code tiene modos de permiso, reglas allow y deny en su configuración y hooks que se ejecutan antes de cada herramienta; la lección «aprobar no es aislar» vale igual.
- **Vídeo 20:** extender oh my pi: extensiones, skills, plugins, MCP y comandos del proyecto.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### La petición

```text
Añade a src/envio.js una función textoEnvio(subtotal) que devuelva
los gastos de envío como texto, con coma decimal y el símbolo del euro,
por ejemplo 4,95 €. Añade su prueba y ejecuta npm test.
```

`npm test` pasará sin preguntar porque lo cubre un patrón `allow`.

### bash.patterns (.omp/config.yml)

```yaml
bash:
  patterns:
    - match: "git push*"
      approval: deny
    - match: "git status"
      approval: allow
    - match: "git diff*"
      approval: allow
    - match: "git log*"
      approval: allow
    - match: "git show*"
      approval: allow
    - match: "npm test"
      approval: allow
    - match: "node --test*"
      approval: allow
```

- Gana la primera regla que encaja; por eso el `deny` va arriba.
- `*` es el único comodín. Un `allow` tiene que cubrir el comando entero y no aprueba líneas compuestas; un `deny` sí mira cada trozo.

### Un hook de oh my pi

```text
export default function (pi) {
  pi.on("tool_call", async (event, ctx) => { … return { block: true, reason } })
}
// .omp/hooks/pre/*.ts  ·  ~/.omp/agent/hooks/post/*.ts
```

- Se descubre en `.omp/hooks/pre/` o `.omp/hooks/post/` (o en las de tu perfil). Directamente en `.omp/hooks/` no se carga.
- `return { block: true, reason }` bloquea la llamada sin diálogo y el modelo recibe el motivo.

### .omp/rules/&lt;nombre&gt;.md

```text
---
condition: ["\\.toFixed\\s*\\("]
scope: ["tool:edit(*.js)", "tool:write(*.js)"]
---
Redondea con Math.round(x * 100) / 100 y muestra con Intl.NumberFormat.
```

- La cabecera, entre `---`, dice qué vigilar (`condition`) y dónde (`scope`: solo ediciones y escrituras de `.js`).
- El cuerpo es lo que se inyecta al modelo cuando la regla se dispara.

### /omfg

```text
/omfg No uses toFixed con importes: redondea con Math.round(x * 100) / 100
como dice AGENTS.md y para mostrar usa Intl.NumberFormat con es-ES.
```

omp valida el borrador contra la conversación, con tres intentos como mucho, y te pregunta dónde guardarlo: en el proyecto (`.omp/rules`) o global.

## Fuentes

- Documentación de oh my pi (omp.sh): `approval-mode.md` (niveles, modos, MCP como `write`, patrones críticos, subagentes y modo sin interfaz) y `settings.md` § «Bash command approval patterns» (orden de reglas, comodín, comandos compuestos, «an approval policy, not containment»).
- `hooks.md`: dónde se descubren los hooks, `tool_call` y `tool_result`, y el ejemplo que tacha claves de API.
- `ttsr-injection-lifecycle.md` (disparos, cortar e inyectar, `/omfg`) y `rulebook-matching-pipeline.md` (de dónde salen las reglas).
- `secrets.md`: qué se redacta, cómo se restauran los marcadores y qué no se redacta.
- `omp --help` (`--approval-mode`, `--auto-approve`, `--hook`, `--no-rules`) y `omp ttsr --help` (`list`, `test`, `scan`).
- Grabado con omp 18.6.1.
- Vídeos relacionados del curso: 05 (seguridad y contenedores), 08 (`permisos.ts` en Pi), 11 (capas de configuración), 13 (`RULES.md`), 16 (subagentes en yolo), 18 (el reviewer con `bash`), 20 (lo que carga una carpeta).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De instrucciones a límites**

Este vídeo cierra una promesa que viene de lejos. En el vídeo cinco dijimos que Pi no trae modos de aprobación y que oh my pi sí, y que los veríamos aquí. En el vídeo ocho construimos el nuestro a mano en Pi, con el evento tool call. Y en el dieciocho terminamos con una frase: lo que hasta ahora eran instrucciones, como el solo lectura del reviewer, pasarían a ser límites. Hoy toca cumplirlo.

Recuerda de dónde partimos. oh my pi viene en modo yolo: aprueba todo sin preguntar. Lo comprobamos en el vídeo once, y lo hemos visto en cada demo desde entonces. Los subagentes, el reviewer con bash o el navegador funcionan sin que nadie les pida permiso.

El objetivo de hoy es concreto: endurecer oh my pi para un repositorio de equipo. Un fichero de configuración dentro del propio repositorio, versionado con el código, para que cualquiera que lo abra con oh my pi trabaje con las mismas reglas. Veremos cuatro piezas. El modo de aprobación, con las políticas por herramienta y los patrones de bash. Un hook para lo que la configuración no alcanza. Las reglas TTSR, con barra o eme efe ge. Y la redacción de secretos.

Y un hilo que nos acompañará todo el vídeo: el fichero permisos punto ts del vídeo ocho. Allí tuvimos una lista de herramientas de lectura, una lista de comandos de bash seguros, un diálogo con tres opciones, rutas protegidas y un bloqueo cuando no había interfaz. Iremos pieza a pieza viendo qué trae oh my pi de serie, qué hace distinto y qué tienes que seguir escribiendo tú.

Trabajamos en la tienda, con el perfil demo y DeepSeek V cuatro Pro, en una rama de usar y tirar, demo diecinueve. La tienda no tiene remoto, así que nada sale de la máquina.

**2 · Niveles, modos y el fichero del proyecto**

La base del sistema es sencilla. Cada herramienta de oh my pi declara un nivel. Read, para lo que solo lee. Write, para lo que modifica el espacio de trabajo pero no ejecuta código arbitrario, como editar o escribir ficheros. Y exec, para lo que ejecuta código: bash, eval, el navegador, el depurador o la herramienta task, que lanza subagentes.

Es nuestra lista de lectura del vídeo ocho, pero al revés: en lugar de que tú enumeres las herramientas seguras, cada herramienta dice qué es. Si una no declara nada, se trata como exec, que es lo prudente. Y un detalle que conviene saber: las herramientas MCP cuentan siempre como write, digan lo que digan sus anotaciones. Si tienes una que borra o publica, nómbrala en las políticas por herramienta y ponle prompt o deny.

Sobre esos niveles actúa el modo. Always ask aprueba solo la lectura y pregunta por todo lo demás. Write aprueba lectura y escritura, y pregunta por lo que ejecuta. Y yolo, el de fábrica, lo aprueba todo. Para un repositorio de equipo, write es un buen punto de partida: las ediciones quedan en git y se pueden revisar, y lo que ejecuta comandos pasa por ti.

Empezamos sin modelo. En el otro panel, config get tools punto approval mode responde yolo. Ahora miramos el fichero que hemos preparado para el equipo. Arriba, approval mode write, y dos políticas por herramienta: bash prompt y eval prompt. Debajo, una lista de patrones de bash, que veremos enseguida, y al final, secrets enabled.

Lo copiamos a punto o eme pe barra config punto yml, en la raíz de la tienda, y repetimos el config get. Ahora responde write. Es el orden de capas del vídeo once: la configuración del proyecto gana a la de tu perfil.

Arrancamos oh my pi y abrimos barra settings, solo para mirar. En la pestaña de interacción, el grupo de aprobaciones ya enseña lo que manda el proyecto: el modo write y las dos políticas, en gris. En la pestaña shell está el interruptor de los comandos compuestos, apagado. En proveedores, dentro de privacidad, ocultar secretos aparece activado. Y en contexto, el bloque de reglas TTSR, con las reglas incluidas activas. Salimos sin cambiar nada: barra settings escribe en la configuración de tu perfil, y lo que queremos compartir va en el fichero del repositorio.

**3 · Aprobaciones en acción**

Le pedimos una tarea normal: una función texto envío que devuelva los gastos de envío como texto para mostrar, con coma decimal y el símbolo del euro, con su prueba, y que ejecute npm test.

Lo primero que hace Pro es seguir el AGENTS punto md, que pide empezar con git status y git log, y los encadena en una sola línea. A la vez lanza npm test. Y fíjate en la diferencia. Npm test se ejecuta sin preguntar, porque está en la lista de patrones permitidos. La línea de git, en cambio, abre el diálogo: permitir la herramienta bash, con el comando completo debajo, y dos opciones, Approve y Deny. Lo leemos y aprobamos.

¿Por qué pregunta por git status y git log, si los dos están permitidos? Porque un patrón allow tiene que encajar con el comando entero, y nunca aprueba una línea compuesta. Es la misma precaución que tuvimos en el ocho: ls seguido de un rm empieza por ls. Allí lo resolvimos troceando el comando; aquí, por defecto, se pregunta.

Si te molesta, existe allow compound commands, el interruptor que vimos apagado. Cuando lo activas, oh my pi trocea cadenas sencillas unidas solo por doble ampersand, con argumentos literales, y si todos los trozos están permitidos, pasa. Nada de variables, redirecciones ni tuberías. Nosotros lo dejamos apagado: preferimos una pregunta de más.

Aquí está la primera diferencia con nuestro permisos punto ts. Allí había tres opciones, y una era permitir siempre en esta sesión. En oh my pi, el diálogo de las herramientas solo tiene aprobar o denegar. Lo que quieres permitir siempre se escribe en la configuración, como un patrón. Es más trabajo la primera vez, pero no se olvida al cerrar la sesión, y lo comparte todo el equipo.

Lo demás pasa sin preguntar. Las lecturas, porque son nivel read. Las tres ediciones, del código y de las pruebas, porque en modo write la escritura se aprueba sola. Y npm test otra vez al final: dieciocho de dieciocho. Igual que en el vídeo ocho, lo que no cambia nada no te interrumpe. Un modo que pregunta por todo acaba con la persona aprobando sin leer.

Quédate con un detalle del código. Para formatear el importe, Pro ha usado toFixed con dos decimales y luego ha cambiado el punto por una coma. Funciona, pero volveremos a ello cuando hablemos de reglas.

**4 · Patrones, políticas y subagentes**

Ahora sí, los patrones. Bash punto patterns es una lista ordenada de reglas, cada una con un texto y una decisión: allow, prompt o deny. Gana la primera que encaja. El único comodín es el asterisco, y los espacios repetidos se tratan como uno.

Nuestra primera regla es git push seguido de un asterisco, con deny. Lo probamos: le pedimos que haga commit de src y de test siguiendo el AGENTS punto md, y que lo suba al remoto. Primero comprueba el estado, encadenado, así que pregunta y aprobamos. Después el git add con el commit, también encadenado: aprobamos, y el commit se crea con el mensaje en español que pide la tienda.

El push, en cambio, ni siquiera pregunta. La tarjeta sale en rojo: la herramienta bash está bloqueada por la política, por el patrón git push. Y merece la pena leer lo que piensa el modelo. Se pregunta si hay otro camino, si podría escribirlo de otra forma que no empiece por git push. Y se responde a sí mismo: eso sería saltarse la política, y no debe hacerlo. Comprueba que tampoco hay remoto y nos lo cuenta.

Bien por el modelo, pero no te quedes con eso. La política no depende de su buena voluntad: un deny es absoluto y no lo salta ni el modo yolo. Además, a diferencia del allow, deny y prompt sí miran cada trozo de una línea compuesta, separada por doble ampersand, punto y coma, tuberías o subshells. Un cd seguido de un git push también se bloquea.

Además de los tuyos, bash trae patrones críticos: borrar desde la raíz, una fork bomb, descargar un script y ejecutarlo, o apagar la máquina. En los modos write y always ask obligan a preguntar, aunque un allow tuyo los cubriera. Pero ojo con un error común: en yolo, ese aviso se ignora. El modo de fábrica no te protege ni de esos.

Ahora, las políticas por herramienta. Bash prompt parece redundante, porque en modo write bash ya pregunta. No lo es. Las opciones guion guion yolo y guion guion auto approve fuerzan el modo yolo en una sesión, pero las políticas por herramienta y los deny se siguen respetando. Y eval prompt cierra un hueco que avisa la documentación: los patrones solo gobiernan bash, y eval puede lanzar una shell desde Python o JavaScript. Si endureces bash, endurece también eval.

Probamos el modo sin interfaz. En el otro panel, o eme pe en modo print le pide que ejecute node guion guion version. No hay patrón que lo permita, así que necesita aprobación, y en modo print nadie puede darla. La llamada no se ejecuta, y el modelo nos lo explica con las tres salidas que le propone oh my pi. La primera es poner el modo yolo. No le hagas caso: la buena es añadir un patrón allow para ese comando.

Y los subagentes. En el vídeo dieciséis dijimos que trabajan en yolo, porque no tienen a quién preguntar. Es verdad, con un matiz importante que da la documentación: un deny tuyo también se aplica dentro de un subagente, y lo que se resuelve como prompt no se aprueba, se rechaza.

Eso cumple lo del vídeo dieciocho. El reviewer tiene bash, y sus instrucciones le piden usarlo solo para git diff, git log o git show. Con bash prompt y esos comandos en la lista de permitidos, que es justo nuestro fichero, el reviewer puede ejecutarlos, y cualquier otro comando se rechaza. Ya no es una petición: es un límite. Eso sí, afecta a todos los subagentes, y cubre solo lo que nombra.

**5 · Hooks: lo que la configuración no alcanza**

En el ocho protegimos dos rutas: el AGENTS punto md y la carpeta punto git. oh my pi no trae nada parecido de serie. Y en modo write, el problema es mayor: una edición del AGENTS punto md pasaría sin preguntar. Las políticas son por herramienta, no por fichero. Para esto hacen falta código y un hook.

En oh my pi, hook es un nombre heredado. Es un módulo de TypeScript con la misma forma que las extensiones del vídeo ocho: una función por defecto que recibe la API y se engancha a los eventos con pi punto on. Lo que lo hace hook es dónde vive: en punto o eme pe barra hooks barra pre o barra post, del proyecto o de tu perfil. Directamente en la carpeta hooks no se descubre.

Este es rutas protegidas punto ts. Es el bloque de rutas de nuestro permisos punto ts, trasladado. Escucha tool call, y si la herramienta es edit, write o ast edit, mira cada ruta. En oh my pi no hay herramientas aparte para borrar o mover: van dentro de edit. Si la ruta es el AGENTS punto md o está dentro de punto git, avisa en pantalla y devuelve block true con el motivo.

Y hemos añadido dos rutas más. La propia carpeta punto o eme pe: la configuración, los hooks y las reglas del equipo viven en el repositorio, y en modo write editar un fichero se aprueba solo. Sin esta línea, el modelo podría cambiar el modo a yolo editando el fichero que lo limita. Y la carpeta datos del vídeo diecisiete: allí dijimos que su solo lectura era una petición, y esto la convierte en barrera.

Lo copiamos a la carpeta de hooks del proyecto, salimos y retomamos la sesión con guion ce. Le pedimos que añada al AGENTS punto md una regla sobre cómo mostrar importes. Pro lee el fichero, intenta editarlo, y la edición sale en rojo con nuestro motivo: AGENTS punto md está protegido y no se puede modificar. Debajo, el aviso de ruta protegida.

El modelo lo entiende como un bloqueo firme y no busca atajos: nos propone la línea exacta para que la añadamos nosotros. Si hubiera intentado escribirla por bash, con sed o con un echo, ese comando no está en la lista de permitidos, así que habría aparecido el diálogo. Hacen falta las dos capas: el hook para la herramienta de edición, y la política de bash para el atajo.

Lo demás que aprendiste en el ocho vale igual. Si el handler de tool call lanza un error, la herramienta se bloquea. Ctx punto has UI te dice si hay alguien para responder. Y tool result te deja reescribir la salida de una herramienta antes de que la vea el modelo; la documentación trae un ejemplo que tacha claves de API.

**6 · Reglas TTSR**

Pasamos de lo que el modelo hace a cómo lo hace. Hasta ahora, para que el modelo siguiera una convención, la poníamos en el AGENTS punto md, o en un RULES punto md, como en el vídeo trece. Eso viaja en cada petición y gasta contexto, y aun así el modelo puede olvidarlo.

oh my pi añade otra forma: las reglas TTSR, time traveling stream rules. Una regla TTSR es un fichero Markdown con un encabezado de metadatos y un cuerpo. El encabezado dice qué vigilar; el cuerpo, qué debería haber hecho el modelo.

La vigilancia ocurre mientras el modelo escribe. oh my pi mira el texto de la respuesta y los argumentos de las herramientas, y si aparece el patrón, corta la respuesta en ese instante, antes de que la herramienta se ejecute. Descarta lo que llevaba escrito, inyecta el cuerpo de la regla como un aviso del sistema y le pide que lo intente otra vez. De ahí lo de viajar en el tiempo: es como volver a un momento antes del error.

Hay tres formas de disparo. Condition, una expresión regular. Ast condition, un patrón estructural de ast grep. Y question, una pregunta en lenguaje natural que responde un modelo juez cuando la salida ha terminado. Esta última no puede cortar nada, porque llega tarde, y además necesita un juez. Cada regla acota dónde mira, con scope: por ejemplo, solo las ediciones de ficheros punto js.

En los ajustes vimos el bloque de TTSR: el modo de contexto, descartar; interrumpir, siempre; repetir, una vez. Las reglas se buscan en punto o eme pe barra rules del proyecto, en las de tu perfil y en las carpetas de reglas de otros agentes como Cursor o Copilot. Y oh my pi trae veintisiete incluidas. En el otro panel, o eme pe ttsr list las enseña: de Go, de Rust y de TypeScript. Ninguna mira ficheros punto js, así que en la tienda no hacen nada.

**7 · Barra o eme efe ge: de la queja a la regla**

Escribir una regla a mano no es difícil, pero acertar con la expresión regular y el alcance lleva un rato. Barra o eme efe ge lo hace por ti: le das una queja y te propone una regla.

Volvamos a texto envío. El toFixed con el cambio del punto por la coma choca con el AGENTS punto md, que pide redondear con Math punto round. Y para mostrar importes en España hay una herramienta mejor, Intl punto NumberFormat, que ya pone la coma y el euro.

Escribimos barra o eme efe ge y la queja: no uses toFixed con importes; redondea como dice el AGENTS punto md y para mostrar usa Intl punto NumberFormat. El modelo activo escribe la regla, y oh my pi comprueba que habría saltado con algo que el modelo hizo antes en esta conversación. Aquí encaja: texto envío usó toFixed. Si no, lo reintenta hasta tres veces, o te pregunta si guardarla igualmente.

El borrador es bueno. Se llama no toFixed importes, y vigila dos cosas: una llamada a toFixed y un replace que cambia el punto por la coma. Solo en ediciones y escrituras de ficheros punto js. Y el cuerpo dice qué hacer en su lugar. Nos pregunta dónde guardarla: en este proyecto, en la configuración global o corregirla con nuestras indicaciones. La guardamos en el proyecto, para que la comparta el equipo, y queda registrada en vivo, sin reiniciar.

En el otro panel miramos el fichero, con su encabezado y su cuerpo. Y la probamos sin gastar modelo: o eme pe ttsr test, como si fuera una edición de carrito punto js, con una línea que usa toFixed. Responde que se dispara una regla, la nuestra, con la condición que ha encajado.

Y en vivo, le pedimos una función texto total para el carrito, igual que texto envío. Aquí la regla no ha tenido que cortar nada. En su razonamiento, Pro la llama regla del proyecto y la sigue desde el principio. Pide ejecutar un node guion e para ver exactamente qué devuelve Intl, y como no es un patrón permitido, aprobamos. Descubre que Intl pone un espacio que no se parte antes del euro.

Al final hace más de lo que pedimos. Texto total usa Intl, y texto envío también, porque el toFixed incumplía la regla nueva. Ajusta las pruebas a ese espacio, y diecinueve de diecinueve. Una regla que se cumple sin dispararse es la mejor señal de que está bien escrita, y no ha costado nada.

**8 · Secretos y redacción**

Queda la última línea de nuestro fichero, secrets enabled. Todo lo que el modelo lee, sea un fichero, la salida de un comando o un mensaje tuyo, viaja al proveedor. La redacción de secretos de oh my pi sustituye los valores sensibles por un marcador antes de enviarlos, y viene apagada de fábrica.

Cuando la activas, reúne secretos de tres sitios. Las variables de entorno cuyo nombre suena a secreto, como las que contienen key, token o password, si su valor tiene al menos ocho caracteres. Los ficheros secrets punto yml, el de tu perfil y el del proyecto. Y unas expresiones incluidas para formatos conocidos: tokens de GitHub, claves de proveedores de modelos o claves privadas.

Cada valor se cambia por un marcador entre signos de dólar, que no deja adivinar el valor, porque se calcula con una clave que solo existe en tu máquina. Y si el modelo usa ese marcador en un comando, oh my pi lo sustituye por el valor real justo antes de ejecutarlo. El modelo puede usar un secreto que nunca ha visto.

Lo probamos con un valor falso. Antes de arrancar exportamos una variable llamada TOKEN guion bajo DEMO, con un texto que dice que no es un secreto. Le pedimos que ejecute un echo de esa variable y que, sin copiarla, nos diga cuántos caracteres ve y por cuál empieza. El comando lleva una variable y no hay patrón que lo permita, así que pregunta, y aprobamos.

En la tarjeta de la herramienta vemos nuestro texto, porque oh my pi restaura los marcadores en la vista local. Pero el modelo ve otra cosa: dos dólares, una ristra de letras y números, y otros dos dólares. Cuenta dieciocho caracteres y dice que empieza por un dólar. Nuestro texto tiene veintiséis y empieza por e.

Y el remate. En su respuesta, el modelo escribe el marcador para decir qué ha visto, y en tu pantalla aparece el valor real, restaurado. No te confundas: el modelo no lo ha visto nunca. Si te pidiera listar todas las variables de entorno con env o printenv, deniégalo: en una terminal real ahí hay claves de verdad.

Ahora los huecos, que son importantes. El system prompt no se redacta, y ahí van tu AGENTS punto md y tu RULES punto md: nunca pongas un secreto en ellos. La exportación de sesiones tampoco redacta. El secrets punto yml del proyecto se versiona, así que ahí solo van expresiones regulares, nunca valores. Y un secreto con una forma desconocida, en una variable con un nombre inocente, sale tal cual.

**9 · Límites, repaso y cierre**

Los límites, juntos. El primero, el del vídeo ocho: aprobar no es aislar. La documentación lo dice con esas palabras: los patrones son una política de aprobación, no un confinamiento. Un comando aprobado tiene todo el acceso de tu shell, y los patrones comparan texto. Git guion ce punto push no empieza por git push. Con nuestra configuración preguntaría, pero si hubieras puesto allow a algo amplio, pasaría.

El segundo es propio de oh my pi, y conviene decirlo claro. La capa del proyecto gana a la tuya, y oh my pi no tiene barra trust. El mismo fichero que hoy endurece la tienda podría, en un repositorio que clonas, poner el modo yolo o permitir cualquier comando. Y los hooks del proyecto son código que se ejecuta al arrancar. Por eso nuestro hook protege su propia carpeta, y por eso los cambios en punto o eme pe se revisan en el diff como cualquier otro código.

Antes de abrir un repositorio ajeno, mira su carpeta punto o eme pe. Y para lo que no conoces, la respuesta sigue siendo la del vídeo cinco: un contenedor. En cuanto al coste, toda la demo se quedó en tres céntimos.

Repasemos. Las herramientas declaran nivel read, write o exec, y tools punto approval mode decide qué se aprueba solo; yolo es el de fábrica y write es un buen punto de partida. El diálogo tiene Approve y Deny; lo permanente va en la configuración. Bash punto patterns ordena reglas allow, prompt y deny, donde deny es absoluto y allow no cubre líneas compuestas.

Las políticas por herramienta sobreviven a guion guion yolo y llegan a los subagentes. Los hooks cubren lo que la configuración no alcanza. Las reglas TTSR corrigen al modelo en mitad del stream, y barra o eme efe ge las escribe a partir de una queja. Y la redacción de secretos ayuda, pero no lo tapa todo.

La práctica: en una rama de tu proyecto y con tu perfil de pruebas, escribe un punto o eme pe barra config punto yml con el modo write, bash en prompt y una lista corta de comandos permitidos, más un deny para lo que nunca debe pasar. Trabaja con él una tarde y apunta cada pregunta que te sobra: cada una es un patrón allow que te falta. Y la próxima vez que el modelo haga algo que te moleste, prueba barra o eme efe ge y comprueba la regla con o eme pe ttsr test.

En el próximo vídeo extendemos oh my pi: extensiones, skills y su registro, marketplaces y plugins, servidores MCP, comandos propios del proyecto, y cómo encaja todo lo que escribimos para Pi. Nos vemos allí.

</details>

