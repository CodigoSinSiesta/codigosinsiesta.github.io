---
title: "Vídeo 04 · Modelos y proveedores"
description: "Todas las formas de conectar un modelo, cómo rotar entre varios y ajustar cuánto razonan, y lo que cuesta de verdad cambiar de modelo a mitad de tarea. Cerramos probando modelos locales."
ruta: "pi-oh-my-pi"
orden: 4
duracion: "20 min"
video: "04-modelos-y-proveedores.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/04-modelos-y-proveedores.es.vtt"
---

Todas las formas de conectar un modelo, cómo rotar entre varios y ajustar cuánto razonan, y lo que cuesta de verdad cambiar de modelo a mitad de tarea. Cerramos probando modelos locales.

<p class="guia__nota">Dura 20 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Cómo se conecta un modelo

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Pi es el harness; el modelo lo pones tú.** Hay cinco situaciones:

| Si tienes… | Cómo se conecta |
|---|---|
| Una suscripción que Pi soporta (ChatGPT, Claude, GitHub Copilot) | `/login` |
| Una clave de API de un proveedor | `/login` o su variable de entorno |
| Un modelo GGUF en tu disco | El router de llama.cpp |
| Un servidor compatible con OpenAI, Anthropic o Google (Ollama, LM Studio, un proxy de empresa) | `models.json` |
| Un proveedor con protocolo o autenticación propios | Una extensión que lo registre |

- **Dónde se guarda:** `/login` escribe en `auth.json` (en el directorio del agente) y `/logout` lo borra. Las variables de entorno sirven en servidores y CI, donde no quieres credenciales en disco.
- **Prioridad:** `--api-key`, después `auth.json`, después `models.json` y por último el entorno. Un `auth.json` olvidado tapa la variable de entorno.
- **Sin clave en texto plano:** en `auth.json` puedes poner un comando precedido de `!` que obtenga la clave, por ejemplo del llavero. Pi lo ejecuta la primera vez y guarda el resultado en memoria mientras dura el proceso.
- **Comprobar sin abrir la TUI:** `pi auth check` responde `ready`, `not_ready` o `invalid` con un código de salida distinto. Cuidado con `pi auth print-api-key` y `print-bearer-token`: imprimen el secreto.

> **Nota:** antes de usar con Pi la suscripción de un proveedor (por ejemplo, la de Claude), revisa sus términos de uso: algunos limitan el uso de la suscripción en harnesses de terceros. Una clave de API es la vía más segura.

### 2 · El catálogo

<p><button type="button" class="ir-a" data-t="187">▶ Ir a 3:07</button></p>

- **`pi --list-models <filtro>`:** para cada modelo, proveedor, identificador, ventana de contexto, salida máxima y si admite razonamiento e imágenes. El catálogo completo, con precios, está también en pi.dev/models.
- **Ventana de contexto frente a salida máxima:** la ventana es todo lo que el modelo ve en una petición (sistema, herramientas y conversación); la salida máxima, lo que escribe en una respuesta. Para un agente importa sobre todo la ventana, porque la conversación crece en cada turno.
- **El mismo modelo, varios caminos:** DeepSeek Flash llega directo de DeepSeek (1M de contexto, 384k de salida) y también vía OpenRouter, con otros nombres y límites. Según el camino cambian el precio, los límites, quién ve tus datos y la fiabilidad (recuerda los 429). Elegir proveedor importa tanto como elegir modelo.
- **Dos capas:** un catálogo incluido en la instalación más datos recientes de pi.dev si hay red. `pi update --models` fuerza la actualización; sin red, el catálogo en caché sigue valiendo.
- **¿Falta un modelo en `/model`?** Probablemente te falta iniciar sesión en su proveedor: el selector solo enseña proveedores con autenticación utilizable.

### 3 · Elegir y rotar

<p><button type="button" class="ir-a" data-t="339">▶ Ir a 5:39</button></p>

- **`/model` (o `Ctrl+L`):** `Enter` elige para esta sesión y `Ctrl+S` lo guarda como predeterminado (`defaultProvider` y `defaultModel` en `settings.json`). Una sesión retomada vuelve con el modelo que tenía.
- **Rotación:** `Ctrl+P` pasa al siguiente modelo y `Shift+Ctrl+P` al anterior. `/scoped-models` decide cuáles entran: en la demo, 3 de 408 (`Ctrl+X` desactiva todos y `Enter` activa uno). Sin `Ctrl+S` vale solo para la sesión; con él se guarda como `enabledModels`.
- **Desde la CLI:** `--model` acepta `proveedor/id` o un trozo del nombre; `--provider` desambigua; `--models` fija la rotación con comodines; `--api-key` prueba una clave sin guardarla en `auth.json`.

