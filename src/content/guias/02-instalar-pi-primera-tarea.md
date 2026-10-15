---
title: "Vídeo 02 · Instalar Pi y primera tarea"
description: "instalación, inicio de sesión y elección de modelo. Primera tarea real: referenciar ficheros, ejecutar comandos, corregir el rumbo a mitad de trabajo y leer el pie (contexto, caché y coste)."
ruta: "pi-oh-my-pi"
orden: 2
duracion: "23 min"
video: "02-instalar-pi-primera-tarea.mp4"
---

instalación, inicio de sesión y elección de modelo. Primera tarea real: referenciar ficheros, ejecutar comandos, corregir el rumbo a mitad de trabajo y leer el pie (contexto, caché y coste).

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Antes de instalar

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Bloque B · Pi 1.0.1:** De la teoría a la terminal — Empezamos por Pi: el más pequeño, el más fácil de seguir.
- **El plan de hoy:** Instalar (y comprobar) → Modelo (proveedor y selector) → Tarea (en un repo de juguete) → Dirigir (mientras trabaja) → Retomar (la sesión)
- **Lo que necesitas**
  - `01` · Una terminal: macOS, Linux, Windows o WSL
  - `02` · Node.js ≥ 22.19: el instalador lo pone si falta
  - `03` · Un modelo: suscripción, clave o local
- **Tres formas de llegar a un modelo**
  - `/login` · Suscripción: ChatGPT, Claude, Copilot
  - `KEY` · Clave de API: OpenRouter, Anthropic, OpenAI, Google
  - `local` · Modelo local: Ollama o llama.cpp, sin cuenta
- **El modelo de las demos:** Qwen 3.8 27B gratuito, vía OpenRouter — Un modelo modesto deja ver mejor lo que aporta el harness.
- **Para grabar (y para experimentar):** Configuración aparte, repositorio de juguete — Ni claves, ni sesiones, ni skills personales en pantalla.

### 2 · Instalar y comprobar

<p><button type="button" class="ir-a" data-t="143">▶ Ir a 2:23</button></p>

- *En terminal:* Instalador oficial (más abajo, en «Código y comandos»)
- *En terminal:* Con npm (más abajo, en «Código y comandos»)
- *En terminal:* Con Nix (nuevo en 1.0.1) (más abajo, en «Código y comandos»)
- *En la demo:* pi --version: 1.0.1
- *En la demo:* pi --help: cuatro herramientas y los subcomandos
- *En la demo:* Tres opciones para hoy
- *En terminal:* ~/.pi/agent · el directorio del agente (más abajo, en «Código y comandos»)
- *En terminal:* Un directorio de agente aparte (más abajo, en «Código y comandos»)
- **Configuración del proyecto**
  - `.pi/` · Solo con confianza: ajustes, extensiones y prompts del repo
  - `!` · Desinstalar no borra: ~/.pi/agent sigue ahí

### 3 · Primer arranque

<p><button type="button" class="ir-a" data-t="334">▶ Ir a 5:34</button></p>

- *En la demo:* pi, en la raíz del repositorio
- *En la demo:* Historial, editor y pie
- *En la demo:* Ctrl+O: ayuda completa y recursos cargados
- **Aviso de confianza:** Confiar en un proyecto no es una frontera de seguridad — Solo decide qué configuración de .pi/ se carga. Más en el vídeo 05.
- **/login · fuera de cámara:** /login (elige proveedor) → Navegador o clave (según el proveedor) → auth.json (en el directorio del agente)
- *En terminal:* Credenciales por variable de entorno (más abajo, en «Código y comandos»)
- *En la demo:* El menú «/»: la referencia exacta de tu instalación
- *En la demo:* /model: filtrar, elegir y guardar
- *En la demo:* Modelo y nivel de razonamiento
- **Atajos de modelo**
  - `Ctrl+P` · Rotar: entre tus modelos favoritos
  - `Ctrl+L` · Selector: abre /model directamente
  - `⇧Tab` · Razonamiento: rota el nivel de thinking

### 4 · La primera tarea

<p><button type="button" class="ir-a" data-t="556">▶ Ir a 9:16</button></p>

- *En la demo:* @ busca ficheros; Tab completa
- *En terminal:* @ · señalar ficheros (más abajo, en «Código y comandos»)
- *En la demo:* El razonamiento visible del modelo, en inglés
- *En la demo:* Primera herramienta: read
- *En la demo:* Segunda herramienta: bash para explorar
- **Plegar y desplegar**
  - `Ctrl+O` · Salidas de herramientas: lo que ve el modelo, completo
  - `Ctrl+T` · Razonamiento: los bloques del modelo
