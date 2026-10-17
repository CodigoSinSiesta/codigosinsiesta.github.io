---
title: "Vídeo 01 · Qué es un harness de agente"
description: "Los dos sentidos de «harness» y sus cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Vemos la misma tarea con Pi y con oh my pi para comparar dos filosofías."
ruta: "pi-oh-my-pi"
orden: 1
duracion: "22 min"
video: "01-que-es-un-harness.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/01-que-es-un-harness.es.vtt"
---

Los dos sentidos de «harness» y sus cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Vemos la misma tarea con Pi y con oh my pi para comparar dos filosofías.

<p class="guia__nota">Dura 22 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · El modelo no trabaja solo

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **Definición:** el harness es todo lo que no son los pesos del modelo: las instrucciones que recibe, las herramientas que usa, el entorno donde se ejecutan, el estado que se conserva entre turnos y el feedback que dice si el trabajo está bien.
- **En una frase:** el modelo decide qué código escribir; el harness, cuándo, dónde y cómo. Un buen harness no vuelve más listo al modelo: vuelve fiable lo que produce.
- **Por eso** dos agentes con el mismo modelo dan resultados distintos: cambia lo que el modelo ve, lo que puede hacer y cuándo se da por terminado.
- **Dos sentidos de la palabra.** Uno: el programa que ejecuta el bucle del agente (sesión, herramientas, permisos, compactación); Pi y oh my pi lo son. Dos: el andamiaje que pones en tu repositorio para que cualquier agente trabaje mejor (AGENTS.md, scripts de arranque, listas de tareas, documentos de traspaso, rúbricas). El segundo es portable.
- **Cómo lo recorre el curso:** las etapas «Pi a fondo» (vídeos 02–10) y «oh my pi» (11–21) tratan el primer sentido; «Diseñar tu harness» (22–26), el segundo.

### 2 · Las cinco piezas del harness

<p><button type="button" class="ir-a" data-t="151">▶ Ir a 2:31</button></p>

La taxonomía viene del curso abierto Learn Harness Engineering. Se usa porque es neutral: sirve para lo que escribes tú y para lo que trae cada agente.

| Pieza | Qué es | Regla | Ejemplo |
|---|---|---|---|
| 1 · Instrucciones | Prompt de sistema, AGENTS.md, skills, plantillas de prompt | Un mapa, no un manual | Un AGENTS.md de diez líneas: pruebas, carpetas vetadas, commits |
| 2 · Herramientas | Leer, editar, ejecutar, buscar, consultar servicios | Mínimo privilegio; cada herramienta declarada viaja en cada petición y cuesta contexto | Pi: 4 activas. oh my pi en las demos: 12 activas de 24 |
| 3 · Entorno | Tu máquina, un contenedor, una VM, un servidor remoto | Quien decide no debería ser quien ejecuta | `npm install` en un contenedor solo ve lo que montas |
| 4 · Estado | Conversación, ficheros leídos, decisiones, tareas pendientes | Lo que no está en ficheros, no existe | Al llenarse el contexto: resumir, podar o traspasar |
| 5 · Feedback | Pruebas, linters, revisiones, criterios de aceptación | Una forma objetiva de saber que ha terminado | `npm test`: tres pruebas, una falla |

- **Estado y contexto lleno:** resumir (Pi compacta solo, con unos 16 000 tokens de reserva), podar (quitar resultados pesados de herramientas) o traspasar (documento de traspaso y sesión limpia). Cada estrategia pierde algo distinto.
- **Separa a quien hace de quien revisa:** otra persona, otro agente o una batería de pruebas, pero no el mismo turno que escribió el código.
- *En terminal:* AGENTS.md · instrucciones del proyecto (más abajo, en «Código y comandos»)
- *En terminal:* harness-demo · el feedback es una orden (más abajo, en «Código y comandos»)

### 3 · Un turno por dentro

<p><button type="button" class="ir-a" data-t="446">▶ Ir a 7:26</button></p>

