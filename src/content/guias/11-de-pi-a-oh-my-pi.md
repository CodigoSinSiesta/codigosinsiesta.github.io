---
title: "Vídeo 11 · De Pi a oh my pi"
description: "qué hereda omp de Pi y qué añade, primer arranque e importación de la configuración de Claude Code o Codex. Una tabla para decidir cuál usar."
ruta: "pi-oh-my-pi"
orden: 11
duracion: "24 min"
video: "11-de-pi-a-oh-my-pi.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/11-de-pi-a-oh-my-pi.es.vtt"
---

qué hereda omp de Pi y qué añade, primer arranque e importación de la configuración de Claude Code o Codex. Una tabla para decidir cuál usar.

<p class="guia__nota">Dura 24 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Del núcleo mínimo al taller completo

<p><button type="button" class="ir-a" data-t="19">▶ Ir a 0:19</button></p>

- **El bloque B, en una línea:** Instalar (02–04) → Aislar y personalizar (05–07) → Extender (08–09) → Programar (10)
- **Bloque C:** ¿Qué me llevo, qué cambia y qué es nuevo? — La pregunta de quien ya sabe usar Pi.
- **Hoy:** Qué es (y su motor) → Herencia (qué cambia de sitio) → Primer arranque (perfil aislado) → Cuatro comandos (para orientarse) → Pi frente a omp (una tabla)
- **El modelo del bloque:** DeepSeek V4.1 Flash — El mismo de Pi desde el vídeo 03, con la clave en una variable de entorno.

### 2 · Un fork con otro motor

<p><button type="button" class="ir-a" data-t="123">▶ Ir a 2:03</button></p>

- **oh my pi:** Un fork de Pi — Una copia del código que evoluciona por su cuenta. Binario: omp.
- **Un fork sin ruptura**
  - `sync` · Sigue a Pi: guía para traer cambios
  - `MIT` · Stencil Labs: licencia MIT
  - `Zechner` · Colaborador: el autor de Pi
- **Otro motor**
  - `Node` · Pi: TypeScript sobre Node
  - `Bun + Rust` · oh my pi: búsqueda, terminal, shell, imágenes
- **Por qué te importa**
  - `binario` · Autónomo: sin Node ni Bun
  - `bash` · Shell embebido: no es tu shell de siempre
- **El rastro del origen:** pi-* · PI_* — Paquetes y variables que te sonarán del bloque B.

### 3 · Qué hereda y qué cambia de sitio

<p><button type="button" class="ir-a" data-t="243">▶ Ir a 4:03</button></p>

- **Se hereda tal cual**
  - `bucle` · Steering y follow-up
  - `JSONL` · Árbol de sesión
  - `@` · Adjuntar ficheros
  - `-p json rpc` · Modos y SDK: vídeo 10
  - `skills` · Bajo demanda
  - `tool_call` · Extensiones: vídeo 08
- **Cambia de sitio**
  - `config.yml` · YAML: ~/.omp/agent
  - `agent.db` · SQLite: varias cuentas
  - `glob` · Antes find
- **Si vienes de Pi:** Tu .pi no se traslada — Ajustes, prompt templates y el /review del vídeo 06 no los verá oh my pi.
- **Extensiones de Pi:** Adaptadores — Reescribe sus imports y acepta el manifiesto de Pi. Lo probamos en el vídeo 20.
- **Si algo no está donde esperas**
  - `1` · Cambió de nombre
  - `2` · Cambió de formato
  - `3` · Ya viene integrado
- **El bloque C**
  - `12` · TUI y sesiones
  - `13` · Contexto
  - `14` · Modelos
  - `15` · Planificar
  - `16` · Subagentes
  - `17` · IDE
  - `18` · Git
  - `19` · Aprobaciones
  - `20` · Extender
  - `21` · Programático

### 4 · Instalar y arrancar en un perfil aislado

<p><button type="button" class="ir-a" data-t="402">▶ Ir a 6:42</button></p>

- *En terminal:* Instalar y actualizar oh my pi (más abajo, en «Código y comandos»)
- *En la demo:* omp --version · omp --help
- *En terminal:* Piezas opcionales (más abajo, en «Código y comandos»)
- **--profile:** Perfiles aislados — Ajustes, credenciales, sesiones y cachés propios. Grabamos con el perfil demo.
- **Cuidado:** PI_CODING_AGENT_DIR — El perfil por defecto la respeta; los perfiles con nombre la ignoran.
- *En la demo:* El perfil demo
- *En la demo:* Setup step 1 of 5
- *En la demo:* Esc para saltar

### 5 · Dentro por primera vez

<p><button type="button" class="ir-a" data-t="609">▶ Ir a 10:09</button></p>