- *En la demo:* Detecta un posible redondeo y no se pierde en él
- *En la demo:* La respuesta, en español
- **El turno, pieza a pieza**
  - `01` · Instrucciones: prompt de Pi + @
  - `02` · Herramientas: 2 read + 1 bash
  - `03` · Entorno: tu máquina
  - `04` · Estado: la sesión
  - `05` · Feedback: aún no hacía falta

### 5 · Tú también tienes terminal

<p><button type="button" class="ir-a" data-t="752">▶ Ir a 12:32</button></p>

- **La exclamación**
  - `!!` · Solo para ti: el modelo no ve la salida
  - `!` · Para los dos: la salida entra en la conversación
- *En la demo:* !!npm test · borde gris: solo para ti
- *En la demo:* !git log · borde amarillo: viaja con el siguiente mensaje
- *En la demo:* El pie no cambia: ninguno llama al modelo
- **Un caso típico:** !npm test (ves el error) → «arregla esto» (sin copiar nada) → El modelo (ya tiene la salida)

### 6 · Cambiar el rumbo

<p><button type="button" class="ir-a" data-t="856">▶ Ir a 14:16</button></p>

- *En terminal:* La tarea, con feedback incluido (más abajo, en «Código y comandos»)
- **Steering · Enter mientras trabaja:** Escribes (la corrección) → Enter (queda en espera) → Fin del turno (el modelo la lee)
- **Lo que pasó de verdad:** El modelo fue más rápido que nosotros — En seis segundos: dos ficheros, pruebas y «5 pass». El cambio entró como mensaje normal.
- *En la demo:* El diff: de 50 a 40 €
- *En terminal:* Steering de verdad, a mitad de turno (más abajo, en «Código y comandos»)
- *En la demo:* Un 429 del proveedor gratuito
- **También es harness:** Los reintentos los decide Pi, no el modelo — Cuántos y con qué espera: ajustes retry.*
- **Steering frente a follow-up**
  - `Enter` · Steering: cambia lo que está haciendo
  - `Alt+Enter` · Follow-up: trabajo para cuando acabe
- *En la demo:* Follow-up en cola: se entregará al terminar
- *En la demo:* Decisión de diseño explicada · 7/7
- *En la demo:* Y después, el follow-up: la línea del README
- **La cola**
  - `Alt+↑` · Recuperar: los mensajes vuelven al editor
  - `⚙` · Entrega: de uno en uno, o todos juntos
- *En la demo:* Escape: para en el acto
- **Tres gestos para dirigir**
  - `Enter` · Corrige: al acabar el turno
  - `Alt+Enter` · Encola: para cuando termine todo
  - `Esc` · Para: y devuelve la cola

### 7 · Leer el pie y retomar la sesión

<p><button type="button" class="ir-a" data-t="1123">▶ Ir a 18:43</button></p>

- *En la demo:* El pie, después de las tareas
- *En terminal:* El pie de Pi (más abajo, en «Código y comandos»)
- **CH · acierto de caché:** 95 % ya estaba cacheado: más barato y más rápido — Cambiar el prompt de sistema o las herramientas puede invalidar la caché.
- **Uso de contexto**
  - `2,6 %` · De 262k: la ventana del modelo
  - `70 / 90` · Amarillo y rojo: avisos de llenado
  - `auto` · Compactación: resume lo antiguo al acercarse al límite
- **El coste:** Con un modelo de pago, el pie suma lo gastado — Con el gratuito no aparece: es cero.
- *En la demo:* /session: el detalle de la sesión
- **La sesión es un fichero JSONL:** Una línea (una entrada) → id y parentId (forman un árbol) → Vídeo 03 (tree, fork y clone)
- *En terminal:* Retomar la sesión (más abajo, en «Código y comandos»)
- *En la demo:* pi -c: la conversación vuelve entera
- **Recapitulando**
  - `1` · Instalar: instalador, npm o Nix
  - `2` · Configurar: agent dir · /login · /model
  - `3` · Pedir: @ ficheros · ! y !!
  - `4` · Dirigir: Enter · Alt+Enter · Esc
- **Práctica:** Repo pequeño (una función y sus pruebas) → Una mejora (con verificación) → Steering y follow-up (mientras trabaja) → pi -c (y /session)
- **Próximo vídeo:** Pi por dentro — Cómo monta cada petición y por qué la sesión es un árbol.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Instalador oficial

