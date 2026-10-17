---
title: "Vídeo 14 · Modelos, roles y razonamiento"
description: "Asignar modelos por rol (rápido, lento, planificador, revisor) y usar un «advisor» que revisa el trabajo de un modelo más barato."
ruta: "pi-oh-my-pi"
orden: 14
duracion: "23 min"
video: "14-modelos-roles-y-razonamiento.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/14-modelos-roles-y-razonamiento.es.vtt"
---

Asignar modelos por rol (rápido, lento, planificador, revisor) y usar un «advisor» que revisa el trabajo de un modelo más barato.

<p class="guia__nota">Dura 23 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · De una lista de modelos a los roles

<p><button type="button" class="ir-a" data-t="19">▶ Ir a 0:19</button></p>

- La estrategia del vídeo 04 era «uno hace, otro más capaz revisa». Funcionó, pero a mano: cambiando de modelo y pagando la caché en cada cambio.
- omp cambia la pregunta. En Pi te preguntas qué modelo tienes activo; en omp, qué modelo hace cada trabajo. Un rol es un nombre de trabajo (`default`, `smol`, `advisor`…) que apunta a un modelo.
- Sobre los roles monta dos piezas que en Pi tendrías que programar: un traspaso automático entre modelos (`/prewalk`) y un segundo modelo que revisa cada turno (`/advisor`).
- Modelos de la demo, con la misma clave: DeepSeek V4.1 Flash (`deepseek/deepseek-flash`), el rápido, y DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), el capaz. Pro tiene una tarifa de lista unas cuatro veces mayor, aunque durante la grabación DeepSeek le aplicaba la de Flash. Comprueba la tarifa actual con `omp models deepseek`.

### 2 · Qué es un rol

<p><button type="button" class="ir-a" data-t="141">▶ Ir a 2:21</button></p>

- Los roles se guardan en `modelRoles`, dentro del `config.yml` del perfil (no lo confundas con `models.yml`, que define proveedores y modelos). Cada rol lleva un selector: proveedor e id, un nombre aproximado o una lista separada por comas, de la que se usa el primero disponible. *En terminal:* config.yml del perfil (más abajo, en «Código y comandos»).
- Roles de chat: `default` (con el que conversas), `smol` (rápido), `slow` (razonamiento profundo), `plan` (modo plan, vídeo 15), `vision`, `commit`, `tiny` y `memory` (trabajo de fondo, como títulos y memoria), `task` (subagentes) y `advisor` (revisor). Hay además roles por tipo de modelo (imagen, web, voz, `judge`…) que también hacen llamadas.
- Los roles sin asignar heredan: `smol` y `slow` toman el `default`; `tiny` toma lo que tenga `smol`, y `memory` lo que tenga `tiny`. Si pones `smol` en otro proveedor, los títulos de sesión también se van allí, sin que lo veas.
- El `advisor` sin asignar no hereda el modelo de la conversación: usa `slow` o una cadena interna de modelos potentes, que puede ser cara. Asígnalo a mano y compruébalo.
- Sintaxis: `@slow` es un alias del modelo que tenga ese rol; `:low` al final fija el esfuerzo. Así, Flash ocupa dos roles con distinto esfuerzo.

### 3 · /model, /switch y Ctrl+P

<p><button type="button" class="ir-a" data-t="283">▶ Ir a 4:43</button></p>

- Antes de cambiar nada, el selector de comandos te dice gratis el modelo activo, los presets y si el advisor está encendido.
- `/model` (Alt+M) abre el centro de modelos, con velocidad, ventana y precio de cada uno. Al asignar un modelo a un rol pregunta el esfuerzo para ese rol. En Pi elegías y luego guardabas; aquí asignar es guardar, en la configuración del perfil.
- `/switch` (Alt+P) cambia el modelo solo en esta sesión y acepta lo mismo que un rol: `/switch @slow`.
- Ctrl+P ya no rota por tus modelos favoritos, sino por roles, en el orden de `cycleOrder` (de fábrica, `smol`, `default`, `slow`).
- Cambiar de modelo sigue pagando la caché (vídeo 04). La costumbre nueva es asignar cada trabajo a un rol y dejar que omp cambie en el momento justo. *En terminal:* Desde la línea de comandos.

### 4 · Cuánto piensa: /effort

<p><button type="button" class="ir-a" data-t="484">▶ Ir a 8:04</button></p>