### 4 · Cuánto piensa el modelo

<p><button type="button" class="ir-a" data-t="457">▶ Ir a 7:37</button></p>

- **Siete niveles:** off, minimal, low, medium, high, xhigh y max. Cada modelo admite un subconjunto y Pi solo deja elegir esos. El nivel sale en el pie y el borde del editor cambia de color.
- **Cómo se cambia:** `/thinking`, `Shift+Tab` para rotar, `--thinking` al arrancar o el sufijo del modelo (`deepseek/deepseek-flash:low`).
- **Ojo al rotar:** el modelo local no admite razonamiento; al pasar por él el nivel quedó en off y siguió en off al volver a Flash. Mira el pie antes de enviar.
- **Regla de uso:** nivel alto para tareas difíciles como depurar o revisar; bajo para ediciones bien especificadas o preguntas concretas. Mide con tus tareas.
- **El razonamiento se cobra como salida,** aunque pliegues los bloques con `Ctrl+T`.

### 5 · Cambiar de modelo a mitad de tarea

<p><button type="button" class="ir-a" data-t="573">▶ Ir a 9:33</button></p>

- **La estrategia:** un modelo barato hace y uno capaz revisa. Flash en `high` añade una validación con sus pruebas (13/13); V4 Pro en `max` revisa sin editar y encuentra tres huecos reales.
- **La cuenta:** la tarea con Flash, 0,002 $. Tras la revisión, la sesión sube a 0,012 $: la revisión costó cinco veces la tarea. `/session` lo desglosa: 0,010 $ V4 Pro, 0,002 $ Flash, y 0,006 $ de caché repagada por 8500 tokens.
- **Por qué cae la caché:** es de cada modelo. Lo cacheado para Flash no sirve a V4 Pro, así que la primera petición del modelo nuevo se paga entera (el acierto de caché bajó de más del 90 % a 0). Cada cambio queda como entrada `model_change` en la sesión.
- **Cache warming:** Pi puede mantener caliente la caché si el modelo declara cuánto dura y calcula un ahorro de al menos cinco céntimos. DeepSeek no lo declara, así que en la demo sale `inactive`.
- **Conclusión:** agrupa el trabajo. Varias tareas con el modelo barato y una revisión de conjunto con el caro, no ir y venir en cada paso. Es una estrategia que sirve en cualquier agente.

### 6 · Modelos locales

<p><button type="button" class="ir-a" data-t="748">▶ Ir a 12:28</button></p>

- **Tres caminos locales:** llama.cpp, con integración nativa (`llama-server` con una carpeta de GGUF, `/login llama.cpp`, `/llama` para cargar o descargar y `/model` para elegir); y Ollama, LM Studio, vLLM o cualquier servidor compatible, vía `models.json`. En la demo: Ollama y LM Studio.
- **`models.json`:** URL base, tipo de API, clave (texto, `$VARIABLE` o `!comando`, que aquí se ejecuta en cada petición) y lista de modelos. Abrir `/model` lo recarga. Con `modelOverrides` corriges lo que el catálogo no sabe: la ventana real o la duración de la caché.
- *En la demo:* Llama 3.2 3B responde en segundos y gratis, pero se inventa la respuesta. Obligado a usar `read`, lee el fichero y repite el mismo error: tener herramientas no garantiza usar bien lo que devuelven.
- *En la demo:* un modelo de razonamiento de 14B (Ministral 3) tardó 31 s en decir «listo» y no respondió en cinco minutos con el prompt de Pi. Gemma 4 E4B, entrenado para usar herramientas, lee el fichero y acierta en unos 20 s. El tamaño no lo explica todo.
- **Antes de confiar en un modelo local:** dale una tarea cuya respuesta conozcas y comprueba que la acierta.

### 7 · Más allá del selector

<p><button type="button" class="ir-a" data-t="978">▶ Ir a 16:18</button></p>