- *En la demo:* Setup step 2 of 5
- *En la demo:* Setup step 4 of 5
- *En la demo:* La línea de estado
- *En la demo:* Primera petición
- **Coste:** Poco, pero no gratis — Avisaremos cada vez que algo llame al modelo.

### 6 · Cuatro comandos para orientarte

<p><button type="button" class="ir-a" data-t="705">▶ Ir a 11:45</button></p>

- **Cuatro comandos**
  - `/changelog` · Qué cambió
  - `/hotkeys` · El teclado
  - `/tools` · Herramientas
  - `/settings` · Ajustes
- *En la demo:* /changelog last 2
- *En la demo:* /changelog full
- *En la demo:* /hotkeys
- *En la demo:* /hotkeys
- **keybindings.yml:** Lo único que hereda un perfil — Tu teclado no cambia de un perfil a otro.
- *En la demo:* /tools
- *En la demo:* xd:// descubribles
- *En la demo:* La descripción de read
- *En la demo:* /settings
- *En la demo:* Interaction → Approvals

### 7 · La configuración en capas

<p><button type="button" class="ir-a" data-t="915">▶ Ir a 15:15</button></p>

- **Dónde se escribe**
  - `global` · Tu perfil: /settings y config set
  - `.omp/config.yml` · Proyecto: solo en la carpeta de arranque
  - `--config` · Una ejecución: no se guarda
- **Prioridad, de menor a mayor:** Fábrica → Global → Proyecto → --config → CLI → Entorno
- *En terminal:* omp config desde la terminal (más abajo, en «Código y comandos»)
- **Un consejo**
  - `global` · Lo tuyo: tema y atajos
  - `repo` · Lo del proyecto: aprobaciones, modelos; se versiona
- *En la demo:* El perfil, aislado

### 8 · Si vienes de Claude Code o de Codex

<p><button type="button" class="ir-a" data-t="1042">▶ Ir a 17:22</button></p>

- **Vídeo 01:** Lee Claude Code y Codex — Es verdad, con un matiz importante.
- **Proyecto: se lee por defecto**
  - `.omp` · La suya
  - `.claude…` · Otras herramientas: .codex, .gemini
  - `Cursor…` · Reglas: Windsurf, Cline, Copilot
- **Usuario: al revés:** enabledProviders — Tu configuración personal de otras herramientas no se carga hasta que la activas.
- *En la demo:* .claude/commands/resumen-envio.md
- *En la demo:* /resumen-envio
- *En terminal:* Traerte conversaciones (solo diapositiva) (más abajo, en «Código y comandos»)
- **Excepción:** .claude/agents se ignora — Los subagentes de oh my pi viven en .omp/agents (vídeo 16).
- **El apunte honesto**
  - `/trust` · No existe: el repo carga al arrancar
  - `yolo` · Por defecto: no pregunta
  - `revisar` · .omp y .claude: o un contenedor

### 9 · Pi frente a oh my pi, y cierre

<p><button type="button" class="ir-a" data-t="1221">▶ Ir a 20:21</button></p>

- **La tabla:** Pi frente a oh my pi — Fila a fila.
- **Pi frente a oh my pi**
  - `Origen` · Original · fork 2026
  - `Motor` · Node · Bun + Rust
  - `Config` · JSON · YAML y perfiles
  - `Credenciales` · JSON · SQLite multicuenta
- **Pi frente a oh my pi**
  - `Herramientas` · 4 · ~30 (12 activas)
  - `Comandos` · ~25 · 85
  - `Subagentes` · Ejemplo · de serie
- **Pi frente a oh my pi**
  - `Seguridad` · /trust · aprobaciones (yolo)
  - `Otros agentes` · AGENTS/CLAUDE · media docena
- **Lo que se mantiene:** Todo el bloque B sigue valiendo — Bucle, árbol de sesión, modos, SDK, skills y extensiones.
- **¿Cuál elegir?**
  - `Pi` · Entender y controlar: contexto pequeño, tu propio harness
  - `omp` · Taller completo: superficie grande
- **Repaso**
  - `fork` · Bun + Rust
  - `yml` · Config y SQLite
  - `--profile` · Perfiles
- **La práctica:** Un perfil (--profile) → /settings (diez minutos leyendo) → Tu repo (qué recoge solo)
- **Próximo vídeo:** La TUI y las sesiones — Rebobinar, bifurcar y navegar el árbol: /branch, /fork y /tree.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Instalar y actualizar oh my pi

```text
curl -fsSL https://omp.sh/install | sh          # macOS y Linux
irm https://omp.sh/install.ps1 | iex              # Windows (PowerShell)
omp update --check                                # ¿hay versión nueva?
```

