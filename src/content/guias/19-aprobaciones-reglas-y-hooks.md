---
title: "Vídeo 19 · Aprobaciones, reglas y hooks"
description: "endurecer omp para un repositorio de equipo con modos de aprobación, reglas que se activan solas, hooks y protección de secretos."
ruta: "pi-oh-my-pi"
orden: 19
duracion: "24 min"
video: "19-aprobaciones-reglas-y-hooks.mp4"
---

endurecer omp para un repositorio de equipo con modos de aprobación, reglas que se activan solas, hooks y protección de secretos.

<p class="guia__nota">Dura 24 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De instrucciones a límites

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Una promesa larga:** Vídeo 05 (omp sí tiene modos) → Vídeo 08 (permisos.ts a mano) → Vídeo 18 (serán límites) → Hoy (cumplirlo)
- **De fábrica:** yolo — oh my pi aprueba todo sin preguntar.
- **Endurecer un repositorio de equipo**
  - `modo` · Aprobaciones: políticas y patrones
  - `hook` · Lo que no alcanza: la configuración
  - `TTSR` · Reglas: y /omfg
  - `secretos` · Redacción
- **permisos.ts del vídeo 08**
  - `lectura` · Lista de herramientas
  - `bash` · Comandos seguros
  - `diálogo` · Tres opciones
  - `rutas` · Protegidas
  - `sin interfaz` · Bloquea
- **El montaje**
  - `perfil` · demo
  - `V4 Pro` · El modelo
  - `demo-19` · Sin remoto

### 2 · Niveles, modos y el fichero del proyecto

<p><button type="button" class="ir-a" data-t="128">▶ Ir a 2:08</button></p>

- **Cada herramienta declara un nivel**
  - `read` · Solo lee: read, grep…
  - `write` · Modifica: edit, write
  - `exec` · Ejecuta: bash, eval, task…
- **Al revés que en el 08**
  - `sin nivel` · exec: lo prudente
  - `MCP` · Siempre write: nómbralas
- **tools.approvalMode**
  - `always-ask` · Solo read: pregunta el resto
  - `write` · read + write: pregunta exec
  - `yolo` · Todo: de fábrica
- *En la demo:* ~/csn/omp-equipo/config.yml
- *En la demo:* .omp/config.yml en la tienda
- *En la demo:* /settings · Interaction · Approvals
- *En la demo:* Shell
- *En la demo:* Providers · Privacy
- *En la demo:* Context · Rules (TTSR)

### 3 · Aprobaciones en acción

<p><button type="button" class="ir-a" data-t="281">▶ Ir a 4:41</button></p>

- *En terminal:* La petición (más abajo, en «Código y comandos»)
- *En la demo:* Allow tool: bash · Approve / Deny
- *En la demo:* allow no cubre líneas compuestas
- *En la demo:* bash.allowCompoundCommands: false
- **El diálogo**
  - `vídeo 08` · Tres opciones: «siempre en esta sesión»
  - `omp` · Approve / Deny: lo permanente, en la configuración
- *En la demo:* edit sin preguntar (modo write)
- *En la demo:* textoEnvio

### 4 · Patrones, políticas y subagentes

<p><button type="button" class="ir-a" data-t="432">▶ Ir a 7:12</button></p>

- *En terminal:* bash.patterns (.omp/config.yml) (más abajo, en «Código y comandos»)
- *En la demo:* Dos diálogos más
- *En la demo:* Blocked by bash pattern: git push*
- *En la demo:* Commit sí, push no
- **deny:** No depende de la buena voluntad — Absoluto, también en yolo, y mira cada trozo de una línea compuesta.
- **Patrones críticos**
  - `write / always-ask` · Obligan a preguntar
  - `yolo` · Se ignoran
  - `ejemplos` · rm -rf /, fork bomb: curl | sh
- **Políticas por herramienta**
  - `bash: prompt` · Sobrevive a --yolo
  - `eval: prompt` · Cierra el hueco: shell desde Python o JS
- *En la demo:* omp --profile demo -p "Ejecuta node --version…"
- **Subagentes**
  - `deny` · Se aplica
  - `prompt` · Se rechaza: nadie responde