- **Un turno:** tu mensaje se añade a la conversación. El harness monta la petición (prompt de sistema, historial, herramientas, ajustes del modelo) y la envía al proveedor. El modelo responde con texto y llamadas a herramientas; el harness las ejecuta y registra los resultados. Si hace falta otra vuelta, empieza otro turno. Un encargo normal son muchos turnos.
- **Intervenir mientras trabaja:** un mensaje de *steering* entra al acabar el turno en curso; uno de *follow-up* espera a que termine todo; y puedes abortar. Lo practicamos en el vídeo 02.
- **La sesión es un árbol:** cada entrada apunta a su padre y el modelo solo ve la rama activa. Si vuelves atrás y sigues, nace una rama nueva sin perder la anterior.
- **Compactación:** al acercarse al límite, Pi resume lo antiguo en un bloque con objetivo, restricciones, progreso, decisiones y siguientes pasos, y conserva lo reciente. El fichero original no se borra.
- **Todo esto es harness:** el modelo solo ve lo que el harness le envía. Ahí influyes tú: en lo que entra, en lo que puede hacer y en cuándo se para.

### 4 · Dos filosofías: Pi y oh my pi

<p><button type="button" class="ir-a" data-t="568">▶ Ir a 9:28</button></p>

- **Pi, mínimo y extensible:** cuatro herramientas activas (read, write, edit, bash) y, a propósito, sin subagentes ni modo plan. Si necesitas más, sube por la escalera y usa el mecanismo más pequeño que resuelva el problema: AGENTS.md, plantilla de prompt, skill, extensión en TypeScript, paquete.
- **oh my pi, baterías incluidas:** fork de Pi sobre el mismo núcleo, con muchas más herramientas y comandos de serie: subagentes, modo plan, memoria entre sesiones, servidor de lenguaje, depurador, navegador e interfaz de git. Corre sobre Bun con partes en Rust.
- **Ingeniería pensada para el modelo (oh my pi):** *hashline*, edición anclada por hash para no estropear un fichero con referencias antiguas; reglas que se inyectan en mitad de la respuesta cuando el modelo escribe un patrón concreto (en omp se llaman TTSR); un modelo asesor que revisa cada turno; y roles para usar un modelo barato en lo fácil y uno potente en lo difícil.
- **Ninguno pide permiso por defecto.** Pi te enseña cada paso pero no se detiene; aprobaciones y sandbox se añaden con extensiones o con un contenedor (vídeo 05). oh my pi arranca en modo *yolo* (`tools.approvalMode`: no pide permiso para nada); sus modos prudentes hay que activarlos.
- **Las mismas piezas, otros agentes:** Learn Harness Engineering destaca de Claude Code la memoria por capas, los permisos, los hooks y los subagentes; de Codex, el repositorio como sistema de registro, con AGENTS.md como índice y aislamiento con worktrees; de Pi, el núcleo mínimo con extensiones. oh my pi lee la configuración de Claude Code y Codex: ficheros de contexto, servidores MCP y skills.

> **Nota:** la locución habla de «unas treinta herramientas» en oh my pi; el número depende de la versión y la configuración. En la de las demos, `/tools` muestra 12 activas de 24 disponibles.

### 5 · La misma tarea: dos agentes

<p><button type="button" class="ir-a" data-t="764">▶ Ir a 12:44</button></p>

- **La tarea:** en `harness-demo`, un carrito con cupón y tres pruebas, una de ellas fallando. A los dos agentes se les pide lo mismo: encuentra por qué, corrígelo sin tocar otros archivos y ejecuta las pruebas al terminar.
- **Ojo, dos modelos distintos:** oh my pi con GPT-5.6 Luna y Pi con Qwen 3.8 27B gratuito vía OpenRouter. No comparamos harnesses en igualdad, sino filosofías.
- *En la demo:* oh my pi planifica (cuatro tareas), busca un AGENTS.md que no existe, reproduce el fallo, corrige una línea y entrega causa, cambio y evidencia. Ese es el formato que quieres de cualquier agente.
- *En la demo:* Pi trabaja con bash a pelo, sobrevive a un error 429 porque el harness reintenta solo, y relee su propia edición. Pero su resumen inventa un dato (dice 23,58; el total era 22). La evidencia es la prueba que se ejecuta, no lo que el agente cuenta.
- **Más lecciones:** dos agentes en la misma carpeta se pisan; para trabajar en paralelo, cada uno necesita su propio espacio (un worktree o una copia). Y `/context` en oh my pi mide el impuesto de las herramientas: 3,9K tokens de descripciones antes de escribir nada, más que toda la conversación.
- **Lo que cambia entre ambos:** cómo planifican, cuánto contexto ocupan al empezar, cuántas herramientas declaran y cómo se recuperan de errores. Lo que comparten: verifican porque se lo pedimos. Ese «ejecuta las pruebas» es feedback que pusimos nosotros.