- `omp.sh/install`: Una línea
- `install.ps1`: Windows nativo
- `omp update`: Actualizar

### Piezas opcionales

```text
omp setup python      # entorno de Python para eval
omp setup speech      # voz local
omp setup --check     # qué falta, sin instalar
```

- `omp setup python`: Python
- `--check`: Solo comprobar

### omp config desde la terminal

```text
omp --profile demo config list
omp --profile demo config get tools.approvalMode
omp --profile demo config set archive.enabled false
omp --profile demo config reset archive.enabled
```

- `config list`: Todas
- `tools.approvalMode`: Clave completa
- `config set`: Escribir

### Traerte conversaciones (solo diapositiva)

```text
omp --from-claude        # importa una sesión de Claude Code
omp --from-codex         # importa una sesión de Codex
/resume @claude · /resume @codex
```

- `--from-claude`: Claude Code
- `--from-codex`: Codex
- `/resume @claude`: Dentro de la TUI

## Fuentes

- Documentación de omp 18.5.1 (la documentación de omp (omp.sh)):
  - `porting-from-pi-mono.md`: último punto de sincronización `b21b42d` (22-03-2026), cambio de scopes
    `@mariozechner/*` y `@earendil-works/*` → `@oh-my-pi/*`, «We run on Bun», §8 (adaptadores `legacy-*` para no romper
    extensiones de Pi), §15 *Intentional Divergences* (`agent.db` frente a `auth.json`, multicuenta, `find` → `glob`,
    `jiti` → Bun, `pkg.omp` con respaldo `pkg.pi`, `StatusLineComponent`, LSP, MCP/Exa/SSH).
  - `cli-reference.md`: `--profile`, `--alias`, `--config`, `--from-claude`/`--from-codex` (excluyentes, requieren
    sesión persistente), `--tools`, `--approval-mode`, subcomandos `setup`, `config`, `update`, `login`.
  - `config-usage.md`: raíces `.omp`, `.claude`, `.codex`, `.gemini`; perfiles (`~/.omp/profiles/<name>/agent`,
    excepción de keybindings); «Named profiles ignore `PI_CODING_AGENT_DIR`»; `.pi` no está en el orden de
    descubrimiento; migración de `settings.json` a `config.yml` (con `.bak`).
  - `settings.md`: tabla de ámbitos (global, proyecto solo en el cwd, overlay, runtime), `startup.setupWizard` (`true`),
    `startup.changelogMode` (`summary`), `tools.approvalMode` (`yolo`), `enabledProviders` (por defecto `[]`),
    `archive.enabled` (`true`).
  - `context-files.md`: proveedores de descubrimiento; usuario de herramientas ajenas solo con `enabledProviders`;
    proyecto activo por defecto; `~/.omp/agent/AGENTS.md` tapa los demás ficheros de usuario.
  - `slash-command-internals.md`: proveedor `claude` (`.claude/commands/**/*.md` del proyecto con
    `commands.enableClaudeProject: true`; los de usuario, solo con opt-in).
  - `task-agent-discovery.md` (vía `oh-my-pi.md` §4.4): `.claude/agents` se ignora a propósito.
  - `session-switching-and-recent-listing.md` y `session-operations-export-share-fork-resume.md`: `/resume @claude` y
    `/resume @codex` convierten la sesión ajena en una sesión de omp nueva.
  - `environment-variables.md` (`OMP_PROFILE`, `PI_PROFILE`, `PI_CONFIG_DIR`, `PI_CODING_AGENT_DIR` solo para el perfil
    por defecto), `keybindings.md` y `tui.md` (consultados; sin datos nuevos para este vídeo), `models.md` y
    `providers.md` (roles y orden de credenciales, solo para la tabla).
- `omp --version` y `omp --help` (instalado: 18.6.1), `omp setup --help`, `omp config --help`, `omp update --help`.
  Comparación de la documentación embebida en 18.6.1 (`omp read omp://<fichero>`) con la copia 18.5.1: los ficheros de
  este vídeo son idénticos; las únicas diferencias son truncados de `omp read` en ficheros largos y una línea de
  `provider-compat-reference.md`.
- Vídeos anteriores: 01 (Pi y omp como dos filosofías; omp «lee la configuración de Claude Code y Codex»; yolo por
  defecto; GPT-5.6-Luna; hashline), 04 (cache warming), 05 y 08 (prometen los modos de aprobación de omp para el vídeo
  19; el repositorio como superficie de ataque; `/trust`), 06 (template `/review` en el directorio del agente de Pi),
  07 (`deferred` y `tool_search`), 08 (`permisos.ts`), 10 (cierra el bloque B y anuncia este vídeo: «un fork de Pi sobre
  Bun, con un núcleo en Rust y las baterías incluidas… qué hereda… qué añade, cómo se instala y cómo arrancarlo por
  primera vez con un perfil de demo»).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Del núcleo mínimo al taller completo**