- **Vídeo 18:** El reviewer, con límite — git diff, git log y git show en la lista; el resto de bash se rechaza.

### 5 · Hooks: lo que la configuración no alcanza

<p><button type="button" class="ir-a" data-t="645">▶ Ir a 10:45</button></p>

- **En modo write:** Editar AGENTS.md no pregunta — Las políticas son por herramienta, no por fichero.
- *En terminal:* Un hook de oh my pi (más abajo, en «Código y comandos»)
- *En la demo:* .omp/hooks/pre/rutas-protegidas.ts
- *En la demo:* .omp/ y ~/csn/datos
- *En la demo:* Bloqueado sin diálogo
- *En la demo:* Propone, no insiste
- **Como en el vídeo 08**
  - `error` · Bloquea
  - `hasUI` · ¿Hay alguien?
  - `tool_result` · Reescribe la salida

### 6 · Reglas TTSR

<p><button type="button" class="ir-a" data-t="810">▶ Ir a 13:30</button></p>

- **Convenciones hasta ahora**
  - `AGENTS.md` · En cada petición
  - `RULES.md` · Vídeo 13
- *En terminal:* .omp/rules/ .md (más abajo, en «Código y comandos»)
- **Time traveling stream rules:** Vigila (el stream) → Corta (antes de ejecutar) → Inyecta (la regla) → Reintenta
- **Disparos**
  - `condition` · Regex
  - `astCondition` · ast-grep
  - `question` · Juez: no corta
- *En la demo:* Ajustes de TTSR
- *En la demo:* omp --profile demo ttsr list

### 7 · /omfg: de la queja a la regla

<p><button type="button" class="ir-a" data-t="930">▶ Ir a 15:30</button></p>

- **/omfg:** De la queja a la regla — Le das una queja y te propone una regla TTSR.
- *En la demo:* Lo que nos molesta
- *En terminal:* /omfg (más abajo, en «Código y comandos»)
- *En la demo:* Save TTSR rule where?
- *En la demo:* Registered live
- *En la demo:* .omp/rules/no-tofixed-importes.md · ttsr test
- *En la demo:* La regla, desde el principio
- *En la demo:* Cambios

### 8 · Secretos y redacción

<p><button type="button" class="ir-a" data-t="1084">▶ Ir a 18:04</button></p>

- **secrets.enabled:** Marcadores en lugar de valores — Antes de enviar al proveedor. Apagado de fábrica.
- **De dónde salen**
  - `entorno` · KEY, TOKEN…: ≥ 8 caracteres
  - `secrets.yml` · Perfil y proyecto
  - `incluidas` · Formatos conocidos: GitHub, claves…
- **Ida y vuelta:** Valor (local) → $$marcador$$ (al proveedor) → Comando (con el marcador) → Valor real (al ejecutar)
- *En la demo:* echo $TOKEN_DEMO
- *En la demo:* Local: el valor · modelo: $$…$$
- *En la demo:* Restaurado en la vista local
- **Los huecos**
  - `system prompt` · Sin redactar: AGENTS.md, RULES.md
  - `exportar` · Sin redactar
  - `secrets.yml` · Solo regex: se versiona
  - `forma rara` · Sale tal cual

### 9 · Límites, repaso y cierre

<p><button type="button" class="ir-a" data-t="1240">▶ Ir a 20:40</button></p>

- **Vídeo 08:** Aprobar no es aislar — Los patrones comparan texto: «git -C . push» no empieza por «git push».
- **Sin /trust:** El proyecto manda — Un .omp/ ajeno puede poner yolo y ejecutar hooks al arrancar.
- **Antes de abrir un repositorio ajeno**
  - `.omp/` · Mira su carpeta
  - `contenedor` · Vídeo 05
  - `coste` · 3 céntimos: toda la demo
- **Repaso · 1**
  - `niveles` · read · write · exec
  - `diálogo` · Approve / Deny
  - `patrones` · allow · prompt · deny
- **Repaso · 2**
  - `políticas` · Sobreviven a --yolo
  - `hooks` · Lo que falta
  - `TTSR` · /omfg
  - `secretos` · Ayuda, no tapa todo
