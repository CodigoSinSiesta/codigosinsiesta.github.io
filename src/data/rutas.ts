import { RUTA_CORTA_PI, type RutaCorta } from './ruta-corta-pi-oh-my-pi';

export type TipoPaso = 'guia' | 'ensayo' | 'deck' | 'taller';

export interface PasoManual {
  tipo: TipoPaso;
  titulo: string;
  href: string;
  meta?: string;
}

// Un paso que reutiliza una guía de otra ruta (id de la colección `guias`):
// título, enlace, duración y progreso salen de la propia guía.
export interface PasoGuia {
  guia: string;
}

export type Paso = PasoManual | PasoGuia;

// «Por qué esta ruta»: el argumento de fondo, antes del contrato.
export interface PorQue {
  titulo: string;
  intro: string;
  puntos: { titulo: string; texto: string }[];
}

// Cómo se llama un mismo concepto en el agente de la ruta y en otros.
export interface Equivalencia {
  concepto: string;
  aqui: string;
  otros: string;
}

// Un tramo del recorrido: de qué a qué vídeos y qué se consigue.
export interface Etapa {
  titulo: string;
  videos: string;
  descripcion: string;
  // Lecturas y presentaciones para ampliar lo de la etapa.
  profundizar?: PasoManual[];
}

export interface Ruta {
  slug: string;
  titulo: string;
  claim: string;
  descripcion: string;
  nivel: 'inicial' | 'intermedio' | 'avanzado';
  duracion: string;
  // Fuera del listado: su página y sus guías siguen publicadas, pero no se enlazan.
  oculta?: boolean;
  // Contrato de la ruta (portada): para quién es, qué te llevas y qué no cubre.
  paraQuien?: string;
  aprenderas?: string[];
  requisitos?: string[];
  noIncluye?: string[];
  porQue?: PorQue;
  equivalencias?: Equivalencia[];
  equivalenciasNota?: string;
  etapas?: Etapa[];
  // Páginas de apoyo que se enlazan desde la portada de la ruta.
  glosario?: string; // href del glosario del curso
  rutaCorta?: RutaCorta; // selección para quien tiene poco tiempo
  materiales?: { problemas: string; preguntas: string }; // problemas frecuentes y dudas, en el repo de materiales
  // Las rutas con guías propias (colección `guias`) dejan pasos vacío:
  // la página los genera desde la colección.
  pasos: Paso[];
}

