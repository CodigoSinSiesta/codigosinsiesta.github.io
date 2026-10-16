---
title: "Vídeo 20 · Extender oh my pi"
description: "extensiones, skills, plugins y comandos propios del proyecto, y hasta qué punto es compatible con lo que ya hicimos para Pi."
ruta: "pi-oh-my-pi"
orden: 20
duracion: "23 min"
video: "20-extender-omp.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/20-extender-omp.es.vtt"
---

extensiones, skills, plugins y comandos propios del proyecto, y hasta qué punto es compatible con lo que ya hicimos para Pi.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Lo mismo, en otro sitio

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Extender Pi, bloque B:** 06 (sin código) → 07 (MCP) → 08 (extensiones) → 09 (paquetes)
- **Las mismas piezas, otros sitios**
  - `comandos` · Del proyecto
  - `skills` · Con Pi y registro
  - `extensiones` · Casi sin cambios
  - `plugins` · Y marketplaces: como Claude Code
- **De lo ligero a lo potente:** Comando (texto) → Skill (Pi y omp) → Registro → Extensiones (de Pi) → Panel (plugins) → MCP (SSH)
- *En terminal:* Dónde vive cada cosa (más abajo, en «Código y comandos»)
- **Vídeo 11:** Sin /trust — ¿Qué se carga al abrir una carpeta? Lo cerramos al final.
- **El montaje**
  - `demo` · Perfil demo
  - `V4 Pro` · El modelo
  - `demo-20` · Límite 40 → 50: sin commitear

### 2 · Comandos de proyecto

<p><button type="button" class="ir-a" data-t="148">▶ Ir a 2:28</button></p>

- *En la demo:* .omp/commands/triage.md del repositorio de oh my pi
- *En terminal:* .omp/commands/ .md (más abajo, en «Código y comandos»)
- *En la demo:* .omp/commands/repaso.md
- *En la demo:* /rep, antes
- *En la demo:* /reload-plugins y /rep
- *En la demo:* /repaso las pruebas del envío
- *En la demo:* Tres viñetas, sin editar
- **Comando frente a template**
  - `template (06)` · En tu máquina: directorio del agente
  - `.omp/commands` · En el repositorio: todo el equipo
  - `choque` · Gana el proyecto: los incluidos, antes
- **También lee**
  - `.claude/commands` · Claude Code
  - `.codex` · Codex: y OpenCode
  - `.agents` · Agent Skills

### 3 · Skills que comparten Pi y oh my pi

<p><button type="button" class="ir-a" data-t="329">▶ Ir a 5:29</button></p>

- **Dónde busca skills oh my pi**
  - `.omp/skills` · Proyecto y perfil
  - `registro` · Y plugins
  - `.agents/skills` · Agent Skills: también Pi
- **.agents/skills:** Una skill, dos agentes — La de notas de versión del vídeo 06, sin cambiar una coma.
- *En la demo:* /skill:
- *En la demo:* read SKILL.md · git log
- *En la demo:* Con el formato de la skill
- *En terminal:* skill:// (más abajo, en «Código y comandos»)
- *En la demo:* /skillful status · /context
- *En la demo:* /skillful off · /context
- *En la demo:* Pi en la misma tienda
- *En la demo:* Do not trust (this session only)
- *En la demo:* Pi: recursos del proyecto ignorados

### 4 · El registro de skills

<p><button type="button" class="ir-a" data-t="500">▶ Ir a 8:20</button></p>

- *En terminal:* skills.omp.sh (diapositiva) (más abajo, en «Código y comandos»)
- **Instalar (diapositiva)**
  - `@scope/nombre` · Como en npm
  - `skills.json` · Y su lock: en el proyecto
  - `-g` · Para tu usuario
- **Lo que hace bien**
  - `huella` · Se comprueba: antes de desempaquetar
  - `scripts` · Pregunta: «Install skill with scripts?»
- **Lo que no hace:** Revisar el contenido — La huella garantiza que recibes lo publicado, no que sea inofensivo.
- **Publicar (solo explicado)**
  - `omp skill publish` · Con cuenta
  - `credenciales` · Avisa: hay que forzarlo

### 5 · Tus extensiones de Pi en oh my pi

<p><button type="button" class="ir-a" data-t="615">▶ Ir a 10:15</button></p>

- **Vídeo 11:** La promesa — ¿Funcionan en oh my pi las extensiones de Pi de los vídeos 08 y 09?
- **Por qué pueden funcionar**
  - `imports` · Reescritos: hacia las copias de omp
  - `TypeBox` · Compatible
  - `pi.extensions` · Se acepta: vídeo 09
- *En la demo:* omp --profile demo -e ~/csn/extensiones
- *En la demo:* /hola Ana
- *En la demo:* permisos.ts no conoce glob
- *En la demo:* node --test, en la lista segura
- *En la demo:* Rutas protegidas del vídeo 08
- **Límite 1:** Conoce las herramientas de Pi — glob, lsp, ast_grep, task… acaban en el diálogo. Revisa las listas.
- **Límite 2:** Varias rutas en un edit — oh my pi entrega una lista; la extensión solo mira una.
- **Límite 3 · el estado del 09**
  - `session_start` · Escucha
  - `session_tree` · Escucha
  - `session_branch` · No escucha: /branch
- **Límites 4 y 5**
  - `exec` · Sin nivel: pide aprobación en write
  - `/restart` · No hay /reload: mismos flags, misma sesión
- *En terminal:* Una extensión pensando en oh my pi (más abajo, en «Código y comandos»)