- **Virtual models (experimentales):** un modelo que, en cada petición, elige el modelo físico y el nivel según la tarea, el coste o el estado de la conversación. Se registran desde una extensión. El pie muestra el virtual y, tras una flecha, el físico; `/session` reparte el coste por modelo físico.
- **Modelos que no conversan:** clasificadores (eligen opción, sí/no, puntuación) y generadores de imágenes. No salen en `/model`; se usan desde *codemode* (el modelo escribe un script que llama a las herramientas; vídeo 07) o desde extensiones.
- **Proveedores propios:** si `models.json` se queda corto (autenticación especial, modelos dinámicos, otro protocolo), una extensión registra el proveedor con `pi.registerProvider()`. La documentación trae ejemplos para GitLab Duo y para una variante de Anthropic.
- **Modo print:** `pi -p` con modelo y nivel responde en una línea sin abrir la interfaz. Al salir de una sesión, Pi imprime cómo retomarla con `--session <id>`.
- **Práctica:** define en `/scoped-models` un modelo barato y uno capaz, haz una tarea con el primero y revisa con el segundo. Calcula en `/session` cuánto costó la revisión y cuánto la recarga de caché.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Dónde busca Pi las credenciales

```text
# orden de prioridad
1. pi --api-key …
2. ~/.pi/agent/auth.json      (/login · /logout)
3. ~/.pi/agent/models.json    (apiKey)
4. variables de entorno       (OPENROUTER_API_KEY…)
```

- Gana la primera fuente que tenga clave. La variable de entorno solo se usa si no hay ninguna de las anteriores.

### auth.json · la clave, obtenida con un comando

```text
{ "anthropic": { "type": "api_key",
    "key": "!security find-generic-password -ws anthropic" } }
```

- `!security find-generic-password`: lee la clave del llavero de macOS (solo macOS; en Linux usarías tu gestor de secretos). Pi la guarda en memoria mientras dura el proceso.
- Este `!` marca un comando dentro de `auth.json`; no es el `!` de la TUI.

### Comprobar un proveedor

```text
pi auth check --provider deepseek --json
ready   → salida 0 · not_ready → 1 · invalid → 2
# ⚠ pi auth print-api-key y print-bearer-token imprimen secretos
```

- `auth check`: pensado para scripts; el código de salida dice el estado.
- `print-api-key`: nunca en una grabación ni en un log.

### El catálogo

```text
# incluido en la instalación + datos de pi.dev
pi update --models     # forzar la actualización
PI_OFFLINE=1 pi        # sin red: el catálogo en caché sigue valiendo
```

- `PI_OFFLINE=1` (o `--offline`): desactiva cualquier acceso a la red.

### La rotación, guardada o al arrancar

```text
# /scoped-models → Ctrl+S  →  settings.json
"enabledModels": ["deepseek/deepseek-flash", "deepseek/deepseek-v4-pro", "ollama/llama3.2:latest"]
pi --models "deepseek/*,ollama/*"
```

- `--models`: fija la rotación al arrancar; admite comodines.

### Elegir modelo desde la línea de comandos

```text
pi --model deepseek/deepseek-flash
pi --provider deepseek --model flash
pi --api-key sk-…   # no se guarda en auth.json
```

- `--provider`: limita la búsqueda cuando el mismo modelo existe en varios proveedores.
- `--api-key`: no se guarda en `auth.json`, pero sí queda en el historial de tu shell. Para algo más que una prueba, usa `/login` o una variable.

### settings.json de la demo (directorio del agente)

```json
{
  "defaultProvider": "deepseek",
  "defaultModel": "deepseek-flash"
}
```

- Con qué arranca cada sesión nueva. Las retomadas vuelven con el modelo que tenían.

### El nivel, al arrancar

```text
pi --model deepseek/deepseek-v4-pro --thinking max
pi --model deepseek/deepseek-flash:low
```

- `--thinking max` y el sufijo `:low` hacen lo mismo: fijar el nivel de razonamiento al arrancar.

### Cada cambio queda en la sesión

```text
jq -c 'select(.type=="model_change") | {provider, modelId}' <sesión>
{"provider":"deepseek","modelId":"deepseek-flash"}
{"provider":"deepseek","modelId":"deepseek-v4-pro"}
{"provider":"ollama","modelId":"llama3.2:latest"}
```

- Con estas entradas Pi reconstruye qué modelo atendió cada turno y reparte el coste.

### El router de llama.cpp

```text
llama-server --models-dir ~/models --no-models-autoload --jinja \
  --host 127.0.0.1 --port 8080 -ngl 999 -c 32768
curl http://127.0.0.1:8080/health
```

