---
title: "Vídeo 06 · Personalizar Pi sin código"
description: "Cómo escribir un `AGENTS.md` que funcione, ajustar el system prompt y crear plantillas de prompts y skills para que el agente trabaje a tu manera."
ruta: "pi-oh-my-pi"
orden: 6
duracion: "21 min"
video: "06-personalizar-sin-codigo.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/06-personalizar-sin-codigo.es.vtt"
---

Cómo escribir un `AGENTS.md` que funcione, ajustar el system prompt y crear plantillas de prompts y skills para que el agente trabaje a tu manera.

<p class="guia__nota">Dura 21 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · Cuatro capas sin programar

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Cuatro capas, y el entorno alrededor:** los ficheros de contexto (`AGENTS.md`) dicen qué sabe del proyecto; el system prompt (`SYSTEM.md`, `APPEND_SYSTEM.md`), cómo se comporta siempre; los prompt templates, qué tareas repites con un comando; y las skills, qué conocimiento carga solo cuando hace falta. Alrededor, ajustes, atajos y temas.
- **Dos sitios:** lo personal vive en el directorio del agente (`~/.pi/agent/`) y vale en todos tus proyectos; lo del equipo, en la carpeta `.pi/` del proyecto, y viaja con el repositorio. Ver «Dónde viven las piezas», más abajo.
- **Confianza:** lo de `.pi/` solo se carga si concedes confianza al proyecto (vídeo 05). Los ficheros de contexto son la excepción: se cargan siempre.
- **Personalizar no es acumular:** cada pieza entra de una forma u otra en el contexto, y el contexto cuesta dinero y atención.

### 2 · Un AGENTS punto md que funcione

<p><button type="button" class="ir-a" data-t="114">▶ Ir a 1:54</button></p>

- **Dónde lo busca Pi:** en el directorio del agente, en la carpeta de trabajo y en todas las superiores, y los carga todos. También acepta `CLAUDE.md`, y un `AGENTS.override.md` sustituye al `AGENTS.md` de su misma carpeta. Como la búsqueda va de la carpeta de trabajo hacia arriba, un `AGENTS.md` de subcarpeta (uno para el frontend, otro para la API) se suma al de la raíz cuando arrancas Pi en esa subcarpeta.
- **La prueba de la sesión nueva** (Learn Harness Engineering): abre una sesión sin historial y pregúntate qué es el proyecto, cómo está organizado, cómo se arranca, cómo se verifica que funciona y en qué punto está. Si el repositorio no responde a esas cinco preguntas, el agente las adivina.
- **Un router, no una enciclopedia:** entre 50 y 200 líneas, como mucho 15 reglas duras y enlaces a `docs/` para el detalle. Para empezar, apunta a menos de 100. Cada regla lleva tres datos: de dónde sale, cuándo aplica y cuándo caduca («no uses la librería de fechas antigua hasta que terminemos la migración, en noviembre»). Y lo crítico, arriba y corto: los modelos aprovechan peor lo que queda en medio de un contexto largo (*Lost in the Middle*).
- **Lo que sobra:** el README copiado entero (el agente puede leerlo), las reglas de estilo que ya comprueba el linter (mejor que lo ejecute), las listas largas de comandos raros y una regla nueva por cada fallo sin pensar si es general.
- **La definición de hecho es lo que más rinde:** prueba añadida o actualizada, `npm test` pasando y un resumen de qué cambió y cómo se verificó. *En la demo:* con el AGENTS.md de la tienda (rutina de entrada, mapa, pocas reglas y definición de hecho), el agente mira `git status` y el log y pasa las pruebas antes de tocar nada; al terminar resume qué cambió y cómo lo verificó, y el commit sale como `tienda: añade contarUnidades al carrito`, siguiendo la regla de los mensajes.

> **La evidencia, con matices:** Gloaguen et al. (ETH Zúrich) no encontraron mejora general de éxito con ficheros de contexto, y sí un coste de inferencia más de un 20 % mayor. Lulla et al. midieron una mediana de tiempo un 28 % menor en 124 tareas, sin medir si el resultado era correcto. Conclusión: no te fíes de la intuición, mídelo con una tarea de prueba.

### 3 · El system prompt: SYSTEM y APPEND SYSTEM

<p><button type="button" class="ir-a" data-t="452">▶ Ir a 7:32</button></p>

