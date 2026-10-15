---
title: "Vídeo 01 · Qué es un harness de agente"
description: "los dos sentidos de «harness» y sus cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Vemos la misma tarea con Pi y con oh my pi para comparar dos filosofías."
ruta: "pi-oh-my-pi"
orden: 1
duracion: "22 min"
video: "01-que-es-un-harness.mp4"
subtitulos: "/subtitulos/pi-oh-my-pi/01-que-es-un-harness.es.vtt"
---

los dos sentidos de «harness» y sus cinco piezas: instrucciones, herramientas, entorno, estado y feedback. Vemos la misma tarea con Pi y con oh my pi para comparar dos filosofías.

<p class="guia__nota">Dura 22 min. Los títulos de cada capítulo saltan a ese punto del vídeo.</p>

## Resumen por capítulos

### 1 · El modelo no trabaja solo

<p><button type="button" class="ir-a" data-t="17">▶ Ir a 0:17</button></p>

- **El punto de partida:** El modelo recibe texto y devuelve texto — No lee tu repositorio, no ejecuta pruebas, no recuerda.
- **El harness: todo lo que no son los pesos:** Instrucciones (lo que lee) → Herramientas (lo que puede hacer) → Entorno (dónde se ejecuta) → Estado (lo que conserva) → Feedback (cómo se comprueba)
- **En una frase:** El modelo decide qué . El harness, cuándo, dónde y cómo. — Un buen harness no vuelve más listo al modelo: vuelve fiable lo que produce.
- **Por eso:** Mismo modelo, resultados distintos — Cambia lo que ve, lo que puede hacer y cuándo se da por terminado.
- **Primer sentido:** El harness como programa — Ejecuta el bucle: sesión, herramientas, permisos y compactación. Pi y oh my pi.
- **Dos sentidos de «harness»**
  - `1` · El programa: Pi, oh my pi: ejecutan el bucle del agente
  - `2` · El andamiaje del repo: AGENTS.md, scripts, tareas, traspasos, rúbricas: portable
- **Cómo los recorre el curso**
  - `B·C` · Pi y oh my pi: el harness como programa
  - `D` · Método: el harness de tu proyecto

### 2 · Las cinco piezas del harness

<p><button type="button" class="ir-a" data-t="151">▶ Ir a 2:31</button></p>

- **Las cinco piezas · Learn Harness Engineering**
  - `01` · Instrucciones: qué y cómo
  - `02` · Herramientas: y sus políticas
  - `03` · Entorno: dónde se ejecuta
  - `04` · Estado: lo que se recuerda
  - `05` · Feedback: cómo se verifica
- **01 · Instrucciones:** Un mapa, no un manual — Prompt de sistema · AGENTS.md · skills · plantillas de prompt
- *En terminal:* AGENTS.md · instrucciones del proyecto (más abajo, en «Código y comandos»)
- **02 · Herramientas:** Las manos del agente, con mínimo privilegio — Qué hace sin preguntar · qué necesita aprobación · qué está prohibido
- *En la demo:* Cada herramienta viaja, descrita, en cada petición
- **Dos extremos**
  - `4` · Pi: herramientas activas de serie
  - `12/24` · oh my pi: activas / disponibles en la demo
- **03 · Entorno:** Quien decide no debería ser quien ejecuta — Tu máquina · un contenedor · una máquina virtual · un servidor remoto
- **npm install, en dos entornos**
  - `✕` · En tu máquina: los scripts corren con tus permisos
  - `✓` · En un contenedor: solo ve lo que tú le montas
- **Cuando se llena el contexto:** Resumir (Pi compacta solo) → Podar (fuera resultados pesados) → Traspasar (documento y sesión limpia)
- **Estado fuera de la conversación:** Lo que no está en ficheros, no existe — Repositorio · lista de tareas · documento de traspaso
- **05 · Feedback:** Una forma objetiva de saber que ha terminado — Pruebas · linters · revisiones · criterios de aceptación
- *En terminal:* harness-demo · el feedback es una orden (más abajo, en «Código y comandos»)
- **Separa a quien hace de quien revisa:** Hace (el agente) → Revisa (persona, otro agente o pruebas)
- **Y una sexta: las vistas**
  - `TUI` · Terminal: interactiva
  - `-p` · Scripts: texto y JSON
  - `RPC` · Editores: por protocolo
  - `SDK` · Tu programa: embebido

### 3 · Un turno por dentro

<p><button type="button" class="ir-a" data-t="446">▶ Ir a 7:26</button></p>

- **Un turno, paso a paso:** Tu mensaje (a la rama activa) → La petición (prompt · rama · herramientas) → El proveedor (el modelo responde)
- **Intervenir mientras trabaja**
  - `↵` · Steering: entra al acabar el turno
  - `⇥` · Follow-up: espera a que termine todo
  - `Esc` · Abortar: para la ejecución