- `--no-models-autoload`: no carga nada al arrancar; cargas desde Pi con `/llama`.
- `--jinja`: necesario para las plantillas de chat y las llamadas a herramientas.
- `-c 32768`: tamaño de contexto.
- `/health`: dice si el servidor está vivo.

### models.json de la demo (directorio del agente)

```json
{ "providers": { "ollama": {
  "baseUrl": "http://localhost:11434/v1",
  "api": "openai-completions",
  "apiKey": "ollama",
  "models": [{ "id": "llama3.2:latest", "name": "Llama 3.2 3B (local)" }] } } }
```

- `baseUrl`: la API compatible con OpenAI que expone Ollama.
- `"apiKey": "ollama"`: Ollama no necesita clave, pero hay que poner algo.

### Ministral 3 14B (razonamiento) en LM Studio

No aparece en el vídeo; está aquí como referencia de la prueba.

```text
«Di solo: listo»  →  31 s · 398 de 400 tokens razonando
pi -p --model lmstudio/…ministral-3-14b-reasoning "¿Qué hace src/envio.js?"
→ 5 minutos sin respuesta (timeout)
```

- Casi todos los tokens se van en razonar: demasiado lento para trabajar como agente.

### models.json: Gemma 4 E4B servido por LM Studio

```text
"lmstudio": {
  "baseUrl": "http://localhost:1234/v1",
  "api": "openai-completions",
  "apiKey": "lmstudio",
  "models": [{ "id": "google/gemma-4-e4b", "contextWindow": 32768 }]
}
pi --model lmstudio/google/gemma-4-e4b
```

- `1234`: el puerto por defecto del servidor de LM Studio.
- `contextWindow`: declara la ventana real del modelo cargado.

### Un virtual model en el pie (ejemplo de la documentación)

```text
auto • high  →  gpt-5.6-luna • medium
/session  →  coste por modelo físico
```

- A la izquierda, el modelo virtual que elegiste; tras la flecha, el físico que atendió la petición.

### Modo print, con modelo y nivel

```text
pi -p --no-session --model deepseek/deepseek-flash:low "En una frase: ¿qué hace src/envio.js?"
```

- Una petición sin interfaz, sin guardar sesión y con poco razonamiento: rápida y barata para scripts.

### Al salir, Pi te dice cómo volver

```text
/quit
To resume this session: pi --session 01a1069c-ff81-71fb-bd15-2582d02197ed
pi -c   ·   pi -r
```

- `pi -c` abre la última sesión de la carpeta; `pi -r`, el selector.

## Fuentes

- [providers.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md): las cinco formas de conectar un modelo y las credenciales.
- [models.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md): `models.json` y `modelOverrides`.
- [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md): `defaultModel`, `enabledModels` y `cacheWarming`.
- [llama-cpp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/llama-cpp.md): el router de llama.cpp.
- [virtual-models.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/virtual-models.md) y [custom-provider.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/custom-provider.md): enrutadores y proveedores propios.
- El catálogo de modelos, en pi.dev/models. Grabado con Pi 1.0.1.
- Vídeos relacionados: 07 (codemode), 08 (extensiones) y 14 (roles y razonamiento en oh my pi).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Cómo se conecta un modelo**

Pi no trae un modelo propio. Es el harness, y el modelo lo pones tú. En este vídeo vamos a ver todas las formas de conectar uno, cómo elegir entre varios, cómo ajustar cuánto piensa y qué cuesta de verdad cambiar de modelo a mitad de una tarea. Y terminaremos con un modelo local, sin cuenta y sin coste, para ver con honestidad hasta dónde llega.

La documentación de Pi lo resume en una tabla con cinco situaciones. Si tienes una suscripción que Pi soporta, como ChatGPT, Claude o GitHub Copilot, inicias sesión con barra login. Si tienes una clave de API de un proveedor, la guardas también con barra login o la pones en su variable de entorno. Si tienes un modelo GGUF en tu disco, conectas Pi al router de llama punto cpp.

Las otras dos son para casos menos habituales. Si tienes un servidor que habla el protocolo de OpenAI, de Anthropic o de Google, por ejemplo Ollama, LM Studio o un proxy de tu empresa, lo describes en un fichero llamado models punto json. Y si el proveedor usa un protocolo propio o un flujo de autenticación especial, se escribe una extensión que lo registre.