Durante nueve vídeos hemos trabajado con Pi. Lo instalamos, lo abrimos por dentro, le cambiamos el modelo, lo metimos en un contenedor, lo personalizamos sin código, le conectamos servidores MCP, le escribimos extensiones y lo sacamos de la terminal para usarlo en scripts. Todo sobre la misma idea: un núcleo pequeño que entiendes entero y al que le añades lo que necesitas.

Hoy empieza el bloque de oh my pi. Recuerda el vídeo uno: allí lo presentamos como la filosofía contraria, la de las baterías incluidas. Subagentes, modo plan, memoria, servidor de lenguaje, depurador, navegador, estadísticas y una interfaz de git, todo de serie. No vamos a repetir esa lista. Este vídeo responde a otra pregunta, la que se hace alguien que ya sabe usar Pi: ¿qué me llevo, qué cambia de sitio y qué es nuevo?

El plan es este. Primero, qué es exactamente oh my pi y por qué corre sobre otro motor. Después, qué hereda de Pi y qué no. Luego lo instalamos y lo arrancamos por primera vez en un perfil aislado, sin enseñar ninguna cuenta. Recorremos los cuatro comandos que conviene conocer el primer día: barra changelog, barra hotkeys, barra tools y barra settings. Vemos qué recoge de Claude Code y de Codex. Y terminamos con una tabla, Pi frente a oh my pi, para que sepas cuándo usar cada uno.

Una nota sobre el modelo. En los vídeos de este bloque, oh my pi trabaja con DeepSeek V cuatro punto uno Flash, el mismo modelo barato que usamos en Pi desde el vídeo tres, con su clave en una variable de entorno. Hoy apenas lo vamos a usar: casi todo lo que veremos funciona sin gastar un solo token.

**2 · Un fork con otro motor**

Empecemos por la relación entre los dos. oh my pi no es una capa encima de Pi ni un paquete de extensiones. Es un fork: una copia del código de Pi que evoluciona por su cuenta. Su historial lo dice así. La primera versión con el nuevo nombre, del dos de enero de dos mil veintiséis, remite a las versiones anteriores de Pi, y el changelog conserva toda esa historia. Poco después, el binario dejó de llamarse pi y pasó a llamarse o eme pe.

Un fork no significa ruptura. oh my pi mantiene una guía para seguir trayendo cambios de Pi, con su último punto de sincronización completo en marzo, y desde entonces sigue portando piezas sueltas. Por ejemplo, el calentamiento de la caché de prompts que vimos en el vídeo cuatro llegó a oh my pi copiado de Pi. Lo publica Stencil Labs, con licencia MIT, y Mario Zechner, el autor de Pi, figura entre sus colaboradores.

La diferencia más visible está debajo. Pi es TypeScript sobre Node. oh my pi corre sobre Bun, otro runtime de JavaScript, y su guía de portado lo deja claro: aquí se usa Bun, y las APIs de Node solo se mantienen donde encajan mejor. Además, lleva un módulo nativo escrito en Rust. Ahí viven la búsqueda de texto, que usa el motor de ripgrep, la terminal y el shell, el pintado de imágenes en la terminal y otras piezas donde la velocidad importa.

¿Por qué te importa a ti, que no vas a tocar ese código? Por dos razones prácticas. La primera: se distribuye como un binario autónomo, que no necesita que tengas Node ni Bun instalados. La segunda: la herramienta de bash no usa tu shell, sino uno embebido. Casi siempre te dará igual, pero si un comando se comporta raro, recuerda que no es tu shell de siempre.

Y queda el rastro del origen en muchos sitios. Los paquetes se llaman pi algo, dentro del scope oh my pi, y muchas variables de entorno siguen empezando por PI underscore. Lo que aprendiste del bloque B te va a sonar constantemente.

**3 · Qué hereda y qué cambia de sitio**

Lo que se hereda tal cual es el núcleo que estudiamos en el vídeo tres. El bucle de turnos, con steering cuando escribes mientras trabaja y follow up para encolar. La sesión como árbol en un fichero JSONL, con sus ramas. Adjuntar ficheros con arroba. Los modos print, JSON y RPC, y el SDK con create agent session, del vídeo diez. Las skills que se cargan bajo demanda. Y las extensiones que escuchan eventos, incluido tool call, el que usamos en el vídeo ocho para construir nuestro modo de aprobación.