- **La práctica:** config.yml (write + prompt) → allow (lista corta) → deny (lo prohibido) → Una tarde (apunta) → /omfg (ttsr test)
- **Vídeo 20:** Extender oh my pi — Extensiones, skills, plugins, MCP y comandos del proyecto.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### La petición

```text
Añade a src/envio.js una función textoEnvio(subtotal) que devuelva
los gastos de envío como texto, con coma decimal y el símbolo del euro,
por ejemplo 4,95 €. Añade su prueba y ejecuta npm test.
```

- `textoEnvio`: La función
- `4,95 €`: Formato
- `npm test`: Patrón allow

### bash.patterns (.omp/config.yml)

```text
- match: "git push*"     approval: deny
- match: "git status"     approval: allow
- match: "git diff*" · "git log*" · "git show*"   approval: allow
- match: "npm test" · "node --test*"   approval: allow
```

- `deny`: Absoluto
- `primera`: Gana
- `*`: Único comodín

### Un hook de oh my pi

```text
export default function (pi) {
  pi.on("tool_call", async (event, ctx) => { … return { block: true, reason } })
}
// .omp/hooks/pre/*.ts  ·  ~/.omp/agent/hooks/post/*.ts
```

- `pi.on`: Como en Pi
- `pre / post`: Dónde vive
- `hooks/`: Ahí no

### .omp/rules/ .md

```text
---
condition: ["\\.toFixed\\s*\\("]
scope: ["tool:edit(*.js)", "tool:write(*.js)"]
---
Redondea con Math.round(x * 100) / 100 y muestra con Intl.NumberFormat.
```

- `---`: Metadatos
- `condition`: Qué vigilar
- `cuerpo`: Qué hacer

### /omfg

```text
/omfg No uses toFixed con importes: redondea con Math.round(x * 100) / 100
como dice AGENTS.md y para mostrar usa Intl.NumberFormat con es-ES.
```

- `queja`: Tú
- `valida`: Con la conversación
- `3 intentos`: Como mucho

## Fuentes

