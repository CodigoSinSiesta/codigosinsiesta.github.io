export type TipoPaso = 'guia' | 'ensayo' | 'deck' | 'taller';

export interface Paso {
  tipo: TipoPaso;
  titulo: string;
  href: string;
  meta?: string;
}

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
}

export interface Ruta {
  slug: string;
  titulo: string;
  claim: string;
  descripcion: string;
  nivel: 'inicial' | 'intermedio' | 'avanzado';
  duracion: string;
  // Contrato de la ruta (portada): para quién es, qué te llevas y qué no cubre.
  paraQuien?: string;
  aprenderas?: string[];
  requisitos?: string[];
  noIncluye?: string[];
  porQue?: PorQue;
  equivalencias?: Equivalencia[];
  equivalenciasNota?: string;
  etapas?: Etapa[];
  // Las rutas con guías propias (colección `guias`) dejan pasos vacío:
  // la página los genera desde la colección.
  pasos: Paso[];
}

export const RUTAS: Ruta[] = [
  {
    slug: 'agentes-ia',
    titulo: 'Agentes de IA desde cero',
    claim: 'De cero a tu primer agente en producción',
    descripcion:
      'Seis módulos progresivos: fundamentos, TypeScript para agentes, conceptos clave (contexto, tools, memoria), agentes avanzados, MCP servers y paso a producción. Cada módulo con ejercicios y proyecto.',
    nivel: 'inicial',
    duracion: '~15 horas',
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
    slug: 'agentic-engineering',
    titulo: 'Agentic engineering',
    claim: 'Preservar el techo de calidad cuando delegas a agentes',
    descripcion:
      'La ruta para ingenieros que ya usan IA a diario: del vibe coding al agentic engineering, harness engineering, patrones de orquestación y spec-driven development. Ensayos + decks + talleres.',
    nivel: 'intermedio',
    duracion: '~10 horas',
    paraQuien: 'Ingenieros que ya programan con IA a diario y quieren no perder calidad al delegar en agentes.',
    aprenderas: [
      'Distinguir vibe coding de agentic engineering',
      'Montar el harness (el contexto) que sostiene la calidad al delegar',
      'Elegir el patrón correcto: workflow, agente u orquestación',
      'Aplicar spec-driven development trabajando con agentes',
    ],
    requisitos: [
      'Usar ya IA a diario para programar (Claude Code, Cursor, etc.)',
      'Experiencia como desarrollador/a — no es una ruta de iniciación',
    ],
    noIncluye: [
      'Fundamentos de programación o de IA desde cero',
      'Tutoriales paso a paso de una herramienta concreta',
    ],
    pasos: [
      {
        tipo: 'ensayo',
        titulo: 'Del vibe coding al agentic engineering',
        href: '/ensayos/del-vibe-coding-al-agentic-engineering',
        meta: 'el mapa completo en tres capas',
      },
      {
        tipo: 'ensayo',
        titulo: 'Harness engineering: vale más que el modelo',
        href: '/ensayos/harness-engineering-vale-mas-que-el-modelo',
        meta: 'por qué el contexto que montas importa más que el LLM',
      },
      {
        tipo: 'deck',
        titulo: 'Deck · Harness Engineering',
        href: '/harness-engineering-presentation/',
        meta: 'presentación completa',
      },
      {
        tipo: 'ensayo',
        titulo: 'Diez niveles de complejidad de agentes IA',
        href: '/ensayos/diez-niveles-complejidad-agentes-ia',
        meta: 'sitúa tu sistema en la escala',
      },
      {
        tipo: 'ensayo',
        titulo: 'El patrón correcto para cada problema',
        href: '/ensayos/patron-correcto-para-cada-problema',
        meta: 'workflows vs agentes vs orquestación',
      },
      {
        tipo: 'deck',
        titulo: 'Deck · Patrones de orquestación',
        href: '/orquestacion-patrones-presentation/',
        meta: 'presentación completa',
      },
      {
        tipo: 'deck',
        titulo: 'Deck · Subagents & Skills',
        href: '/subagents-skills-presentation/',
        meta: 'presentación completa',
      },
      {
        tipo: 'deck',
        titulo: 'Deck · Spec-Driven Development',
        href: '/spec-driven-development-presentation/',
        meta: 'presentación completa',
      },
      {
        tipo: 'taller',
        titulo: 'Taller · OpenCode',
        href: 'https://github.com/CodigoSinSiesta/taller-opencode-starter',
        meta: 'hands-on con starter repo',
      },
      {
        tipo: 'ensayo',
        titulo: 'Cuatro fuentes, mismos principios',
        href: '/ensayos/cuatro-fuentes-mismos-principios',
        meta: 'cierre: la convergencia de la industria',
      },
    ],
  },
  {
    slug: 'pi-oh-my-pi',
    titulo: 'Pi y oh my pi',
    claim: 'Aprende un agente por dentro y sabrás usar cualquiera',
    descripcion:
      'Un curso en vídeo para dejar de usar tu agente de programación como una caja negra. Empezamos por Pi, el más pequeño y transparente, vemos qué añade un agente completo como oh my pi y terminamos diseñando tu propio harness. Lo que aprendes sirve igual en Claude Code, Codex u opencode. En publicación: 23 de 26 vídeos.',
    nivel: 'intermedio',
    duracion: '~9 horas hasta ahora',
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
      { concepto: 'Modo sin interfaz', aqui: 'pi -p', otros: 'claude -p, codex exec, opencode run' },
      { concepto: 'Permisos y aislamiento', aqui: 'Sin aprobaciones ni sandbox: los pones tú', otros: 'Cada agente trae los suyos: permisos, modos de aprobación o sandbox' },
      { concepto: 'Extender y automatizar', aqui: 'Extensiones, skills y paquetes', otros: 'Hooks, plugins, skills o comandos propios, según el agente' },
      { concepto: 'Subagentes y paralelo', aqui: 'oh my pi: tareas, Hub y segundo plano', otros: 'Varios agentes ofrecen subagentes o tareas en paralelo' },
    ],
    equivalenciasNota:
      'Los nombres y los comandos cambian entre versiones: consúltalos en la documentación de cada agente. Lo que perdura es el concepto.',
    etapas: [
      { titulo: 'Entender lo mínimo', videos: 'Vídeos 01 a 04', descripcion: 'Qué es un harness, cómo trabaja un agente por dentro y qué modelo hay detrás.' },
      { titulo: 'Ponerle límites y hacerlo tuyo', videos: 'Vídeos 05 a 07', descripcion: 'Seguridad y aislamiento, instrucciones del proyecto, skills y MCP.' },
      { titulo: 'Extenderlo y automatizarlo', videos: 'Vídeos 08 a 10', descripcion: 'Extensiones, paquetes y uso programático en scripts y CI.' },
      { titulo: 'Ver lo que añade un agente completo', videos: 'Vídeos 11 a 21', descripcion: 'oh my pi: aprobaciones, planificación, subagentes, IDE integrado… y lo que cuesta cada capa.' },
      { titulo: 'Diseñar tu propio harness', videos: 'Vídeos 22 a 26', descripcion: 'Metodología: diseño, estado en el repositorio, verificación y orquestación, hasta un proyecto final.' },
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
      'Los vídeos 24 a 26 (en producción): verificación, orquestación y proyecto final',
    ],
    pasos: [],
  },
];