- `/effort` fija el razonamiento de la sesión; Shift+Tab los recorre, como en Pi. Las sesiones nuevas arrancan con `defaultThinkingLevel` (de fábrica, `high`).
- Cada modelo admite solo algunos niveles. *En la demo:* Pro rechaza `medium` y lista los que acepta: off, auto, low, high y max.
- `auto`, que Pi no tiene: antes de cada turno el rol `judge` estima la dificultad y elige el esfuerzo. Es otra llamada a un modelo. Con `auto` activo, escribir `ultrathink` en tu mensaje sube ese turno al tope del modelo.
- Regla del vídeo 04: más esfuerzo al depurar y revisar, menos en ediciones bien especificadas. La novedad es que el esfuerzo viaja con el rol: `smol` con low para lo mecánico, `slow` y `advisor` con high para pensar y revisar.

### 5 · Presets y nivel de servicio

<p><button type="button" class="ir-a" data-t="600">▶ Ir a 10:00</button></p>

- `/modelpreset save <nombre>` guarda todos los roles y el nivel de razonamiento por defecto; `list`, `delete` y `switch` los gestionan.
- `save` escribe en la configuración global del perfil. `switch` reescribe los roles, quita los que el preset no tiene y cambia el modelo activo al `default` del preset. Guarda el preset cuando tengas todos los roles asignados.
- Uso práctico: un preset para el día a día, con el modelo rápido en casi todo, y otro para diseño o depuración difícil, con modelos más capaces.
- `/fast` pide el carril prioritario del proveedor (más rápido y, normalmente, más caro) y `/slow` el carril flex (más barato y con más espera), donde existan. Cambian el carril, no el modelo. Con DeepSeek, el segmento de coste marca con una flecha si estás en hora punta.

### 6 · /prewalk: planifica el capaz, ejecuta el rápido

<p><button type="button" class="ir-a" data-t="716">▶ Ir a 11:56</button></p>

- Prewalk es un traspaso único: el modelo activo explora, escribe la lista de tareas y hace la primera edición; en ese momento omp pasa la sesión al modelo de `smol`. Viene apagado.
- Requisitos: `smol` tiene que ser otro modelo u otro nivel de esfuerzo que el activo, y su proveedor necesita credenciales.
- El disparador: con la herramienta `todo` activa, primero tiene que existir la lista de tareas; luego cambia en la primera edición o escritura. Leer, buscar o ejecutar no lo dispara. Tras el traspaso se desarma; `/prewalk restart` lo rearma y `prewalk.enabled` lo deja armado en sesiones nuevas.
- *En la demo:* Pro planifica el recargo urgente y hace la primera edición; Flash comprueba con `grep` quién llama a la función, pasa los tests y cierra las tareas.
- Riesgo: un plan malo se ejecuta con disciplina. Lee la lista de tareas antes de dejarle seguir. Y la primera petición de Flash no aprovecha la caché de Pro.

### 7 · /advisor: un segundo modelo que revisa

<p><button type="button" class="ir-a" data-t="891">▶ Ir a 14:51</button></p>

- El advisor lee cada turno del modelo principal y, si ve algo, inyecta una nota. No aprueba ni cambia nada: revisa y avisa. Es el «uno hace, otro revisa» del vídeo 04, automático.
- Antes de encenderlo: si usa otro proveedor, tu código viaja a los dos. Comprueba con `/advisor status` qué modelo usa antes de dar la tarea, y enciéndelo antes de la tarea, porque solo lee desde ese momento.
- Recibe `AGENTS.md` y además `WATCHDOG.md`, un fichero solo para él con lo que debe vigilar. Ve solo lo nuevo desde su última revisión, con secretos ofuscados, y se reinicia al compactar (vídeo 13). *En terminal:* WATCHDOG.md (más abajo, en «Código y comandos»).
- No garantiza notas: un filtro descarta las vacías y no repite lo ya dicho. *En la demo:* calla dos veces, porque Flash ya avisa por su cuenta de lo que él habría dicho. Cuando habla, usa tres niveles: `nit`, `concern` y `blocker`, y el modelo principal los recibe como consejo, no como orden.
- Límites: es un gasto aparte, con su propio contexto. No es una frontera de seguridad, y si `WATCHDOG.yml` le concede editar o ejecutar, actúa con tus permisos. Es una segunda opinión, no la verdad.