### 6 · El panel y los plugins

<p><button type="button" class="ir-a" data-t="843">▶ Ir a 14:03</button></p>

- *En la demo:* Extension Control Center
- *En la demo:* notas-de-version
- *En la demo:* repaso
- **Lo que no sale:** Los módulos de -e — El panel enseña lo que omp descubre en sus carpetas.
- **Lo que sí sale**
  - `~/.claude` · Skills personales: desactivadas, con ruta
  - `~/.agents` · Dos activas: aunque apagamos esa fuente
- **Plugins**
  - `install` · npm o git
  - `link` · Carpeta local: el pi install del 09
  - `!` · Instalar es ejecutar
- *En la demo:* /plugins
- *En la demo:* /marketplace list

### 7 · MCP y SSH

<p><button type="button" class="ir-a" data-t="992">▶ Ir a 16:32</button></p>

- *En la demo:* /mcp help
- **De dónde lee MCP**
  - `.omp/mcp.json` · Proyecto y perfil
  - `otras` · Claude, Codex, Cursor…
  - `.pi/mcp.json` · No lo lee: cópialo
- **Vídeo 07 y 11:** codemode → xd:// — Las herramientas MCP como dispositivos que el modelo descubre.
- *En terminal:* .omp/mcp.json del proyecto (diapositiva) (más abajo, en «Código y comandos»)
- *En la demo:* /ssh help

### 8 · Lo que carga una carpeta

<p><button type="button" class="ir-a" data-t="1120">▶ Ir a 18:40</button></p>

- **oh my pi:** isProjectTrusted() → true — No pide confianza por carpeta antes de cargar lo que trae el proyecto.
- **Al abrir un repositorio se carga**
  - `texto` · Comandos y skills: y reglas
  - `agentes` · Vídeo 16
  - `config` · Puede poner yolo: vídeo 19
  - `código` · Hooks y extensiones
  - `programas` · Servidores MCP
  - `plugins` · Del proyecto
- **Un caso concreto:** Ya ha pasado — Un hook que lee tu entorno y un MCP local, antes de escribir un prompt.
- *En terminal:* Antes de abrir un repositorio ajeno (más abajo, en «Código y comandos»)
- **Vídeos 5 y 19:** Extender no es aislar — Para código que no conoces: un contenedor.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1246">▶ Ir a 20:46</button></p>

- **Repaso · 1**
  - `.omp/commands` · $ARGUMENTS: /reload-plugins
  - `.agents/skills` · Pi y omp: /skill: · /skillful
  - `registro` · Huella y aviso
- **Repaso · 2**
  - `-e` · Extensiones de Pi: con límites
  - `/extensions` · Qué y de dónde
  - `plugins` · Marketplaces
- **Lo que no cambia:** Sin /trust — Todo lo que extiende oh my pi desde una carpeta se carga al abrirla.
- **La práctica:** Comando ($ARGUMENTS) → Skill (.agents) → -e (tu extensión) → /extensions (qué se carga)
- **Vídeo 21:** oh my pi fuera de la terminal — omp -p, JSON, RPC, SDK y ACP.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Dónde vive cada cosa

```text
                Pi                             oh my pi
comandos        prompts/ · .pi/prompts         .omp/commands · .claude/commands · .agents/…
skills          skills/ · .pi/skills · .agents  .omp/skills · registro · plugins · .claude · .agents
extensiones     extensions/ · .pi/extensions   .omp/extensions · perfil · -e  (/restart)
MCP             .pi/mcp.json                   .omp/mcp.json · Claude, Cursor, Codex…
confianza       /trust                         no hay
```

- `Pi`: Agente y .pi
- `oh my pi`: .omp y perfil
- `.claude · .agents`: Otras herramientas

### .omp/commands/ .md

```text
---
description: lo que verás en el menú
argument-hint: "[foco]"
---
El prompt… $ARGUMENTS · $1 $2
```

- `<nombre>.md`: El comando
- `description`: Menú
- `$ARGUMENTS`: Argumentos

### skill://

```text
read skill://notas-de-version
read skill://notas-de-version/scripts/…   # rutas relativas, sin salir de la carpeta
read ~/csn/tienda/.agents/skills/notas-de-version/SKILL.md   # lo que hizo Pro
```

- `skill://`: Dirección interna
- `relativas`: Dentro de la skill
- `ruta`: También vale

### skills.omp.sh (diapositiva)

```text
/skills search <texto>        /skills install @scope/nombre [-g]
/skills installed              /skills update
omp skill publish · version · …   # para quien mantiene skills
```

- `/skills`: En la sesión
- `install`: Cuatro verbos
- `omp skill`: Terminal

### Una extensión pensando en oh my pi

```text
export default function (pi) {
  pi.registerTool({ name, parameters: pi.zod.object({…}),
    approval: "read",   // read · write · exec
    execute: async (…) => {…} });
}
```

- `factoría`: Como en Pi
- `pi.zod`: Parámetros
- `approval`: Su nivel

### .omp/mcp.json del proyecto (diapositiva)

```text
{ "mcpServers": {
    "tienda-fs": { "command": "npx", "args": ["…"] },
    "otro": { "url": "…", "headers": { "Authorization": "!cat ~/.token" } } } }
```

- `command`: Se arranca
- `al abrir`: Sin preguntar
- `!`: Comando de shell

### Antes de abrir un repositorio ajeno

```text
ls -a .omp .claude .agents ; cat mcp.json .mcp.json
omp --no-extensions --no-skills
omp --trusted-extension /ruta/absoluta/mi-ext.ts
# ninguna de estas opciones es un sandbox
```

