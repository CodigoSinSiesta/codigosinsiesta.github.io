---
title: "Vídeo 02 · Instalar Pi y primera tarea"
description: "Instalación, inicio de sesión y elección de modelo. Primera tarea real: referenciar ficheros, ejecutar comandos, corregir el rumbo a mitad de trabajo y leer el pie (contexto, caché y coste)."
ruta: "pi-oh-my-pi"
orden: 2
duracion: "23 min"
video: "02-instalar-pi-primera-tarea.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/02-instalar-pi-primera-tarea.es.vtt"
---

Instalación, inicio de sesión y elección de modelo. Primera tarea real: referenciar ficheros, ejecutar comandos, corregir el rumbo a mitad de trabajo y leer el pie (contexto, caché y coste).

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Antes de instalar

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Primer vídeo de la etapa «Pi a fondo»:** dejamos la teoría y empezamos por Pi, el agente más pequeño y el más fácil de seguir. Hoy: instalar y comprobar, elegir modelo, una tarea en un repositorio de juguete, dirigir al agente mientras trabaja y retomar la sesión.
- **Antes de empezar necesitas tres cosas:**
  1. Una terminal: la tuya en macOS o Linux; en Windows, nativa o dentro de WSL.
  2. Node.js 22.19 o superior (los instaladores oficiales lo instalan si falta).
  3. Acceso a un modelo: una suscripción que Pi soporta (ChatGPT, Claude, GitHub Copilot) con `/login`; una clave de API (OpenRouter, Anthropic, OpenAI, Google…); o un modelo local con Ollama o llama.cpp, sin cuenta.
- **El modelo de las demos:** en los vídeos 01 y 02, Qwen 3.8 27B gratuito vía OpenRouter. Un modelo modesto deja ver mejor lo que aporta el harness, y lo gratuito se satura (veremos un 429). Desde el vídeo 03 usamos DeepSeek Flash, de pago y muy barato.
- **Consejo:** experimenta con un directorio de agente aparte y un repositorio de juguete. Así tus pruebas no se mezclan con tu configuración, tus claves ni tus sesiones de trabajo.

> **Nota:** antes de usar con Pi la suscripción de un proveedor (por ejemplo, la de Claude), revisa sus términos de uso: algunos limitan el uso de la suscripción en harnesses de terceros. Una clave de API es la vía más segura.

### 2 · Instalar y comprobar

<p><button type="button" class="ir-a" data-t="143">▶ Ir a 2:23</button></p>

- **Cuatro formas de instalar:** el instalador oficial (recomendado en macOS, Linux y Windows con PowerShell; fija dependencias y se actualiza con `pi update`), npm (con `--ignore-scripts`; menos reproducible), Nix (se actualiza con `nix profile upgrade`) y Android vía Termux, con su propia guía.
- **Comprueba:** si `pi --version` responde, está instalado. `pi --help` resume la filosofía (cuatro herramientas: read, bash, edit, write) y enseña los subcomandos.
- **Tres opciones de arranque que usarás:** `--model` elige el modelo; `-p` / `--print` hace una petición y sale, sin interfaz (vídeo 10); `-c` / `--continue` retoma la última sesión de la carpeta.
- **Dónde guarda Pi sus cosas:** en el directorio del agente, `~/.pi/agent` (ajustes, atajos, credenciales, sesiones y recursos). Lo cambias con `PI_CODING_AGENT_DIR`. Desinstalar Pi no lo borra.
- **Configuración del proyecto:** un repo puede traer su carpeta `.pi/` con ajustes, extensiones o prompts, pero solo se carga si confías en el proyecto (vídeo 05).
- *En terminal:* Instalador oficial · Con npm · Con Nix · ~/.pi/agent · Un directorio de agente aparte (más abajo, en «Código y comandos»)

### 3 · Primer arranque

<p><button type="button" class="ir-a" data-t="326">▶ Ir a 5:26</button></p>