- **`APPEND_SYSTEM.md` añade, `SYSTEM.md` sustituye:** el primero suma tus instrucciones al final del prompt de Pi sin quitar nada, y casi siempre es el que quieres. El segundo reemplaza las instrucciones de base, que explican cómo usar las herramientas; si lo usas, eso lo explicas tú. Las definiciones de herramientas y las descripciones de skills viajan igual en los dos casos.
- **Dónde:** en el directorio del agente o en `.pi/` del proyecto. Si existe el del proyecto y es de confianza, gana el del proyecto; los ficheros con el mismo nombre no se combinan.
- **Cuándo `SYSTEM.md`:** para usar Pi en algo muy distinto de programar (escritura, análisis de datos) o para experimentar con prompts de sistema. En un proyecto de software, casi nunca.
- *En la demo:* con un `APPEND_SYSTEM.md` de una línea, Pi responde que un pedido de 39,99 € paga 4,95 € de envío y cierra con «Verificado:» y el comando de `node` que lo comprueba. Es el uso típico: una preferencia tuya (idioma, tono, forma de cerrar) en cualquier proyecto. Lo del proyecto, en `AGENTS.md`.

### 4 · Prompt templates

<p><button type="button" class="ir-a" data-t="611">▶ Ir a 10:11</button></p>

- **El prompt que repites, como comando:** un fichero markdown en `prompts/`; el nombre del fichero es el comando (`review.md` → `/review`). El frontmatter lleva la descripción del autocompletado y un `argument-hint`.
- **Restricciones escritas una vez:** un template es el sitio para la prohibición («no edites ningún fichero») y el formato de salida («tres viñetas como máximo»). Así no dependes de acordarte cada vez.
- **Argumentos:** `${1:-…}` es el primer argumento o un valor por defecto; también hay `$1`, `$2`, `$@` y rangos. Los argumentos siguen las comillas de la shell.
- *En la demo:* tras subir a mano el umbral de envío gratis de 40 a 50 €, `/review "las pruebas y los comentarios"` responde con tres viñetas exactas (comentario desfasado, pruebas que fallan, falta una prueba del nuevo umbral) y sin editar nada.
- **La pieza más barata y segura:** un template es solo texto que Pi expande; no ejecuta código ni añade herramientas. Tras editarlo en una sesión abierta, `/reload`. Los de `.pi/prompts/` solo aparecen con confianza.

### 5 · Skills

<p><button type="button" class="ir-a" data-t="787">▶ Ir a 13:07</button></p>

- **Una skill es una carpeta** con un `SKILL.md` y, si hace falta, scripts y referencias. Pi sigue la especificación abierta Agent Skills (agentskills.io), así que son portables entre agentes que la sigan.
- **Carga progresiva:**
  1. Al arrancar, solo entran el nombre, la descripción y la ruta.
  2. Cuando una tarea encaja con la descripción, el modelo lee el `SKILL.md` completo.
  3. Después sigue sus instrucciones.
- **La descripción lo decide todo:** es lo único que ve el modelo para elegirla, así que dice qué hace y cuándo usarla. «Ayuda con PDF» no sirve. Nombre en minúsculas, números y guiones (máx. 64 caracteres); descripción de máx. 1024. Sin descripción, no se carga.
- *En la demo:* sin nombrar la skill, se piden las notas de los seis últimos commits; el modelo lee primero el `SKILL.md` y responde con su formato (grupos, sin hashes, «Incluye 6 commits»). Para forzarla, `/skill:notas-de-version`; con `disable-model-invocation`, solo se usa a mano.
- **¿Skill o AGENTS.md?:** lo que hace falta en casi todas las tareas, en `AGENTS.md`; lo ocasional, en una skill, que solo ocupa una línea hasta que se usa. Revisa las skills de un proyecto ajeno antes de darle confianza: pueden pedir que se ejecuten scripts.

### 6 · Ajustes, atajos y temas

<p><button type="button" class="ir-a" data-t="1010">▶ Ir a 16:50</button></p>

- **`/settings`** abre el panel de ajustes, con buscador, y guarda cada cambio en `settings.json`. Existe en el directorio del agente y en `.pi/`: los del proyecto mandan, y las listas de recursos (extensiones, skills, prompts, temas) se combinan. Algunos ajustes, como la confianza de proyecto por defecto o el calentamiento de caché, solo valen en el del usuario.
- **Ajustes útiles:** nivel de razonamiento al arrancar, modelos de la rotación (vídeo 04), ocultar el razonamiento, herramientas de arranque y exclusiones con `!` en las listas de recursos. Ver el bloque `settings.json`, más abajo.
- **Temas:** `system` (por defecto, a partir de los colores de tu terminal), `automatic` (uno para claro y otro para oscuro), `dark` y `light`. Los tuyos, en `themes/`, se recargan en caliente.
- **Atajos:** en `keybindings.json`, cada acción con nombre recibe una tecla o una lista; un valor sustituye al de serie y una lista vacía lo desactiva. Algunas acciones, como abrir una sesión nueva o el árbol, no tienen atajo de serie. `/hotkeys` muestra los activos, y `/reload` recarga todo sin salir.