### 6 · Cuando falla: ¿qué pieza ha sido?

<p><button type="button" class="ir-a" data-t="1017">▶ Ir a 16:57</button></p>

- **Diagnóstico:** antes de cambiar de modelo, revisa el harness. Pregunta en orden: ¿instrucciones claras y a la vista? ¿herramientas adecuadas? ¿entorno correcto? ¿conservaba el estado? ¿sabía cuándo había terminado?

| Síntoma | Pieza | Solución |
|---|---|---|
| «Ya está arreglado» y no lo está | Feedback | Un criterio de aceptación comprobable |
| Olvida una restricción en una sesión larga | Estado | Moverla a las instrucciones del proyecto |
| Lento y elige herramientas raras (cuarenta de varios MCP) | Herramientas | Declarar menos o cargarlas bajo demanda (Pi lo hace con *codemode*: el modelo escribe un script que llama a las herramientas sin que se declaren todas; vídeo 07) |
| Pasa en local, falla en CI | Entorno | Versiones fijas y el mismo script de arranque |
| Toca archivos que no debía | Instrucciones o políticas | AGENTS.md y permisos o un entorno que monte solo lo necesario |

- **Ablación:** quita piezas de una en una y mira qué se rompe. Lo que no cambia nada, sobra; lo que lo rompe todo, cuídalo.
- **Mantenimiento:** el harness se degrada como el código. Revísalo de vez en cuando, igual que refactorizas.

### 7 · El mapa del curso

<p><button type="button" class="ir-a" data-t="1183">▶ Ir a 19:43</button></p>

- **Marco común:** 01 · Qué es un harness de agente (este vídeo).
- **Pi a fondo (9 vídeos):** 02 · Instalar Pi y primera tarea · 03 · Pi por dentro · 04 · Modelos y proveedores · 05 · Seguridad y aislamiento · 06 · Personalizar Pi sin código · 07 · MCP y codemode · 08 · Extensiones I · 09 · Extensiones II · 10 · Pi programático.
- **oh my pi (11 vídeos):** 11 · De Pi a oh my pi · 12 · La TUI y las sesiones · 13 · Contexto y memoria · 14 · Modelos, roles y razonamiento · 15 · Planificar y dirigir · 16 · Subagentes · 17 · El IDE integrado · 18 · Git, calidad y entrega · 19 · Aprobaciones, reglas y hooks · 20 · Extender oh my pi · 21 · oh my pi en equipo.
- **Diseñar tu harness (5 vídeos):** 22 · Diseñar tu harness · 23 · El repo como sistema de registro · 24 · Verificar de verdad · 25 · El coste de orquestar · 26 · Proyecto final (en preparación).
- **Práctica:** elige una tarea que hayas hecho con un agente y analízala con las cinco piezas. Apunta qué pieza mejorarías primero.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### AGENTS.md · instrucciones del proyecto

```text
$ cat AGENTS.md
# harness-demo
- Pruebas: npm test (deben pasar antes de terminar)
- No tocar: dist/ ni ficheros .env
- Commits: en español y en imperativo
```

Tres líneas cubren lo esencial: cómo se verifica, dónde no entrar y cómo se entrega.

### harness-demo · el feedback es una orden

```text
npm test
✔ subtotal suma precio por cantidad
✔ sin cupón el total es el subtotal
✖ un cupón del 10 % descuenta una sola vez
ℹ pass 2 · fail 1
```

- `npm test`: una señal binaria y objetiva; el agente no opina, consigue que la prueba pase sin romper las demás.

### harness-demo · src/carrito.js y sus pruebas

```text
npm test
✖ un cupón del 10 % descuenta una sola vez
  esperado: 26.1   obtenido: 22
```

- `obtenido: 22`: el valor que da el código con el fallo; la prueba espera 26,1.

### git diff · la corrección de una línea

```text
git diff src/carrito.js
- total += cupon ? linea - linea * (cupon.porcentaje / 100) * l.cantidad : linea;
+ total += cupon ? linea - linea * (cupon.porcentaje / 100) : linea;
```

- `* l.cantidad`: el descuento se multiplicaba otra vez por la cantidad, que ya iba incluida en `linea`.

## Fuentes

- Learn Harness Engineering (MIT · © 2025 WalkingLab): curso abierto del que salen la taxonomía de cinco piezas y el análisis de Claude Code, Codex y Pi.
- Vídeo 02 del curso: steering, follow-up y la primera tarea con Pi.
- Vídeo 05 del curso: seguridad, aprobaciones y contenedores.
- Vídeo 07 del curso: codemode y herramientas bajo demanda.
- Vídeo 11 del curso: qué cambia de Pi a oh my pi.

