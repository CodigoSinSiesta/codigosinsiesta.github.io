export interface Taller {
  slug: string;
  titulo: string;
  descripcion: string;
  repo: string;
  deck?: string;
}

export const TALLERES: Taller[] = [
  {
    slug: 'ia-agentes-mcp',
    titulo: 'IA, Agentes y MCP',
    descripcion:
      'Construye un agente investigador y un agente de tareas desde cero con la API de Claude y servidores MCP. El taller fundacional de la comunidad.',
    repo: 'https://github.com/codigosinsiesta/codigosinsiesta.github.io/tree/main/taller-ia-agentes-mcp',
  },
  {
    slug: 'opencode',
    titulo: 'OpenCode',
    descripcion:
      'Agentic coding en la terminal: configura OpenCode, define agentes y reglas, y trabaja una feature real con TDD asistido por agentes.',
    repo: 'https://github.com/CodigoSinSiesta/taller-opencode-starter',
    deck: '/taller-opencode-presentation/',
  },
  {
    slug: 'graphify',
    titulo: 'Graphify',
    descripcion:
      'Convierte cualquier codebase en un grafo de conocimiento navegable: god nodes, detección de comunidades y queries sobre la arquitectura.',
    repo: 'https://github.com/CodigoSinSiesta/taller-graphify-starter',
    deck: '/taller-graphify-presentation/',
  },
  {
    slug: 'llm-wiki',
    titulo: 'LLM Wiki',
    descripcion:
      'Monta una wiki generada y mantenida por LLMs: pipelines de generación, validación de contenido y publicación automática.',
    repo: 'https://github.com/CodigoSinSiesta/taller-llm-wiki-starter',
    deck: '/taller-llm-wiki-presentation/',
  },
];