Pero muchas cosas cambian de sitio, y conviene saberlo antes de buscarlas donde no están. La configuración ya no es settings punto json dentro de punto pi, sino config punto yml, en YAML, dentro de punto o eme pe barra agent en tu carpeta personal. Las credenciales ya no van en auth punto json, sino en una base de datos SQLite, agent punto db, que admite varias cuentas por proveedor. Y la herramienta que en Pi se llamaba find, para buscar ficheros por patrón, aquí se llama glob.

Lo importante para quien viene de Pi: oh my pi no usa punto pi como su carpeta de configuración. Tus ajustes de Pi, tus prompt templates y tu directorio del agente no se trasladan solos. El template barra review que hicimos en el vídeo seis vive en el directorio del agente de Pi, así que oh my pi no lo verá. Y además oh my pi ya trae su propio barra review, que veremos en el vídeo dieciocho.

Las extensiones son otra historia. oh my pi mantiene adaptadores para cargar extensiones escritas para Pi: reescribe sus imports y acepta el manifiesto de los paquetes de Pi. Así que la extensión de permisos del vídeo ocho, en principio, puede funcionar aquí. Lo comprobaremos en el vídeo veinte, el de extender oh my pi, porque algunas piezas de la interfaz no se comportan igual.

Y una idea para no perderse. Cuando algo de Pi no está donde lo esperas, casi siempre es por uno de tres motivos: cambió de nombre, cambió de formato, o ahora viene integrado y ya no hace falta la extensión.

Lo que añade lo iremos desmontando en este bloque, una pieza por vídeo. La interfaz y las sesiones en el doce. El contexto y la memoria en el trece. Modelos, roles y razonamiento en el catorce. Planificar y dirigir en el quince. Subagentes en el dieciséis. El entorno de desarrollo integrado en el diecisiete. Git y calidad en el dieciocho. Aprobaciones y reglas en el diecinueve. Extenderlo en el veinte, y usarlo desde programas y en equipo en el veintiuno. Hoy solo necesitamos tenerlo instalado y saber movernos.

**4 · Instalar y arrancar en un perfil aislado**

Instalar oh my pi es una línea. En macOS y Linux, curl contra o eme pe punto ese hache barra install, con una tubería a ese hache. En Windows, el equivalente en PowerShell, y la web destaca que funciona en Windows de forma nativa, sin WSL. También hay fórmula de Homebrew y paquete de Bun. Para actualizar, o eme pe update, y con guion guion check solo comprueba si hay versión nueva.

En nuestro equipo ya está instalado, así que no ejecutamos el instalador delante de la cámara. Comprobamos la versión con o eme pe guion guion version: dieciocho punto seis punto uno, la última cuando grabamos. oh my pi publica versiones muy a menudo, así que es normal que veas un número más alto. Por eso en este curso actualizamos antes de cada vídeo y leemos el changelog.

Hay piezas opcionales que no vienen en la instalación básica, como el entorno de Python para la herramienta que ejecuta código, o los modelos locales de voz. Se instalan con o eme pe setup, seguido de python o de speech. Y con guion guion check, o eme pe setup solo te dice qué falta, sin instalar nada. Para este vídeo no necesitamos ninguna.

Antes de arrancarlo, una decisión que te recomiendo copiar: los perfiles. Con guion guion profile y un nombre, oh my pi usa un directorio propio dentro de punto o eme pe barra profiles, con sus propios ajustes, credenciales, sesiones y cachés. Es lo mismo que hacíamos en Pi con PI underscore CODING underscore AGENT underscore DIR, pero integrado. Nosotros grabamos con un perfil que se llama demo.

Y aquí hay un detalle que nos afecta de lleno. Nuestra terminal tiene exportada esa variable, apuntando al directorio de Pi del curso. El perfil por defecto de oh my pi también la respeta. Si arrancáramos sin perfil, oh my pi usaría el directorio de Pi, y en el primer arranque migraría su settings punto json a YAML y lo renombraría. Los perfiles con nombre ignoran esa variable. Por eso, en este bloque, todas nuestras órdenes llevan guion guion profile demo.

Antes del primer arranque preparamos el perfil sin modelo, con o eme pe config set. Desactivamos una pieza llamada archive, que deja al modelo consultar sesiones de otros proyectos, y la carga de skills y comandos personales de otras herramientas. Útil en tu día a día, pero en una grabación enseñaría cosas que no son de la tienda. Lo comprobamos: echo de la variable de Pi, que apunta a su directorio; o eme pe config path, que da la carpeta del perfil demo; y config get, que confirma el modo de aprobación, yolo, y archive desactivado.

Entramos en la tienda y lanzamos o eme pe guion guion profile demo. Como el perfil es nuevo, aparece el asistente de configuración, en cinco pasos. El primero es el de proveedores: una lista donde eliges con quién iniciar sesión, desde suscripciones como la de ChatGPT o Claude hasta OpenRouter o GitHub Copilot. Puedes conectar varios.