## Transcripción

<details>
<summary>Ver la transcripción de la locución</summary>

Texto de la locución tal como se dice en el vídeo (los símbolos se leen en voz alta: «punto md» es <code>.md</code>).

**1 · El modelo no trabaja solo**

Cuando un agente de programación resuelve una tarea, solemos darle todo el mérito al modelo. Pero el modelo, por sí solo, no lee tu repositorio, no ejecuta las pruebas ni recuerda lo que hizo hace diez minutos. Recibe texto y devuelve texto. Todo lo demás lo pone otra cosa.

Esa otra cosa es el harness. La definición más útil es también la más sencilla: el harness es todo lo que no son los pesos del modelo. Las instrucciones que recibe, las herramientas que puede usar, el entorno donde se ejecutan, el estado que se conserva entre turnos y la forma de comprobar que el trabajo está bien hecho.

Una frase lo resume bien: el modelo decide qué código escribir; el harness gobierna cuándo, dónde y cómo. Y de ahí sale una consecuencia importante: un buen harness no vuelve más listo al modelo. Lo que hace es volver fiable lo que el modelo produce.

Por eso dos agentes con el mismo modelo pueden dar resultados muy distintos. Cambia el harness, y cambia lo que el modelo ve, lo que puede hacer y cuándo se da por terminado. En este curso vamos a estudiar dos harnesses concretos, Pi y oh my pi, pero antes necesitamos un vocabulario común.

Hay una distinción que conviene dejar clara desde el principio, porque la palabra harness se usa en dos sentidos. El primero es el programa que ejecuta el bucle del agente: gestiona la sesión, las herramientas, los permisos y la compactación. Pi y oh my pi son harnesses en este sentido.

El segundo sentido es el andamiaje que tú pones en tu repositorio para que cualquier agente trabaje mejor: un AGENTS punto md con las reglas del proyecto, scripts de arranque, listas de tareas, documentos de traspaso o rúbricas de revisión. Ese andamiaje es portable: sirve igual para Pi, para oh my pi o para cualquier otro agente.

La mayor parte del curso trata del primer sentido: cómo funcionan Pi y oh my pi y cómo sacarles partido. El último bloque vuelve al segundo: cómo diseñar el harness de tu propio proyecto. Pero las dos caras se apoyan en las mismas piezas, y esas piezas son el mapa que vamos a usar en todo el curso.

**2 · Las cinco piezas**

Vamos a usar una taxonomía de cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Viene del curso abierto Learn Harness Engineering, y la elegimos porque es neutral: no pertenece a ningún producto y sirve tanto para lo que escribes tú como para lo que trae cada agente.

La primera pieza son las instrucciones. Es lo que el modelo lee antes de tu petición: el prompt de sistema del agente, los ficheros de contexto del proyecto, como AGENTS punto md, las skills y las plantillas de prompt. Una buena regla práctica: dale al agente un mapa, no un manual. Unas decenas de líneas claras valen más que un documento enorme que nadie mantiene.

Un ejemplo concreto. En nuestro repositorio de juguete, un AGENTS punto md de diez líneas basta: cómo se ejecutan las pruebas, qué carpetas no se tocan y cómo se escriben los mensajes de commit. Con eso, cualquier agente que entre en el proyecto sabe verificar su trabajo sin tener que preguntarlo.

La segunda pieza son las herramientas: leer ficheros, editarlos, ejecutar comandos, buscar en el código o consultar servicios externos. Las herramientas son las manos del agente, y con ellas llegan las políticas: qué puede hacer sin preguntar, qué necesita aprobación y qué está prohibido. El principio aquí es el mínimo privilegio.

Las herramientas también tienen un coste. Cada herramienta que declaras viaja en cada petición al modelo, ocupa contexto y le da una opción más entre la que dudar. El autor de oh my pi lo resume diciendo que cada esquema cobra un impuesto. Más herramientas no es mejor por defecto; es mejor tener las justas y que sean buenas.

Pi y oh my pi están en los dos extremos. Pi arranca con cuatro herramientas activas. oh my pi tiene muchas más; en la configuración que usaremos en las demos, su comando barra tools muestra doce activas de veinticuatro disponibles. Ninguna cifra es buena o mala en sí misma: lo importante es saber qué está pagando cada petición.