- `mira`: Lo más barato
- `--no-extensions`: Flags
- `sandbox`: No lo es

## Fuentes

- Documentación instalada de omp 18.6.1 (`omp read omp://…`). Comparada con la copia de
  la documentación de omp (omp.sh): **idénticas** `extension-loading.md`, `skills.md`, `marketplace.md`,
  `plugin-manager-installer-plumbing.md`, `user-facing-packages.md`, `gemini-manifest-extensions.md`, `mcp-config.md`,
  `mcp-runtime-lifecycle.md`, `custom-tools.md`, `slash-command-internals.md`, `omptype-guide.md` y `hooks.md`;
  `extensions.md` solo difiere porque `omp read` corta a 50 KB (se leyó entero en la copia).
  - `extension-loading.md`: raíces nativas `.omp/extensions` (solo el cwd) y `<agentDir>/extensions` (con
    `--profile`, la del perfil); `-e`/`--hook` como rutas explícitas; un directorio con `package.json` usa
    `omp.extensions` o el legado **`pi.extensions`**; `loadLegacyPiModule()` reescribe `@mariozechner/*`,
    `@earendil-works/*` y `@sinclair/typebox`/`typebox` hacia las copias del host; `--no-extensions`,
    `--trusted-extension <ruta absoluta>` («not a sandbox»), `disabledExtensions` (`extension-module:<nombre>`,
    `skill:<nombre>`, `slash-command:<nombre>`…); cambios de `extensions` a mitad de sesión suspenden módulos ya
    cargados, pero «newly enabled modules… require a restart»; «Extensions are **not sandboxed**»; `tool_call` falla
    cerrado (30 s, pausados durante los diálogos).
  - `extensions.md`: `ctx.isProjectTrusted()` «always `true`; OMP does not ask for per-directory trust before loading
    project inputs»; `ctx.hasUI`, `ctx.mode`; en modo interactivo funcionan diálogos, `notify` y estado, y `setFooter`
    y `setHeader` no hacen nada; eventos `session_start`, `session_branch`, `session_tree`…; patrón de estado:
    `appendEntry` con `customType` con espacio de nombres y reconstruir en `session_start`, **`session_branch`** y
    `session_tree`; nombres de comando que chocan con los incluidos se descartan con diagnóstico.
  - `skills/authoring-extensions.md`: `pi.zod`, `pi.typebox` (compatible con el legado), `approval` de una herramienta
    `"exec"` por defecto, `loadMode: "discoverable"` por defecto.
  - `slash-command-internals.md`: proveedores y prioridades (`native` 100 > `omp-plugins` 90 > `claude` 80 >
    `claude-plugins`, `agents`, `codex` 70 > `opencode` 55); `.omp/commands/*.md` del proyecto gana a los del usuario
    (del perfil); `description` del frontmatter o primera línea; `argument-hint`; `$1`, `$@`, `$ARGUMENTS`; sin
    vigilante de ficheros, se refresca con `/reload-plugins`; los incluidos reservan su nombre antes; el dashboard
    enseña los comandos tapados («shadowed»).
  - `skills.md`: `<raíz>/skills/<nombre>/SKILL.md` (un nivel); `description` obligatoria en `.omp`; proveedores
    (`native` 100, `skillshare` 95, `omp-plugins` 90, `claude` 80, `agent-plugins` 75, `claude-plugins`/`agents`/`codex`
    70…); `skill://<nombre>[/ruta]` con guardas de `..` y rutas absolutas; `/skill:<nombre>` (Enter = steer, Ctrl+Q =
    follow-up); `hide`/`disable-model-invocation`; colisiones → espacio de nombres `<ns>/<nombre>`.
  - `marketplace.md`: catálogos `.omp-plugin/marketplace.json` o `.claude-plugin/marketplace.json` (compatibles con
    Claude Code); `/marketplace` (sin argumentos abre el navegador de plugins), `add`, `discover`, `install
    nombre@marketplace`, ámbitos `user`/`project`; `/plugins list|enable|disable`; equivalentes `omp plugin …`; **los
    cambios desde la TUI no refrescan la sesión: `/reload-plugins` para agentes, skills, comandos y MCP; reiniciar para
    herramientas, hooks y módulos de extensión nuevos**; `marketplace.autoUpdate` (`notify` solo escribe en el log).
  - `plugin-manager-installer-plumbing.md`: manifiesto `package.json#omp` con respaldo `#pi`; `omp plugin install`
    (npm/git) valida importando y ejecutando la factoría contra una superficie desechable; `link` para rutas locales;
    las operaciones npm/git/link son de ámbito usuario; «Named profiles use their own roots» (sin detalle fuera de XDG).
  - `mcp-config.md` y `mcp-runtime-lifecycle.md`: `.omp/mcp.json` y `<agentDir>/mcp.json` (por perfil); lee también
    Claude Code, Codex, Gemini, OpenCode, Cursor, Windsurf, VS Code y `mcp.json`/`.mcp.json` en la raíz (las de usuario
    de herramientas ajenas, con opt-in); **no lee `.pi/mcp.json`**; valores `!comando` en `env`/`headers` se ejecutan
    en el proyecto; `mcp.enableProjectConfig: false` excluye todo lo del proyecto; `disabledServers`; `/mcp reload`;
    las herramientas MCP pueden montarse en `xd://` (`settings.md`: `tools.xdev`, `true`).
  - `gemini-manifest-extensions.md`: `.gemini/extensions` del proyecto, solo metadatos (no se menciona en la locución).