- **Arranca en la raíz del repo:** Pi usa esa carpeta para descubrir ficheros, instrucciones y configuración, y agrupa las sesiones por carpeta.
- **La pantalla:** historial arriba, editor abajo y, debajo, el pie (carpeta, rama de git, contexto y modelo). `Esc` interrumpe; `Ctrl+C` / `Ctrl+D` limpian o salen; `/` abre comandos; `!` ejecuta bash. `Ctrl+O` despliega lo plegado: aquí, la ayuda completa y los recursos cargados (AGENTS.md, skills, extensiones); más tarde, las salidas de herramientas.
- **Conectar un proveedor:** `/login`, eliges proveedor y, según el caso, se abre el navegador o te pide una clave. Se guarda en `auth.json`, en el directorio del agente. Alternativa en servidores y CI: una variable de entorno por proveedor.
- **Ojo con la prioridad de credenciales:** `--api-key` gana, después `auth.json`, después `models.json` y por último el entorno. La variable solo se usa si no hay clave en `auth.json` ni en `models.json`; un `auth.json` olvidado la tapa.
- **Elegir modelo:** `/model` (o `Ctrl+L`) filtra y elige para esta sesión; `Ctrl+S` lo guarda por defecto. `Ctrl+P` rota entre favoritos. El pie muestra también el nivel de razonamiento (`medium`), que cambias con `/thinking` o `Shift+Tab`.
- **Si vienes de Claude Code:** allí `Shift+Tab` cambia el modo de permisos; en Pi, el nivel de razonamiento.

### 4 · La primera tarea

<p><button type="button" class="ir-a" data-t="548">▶ Ir a 9:08</button></p>

- **`@` señala ficheros:** escribes `@carr`, Pi sugiere y `Tab` completa. Le dices al agente qué importa sin que lo busque. Funciona con imágenes si el modelo las admite, y desde la CLI: `pi @fichero "pregunta"`.
- **Un turno real:** primero el razonamiento visible (a menudo en inglés; la respuesta llega en tu idioma), luego `read` y después `bash` para explorar las pruebas y el `package.json`. El modelo relee el fichero aunque se lo diste con `@`: es habitual y barato.
- **Lo plegado se despliega:** Pi pliega las salidas largas. `Ctrl+O` despliega las de herramientas y `Ctrl+T` los bloques de razonamiento. Si quieres saber qué ha visto el modelo, despliega.
- *En la demo:* el modelo detecta un posible problema de redondeo, lo menciona y no se pierde en él. Es criterio, no un fallo.
- **En clave de harness:** instrucciones (prompt de sistema + tu petición con `@`), herramientas (dos lecturas y un bash), entorno (tu máquina), estado (la sesión). Feedback no hacía falta: solo pedías una explicación.

### 5 · Tú también tienes terminal

<p><button type="button" class="ir-a" data-t="743">▶ Ir a 12:23</button></p>

- **`!!comando`:** se ejecuta y ves la salida, pero el modelo no (borde gris). Para comprobaciones rápidas que no deben gastar contexto.
- **`!comando`:** la salida se añade a la conversación y viaja con tu siguiente mensaje (borde amarillo).
- **Ninguno llama al modelo:** los contadores del pie no cambian. Buen hábito: `!!` por defecto y `!` solo cuando quieras que el modelo vea el resultado.
- **Caso típico:** `!npm test`, ves el error y escribes «arregla esto». El modelo ya tiene la salida sin que la copies.
- **Si vienes de Claude Code:** allí `!` también ejecuta bash y la salida entra en la conversación.

### 6 · Cambiar el rumbo

<p><button type="button" class="ir-a" data-t="847">▶ Ir a 14:07</button></p>

- **Pide el feedback en la tarea:** «escribe sus pruebas y ejecuta npm test». No basta con escribir el código; tiene que demostrar que funciona.
- **Tres gestos para dirigir:**

| Gesto | Qué hace | Cuándo entra |
|---|---|---|
| `Enter` mientras trabaja | Steering: corrige el rumbo | Al acabar el turno en curso |
| `Alt+Enter` (`Ctrl+Q` en Windows y WSL) | Follow-up: encola trabajo | Cuando termina todo lo pendiente |
| `Esc` | Para en el acto | Ya; los mensajes en cola vuelven al editor |

- *En la demo:* el primer steering llegó tarde: en seis segundos el modelo ya había terminado, y la corrección (umbral de 50 a 40 €) entró como mensaje normal. El resultado fue bueno igualmente.
- *En la demo:* con un 429 del proveedor gratuito, Pi reintentó solo y se rindió tras tres intentos. Los reintentos son política del harness, no del modelo, y se configuran en los ajustes `retry.*`.
- **Mensajes en cola:** `Alt+↑` los devuelve al editor para editarlos o borrarlos. Por defecto se entregan de uno en uno; en modo «todos», juntos.

### 7 · Leer el pie y retomar la sesión

<p><button type="button" class="ir-a" data-t="1115">▶ Ir a 18:35</button></p>