Barra login guarda lo que obtiene en auth punto json, dentro del directorio del agente, y barra logout lo borra. Las variables de entorno son la alternativa para servidores e integración continua, donde no quieres que Pi escriba credenciales en disco. Cuando hay varias fuentes a la vez, gana la opción de línea de comandos, después auth punto json, después models punto json y por último el entorno.

Hay una tercera vía que combina lo mejor de las dos: en auth punto json, en lugar de la clave, puedes poner un comando precedido de una exclamación, por ejemplo el que lee la clave del llavero de macOS. Pi lo ejecuta la primera vez que necesita la clave y guarda el resultado en memoria mientras dura el proceso. Así la clave nunca queda escrita en un fichero de texto.

Y para comprobar que un proveedor está listo sin abrir la interfaz existe pi auth check, con el proveedor o el modelo. Responde ready, not ready o invalid, con un código de salida distinto para cada caso, así que encaja muy bien en scripts. Cuidado con sus hermanos, pi auth print api key y print bearer token: imprimen el secreto por pantalla y no deberían aparecer nunca en una grabación ni en un log.

En nuestro directorio de demo hay tres proveedores con sesión iniciada: DeepSeek, OpenRouter y Meta. Y un cuarto sin cuenta: Ollama, en local. Vamos a usar los dos de DeepSeek y el local. Un consejo de seguridad antes de seguir: auth punto json y cualquier comando que obtenga claves son privados. Si confías en un proyecto, su configuración puede ejecutar código dentro del proceso de Pi, así que no cargues configuración de carpetas que no conoces.

**2 · El catálogo**

¿Qué modelos hay disponibles? La respuesta más rápida está en la línea de comandos: pi guion guion list models, con una palabra para filtrar. Lo ejecutamos con deepseek, y la tabla enseña, para cada modelo, el proveedor, su identificador, la ventana de contexto, la salida máxima y si admite razonamiento e imágenes.

Fíjate en algo que pasa desapercibido. Los primeros dos, deepseek flash y deepseek v4 pro, vienen directamente del proveedor DeepSeek, con un millón de tokens de contexto y trescientos ochenta y cuatro mil de salida. Debajo aparecen modelos muy parecidos a través de OpenRouter, con otros nombres y otros límites: el flash latest de OpenRouter, por ejemplo, anuncia más de novecientos mil tokens de salida.

El mismo modelo puede llegarte por caminos distintos, y el camino importa. Cambia el precio, cambian los límites, cambia quién ve tus datos y cambia la fiabilidad, como comprobamos con el modelo gratuito de los primeros vídeos. Elegir proveedor es tan importante como elegir modelo.

El catálogo tiene dos capas. Pi trae uno incluido en la instalación y, si hay red, le superpone datos más recientes de pi punto dev. Si quieres forzar la actualización, pi update guion guion models. Y si trabajas sin red, el catálogo que ya tienes sigue funcionando; la variable PI OFFLINE o la opción guion guion offline desactivan cualquier acceso.

Si quieres explorar sin instalar nada, el catálogo también está en la web de pi punto dev, con proveedores, identificadores, capacidades, límites y precios. Es útil para comparar antes de decidir dónde abrir una cuenta.

Dos columnas de la tabla se confunden a menudo. La ventana de contexto es todo lo que el modelo puede ver en una petición: el prompt de sistema, las herramientas y toda la conversación. La salida máxima es lo que puede escribir en una sola respuesta. Para un agente importa sobre todo la primera, porque la conversación crece en cada turno; la segunda limita el tamaño de un fichero que puede escribir de una vez.

Para el modelo local, el mismo comando con llama tres punto dos enseña una sola línea: proveedor ollama, ciento veintiocho mil tokens de contexto, sin razonamiento y sin imágenes. Ese modelo no viene del catálogo; lo hemos declarado nosotros en models punto json, y lo veremos al final del vídeo.

Un último detalle del selector. Barra model solo enseña los modelos de proveedores con autenticación utilizable. Si echas en falta un modelo que sabes que existe, lo más probable es que te falte iniciar sesión en su proveedor, no que Pi no lo conozca.

**3 · Elegir y rotar**

Dentro de Pi, barra model abre el selector, y control l es el atajo. Escribes para filtrar, Enter elige el modelo para esta sesión y control s, además, lo guarda como predeterminado para las sesiones nuevas. La sesión recuerda su modelo: si la retomas otro día, vuelve con el que tenía, sin tocar tu predeterminado.