- **Código 18.5.1** (`~/orca/oh-my-pi`, `git show v18.5.1:…`, solo lectura):
  - `extensibility/extensions/runner.ts` y `session/agent-session.ts`: `isProjectTrusted: () => true`; no hay evento
    `project_trust` en `src/`.
  - `extensibility/plugins/legacy-pi-compat.ts`: alias de scope `oh-my-pi`, `mariozechner`, `earendil-works`; filtro
    `^(?:@sinclair\/typebox|typebox)$` hacia un shim.
  - `extensibility/tool-event-input.ts`: en hashline, un `edit` de un fichero recibe `path` y `paths`; de varios, solo
    `paths`.
  - `tools/builtin-names.ts`: `read`, `bash`, `edit`, `ast_grep`, `ast_edit`, `ask`, `debug`, `eval`, `glob`, `grep`,
    `find`, `lsp`, `task`, `todo`, `web_search`, `write`… (no hay `ls`).
  - `slash-commands/builtin-marketplace.ts`: `/reload-plugins` («Reload all plugins (skills, commands, hooks, tools,
    agents, MCP)», pero `reloadTuiPluginState` solo refresca agentes, skills, comandos de fichero, capacidades y MCP;
    mensaje «Plugins reloaded.»); `builtin-session.ts`: `/extensions` (alias `/status`, «Open Extension Control Center
    dashboard»); `builtin-modes.ts`: `/skillful [on|off|status]` («session only»; ajuste `skillful`, por defecto
    `true`, «List Skills in Prompt»); `builtin-lifecycle.ts`: `/restart` («Restart omp with the same launch flags,
    resuming this session»), `/ssh add|list|remove|help`; `builtin-skills.ts`: `/skills search|install|installed|update`
    (instala en el proyecto, `-g` en el usuario; «Install skill with scripts?»). No hay `/reload`.
  - `skillshare/installer.ts`: integridad `sha512` comprobada antes de desempaquetar, `skills.json` y
    `skills.lock.json`, aprobación si el paquete trae `scripts/` o ejecutables.
  - `modes/components/extensions/state-manager.ts` y `dashboard-runtime.ts`: el Control Center carga skills, reglas,
    tools, módulos de extensión (**solo los del proveedor `native`**), MCP, prompts, comandos, hooks y ficheros de
    contexto, con `includeDisabled: true` (estados active, disabled, shadowed, «user-opt-in»); los interruptores
    escriben `disabledExtensions`.
  - `extensibility/settings.ts` y `extensibility/skills.ts`: `skills.enableAgentsUser` y `enableAgentsProject`
    (`true`), `enableClaudeUser`/`enableCodexUser` (`false`); `capability/index.ts`: `agents` **no** está entre los
    proveedores ajenos de opt-in, así que `~/.agents/skills` y `~/.agent/skills` se cargan siempre, con cualquier perfil.
  - `discovery/agents.ts`: `.agent/` y `.agents/` del proyecto (subiendo hasta la raíz del repo) y de la carpeta
    personal: skills, reglas, prompts, comandos y `AGENTS.md`.
  - `discovery/ssh.ts`, `internal-urls/ssh-protocol.ts`, `prompts/internal-urls/ssh.md`: hosts en `.omp/ssh.json` y
    `<agentDir>/ssh.json`; `ssh://host/ruta` para `read`, `write` y `grep` (texto UTF-8 de hasta 1 MiB).
- **Binario 18.6.1** (`~/.bun/bin/omp`, `grep -a`): siguen `isProjectTrusted: () => true`, «Plugins reloaded.», «Open
  Extension Control Center dashboard», «Install skill with scripts?», «Toggle listing available skills in the system
  prompt (session only)» y «Restart omp with the same launch flags, resuming this session». Changelog 18.5.1–18.6.1:
  cargador de extensiones más rápido (18.6.0), búsquedas `skill://` concurrentes (18.6.1), `pi.exec()` devuelve `-1`
  si se mata el proceso (18.6.1). Nada cambia lo que cuenta este vídeo.
- `omp --help`, `omp skill --help`, `omp plugin --help`, `omp install --help`, `omp ssh --help` (18.6.1, solo ayuda):
  `-e`, `--hook`, `--no-extensions`, `--no-skills`, `--skills`, `--plugin-dir`; `omp skill` contra skills.omp.sh
  (`install`, `search`, `publish`…, `-y` instala con scripts sin preguntar); `omp install` = `plugin install`/`link`.
- Pi 1.0.4 instalado: `docs/security.md` §«Understand project trust» (**`.agents/skills` del proyecto exige confianza**,
  igual que `.pi/mcp.json`, `.pi/extensions`…; `defaultProjectTrust: "ask"`), `docs/skills.md` (Pi lee
  `~/.agents/skills/` y `.agents/skills/`), `docs/mcp.md` (`~/.pi/agent/mcp.json` y `.pi/mcp.json`). CHANGELOG
  1.0.1 → 1.0.4: nada sobre extensiones, skills, paquetes ni confianza.