La tercera pieza es el entorno: dónde se ejecuta todo lo que el agente hace. Tu propia máquina, un contenedor, una máquina virtual o un servidor remoto. Aquí hay una idea que repetiremos en el curso: quien decide no debería ser quien ejecuta. La política vive en el harness, y el entorno solo ejecuta peticiones acotadas.

Un ejemplo sencillo: si el agente ejecuta npm install directamente en tu máquina, cualquier script de instalación de una dependencia corre con tus permisos y puede leer tus ficheros. Dentro de un contenedor, el mismo comando solo ve lo que tú le hayas montado. El modelo es el mismo; el riesgo, no.

La cuarta pieza es el estado: todo lo que el agente necesita recordar. La conversación, los ficheros que ha leído, las decisiones tomadas, las tareas pendientes. El estado tiene un enemigo natural, que es el tamaño de la ventana de contexto. Cuando se llena, el harness tiene que resumir, podar o traspasar, y cada estrategia pierde algo distinto.

Pi, por ejemplo, compacta automáticamente cuando el contexto se acerca al límite y deja un margen de reserva de unos dieciséis mil tokens. oh my pi ofrece varias estrategias encadenadas: resumir, quitar los resultados pesados de herramientas o escribir un documento de traspaso y empezar limpio. Elegir bien depende de qué no te puedes permitir perder.

El estado también vive fuera de la conversación. Si el progreso de una tarea solo existe en el chat, se pierde al cerrar la sesión. Si está escrito en el repositorio, en una lista de tareas o en un documento de traspaso, cualquier sesión nueva puede retomarlo. Lo que no está en ficheros, en la práctica, no existe.

La quinta pieza es el feedback: cómo sabemos que el trabajo está bien. Pruebas que se ejecutan, linters, revisiones, criterios de aceptación definidos de antemano. Sin feedback, el agente tiende a declarar victoria en cuanto el código parece razonable. Con feedback, tiene una forma objetiva de saber si ha terminado.

En el repositorio de juguete, el feedback es una orden: npm test. Tres pruebas, y una falla. Es una señal binaria y objetiva, y por eso es tan valiosa: el agente no tiene que opinar sobre si el código está bien, solo tiene que conseguir que la prueba pase sin romper las demás.

Un consejo que vale para todo el curso: separa a quien hace el trabajo de quien lo revisa. Puede ser otra persona, otro agente o una batería de pruebas, pero no debería ser el mismo turno del mismo agente que acaba de escribir el código.

Y una sexta pieza que no forma parte de la taxonomía, pero que conviene tener presente: las vistas. La misma sesión puede verse en una interfaz de terminal, en un modo de texto para scripts, a través de un protocolo para editores o embebida en tu propio programa. En Pi y en oh my pi todas esas vistas trabajan sobre el mismo agente.

**3 · Un turno por dentro**

Veamos qué pasa cuando escribes una petición. Usaremos el bucle de Pi, que es el mismo núcleo que hereda oh my pi. Tu mensaje se añade a la rama activa de la sesión. El harness monta la petición al modelo con el prompt de sistema, esa rama, las herramientas disponibles y los ajustes del modelo, y la envía al proveedor.

El modelo responde en streaming con texto y con llamadas a herramientas. El harness registra la respuesta, ejecuta cada llamada y registra los resultados. A eso lo llamamos un turno. Si los resultados piden otra vuelta, empieza otro turno; si no, la ejecución termina. Un encargo normal son muchos turnos encadenados.

Mientras el agente trabaja, puedes intervenir. Un mensaje de steering entra en cuanto termina el turno actual, para corregir el rumbo sin esperar. Un mensaje de follow-up espera a que el agente acabe todo lo pendiente. Y si algo va mal, puedes abortar la ejecución. Saber cuál usar en cada momento ahorra muchos tokens.

La sesión se guarda como un árbol, no como una lista. Cada entrada sabe cuál es su padre, y la rama activa es la que ve el modelo. Si vuelves a un punto anterior y continúas, se crea una rama nueva en el mismo fichero. Esto permite rebobinar y probar otro camino sin perder el anterior.

Cuando el contexto se acerca al límite, entra la compactación. Pi resume los mensajes antiguos en un bloque estructurado, con el objetivo, las restricciones, el progreso, las decisiones y los siguientes pasos, y conserva los mensajes recientes. El fichero original no se borra; lo que cambia es lo que se envía al modelo en las peticiones siguientes.