### 7 · Qué pieza para cada cosa

<p><button type="button" class="ir-a" data-t="1140">▶ Ir a 19:00</button></p>

| Necesitas… | Pieza | Cuándo entra en el contexto |
|---|---|---|
| Conocimiento del proyecto en casi cada tarea (mapa, cómo se prueba, definición de hecho) | `AGENTS.md`, corto | Siempre |
| Una preferencia tuya en todos los proyectos | `APPEND_SYSTEM.md` | Siempre |
| Reescribir las instrucciones de base | `SYSTEM.md` | Siempre |
| Un prompt que repites | Prompt template | Al invocarlo |
| Un procedimiento con pasos, referencias o scripts, de vez en cuando | Skill | Nombre y descripción siempre; el cuerpo, al usarla |
| Que Pi haga algo nuevo (bloquear un comando, añadir una herramienta) | Extensión (vídeos 08 y 09) | Según la extensión |

- **Mide lo que añades:** el pie muestra el porcentaje de contexto desde el primer mensaje y `/session`, los tokens de la sesión. Lo que no ayuda a terminar mejor o más rápido, sobra.
- **Compartir:** un paquete de Pi puede llevar templates, skills, temas y extensiones, y se instala con `pi install` (vídeo 09).
- **En otros agentes:** Claude Code lee `CLAUDE.md` como Pi lee `AGENTS.md`, y las skills de la especificación Agent Skills son portables entre agentes que la siguen.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### Dónde viven las piezas

```text
~/.pi/agent/          # personal: en todos tus proyectos
  AGENTS.md  SYSTEM.md  APPEND_SYSTEM.md  settings.json  keybindings.json
  prompts/  skills/  themes/  extensions/
<proyecto>/.pi/       # del equipo: viaja con el repositorio (con confianza)
  settings.json  SYSTEM.md  APPEND_SYSTEM.md  prompts/  skills/  themes/  extensions/
```

### La sesión de la tarea: llamadas a herramientas

```text
bash   git status && git log --oneline -5 && ls -R src test
read   src/carrito.js
bash   npm test 2>&1 | tail -30          # antes de tocar nada
read   test/carrito.test.js
edit   src/carrito.js
edit   test/carrito.test.js
bash   npm test 2>&1 | tail -25          # 15/15
```

- Las tres primeras llamadas son la rutina de entrada del `AGENTS.md`: estado de git, leer el código y pasar las pruebas antes de editar.
- Después edita la función y sus dos pruebas nuevas (carrito normal y carrito vacío) y vuelve a pasar las pruebas.

### ~/.pi/agent/APPEND_SYSTEM.md (demo)

```text
Termina cada respuesta con una línea que empiece por «Verificado:» y diga qué comando
ejecutaste para comprobar lo que afirmas, o «Verificado: nada» si no comprobaste nada.
```

### ~/.pi/agent/prompts/review.md → /review

```text
---
description: Revisa los cambios sin commitear
argument-hint: "[foco]"
---
Revisa los cambios sin commitear (`git diff`). No edites ningún fichero.
Céntrate en ${1:-errores, casos límite y pruebas que falten}.
Responde con tres viñetas como máximo.
```

- `description`: el texto que aparece en el autocompletado del comando.
- `argument-hint`: indica que el comando admite un foco opcional.

### Sustituciones en un template

```text
${1:-por defecto}    primer argumento o valor por defecto
$1  $2  …            argumentos sueltos
$@  $ARGUMENTS       todos los argumentos juntos
${@:2}  ${@:2:1}     desde la posición 2 / uno desde la 2
/review "API compatibility"   # comillas: un solo argumento
```

### Una skill es una carpeta

```text
notas-de-version/
├── SKILL.md         # frontmatter + instrucciones
├── scripts/         # opcional
└── references/      # opcional
# especificación abierta: agentskills.io
```

- Solo `SKILL.md` es obligatorio. Las rutas a `scripts/` y `references/` se escriben relativas a la carpeta de la skill.

### ~/.pi/agent/skills/notas-de-version/SKILL.md

```text
---
name: notas-de-version
description: Redacta notas de versión a partir del historial de git. Úsala cuando pidan notas
  de versión, un changelog o un resumen de lo que ha cambiado entre dos puntos.
---
1. Ejecuta `git log --oneline` desde el punto indicado (por defecto, los 10 últimos commits).
2. Agrupa en «Novedades», «Correcciones» y «Pruebas»; omite los grupos vacíos.
3. Cada punto en una línea, en español y sin hashes.
4. Termina con una línea: «Incluye N commits».
```

