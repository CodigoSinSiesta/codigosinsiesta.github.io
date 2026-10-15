---
title: "Vídeo 04 · Modelos y proveedores"
description: "todas las formas de conectar un modelo, cómo rotar entre varios y ajustar cuánto razonan, y lo que cuesta de verdad cambiar de modelo a mitad de tarea. Cerramos probando modelos locales."
ruta: "pi-oh-my-pi"
orden: 4
duracion: "20 min"
video: "04-modelos-y-proveedores.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/04-modelos-y-proveedores.es.vtt"
---

todas las formas de conectar un modelo, cómo rotar entre varios y ajustar cuánto razonan, y lo que cuesta de verdad cambiar de modelo a mitad de tarea. Cerramos probando modelos locales.

<p class="guia__nota">Dura 20 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Cómo se conecta un modelo

<p><button type="button" class="ir-a" data-t="18">▶ Ir a 0:18</button></p>

- **Pi es el harness:** El modelo lo pones tú — Conectar, elegir, ajustar cuánto piensa y saber lo que cuesta.
- **Cómo conectar un modelo**
  - `/login` · Suscripción: ChatGPT, Claude, Copilot…
  - `KEY` · Clave de API: /login o variable de entorno
  - `GGUF` · Modelo local: router de llama.cpp
- **Y dos casos menos habituales**
  - `models.json` · Endpoint compatible: Ollama, LM Studio, proxies…
  - `extensión` · Proveedor propio: protocolo o autenticación especial
- *En terminal:* Dónde busca Pi las credenciales (más abajo, en «Código y comandos»)
- *En terminal:* auth.json · la clave, obtenida con un comando (más abajo, en «Código y comandos»)
- *En terminal:* Comprobar un proveedor (más abajo, en «Código y comandos»)
- **Proveedores de la demo**
  - `deepseek` · DeepSeek: Flash y V4 Pro
  - `openrouter` · OpenRouter: el de los vídeos 01–02
  - `meta` · Meta: sin facturación: no se usa
  - `ollama` · Ollama: local, sin cuenta

### 2 · El catálogo

<p><button type="button" class="ir-a" data-t="187">▶ Ir a 3:07</button></p>

- *En la demo:* pi --list-models deepseek
- *En la demo:* El mismo modelo, dos proveedores
- **El camino importa**
  - `€` · Precio: por proveedor
  - `↔` · Límites: contexto y salida
  - `👁` · Privacidad: quién ve tus datos
  - `✓` · Fiabilidad: recuerda los 429
- *En terminal:* El catálogo (más abajo, en «Código y comandos»)
- **Antes de abrir cuenta:** pi.dev/models — Proveedores, identificadores, capacidades, límites y precios.
- **Dos columnas que se confunden**
  - `context` · Ventana de contexto: todo lo que ve en una petición
  - `max-out` · Salida máxima: lo que escribe en una respuesta
- *En la demo:* El modelo local, declarado en models.json
- **¿Falta un modelo?:** Probablemente falta la sesión de su proveedor — /model solo enseña proveedores con autenticación utilizable.

### 3 · Elegir y rotar

<p><button type="button" class="ir-a" data-t="339">▶ Ir a 5:39</button></p>

- **/model**
  - `Ctrl+L` · Abrir: el selector
  - `Enter` · Esta sesión: el modelo elegido
  - `Ctrl+S` · Predeterminado: para las nuevas
- **Rotar**
  - `Ctrl+P` · Siguiente: modelo
  - `⇧Ctrl+P` · Anterior: modelo
- *En la demo:* /scoped-models: tres de 408
- *En terminal:* La rotación, guardada o al arrancar (más abajo, en «Código y comandos»)
- *En terminal:* Elegir modelo desde la línea de comandos (más abajo, en «Código y comandos»)
- *En terminal:* /settings.json de la demo (más abajo, en «Código y comandos»)

### 4 · Cuánto piensa el modelo

<p><button type="button" class="ir-a" data-t="457">▶ Ir a 7:37</button></p>

- **Niveles de razonamiento:** off → minimal → low → medium → high → xhigh → max
- *En la demo:* Shift+Tab: de high a max
- *En terminal:* El nivel, al arrancar (más abajo, en «Código y comandos»)
- *En la demo:* Al volver a Flash: thinking off
- **¿Cuánto razonamiento?**
  - `↑` · Tareas difíciles: depurar, revisar
  - `↓` · Tareas claras: editar, preguntar
- *En la demo:* El razonamiento también se cobra

### 5 · Cambiar de modelo a mitad de tarea