Fíjate en que todo esto es harness. El modelo no sabe que existe un árbol de sesión ni que su historial se ha resumido. Solo ve lo que el harness decide enviarle en cada turno. Por eso entender el turno es entender dónde puedes influir: en lo que entra, en lo que puede hacer y en cuándo se para.

**4 · Dos filosofías: Pi y oh my pi**

Pi es un agente para la terminal mínimo y extensible. Su lema lo deja claro: adapta Pi a tu forma de trabajar, no al revés. De serie trae solo cuatro herramientas activas: leer, escribir, editar y ejecutar comandos. Deja fuera a propósito los subagentes y el modo plan.

¿Y si los necesitas? Pi propone una escalera: usa el mecanismo más pequeño que resuelva el problema. Primero un AGENTS punto md; si no basta, una plantilla de prompt; después una skill; después una extensión en TypeScript; y al final, un paquete que puedes compartir con tu equipo. Incluso puedes pedirle a Pi que escriba la extensión por ti.

Pi tampoco pide permiso antes de usar una herramienta. Te enseña cada lectura, cada comando y cada edición, pero no se detiene a preguntar. Si quieres aprobaciones o un sandbox, se construyen con extensiones o se ejecuta Pi dentro de un contenedor. Lo veremos con detalle en el vídeo de seguridad.

oh my pi nace como un fork de Pi a principios de 2026 y toma el camino contrario: baterías incluidas. Sobre el mismo núcleo, con el bucle, el árbol de sesión, las extensiones y las skills, añade de serie unas treinta herramientas y ochenta y cinco comandos.

Trae subagentes, modo plan, objetivos con presupuesto, memoria entre sesiones, un servidor de lenguaje para navegar el código, un depurador, navegador, estadísticas y una interfaz de git. Corre sobre Bun con partes nativas en Rust, y lee la configuración de otros agentes como Claude Code o Codex.

También añade ingeniería pensada para el modelo. Una edición anclada por hash para que el modelo no estropee un fichero con referencias antiguas. Reglas que se inyectan en mitad de la respuesta cuando detectan un patrón. Un modelo asesor que revisa cada turno. Y roles de modelo, para usar uno barato en lo sencillo y uno potente en lo difícil.

Un detalle importante: oh my pi tampoco pide permiso por defecto. Su modo de aprobación de serie se llama yolo. Tiene modos más prudentes, pero hay que activarlos. Ni Pi ni oh my pi son seguros por accidente; la seguridad es una decisión que tomas tú.

Ninguna de las dos filosofías es mejor en abstracto. Pi te da un núcleo pequeño que entiendes entero y moldeas a tu medida. oh my pi te da un taller completo desde el primer día, a cambio de más superficie que aprender. Este curso te enseña las dos para que elijas con criterio, y para que lo que aprendas en una te sirva en la otra.

[EN PANTALLA: tabla con las cinco piezas como filas y Pi, oh my pi, Claude Code y Codex como columnas.]

Para situarlas, ayuda compararlas con otros agentes conocidos. Learn Harness Engineering analiza varios con las mismas cinco piezas. De Claude Code destaca su memoria por capas, sus permisos, sus hooks y sus subagentes. De Codex, que trata el repositorio como sistema de registro, con el AGENTS punto md como índice y aislamiento con worktrees. Y de Pi, su núcleo mínimo con extensiones programables.

oh my pi se parece a Claude Code en ambición, y además sabe leer su configuración y la de Codex: sus ficheros de contexto, sus servidores MCP y sus skills. Eso hace que cambiar de herramienta sea menos traumático. Lo que aprendas sobre las cinco piezas te sirve en cualquiera de ellos.

**5 · La misma tarea, dos agentes**

[EN PANTALLA: Orca con oh my pi a la izquierda (GPT-5.6-Luna) y Pi a la derecha (qwen3.8-27b, gratuito vía OpenRouter),
sobre el repositorio de juguete harness-demo. Capturas en work/caps/.]

Vamos a verlo en la práctica. Tenemos un repositorio de juguete con un fallo pequeño: un carrito de la compra con un cupón de descuento, y tres pruebas, de las que una falla. Les pedimos lo mismo a los dos agentes: hay una prueba que falla, encuentra por qué, corrígelo sin tocar otros archivos y ejecuta las pruebas al terminar.