- Documentación instalada de omp 18.6.1 (`omp read omp://…`; coincide con la copia de
  la documentación de omp (omp.sh) en `approval-mode.md`, `hooks.md`, `secrets.md`,
  `ttsr-injection-lifecycle.md`, `rulebook-matching-pipeline.md`, `bash-tool-runtime.md` y `config-usage.md`;
  `settings.md` solo difiere porque `omp read` corta la salida a 49,4 KB):
  - `approval-mode.md`: niveles `read`/`write`/`exec`; herramientas sin nivel → `exec`; **las herramientas MCP son
    `write` sea cual sea su anotación**; tabla de modos (`always-ask`, `write`, `yolo` por defecto); `--approval-mode`;
    `--auto-approve` y `--yolo` fuerzan yolo pero respetan los `deny` y las políticas explícitas; `tools.approval` en
    todos los modos; orden de resolución (deny de herramienta → deny de usuario → …); en `yolo` se ignora el aviso
    crítico «a secas»; patrones críticos de bash (`rm -rf /`, fork bomb, descargar y ejecutar, `/etc/passwd`, apagado);
    `bash.patterns` no cubre `eval` («add a `tools.approval.eval` policy»); sin interfaz, una llamada que requiere
    pregunta **falla**; ACP conserva la puerta de permisos del cliente; **subagentes** en `yolo`, pero «user `deny`
    remains absolute, and any call that resolves to `prompt` rejects».
  - `settings.md` §«Bash command approval patterns»: primera regla que encaja gana; solo `*` como comodín; espacios
    colapsados; `allow` debe cubrir el comando entero y no aprueba comandos compuestos; `deny` y `prompt` también miran
    cada segmento (`&&`, `||`, `;`, `|`, `&`, subshells, saltos de línea); `bash.allowCompoundCommands` (apagado):
    solo cadenas planas con `&&`, argumentos literales y shell POSIX identificada; «`bash.patterns` is an approval
    policy, not containment». §«Where settings live» y precedencia (proyecto por encima de global; el proyecto se lee
    solo si el cwd tiene un `.omp/` no vacío; `/settings` y `omp config set` escriben en la global).
    §«Subcommands»: `omp config get` imprime el valor efectivo.
  - `bash-tool-runtime.md` §«Approval policy» (lo mismo, visto desde la herramienta).
  - `hooks.md`: módulos `.ts`/`.js` que se cargan **con el runner de extensiones**; solo se descubren en
    `.omp/hooks/pre|post/` y `~/.omp/agent/hooks/pre|post/` (no directamente en `hooks/`); `--hook` es alias de
    `--extension`; `tool_call` puede bloquear o cambiar la entrada; `tool_result` puede reescribir la salida (ejemplo
    de redacción de `API_KEY=`); un handler de `tool_call` que lanza un error **bloquea**; la entrada de `edit` trae
    `path`/`paths` derivados para políticas.
  - `ttsr-injection-lifecycle.md`: `condition` (regex), `astCondition` (ast-grep), `question` (rol `judge`); vigila
    texto y argumentos de herramientas, no el razonamiento; aborta, descarta la salida parcial (`contextMode:
    discard`), inyecta la regla como `<system-interrupt>` y reintenta; `interruptMode`, `repeatMode` (`once`),
    `repeatGap`; las reglas `question` no interrumpen y solo se juzgan con un juez disponible (`ttsr.judge: auto`
    exige TypeSafe jev); §«/omfg and CLI».
  - `rulebook-matching-pipeline.md`: fuentes de reglas (`.omp/rules/`, `~/.omp/agent/rules/`, `RULES.md`, Cursor,
    Windsurf, Cline, Copilot, incluidas); tres cubos (TTSR, siempre aplicada, rulebook con `rule://`); `globs`,
    `scope`, `agents`; «This is advisory/contextual» para el rulebook.
  - `secrets.md`: **desactivado por defecto**; recoge variables de entorno con `KEY`, `SECRET`, `TOKEN`, `PASSWORD`…
    y valor de al menos 8 caracteres, `secrets.yml` global y de proyecto (`plain`/`regex`, `obfuscate`/`replace`,
    `friendlyName`), expresiones incluidas para tokens conocidos; marcadores `$$…$$` reversibles con una clave local
    (`secret-placeholder.key`); se restauran en los argumentos de las herramientas antes de ejecutar y en la vista
    local; **no se redactan el system prompt estático, las definiciones estáticas de herramientas ni los binarios**.