> **Nota:** en la demo, Flash calcula 55,34 € para un carrito de 39,99 € con envío urgente. La cifra cuadra si se aplica un IVA del 21 % a los productos (39,99 × 1,21 = 48,39 €) y se suman el envío de 4,95 € y el recargo urgente de 2 €.

### 8 · Lo que cuesta, los fallos y /usage

<p><button type="button" class="ir-a" data-t="1166">▶ Ir a 19:26</button></p>

- Qué gasta cada pieza: `/switch`, Ctrl+P y prewalk pagan la caché al cambiar de modelo; `/effort` cambia los tokens de razonamiento; `/fast` suele costar más y `/slow` menos; el advisor es una conversación entera aparte; `tiny` y `judge` hacen llamadas que no ves.
- Para saber quién gastó qué: el pie da el coste de la sesión, con el del advisor aparte, y `/advisor status` da el detalle del revisor.
- Si un modelo falla por cuota o por una caída, omp puede pasar a otro: las cadenas de reserva se configuran por rol o por modelo, y al terminar la espera cada uno vuelve a su modelo original.
- `/usage` enseña uso y límites de cada cuenta, con identidades. *En terminal:* Uso de cuentas, fuera de la TUI. `/usage reset` gasta un reinicio de límite que no se recupera.

### 9 · Repaso, práctica y cierre

<p><button type="button" class="ir-a" data-t="1280">▶ Ir a 21:20</button></p>

- Asignas modelos a trabajos con roles, y cada rol lleva su esfuerzo. `/model` guarda roles, `/switch` cambia solo la sesión y Ctrl+P recorre `smol`, `default` y `slow`.
- `/effort` ajusta el razonamiento y te dice qué niveles admite el modelo; `/modelpreset` guarda combinaciones; `/fast` y `/slow` cambian el carril de servicio.
- `/prewalk` planifica con el capaz y pasa al rápido en la primera edición. `/advisor` añade un revisor con su propio modelo y su criterio en `WATCHDOG.md`, que avisa cuando hace falta y calla cuando no.
- Práctica: asigna un modelo rápido a `smol` y uno capaz al `advisor`, y comprueba con `/advisor status` cuál usa de verdad. Escribe un `WATCHDOG.md` con dos reglas de tu proyecto, arma `/prewalk` con una tarea pequeña y compara lo que gastó cada modelo con lo que aportó.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### config.yml del perfil

```text
modelRoles:
  default: deepseek/deepseek-flash
  smol: deepseek/deepseek-flash:low
  slow: deepseek/deepseek-v4-pro:high
  advisor: deepseek/deepseek-v4-pro:high
```

- `/model` escribe esto al asignar roles. Compruébalo con `omp --profile demo config get modelRoles`.
- Flash ocupa dos roles con distinto esfuerzo: `default` sin sufijo y `smol` con `:low`.

### Selectores

```text
/switch @slow                        # el modelo del rol slow
deepseek/deepseek-flash:low          # modelo y esfuerzo
deepseek/deepseek-v4-pro:high
```

### Desde la línea de comandos

```text
omp --profile demo --model deepseek/deepseek-flash
omp --profile demo --smol … --slow … --plan …   # solo esta ejecución
omp --profile demo models deepseek
```

- `--smol`, `--slow` y `--plan` sustituyen esos roles solo para esa ejecución, sin guardarlos.
- `omp models` con un trozo del nombre consulta el catálogo, con precios.

### ~/.omp/profiles/demo/agent/WATCHDOG.md

```text
- Importes: cuidado con sumas de decimales (39,99 + 4,95 + 2) y el redondeo a céntimos.
- No cambiar la firma pública de una función sin decirlo.
- Los tests se ejecutan con node --test y deben pasar antes de terminar.
```

- Solo lo lee el advisor; el modelo principal no lo ve. En la demo está en la carpeta del perfil, no en el repositorio.
- Cada regla es comprobable: un importe se recalcula, una firma se compara y los tests se ejecutan.

### Uso de cuentas, fuera de la TUI

```text
omp usage --redact      # acorta correos e identificadores
# revisa la salida antes de compartirla
```

## Fuentes