- `description:` dice qué hace y cuándo usarla: es lo único que ve el modelo para decidir si la carga.

### La sesión de las notas: llamadas a herramientas

```text
read   ~/.pi/agent/skills/notas-de-version/SKILL.md
bash   git log --oneline -6
bash   git log -6 --format='%h%n%s%n%b%n---'
bash   git show --stat …
```

- Lo primero que hace el modelo es leer la skill; después, el historial.

### settings.json: algunos ajustes útiles

```text
"defaultThinkingLevel": "medium",
"enabledModels": ["deepseek/deepseek-flash", "deepseek/deepseek-v4-pro"],
"hideThinkingBlock": true,
"defaultTools": ["read", "grep", "find", "ls"],
"skills": ["./skills", "!./skills/borrador-*"]
```

- `defaultThinkingLevel`: nivel de razonamiento con el que arranca Pi.
- `enabledModels`: los modelos entre los que rotas (vídeo 04).
- `defaultTools`: las herramientas con las que arranca. Aquí sustituye las cuatro de serie (read, bash, edit, write) por un juego de solo lectura con las herramientas opcionales `grep`, `find` y `ls`.
- `!./skills/borrador-*`: carga la carpeta de skills salvo las que encajan con el patrón.

### ~/.pi/agent/keybindings.json

```text
{
  "app.session.new": "ctrl+shift+n",
  "app.session.tree": "ctrl+shift+t",
  "tui.altScreen.pageUp": []
}
```

- Las dos primeras acciones (sesión nueva y árbol de la sesión) no tienen atajo de serie; aquí se les da uno.
- `[]`: desactiva el atajo de esa acción.

## Fuentes

- Documentación oficial de Pi: [configuration.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/configuration.md), [prompt-templates.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md), [skills.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md), [settings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/settings.md), [keybindings.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/keybindings.md), [themes.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/themes.md) y [how-pi-works.md](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/how-pi-works.md). Grabado con Pi 1.0.1.
- *Learn Harness Engineering*, lecciones L03 y L04 y su plantilla de `AGENTS.md` (© 2025 WalkingLab, licencia MIT).
- Gloaguen et al., *Evaluating AGENTS.md* (ETH Zúrich, 2026).
- Lulla et al., arXiv 2601.20404.
- Liu et al., *Lost in the Middle* (2023).
- Especificación Agent Skills: agentskills.io.
- Relacionados en el curso: vídeo 03 (cómo monta Pi cada petición), 05 (confianza de proyecto), 08 y 09 (extensiones y paquetes).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · Cuatro capas sin programar**

Pi es un harness mínimo, pero no rígido. Antes de escribir una sola línea de código, ya puedes cambiar mucho cómo trabaja: qué sabe de tu proyecto, cómo se comporta siempre, qué tareas repites con un comando y qué conocimiento especializado carga solo cuando hace falta. En este vídeo vamos a recorrer esas piezas, a montarlas sobre nuestra tienda y a ver cuándo conviene cada una.

Las piezas son estas. Los ficheros de contexto, como AGENTS punto md, describen el proyecto. El system prompt, con SYSTEM punto md o APPEND SYSTEM punto md, cambia las instrucciones de base. Los prompt templates convierten un prompt que repites en un comando con barra. Las skills empaquetan instrucciones especializadas que el modelo carga cuando las necesita. Y alrededor de todo eso, los ajustes, los atajos de teclado y los temas.

Todas viven en dos sitios. En el directorio del agente, que por defecto es punto pi barra agent en tu carpeta personal, están las piezas personales, que se aplican en todos tus proyectos. Y en la carpeta punto pi del proyecto, las del equipo, que viajan con el repositorio.

Recuerda lo del vídeo anterior: lo que hay dentro de punto pi solo se carga si concedes confianza al proyecto. Los ficheros de contexto son la excepción, porque se cargan siempre. En la demo pondremos nuestras piezas en el directorio del agente, así que no hará falta la pregunta de confianza.

Una advertencia antes de empezar: cada pieza que añades entra, de una forma u otra, en el contexto del modelo, y el contexto cuesta dinero y atención. Personalizar no es acumular. Lo iremos viendo con cada una.

**2 · Un AGENTS punto md que funcione**

Empecemos por la pieza más importante y la más maltratada: AGENTS punto md. Pi lo busca en el directorio del agente, en la carpeta de trabajo y en todas las carpetas superiores, y los carga todos. También acepta CLAUDE punto md, y un AGENTS punto override punto md sustituye al AGENTS punto md de su misma carpeta.