- **Sesiones:** La sesión es un árbol — Rebobina y prueba otro camino sin perder el anterior.
- **Lo que guarda la compactación:** Objetivo → Restricciones → Progreso → Decisiones → Siguientes pasos
- **Todo esto es harness:** El modelo solo ve lo que el harness le envía — Lo que entra · lo que puede hacer · cuándo se para

### 4 · Dos filosofías: Pi y oh my pi

<p><button type="button" class="ir-a" data-t="568">▶ Ir a 9:28</button></p>

- **Pi · cuatro herramientas de serie**
  - `read` · Leer: ficheros
  - `write` · Escribir: ficheros nuevos
  - `edit` · Editar: reemplazo exacto
  - `bash` · Ejecutar: comandos
- **La escalera: el mecanismo más pequeño:** AGENTS.md → Plantilla → Skill → Extensión → Paquete
- **Pi:** No pide permiso: te enseña cada paso — Aprobaciones y sandbox: con extensiones o con un contenedor.
- **oh my pi · fork de Pi, 2026:** Baterías incluidas — Unas treinta herramientas y ochenta y cinco comandos de serie.
- **Lo que trae de serie**
  - `⇉` · Subagentes: trabajo en paralelo
  - `◎` · Plan y objetivos: con presupuesto
  - `◷` · Memoria: entre sesiones
  - `` · IDE: LSP · depurador · git
- **Ingeniería pensada para el modelo**
  - `#` · Hashline: edición anclada
  - `TTSR` · Reglas: en mitad de la respuesta
  - `◉` · Asesor: revisa cada turno
  - `⇅` · Roles: barato o potente
- **Seguridad:** Ninguno pide permiso por defecto — oh my pi: tools.approvalMode = yolo. La seguridad la decides tú.
- **Dos filosofías**
  - `pi` · Pi: un núcleo pequeño que entiendes y moldeas
  - `omp` · oh my pi: un taller completo desde el primer día
- **Las mismas piezas, otros agentes**
  - `CC` · Claude Code: memoria por capas, permisos, hooks, subagentes
  - `CX` · Codex: repo como registro, AGENTS.md, worktrees
  - `pi` · Pi: núcleo mínimo con extensiones
  - *Análisis de Learn Harness Engineering (MIT · © 2025 WalkingLab)*
- **Compatibilidad:** oh my pi lee la configuración de Claude Code y Codex — Ficheros de contexto · servidores MCP · skills

### 5 · La misma tarea: dos agentes

<p><button type="button" class="ir-a" data-t="764">▶ Ir a 12:44</button></p>

- *En terminal:* harness-demo · src/carrito.js y sus pruebas (más abajo, en «Código y comandos»)
- **Dos agentes, dos modelos**
  - `omp` · oh my pi: GPT-5.6 Luna
  - `pi` · Pi: Qwen 3.8 27B · gratuito vía OpenRouter
- *En la demo:* oh my pi planifica y busca un AGENTS.md que no existe
- *En la demo:* Reproduce el fallo y corrige una línea
- *En la demo:* Causa, cambio y evidencia
- *En la demo:* Pi: el bucle al desnudo, con bash
- *En la demo:* Un 429 del proveedor: el harness reintenta
- *En la demo:* Pi desconfía de su propia edición y la comprueba
- *En la demo:* Un dato inventado: el total era 22, no 23,58
- *En terminal:* git diff · la corrección de una línea (más abajo, en «Código y comandos»)
- *En la demo:* Dos agentes en la misma carpeta se pisan
- *En la demo:* /context: el impuesto de las herramientas, medido
- **Lo que tienen en común:** Los dos verifican porque se lo pedimos — «Ejecuta las pruebas al terminar» es feedback que pusimos nosotros.
- **Lo que cambia**
  - `01` · Planificación: lista de tareas o directo
  - `02` · Contexto inicial: prompt y herramientas
  - `03` · Herramientas: cuántas declara
  - `04` · Recuperación: ante errores

### 6 · Cuando falla: ¿qué pieza ha sido?

<p><button type="button" class="ir-a" data-t="1017">▶ Ir a 16:57</button></p>

- **Diagnóstico:** Antes de cambiar de modelo, arregla el harness — Cambiar de modelo a menudo solo esconde el problema.
- **Las preguntas, en orden**
  - `?` · Instrucciones: ¿claras y a la vista?
  - `?` · Herramientas: ¿las justas?
  - `?` · Entorno: ¿el correcto?
  - `?` · Estado: ¿se conservó?
  - `?` · Feedback: ¿sabía cuándo acabar?
- **Caso 1 · «Ya está arreglado» y no lo está:** Síntoma (falsa victoria) → Pieza (feedback) → Solución (criterio comprobable)
- **Caso 2 · Olvida una restricción:** Síntoma (sesión larga) → Pieza (estado) → Solución (a las instrucciones)
- **Caso 3 · Lento y elige mal:** Síntoma (cuarenta herramientas) → Pieza (herramientas) → Solución (menos, o bajo demanda)
- **Caso 4 · Pasa aquí, falla en CI:** Síntoma (resultados distintos) → Pieza (entorno) → Solución (versiones fijas, mismo arranque)
- **Caso 5 · Toca lo que no debía:** Síntoma (archivos ajenos) → Pieza (instrucciones o políticas) → Solución (AGENTS.md y permisos)
- **Ablación:** Quita piezas de una en una y mira qué se rompe — Lo que no cambia nada, sobra. Lo que lo rompe todo, hay que cuidarlo.
- **Mantenimiento:** El harness se degrada como el código — Revísalo de vez en cuando, igual que refactorizas.