- Vídeos anteriores: 06 (skill `notas-de-version`, template `/review`, «revisa las skills de un proyecto ajeno antes de
  concederle confianza»), 07 (`tienda-fs`, `codemode`/`deferred`/`direct`, `.pi/mcp.json` solo con confianza), 08
  (`hola.ts`, `tests.ts`, `permisos.ts`, `/reload`), 09 (borrador: paquete `csn-extensiones` con `pi.extensions`,
  `appendEntry`, reconstrucción en `session_start` y `session_tree`, «Permitir siempre en esta rama»), 11 (sin
  `/trust`; `.claude/commands/resumen-envio.md`; `/tools` con `~ xd://`; promete este vídeo), 12 (`/branch` rebobina
  en el mismo fichero, `/tree`, `/restart`), 13 (`/context` con la categoría Skills), 16 (`.omp/agents/`), 18
  (`/review` incluido tapa un `review.md` propio), 19 (`.omp/config.yml`, hooks en `.omp/hooks/pre/`, «aprobar no es
  aislar», nivel `exec` para herramientas sin nivel; cierra anunciando este vídeo). `/ssh` no aparece en 12–18.
- Tienda (`~/csn/tienda`, leída): `master` limpio, ramas `iva-antes` e `iva-despues`, sin `.omp/`, `.agents/` ni
  remoto. `~/csn/extensiones` (leída): **sigue en el estado del vídeo 08** (`hola.ts`, `tests.ts`, `permisos.ts`, sin
  `package.json`; `permisos.ts` con `LECTURA = ["read", "grep", "find", "ls", "ejecutar_tests"]` y rutas protegidas
  `AGENTS.md` y `.git/`).
- Documentación oficial de Pi: [mcp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/mcp.md), [security.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/security.md), [skills.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md)

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Lo mismo, en otro sitio**

En el bloque de Pi dedicamos cuatro vídeos a esto. En el seis personalizamos sin código, con prompt templates y skills. En el siete conectamos servidores MCP. En el ocho escribimos extensiones, y en el nueve las empaquetamos. Hoy no vamos a repetir nada de eso. La pregunta es otra: si ya sabes extender Pi, ¿qué cambia en oh my pi?

La respuesta corta es que las piezas son las mismas, pero viven en otros sitios y llegan por más caminos. Para compartir un prompt con el equipo, lo natural es un comando de proyecto, en una carpeta del repositorio. Las skills se pueden compartir con Pi, y además hay un registro público para instalarlas. Las extensiones de Pi se cargan casi sin cambios. Y hay dos piezas que Pi no tiene: plugins y marketplaces, compatibles con los de Claude Code.

Vamos a ir de lo más ligero a lo más potente. Un comando de proyecto, que es solo un fichero de texto. Una skill, que usarán tanto Pi como oh my pi. El registro de skills. Nuestras extensiones del vídeo ocho, funcionando en oh my pi, y dónde se quedan cortas. El panel que lo enseña todo, los plugins y los marketplaces. Y MCP y SSH, más deprisa, porque ya conoces la idea.

En pantalla tienes la tabla que usaremos de mapa. A la izquierda, dónde vivía cada pieza en Pi: el directorio del agente y la carpeta punto pi del proyecto. A la derecha, dónde vive en oh my pi: punto o eme pe en el proyecto, la carpeta de tu perfil, y además las carpetas de otras herramientas, como punto claude o punto agents. Es la misma idea del vídeo once: oh my pi lee mucho más de lo que escribe.

Y un hilo que recorre todo el vídeo. En el vídeo once dijimos que oh my pi no tiene barra trust. Hoy veremos qué significa eso para cada pieza que extiende oh my pi desde un repositorio, y lo cerraremos con una lista concreta de lo que se carga al abrir una carpeta.

Trabajamos como siempre: la tienda, el perfil demo y DeepSeek V cuatro Pro, en una rama de usar y tirar, demo veinte, con un cambio sin commitear para tener algo que revisar: el límite del envío gratis sube de cuarenta a cincuenta euros.

**2 · Comandos de proyecto**

Empezamos por un comando que no es nuestro. Si abres oh my pi dentro de su propio repositorio, en el menú aparece barra triage. Parece un comando incluido, y no lo es: es un fichero Markdown en la carpeta punto o eme pe barra commands de ese repositorio. Lo enseñamos con head, sin abrir oh my pi ahí. Es un prompt largo que clasifica las issues de GitHub recientes y les pone etiquetas. Precisamente por eso no lo ejecutamos: escribe en GitHub.

Fíjate en la forma. Un comando de proyecto es un fichero punto md en punto o eme pe barra commands. El nombre del fichero es el nombre del comando. Si tiene frontmatter, description es lo que verás en el menú y argument hint, la pista de los argumentos. El resto es el prompt que se envía al modelo. Dólar ARGUMENTS recibe todo lo que escribas después del comando, y dólar uno, dólar dos, cada palabra por separado.

Nuestro ejemplo es inofensivo a propósito. Se llama repaso, y pide repasar los cambios sin commitear antes de un commit: git status, git diff con estadísticas y npm test, y una respuesta en tres viñetas, sin editar nada.

Con oh my pi abierto, escribimos barra rep, y no aparece nada nuestro. Creamos la carpeta y copiamos el fichero desde el otro panel. Seguiría sin aparecer, porque oh my pi no vigila esas carpetas. Barra reload plugins vuelve a buscar comandos, skills, agentes y servidores MCP, y responde plugins reloaded. Ahora sí: barra repaso, con la pista foco y su descripción.

Lo ejecutamos con un foco: las pruebas del envío. En la conversación vemos lo que de verdad le llega al modelo: el texto del fichero, con dólar ARGUMENTS ya sustituido por nuestro foco. Pro ejecuta git status y el diff en una línea, y npm test en otra, y la tarjeta de los tests sale en rojo.

La respuesta llega en tres viñetas, sin tocar nada. Qué cambia: el umbral del envío gratis, de cuarenta a cincuenta. Si pasan las pruebas: no, fallan tres, una del envío y dos del carrito. Y qué falta según el AGENTS punto md: actualizar las pruebas al nuevo umbral, y además un comentario que sigue diciendo cuarenta euros.