Esta pantalla, igual que barra login, enseña cuentas y correos en cuanto conectas algo, así que no la vas a ver rellena en este curso. Nosotros no iniciamos sesión: la clave de DeepSeek ya está en la variable de entorno DEEPSEEK underscore API underscore KEY, que oh my pi lee igual que Pi. Así que pulsamos escape para saltar el paso. Si conectas una cuenta, oh my pi abre el navegador, tú autorizas, y la credencial se guarda en la base de datos del perfil. Para volver a esta pantalla, el comando es barra setup, que también se llama barra providers.

**5 · Dentro por primera vez**

El segundo paso es elegir el modelo por defecto, entre los que tienes configurados. Escribimos flash para filtrar, aparecen los modelos de DeepSeek con su contexto y su precio por millón de tokens, y confirmamos deepseek flash. Los tres pasos siguientes son de apariencia: los símbolos que tu terminal pinta bien, la forma del editor, con una vista previa en directo y hasta un estilo Pi y otro Claude Code, y el tema. Dejamos los valores por defecto, oh my pi guarda la configuración, y ya estamos dentro.

La pantalla tiene tres zonas que te resultarán familiares: arriba la conversación, abajo el editor, y entre los dos la línea de estado. En ella ves el modelo, el nivel de thinking, la carpeta, el uso de contexto y el coste. Es el pie de Pi del vídeo dos, con más información.

Hacemos una primera petición de solo lectura: qué hace src barra envio punto js y cómo se ejecutan los tests, sin cambiar nada. oh my pi lee tres cosas a la vez, el fichero, la carpeta de tests y el package punto json, después lee el test del envío, y contesta: las constantes, la validación, el umbral de cuarenta euros y cómo se ejecutan las pruebas. Termina con no he modificado nada. Y fíjate en la esquina: oh my pi le ha puesto título a la sesión solo, explicar src envio punto js y ejecución de tests.

Una petición así cuesta muy poco, pero no es gratis. A partir de aquí, cada vez que algo llame al modelo te lo diremos. Lo que viene ahora, en cambio, no gasta nada.

**6 · Cuatro comandos para orientarte**

Con el agente en marcha, cuatro comandos para orientarte el primer día. Ninguno llama al modelo y ninguno enseña datos tuyos, así que puedes probarlos tranquilo en cualquier perfil.

El primero, barra changelog. Muestra las novedades de la versión. Con last y un número, solo las últimas entradas; con full, todas. Barra changelog last dos nos enseña la dieciocho punto seis punto cero y la dieciocho punto seis punto uno, de los días tres y cuatro de octubre: mejoras en la vista de roles de barra models, correcciones en la edición anclada y en barra by the way.

Al arrancar después de una actualización, oh my pi ya te enseña un resumen, y eso se controla con un ajuste, startup punto changelog mode. Merece la pena leerlo: en una herramienta que publica casi a diario, es la forma de enterarte de que algo ha cambiado.

El segundo, barra hotkeys, con todos los atajos de teclado en tablas. Muchos los conoces de Pi: enter para enviar, escape para interrumpir, control o para desplegar la salida de las herramientas. Otros son nuevos. Control p recorre los modelos por rol, alt p elige un modelo solo para un rato, y alt m asigna los roles. Mayúsculas tab cambia el nivel de thinking, y alt mayúsculas p activa el modo plan. Alt a, o control s, abre el hub de agentes, que veremos en el vídeo dieciséis. Y hasta hay voz: mantener el espacio pulsado para dictar.

Los atajos se cambian en keybindings punto yml. Y una curiosidad: es lo único que un perfil hereda del perfil por defecto, porque tu teclado no cambia de un perfil a otro.

El tercero, barra tools, una tabla con las herramientas que ve el agente y la descripción que recibe el modelo de cada una. Con nuestro modelo hay doce activas: read, bash, edit, ask, eval, glob, grep, task, wait, todo, web search y write. Y al final, tres con una dirección x d delante: ast edit, debug y lsp. Son herramientas descubribles: el modelo no carga su descripción completa en cada turno, solo sabe que existen, y lee su documentación cuando las necesita. Es la misma idea que el modo deferred y tool search del vídeo siete, con otra forma.

Fíjate también en lo largas que son esas descripciones: la de read explica cómo leer rangos de líneas, PDFs, bases de datos SQLite o archivos comprimidos. El recuento depende del modelo y de tu configuración, así que el tuyo puede no ser el nuestro. Pero compáralo con las cuatro herramientas de Pi y entenderás lo de las baterías incluidas. Cada herramienta tiene un coste en contexto, y lo mediremos en el vídeo trece.