Para que la comparación sea honesta, un aviso: no usan el mismo modelo. oh my pi trabaja con GPT-5.6 Luna, y Pi con Qwen 3.8 de veintisiete mil millones de parámetros, un modelo abierto que usamos en su versión gratuita. Eso también es harness: el mismo agente se puede conectar a modelos muy distintos.

[EN PANTALLA: oh my pi planificando: lista de cuatro tareas, Glob y «Read AGENTS.md» en rojo.]

Empecemos por oh my pi. Lo primero que hace es planificar: crea una lista de cuatro tareas en dos fases, diagnóstico y corrección. Después lista los ficheros del proyecto e intenta leer un AGENTS punto md. Fíjate en la cruz roja: no existe. Nadie le ha dejado instrucciones del proyecto, así que tendrá que deducir por sí mismo cómo se ejecutan las pruebas.

[EN PANTALLA: npm test fallando (22 frente a 26,1) y la edición de una línea.]

Ejecuta las pruebas y reproduce el fallo: esperábamos veintiséis con diez y sale veintidós. Encuentra la causa: la función que aplica el cupón multiplica por la cantidad dos veces. Y la corrige con una edición de una sola línea, anclada con su hash para no tocar nada más.

[EN PANTALLA: npm test en verde y el resumen final de oh my pi.]

Después hace lo que le pedimos: ejecuta las pruebas otra vez. Tres pruebas, tres en verde, ninguna fallida. Y entrega un resumen con la causa, la corrección y la verificación, y añade que solo ha modificado un archivo. Ese es el formato de entrega que queremos de cualquier agente: causa, cambio y evidencia.

[EN PANTALLA: Pi resolviendo la misma tarea: comandos bash, error 429 y verificación.]

Ahora Pi. Aquí vemos el bucle al desnudo, con sus cuatro herramientas. Explora con comandos de bash, lee el código, edita la línea y lanza las pruebas. A mitad de tarea el proveedor le devuelve un error de límite de peticiones; Pi reintenta solo y continúa. Esa recuperación no la hace el modelo, la hace el harness.

Pi también desconfía de su propia edición: sospecha que ha podido colar un carácter invisible, así que relee el fichero y vuelve a pasar las pruebas. Tres en verde. Corrige la misma línea que oh my pi, con el mismo resultado.

Pero fíjate en su resumen final. Dice que el total salía veintitrés con cincuenta y ocho, y no es verdad: salía veintidós. El modelo se ha inventado ese número. Por eso la evidencia que cuenta es la prueba que se ejecuta, no lo que el agente cuenta de sí mismo.

[EN PANTALLA: el diff de una línea en src/carrito.js.]

Antes de dar nada por bueno, miramos el diff. Una línea: el descuento se aplica una vez sobre el importe de cada línea, sin volver a multiplicar por la cantidad. Es pequeño, se entiende y se puede revisar en segundos. Un buen harness te deja siempre en esta posición: con poco que revisar y con pruebas de que funciona.

[EN PANTALLA: la primera ejecución con los dos agentes a la vez; Pi razonando que «el árbol de trabajo ya contiene una corrección».]

Y una anécdota de la grabación que vale más que cualquier diapositiva. La primera vez lanzamos los dos agentes a la vez, en la misma carpeta. oh my pi terminó antes, y cuando Pi fue a mirar, se encontró el fallo ya corregido por otro. Lo detectó y nos avisó, pero la tarea había dejado de ser suya. Es exactamente el problema del entorno compartido: dos agentes en la misma carpeta se pisan. Para trabajar en paralelo, cada uno necesita su propio espacio.

[EN PANTALLA: /context de oh my pi: prompt de sistema 2,7K, herramientas 3,9K, mensajes 2,9K.]

Para terminar la demo, miramos dentro de oh my pi con barra context. Antes de que escribamos nada, el prompt de sistema ya ocupa dos mil setecientos tokens, y las descripciones de las herramientas, tres mil novecientos: más que toda nuestra conversación con el agente. Ese es el impuesto de las herramientas del que hablábamos, medido.

Fíjate en lo que tienen en común los dos. Leen antes de escribir, ejecutan las pruebas para comprobar el resultado y lo hacen porque se lo pedimos en el encargo. Ese «ejecuta las pruebas al terminar» es feedback que hemos puesto nosotros. Sin esa frase, ninguno de los dos estaría obligado a verificar nada.

Y fíjate en lo que cambia: cómo planifica cada uno, cuánto contexto ocupa al empezar, cuántas herramientas declara y cómo se recupera de los errores. No hay un ganador universal. Hay un harness que se ajusta mejor a una tarea y a una forma de trabajar.