- Documentación de oh my pi ([omp.sh](https://omp.sh)). Grabado con omp 18.6.1.
- `models.md`: roles, herencia, selectores (`@rol`, `:nivel`), presets y precios por horas.
- `settings.md`: `modelRoles`, `cycleOrder`, `defaultThinkingLevel`, ajustes del advisor y cadenas de reserva.
- `advisor-watchdog.md`: qué ve el advisor, `WATCHDOG.md` y `WATCHDOG.yml`, niveles de las notas y sus límites.
- `prewalk.md`: cuándo se dispara el traspaso y cómo se rearma.
- `providers.md` y `provider-quirks.md` (DeepSeek): credenciales, niveles de esfuerzo admitidos y `/usage`.
- Vídeos relacionados del curso: 04 (modelos en Pi y la caché), 13 (compactación), 15 (rol `plan`) y 21 (`omp -p --advisor` y `/stats`).

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · De una lista de modelos a los roles**

En el vídeo cuatro aprendiste a manejar modelos en Pi. Barra model para elegir, barra scoped models para decidir la rotación, control pe para recorrerla y mayúsculas tabulador para el nivel de razonamiento. Y terminamos con una estrategia: un modelo hace el trabajo y otro más capaz lo revisa. Funcionó, pero lo hicimos a mano, cambiando de modelo y pagando la caché en cada cambio.

oh my pi parte de lo mismo, pero cambia la pregunta. En Pi te preguntas qué modelo tienes activo. En oh my pi te preguntas qué modelo hace cada trabajo. A eso lo llama roles: un nombre de trabajo, como default, smol o advisor, que apunta a un modelo concreto. Y sobre los roles monta dos piezas que en Pi tendrías que programar: un traspaso automático entre modelos y un segundo modelo que revisa cada turno.

El plan de hoy. Primero, qué es un rol y cómo se asigna. Después, las tres formas de cambiar de modelo: barra model, barra switch y control pe, que aquí no hace lo mismo que en Pi. Luego el razonamiento con barra effort, los presets y el nivel de servicio. La parte central es barra prewalk y barra advisor. Y cerramos con lo que cuesta todo esto y con barra usage.

Trabajamos en la tienda, con el perfil demo y dos modelos de DeepSeek, con la misma clave en una variable de entorno. DeepSeek V cuatro punto uno Flash, el de todo el curso, es el rápido. Y DeepSeek V cuatro Pro es el capaz: razona más y es más lento. Varias cosas de hoy escriben en la configuración del perfil, y lo diremos en cada caso.

Una nota honesta sobre el precio. En el catálogo de oh my pi, Pro tiene una tarifa de lista unas cuatro veces mayor que Flash. Pero el mismo catálogo indica que, desde el catorce de septiembre, DeepSeek le aplica la misma tarifa que a Flash. Así que hoy la diferencia entre los dos es de velocidad y de capacidad, no de dinero. Si la tarifa vuelve a la de lista, todo lo que veremos sigue valiendo, y además ahorra.

**2 · Qué es un rol**

Un rol es una asignación: este trabajo lo hace este modelo. Se guardan en el ajuste model roles, dentro del config punto yml del perfil. No confundas ese fichero con models punto yml, que define proveedores y modelos. Cada rol lleva un selector: el proveedor y el identificador, un nombre aproximado, o una lista separada por comas, de la que se usa el primero disponible.

Los roles de chat cubren cada trabajo. Default es el modelo con el que conversas. Smol, el rápido. Slow, el de razonamiento profundo. Plan, el del modo plan, que veremos en el vídeo quince. Vision, para analizar imágenes. Commit, para los mensajes de commit. Tiny y memory, para trabajo de fondo muy ligero, como los títulos de sesión y la memoria. Task, para los subagentes. Y advisor, el revisor.

Hay otro grupo, los roles por tipo de modelo, que no eligen un modelo de chat sino uno que genera imágenes, busca en la web, habla, transcribe o emite juicios sencillos. Judge, por ejemplo, es el que decide el nivel de razonamiento automático, que veremos enseguida. Hoy no los tocamos, pero conviene saber que existen, porque también hacen llamadas.

Lo importante es qué pasa con los roles que no asignas. Smol y slow, si no los defines, heredan el default. Tiny pasa por smol, y memory pasa por tiny. Así que, si pones en smol un modelo de otro proveedor, los títulos automáticos de sesión también irán a ese proveedor. Un rol mal pensado puede mover trabajo de fondo a otro sitio sin que lo veas en pantalla.

El advisor tiene su propia regla, y es la que más dinero puede costar. Si no le asignas modelo, no hereda el de la conversación: usa slow si lo has configurado y, si no, una cadena interna de modelos potentes. Con un proveedor que ofrezca modelos caros, puede acabar en uno de ellos. Por eso en la demo lo asignamos a mano y lo comprobamos antes de enviar nada.

Dos detalles de sintaxis que vamos a usar. Una arroba delante del nombre de un rol lo convierte en alias: arroba slow significa el modelo que tenga slow en ese momento. Y dos puntos al final fijan el razonamiento: Flash dos puntos low. Así, el mismo modelo puede ocupar dos roles con distinto esfuerzo, y es lo que haremos con Flash.

**3 · Barra model, barra switch y control pe**

Antes de cambiar nada, un vistazo gratis. Como vimos en el vídeo doce, el menú de comandos te cuenta el estado. Con barra m o, model dice deepseek flash y model preset dice que no hay ninguno guardado. Con barra a d, advisor dice off, y agents abre el centro de agentes, con el modelo, el prewalk y el advisor de cada uno. Barra effort dice high, y barra fast, off.

Barra model, o alt eme, abre el centro de modelos. A la izquierda, la vista de roles, con cuántos hay asignados, y la lista de proveedores. Arriba, un filtro por tipo: chat, tiny, imagen, voz, búsqueda, judge y otros. Escribimos deepseek para quedarnos con sus cuatro modelos. Cada uno enseña su velocidad, su ventana y su precio por millón: Flash, unos ciento cincuenta tokens por segundo; Pro, unos ciento diez.

Elegimos Pro y pulsamos Enter. Abajo aparece la barra de roles: default, smol, slow, vision, plan, commit, tiny, memory, task, advisor, judge, y al final las cadenas de reserva. Vamos a slow, Enter, y oh my pi pregunta el esfuerzo para ese rol: heredar, off, auto, low, high o max. Elegimos high. Repetimos para advisor, también con high. Y a Flash le damos smol, con low.

Esto es lo primero que hay que interiorizar: en oh my pi, barra model no es un selector de sesión como en Pi. Lo que asignas ahí es configuración que se guarda. Lo comprobamos en la otra pestaña, con omp guion guion profile demo config get model roles. Ahí están las cuatro asignaciones, con su esfuerzo detrás de los dos puntos, escritas en el fichero del perfil.

Para cambiar de modelo solo en esta sesión está barra switch, o alt pe. Sin argumentos abre el mismo selector, pero en modo temporal. Con argumento acepta lo mismo que un rol, así que escribimos barra switch arroba slow. El aviso dice session only model, deepseek v cuatro pro, y recuerda que los roles se cambian con alt eme o barra model. El pie ya enseña Pro.

Y control pe, que en Pi rotaba por tu lista de modelos favoritos. En oh my pi rota por roles, en el orden del ajuste cycle order, que de fábrica es smol, default y slow. Pulsamos control pe y aparece una tira con los tres, con el actual resaltado, y el pie cambia de modelo. Es tener tres modelos a mano, con nombres de trabajo en lugar de nombres de modelo.

Desde la línea de comandos tienes lo mismo. Guion guion model elige el modelo activo. Guion guion smol, guion guion slow y guion guion plan sustituyen esos roles solo para esa ejecución, sin guardarlos. Y omp models, con un trozo del nombre, consulta el catálogo.

El coste de cambiar es el mismo que vimos en el vídeo cuatro. La caché del proveedor es de cada modelo, así que la primera petición tras un cambio se paga casi entera. Barra switch y control pe no lo evitan. Lo que cambia es la costumbre: asignas cada trabajo a un rol y dejas que oh my pi cambie de modelo en los momentos justos.

**4 · Cuánto piensa: barra effort**

En oh my pi, el nivel de razonamiento se llama effort, esfuerzo. Barra effort sin argumentos abre un selector con los niveles del modelo actual, y mayúsculas tab los recorre, como en Pi. Con argumento, lo fija para esta sesión. El nivel con el que arrancan las sesiones nuevas es el ajuste default thinking level, que de fábrica es high.

Los niveles van de off a max, pero cada modelo admite solo algunos. Lo vemos con Pro. Pedimos barra effort medium, y oh my pi lo rechaza en rojo: unknown thinking level, medium. Y a continuación, la lista de los disponibles para este modelo: off, auto, low, high y max. Medium no está. Barra effort high, en cambio, se acepta sin más.

Fíjate en auto, que Pi no tiene. Con auto, antes de cada turno un clasificador estima lo difícil que es tu petición y elige el esfuerzo. Ese clasificador usa el rol judge, así que también es una llamada a un modelo. Si quieres el máximo en un turno concreto, con auto activo, escribes la palabra ultrathink en tu mensaje y ese turno sube al tope del modelo.

Un matiz técnico. Los presupuestos de tokens de cada nivel solo se aplican a los proveedores que razonan por presupuesto, como Anthropic o Gemini. En los que funcionan por esfuerzo, como DeepSeek o los compatibles con OpenAI, se envía el nivel y el proveedor decide cuánto piensa.

¿Qué nivel elegir? Lo mismo que en el vídeo cuatro: más esfuerzo ayuda al depurar y al revisar, y sobra en ediciones bien especificadas. La novedad es que ahora el esfuerzo viaja con el rol. Smol con low para el trabajo mecánico, slow y advisor con high para pensar y revisar. Lo decides una vez, al asignar, y no cada vez que cambias de modelo.

**5 · Presets y nivel de servicio**

Cuando tienes una combinación de roles que funciona, la puedes guardar. Barra model preset save, con un nombre, guarda todas las asignaciones de roles y el nivel de razonamiento por defecto. El aviso dice saved model preset. Barra model preset list las enumera, delete borra una y switch la aplica. Y en el menú, la descripción deja de decir none saved.

Ojo con dos efectos. Save escribe en la configuración global del perfil. Y switch hace más de lo que parece: reescribe los roles, quita los que el preset no incluye, guarda su nivel de razonamiento y cambia el modelo activo al default del preset. Por eso hemos guardado el nuestro después de asignar todos los roles, advisor incluido.

Un uso práctico: dos presets, uno para el día a día, con el modelo rápido haciendo casi todo, y otro para una sesión de diseño o una depuración difícil, con modelos más capaces en cada rol. Cambias de uno a otro con un comando, en lugar de reasignar roles uno a uno.

El nivel de servicio es otra palanca, distinta del modelo. Barra fast pide el carril prioritario donde el proveedor lo ofrece: en OpenAI, en Anthropic o en Google. Respuestas más rápidas y, normalmente, más caras. Barra slow hace lo contrario: en OpenAI y en Google usa el carril flex, más barato y con más espera. En cámara solo usamos status, que informa sin cambiar nada: fast mode is off, slow mode is off.

Ya que hablamos de precio: con DeepSeek, oh my pi conoce su tarifa por horas. El catálogo distingue unas horas punta, entre semana y en dos franjas de la mañana en hora UTC, y el resto, a mitad de precio. En la status line, el segmento de coste añade una flecha hacia arriba en horas punta y hacia abajo fuera de ellas. Hoy, durante toda la grabación, la flecha apunta hacia abajo.

**6 · Barra prewalk: planifica el capaz, ejecuta el rápido**

Vamos con la primera forma de repartir el trabajo. Prewalk es un traspaso único. El modelo activo explora el repositorio, escribe la lista de tareas y empieza el cambio. En cuanto hace la primera edición, oh my pi pasa la sesión al modelo de smol, que sigue a partir de ahí. El capaz piensa el plan y el rápido lo ejecuta. Viene apagado.

Lo armamos en una sesión nueva. Primero barra switch arroba slow, para que la sesión empiece con Pro. Después, barra prewalk. El aviso dice que está armado para deepseek flash, y que cambiará en la primera edición o escritura una vez exista la lista de tareas. Y el pie lo recuerda: Pro, y al lado, prewalk.

Hay dos requisitos. Smol tiene que resolver a otro modelo o a otro nivel de razonamiento que el activo: si es exactamente lo mismo, no hay a quién pasar. Y su proveedor necesita credenciales; si no, barra prewalk se niega y avisa de que falta la clave.

Le pedimos una tarea pequeña, pero que merezca un plan: que gastos envío acepte un envío urgente, con un recargo de dos euros incluso cuando el envío es gratis, con sus tests. Pro lee los ficheros y escribe un plan con secciones: el objetivo, lo ya hecho que no hay que repetir, los pasos restantes en orden, los riesgos y cómo verificar que todo aterriza.

Debajo, la lista de tareas, cinco, y la primera edición de Pro en src barra envio punto js: la constante del recargo, el nuevo parámetro urgente con valor false por defecto, y el cálculo. Después, los dos tests nuevos. Y justo ahí, una línea gris: prewalk, cambiado a deepseek flash tras la primera llamada de edición.

A partir de ese punto trabaja Flash. Busca con grep quién llama a gastos envío, para comprobar que nadie se rompe; ejecuta la suite, diecisiete de diecisiete; marca las tareas como hechas y resume el cambio. Hasta añade una nota útil: si algún día quieres envío urgente en el total del carrito, habrá que propagar el parámetro. El pie ya enseña Flash.

El disparador es preciso. Si la herramienta todo está activa, la puerta se abre con la lista de tareas. Después, el cambio ocurre con la primera edición o escritura. Leer, buscar o ejecutar comandos no lo dispara. Y es de un solo uso: tras el traspaso, prewalk se desarma. Barra prewalk restart lo vuelve a armar, y el ajuste prewalk enabled lo deja armado en las sesiones nuevas.

El precio de prewalk es el del vídeo cuatro. Es un cambio de modelo de verdad, así que la primera petición de Flash no aprovecha la caché de Pro. La diferencia es que ocurre una sola vez y en el momento adecuado. Y un riesgo que conviene decir: si el plan es malo, el modelo rápido lo ejecutará con disciplina. Lee la lista de tareas antes de dejarle seguir.

**7 · Barra advisor: un segundo modelo que revisa**

La segunda forma es el advisor. Un segundo modelo acompaña a la sesión, lee cada turno del modelo principal y, si ve algo, inyecta una nota. No aprueba acciones ni cambia nada por su cuenta: revisa y avisa. Es la estrategia del vídeo cuatro, uno hace y otro revisa, pero automática y en paralelo.

Antes de encenderlo, el criterio. El advisor recibe las instrucciones del proyecto, como AGENTS punto md, y además un fichero solo para él: WATCHDOG punto md. Lo que pongas ahí no llega al modelo principal. Fuera de cámara hemos dejado uno en la carpeta del perfil demo, no en la tienda, con tres cosas que vigilar: el redondeo al sumar importes con decimales, la firma pública de las funciones y que los tests pasen antes de dar algo por terminado.

Un detalle de orden importante. Cuando activas el advisor a mitad de sesión, empieza a leer desde ese momento. Así que primero lo encendemos y después damos la tarea. Barra advisor status: advisor is disabled. Barra advisor on: advisor enabled. Y status otra vez, para comprobar qué modelo usa: deepseek v cuatro pro, en marcha, sin mensajes ni gasto todavía. Si dijera otro modelo, pararíamos aquí. En el pie aparece un ojo.

¿Qué ve exactamente? Solo lo nuevo desde su última revisión: el texto, el razonamiento del modelo principal, sus llamadas a herramientas y sus resultados, con los secretos ofuscados antes de enviárselo. Y conecta con el vídeo trece: cuando la sesión se compacta, el advisor se reinicia y vuelve a leer la conversación ya reducida.

Ahora trabaja Flash. Le pedimos un test que compruebe el total de un carrito de treinta y nueve con noventa y nueve euros con envío urgente. La tarea tiene trampa: el total del carrito no sabe nada del envío urgente. Flash lo resuelve propagando urgente a total con envío como cuarto parámetro con valor por defecto, y lo dice. Calcula cincuenta y cinco con treinta y cuatro, y dieciocho de dieciocho.

¿Y el advisor? No ha dicho nada. Barra advisor status lo explica: ha revisado seis veces, lleva unos nueve mil seiscientos tokens de contexto y ha gastado dos décimas de céntimo. Revisó y no encontró nada que mereciera una nota. Cambiar una firma pública era una de sus reglas, pero Flash lo hizo con un parámetro opcional y avisando. Eso también es una respuesta.

Lo provocamos un poco más. Le pedimos a Flash que suba el umbral de envío gratis a cincuenta euros sin tocar ni ejecutar los tests, justo lo contrario de lo que pide el WATCHDOG. Flash hace el cambio, pero avisa por su cuenta: con el umbral en cincuenta fallarán varios tests, y los enumera. El advisor, de nuevo, calla: el modelo principal ya ha dicho lo que él habría dicho.

Esa es la lección práctica: el advisor no garantiza notas. Está pensado para no hacer ruido. Un filtro descarta las notas vacías y no repite lo ya dicho. Cuando habla, sus notas tienen tres niveles: nit, una sugerencia menor; concern, un riesgo serio que puede interrumpir y reconducir; y blocker, cuando seguir sería tirar el trabajo. Al modelo principal le llegan marcadas como consejo, para sopesarlas, no para obedecerlas a ciegas.

Barra advisor status, al final: quince mensajes, más de diez mil tokens y dos décimas de céntimo. Es un gasto aparte, con su propio contexto y su propia conversación, guardada junto a la sesión. En el pie aparece como un más, un ojo y su coste, que redondeado a céntimos todavía es cero. Barra advisor dump copia su conversación al portapapeles, por si quieres leer qué pensó.

Se puede ajustar. El ajuste advisor review mode decide si revisa cada turno o solo el final de cada respuesta. Para varios revisores existe WATCHDOG punto yml, con el nombre, el modelo, las herramientas y las instrucciones de cada uno; barra advisor configure lo edita. Y en la línea de comandos, omp guion pe guion guion advisor activa el revisor para una sola ejecución. Lo retomaremos en el vídeo veintiuno.

Los límites, sin rodeos. El advisor no es una frontera de seguridad: no aprueba ni bloquea herramientas. WATCHDOG punto yml le puede conceder editar o ejecutar comandos, y entonces actúa con tus mismos permisos. Con dos proveedores distintos, tu código viajaría a los dos. Y un revisor también se equivoca: es una segunda opinión, no la verdad.

**8 · Lo que cuesta, los fallos y barra usage**

Repasemos qué gasta cada pieza. Barra switch, control pe y prewalk cambian de modelo, y la primera petición del modelo nuevo paga la caché. Barra effort cambia los tokens de razonamiento de cada respuesta. Barra fast suele costar más por petición, y barra slow menos. El advisor es una conversación entera aparte, que trabaja en cada turno. Y los roles de fondo, como tiny o judge, hacen llamadas que no ves.

Para saber quién gastó qué, mira en dos sitios: el pie para la sesión, con el coste del advisor detrás del ojo, y barra advisor status para el detalle del revisor. Como el advisor guarda sus turnos en un fichero propio dentro de la sesión, las estadísticas de oh my pi lo cuentan como un subagente más. Lo veremos con barra stats en el vídeo veintiuno.

¿Y si un modelo falla? oh my pi reintenta los errores transitorios y, si un modelo sigue sin responder por cuota o por una caída, puede pasar a otro. Las cadenas de reserva son las que viste al final de la barra de roles, y se configuran por rol o por modelo. El advisor también tiene la suya. Y cuando termina el periodo de espera, cada uno vuelve a su modelo original.

Barra usage enseña el uso y los límites de cada proveedor y de cada cuenta con sesión iniciada: ventanas de cinco horas, semanales, créditos, según el proveedor. Precisamente por eso no lo abrimos en pantalla: enseña identidades de cuenta. Y barra usage reset gasta un reinicio de límite guardado, que no se recupera. En la diapositiva tienes qué muestra cada parte.

Fuera de la interfaz existe omp usage, con una opción, guion guion redact, que acorta los correos y los identificadores para poder compartir capturas. Aun así, revisa la salida antes de enseñarla a nadie.

**9 · Repaso, práctica y cierre**

Repasemos. En oh my pi asignas modelos a trabajos, con roles, y cada rol lleva su esfuerzo. Barra model guarda roles, barra switch cambia solo la sesión y control pe recorre smol, default y slow. Barra effort ajusta el razonamiento y te dice qué niveles admite cada modelo. Barra model preset guarda combinaciones completas. Y barra fast y barra slow cambian el carril de servicio, no el modelo.

Barra prewalk planifica con el modelo capaz y pasa al rápido en la primera edición, con un plan escrito para el traspaso. Barra advisor añade un revisor con su propio modelo, su propio contexto y su propio criterio en WATCHDOG punto md, que avisa cuando hace falta y calla cuando no. Y barra usage enseña cuentas, así que se queda en la diapositiva.

La práctica: en tu perfil de pruebas, asigna un modelo rápido a smol y uno capaz al advisor, y comprueba con barra advisor status cuál usa de verdad. Escribe un WATCHDOG punto md con dos reglas concretas de tu proyecto. Arma barra prewalk, pide una tarea pequeña con plan y, al final, compara lo que gastó cada modelo con lo que aportaron.

En el próximo vídeo, planificar y dirigir: el modo plan con barra plan y su revisión, objetivos con presupuesto con barra goal, bucles con barra loop, la cola de mensajes y la lista de tareas. Ahí entra en juego el rol plan, que hoy solo hemos nombrado. Nos vemos allí.

</details>