¿Por qué no un prompt template, como en el vídeo seis? Aquel vivía en el directorio del agente de Pi, en tu máquina. Este vive en el repositorio y se versiona con el código, así que todo el equipo tiene el mismo barra repaso. Si hay dos con el mismo nombre, gana el del proyecto sobre el de tu perfil. Y los incluidos de oh my pi reservan su nombre antes que nadie: un review punto md propio quedaría tapado por el barra review del vídeo dieciocho.

Y punto o eme pe barra commands no es el único sitio. oh my pi recoge también los comandos de punto claude, punto codex, OpenCode y punto agents. Si un repositorio ya tiene comandos para Claude Code, en oh my pi aparecen sin hacer nada.

**3 · Skills que comparten Pi y oh my pi**

Las skills funcionan igual que en el vídeo seis. Una carpeta con un SKILL punto md, cuyo nombre y descripción viajan en el system prompt, y cuyo contenido el modelo lee solo cuando lo necesita. Lo que cambia es dónde las busca oh my pi: en punto o eme pe barra skills, en el perfil, en el registro, en los plugins, en punto claude, en punto codex y en punto agents barra skills.

Esa última ruta es la interesante, porque Pi también la lee. Una skill en punto agents barra skills del repositorio sirve para los dos agentes. Copiamos allí la skill de notas de versión del vídeo seis, sin cambiar una coma.

Barra reload plugins otra vez. Escribimos barra skill dos puntos y una letra, y aparece skill dos puntos notas de versión, con su descripción: oh my pi registra un comando por cada skill. Lo usamos con un texto detrás: de los últimos seis commits.

Pro lee la carpeta de la skill y su SKILL punto md, ejecuta git log con los seis últimos commits, y responde con el formato que pide la skill: novedades, correcciones, sin hashes, y la línea final, incluye seis commits. Como en Pi, una skill no cuesta casi nada hasta que se usa, y cuando se usa, se nota.

Un detalle propio de oh my pi: las skills también tienen una dirección interna, skill dos barras y el nombre, para que una skill apunte a sus scripts o referencias con rutas relativas, sin salir de su carpeta. Aquí el modelo prefirió leer el fichero por su ruta, que también vale.

Y otro detalle: barra skillful. Barra skillful status responde skill listing on: la lista de skills viaja en el system prompt. Barra context, del vídeo trece, lo confirma: la categoría skills, veinte tokens. Con barra skillful off, el aviso dice que el listado queda desactivado para esta sesión, y barra context baja a cero. A cambio, el modelo ya no sabe qué skills hay, y solo las usa si las invocas tú. Volvemos a dejarlo en on.

Ahora, la diferencia que importa. En el otro panel abrimos Pi en la misma tienda. Antes de empezar, Pi pregunta: trust project folder, ¿confías en esta carpeta? La pregunta sale porque ha encontrado punto agents barra skills. Ofrece confiar en la carpeta, en la de arriba, solo esta sesión, o no confiar.

Elegimos no confiar, solo en esta sesión, para no guardar ninguna decisión. Pi arranca y avisa: este proyecto no es de confianza, y sus recursos y paquetes se ignoran. oh my pi cargó la misma carpeta sin preguntar nada. Una skill es texto, pero texto que tu modelo obedece, y puede pedirle que ejecute scripts.

**4 · El registro de skills**

oh my pi tiene un registro público de skills, en skills punto o eme pe punto ese hache. Se maneja desde la sesión con barra skills, que tiene cuatro verbos: search, install, installed y update. Y desde la terminal con o eme pe skill, que añade publicar y versionar, para quien mantiene skills.

En este vídeo no instalamos nada de ahí, y no buscamos en directo, porque los resultados llevan nombres de usuario de terceros. Lo vemos en una diapositiva. Los paquetes se nombran con arroba, quien lo publica, barra y el nombre, como en npm. Por defecto se instalan en el proyecto, con un skills punto json y un fichero lock con la versión exacta, para que todo el equipo tenga la misma. Con guion g, para tu usuario.

Lo que hace bien: antes de desempaquetar, comprueba la huella del paquete, y si no coincide, no instala nada. Y si la skill trae scripts o ejecutables, se detiene y pregunta: install skill with scripts, con la lista de lo que trae. Desde la terminal, guion y salta esa pregunta. No lo uses con paquetes que no hayas leído.

Lo que no hace: revisar el contenido. La huella garantiza que recibes lo que se publicó, no que lo publicado sea inofensivo. Una skill del registro es texto de otra persona que tu modelo va a seguir, y scripts que puede ejecutar con tus permisos. Léelo antes, como leerías un script de instalación.

Si algún día quieres publicar una skill tuya, el camino es o eme pe skill publish, con una cuenta en el registro. Tiene un modo de prueba que empaqueta y valida sin publicar, y vigila las cadenas con forma de credencial: para publicar aunque las encuentre hay que pedirlo con una opción expresa. Publicar no lo hacemos en este curso: lo que sale de tu máquina se explica, no se enseña.

**5 · Tus extensiones de Pi en oh my pi**

En el vídeo once prometimos comprobar si las extensiones que escribimos para Pi funcionan en oh my pi. Toca cumplirlo.

La razón por la que pueden funcionar es concreta. Antes de ejecutar un módulo, oh my pi reescribe los imports de los paquetes de Pi hacia sus propias copias, y TypeBox, que usamos para los parámetros de la herramienta de tests, se redirige a una versión compatible. Y si le das una carpeta con package punto json, acepta el manifiesto pi punto extensions del vídeo nueve.