Que se carguen todos tiene dos consecuencias prácticas. La primera: puedes tener un AGENTS punto md general en la raíz del repositorio y otros más concretos en subcarpetas, por ejemplo uno para el frontend y otro para la API, y cada uno se aplica cuando Pi trabaja en esa parte. La segunda: el AGENTS punto md del directorio del agente se aplica en todos tus proyectos, así que es un buen sitio para lo que es tuyo y no del proyecto, aunque, como veremos, para eso hay una pieza mejor.

¿Qué debería contener? El curso Learn Harness Engineering, de WalkingLab, propone una prueba muy útil, la prueba de la sesión nueva. Imagina que abres una sesión sin ningún historial y te haces cinco preguntas: qué es este proyecto, cómo está organizado, cómo se arranca, cómo se verifica que funciona y en qué punto está. Si el repositorio no responde a esas cinco preguntas, el agente las va a adivinar.

La segunda idea del mismo curso es que el fichero de entrada sea un router, no una enciclopedia. Entre cincuenta y doscientas líneas, con unas pocas reglas duras, como mucho quince, y enlaces a documentos más largos para el detalle. Cada regla nueva compite con las demás por la atención del modelo, y un fichero que solo crece acaba lleno de normas que nadie recuerda por qué existen.

Por eso el mismo curso propone que cada regla lleve tres datos: de dónde sale, por ejemplo el incidente o la decisión que la motivó; cuándo aplica; y cuándo caduca. Una regla que dice «no uses la librería de fechas antigua» y añade «hasta que terminemos la migración, en noviembre» se puede borrar con tranquilidad cuando llegue el momento. Una que no lo dice se queda ahí para siempre.

Y la posición importa. El estudio Lost in the Middle, de Liu y otros, mostró que los modelos aprovechan peor la información que queda en medio de un contexto largo que la que está al principio o al final. Así que lo importante, arriba. Y si una regla es crítica, que sea corta y esté donde se vea.

Hay también cosas que sobran en un AGENTS punto md. Copiar el README entero, que el agente puede leer si lo necesita. Guías de estilo que ya comprueba el linter: mejor que el agente ejecute el linter. Listas largas de comandos que casi nunca se usan. Y reglas escritas después de cada fallo sin preguntarse si son generales. Todo eso diluye lo importante.

Con esas ideas, y a partir de la plantilla de AGENTS punto md de WalkingLab, que tiene licencia MIT, hemos escrito el de nuestra tienda. Cuatro secciones. Al empezar: mirar git status y el log, y pasar las pruebas antes de tocar nada. Un mapa de los ficheros. Unas pocas reglas, como redondear a céntimos y que los mensajes de commit vayan en español, en imperativo y empezando por tienda dos puntos. Y una definición de hecho.

Esa última sección es la que más rinde. «Hecho» significa que has añadido o actualizado la prueba del cambio, que has ejecutado npm test y pasa, y que has resumido qué cambió y cómo lo verificaste. Sin esa definición, un agente tiende a declarar victoria en cuanto el código compila.

La plantilla original también trae una rutina de salida, que conviene conocer aunque en una tienda de juguete no la necesitemos: antes de terminar una sesión larga, actualizar el fichero de progreso, anotar los riesgos y bloqueos, hacer commit cuando el trabajo está en un estado seguro y dejar el repositorio listo para que la siguiente sesión arranque sin adivinar. Volveremos a ella en el bloque de metodología.

Lo ponemos a prueba con una tarea pequeña: añadir a carrito punto js una función contar unidades, que devuelva el total de unidades del carrito. Fíjate en lo que hace antes de escribir nada: ejecuta git status y git log con los cinco últimos commits, lee el código y pasa las pruebas. Es exactamente la rutina de entrada que le pedimos.

Después edita dos ficheros, la función y dos pruebas nuevas, una con un carrito normal y otra con un carrito vacío, y vuelve a pasar las pruebas: quince de quince. Y la respuesta sigue la definición de hecho: qué cambió y cómo se verificó. Termina preguntando si hace el commit.

Le decimos que sí. En su razonamiento lo dice en voz alta: seguir las reglas de los mensajes de commit, en español, en imperativo y empezando por tienda dos puntos. Y el commit queda así: tienda dos puntos añade contar unidades al carrito.