export const RUTAS: Ruta[] = [
  {
    slug: 'ia-desde-cero',
    titulo: 'IA desde cero',
    claim: 'Programar con agentes, paso a paso',
    descripcion:
      'La puerta de entrada si nunca has trabajado con IA. Qué es un modelo de lenguaje, cómo actúa un agente de programación y cómo trabajar con él sin riesgo: todo se practica con OpenCode y modelos gratuitos, dentro de un laboratorio aislado de tu ordenador.',
    nivel: 'inicial',
    duracion: '~3 horas',
    paraQuien:
      'Personas que saben programar pero no han usado nunca la IA para hacerlo: ni un chat ni un agente.',
    aprenderas: [
      'Qué es un modelo de lenguaje, por qué no responde siempre lo mismo y por qué se equivoca con seguridad',
      'Montar un laboratorio aislado y usar en él OpenCode con modelos gratuitos',
      'Entender la ventana de contexto, el bucle del agente y sus herramientas',
      'Pedir bien, revisar lo que hace y verificar con pruebas',
    ],
    requisitos: [
      'Saber programar y moverte por la terminal',
      'Docker Desktop en tu ordenador, o una cuenta de GitHub para usar Codespaces',
      'No hace falta haber usado antes ninguna IA',
    ],
    noIncluye: [
      'Construir tu propio agente ni entrenar modelos',
      'El detalle de un agente por dentro: eso es el curso de Pi y oh my pi',
    ],
    pasos: [],
  },
  {
    slug: 'agentes-ia',
    titulo: 'Agentes de IA desde cero',
    claim: 'De cero a tu primer agente en producción',
    descripcion:
      'Seis módulos progresivos: fundamentos, TypeScript para agentes, conceptos clave (contexto, tools, memoria), agentes avanzados, MCP servers y paso a producción. Cada módulo con ejercicios y proyecto.',
    nivel: 'inicial',
    duracion: '~15 horas',
    // En revisión: se reescribirá con el formato del resto de cursos.
    oculta: true,
    paraQuien: 'Developers que saben programar y quieren construir agentes de IA sin haber tocado LLMs antes.',
    aprenderas: [
      'Construir un agente de IA en TypeScript desde cero',
      'Diseñar tools, memoria y manejo de contexto',
      'Crear tu propio MCP Server reutilizable',
      'Llevar un agente a producción con testing, seguridad y observabilidad',
    ],
    requisitos: [
      'JavaScript a nivel intermedio (funciones, async/await, módulos)',
      'Node.js instalado y soltura con la terminal',
      'No hace falta experiencia previa con IA ni con LLMs',
    ],
    noIncluye: [
      'Entrenar o hacer fine-tuning de modelos',
      'Matemáticas de machine learning',
      'Frontend o interfaces de usuario',
    ],
    pasos: [],
  },
  {
    slug: 'pi-oh-my-pi',
    titulo: 'Pi y oh my pi',
    claim: 'Aprende un agente por dentro y sabrás usar cualquiera',
    descripcion:
      'Un curso en vídeo para dejar de usar tu agente de programación como una caja negra. Empezamos por Pi, el más pequeño y transparente, vemos qué añade un agente completo como oh my pi y terminamos diseñando tu propio harness. Lo que aprendes sirve igual en Claude Code, Codex u opencode. Son 26 vídeos, con sus guías y sus materiales.',
    nivel: 'intermedio',
    duracion: '~10 horas',
    paraQuien:
      'Developers que ya usan Claude Code, Codex, opencode u otro agente y quieren entender qué recibe el modelo, qué puede hacer y cómo gobernarlo, en lugar de depender de lo que cada herramienta decide por ti.',
    porQue: {
      titulo: 'Por qué empezar por Pi',
      intro:
        'Los agentes de programación cambian cada pocos meses; sus piezas, casi nunca. Todos son un modelo dentro de un bucle, con herramientas, contexto, sesiones y permisos. Pi deja esas piezas a la vista, y esa es la forma más rápida de entenderlas bien.',
      puntos: [
        {
          titulo: 'Es pequeño y transparente',
          texto:
            'Pi trae cuatro herramientas y deja casi todo en tus manos. No hay capas que lo oculten: ves qué recibe el modelo en cada turno, cuánto cuesta y dónde se guarda la sesión.',
        },
        {
          titulo: 'Lo que aprendes se traslada',
          texto:
            'El bucle, el contexto, las sesiones, los permisos, MCP o los subagentes son los mismos conceptos en cualquier agente. Cambian los nombres y los comandos; el modelo mental, no.',
        },
        {
          titulo: 'Acabas con tu propio harness',
          texto:
            'Cuando sabes qué hace cada pieza, eliges las que necesitas, quitas las que sobran y diseñas el entorno de tu equipo en lugar de heredar el de otra persona.',
        },
      ],
    },
    equivalencias: [
      { concepto: 'Instrucciones del proyecto', aqui: 'AGENTS.md', otros: 'Codex y opencode leen AGENTS.md; Claude Code usa CLAUDE.md' },
      { concepto: 'Herramientas externas', aqui: 'Servidores MCP y codemode', otros: 'Claude Code, Codex y opencode también conectan servidores MCP' },
      { concepto: 'Sesiones y contexto', aqui: 'La sesión como árbol, compactación, /tree y /fork', otros: 'Todos guardan y retoman sesiones, y compactan el contexto cuando se llena' },
      { concepto: 'Modo sin interfaz', aqui: 'pi -p y omp -p (con salida JSON)', otros: 'claude -p, codex exec, opencode run' },
      { concepto: 'Permisos y aislamiento', aqui: 'Pi: ni aprobaciones ni sandbox, los pones tú. oh my pi: modos de aprobación, pero arranca en yolo', otros: 'Cada agente trae los suyos: permisos, modos de aprobación o sandbox' },
      { concepto: 'Extender y automatizar', aqui: 'Extensiones, skills y paquetes', otros: 'Hooks, plugins, skills o comandos propios, según el agente' },
      { concepto: 'Modelos por tarea', aqui: 'oh my pi: roles (barato o potente) y niveles de razonamiento', otros: 'Varios agentes dejan elegir modelo por subagente o por tarea' },
      { concepto: 'Planificar antes de ejecutar', aqui: 'oh my pi: modo plan y objetivos con presupuesto', otros: 'Claude Code tiene modo plan; en cualquier agente, un plan escrito en el repo' },
      { concepto: 'Subagentes y paralelo', aqui: 'oh my pi: tareas, Hub y segundo plano', otros: 'Varios agentes ofrecen subagentes o tareas en paralelo' },
    ],
    equivalenciasNota:
      'Los nombres y los comandos cambian entre versiones: consúltalos en la documentación de cada agente. Lo que perdura es el concepto.',
    etapas: [
      {
        titulo: 'Entender lo mínimo',
        videos: 'Vídeos 01 a 04',
        descripcion: 'Qué es un harness, cómo trabaja un agente por dentro y qué modelo hay detrás.',
        profundizar: [
          { tipo: 'ensayo', titulo: 'Del vibe coding al agentic engineering', href: '/ensayos/del-vibe-coding-al-agentic-engineering', meta: 'el mapa completo en tres capas' },
          { tipo: 'ensayo', titulo: 'Harness engineering: vale más que el modelo', href: '/ensayos/harness-engineering-vale-mas-que-el-modelo', meta: 'por qué el contexto que montas importa más que el LLM' },
          { tipo: 'deck', titulo: 'Harness Engineering', href: '/harness-engineering-presentation/', meta: 'presentación' },
        ],
      },
      { titulo: 'Ponerle límites y hacerlo tuyo', videos: 'Vídeos 05 a 07', descripcion: 'Seguridad y aislamiento, instrucciones del proyecto, skills y MCP.' },
      { titulo: 'Extenderlo y automatizarlo', videos: 'Vídeos 08 a 10', descripcion: 'Extensiones, paquetes y uso programático en scripts y CI.' },
      {
        titulo: 'Ver lo que añade un agente completo',
        videos: 'Vídeos 11 a 21',
        descripcion: 'oh my pi: aprobaciones, planificación, subagentes, IDE integrado… y lo que cuesta cada capa.',
        profundizar: [
          { tipo: 'deck', titulo: 'Spec-Driven Development', href: '/spec-driven-development-presentation/', meta: 'presentación · con el vídeo 15' },
          { tipo: 'deck', titulo: 'Subagents & Skills', href: '/subagents-skills-presentation/', meta: 'presentación · con el vídeo 16' },
          { tipo: 'ensayo', titulo: 'La escalera de confianza', href: '/ensayos/la-escalera-de-confianza', meta: 'cuánta autonomía dar al agente · con el vídeo 19' },
        ],
      },
      {
        titulo: 'Diseñar tu propio harness',
        videos: 'Vídeos 22 a 26',
        descripcion: 'Metodología: diseño, estado en el repositorio, verificación y orquestación, hasta un proyecto final.',
        profundizar: [
          { tipo: 'ensayo', titulo: 'Diez niveles de complejidad de agentes IA', href: '/ensayos/diez-niveles-complejidad-agentes-ia', meta: 'sitúa tu sistema en la escala · con el vídeo 22' },
          { tipo: 'ensayo', titulo: 'El patrón correcto para cada problema', href: '/ensayos/patron-correcto-para-cada-problema', meta: 'workflows, agentes u orquestación · con el vídeo 25' },
          { tipo: 'deck', titulo: 'Patrones de orquestación', href: '/orquestacion-patrones-presentation/', meta: 'presentación · con el vídeo 25' },
          { tipo: 'ensayo', titulo: 'Cuatro fuentes, mismos principios', href: '/ensayos/cuatro-fuentes-mismos-principios', meta: 'la convergencia de la industria · para cerrar' },
        ],
      },
    ],
    aprenderas: [
      'Leer cualquier agente de programación: qué recibe el modelo, qué herramientas tiene y cómo se gobierna',
      'Aislar y limitar a un agente que no pide permiso: contenedores, confianza de proyecto y aprobaciones',
      'Darle contexto y capacidades con AGENTS.md, skills, MCP y extensiones',
      'Decidir qué piezas necesitas y diseñar el harness de tu equipo',
    ],
    requisitos: [
      'Soltura con la terminal, Git y Node.js',
      'Haber usado algún agente de programación (Claude Code, Codex, opencode, Copilot CLI…)',
      'Una cuenta en un proveedor de modelos (las demos usan OpenRouter y DeepSeek)',
    ],
    noIncluye: [
      'Un manual de Claude Code, Codex u opencode: usamos Pi para entender los conceptos y te señalamos dónde reaparecen',
      'Entrenar o ajustar modelos',
    ],
    glosario: '/rutas/pi-oh-my-pi/glosario',
    rutaCorta: RUTA_CORTA_PI,
    materiales: {
      problemas: 'https://github.com/CodigoSinSiesta/curso-pi-materiales/blob/main/PROBLEMAS.md',
      preguntas: 'https://github.com/CodigoSinSiesta/curso-pi-materiales/issues/new/choose',
    },
    pasos: [],
  },
];