Así que salimos y arrancamos oh my pi con guion e y la carpeta de nuestras extensiones. No hay una lista de extensiones en el arranque, como en Pi, pero debajo del editor aparece el pie de permisos punto ts: cero aprobadas, cero bloqueadas. Barra hola Ana, y aparece el saludo: hola, Ana. El comando del vídeo ocho, sin tocar una línea.

Ahora una pregunta que ponga a trabajar al resto: qué ficheros de test hay en la tienda y si pasan los del carrito. Y aquí aparece la primera sorpresa. Para buscar ficheros, Pro usa glob, una herramienta que en Pi no existía. Nuestra lista de lectura dice read, grep, find, ls y ejecutar tests. Glob no está, así que aparece el diálogo de permisos punto ts, el del vídeo nueve: Pi quiere ejecutar glob, con permitir, permitir siempre en esta rama o bloquear. Permitimos.

El node guion guion test del carrito pasa sin preguntar, porque está en la lista de comandos seguros de nuestra extensión. Fíjate en otro detalle: el modelo ni siquiera usó nuestra herramienta ejecutar tests; con las herramientas de oh my pi, prefirió bash. Responde con una tabla: dos ficheros de test, y en el carrito, diez de doce, con dos fallos. Y el pie sube a una aprobada.

Probamos las rutas protegidas: añade a AGENTS punto md una regla, no usar dependencias externas. La edición sale en rojo, con nuestro motivo, AGENTS punto md está protegido, y el aviso de ruta protegida. En su razonamiento, Pro se plantea probar por bash y lo descarta: sería saltarse la protección. Nos propone la línea para que la añadamos nosotros.

Ahora los límites, que son el motivo de este capítulo. El primero ya lo has visto: la extensión conoce las herramientas de Pi. oh my pi trae unas treinta, y glob, lsp, ast grep o task acabarán en el diálogo. Para usarla de verdad, revisa sus listas.

El segundo: si el modelo edita varios ficheros en una sola llamada, oh my pi entrega una lista de rutas, no una ruta. Nuestra comprobación solo mira una, y la protección no lo vería.

El tercero afecta al estado del vídeo nueve. Allí reconstruíamos lo permitido al arrancar y al navegar por el árbol. En oh my pi, rebobinar con barra branch, del vídeo doce, lanza otro evento, session branch, que nuestra extensión no escucha. La documentación de oh my pi recomienda reconstruir en los tres.

El cuarto: las herramientas de una extensión que no declaran nivel cuentan como exec. Con el modo write del vídeo diecinueve, ejecutar tests pediría aprobación. Y el quinto: no hay barra reload. Si cambias el código de una extensión, barra restart relanza oh my pi con los mismos flags y retoma la sesión.

¿Y si escribes una extensión nueva pensando ya en oh my pi? La forma es la misma: una factoría por defecto que recibe pi. Importas los tipos del paquete de oh my pi, usas pi punto zod para los parámetros, y tus herramientas declaran su nivel, read, write o exec. Una herramienta de solo lectura que dice read no necesita ninguna lista como la nuestra.

**6 · El panel y los plugins**

Con tanto origen distinto, hace falta un sitio donde ver qué se ha cargado y de dónde. Es barra extensions, que abre el Extension Control Center. Arriba, una pestaña por origen: incluidos, Claude Code, las carpetas de agentes, Codex, Cursor, Copilot, VS Code, MCP, SSH y más. Lo recorremos sin tocar ningún interruptor, porque cada cambio se guarda en la configuración.

Buscamos notas, y ahí está nuestra skill: activa, que viene de las carpetas de agentes del proyecto, con su ruta y sus instrucciones. Buscamos repaso: activo, que viene de oh my pi en el proyecto, con su pista, foco, y la nota de que acepta dólar ARGUMENTS. Cuando un comando no hace lo que esperas, mira aquí primero.

Fíjate en lo que no sale: las extensiones que cargamos con guion e. Buscamos permisos y no aparece. El panel enseña lo que oh my pi descubre en sus carpetas, no lo que le pasas a mano.

Y en lo que sí sale, que es mucho. El panel lista también, desactivadas, las skills de otras herramientas que tienes en tu carpeta personal, con sus rutas. Por eso en el vídeo lo filtramos. En nuestra máquina, además, dos skills personales de las carpetas de agentes aparecían activas aunque habíamos apagado esa fuente en el perfil. Es justo para lo que sirve este panel: descubrir lo que se ha colado.

La forma estable de instalar extensiones son los plugins. Un plugin es un paquete que declara sus extensiones y puede traer skills, comandos, hooks, herramientas, agentes, reglas y servidores MCP. O eme pe plugin install lo instala desde npm o git, y o eme pe plugin link enlaza una carpeta local, el equivalente del pi install del vídeo nueve. Al instalar, oh my pi ejecuta la extensión para comprobar que carga: instalar ya es ejecutar su código.

Barra plugins lista los instalados, y en nuestro perfil responde que no hay ninguno. Y barra marketplace list, que no hay marketplaces, con una sugerencia: añadir el catálogo oficial de Anthropic. Un marketplace es un repositorio con un catálogo marketplace punto json, en el formato de oh my pi o en el de Claude Code. Con add lo añades, con discover lo exploras y con install instalas un plugin, para tu usuario o solo para el proyecto. No añadimos ninguno.

**7 · MCP y SSH**