Un apunte honesto sobre la evidencia. Un estudio de la ETH de Zúrich, de Gloaguen y otros, encontró que los ficheros de contexto de los repositorios, en general, no mejoraban la tasa de éxito en sus pruebas y encarecían la inferencia más de un veinte por ciento. Su recomendación es mantener al mínimo los requisitos escritos a mano. Otro estudio, de Lulla y otros, midió con y sin AGENTS punto md en ciento veinticuatro tareas: la mediana del tiempo bajó un veintiocho por ciento, aunque no medía si el resultado era correcto.

La conclusión práctica es la misma que en todo el curso: no te fíes de la intuición, mídelo. Un AGENTS punto md corto, con la rutina de entrada, el mapa, pocas reglas y la definición de hecho, y una tarea de prueba para comprobar que de verdad cambia el comportamiento. Como acabamos de hacer.

**3 · El system prompt: SYSTEM y APPEND SYSTEM**

AGENTS punto md describe el proyecto. Pero a veces quieres cambiar cómo se comporta Pi en todos tus proyectos, o reemplazar sus instrucciones de base. Para eso están dos ficheros: SYSTEM punto md y APPEND SYSTEM punto md.

SYSTEM punto md sustituye el system prompt por defecto de Pi. Es la opción más potente y la más delicada, porque el prompt de base explica al modelo cómo usar las herramientas, y si lo reemplazas eres tú quien tiene que explicarlo. APPEND SYSTEM punto md, en cambio, añade tus instrucciones al final del prompt de Pi, sin quitar nada. En la mayoría de los casos, es el que quieres.

Para entender qué estás tocando, recuerda cómo monta Pi cada petición, que vimos en el vídeo tres. El system prompt se construye con las instrucciones de base de Pi y los ficheros de contexto que encuentra, y la petición lleva además las definiciones de las herramientas y las descripciones de las skills. APPEND SYSTEM se suma a la parte de instrucciones. SYSTEM reemplaza las instrucciones de base, pero las herramientas siguen viajando igual.

Los dos pueden vivir en el directorio del agente o en la carpeta punto pi del proyecto. Si existe el del proyecto y el proyecto es de confianza, gana el del proyecto. Y los ficheros con el mismo nombre no se combinan: o uno u otro.

¿Cuándo tiene sentido SYSTEM punto md? Cuando quieres usar Pi para algo muy distinto de programar, por ejemplo como asistente de escritura o de análisis de datos, y las instrucciones de base te estorban. O cuando estás experimentando con prompts de sistema y quieres control total. Para el día a día de un proyecto de software, casi nunca.

Para la demo, en el directorio del agente creamos un APPEND SYSTEM punto md con una sola instrucción: termina cada respuesta con una línea que empiece por «Verificado:» y diga qué comando ejecutaste para comprobar lo que afirmas, o «Verificado: nada» si no comprobaste nada.

Arrancamos Pi en la tienda y preguntamos cuánto cuesta el envío de un pedido de treinta y nueve con noventa y nueve. Pi lee envio punto js, ve que el envío es gratis desde cuarenta euros, y lo comprueba ejecutando la función con node. Responde que cuesta cuatro con noventa y cinco, y cierra con la línea que le pedimos: verificado, con el comando de node y su resultado.

Es un ejemplo pequeño, pero muestra el uso típico de APPEND SYSTEM: una preferencia personal que quieres en cualquier proyecto, como el idioma, el tono o una forma de cerrar las respuestas. Lo que es del proyecto va en AGENTS punto md, y lo que es tuyo, aquí. Después de la demo borramos el fichero, para que no aparezca en el resto del curso.

**4 · Prompt templates**

La tercera pieza son los prompt templates. Si te descubres escribiendo una y otra vez el mismo prompt, por ejemplo «revisa los cambios y busca errores», conviértelo en un comando. Un template es un fichero markdown en la carpeta prompts, y el nombre del fichero se convierte en el comando.

El nuestro se llama review punto md. Empieza con un frontmatter con dos campos: la descripción, que aparece en el autocompletado, y argument hint, que indica que admite un foco opcional, entre corchetes. Debajo, el prompt: revisa los cambios sin commitear con git diff, no edites ningún fichero, céntrate en el foco que te pase, o si no en errores, casos límite y pruebas que falten, y responde con tres viñetas como máximo.

Fíjate en que el prompt incluye una prohibición explícita, no edites ningún fichero, y un formato de salida, tres viñetas. Un template es el sitio perfecto para esas restricciones, porque las escribes una vez, bien pensadas, y no dependes de acordarte cada vez que pides una revisión.

Ese «o si no» es la sintaxis dólar llave uno dos puntos guion: el primer argumento, o un valor por defecto. Los templates también admiten dólar uno, dólar dos y siguientes, dólar arroba para todos los argumentos juntos, y rangos. Los argumentos siguen las comillas de la shell, así que un foco con espacios va entre comillas.