Cuando trabajas con dos o tres modelos a la vez, abrir el selector cada vez es lento. Para eso está la rotación: control p pasa al siguiente modelo y mayúsculas control p al anterior. Pero rotar entre todos los modelos disponibles no tiene sentido, y en nuestra instalación eran cuatrocientos ocho.

Barra scoped models define qué modelos entran en la rotación. Al abrirlo, los cuatrocientos ocho estaban activos. Control x los desactiva todos, y después buscamos y activamos con Enter los tres que nos interesan: deepseek flash, deepseek v4 pro y llama tres punto dos en local. El pie de la lista lo confirma: tres de cuatrocientos ocho, sin guardar.

Ese sin guardar es importante. Por defecto, la selección vale solo para esta sesión. Si pulsas control s, se guarda en los ajustes como enabled models y se aplica siempre. También puedes fijarla al arrancar con guion guion models y una lista separada por comas, que admite comodines, por ejemplo todos los modelos de un proveedor.

Desde la línea de comandos tienes el mismo control. Guion guion model acepta el identificador con el proveedor delante, o solo un trozo del nombre, y guion guion provider limita la búsqueda a un proveedor cuando el mismo modelo existe en varios. Y guion guion api key te deja probar una clave temporal sin guardarla en ningún sitio.

El predeterminado vive en settings punto json, en dos campos: default provider y default model. En la demo los fijamos al cambiar de proveedor: deepseek y deepseek flash. Cada sesión nueva arranca con ellos, y cada sesión retomada, con el modelo que tenía la última vez.

**4 · Cuánto piensa el modelo**

La segunda decisión, después del modelo, es cuánto le dejas razonar. Pi ofrece siete niveles: off, minimal, low, medium, high, xhigh y max. Cada modelo admite un subconjunto, y Pi solo te deja elegir los que soporta. El nivel actual aparece en el pie, a la derecha del modelo.

Se cambia con barra thinking, o rotando con mayúsculas tabulador. En la demo, con deepseek v4 pro, pulsamos mayúsculas tabulador y el nivel pasó de high a max. Pi lo anuncia en la conversación, thinking level max, y el borde del editor cambia de color, para que lo tengas presente sin mirar el pie.

También se puede fijar desde la línea de comandos, con guion guion thinking, o pegado al nombre del modelo con dos puntos. Deepseek flash dos puntos low, por ejemplo, arranca ese modelo con poco razonamiento. Es cómodo en scripts, donde quieres respuestas rápidas y baratas.

Ojo con un efecto de la rotación. El modelo local no admite razonamiento, así que al pasar por él el nivel quedó en off. Al volver a deepseek flash, el pie decía thinking off, no high. Si rotas entre modelos con capacidades distintas, mira el pie antes de enviar la siguiente tarea.

¿Cuánto razonamiento conviene? No hay una regla fija. Más nivel suele mejorar las tareas difíciles, como depurar o revisar, a cambio de más tiempo y más tokens de salida. Para editar algo bien especificado o responder una pregunta concreta, un nivel bajo basta. Como con los modelos, lo sensato es medir con tus tareas y mirar el coste.

Un apunte sobre lo que se ve. Con razonamiento activo, la respuesta llega precedida de bloques en gris con lo que el modelo piensa. Control t los pliega o despliega. Y aunque no los leas, esos tokens se generan y se cobran como salida, así que un nivel alto también se nota en el pie.

**5 · Cambiar de modelo a mitad de tarea**

Vamos con la demo central del vídeo. La idea es una estrategia muy común: un modelo barato hace el trabajo y uno más capaz lo revisa. Le pedimos a deepseek flash, con razonamiento high, que gastos envío lance un error de tipo si el subtotal no es un número finito mayor o igual que cero, con sus pruebas.

Flash lo resolvió bien. Añadió la validación, escribió una prueba que recorre valores no válidos, como NaN, infinito, negativos, textos, null o listas, y ejecutó las pruebas: trece de trece. El pie marcaba cero coma cero cero dos dólares para toda la sesión hasta ese momento.

Después, control p para pasar a deepseek v4 pro, mayúsculas tabulador hasta max, y le pedimos que revisara el último cambio sin editar nada, en tres viñetas. La revisión fue buena: faltaba probar el caso límite cero y menos cero, el cambio altera el comportamiento de total con envío cuando el carrito trae datos corruptos, y las pruebas no comprobaban el mensaje del error.