MCP lo conoces del vídeo siete. En oh my pi el comando se llama barra mcp, y su ayuda lo resume: add, list, test, enable, disable, reload, la gestión del inicio de sesión de los servidores remotos, e incluso búsqueda en un registro de servidores, Smithery. Solo enseñamos la ayuda, porque la lista puede mostrar configuraciones de otras herramientas de tu máquina.

Lo que cambia es de dónde lee los servidores. Los suyos, en punto o eme pe barra mcp punto json, del proyecto o del perfil. Y además traduce los de Claude Code, Codex, Gemini, Cursor, Windsurf, OpenCode y VS Code, y un mcp punto json en la raíz del proyecto. Lo que no lee es la configuración de Pi. El formato de base es el mismo, así que el servidor tienda fs del vídeo siete se puede copiar a punto o eme pe barra mcp punto json; lo que era solo de Pi, como el codemode, se queda fuera.

Sobre el coste de las herramientas, la idea del vídeo siete sigue valiendo con otro nombre. Donde Pi tenía codemode, oh my pi puede montar las herramientas MCP como dispositivos xd dos barras, que el modelo descubre cuando las necesita, como vimos con barra tools en el vídeo once.

Un apunte de seguridad que enlaza con el final. Un servidor MCP local es un programa que oh my pi arranca. Si está en el mcp punto json del proyecto, arranca al abrir la carpeta. Y en esa configuración, un valor que empieza por exclamación se ejecuta como comando de shell. En Pi, punto pi barra mcp punto json esperaba a tu confianza.

Barra ssh es más sencillo. Su ayuda tiene tres verbos: add, con el nombre, el host, el usuario, el puerto y la clave, en el proyecto o en tu perfil; list y remove. Después, las herramientas de lectura, escritura y búsqueda aceptan direcciones ese ese hache dos barras, el nombre de la máquina y la ruta. Tampoco enseñamos la lista, porque mostraría hosts y rutas de claves.

**8 · Lo que carga una carpeta**

Ahora sí, el hilo de todo el vídeo. En Pi, barra trust decide si se carga lo que trae un proyecto, y acabamos de ver esa pregunta. En oh my pi esa decisión no existe. Una extensión puede preguntar si el proyecto es de confianza, y la respuesta es siempre que sí. La documentación lo dice tal cual: oh my pi no pide confianza por carpeta antes de cargar lo que trae el proyecto.

Juntemos lo que hemos visto en este bloque. Al abrir oh my pi en un repositorio se cargan sus comandos y sus skills, de punto o eme pe, de punto claude y de punto agents. Sus reglas. Sus agentes, del vídeo dieciséis. Su configuración, que puede poner el modo yolo, como vimos en el diecinueve. Sus hooks y sus extensiones, que son código. Sus servidores MCP, que son programas. Y los plugins instalados para ese proyecto.

Piensa en un caso concreto. Clonas un repositorio para revisar una contribución y lo abres con oh my pi. En su punto o eme pe hay un hook que, al arrancar, lee tus variables de entorno, y un servidor MCP local que manda lo que quiera a donde quiera. No has escrito ni un prompt, y ya ha pasado. En Pi, con la confianza en su valor de fábrica, eso no se habría cargado hasta que dijeras que sí.

¿Qué puedes hacer? Lo primero, lo más barato: antes de abrir un repositorio ajeno, mira sus carpetas punto o eme pe, punto claude y punto agents, y su mcp punto json. Después, las opciones de arranque, que el repositorio no puede cambiar: guion guion no extensions, guion guion no skills, o guion guion trusted extension con una ruta absoluta. La propia documentación avisa: ninguna es un sandbox.

Los ajustes, como desactivar los servidores MCP del proyecto, ayudan, pero recuerda el vídeo diecinueve: la capa del proyecto gana a la tuya. Para un repositorio ajeno, confía en los flags, no en la configuración. Y para un código que no conoces, la respuesta es la de los vídeos cinco y diecinueve: un contenedor. Extender no es aislar.

**9 · Repaso, práctica y cierre**

Repasemos. Un comando de proyecto es un Markdown en punto o eme pe barra commands, con dólar ARGUMENTS, versionado con el código, y barra reload plugins lo recoge. Las skills en punto agents barra skills sirven para Pi y para oh my pi; se invocan con barra skill dos puntos y su nombre, y barra skillful decide si la lista viaja en el system prompt. El registro instala skills con la huella comprobada y avisa si traen scripts.

Tus extensiones de Pi cargan con guion e, pero conocen las herramientas de Pi, no escuchan barra branch, y se recargan con barra restart. Barra extensions te dice qué se cargó y de dónde, y te enseña lo que se ha colado. Plugins y marketplaces, compatibles con Claude Code, empaquetan todo lo anterior.

Y lo que no cambia: oh my pi no tiene barra trust. Todo lo que extiende oh my pi desde una carpeta se carga al abrirla. En toda la demo, el coste se quedó en un par de céntimos.

La práctica: en una rama de tu proyecto, convierte el prompt que más repites en un comando de punto o eme pe barra commands, con dólar ARGUMENTS, y una de tus skills en punto agents barra skills para que la vean Pi y oh my pi. Después carga tu extensión de Pi con guion e y apunta qué herramientas de oh my pi le faltan en sus listas. Y abre barra extensions para ver qué más se carga en tu máquina.

En el próximo vídeo sacamos oh my pi de la terminal: o eme pe guion p en scripts e integración continua, el modo JSON, RPC, el SDK y ACP para editores. Nos vemos allí.

</details>