Para tener algo que revisar, cambiamos a mano el límite de envío gratis de cuarenta a cincuenta euros, sin tocar ni las pruebas ni el comentario. Arrancamos Pi, y la cabecera ya enseña la sección prompts con barra review. Al escribir barra r e, el menú lo ofrece junto a los comandos de Pi, con su argumento, una u de usuario y la descripción.

Ejecutamos barra review con el foco las pruebas y los comentarios. Pi mira el diff, lee el fichero y las pruebas, ejecuta npm test para confirmar que fallan, y responde con exactamente tres viñetas: el comentario de envio punto js sigue diciendo cuarenta euros, las pruebas esperan el envío gratis desde cuarenta y fallan, y falta una prueba que refleje el nuevo umbral. Sin editar nada, como le pedimos.

Un template no ejecuta código ni añade herramientas: es texto que Pi expande antes de enviarlo. Por eso es la pieza más barata y más segura. Si después de editar uno estás en una sesión abierta, usa barra reload para cargarlo. Y si el template es del proyecto, en punto pi barra prompts, solo aparece cuando el proyecto tiene confianza.

Algunas ideas de templates que suelen rendir: uno para redactar el mensaje de commit a partir del diff, con las reglas del equipo; uno para explicar un fichero a alguien que llega nuevo; uno para planificar una tarea sin tocar código; o uno para preparar la descripción de una pull request. Si son del equipo, en la carpeta punto pi barra prompts del repositorio, para que todos los tengan.

**5 · Skills**

La cuarta pieza son las skills. Una skill es una carpeta con un fichero SKILL punto md y, si hace falta, scripts, referencias y otros ficheros de apoyo. Pi implementa la especificación abierta Agent Skills, así que las skills son portables entre agentes que la sigan.

Lo interesante es cómo se cargan. Al arrancar, Pi no mete el contenido de las skills en el contexto: solo su nombre, su descripción y su ruta. Cuando una tarea encaja, el modelo lee el SKILL punto md completo y sigue sus instrucciones. Es una carga progresiva: el detalle solo entra cuando hace falta.

Por eso la descripción es lo más importante de una skill. Es lo único que el modelo ve para decidir si la usa, así que debe decir qué hace y cuándo aplicarla. Una descripción como «ayuda con PDF» no sirve. La nuestra dice: redacta notas de versión a partir del historial de git; úsala cuando pidan notas de versión, un changelog o un resumen de lo que ha cambiado entre dos puntos.

El cuerpo tiene cuatro pasos: ejecutar git log desde el punto indicado, o los diez últimos commits; agrupar los cambios en novedades, correcciones y pruebas, omitiendo los grupos vacíos; escribir cada punto en una línea, en español y sin hashes; y terminar con una línea que diga cuántos commits incluye.

Unas reglas de forma, para que la skill sea válida y portable: el nombre solo lleva minúsculas, números y guiones, sin guiones dobles ni al principio o al final, y como mucho sesenta y cuatro caracteres; la descripción, como mucho mil veinticuatro. Pi carga el resto aunque tenga avisos, pero un SKILL punto md mal formado o sin descripción no se carga.

En la grabación cargamos solo esta skill, con guion guion skill y su ruta, para que no aparezcan las skills personales del equipo. La cabecera la enseña en la sección skills, junto al contexto y al template. Y le pedimos, sin nombrarla, que prepare las notas de versión de los últimos seis commits.

El primer paso del modelo fue leer el SKILL punto md. Después ejecutó git log y revisó los commits, y respondió con el formato de la skill: novedades, correcciones, sin hashes, y la línea final, incluye seis commits. El grupo de pruebas no aparece porque, como explicó en su razonamiento, ningún commit era solo de pruebas.

El modelo puede no cargar una skill aunque encaje. Para forzarla, cada skill tiene su comando, barra skill dos puntos y el nombre, y lo que escribas después se le pasa como petición. Y si quieres que una skill solo se use así, a mano, el campo disable model invocation la oculta de la selección automática.

Una skill también puede traer scripts y ficheros de referencia. Las rutas se escriben relativas a la carpeta de la skill, y Pi le dice al modelo dónde está la skill para que pueda resolverlas. Así puedes empaquetar, por ejemplo, un script que extrae datos de un formato concreto junto con las instrucciones para usarlo.

Dónde se ponen: en la carpeta skills del directorio del agente o del proyecto, y también en las rutas estándar de Agent Skills, punto agents barra skills, en tu carpeta personal o en el proyecto. Y como las skills pueden pedir al modelo que ejecute scripts o modifique ficheros, revisa las de un proyecto ajeno antes de concederle confianza.