- **El pie, pieza a pieza** (detalle en «Código y comandos»): tokens de entrada y salida, lecturas de caché, acierto de caché, uso de contexto y compactación automática.
- **Caché:** el 95 % de la última petición ya estaba cacheado: más barato y más rápido. Cambiar el prompt de sistema o las herramientas puede invalidar la caché.
- **Coste:** con un modelo de pago, el pie suma lo gastado. Con el gratuito no aparece, porque es cero.
- **`/session`:** el detalle de la sesión (en la demo, 54 mensajes y 84 000 tokens, el 88 % servido desde caché). Es el total de la sesión; el `CH` del pie mide solo la última petición, por eso no coinciden.
- **Retomar:** la sesión es un fichero JSONL donde cada línea es una entrada con `id` y `parentId` (forman un árbol, vídeo 03). `pi -c` abre la última de la carpeta; `pi -r` o `/resume` te deja elegir. Como `claude -c` y `claude --resume` en Claude Code.
- **Práctica:** crea un repo pequeño con una función y sus pruebas, arranca Pi con un directorio de agente aparte y pide una mejora con verificación. Prueba un steering y un follow-up, sal, vuelve con `pi -c` y mira `/session`.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Instalador oficial

```text
curl -fsSL https://pi.dev/install.sh | sh
# Windows (PowerShell)
powershell -c "irm https://pi.dev/install.ps1 | iex"
# para actualizar más adelante
pi update
```

- `install.sh`: macOS y Linux. `install.ps1`: Windows.

### Con npm