Ahora el coste. Después de esa revisión, el pie pasó a cero coma cero uno dos dólares. Es decir, una sola revisión con el modelo grande al máximo costó cinco veces más que toda la tarea anterior. Y en el mismo pie apareció otra señal: la tasa de acierto de caché, que estaba por encima del noventa por ciento, cayó a cero.

¿Por qué cae? Porque la caché es de cada modelo. Lo que el proveedor tenía guardado para flash no sirve para v4 pro, así que la primera petición del modelo nuevo se paga entera. Y lo mismo pasa al volver: la caché de flash puede haber caducado mientras tanto.

Barra session lo explica con números. El coste total, doce milésimas de dólar, se desglosa por modelo físico: diez para v4 pro, dos para flash y cero para el modelo local. Y hay una línea que merece la pena leer despacio: cache re billed, seis milésimas de dólar por ocho mil quinientos tokens en dos fallos de caché. Es exactamente lo que pagamos de más por cambiar de modelo.

Cada cambio de modelo queda también registrado en el fichero de sesión, como una entrada model change, igual que los cambios de nivel de razonamiento. Por eso Pi puede reconstruir qué modelo atendió cada turno y repartir el coste entre ellos.

En barra session también aparece el estado del cache warming. Pi puede mantener caliente la caché del proveedor durante una ejecución larga, o incluso entre ejecuciones con el modo idle. Solo lo hace cuando el modelo declara cuánto dura su caché y cuando calcula que se ahorrará al menos cinco céntimos. En nuestro caso dice inactive, cache lifetime unavailable: DeepSeek no declara esa duración, así que no se aplica.

La conclusión práctica: cambiar de modelo a mitad de tarea es una herramienta muy útil, pero no es gratis. Agrupa el trabajo. Haz varias tareas seguidas con el modelo barato y pasa al caro para una revisión de conjunto, en lugar de ir y venir en cada paso. Y cuando dudes, mira barra session.

**6 · Modelos locales**

Ahora el modelo local. Pi se integra directamente con el router de llama punto cpp: arrancas llama server apuntando a una carpeta de modelos GGUF, inicias sesión con barra login llama punto cpp, y con barra llama cargas, descargas o buscas modelos en Hugging Face. Después lo eliges con barra model, como cualquier otro.

El router se arranca sin indicar ningún modelo, solo la carpeta donde están: llama server, guion guion models dir con esa carpeta, guion guion no models autoload para que la carga sea explícita desde Pi, guion guion jinja para que funcionen las plantillas de chat y las llamadas a herramientas, y guion c con el tamaño de contexto. Si algo falla, una petición a la ruta health del servidor te dice si está vivo.

Para Ollama, LM Studio, vLLM o cualquier servidor compatible, se usa models punto json. En la demo declaramos un proveedor ollama con cuatro datos: la URL base de su API compatible con OpenAI, el tipo de API, una clave ficticia, porque Ollama no la necesita, y la lista de modelos, en nuestro caso llama tres punto dos. Abrir barra model recarga el fichero, así que los cambios se ven sin reiniciar.

En models punto json, la clave y las cabeceras admiten tres formas: el texto tal cual, una variable de entorno con el signo dólar, o un comando con exclamación. A diferencia de auth punto json, aquí el comando se ejecuta en cada petición y no se guarda en memoria, así que conviene que sea rápido.

El mismo fichero permite ajustar metadatos de modelos que ya existen, con model overrides, por ejemplo para declarar su ventana de contexto real o cuánto dura su caché. Esa duración es justo lo que el cache warming necesita para funcionar.

Con control p llegamos a llama tres punto dos, un modelo de tres mil millones de parámetros que corre en el portátil. Le preguntamos qué hace src barra envio punto js, en dos frases. Respondió en segundos, sin coste y sin que el código saliera de la máquina. Pero la respuesta era falsa: habló de un descuento del diez por ciento y de un IVA del veintiuno, mezclando datos de la conversación, sin haber leído el fichero.

Le dimos otra oportunidad, más explícita: usa la herramienta read para leer el fichero y después dime qué hace. Esta vez llamó a read y leyó el fichero de verdad. Y a continuación repitió, palabra por palabra, la misma respuesta equivocada. Tener herramientas no garantiza usar bien lo que devuelven.