¿Skill o AGENTS punto md? La pregunta clave es cuántas veces hace falta. Lo que el agente necesita en casi todas las tareas, en AGENTS punto md, porque se carga siempre. Lo que solo hace falta de vez en cuando, en una skill, porque en el contexto solo ocupa una línea con su nombre y descripción hasta que se usa. Meter en AGENTS punto md un procedimiento de veinte pasos que se usa una vez al mes es pagar por él en cada petición.

**6 · Ajustes, atajos y temas**

La última capa es la del entorno de trabajo. Barra settings abre el panel de ajustes, con treinta y dos opciones: compactación automática, bloqueo de imágenes, comandos de skills, márgenes, el número de sugerencias del autocompletado y más. Se puede buscar escribiendo, y cada cambio se guarda en settings punto json.

Ese fichero existe en el directorio del agente y en la carpeta punto pi del proyecto. Los ajustes del proyecto mandan sobre los del usuario, y las listas de recursos, como extensiones, skills, prompts y temas, se combinan. Algunos ajustes, como default project trust o cache warming, solo se pueden poner en el del usuario.

Algunos ajustes que merece la pena conocer: default thinking level, el nivel de razonamiento con el que arranca Pi; enabled models, los modelos de la rotación, como vimos en el vídeo cuatro; hide thinking block, para ocultar el razonamiento en pantalla; y default tools, las herramientas con las que arranca. Y las listas de recursos admiten exclusiones con exclamación, para cargar una carpeta de skills salvo alguna en concreto.

Uno de esos ajustes es el tema. Buscamos theme y aparecen las opciones: system, el de por defecto, que construye los colores a partir de los de tu terminal; automatic, que usa un tema para el modo claro y otro para el oscuro; y dark y light. También puedes crear tu propio tema en la carpeta themes, y Pi lo recarga en caliente mientras lo editas.

Los atajos de teclado se cambian en keybindings punto json, en el directorio del agente. Cada acción tiene un nombre, como app punto session punto new, y se le asigna una tecla o una lista. Algunas acciones, como abrir una sesión nueva o el árbol de la sesión, no tienen atajo por defecto y puedes dárselo tú. Un valor configurado sustituye al de serie, y una lista vacía lo desactiva.

Barra hotkeys muestra los atajos activos del editor y de la aplicación, una buena chuleta mientras te acostumbras. Y recuerda: si cambias a mano ajustes, atajos, instrucciones o recursos con una sesión abierta, barra reload los vuelve a cargar sin salir.

**7 · Qué pieza para cada cosa**

Para terminar, una guía rápida para elegir. Si es conocimiento del proyecto que el agente necesita siempre, como el mapa, cómo se prueba o la definición de hecho, va en AGENTS punto md, corto. Si es una preferencia tuya para todos los proyectos, en APPEND SYSTEM punto md. Y solo si necesitas reescribir las instrucciones de base, en SYSTEM punto md.

Si es un prompt que repites, un template. Si es un procedimiento con más contexto, con pasos, referencias o scripts, que solo hace falta en algunas tareas, una skill. Y si necesitas que Pi haga algo nuevo, como bloquear un comando o añadir una herramienta, ya no hablamos de personalizar sin código: es una extensión, y llega en los vídeos ocho y nueve.

Y mide lo que añades. El pie de Pi te enseña el porcentaje de contexto ocupado desde el primer mensaje, y barra session te da los tokens de cada sesión. Si después de añadir un AGENTS punto md enorme y diez skills el contexto arranca mucho más lleno, cada petición cuesta más. Lo que no ayuda a terminar tareas mejor o más rápido, sobra.

Todo esto se puede empaquetar y compartir. Un paquete de Pi puede incluir templates, skills, temas y extensiones, y se instala con pi install. Los veremos en el vídeo nueve.

Antes de cerrar, un aviso sobre la demo. A partir de este vídeo, nuestra tienda tiene su AGENTS punto md, así que lo verás en la cabecera de todas las demos que vienen. El template, la skill y los atajos los hemos retirado del directorio del agente, para que no se cuelen en los próximos vídeos.

La práctica: haz la prueba de la sesión nueva con un proyecto tuyo y escribe un AGENTS punto md de menos de cien líneas con la rutina de entrada, el mapa, pocas reglas y la definición de hecho. Ponlo a prueba con una tarea pequeña. Después crea un template para el prompt que más repites, y una skill para un procedimiento que haces de vez en cuando.

En el próximo vídeo, MCP y codemode. Nos vemos allí.

</details>