**6 · Cuando falla: ¿qué pieza ha sido?**

Las cinco piezas no son solo un mapa para aprender; son una herramienta de diagnóstico. Cuando un agente falla, la reacción habitual es culpar al modelo y probar otro. Muchas veces el problema está en el harness, y cambiar de modelo solo lo esconde.

Haz las preguntas en orden. ¿Las instrucciones eran claras y estaban a la vista del agente? ¿Tenía las herramientas adecuadas, o le sobraban tantas que se perdió? ¿El entorno era el correcto: dependencias, permisos, versión del proyecto? ¿Conservaba el estado necesario, o se perdió en una compactación? ¿Tenía una forma objetiva de saber que había terminado?

Un ejemplo típico: el agente dice que ha arreglado algo y no es verdad. Rara vez es un problema del modelo. Casi siempre falta feedback: no había pruebas que ejecutar, o nadie definió qué significaba terminado. La solución no es otro modelo, sino un criterio de aceptación que se pueda comprobar.

Otro ejemplo: en una sesión larga, el agente olvida una restricción que le diste al principio. Es un problema de estado. La restricción vivía solo en la conversación y se diluyó al compactar. La solución es moverla a las instrucciones del proyecto, donde se carga en cada turno.

Tercer ejemplo: el agente tarda mucho y elige herramientas raras. Revisas y tiene cuarenta herramientas de varios servidores MCP conectados. Es un problema de herramientas. La solución es reducir lo que se declara o cargarlo bajo demanda, que es justo lo que hace codemode en Pi.

Cuarto ejemplo: las pruebas pasan cuando las ejecuta el agente y fallan en la integración continua. Es un problema de entorno: otra versión de Node, otra variable de entorno, otra base de datos. La solución es fijar versiones y que el agente y la integración continua arranquen con el mismo script.

Y quinto: el agente toca archivos que no debía. Puede ser un problema de instrucciones, porque nadie le dijo dónde no entrar, o de políticas, porque tenía permiso para escribir en todas partes. Lo primero se arregla en el AGENTS punto md; lo segundo, con aprobaciones o con un entorno que solo monte lo necesario.

Hay una técnica muy útil para encontrar qué pieza importa: quitar componentes de uno en uno y ver qué se rompe. Quita una herramienta, una línea del AGENTS punto md o una prueba, y observa el resultado. Lo que no cambia nada, probablemente sobra. Lo que lo rompe todo es lo que hay que cuidar.

Y una advertencia: el harness se degrada como el código. Las instrucciones se quedan desfasadas, las pruebas dejan de cubrir lo importante y las herramientas se acumulan. Revisarlo de vez en cuando forma parte del trabajo, igual que refactorizar.

**7 · El mapa del curso**

Con este vocabulario ya podemos recorrer el curso. Son veintiséis vídeos en cuatro bloques. Este es el primero, el marco común.

El bloque de Pi tiene nueve vídeos. Empezamos instalando Pi y haciendo una primera tarea, vemos cómo funciona por dentro, cómo elegir modelos y proveedores, y cómo trabajar con seguridad. Después aprendemos a personalizarlo sin código, conocemos MCP y codemode, dos de sus piezas más recientes, escribimos extensiones propias y lo usamos desde scripts.

El bloque de oh my pi tiene once vídeos: qué cambia respecto a Pi, la interfaz y las sesiones, el contexto y la memoria, los modelos y roles, la planificación, los subagentes, el entorno de desarrollo integrado, git y calidad, las aprobaciones y reglas, cómo extenderlo y cómo usarlo en equipo.

El último bloque, de cinco vídeos, es de método: cómo diseñar tu propio harness, cómo convertir el repositorio en el sistema de registro, cómo verificar de verdad, cuándo compensa orquestar varios agentes, y un proyecto final de principio a fin.

Antes del siguiente vídeo, una práctica breve. Elige una tarea que hayas hecho con un agente, cualquiera, y analízala con las cinco piezas. ¿Qué instrucciones tenía? ¿Qué herramientas usó? ¿Dónde se ejecutó? ¿Qué recordaba y qué olvidó? ¿Cómo supiste que había terminado? Apunta qué pieza mejorarías primero.

En el próximo vídeo instalamos Pi y hacemos nuestra primera tarea. El modelo pone la inteligencia; el harness pone todo lo demás. Nos vemos dentro.

</details>