¿Es una cuestión de tamaño? En parte. Un agente de programación necesita seguir instrucciones largas, llamar a herramientas con el formato correcto y razonar sobre lo que obtiene. Llama tres punto dos, con tres mil millones de parámetros, se queda corto en las tres cosas. Pero el tamaño no lo explica todo, como vamos a ver.

Probamos dos modelos más en LM Studio. El primero, fuera de cámara: Ministral tres de catorce mil millones de parámetros, un modelo de razonamiento. Para responder solo la palabra listo tardó treinta y un segundos y gastó casi todos sus tokens en pensar. Con el prompt de Pi, pasaron cinco minutos sin respuesta. El segundo sí lo grabamos: Gemma cuatro E4B, de Google, declarado en models punto json como un proveedor lmstudio. Le hicimos la misma pregunta, pidiéndole que leyera el fichero.

Esta vez sí. Razonó en voz alta, llamó a read, leyó el fichero y respondió en dos frases correctas: cuatro con noventa y cinco de envío por defecto, y gratis cuando el subtotal llega a cuarenta euros. Tardó unos veinte segundos, sin coste y sin que el código saliera del portátil. Solo se dejó la validación del subtotal. Un modelo local pequeño, si está entrenado para usar herramientas, puede servir para tareas acotadas. Y antes de confiar en él, haz lo que hemos hecho aquí: dale una tarea cuya respuesta conozcas y comprueba que la acierta.

**7 · Más allá del selector**

Para cerrar el recorrido, tres piezas avanzadas que conviene conocer, aunque no las usemos hoy. La primera son los virtual models: un modelo que eliges como cualquier otro, pero que en cada petición decide qué modelo físico y qué nivel de razonamiento usar. Sirven para enrutar por tipo de tarea, por coste o por el estado de la conversación. Se registran desde una extensión, y la propia documentación los marca como experimentales.

Cuando usas uno, el pie enseña las dos cosas: el modelo virtual que elegiste y, tras una flecha, el modelo físico que atendió la petición, con su nivel de razonamiento. Y barra session reparte el coste por modelo físico, igual que vimos en nuestra demo. La documentación incluye un ejemplo completo de enrutador que conviene leer antes de escribir el tuyo.

La segunda son los modelos que no conversan. Pi admite clasificadores, que responden preguntas tipadas sobre datos, como elegir una opción o dar una puntuación, y modelos que generan imágenes. No aparecen en barra model; se usan desde codemode o desde extensiones, y los veremos en el vídeo siete.

La tercera son los proveedores propios. Si models punto json se queda corto, porque necesitas una autenticación especial, descubrir modelos dinámicamente o hablar un protocolo distinto, una extensión puede registrar un proveedor completo. La documentación trae ejemplos para GitLab Duo y para una variante de Anthropic.

Y una forma muy práctica de usar todo esto sin abrir la interfaz: el modo print. En la demo salimos con barra quit y ejecutamos pi guion p, sin sesión, con el modelo deepseek flash dos puntos low, y una pregunta: en una frase, qué hace src barra envio punto js. La respuesta, correcta y en una línea: calcula los gastos de envío, cuatro con noventa y cinco por defecto y gratis desde cuarenta euros, validando el subtotal.

Al salir de la sesión, por cierto, Pi imprime cómo retomarla: pi guion guion session y su identificador. Es otra forma de volver exactamente donde lo dejaste, además de guion c y guion r.

Recapitulemos. Un modelo se conecta por suscripción, por clave, en local o con un endpoint compatible. El mismo modelo puede llegar por proveedores distintos, con precios y límites distintos. Barra model elige, barra scoped models define la rotación y control p la recorre. Mayúsculas tabulador ajusta el razonamiento. Y cambiar de modelo a mitad de tarea tiene un coste en caché que barra session te enseña.

La práctica: define en scoped models dos modelos de tu proveedor, uno barato y uno capaz. Haz una tarea pequeña con el barato y pide al capaz que la revise. Después abre barra session y calcula cuánto costó la revisión y cuánto la recarga de caché. Si tienes Ollama o LM Studio, añade un modelo local en models punto json y ponlo a prueba con una pregunta cuya respuesta conozcas.

En el próximo vídeo hablamos de seguridad y aislamiento: por qué Pi no pide permiso antes de ejecutar comandos, qué significa confiar en un proyecto y cómo meter a Pi en un contenedor. Nos vemos allí.

</details>