El cuarto es barra settings, un panel con once pestañas: apariencia, modelo, interacción, contexto, memoria, ficheros, shell, herramientas, tareas, proveedores y plugins. Dentro de cada una, secciones a la izquierda y ajustes a la derecha, con una línea de ayuda abajo. Se cambia de pestaña con las flechas, tiene buscador, y casi todo se aplica en caliente.

Lo recorremos sin cambiar nada. En interacción, la sección de aprobaciones dice tool approval: yolo, y las políticas por herramienta, vacías. Recuerda el vídeo uno: oh my pi tampoco pide permiso por defecto. Tiene modos más prudentes, write y always ask, y los configuraremos en el vídeo diecinueve, como prometimos en los vídeos cinco y ocho. En la misma pestaña están el modo de steering y de follow up, la acción del doble escape, que es rebobinar, y las secciones de arranque y actualizaciones.

**7 · La configuración en capas**

Ahora, dónde se guarda lo que cambias. Las escrituras del panel van a la configuración global, la de tu perfil. Si quieres ajustes solo para un repositorio, los escribes a mano en punto o eme pe barra config punto yml, en la raíz del proyecto. Ojo: oh my pi solo lo busca en la carpeta desde la que arrancas, no en las carpetas superiores. Y para una sola ejecución, guion guion config con un fichero aparte, que no se guarda nunca.

El orden de prioridad, de menor a mayor: los valores de fábrica, la configuración global, la del proyecto, los ficheros de guion guion config, las opciones de la línea de comandos, y por encima de todo, las variables de entorno propias de cada ajuste. Los objetos se fusionan, pero las listas se reemplazan enteras. Cuando un ajuste no hace caso, casi siempre es por esto.

Desde fuera de la sesión tienes lo mismo con o eme pe config: list, get, set y reset. La clave se escribe completa, con puntos, como en tools punto approval mode. Es la forma más cómoda de preparar un perfil y de comprobar qué valor está ganando. Y si una clave no existe, o eme pe config list te enseña todas, agrupadas por pestaña.

Un consejo de uso. Lo que es tuyo, como el tema o tus atajos, va en la configuración global. Lo que es del proyecto, como el modo de aprobación que quiere tu equipo o los modelos que se pueden usar, va en el config punto yml del repositorio, y se versiona con el código. Así cualquiera que abra ese repositorio con oh my pi trabaja con las mismas reglas.

Antes de seguir, comprobamos que el perfil ha hecho su trabajo. Salimos con barra exit, o con control d. Listamos la carpeta del perfil demo: ahí están su config punto yml, su base de datos y sus sesiones, que no abrimos. Y listamos el directorio de Pi del curso: sigue exactamente igual que antes. Para volver, o eme pe guion guion profile demo guion c retoma la última sesión de esta carpeta, igual que en Pi.

**8 · Si vienes de Claude Code o de Codex**

En el vídeo uno dijimos que oh my pi sabe leer la configuración de Claude Code y de Codex. Es verdad, pero tiene un matiz importante, y conviene entenderlo bien.

oh my pi busca configuración en varias raíces: la suya, punto o eme pe, y también punto claude, punto codex y punto gemini, además de las reglas de Cursor, Windsurf, Cline o Copilot. A nivel de proyecto, todo eso se lee por defecto. Un CLAUDE punto md en tu repositorio, un AGENTS punto md, las skills y los comandos de punto claude o los servidores MCP del proyecto entran sin configurar nada.

A nivel de usuario es al revés. Lo que tienes en tu carpeta personal para otras herramientas, como el CLAUDE punto md global de Claude Code o el AGENTS punto md de Codex, no se carga hasta que lo activas con el ajuste enabled providers. Es una decisión sensata: tus instrucciones personales para otra herramienta no tienen por qué valer aquí. Y en nuestra grabación tiene una ventaja: lo que haya en nuestra configuración personal de Claude Code no aparece.

Lo vemos con un ejemplo. En la tienda hemos dejado un comando en el formato de Claude Code: un fichero markdown dentro de punto claude barra commands, llamado resumen envio, con una descripción y una petición. Escribimos barra r e s en oh my pi, y ahí está, junto a los comandos propios. Lo ejecutamos, esta vez sí con modelo.

El comando se expande a su texto, lee src envio punto js y resume en tres viñetas, y el modelo nos devuelve tres viñetas sobre las reglas de envío, sin editar nada. Como ya había leído el fichero en esta sesión, ni siquiera lo vuelve a abrir. No hemos tocado ni un ajuste.

