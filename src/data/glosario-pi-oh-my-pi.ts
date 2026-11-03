// Glosario del curso «Pi y oh my pi» (/rutas/pi-oh-my-pi/glosario).
//
// REGLA: quien cambie el nombre de un concepto en una guía actualiza el glosario.
// Si renombras un término, una sinonimia o un capítulo citado aquí, cambia también esta lista.
//
// Cada término apunta a capítulos de las guías por id de guía y número de capítulo
// («### 6 · La compactación» es el capítulo 6). El minuto, el título y el ancla salen de la
// propia guía al construir el sitio: si una guía o un capítulo citado deja de existir, el build falla.
//
// - `explica`: el capítulo donde el término se cuenta de verdad.
// - `primera`: dónde aparece antes por primera vez con sentido (no la simple mención en un índice
//   o en el «próximo vídeo»). Solo si es otro capítulo distinto de `explica`.
// - `tambien`: otros capítulos que lo amplían.
// - `sinonimos`: otros nombres con que aparece el mismo concepto en las guías (comandos de Pi y de
//   oh my pi, nombres en inglés…). El término canónico es el que usamos en el texto.
// Las definiciones salen de las guías: no añadas aquí nada que el curso no cuente.

export interface RefCapitulo {
  guia: string;
  capitulo: number;
}

export interface Termino {
  termino: string;
  sinonimos?: string[];
  definicion: string;
  explica: RefCapitulo;
  primera?: RefCapitulo;
  tambien?: RefCapitulo[];
}

const v01 = '01-que-es-un-harness';
const v02 = '02-instalar-pi-primera-tarea';
const v03 = '03-pi-por-dentro';
const v04 = '04-modelos-y-proveedores';
const v05 = '05-seguridad-y-aislamiento';
const v06 = '06-personalizar-sin-codigo';
const v07 = '07-mcp-y-codemode';
const v08 = '08-extensiones-i';
const v09 = '09-extensiones-ii-y-paquetes';
const v10 = '10-pi-programatico';
const v11 = '11-de-pi-a-oh-my-pi';
const v12 = '12-la-tui-y-las-sesiones';
const v13 = '13-contexto-y-memoria';
const v14 = '14-modelos-roles-y-razonamiento';
const v15 = '15-planificar-y-dirigir';
const v16 = '16-subagentes-y-paralelo';
const v17 = '17-el-ide-integrado';
const v18 = '18-git-calidad-y-entrega';
const v19 = '19-aprobaciones-reglas-y-hooks';
const v20 = '20-extender-omp';
const v21 = '21-omp-programatico-metricas-equipo';
const v22 = '22-disenar-tu-harness';
const v23 = '23-el-repo-como-sistema-de-registro';
const v24 = '24-verificar-de-verdad';
const v25 = '25-bucles-grafos-y-coste';
const v27 = '27-de-fallos-a-regresiones';
const v28 = '28-agentes-que-trabajan-sin-ti';

const c = (guia: string, capitulo: number): RefCapitulo => ({ guia, capitulo });