```text
curl -fsSL https://pi.dev/install.sh | sh
# Windows (PowerShell)
powershell -c "irm https://pi.dev/install.ps1 | iex"
# después
pi update
```

- `install.sh`: macOS y Linux
- `install.ps1`: Windows

### Con npm

```text
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
# desde 1.0.1 ya no se publica npm-shrinkwrap.json
```

- `--ignore-scripts`: Ninguna dependencia ejecuta código
- `npm-shrinkwrap`: Dependencias sin fijar

### Con Nix (nuevo en 1.0.1)

```text
nix profile add github:earendil-works/pi/stable
nix profile upgrade pi
nix run github:earendil-works/pi/stable
```

- `profile add`: Instalar
- `upgrade`: Actualizar (no pi update)
- `nix run`: Sin instalar

### ~/.pi/agent · el directorio del agente

```text
ls ~/.pi/agent
settings.json      keybindings.json
auth.json          models.json
sessions/
extensions/  skills/  prompts/  themes/
```

- `settings.json`: Ajustes
- `auth.json`: Credenciales
- `sessions/`: Sesiones
- `extensions/`: Recursos

### Un directorio de agente aparte

```text
export PI_CODING_AGENT_DIR=/tmp/csn/pi-agent
pi        # /login una vez, fuera de cámara
pi        # desde aquí, como recién instalado
```

- `PI_CODING_AGENT_DIR`: Cambia el directorio
- `/tmp/csn`: Carpeta temporal

### Credenciales por variable de entorno

```text
export OPENROUTER_API_KEY=…
export ANTHROPIC_API_KEY=…
# prioridad: --api-key → auth.json → models.json → entorno
```

- `OPENROUTER_API_KEY`: Una por proveedor
- `prioridad`: Quién gana

### @ · señalar ficheros

```text
pi @src/carrito.js "¿Qué hace este fichero?"
# en la TUI: @carr → Tab → @src/carrito.js
```

- `@src/carrito.js`: El fichero exacto
- `pi @`: También desde la CLI

### La tarea, con feedback incluido

```text
Añade src/envio.js con una función gastosEnvio(subtotal):
4,95 € de envío, gratis a partir de 50 €.
Escribe sus pruebas en test/envio.test.js y ejecuta npm test.
```

- `gastosEnvio`: Qué construir
- `ejecuta npm test`: Cómo demostrarlo

### Steering de verdad, a mitad de turno

```text
Revisa todos los ficheros del repositorio y escribe un informe largo…
Steering: Mejor: céntrate solo en src/envio.js y resúmelo en tres viñetas.
↳ Option+Up to edit all queued messages
── Working ──
```

- `Revisa todos`: Tarea larga
- `Steering:`: En espera hasta el fin del turno

### El pie de Pi

```text
~/csn/tienda (master)
↑9.1k ↓3.5k R64k CH95.4% 2.6%/262k (auto)          qwen/qwen3.8-27b:free • medium
```

- `↑9.1k`: Entrada
- `↓3.5k`: Salida
- `R64k`: Leído de caché

### Retomar la sesión

```text
/quit
clear; pi -c
```

- `/quit`: Salir
- `pi -c`: La última sesión de esta carpeta

## Fuentes

- Documentación instalada de Pi 1.0.1: `docs/quickstart.md`, `docs/usage.md`, `docs/keybindings.md`, `docs/providers.md`.
- Código del pie: `dist/modes/interactive/components/footer.js` (significado de ↑, ↓, R, W, CH y `(auto)`).
- Documentación oficial de Pi: [keybindings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md), [providers.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md), [quickstart.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/quickstart.md), [usage.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/usage.md)

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

La segunda forma es npm: npm install, guion g, el paquete arroba earendil guion works barra pi guion coding guion agent. La documentación recomienda añadir la opción ignore scripts, para que ninguna dependencia ejecute código durante la instalación. Hay un matiz importante desde la versión uno punto cero punto uno: por npm ya no se fijan las dependencias transitivas, así que el instalador oficial es más reproducible.

La tercera forma es Nix, que llegó con la versión uno punto cero punto uno: nix profile add, y el repositorio de Earendil en su rama estable. Con Nix se actualiza con nix profile upgrade, no con pi update, y puedes fijar una versión concreta o ejecutarlo sin instalar con nix run. Y la cuarta es Android, a través de Termux, que tiene su propia guía.

En nuestro equipo Pi ya estaba instalado por npm, así que no vamos a ejecutar el instalador delante de la cámara. Lo que sí hacemos siempre después de instalar es comprobarlo. Pi guion guion version responde uno punto cero punto uno. Si ves ese número, la instalación está bien.

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