### 7 · El mapa del curso

<p><button type="button" class="ir-a" data-t="1183">▶ Ir a 19:43</button></p>

- **26 vídeos · 4 bloques**
  - `A` · Marco: 1 vídeo
  - `B` · Pi: 9 vídeos
  - `C` · oh my pi: 11 vídeos
  - `D` · Método: 5 vídeos
- **Bloque Pi · 9 vídeos**
  - `02` · Empezar: instalar, por dentro, modelos
  - `05` · Seguridad: y aislamiento
  - `06` · Personalizar: sin código · MCP
  - `08` · Extender: extensiones y scripts
- **Bloque oh my pi · 11 vídeos**
  - `11` · Sesiones: cambios, TUI, contexto
  - `14` · Dirigir: modelos y planificación
  - `16` · Subagentes: e IDE integrado
  - `18` · Calidad: permisos y equipo
- **Bloque de método · 5 vídeos**
  - `22` · Diseñar: tu harness
  - `23` · Registro: el repositorio
  - `24` · Verificar: de verdad
  - `25` · Orquestar: cuándo compensa
  - `26` · Proyecto: de principio a fin
- **Práctica · analiza una tarea tuya**
  - `?` · Instrucciones: ¿qué tenía?
  - `?` · Herramientas: ¿qué usó?
  - `?` · Entorno: ¿dónde corrió?
  - `?` · Estado: ¿qué olvidó?
  - `?` · Feedback: ¿cómo supiste?
- **Próximo vídeo:** Instalar Pi y primera tarea — El modelo pone la inteligencia; el harness, todo lo demás.

## Código y comandos

Lo que aparece en las ventanas de terminal del vídeo, para copiarlo.

### AGENTS.md · instrucciones del proyecto

```text
cat AGENTS.md
# harness-demo
- Pruebas: npm test (deben pasar antes de terminar)
- No tocar: dist/ ni ficheros .env
- Commits: en español y en imperativo
```

- `npm test`: Cómo se verifica
- `- No tocar`: Dónde no entrar
- `- Commits`: Cómo se entrega

### harness-demo · el feedback es una orden

```text
npm test
✔ subtotal suma precio por cantidad
✔ sin cupón el total es el subtotal
✖ un cupón del 10 % descuenta una sola vez
ℹ pass 2 · fail 1
```

- `npm test`: Señal objetiva
- `✖ un cupón del 10 %`: Una prueba falla

### harness-demo · src/carrito.js y sus pruebas

```text
npm test
✖ un cupón del 10 % descuenta una sola vez
  esperado: 26.1   obtenido: 22
```

- `un cupón del 10 %`: Carrito con cupón
- `obtenido: 22`: La prueba que falla

### git diff · la corrección de una línea

```text
git diff src/carrito.js
- total += cupon ? linea - linea * (cupon.porcentaje / 100) * l.cantidad : linea;
+ total += cupon ? linea - linea * (cupon.porcentaje / 100) : linea;
```

- `* l.cantidad`: Se multiplicaba dos veces

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

El bloque de Pi tiene nueve vídeos. Empezamos instalando Pi y haciendo una primera tarea, vemos cómo funciona por dentro, cómo elegir modelos y proveedores, y cómo trabajar con seguridad. Después aprendemos a personalizarlo sin código, conocemos MCP y codemode, que son la gran novedad de la versión uno, escribimos extensiones propias y lo usamos desde scripts.

El bloque de oh my pi tiene once vídeos: qué cambia respecto a Pi, la interfaz y las sesiones, el contexto y la memoria, los modelos y roles, la planificación, los subagentes, el entorno de desarrollo integrado, git y calidad, las aprobaciones y reglas, cómo extenderlo y cómo usarlo en equipo.

El último bloque, de cinco vídeos, es de método: cómo diseñar tu propio harness, cómo convertir el repositorio en el sistema de registro, cómo verificar de verdad, cuándo compensa orquestar varios agentes, y un proyecto final de principio a fin.

Antes del siguiente vídeo, una práctica breve. Elige una tarea que hayas hecho con un agente, cualquiera, y analízala con las cinco piezas. ¿Qué instrucciones tenía? ¿Qué herramientas usó? ¿Dónde se ejecutó? ¿Qué recordaba y qué olvidó? ¿Cómo supiste que había terminado? Apunta qué pieza mejorarías primero.

En el próximo vídeo instalamos Pi y hacemos nuestra primera tarea. El modelo pone la inteligencia; el harness pone todo lo demás. Nos vemos dentro.

</details>

