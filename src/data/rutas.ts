export type TipoPaso = 'guia' | 'ensayo' | 'deck' | 'taller';

export interface Paso {
  tipo: TipoPaso;
  titulo: string;
  href: string;
  meta?: string;
}

export interface Ruta {
  slug: string;
  titulo: string;
  claim: string;
  descripcion: string;
  nivel: 'inicial' | 'intermedio' | 'avanzado';
  duracion: string;
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
];