- **Código 18.5.1** (`~/orca/oh-my-pi`, `git show v18.5.1:…`, solo lectura):
  - `extensibility/extensions/wrapper.ts`: el diálogo es `select(prompt, ["Approve", "Deny"])`; «Tool call denied by
    user: …»; sin interfaz: «Tool "…" requires approval but no interactive UI available. Options: 1. Set
    tools.approvalMode: yolo in /settings 2. Add tools.approval.<tool>: allow to config 3. Use an interactive UI…».
  - `tools/approval.ts`: cuerpo del diálogo «Allow tool: <nombre>», «Reason: …» y los detalles de cada herramienta;
    `resolveApprovalFromContext`: con `--auto-approve`/`--yolo` el modo pasa a `yolo` **pero conserva las políticas
    del usuario** (`tools.approval`), que en yolo ganan (paso 3 de la resolución); `cli/args.ts`: `--yolo` es alias de
    `--auto-approve`.
  - `internal-urls/router.ts` `writeTier`: una ruta normal (no `scheme://`) es `write`, así que en modo `write` una
    edición de `.omp/config.yml`, de un hook o de una regla se aprueba sola.
  - `tools/bash.ts`: `CRITICAL_BASH_PATTERNS`; razones «Blocked by bash pattern: …», «Prompt required by bash
    pattern: …», «Critical pattern detected»; `allow` → nivel `write` con política `allow`; detalle «Command: …».
  - `tools/settings.ts`: `tools.approvalMode` (pestaña *interaction*, grupo *Approvals*, «Tool Approval»: Always ask,
    Write, Yolo), `tools.approval` («Tool Approval Policies»); `exec/settings.ts`: `bash.patterns` («Bash Approval
    Patterns», pestaña *shell*), `bash.allowCompoundCommands`; `secrets/settings.ts`: `secrets.enabled` («Hide
    Secrets», pestaña *providers*, grupo *Privacy*); `export/ttsr-settings.ts`: `ttsr.*` en la pestaña *context*.
  - `lsp/tool.ts` (acciones no de lectura → `write`), `edit/index.ts`, `write.ts`, `read.ts`, `task/index.ts`
    (`exec`), `eval.ts` (`exec`), `mcp/tool-bridge.ts` (`write`).
  - `extensibility/tool-event-input.ts`: en modo hashline, `path`/`paths` salen de las cabeceras `[RUTA#TAG]`.
  - `modes/controllers/omfg-controller.ts`, `omfg-rule.ts`, `prompts/system/omfg-user.md`: tres intentos («Attempt
    n/3 · generating…»), validación contra las salidas anteriores del asistente, «Couldn't confirm this rule matches
    the conversation. Save anyway?», «Save TTSR rule where?» con «This project (.omp/rules)», «Global — all projects
    (~/.omp/agent/rules)» y «Amend with feedback…»; confirma antes de sobrescribir; registra la regla en vivo; el
    prompt pide preferir `condition`/`astCondition`.
  - `discovery/builtin-rules/`: 27 reglas incluidas (8 de Go, 6 de Rust, 13 de TypeScript; p. ej. `ts-no-any` con
    `interruptMode: never`); `prompts/system/ttsr-interrupt.md`.
  - `examples/hooks/protected-paths.ts` y `permission-gate.ts`.
  - `internal-urls/cfg-protocol.ts`: el modelo puede pedir cambiar un ajuste (`cfg://`), siempre con diálogo «Allow
    once / Always for this session / Deny» y 10 s de espera.
- **Binario 18.6.1** (`~/.bun/bin/omp`, `grep -a`): siguen «["Approve", "Deny"]», «requires approval but no
  interactive UI», «Save TTSR rule where?», «Couldn't confirm this rule matches», «Usage: /omfg», «Hide Secrets», «Bash
  Approval Patterns», «Critical pattern detected», «Blocked by bash pattern», las mismas 27 reglas incluidas y
  «Always for this session». Changelog 18.5.1–18.6.1: nada que cambie aprobaciones, TTSR ni hooks; «Sped up secret
  redaction on long conversations» (18.6.0).
- CHANGELOG de Pi instalado (1.0.1 → 1.0.4): nada sobre aprobaciones, permisos, `tool_call` ni confianza; lo dicho
  en los vídeos 05 y 08 sigue valiendo.
- `omp --help` (`--approval-mode`, `--auto-approve`, `--hook`, `--no-rules`) y `omp ttsr --help` (`list`, `test`,
  `scan`, `--rule`, `--source`, `--tool`, `--path`, `--agent`), 18.6.1, ejecutados (solo ayuda).
- Vídeos anteriores: 01 y 11 (yolo por defecto; `config get tools.approvalMode` → `yolo`; capas de configuración; sin
  `/trust`), 05 (promete los modos de omp para este vídeo), 08 (`permisos.ts`: listas de lectura, bash troceado,
  Permitir / Permitir siempre en esta sesión / Bloquear, rutas protegidas, bloqueo sin interfaz, el `chmod`, «aprobar
  no es aislar»), 13 (`RULES.md`), 14 (rol `judge`), 16 (subagentes en yolo), 17 (`eval` y el navegador piden
  `exec`; la carpeta `~/csn/datos` añadida con `/add-dir`: «Imponer permisos de verdad es el tema del vídeo
  diecinueve»), 18 (reviewer con `bash`; «pasarán a ser límites»; redacción apagada; cierre que anuncia este vídeo).
- Tienda (`~/csn/tienda`, leída): ramas `master`, `iva-antes`, `iva-despues`; sin remoto; sin `.omp/`; `AGENTS.md`
  («Al empezar: `git status` y `git log --oneline -5`», «redondeados a céntimos con `Math.round(x * 100) / 100`»,
  commits «tienda:»).

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