<p><button type="button" class="ir-a" data-t="573">▶ Ir a 9:33</button></p>

- **La estrategia:** Flash · high (hace el trabajo) → V4 Pro · max (lo revisa)
- *En la demo:* Flash: 13/13 por 0,002 $
- *En la demo:* V4 Pro · max revisa sin editar
- *En la demo:* Una revisión: cinco veces la tarea
- **Por qué cae la caché:** La caché es de cada modelo — La primera petición del modelo nuevo se paga entera.
- *En la demo:* /session: coste por modelo y caché repagada
- *En terminal:* Cada cambio queda en la sesión (más abajo, en «Código y comandos»)
- *En la demo:* Cache warming: inactive
- **Conclusión práctica:** Agrupa el trabajo: barato para hacer, caro para revisar — Y cuando dudes, mira /session.

### 6 · Modelos locales

<p><button type="button" class="ir-a" data-t="748">▶ Ir a 12:28</button></p>

- **llama.cpp en Pi:** llama-server (router de GGUF) → /login llama.cpp (conectar) → /llama (cargar y descargar) → /model (elegirlo)
- *En terminal:* El router de llama.cpp (más abajo, en «Código y comandos»)
- *En terminal:* /models.json de la demo (más abajo, en «Código y comandos»)
- **apiKey en models.json**
  - `"…"` · Texto: tal cual
  - `$VAR` · Variable: de entorno
  - `!cmd` · Comando: en cada petición
- **modelOverrides:** Ajusta lo que el catálogo no sabe de tu modelo — Ventana de contexto real, duración de la caché…
- *En la demo:* Llama 3.2 3B: rápido, gratis… y equivocado
- *En la demo:* Lee el fichero y repite el error
- **Lo que pide un agente**
  - `1` · Instrucciones largas: seguirlas
  - `2` · Herramientas: formato correcto
  - `3` · Razonar: sobre lo que obtiene
- *En terminal:* Fuera de cámara: Ministral 3 14B (razonamiento) en LM Studio (más abajo, en «Código y comandos»)
- *En terminal:* models.json: Gemma 4 E4B servido por LM Studio (más abajo, en «Código y comandos»)
- *En la demo:* Gemma 4 E4B: lee el fichero y acierta
- **Antes de confiar:** Una tarea cuya respuesta conoces y comprueba que la acierta — Un modelo local pequeño sirve si sabe usar herramientas: pruébalo antes.

### 7 · Más allá del selector

<p><button type="button" class="ir-a" data-t="978">▶ Ir a 16:18</button></p>

- **Virtual models · experimental:** Un modelo que elige modelo en cada petición — Por tarea, por coste o por estado de la conversación. Se registran desde una extensión.
- *En terminal:* Un virtual model en el pie (ejemplo de la documentación) (más abajo, en «Código y comandos»)
- **Modelos que no conversan**
  - `classify` · Clasificadores: opción, sí/no, puntuación
  - `images` · Imagen: generan imágenes
- **Proveedores propios:** pi.registerProvider() — Autenticación especial, modelos dinámicos u otro protocolo. Ejemplos: GitLab Duo, Anthropic.
- *En terminal:* Modo print, con modelo y nivel (más abajo, en «Código y comandos»)
- *En la demo:* Una línea, correcta
- *En terminal:* Al salir, Pi te dice cómo volver (más abajo, en «Código y comandos»)
- **Recapitulando**
  - `🔌` · Conectar: suscripción, clave, local, endpoint
  - `↔` · Proveedor: mismo modelo, otros precios
  - `Ctrl+P` · Rotar: /model · /scoped-models
  - `$` · Coste: caché al cambiar
- **Práctica:** scoped-models (barato y capaz) → Tarea + revisión (uno y otro) → /session (calcula el coste) → Local (ponlo a prueba)
- **Próximo vídeo:** Seguridad y aislamiento — Sin permisos por defecto, confianza de proyecto y contenedores.

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

- `auth.json`: Lo que guarda /login
- `variables de entorno`: Servidores y CI
- `1. pi --api-key`: Gana la primera

### auth.json · la clave, obtenida con un comando

```text
{ "anthropic": { "type": "api_key",
    "key": "!security find-generic-password -ws anthropic" } }
```

- `!security`: Un comando con !
- `find-generic-password`: Del llavero; se guarda en memoria

### Comprobar un proveedor

```text
pi auth check --provider deepseek --json
ready   → salida 0 · not_ready → 1 · invalid → 2
# ⚠ pi auth print-api-key y print-bearer-token imprimen secretos
```