También puedes traerte conversaciones. Con guion guion from claude o guion guion from codex, oh my pi importa una sesión de esas herramientas y la convierte en una sesión suya, nueva. Dentro de la interfaz, lo mismo con barra resume arroba claude o arroba codex. Esto solo lo ves en diapositiva, porque esas listas enseñan tus sesiones reales, y la carpeta de Claude Code no depende del perfil.

Una excepción a propósito: los subagentes definidos en punto claude barra agents se ignoran, porque su formato es distinto. Los de oh my pi viven en punto o eme pe barra agents, y los veremos en el vídeo dieciséis.

Y el apunte honesto, que enlaza con el vídeo cinco. En Pi, la configuración del proyecto solo se cargaba si confiabas en él, con barra trust. oh my pi no tiene barra trust: lo que trae el repositorio, sus reglas, sus comandos y sus servidores MCP, se carga al arrancar. Súmale que el modo por defecto es yolo y que las extensiones no van en sandbox. Un repositorio que no conoces es texto e instrucciones de otra persona. Revisa sus carpetas punto o eme pe y punto claude antes de abrirlo, o hazlo dentro de un contenedor.

**9 · Pi frente a oh my pi, y cierre**

Con todo esto, ya podemos poner los dos agentes lado a lado. Tienes la tabla en pantalla; te cuento cómo leerla, fila a fila.

Origen. Pi es el proyecto original. oh my pi es un fork de principios de dos mil veintiséis que sigue trayendo cambios de Pi. Motor. Pi es TypeScript sobre Node veintidós punto diecinueve o superior. oh my pi corre sobre Bun, con partes nativas en Rust, y se distribuye como binario autónomo. Configuración. Pi usa JSON en punto pi. oh my pi usa YAML en punto o eme pe, con perfiles integrados. Credenciales: un fichero JSON en Pi, una base de datos con varias cuentas en oh my pi.

Herramientas. Pi arranca con cuatro activas: leer, escribir, editar y bash. oh my pi trae unas treinta; con nuestro modelo, doce activas y tres descubribles, con lectura de casi cualquier formato, servidor de lenguaje, depurador, subagentes y edición anclada por hash. Comandos. Pi tiene unos veinticinco integrados; oh my pi, ochenta y cinco. Subagentes y modo plan: en Pi, como extensiones de ejemplo; en oh my pi, de serie, junto con los objetivos con presupuesto.

Seguridad. Pi no tiene aprobaciones, pero sí confianza de proyecto. oh my pi tiene aprobaciones con tres modos, aunque el de fábrica, yolo, no pregunta nada, y no tiene confianza de proyecto. Ninguno de los dos te protege si no tomas tú las decisiones. Otros agentes. Pi lee AGENTS punto md y CLAUDE punto md. oh my pi lee además la configuración de proyecto de media docena de herramientas, la de usuario si se lo pides, e importa sesiones de Claude Code y de Codex.

Y la última fila, la que más importa para el resto del curso: lo que se mantiene. El bucle, el árbol de sesión, los modos print, JSON y RPC, el SDK, las skills y las extensiones por eventos. Todo lo que aprendiste en el bloque B sigue valiendo. Lo que cambia es cuánto viene ya montado.

¿Cuál elegir? Pi, cuando quieres entender y controlar cada pieza, cuando prefieres un contexto pequeño, o cuando vas a construir tu propio harness encima. oh my pi, cuando quieres un taller completo desde el primer día y estás dispuesto a aprender su superficie, que es grande. Y nada te impide tener los dos: cada uno guarda sus cosas en su sitio, siempre que no los cruces con la misma variable de entorno, como hemos visto.

Repasemos. oh my pi es un fork de Pi sobre Bun, con partes nativas en Rust. Hereda el bucle, el árbol de sesión, los modos y el SDK. Cambia de sitio la configuración, que pasa a YAML en punto o eme pe, y las credenciales, que pasan a una base de datos. Se instala con una línea y se usa mejor con perfiles. Barra changelog te cuenta qué ha cambiado, barra hotkeys te enseña el teclado, barra tools lo que ve el agente, y barra settings lo que puedes ajustar. Y lee la configuración de proyecto de Claude Code y de Codex sin pedirte nada.

La práctica: crea tu propio perfil de pruebas con guion guion profile, pasa el asistente, y dedica diez minutos a barra settings sin cambiar nada, solo leyendo las pestañas. Después abre con ese perfil un repositorio tuyo que ya use Claude Code o Codex, y apunta qué ha recogido oh my pi por su cuenta: contexto, comandos, skills, servidores. Compara esa lista con lo que esperabas.

En el próximo vídeo entramos en la interfaz y las sesiones: atajos, el selector de comandos, y la diferencia entre rebobinar, bifurcar y navegar el árbol, con barra branch, barra fork y barra tree. Nos vemos allí.

</details>

