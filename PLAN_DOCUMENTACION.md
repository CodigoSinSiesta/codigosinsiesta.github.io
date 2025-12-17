# Plan de Documentación - Código Sin Siesta

## Objetivo
Consolidar toda la documentación en codigosinsiesta.github.io como hub central con 3 pilares:
1. Tutoriales sobre proyectos (Taller IA/Agentes/MCP, AI Presentation)
2. Guías técnicas sobre herramientas interesantes (LazyVim, Tmux, etc.)
3. Guides de arquitectura enfocado para IA

## Estructura de Documentación

```
docs/
├── _category_.json
├── intro.md                              # Introducción general
├── proyectos/
│   ├── _category_.json
│   ├── taller-ia-agentes-mcp/
│   │   ├── _category_.json
│   │   ├── intro.md
│   │   ├── setup.md
│   │   ├── agente-tareas.md
│   │   ├── agente-investigador.md
│   │   ├── mcp-servers.md
│   │   └── ejercicios.md
│   └── ai-presentation/
│       ├── _category_.json
│       ├── intro.md
│       ├── 4r-framework.md
│       ├── vibe-coding-vs-engineering.md
│       └── best-practices.md
├── herramientas/
│   ├── _category_.json
│   ├── lazyvim.md
│   ├── tmux.md
│   ├── zellij.md
│   └── dev-tools.md
└── arquitectura-ia/
    ├── _category_.json
    ├── patrones.md
    ├── design-decisions.md
    ├── testing-strategies.md
    └── security-patterns.md
```

## Estado del Plan

- [ ] Crear estructura base de directorios
- [ ] Crear página intro.md
- [ ] Migrar tutoriales del taller-ia-agentes-mcp
- [ ] Migrar tutoriales de ai-presentation
- [ ] Crear guías de herramientas
- [ ] Crear guides de arquitectura para IA
- [ ] Actualizar sidebars.js
- [ ] Verificar build y links

## Notas
- Opción B: Hub centralizado en codigosinsiesta.github.io
- Email actualizado a: llamamealex@gmail.com
- Contenido default de Docusaurus eliminado