```text
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

- `--ignore-scripts`: ninguna dependencia ejecuta código durante la instalación.
- Por npm, las dependencias transitivas no van fijadas: el instalador oficial es más reproducible.

### Con Nix

```text
nix profile add github:earendil-works/pi/stable
nix profile upgrade pi
nix run github:earendil-works/pi/stable
```

- `nix profile upgrade`: con Nix se actualiza así, no con `pi update`.
- `nix run`: lo ejecuta sin instalarlo.

### ~/.pi/agent · el directorio del agente

```text
ls ~/.pi/agent
settings.json      keybindings.json
auth.json          models.json
sessions/
extensions/  skills/  prompts/  themes/
```

- `auth.json`: las credenciales que guarda `/login`. Privado; nunca va a un repositorio.
- `keybindings.json`: tus atajos de teclado.
- `models.json`: proveedores y modelos propios, como uno local (vídeo 04).
- `sessions/`: una carpeta por proyecto con sus ficheros JSONL.
- `extensions/`, `skills/`, `prompts/`, `themes/`: tus recursos globales.

### Un directorio de agente aparte

```text
export PI_CODING_AGENT_DIR=~/pruebas-pi/agent
pi        # la primera vez, /login
pi        # desde aquí, como recién instalado
```

- `PI_CODING_AGENT_DIR`: Pi usa ese directorio en lugar de `~/.pi/agent`. Para probar sin tocar tu configuración de trabajo.

### Credenciales por variable de entorno

```text
export OPENROUTER_API_KEY=…
export ANTHROPIC_API_KEY=…
# prioridad: --api-key → auth.json → models.json → entorno
```

- Una variable por proveedor. Es la última en la prioridad: si hay clave en `auth.json` o en `models.json`, la variable se ignora.

### @ · señalar ficheros

```text
pi @src/carrito.js "¿Qué hace este fichero?"
# en la TUI: @carr → Tab → @src/carrito.js
```

### La tarea, con feedback incluido

```text
Añade src/envio.js con una función gastosEnvio(subtotal):
4,95 € de envío, gratis a partir de 50 €.
Escribe sus pruebas en test/envio.test.js y ejecuta npm test.
```

- `ejecuta npm test`: el feedback va en el encargo; el agente tiene que demostrar que funciona.

### Steering de verdad, a mitad de turno

```text
Revisa todos los ficheros del repositorio y escribe un informe largo…
Steering: Mejor: céntrate solo en src/envio.js y resúmelo en tres viñetas.
↳ Option+Up to edit all queued messages
── Working ──
```

- `Steering:`: la corrección queda en espera y el modelo la lee al acabar el turno.

### El pie de Pi

```text
~/tienda (master)
↑9.1k ↓3.5k R64k CH95.4% 2.6%/262k (auto)          qwen/qwen3.8-27b:free • medium
```

| Pieza | Significado |
|---|---|
| `↑9.1k` | Tokens de entrada enviados en la sesión, sin contar la caché |
| `↓3.5k` | Tokens generados por el modelo |
| `R64k` | Tokens leídos de la caché del proveedor (si informa de escrituras, aparece también `W`) |
| `CH95.4%` | Acierto de caché en la última petición |
| `2.6%/262k` | Uso de la ventana de contexto: amarillo por encima del 70 %, rojo por encima del 90 % |
| `(auto)` | Compactación automática activada |
| `medium` | Nivel de razonamiento |

### Retomar la sesión

```text
/quit
clear; pi -c
```

- `pi -c`: abre la última sesión de esta carpeta. Para elegir entre varias, `pi -r`.

## Fuentes

- Documentación oficial de Pi: [quickstart.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/quickstart.md) (instalación y primer arranque), [usage.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/usage.md) (uso de la TUI, `@`, `!` y sesiones).
- [keybindings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md): todos los atajos de teclado.
- [providers.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md): proveedores, `/login` y variables de entorno.
- Grabado con Pi 1.0.1.
- Vídeos relacionados del curso: 03 (la sesión como árbol), 04 (modelos y proveedores), 05 (confianza de proyecto) y 10 (modo print).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Antes de instalar**

En el vídeo anterior vimos qué es un harness y por qué el mismo modelo puede rendir muy distinto según lo que lo rodea. A partir de aquí dejamos la teoría y nos sentamos delante de uno concreto. Empezamos por Pi, porque es el más pequeño y eso lo hace perfecto para entender qué está pasando en cada momento.

El plan de este vídeo es sencillo. Instalamos Pi, comprobamos que funciona, elegimos un modelo, le pedimos una primera tarea en un repositorio de juguete y aprendemos a dirigirlo mientras trabaja. Al final sabrás leer todo lo que aparece en pantalla y retomar una sesión donde la dejaste.

Para seguirlo necesitas tres cosas. La primera, una terminal: en macOS o Linux vale la que uses a diario, y en Windows puedes trabajar en nativo o dentro de WSL. La segunda, Node punto js en la versión veintidós punto diecinueve o superior, aunque los instaladores oficiales lo instalan por ti si falta. Y la tercera, acceso a un modelo.

Ese acceso puede ser de tres tipos. Una suscripción que ya pagas, como la de ChatGPT, Claude o GitHub Copilot, a la que Pi se conecta con un inicio de sesión. Una clave de API de un proveedor, como OpenRouter, Anthropic, OpenAI o Google. O un modelo local, con Ollama o llama punto cpp, que no necesita cuenta. En este curso usaremos casi siempre un modelo gratuito de OpenRouter, para que puedas repetir las demos sin gastar nada.

El modelo de las demos de Pi es Qwen tres punto ocho de veintisiete mil millones de parámetros, en su versión gratuita. No es el más potente, y eso es parte de la gracia: un modelo modesto deja ver mejor lo que aporta el harness. Lo malo de lo gratuito es que se comparte con mucha gente, y más adelante veremos qué pasa cuando el proveedor se satura.

Una última recomendación antes de empezar. Para grabar este curso usamos un directorio de configuración aparte, de usar y tirar, y un repositorio de juguete. Así no aparecen en pantalla nuestras claves, nuestras sesiones ni nuestras skills personales. Te aconsejo lo mismo cuando experimentes: separa tus pruebas de tu configuración de trabajo.

**2 · Instalar y comprobar**

Pi se puede instalar de cuatro formas. La recomendada en macOS y Linux es el instalador oficial: una línea con curl que descarga un script de pi punto dev y lo ejecuta. En Windows hay una línea equivalente para PowerShell. El instalador fija todas las dependencias, y después Pi se actualiza solo con pi update.

La segunda forma es npm: npm install, guion g, el paquete arroba earendil guion works barra pi guion coding guion agent. La documentación recomienda añadir la opción ignore scripts, para que ninguna dependencia ejecute código durante la instalación. Hay un matiz importante: por npm ya no se fijan las dependencias transitivas, así que el instalador oficial es más reproducible.

La tercera forma es Nix: nix profile add, y el repositorio de Earendil en su rama estable. Con Nix se actualiza con nix profile upgrade, no con pi update, y puedes fijar una versión concreta o ejecutarlo sin instalar con nix run. Y la cuarta es Android, a través de Termux, que tiene su propia guía.

En nuestro equipo Pi ya estaba instalado por npm, así que no vamos a ejecutar el instalador delante de la cámara. Lo que sí hacemos siempre después de instalar es comprobarlo. Pi guion guion version responde con su número de versión. Si lo ves, la instalación está bien.

El segundo comando que merece la pena ejecutar es pi guion guion help. La primera línea ya resume la filosofía: un asistente de programación con cuatro herramientas, read, bash, edit y write. Debajo están los subcomandos, para instalar extensiones, actualizar, gestionar credenciales o servidores MCP, y después las opciones de arranque.

Fíjate en tres opciones que vamos a usar hoy. Guion guion model elige el modelo al arrancar. Guion p, o guion guion print, ejecuta una sola petición y sale, sin interfaz: lo usaremos en el vídeo diez para integrar Pi en scripts. Y guion c, o guion guion continue, retoma la última sesión de la carpeta. Volveremos a ella al final del vídeo.

Antes de arrancar, conviene saber dónde guarda Pi sus cosas. Todo vive en el directorio del agente, que por defecto es la carpeta punto pi barra agent dentro de tu usuario. Ahí están tus ajustes, tus atajos, tus credenciales en auth punto json, tus sesiones y tus recursos: extensiones, skills, plantillas de prompt y temas.

Ese directorio se puede cambiar con la variable de entorno PI underscore CODING underscore AGENT underscore DIR. Es justo lo que hemos hecho para grabar: apuntamos a una carpeta temporal, iniciamos sesión en ella una vez, fuera de cámara, y desde entonces Pi arranca como recién instalado. Si algún día quieres probar algo sin tocar tu configuración, este es el truco.

Cada proyecto puede tener además su propia carpeta punto pi, con ajustes, extensiones o prompts específicos. Pero esa carpeta solo se carga después de que confíes en el proyecto. Es una medida de prudencia: un repositorio que acabas de clonar no debería poder cambiar el comportamiento de tu agente sin que lo sepas. Y un detalle práctico: desinstalar Pi no borra el directorio del agente. Si quieres empezar de cero, bórralo tú.

**3 · Primer arranque**

Entramos en la carpeta del proyecto y escribimos pi, sin más. La carpeta donde arrancas importa: Pi la usa para descubrir ficheros, instrucciones y configuración, y agrupa las sesiones por carpeta. Arrancar en la raíz del repositorio es casi siempre lo correcto.

La pantalla tiene tres zonas. Arriba, el historial de la conversación, que de momento solo muestra la cabecera. Abajo del todo, el editor donde escribes. Y debajo del editor, el pie, con la carpeta, la rama de git, el uso de contexto y el modelo. La cabecera recuerda los atajos básicos: Escape interrumpe, control c o control d limpian o salen, la barra abre los comandos y la exclamación ejecuta bash.

La cabecera también dice que control o muestra la ayuda completa y los recursos cargados. Es el primer sitio donde mirar si sospechas que Pi ha leído algo que no esperabas: ficheros AGENTS punto md, skills, extensiones o plantillas. En nuestra instalación limpia no hay nada de eso. En la tuya, dentro de unas semanas, probablemente habrá bastante.

Si el proyecto tuviera su propia carpeta punto pi, en este momento aparecería el aviso de confianza, preguntando si quieres cargar su configuración. Nuestro repositorio de juguete no tiene, así que no sale. Lo veremos en detalle en el vídeo cinco, dedicado a la seguridad, junto con una advertencia: confiar en un proyecto no es una frontera de seguridad, solo una decisión sobre qué configuración cargar.

El siguiente paso, en una instalación nueva, es conectar un proveedor con barra login. Pi te enseña la lista de proveedores, eliges uno, y según el caso abre el navegador para un inicio de sesión o te pide una clave de API. Lo que obtiene se guarda en auth punto json. Este paso no lo enseñamos en pantalla, porque muestra cuentas y claves, pero no tiene más misterio.

Hay una alternativa a barra login que es muy cómoda en servidores y en integración continua: las variables de entorno. Cada proveedor tiene la suya, como OPENROUTER underscore API underscore KEY o ANTHROPIC underscore API underscore KEY. Si la variable existe, Pi la usa sin preguntar. El orden de prioridad es: primero la opción de línea de comandos, después auth punto json, después la configuración de modelos y por último el entorno.

Con el proveedor listo, toca elegir modelo. Al escribir la barra se abre el menú de comandos, que en nuestra instalación tiene veintiséis entradas: ajustes, modelo, árbol de sesión, nivel de razonamiento, rotación de modelos y muchos más. Cada uno lleva una descripción breve. Si alguna vez no recuerdas un comando, este menú es la referencia exacta para tu instalación.

Barra model abre el selector, y lo primero que avisa es que solo muestra modelos de proveedores configurados. Escribimos qwen tres punto ocho para filtrar, y aparece nuestro modelo, el de veintisiete mil millones gratuito, marcado como predeterminado. Enter lo selecciona solo para esta sesión. Control s, además, lo guarda como modelo por defecto para las siguientes.

En el pie, a la derecha, aparece ahora el modelo seguido de la palabra medium. Es el nivel de razonamiento. Pi admite varios niveles, desde apagado hasta máximo, según lo que soporte cada modelo, y se cambian con barra thinking o rotando con mayúsculas tabulador. El borde del editor también cambia de color según el nivel. Más razonamiento suele dar mejores respuestas en tareas difíciles, a cambio de más tiempo y más tokens.

Y dos atajos más que te ahorrarán tiempo: control p rota entre tus modelos favoritos sin abrir el selector, y control l abre directamente el selector. Los detalles, con modelos locales, proveedores propios y la configuración de la rotación, quedan para el vídeo cuatro.

**4 · La primera tarea**

Ya podemos trabajar. La primera petición es deliberadamente modesta: que nos explique un fichero y cómo se prueba. Y en lugar de copiar el contenido en el mensaje, lo señalamos con una arroba. Al escribir arroba carr, Pi busca ficheros que coincidan y nos ofrece dos: el código del carrito y su prueba. El tabulador completa la ruta.

La arroba es la forma más directa de darle contexto al agente. Le dice exactamente qué fichero importa, sin que tenga que buscarlo. Funciona con cualquier fichero del proyecto, también con imágenes si el modelo las admite, y se puede usar desde la línea de comandos: pi, arroba fichero, y la pregunta entre comillas.

Pulsamos Enter y el pie pasa a decir Working. Lo que sigue es un turno real, con todas las piezas del vídeo anterior. Lo primero que aparece, en gris y en cursiva, es el razonamiento visible del modelo. Dice, en inglés, que el usuario se refiere a un fichero con arroba y que va a leerlo. Muchos modelos razonan en inglés aunque les hables en español; la respuesta final sí llega en tu idioma.

Después vemos la primera herramienta: read sobre src barra carrito punto js, de la línea uno a la doscientos. El bloque de fondo amarillento indica una llamada a herramienta con su resultado. Curiosamente, aunque ya le habíamos dado el fichero con la arroba, el modelo decide leerlo con su herramienta. Es habitual, y no pasa nada: la lectura es barata.

La segunda herramienta es más interesante. El modelo quiere saber si hay pruebas, y en vez de preguntar lanza un comando de bash: lista la carpeta, busca ficheros de prueba que mencionen el carrito y muestra el package punto json. Ve que el script de pruebas es node guion guion test, y que existe un fichero de pruebas. Fíjate en el detalle de la línea: cuatro líneas anteriores ocultas, y control o para desplegarlas.

Pi pliega por defecto las salidas largas de las herramientas para que la conversación se pueda leer. Control o las despliega todas, y control t hace lo mismo con los bloques de razonamiento. Si alguna vez quieres saber exactamente qué ha visto el modelo, despliega. Lo que sale en pantalla es, literalmente, lo que entra en su contexto.

La tercera llamada lee el fichero de pruebas. Y entonces el modelo razona algo que merece la pena comentar: que el cupón se aplica línea a línea en vez de sobre el subtotal, que matemáticamente es equivalente, y que no vale la pena profundizar. Es un buen ejemplo de criterio: detecta un posible problema de redondeo, lo menciona y no se pierde en él.

La respuesta final llega en español y es correcta. Explica las dos funciones, subtotal y total con cupón, dice que las pruebas se ejecutan con npm test, enumera los tres casos que cubren y propone una forma de probarlo a mano con node. Y termina con una advertencia: con números de coma flotante, aplicar el descuento por líneas puede diferir en un céntimo de aplicarlo al total.

Repasemos lo que ha pasado en clave de harness. Las instrucciones: el prompt de sistema de Pi más nuestra petición con la arroba. Las herramientas: dos lecturas y un comando de bash. El entorno: nuestra máquina, en la carpeta del repositorio. El estado: todo queda en la sesión. Y el feedback: aquí no hacía falta, porque solo pedíamos una explicación. En la siguiente tarea sí lo habrá.

**5 · Tú también tienes terminal**

No todo lo tiene que hacer el modelo. A veces quieres ejecutar un comando tú mismo sin salir de Pi, y para eso está la exclamación. Pi distingue dos formas, y la diferencia es más importante de lo que parece.

Con dos exclamaciones, el comando se ejecuta y ves la salida, pero el modelo no se entera. Escribimos exclamación exclamación npm test, y aparecen las tres pruebas pasando. Ese bloque tiene un borde gris: es solo para ti. Es perfecto para comprobaciones rápidas que no quieres que gasten contexto: mirar un fichero, ver el estado de git o lanzar las pruebas.

Con una sola exclamación, el comando se ejecuta y su salida se añade a la conversación, para que el modelo la tenga en cuenta en su próxima respuesta. Escribimos exclamación git log guion guion oneline, y vemos el único commit del repositorio, tienda de juguete. Fíjate en que este bloque tiene el borde amarillo. Esa salida viajará con el siguiente mensaje.

Si miras el pie, verás que los contadores no han cambiado al ejecutar estos comandos. Ninguno de los dos llama al modelo. La diferencia es qué pasa con la salida: con una exclamación se queda en la conversación y entrará en la siguiente petición; con dos, no. Un buen hábito es usar dos por defecto y una solo cuando quieras que el modelo vea el resultado.

Un caso típico de una sola exclamación: pruebas que fallan. Ejecutas exclamación npm test, ves el error, y a continuación escribes: arregla esto. El modelo ya tiene la salida completa en su contexto, sin que tengas que copiarla. Y un detalle técnico: los comandos que lanzas tú no reciben las variables de sesión que Pi sí pasa a los comandos del modelo, como el identificador de la sesión o el modelo activo.

**6 · Cambiar el rumbo**

Ahora una tarea de verdad, con escritura y verificación. Le pedimos que cree src barra envio punto js con una función gastos envío: cuatro con noventa y cinco euros, y gratis a partir de cincuenta. Que escriba sus pruebas y ejecute npm test. Es decir, le pedimos también el feedback: no basta con escribir el código, tiene que demostrar que funciona.

Y aquí queríamos enseñar el steering, que es corregir al agente mientras trabaja. La idea es esta: si ves que va en la dirección equivocada, no hace falta esperar a que termine. Escribes la corrección y pulsas Enter. Pi la guarda y la entrega en cuanto acaba el turno en curso, de modo que el modelo la ve antes de dar el siguiente paso.

Así que, a los seis segundos, escribimos: cambio, el envío es gratis a partir de cuarenta euros, no de cincuenta. Pero pasó algo que conviene contar. El modelo fue más rápido que nosotros. En esos seis segundos había escrito los dos ficheros, ejecutado las pruebas y terminado: cinco pruebas, cinco pasan. Nuestra corrección llegó tarde, y entró como un mensaje normal.

El resultado fue bueno igualmente. El modelo editó los dos ficheros, cambió la constante del umbral a cuarenta y actualizó las pruebas: los casos por debajo pasan de cuarenta y nueve con noventa y nueve a treinta y nueve con noventa y nueve, y añade un caso exacto en cuarenta. Volvió a ejecutar las pruebas y confirmó que seguían pasando. En la pantalla se ve el diff con los números cambiados.

Lo repetimos más tarde con una tarea larga, y esta vez sí salió el steering de verdad. Mientras el modelo leía todos los ficheros para escribir un informe extenso, escribimos: mejor, céntrate solo en src barra envio punto js y resúmelo en tres viñetas. Pi lo mostró como Steering, en espera, y el modelo, al terminar su turno, lo leyó y cambió de plan.

Pero en esa segunda prueba apareció otro personaje: el error cuatrocientos veintinueve. El modelo gratuito estaba saturado en el proveedor, y la conexión se cortó varias veces a mitad de respuesta. Pi reintentó automáticamente, y el modelo llegó a escribir dos de las tres viñetas antes de que, tras tres intentos, Pi se diera por vencido con el mensaje retry failed after three attempts.

Esto también es harness. Los reintentos, cuántos y con qué espera, son una política que decide Pi, no el modelo, y se configuran en los ajustes. Con un modelo de pago o una clave propia esto pasa muy rara vez, pero conviene saber reconocerlo: no es que el agente se haya equivocado, es que la petición no llegó a completarse.

El segundo mecanismo es el follow-up, y es lo contrario del steering. No quieres cambiar lo que está haciendo; quieres dejarle trabajo para cuando acabe. Se escribe el mensaje y se pulsa alt Enter, en lugar de Enter. En Windows y WSL es control q.

Lo probamos con otra tarea: añadir al carrito una función total con envío que sume el total con cupón y los gastos de envío, con sus pruebas. Mientras trabajaba, escribimos: después, añade al README una línea sobre los gastos de envío. Y pulsamos alt Enter. Debajo de la conversación apareció el aviso follow-up con nuestro mensaje, y una pista: opción flecha arriba para editar los mensajes en cola.

El modelo terminó su tarea con una decisión de diseño razonable: aplicar el umbral de envío gratis sobre el total ya descontado. Lo explicó y dijo que cambiarlo era una línea. Siete pruebas, siete pasan. Y sin que hiciéramos nada más, Pi le entregó el follow-up: el modelo leyó el README y añadió la línea, coherente con lo anterior, cuatro con noventa y cinco y gratis a partir de cuarenta euros sobre el total descontado.

Si cambias de idea sobre lo que has encolado, alt flecha arriba devuelve los mensajes en cola al editor para que los edites o los borres. Y hay dos ajustes que cambian cómo se entregan: por defecto, de uno en uno; si los configuras en modo todos, se entregan juntos.

El tercer mecanismo es el más drástico: Escape. Para la ejecución en el acto. Le pedimos un informe largo sobre todos los ficheros, el modelo empezó a leerlos uno por uno, y pulsamos Escape. El historial muestra operation aborted. Lo que ya había leído queda en la sesión, pero no hay respuesta. Si había mensajes en cola, Escape los devuelve al editor, para que no se pierdan.

Resumiendo los tres. Enter mientras trabaja corrige el rumbo, y se entrega al acabar el turno. Alt Enter encola trabajo para cuando termine todo. Y Escape para. Con estos tres gestos dejas de ser un espectador que espera y pasas a dirigir al agente.

**7 · Leer el pie y retomar la sesión**

Volvamos al pie, que ahora tiene bastante más información. Después de las tareas dice algo así: flecha arriba nueve coma uno k, flecha abajo tres coma cinco k, R sesenta y cuatro k, CH noventa y cinco coma cuatro por ciento, dos coma seis por ciento de doscientos sesenta y dos k, auto. Parece críptico, pero cada pieza tiene un significado preciso.

La flecha hacia arriba son los tokens de entrada que ha enviado Pi al modelo en toda la sesión, sin contar la caché, y la flecha hacia abajo, los tokens que ha generado el modelo. La R son los tokens leídos de la caché del proveedor: el prefijo de la conversación que no hace falta volver a procesar. Si el proveedor informa de escrituras en caché, aparece también una W.

CH es la tasa de acierto de caché en la última petición. Un noventa y cinco por ciento significa que casi todo lo que se envió ya estaba cacheado. Esto importa porque los tokens cacheados son mucho más baratos y rápidos. Por eso Pi intenta no alterar el principio de la conversación: cada cambio en el prompt de sistema o en las herramientas puede invalidar la caché.

Lo siguiente es el uso de contexto: dos coma seis por ciento de una ventana de doscientos sesenta y dos mil tokens. Cuando supera el setenta por ciento se pone en amarillo y, por encima del noventa, en rojo. La palabra auto indica que la compactación automática está activada: cuando el contexto se acerque al límite, Pi resumirá lo antiguo para seguir trabajando.

Falta una cosa: el coste. Con un modelo de pago, el pie muestra también lo que llevas gastado en la sesión. Con nuestro modelo gratuito no aparece, porque es cero. Es una costumbre muy sana echar un vistazo al pie de vez en cuando, sobre todo en sesiones largas o con modelos caros.

Para el detalle completo está barra session. En nuestra demo muestra el fichero de la sesión, su identificador y el recuento: cincuenta y cuatro mensajes, ocho nuestros, veintitrés del asistente y veinte llamadas a herramientas con sus veinte resultados. En tokens: ochenta y cuatro mil en total, con un ochenta y ocho por ciento servido desde la caché.

Esa sesión es un fichero en formato JSONL dentro del directorio del agente, en una carpeta por proyecto. Cada línea es una entrada: un mensaje, una llamada a herramienta, un cambio de modelo. Las entradas forman un árbol, y eso permite volver atrás y ramificar sin perder nada. Es el tema del próximo vídeo.

Lo que sí hacemos ya es comprobar que la sesión sobrevive. Salimos con barra quit, limpiamos la pantalla y escribimos pi guion c. Pi abre la última sesión de esta carpeta y la conversación vuelve entera: las explicaciones, los diffs, el follow-up del README y el informe abortado. Podemos seguir como si no hubiéramos salido. Para elegir entre varias sesiones anteriores está pi guion r, o barra resume desde dentro.

Recapitulemos el vídeo. Pi se instala con el instalador oficial, con npm o con Nix, y se comprueba con pi guion guion version. Su configuración vive en el directorio del agente, que puedes cambiar con una variable de entorno. Barra login conecta un proveedor y barra model elige el modelo. La arroba señala ficheros, la exclamación ejecuta comandos con o sin el modelo, y Enter, alt Enter y Escape te permiten dirigirlo mientras trabaja.

Te propongo una práctica antes del siguiente vídeo. Crea un repositorio pequeño con una función y sus pruebas, arranca Pi con un directorio de agente aparte, y pídele una mejora con verificación incluida. Mientras trabaja, prueba un steering y un follow-up. Después sal, vuelve con pi guion c y mira barra session. Si algo no sale como esperas, despliega con control o y mira qué ha visto el modelo.

En el próximo vídeo abrimos Pi por dentro: cómo monta cada petición, por qué la sesión es un árbol y cómo moverse por él con barra tree, barra fork y barra clone. Nos vemos allí.

</details>

