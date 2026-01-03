// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Ruta de Aprendizaje IA Agents',
      items: [
        'ruta-aprendizaje-ia-agents/intro',
        'ruta-aprendizaje-ia-agents/01-fundamentos',
        'ruta-aprendizaje-ia-agents/02-typescript',
        'ruta-aprendizaje-ia-agents/03-conceptos',
        'ruta-aprendizaje-ia-agents/04-agentes-avanzados',
        'ruta-aprendizaje-ia-agents/05-mcp-servers',
        'ruta-aprendizaje-ia-agents/06-produccion',
      ],
    },
    {
      type: 'category',
      label: 'Proyectos',
      items: [
        {
          type: 'category',
          label: 'Taller IA, Agentes y MCP',
          items: [
            'proyectos/taller-ia-agentes-mcp/intro',
            'proyectos/taller-ia-agentes-mcp/setup',
            'proyectos/taller-ia-agentes-mcp/agente-tareas',
            'proyectos/taller-ia-agentes-mcp/agente-investigador',
            'proyectos/taller-ia-agentes-mcp/mcp-servers',
            'proyectos/taller-ia-agentes-mcp/ejercicios',
          ],
        },
        {
          type: 'category',
          label: 'AI Presentation: 4R Framework',
          items: [
            'proyectos/ai-presentation/intro',
            'proyectos/ai-presentation/vibe-coding-vs-engineering',
            'proyectos/ai-presentation/4r-framework',
            'proyectos/ai-presentation/best-practices',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Herramientas',
      items: [
        'herramientas/lazyvim',
        'herramientas/tmux',
        'herramientas/zellij',
        'herramientas/dev-tools',
      ],
    },
    {
      type: 'category',
      label: 'Arquitectura para IA',
      items: [
        'arquitectura-ia/patrones',
        'arquitectura-ia/design-decisions',
        'arquitectura-ia/testing-strategies',
        'arquitectura-ia/security-patterns',
      ],
    },
  ],
};

export default sidebars;