export const GLOSARIO_PI: Termino[] = [
  // ── El marco ─────────────────────────────────────────────
  {
    termino: 'Harness',
    definicion:
      'Todo lo que no son los pesos del modelo: las instrucciones, las herramientas, el entorno, el estado y el feedback. Tiene dos sentidos: el programa que ejecuta el bucle del agente (Pi, oh my pi) y el andamiaje que pones en tu repositorio para que cualquier agente trabaje mejor.',
    explica: c(v01, 1),
    tambien: [c(v22, 1)],
  },
  {
    termino: 'Cinco piezas del harness',
    definicion:
      'Instrucciones, herramientas, entorno, estado y feedback: la taxonomía de Learn Harness Engineering. Sirve para atribuir un fallo a una pieza antes de cambiar de modelo.',
    explica: c(v01, 2),
    tambien: [c(v01, 6), c(v22, 2)],
  },
  {
    termino: 'Turno',
    sinonimos: ['bucle del agente'],
    definicion:
      'Una vuelta del bucle: el harness monta la petición (prompt de sistema, historial, herramientas y ajustes), el modelo responde con texto y llamadas a herramientas, y el harness las ejecuta. Un encargo normal son muchos turnos.',
    explica: c(v01, 3),
    tambien: [c(v03, 1)],
  },
  {
    termino: 'Revisor',
    sinonimos: ['reviewer'],
    definicion:
      'Quien da el trabajo por bueno, separado de quien lo hace: otra persona, otro agente o una batería de pruebas. Con una rúbrica, puntúa los criterios de juicio con ella y no con su intuición.',
    explica: c(v24, 7),
    primera: c(v01, 2),
    tambien: [c(v16, 2)],
  },

  // ── Pi: instrucciones y sesión ───────────────────────────
  {
    termino: 'Prompt de sistema',
    sinonimos: ['system prompt', 'SYSTEM.md', 'APPEND_SYSTEM.md'],
    definicion:
      'Las instrucciones base del agente, más los AGENTS.md que encuentra. En Pi, APPEND_SYSTEM.md le añade texto y SYSTEM.md lo sustituye entero.',
    explica: c(v03, 2),
    primera: c(v01, 2),
    tambien: [c(v06, 3)],
  },
  {
    termino: 'AGENTS.md',
    sinonimos: ['fichero de contexto', 'CLAUDE.md'],
    definicion:
      'Las instrucciones del proyecto que el agente carga en cada sesión. Funciona como un mapa corto (qué es el proyecto, cómo se arranca y se verifica, pocas reglas), no como una enciclopedia.',
    explica: c(v06, 2),
    primera: c(v01, 1),
  },
  {
    termino: 'Directorio del agente',
    sinonimos: ['~/.pi/agent', 'PI_CODING_AGENT_DIR', 'perfil (oh my pi, --profile)'],
    definicion:
      'Donde Pi guarda ajustes, atajos, credenciales, sesiones y recursos. En oh my pi el equivalente es el perfil: un directorio propio por nombre, integrado.',
    explica: c(v02, 2),
    tambien: [c(v11, 4)],
  },
  {
    termino: 'Steering',
    sinonimos: ['guiar'],
    definicion:
      'Un mensaje que escribes con Enter mientras el agente trabaja, para corregir el rumbo. En Pi entra al acabar el turno en curso; en oh my pi, en el siguiente paso entre herramientas.',
    explica: c(v02, 6),
    primera: c(v01, 3),
    tambien: [c(v15, 5)],
  },
  {
    termino: 'Follow-up',
    sinonimos: ['mensaje en cola', '/queue (oh my pi)'],
    definicion:
      'Un mensaje que encolas mientras el agente trabaja (Alt+Enter en Pi) y que espera a que termine todo lo pendiente. En oh my pi se encola con /queue.',
    explica: c(v02, 6),
    primera: c(v01, 3),
    tambien: [c(v15, 5)],
  },
  {
    termino: 'Pie',
    sinonimos: ['footer'],
    definicion:
      'La línea bajo el editor de Pi: carpeta, rama de git, modelo, tokens, caché y uso de contexto. Con un modelo de pago, también el coste acumulado.',
    explica: c(v02, 7),
    primera: c(v02, 3),
  },
  {
    termino: 'Caché de prompts',
    definicion:
      'Lo que el proveedor ya tiene guardado del principio de la petición se cobra más barato y responde antes. Cambiar el prompt de sistema o las herramientas, o compactar, la rompe.',
    explica: c(v02, 7),
    tambien: [c(v03, 6), c(v13, 5)],
  },
  {
    termino: 'Sesión',
    sinonimos: ['árbol de sesión', 'JSONL'],
    definicion:
      'Un fichero JSONL con una entrada por línea; cada entrada lleva id y parentId, así que forman un árbol. El modelo solo ve la rama activa, y nada se borra.',
    explica: c(v03, 3),
    primera: c(v01, 3),
  },
  {
    termino: 'Rebobinar',
    sinonimos: ['/tree', '/branch y /rewind (oh my pi)'],
    definicion:
      'Volver a un punto anterior de la conversación y seguir desde ahí; la rama vieja se queda en el mismo fichero. Mueve la conversación, no tus ficheros: guarda en git antes de saltar.',
    explica: c(v03, 4),
    tambien: [c(v12, 4), c(v12, 5)],
  },
  {
    termino: 'Resumen de rama',
    definicion:
      'Al volver atrás en el árbol, Pi ofrece resumir la rama que dejas (objetivo, restricciones, progreso, decisiones, siguientes pasos y ficheros) y lo cuelga en el punto de vuelta. En oh my pi, rebobinar con /branch no lo hace.',
    explica: c(v03, 4),
    tambien: [c(v12, 4)],
  },
  {
    termino: 'Bifurcar',
    sinonimos: ['/fork', '/clone'],
    definicion:
      'Sacar parte de una conversación a un fichero de sesión nuevo: /fork se lleva el camino hasta el mensaje que eliges; /clone, la rama activa tal como está.',
    explica: c(v03, 5),
    tambien: [c(v12, 6)],
  },
  {
    termino: 'Compactación',
    sinonimos: ['/compact', 'compaction'],
    definicion:
      'Resumir la parte antigua de la conversación cuando se acerca al límite de la ventana y conservar lo reciente. El fichero no pierde nada, pero el modelo solo ve el resumen, y la caché cae.',
    explica: c(v03, 6),
    primera: c(v01, 3),
    tambien: [c(v13, 3), c(v13, 5)],
  },
  {
    termino: 'Podar el contexto',
    sinonimos: ['/shake (oh my pi)'],
    definicion:
      'Quitar del contexto resultados pesados de herramientas sin llamar al modelo. En oh my pi, /shake deja cada resultado quitado como una referencia que el modelo puede volver a leer.',
    explica: c(v13, 4),
    primera: c(v01, 2),
  },
  {
    termino: 'Traspaso',
    sinonimos: ['handoff', '/handoff (oh my pi)', 'traspaso.md'],
    definicion:
      'Un documento para que otra sesión retome el trabajo: qué está verificado, qué cambió, qué está roto, el siguiente paso y cómo arrancar. /handoff lo guarda dentro de la sesión; traspaso.md lo versiona en el repositorio.',
    explica: c(v13, 6),
    primera: c(v01, 2),
    tambien: [c(v23, 5)],
  },

  // ── Pi: modelos y seguridad ──────────────────────────────
  {
    termino: 'Nivel de razonamiento',
    sinonimos: ['thinking (Pi, /thinking)', 'esfuerzo (oh my pi, /effort)'],
    definicion:
      'Cuánto piensa el modelo antes de responder, de off a max. Cada modelo admite solo algunos niveles, y el razonamiento se cobra como salida.',
    explica: c(v04, 4),
    tambien: [c(v14, 4)],
  },
  {
    termino: 'Confianza de proyecto',
    sinonimos: ['/trust'],
    definicion:
      'El filtro de arranque de Pi que decide si carga los recursos de la carpeta .pi/ de un repositorio (extensiones, MCP, skills…). No filtra lo que el modelo lee ni limita lo que hace una vez arrancado; oh my pi no la tiene.',
    explica: c(v05, 3),
    primera: c(v02, 2),
  },
  {
    termino: 'Sandbox',
    sinonimos: ['aislamiento', 'contenedor', 'anfitrión y sandbox'],
    definicion:
      'Un entorno aislado (contenedor, VM o micro-VM) donde corre el agente o sus herramientas: una frontera que no depende del criterio del modelo y protege lo que no expones. Como principio de diseño: el anfitrión decide (sesión, política, aprobaciones, límites) y el sandbox solo ejecuta.',
    explica: c(v05, 5),
    primera: c(v01, 4),
    tambien: [c(v22, 8)],
  },
  {
    termino: 'Modo de aprobación',
    sinonimos: ['tools.approvalMode', 'always-ask', 'write'],
    definicion:
      'Qué se ejecuta sin preguntar. En oh my pi cada herramienta declara un nivel (read, write o exec) y el modo decide: always-ask solo aprueba lecturas, write lecturas y ediciones, yolo todo. Pi no lo trae: lo construyes con una extensión.',
    explica: c(v19, 2),
    primera: c(v01, 4),
    tambien: [c(v08, 6)],
  },
  {
    termino: 'Yolo',
    definicion:
      'El modo de aprobación con el que arranca oh my pi: lo aprueba todo sin preguntar. Los modos prudentes, write y always-ask, hay que activarlos.',
    explica: c(v19, 2),
    primera: c(v01, 4),
    tambien: [c(v11, 6)],
  },
  {
    termino: 'Patrones de bash',
    sinonimos: ['bash.patterns', 'allow / prompt / deny'],
    definicion:
      'En oh my pi, una lista ordenada de reglas para comandos de bash, cada una con una decisión (allow, prompt o deny); gana la primera que encaja. Un deny bloquea siempre, también en yolo.',
    explica: c(v19, 4),
  },
  {
    termino: 'Redacción de secretos',
    sinonimos: ['secrets.enabled'],
    definicion:
      'En oh my pi, sustituir los valores sensibles por un marcador antes de enviarlos al proveedor; al ejecutar un comando, omp pone el valor real. Viene apagada y no cubre el prompt de sistema ni las exportaciones.',
    explica: c(v19, 8),
  },

  // ── Pi: personalizar y extender ──────────────────────────
  {
    termino: 'Prompt template',
    sinonimos: ['plantilla de prompt'],
    definicion:
      'Un Markdown en prompts/ que se convierte en comando (review.md → /review): el prompt que repites, con sus restricciones escritas una vez. Es solo texto; no ejecuta nada.',
    explica: c(v06, 4),
    primera: c(v01, 2),
  },
  {
    termino: 'Comando de proyecto',
    definicion:
      'En oh my pi, un Markdown en .omp/commands/ que se convierte en comando. Es como un prompt template, pero versionado con el repositorio para todo el equipo.',
    explica: c(v20, 2),
  },
  {
    termino: 'Skill',
    definicion:
      'Una carpeta con un SKILL.md (y, si hace falta, scripts y referencias) que el modelo carga solo cuando la tarea encaja con su descripción. Hasta entonces solo ocupa su nombre y su descripción.',
    explica: c(v06, 5),
    primera: c(v01, 2),
    tambien: [c(v20, 3), c(v20, 4)],
  },
  {
    termino: 'MCP',
    sinonimos: ['Model Context Protocol', 'servidor MCP'],
    definicion:
      'Un estándar abierto para que un agente use herramientas que expone otro programa, el servidor MCP. Cada herramienta declarada viaja en cada petición, y por eso cuesta contexto.',
    explica: c(v07, 1),
    tambien: [c(v07, 3)],
  },
  {
    termino: 'Codemode',
    definicion:
      'En Pi, tres cosas con el mismo nombre: la herramienta que deja al modelo escribir un script de JavaScript que llama a otras herramientas, la exposición de un servidor MCP que solo es accesible desde ella y el ajuste codemode.mode. Ahorra contexto porque al modelo solo le llega la salida del script.',
    explica: c(v07, 5),
    primera: c(v01, 6),
    tambien: [c(v07, 4)],
  },
  {
    termino: 'Tool search',
    sinonimos: ['tool_search', 'modo deferred'],
    definicion:
      'Las herramientas no se declaran hasta que el modelo las busca con tool_search, en lenguaje natural. Desde ahí las llama directamente, sin script.',
    explica: c(v07, 6),
    tambien: [c(v07, 4)],
  },
  {
    termino: 'Extensión',
    definicion:
      'Un módulo de TypeScript que corre dentro del proceso de Pi y usa su API para registrar comandos, herramientas y atajos, y escuchar eventos. Corre con tus permisos: instala solo las que entiendas.',
    explica: c(v08, 1),
    primera: c(v01, 4),
    tambien: [c(v20, 5)],
  },
  {
    termino: 'tool_call',
    sinonimos: ['evento tool_call'],
    definicion:
      'El evento que llega antes de ejecutar cada herramienta, con su nombre y sus argumentos: puedes dejarla pasar, cambiar los argumentos o bloquearla con un motivo. Es el punto central de la política en Pi; si tu handler falla, la herramienta se bloquea.',
    explica: c(v08, 4),
    tambien: [c(v22, 7)],
  },
  {
    termino: 'Hook',
    definicion:
      'En oh my pi, un módulo con la forma de una extensión que vive en .omp/hooks/pre/ o .omp/hooks/post/; sirve para lo que la configuración no alcanza, como proteger rutas. En Claude Code, en cambio, un hook es un proceso externo.',
    explica: c(v19, 5),
    primera: c(v08, 5),
  },
  {
    termino: 'Paquete',
    definicion:
      'Un directorio o un paquete de npm que reúne extensiones, skills, prompt templates y temas para instalarlos juntos con pi install.',
    explica: c(v09, 7),
    primera: c(v01, 4),
  },
  {
    termino: 'Plugin',
    sinonimos: ['marketplace'],
    definicion:
      'En oh my pi, un paquete que declara extensiones y puede traer skills, comandos, hooks, herramientas, agentes, reglas y MCP. Instalarlo ya es ejecutar su código.',
    explica: c(v20, 6),
  },

  // ── Pi sin interfaz ──────────────────────────────────────
  {
    termino: 'Modo print',
    sinonimos: ['pi -p', 'omp -p', '--print'],
    definicion:
      'Una petición sin interfaz: el agente escribe la respuesta y termina. Un código de salida 0 dice que ha terminado de hablar, no que haya acertado.',
    explica: c(v10, 2),
    primera: c(v02, 2),
    tambien: [c(v21, 2)],
  },
  {
    termino: 'Modo JSON',
    sinonimos: ['--mode json'],
    definicion:
      'Emite un evento por línea (JSONL), casi los mismos que escuchan las extensiones. En Pi, si ha ido bien lo dice el stopReason del último mensaje, no el código de salida.',
    explica: c(v10, 3),
    primera: c(v07, 3),
    tambien: [c(v21, 2)],
  },
  {
    termino: 'RPC',
    sinonimos: ['--mode rpc'],
    definicion:
      'El agente como proceso de larga vida que lee órdenes JSON por stdin y contesta por stdout; las respuestas se emparejan por id. Sirve para un editor o para un programa en otro lenguaje.',
    explica: c(v10, 6),
    primera: c(v05, 3),
    tambien: [c(v21, 5)],
  },
  {
    termino: 'SDK',
    sinonimos: ['createAgentSession'],
    definicion:
      'El agente como librería dentro de tu programa, sin otro proceso ni protocolo. El de Pi corre en Node o Bun; el de oh my pi, en Bun.',
    explica: c(v10, 7),
    tambien: [c(v21, 6)],
  },
  {
    termino: 'ACP',
    sinonimos: ['Agent Client Protocol'],
    definicion:
      'El protocolo que lleva oh my pi a un editor: el editor lanza omp acp como proceso hijo y pone la interfaz y su propia puerta de permisos.',
    explica: c(v21, 6),
  },

  // ── oh my pi ─────────────────────────────────────────────
  {
    termino: 'oh my pi',
    sinonimos: ['omp'],
    definicion:
      'Un fork de Pi sobre el mismo núcleo, con baterías incluidas: subagentes, modo plan, memoria entre sesiones, servidor de lenguaje, depurador, navegador e interfaz de git. Corre sobre Bun con partes en Rust.',
    explica: c(v11, 2),
    primera: c(v01, 4),
    tambien: [c(v11, 9)],
  },
  {
    termino: 'Herramientas descubribles',
    sinonimos: ['xd://', 'divulgación progresiva (Learn Harness Engineering)'],
    definicion:
      'En oh my pi, herramientas poco usadas que el modelo sabe que existen y cuya documentación solo lee cuando las necesita. Ahorran prefijo en cada petición.',
    explica: c(v22, 4),
    primera: c(v11, 6),
    tambien: [c(v22, 5)],
  },
  {
    termino: 'Rol',
    sinonimos: ['modelRoles', 'default, smol, slow…'],
    definicion:
      'En oh my pi, un nombre de trabajo (default, smol, slow, plan, task, advisor…) que apunta a un modelo. La pregunta deja de ser qué modelo tienes activo y pasa a ser qué modelo hace cada trabajo.',
    explica: c(v14, 1),
    primera: c(v01, 4),
    tambien: [c(v14, 2)],
  },
  {
    termino: 'Advisor',
    sinonimos: ['asesor', '/advisor', 'WATCHDOG.md'],
    definicion:
      'Un segundo modelo que lee cada turno del principal y, si ve algo, le inyecta una nota. Revisa y avisa; no aprueba ni cambia nada, y no es una frontera de seguridad.',
    explica: c(v14, 7),
    primera: c(v01, 4),
  },
  {
    termino: 'Prewalk',
    sinonimos: ['/prewalk'],
    definicion:
      'En oh my pi, un traspaso único entre modelos: el capaz explora, escribe la lista de tareas y hace la primera edición, y la sesión pasa al modelo del rol smol.',
    explica: c(v14, 6),
    primera: c(v14, 1),
  },
  {
    termino: 'Memoria entre sesiones',
    sinonimos: ['memory.backend', '/memory'],
    definicion:
      'En oh my pi, lo aprendido se guarda y se inyecta en sesiones futuras; viene apagada. Es una pista, no la verdad: si contradice al código, gana el código.',
    explica: c(v13, 8),
    primera: c(v01, 4),
  },
  {
    termino: 'Modo plan',
    sinonimos: ['/plan'],
    definicion:
      'El agente explora sin tocar el proyecto, escribe un plan y nada se ejecuta hasta que lo apruebas. Es una forma de trabajar, no un sandbox.',
    explica: c(v15, 2),
    primera: c(v01, 4),
  },
  {
    termino: 'Objetivo con presupuesto',
    sinonimos: ['/goal', '/guided-goal', 'modo goal'],
    definicion:
      'Un objetivo persistente: oh my pi le pide al agente que siga hasta que el propio modelo lo da por cumplido, con un tope de tokens. Pon el presupuesto antes de empezar.',
    explica: c(v15, 4),
  },
  {
    termino: 'Bucle',
    sinonimos: ['/loop'],
    definicion:
      'Repetir el trabajo hasta una condición de parada; necesita un objetivo, una forma de verificarlo y esa condición. En oh my pi, /loop reenvía tu mensaje en cada vuelta hasta un número de vueltas, una duración o una condición (--until, --while).',
    explica: c(v15, 7),
    tambien: [c(v25, 2), c(v25, 3)],
  },
  {
    termino: 'Subagente',
    sinonimos: ['task', 'sesión hija'],
    definicion:
      'Una sesión hija con su propio modelo, herramientas e instrucciones, que lanza la herramienta task. No hereda la conversación: cada encargo tiene que explicarse solo.',
    explica: c(v16, 2),
    primera: c(v01, 4),
    tambien: [c(v16, 3)],
  },
  {
    termino: 'Agent Hub',
    definicion:
      'El panel de oh my pi (Alt+A) que enseña qué agentes trabajan ahora, con coste, tokens, rol y modelo, y te deja abrir la conversación de cada uno. No es /agents, que enseña cómo están configurados.',
    explica: c(v16, 4),
    tambien: [c(v16, 3)],
  },
  {
    termino: 'Servidor de lenguaje',
    sinonimos: ['LSP'],
    definicion:
      'El programa que usa tu editor para entender el código: distingue definición, referencia y texto. oh my pi lo usa para buscar y renombrar con precisión.',
    explica: c(v17, 4),
    primera: c(v01, 4),
  },
  {
    termino: 'Hashline',
    sinonimos: ['edición anclada por hash'],
    definicion:
      'El modo de edición por defecto de oh my pi: read etiqueta cada lectura y el modelo edita citando la etiqueta y los números de línea; si el fichero cambió, no se aplica a ciegas. Algunos modelos, como DeepSeek, usan en su lugar el modo replace.',
    explica: c(v17, 5),
    primera: c(v01, 4),
  },
  {
    termino: 'Worktree',
    sinonimos: ['/wt', '/worktree'],
    definicion:
      'Una segunda carpeta de trabajo del mismo repositorio, con otra rama, para que dos agentes trabajen en paralelo sin pisarse. En oh my pi, /wt la crea y se lleva allí la sesión.',
    explica: c(v18, 6),
    primera: c(v01, 5),
  },
  {
    termino: 'Auto-QA',
    sinonimos: ['omp grievances'],
    definicion:
      'No es QA de tu código: es un buzón donde el modelo deja quejas sobre las herramientas de oh my pi. Si das tu consentimiento, cada queja se envía a un servidor de omp.',
    explica: c(v18, 7),
    tambien: [c(v24, 8)],
  },
  {
    termino: 'TTSR',
    sinonimos: ['time traveling stream rules', '/omfg'],
    definicion:
      'Reglas de oh my pi que vigilan la respuesta mientras el modelo escribe: si aparece el patrón, cortan antes de ejecutar la herramienta, inyectan la regla y piden reintentar. /omfg escribe una a partir de tu queja.',
    explica: c(v19, 6),
    primera: c(v01, 4),
    tambien: [c(v19, 7)],
  },

  // ── Diseñar tu harness ───────────────────────────────────
  {
    termino: 'Impuesto de las herramientas',
    sinonimos: ['prefijo'],
    definicion:
      'Lo que cobra cada herramienta declarada: el prefijo (su esquema viaja en cada petición), la elección (una opción más entre las que el modelo duda) y el estilo (cambia cómo trabaja).',
    explica: c(v22, 4),
    primera: c(v01, 5),
    tambien: [c(v22, 5)],
  },
  {
    termino: 'Roster',
    definicion:
      'El conjunto de herramientas activas en una ejecución. Se decide al empezar, porque las herramientas van al principio de cada petición, y se mide.',
    explica: c(v22, 4),
    tambien: [c(v22, 6)],
  },
  {
    termino: 'Repositorio como sistema de registro',
    definicion:
      'El repo es el sitio donde vive, con autoridad, el estado del trabajo: qué hay que hacer, en qué punto estás, cómo se arranca y se comprueba. Lo que no está en el repositorio no existe para el agente.',
    explica: c(v23, 1),
    primera: c(v01, 4),
  },
  {
    termino: 'Lista de funcionalidades',
    sinonimos: ['funcionalidades.json'],
    definicion:
      'Un fichero JSON con una entrada por funcionalidad: comportamiento, verificación y estado (sin empezar, en curso, bloqueada o pasa). Solo pasa a «pasa» cuando la verificación se ha ejecutado y la evidencia está anotada.',
    explica: c(v23, 4),
  },
  {
    termino: 'Estado limpio',
    definicion:
      'Cómo queda el repositorio al final de cada sesión: el arranque y la verificación siguen funcionando, el progreso está apuntado y la siguiente sesión puede seguir sin arreglos manuales.',
    explica: c(v23, 3),
  },
  {
    termino: 'Definición de hecho',
    sinonimos: ['qué es terminado'],
    definicion:
      'Lo que tiene que cumplirse para dar una tarea por terminada, escrito antes del trabajo; en AGENTS.md es lo que más rinde. Si el agente escribe y ejecuta sus propias pruebas, comprueba lo que él cree, no lo que tú querías.',
    explica: c(v06, 2),
    tambien: [c(v24, 2)],
  },
  {
    termino: 'Rúbrica',
    definicion:
      'Una lista de criterios puntuados, escrita antes del trabajo, para que dos evaluadores lleguen a lo mismo. La escribes tú u otro agente, y quien hace el trabajo no la toca.',
    explica: c(v24, 2),
    primera: c(v01, 1),
    tambien: [c(v24, 3)],
  },
  {
    termino: 'Puerta',
    definicion:
      'Una comprobación que impone el harness en lugar de pedirla al agente. En el curso, una extensión sobre tool_call que solo deja marcar una funcionalidad como «pasa» si la verificación sale con 0.',
    explica: c(v24, 5),
    primera: c(v24, 1),
    tambien: [c(v24, 6)],
  },
  {
    termino: 'Grafo',
    definicion:
      'La orquestación decidida por adelantado: nodos (un script, una llamada al modelo o un agente), aristas y un estado compartido. Veinte pasos en fila no son un grafo: son un script.',
    explica: c(v25, 4),
  },
  {
    termino: 'Ley de Goodhart',
    definicion:
      'Cuando una medida se convierte en objetivo, deja de ser una buena medida. Un bucle que solo quiere que la verificación salga con 0 encontrará la forma de conseguirlo.',
    explica: c(v25, 8),
  },
  {
    termino: 'Ancla',
    sinonimos: ['prueba ancla'],
    definicion:
      'Una prueba que vive fuera del repositorio, con datos calculados a mano, y que ningún agente ve. Detecta lo que la verificación visible deja pasar.',
    explica: c(v25, 8),
  },
  {
    termino: 'Banco de pruebas',
    sinonimos: ['benchmark'],
    definicion:
      'Tareas con un resultado comprobable y un juez que el agente no ve, para contar cuántas resuelve. Responde a «¿funciona?». El orquestar.sh del vídeo 25 era un banco de una sola tarea.',
    explica: c(v27, 2),
  },
  {
    termino: 'Caso de regresión',
    definicion:
      'Un fallo real del agente convertido en una prueba que se vuelve a ejecutar cada vez que cambias algo: estado de partida, orden exacta y comprobaciones que fallan con lo malo y pasan con lo bueno. Responde a «¿funciona como lo diseñamos?».',
    explica: c(v27, 5),
    primera: c(v27, 2),
    tambien: [c(v27, 7)],
  },
  {
    termino: 'Pasó alguna vez, pasó todas',
    sinonimos: ['pass@k', 'pass^k'],
    definicion:
      'Las dos cifras de repetir una tarea varias veces. «Pasó al menos una vez» mide capacidad; «pasó todas», fiabilidad. Para un agente que trabaja sin ti importa la segunda.',
    explica: c(v27, 2),
    tambien: [c(v27, 6)],
  },
  {
    termino: 'Fallo de infraestructura',
    definicion:
      'Una ejecución que falla porque el proveedor no responde o falta la clave, no por el agente. Se cuenta aparte y fuera de la media.',
    explica: c(v27, 2),
    tambien: [c(v27, 6)],
  },
  {
    termino: 'Manifiesto',
    definicion:
      'Lo que la sesión no guarda y deja al lado quien lanza al agente: commit de partida, orden y opciones, modelo, versión del harness y fecha. Sin él, una ejecución no se repite en las mismas condiciones.',
    explica: c(v27, 3),
  },
  {
    termino: 'Minar trazas',
    sinonimos: ['firma'],
    definicion:
      'Buscar entre las sesiones grabadas las que acabaron en error, las más caras y las que chocaron con los permisos, y agruparlas por firma: herramienta, primera línea del error y modelo. Solo encuentra los fallos que hacen ruido.',
    explica: c(v27, 4),
  },
  {
    termino: 'Juez',
    definicion:
      'Un modelo que decide lo que un programa no puede, por ejemplo si un texto señala un problema. Se calibra antes con un ejemplo bueno y uno malo, y revisa una verificación: no la sustituye.',
    explica: c(v27, 5),
  },
  {
    termino: 'Encargo desatendido',
    definicion:
      'Un agente que trabaja sin nadie delante y deja una rama y una petición de cambios. Tiene seis piezas: disparador, lanzador, agente aislado y con límites, juez, entrega y registro.',
    explica: c(v28, 2),
    primera: c(v28, 1),
    tambien: [c(v28, 8)],
  },
  {
    termino: 'Lanzador',
    definicion:
      'El script tuyo que valida el encargo, prepara un worktree, arranca al agente con sus topes, lo juzga desde fuera y entrega la rama. El agente nunca entrega su propio trabajo.',
    explica: c(v28, 2),
    tambien: [c(v28, 6)],
  },
  {
    termino: 'Webhook',
    definicion:
      'Una dirección a la que otro sistema manda una petición para disparar algo. El del curso exige un token, solo acepta un identificador de ticket (nunca texto libre), contesta enseguida y lanza el trabajo en segundo plano.',
    explica: c(v28, 3),
    tambien: [c(v28, 7)],
  },
  {
    termino: 'Idempotencia',
    definicion:
      'Que repetir la misma petición no repita el trabajo. Si el ticket ya tiene una rama del robot, el webhook contesta conflicto en lugar de lanzar otro encargo pagado.',
    explica: c(v28, 3),
    tambien: [c(v28, 7)],
  },
  {
    termino: 'Lista blanca',
    sinonimos: ['allowlist'],
    definicion:
      'Solo se permite lo que está en la lista; lo demás se rechaza. En el perfil robot, unos pocos patrones de bash (pruebas, verificación y git que lee o commitea). Lo contrario de una lista negra, que solo prohíbe lo que nombra.',
    explica: c(v28, 4),
  },
  {
    termino: 'Carpeta restringida',
    definicion:
      'Una carpeta de tools.restrictedFolders en oh my pi: cualquier acción dentro pide permiso en cualquier modo, y sin interfaz se rechaza. Para bash cuenta dónde se ejecuta la orden, no los ficheros que nombra.',
    explica: c(v28, 4),
  },
  {
    termino: 'Tope de coste',
    sinonimos: ['--max-cost'],
    definicion:
      'Un límite de gasto que actúa solo. En oh my pi, --max-cost para la sesión al pasarlo (sale con 3); se comprueba al terminar cada respuesta, así que la última se paga entera. En Pi, una extensión como tope.ts.',
    explica: c(v28, 6),
  },
  {
    termino: 'Coste por entrega útil',
    definicion:
      'Lo que cuesta cada rama que pasa el juez, contando las ejecuciones que no entregaron nada. Si solo una de cada tres pasa, cada entrega cuesta tres.',
    explica: c(v28, 6),
  },
];