- `auth check`: Para scripts
- `print-api-key`: Nunca en una grabación

### El catálogo

```text
# incluido en la instalación + datos de pi.dev
pi update --models     # forzar la actualización
PI_OFFLINE=1 pi        # sin red: el catálogo en caché sigue valiendo
```

- `incluido`: Dos capas
- `update --models`: Actualizar
- `PI_OFFLINE`: Sin red

### La rotación, guardada o al arrancar

```text
# /scoped-models → Ctrl+S  →  settings.json
"enabledModels": ["deepseek/deepseek-flash", "deepseek/deepseek-v4-pro", "ollama/llama3.2:latest"]
pi --models "deepseek/*,ollama/*"
```

- `Ctrl+S`: Guardar
- `--models`: Al arrancar, con comodines

### Elegir modelo desde la línea de comandos

```text
pi --model deepseek/deepseek-flash
pi --provider deepseek --model flash
pi --api-key sk-…   # temporal, no se guarda
```

- `--model deepseek`: proveedor/id o un trozo
- `--provider`: Si existe en varios
- `--api-key`: Temporal

### /settings.json de la demo

```text
{
  "defaultProvider": "deepseek",
  "defaultModel": "deepseek-flash"
}
```

- `defaultProvider`: Proveedor
- `"deepseek-flash"`: Modelo

### El nivel, al arrancar

```text
pi --model deepseek/deepseek-v4-pro --thinking max
pi --model deepseek/deepseek-flash:low
```

- `--thinking`: Opción
- `:low`: Sufijo del modelo

### Cada cambio queda en la sesión

```text
jq -c 'select(.type=="model_change") | {provider, modelId}' <sesión>
{"provider":"deepseek","modelId":"deepseek-flash"}
{"provider":"deepseek","modelId":"deepseek-v4-pro"}
{"provider":"ollama","modelId":"llama3.2:latest"}
```

- `model_change`: Una entrada por cambio
- `deepseek-v4-pro`: Para repartir el coste

### El router de llama.cpp

```text
llama-server --models-dir ~/models --no-models-autoload --jinja \
  --host 127.0.0.1 --port 8080 -ngl 999 -c 32768
curl http://127.0.0.1:8080/health
```

- `--models-dir`: La carpeta de GGUF
- `--no-models-autoload`: Carga desde /llama
- `--jinja`: Plantillas y herramientas
- `/health`: Diagnóstico

### /models.json de la demo

```text
{ "providers": { "ollama": {
  "baseUrl": "http://localhost:11434/v1",
  "api": "openai-completions",
  "apiKey": "ollama",
  "models": [{ "id": "llama3.2:latest", "name": "Llama 3.2 3B (local)" }] } } }
```

- `baseUrl`: URL base
- `"api"`: Tipo de API
- `"apiKey"`: Ficticia
- `"models"`: Modelos

### Fuera de cámara: Ministral 3 14B (razonamiento) en LM Studio

```text
«Di solo: listo»  →  31 s · 398 de 400 tokens razonando
pi -p --model lmstudio/…ministral-3-14b-reasoning "¿Qué hace src/envio.js?"
→ 5 minutos sin respuesta (timeout)
```

- `31 s`: Lento
- `timeout`: No da para agente

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

- `1234`: Servidor de LM Studio
- `gemma-4-e4b`: El modelo cargado
- `pi --model`: La misma pregunta

### Un virtual model en el pie (ejemplo de la documentación)

```text
auto • high  →  gpt-5.6-luna • medium
/session  →  coste por modelo físico
```

- `→`: El modelo físico
- `/session`: Coste repartido

### Modo print, con modelo y nivel

```text
pi -p --no-session --model deepseek/deepseek-flash:low "En una frase: ¿qué hace src/envio.js?"
```

- `pi -p`: Sin interfaz
- `:low`: Poco razonamiento

### Al salir, Pi te dice cómo volver

```text
/quit
To resume this session: pi --session 01a1069c-ff81-71fb-bd15-2582d02197ed
pi -c   ·   pi -r
```

- `--session`: Por identificador
- `pi -c`: O la última / el selector

## Fuentes

- Documentación instalada de Pi 1.0.1: `docs/models.md`, `docs/providers.md`, `docs/settings.md` (`cacheWarming`),
  `docs/llama-cpp.md`, `docs/virtual-models.md`, `docs/custom-provider.md`.
- Documentación oficial de Pi: [custom-provider.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/custom-provider.md), [llama-cpp.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/llama-cpp.md), [models.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md), [providers.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md), [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md), [virtual-models.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/virtual-models.md)

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

